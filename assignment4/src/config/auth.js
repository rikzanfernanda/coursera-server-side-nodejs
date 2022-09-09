require('module-alias/register')
require('dotenv').config()
const passport = require('passport')
const User = require('@models/user')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const jwt = require('jsonwebtoken')

passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email })

        if (!user) return done(null, false, { message: 'User not found' })

        const validate = await user.isValidPassword(password)

        if (!validate) return done(null, false, { message: 'Password is incorrect' })

        return done(null, user, { message: 'Logged in successfully' })
    } catch (error) {
        return done(error, false, { message: 'Something went wrong' })
    }
}))

passport.use('jwt', new JwtStrategy({
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}, async (jwtPayload, done) => {
    try {
        const user = await User.findById(jwtPayload._id)

        if (!user) return done(null, false)

        return done(null, user)
    } catch (error) {
        done(error, false)
    }
}))

exports.login = (req, res, next) => {
    return passport.authenticate('login', { session: false }, (err, user, info) => {
        // console.log('info: ', info)
        if (err) return next(err)

        if (!user) {
            const error = new Error(info.message)
            error.status = 401
            return next(error)
        }

        req.user = user
        next()
    })(req, res, next)
}

exports.getToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: 3600 * 24 * 30
    })
}

exports.verifyUser = (req, res, next) => {
    return passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err) return next(err)

        if (!user) {
            const error = new Error('Unauthorized')
            error.status = 401
            return next(error)
        }

        req.user = user
        next()
    })(req, res, next)
}

exports.verifyAdmin = (req, res, next) => {
    if (!req.user.admin) {
        const error = new Error('You are not authorized to perform this operation!')
        error.status = 403
        return next(error)
    }

    next()
}
