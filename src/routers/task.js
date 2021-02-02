const express = require('express');
const router = new express.Router(); // attach routers to project with app.us() inside of index.js
const Task = require('../models/task')// Accesses model to be used at differenct endpoints

router.get('/tasks', async (req,res) => {
  try{
    const tasks = await Task.find({})
    res.send(tasks)
  }catch(e){
    res.send(e).status(500)
  }
})

router.get('/tasks/:id', async (req,res) => {
  const _id = req.params.id
  try{
    const task = await Task.findById(_id)

    if(!task){
      return res.status(404).send()
    }
    res.send(task)
  }catch(e){
    res.send(e).status(500)
  }
})

router.post('/tasks', async (req,res) => {
  const task = new Task(req.body)
  try{
    await task.save()
    res.send(task).status(201)
  }catch(e){
    res.send(e).status(400)
  }
})

router.patch('/tasks/:id', async (req,res) =>{
  const updates = Object.keys(req.body)
  const allowedUpdate = ['description', 'completed']
  const isValidOperation = updates.every(update => allowedUpdate.includes(update))

  if(!isValidOperation){
    return res.status(404).send({error:'Invalid Update'})
  }

  try{
    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true})
    // rewritten to not bypass middleware which waits for .save() on Model

    const task = await Task.findById(req.params.id)
    // task['description'] = 'New Description' = {'description':"New Description"} <- from req.body 
    updates.forEach(update => task[update] = req.body[update])
    
    await task.save()
    if(!task){
      return res.status(404).send()
    }
    res.send(task)
  }catch(e){
    res.status(400).send(e)
  }
})

router.delete('/tasks/:id', async (req,res) => {
  try{
    const task = await Task.findByIdAndDelete(req.params.id)
    if(!task){
      return res.status(404).send()
    }
    res.send(task)
  }catch(e){
    res.status(500).send(e)
  }
})

module.exports = router;