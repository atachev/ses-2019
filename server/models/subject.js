const mongoose = require('mongoose');

const subjectModel = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    subjectTypeId: { type: Number, required: true },
    name: { type: String, required: true },
    availableExams: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam",
        required: false
    },
    availableTests: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test",
        required: true
    },
    lecturer: { type: String }
})

module.exports = mongoose.model('Subject', subjectModel);