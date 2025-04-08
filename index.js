const express = require('express')
const morgan = require('morgan')
const app = express()

const cors = require('cors')

app.use(cors())

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

let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

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

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end(basic_info)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log(id)
  const person = persons.find(person => person.id == id)  // This had to changed from "===" to "=="
  console.log(person)
  if (person) {
    response.json(person)
  } else {
    console.log('Person Not Found!')
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id != id) // This had to changed from "!==" to "!="
  response.status(204).end()
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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})