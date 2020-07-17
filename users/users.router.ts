import { ModelRouter } from '../common/model.router'
import * as restify from 'restify'
import { User } from './users.model'
import * as uuid from 'uuid'
import { NotFoundError } from 'restify-errors'
//import { version } from 'mongoose'
class UsersRouter extends ModelRouter<User> {
  constructor() {
    super(User)
    this.on('beforeRender', document => {
      document.password = undefined
      //delete document.password
    })
  }

  saves = (req, resp, next) => {
    let document = new this.model(req.body)
    const token = uuid.v4()
    document.token = token
    document.save()
      .then(resp.json(document))
      .catch(error => {
        resp.send(400, { message: error.message });
      })
    //console.log(token)
    next()
  }
  deleteUser = (req, resp, next) => {
    const token = req.header('token');
    if (token != req.params.token) {
      resp.status(401)
      resp.json({ message: "token invalido" })
      return
    } else {
      User.deleteOne({ _id: req.params.id }).exec().then((result: any) => {
        if (result) {
          resp.send(204)
        } else {
          throw new NotFoundError('Documento não encontrado')
        }
        return next()
      }).catch(error => {
        resp.send(400, { message: error.message });
      })
    }
    next()
  }
  applyRoutes(application: restify.Server) {
    application.get({ path: '/users', version: '2.0.0' }, [this.findByEmail, this.findByName, this.findAll])
    //application.get({ path: '/users', version: '1.0.0' }, this.findAll)
    application.get('/users/:id', this.findById)
    application.post('/users', this.saves)
    application.put('/users/:id', this.replace)
    application.patch('/users/:id', this.update)
    application.del('/users/:id', this.deleteUser)
  }
}
export const usersRouter = new UsersRouter()