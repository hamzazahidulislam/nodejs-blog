const Profile = require('../../models/Profile')

exports.bookmarksGetController = async (req, res, next) => {
    let {
        postId
    } = req.params
    console.log(postId)
    if (!req.user) {
        return res.status(403).jsoon({
            error: 'You are not an Authenticated user'
        })
    }
    let userId = req.user._id
    let bookmark = null
    try {
        console.log(' i am in try')
        let profile = await Profile.findOne({
            user: userId
        })

        if (profile.bookmarks.includes(postId)) {
            await Profile.findOneAndUpdate({
                user: userId
            }, {
                $pull: {
                    'bookmarks': postId
                }
            })
            bookmark = false
        } else {
            await Profile.findOneAndUpdate({
                user: userId
            }, {
                $push: {
                    'bookmarks': postId
                }
            })
            bookmark = true
        }
        console.log('i am 200 here')
        res.status(200).json({
            bookmark
        })

    } catch (error) {
        console.log(error)
        return res.status(500).jsoon({
            error: 'Server Error Occurred'
        })
    }
}