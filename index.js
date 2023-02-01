const { request, response } = require('express')
const express = require('express')
const cors = require('cors')

const app = express()

require('dotenv').config()

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

const morgan = require('morgan')
morgan.token('post-data', (request, response) => {
    if(request.method === 'POST'){
        const data = request.body
        return JSON.stringify(data)
    }
    else{
        return ''
    }
})

const Contact = require('./mongo')

app.use(morgan(':method :url :status :res[content-length]- :response-time ms :post-data'))

app.get('/api/persons', (request, response, next) => {
    Contact.find({})
    .then(result => {
        response.json(result)
    })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
    
    Contact.count({})
    .then(count => {
        const info = `<p>Phonebook has info for ${count} people</p> <p>${new Date()}</p>`
        response.send(info)
    })
    .catch(error => next(error))
    
})

app.get('/api/persons/:id', (request, response, next) => {
    Contact.findById(request.params.id)
    .then(result => response.json(result))
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
    Contact.findByIdAndDelete(request.params.id)
    .then(result => response.status(200).end())
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if(!body.name || !body.number){
        return response.status(400).json({error: 'Either name or number missing in contact details'})
    }

    const contact = new Contact({
        name: body.name,
        number: body.number
    })

    contact.save()
    .then(newContact => response.json(newContact))
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    if(!body.name || !body.number){
        return response.status(400).json({error: 'Either name or number missing in contact details'})
    }

    Contact.findByIdAndUpdate(request.params.id, body, {new: true})
    .then(updatedContact => response.json(updatedContact))
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if(error.name === 'CastError'){
        return response.status(400).send({error: 'malformatted query'})
    }

    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`)
})
