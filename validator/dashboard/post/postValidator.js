const {
    body
} = require('express-validator')
const cheerio = require('cheerio')

module.exports = [
    body('title')
    .not().isEmpty().withMessage('Title Can not be emty ')
    .isLength({
        max: 100
    }).withMessage('Title Can Not Be Greater Than 100 Chars')
    .trim(),
    body('body')
    .not().isEmpty().withMessage('Body Can not be emty')
    .custom(value => {
        let node = cheerio.load(value)
        let text = node.text()

        if (text.length > 5000) {
            throw new Error('Body Cant not bet grater than 5000 chars')
        }
        return true
    }),
    body('tags')
    .not().isEmpty().withMessage('Tags Can not be emty ')
]