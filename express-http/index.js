import express from 'express'
import morgan from 'morgan'

const hostname = 'localhost'
const port = 3000

const app = express()

app.use(morgan('dev'))

app.use(express.static('public'))

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
})

export default app