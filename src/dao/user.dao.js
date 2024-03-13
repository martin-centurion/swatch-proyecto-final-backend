import UserModel from '../models/user.model.js'

export default class UserDao {
    get(filter = {}) {
        const criteria = {};
        if (filter.id) {
            criteria._id = id;
        }
        return UserModel.find(criteria);
    }
    getEmail(criteria = {}) {
        return UserModel.findOne(criteria);
    }
    getById (data) {
        return UserModel.findById(data);
    }
    create (data) {
        return UserModel.create(data);
    }
    updateById (uid, data) {
        return UserModel.updateOne({ _id: uid }, { $set: data });
    }
    deleteById (uid) {
        return UserModel.deleteOne({ _id: uid });
    }
}