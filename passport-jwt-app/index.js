const express = require('express'),
    bodyParser = require('body-parser'),
    homeRouter = require('./routes/homeRouter'),
    dbconnect = require('./dbconnect'),
    userRouter = require('./routes/userRouter')

dbconnect()

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// routes
app.use('/', homeRouter)
app.use('/users', userRouter)

// handle errors
app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.json({
        error: err.message
    })
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})