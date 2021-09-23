import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

test('<BlogForm /> passes the correct information to the callback', () => {
  const createBlog = jest.fn()

  const component = render(
    <BlogForm createBlog={createBlog} />
  )

  const title = component.container.querySelector('#title')
  fireEvent.change(title, { target: { value: 'title' } })

  const author = component.container.querySelector('#author')
  fireEvent.change(author, { target: { value: 'author' } })

  const url = component.container.querySelector('#url')
  fireEvent.change(url, { target: { value: 'url' } })

  fireEvent.submit(component.container.querySelector('form'))

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('title')
  expect(createBlog.mock.calls[0][0].author).toBe('author')
  expect(createBlog.mock.calls[0][0].url).toBe('url')
})