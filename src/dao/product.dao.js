import ProductModel from "../models/product.model.js";

export default class ProductDao {
    static create(data) {
        return ProductModel.create(data);
    }

    static async productExists(pid) {
        console.log(await ProductModel.findOne({ _id: pid }));
        try {
          return await ProductModel.findOne({ _id: pid });
        } catch (error) {
          return false;
        }
      }

    static get( criteria = {} ) {
        return ProductModel.find(criteria);
    }

    static async getById(pid) {
        return ProductModel.findById(pid);
    } 

    static async updateById(pid, data) {
        return ProductModel.updateOne({ _id: pid }, { $set: data });
    }

    static async deleteById(pid) {
        return ProductModel.deleteOne({ _id: pid });
    }
}