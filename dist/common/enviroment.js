"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enviroment = void 0;
exports.enviroment = {
    db: { url: process.env.DB_URL || 'mongodb://localhost/meat-api' },
    server: { port: process.env.SERVER_PORT || 3000 },
};
