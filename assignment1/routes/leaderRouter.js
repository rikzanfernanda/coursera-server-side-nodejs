import express from 'express'

const leaderRouter = express.Router()

leaderRouter.all('/', (req, res, next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next()
})

leaderRouter.get('/', (req, res) => {
    res.end(`Will send all the leaderships to you!`)
})

leaderRouter.post('/', (req, res) => {
    res.end(`Will add the leadership: ${req.body.name} with details: ${req.body.description}`)
})

leaderRouter.put('/', (req, res) => {
    res.end(`PUT operation not supported on /leaders`)
})

leaderRouter.delete('/', (req, res) => {
    res.end(`DELETE operation not supported on /leaders`)
})

leaderRouter.get('/:leaderId', (req, res) => {
    res.send(`Will send details of the leadership: ${req.params.leaderId} to you!`)
})

leaderRouter.post('/:leaderId', (req, res) => {
    res.end(`POST operation not supported on /leaders/${req.params.leaderId}`)
})

leaderRouter.put('/:leaderId', (req, res) => {
    res.end(`Will update the leadership: ${req.body.name} with details: ${req.body.description}`)
})

leaderRouter.delete('/:leaderId', (req, res) => {
    res.end(`Will delete the leadership: ${req.params.leaderId}`)
})

export default leaderRouter