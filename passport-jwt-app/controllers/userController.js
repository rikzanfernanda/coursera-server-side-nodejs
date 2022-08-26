const User = require('../models/userModel')

exports.store = async (req, res, next) => {
    try {
        console.log('req.body', req.body)
        next()
    } catch (error) {
        
    }
}