const mongoose = require('mongoose')
const Dishes = require('./model/dishes')

const url = 'mongodb://localhost:27017/conFusion'

const main = async () => {
    try {
        await mongoose.connect(url)
        console.log('Connected correctly to server')

        let newDish = new Dishes({
            name: 'Test Name2',
            description: 'Test Description'
        })

        let result = await newDish.save()
        console.log('saved', result)

        const updated = await Dishes.findByIdAndUpdate(result._id, {
            $set: {
                description: 'Updated Test Description'
            }
        }, {
            new: true
        })
        console.log(updated)

        newDish.comments.push({
            rating: 5,
            comment: 'Wowwww',
            author: 'Joseph Muppala'
        })

        await newDish.save()

        const dishes = await Dishes.find({})
        console.log(dishes)
        console.log(dishes[0].comments[0])

        await Dishes.collection.drop()

    } catch (error) {
        console.log(error.message)
    } finally {
        mongoose.connection.close()
    }
}

main()