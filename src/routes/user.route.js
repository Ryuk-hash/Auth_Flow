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

// @POST: Send password reset link
// @Access: public
router.post('/password-reset', userController.send_password_reset_link)

// @POST: Reset password
// @Access: public
router.post('/password-reset/:userId/:token', userController.reset_password)

module.exports = router