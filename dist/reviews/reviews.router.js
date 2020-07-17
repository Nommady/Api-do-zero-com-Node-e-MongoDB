"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRouter = void 0;
const model_router_1 = require("../common/model.router");
const reviews_model_1 = require("./reviews.model");
class ReviewsRouter extends model_router_1.ModelRouter {
    constructor() {
        super(reviews_model_1.Review);
        this.findByIds = (req, resp, next) => {
            this.model.findById(req.params.id)
                .populate('user', 'name')
                .populate('restaurant', 'name')
                .then(this.render(resp, next))
                .catch(next);
        };
    }
    applyRoutes(application) {
        application.get('/review', this.findAll);
        application.get('/review/:id', this.findByIds);
        application.post('/review', this.save);
        application.del('/review/:id', this.delete);
    }
}
exports.ReviewRouter = new ReviewsRouter();
