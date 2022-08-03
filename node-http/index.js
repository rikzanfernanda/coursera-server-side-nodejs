const http = require('http')
const fs = require('fs')
const path = require('path')

const hostname = 'localhost'
const port = 3000

const server = http.createServer((req, res) => {
    // console.log('headers', req.headers)
    console.log(req.method, req.url)
    
    if (req.method === 'GET') {
        let fileUrl;

        res.setHeader('Content-Type', 'text/html')

        if (req.url === '/') fileUrl = '/index.html'
        else fileUrl = req.url

        console.log('fileUrl:', fileUrl)

        let filePath = path.resolve('./public' + fileUrl)
        console.log('filePath:', filePath)

        let fileExt = path.extname(filePath)
        console.log('fileExt:', fileExt)

        if (fileExt === '.html') {
            fs.exists(filePath, (exists) => {
                console.log('exists:', exists)
                if (!exists) {
                    res.statusCode = 404
                    res.end('<html><body><h1>Error 404: ' + fileUrl + ' not found</h1></body></html>')
                    return
                }

                res.statusCode = 200
                fs.createReadStream(filePath).pipe(res)

            })
        } else {
            res.statusCode = 404
            res.end('<html><body><h1>Error 404: ' + fileUrl + ' not a HTML file</h1></body></html>')
        }
    } else {
        res.statusCode = 404
        res.end('<html><body><h1>Error 404: ' + req.method + ' not supported</h1></body></html>')
    }
})

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
})