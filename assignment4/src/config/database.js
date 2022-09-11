require('dotenv').config()
const mongoose = require('mongoose')

// module.exports = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URL)

//         console.log('Connected to database')
//     } catch (error) {
//         console.log('database:', error.message)
//     }
// }

module.exports = {
    mongoose,
    connect: async () => {
        try {
            mongoose.connect(process.env.NODE_ENV === 'test' ? process.env.MONGO_TEST_URL : process.env.MONGO_URL)

            console.log('Connected to database')
        } catch (error) {
            console.log('database:', error.message)
        }
    },
    disconnect: async () => {
        await mongoose.disconnect()
    }
}
