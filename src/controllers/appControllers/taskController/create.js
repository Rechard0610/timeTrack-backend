const mongoose = require('mongoose');
const ProjectModel = mongoose.model('Project');

const create = async (Model, req, res) => {
  // Find document by id

  if (req.body.taskname && req.body.project) {
    let task = await Model.findOne({
      taskname: req.body.taskname,
      project: req.body.project,
    });

    if (task) {
      return res.status(403).json({
        success: false,
        result: null,
        message: 'Task Already Exist',
      });
    }
  }

  const project = await ProjectModel.find({ _id: new mongoose.Types.ObjectId(req.body.project) });

  if (!req.body.budget) {
    req.body.budget = '0';
  } else {
    if (project[0].isfixed === true) {
      req.body.budget = '$ ' + req.body.budget;
      req.body.isfixed = true;
    } else {
      req.body.budget = req.body.budget + ' H';
      req.body.isfixed = false;
    }
  }
  req.body.client = project[0].clientname;

  req.body.removed = false;
  const result = await new Model({
    ...req.body,
  }).save();

  return res.status(200).json({
    success: true,
    result,
    message: 'Successfully Created Task',
  });
};

module.exports = create;
