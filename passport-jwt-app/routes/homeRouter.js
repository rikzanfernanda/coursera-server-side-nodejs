const express = require('express')

const homeRouter = express.Router()

homeRouter.route('/')
.get((req, res, next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    res.end('Home route')
})

module.exports = homeRouter