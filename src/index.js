const express = require('express')
require('./db/mongoose') // Ensures connection to the mongoose database
const User = require('./models/user') // Accesses model to be used at differenct endpoints
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000;
app.use(express.json()) // parse incoming json into an object

app.post('/users', async (req,res)=>{
  //console.log(req.body) // Needs access to User model to create new User (line 3)
  const user = new User(req.body)
  try{
    await user.save()
    res.status(201).send(user)
  }catch(e){
    res.send(e).status(400)
  }
})

app.get('/users', async (req,res) => {
  try{
    const users = await User.find({})
    res.send(users)
  }catch(e){
    res.status(500).send()
  }
})

app.get('/users/:id', async (req,res) => {
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

app.get('/tasks', async (req,res) => {
  try{
    const tasks = await Task.find({})
    res.send(tasks)
  }catch(e){
    res.send(e).status(500)
  }
})

app.get('/tasks/:id', async (req,res) => {
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

app.post('/tasks', async (req,res) => {
  const task = new Task(req.body)
  try{
    await task.save()
    res.send(task).status(201)
  }catch(e){
    res.send(e).status(400)
  }
})

app.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})