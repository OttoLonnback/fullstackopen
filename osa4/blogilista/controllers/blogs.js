const Blog = require('../models/blog')

const blogsRouter = require('express').Router()

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { name: 1, username: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'token missing' })
  }

  const user = request.user

  const { title, author, url, likes} = request.body

  const blog = new Blog({ title, author, url, likes, user: user._id })

  const result = await blog.save()
  user.blogs = user.blogs.concat(result._id)
  await user.save()

  await result.execPopulate('user', { name: 1, username: 1 })

  response.status(201).json(result)
})

blogsRouter.put('/:id', async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'token missing' })
  }
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(401).json({ error: 'blog does not exist' })
  }

  const result = await Blog
    .findByIdAndUpdate(request.params.id, request.body, { new: true })
    .populate('user', { name: 1, username: 1 })

  response.json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'token missing' })
  }
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(401).json({ error: 'blog does not exist' })
  }
  if (request.user._id.toString() !== blog.user.toString()) {
    return response.status(401).json({ error: 'only own blogs can be deleted' })
  }

  await Blog.findByIdAndRemove(request.params.id)

  response.status(204).end()
})

module.exports = blogsRouter