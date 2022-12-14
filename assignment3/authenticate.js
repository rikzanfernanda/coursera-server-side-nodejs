const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./models/user')
const config = require('./config')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const jwt = require('jsonwebtoken')

exports.local = passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

let options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secretKey
}

exports.jwtPassport = passport.use(new JwtStrategy(options, async (jwt_payload, done) => {
    // console.log('jwt_payload:', jwt_payload)
    try {
        let user = await User.findById(jwt_payload._id)

        if (user) return done(null, user)
        else return done(null, false)
    } catch (error) {
        return done(error, false)
    }
}))

exports.getToken = (user) => {
    return jwt.sign(user, config.secretKey, {
        expiresIn: 3600 * 24 * 30
    })
}

// exports.verifyUser = passport.authenticate('jwt', {
//     session: false
// })

// custom jwt verify function
exports.verifyUser = (req, res, next) => {
    return passport.authenticate('jwt', {
        session: false
    }, (err, user) => {
        // console.log('err:', err)
        // console.log('user:', user)
        if (err) {
            return next(err)
        }
        if (!user) {
            res.statusCode = 401
            res.setHeader('Content-Type', 'application/json')
            return res.json({
                success: false,
                message: 'Unauthorized'
            })
        }
        req.user = user
        next()
    })(req, res, next)
}

exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin) {
        next()
    } else {
        let err = new Error('You are not authorized to perform this operation!')
        err.status = 403
        return next(err)
    }
}

exports.verifyOrdinaryUser = (req, res, next) => {
    if (req.user.admin) {
        let err = new Error('You are not authorized to perform this operation!')
        err.status = 403
        return next(err)
    } else {
        next()
    }
}