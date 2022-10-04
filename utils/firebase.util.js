const { initializeApp } = require('firebase/app');
const { getStorage } = require('firebase/storage');
const dotenv = require('dotenv')

// Model
const { ProductImg } = require('../models/productImg.model')

dotenv.config({ path: './config.env' })

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: "academlo-ecommerce.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Storage service
const storage = getStorage(firebaseApp)

const uploadProductImgs = async (imgs, productId) => {
  // Map async -> Async operations with arrays
const imgsPromises = imgs.map(async (img) => {
  // Create firebase reference
  const [originalName, ext] = img.originalname.split('.'); // -> [fileName, jpg]

  const filename = `products/${productId.id}/${originalName}-${Date.now()}.${ext}`;
  const imgRef = ref(storage, filename);

  // Upload image firebase
  const result = await uploadBytes(imgRef, img.buffer);

  await ProductImg.create({
    productId,
    imgUrl: result.metadata.fullPath,
  });
});

await Promise.all(imgsPromises);
};

const getProductImgsUrls = async products => {
// Loop through products to get to the productImgs
const productWithImgsPromises = products.map(async product => {
  // Get imgs URLs
  const productImgsPromises = product.productImgs.map(async productImg => {
    const imgRef = ref(storage, productImg.imgUrl);
    const imgUrl = await getDownloadURL(imgRef);

    productImg.imgUrl = imgUrl;
    return productImg;
  });

  // Resolve imgs urls
  const productImgs = await Promise.all(productImgsPromises);

  // Update old productImgs array with new array
  product.productImgs = productImgs;
  return product;
});

return await Promise.all(productWithImgsPromises);
};

module.exports = { storage, uploadProductImgs, getProductImgsUrls };
