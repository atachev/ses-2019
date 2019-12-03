const mongoose = require('mongoose');

const userModel = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    role: { type: String, required: true },
    password: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    username: { type: String, required: true },
    faculty: { type: String, required: true },
    semester: { type: Number, required: true },
    group: { type: Number, required: true }

});
module.exports = mongoose.model('User', userModel);