require('dotenv').config();
const { json } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('body', (req, res) => ['POST', 'PUT', 'PATCH'].includes(req.method) ? JSON.stringify(req.body) : '')

const app = express()
app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/info', (req, res, next) => {
  Person.find({})
    .then(persons  => res.send(
      `
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>
      `
    ))
    .catch(error => next(error))
})

app.get('/api/persons', (req, res, next) => Person.find({})
  .then(persons => res.json(persons))
  .catch(error => next(error))
)

app.get('/api/persons/:id', (req, res, next) => Person.findById(req.params.id)
  .then(person => {
    if (person) {
      res.json(persons[0])
    } else {
      res.status(404).end()
    }
  })
  .catch(error => next(error))
)

app.delete('/api/persons/:id', (req, res, next) => Person.findByIdAndRemove(req.params.id)
  .then(() => res.status(204).end())
  .catch(error => next(error))
)

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body
  if (!name) {
    res.status(400).json({ error: 'name is missing' })
  } else if (!number) {
    res.status(400).json({ error: 'number is missing' })
  /*
  } else if (persons.find(p => p.name === name)) {
    res.status(400).json({ error: 'name must be unique' })
  */
  } else {
    new Person({ name, number }).save()
      .then(savedPerson => res.json(savedPerson))
      .catch(error => next(error))
  }
})

app.put('/api/persons/:id', (req, res, next) => {
  const person = {
    name: req.body.name,
    number: req.body.number
  }
  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(savedPerson => res.json(savedPerson))
    .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name = 'CastError') {
    res.status(400).json({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))