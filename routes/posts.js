const express = require('express');
const router = express.Router();
const User = require('../models/user.model')
const Post = require('../models/post.model')

const jwt = require('jsonwebtoken')

router.get('/', async (req, res, next) => {

    try {

        const allPosts = await Post.find({})

        if (allPosts) res.json({
            status: 'ok',
            allPosts: allPosts.reverse(),
        })

        else res.json({
            status: 'error',
            error: 'error finding posts!'
        })


    } catch (error) {
        console.log(error)
        return res.json({
            status: 'error',
            error: 'error getting posts!'
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

            const { postText } = req.body
            console.log({ postText })
            const newPost = await Post.create({
                author: user._id,
                text: postText
            })

            if (newPost) res.json({
                status: 'ok',
                post: newPost,
            })

            else res.json({
                status: 'error',
                error: 'error adding post!'
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

router.post('/comment/:postID', async (req, res, next) => {
    const token = req.headers['x-access-token']

    try {

        const decodedJWT = jwt.verify(token, process.env.JWT_SECRET)
        const { email } = decodedJWT
        const user = await User.findOne({ email })

        if (user) {

            const { postID } = req.params
            console.log({ postID })
            const { newCommentText } = req.body

            const postToCommentOn = await Post.findById(postID)

            postToCommentOn.comments.push({
                author: user._id,
                text: newCommentText
            })

            const updatedPost = await postToCommentOn.save()

            if (updatedPost) {
                res.json({
                    status: 'ok',
                    newComment: updatedPost.comments[updatedPost.comments.length - 1]
                })
            }

            else {
                res.json({
                    status: 'error',
                    error: 'error saving comment'
                })
            }

        }
        else res.json({
            status: 'error',
            error: 'user not found!'
        })
    } catch (error) {
        console.log(error)
        return res.json({
            status: 'error',
            error: 'error commenting on posts!'
        })
    }
});

module.exports = router;