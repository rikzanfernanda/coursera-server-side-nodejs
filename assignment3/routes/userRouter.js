const express = require('express')
const User = require('../models/user')
const auth = require('../authenticate')
const passport = require('passport')

const router = express.Router()

router.get('/', auth.verifyUser, auth.verifyAdmin, async (req, res, next) => {
    try {
        const users = await User.find({})

        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(users)
    } catch (error) {
        let err = new Error('Failed to retrieve users')
        err.status = 500
        return next(err)
    }
})

router.post('/signup', (req, res, next) => {
    let user = new User({
        username: req.body.username,
        name: req.body.name
    })

    User.register(user, req.body.password, (err, user) => {
        if (err) {
            err.status = 500
            return next(err)
        }

        passport.authenticate('local')(req, res, () => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json({
                success: true,
                message: 'Registration Successful!',
                user: {
                    '_id': user._id,
                    'username': user.username,
                    'name': user.name
                }
            })
        })
    })
})

router.post('/login', passport.authenticate('local'), (req, res) => {
    let token = auth.getToken({
        '_id': req.user._id
    })
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.json({
        success: true,
        message: 'Login successful!',
        token: token,
        user: {
            '_id': req.user._id,
            'username': req.user.username,
            'name': req.user.name
        }
    })
})

module.exports = router