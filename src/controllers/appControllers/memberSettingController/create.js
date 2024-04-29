const create = async (Model, req, res) => {
  // Find document by id
  req.body.userId = req.body.userId._id;
  delete req.body._id;
  req.body.removed = false;
  const result = await new Model({
    ...req.body,
  }).save();

  return res.status(200).json({
    success: true,
    result,
    message: 'Successfully Created',
  });
};

module.exports = create;
