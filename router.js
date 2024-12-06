import express from 'express';
const router = express.Router();
import productController from './controller.js'

router.get('/get', (req, res) => {
    res.send('welcome');

})
router.get('/products', productController.productDetails)

export default router;