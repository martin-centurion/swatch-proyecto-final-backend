export default class UserDao {
    constructor() {
        this.users;
    }
    get (filter = {}) {
        return this.users;
    }
    getById (uid) {
        return this.users.findById(uid);
    }
    create (data) {
        const newUser = {
            ...data,
            id: this.contacts.length + 1,
        };
        this.users.push(newUser);
        return newUser;
    }
    updateById (uid, data) {
        const index = this.users.findIndex(u => u.id === parseInt(uid));
        this.users[index] = {
            ...this.users[index],
            ...data,
            id: parseInt(uid)
        }
        return this.users[index]
    }
    deleteById (uid) {
        const index = this.users.findIndex(u => u.id === parseInt(uid));
        const result = this.users.splice(index, 1);
        return result;
    }
}