const express = require('express')
const router = express.Router()

const { getStudentsResults, getSingleStudentResultAdmin } = require('../controllers/questions')
const { studentLogin, getQuestionsForStudent, getStudentsForAdmin, getSingleStudentForAdmin} = require('../controllers/students')

router.post('/student-login', studentLogin)
router.get('/question-for-student/:courseId', getQuestionsForStudent)
router.get('/get-student-results/:studentId', getStudentsResults)
router.get('/get-student-admin', getStudentsForAdmin)
router.get('/get-single-student-admin/:studentId', getSingleStudentForAdmin)
router.get('/get-single-student-admin-results/:studentId' , getSingleStudentResultAdmin)
module.exports = router