const mongoose = require('mongoose');
const TaskModel = mongoose.model('Task');

const create = async (Model, req, res) => {
  // Find document by id
  if (req.body.budget === null || req.body.budget === undefined) {
    req.body.budget = '$ 0';
    req.body.isfixed = true;
  } else {
    if (req.body.prefix === 'fixed') {
      req.body.budget = '$ ' + req.body.budget;
      req.body.isfixed = true;
    } else {
      req.body.budget = req.body.budget + ' H';
      req.body.isfixed = false;
    }
  }

  // let projectCnt = await Model.countDocuments();
  // let formattedCnt = String(projectCnt + 1).padStart(4, '0');
  // req.body.projectid = `2024-${formattedCnt}`;

  // if (req.body.projectname) {
  //   let people = await Model.findOne({
  //     email: req.body.projectname,
  //   });

  //   if (people) {
  //     return res.status(403).json({
  //       success: false,
  //       result: null,
  //       message: 'Project Name Already Exist',
  //     });
  //   }
  // }

  req.body.removed = false;
  const result = await new Model({
    ...req.body,
  }).save();

  const { subtask, _id, clientname, status } = result;

  const createNewTask = async (name) => {
    // console.log(status);
    // console.log(name);
    // console.log(_id);
    const res = await new TaskModel({
      name: name,
      project: _id,
      client: clientname,
      status: status,
    }).save();

    // console.log(res);
  };

  subtask &&
    subtask.map((item) => {
      createNewTask(item);
    });

  return res.status(200).json({
    success: true,
    result,
    message: 'Successfully Created Project',
  });
};

module.exports = create;
