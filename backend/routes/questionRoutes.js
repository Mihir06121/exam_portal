const express = require('express')
const router = express.Router()

const { createQuestion, getAllQuestions, postResults } = require('../controllers/questions')

router.post('/create-question', createQuestion)
router.get('/get-all-questions', getAllQuestions)
router.post('/post-result', postResults)

module.exports = router