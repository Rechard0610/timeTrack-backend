const mongoose = require('mongoose');

const paginatedList = async (Model, req, res) => {
  const page = req.query.page || 1;
  const limit = parseInt(req.query.items) || 10;
  const skip = page * limit - limit;

  const currentDate = new Date();
  let startDayOfWeek = currentDate.setUTCHours(0, 0, 0, 0);
  let endDayOfWeek = currentDate.setUTCHours(23, 59, 59, 999);

  const {
    sortBy = 'range',
    sortValue = -1,
    filter,
    equal,
    project,
    user,
    startDay,
    endDay,
    inviteId,
    id,
  } = req.query;

  // console.log(req.query);

  if (startDay && startDay != '') {
    startDayOfWeek = new Date(startDay).setUTCHours(0, 0, 0, 0);
    endDayOfWeek = new Date(endDay).setUTCHours(23, 59, 59, 999);
  }

  // console.log(startDayOfWeek);
  // console.log(endDayOfWeek);

  const fieldsArray = req.query.fields ? req.query.fields.split(',') : [];

  let fields;

  fields = fieldsArray.length === 0 ? {} : { $or: [] };

  for (const field of fieldsArray) {
    fields.$or.push({ [field]: { $regex: new RegExp(req.query.q, 'i') } });
  }

  const query = {
    removed: false,
    ...fields,
    // $or: [
    //   {
    //     'userDetails.invitedById': inviteId ? new mongoose.Types.ObjectId(inviteId) : undefined,
    //   },
    //   {
    //     'userDetails._id': id ? new mongoose.Types.ObjectId(id) : undefined,
    //   },
    //   { userDetails: { $exists: false } }, // Handle case where userDetails doesn't exist
    // ],
    created: {
      $gte: new Date(startDayOfWeek),
      $lt: new Date(endDayOfWeek),
    },
  };

  if (user && user != '' && user != 'all') {
    query['user'] = new mongoose.Types.ObjectId(user);
  }
  if (project && project != '') {
    query['project'] = new mongoose.Types.ObjectId(project);
  }

  // console.log(query);

  // Constructing aggregation pipeline
  const pipeline = [
    {
      $lookup: {
        from: 'admins',
        localField: 'user',
        foreignField: '_id',
        as: 'userDetails',
      },
    },
    {
      $match: query,
    },
    {
      $sort: { [sortBy]: parseInt(sortValue) },
    },
    {
      $unwind: '$userDetails', // unwind userDetails array
    },
    {
      $project: {
        userDetailsId: '$userDetails._id', // Keep userDetails._id for grouping
        date: { $dateToString: { format: '%Y-%m-%d', date: '$created' } }, // Format the date field
        userDetails: 1, // Keep userDetails object if needed
        docs: '$$ROOT',
        valueToSum: '$range',
      },
    },
    {
      $group: {
        _id: {
          userDetailsId: '$userDetailsId', // Group by userDetails._id
          date: '$date', // Group by formatted date
          typeId: '$docs.typeId', // Group by typeId
          // app: '$docs.url', // Group by typeId
        },
        userDetails: { $first: '$userDetails' }, // Keep the userDetails object
        docs: { $push: '$docs' }, // Push the documents into an array
        sumValue: { $sum: '$valueToSum' },
      },
    },
    {
      $group: {
        _id: {
          userDetailsId: '$_id.userDetailsId', // Group by userDetails._id
          projectId: '$_id.projectId', // Group by project_id
          date: '$_id.date', // Group by formatted date
        },
        userDetails: { $first: '$userDetails' }, // Keep the userDetails object
        docs: { $push: { typeId: '$_id.typeId', docs: '$docs', sumValue: '$sumValue' } }, // Push the documents into an array grouped by typeId
        sumValue: { $sum: '$sumValue' },
      },
    },
    {
      $project: {
        _id: 0,
        userDetails: 1,
        sumValue: 1,
        date: '$_id.date',
        docs: 1,
      },
    },
    {
      $sort: { date: -1 },
    },
  ];

  // Aggregate the data
  const resultsPromise = Model.aggregate(pipeline);

  // Counting the total documents
  const countPipeline = [
    {
      $match: query,
    },
    {
      $count: 'total',
    },
  ];

  // Count documents using aggregation
  const countResult = await Model.aggregate(countPipeline);

  // Extract count from aggregation result
  const count = countResult.length > 0 ? countResult[0].total : 0;

  // Calculating total pages
  const pages = Math.ceil(count / limit);

  // console.log(await resultsPromise);

  // Getting Pagination Object
  const pagination = { page, pages, count };
  console.log(await resultsPromise);
  if (count > 0) {
    return res.status(200).json({
      success: true,
      result: await resultsPromise,
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
