const mongoose = require('mongoose');

const TaskModel = mongoose.model('Task');

const taskList = async (req, res) => {
  const sort = parseInt(req.query.sort) || 'desc';

  //  Query the database for a list of all results
  const result = await TaskModel.find({
    'people.assign': req.body.id,
    project: req.body.projectId,
    removed: false,
  })
    .sort({ created: sort })
    .populate()
    .exec();

  if (result) {
    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully found all documents',
    });
  } else {
    return res.status(203).json({
      success: true,
      result: [],
      message: 'Collection is Empty',
    });
  }
};

module.exports = taskList;
