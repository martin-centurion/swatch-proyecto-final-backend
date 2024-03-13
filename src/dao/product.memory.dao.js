export default class Product {
    constructor() {
        this.products;
    }

    get(filter = {}) {
        return this.contacts;
    }

    create(data) {
        const newProduct = {
            ...data,
            id: this.contacts.length + 1,
        };
        this.products.push(newProduct);
        return newProduct;
    }

    productExists(){
        
    };
    
    getById(pid) {
        return this.products.findById(pid);
    }

    updateById(id, data) {
        const index = this.products.findIndex(p => p.id === parseInt(id));
        this.products[index] = {
            ...this.products[index],
            ...data,
            id: parseInt(id)
        }
        return this.contacts[index]
    }

    deleteById(id) {
        const index = this.products.findIndex(p => p.id === parseInt(id));
        const result = this.products.splice(index, 1);
        return result;
    }
}