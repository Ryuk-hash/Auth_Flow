const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
})

const subjects = ['Test Subject']

const sendMail = (email, message) => {
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

module.exports = {
    sendMail
}