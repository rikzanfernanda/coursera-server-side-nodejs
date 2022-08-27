const express = require('express')
const Leader = require('../models/leader')
const auth = require('../authenticate')

const router = express.Router()

const getLeaderById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const leader = await Leader.findById(id)

            if (leader) {
                resolve(leader)
            } else {
                let error = new Error(`Leader with id ${id} not found`)
                error.status = 404
                reject(error)
            }
        } catch (error) {
            return reject(error)
        }
    })
}

router.route('/')
    .get(async (req, res, next) => {
        try {
            const leaders = await Leader.find({})

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json({
                success: true,
                data: leaders
            })
        } catch (error) {
            return next(error)
        }
    })
    .post(auth.verifyUser, auth.verifyAdmin, async (req, res, next) => {
        try {
            let leader = new Leader()
            leader.name = req.body.name
            leader.image = req.body.image
            leader.designation = req.body.designation
            leader.abbr = req.body.abbr
            leader.description = req.body.description
            leader.featured = req.body.featured

            const response = await leader.save()

            res.statusCode = 201
            res.setHeader('Content-Type', 'application/json')
            res.json({
                success: true,
                message: 'Successfully created new leader',
                data: response
            })
        } catch (error) {
            return next(error)
        }
    })

router.route('/:leaderId')
    .get(async (req, res, next) => {
        try {
            const leader = await getLeaderById(req.params.leaderId)

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json({
                success: true,
                data: leader
            })
        } catch (error) {
            return next(error)
        }
    })
    .put(auth.verifyUser, auth.verifyAdmin, async (req, res, next) => {
        try {
            let leader = await getLeaderById(req.params.leaderId)

            if (req.body.name) leader.name = req.body.name
            if (req.body.image) leader.image = req.body.image
            if (req.body.designation) leader.designation = req.body.designation
            if (req.body.abbr) leader.abbr = req.body.abbr
            if (req.body.description) leader.description = req.body.description
            if (req.body.featured) leader.featured = req.body.featured

            const response = await leader.save()

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json({
                success: true,
                message: 'Successfully updated leader',
                data: response
            })
        } catch (error) {
            return next(error)
        }
    })
    .delete(auth.verifyUser, auth.verifyAdmin, async (req, res, next) => {
        try {
            let leader = await getLeaderById(req.params.leaderId)

            await leader.remove()

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json({
                success: true,
                message: 'Successfully deleted leader'
            })
        } catch (error) {
            return next(error)
        }
    })

module.exports = router