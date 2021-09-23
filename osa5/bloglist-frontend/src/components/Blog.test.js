import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'


describe('<Blog />', () => {
  let component, mockHandler

  beforeEach(() => {
    const user = {
      name: 'name',
      username: 'username'
    }

    const blog = {
      title: 'title',
      author: 'author',
      url: 'url',
      likes: 0,
      user
    }

    mockHandler = jest.fn()


    component = render(
      <Blog
        blog={blog}
        user={user}
        like={mockHandler}
        remove={() => undefined}
      />
    )
  })

  test('renders only title and author buy default', () => {


    expect(component.container).toHaveTextContent('title author')
    expect(component.container).not.toHaveTextContent('0 likes')
    expect(component.container).not.toHaveTextContent('url')
  })

  test('renders url and likes after pushing view button', () => {
    const viewButton = component.getByText('view')

    fireEvent.click(viewButton)

    expect(component.container).toHaveTextContent('title author')
    expect(component.container).toHaveTextContent('0 likes')
    expect(component.container).toHaveTextContent('url')
  })

  test('calls the like handler twice if the like button is pressed twice', () => {
    fireEvent.click(component.getByText('view'))

    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})