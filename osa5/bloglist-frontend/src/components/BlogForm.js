import React, { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const submit = async event => {
    event.preventDefault()
    if (await createBlog({ title, author, url })) {
      setTitle('')
      setAuthor('')
      setUrl('')
    }
  }

  return (
    <form onSubmit={submit}>
      <div>
        title: <input id='title' value={title} onChange={e => setTitle(e.target.value)} />
      </div>
      <div>
        author: <input id='author' value={author} onChange={e => setAuthor(e.target.value)} />
      </div>
      <div>
        url: <input id='url' value={url} onChange={e => setUrl(e.target.value)} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm