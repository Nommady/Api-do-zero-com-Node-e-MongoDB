import { ModelRouter } from '../common/model.router'
import * as restify from 'restify'
import { User } from './users.model'
//import { version } from 'mongoose'
class UsersRouter extends ModelRouter<User> {
  constructor() {
    super(User)
    this.on('beforeRender', document => {
      document.password = undefined
      //delete document.password
    })
  }
 
  findByEmail = (req, resp, next) => {
    if (req.query.email) {
      this.model.find({ email: req.query.email })
        .then(this.renderAll(resp, next))
        .catch(error => {
          resp.send(400, { message: error.message });
        })
      next()
    } else {
      next()
    }
  }
  applyRoutes(application: restify.Server) {
    application.get({ path: '/users', version: '2.0.0' }, [this.findByEmail,this.findByName, this.findAll])
    //application.get({ path: '/users', version: '1.0.0' }, this.findAll)
    application.get('/users/:id', this.findById)
    application.post('/users', this.save)
    application.put('/users/:id', this.replace)
    application.patch('/users/:id', this.update)
    application.del('/users/:id', this.delete)
  }
}
export const usersRouter = new UsersRouter()