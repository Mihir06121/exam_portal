const Question = require('../models/questions')
const User = require('../models/users')
const Results = require('../models/results')
const Courses = require('../models/course')
const Students = require('../models/students')
exports.createQuestion = (req, res) => {
   console.log(req.body)
    try {
        const newQuestion = new Question(req.body)
        newQuestion.save((err, success) => {
            if (err || !success) {
                return res.status(400).json({
                    error: err
                })
            } else {
                res.json(success)
            }
        })
    } catch (err) {
        console.log(err)
    }
}

exports.getAllQuestions = (req, res) => {
    Question.find()
    .populate({ path: 'course', model: Courses })
    .exec((err, questions) => {
        if(err || !questions) {
            console.log(err)
            res.status(400).json({
                error: err
            })
        } else {
            console.log(questions)
            res.json(questions)
        }
    })
}

exports.postResults = (req, res) => {
    console.log(req.body)
    const newResult = new Results(req.body)
    newResult.save((err, success) => {
        console.log(success)
        if (err ||!success) {
            res.status(400).json({
                error: err
            })
        }
        Students.findById(req.body.studentId).exec((err, student) => {
            if(err || !student) {
                res.status(400).json({
                    error: err
                })
            } else {
                Students.findByIdAndUpdate(req.body.studentId, {$set: {
                    isSubscribed: true, 
                    appeard: false,
                    completed: false
                }}, {new: true}).exec((err, updatedSuccess) => {
                    if (err || !updatedSuccess) {
                        res.send({
                            message: "Something went wrong. Can't update Please try again",
                            err
                        })
                    }
                    res.send({
                        updated: true,
                        updatedSuccess,
                        success
                    })
                }) 
            }
        })
    })
}

exports.getStudentsResults = (req, res) => {
    Results.find({studentId: req.params.studentId})
    .populate({ path: 'course', model: Courses })
    .exec((err, results) => {
        if(err || !results) {
            res.status(400).json({
                error: err
            })
        }
        res.json(results)
    })
}
exports.getSingleStudentResultAdmin = (req, res) => {
    Results.find({studentId: req.params.studentId})
    .populate({ path: 'course', model: Courses })
    .populate({ path: 'testRawData.questionId', model: Question })
    .exec((err, results) => {
        if(err || !results) {
            res.status(400).json({
                error: err
            })
        }
        res.json(results)
    })
}