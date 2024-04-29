const timeLine = require('./timeLine');
const desktime = require('./desktime');
const timedescription = require('./timedescription');
const saveEditTime = require('./saveEditTime');
// const assignedProject = require('./assignedProject');
// const onGoingTask = require('./onGoingTask');
// const timeSheet = require('./timeSheet');

const methods = {
  timeLine: (req, res) => timeLine(req, res),
  desktime: (req, res) => desktime(req, res),
  timedescription: (req, res) => timedescription(req, res),
  saveEditTime: (req, res) => saveEditTime(req, res),
  //   activityList: (req, res) => activityList(req, res, range),
  //   productivityList: (req, res) => productivityList(req, res, range),
  //   projectChart: (req, res) => projectChart(req, res, range),
  //   assignedProject: (req, res) => assignedProject(req, res, range),
  //   onGoingTask: (req, res) => onGoingTask(req, res),
  //   timeSheet: (req, res) => timeSheet(req, res),
};

module.exports = methods;
