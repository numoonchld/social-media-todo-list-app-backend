const mongoose = require('mongoose')
const User = require('./user.model')

const Comment = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true,
    },
    text: {
        type: String,
        required: true,
        unique: true,
    },
    // post: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: Post,
    //     required: true,
    // }
}, { timestamps: true })

const Post = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true,
    },
    text: {
        type: String,
        required: true,
        unique: true,
    },
    comments: [Comment]
}, { timestamps: true })

const model = mongoose.model('Post', Post)

module.exports = model