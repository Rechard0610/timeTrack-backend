const mongoose = require('mongoose');

const UserDataModel = mongoose.model('UserData');

const loggedList = async (req, res, range) => {
  const { limit } = req.body;
  const { startDate, endDate } = range;

  try {
    const result = await UserDataModel.aggregate([
      {
        $match: {
          created: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: '$userId',
          totalRange: { $sum: '$timeRange' },
        },
      },
      {
        $sort: { totalRange: -1 },
      },
      {
        $limit: limit,
      },
    ]).exec();

    // console.log(result);

    // Populate userId field
    const populatedResult = await UserDataModel.populate(result, {
      path: '_id',
      model: 'Admin',
    });

    return res.status(200).json({
      success: true,
      result: populatedResult,
      message: 'Successfully found all documents',
    });

    // const totalRange = result.length > 0 ? result[0].totalRange : 0;
    // console.log('Total range:', totalRange);
    // Process total range
  } catch (err) {
    console.error('Error fetching total range:', err);
    return;
    // Handle error
  }
};

module.exports = loggedList;
