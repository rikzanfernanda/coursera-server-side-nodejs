const express = require('express'),
    userController = require('../controllers/userController')

const userRouter = express.Router()

userRouter.post('/signup', userController.store)

module.exports = userRouter