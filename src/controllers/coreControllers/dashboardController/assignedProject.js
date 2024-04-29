const mongoose = require('mongoose');

const ProjectModel = mongoose.model('Project');

const assignedProject = async (req, res, range) => {
  const { limit } = req.body;
  const { startDate, endDate } = range;

  try {
    const results = await ProjectModel.aggregate([
      {
        $match: {
          status: 'In Progress',
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
        $unwind: '$userData', // Unwind the userData array
      },
      {
        $match: {
          'userData.created': { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $project: {
          projectnumber: 1,
          description: 1,
          budget: 1,
          spentTime: {
            $subtract: ['$userData.timeRange', { $sum: '$userData.workData.idleTime' }],
          },
        },
      },
      {
        $group: {
          _id: '$_id',
          budget: { $first: '$budget' },
          projectnumber: { $first: '$projectnumber' },
          description: { $first: '$description' },
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

    // console.log(results);
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

module.exports = assignedProject;
