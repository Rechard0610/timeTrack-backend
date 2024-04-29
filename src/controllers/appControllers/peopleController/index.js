const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const { Resend } = require('resend');

const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const create = require('./create');
const read = require('./read');
const remove = require('./remove');
const update = require('./update');
const paginatedList = require('./paginatedList');
const search = require('./search');

function modelController() {
  const Model = mongoose.model('People');
  const methods = createCRUDController('People');

  methods.create = (req, res) => create(Model, req, res, Resend);
  methods.read = (req, res) => read(Model, req, res);
  methods.update = (req, res) => update(Model, req, res);
  methods.delete = (req, res) => remove(Model, req, res);
  methods.list = (req, res) => paginatedList(Model, req, res);
  // methods.search = (req, res) => search(Model, req, res);

  return methods;
}

module.exports = modelController();
