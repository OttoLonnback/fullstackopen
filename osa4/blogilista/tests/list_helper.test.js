const listHelper = require('../utils/list_helper')
const blogs = require('./blogs')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('totalLikes', () => {
  test('of empty array is zero', () => {
    expect(listHelper.totalLikes([])).toBe(0)
  })

  test('when list has only one blog equals the likes of that', () => {
    expect(listHelper.totalLikes([blogs[0]])).toBe(7)
  })

  test('of a bigger list is calculated right', () => {
    expect(listHelper.totalLikes(blogs)).toBe(36)
  })
})

describe('favoriteBlog', () => {
  test('of empty list is null', () => {
    expect(listHelper.favoriteBlog([])).toBe(null)
  })

  test('when list has only one blog equals that blog', () => {
    expect(listHelper.favoriteBlog([blogs[0]])).toEqual({
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
    })
  })

  test('of a bigger list is calculated right', () => {
    expect(listHelper.favoriteBlog(blogs)).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
    })
  })
})

describe('mostBlogs', () => {
  test('of empty list is null', () => {
    expect(listHelper.mostBlogs([])).toBe(null)
  })

  test('when list has only one blog returns its author', () => {
    expect(listHelper.mostBlogs([blogs[0]])).toEqual({
      author: 'Michael Chan',
      blogs: 1
    })
  })

  test('when list has multiple blogs by the same author is calculated right', () => {
    expect(listHelper.mostBlogs([blogs[1], blogs[2]])).toEqual({
      author: 'Edsger W. Dijkstra',
      blogs: 2
    })
  })

  test('of a bigger list is calculated right', () => {
    expect(listHelper.mostBlogs(blogs)).toEqual({
      author: 'Robert C. Martin',
      blogs: 3
    })
  })
})

describe('mostLikes', () => {
  test('of empty list is null', () => {
    expect(listHelper.mostLikes([])).toBe(null)
  })

  test('when list has only one blog returns its author', () => {
    expect(listHelper.mostLikes([blogs[0]])).toEqual({
      author: 'Michael Chan',
      likes: 7
    })
  })

  test('when list has multiple blogs by the same author is calculated right', () => {
    expect(listHelper.mostLikes([blogs[1], blogs[2]])).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })

  test('of a bigger list is calculated right', () => {
    expect(listHelper.mostLikes(blogs)).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })
})