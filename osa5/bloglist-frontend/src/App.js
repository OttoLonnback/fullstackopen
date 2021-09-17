import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [{ message, type }, setNotification] = useState({ message: null, type: 'notification' })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = message => {
    setNotification({ message, type: 'notification' })
    setTimeout(() => setNotification({ message: null, type: 'notification' }), 5000)
  }

  const showError = message => {
    setNotification({ message, type: 'error' })
    setTimeout(() => setNotification({ message: null, type: 'notification' }), 5000)
  }

  const onLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      setUser(user)
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      setUsername('')
      setPassword('')
    } catch (error) {
      showError('wrong username or password', 'error')
    }
  }

  const onLogout = event => {
    setUser(null)
    blogService.setToken(null)
    window.localStorage.removeItem('loggedBlogappUser') 
  }

  const createBlog = async event => {
    event.preventDefault()
    if (title && url) {
      try {
        const blog = await blogService.create({ title, author, url })
        setTitle('')
        setAuthor('')
        setUrl('')
        setBlogs(blogs.concat(blog))
        showNotification(`a new blog ${blog.title} by ${blog.author} added!`)
      } catch (error) {
        showError('Failed to create blog')
      }
    } else {
      showError('Title and url are required')
    }
  }

  if (user) {
    return (
      <div>
        <h2>blogs</h2>
        <Notification message={message} type={type}/>
        <p>
          {user.name} logged in
          <button onClick={onLogout}>logout</button>
        </p>
        <h2>create new</h2>
        <BlogForm
          title={title}
          author={author}
          url={url}
          setTitle={setTitle}
          setAuthor={setAuthor}
          setUrl={setUrl}
          submit={createBlog}
        />
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    )
  } else {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification message={message} type={type}/>
        <LoginForm
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          submit={onLogin}
        />
      </div>
    )
  }
}

export default App