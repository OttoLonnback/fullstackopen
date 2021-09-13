const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const blogs = require('./blogs')

const api = supertest(app)

beforeEach(async () => { 
  await Blog.deleteMany({}) 
  let blog = new Blog(blogs[0])
  await blog.save()
  blog = new Blog(blogs[1]) 
  await blog.save()
})

describe('GET /api/blogs', () => {
  test('returns blogs as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returns two blogs initially', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(2)
  })

  test('returns blogs with an id field', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
  })
})


describe('POST /api/blogs', () => {
  test('a valid note can be added', async () => {
    await api
      .post('/api/blogs')
      .send(blogs[2])
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(3)

    const cleaned = response.body.map(({ title, author, url, likes }) => ({ title, author, url, likes }))
    expect(cleaned).toContainEqual(blogs[2])
  })

  test('likes is set to 0 if missing', async () => {
    const blog = { ...blogs[2]}
    delete blog.likes

    await api
      .post('/api/blogs')
      .send(blog)

    const response = await api.get('/api/blogs')

    const cleaned = response.body.map(({ title, author, url, likes }) => ({ title, author, url, likes }))
    expect(cleaned).toContainEqual({ likes: 0, ...blog })
  })

  test('returns status 400 if title or url is missing', async () => {
    const blog1 = { ...blogs[2] }
    delete blog1.title

    await api
      .post('/api/blogs')
      .send(blog1)
      .expect(400)
    
    const blog2 = { ...blogs[2] }
    delete blog2.url

    await api
      .post('/api/blogs')
      .send(blog2)
      .expect(400)
  })
})

afterAll(() => {
  mongoose.connection.close()
})