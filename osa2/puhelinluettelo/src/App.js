import React, { useState, useEffect } from 'react'
import axios from 'axios'

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

const Person = ({ name, number }) => <p>{name} {number}</p>

const Persons = ({ persons, filter }) => persons
  .filter(p => p.name.toLowerCase().startsWith(filter.toLowerCase()))
  .map(p => <Person name={p.name} number={p.number} key={p.id} />)


const App = () => {
  const [ persons, setPersons] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter ] = useState('')

  const addPerson = e => {
    e.preventDefault()
    if (newName.length > 0 && newNumber.length > 0) {
      if (!persons.some(p => p.name === newName)) {
        setNewName('')
        setNewNumber('')
        setPersons(persons.concat({ name: newName, number: newNumber }))
      } else {
        alert(`${newName} is already added to phonebook`)
      }
    }
  }

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => setPersons(response.data))
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} setFilter={setFilter} />
      <h2>Add a new</h2>
      <PersonForm
        name={newName}
        number={newNumber}
        setName={setNewName}
        setNumber={setNewNumber}
        submit={addPerson}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} />
    </div>
  )

}

export default App