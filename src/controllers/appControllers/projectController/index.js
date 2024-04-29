const mongoose = require('mongoose');

const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const create = require('./create');
const read = require('./read');
const remove = require('./remove');
const update = require('./update');
const paginatedList = require('./paginatedList');
const count = require('./count');

function modelController() {
  const Model = mongoose.model('Project');
  const methods = createCRUDController('Project');

  methods.create = (req, res) => create(Model, req, res);
  methods.read = (req, res) => read(Model, req, res);
  methods.update = (req, res) => update(Model, req, res);
  methods.delete = (req, res) => remove(Model, req, res);
  methods.list = (req, res) => paginatedList(Model, req, res);
  methods.count = (req, res) => count(Model, req, res);

  return methods;
}

module.exports = modelController();
