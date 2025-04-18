const express = require('express')
const morgan = require('morgan')
const app = express()
require('dotenv').config()
app.use(express.static('dist'))

const cors = require('cors')

app.use(cors())

const Person = require('./models/person')

let persons = [ ]

// It creates a custom token for request body
morgan.token('request-body', (request) => {
  return JSON.stringify(request.body);
});

// This is used in because POST URL format
app.use(express.urlencoded({ extended: true }));

// This is is used for example to show GET request data in JSON format?
app.use(express.json())

// This defines the morgan output log based on HTTP Request. POST --> use defined parameters
// ALL Other Requests --> Use TINY
app.use((req, res, next) => {
  if (req.method === 'POST') {
    return morgan(':method :url :status :res[content-length] :response-time ms - :req[content-type] - body: :request-body')(req, res, next);
  } else {
    return morgan('tiny')(req, res, next);
  }
});

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

// Define info and time variables
let now = new Date();
let basic_info = '';

// Update the now information for the basic_info to be displayed
function updateDateTime() {
  now = new Date();
  basic_info = `Phonebook has info for ${persons.length} people\n\n${now.toDateString()} ${now.toTimeString()}`;
}

// This is needed to update time for the first time!
updateDateTime();

// This defines the update interval for time in mseconds
setInterval(updateDateTime, 1000);

/*app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(body.name)
  if (!body.name) {
    return response.status(400).json({ 
      error: 'Name Missing' 
    })
  }
  if (!body.number) {
    return response.status(400).json({ 
      error: 'Number Missing' 
    })
  }

  const person = {
    id: String(generateId()),
    name: body.name,
    number: body.number,
  }
  // This checks wheter any element in the array matches
  // to new name. IF YES --> Send error
  if (persons.some(person => person.name === body.name)) {
    return response.status(400).json({ 
      error: 'Name exists' 
    })
  }
  persons = persons.concat(person)
  response.send('User Created')
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log(id)
  const person = Person.find(person => person.id == id)  // This had to changed from "===" to "=="
  console.log(person)
  if (person) {
    response.json(person)
  } else {
    console.log('Person Not Found!')
    response.status(404).end()
  }
  response.status(500).end()
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id != id) // This had to changed from "!==" to "!="
  response.status(204).end()
})

*/

// Exercise 3.13 change
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    if (persons) {
      response.json(persons)
    } else {
      response.status(404).end()
    }
  })
})

// Exercise 3.14 change
app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(body.name)
  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.get('/info', (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end(basic_info)
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
  .then(person => {
    if (person) {
      console.log(request.params.id)
      response.json(person)
    } else {
      console.log(request.params.id)
      response.status(404).end()
    }
  })
  .catch(error => {
    console.log(error)
    response.status(400).send({ error: 'malformatted id' })
  })
})

// Exercise 3.15 change 
app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
  .then(result => {
    console.log('User Deleted')
    response.status(204).end()
  })
  .catch(error => {
    console.log(error)
    response.status(400).send({ error: 'malformatted id' })
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})