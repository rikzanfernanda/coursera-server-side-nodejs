import express from 'express'
import bodyParser from 'body-parser'
import dishRouter from './routes/dishRouter.js'
import promoRouter from './routes/promoRouter.js'
import leaderRouter from './routes/leaderRouter.js'

const port = 3000

const app = express()

app.use(bodyParser.json())

app.use('/dishes', dishRouter)

app.use('/promotions', promoRouter)

app.use('/leaders', leaderRouter)

app.all('*', (req, res) => {
    res.statusCode = 404
    res.setHeader('Content-Type', 'text/plain')
    res.end('Page Not found, hallo')
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`)
})

export default app