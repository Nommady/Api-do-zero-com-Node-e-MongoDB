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
            const token = req.header('token');
            if (token != "lasanha") {
                resp.status(401);
                resp.json({ message: "Token invalido" });
                return;
            }
            const limit = 5;
            let page = parseInt(req.query._page || 1);
            page = page > 0 ? page : 1;
            const skip = (page - 1) * limit;
            this.model.find()
                .limit(limit)
                .skip(skip)
                .then(this.renderAll(resp, next, { page }))
                .catch(next);
        };
        this.findByName = (req, resp, next) => {
            if (req.query.name) {
                this.model.find({ name: req.query.name })
                    .then(this.renderAll(resp, next))
                    .catch(error => {
                    resp.send(400, { message: error.message });
                });
            }
            else {
                next();
            }
        };
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
    envelope(document) {
        let resources = Object.assign({ _links: {} }, document.toJSON());
        resources._links.self = `${this.model.collection.name}/${resources._id}`;
        return resources;
    }
    envelopeAll(documents, options = {}) {
        const resources = {
            _links: {},
            items: documents
        };
        if (options.page) {
            if (options.page > 1) {
                resources._links.prev = `${this.model.collection.name}?_page=${options.page - 1}`;
            }
            resources._links.next = `${this.model.collection.name}?_page=${options.page + 1}`;
        }
        return resources;
    }
}
exports.ModelRouter = ModelRouter;
