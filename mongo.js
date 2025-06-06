const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]


const url = `mongodb+srv://harautia1976:${password}@phonebook-backend.tuz19rg.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=phonebook-backend`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})


const Person = mongoose.model('Person', personSchema)



const person = new Person({
  name: name,
  number: number,
})

if (name && number !== 0) {
  person.save().then(result => {
    console.log(result, 'Added ' + name + ' number ' + number + ' to phonebook'  )
    mongoose.connection.close()
  })
}

else Person.find({}).then(result => {
  console.log('phonebook:')
  result.forEach(person => {
    console.log(person.name + ' ' + person.number)
  })
  mongoose.connection.close()
})