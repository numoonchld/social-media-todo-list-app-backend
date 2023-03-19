const express = require('express');
const router = express.Router();
const User = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.post('/', async (req, res, next) => {


    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })

        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password)

            if (isPasswordValid) {
                // console.log({ user })
                const token = jwt.sign({
                    name: user.username,
                    email: user.email,
                }, process.env.JWT_SECRET)

                res.json({ status: 'ok', user, token })
            }

            else res.json({ status: 'error', error: 'invalid credentials' })
        }

        else res.json({ status: 'error', user: false })
    } catch (error) {
        console.log(error)
        res.json({
            status: 'error',
            error: 'error finding user'
        })
    }
});

module.exports = router;
