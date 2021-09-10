// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => 1

const totalLikes = (blogs) => blogs.reduce((acc, blog) => acc + blog.likes, 0)

const favoriteBlog = (blogs) => blogs.length > 0 ? blogs.reduce((best, blog) => blog.likes > best.likes ? blog : best) : null

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  // Count blogs
  const authors = {}
  blogs.forEach((blog) => {
    if (authors[blog.author]) {
      authors[blog.author]++
    } else {
      authors[blog.author] = 1
    }
  })
  // Find best
  const best = Object.entries(authors).reduce((best, author) => author[1] > best[1] ? author : best)
  return { author: best[0], blogs: best[1] }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  // Count likes
  const authors = {}
  blogs.forEach((blog) => {
    if (authors[blog.author]) {
      authors[blog.author] += blog.likes
    } else {
      authors[blog.author] = blog.likes
    }
  })
  // Find best
  const best = Object.entries(authors).reduce((best, author) => author[1] > best[1] ? author : best)
  return { author: best[0], likes: best[1] }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}