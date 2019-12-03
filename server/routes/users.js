const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const withAuth = require('../middlewares/middleware');

//https://github.com/felixrieseberg/windows-build-tools/issues/152
//https://github.com/kelektiv/node.bcrypt.js/issues/432
//https://stackoverflow.com/questions/34546272/cannot-find-module-bcrypt

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

router.get('/', (req, res, next) => {
    User
        .find()
        .exec()
        .then(result => {
            const response = {
                count: result.length,
                users: result.map(r => {
                    return {
                        email: r.email,
                        _id: r._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/users/' + r._id
                        }
                    }
                })
            };
            res.status(200).json(response)
        })
        .catch(err => {
            error: err
        })
})

router.get('/random', (req, res, next) => {
    User.aggregate([{ $sample: { size: 2 } }])
        .exec()
        .then(u => {
            res.status(200).json(u);
        }).catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

router.get('/home', function(req, res) {
    res.send('Welcome!');
  });
router.get('/secret', withAuth, function(req, res) {
res.send('The password is potato');
});
router.get('/checkToken', withAuth, function(req, res) {
    res.sendStatus(200);
});

router.get('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User
        .findById(id)
        .exec()
        .then(user => {
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({
                    message: "No valid entry found for provided ID"
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

// POST route to register a user
router.post('/register', function (req, res) {
    const { email, password } = req.body;
    const user = new User({ 
        _id: mongoose.Types.ObjectId(),
        email,
        password
    });
    user.save(function (err) {
        if (err) {
            res.status(500)
                .send("Error registering new user please try again.");
        } else {
            res.status(200).send("Welcome to the club!");
        }
    });
});

router.post('/signup', (req, res, next) => {
    User.find({
        email: req.body.email
    })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "exists"
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            message: err
                        })
                    } else {
                        const user = new User({
                            _id: mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        })
                        user
                            .save()
                            .then((user) => {
                                res.status(201).json({
                                    message: 'User created'
                                })
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                })
                            })
                    }
                })
            }
        })
})

router.post('/login', (req, res, next) => {
    // findOne
    User.find({
        email: req.body.email
    })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Auth failed"
                })
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Auth failed"
                    })
                }

                if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "60"
                        })
                    return res.status(200).json({
                        message: "Authenticated",
                        token: token
                    })
                }

                res.status(401).json({
                    message: "Auth failed"
                })
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})
router.delete('/:userId', (req, res, next) => {
    User.remove({
        _id: req.params.userId
    })
        .exec()
        .then(result => {
            res.status(200).json({
                result: result
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})
//TODO: add update for updating user information
module.exports = router;