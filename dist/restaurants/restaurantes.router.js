"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restaurantesRouter = void 0;
const model_router_1 = require("../common/model.router");
const restaurantes_model_1 = require("./restaurantes.model");
const restify_errors_1 = require("restify-errors");
class RestaurantesRouter extends model_router_1.ModelRouter {
    constructor() {
        super(restaurantes_model_1.Restaurantes);
        this.findMenu = (req, resp, next) => {
            restaurantes_model_1.Restaurantes.findById(req.params.id, '+menu')
                .then(rest => {
                if (!rest) {
                    throw new restify_errors_1.NotFoundError("Restaurant not found");
                }
                else {
                    resp.json(rest.menu);
                    return next();
                }
            }).catch(next);
        };
        this.replaceMenu = (req, resp, next) => {
            restaurantes_model_1.Restaurantes.findById(req.params.id).then(rest => {
                if (!rest) {
                    throw new restify_errors_1.NotFoundError('Restaurant not found');
                }
                else {
                    rest.menu = req.body; //ARRAY de MenuItem
                    return rest.save();
                }
            }).then(rest => {
                resp.json(rest.menu);
                return next();
            }).catch(next);
        };
        this.on('beforeRender', document => {
        });
    }
    envelope(document) {
        let resources = Object.assign({ _links: {} }, document.toJSON());
        resources._links.self = `${this.model.collection.name}/${resources._id}`;
        resources._links.menu = `${this.model.collection.name}/${resources._id}/menu`;
        return resources;
    }
    applyRoutes(application) {
        application.get({ path: '/restaurantes', version: '2.0.0' }, [this.findByEmail, this.findByName, this.findAll]);
        application.get('/restaurantes/:id', this.findById);
        application.post('/restaurantes', this.save);
        application.put('/restaurantes/:id', this.replace);
        application.patch('/restaurantes/:id', this.update);
        application.del('/restaurantes/:id', this.delete);
        application.get('/restaurantes/:id/menu', this.findMenu);
        application.put('/restaurantes/:id/menu', this.replaceMenu);
        application.patch('/restaurantes/:id/menu', this.update);
    }
}
exports.restaurantesRouter = new RestaurantesRouter();
