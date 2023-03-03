import mongoose from 'mongoose'

const studentSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    avatarUrl: {
        type: String,
        required: true
    }
})

export = mongoose.model('Student', studentSchema)

