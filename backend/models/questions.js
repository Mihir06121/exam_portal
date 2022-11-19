const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const questionSchema = new mongoose.Schema({
    questionData: {
        type: String,
        required: true
    },
    options: [{
        name: {
            type: String,
            required: true
        }
    }],
    optionCorrect: {
        type: String,
        required: true
    },
    course: {
        type: ObjectId,
        ref: 'Courses',
        required: true
    },
    isActivated: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Question', questionSchema)