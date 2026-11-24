const mongoose = require('mongoose');

module.exports = mongoose.model('Post', new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is Required']
    },
    content: {
        type: String,
        required: [true, 'Content is Required']
    },
    author: {
        type: String,
        required: [true, 'Author is required']
    },
    authorName: {
        type: String,
        required: [true, 'Author is required']
    },
    information: {
        type: String,
        required: [true, 'information is required']
    },
    dateAdded: {
        type: Date,
        default: Date.now
    },
    comments: [
        {
            userId: {
                type: String,
                required: [true, 'userID is required']
            },
            username: {
                type: String,
                required: [true, 'username is required']
            },
            comment: {
                type: String,
                required: [true, 'comment is required']
            }
        }
    ]
}));