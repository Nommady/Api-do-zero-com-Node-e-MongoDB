import * as restify from 'restify'
import {ModelRouter} from '../common/model.router'
import {Restaurantes} from './restaurantes.model'
import { NotFoundError } from 'restify-errors'
class RestaurantesRouter extends ModelRouter<Restaurantes> {
  constructor(){
    super(Restaurantes)
    this.on('beforeRender', document=>{
    })
  }
  findMenu = (req, resp, next) => {
    Restaurantes.findById(req.params.id, '+menu')
      .then(rest => {
        if (!rest) {
          throw new NotFoundError("Restaurant not found")
        } else {
          resp.json(rest.menu)
          return next()
        }
      }).catch(next)
  }
  
  replaceMenu = (req, resp, next)=>{
    Restaurantes.findById(req.params.id).then(rest=>{
      if(!rest){
        throw new NotFoundError('Restaurant not found')
      }else{
        rest.menu = req.body //ARRAY de MenuItem
        return rest.save()
      }
    }).then(rest=>{
      resp.json(rest.menu)
      return next()
    }).catch(next)
}
  

  applyRoutes(application: restify.Server) {
    application.get('/restaurantes', this.findAll)
    application.get("/restaurantes/name/:name", this.findByName)
    application.get('/restaurantes/:id', this.findById)
    application.post('/restaurantes', this.save)
    application.put('/restaurantes/:id', this.replace)
    application.patch('/restaurantes/:id', this.update)
    application.del('/restaurantes/:id', this.delete)

    application.get('/restaurantes/:id/menu',this.findMenu)
    application.put('/restaurantes/:id/menu',this.replaceMenu)
    application.patch('/restaurantes/:id/menu',this.update)
  }    
}
export const restaurantesRouter = new RestaurantesRouter()