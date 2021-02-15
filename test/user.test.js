const request = require('supertest') // allows testing for endpoints before 'app.listen()'
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/user')

const userOneID = new mongoose.Types.ObjectId(); // Needed for ID and Tokens 

const userOne = ({
  _id: userOneID,
  name:'Mike',
  email: 'mike@example.com',
  password: 'What1244!',
  tokens:[{
    token: jwt.sign({_id: userOneID}, process.env.JWT_SECRET)
  }]
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

test('Should get profile for users', async() =>{ // Need header so we chain the .set() method to request
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`) // Will be used anytime we need authorization header
    .send()
    .expect(200)
})

test('Should not get profile for unauthenitated user', async() =>{
  await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('Should delete account for authenticated user', async() =>{
  await request(app)
  .delete('/users/me')
  .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
  .send()
  .expect(200)
})
test('Should not delete account for user that is not authenticated', async() => {
  await request(app)
  .delete('/users/me')
  .send()
  .expect(401)
})