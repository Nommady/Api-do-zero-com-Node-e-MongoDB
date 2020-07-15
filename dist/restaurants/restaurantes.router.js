"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restaurantesRouter = void 0;
const router_1 = require("../common/router");
const restify_errors_1 = require("restify-errors");
const restaurantes_model_1 = require("./restaurantes.model");
class RestaurantesRouter extends router_1.Router {
    constructor() {
        super();
        this.on('beforeRender', document => {
        });
    }
    applyRoutes(application) {
        application.get('/restaurantes', (req, resp, next) => {
            const limit = parseInt(req.query.limit);
            const page = parseInt(req.query.page);
            const skip = (page - 1) * limit;
            restaurantes_model_1.Restaurantes.find().limit(limit).skip(skip)
                .then(this.render(resp, next))
                .catch(next);
        });
        application.get('/restaurantes/name/:name', (req, resp, next) => {
            restaurantes_model_1.Restaurantes.find({ name: req.params.name })
                .then(this.render(resp, next))
                .catch(next);
        });
        application.get('/restaurantes/:id', (req, resp, next) => {
            restaurantes_model_1.Restaurantes.findById(req.params.id)
                .then(this.render(resp, next))
                .catch(next);
        });
        application.post('/restaurantes', (req, resp, next) => {
            let restaurantes = new restaurantes_model_1.Restaurantes(req.body);
            restaurantes.save()
                .then(this.render(resp, next))
                .catch(next);
        });
        application.put('/restaurantes/:id', (req, resp, next) => {
            const options = { runValidator: true, overwrite: true };
            restaurantes_model_1.Restaurantes.updateOne({ _id: req.params.id }, req.body, options)
                .exec().then(result => {
                if (result.n) {
                    return restaurantes_model_1.Restaurantes.findById(req.params.id);
                }
                else {
                    throw new restify_errors_1.NotFoundError('Documento não encontrado');
                }
            }).then(this.render(resp, next))
                .catch(next);
        });
        application.patch('/restaurantes/:id', (req, resp, next) => {
            const options = { runValidator: true, new: true };
            restaurantes_model_1.Restaurantes.findByIdAndUpdate(req.params.id, req.body, options)
                .then(this.render(resp, next))
                .catch(next);
        });
        application.del('/restaurantes/:id', (req, resp, next) => {
            restaurantes_model_1.Restaurantes.deleteOne({ _id: req.params.id }).exec().then((cmdResult) => {
                if (cmdResult.result.n) {
                    resp.send(204);
                }
                else {
                    throw new restify_errors_1.NotFoundError('Documento não encontrado');
                }
                return next();
            }).catch(next);
        });
    }
}
exports.restaurantesRouter = new RestaurantesRouter();
