const nodemailer = require("nodemailer");

const sendForgotPasswordOtpEmail = (email, otp, userType) => {
  return new Promise((resolve, reject) => {
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      service: process.env.EMAIL_SERVICE,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_AUTH_USER,
        pass: process.env.EMAIL_AUTH_PASS,
      },
    });

    // afjgoacwipxnpula     app password for agri plus

    let mailOptions = {
      from: `NO-REPLY ${process.env.EMAIL_AUTH_USER}`,
      to: email,
      subject: "Password Reset OTP for Tech It Account",
      html: `<h1>${otp}</h1>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Email sending error: ", error);
        reject(error);
      } else {
        console.log("Email sent: ", info.response);
        resolve(info);
      }
    });
  });
};

const sendVerificationOtpEmail = (email, otp) => {
  return new Promise((resolve, reject) => {
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      service: process.env.EMAIL_SERVICE,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_AUTH_USER,
        pass: process.env.EMAIL_AUTH_PASS,
      },
    });

    // afjgoacwipxnpula     app password for agri plus

    let mailOptions = {
      from: `NO-REPLY ${process.env.EMAIL_AUTH_USER}`,
      to: email,
      subject: "Email Verification OTP for Tech It Account",
      html: `<h1>${otp}</h1>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Email sending error: ", error);
        reject(error);
      } else {
        console.log("Email sent: ", info.response);
        resolve(info);
      }
    });
  });
};

module.exports = {
  sendForgotPasswordOtpEmail,
  sendVerificationOtpEmail,
};
