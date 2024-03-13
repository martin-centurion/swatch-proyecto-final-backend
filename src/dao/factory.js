import config from "../config.js";

export let UserDao;

switch (config.persistence) {
    case 'mongodb':
        UserDao = (await import('./user.dao.js')).default;
        break;
    case 'memory':
        UserDao = (await import('./user.memory.dao.js')).default;
        break;
    default:
        UserDao = (await import('./user.dao.js')).default;
        break;
}