const mongoose = require('mongoose');

var minuteFromNow = function () {
    var timeObject = new Date();
    timeObject.setTime(timeObject.getTime() + 1000 * 60);
    return timeObject;
};

const examSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    questions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
            required: true
        }
    ],
    bySubject: {
        type: String,
        required: true
    },
    isAvailable: { type: Boolean, required: true },
    displayName: { type: String, required: true },
    createdOn: { type: Date, required: true, default: Date.now },
    expiresOn: { type: Date, required: false, default: minuteFromNow }
});

module.exports = mongoose.model('Exam', examSchema);