import { Router } from '../common/router'
import * as mongoose from 'mongoose'
import { NotFoundError } from 'restify-errors'

export abstract class ModelRouter<D extends mongoose.Document> extends Router {

  constructor(protected model: mongoose.Model<D>) {
    super()

  }
  

  envelope(document: any): any {
    let resources = Object.assign({ _links: {} }, document.toJSON())
    resources._links.self = `${this.model.collection.name}/${resources._id}`
    return resources
  }
  
  envelopeAll(documents: any[],  options: any={}): any{
    const resources: any = {
      _links: {  },
      items: documents
    }
    if (options.page) {
      if (options.page > 1) {
        resources._links.prev = `${this.model.collection.name}?_page=${options.page-1}`        
      }
      resources._links.next = `${this.model.collection.name}?_page=${options.page+1}`
    }
    return resources
  }


  findAll = (req, resp, next) => {
    const token = req.header('token');
    if (token != "lasanha") {
      resp.status(401)
      resp.json({ message: "Token invalido" })
      return
    }
    const limit = 5
    let page = parseInt(req.query._page || 1)
    page = page > 0 ? page : 1
    const skip = (page - 1) * limit
    this.model.find()
      .limit(limit)
      .skip(skip)
      .then(this.renderAll(resp, next, { page }))
      .catch(next)
  }
  findByName = (req, resp, next) => {
    if (req.query.name) {
      this.model.find({ name: req.query.name })
        .then(this.renderAll(resp, next))
        .catch(error => {
          resp.send(400, { message: error.message });
        })
    } else {
      next()
    }
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
  findById = (req, resp, next) => {
    this.model.findById(req.params.id)
      .then(this.render(resp, next))
      .catch(next)
  }
  save = (req, resp, next) => {
    let document = new this.model(req.body)
    document.save()
      .then(this.render(resp, next))
      .catch(error => {
        resp.send(400, { message: error.message });
      })
    next()
  }
  replace = (req, resp, next) => {
    const options = { overwrite: true }
    this.model.updateOne({ _id: req.params.id }, req.body, options)
      .exec().then(result => {
        if (result.n) {
          return this.model.findById(req.params.id)
        } else {
          throw new NotFoundError('Documento não encontrado')
        }
      }).then(this.render(resp, next))
      .catch(next)
  }
  update = (req, resp, next) => {
    const options = { new: true }
    this.model.findByIdAndUpdate(req.params.id, req.body, options)
      .then(this.render(resp, next))
      .catch(next)
  }
  delete = (req, resp, next) => {
    this.model.deleteOne({ _id: req.params.id }).exec().then((result: any) => {
      if (result) {
        resp.send(204)
      } else {
        throw new NotFoundError('Documento não encontrado')
      }
      return next()
    }).catch(error => {
      resp.send(400, { message: error.message });
    })
    next()
  }
}