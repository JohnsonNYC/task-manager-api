const request = require('supertest')
const app = require('../src/app')

const Task = require('../src/models/task')
const {userOneID, userOne, setUpDatabase} = require('./fixtures/db')

beforeEach(setUpDatabase)// provided by Jest and will be used to wipe out database. Lifecycle method

test('Should create task for user', async() => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: 'From my Test'
    }).expect(201)

    //Assertion check that task was created 

    const task = await Task.findById(response.body._id)
    expect(task).not.toBe()
    expect(task.completed).toBe(false)
})