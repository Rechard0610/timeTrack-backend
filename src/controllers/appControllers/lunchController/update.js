const mongoose = require('mongoose');

const update = async (Model, req, res) => {
  // Find document by id and updates with the required fields
  req.body.removed = false;
  const data = req.body;
  data.total = data.mon + data.tue + data.wed + data.thu + data.fri + data.sat + data.sun;
  console.log(data);

  const result = await Model.findOneAndUpdate(
    {
      removed: false,
      _id: new mongoose.Types.ObjectId(req.params.id),
    },
    data,
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
  } else {
    return res.status(200).json({
      success: true,
      result,
      message: 'we update this document ',
    });
  }
};

module.exports = update;
