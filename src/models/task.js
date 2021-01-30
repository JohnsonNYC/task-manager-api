const mongoose = require('mongoose')

const Task = mongoose.model('Task', {
  description:{
    type: String,
    trim: true,
    required: true
  },
  completed:{
    default:false,
    type: Boolean
  }
})

module.exports = Task