const mongoose = require('mongoose'),
    bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
})

userSchema.pre('save', async (next) => {
    try {
        const hashedPassword = await bcrypt.hash(this.password, 10)
        this.password = hashedPassword
        return next()
    } catch (err) {
        return next(err)
    }
})

userSchema.methods.isValidPassword = async (password) => {
    const user = this
    const isMatch = await bcrypt.compare(password, user.password)
    return isMatch
}

module.exports = mongoose.model('user', userSchema)