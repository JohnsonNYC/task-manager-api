const request = require('supertest') // allows testing for endpoints before 'app.listen()'
const app = require('../src/app')
const User = require('../src/models/user')
const {userOneID, userOne, setUpDatabase} = require('./fixtures/db')

beforeEach(setUpDatabase)// provided by Jest and will be used to wipe out database. Lifecycle method

test('Should Sign Up User', async() => {
  const response = await request(app).post('/users').send({ //provide app and url to test. Send allows us to test and object
    name: "Johnson",
    email: "jkow95@example.com",
    password: "Mypass2021"
  }).expect(201) // This is what we expect in order for our test to pass

// Assert that the database was changed correctly 
const user = await User.findById(response.body.user._id)
expect(user).not.toBeNull()

//Assertions about the response 
expect(response.body).toMatchObject({
  user:{
    name: "Johnson",
    email: "jkow95@example.com",
  },
  token: user.tokens[0].token
})

expect(user.password).not.toBe("Mypass2021")
})

test('Should login existing user', async() => {
  const response = await request(app).post('/users/login').send({
    email: userOne.email,
    password: userOne.password
  }).expect(200)

  // Assertion that token is saved 
  const user = await User.findById(response.body.user._id)
  expect(response.body.token).toBe(user.tokens[1].token)
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

  const user = await User.findById(userOneID)
  expect(user).toBe(null)
})

test('Should not delete account for user that is not authenticated', async() => {
  await request(app)
  .delete('/users/me')
  .send()
  .expect(401)
})

test('Should update valid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      name:"Johnson"
    })
    .expect(200)

    const user = await User.findById(userOneID)
    expect(user.name).toEqual('Johnson')
})

test('Should not update valid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      locations:"Philadelphia"
    })
    .expect(400)
})

// test('Should upload avatar image', async () => {
//   // fixtures = things that let you set up the environment your tests are going to run in 
//   await request(app)
//   .post('/users/me/avatar')  
//   .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
//   .attach('avatar','tests/fixtures/profile-pic.jpg')
//   .expect(200) // server configured for avatar given by schema 

//   //const user = await User.findById(userOneID)
//   //expect(user.avatar).toEqual(expect.any(Buffer))
// })

