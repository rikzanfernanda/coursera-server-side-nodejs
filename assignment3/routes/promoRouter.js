const express = require('express')
const Promotion = require('../models/promotion')
const auth = require('../authenticate')

const router = express.Router()

const getPromotionById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const promotion = await Promotion.findById(id)

            if (promotion) {
                resolve(promotion)
            } else {
                let err = new Error(`Promotion with id ${id} not found`)
                err.status = 404
                reject(err)
            }
        } catch (error) {
            reject(error)
        }
    })
}

router.route('/')
    .get(async (req, res, next) => {
        try {
            const promotions = await Promotion.find({})

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json({
                success: true,
                data: promotions
            })
        } catch (error) {
            return next(error)
        }
    })
    .post(auth.verifyUser, auth.verifyAdmin, async (req, res, next) => {
        try {
            let promotion = new Promotion()
            promotion.name = req.body.name
            promotion.image = req.body.image
            promotion.label = req.body.label
            promotion.price = req.body.price
            promotion.description = req.body.description
            promotion.featured = req.body.featured

            const response = await promotion.save()

            res.statusCode = 201
            res.setHeader('Content-Type', 'application/json')
            res.json({
                success: true,
                message: 'Successfully created promotion',
                data: response
            })
        } catch (error) {
            return next(error)
        }
    })

router.route('/:promoId')
    .get(async (req, res, next) => {
        try {
            const promotion = await getPromotionById(req.params.promoId)

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json({
                success: true,
                data: promotion
            })
        } catch (error) {
            return next(error)
        }
    })
    .put(auth.verifyUser, auth.verifyAdmin, async (req, res, next) => {
        try {
            let promotion = await getPromotionById(req.params.promoId)

            if (req.body.name) promotion.name = req.body.name
            if (req.body.image) promotion.image = req.body.image
            if (req.body.label) promotion.label = req.body.label
            if (req.body.price) promotion.price = req.body.price
            if (req.body.description) promotion.description = req.body.description
            if (req.body.featured) promotion.featured = req.body.featured

            const response = await promotion.save()

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json({
                success: true,
                message: 'Successfully updated promotion',
                data: response
            })
        } catch (error) {
            return next(error)
        }
    })
    .delete(auth.verifyUser, auth.verifyAdmin, async (req, res, next) => {
        try {
            let promotion = await getPromotionById(req.params.promoId)

            await promotion.remove()

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json({
                success: true,
                message: 'Successfully deleted promotion'
            })
        } catch (error) {
            return next(error)
        }
    })


module.exports = router