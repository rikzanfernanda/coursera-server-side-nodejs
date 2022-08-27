const express = require('express')
const Dish = require('../models/dish')
const auth = require('../authenticate')

const getDish = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const dish = await Dish.findById(id).populate('comments.author')

            if (dish) {
                resolve(dish)
            } else {
                const error = new Error(`Dish with id ${id} not found`)
                error.status = 404
                reject(error)
            }
        } catch (error) {
            reject(error)
        }
    })
}

const router = express.Router()

router.route('/')
    .get(async (req, res, next) => {
        try {
            const dishes = await Dish.find({}).populate('comments.author')
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json({
                success: true,
                data: dishes
            })
        } catch (error) {
            return next(error)
        }
    })
    .post(auth.verifyUser, auth.verifyAdmin, async (req, res, next) => {
        try {
            let data = {
                name: req.body.name,
                description: req.body.description,
                image: req.body.image,
                category: req.body.category,
                label: req.body.label,
                price: req.body.price,
                featured: req.body.featured,
                comments: req.body.comments,
            }
            const dish = new Dish(data)
            const response = await dish.save()
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json({
                success: true,
                data: response
            })
        } catch (error) {
            return next(error)
        }
    })

router.route('/:dishId')
    .get(auth.verifyUser, async (req, res, next) => {
        try {
            const dish = await getDish(req.params.dishId)

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json({
                success: true,
                data: dish
            })
        } catch (error) {
            return next(error)
        }
    })
    .put(auth.verifyUser, auth.verifyAdmin, async (req, res, next) => {
        try {
            let dish = await getDish(req.params.dishId)

            if (req.body.name) dish.name = req.body.name
            if (req.body.description) dish.description = req.body.description
            if (req.body.image) dish.image = req.body.image
            if (req.body.category) dish.category = req.body.category
            if (req.body.label) dish.label = req.body.label
            if (req.body.price) dish.price = req.body.price
            if (req.body.featured) dish.featured = req.body.featured
            if (req.body.comments) dish.comments = req.body.comments

            const response = await dish.save()

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json({
                success: true,
                data: response
            })
        } catch (error) {
            return next(error)
        }
    })
    .delete(auth.verifyUser, auth.verifyAdmin, async (req, res, next) => {
        try {
            // find dish
            let dish = await getDish(req.params.dishId)

            // delete dish
            await dish.remove()

            // send response
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json({
                success: true,
                message: 'Dish deleted'
            })
        } catch (error) {
            return next(error)
        }
    })

router.route('/:dishId/comments')
    .get(async (req, res, next) => {
        try {
            // get dish
            const dish = await getDish(req.params.dishId)

            // send response
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(dish.comments)
        } catch (error) {
            return next(error)
        }
    })
    .post(auth.verifyUser, async (req, res, next) => {
        try {
            // get dish
            let dish = await getDish(req.params.dishId)

            let data = {
                rating: req.body.rating,
                comment: req.body.comment,
                author: req.user._id,
            }
            dish.comments.push(data)

            // save dish sith new comment
            await dish.save()

            // get new dish after save
            const newDish = await getDish(req.params.dishId)

            // send response
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(newDish.comments)
        } catch (error) {
            return next(error)
        }
    })

router.route('/:dishId/comments/:commentId')
    .get(async (req, res, next) => {
        try {
            // get dish
            const dish = await getDish(req.params.dishId)

            // check if comment not exists
            if (!dish.comments.id(req.params.commentId)) {
                let err = new Error('Comment not found')
                err.status = 404
                return next(err)
            }

            // send response
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(dish.comments.id(req.params.commentId))
        } catch (error) {
            return next(error)
        }
    })
    .put(auth.verifyUser, async (req, res, next) => {
        try {
            let dish = await getDish(req.params.dishId)
            
            if (!dish.comments.id(req.params.commentId)) {
                let err = new Error('Comment not found')
                err.status = 404
                return next(err)
            }

            // check if user is author of comment
            let userId = req.user._id
            let authorId = dish.comments.id(req.params.commentId).author._id
            
            if (!userId.equals(authorId)) {
                let err = new Error('You are not authorized to perform this action')
                err.status = 403
                return next(err)
            }

            // update comment
            if (req.body.rating) dish.comments.id(req.params.commentId).rating = req.body.rating
            if (req.body.comment) dish.comments.id(req.params.commentId).comment = req.body.comment

            // save dish
            await dish.save()

            // get new dish after save
            const newDish = await getDish(req.params.dishId)

            // send response
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(newDish.comments)
        } catch (error) {
            return next(error)
        }
    })
    .delete(auth.verifyUser, async (req, res, next) => {
        try {
            let dish = await getDish(req.params.dishId)

            if (!dish.comments.id(req.params.commentId)) {
                let err = new Error('Comment not found')
                err.status = 404
                return next(err)
            }

            let userId = req.user._id
            let authorId = dish.comments.id(req.params.commentId).author._id

            if (!userId.equals(authorId)) {
                let err = new Error('You are not authorized to perform this action')
                err.status = 403
                return next(err)
            }

            // delete comment
            dish.comments.id(req.params.commentId).remove()
            await dish.save()

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json({
                success: true,
                message: 'Comment deleted'
            })
        } catch (error) {
            return next(error)
        }
    })

module.exports = router