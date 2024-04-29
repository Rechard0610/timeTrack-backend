const create = async (Model, req, res) => {
  // Creating a new document in the collection
  if (req.body.ContactGmail) {
    let client = await Model.findOne({
      name: req.body.name,
      ContactGmail: req.body.ContactGmail,
    });

    if (client) {
      return res.status(403).json({
        success: false,
        result: null,
        message: 'Client Already Exist',
      });
    }
  }

  req.body.removed = false;
  const result = await new Model({
    ...req.body,
  }).save();

  // Returning successfull response
  return res.status(200).json({
    success: true,
    result,
    message: 'Successfully Created the document in Model ',
  });
};

module.exports = create;
