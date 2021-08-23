const mongoose = require('mongoose');

function setupDB (password) {
  const url =
    `mongodb+srv://fullstackopen:${password}@cluster0.cfvrp.mongodb.net/test?retryWrites=true&w=majority`
  
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  
  const personSchema = new mongoose.Schema({
    name: String,
    number: String
  })
  
  return mongoose.model('Person', personSchema)
}

if (process.argv.length === 3) {
  const Person = setupDB(process.argv[2]);

  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(({ name, number }) => {
      console.log(`${name} ${number}`)
    })
    mongoose.connection.close()
  })

} else if (process.argv.length === 5) {
  const Person = setupDB(process.argv[2]);

  const person = new Person({ name: process.argv[3], number: process.argv[4] })
  
  person.save().then(({ name, number }) => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log('Invalid number of argments')
}