import * as mongoose from 'mongoose'

export interface MenuItem extends mongoose.Document{
  name: String,
  price:number
}

export interface Restaurantes extends mongoose.Document {
  name: string,
  borough: string,
  cuisine: string
  menu: MenuItem[]
}


const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required:  true   
  },
  price:{
    type: Number,
    required: true
  }
})

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 80,
    minlength: 3,
    unique: true
  },
  borough: {
    type: String,
   
  },
  cuisine: {
    type: String,
    required: true
  },  
  menu: {
    type: [MenuItem],
    required: false,
    select: false    
  }
})


 export const Restaurantes = mongoose.model<Restaurantes>('Restaurantes', restaurantSchema)
