const emailConfig = require('../config/email.config');

const Excel = require('exceljs');

const generateExcel = async (result) => {

    var data = result;

    console.log("This from the email ", result)

    //console.log(n)

    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("My Sheet");

    worksheet.columns = [
        { header: 'id', key: 'id', width: 10 },
        { header: 'name', key: 'name', width: 32 },
        { header: 'cost', key: 'cost', width: 15, },
        { header: 'discountedCost', key: 'discountedCost', width: 32 },
        { header: 'duration', key: 'duration', width: 32 },
        { header: 'category', key: 'category', width: 15, }
    ];

    for (i in data) {
        worksheet.addRow(data[i]);
    }

    worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
    });

    const date = new Date().toISOString().slice(0, 10);
    var filename = 'licenseExpiry-' + date;
    var filenameEx = filename + '.xlsx';
    const path = __dirname + '/excelfile/' + filenameEx

    // save under export.xlsx
    await workbook.xlsx.writeFile(path);
    return path

}

//exTest();

const sendWelcomeEmail = (data, password) => {

    let mailDetails = {
        from: process.env.EMAILID,
        to: data.email,
        subject: `Welcome to Scissors And Comb Salon services`,
        html: `<h4>Dear ${data.firstname},</h4>
        <h4>Congratutlation! Your account on Scissors And Comb Salon is sucessfully created.</h4>
        <p>Below are your login credentials,
        <ul type=none>
        <li><b>emailId:</b> ${data.email}</li>
        <li><b>password:</b> ${password}</li>
        </ul>
        <br>Please login and change your password to access our services.        
        <br><br>Thank You,
        <br>Scissors And Comb</p>`
    };

    emailConfig.mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log('Error Occurs');
        } else {
            console.log('Email sent successfully');
        }
    });

}

const sendResetPasswordEmail = (data, password) => {

    let mailDetails = {
        from: process.env.EMAILID,
        to: data.email,
        subject: `Reset Password`,
        html: `<h4>Dear ${data.firstname},</h4>
        <p>Below are your reset password credentials,
        <ul type=none>
        <li><b>emailId:</b> ${data.email}</li>
        <li><b>password:</b> ${password}</li>
        </ul>
        <br>Just so you know: You have 7 days to reset your password. After that you have to ask for new one.
        <br>Didn't ask for a new password? You can ignore this email.
        <br><br>Thank You,
        <br>Scissors And Comb</p>`
    };

    emailConfig.mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log('Error Occurs');
        } else {
            console.log('Email sent successfully');
        }
    });

}

const sendFeedBackEmail = (data, link) => {

    let mailDetails = {
        from: process.env.EMAILID,
        to: data.email,
        subject: `Comb and Scissors Feedback form`,
        html: `<h4>Dear ${data.firstname},</h4>
        <p>Thank you for resgistering to Scissors and Comb.
        <br>Please help us improve our services by filling a quick feedback form. We would be extremely grateful.
        <ul type=none>
        <li><b>Link: </b>${link}</li>
        </ul>
        <br>Just so you know: You have 7 days to fill these form.
        <br><br>Thank You,
        <br>Scissors And Comb</p>`
    };

    emailConfig.mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log('Error Occurs');
        } else {
            console.log('Email sent successfully');
        }
    });

}

module.exports = {
    sendWelcomeEmail,
    sendResetPasswordEmail,
    sendFeedBackEmail,
    generateExcel

}