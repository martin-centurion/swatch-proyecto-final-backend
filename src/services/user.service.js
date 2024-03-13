import { userRepository } from "../repositories/index.js";

export default class UserService {
    static findAll(filter = {}) {
        return userRepository.get(filter)
    }

    static get(criteria = {}) {
        return userRepository.getEmail(criteria);
    }

    static findById(uid) {
        return userRepository.getById(uid);
    }

    /* static updatePassById(uid, data) {
        return userRepository.updatePassById(uid, data);
    } */

    static updateById(uid, data) {
        return userRepository.updateById({ _id: uid }, { $set: data });
      }

    static deleteById(uid) {
        return userRepository.deleteById(uid);
    }
}