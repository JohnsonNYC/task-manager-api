const request = require('supertest')
const app = require('../src/app')

const Task = require('../src/models/task')
const {userOneID, userOne, userTwo, userTwoID, setUpDatabase, taskOne, taskTwo, taskThree} = require('./fixtures/db')

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

test('Should get all tasks from user one', async() => {
  const response = await request(app)
  .get('/tasks')
  .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
  .expect(200)

  expect(response.body.length).toBe(2)
})

test('Should not delete other users tasks', async()=>{
  const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404)

  // Asser that task is still in the database 
  const task = Task.findById(`${taskOne._id}`)
  expect(task).not.toBe()
})

//Extra tests to create 
//
// User Test Ideas
//
// Should not signup user with invalid name/email/password
// Should not update user if unauthenticated
// Should not update user with invalid name/email/password
// Should not delete user if unauthenticated

//
// Task Test Ideas
//
// Should not create task with invalid description/completed
// Should not update task with invalid description/completed
// Should delete user task
// Should not delete task if unauthenticated
// Should not update other users task
// Should fetch user task by id
// Should not fetch user task by id if unauthenticated
// Should not fetch other users task by id
// Should fetch only completed tasks
// Should fetch only incomplete tasks
// Should sort tasks by description/completed/createdAt/updatedAt
// Should fetch page of tasks