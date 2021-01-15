const nodemailer = require('nodemailer');
const logger = require('../../app/logger/index');

const { congratulationsMail, signUpMail } = require('../constants/mailTemplates');

const {
  common: {
    nodemailer: CREDENTIALS,
    nodemailer: {
      auth: { user: SENDER }
    }
  }
} = require('../../config/index');

const MailUtils = module.exports;

MailUtils.sendMail = async message => {
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

MailUtils.sendSignUpMail = ({ email, name }, password = '******') => {
  const { subject, content } = signUpMail;

  const message = {
    from: SENDER,
    to: email,
    subject,
    html: content(email, name, password)
  };

  return MailUtils.sendMail(message);
};

MailUtils.sendCongratulationMail = ({ email, name }) => {
  const { subject, content } = congratulationsMail;

  const message = {
    from: SENDER,
    to: email,
    subject,
    html: content(name)
  };

  return MailUtils.sendMail(message);
};
