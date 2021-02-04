const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')


const userSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
    trim: true
  },
  email:{
    type: String,
    unique: true, 
    required: true, 
    trim: true,
    lowercase: true,
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error('Email is invalid')
      }
    }
  },
  password:{
    type: String,
    required: true,
    trim:true,
    minLength: 7, 
    validate(value){
      if(value.toLowerCase().includes("password")){
        throw new Error('Password cannot contain "password"')
      }
    }
  },
  age:{
    type: Number,
    default: 0,
    validate(value){
      if(value < 0){
        throw new Error('Age must be a positive number')
      }
    }
  },
  tokens: [{ // Stores json web tokens as a way for users to logout
    token:{
      type: String,
      required: true
    }
  }],
  avatar:{
    type: Buffer
  }
}, {
  timestamps: true
})

// Realtionship betweeen two properties User and Task. This is not on the database but just on Mongoose
userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
})

// hides the passwords and token as a response 
userSchema.methods.toJSON = function(){
  const user = this;
  const userObj = user.toObject()
  delete userObj.password 
  delete userObj.tokens
  delete userObj.avatar

  return userObj
}

// userSchema.methods creates methods for instances 
userSchema.methods.generateAuthToken = async function(){
  const user = this;

  const token = jwt.sign({_id: user.id.toString()},'thisismyauthentication') 
  //creates token with body consisting of the user.id as part of the payload. Used in auth middleware
  
  user.tokens = user.tokens.concat({token})
  await user.save()
  return token
}

//userSchema.statics creates function that can be used on model. Name of function comes after statics.<name>
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({email})

  if(!user){
    throw new Error ('Unable to Login')
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if(!isMatch){
    throw new Error ('Unable to Login')
  }

  return user
}

//Hash the plain text password before saving to database
userSchema.pre('save', async function (next){ 
  const user = this;
  if(user.isModified('password')){
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

// Delete user task when user is deleted 

userSchema.pre('remove', async function (next){
  const user = this;
  await Task.deleteMany({owner: user._id})
  next()
})

const User = mongoose.model('Users', userSchema)// using a seperate schema and model allows us to use middleware


module.exports = User