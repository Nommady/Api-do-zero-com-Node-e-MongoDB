import * as mongoose from 'mongoose'
import { validateCPF } from '../common/validators'
//import * as bcrypt from "bcrypt"


export interface User extends mongoose.Document {
  name: string,
  email: string,
  password: string,
  token: any
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 80,
    minlength: 3
  },
  email: {
    type: String,
    unique: true,
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    required: true
  },
  password: {
    type: String,
    select: false,
    required: true
  },
  gender: {
    type: String,
    required: false,
    enum: ['Male', 'Female']
  },
  cpf: {
    type: String,
    required: false,
    validate: {
      validator: validateCPF,
      message: '{PATH}: Invalid CPF ({VALUE})'
    }
  },
  token: {
    type: String,
    select: false,
  }
})
// userSchema.pre('save', function (next) {//não utilizar arrow function
//   const users: User = this
//   if (users.isModified('password')) {
//     next()
//   } else {
//     bcrypt.hash(users.password, 10)
//       .then(hash => {
//         users.password = hash
//         next()
//     }).catch(next)
//   }
// })
// userSchema.pre('findOneAndUpdate', function (next) {//não utilizar arrow function
//   if (!this.getUpdate().password) {
//     next()
//   } else {
//     bcrypt.hash(this.getUpdate().password, 10)
//       .then(hash => {
//         this.getUpdate().password = hash
//         next()
//     }).catch(next)
//   }
// })

 export const User = mongoose.model<User>('User', userSchema)
