const mongoClient = require('mongodb').MongoClient
const assert = require('assert')
const opr = require('./operations')

const url = 'mongodb://127.0.0.1:27017'
const dbname = 'conFusion'

const client = new mongoClient(url)

// async example
const run = async () => {
    try {
        await client.connect()
        const db = client.db(dbname)

        const inserted = await opr.insertDocument(db, {
            name: 'Vadonut',
            description: 'Test'
        }, 'dishes')
        console.log(inserted.insertedId)
        
        const docs = await opr.showDocuments(db, 'dishes')
        console.log('after inserted: ', docs)

        await opr.updateDocument(db, {
            name: 'Vadonut'
        }, {
            description: 'Updated Test'
        }, 'dishes')

        const updatedDocs = await opr.showDocuments(db, 'dishes')
        console.log('after updated: ', updatedDocs)

        await db.dropCollection('dishes')

    } catch (error) {
        console.log(error)
    } finally {
        client.close()
    }
}

run()

// Callback example:
// mongoClient.connect(url, (err, client) => {
//     assert.equal(err, null)

//     console.log('Connected correctly to server')
    
//     const db = client.db(dbname)
//     const collection = db.collection('dishes')

//     opr.insertDocument(db, {
//         name: 'Test Name',
//         description: 'Test Description'
//     }, 'dishes', (result) => {
//         console.log(result.result)

//         opr.showDocuments(db, 'dishes', (docs) => {
//             console.log(docs)

//             opr.updateDocument(db, {
//                 name: 'Test Name'
//             }, {
//                 description: 'Updated Test Description'
//             }, 'dishes', (result) => {
//                 console.log(result.result)

//                 opr.showDocuments(db, 'dishes', (docs) => {
//                     console.log(docs)

//                     db.dropCollection('dishes', (result) => {
//                         console.log(result)
//                         client.close()
//                     })
//                 } )
//             })
//         })
//     })
// })