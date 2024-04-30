const mongoose = require('mongoose');
const UserDataModel = mongoose.model('UserData');
const SurveyModel = mongoose.model('Survey');
const WeeklyTimeModel = mongoose.model('WeeklyTime');

const reportProdcutiveList = async (req, res, range) => {
  const { startDate, endDate } = range;
  const { Client, Project, Assigne, searchValue } = req.body;
  // console.log(new Date(startDate));
  // console.log(new Date(endDate));

  try {
    const activityResults = await UserDataModel.aggregate([
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
    ]);

    const activityAllResult = await UserDataModel.populate(activityResults, {
      path: '_id',
      model: 'Admin',
    });
    const productivityResults = await SurveyModel.aggregate([
      {
        $match: {
          created: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      // Group by user and calculate sum of productivity and unproductivity
      {
        $group: {
          _id: '$user',
          productivitySum: {
            $sum: {
              $cond: [
                { $eq: ['$typeId', 'Productivity'] }, // If typeId is Productivity
                { $multiply: ['$range', 0.4] }, // Multiply range by 1
                0, // Otherwise, add 0
              ],
            },
          },
          unproductivitySum: {
            $sum: {
              $cond: [
                { $eq: ['$typeId', 'Unproductivity'] }, // If typeId is Unproductivity
                { $multiply: ['$range', 0.4] }, // Multiply range by 0.5
                0, // Otherwise, add 0
              ],
            },
          },
          nullSum: {
            $sum: {
              $cond: [
                { $eq: ['$typeId', null] }, // If typeId is null
                { $multiply: ['$range', 0.2] }, // Multiply range by 1.5
                0, // Otherwise, add 0
              ],
            },
          },
        },
      },
      // Calculate total sum of productivity, unproductivity, and null
      // {
      //   $group: {
      //     _id: null,
      //     totalProductivity: { $sum: '$productivitySum' },
      //     totalUnproductivity: { $sum: '$unproductivitySum' },
      //     totalNull: { $sum: '$nullSum' },
      //   },
      // },
      {
        $project: {
          _id: 1,
          total: {
            $sum: ['$productivitySum', '$unproductivitySum', '$nullSum'],
          },
          productivitySum: 1,
        },
      },
      // Calculate the percentage
      {
        $project: {
          _id: 1,
          percentage: {
            $multiply: [
              {
                $divide: [
                  { $toDouble: '$productivitySum' }, // Convert to double
                  { $toDouble: '$total' },
                ],
              }, // Divide total by sum of all
              100,
            ],
          },
        },
      },
      {
        $sort: { percentage: -1 },
      },
    ]);

    const productivityAllResult = await SurveyModel.populate(productivityResults, {
      path: '_id',
      model: 'Admin',
    });

    const profitabilityResults = await WeeklyTimeModel.aggregate([
      {
        $match: {
          created: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $project: {
          userId: 1,
          hours: { $toInt: { $arrayElemAt: [{ $split: ['$billabletime', ':'] }, 0] } },
          minutes: { $toInt: { $arrayElemAt: [{ $split: ['$billabletime', ':'] }, 1] } },
        },
      },
      {
        $addFields: {
          total_seconds: {
            $sum: [{ $multiply: ['$hours', 3600] }, { $multiply: ['$minutes', 60] }],
          },
        },
      },
      {
        $group: {
          _id: '$userId',
          total: { $sum: '$total_seconds' },
        },
      },
    ]);

    const profivilityAllResult = await WeeklyTimeModel.populate(profitabilityResults, {
      path: '_id',
      model: 'Admin',
    });

    return res.status(200).json({
      success: true,
      activityAllResult,
      productivityAllResult,
      profivilityAllResult,
    });
  } catch (err) {
    console.error(err);
    return res.status(200).json({
      success: false,
      result: '',
    });
  }
};

module.exports = reportProdcutiveList;
