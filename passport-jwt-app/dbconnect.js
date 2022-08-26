const config = require('./config'),
    mongoose = require('mongoose')

module.exports = async () => {
    try {
        await mongoose.connect(config.mongoUrl)
        console.log('Connected to mongoDB')
    } catch (error) {
        console.log(error.message)
    }
}