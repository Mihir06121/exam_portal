const Student = require('../models/students')
const jwt = require('jsonwebtoken')
const Questions = require('../models/questions')
const Results = require('../models/results')
const Courses = require('../models/course')

exports.studentLogin = (req, res) => {
    Student.findOne({email: req.body.email}).exec((err, user) => {
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
        const { _id, firstName, lastName, middleName, email, selectedCourse, mobileNumber, isSubscribed, appeard, completed} = user;
        return res.json({
            token,
            user: { _id, firstName, lastName, middleName, email, selectedCourse, mobileNumber, isSubscribed, appeard, completed}
        });
    })
}

exports.getQuestionsForStudent = (req, res) => {
    Questions.find({course:req.params.courseId})
    .populate({ path: 'course', model: Courses })
    .exec((err, questions) => {
        if (err || !questions) {
            return res.status(400).send({
                error: 'No Question Found'
            })
        }
        res.json(questions)
    })
}

exports.getStudentsForAdmin = () => {
    Student.find()
    .populate('course')
    .exec((err, success) => {
        if (err || !success) {
            return res.status(400).send({
                error: "No students found contact developer"
            })
        }
        res.json(success)
    })
}

exports.getSingleStudentForAdmin = (req, res) => {
    console.log(req.params)
    Student.findById(req.params.studentId)    
    .populate({ path: 'selectedCourse', model: Courses })
    .exec((err, student) => {
        if (err || !student) {
            console.log(err)
            return res.status(400).send({
                error: "No students found contact developer"
            })
        }
        res.json(student)
    })
}