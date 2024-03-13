export default class UserDTO {
    constructor(user) {
        this.id = user._id || user.id;
        this.fullname = `${user.first_name} ${user.last_name}`;
        this.email = user.email;
        this.age = user.age;
        this.password = user.password;
        this.role = user.role;
        this.cart = user.cart;
        this.documents = user.documents;
    }
}