const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
    text: { type: String, required: true },
    level: { type: String, required: true }, // 1-6
    answers: [
        {
            id: { type: Number, required: true },
            value: { type: String, required: true },
            isCorrect: { type: Boolean, required: true },
            points: { type: Number, required: true }
        }
    ],
    questionType: { type: String, required: true }, // for test, exam or both
    subjectType: { type: String, required: true } //the id of the subject
    // need to create subjects table
})

module.exports = mongoose.model('Question', questionSchema);