const mongoose = require('mongoose')
const User = require('./user.model')

const Todo = new mongoose.Schema({
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
    done: {
        type: Boolean,
        required: true,
        default: false,
    },
}, { timestamps: true })

const model = mongoose.model('Todo', Todo)

module.exports = model