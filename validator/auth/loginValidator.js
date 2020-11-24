const {
    body
} = require('express-validator')

module.exports = [
    body('email')
    .not().isEmpty().withMessage('Email Can,t  Be  Empty'),
    body('password')
    .not().isEmpty().withMessage('Password Cant  Not Be Empty ')
]