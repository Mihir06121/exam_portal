const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const resultSchema = new mongoose.Schema({
    testRawData: [{
        questionId: {
            type: ObjectId,
            ref: 'questions'
        },
        isAttempted: {
            type: Boolean,
            default: false
        },
        isCorrect: {
            type: Boolean,
            default: false
        },
        optionSelected: {
            type: String,
        }
    }],
    studentId: {
        type: ObjectId,
        ref: 'students',
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    course: {
        type: ObjectId,
        ref: 'courses',
        required: true
    }
})

module.exports = mongoose.model('Results', resultSchema)