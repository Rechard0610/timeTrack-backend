const mongoose = require('mongoose');
const TaskModel = mongoose.model('Task');

const updateChild = async (Model, req, res) => {
  // Find document by id and updates with the required fields
  const { id, status } = req.body;
  // console.log(req.body);

  req.body.removed = false;
  const result = await TaskModel.updateMany(
    { project: new mongoose.Types.ObjectId(id), removed: false },
    { status: status },
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
      message: 'we update task document ',
    });
  }
};

module.exports = updateChild;
