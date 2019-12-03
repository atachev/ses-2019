const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Resolved = require('../models/resolved-test');
const Test = require('../models/test');
const User = require('../models/umodel');

// TODO: get and generate random questions
router.get('/', (req, res, next) => {
    Resolved.find({})
        .populate('test')
        .populate('user')
        .exec()
        .then(tests => {
            const response = {
                count: tests.length,
                tests: tests.map(test => {
                    return {
                        id: test._id,
                        test: test.test,
                        subject: test.subject,
                        user: test.user,
                        submitionDate: test.submitionDate,
                        points: test.points
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
    const test = new Resolved({
        _id: new mongoose.Types.ObjectId(),
        test: req.body.testId,
        subject: req.body.subject,
        user: req.body.userId,
        points: req.body.points
    });
console.log("test",test);
    test.save()
        .then(test => {
            res.status(201).json({
                message: "successfully created",
                result: test
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
});

module.exports = router;