const express = require('express')
const cors = require('./cors')

const leaderRouter = express.Router()

leaderRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })

leaderRouter.all('/', (req, res, next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next()
})

leaderRouter.get('/', cors.cors, (req, res) => {
    res.end(`Will send all the leaderships to you!`)
})

leaderRouter.post('/', cors.corsWithOptions, (req, res) => {
    res.end(`Will add the leadership: ${req.body.name} with details: ${req.body.description}`)
})

leaderRouter.put('/', cors.corsWithOptions, (req, res) => {
    res.end(`PUT operation not supported on /leaders`)
})

leaderRouter.delete('/', cors.corsWithOptions, (req, res) => {
    res.end(`DELETE operation not supported on /leaders`)
})

leaderRouter.get('/:leaderId', cors.corsWithOptions, (req, res) => {
    res.send(`Will send details of the leadership: ${req.params.leaderId} to you!`)
})

leaderRouter.post('/:leaderId', cors.corsWithOptions, (req, res) => {
    res.end(`POST operation not supported on /leaders/${req.params.leaderId}`)
})

leaderRouter.put('/:leaderId', cors.corsWithOptions, (req, res) => {
    res.end(`Will update the leadership: ${req.body.name} with details: ${req.body.description}`)
})

leaderRouter.delete('/:leaderId', cors.corsWithOptions, (req, res) => {
    res.end(`Will delete the leadership: ${req.params.leaderId}`)
})

module.exports = leaderRouter