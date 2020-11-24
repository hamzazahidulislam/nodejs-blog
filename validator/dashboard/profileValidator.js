const {
    body
} = require('express-validator')
const validator = require('validator')


const linkValidator = value => {
    if (value) {
        if (!validator.isURL(value)) {
            throw new Error('Please Provide Valid Url')
        }
    }
    return true
}
module.exports = [
    body('name')
    .not().isEmpty().withMessage('name can not be Emty ')
    .isLength({
        max: 50
    }).withMessage('name can not be more than  50 chars')
    .trim(),
    body('title')
    .not().isEmpty().withMessage('title can not be Emty ')
    .isLength({
        max: 100
    }).withMessage('title can not be more than  100 chars')
    .trim(),
    body('bio')
    .not().isEmpty().withMessage('bio can not be Emty ')
    .isLength({
        max: 500
    }).withMessage('bio can not be more than  500 chars')
    .trim(),
    body('website')
    .custom(linkValidator),
    body('facebook')
    .custom(linkValidator),
    body('twitter')
    .custom(linkValidator),
    body('github')
    .custom(linkValidator),

]