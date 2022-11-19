const mongoose = require('mongoose')
const crypto = require('crypto')
const {ObjectId} = mongoose.Schema

const studentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    middleName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true,
        max: 10,
        min: 10
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true
    },
    fullAddress: {
        type: String,
    },
    cityName: {
        type: String,
    },
    adhaarCard: {
        type: Object,
    },
    panCard: {
        type: Object,
    },
    tenthMarkSheet: {
        type: Object,
    },
    twelfthMarsheet: {
        type: Object,
    },
    graduationCertificate: {
        type: Object,
    },
    selectedCourse: {
        type: ObjectId, ref: "courses",
        required: true
    },
    isSubscribed: {
        type: Boolean,
        default: false
    },
    appeard: {
        type: Boolean,
        default: false
    },
    completed: {
        type: Boolean,
        default: false
    },
    hashed_password: {
        type: String,
        required: true,
    },
    registeredBy: {
        type: ObjectId, ref: "centers",
        required: true
    },
    salt: String
},{timestamps: true})

studentSchema
    .virtual('password')
    .set(function(password) {
        // create a temporarity variable called _password
        this._password = password;
        // generate salt
        this.salt = this.makeSalt();
        // encryptPassword
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

    studentSchema.methods = {
        authenticate: function(plainText) {
            return this.encryptPassword(plainText) === this.hashed_password;
        },

        encryptPassword: function(password) {
            if (!password) return '';
            try {
                return crypto
                    .createHmac('sha1', this.salt)
                    .update(password)
                    .digest('hex');
            } catch (err) {
                return '';
            }
        },
        makeSalt: function() {
            return Math.round(new Date().valueOf() * Math.random()) + '';
        }
    };
    
module.exports = mongoose.model('Student', studentSchema);