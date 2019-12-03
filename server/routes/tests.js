const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Test = require('../models/test');
const Question = require('../models/question');

router.get('/', (req, res, next) => {
    Test.find({})
        .populate('questions')
        .exec()
        .then(tests => {
            const response = {
                count: tests.length,
                tests: tests.map(test => {
                    return {
                        id: test._id,
                        questions: test.questions,
                        bySubject: test.bySubject,
                        isAvailable: test.isAvailable,
                        createdOn: test.createdOn,
                        expiresOn: test.expiresOn,
                        displayName: test.displayName,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/tests/' + test._id
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

router.get('/:testId', (req, res, next) => {
    const id = req.params.testId;
    Test.findById(id)
        .populate('questions')
        .exec()
        .then(test => {
            if (test) {
                res.status(200).json(test)
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

router.delete('/:testId', (req, res, next) => {
    const id = req.params.testId;
    Test.remove({
        _id: id
    })
        .exec()
        .then(result => {
            res.status(200).json({
                result: result,
                message: `Test with ID: ${id} was deleted successfully!`
            });
        })
        .catch(error => {
            res.status(500).json({
                error: error
            })
        })
})

module.exports = router;