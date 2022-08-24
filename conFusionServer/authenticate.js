let passport = require('passport')
let LocalStrategy = require('passport-local').Strategy
let User = require('./models/user')

let JwtStrategy = require('passport-jwt').Strategy
let ExtractJwt = require('passport-jwt').ExtractJwt
let jwt = require('jsonwebtoken') // to create, sign and verify tokens

let config = require('./config')

exports.local = passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

exports.getToken = (user) => {
    return jwt.sign(user, config.secretKey, {
        expiresIn: 3600 * 24 * 30 // expires in 30 days
    })
}

let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = config.secretKey

exports.jwtPassport = passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    console.log('JWT payload:', jwt_payload)
    try {
        let user = await User.findOne({_id: jwt_payload._id})
        if (user) {
            return done(null, user)
        } else {
            return done(null, false)
        }
    } catch (error) {
        return done(error, false)
    }
}))

exports.verifyUser = passport.authenticate('jwt', {
    session: false
})