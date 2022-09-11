const cors = require('cors')

exports.corsWithOptions = cors({
    origin: [
        'http://localhost',
        'https://www.google.com'
    ]
})

exports.cors = cors()
