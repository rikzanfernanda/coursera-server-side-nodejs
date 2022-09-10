require('dotenv').config()
require('module-alias/register')
const express = require('express')
const bodyParser = require('body-parser')
const database = require('@config/database')
const userRoute = require('@routes/userRoute')
const dishRoute = require('@routes/dishRoute')
const favoriteRoute = require('@routes/favoriteRoute')
const cors = require('cors')

database()

const app = express()
const port = process.env.PORT || 3000

app.use(cors({
    origin: [
        'http://localhost',
        'https://www.google.com'
    ]
    // origin: '*'
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// routes
app.use('/users', userRoute)
app.use('/dishes', dishRoute)
app.use('/favorites', favoriteRoute)

// handling error
app.use((err, req, res, next) => {
    res.setHeader('Content-Type', 'application/json')
    res.statusCode = err.status || 500
    res.json({
        success: false,
        message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
    })
})

app.listen(port, () => console.log(`Listening on port ${port}`))
