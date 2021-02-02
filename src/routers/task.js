const express = require('express');
const router = new express.Router(); // attach routers to project with app.us() inside of index.js
const Task = require('../models/task')// Accesses model to be used at differenct endpoints
const auth = require('../middleware/auth')


router.get('/tasks', auth, async (req,res) => {
  // Limit and Skip used for Pagination 
  // Get/task?limit=10&skip=0 <= give me the first 10 tasks
  // Get/task?limit=10&skip=10 <= give me the second 10 tasks
  // Options property provided inside populate to start paginations

  // Match and Logic for match used to Filter through data 
  const match = {}

  if(req.query.completed){ // Acceses the query from the url like 'completed?'
    match.completed = req.query.completed === 'true' // append the query to the match obj based of the query 
  }
  try{
    // const tasks = await Task.find({owner: req.user._id}) One way of doing it or you can populate using user
    await req.user.populate({
      path:'tasks', // allows us to make requests based on query parameter on the URL 
      match,
      options:{
        limit: parseInt(req.query.limit), // query string is string so this needs to be parsed into integer
        skip: parseInt(req.query.skip)
      }
    }).execPopulate()
    res.send(req.user.tasks) // changed from task to req.user.tasks as we're taking advantage of monogoose association
  }catch(e){
    res.send(e).status(500)
  }
})

router.get('/tasks/:id', auth, async (req,res) => {
  const _id = req.params.id
  try{
    const task = await Task.findOne({_id, owner: req.user._id})

    if(!task){
      return res.status(404).send()
    }
    res.send(task)
  }catch(e){
    res.send(e).status(500)
  }
})

router.post('/tasks', auth, async (req,res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  })

  try{
    await task.save()
    res.status(201).send(task)
  }catch(e){
    res.status(400).send(e)
  }
})

router.patch('/tasks/:id', auth, async (req,res) =>{
  const _id = req.params.id
  const updates = Object.keys(req.body)
  const allowedUpdate = ['description', 'completed']
  const isValidOperation = updates.every(update => allowedUpdate.includes(update))

  if(!isValidOperation){
    return res.status(404).send({error:'Invalid Update'})
  }

  try{
    // rewritten to not bypass middleware which waits for .save() on Model
    const task = await Task.findOne({_id, owner: req.user._id})
    // task['description'] = 'New Description' = {'description':"New Description"} <- from req.body 
    if(!task){
      return res.status(404).send()
    }
    updates.forEach(update => task[update] = req.body[update])
    await task.save()
    res.send(task)
  }catch(e){
    res.status(400).send(e)
  }
})

router.delete('/tasks/:id', auth, async (req,res) => {
  try{
    const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
    if(!task){
      return res.status(404).send()
    }
    res.send(task)
  }catch(e){
    res.status(500).send(e)
  }
})

module.exports = router;