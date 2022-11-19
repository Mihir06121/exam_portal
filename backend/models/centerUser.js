const mongoose = require('mongoose')
const crypto = require('crypto')
const {ObjectId} = mongoose.Schema

const centerUserSchema = new mongoose.Schema({
    ownerName: {
        type: String,
        trim: true,
        required: true
    },
    ownerMobileNumber: {
        type: String,
        required: true
    },
    ownerWhatsAppNumber: {
        type: String,
        required: true
    },
    ownerEmail: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true
    },
    managerName: {
        type: String,
    },
    managerMobileNumber: {
        type: String,
    },
    managerWhatsAppNumber: {
        type: String,
    },
    managerEmail: {
        type: String,
        trim: true,
        lowercase: true
    },
    isAssigned: {
        type: Boolean,
        default: false
    },
    registeredBy: {
        type: ObjectId, ref: "User",
        required: true
    },
    hashed_password: {
        type: String,
        required: true,
    },
    salt:String
}, {timestamps: true})

centerUserSchema
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

    centerUserSchema.methods = {
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
    
    module.exports = mongoose.model('CenterUser', centerUserSchema);