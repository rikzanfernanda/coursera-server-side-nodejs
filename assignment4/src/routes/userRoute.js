require('module-alias/register')
const express = require('express')
const User = require('@models/user')
const auth = require('@config/auth')

const router = express.Router()

router.get('/', auth.verifyUser, auth.verifyAdmin, async (req, res, next) => {
    try {
        let users = await User.find({})

        users = users.map(user => {
            return {
                _id: user._id,
                name: user.name,
                email: user.email,
                admin: user.admin,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        })

        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json({
            success: true,
            data: users
        })
    } catch (error) {
        next(error)
    }
})

router.post('/signup', async (req, res, next) => {
    try {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })

        const userSave = await newUser.save()

        res.statusCode = 201
        res.setHeader('Content-Type', 'application/json')
        res.json({
            success: true,
            message: 'User created successfully',
            user: {
                name: userSave.name,
                email: userSave.email,
                admin: userSave.admin
            }
        })
    } catch (error) {
        next(error)
    }
})

router.post('/login', auth.login, (req, res, next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.json({
        success: true,
        message: 'Logged in successfully',
        token: auth.getToken({ _id: req.user._id }),
        user: {
            name: req.user.name,
            email: req.user.email,
            admin: req.user.admin
        }
    })
})

module.exports = router
