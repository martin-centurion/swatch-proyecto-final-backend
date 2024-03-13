import CartService from "../services/cart.service.js";
import ProductDao from "../dao/product.dao.js";
import TicketController from './ticket.controller.js';
import { Exception, getNewId } from "../utils.js";
import CartDao from "../dao/cart.dao.js";

export default class CartController {

    static create(data) {
        return CartService.create(data);
    }

    static async getCarts(query = {}) {
        const cart = await CartService.get(query);
        return cart;
    }

    static async findById(cartid){
        const cart = await CartService.findById(cartid);
        if(!cart) {
            throw new Exception('No existe el carrito', 404)
        }
        return cart;
    }

    static async updateById(cartid, data) {
        await CartController.getById(cartid);
        if(!cart) {
            throw new Exception('No existe el carrito.', 404);
        }
        await CartService.updateById(cartid, data);
        console.log('Carrito actualizado correctamente.');
    }

    static async deleteById(cartid) {
        await CartController.getById(cartid);
        if(!cart) {
            throw new Exception('No existe el carrito', 404)
        }
        console.log('Eliminando el carrito.');
        await CartService.deleteById(cartid);
        console.log('Carrito eliminado correctamente.');
    }

    static async deleteProductFromCart(){};

    static async addProductToCart(cid, pid) {
        await CartService.addProductToCart(cid, pid);
        console.log("El producto fue agregado correctamente");
    }

    static async purchaseCart(req, res) {
      try {
        const { cid } = req.params;
        const cart = await CartController.findById(cid, true);
        const failedProductIds = [];
        const purchasedProducts = [];
        let totalAmount = 0;
  
        for (const cartProduct of cart.products) {
          const product = await ProductDao.getById(cartProduct.product);
  
          if (product.stock >= cartProduct.quantity) {
            
            product.stock -= cartProduct.quantity;
            await product.save();
  
            purchasedProducts.push({
              product: cartProduct.product,
              quantity: cartProduct.quantity,
            });
  
            totalAmount += product.price * cartProduct.quantity;
          } else {
            // No hay suficiente stock, agregar a la lista de productos fallidos
            failedProductIds.push(cartProduct.product);
          }
        }
  
        // Actualizar el carrito con productos no comprados
        const remainingProducts = cart.products.filter(
          (cartProduct) => failedProductIds.includes(cartProduct.product.toString())
        );
  
        cart.products = remainingProducts;
        await cart.save();
  
        // Generar el ticket
        const ticket = await TicketController.createTicket({
          code: getNewId(),
          amount: totalAmount,
          purchaser: req.user.email,
        });
         
        const productsNotBuyed = [];
            for (const productId of failedProductIds) {
                const productNotBuyed = await ProductDao.getById(productId);
                productsNotBuyed.push(productNotBuyed);
            }
    
            console.log('productsNotBuyed', productsNotBuyed);
    const prod = JSON.parse(JSON.stringify(productsNotBuyed))
            const ticketData = JSON.parse(JSON.stringify(ticket));
            console.log('tiketsss', ticketData);
            
            res.status(200).render('purchase', { ticket: ticketData, productsNotBuyed: prod });

      } catch (error) {
        console.error('Error al procesar la compra:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
}