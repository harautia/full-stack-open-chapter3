const express = require('express')
const app = express()

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

app.use(express.json())

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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})