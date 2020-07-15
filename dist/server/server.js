"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const restify = require("restify");
const mongoose = require("mongoose");
const enviroment_1 = require("../common/enviroment");
const merge_patch_parser_1 = require("./merge-patch.parser");
const error_handler_1 = require("./error.handler");
class Server {
    initializeDb() {
        return mongoose.connect(enviroment_1.enviroment.db.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }
    initRoutes(routers) {
        return new Promise((resolve, reject) => {
            try {
                this.application = restify.createServer({
                    name: "meat-Api",
                    version: "1.0.0"
                });
                this.application.use(restify.plugins.queryParser());
                this.application.use(restify.plugins.bodyParser());
                this.application.use(merge_patch_parser_1.mergePatchBodyParser);
                //routes
                for (let router of routers) {
                    router.applyRoutes(this.application);
                }
                // this.application.get('/info', [
                //   (req, resp, next) => {
                //    if (req.userAgent().includes('MSIE 7.0')) {
                //     // resp.status(400)
                //      // resp.json({
                //      //   message: 'Please update your browser',
                //      // })
                //      let error: any = new Error()
                //      error.statusCode = 400
                //      error.message = 'Please update your browser'
                //      return next(error)
                //    }
                //    return next()
                //  },
                //  (req, resp, next) => {
                //    resp.json({
                //      browser: req.userAgent(),
                //      method: req.method,
                //      url: req.href(),
                //      path: req.path(),
                //      query: req.query
                //    })
                //    return next()
                //  }])
                this.application.on('restifyError', error_handler_1.handleError);
                this.application.listen(enviroment_1.enviroment.server.port, () => {
                    resolve(this.application);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    bootstrap(routers = []) {
        return this.initializeDb().then(() => this.initRoutes(routers).then(() => this));
    }
}
exports.Server = Server;
