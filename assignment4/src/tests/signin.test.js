const app = require('@/app')
const request = require('supertest')
const database = require('@config/database')
const User = require('@models/user')

const data = {
    email: 'admin@gmail.com',
    password: 'admin'
}

const signin = (data) => {
    return new Promise((resolve, reject) => {
        request(app).post('/users/login').send(data)
            .then((res) => resolve(res))
            .catch((err) => reject(err))
    })
}

describe('Login user', () => {
    beforeAll(async () => {
        await User.create({
            name: 'Admin',
            email: 'admin@gmail.com',
            password: 'admin'
        })
    })

    afterAll(async () => {
        await User.collection.drop()
        await database.disconnect()
    })

    test('Status code response should be 200', async () => {
        const response = await signin(data)
        expect(response.statusCode).toBe(200)
    })

    test('Response body should have correct property and value', async () => {
        const response = await signin(data)

        expect(response.body).toHaveProperty('success', true)
        expect(response.body).toHaveProperty('message', 'Logged in successfully')
        expect(response.body).toHaveProperty('token')
        expect(response.body).toHaveProperty('user')
    })

    test('Login failed with wrong email and status code response should be 401', async () => {
        const response = await signin({
            email: 'admin123@gmail.com',
            password: 'admin'
        })

        expect(response.statusCode).toBe(401)
        expect(response.body).toHaveProperty('success', false)
        expect(response.body).toHaveProperty('message', 'User not found')
    })

    test('Login failed with wrong password and status code response should be 401', async () => {
        const response = await signin({
            email: 'admin@gmail.com',
            password: 'admin123'
        })

        expect(response.statusCode).toBe(401)
        expect(response.body).toHaveProperty('success', false)
        expect(response.body).toHaveProperty('message', 'Password is incorrect')
    })

    test('Login failed with empty email and status code response should be 401', async () => {
        const response = await signin({
            email: '',
            password: 'admin'
        })

        expect(response.statusCode).toBe(401)
        expect(response.body).toHaveProperty('success', false)
    })

    test('Login failed with empty password and status code response should be 401', async () => {
        const response = await signin({
            email: 'admin@gmail.com',
            password: ''
        })

        expect(response.statusCode).toBe(401)
        expect(response.body).toHaveProperty('success', false)
    })
})
