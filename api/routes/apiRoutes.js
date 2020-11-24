const router = require('express').Router()
const {
    isAuthenticated
} = require('../../middleware/authMiddleware')
const {
    createCommentPostController,
    replyCommentPostController
} = require('../controllers/commentControoler')

const {
    likesGetController,
    dislikeGetController
} = require('../controllers/LikeDislikeController')

const {
    bookmarksGetController
} = require('../controllers/bookmarkController')
router.post('/comments/:postId', isAuthenticated, createCommentPostController)
router.post('/comments/replies/:commentId', isAuthenticated, replyCommentPostController)

router.get('/likes/:postId', isAuthenticated, likesGetController)
router.get('/dislikes/:postId', isAuthenticated, dislikeGetController)

router.get('/bookmarks/:postId', isAuthenticated, bookmarksGetController)

module.exports = router