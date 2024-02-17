const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

function sendRegisterEmail(receiverEmail, token){
  let mailOptions = {
      from: process.env.EMAIL_ADDRESS, // Sender address
      to: receiverEmail, // List of recipients
      subject: "Registration of Account", // Subject line
      text: token // Plain text body
    };

  transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
      console.error(error);
  } else {
      console.log('Email sent: ' + info.response);
  }
  });
}

module.exports = {
  sendRegisterEmail : sendRegisterEmail,
}