import * as restify from 'restify'
import {ModelRouter} from '../common/model.router'
import { Review } from './reviews.model'

class ReviewsRouter extends ModelRouter<Review>{
  constructor() {
    super(Review);
  }

  findByIds = (req, resp, next) => {
    this.model.findById(req.params.id)
      .populate('user', 'name')
      .populate('restaurant', 'name')
      .then(this.render(resp, next))
      .catch(next)
  }

  
    applyRoutes(application: restify.Server){
      application.get('/review', this.findAll)              
      application.get('/review/:id',  this.findByIds)
      application.post('/review', this.save)
      application.del('/review/:id', this.delete)
    }
  }
  export const ReviewRouter = new ReviewsRouter()
  
  