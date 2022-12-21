const express = require('express')
const router = express.Router()

const {createCenter, 
    getUserForCenter, 
    getSubCenter, 
    deleteSubCenter, 
    updateSubCenter, 
    getAllCenters, 
    getUserCenter, 
    registerStudent, 
    getCenterStudents,
    subscribeStudent,
    getCenterAdmin,
    createAdminCourse,
    getCourses,
    updateSubUser,
    updateStuCourse,
    registerCenterUser,
    initiatePayment,
getResponse,
verifypayment} = require('../controllers/center')

router.post('/create-center', createCenter)
router.get('/get-users-for-center/:userRole', getUserForCenter)
router.get('/get-user-center/:userId', getUserCenter)
router.get('/get-sub-center/:userId', getSubCenter)
router.get('/get-all-center/:userRole', getAllCenters)
router.post('/delete-sub-center/:centerId/:centeruserId', deleteSubCenter)
router.put('/update-sub-center', updateSubCenter)
router.post('/register-student', registerStudent)
router.get('/get-center-students/:centerId', getCenterStudents)
router.put('/subscribe-student', subscribeStudent)
router.patch('/update-student-course', updateStuCourse)
router.get('/get-center-admin/:subcId', getCenterAdmin)
router.post('/create-course', createAdminCourse)
router.get('/get-courses', getCourses)
router.post('/register-center-user', registerCenterUser)
router.put('/update-sub-user', updateSubUser)
router.post('/payment-callback', getResponse)
router.post('/payment/orders', initiatePayment)
router.post('/payment/verify/:studentId', verifypayment)

module.exports = router