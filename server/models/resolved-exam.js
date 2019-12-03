const mongoose = require('mongoose');

const resolvedExamSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam",
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "uUser",
        required: true
    },
    submitionDate: { type: Date, required: true, default: Date.now },
    points: { type: Number, required: true }
});

module.exports = mongoose.model('ResolvedExam', resolvedExamSchema);