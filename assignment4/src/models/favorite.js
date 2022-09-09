const mongoose = require('mongoose')

const favoriteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        unique: true
    },
    dishes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dish'
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model('favorite', favoriteSchema)
