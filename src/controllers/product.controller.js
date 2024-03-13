import ProductService from "../services/product.service.js";
import { Exception } from "../utils.js";

export default class ProductController {

    static async create(data, user) {
        console.log('Creando el nuevo producto.');
        const newProduct = await ProductService.create(data, user);
        console.log('Producto creado correctamente.');
        return newProduct;
      }
    
      static async get(query = {}) {
        const product = await ProductService.findAll(query); 
        return product;
      }
    
      static async getById(pid) {
        const product = await ProductService.findById(pid);
        if (!product) {
            throw new Exception('No existe el producto', 404);
        }
        return product;
      }
    
      static async updateById(pid, data) {
        await ProductController.getById(pid);
        if(!product) {
          throw new Exception('No existe el producto.', 404);
        };
        console.log('Actualizando el producto.');
        await ProductService.updateById(pid, data);
        console.log('Actualizado el producto corretamente.');
      }
    
      static async deleteById(pid) {
        const product = await ProductController.getById(pid);
        if(!product) {
          throw new Exception('No existe el producto', 404);
        };
        console.log('Eliminando el producto.');
        await ProductService.deleteById(pid);
        console.log('Producto eliminado corretamente.');
      }
}