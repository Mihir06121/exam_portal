const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true,
    },
    courseType: {
        type: String,
        required: true
    },
    examDuration: {
        type: String,
        required: true
    },
    coursePrice: {
        type: String,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('Course', courseSchema)