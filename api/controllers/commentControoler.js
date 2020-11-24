const Post = require('../../models/Post')
const Comment = require('../../models/Comment')


exports.createCommentPostController = async (req, res, next) => {
    let {
        postId
    } = req.params
    let {
        body
    } = req.body
    if (!req.user) {
        return res.status(403).json({
            error: 'You are not an Authenticated user'
        })
    }
    let comment = new Comment({
        post: postId,
        user: req.user._id,
        body,
        replies: []
    })

    try {
        let createdComment = await comment.save()
        await Post.findOneAndUpdate({
            _id: postId
        }, {
            $push: {
                'comment': createdComment._id
            }
        })
        let commentJSON = await Comment.findById(createdComment._id).populate({
            path: 'user',
            select: 'profilePics username'
        })

        return res.status(201).json(commentJSON)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: 'Server Error Occurred'
        })
    }
}
exports.replyCommentPostController = async (req, res, next) => {
    let {
        commentId
    } = req.params
    let {
        body
    } = req.body
    if (!req.user) {
        return res.status(403).json({
            error: 'You are not an Authenticated user'
        })
    }
    let reply = {
        body,
        user: req.user._id
    }
    try {
        await Comment.findOneAndUpdate({
            _id: commentId
        }, {
            $push: {
                'replies': reply
            }
        })

        res.status(201).json({
            ...reply,
            profilePics: req.user.profilePics
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: 'Server Error Occurred'
        })
    }
}