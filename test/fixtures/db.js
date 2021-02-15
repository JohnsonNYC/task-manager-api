const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const userOneID = new mongoose.Types.ObjectId(); // Needed for ID and Tokens 

const userOne = ({
  _id: userOneID,
  name:'Mike',
  email: 'mike@example.com',
  password: 'What1244!',
  tokens:[{
    token: jwt.sign({_id: userOneID}, process.env.JWT_SECRET)
  }]
})

const setUpDatabase = async () => { // we need the example user in user.test.js in beforeEach function
  // wipe all users in database 
  await User.deleteMany()
  await new User(userOne).save()
}

module.exports = {
  userOneID,
  userOne,
  setUpDatabase
}