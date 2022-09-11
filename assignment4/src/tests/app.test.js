require('module-alias/register')
const request = require('supertest')
const database = require('@config/database')
const app = require('@/app')

describe('Test the root app', () => {
    afterAll(async () => {
        await database.disconnect()
    })

    test('Status code response should be 200', async () => {
        const response = await request(app).get('/')
        expect(response.statusCode).toBe(200)
    })

    test('Response body should have correct property and value', async () => {
        const response = await request(app).get('/')
        expect(response.body).toHaveProperty('success', true)
        expect(response.body).toHaveProperty('message', 'Welcome to the home page')
    })

    test('Status code response should be 404', async () => {
        const response = await request(app).post('/')
        expect(response.statusCode).toBe(404)
    })
})
