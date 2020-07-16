"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelRouter = void 0;
const router_1 = require("../common/router");
const restify_errors_1 = require("restify-errors");
class ModelRouter extends router_1.Router {
    constructor(model) {
        super();
        this.model = model;
        this.findAll = (req, resp, next) => {
            const limit = parseInt(req.query.limit);
            const page = parseInt(req.query.page);
            const skip = (page - 1) * limit;
            this.model.find().limit(limit).skip(skip)
                .then(this.renderAll(resp, next))
                .catch(next);
        };
        this.findByName = (req, resp, next) => {
            this.model.find({ name: req.params.name })
                .then(this.render(resp, next))
                .catch(next);
        };
        this.findById = (req, resp, next) => {
            this.model.findById(req.params.id)
                .then(this.render(resp, next))
                .catch(next);
        };
        this.save = (req, resp, next) => {
            let document = new this.model(req.body);
            document.save()
                .then(this.render(resp, next))
                .catch(error => {
                resp.send(400, { message: error.message });
            });
            next();
        };
        this.replace = (req, resp, next) => {
            const options = { overwrite: true };
            this.model.updateOne({ _id: req.params.id }, req.body, options)
                .exec().then(result => {
                if (result.n) {
                    return this.model.findById(req.params.id);
                }
                else {
                    throw new restify_errors_1.NotFoundError('Documento não encontrado');
                }
            }).then(this.render(resp, next))
                .catch(next);
        };
        this.update = (req, resp, next) => {
            const options = { new: true };
            this.model.findByIdAndUpdate(req.params.id, req.body, options)
                .then(this.render(resp, next))
                .catch(next);
        };
        this.delete = (req, resp, next) => {
            this.model.deleteOne({ _id: req.params.id }).exec().then((cmdResult) => {
                if (cmdResult.result.n) {
                    resp.send(204);
                }
                else {
                    throw new restify_errors_1.NotFoundError('Documento não encontrado');
                }
                return next();
            }).catch(error => {
                resp.send(400, { message: error.message });
            });
            next();
        };
    }
}
exports.ModelRouter = ModelRouter;
