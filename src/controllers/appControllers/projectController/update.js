const mongoose = require('mongoose');
const Client = mongoose.model('Client');
const Lead = mongoose.model('People');

const update = async (Model, req, res) => {
  if (req.body.budget == null || req.body.budget === undefined) {
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
  // Find document by id and updates with the required fields
  req.body.removed = false;
  const result = await Model.findOneAndUpdate({ _id: req.params.id, removed: false }, req.body, {
    new: true, // return the new result instead of the old one
    runValidators: true,
  }).exec();

  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No document found ',
    });
  } else {
    // await Client.findOneAndUpdate(
    //   { company: result._id },
    //   { name: result.firstname + ' ' + result.lastname },
    //   {
    //     new: true, // return the new result instead of the old one
    //   }
    // ).exec();

    // await Lead.findOneAndUpdate(
    //   { company: result._id },
    //   { name: result.firstname + ' ' + result.lastname },
    //   {
    //     new: true, // return the new result instead of the old one
    //   }
    // ).exec();

    return res.status(200).json({
      success: true,
      result,
      message: 'we update this document ',
    });
  }
};

module.exports = update;
