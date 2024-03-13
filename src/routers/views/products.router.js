import { Router } from 'express';
import ProductDao from '../../dao/product.dao.js';


const router = Router();

router.get('/products', async (req, res) => {
    let products = await ProductDao.get();
    res.render('products', { products: products.map(p => p.toJSON()), title: 'Productos' });
});

export default router;