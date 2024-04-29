const mongoose = require('mongoose');

const update = async (Model, req, res) => {
  const { name, type } = req.body;
  // Find document by id and updates with the required fields
  req.body.removed = false;
  const result = await Model.updateMany(
    { $or: [{ app: name }, { url: name }], removed: false },
    { typeId: type },
    {
      new: true, // return the new result instead of the old one
      runValidators: true,
    }
  ).exec();

  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No document found ',
    });
  }

  return res.status(200).json({
    success: true,
    result,
    message: 'we update this document ',
  });
};

module.exports = update;
