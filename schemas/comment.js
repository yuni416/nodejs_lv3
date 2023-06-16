const mongoose = require('mongoose');

const commentsSchema = new mongoose.Schema({
    postId: {
        type: String,
        required: true
    },
    user: {
        type: String
    },
    password: {
        type: String
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("comment", commentsSchema);