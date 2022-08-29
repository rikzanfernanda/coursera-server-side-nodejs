const express = require('express')
const auth = require('../authenticate')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        console.log('file:', file)
        let ext = file.mimetype.split('/')[1]
        cb(null, file.fieldname + '-' + Date.now() + '.' + ext)
    }
})

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb(new Error('You can only upload image file!'), false)
        }

        cb(null, true)
    }
})

const uploadRouter = express.Router()

uploadRouter.route('/')
    .post(upload.single('imageFile'), (req, res) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(req.file)
    })

module.exports = uploadRouter