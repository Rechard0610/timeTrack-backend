const mongoose = require('mongoose');

const ProjectModel = mongoose.model('Project');

const projectChart = async (req, res, timeRange) => {
  const { status, range, userId, selectedDate } = req.body;

  // ------------------------------    selectedDate === ''   -----------------------------------------------
  let { startDate, endDate } = timeRange;
  if (range !== 7) {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    startDate = startOfMonth.setUTCHours(0, 0, 0, 0);
    endDate = endOfMonth.setUTCHours(23, 59, 59, 999);
  }
  if (selectedDate != '') {
    const today = new Date(selectedDate);
    if (range == 7) {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
      const endOfWeek = new Date(today);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      startDate = startOfWeek.setUTCHours(0, 0, 0, 0);
      endDate = endOfWeek.setUTCHours(23, 59, 59, 999);
    } else {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      startDate = startOfMonth.setUTCHours(0, 0, 0, 0);
      endDate = endOfMonth.setUTCHours(23, 59, 59, 999);
    }
  }

  try {
    const matchCondition = {
      'userData.created': { $gte: new Date(startDate), $lte: new Date(endDate) },
    };

    if (userId !== '') {
      matchCondition['userData.userId'] = new mongoose.Types.ObjectId(userId);
    }

    const results = await ProjectModel.aggregate([
      {
        $match: {
          status,
        },
      },
      {
        $lookup: {
          from: 'userdatas', // Name of the UserData collection
          localField: '_id',
          foreignField: 'projectId',
          as: 'userData',
        },
      },
      {
        $unwind: '$userData', // Unwind the userData arraylocalhos
      },
      {
        $match: matchCondition,
      },
      {
        $lookup: {
          from: 'clients', // Assuming the name of the client collection is 'clients'
          localField: 'clientname',
          foreignField: '_id',
          as: 'client',
        },
      },
      {
        $unwind: '$client', // Unwind the userData array
      },
      {
        $project: {
          projectnumber: 1,
          description: 1,
          client: 1,
          budget: {
            $cond: {
              if: { $eq: ['$client.hourlyrate', 0] }, // Check if hourlyrate is 0
              then: 0, // If hourlyrate is 0, set budget to 0
              else: {
                $cond: {
                  if: '$isfixed',
                  then: {
                    $round: [
                      {
                        $divide: [
                          { $toInt: { $trim: { input: '$budget', chars: '\\$ ' } } }, // Convert '$ 30' to 30
                          { $toInt: '$client.hourlyrate' }, // Convert hourly rate to double
                        ],
                      },
                      2,
                    ],
                  },
                  else: {
                    $cond: [
                      { $regexMatch: { input: '$budget', regex: /H$/ } }, // Check if the budget ends with 'H'
                      { $toInt: { $trim: { input: '$budget', chars: ' H' } } }, // Convert '120 H' to 120
                      { $toInt: { $trim: { input: '$budget', chars: '$ ' } } }, // Convert '$ 30' to 30
                    ],
                  }, // Convert '$ 30' to 30
                },
              },
            },
          },
          spentTime: {
            $subtract: ['$userData.timeRange', { $sum: '$userData.workData.idleTime' }],
          },
          created: 1,
        },
      },
      {
        $group: {
          _id: '$_id',
          projectnumber: { $first: '$projectnumber' },
          description: { $first: '$description' },
          budget: { $first: '$budget' },
          spentTime: { $sum: '$spentTime' }, // Calculate sum of spentTime
          created: { $first: '$created' },
        },
      },
      {
        $sort: { created: 1 },
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

module.exports = projectChart;
