const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'title is Required']
    },
    content: {
        type: String,
        required: [true, 'content is Required']
    },
    author: {
        type: String,
        required: [true, 'author is Required']
    },
    comments: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        comment: {
            type: String,
            required: true
        }
    }],
    createdDate: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Blog', blogSchema);