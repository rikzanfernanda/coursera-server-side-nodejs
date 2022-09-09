require('module-alias/register')
const express = require('express')
const Favorite = require('@models/favorite')
const auth = require('@config/auth')

const router = express.Router()

router.route('/')
    .get(auth.verifyUser, async (req, res, next) => {
        try {
            const favorite = await Favorite.findOne({
                user: req.user._id
            }).populate('dishes').populate('user')

            if (!favorite) {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json({
                    success: true,
                    message: 'You have no favorite dishes'
                })
                return
            }

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json({
                success: true,
                data: favorite
            })
        } catch (error) {
            next(error)
        }
    })
    .post(auth.verifyUser, async (req, res, next) => {
        try {
            const favorite = await Favorite.findOne({
                user: req.user._id
            })

            if (!favorite) {
                const newFavorite = new Favorite()
                newFavorite.user = req.user._id
                req.body.forEach(dish => {
                    newFavorite.dishes.push(dish._id)
                })

                const favoriteSave = await newFavorite.save()

                res.statusCode = 201
                res.setHeader('Content-Type', 'application/json')
                res.json({
                    success: true,
                    message: 'Successfully created favorite',
                    data: favoriteSave.dishes
                })
            } else {
                req.body.forEach(dish => {
                    const dishesId = favorite.dishes.map(dish => dish._id.toString())
                    if (dishesId.indexOf(dish._id) === -1) {
                        favorite.dishes.push(dish._id)
                    }
                })

                const favoriteSave = await favorite.save()

                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json({
                    success: true,
                    message: 'Successfully updated favorite',
                    data: favoriteSave.dishes
                })
            }
        } catch (error) {
            next(error)
        }
    })
    .delete(auth.verifyUser, async (req, res, next) => {
        try {
            const favorite = await Favorite.findOne({
                user: req.user._id
            })

            if (!favorite) {
                res.statusCode = 404
                res.setHeader('Content-Type', 'application/json')
                res.json({
                    success: false,
                    message: 'You have no favorite dishes'
                })
                return
            }

            await favorite.remove()

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json({
                success: true,
                message: 'Successfully deleted favorite'
            })
        } catch (error) {
            next(error)
        }
    })

router.route('/:dishId')
    .post(auth.verifyUser, async (req, res, next) => {
        try {
            const favorite = await Favorite.findOne({
                user: req.user._id
            })

            if (!favorite) {
                const newFavorite = new Favorite()
                newFavorite.user = req.user._id
                newFavorite.dishes.push(req.params.dishId)

                const favoriteSave = await newFavorite.save()

                res.statusCode = 201
                res.setHeader('Content-Type', 'application/json')
                res.json({
                    success: true,
                    message: 'Successfully created favorite',
                    data: favoriteSave
                })

                return
            }

            const dishesId = favorite.dishes.map(dish => dish._id.toString())
            if (dishesId.indexOf(req.params.dishId) === -1) {
                favorite.dishes.push(req.params.dishId)
            }

            const favoriteSave = await favorite.save()

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json({
                success: true,
                message: 'Successfully updated favorite',
                data: favoriteSave
            })
        } catch (error) {
            next(error)
        }
    })
    .delete(auth.verifyUser, async (req, res, next) => {
        try {
            const favorite = await Favorite.findOne({
                user: req.user._id
            })

            if (!favorite) {
                res.statusCode = 404
                res.setHeader('Content-Type', 'application/json')
                res.json({
                    success: false,
                    message: 'You have no favorite dishes'
                })
                return
            }

            const dishesId = favorite.dishes.map(dish => dish._id.toString())
            const dishIndex = dishesId.indexOf(req.params.dishId)
            if (dishIndex === -1) {
                res.statusCode = 404
                res.setHeader('Content-Type', 'application/json')
                res.json({
                    success: false,
                    message: 'Dish not found'
                })
                return
            }

            favorite.dishes.splice(dishIndex, 1)

            const favoriteSave = await favorite.save()

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json({
                success: true,
                message: 'Successfully deleted favorite',
                data: favoriteSave
            })
        } catch (error) {
            next(error)
        }
    })

module.exports = router
