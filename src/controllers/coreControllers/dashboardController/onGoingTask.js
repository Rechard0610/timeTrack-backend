const mongoose = require('mongoose');

const TaskModel = mongoose.model('Task');

const onGoingTask = async (req, res) => {
  const { limit } = req.body;
  const today = new Date(); // Get current date and time
  const startDate = today.setUTCHours(0, 0, 0, 0);
  const endDate = today.setUTCHours(23, 59, 59, 999);

  try {
    const results = await TaskModel.aggregate([
      {
        $match: {
          status: 'In Progress',
        },
      },
      {
        $lookup: {
          from: 'userdatas', // Name of the UserData collection
          localField: '_id',
          foreignField: 'taskId',
          as: 'userData',
        },
      },
      {
        $lookup: {
          from: 'projects', // Name of the UserData collection
          localField: 'project',
          foreignField: '_id',
          as: 'projects',
        },
      },
      {
        $unwind: '$userData', // Unwind the userData array
      },
      {
        $unwind: '$projects', // Unwind the userData array
      },
      {
        $match: {
          'userData.created': { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $project: {
          name: 1,
          'projects.projectnumber': 1,
          'projects.description': 1,
          spentTime: {
            $subtract: ['$userData.timeRange', { $sum: '$userData.workData.idleTime' }],
          },
        },
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          projectnumber: { $first: '$projects.projectnumber' },
          description: { $first: '$projects.description' },
          spentTime: { $sum: '$spentTime' }, // Calculate sum of spentTime
        },
      },
      {
        $sort: { spentTime: -1 },
      },
      {
        $limit: limit,
      },
    ]);

    console.log(results);

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
