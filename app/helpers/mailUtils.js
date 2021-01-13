const nodemailer = require('nodemailer');
const logger = require('../../app/logger/index');

const {
  common: {
    nodemailer: CREDENTIALS,
    nodemailer: {
      auth: { user: SENDER }
    }
  }
} = require('../../config/index');

const MailUtils = module.exports;

MailUtils.sendMail = async ({ email, name }, password = '******') => {
  const message = {
    from: SENDER,
    to: email,
    subject: 'ws-express sign-up',
    html: `
    <div style="margin: 0em 0em 8em 4em;">
    <h1>Sign up successful</h1>
    <p>Welcome ${name}</p>
    <ul>
    <li><strong>Name</strong>: ${name}</li>
    <li><strong>Email</strong>:${email}</li>
    <li><strong>Password</strong>:${password}</li>
    </ul>
    </div>
    `
  };

  try {
    const transporter = nodemailer.createTransport(CREDENTIALS);
    const emailInfo = await transporter.sendMail(message);

    transporter.close();
    logger.info(emailInfo);

    return emailInfo;
  } catch (error) {
    logger.error(error);
    return error;
  }
};
