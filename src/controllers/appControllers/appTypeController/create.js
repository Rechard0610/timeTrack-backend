const create = async (Model, req, res) => {
  // Find document by id
  if (req.body.appname) {
    let app = await Model.findOne({
      appname: req.body.appname,
    });

    if (app) {
      return res.status(403).json({
        success: false,
        result: null,
        message: 'This App Already Exist',
      });
    }
  }

  req.body.removed = false;
  const result = await new Model({
    ...req.body,
  }).save();

  return res.status(200).json({
    success: true,
    result,
    message: 'Successfully Create App',
  });
};

module.exports = create;
