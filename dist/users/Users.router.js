"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const model_router_1 = require("../common/model.router");
const users_model_1 = require("./users.model");
//import { version } from 'mongoose'
class UsersRouter extends model_router_1.ModelRouter {
    constructor() {
        super(users_model_1.User);
        this.findByEmail = (req, resp, next) => {
            if (req.query.email) {
                this.model.find({ email: req.query.email })
                    .then(this.renderAll(resp, next))
                    .catch(error => {
                    resp.send(400, { message: error.message });
                });
                next();
            }
            else {
                next();
            }
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
        application.post('/users', this.save);
        application.put('/users/:id', this.replace);
        application.patch('/users/:id', this.update);
        application.del('/users/:id', this.delete);
    }
}
exports.usersRouter = new UsersRouter();
