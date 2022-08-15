const mongoose = require('mongoose')
require('mongoose-currency').loadType(mongoose)
const Currency = mongoose.Types.Currency

const PromoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('Promotion', PromoSchema)