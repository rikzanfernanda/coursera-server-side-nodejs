const mongoClient = require('mongodb').MongoClient
const assert = require('assert')

const url = 'mongodb://127.0.0.1:27017'
const dbname = 'conFusion'

mongoClient.connect(url, (err, client) => {
    assert.equal(err, null)

    console.log('Connected correctly to server')
    
    const db = client.db(dbname)
    const collection = db.collection('dishes')

    collection.find({}).toArray((err, result) => {
        assert.equal(err, null)
        console.log(result)
    })

    collection.insertOne({
        name: 'Nama Test',
        description: 'Deskripsi Test'
    }, (err, result) => {
        assert.equal(err, null)
        console.log('After Insert:')
        console.log(result.insertedId)

        collection.find({}).toArray((err, result) => {
            assert.equal(err, null)
            console.log(result)

            db.dropCollection('dishes', (err, result) => {
                assert.equal(err, null)
                client.close()
            })
        })
    })
})