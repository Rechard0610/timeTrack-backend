let projectList = require('./project');
let taskList = require('./task');
let create = require('./create');

function modelController() {
  let methods = {};

  methods.projectList = (req, res) => projectList(req, res);
  methods.taskList = (req, res) => taskList(req, res);
  methods.create = (req, res) => create(req, res);

  return methods;
}

module.exports = modelController();
