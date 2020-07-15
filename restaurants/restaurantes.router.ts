import {Router} from '../common/router'
import * as restify from 'restify'
import {NotFoundError} from 'restify-errors'
import {Restaurantes} from './restaurantes.model'


class RestaurantesRouter extends Router {

  constructor(){
    super()
    this.on('beforeRender', document=>{
    })
  }

  applyRoutes(application: restify.Server){

    application.get('/restaurantes', (req, resp, next) => {
      const limit = parseInt(req.query.limit)
      const page = parseInt(req.query.page)
      const skip = (page - 1) * limit
      Restaurantes.find().limit(limit).skip(skip)
          .then(this.render(resp,next))
          .catch(next)
    })
    
    application.get('/restaurantes/name/:name', (req, resp, next)=>{
      Restaurantes.find({name: req.params.name})
          .then(this.render(resp, next))
          .catch(next)
    })
    application.get('/restaurantes/:id', (req, resp, next)=>{
      Restaurantes.findById(req.params.id)
          .then(this.render(resp, next))
          .catch(next)
    })

    application.post('/restaurantes', (req, resp, next)=>{
      let restaurantes = new Restaurantes(req.body)
      restaurantes.save()
          .then(this.render(resp, next))
          .catch(next)
    })

    application.put('/restaurantes/:id', (req, resp, next)=>{
      const options = {runValidator:true, overwrite: true}
      Restaurantes.updateOne({_id: req.params.id}, req.body, options)
          .exec().then(result=>{
        if(result.n){
          return Restaurantes.findById(req.params.id)
        } else{
          throw new NotFoundError('Documento não encontrado')
        }
      }).then(this.render(resp, next))
        .catch(next)
    })

    application.patch('/restaurantes/:id', (req, resp, next)=>{
      const options = {runValidator:true, new : true}
      Restaurantes.findByIdAndUpdate(req.params.id, req.body, options)
          .then(this.render(resp, next))
          .catch(next)
    })

    application.del('/restaurantes/:id', (req, resp, next)=>{
      Restaurantes.deleteOne({_id:req.params.id}).exec().then((cmdResult: any)=>{
        if(cmdResult.result.n){
          resp.send(204)
        }else{
          throw new NotFoundError('Documento não encontrado')
        }
        return next()
      }).catch(next)
    })

  }
}

export const restaurantesRouter = new RestaurantesRouter()
