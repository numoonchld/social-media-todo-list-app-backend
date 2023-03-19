require('dotenv').config()
// console.log(process.env.MONGODB_URI) // remove this after you've confirmed it is working
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const cors = require('cors')
const mongoose = require('mongoose')

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const loginRouter = require('./routes/login');
const todosRouter = require('./routes/todos');
const postsRouter = require('./routes/posts');

const app = express();
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


mongoose.connect(process.env.MONGODB_URI)

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/login', loginRouter);
app.use('/todos', todosRouter);
app.use('/posts', postsRouter);


module.exports = app;
