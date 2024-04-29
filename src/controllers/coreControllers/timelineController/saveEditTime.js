const mongoose = require('mongoose');

const UserData = mongoose.model('UserData');

const saveEditTime = async (req, res) => {
  const {
    userId,
    start,
    end,
    description,
    projectId,
    taskId,
    selectedSpentType,
    selectedProductive,
  } = req.body;
  const range = end - start;
  //   console.log(req.body);
  //   console.log(new Date(start * 1000));
  //   console.log(range);

  try {
    const result = await UserData.find({
      userId,
      created: new Date(start),
      timeRange: range,
    });
    if (result) {
      console.log(result);
    } else {
      const newRecord = new UserDataModel({
        userId,
        taskId,
        projectId,
        spentType: selectedSpentType,
        timeRange: range - 1 / 1000,
      });
      await newRecord.save();
    }
  } catch (err) {
    console.error(err);
    return res.status(200).json({
      success: false,
      result: '',
    });
  }

  //   try {
  //     const result = await UserData.aggregate([
  //       {
  //         $lookup: {
  //           from: 'projects',
  //           localField: 'projectId',
  //           foreignField: '_id',
  //           as: 'projects',
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: 'tasks',
  //           localField: 'taskId',
  //           foreignField: '_id',
  //           as: 'tasks',
  //         },
  //       },
  //       {
  //         $match: {
  //           userId: new mongoose.Types.ObjectId(userId),
  //           created: { $gte: new Date(startTime), $lte: new Date(endTime) }, // Match 'created' field with startTime and endTime
  //           spentType: 'working time', // Filtering only for 'working time' spentType
  //         },
  //       },
  //       {
  //         $group: {
  //           _id: { projectId: '$projectId', taskId: '$taskId' }, // Grouping by both projectId and taskId
  //           projectId: { $first: '$projectId' }, // Storing projectId
  //           totalRange: { $sum: '$timeRange' },
  //           description: { $first: '$projects.description' }, // Storing projectId
  //           projectName: { $first: '$projects.projectnumber' }, // Storing projectId
  //           taskName: { $first: '$tasks.name' }, // Storing taskId
  //           taskId: { $first: '$tasks._id' }, // Storing taskId
  //         },
  //       },
  //       {
  //         $group: {
  //           _id: '$projectId', // Grouping by projectId
  //           projectName: { $first: '$projectName' },
  //           description: { $first: '$description' }, // Grouping by projectId
  //           spentTime: { $sum: '$totalRange' }, // Calculating total time range for each project
  //           tasks: {
  //             $push: { name: '$taskName', spentTime: '$totalRange', key: '$taskId' }, // Creating array of tasks with spent time
  //           },
  //         },
  //       },
  //     ]);
  //     // console.log(result[0].tasks);

  //     return res.status(200).json({
  //       success: true,
  //       result: result,
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     return res.status(200).json({
  //       success: false,
  //       result: '',
  //     });
  //   }
};

module.exports = saveEditTime;
