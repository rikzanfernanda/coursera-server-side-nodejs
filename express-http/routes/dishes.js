import express from 'express'
import {
    create,
    deleteAll,
    deleteById,
    getAll,
    getById,
    update
} from '../controller/DishesController.js'

const router = express.Router()

router.all('/', (req, res, next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next()
})

router.get('/', getAll)

router.get('/:dishId', getById)

router.post('/', create)

router.put('/:dishId', update)

router.delete('/', deleteAll)

router.delete('/:dishId', deleteById)

export default router