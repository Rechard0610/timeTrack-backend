const mongoose = require('mongoose');

const UserDataModel = mongoose.model('UserData');

const paginatedList = async (req, res) => {
  const page = req.query.page || 1;
  const limit = parseInt(req.query.items) || 10;
  const skip = page * limit - limit;

  const { userId, projectId, taskId, startDay, endDay } = req.query;

  const end = new Date(endDay).setUTCHours(23, 59, 59, 999);
  const query = {
    created: { $gte: new Date(startDay), $lte: new Date(end) },
  };

  if (userId && userId != '' && userId != 'all') {
    query['userId'] = new mongoose.Types.ObjectId(userId);
  }

  if (projectId && projectId != '') {
    query['projectId'] = new mongoose.Types.ObjectId(projectId);
  }

  if (taskId && taskId != '') {
    query['taskId'] = new mongoose.Types.ObjectId(taskId);
  }

  try {
    const result = await UserDataModel.aggregate([
      {
        $match: query,
      },
      {
        $addFields: {
          day: { $dateToString: { format: '%Y-%m-%d', date: '$created' } },
          spentTime: { $subtract: ['$timeRange', { $sum: '$workData.idleTime' }] },
        },
      },
      {
        $group: {
          _id: { userId: '$userId', day: '$day' },
          totalSpentTime: { $sum: '$spentTime' },
        },
      },
      {
        $group: {
          _id: '$_id.userId',
          days: {
            $push: {
              k: {
                $cond: [
                  { $eq: [{ $substr: ['$_id.day', 8, 2] }, ''] },
                  { $substr: ['$_id.day', 5, 2] }, // Month
                  { $substr: ['$_id.day', 8, 2] }, // Day
                ],
              },
              v: '$totalSpentTime',
            },
          },
          totalSpentTime: { $sum: '$totalSpentTime' },
        },
      },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          days: { $arrayToObject: '$days' },
          totalSpentTime: 1,
        },
      },
      {
        $sort: { '_id.userId': 1 },
      },
    ]);

    const populatedResult = await UserDataModel.populate(result, {
      path: 'userId',
      model: 'Admin',
    });

    const count = await UserDataModel.countDocuments(query);
    const pages = Math.ceil(count / limit);
    const pagination = { page, pages, count };

    // const populatedResult = await UserDataModel.populate(result, {
    //   path: 'user',
    //   model: 'Admin',
    // });

    console.log(populatedResult);

    return res.status(200).json({
      success: true,
      result: populatedResult,
      pagination,
    });
  } catch (err) {
    return res.status(200).json({
      success: false,
      result,
    });
  }
};

module.exports = paginatedList;
