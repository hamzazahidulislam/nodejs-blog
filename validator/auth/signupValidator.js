const {
    body
} = require('express-validator')
const User = require('../../models/User')
module.exports = [
    body('username')
    .isLength({
        min: 2,
        max: 15
    }).withMessage('Username Must be Between  2 to  15')
    .custom(async username => {
        let user = await User.findOne({
            username
        })
        if (user) {
            return Promise.reject('Username  Already  Used')
        }
    })
    .trim(),
    body('email')
    .isEmail().withMessage('Please Provide  a Valid  Email')
    .custom(async email => {
        let user = await User.findOne({
            email
        })
        if (user) {
            return Promise.reject('Email  Already  Used')
        }
    })
    .normalizeEmail(),
    body('password')
    .isLength({
        min: 5
    }).withMessage('your password must be Greater Than 5 Characters '),
    body('confirmPassword')
    .isLength({
        min: 5
    }).withMessage('your password must be Greater Than 5 Characters ')
    .custom((confirmPassword, {
        req
    }) => {
        if (confirmPassword != req.body.password) {
            throw new Error('Pssword Does  Not Macth')
        }
        return true
    })
]