const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config')

const UserSchema = mongoose.Schema({
  username: {
      type: String,
      lowercase: true, 
      unique: true, 
      required: [true, "can't be blank"], 
      match: [/^[a-zA-Z0-9]+$/, 'is invalid'], 
      index: true
    },
  email: {
    type: String, 
    lowercase: true, 
    unique: true, 
    required: [true, "can't be blank"], 
    match: [/\S+@\S+\.\S+/, 'is invalid'], 
    index: true
  },
  password: String,
  linkedinId: String,
})

UserSchema.plugin(uniqueValidator, {message: 'is already taken.'})

UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

UserSchema.methods.generateJWT = function() {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() /1000)
  }, JWT_SECRET, { algorithm: 'HS256' })
}

UserSchema.methods.toAuthJSON = function() {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    token: this.generateJWT(),
  }
}

UserSchema.methods.verifyJWT = function(token) {
  return jwt.verify(token, config.JWT_SECRET, { algorithms: ['HS256'] })
}

let User = mongoose.model('User', UserSchema);
module.exports = User