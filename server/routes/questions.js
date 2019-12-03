const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Question = require("../models/question");
const TestModel = require("../models/test");
const ExamModel = require("../models/exam");

router.get('/', (req, res, next) => {
    Question.find()
        .exec()
        .then(question => {
            const response = {
                count: question.length,
                questions: question
            };

            if (question) {
                res.status(200).json({ response })
            } else {
                res.status(200).json({
                    message: 'No entries found'
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

router.post('/generateTest', (req, res, next) => {
    // const test = [];
    // // Get the count of all users
    // Question.countDocuments()
    //     .exec(function (err, count) {
    //         // Get a random entry
    //         var random = Math.floor(Math.random() * count);
    //         console.log("random", random);
    //         // Again query all users but only fetch one offset by our random #
    //         Question.findOne().skip(random).exec()
    //             .then(result => {
    //                 res.status(200).json({
    //                     result: result
    //                 })
    //             })
    //             .catch(error => {
    //                 error: error
    //             })
    //     })
    Question.aggregate([
        { $sample: { "size": req.body.size } },
        { $match: { "questionType": "test", "subjectType": req.body.subject } }
    ])
        .then(test => {
            console.log("test", req.body.size);
            const newTest = new TestModel({
                _id: mongoose.Types.ObjectId(),
                questions: test,
                bySubject: req.body.subject,
                isAvailable: true,
                displayName: req.body.name
            });
            return newTest
                .save()
            // .exec()
            // .then(result => {
            //     res.status(201).json({
            //         message: 'Test created',
            //         result: result
            //     })
            // })
            // .catch(error => {
            //     error: error
            // })

        })
        .then(result => {
            res.status(201).json({
                message: 'Test created',
                result: result
            })
        })
        .catch(error => {
            res.status(500).json({
                error: error
            })
        })
})
router.post('/generateExam', (req, res, next) => {
    // const { size, subject, name } = req.body;
    Question.aggregate([
        { $sample: { "size": req.body.size } },
        { $match: { "questionType": "exam", "subjectType": req.body.subject } }
    ])
        .then(exam => {
            const newExam = new ExamModel({
                _id: mongoose.Types.ObjectId(),
                questions: exam,
                bySubject: req.body.subject,
                isAvailable: true,
                displayName: req.body.name
            })
            return newExam
                .save()

        })
        .then(result => {
            res.status(201).json({
                message: 'Exam created',
                result: result
            })
        })
        .catch(error => {
            res.status(500).json({
                error: error
            })
        })
})

router.post('/', (req, res, next) => {
    const question = new Question({
        _id: new mongoose.Types.ObjectId(),
        text: req.body.text,
        level: req.body.level,
        answers: req.body.answers,
        questionType: req.body.questionType,
        subjectType: req.body.subjectType
    });
    question
        .save()
        .then(question => {
            res.status(201).json({
                message: 'Handling POST request to /questions',
                createdQuestion: {
                    name: question.name,
                    _id: question._id,
                    request: {
                        type: 'POST',
                        url: 'http://localhost:3000/questions/' + question._id
                    }
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

router.get('/:questionId', (req, res, next) => {
    const id = req.params.questionId;
    Question.findById(id)
        .exec()
        .then(question => {
            if (question) {
                res.status(200).json(question);
            } else {
                res.status(404).json({
                    error: "No valid entry found for provided ID"
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

router.patch('/:questionId', (req, res, next) => {
    const id = req.params.questionId;
    const updateOps = {};
    for (const ops of req.body) {
        if (ops.key && ops.value) {
            updateOps[ops.key] = ops.value;
        }
        else {
            res.status(500).json({
                message: `No property or value added[${ops.key}|${ops.value}]`
            })
        }
    }
    Question.update({
        _id: id
    }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                result: result,
                message: "Succesfully updated!",
                user: 'http://localhost:3000/questions/' + id
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err,
                message: "Something went wrong!"
            })
        })
})

router.delete('/:questionId', (req, res, next) => {
    const id = req.params.questionId;
    Question.remove({
        _id: id
    })
        .exec()
        .then(result => {
            res.status(200).json({
                result: result,
                message: "Successfuly deleted!"
            })
        })
        .catch(err => {
            res.status(500).json({
                err: err
            })
        })
})

// get questions by subject
router.post('/bySubject', (req, res, next) => {
    // const { subject } = req.body;
    const { subjectType } = req.body;
    Question.find({ subjectType })
        .exec()
        .then(questions => {
            const response = {
                count: questions.length,
                questions: questions
            };

            if (questions) {
                res.status(200).json({ response })
            } else {
                res.status(200).json({
                    message: 'No entries found'
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
});

// get questions by question type
router.post('/byQuestionType', (req, res, next) => {
    // const { subject } = req.body;
    const { questionType } = req.body;
    Question.find({ questionType })
        .exec()
        .then(questions => {
            const response = {
                count: questions.length,
                questions: questions
            };

            if (questions) {
                res.status(200).json({ response })
            } else {
                res.status(200).json({
                    message: 'No entries found'
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
});

// get questions by level
router.post('/byLevel', (req, res, next) => {
    // const { subject } = req.body;
    const { level } = req.body;
    Question.find({ level })
        .exec()
        .then(questions => {
            const response = {
                count: questions.length,
                questions: questions
            };

            if (questions) {
                res.status(200).json({ response })
            } else {
                res.status(200).json({
                    message: 'No entries found'
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
});
module.exports = router;