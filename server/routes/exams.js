const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Exam = require('../models/exam');
const Questions = require('../models/question');

// TODO: get and generate random questions
router.get('/', (req, res, next) => {
    Exam.find({})
        .populate('questions')
        .exec()
        .then(exams => {
            const response = {
                count: exams.length,
                exams: exams.map(exam => {
                    return {
                        id: exam._id,
                        questions: exam.questions,
                        bySubject: exam.bySubject,
                        isAvailable: exam.isAvailable,
                        createdOn: exam.createdOn,
                        expiresOn: exam.expiresOn,
                        displayName: exam.displayName,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/exams/' + exam._id
                        }
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(error => {
            res.status(500).json({
                error: error
            })
        })
})
// router.get('/createExam', (req, res, next) => {
//     Questions.aggregate([{ $sample: { size: 5 } }])
//         .exec()
//         .then(questions => {
//             res.status(200).json({
//                 count: questions.length,
//                 questions: questions
//             })
//         })
// })
router.post('/', (req, res, next) => {
    Questions.findById(req.body.questionId)
        .then(question => {
            if (!question) {
                res.status(404).json({
                    message: "Question not found"
                })
            }
            const exam = new Exam({
                _id: mongoose.Types.ObjectId(),
                level: req.body.level,
                questions: req.body.questions
            })
        })
});

router.get('/:examId', (req, res, next) => {
    const id = req.params.examId;
    Exam.findById(id)
        .populate('questions')
        .exec()
        .then(exam => {
            if (exam) {
                res.status(200).json(exam)
            } else {
                res.status(404).json({
                    message: "No valid entry found for provided ID!"
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
});

router.get('/:Qcount', (req, res, next) => {
    const questionsCount = req.params.Qcount;
})
module.exports = router;