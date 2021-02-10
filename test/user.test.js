const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')


const userOne = ({
  name:'Mike',
  email: 'mike@example.com',
  password: 'What1244!'
})
beforeEach(async () => {// provided by Jest and will be used to wipe out database. Lifecycle method
  // wipe all users in database 
  await User.deleteMany()
  await new User(userOne).save()
})

test('Should Sign Up User', async() => {
  await request(app).post('/users').send({ //provide app and url to test. Send allows us to test and object
    name: "Johnson",
    email: "jkow95@example.com",
    password: "Mypass2021"
  }).expect(201) // This is what we expect in order for our test to pass
})

test('Should login existing user', async() => {
  await request(app).post('/users/login').send({
    email: userOne.email,
    password: userOne.password
  }).expect(200)
})

test('Should not login nonexistent user', async() => {
  await request(app).post('/users/login').send({
    email: userOne.email,
    password: 'Nonexistent123'
  }).expect(400)
})
