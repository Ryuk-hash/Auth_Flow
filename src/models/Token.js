const mongoose = require('mongoose')

// Create user schema for authentication
const tokenSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    token: {
        type: Number,
        required: true
    },
})

module.exports = mongoose.model('tokenModel', tokenSchema)