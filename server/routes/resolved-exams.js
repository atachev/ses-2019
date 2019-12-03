const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Resolved = require('../models/resolved-exam');
const Exam = require('../models/exam');
const User = require('../models/umodel');

router.get('/', (req, res, next) => {
    Resolved.find({})
        .populate('exam')
        .populate('user')
        .exec()
        .then(exams => {
            const response = {
                count: exams.length,
                exams: exams.map(exam => {
                    return {
                        id: exam._id,
                        exam: exam.exam,
                        subject: exam.subject,
                        user: exam.user,
                        submitionDate: exam.submitionDate,
                        points: exam.points
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

router.post('/', (req, res, next) => {
    const exam = new Resolved({
        _id: new mongoose.Types.ObjectId(),
        exam: req.body.examId,
        subject: req.body.subject,
        user: req.body.userId,
        points: req.body.points
    });

    exam.save()
        .then(exam => {
            res.status(201).json({
                message: "successfully created",
                result: exam
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
});

module.exports = router;