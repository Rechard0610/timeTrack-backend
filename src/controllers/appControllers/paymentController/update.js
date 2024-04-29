const mongoose = require('mongoose');

const update = async (Model, req, res) => {
  // Find document by id and updates with the required fields
  req.body.removed = false;
  console.log(req.params.id);
  const existData = await Model.find({ _id: req.params.id, status: 'paid' });
  if (existData.length > 0) {
    return res.status(403).json({
      success: false,
      result: null,
      message: 'Already Paid or Declind by Admin',
    });
  }

  const result = await Model.findOneAndUpdate({ _id: req.params.id, removed: false }, req.body, {
    new: true, // return the new result instead of the old one
    runValidators: true,
  }).exec();

  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No document found ',
    });
  } else {
    return res.status(200).json({
      success: true,
      result,
      message: 'we update this document ',
    });
  }
};

module.exports = update;
