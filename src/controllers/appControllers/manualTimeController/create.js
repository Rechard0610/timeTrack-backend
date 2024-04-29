const mongoose = require('mongoose');
const UserDataModel = mongoose.model('UserData');

const create = async (Model, req, res) => {
  // Creating a new document in the collection
  // console.log(req.body);
  const today = new Date();
  const startDay = new Date(today);
  startDay.setDate(today.getDate() - 4);

  const { userId, project, task } = req.body;
  let lastPercent = 0;

  console.log(startDay);
  console.log(today);
  console.log(userId);
  console.log(project);
  console.log(task);

  try {
    const result = await UserDataModel.aggregate([
      {
        $match: {
          created: {
            $gte: new Date(startDay),
            $lte: new Date(today),
          },
          userId: new mongoose.Types.ObjectId(userId),
          projectId: new mongoose.Types.ObjectId(project),
          taskId: new mongoose.Types.ObjectId(task),
        },
      },
      {
        $addFields: {
          createdDate: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: {
                $cond: {
                  if: { $lte: ['$created', new Date()] },
                  then: '$created',
                  else: new Date(),
                },
              },
            },
          },
        },
      },
      {
        $group: {
          _id: '$createdDate',
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
    ]);

    if (result.length > 0) {
      console.log(result);
      result.map((item) => {
        lastPercent += item.percentage;
      });
      lastPercent /= result.length;
    } else {
      lastPercent = 50;
    }
  } catch (err) {
    console.error(err);
    return res.status(200).json({
      success: false,
      result: '',
    });
  }

  req.body.removed = false;
  req.body.activity = lastPercent;
  const result = await new Model({
    ...req.body,
  }).save();

  // Returning successfull response
  return res.status(200).json({
    success: true,
    result,
    message: 'Successfully Created the document ',
  });
};

module.exports = create;
