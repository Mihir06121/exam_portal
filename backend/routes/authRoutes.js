const express = require('express')
const router = express.Router()

const {register, 
        login, 
        loginSubAdmin, 
        getAdminListUser, 
        activateUser, 
        deactivateUser,
        getNotAssignedUser,
        getNonActiveSubUser,
        updateDeactivatedData
    } = require('../controllers/auth')

router.post('/register', register)
router.post('/login', login)
router.post('/login-sub-admin', loginSubAdmin)
router.get('/get-admin-list-user/:userRole', getAdminListUser)
router.put('/activate-user', activateUser)
router.put('/de-activate-user', deactivateUser)
router.get('/get-not-assigned-users/:userId', getNotAssignedUser)
router.get('/get-disabled-users/:userId/:userRole', getNonActiveSubUser)
router.post('/update-deactivate-data/', updateDeactivatedData)
module.exports = router