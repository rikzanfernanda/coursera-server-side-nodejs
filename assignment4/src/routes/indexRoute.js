const express = require('express')

const router = express.Router()

router.route('/')
    .get((req, res) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json({
            success: true,
            message: 'Welcome to the home page'
        })
    })

module.exports = router
