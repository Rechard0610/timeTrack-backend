const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authUser = async (req, res, { user, databasePassword, password, UserPasswordModel }) => {
  const isMatch = await bcrypt.compare(databasePassword.salt + password, databasePassword.password);

  if (!isMatch)
    return res.status(403).json({
      success: false,
      result: null,
      message: 'Invalid credentials.',
    });

  if (isMatch === true) {
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: req.body.remember ? 365 * 24 + 'h' : '24h' }
    );

    await UserPasswordModel.findOneAndUpdate(
      { user: user._id },
      { $push: { loggedSessions: token } },
      {
        new: true,
      }
    ).exec();

    res
      .status(200)
      .cookie('token', token, {
        maxAge: req.body.remember ? 365 * 24 * 60 * 60 * 1000 : null,
        sameSite: 'lax',
        httpOnly: true,
        secure: true,
        domain: 'localhost',
        path: '/',
        Partitioned: false,
        // sameSite: 'none',
        // httpOnly: false,
        // secure: true,
        // domain: 'timetrack-service.onrender.com',
        // path: '/',
        // Partitioned: true,
      })
      .json({
        success: true,
        result: {
          _id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          role: user.role,
          email: user.email,
          photo: user.photo,
        },
        message: 'Successfully login user',
      });
  } else {
    return res.status(403).json({
      success: false,
      result: null,
      message: 'Invalid credentials.',
    });
  }
};

module.exports = authUser;
