const mongoose = require('mongoose');

const UserDataModel = mongoose.model('UserData');

const onGoingTask = async (req, res) => {
  const { range } = req.body;
  const { startDate, endDate } = range;

  const end = new Date(endDate).setUTCHours(23, 59, 59, 999);

  try {
    const results = await UserDataModel.aggregate([
      {
        $match: {
          created: { $gte: new Date(startDate), $lte: new Date(end) },
        },
      },
      {
        $addFields: {
          day: { $dateToString: { format: '%Y-%m-%d', date: '$created' } },
          spentTime: { $subtract: ['$timeRange', { $sum: '$workData.idleTime' }] },
        },
      },
      {
        $group: {
          _id: '$day',
          totalSpentTime: { $sum: '$spentTime' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    return res.status(200).json({
      success: false,
      result: results,
    });
  } catch (err) {
    console.error(err);
    return res.status(200).json({
      success: false,
      result: '',
    });
  }
};

module.exports = onGoingTask;
