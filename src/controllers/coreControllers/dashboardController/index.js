const summary = require('./summary');
const update = require('./update');
const loggedList = require('./loggedList');
const activityList = require('./activityList');
const productivityList = require('./productivityList');
const projectChart = require('./projectChart');
const assignedProject = require('./assignedProject');
const onGoingTask = require('./onGoingTask');
const timeSheet = require('./timeSheet');

const today = new Date();
const startOfWeek = new Date(today);
startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
const endOfWeek = new Date(today);
endOfWeek.setDate(startOfWeek.getDate() + 6);

const range = {
  startDate: startOfWeek.setUTCHours(0, 0, 0, 0),
  endDate: endOfWeek.setUTCHours(23, 59, 59, 999),
};

const methods = {
  loggedList: (req, res) => loggedList(req, res, range),
  activityList: (req, res) => activityList(req, res, range),
  productivityList: (req, res) => productivityList(req, res, range),
  projectChart: (req, res) => projectChart(req, res, range),
  assignedProject: (req, res) => assignedProject(req, res, range),
  onGoingTask: (req, res) => onGoingTask(req, res),
  timeSheet: (req, res) => timeSheet(req, res),
};

module.exports = methods;
