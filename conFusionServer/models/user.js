let mongoose = require('mongoose')
let passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
    admin: {
        type: Boolean,
        default: false
    },
    facebookId: {
        type: String
    }
})

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', userSchema)