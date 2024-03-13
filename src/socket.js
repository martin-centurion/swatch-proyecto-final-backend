import { Server } from 'socket.io';
import CartController from './controllers/cart.controller.js';
import ProductDao from './dao/product.dao.js';

let io;
let messages= []

export const inits = (httpServer) => {
    io = new Server(httpServer)
    io.on('connection', async (socketClient)=>{
        console.log(`Se ha conectado un nuevo cliente 🎉 (${socketClient.id})`);
        socketClient.on ('addProductToCart', async ( cartId, pid)=>{
            const cid = cartId;
            console.log('cid socket', cid);
            await CartController.addProductToCart(cartId, pid);
            socketClient.emit('addProductToCart');
        });

        socketClient.on("addProduct", async (data) => {
            try {
              // Obtener los datos del producto y del usuario del objeto recibido
              const { product, user } = data;
              await ProductDao.create(product, user);
          
            } catch (error) {
              console.error('Error al agregar el producto:', error);
              // Manejar el error según sea necesario
            }
          });
           let products = await ProductDao.get()
           socketClient.emit('products', products);
           socketClient.on('products', (products) => {
            io.emit('products', products);
           });
        socketClient.broadcast.emit('new-client');
        /* socketClient.on('new-message',async (data)=>{
            const {userName, message} = data
            messages.push({userName, message})
            await MessageManager.create(data)
            io.emit('notification', {messages})
        }) */
      

    })
    console.log('ServerSocket funciona');
}
export const emitFromApi = (event, data) => io.emit(event, data);