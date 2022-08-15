const express = require('express')
const Leaders = require('../model/leaders')

const leaderRouter = express.Router()

const getLeaderById = (id) => {
    // return new Promise((resolve, reject) => {
    //     Leaders.findById(id).then((leader) => {
    //         if (leader) {
    //             resolve(leader)
    //         } else {
    //             const error = new Error(`Leader with id ${id} not found`)
    //             error.status = 404
    //             reject(error)
    //         }
    //     }).catch((error) => {
    //         const err = new Error(error.message)
    //         err.status = 500
    //         reject(err)
    //     })
    // })

    // or
    return new Promise(async (resolve, reject) => {
        try {
            const leader = await Leaders.findById(id)

            if (leader) {
                resolve(leader)
            } else {
                const error = new Error(`Leader with id ${id} not found`)
                error.status = 404
                reject(error)
            }
        } catch (error) {
            const err = new Error(error.message)
            err.status = 500
            reject(err)
        }
    })
}

leaderRouter.route('/')
    .get(async (req, res) => {
        try {
            const leaders = await Leaders.find({})

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(leaders)
        } catch (error) {
            res.statusCode = 500
            res.json({ error: error.message })
        }
    })
    .post(async (req, res) => {
        try {
            const result = await Leaders.create(req.body)

            res.statusCode = 201
            res.setHeader('Content-Type', 'application/json')
            res.json(result)
        } catch (error) {
            res.statusCode = 500
            res.json({ error: error.message })
        }
    })
    .put((req, res) => {
        res.statusCode = 403
        res.end('PUT operation not supported on /leaders')
    })
    .delete((req, res) => {
        res.statusCode = 403
        res.end('DELETE operation not supported on /leaders')
    })

leaderRouter.route('/:leaderId')
    .get(async (req, res) => {
        try {
            const leader = await getLeaderById(req.params.leaderId)

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(leader)
        } catch (error) {
            res.statusCode = error.status
            res.json({ error: error.message })
        }
    })
    .post((req, res) => {
        res.statusCode = 403
        res.end('POST operation not supported on /leaders/' + req.params.leaderId)
    })
    .put(async (req, res) => {
        console.log('first')
        try {
            const leader = await getLeaderById(req.params.leaderId)
            
            if (req.body.name) leader.name = req.body.name
            if (req.body.description) leader.description = req.body.description
            if (req.body.image) leader.image = req.body.image
            if (req.body.designation) leader.designation = req.body.designation
            if (req.body.abbr) leader.abbr = req.body.abbr
            if (req.body.featured) leader.featured = req.body.featured

            const result = await leader.save()
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(result)
        } catch (error) {
            res.statusCode = error.status
            res.json({ error: error.message })
        }
    })
    .delete(async (req, res) => {
        try {
            const result = await getLeaderById(req.params.leaderId)
            await result.remove()

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(result)
        } catch (error) {
            res.statusCode = error.status
            res.json({ error: error.message })
        }
    })

module.exports = leaderRouter