const { json } = require('express')
const express = require('express')
const morgan = require('morgan')

let persons = [
  { id: 1, name: 'Arto Hellas', number: "040-123456" },
  { id: 2, name: 'Ada Lovelace', number: "39-44-5323523" },
  { id: 3, name: 'Dan Abramov', number: "12-43-234345" },
  { id: 4, name: 'Mary Poppendick', number: "39-23-6423122" }
]

morgan.token('body', (req, res) => JSON.stringify(req.body))

const app = express()
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/info', (req, res) => res.send(
  `
  <p>Phonebook has info for ${persons.length} people</p>
  <p>${new Date()}</p>
  `
))

app.get('/api/persons', (req, res) => res.json(persons))

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const length = persons.length
  persons = persons.filter(p => p.id === id)
  if (persons.length < length) {
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body
  if (!name) {
    res.status(400).json({ error: 'name is missing' })
  } else if (!number) {
    res.status(400).json({ error: 'number is missing' })
  } else if (persons.find(p => p.name === name)) {
    res.status(400).json({ error: 'name must be unique' })
  } else {
    const id = Math.floor(Math.random() * 1000000000 + 1)
    const person = { id, name, number }
    persons = persons.concat(person)
    res.json(person)
  }
})

const PORT = 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))