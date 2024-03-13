import UserModel from "../models/user.model.js";

export default class AuthService {
    static getEmail(criteria = {}) {
        return UserModel.findOne(criteria);
    }

    static findAll(filter = {}) {
        return UserModel.find(filter)
    }

    static create (data) {
        return UserModel.create(data);
    }

    static updateById(uid, data) {
        return UserModel.updateOne({ _id: uid }, { $set: data });
    }
}