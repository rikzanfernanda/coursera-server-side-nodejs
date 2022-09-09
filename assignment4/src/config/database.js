require('dotenv').config()
const mongoose = require('mongoose')

module.exports = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)

        console.log('Connected to database')
    } catch (error) {
        console.log('database:', error.message)
    }
}
