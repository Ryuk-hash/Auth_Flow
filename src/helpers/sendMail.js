const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
})

const sendVerifyMail = (email, message) => {
    const emailOption = {
        from: process.env.EMAIL,
        to: `${email}`,
        subject: 'Verify Email!',
        html: `${message}`
    }
    transporter.sendMail(emailOption, (err, data) => {
        if (err) {
            return console.log('Error occured: ', err)
        }
        return console.log('Email sent!!')
    })
}

const sendResetMail = (email, message) => {
    const emailOption = {
        from: process.env.EMAIL,
        to: `${email}`,
        subject: 'Reset Account Password!',
        html: `${message}`
    }
    transporter.sendMail(emailOption, (err, data) => {
        if (err) {
            return console.log('Error occured: ', err)
        }
        return console.log('Email sent!!')
    })
}

module.exports = {
    sendVerifyMail, sendResetMail
}