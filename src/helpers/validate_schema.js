const Joi = require('joi')

const userSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().required().min(2) // Change it to 8 chars later
})

module.exports = {
    userSchema
}