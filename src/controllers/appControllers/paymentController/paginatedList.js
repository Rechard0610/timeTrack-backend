const mongoose = require('mongoose');
const LunchModel = mongoose.model('Lunch');

const paginatedList = async (Model, req, res) => {
  const page = req.query.page || 1;
  const limit = parseInt(req.query.items) || 10;
  const skip = page * limit - limit;

  const { sortBy = 'enabled', sortValue = -1, filter, equal } = req.query;

  const fieldsArray = req.query.fields ? req.query.fields.split(',') : [];

  let fields;

  fields = fieldsArray.length === 0 ? {} : { $or: [] };

  for (const field of fieldsArray) {
    fields.$or.push({ [field]: { $regex: new RegExp(req.query.q, 'i') } });
  }

  let pagination, result;
  if (equal === 'approved') {
    try {
      const payments = await Model.find({ removed: false, [filter]: equal, ...fields });

      // Fetch all lunches
      const lunches = await LunchModel.aggregate([
        {
          $lookup: {
            from: 'admins', // Assuming the name of the admin collection is 'admins'
            localField: 'userId',
            foreignField: '_id',
            as: 'userId',
          },
        },
        {
          $lookup: {
            from: 'admins', // Assuming the name of the admin collection is 'admins'
            localField: 'recipient',
            foreignField: '_id',
            as: 'recipient',
          },
        },
        {
          $unwind: '$recipient',
        },
        {
          $unwind: '$userId',
        },
        {
          $addFields: {
            startOfWeek: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: {
                  $dateFromParts: {
                    isoWeekYear: { $isoWeekYear: '$created' },
                    isoWeek: { $isoWeek: '$created' },
                    isoDayOfWeek: 1,
                  },
                },
              },
            },
            endOfWeek: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: {
                  $dateFromParts: {
                    isoWeekYear: { $isoWeekYear: '$created' },
                    isoWeek: { $isoWeek: '$created' },
                    isoDayOfWeek: 7,
                  },
                },
              },
            },
          },
        },
        {
          $match: {
            removed: false,
            [filter]: equal,
          },
        },
        {
          $project: {
            _id: 1,
            userId: 1,
            recipient: 1,
            expenseCategory: 'Lunch',
            comment: { $concat: ['$startOfWeek', '~', '$endOfWeek'] },
            amount: '$total',
            status: 1,
            type: 'Lunch',
            created: 1,
            updated: 1,
          },
        },
      ]);

      // Merge payments and lunches into one array
      const combinedData = [...payments, ...lunches];

      // Sort the combined data by the created field
      combinedData.sort((a, b) => a.updated - b.updated);
      const count = combinedData.length;

      const pages = Math.ceil(count / limit);
      pagination = { page, pages, count };
      result = combinedData;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  } else {
    //  Query the database for a list of all results
    const resultsPromise = Model.find({
      removed: false,
      [filter]: equal,
      ...fields,
    })
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortValue })
      .exec();
    // Counting the total documents
    const countPromise = Model.countDocuments({
      removed: false,
      [filter]: equal,
      ...fields,
    });
    // Resolving both promises
    const [paymentResult, count] = await Promise.all([resultsPromise, countPromise]);
    // Calculating total pages
    const pages = Math.ceil(count / limit);
    // Getting Pagination Object
    result = paymentResult;
    pagination = { page, pages, count };
  }
  if (result.length > 0) {
    return res.status(200).json({
      success: true,
      result,
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
