let paginatedList = require('./paginatedList');

function modelController() {
  let methods = {};

  methods.list = (req, res) => paginatedList(req, res);

  return methods;
}

module.exports = modelController();
