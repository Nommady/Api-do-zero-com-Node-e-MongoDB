"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const Router_1 = require("../common/Router");
const users_model_1 = require("../users/users.model");
const restify_errors_1 = require("restify-errors");
class UsersRouter extends Router_1.Router {
    constructor() {
        super();
        this.on('befereRender', document => {
            document.password = undefined;
        });
    }
    applyRoutes(application) {
        application.get("/users", (req, resp, next) => {
            users_model_1.User.find()
                .then(this.render(resp, next))
                .catch(next);
        });
        // application.get("/users/:name", (req, resp, next) => {
        //   User.find({ name: req.params.name })
        //     .then(this.render(resp, next))
        //     .catch(next)
        // })
        application.get("/users/:id", (req, resp, next) => {
            users_model_1.User.findById(req.params.id)
                .then(this.render(resp, next))
                .catch(error => {
                resp.send(400, { message: error.message });
            });
            next();
        });
        application.post('/users', (req, resp, next) => {
            let user = new users_model_1.User(req.body);
            user.save()
                .then(this.render(resp, next))
                .catch(error => {
                resp.send(400, { message: error.message });
            });
            next();
        });
        application.put('/users/:id', (req, resp, next) => {
            const options = { overwrite: true }; //deleta o que não for atualizado
            users_model_1.User.updateOne({ _id: req.params.id }, req.body, options).exec()
                .then(result => {
                if (result.n) {
                    return users_model_1.User.findById(req.params.id);
                }
                else {
                    throw new restify_errors_1.NotFoundError("Documento não encontrado");
                }
            }).then(this.render(resp, next))
                .catch(error => {
                resp.send(400, { message: error.message });
            });
            next();
        });
        application.patch('users/:id', (req, resp, next) => {
            const option = { new: true };
            users_model_1.User.findByIdAndUpdate(req.params.id, req.body, option)
                .then(this.render(resp, next))
                .catch(error => {
                resp.send(400, { message: error.message });
            });
            next();
        });
        application.del('users/:id', (req, resp, next) => {
            users_model_1.User.deleteOne({ _id: req.params.id }).exec().then((cmdResult) => {
                if (cmdResult.result.n) {
                    resp.send(204);
                    return next();
                }
                else {
                    throw new restify_errors_1.NotFoundError("Documento não encontrado");
                }
                return next();
            }).catch(error => {
                resp.send(400, { message: error.message });
            });
            next();
        });
    }
}
exports.usersRouter = new UsersRouter();
