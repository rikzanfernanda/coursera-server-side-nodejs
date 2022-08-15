const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const promoRouter = require('./routes/promoRouter')
const leaderRouter = require('./routes/leaderRouter')

const url = 'mongodb://localhost:27017/conFusion'
const port = 3000

mongoose.connect(url).then(() => {    
    console.log('Successfully connected to the database');
}).catch(err => {
    console.log(err.message);
})

const app = express()

app.use(bodyParser.json())

app.use('/promotions', promoRouter)

app.use('/leaders', leaderRouter)

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

module.exports = app