"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const model_router_1 = require("../common/model.router");
const users_model_1 = require("./users.model");
const uuid = require("uuid");
const restify_errors_1 = require("restify-errors");
//import { version } from 'mongoose'
class UsersRouter extends model_router_1.ModelRouter {
    constructor() {
        super(users_model_1.User);
        this.saves = (req, resp, next) => {
            let document = new this.model(req.body);
            const token = uuid.v4();
            document.token = token;
            document.save()
                .then(resp.json(document))
                .catch(error => {
                resp.send(400, { message: error.message });
            });
            //console.log(token)
            next();
        };
        this.deleteUser = (req, resp, next) => {
            const token = req.header('token');
            if (token != req.params.token) {
                resp.status(401);
                resp.json({ message: "token invalido" });
                return;
            }
            else {
                users_model_1.User.deleteOne({ _id: req.params.id }).exec().then((result) => {
                    if (result) {
                        resp.send(204);
                    }
                    else {
                        throw new restify_errors_1.NotFoundError('Documento não encontrado');
                    }
                    return next();
                }).catch(error => {
                    resp.send(400, { message: error.message });
                });
            }
            next();
        };
        this.on('beforeRender', document => {
            document.password = undefined;
            //delete document.password
        });
    }
    applyRoutes(application) {
        application.get({ path: '/users', version: '2.0.0' }, [this.findByEmail, this.findByName, this.findAll]);
        //application.get({ path: '/users', version: '1.0.0' }, this.findAll)
        application.get('/users/:id', this.findById);
        application.post('/users', this.saves);
        application.put('/users/:id', this.replace);
        application.patch('/users/:id', this.update);
        application.del('/users/:id', this.deleteUser);
    }
}
exports.usersRouter = new UsersRouter();
