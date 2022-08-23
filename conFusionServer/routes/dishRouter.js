const express = require('express')
const Dishes = require('../models/dishes')

const dishRouter = express.Router()

dishRouter.get('/', async (req, res, next) => {
    try {
        const dishes = await Dishes.find({})
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(dishes)
    } catch (error) {
        // res.statusCode = 500
        // res.json({ error: err.message })
        // or
        return next(error)
    }
})

dishRouter.post('/', async (req, res, next) => {
    try {
        const dish = new Dishes(req.body)
        const result = await dish.save()
        res.statusCode = 201
        res.setHeader('Content-Type', 'application/json')
        res.json(result)
    } catch (error) {
        // res.statusCode = 500
        // res.json({ error: error.message })
        // or
        return next(error)
    }
})

dishRouter.delete('/', async (req, res, next) => {
    try {
        const result = await Dishes.deleteMany({})
        console.log(result)
        res.statusCode = 200
        res.json({
            message: 'Delete all dishes'
        })
    } catch (error) {
        // res.statusCode = 500
        // res.json({
        //     error: error.message
        // })
        return next(error)
    }
})

dishRouter.get('/:dishId', async (req, res, next) => {
    try {
        const dish = await Dishes.findById(req.params.dishId)
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(dish)
    } catch (error) {
        // res.statusCode = 500
        // res.json({ error: error.message })
        return next(error)
    }
})

dishRouter.post('/:dishId', (req, res) => {
    res.statusCode = 403
    res.end('POST operation not supported on /dishes/' + req.params.dishId)
})

dishRouter.put('/:dishId', async (req, res, next) => {
    try {
        const result = await Dishes.findByIdAndUpdate(req.params.dishId, {
            $set: req.body
        }, { new: true })
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(result)
    } catch (error) {
        // res.statusCode = 500
        // res.json({ error: error.message })
        return next(error)
    }
})

dishRouter.delete('/:dishId', async (req, res, next) => {
    try {
        const result = await Dishes.findByIdAndRemove(req.params.dishId)
        res.setHeader('Content-Type', 'application/json')
        if (result === null) {
            // res.statusCode = 404
            // res.json({
            //     message: 'data not found'
            // })
            let err = new Error('data not found')
            err.status = 404
            return next(err)
        }
        // status code 204 cannot contain body message, use 200 instead
        res.statusCode = 200
        res.json(result)
    } catch (error) {
        // res.statusCode = 500
        // res.json({ error: error.message })
        return next(error)
    }
})

// handling comments
dishRouter.route('/:dishId/comments')
    .get(async (req, res, next) => {
        try {
            const dish = await Dishes.findById(req.params.dishId)

            if (dish === null) {
                let err = new Error('data not found')
                err.status = 404
                return next(err)
            }

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(dish.comments)
        } catch (error) {
            return next(error)
        }
    })
    .post(async (req, res, next) => {
        try {
            const dish = await Dishes.findById(req.params.dishId)

            // ini tidak kepakai, why?
            // if (dish === null) {
            //     let err = new Error('data not found')
            //     err.status = 404
            //     return next(err)
            // }

            dish.comments.push(req.body)
            const newComment = await dish.save()

            res.statusCode = 201
            res.setHeader('Content-Type', 'application/json')
            res.json(newComment)
        } catch (error) {
            return next(error)
        }
    })

dishRouter.route('/:dishId/comments/:commentId')
    .get(async (req, res, next) => {
        try {
            const dish = await Dishes.findById(req.params.dishId)

            // tidak kepakai
            // if (dish === null) {
            //     let err = new Error(`Dish with id: ${req.params.dishId} not found`)
            //     err.status = 404
            //     return next(err)
            // }

            if (dish.comments.id(req.params.commentId) === null) {
                let err = new Error(`Comment with id: ${req.params.dishId} not found`)
                err.status = 404
                return next(err)
            }

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(dish.comments.id(req.params.commentId))
        } catch (error) {
            return next(error)
        }
    })
    .put(async (req, res, next) => {
        try {
            const dish = await Dishes.findById(req.params.dishId)

            if (dish.comments.id(req.params.commentId) === null) {
                let err = new Error(`Comment with id: ${req.params.dishId} not found`)
                err.status = 404
                return next(err)
            }

            if (req.body.rating) dish.comments.id(req.params.commentId).rating = req.body.rating
            if (req.body.comment) dish.comments.id(req.params.commentId).comment = req.body.comment
            if (req.body.author) dish.comments.id(req.params.commentId).author = req.body.author

            const result = await dish.save()
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(result)
        } catch (error) {
            return next(error)
        }
    })
    .delete(async (req, res, next) => {
        try {
            const dish = await Dishes.findById(req.params.dishId)

            if (dish.comments.id(req.params.commentId) === null) {
                let err = new Error(`Comment with id: ${req.params.dishId} not found`)
                err.status = 404
                return next(err)
            }

            dish.comments.id(req.params.commentId).remove()
            const result = await dish.save()
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(result)
        } catch (error) {
            return next(error)
        }
    })

module.exports = dishRouter