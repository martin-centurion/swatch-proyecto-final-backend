import { Router } from 'express';
import CartManager from '../../dao/CartManager.js';

const router = Router();

router.get('/carts', async (req, res) => {
    const carts = await CartManager.get();
    res.render('carts',  { carts: carts.map(c => c.toJSON()), title: 'Carrito' });
});

export default router;