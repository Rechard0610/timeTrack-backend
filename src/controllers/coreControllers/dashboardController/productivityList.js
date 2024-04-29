const mongoose = require('mongoose');

const SurveyModel = mongoose.model('Survey');

const productivityList = async (req, res, range) => {
  const { limit } = req.body;
  const { startDate, endDate } = range;

  try {
    const results = await SurveyModel.aggregate([
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
      {
        $limit: limit,
      },
    ]);

    const populatedResult = await SurveyModel.populate(results, {
      path: '_id',
      model: 'Admin',
    });

    // console.log(populatedResult);

    // console.log(populatedResult);

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

module.exports = productivityList;
