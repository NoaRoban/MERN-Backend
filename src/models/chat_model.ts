import mongoose from 'mongoose'

const chatSchema = new mongoose.Schema({
    from:{
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    message:{
        type: String,
        required: true
    }
})

export = mongoose.model('Chat',chatSchema)