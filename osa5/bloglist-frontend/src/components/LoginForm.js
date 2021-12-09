import React, { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ login }) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const submit = async event => {
    event.preventDefault()
    if (await login({ username, password })) {
      setUsername('')
      setPassword('')
    }
  }

  return (
    <form onSubmit={submit}>
      <h2>log in to application</h2>
      <div>
        username
        <input type="text" value={username} name="Username" id="username" onChange={({ target }) => setUsername(target.value)} />
      </div>
      <div>
        password
        <input type="password" value={password} name="Password"  id="password" onChange={({ target }) => setPassword(target.value)} />
      </div>
      <button type="submit" id="login-button">login</button>
    </form>
  )
}

LoginForm.propTypes = {
  login: PropTypes.func.isRequired
}

export default LoginForm