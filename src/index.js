const express = require('express') // imports library
require('./db/mongoose') // Ensures connection to the mongoose database

const app = express() // starts server
const port = process.env.PORT ;
app.use(express.json()) // parse incoming json into an object

const userRouter = require('./routers/user') // contains all routes for Users
const taskRouter = require('./routers/task') // contains all routes fo Tasks
app.use(userRouter) // attaches routes to project
app.use(taskRouter) // attaches routes to project

app.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})