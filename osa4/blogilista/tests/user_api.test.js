const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => { 
  await User.deleteMany({}) 
})

describe('POST /api/users', () => {
  test('a valid user can be added', async () => {
    await api
      .post('/api/users')
      .send({ username: 'user', password: 'pass' })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(1)

    const cleaned = response.body.map(({ username }) => username)
    expect(cleaned).toContain('user')
  })

  test('fails with missing username', async () => {
    await api
      .post('/api/users')
      .send({ password: 'pass' })
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(0)
  })

  test('fails with too short username', async () => {
    await api
      .post('/api/users')
      .send({ username: 'us', password: 'pass' })
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(0)
  })
  test('fails with missing password', async () => {
    await api
      .post('/api/users')
      .send({ username: 'user' })
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(0)
  })
  test('fails with too short password', async () => {
    await api
      .post('/api/users')
      .send({ username: 'user', password: 'pa' })
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(0)
  })
})

afterAll(() => {
  mongoose.connection.close()
})