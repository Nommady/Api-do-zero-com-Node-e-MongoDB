import * as mongoose from 'mongoose'
import { Restaurantes } from '../restaurants/restaurantes.model'
import { User } from '../users/users.model'


export interface Review extends mongoose.Document{
  date: Date,
  rating: Number,
  comments: String,
  restaurant:mongoose.Types.ObjectId | Restaurantes,//unionTypes cuidado para verificar os tipos da propriedades
  user:mongoose.Types.ObjectId | User
}
  
  
const reviewSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  comments: {
    type: String,
    required: true,
    maxlength: 200
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurantes',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

})

export const Review = mongoose.model<Review>('Review', reviewSchema )