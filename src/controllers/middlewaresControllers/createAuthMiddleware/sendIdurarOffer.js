const { afterRegistrationSuccess } = require('@/emailTemplate/emailVerfication');

const { Resend } = require('resend');

const sendIdurarOffer = async ({ email, name }) => {
  const resend = new Resend(process.env.RESEND_API);

  const { data } = await resend.emails.send({
    from: 'vengilancer@gmail.com',
    to: email,
    subject: 'Customize your own SaaS',
    html: afterRegistrationSuccess({ name }),
  });

  return data;
};

module.exports = sendIdurarOffer;
