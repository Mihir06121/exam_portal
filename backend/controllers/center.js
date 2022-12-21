const sgMail = require('@sendgrid/mail');
const Center = require('../models/center')
sgMail.setApiKey('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')
const User = require('../models/users')
const Student = require('../models/students')
const CenterUser = require('../models/centerUser')
const Course = require('../models/course')
const PaytmChecksum = require('paytmchecksum')
const { v4: uuidv4 } = require('uuid')
const Razorpay = require("razorpay");
const crypto = require("crypto");

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
                            const createCenterEmail = { to: 'mp06121@gmail.com', 
                            from: 'mp06121@gmail.com',
                            subject: `A new center is allocated to ${success.ownerName}`,
                            html:`<p>A new center is created`}
                            // sgMail.send(createCenterEmail)
                            // .then(sent =>  console.log('SENT >>>', sent)) 
                            // .catch(err =>  console.log('ERR >>>', err)); 
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
    Student.find({registeredBy: centerId})
    .populate({ path: 'selectedCourse', model: Course })
    .exec((err, students) => {
        if (err || !students) {
            return res.send({
                message: "Students not found",
                err
            })
        } else {
            // console.log("CENTER STUDENTS", students)
            res.json(students)
        }
    })
}

exports.getResponse = (req, res) => {
    const {studentId, registeredId} = req.body
    let paytmChecksumHash = req.body.CHECKSUMHASH;
    console.log(req.body)
    delete req.body.CHECKSUMHASH;
    var isVerifySignature = PaytmChecksum.verifySignature(JSON.stringify(req.body), process.env.TEST_MERCHANT_KEY_P, paytmChecksumHash);
    if (isVerifySignature) {

        var paytmParams = {};
        paytmParams["MID"] = req.body.MID;
        paytmParams["ORDERID"] = req.body.ORDERID;

        /*
         * Generate checksum by parameters we have
         * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
         */
        PaytmChecksum.generateSignature(paytmParams, process.env.TEST_MERCHANT_KEY_P).then(function(checksum) {

            paytmParams["CHECKSUMHASH"] = checksum;

            var post_data = JSON.stringify(paytmParams);

            var options = {

                /* for Staging */
                // hostname: 'securegw-stage.paytm.in',

                /* for Production */
                hostname: 'securegw.paytm.in',

                port: 443,
                path: '/order/status',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': post_data.length
                }
            };

            var response = "";
            var post_req = https.request(options, function(post_res) {
                post_res.on('data', function(chunk) {
                    response += chunk;
                });

                post_res.on('end', function() {
                    let result = JSON.parse(response)
                    if (result.STATUS === 'TXN_SUCCESS') {
                        // console.log("TRANSACTION SUCCESS")
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
                    // {
                    //     //store in db
                    //     db.collection('payments').doc('mPDd5z0pNiInbSIIotfj').update({paymentHistory:firebase.firestore.FieldValue.arrayUnion(result)})
                    //     .then(()=>// console.log("Update success"))
                    //     .catch(()=>// console.log("Unable to update"))
                    // }

                    // Order.updateOne({ _id: fields.ORDERID }, {
                    //     $set: {
                    //         status: req.body.status
                    //     }
                    // }, (err, order) => {
                    //     if (err) {
                    //         // console.log(err)
                    //         return res.status(400).json({
                    //             error: err
                    //         });
                    //     }
                    //     res.json(order)
                    // })



                    // res.redirect(`https://muskanlabel.com/user/dashboard`)
                    res.redirect(`http://localhost:3000/user/center-info`)


                });
            });

            post_req.write(post_data);
            post_req.end();
        });
    } else {
        console.log("Checksum Mismatched");
    }
}

exports.subscribeStudent = (req, res) => {
    Student.findByIdAndUpdate(req.body.studentId, {$set: {isSubscribed: true}}, {new: true}).exec((err, success) => {
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
    // const {studentId, registeredId} = req.body
    // let uu_Id = uuidv4()

    // // var PaytmChecksum = require("./PaytmChecksum");
    // const totalAmount = 1;
    // var paytmParams = {};

    // /* initialize an array */
    // paytmParams["MID"] = process.env.TEST_MERCHANT_ID_P;
    // paytmParams["ORDER_ID"] = uu_Id;
    // paytmParams['WEBSITE'] = process.env.WEBSITE_P,
    // paytmParams["INDUSTRY_TYPE_ID"] = process.env.INDUSTRY_TYPE_P,
    // paytmParams['CHANNEL_ID'] = process.env.CHANNEL_ID_P,
    // paytmParams['CALLBACK_URL'] = `http://localhost:8000/api/payment-callback`,
    // paytmParams['CUST_ID'] = studentId,
    // paytmParams['MOBILE_NO'] = '1111111111',
    // paytmParams['EMAIL'] = 'mp06121@gmail.com',
    // paytmParams['TXN_AMOUNT'] = totalAmount,
    // paytmParams['ORDER_DATA'] = 'Data'

    //     /**
    //      * Generate checksum by parameters we have
    //      * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
    //      */
    // // console.log(paytmParams)
    // var paytmChecksum = PaytmChecksum.generateSignature(paytmParams, process.env.TEST_MERCHANT_KEY_P);
    // paytmChecksum.then(function(checksum){
    //     console.log("generateSignature Returns: " + checksum);
    //     let paytmResponse = {
    //         ...paytmParams,
    //         "CHECKSUMHASH": checksum,
    //         "ORDER_DATA": 'Data'
    //     }
    //     console.log(paytmResponse)
    //     res.json(paytmResponse)
    // }).catch(function(error){
    //     console.log("ERROR", error);
    // });
}

exports.getCenterAdmin = (req, res) => {
    const {subcId} = req.params
    // console.log(subcId)
    Center.findById(subcId)
    .populate('assignedTo')
    .populate('createdBy').exec((err, center) => {
        if (err ||!center) {
            res.send({
                message: "Center not found",
                err
            })
        } else {
            // console.log(center._id)
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
    // console.log(req.body)
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

exports.updateStuCourse = (req, res) => {
    Student.updateOne({_id: req.body.studentId}, 
        {$set:{selectedCourse: req.body.newCourse}}, {new: true}).exec((err, success) => {
            if(err || !success) {
                res.status(400).send({
                    error: "Something went wrong"
                })
            } else {
                res.json(success)
            }
    })
}

exports.initiatePayment = (req, res) => {
	try {
		const instance = new Razorpay({
			key_id: process.env.KEY_ID,
			key_secret: process.env.KEY_SECRET,
		});

		const options = {
			amount: req.body.amount * 100,
			currency: "INR",
			receipt: crypto.randomBytes(10).toString("hex"),
		};

		instance.orders.create(options, (error, order) => {
			if (error) {
				console.log(error);
				return res.status(500).json({ message: "Something Went Wrong!" });
			}
			res.status(200).json({ data: order });
		});
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error!" });
		console.log(error);
	}
}

exports.verifypayment = (req, res) => {
    try {
		const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
			req.body;
        console.log(req.params.studentId)
		const sign = razorpay_order_id + "|" + razorpay_payment_id;
		const expectedSign = crypto
			.createHmac("sha256", process.env.KEY_SECRET)
			.update(sign.toString())
			.digest("hex");

		if (razorpay_signature === expectedSign) {
            Student.findByIdAndUpdate(req.params.studentId, {$set: {isSubscribed: true}}, {new: true}).exec((err, success) => {
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
			// return res.status(200).json({ message: "Payment verified successfully" });
		} else {
			return res.status(400).json({ message: "Invalid signature sent!" });
		}
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error!" });
		console.log(error);
	}
}