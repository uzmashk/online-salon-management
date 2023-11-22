const nodemailer = require('nodemailer'); 

let mailTransporter = nodemailer.createTransport({ 
    service: 'gmail', 
    auth: { 
        user: process.env.EMAILID, 
        pass: process.env.PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
}); 

module.exports = {
    mailTransporter,
}
  