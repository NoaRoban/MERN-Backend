import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    refresh_tokens: {
        type: [String],
    },
    ImgUrl: {
        type: String,
    }
})

export = mongoose.model('User', userSchema)