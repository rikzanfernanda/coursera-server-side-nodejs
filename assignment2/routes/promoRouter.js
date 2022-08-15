const express = require('express')
const Promotions = require('../model/promotions')

const promoRouter = express.Router()

const getPromotionById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const promotion = await Promotions.findById(id)

            if (promotion) {
                resolve(promotion)
            } else {
                const error = new Error(`Promotion with id ${id} not found`)
                error.status = 404
                reject(error)
            }
        } catch (error) {
            const err = new Error(error.message)
            err.status = 500
            reject(err)
        }
    })
}

promoRouter.route('/')
    .get(async (req, res) => {
        try {
            const promotions = await Promotions.find({})

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(promotions)
        } catch (error) {
            res.statusCode = 500
            res.json({ error: error.message })
        }
    })
    .post(async (req, res) => {
        try {
            const result = await Promotions.create(req.body)

            res.statusCode = 201
            res.setHeader('Content-Type', 'application/json')
            res.json(result)
        } catch (error) {
            res.statusCode = 500
            res.json({ error: error.message })
        }
    })
    .put((req, res) => {
        res.statusCode = 403
        res.end('PUT operation not supported on /promotions')
    })
    .delete((req, res) => {
        res.statusCode = 403
        res.end('DELETE operation not supported on /promotions')
    })

promoRouter.route('/:promoId')
    .get(async (req, res) => {
        try {
            const promotion = await getPromotionById(req.params.promoId)

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(promotion)
        } catch (error) {
            res.statusCode = error.status
            res.json({ error: error.message })
        }
    })
    .post((req, res) => {
        res.statusCode = 403
        res.end('POST operation not supported on /promotions/' + req.params.promoId)
    })
    .put(async (req, res) => {
        try {
            const promotion = await getPromotionById(req.params.promoId)
            
            if (req.body.name) promotion.name = req.body.name
            if (req.body.description) promotion.description = req.body.description
            if (req.body.image) promotion.image = req.body.image
            if (req.body.label) promotion.label = req.body.label
            if (req.body.price) promotion.price = req.body.price
            if (req.body.featured) promotion.featured = req.body.featured

            const result = await promotion.save()
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(result)
        } catch (error) {
            res.statusCode = error.status
            res.json({ error: error.message })
        }
    })
    .delete(async (req, res) => {
        try {
            const result = await getPromotionById(req.params.promoId)
            await result.remove()

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(result)
        } catch (error) {
            res.statusCode = error.status
            res.json({ error: error.message })
        }
    })

module.exports = promoRouter