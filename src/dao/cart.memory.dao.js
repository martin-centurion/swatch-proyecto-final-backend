export default class CartDao {
  constructor() {
      this.carts;
  }
  get (filter = {}) {
      return this.carts;
  }
  getById (cid) {
      return this.carts.findById(cid);
  }
  create (data) {
      
  }
  updateById (cid, data) {
      const index = this.carts.findIndex(u => u.id === parseInt(cid));
      this.carts[index] = {
          ...this.carts[index],
          ...data,
          id: parseInt(cid)
      }
      return this.carts[index]
  }
  deleteById (cid) {
      const index = this.carts.findIndex(u => u.id === parseInt(cid));
      const result = this.carts.splice(index, 1);
      return result;
  }
}