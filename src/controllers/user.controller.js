import UserService from '../services/user.service.js';
import { Exception } from '../utils.js';

export default class UserController {
    static findAll (filter = {}) {
        return UserService.findAll(filter);
    }

    static create (data) {
        return UserService.create(data);
    };

    static async findById (uid) {
        const user = await UserService.findById(uid);
        if (!user) {
            throw new Exception('No existe el usuario', 404);
        }
        return user;
    }

    static async updateById(uid, data) {
        return UserController.getById(uid, data);
    }

    static async deleteById(uid) {
        return UserService.deleteById(uid);
    }
}