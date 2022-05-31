const router = require('express').Router()

const userController = require('../controllers/user.controller')

// @GET: Register a new user
// @Access: public
router.post('/register', userController.registerUser)

// @POST: Login as existing user
// @Access: public
router.post('/login', userController.loginUser)

// @GET: Verify a registered user
// @Access: public
router.get('/verify/:userId/:token', userController.verifyUser)

module.exports = router