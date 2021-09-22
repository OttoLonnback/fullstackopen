import React, { useState, useImperativeHandle } from 'react'

const Notification = React.forwardRef((props, ref) => {
  const [message, setMessage] = useState(null)
  const [type, setType] = useState('notification')

  const showError = (message) => {
    setMessage(message)
    setType('error')

    setTimeout(() => setMessage(null), 5000)
  }

  const showNotification = (message) => {
    setMessage(message)
    setType('notification')

    setTimeout(() => setMessage(null), 5000)
  }

  useImperativeHandle(ref, () => ({ showError, showNotification }))

  if (message === null) {
    return null
  }

  return (
    <div className={type==='error' ? 'error' : 'notification'}>
      {message}
    </div>
  )
})

Notification.displayName = 'Notification'

export default Notification