const mongoose = require('mongoose')
const config = require('./config')

module.exports = async () => {
    try {
        await mongoose.connect(config.mongoUrl)

        console.log('Successfully connected to the database');
    } catch (error) {
        console.log('connect database:', error.message)
    }
}