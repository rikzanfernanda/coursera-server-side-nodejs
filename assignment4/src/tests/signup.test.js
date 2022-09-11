const app = require('@/app')
const request = require('supertest')
const database = require('@config/database')
const User = require('@models/user')

const data = {
    name: 'Admin',
    email: 'admin@gmail.com',
    password: 'admin'
}

const signup = (data) => {
    return new Promise((resolve, reject) => {
        request(app).post('/users/signup').send(data)
            .then((res) => resolve(res))
            .catch((err) => reject(err))
    })
}

describe('Register new user', () => {
    afterEach(async () => {
        await User.deleteMany()
    })

    afterAll(async () => {
        await User.collection.drop()
        await database.disconnect()
    })

    test('Status code response should be 201', async () => {
        const response = await signup(data)

        expect(response.statusCode).toBe(201)
    })

    test('Response body should have correct property and value', async () => {
        const response = await signup(data)

        expect(response.body).toHaveProperty('success', true)
        expect(response.body).toHaveProperty('message', 'User created successfully')
        expect(response.body).toHaveProperty('user')
    })

    test('User data should be in the database', async () => {
        const response = await signup(data)

        const user = await User.findOne({
            email: data.email
        })

        expect(user).not.toBeNull()
        expect(user).toHaveProperty('name', data.name)
        expect(user).toHaveProperty('email', data.email)
        expect(user).toHaveProperty('password')
        expect(user).toHaveProperty('admin', false)
    })

    test('Name field is required and success response should be false', async () => {
        const response = await signup({
            name: '',
            email: 'admin@gmail.com',
            password: 'admin'
        })

        expect(response.statusCode).toBe(500)
        expect(response.body).toHaveProperty('success', false)
    })

    test('Email field is required and success response should be false', async () => {
        const response = await signup({
            name: 'Admin',
            email: '',
            password: 'admin'
        })

        expect(response.statusCode).toBe(500)
        expect(response.body).toHaveProperty('success', false)
    })

    test('Email should be unique', async () => {
        await signup(data)
        const response = await signup(data)

        expect(response.statusCode).toBe(500)
        expect(response.body).toHaveProperty('success', false)
    })
})
