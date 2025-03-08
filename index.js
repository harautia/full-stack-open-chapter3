const express = require('express')
const app = express()

const persons = [
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
  // Update the basic_info string inside the function
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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})