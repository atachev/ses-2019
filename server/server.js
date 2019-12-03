const express = require("express");
const app = express();

var cors = require("cors");
const bodyParser = require("body-parser");
const passport = require('passport');
const morgan = require("morgan");

const multer = require('multer');
const mongoose = require("mongoose");

const cookieParser = require('cookie-parser');
// model
const Data = require("./data");

// routes
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const subjectRoutes = require('./routes/subjects');
const examRoutes = require('./routes/exams');
const questionRoutes = require('./routes/questions');
const testRoutes = require('./routes/tests');
const resolvedTests = require('./routes/resolved-tests');
const resolvedExams = require('./routes/resolved-exams');

const API_PORT = 3001;
const secret = 'mysecretsshhh';
app.use(cors());
const router = express.Router();

const fileUpload = require('express-fileupload');
// for dev: in case of offline connectiong
var url = "db";

// connects our back end code with the database
mongoose.connect(
  url,
  { useNewUrlParser: true }
);


let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// (optional) only made for logging and
app.use(morgan("dev"));

// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// for every incoming requests
// Routes which should handle requests

// registration
const uUser = require('./models/umodel');
const Test = require('./models/test');
const Exams = require('./models/exam');
const withAuth = require('./middlewares/middleware');

const jwt = require('jsonwebtoken');
app.use(cookieParser());

app.use(fileUpload());
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/saved', express.static(__dirname + '/saved'));
app.use('/weights', express.static(__dirname + '/weights'));

router.post('/upload', (req, res, next) => {
  let imageFile = req.files.file;

  imageFile.mv(`${__dirname}/uploads/${req.body.filename}.png`, function (err) {
    if (err) {
      return res.status(500).send(err);
    }

    res.json({ file: `uploads/${req.body.filename}.png` });
  });

})

router.get('/home', function (req, res) {
  res.send('Добре дошли');
});

router.get('/secret', withAuth, function (req, res) {
  res.send('The password is potato');
});

router.get('/checkToken', withAuth, function (req, res) {
  res.sendStatus(200);
});

router.post('/register', function (req, res) {
  const { name, secondName, surname, fnum, tnum, email, password, role, faculty, semester, group, imageURL, documents } = req.body;
  const user = new uUser({ name, secondName, surname, fnum, tnum, email, password, role, faculty, semester, group, imageURL, documents });
  user.save(function (err) {
    if (err) {
      res.status(500)
        .send("Error registering new user please try again.");
    } else {
      res.status(200).send("Welcome to the club!");
    }
  });
});

router.post('/getImageURL', function (req, res) {
  const { fnum, tnum } = req.body;
  if (fnum) {
    uUser.findOne({ fnum }, function (err, user) {
      if (err) {
        res.status(500).json({
          error: 'Internal error please try again'
        });
      } else if (!user) {
        res.status(401).json({
          error: 'Невалиден факултетен номер!'
        });
      } else {
        res.status(200).json({
          imageURL: user.imageURL
        })
      }
    });
  } else if (tnum) {
    uUser.findOne({ tnum }, function (err, user) {
      if (err) {
        res.status(500).json({
          error: 'Internal error please try again'
        });
      } else if (!user) {
        res.status(401).json({
          error: 'Невалиден преподавателски номер!'
        });
      } else {
        res.status(200).json({
          imageURL: user.imageURL
        })
      }
    });
  }
});


router.get('/usr/:userId', function (req, res) {
  const id = req.params.userId;
  uUser.findById(id)
    .populate('completedTests.test')
    .populate('completedExams.exam')
    .exec()
    .then(user => {
      if (user) {
        res.status(200).json(user)
      } else {
        res.status(404).json({
          message: "Не е намерен потребител с посоченито ID!"
        })
      }
    })
});

router.get('/usr/byRole/:userType', function (req, res) {
  const role = req.params.userType;
  uUser.find({ "role": "student" })
    .populate('completedTests.test')
    .populate('completedExams.exam')
    .exec()
    .then(users => {
      if (users) {
        const response = {
          count: users.length,
          users: users
        }
        res.status(200).json(response);
      } else {
        res.status(404).json({
          message: "No user found!"
        })
      }
    })
});

router.patch('/usr/tests/:userId', function (req, res) {
  const userId = req.params.userId;
  var doc = req.body;
  uUser.update({ _id: userId }, {
    $push: {
      "completedTests": doc
    }
  })
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
});

router.patch('/usr/exams/:userId', function (req, res) {
  const { userId } = req.params;
  var doc = req.body;
  uUser.updateOne({ _id: userId }, {
    $push: {
      "completedExams": doc
    }
  })
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
});

router.post('/authenticate', function (req, res) {
  const { fnum, tnum, email, password, key, isFaceDetectionValid } = req.body;
  if (fnum) {
    uUser.findOne({ fnum }, function (err, user) {
      if (err) {
        res.status(500).json({
          error: 'В момента не можете да използвате системата. Опитайте отново!'
        });
      } else if (!user) {
        res.status(401).json({
          error: 'Невалиден факултетен номер или парола!'
        });
      } else {
        if (isFaceDetectionValid) {
          // Issue token
          const payload = { id: user._id, email: user.email, username: user.name, surname: user.surname, role: user.role, faculty: user.faculty, semester: user.semester, group: user.group };
          const token = jwt.sign(payload, secret, {
            expiresIn: '1h'
          });
          // res.cookie('token', token, { httpOnly: true });
          res.status(200).json({
            token: token
          })
        } else {
          user.isCorrectPassword(password, function (err, same) {
            if (err) {
              res.status(500)
                .json({
                  error: 'В момента не можете да използвате системата. Опитайте отново!'
                });
            } else if (!same) {
              res.status(401)
                .json({
                  error: 'Невалиден факултетен номер или парола!'
                });
            } else {
              // Issue token
              const payload = { id: user._id, email: user.email, username: user.name, surname: user.surname, role: user.role, faculty: user.faculty, semester: user.semester, group: user.group };
              const token = jwt.sign(payload, secret, {
                expiresIn: '1h'
              });
              // res.cookie('token', token, { httpOnly: true });
              res.status(200).json({
                token: token
              })
            }
          });
        }
      }
    });
  } else if (tnum) {
    uUser.findOne({ tnum }, function (err, user) {
      if (err) {
        res.status(500).json({
          error: 'Internal error please try again'
        });
      } else if (!user) {
        res.status(401).json({
          error: 'Incorrect email or password'
        });
      } else {
        if (isFaceDetectionValid) {
          // Issue token
          const payload = { id: user._id, email: user.email, username: user.name, surname: user.surname, role: user.role, faculty: user.faculty, semester: user.semester, group: user.group };
          const token = jwt.sign(payload, secret, {
            expiresIn: '1h'
          });
          // res.cookie('token', token, { httpOnly: true });
          res.status(200).json({
            token: token
          })
        } else {
          user.isCorrectPassword(password, function (err, same) {
            if (err) {
              res.status(500)
                .json({
                  error: 'Internal error please try again'
                });
            } else if (!same) {
              res.status(401)
                .json({
                  error: 'Грешен потребителски номер или парола!'
                });
            } else {
              // Issue token
              const payload = { id: user._id, email: user.email, username: user.name, surname: user.surname, role: user.role, faculty: user.faculty, semester: user.semester, group: user.group };
              const token = jwt.sign(payload, secret, {
                expiresIn: '1h'
              });
              // res.cookie('token', token, { httpOnly: true });
              res.status(200).json({
                token: token
              })
            }
          });
        }
      }
    });
  }
});

app.use(cookieParser());
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/resolvedTests', resolvedTests);
app.use('/api/resolvedExams', resolvedExams);

// this is our get method
// this method fetches all available data in our database
router.get("/getData", (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

// this is our update method
// this method overwrites existing data in our database
router.post("/updateData", (req, res) => {
  const { id, update } = req.body;
  Data.findOneAndUpdate(id, update, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// this is our delete method
// this method removes existing data in our database
router.delete("/deleteData", (req, res) => {
  const { id } = req.body;
  Data.findOneAndDelete(id, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

// this is our create methid
// this method adds new data in our database
router.post("/putData", (req, res) => {
  let data = new Data();

  const { id, message } = req.body;

  if ((!id && id !== 0) || !message) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }
  data.message = message;
  data.id = id;
  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));