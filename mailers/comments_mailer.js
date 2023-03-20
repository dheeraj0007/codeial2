const nodemailer = require('../config/nodemailer');

// this is another way of exporting a method
exports.newComment = (comment) => {
    console.log('inside newComment mailer');
    nodemailer.transporter.sendMail({
        to: comment.user.email,
        subject: "New comment published",
        html: `<h1>Yup , your comment is now published ${comment.content} </h1>`
    }, (err, info) => {
        if (err) {
            console.log("Error in sending mail ", err);
        }
        console.log("Message send", info);
        return;
    })
}