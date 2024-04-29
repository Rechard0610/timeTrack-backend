const mongoose = require('mongoose');

const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const create = require('./create');
const read = require('./read');
const remove = require('./remove');
const update = require('./update');
const paginatedList = require('./paginatedList');
const updateChild = require('./updateChild');

const budget = require('./budget');

function modelController() {
  const Model = mongoose.model('Task');
  const methods = createCRUDController('Task');

  methods.create = (req, res) => create(Model, req, res);
  methods.read = (req, res) => read(Model, req, res);
  methods.update = (req, res) => update(Model, req, res);
  methods.delete = (req, res) => remove(Model, req, res);
  methods.list = (req, res) => paginatedList(Model, req, res);
  methods.updateChild = (req, res) => updateChild(Model, req, res);

  methods.budget = (req, res) => budget(Model, req, res);

  return methods;
}

module.exports = modelController();
