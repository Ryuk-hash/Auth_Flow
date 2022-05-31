const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { userSchema } = require('../config/validate_schema')

const userModel = require('../models/User')

const router = express.Router()

//Import user model here


// @GET: Register a new user
// @Access: public

router.post('/register', async (req, res) => {
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
            await user.save()

            res.status(201).json({
                message: 'User Registered Successfully. Kindly login to generate JWT token!!',
            })
        })
    } catch (err) {
        res.status(500).json({
            msg: 'Error!!',
            error: err
        })
    }
})

// @POST: Login as existing user
// @Access: public
router.post('/login', async (req, res) => {
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
})

module.exports = router