const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URL
console.log('connecting to', url)

mongoose.connect(url)
.then(result => console.log('connected to MongoDB'))
.catch(error => console.log('error connecting to MongoDB: ', error.message))

const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
})

contactSchema.set('toJSON', {
    transform: (document, returnObject) => {
        returnObject.id = returnObject._id.toString()
        delete returnObject._id
        delete returnObject.__v
    }
})

module.exports = mongoose.model('Contact', contactSchema)

