const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./models/user')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const FacebookTokenStrategy = require('passport-facebook-token');
const jwt = require('jsonwebtoken');
const config = require('./config');

const secretKey = '12345-qwertyuiop-67890'

exports.local = passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

exports.jwtPassport = passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secretKey
}, async (jwt_payload, done) => {
    console.log('payload:', jwt_payload)
    try {
        const user = await User.findById(jwt_payload._id)

        if (user) return done(null, user)
        else return done(null, false)
    } catch (error) {
        return done(error, false)
    }
}))

exports.getToken = (user) => {
    return jwt.sign(user, secretKey, {
        expiresIn: 3600 * 24 * 30
    })
}

exports.verifyUser = (req, res, next) => {
    return passport.authenticate('jwt', {
        session: false
    }, (err, user) => {
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

exports.facebookPassport = passport.use(new FacebookTokenStrategy({
    clientID: config.facebook.clientId,
    clientSecret: config.facebook.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
    console.log('accessToken:', accessToken)
    console.log('refreshToken:', refreshToken)
    console.log('profile:', profile)

    try {
        const user = await User.findOne({
            facebookId: profile.id
        })

        if (user) return done(null, user)
        else {
            const newUser = new User();
            newUser.username = profile.displayName
            newUser.facebookId = profile.id
            // user.firstname = profile.name.givenName
            // user.lastname = profile.name.familyName

            await newUser.save()
            return done(null, newUser)
        }
    } catch (error) {
        done(error, false)
    }
}))