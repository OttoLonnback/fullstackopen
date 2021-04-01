import React, { useState, useEffect } from 'react'
import personService from './services/persons'

const Notification = ({message, type}) => {
  if (message === null) {
    return null
  }

  return (
    <div className={type==='error' ? 'error' : 'notification'}>
      {message}
    </div>
  )
}

const Filter = ({ filter, setFilter }) =>
<div>
  filter shown with <input value={filter} onChange={e => setFilter(e.target.value)} />
</div>

const PersonForm = ({ name, number, setName, setNumber, submit}) =>
<form onSubmit={submit}>
  <div>
    name: <input value={name} onChange={e => setName(e.target.value)} />
  </div>
  <div>
    number: <input value={number} onChange={e => setNumber(e.target.value)} /></div>
  <div>
    <button type="submit">add</button>
  </div>
</form>

const Person = ({ person, deletePerson }) =>
<p>
  {person.name} {person.number}
  <button type="button" onClick={() => deletePerson(person)}>Delete</button>
</p>

const Persons = ({ persons, filter, deletePerson }) => persons
  .filter(p => p.name.toLowerCase().startsWith(filter.toLowerCase()))
  .map(p => <Person key={p.id} person={p} deletePerson={deletePerson} />)


const App = () => {
  const [ persons, setPersons] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter ] = useState('')
  const [{ message, type }, setNotification] = useState({ message: null, type: 'notification'})

  const showError = message => {
    setNotification({ message, type: 'error' })
    setTimeout(() => setNotification({ message: null, type: 'notification' }), 5000)
  }

  const showNotification = message => {
    setNotification({ message, type: 'notification' })
    setTimeout(() => setNotification({ message: null, type: 'notification' }), 5000)
  }

  const submitPersonForm = e => {
    e.preventDefault()
    if (newName.length > 0 && newNumber.length > 0) {
      if (!persons.some(p => p.name === newName)) {
        personService.create({ name: newName, number: newNumber })
          .then(data => {
            setNewName('')
            setNewNumber('')
            setPersons(persons.concat(data))
            showNotification(`Added ${data.name}`)
          })
          .catch(() => showError('Failed to add person'))
      } else {
        const person = persons.find(p => p.name === newName)
        personService
          .update(person.id, { ...person, number: newNumber })
          .then(data => {
            setNewName('')
            setNewNumber('')
            setPersons(persons.map(p => p.id === data.id ? data : p))
            showNotification(`Updated ${data.name}`)
          })
          .catch(() => showError('Failed to update person'))
      }
    }
  }

  const deletePerson = person => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .destroy(person.id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== person.id))
          showNotification(`Deleted ${person.name}`)
        })
        .catch(() => showError('Failed to delete person'))
    }
  }

  useEffect(() => {
    personService.getAll()
      .then(data => setPersons(data))
      .catch(() => showError('Failed to fetch persons'))
  }, [])

  return (
    <div>
      <Notification message={message} type={type} />
      <h2>Phonebook</h2>
      <Filter filter={filter} setFilter={setFilter} />
      <h2>Add a new</h2>
      <PersonForm
        name={newName}
        number={newNumber}
        setName={setNewName}
        setNumber={setNewNumber}
        submit={submitPersonForm}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} deletePerson={deletePerson} />
    </div>
  )

}

export default App