const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const validator = require('validator')


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
},
{
  collection: 'User'
}
)

// Static signup method
userSchema.statics.signup = async function(username, password) {
  //validation
  if(!username || !password){
    throw Error('All fields must be filled')
  }
  if(!validator.isStrongPassword(password)){
    throw Error('Password not strong enough')
  }

  const exists = await this.findOne({ username })

  if(exists){ 
    throw Error('Email already in use')
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)


  const user = await this.create({ username, password: hash})

  return user;
}

// static login method
userSchema.statics.login = async function(username, password) {
  //validation
  if(!username || !password){
    throw Error('All fields must be filled')
  }

  const user = await this.findOne({ username })

  if(!user){
    throw Error('Incorrect email')
  }

  const match = await bcrypt.compare(password, user.password)

  if(!match){
    throw Error(user.password);
  }

  return user;
}

module.exports = mongoose.model('User', userSchema)