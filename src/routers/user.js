const express = require('express')
const router = new express.Router(); // attach router to project with app.use() inside of index.js
const User = require('../models/user')// Accesses model to be used at differenct endpoints
const auth = require('../middleware/auth')
// Public Routes include sign up and login 
// Everything else will require an authentication token

router.post('/users', async (req,res)=>{
  // Needs access to User model to create new User (line 3)
  // req.body hold all incoming information 
  // req.params fold url inforamtion like ID
  const user = new User(req.body)
  try{
    await user.save()
    const token = await user.generateAuthToken()
    res.status(201).send({user, token})
  }catch(e){
    res.status(400).send(e)
  }
})

router.post('/users/login', async (req,res) => {
  // find user by email and then use bcrypt compare method to compare passwords
  // Create reusable function that does all that for us
  
  // Create token and authenticate the token matches previous tokens
  try{
    const user = await User.findByCredentials(req.body.email, req.body.password)// midware func returns user or errors
    const token = await user.generateAuthToken()
    res.send({user,token})
  }catch(e){
    res.status(400).send()
  }
})

router.get('/users/me',auth ,async (req,res) => {
  res.send(req.user)
})

router.get('/users/:id', async (req,res) => {
  const _id = req.params.id
  try{
    const user = await User.findById(_id)

    if(!user){
      return res.status(404).send()
    }
    res.send(user)
  }catch(e){
    res.status(500).send()
  }
})
router.patch('/users/:id', async(req, res)=>{
  // making sure that you can only update attributes that exist inside of database
  const updates = Object.keys(req.body) // check keys of request
  const allowedUpdate = ['name', 'email', 'password', 'age']
  const isValidOperation = updates.every((update) => allowedUpdate.includes(update))// if key matches an allowed update element

  if(!isValidOperation){
    return res.status(400).send({error: 'Invalid Updates!'})
  }
  try{
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
    // Refactored beause findByIdAndUpdate bypasses the '.pre()' middleware
    const user = await User.findById(req.params.id)
    updates.forEach(update => {
      user[update] = req.body[update]
    })
    await user.save()

    if(!user){
      return res.status(404).send()
    }
    res.send(user)
  }catch(e){
    res.status(400).send(e)
  }
})

router.delete('/users/:id', async(req, res) =>{
  try{
    const user = await User.findByIdAndDelete(req.params.id)
    if(!user){
      return res.status(400).send()
    }
    res.send(user)
  }catch(e){
    res.status(500).send(e)
  }
})

module.exports = router