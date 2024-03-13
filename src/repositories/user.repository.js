import UserDTO from "../dto/user.dto.js";

export default class User {
    constructor(dao) {
        this.dao = dao;
    }

    async getEmail(email) {
        return this.dao.getEmail(email)
    }
    
    async get(filter = {}) {
        const users = await this.dao.get(filter);
        return users.map(user => new UserDTO(user));
    }

    async getById(id) {
        return new UserDTO(await this.dao.getById(id));}

    async create(data) {
        return this.dao.create(data);
    }

    updatePassById(id, userUpdated) {
        return this.dao.updateById(id, userUpdated);
    }
    
    async updateById(id, data) {
        const updateResult = await this.dao.updateById(id,  data);
        return updateResult;  
    }

    deleteById(id) {
        return this.dao.deleteById(id)
    }
}