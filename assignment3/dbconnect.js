const config = require('./config')
const mongoose = require('mongoose')

module.exports = async () => {
    try {
        await mongoose.connect(config.mongoUrl)

        console.log('Successfully connected to the database')
    } catch (error) {
        console.log('dbconnect:', error.message)
    }
}