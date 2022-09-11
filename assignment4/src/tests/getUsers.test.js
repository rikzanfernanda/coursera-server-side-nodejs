const app = require('@/app')
const request = require('supertest')
const database = require('@config/database')
const User = require('@models/user')

let token

const getUsers = (token) => {
    return new Promise((resolve, reject) => {
        request(app)
            .get('/users/')
            .set('Authorization', `bearer ${token}`)
            .then((res) => resolve(res))
            .catch((err) => reject(err))
    })
}

describe('Get all users', () => {
    beforeAll(async () => {
        await User.create({
            name: 'User',
            email: 'user@gmail.com',
            password: 'user'
        })

        const newUser = await User.create({
            name: 'Admin',
            email: 'admin@gmail.com',
            password: 'admin'
        })

        const user = await User.findById(newUser._id)
        user.admin = true
        await user.save()

        const { body } = await request(app)
            .post('/users/login')
            .send({
                email: 'admin@gmail.com',
                password: 'admin'
            })

        token = body.token
    })

    afterAll(async () => {
        await User.collection.drop()
        await database.disconnect()
    })

    test('Status code response should be 200', async () => {
        const { statusCode } = await getUsers(token)

        expect(statusCode).toBe(200)
    })

    test('Response body should have correct property and value', async () => {
        const response = await getUsers(token)

        expect(response.body).toHaveProperty('success', true)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toEqual(
            expect.arrayContaining([expect.any(Object)])
        )
    })

    test('Should response unathorized', async () => {
        const response = await getUsers('')

        expect(response.statusCode).toBe(401)
        expect(response.body).toHaveProperty('success', false)
        expect(response.body).toHaveProperty('message', 'Unauthorized')
    })

    test('Should response forbidden for non-admin user', async () => {
        const { body } = await request(app)
            .post('/users/login')
            .send({
                email: 'user@gmail.com',
                password: 'user'
            })

        const response = await getUsers(body.token)

        expect(response.statusCode).toBe(403)
        expect(response.body).toHaveProperty('success', false)
        expect(response.body).toHaveProperty('message', 'You are not authorized to perform this operation!')
    })
})
