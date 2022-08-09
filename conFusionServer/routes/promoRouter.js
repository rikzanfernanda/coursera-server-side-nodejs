const express = require('express')

const promoRouter = express.Router()

promoRouter.all('/', (req, res, next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next()
})

promoRouter.get('/', (req, res) => {
    res.end(`Will send all the promotions to you!`)
})

promoRouter.post('/', (req, res) => {
    res.end(`Will add the promotion: ${req.body.name} with details: ${req.body.description}`)
})

promoRouter.put('/', (req, res) => {
    res.end(`PUT operation not supported on /promotions`)
})

promoRouter.delete('/', (req, res) => {
    res.end(`DELETE operation not supported on /promotions`)
})

promoRouter.get('/:promoId', (req, res) => {
    res.send(`Will send details of the promotion: ${req.params.promoId} to you!`)
})

promoRouter.post('/:promoId', (req, res) => {
    res.end(`POST operation not supported on /promotions/${req.params.promoId}`)
})

promoRouter.put('/:promoId', (req, res) => {
    res.end(`Will update the promotion: ${req.body.name} with details: ${req.body.description}`)
})

promoRouter.delete('/:promoId', (req, res) => {
    res.end(`Will delete the promotion: ${req.params.promoId}`)
})

module.exports = promoRouter