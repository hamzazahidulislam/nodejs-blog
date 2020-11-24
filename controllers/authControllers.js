const bcrypt = require('bcrypt')
const {
    validationResult
} = require('express-validator')
const Flash = require('../utils/Flash')
const User = require('../models/User')
const erroFormatter = require('../utils/validationErrorFormatter')
const {
    has
} = require('config')
// const {
//     use
// } = require('../routes/authRoute')

exports.signupGetController = (req, res, next) => {
    res.render('pages/auth/singup', {
        title: 'Create A New Account',
        error: {},
        value: {},
        flashMessage: Flash.getMessage(req)
    })
}
exports.signupPostController = async (req, res, next) => {
    let {
        username,
        email,
        password
    } = req.body
    let errors = validationResult(req).formatWith(erroFormatter)

    if (!errors.isEmpty()) {
        req.flash('fail', 'Please Check your Form')
        return res.render('pages/auth/singup', {
            title: 'Create A New Account',
            error: errors.mapped(),
            value: {
                username,
                email,
                password
            },
            flashMessage: Flash.getMessage(req)
        })
    }

    try {
        let hashedPassword = await bcrypt.hash(password, 11)
        let user = new User({
            username,
            email,
            password: hashedPassword
        })
        await user.save()
        req.flash('success', 'User Created  Successfully')
        // console.log('User Created Successfully', createdUser)
        res.redirect('/auth/login')
        // res.render('pages/auth/login', {
        //     title: 'Create A New Account',
        //     error: {},
        //     value: {},
        //     flashMessage: Flash.getMessage(req)
        // })
    } catch (error) {
        next(error)
    }

}
exports.loginGetController = (req, res, next) => {
    // console.log(req.session.isLoggedIn, req.session.user)
    res.render('pages/auth/login', {
        title: 'Login to your Account',
        error: {},
        flashMessage: Flash.getMessage(req)
    })
}
exports.loginPostController = async (req, res, next) => {
    let {
        email,
        password
    } = req.body
    let errors = validationResult(req).formatWith(erroFormatter)

    if (!errors.isEmpty()) {
        req.flash('fail', 'Please Check Your Form')
        return res.render('pages/auth/login', {
            title: 'Login to your Account',
            error: errors.mapped(),
            flashMessage: Flash.getMessage(req)
        })
    }
    try {
        let user = await User.findOne({
            email
        })
        if (!user) {
            req.flash('fail', 'plase provide valid credentials')
            return res.render('pages/auth/login', {
                title: 'Login to your Account',
                error: {},
                flashMessage: Flash.getMessage(req)
            })
        }

        let match = await bcrypt.compare(password, user.password)
        if (!match) {
            req.flash('fail', 'plase provide valid credentials')
            return res.render('pages/auth/login', {
                title: 'Login to your Account',
                error: {},
                flashMessage: Flash.getMessage(req)
            })
        }
        req.session.isLoggedIn = true
        req.session.user = user
        req.session.save(err => {
            if (err) {
                return next()
            }
            req.flash('success', 'Successfully Logged In')
            res.redirect('/dashboard')
        })
        // res.render('pages/auth/login', {
        //     title: 'Login to your Account',
        //     error: {}
        // })
    } catch (error) {
        next(error)
    }
}

exports.logoutGetController = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            return next()
        }
        // req.flash('success', 'Successfully Logout')

        return res.redirect('/auth/login')
    })
}
exports.changePasswordGetController = async (req, res, next) => {
    res.render('pages/auth/changePassword', {
        title: 'Change My Password',
        flashMessage: Flash.getMessage(req)
    })
}
exports.changePasswordPostController = async (req, res, next) => {
    let {
        oldPassword,
        newPassword,
        confirmPassword
    } = req.body

    if (newPassword != confirmPassword) {
        req.flash('fail', 'Password Does Not Match')
        return res.redirect('/auth/change-password')
    }
    try {
        let match = await bcrypt.compare(oldPassword, req.user.password)
        if (!match) {
            req.flash('fail', 'Invalid Old Password')
            return res.redirect('/auth/change-password')
        }
        let hash = await bcrypt.hash(newPassword, 11)
        await User.findOneAndUpdate({
            _id: req.user._id
        }, {
            $set: {
                password: hash
            }
        })
        req.flash('success', 'Pssword Updated Successfully')
        return res.redirect('/auth/change-password')
    } catch (error) {
        next(error)
    }

}