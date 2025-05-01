const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)

  .then(result => {
    console.log(result,'connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: function(validate) {
        // Tarkistetaan että ensin tulee 2 tai 3 numeroa, sitten - jonka jälkeen numeroita
        if (!/^\d{2,3}-\d+$/.test(validate)) {
          return false
        }
        // Tässä otetaan stringistä kaikki muut kuin digitit pois 
        const digitsOnly = validate.replace(/\D/g, '')
        // return = FALSE jos ehto ei täyty
        return digitsOnly.length >= 8
      },
      message: props => `${props.value} is not a valid phone number! Must start with 2-3 digits, include a hyphen, and have at least 8 digits total.`
    },
    required:[true, 'User phone number required']
  }}
)

const Person = mongoose.model('Person', personSchema)
  
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)