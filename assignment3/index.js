const express = require('express')
const bodyParser = require('body-parser')
const dbconnect = require('./dbconnect')
const passport = require('passport')
const session = require('express-session')
const config = require('./config')
const userRouter = require('./routes/userRouter')
const dishRouter = require('./routes/dishRouter')
const promoRouter = require('./routes/promoRouter')
const leaderRouter = require('./routes/leaderRouter')

dbconnect()

const app = express()

app.use(bodyParser.json())
app.use(session({
    name: 'session-id',
    secret: config.secretKey,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

// routes
app.use('/users', userRouter)
app.use('/dishes', dishRouter)
app.use('/promotions', promoRouter)
app.use('/leaders', leaderRouter)

// handle errors
app.use((err, req, res, next) => {
    res.setHeader('Content-Type', 'application/json')
    res.status(err.status || 500)
    res.json({
        success: false,
        // error: 'Internal server error'
        error: err.message
    })
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})