"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const users_model_1 = require("../users.model");
exports.authenticate = (req, resp, next) => {
    const { email, passwors } = req.body;
    users_model_1.User;
};
