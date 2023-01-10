const { request, response } = require('express')
const express = require('express')
const app = express()

app.use(express.json())

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

app.use(morgan(':method :url :status :res[content-length]- :response-time ms :post-data'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const info = `<p>Phone has info for ${persons.length} people</p> <p>${new Date()}</p>`

    response.send(info)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if(!person){
        return response.status(400).end()
    }

    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)

    persons = persons.filter(person => person.id !== id)

    response.status(200).end()
})

const generateId = () => {
    return Math.floor(Math.random() * 10000)
}
app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body.name || !body.number){
        return response.status(400).json({error: 'Either name or number missing in contact details'})
    }

    isExist = false
    persons.forEach(person => {
        if(person.name === body.name){
            isExist = true
        }
    })

    if(isExist){
        return response.status(400).json({error: 'Name must be unique'})
    }

    const contact = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(contact)
    response.json(contact)
})

const PORT = 3001
app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`)
})
