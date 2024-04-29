const create = async (Model, req, res, Resend) => {
  // Find document by id
  if (req.body.invitegmail) {
    let people = await Model.findOne({
      email: req.body.invitegmail,
    });

    if (people) {
      return res.status(403).json({
        success: false,
        result: null,
        message: 'Member Already Exist',
      });
    }
  }

  req.body.removed = false;
  const result = await new Model({
    ...req.body,
  }).save();
  // If no results found, return document not found
  // const no_reply = 'victor.alvarez.illusgmail.com';
  // const inviteLink = 'https://yourwebsite.com/invite';

  // // make invite link
  // const resend = new Resend(process.env.RESEND_API);
  // const { data } = await resend.emails.send({
  //   from: no_reply,
  //   to: req.body.email,
  //   // html: SendQuote({ name, title: 'Quote From ' + company_name }),
  //   text: `Hello,\n\nYou have been invited to join our platform. Click on the following link to sign up:\n\n${inviteLink}\n\nRegards,\nYour Name`, // plain text body
  //   html: `<p>Hello,</p><p>You have been invited to join our platform. Click on the following link to sign up:</p><p><a href="${inviteLink}">${inviteLink}</a></p><p>Regards,<br>Your Name</p>`, // html body
  // });
  // const transporter = nodemailer.createTransport({
  //   service: 'Gmail', // Use your email service provider
  //   auth: {
  //     user: 'victor.alvarez.illusgmail.com', // Your email address
  //     pass: 'qwasde234', // Your email password or app password
  //   },
  // });

  // const sendInviteEmail = async (email, inviteLink) => {
  //   try {
  //     // Send mail with defined transport object
  //     let info = await transporter.sendMail({
  //       from: '"Your Name" <your_email@gmail.com>', // sender address
  //       to: email, // list of receivers
  //       subject: 'Invitation to join our platform', // Subject line
  //       text: `Hello,\n\nYou have been invited to join our platform. Click on the following link to sign up:\n\n${inviteLink}\n\nRegards,\nYour Name`, // plain text body
  //       html: `<p>Hello,</p><p>You have been invited to join our platform. Click on the following link to sign up:</p><p><a href="${inviteLink}">${inviteLink}</a></p><p>Regards,<br>Your Name</p>`, // html body
  //     });

  //     console.log('Message sent: %s', info.messageId);
  //   } catch (error) {
  //     console.error('Error sending email:', error);
  //   }
  // };

  // // Example usage:
  // // Replace 'member_email@example.com' with the actual email of the member
  // // Replace 'inviteLink' with the actual invite link generated earlier
  // console.log('-----------------');
  // console.log(req.body.email);
  // console.log('=================');

  // sendInviteEmail(req.body.email, 'https://yourwebsite.com/invite/');

  return res.status(200).json({
    success: true,
    result,
    message: 'Successfully Sent Invite',
  });
};

module.exports = create;
