import express from 'express'

const dishRouter = express.Router()

dishRouter.all('/', (req, res, next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next()
})

dishRouter.get('/:dishId', (req, res) => {
    res.end(`Will send you details of the dish: ${req.params.dishId} to you!`)
})

dishRouter.post('/:dishId', (req, res) => {
    res.statusCode = 403
    res.end('POST operation not supported on /dishes/' + req.params.dishId)
})

dishRouter.put('/:dishId', (req, res) => {
    res.end(`Will update the dish: ${req.body.name} with details: ${req.body.description}`)
})

dishRouter.delete('/:dishId', (req, res) => {
    res.end(`Deleting dish: ${req.params.dishId}`)
})

export default dishRouter