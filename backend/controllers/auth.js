const User = require('../models/users')
const jwt = require('jsonwebtoken')
const CenterUser = require('../models/centerUser')
exports.register = (req, res) => {
    console.log(req.body)
    User.findOne({
        email: req.body.email
    }).exec((err, user) => {
        if (user) {
            return res.status(400).send({
                error: 'User with this email already exists',
            })
        }

        const {firstName, lastName, middleName, email, password} = req.body

        let newUser = new User({firstName, lastName, middleName, email, password})
        newUser.save((err, success) => {
            if (err || !success) {
                return res.status(400).json({
                    error: err
                })
            }
            const token = jwt.sign({ _id: success._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

            res.cookie('token', token, { expiresIn: '1d' });
            const { _id, firstName, lastName, middleName, email, role} = success;
            return res.json({
                token,
                user: { _id, firstName, lastName, middleName, email, role}
            });
        })
    })
}

exports.login = (req, res) => {
    User.findOne({email: req.body.email}).exec((err, user) => {
        if (err || !user) {
            return res.status(400).send({
                error: 'User with this email does not exists'
            })
        }
        if(!user.authenticate(req.body.password)){
            return res.status(400).json({
                error: "Password doesn't Match"
            })
        }
        if (user.role === 0) {
            return res.status(400).json({
                error: "You are deactivated"
            })
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie('token', token, { expiresIn: '1d' });
        const { _id, firstName, lastName, middleName, email, role} = user;
        return res.json({
            token,
            user: { _id, firstName, lastName, middleName, email, role}
        });
    })
}

exports.loginSubAdmin = (req, res) => {
    CenterUser.findOne({ownerEmail: req.body.email}).exec((err, user) => {
        if (err || !user) {
            return res.status(400).send({
                error: 'User with this email does not exists'
            })
        }
        if(!user.authenticate(req.body.password)){
            return res.status(400).json({
                error: "Password doesn't Match"
            })
        }
        if (user.isAssigned === false) {
            return res.status(400).json({
                error: "You are not assigned any center"
            })
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie('token', token, { expiresIn: '1d' });
        const { _id, ownerName, ownerMobileNumber, ownerWhatsAppNumber, ownerEmail, managerName, managerMobileNumber, managerWhatsAppNumber, managerEmail, createdBy,  registeredBy, role = 0} = user;
        return res.json({
            token,
            user: { _id, ownerName, ownerMobileNumber, ownerWhatsAppNumber, ownerEmail, managerName, managerMobileNumber, managerWhatsAppNumber, managerEmail, createdBy, registeredBy, role}
        });
    })
}

exports.getAdminListUser = (req, res) => {
    if (req.params.userRole === "2") {
        User.find()
        .select('firstName lastName middleName role email adhaarCard panCard cv CancelledCheque cityName fullAddress')
        .exec((err, success) => {
            if (err || !success) {
                return res.status(400).json({
                    error: "Something went wrong"
                })
            }
            res.json(success)
        })
    }
}

exports.activateUser = (req, res) => {
    const {userId, userRole} = req.body
    console.log(userId)
    if(userRole === 2) {
        User.findByIdAndUpdate(userId, {role: 1}, {new: true}, (err, success) => {
            console.log(err)
            if(err || !success) {
                res.status(400).json({
                    error: "Something went wrong."
                })
            } else {
                res.json({
                    message: "Updated Successfully"})
            }
        })
    }
}

exports.deactivateUser = (req, res) => {
    const {userId, userRole} = req.body
    if(userRole === 2) {
        User.findByIdAndUpdate(userId, {role: 0}, {new: true}, (err, success) => {
            if(err || !success) {
                res.status(400).json({
                    error: "Something went wrong."
                })
            } else {
                res.json({
                    message: "Updated Successfully"})
            }
        })
    }
}

exports.getNotAssignedUser = (req, res) => {
    const {userId} = req.params

    User.findById(userId).exec((err, success) => {
        if (success) {
            CenterUser.find({isAssigned: false, registeredBy: userId}).exec((err, users) => {
                if (err || !users) {
                    return res.status(400).json({
                        error: "No Users found"
                    })
                }
                return res.json(users)
            })
        }
    })
}

exports.getNonActiveSubUser = (req, res) => {
    const {userId, userRole} = req.params
    console.log(req.params)
    User.find({role: 1}).exec((err, users) => {
        if (err || !users) {
            return res.status(400).json({
                error: "No Users found"
            })
        }
        return res.json(users)
    })
}

exports.updateDeactivatedData = (req, res) => {
    const { firstName, lastName, middleName, email, adhaarCard, panCard, cv, CancelledCheque, cityName, fullAddress
    } = req.body
    const value = {
        firstName, lastName, middleName, email, adhaarCard, panCard, cv, CancelledCheque, cityName, fullAddress
    }

    User.findOneAndUpdate({email: email}, value).exec((err, success) => {
        if (err || !success) {
            if (err || !success) {
                return res.status(400).json({
                    error: "Cannot update. Please try later"
                })
            }
        }

        res.json(success)
    })
}