const create = async (Model, req, res) => {
  // Find document by id
  if (req.body.teamname) {
    let team = await Model.findOne({
      teamname: req.body.teamname,
    });

    if (team) {
      return res.status(403).json({
        success: false,
        result: null,
        message: 'Team Already Exist',
      });
    }
  }

  req.body.removed = false;
  const result = await new Model({
    ...req.body,
  }).save();
  // If no results found, return document not found
  return res.status(200).json({
    success: true,
    result,
    message: 'Successfully Created Team',
  });
};

module.exports = create;
