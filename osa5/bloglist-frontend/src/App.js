import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const notificationRef = useRef()
  const togglableRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(blogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const login = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password })
      setUser(user)
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      return true
    } catch (error) {
      notificationRef.current.showError('wrong username or password', 'error')
      return false
    }
  }

  const logout = () => {
    setUser(null)
    blogService.setToken(null)
    window.localStorage.removeItem('loggedBlogappUser')
  }

  const createBlog = async ({ title, author, url }) => {
    if (title && url) {
      try {
        const blog = await blogService.create({ title, author, url })
        togglableRef.current.toggleVisibility()
        setBlogs(blogs.concat(blog))
        notificationRef.current.showNotification(`a new blog ${blog.title} by ${blog.author} added!`)
        return true
      } catch (error) {
        notificationRef.current.showError('Failed to create blog')
        return false
      }
    } else {
      notificationRef.current.showError('Title and url are required')
      return false
    }
  }

  const likeBlog = async blog => {
    try {
      const { id, title, author, url, likes, user } = blog
      const newBlog = await blogService.update(id, {
        title,
        author,
        likes: likes + 1,
        url,
        user: user.id
      })
      const newBlogs = [...blogs]
      newBlogs[newBlogs.indexOf(blog)] = newBlog
      newBlogs.sort((a, b) => b.likes - a.likes)
      setBlogs(newBlogs)
    } catch (error) {
      notificationRef.current.showError('Failed to like blog')
    }
  }

  const removeBlog = async blog => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id)
        const i = blogs.indexOf(blog)
        setBlogs(blogs.slice(0, i).concat(blogs.slice(i + 1)))
        notificationRef.current.showNotification(`the blog ${blog.title} by ${blog.author} was removed`)
      } catch (error) {
        notificationRef.current.showError('Failed to remove blog')
      }
    }
  }

  return (
    <div>
      <h1>blogs</h1>
      <Notification ref={notificationRef}/>
      {
        user ? <>
          <p>
            {user.name} logged in
            <button onClick={logout}>logout</button>
          </p>
          <Togglable ref={togglableRef} buttonLabel='create new blog'>
            <h2>create new</h2>
            <BlogForm createBlog={createBlog}/>
          </Togglable>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} user={user} like={likeBlog} remove={removeBlog}/>
          )}
        </> : <LoginForm login={login}/>
      }
    </div>
  )
}

export default App