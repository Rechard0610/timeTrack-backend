const mongoose = require('mongoose');

const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const create = require('./create');
const read = require('./read');
const remove = require('./remove');
const update = require('./update');
const updateAll = require('./updateAll');
const paginatedList = require('./paginatedList');
const search = require('./search');

function modelController() {
  const Model = mongoose.model('Lunch');
  const methods = createCRUDController('Lunch');

  methods.create = (req, res) => create(Model, req, res);
  methods.read = (req, res) => read(Model, req, res);
  methods.update = (req, res) => update(Model, req, res);
  methods.delete = (req, res) => remove(Model, req, res);
  methods.list = (req, res) => paginatedList(Model, req, res);
  methods.updateAll = (req, res) => updateAll(Model, req, res);
  // methods.search = (req, res) => search(Model, req, res);

  return methods;
}

module.exports = modelController();
