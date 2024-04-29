const create = async (Model, req, res) => {
  // Find document by id
  req.body.removed = false;
  const result = await new Model({
    ...req.body,
  }).save();

  return res.status(200).json({
    success: true,
    result,
    message: 'Successfully Sent Invite',
  });
};

module.exports = create;
