import CartDao from "../dao/cart.dao.js";
import { loggerDev } from "../config/logger.js";

export default class CartService {
    static get(filter = {}) {
        return CartDao.get(filter)
    }

    static async create(payload) {
        loggerDev.info('Creando un nuevo carrito.');
        const cart = await CartDao.create(payload);
        loggerDev.info('Se ha creado el carrito exitosamente');
        return cart;
    }

    static findById(cartid){
        loggerDev.info('CartDao', CartDao);
        return CartDao.getById(cartid);
    }

    static updateById(cartid, payload) {
        return CartDao.updateById(cartid, payload);
    }

    static deleteById(cartid) {
        return CartDao.deleteById(cartid);
    }

    static async addProductToCart(cid, pid) {
        return CartDao.addProduct(cid, pid);
      }
}