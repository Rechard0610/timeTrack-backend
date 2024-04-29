const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');
const shortid = require('shortid');

const register = async (req, res, { userModel }) => {
  const UserPasswordModel = mongoose.model(userModel + 'Password');
  const UserModel = mongoose.model(userModel);
  const PeopleModel = mongoose.model('People');
  const RecordSettingModel = mongoose.model('RecordSetting');
  const { email, password, firstname, lastname, role } = req.body;

  // Validate input
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(), // Password should be at least 6 characters
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    // role: Joi.string().required(),
  });

  const { error } = schema.validate({ email, password, firstname, lastname });
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  try {
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: 'Email address is already registered' });
    }
    var userRole = 'owner';
    var invitedById = '';
    const people = await PeopleModel.findOne({ email });
    // if exist people,  get a role and updated status

    // Create a new user
    const newUser = new UserModel({
      firstname: firstname,
      lastname: lastname,
      role: userRole,
      email: email,
      // Add other user properties here if needed
    });

    if (people) {
      userRole = people.role;
      invitedById = people.invitedById;
      await PeopleModel.findOneAndUpdate({ _id: people._id }, { status: true }).exec();
      newUser.role = userRole;
      newUser.invitedById = invitedById;
    }

    // Save the user to the database
    const owner = await newUser.save();
    console.log(owner);
    // if (!people) {
    //   // if the owner register now
    //   const record = {
    //     userId: owner._id,
    //   };
    //   await new RecordSettingModel({
    //     ...req.body,
    //   }).save();
    // }

    const salt = shortid.generate();
    const hashedPassword = bcrypt.hashSync(salt + password);
    const emailToken = shortid.generate();

    const token = jwt.sign(
      {
        id: newUser._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Create a new user
    const newUserPassword = new UserPasswordModel({
      user: newUser._id,
      password: hashedPassword,
      salt: salt,
      emailToken: emailToken,
      resetToken: shortid.generate(),
      emailVerified: true,
    });

    // Save the user to the database
    await newUserPassword.save();

    // Optionally, you may generate a JWT token here and send it in the response for automatic login

    // Respond with success message
    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    // Handle database or server errors
    console.error('Error during user registration:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = register;
