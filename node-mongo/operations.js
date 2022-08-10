const assert = require('assert')

exports.insertDocument = (db, document, collection) => {
    const coll = db.collection(collection)
    return coll.insertOne(document)
}

exports.showDocuments = (db, collection) => {
    const coll = db.collection(collection)
    return coll.find({}).toArray()
}

exports.updateDocument = (db, document, update, collection) => {
    const coll = db.collection(collection)
    return coll.updateOne(document, {
        $set: update
    }, null)
}

exports.removeDocument = (db, document, collection) => {
    const coll = db.collection(collection)
    return coll.deleteOne(document)
}