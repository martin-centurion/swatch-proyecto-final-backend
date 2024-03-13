import CartModel from "../models/cart.model.js";
import ProductDao from './product.dao.js';

export default class CartDao {
    static async create(data) {
        return CartModel.create(data);
    }

    static get(criteria = {}) {
        return CartModel.find(criteria)
    } 

    static async getById(cid, populate = false) {
      try {
        const cart = await CartModel.findOne({ _id: cid });
        if (populate) {
          return await cart.populate("products.product");
        }
        return cart;
      } catch (error) {
        throw new Exception(`Cart with id "${cid}" not found`, 404);
      }
    }

    static async updateById(cid, products) {
        try {
          const result = await CartModel.updateOne({ _id: cid }, { products });
    
          if (result.matchedCount == 0) {
            throw new Error();
          }
    
          return await CartModel.findOne({ _id: cid });
        } catch (error) {
          throw new Exception(`Cart with id "${cid}" not found`);
        }
      }
    
    static deleteById(cartid) {
        return CartModel.deleteOne({ _id: cartid });
    }
    static async addProduct(cid, pid, quantity = null) {
        const cart = await CartDao.getById(cid);
        const validProduct = ProductDao.productExists(pid);
    
        if (validProduct) {
          const productIndex = cart.products.findIndex(
            (e) => e.product.toString() === pid
          );
    
          if (productIndex != -1) {
            quantity
              ? (cart.products[productIndex].quantity = quantity)
              : cart.products[productIndex].quantity++;
          } else {
            cart.products.push({
              product: pid,
              quantity: quantity ? quantity : 1,
            });
          }
    
          let result = await CartDao.updateById(cid, cart.products);
          return result;
        } else {
          throw new Exception(`Product with id "${pid}" doesn't exist.`, 404);
        }
      }
    
      /* static async deleteProductFromCart(cartId, productId) {
        const cart = await CartModel.findById(cartId);
        if (!cart) {
          throw new Exception('No existe ese Carrito', 404);
        }
    console.log('product', productId);
        const index = cart.products.findIndex((product) =>{  console.log('pr',product);
          return  product.product.equals(productId)
        });
        console.log('index', index);
        if (index === -1) {
          throw new Exception('No existe ese producto dentro del carrito');
        }
    
        cart.products.splice(index, 1);
        await cart.save();
      }
    
      static async updateById(cartId, data) {
        const criteria = { _id: cartId };
        const operation = { $set: data };
        return CartModel.updateOne(criteria, operation);
      } */

}