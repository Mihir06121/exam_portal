const Center = require('../models/center')
const User = require('../models/users')
const Student = require('../models/students')
const CenterUser = require('../models/centerUser')
const Course = require('../models/course')
exports.createCenter = (req, res) => {
    console.log(req.body)
    Center.findOne({assignedTo: req.body.assignedTo}).exec((err, success) => {
        if (success) {
            console.log(success)
            res.status(400).json({
                error: "Center already alloted to the user"
            })
        }
        if (!success) {
            try {
                const newCenter = new Center(req.body).save()
                if (newCenter) {
                    CenterUser.findByIdAndUpdate(req.body.assignedTo, 
                        {isAssigned: true}, {new: true}, (err, success) => {
                        if (err || !success) {
                            res.status(400).json({
                                error: "Something went wrong."
                            })
                        } else {
                            res.json({newCenter,
                            message: "Updated Successfully"})
                        }
                    } )
                }
            } catch (err) {
                console.log(err)
                res.status(400).json({
                    error: err
                })
            }
        }
    })
}

exports.getUserForCenter = (req, res) => {
    const {userRole} = req.params

    if (userRole === '1') {
        CenterUser.find({role: 0}).exec((err, users) => {
            // console.log(users)
            if (err || !users) {
                res.status.send({
                    error: "No Users found or something went wrong"
                })
            } else {
                res.json(users)
            }
        })
    }
}

exports.getSubCenter = (req, res) => {
    const {userId} = req.params
    Center.find({createdBy: userId})
    .populate('assignedTo')
    .populate('createdBy', '_id firstName middleName lastName')
    .exec((err, subCenters) => {
        if (err || !subCenters) {
            res.status.send({
                error: "Something went wrong"
            })
        } else {
            res.json(subCenters)
        }
    })
}

exports.deleteSubCenter = (req, res) => {
    console.log("DELETE", req.params)
    const {centerId, centeruserId} = req.params
    Center.deleteOne({_id: centerId}).exec((err, deleteSuccess) => {
        if (err) {
            res.status.send({
                error: "Something went wrong"
            })
        } 
        if (deleteSuccess.acknowledged === true) {
            CenterUser.findByIdAndUpdate(centeruserId,
            {isAssigned: false}, {new: true}, (err, success) => {
                if(err || !success) {
                    res.status(400).json({
                        error: "Something went wrong."
                    })
                } else {
                    res.json({
                        message: "Deleted Successfully"})
                }
            })
        }
    })
}

exports.updateSubCenter = (req, res) => {
    const {centerName,
        centerFullAddress, numberOfClassRooms, capacityOfClass, nameOfCompany, businessProof, panCard, centerLocationState, centerLocationCity, assignedTo} = req.body
    const value = {centerName,
        centerFullAddress, numberOfClassRooms, capacityOfClass, nameOfCompany, businessProof, panCard, centerLocationState, centerLocationCity, assignedTo
    }
    Center.findById(req.body.center_id).exec((err, success) => {
        if (success) {
            const id = success.assignedTo
            CenterUser.findOneAndUpdate({_id: id}, {isAssigned: false}, {new: true}, (err, success) => {
                console.log(success)
                if (err || !success) {
                    res.status(400).json({
                        error: 'Something went wrong here.'
                    })
                } else {
                    Center.findByIdAndUpdate(req.body.center_id, value).exec((err, success) => {
                        if (err || !success) {
                            res.status(400).json({
                                error: 'Something went wrong.'
                            })
                        } else {
                            CenterUser.findByIdAndUpdate(value.assignedTo, {isAssigned: true}, {new: true}, (err, success) => {
                                if (err || !success) {
                                    res.status(400).json({
                                        error: 'Something went wrong Here.'
                                    })
                                } else {
                                    res.json(success)
                                }
                            })
                        }
                    })
                }
            })
        }
    })
    // Center.updateOne({_id: req.body.center_id}, value).exec((err, success) => {
    //     if(err || !success) {
    //         res.status(400).send({
    //             error: "Something went wrong"
    //         })
    //     } else {
    //         res.send({
    //             message: "Center deleted Successfull",
    //             success
    //         })
    //     }
    // })
}

exports.getUserCenter = (req, res) => {
    console.log("USERID", req.params.userId)
    Center.findOne({assignedTo: req.params.userId})
    .populate('assignedTo')
    .populate('createdBy')
    .exec((err, success) => {
        if (err || !success) {
            res.status(400).send({
                error: "No centers found"
            })
        } else {
            res.json(success)
        }
    })
}

exports.getAllCenters = (req, res) => {
    const {userRole} = req.params
    if (userRole === '2') {
        Center.find()
        .populate('assignedTo', '_id firstName middleName lastName')
        .populate('createdBy', '_id firstName middleName lastName')
        .exec((err, centers) => {
            if (err || !centers) {
                res.status.send({
                    error: "Something went wrong"
                })
            } else {
                res.json(centers)
            }
        })
    }
}

exports.registerStudent = (req, res) => {
    console.log(req.body)
    if (req.body.role === 0) {
        Student.findOne({email: req.body.email}).exec((err, student) => {
            if (student) {
                return res.status(400).send({
                    student,
                    error: 'Student already registered',
                })
            }
            const {firstName, middleName, lastName, 
        fullAddress,
        cityName,
        adhaarCard,
        panCard,
        tenthMarkSheet,
        twelfthMarsheet,
        graduationCertificate,
        selectedCourse,
        mobileNumber, email, password, registeredBy} = req.body
    
            let newStudent = new Student({firstName, middleName, lastName, 
        fullAddress,
        cityName,
        adhaarCard,
        panCard,
        tenthMarkSheet,
        twelfthMarsheet,
        graduationCertificate,
        selectedCourse,
        mobileNumber, email, password, registeredBy})
            newStudent.save((err, success) => {
                if (err || !success) {
                    console.log(err)
                    return res.status(400).json({
                        error: err
                    })
                }
                res.json(success)
            })
        })
    }
}

exports.getCenterStudents = (req, res) => {
    const {centerId} = req.params
    console.log(centerId)
    Student.find({registeredBy: centerId}).exec((err, students) => {
        if (err || !students) {
            return res.send({
                message: "Students not found",
                err
            })
        } else {
            console.log("CENTER STUDENTS", students)
            res.json(students)
        }
    })
}

exports.subscribeStudent = (req, res) => {
    const {studentId, registeredId} = req.body
    Student.findByIdAndUpdate(studentId, {$set: {isSubscribed: true}}, {new: true}).exec((err, success) => {
        if (err || !success) {
            res.send({
                message: "Something went wrong. Can't update Please try again",
                err
            })
        }
        res.send({
            updated: true,
            success
        })
    }) 
}

exports.getCenterAdmin = (req, res) => {
    const {subcId} = req.params
    console.log(subcId)
    Center.findById(subcId)
    .populate('assignedTo')
    .populate('createdBy').exec((err, center) => {
        if (err ||!center) {
            res.send({
                message: "Center not found",
                err
            })
        } else {
            console.log(center._id)
            Student.find({registeredBy: center._id}).exec((err, students) => {
                if (err || !students) {
                    res.send({
                        center,
                        message: "No students registeres yet",
                        err
                    })
                } else {
                    res.json({center,students})
                }
            })
        }
    })
}

exports.createAdminCourse = (req, res) => {
    const {courseName, courseType} = req.body
    Course.findOne({courseName: courseName}).exec((err, success) => {
        if (success) {
            res.status(400).json({
                error: "Course already exists"
            })
        } else {
            try {
                const newCourse = new Course(req.body).save()
                res.json(newCourse)
            } catch (err) {
                console.log(err)
                res.status(400).json({
                    error: err
                })
            }
        }
    })
}

exports.getCourses = (req, res) => {
    Course.find().exec((err, success) => {
        if (!success || err) {
            res.status(400).json({
                error: "No Courses found"
            })
        } else {
            res.json(success)
        }
    })
}

exports.registerCenterUser = (req, res) => {
    console.log(req.body)
    if (req.body.role === 1) {
        CenterUser.findOne({ownerEmail: req.body.ownerEmail})
        .populate('registeredBy', '_id firstName middleName lastName')
        .select('ownerName ownerMobileNumber ownerWhatsAppNumber ownerEmail managerName managerMobileNumber managerWhatsAppNumber managerEmail registeredBy')
        .exec((err, centerUser) => {
            if (centerUser) {
                console.log("ERROR", centerUser, err)
                return res.status(400).send({
                    centerUser,
                    error: 'User already registered',
                })
            }
            const {ownerName, ownerMobileNumber, ownerWhatsAppNumber, ownerEmail, password, registeredBy} = req.body
    
            let newCenterUser = new CenterUser({ownerName, ownerMobileNumber, ownerWhatsAppNumber, ownerEmail, password, registeredBy})
            newCenterUser.save((err, success) => {
                if (err || !success) {
                    console.log("ERROR", err)
                    return res.status(400).json({
                        error: err
                    })
                }
                res.json(success)
            })
        })
    }
}

exports.updateSubUser = (req, res) => {
    const {centerName, centerLocationState, centerLocationCity, createdBy} = req.body
    const value = {
        centerLocationState,
        centerLocationCity,
        centerName,
        createdBy
    }
    Center.updateOne({_id: req.body.centerId}, value).exec((err, success) => {
        if(err || !success) {
            res.status(400).send({
                error: "Something went wrong"
            })
        } else {
            res.send({
                message: "Center Updated Successfull",
                success
            })
        }
    })
}