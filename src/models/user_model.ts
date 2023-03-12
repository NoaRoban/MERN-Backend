import mongoose, { Schema } from 'mongoose'

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    imgUrl: {
        type: String,
        default: ''
    },
    posts: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Person' }],
        required: true,
        default: []
    },    
    refresh_tokens: {
        type: [String],
    },
},
{ timestamps: true
 })

export = mongoose.model('User', userSchema)