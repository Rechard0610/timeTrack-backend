const mongoose = require('mongoose');

const UserData = mongoose.model('UserData');

const timedescription = async (req, res) => {
  const { userId, selectedDate } = req.body;
  // console.log(req.body);
  const startTime = new Date(selectedDate).setUTCHours(0, 0, 0, 0);
  const endTime = new Date(selectedDate).setUTCHours(23, 59, 59, 999);

  try {
    const result = await UserData.aggregate([
      {
        $lookup: {
          from: 'projects',
          localField: 'projectId',
          foreignField: '_id',
          as: 'projects',
        },
      },
      {
        $lookup: {
          from: 'tasks',
          localField: 'taskId',
          foreignField: '_id',
          as: 'tasks',
        },
      },
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          created: { $gte: new Date(startTime), $lte: new Date(endTime) }, // Match 'created' field with startTime and endTime
          spentType: 'working time', // Filtering only for 'working time' spentType
        },
      },
      {
        $group: {
          _id: { projectId: '$projectId', taskId: '$taskId' }, // Grouping by both projectId and taskId
          projectId: { $first: '$projectId' }, // Storing projectId
          totalRange: { $sum: '$timeRange' },
          description: { $first: '$projects.description' }, // Storing projectId
          projectName: { $first: '$projects.projectnumber' }, // Storing projectId
          taskName: { $first: '$tasks.name' }, // Storing taskId
          taskId: { $first: '$tasks._id' }, // Storing taskId
        },
      },
      {
        $group: {
          _id: '$projectId', // Grouping by projectId
          projectName: { $first: '$projectName' },
          description: { $first: '$description' }, // Grouping by projectId
          spentTime: { $sum: '$totalRange' }, // Calculating total time range for each project
          tasks: {
            $push: { name: '$taskName', spentTime: '$totalRange', key: '$taskId' }, // Creating array of tasks with spent time
          },
        },
      },
    ]);
    // console.log(result[0].tasks);

    return res.status(200).json({
      success: true,
      result: result,
    });
  } catch (err) {
    console.error(err);
    return res.status(200).json({
      success: false,
      result: '',
    });
  }
};

module.exports = timedescription;
