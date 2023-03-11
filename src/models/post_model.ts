import mongoose, { Schema } from 'mongoose'

const postSchema = new mongoose.Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    imageUrl: {
        type: String,
        required: false,
        default: ''
    },
    text: {
        type: String,
        required: true,
    },
    
},  { timestamps: true })

export = mongoose.model('Post',postSchema)