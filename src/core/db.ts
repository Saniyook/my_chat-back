import mongoose from 'mongoose'


export default {
    connect() {
        mongoose.connect('mongodb://localhost:27017/chat', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }, (err) => {
            if (err)
                return console.log(err)
            console.log('Mongo connected')
        })

    }
}