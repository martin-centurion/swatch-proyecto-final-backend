import { Router } from 'express';
import ProductsController from '../../controllers/product.controller.js';
import ProductModel from '../../models/product.model.js';
import { authenticationMiddleware, authorizationMiddleware } from "../../utils.js";
import config from '../../config.js';

const router = Router();

router.get('/products', authenticationMiddleware('jwt'), async (req, res, next) => {
  try {
    const { page = 1, limit = 4, group, sort } = req.query;
    const opts = { page, limit, sort: { price: sort || 'asc' } };
    const criteria = {};
    const { first_name, last_name, role, cart } = req.user;
    console.log(
      first_name, last_name, role, cart
    );
    console.log('req.user', req.user);
    if (group) {
      criteria.category = group;
    };
    const product = await ProductModel.paginate(criteria, opts);
    console.log('cart id user', cart)
    res.render('products', buildResponse({ ...product, group, sort, first_name, last_name, role, cart }));
    //res.render('products', buildResponse({ ...product, group, sort, first_name, last_name, role, cart}));
    //res.status(200).json(buildResponse({ ...product, group, sort, first_name, last_name, role, cart  }))
    } catch (error) {
        next(error);
    }
});

router.get('/products/:pid', authenticationMiddleware('jwt'), async (req, res, next) => {
  try {
    const { params: { pid } } = req;
    const product = await ProductsController.getById(pid);
    if (!product) {
      return res.status(401).json({ message: `Producto con id:${pid} no encontrado.` });
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});

router.post('/register-product', authenticationMiddleware('jwt'), authorizationMiddleware(['admin', 'premium']), async (req, res, next) => {
  try {
    const { body, user } = req;
    if (req.user.role !== 'admin' && req.user.role !== 'premium') {
      return res.status(403).json({ message: 'No tienes permisos para crear productos' });
    }
    await ProductsController.create(body, user);
    res.status(201).json({ message: 'Producto creado correctamente.' });
  } catch (error) {
    req.logger.fatal('Ha ocurrido un error durante la creación del producto.', error);
    next(error);
  }
});

router.put('/products/:pid', authenticationMiddleware('jwt'), authorizationMiddleware('admin'), async (req, res, next) => {
  try {
    const { body, params: { pid } } = req;
    await ProductsController.updateById({ _id: pid }, { $set: body });
    res.status(204).end();
  } catch (error) {
    next(error)
  }
});

router.delete('/products/:pid', authenticationMiddleware('jwt'), authorizationMiddleware(['admin','premium']), async (req, res) => {
  try {
    const { params: { pid } } = req;
    if (req.user.role !== 'admin' && req.user.role !== 'premium') {
      return res.status(403).json({ message: 'No tiene permisos para eliminar productos' });
    } 
   const productToDelete= await ProductsController.getById(pid)
    if (req.user.role === 'premium' && productToDelete.owner !== req.user.email) {
        return res.status(403).json({ message: 'No tienes permisos para borrar productos que no hayas creado.' });
         } 
    await ProductsController.deleteById(pid);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const buildResponse = (data) => {
  return {
    status: 'success',
    payload: data.docs.map(product => product.toJSON()),
    totalPages: data.totalPages,
    prevPage: data.prevPage,
    nextPage: data.nextPage,
    page: data.page,
    userCart: data.cart,
    userName: data.first_name,
    userLastName: data.last_name,
    userRole: data.role,
    hasPrevPage: data.hasPrevPage,
    hasNextPage: data.hasNextPage,
    prevLink: data.hasPrevPage ? `http://localhost:${config.port}/products?limit=${data.limit}&page=${data.prevPage}${data.group ? `&group=${data.group}` : ''}${data.sort ? `&sort=${data.sort}` : ''}` : '',
    nextLink: data.hasNextPage ? `http://localhost:${config.port}/products?limit=${data.limit}&page=${data.nextPage}${data.group ? `&group=${data.group}` : ''}${data.sort ? `&sort=${data.sort}` : ''}` : '',
  }
}

export default router;