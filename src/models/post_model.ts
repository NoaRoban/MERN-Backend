import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    message:{
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    }
})

export = mongoose.model('Post',postSchema)