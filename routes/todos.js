const express = require('express');
const router = express.Router();
const User = require('../models/user.model')
const ToDo = require('../models/todo.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.get('/', async (req, res, next) => {
    const token = req.headers['x-access-token']
    try {

        const decodedJWT = jwt.verify(token, process.env.JWT_SECRET)
        // console.log({ decodedJWT })

        const { email } = decodedJWT
        const user = await User.findOne({ email })

        if (user) {

            const allUserToDos = await ToDo.find({
                author: user._id,
            })

            if (allUserToDos) res.json({
                status: 'ok',
                allUserToDos: allUserToDos.reverse(),
            })

            else res.json({
                status: 'error',
                error: 'error finding to-dos!'
            })

        }
        else res.json({
            status: 'error',
            error: 'user not found!'
        })
    } catch (error) {
        console.log(error)
        return res.json({
            status: 'error',
            error: 'error getting todos!'
        })
    }
});

router.get('/other-users-todos', async (req, res, next) => {
    const token = req.headers['x-access-token']
    try {

        const decodedJWT = jwt.verify(token, process.env.JWT_SECRET)
        // console.log({ decodedJWT })

        const { email } = decodedJWT
        const user = await User.findOne({ email })

        if (user) {

            const allOtherUserToDos = await ToDo.find({
                author: { $not: { $eq: user._id } },
            })

            if (allOtherUserToDos) res.json({
                status: 'ok',
                allOtherUserToDos: allOtherUserToDos.reverse(),
            })

            else res.json({
                status: 'error',
                error: 'error finding to-dos!'
            })

        }
        else res.json({
            status: 'error',
            error: 'user not found!'
        })
    } catch (error) {
        console.log(error)
        return res.json({
            status: 'error',
            error: 'error getting todos!'
        })
    }
});

router.post('/', async (req, res, next) => {
    const token = req.headers['x-access-token']
    try {

        const decodedJWT = jwt.verify(token, process.env.JWT_SECRET)

        const { email } = decodedJWT
        const user = await User.findOne({ email })

        if (user) {

            const { todoText } = req.body

            const newTodo = await ToDo.create({
                author: user._id,
                text: todoText
            })

            if (newTodo) res.json({
                status: 'ok',
                todo: newTodo,
            })

            else res.json({
                status: 'error',
                error: 'error creating to-do!'
            })

        }
        else res.json({
            status: 'error',
            error: 'user not found!'
        })
    } catch (error) {
        console.log(error)
        return res.json({
            status: 'error',
            error: 'error saving todo!'
        })
    }
});

router.post('/toggle-done/:todoID', async (req, res, next) => {
    const token = req.headers['x-access-token']
    try {

        const decodedJWT = jwt.verify(token, process.env.JWT_SECRET)
        const { email } = decodedJWT
        const user = await User.findOne({ email })

        if (user) {

            const { todoID } = req.params

            const getCurrentToDo = await ToDo.findById(todoID)

            if (user._id.toString() === getCurrentToDo.author.toString()) {

                const isCurrentToDoDone = getCurrentToDo.done

                const toggleOperation = await ToDo.updateOne(
                    { _id: todoID, author: user._id },
                    { done: !isCurrentToDoDone }
                )

                if (toggleOperation.acknowledged) {

                    res.json({
                        status: 'ok',
                        newTodoDone: !isCurrentToDoDone
                    })
                }

                else res.json({
                    status: 'error',
                    error: 'error flipping done status toggle!'
                })

            }

            else res.json({
                status: 'error',
                error: 'error finding user match'
            })


        }
        else res.json({
            status: 'error',
            error: 'user not found!'
        })
    } catch (error) {
        console.log(error)
        return res.json({
            status: 'error',
            error: 'error saving todo done status!'
        })
    }
});

router.patch('/edit-todo/:todoID', async (req, res, next) => {
    const token = req.headers['x-access-token']
    try {

        const decodedJWT = jwt.verify(token, process.env.JWT_SECRET)
        const { email } = decodedJWT
        const user = await User.findOne({ email })

        if (user) {

            const { todoID } = req.params

            const getCurrentToDo = await ToDo.findById(todoID)

            if (user._id.toString() === getCurrentToDo.author.toString()) {

                const { newToDoText } = req.body

                const editOperation = await ToDo.updateOne(
                    { _id: todoID, author: user._id },
                    { text: newToDoText }
                )

                if (editOperation.acknowledged) {

                    res.json({
                        status: 'ok',
                        newToDoText
                    })
                }

                else res.json({
                    status: 'error',
                    error: 'error updating text for to-do!'
                })


            }

            else res.json({
                status: 'error',
                error: 'error finding user match'
            })


        }
        else res.json({
            status: 'error',
            error: 'user not found!'
        })
    } catch (error) {
        console.log(error)
        return res.json({
            status: 'error',
            error: 'error saving todo done status!'
        })
    }
});

router.delete('/delete-todo/:todoID', async (req, res, next) => {
    const token = req.headers['x-access-token']
    try {

        const decodedJWT = jwt.verify(token, process.env.JWT_SECRET)
        const { email } = decodedJWT
        const user = await User.findOne({ email })

        if (user) {

            const { todoID } = req.params

            const getCurrentToDo = await ToDo.findById(todoID)

            if (user._id.toString() === getCurrentToDo.author.toString()) {

                await ToDo.findByIdAndDelete(
                    todoID
                )

                res.json({
                    status: 'ok',
                })
            }

            else res.json({
                status: 'error',
                error: 'error finding user match'
            })


        }
        else res.json({
            status: 'error',
            error: 'user not found!'
        })
    } catch (error) {
        console.log(error)
        return res.json({
            status: 'error',
            error: 'error saving todo done status!'
        })
    }
});

module.exports = router;
