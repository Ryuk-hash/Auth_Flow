const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Joi = require('joi')

const userModel = require('../models/User')
const tokenModel = require('../models/Token')

const { userSchema } = require('../helpers/validate_schema')
const { sendVerifyMail, sendResetMail } = require('../helpers/sendMail')

exports.registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = await userSchema.validateAsync(req.body)

        const user = await userModel.findOne({ email: { $eq: email } })

        if (user) {
            return res.status(409).json({
                message: 'Email address already in use!'
            })
        }

        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                return res.status(500).json({
                    msg: 'User registration failed!',
                    error: err
                })
            }

            const user = new userModel({
                firstName, lastName, email, password: hash
            })

            const token = new tokenModel({
                userId: user._id,
                token: Math.floor(1000 + Math.random() * 9000)
            })

            await user.save()
            await token.save()

            const message = `${process.env.BASE_URL}/api/v1/user/verify/${user._id}/${token.token}`

            sendVerifyMail(email, message)

            res.status(201).json({
                message: 'An email has been sent to your account. Please verify!',
            })
        })
    } catch (err) {
        res.status(500).json({
            msg: 'Error!!',
            error: err
        })
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await userModel.findOne({ email: { $eq: email } })

        if (!user) {
            return res.status(403).json({
                message: 'Email address is not registered!'
            })
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: 'Login failed!',
                    error: err
                })
            }
            if (!result) {
                return res.status(403).json({
                    msg: 'Invalid username/password!'
                })
            }

            if (!user.verified) {
                return res.status(403).json({
                    msg: 'Kindly verify email address before login!'
                })
            }

            // Generates a new signed JWT token
            const token = jwt.sign(
                {
                    email,
                    userId: user._id
                },
                process.env.JWT_KEY,
                {
                    expiresIn: '1h'
                }
            );

            return res.status(200).json({
                userId: user._id,
                email,
                message: 'Login successful!!',
                token
            })
        })
    } catch (err) {
        res.status(500).json({
            msg: 'Error!!',
            error: err
        })
    }
}

exports.verifyUser = async (req, res) => {
    try {
        const { userId, token } = req.params

        const user = await userModel.findOne({ _id: userId })

        if (!user) {
            return res.status(400).json({
                msg: 'Verification link is invalid!'
            })
        }

        const userToken = await tokenModel.findOne({ userId: userId, token: token })

        if (!userToken) {
            return res.status(400).json({
                msg: 'Verification link is invalid!'
            })
        }

        await userModel.findOneAndUpdate({ _id: userId }, { verified: true })
        await tokenModel.findByIdAndRemove(userToken._id)

        res.status(200).json({
            msg: 'Email is verified successfully! Login to generate JWT token!'
        })
    }
    catch (err) {
        res.status(500).json({
            msg: 'Error!',
            error: err
        })
    }
}

exports.send_password_reset_link=async (req, res) => {
    try {
        const schema = Joi.object({ email: Joi.string().email().required() })
        const { err } = schema.validate(req.body)
        const { email } = req.body

        if (err) {
            return res.status(400).json({
                msg: 'Error!',
                error: err
            })
        }

        const user = await userModel.findOne({ email: email })

        if (!user) {
            return res.status(404).json({
                msg: 'Email address is not registered!!'
            })
        }

        const token = new tokenModel({
            userId: user._id,
            token: Math.floor(1000 + Math.random() * 9000)
        })

        await token.save()

        const message = `${process.env.BASE_URL}/api/v1/user/password-reset/${user._id}/${token.token}`

        sendResetMail(email, message)

        res.status(201).json({
            message: 'Password reset link has been sent to your email address!'
        })
    } catch (err) {
        res.status(500).json({
            msg: 'Error!!',
            error: err
        })
    }
}

exports.reset_password=async (req, res) => {
    try {
        const { userId, token } = req.params
        const { password } = req.body

        const user = await userModel.findOne({ _id: userId })

        if (!user) {
            return res.status(400).json({
                msg: 'Password reset link is invalid!'
            })
        }

        const userToken = await tokenModel.findOne({ userId: userId, token: token })

        if (!userToken) {
            return res.status(400).json({
                msg: 'Password reset link is invalid!'
            })
        }

        // Else userId and token is valid. So we can change our user password
        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                return res.status(500).json({
                    msg: 'Password reset failed!',
                    error: err
                })
            }
            user.password = hash
            await user.save()
            await tokenModel.findByIdAndRemove(userToken._id)
        })

        res.status(200).json({
            msg: 'Password reset successful. Login with your new account password!'
        })
    }
    catch (err) {
        res.status(500).json({
            msg: 'Error!!',
            error: err
        })
    }
}