import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, user, like, remove }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle} className="blog">
      {blog.title} {blog.author}
      <button onClick={() => setShowDetails(!showDetails)}>{showDetails ? 'hide': 'view'}</button><br/>
      {showDetails ? <>
        {blog.url}<br/>
        {blog.likes} likes
        <button onClick={() => like(blog)}>like</button><br/>
        {blog.user.name}<br/>
        {user.username === blog.user.username ? <button onClick={() => remove(blog)}>remove</button> : null}
      </> : null
      }
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  like: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired
}

export default Blog