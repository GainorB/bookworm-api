const nodemailer = require('nodemailer');

const from = '"Bookworm" <info@bookworm.com>';

function setup() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

function sendConfirmationEmail(user) {
  const transport = setup();

  const email = {
    from,
    to: user.email,
    subject: 'Welcome to Bookworm',
    text: `
    Welcome to Bookworm. Please, confirm your email.

    ${user.generateConfirmationURL()}
    `
  };

  transport.sendMail(email);
}

module.exports = sendConfirmationEmail;
