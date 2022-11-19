const express = require('express')
const router = express.Router()
const { upload, remove } = require('../controllers/cloudinary')


router.post('/doc/uploadimages', upload)
router.post('/doc/deleteimage', remove)

module.exports = router