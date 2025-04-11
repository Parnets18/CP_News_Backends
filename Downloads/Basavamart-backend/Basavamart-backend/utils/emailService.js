const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
  
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      text,
    });
    console.log('email',email)
  } catch (error) {
    console.error("Error sending email", error);
  }
};
module.exports = sendEmail;