const express = require('express')
const router = new express.Router(); // attach router to project with app.use() inside of index.js
const User = require('../models/user')// Accesses model to be used at differenct endpoints
const auth = require('../middleware/auth')
const multer = require('multer') // Allows file upload capabilities 
const sharp = require('sharp') // convert large images into usable format 

// Public Routes include sign up and login 
// Everything else will require an authentication token

// Create  User
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

//Logout User
router.post('/users/login', async (req,res) => {
  // find user by email and then use bcrypt compare method to compare passwords
  // Create reusable function that does all that for us
  
  // Create token and authenticate the token matches previous tokens
  try{
    const user = await User.findByCredentials(req.body.email, req.body.password)// midware func returns user or errors
    const token = await user.generateAuthToken()
    res.send({user,token}) // getPublicProfile hides information like password and tokens from response
  }catch(e){
    res.status(400).send()
  }
})

// Add Image
const upload = multer({
  limits:{
    fileSize: 1000000
  },
  fileFilter(req,file,cb){
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
      return cb(new Error('Pleaser upload an image'))
    }
    cb(undefined, true)
  }
})

router.post('/users/me/avatar', auth, upload.single('avatar'),async (req,res) => {
  const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
  req.user.avatar = buffer 
  await req.user.save()
  res.send()
}, (error,req,res,next) => {
  res.status(400).send({error: error.message})
})

// Delete Image
router.delete('/users/me/avatar', auth, async (req,res) => {
  req.user.avatar = undefined
  await req.user.save()
  res.send() 
})

//Read Image 
router.get('/users/:id/avatar', async (req,res) => {
  try{
    const user = await User.findById(req.params.id);

    if(!user || !user.avatar){
      throw new Error()
    }
    // setup response header 
    res.set('Content-Type','image/jpg') // Default to Content-Type: 'application/json`'
    res.send(user.avatar)
  }catch(e){
    res.status(404).send()
  }
})
// Logout User
router.post('/users/logout', auth, async (req,res) => {
  try{
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token // remove token from database that is on the request to logout
    })
    await req.user.save()
    res.send()
  }catch(e){
    res.status(500).send()
  }
})

router.post('/users/logoutAll', auth, async (req,res) => { // remove all tokens from database 
  try{  
    req.user.tokens = [];
    await req.user.save();
    res.send()
  }catch(e){
    res.status(500).send()
  }
})

// Read User
router.get('/users/me',auth ,async (req,res) => {
  res.send(req.user)
})

router.patch('/users/me', auth, async(req, res)=>{
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
    //const user = await User.findById(req.params.id)
    updates.forEach(update => {
      req.user[update] = req.body[update]
    })
    await req.user.save()
    res.send(req.user)
  }catch(e){
    res.status(400).send(e)
  }
})

router.delete('/users/me', auth, async(req, res) =>{
  try{
    await req.user.remove()
    res.send(req.user)
  }catch(e){
    res.status(500).send(e)
  }
})

module.exports = router