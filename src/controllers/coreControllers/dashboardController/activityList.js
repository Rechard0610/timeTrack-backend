const mongoose = require('mongoose');

const UserDataModel = mongoose.model('UserData');

const activityList = async (req, res, range) => {
  const { limit } = req.body;
  const { startDate, endDate } = range;

  // console.log(new Date(startDate));
  // console.log(new Date(endDate));

  try {
    const results = await UserDataModel.aggregate([
      {
        $match: {
          created: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: '$userId',
          totalIdleTime: { $sum: { $sum: '$workData.idleTime' } },
          totalKeyIdle: { $sum: { $sum: '$workData.keyIdle' } },
          totalMouseClickIdle: { $sum: { $sum: '$workData.mouseClickIdle' } },
          totalMouseIdle: { $sum: { $sum: '$workData.mouseIdle' } },
          totalTimeRange: { $sum: '$timeRange' },
        },
      },
      {
        $project: {
          totalIdleTime: 1,
          // multiMouseIdle: { $multiply: ['$totalMouseIdle', 0.4] },
          // multiMouseClickIdle: { $multiply: ['$totalMouseClickIdle', 0.4] },
          // multiKeyIdle: { $multiply: ['$totalKeyIdle', 0.2] },
          totalIdleTimePlusModified: {
            $sum: [
              { $multiply: ['$totalMouseIdle', 0.4] },
              { $multiply: ['$totalMouseClickIdle', 0.4] },
              { $multiply: ['$totalKeyIdle', 0.2] },
            ],
          },
          totalTimeRangeMinusIdle: { $subtract: ['$totalTimeRange', '$totalIdleTime'] },
        },
      },
      {
        $project: {
          totalIdleTimePlusModified: 1,
          totalTimeRangeMinusIdle: 1,
          percentage: {
            $multiply: [
              {
                $divide: [
                  { $subtract: ['$totalTimeRangeMinusIdle', '$totalIdleTimePlusModified'] },
                  '$totalTimeRangeMinusIdle',
                ],
              },
              100,
            ],
          },
        },
      },
      {
        $sort: { percentage: -1 },
      },
      {
        $limit: limit,
      },
    ]);

    const populatedResult = await UserDataModel.populate(results, {
      path: '_id',
      model: 'Admin',
    });

    return res.status(200).json({
      success: true,
      result: populatedResult,
    });
  } catch (err) {
    console.error(err);
    return res.status(200).json({
      success: false,
      result: '',
    });
  }
};

module.exports = activityList;
