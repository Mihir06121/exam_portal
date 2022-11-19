const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const centerSchema = new mongoose.Schema({
    centerName: {
        type: String,
        required: true
    },
    centerFullAddress: {
        type: String,
        requried: true
    },
    centerLocationState: {
        type: String,
        required: true
    },
    centerLocationCity: {
        type: String,
        required: true
    },
    numberOfClassRooms: {
        type: Number,
        required: true
    },
    capacityOfClass: {
        type: Number,
        required: true
    },
    nameOfCompany: {
        type: String,
        requried: true
    },
    businessProof: {
        type: Object,
    },
    panCard: {
        type: Object,
    },
    assignedTo: {
        type: ObjectId, ref: "CenterUser"
    },
    createdBy: {
        type: ObjectId, ref: "User"
    }
}, {timestamps: true})

module.exports = mongoose.model('Center', centerSchema)