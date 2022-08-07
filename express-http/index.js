import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import dishesRouter from './routes/dishes.js'

const hostname = 'localhost'
const port = 3000

const app = express()

app.use(bodyParser.json())

app.use(morgan('dev'))

app.get('/', (req, res) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    res.end('Hello World!')
})
app.use('/dishes', dishesRouter)
app.all('*', (req, res) => {
    res.statusCode = 404
    res.setHeader('Content-Type', 'text/plain')
    res.end('Page Not found')
})

app.use(express.static('public'))

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
})

export default app