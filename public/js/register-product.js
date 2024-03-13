(function(){
 
    const socket = io();
    const formProduct = document.getElementById('form-product');
    
        formProduct.addEventListener('submit', (event) => {
            event.preventDefault();
            const title = document.getElementById("title").value;
            const description = document.getElementById("description").value;
            const price = document.getElementById("price").value;
            const code = document.getElementById("code").value;
            const category = document.getElementById("category").value;
            const stock = document.getElementById("stock").value;
            const isPremiumUser = userRole  === 'premium';
            const owner = isPremiumUser ? userEmail : 'admin';

        if (userRole !== 'admin' && userRole !== 'premium') {
          alert('No tiene permisos para crear productos');
          return;
        } else {
           alert('producto agregado correctamente')
        }
       
            const product = { title, description, price, code, category, stock}
            const user    = { role: userRole, email:userEmail }
  
        socket.emit("addProduct", { product, user } );
        
      });

})();
 