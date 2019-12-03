const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Subject = require("../models/subject");

router.get('/', (req, res, next) => {
    Subject.find()
        .exec()
        .then(subjects => {
            const response = {
                count: subjects.length,
                result: subjects.map(subject => {
                    return {
                        id: subject._id,
                        subjectTypeId: subject.subjectTypeId,
                        name: subject.name
                    }

                })
            };

            if (subjects) {
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

router.post('/', (req, res, next) => {
    const subject = new Subject({
        _id: new mongoose.Types.ObjectId(),
        subjectTypeId: req.body.subjectTypeId,
        name: req.body.name
    })
    subject
        .save()
        .then(result => {
            res.status(201).json({
                message: 'Handling POST request to /subjects',
                createdSubject: {
                    name: result.name,
                    _id: result._id,
                    request: {
                        type: 'POST',
                        url: 'http://localhost:3000/subjects/' + result._id
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

router.get('/:subjectId', (req, res, next) => {
    const id = req.params.subjectId;
    Subject.findById(id)
        .exec()
        .then(subject => {
            if (subject) {
                res.status(200).json(subject);
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
// TODO: add validation for [key]:value
router.patch('/:subjectId', (req, res, next) => {
    const id = req.params.subjectId;
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
    Subject.update({
        _id: id
    }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                result: result,
                message: "Succesfully updated!",
                user: 'http://localhost:3000/subjects/' + id
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err,
                message: "Something went wrong!"
            })
        })
})

router.delete('/:subjectId', (req, res, next) => {
    const id = req.params.subjectId;
    Subject.remove({
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

module.exports = router;