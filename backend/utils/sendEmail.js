const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a test account on Ethereal Email (only used for local development)
  const testAccount = await nodemailer.createTestAccount();

  // 2. Create a transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  // 3. Define email options
  const message = {
    from: '"KhojAI Support" <support@khojai.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  // 4. Send the email
  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
  // Log the ethereal URL so we can click it in the terminal!
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};

module.exports = sendEmail;
