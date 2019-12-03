const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    secondName: { type: String, required: true },
    surname: { type: String, required: true },
    fnum: { type: String, },
    tnum: { type: String, },
    role: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    faculty: { type: String },
    semester: { type: Number },
    group: { type: Number },
    imageURL: { type: String, required: true },
    completedTests: [
        {
            documentType: { type: String },
            test: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Test"
            },
            points: { type: Number }
        }
    ],
    completedExams: [
        {
            documentType: { type: String },
            exam: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Exam"
            },
            points: { type: Number }
        }
    ]
});

UserSchema.pre('save', function (next) {
    // Check if document is new or a new password has been set
    if (this.isNew || this.isModified('password')) {
        // Saving reference to this because of changing scopes
        const document = this;
        bcrypt.hash(document.password, saltRounds,
            function (err, hashedPassword) {
                if (err) {
                    next(err);
                }
                else {
                    document.password = hashedPassword;
                    next();
                }
            });
    } else {
        next();
    }
});

UserSchema.methods.isCorrectPassword = function (password, callback) {
    bcrypt.compare(password, this.password, function (err, same) {
        if (err) {
            callback(err);
        } else {
            callback(err, same);
        }
    });
}
module.exports = mongoose.model('uUser', UserSchema);