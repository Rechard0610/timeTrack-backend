const { migrate } = require('./migrate');
const mongoose = require('mongoose');

const today = new Date(); // Get current date and time
const startDate = today.setUTCHours(0, 0, 0, 0);
const endDate = today.setUTCHours(23, 59, 59, 999);

const paginatedList = async (Model, req, res) => {
  const page = req.query.page || 1;

  const limit = parseInt(req.query.items) || 100;
  const skip = page * limit - limit;

  const { sortBy = 'enabled', sortValue = -1, filter, equal, userId } = req.query;

  const fieldsArray = req.query.fields ? req.query.fields.split(',') : [];

  let fields;

  fields = fieldsArray.length === 0 ? {} : { $or: [] };

  for (const field of fieldsArray) {
    fields.$or.push({ [field]: { $regex: new RegExp(req.query.q, 'i') } });
  }
  //  Query the database for a list of all results
  const resultsPromise = Model.aggregate([
    {
      $lookup: {
        from: 'admins', // Assuming the name of the client collection is 'clients'
        localField: 'userId',
        foreignField: '_id',
        as: 'users',
      },
    },
    {
      $unwind: '$users',
    },
    {
      $match: {
        removed: false,
        status: equal,
        $or: [
          { 'users.invitedById': new mongoose.Types.ObjectId(userId) },
          { 'users._id': new mongoose.Types.ObjectId(userId) },
        ],
        // created: {
        //   $gte: new Date(startDate),
        //   $lte: new Date(endDate),
        // },
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
    {
      $sort: { [sortBy]: sortValue },
    },
  ]).exec();

  // Counting the total documents
  const countPromise = Model.aggregate([
    {
      $lookup: {
        from: 'admins', // Assuming the name of the client collection is 'clients'
        localField: 'userId',
        foreignField: '_id',
        as: 'users',
      },
    },
    {
      $unwind: '$users',
    },
    {
      $match: {
        removed: false,
        status: equal,
        $or: [
          { 'users.invitedById': new mongoose.Types.ObjectId(userId) },
          { 'users._id': new mongoose.Types.ObjectId(userId) },
        ],
        // created: {
        //   $gte: new Date(startDate),
        //   $lte: new Date(endDate),
        // },
      },
    },
    {
      $count: 'total',
    },
  ]).exec();
  // Resolving both promises
  const [result, count] = await Promise.all([resultsPromise, countPromise]);
  // console.log('🚀 ~ file: paginatedList.js:23 ~ paginatedList ~ result:', result);
  const populatedResult = await Model.populate(result, [
    {
      path: 'project',
      model: 'Project',
    },
    {
      path: 'task',
      model: 'Task',
    },
  ]);
  // Calculating total pages
  const total = count[0] && count[0].total;
  const pages = Math.ceil(total / limit);

  console.log(populatedResult);

  const pagination = { page, pages, count: total };
  if (total > 0) {
    // console.log('🚀 ~ file: paginatedList.js:23 ~ paginatedList ~ migratedData:', migratedData);
    return res.status(200).json({
      success: true,
      result: populatedResult,
      pagination,
      message: 'Successfully found all documents',
    });
  } else {
    return res.status(203).json({
      success: true,
      result: [],
      pagination,
      message: 'Collection is Empty',
    });
  }
};

module.exports = paginatedList;
