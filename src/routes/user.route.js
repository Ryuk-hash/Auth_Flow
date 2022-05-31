const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const router = express.Router()

//Import user model here


const errormsg = (err) => {
    res.status(500).json({
        error: err
    })
}

// @GET: Retrieve all users
// @Access: admin
router.get('/', async (req, res) => {
    try {
        res.json({ msg: 'Server running!!' })
    } catch (err) {
        errormsg(err)
    }
})

module.exports = router