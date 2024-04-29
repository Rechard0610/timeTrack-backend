const mongoose = require('mongoose');
const UserDataModel = mongoose.model('UserData');
const WeeklyModel = mongoose.model('WeeklyTime');
const SurveyModel = mongoose.model('Survey');
const ProjectModel = mongoose.model('Project');

const { migrate } = require('./migrate');

const paginatedList = async (Model, req, res) => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
  const endOfWeek = new Date(today);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const startDate = startOfWeek.setUTCHours(0, 0, 0, 0);
  const endDate = endOfWeek.setUTCHours(23, 59, 59, 999);

  const page = req.query.page || 1;

  const limit = parseInt(req.query.items) || 100;
  const skip = page * limit - limit;

  const { sortBy = 'enabled', sortValue = -1, filter, equal, userId } = req.query;

  const fieldsArray = req.query.fields ? req.query.fields.split(',') : [];

  let fields;
  let result, pagination, total;

  fields = fieldsArray.length === 0 ? {} : { $or: [] };

  for (const field of fieldsArray) {
    fields.$or.push({ [field]: { $regex: new RegExp(req.query.q, 'i') } });
  }

  console.log(req.query);

  try {
    if (equal === 'pending') {
      const resultsPromise = UserDataModel.aggregate([
        {
          $lookup: {
            from: 'admins', // Assuming the name of the client collection is 'clients'
            localField: 'userId',
            foreignField: '_id',
            as: 'users',
          },
        },
        {
          $unwind: '$users',
        },
        {
          $match: {
            created: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
            $or: [
              { 'users.invitedById': new mongoose.Types.ObjectId(userId) },
              { 'users._id': new mongoose.Types.ObjectId(userId) },
            ],
          },
        },
        {
          $lookup: {
            from: 'manualtimes', // Assuming the name of the client collection is 'clients'
            let: { userId: '$users._id', project: '$projectId', task: '$taskId' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$userId', '$$userId'] },
                      { $eq: ['$project', '$$project'] },
                      { $eq: ['$task', '$$task'] },
                      { $eq: ['$status', 'approved'] },
                      { $gte: ['$created', new Date(startDate)] },
                      { $lte: ['$created', new Date(endDate)] },
                    ],
                  },
                },
              },
            ],
            as: 'manuals',
          },
        },
        {
          $lookup: {
            from: 'projects', // Assuming the name of the client collection is 'clients'
            let: { project: '$projectId' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ['$_id', '$$project'] }],
                  },
                },
              },
            ],
            as: 'projects',
          },
        },
        {
          $unwind: '$projects', // Unwind the userData arraylocalhos
        },
        {
          $group: {
            _id: { taskId: '$taskId', projectId: '$projectId', userId: '$userId' },
            totalIdleTime: { $sum: { $sum: '$workData.idleTime' } },
            totalKeyIdle: { $sum: { $sum: '$workData.keyIdle' } },
            totalMouseClickIdle: { $sum: { $sum: '$workData.mouseClickIdle' } },
            totalMouseIdle: { $sum: { $sum: '$workData.mouseIdle' } },
            totalTimeRange: { $sum: '$timeRange' },
            manuals: { $first: '$manuals' },
            project: { $first: '$projects' },
            task: { $first: '$taskId' },
            totalSpent: { $first: '$totalSpent' },
          },
        },
        {
          $addFields: {
            totalManualTime: {
              $sum: {
                $map: {
                  input: '$manuals',
                  as: 'manual',
                  in: {
                    $divide: [
                      {
                        $subtract: [
                          { $toDate: '$$manual.endtime' },
                          { $toDate: '$$manual.starttime' },
                        ],
                      },
                      1000, // Convert milliseconds to seconds
                    ],
                  },
                },
              },
            },
            totalActivity: {
              $cond: {
                if: { $eq: [{ $size: '$manuals' }, 0] }, // Check if totalTimeRangeWithManual is zero
                then: 0, // Return 0 if it is zero to avoid division by zero error
                else: {
                  $divide: [
                    {
                      $sum: '$manuals.activity', // Sum of manual.activity
                    },
                    { $size: '$manuals' }, // Length of manuals array
                  ],
                },
              },
            },
          },
        },
        {
          $project: {
            totalIdleTime: 1,
            manuals: 1,
            project: 1,
            task: 1,
            totalIdleTimePlusModified: {
              $sum: [
                { $multiply: ['$totalMouseIdle', 0.4] },
                { $multiply: ['$totalMouseClickIdle', 0.4] },
                { $multiply: ['$totalKeyIdle', 0.2] },
              ],
            },
            totalTimeRangeMinusIdle: { $subtract: ['$totalTimeRange', '$totalIdleTime'] },
            totalManualTime: 1,
            totalActivity: 1,
          },
        },
        {
          $project: {
            manuals: 1,
            project: 1,
            task: 1,
            totalIdleTimePlusModified: 1,
            totalTimeRangeMinusIdle: 1,
            totalManualTime: 1,
            totalTimeRangeWithManual: {
              $add: ['$totalTimeRangeMinusIdle', '$totalManualTime'],
            },
            percentage: {
              $multiply: [
                {
                  $cond: {
                    if: { $eq: ['$totalTimeRangeMinusIdle', 0] }, // Check if totalTimeRangeWithManual is zero
                    then: 0, // Return 0 if it is zero to avoid division by zero error
                    else: {
                      $divide: [
                        { $subtract: ['$totalTimeRangeMinusIdle', '$totalIdleTimePlusModified'] },
                        '$totalTimeRangeMinusIdle',
                      ],
                    },
                  },
                },
                100,
              ],
            },
            totalActivity: 1,
          },
        },
        {
          $project: {
            totalTimeRangeWithManual: 1,
            project: 1,
            task: 1,
            averageActivity: {
              $cond: {
                if: { $eq: ['$totalTimeRangeWithManual', 0] }, // Check if totalTimeRangeWithManual is zero
                then: 0, // Return 0 if it is zero to avoid division by zero error
                else: {
                  $divide: [
                    {
                      $sum: [
                        { $multiply: ['$totalTimeRangeMinusIdle', '$percentage'] },
                        { $multiply: ['$totalManualTime', '$totalActivity'] },
                      ],
                    },
                    '$totalTimeRangeWithManual',
                  ],
                },
              },
            },
          },
        },
        {
          $sort: { totalTimeRangeWithManual: -1 },
        },
      ]);

      const countPromise = UserDataModel.aggregate([
        {
          $lookup: {
            from: 'admins', // Assuming the name of the client collection is 'clients'
            localField: 'userId',
            foreignField: '_id',
            as: 'users',
          },
        },
        {
          $unwind: '$users',
        },
        {
          $match: {
            created: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
            $or: [
              { 'users.invitedById': new mongoose.Types.ObjectId(userId) },
              { 'users._id': new mongoose.Types.ObjectId(userId) },
            ],
          },
        },
        {
          $group: {
            _id: { taskId: '$taskId', projectId: '$projectId', userId: '$userId' },
            totalIdleTime: { $sum: { $sum: '$workData.idleTime' } },
            totalKeyIdle: { $sum: { $sum: '$workData.keyIdle' } },
            totalMouseClickIdle: { $sum: { $sum: '$workData.mouseClickIdle' } },
            totalMouseIdle: { $sum: { $sum: '$workData.mouseIdle' } },
            totalTimeRange: { $sum: '$timeRange' },
          },
        },
        {
          $count: 'total',
        },
      ]).exec();

      const totalSpentByProject = await ProjectModel.aggregate([
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

            created: 1,
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
          $match: { 'userData.removed': false },
        },
        {
          $lookup: {
            from: 'manualtimes', // Name of the UserData collection
            localField: '_id',
            foreignField: 'project',
            as: 'manualtimes',
          },
        },
        {
          $addFields: {
            hasManuals: { $gt: [{ $size: '$manualtimes' }, 0] }, // Check if manualtimes array is not empty
          },
        },
        {
          $group: {
            _id: '$_id',
            budget: { $first: '$budget' },
            spentTime: {
              $sum: {
                $cond: [
                  { $eq: ['$userData.spentType', 'idle limit'] }, // Check if spentType is 'idle limit'
                  0, // Subtract workData.range from timeRange
                  '$userData.timeRange', // Otherwise, sum workData.range as usual
                ],
              },
            }, // Calculate sum of spentTime
            manuals: {
              $first: {
                $cond: [
                  { $eq: ['$hasManuals', true] }, // Check if manualtimes exist for the project
                  '$manualtimes',
                  [], // Set to empty array if manualtimes don't exist
                ],
              },
            },
            created: { $first: '$created' },
          },
        },
        {
          $addFields: {
            totalManualTime: {
              $sum: {
                $map: {
                  input: '$manuals',
                  as: 'manual',
                  in: {
                    $cond: [
                      { $eq: ['$$manual.status', 'approved'] }, // Check if manual status is approved
                      {
                        $divide: [
                          {
                            $subtract: [
                              { $toDate: '$$manual.endtime' },
                              { $toDate: '$$manual.starttime' },
                            ],
                          },
                          1000, // Convert milliseconds to seconds
                        ],
                      },
                      0, // Set to 0 if manual status is not approved
                    ],
                  },
                },
              },
            },
          },
        },
        {
          $project: {
            _id: 1,
            budget: 1,
            totalSpent: { $sum: ['$spentTime', '$totalManualTime'] },
            created: 1,
          },
        },
        {
          $sort: { created: 1 },
        },
      ]);

      const totalBillableTime = await WeeklyModel.aggregate([
        {
          $match: { removed: false, status: 'approved' },
        },
        {
          $group: {
            _id: '$project',
            totalbillableTime: {
              $sum: '$totalBillableTime',
            },
          },
        },
      ]);

      console.log(totalBillableTime);

      const productive = await SurveyModel.aggregate([
        {
          $lookup: {
            from: 'admins', // Assuming the name of the client collection is 'clients'
            localField: 'user',
            foreignField: '_id',
            as: 'users',
          },
        },
        {
          $unwind: '$users',
        },
        {
          $match: {
            created: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
            $or: [
              { 'users.invitedById': new mongoose.Types.ObjectId(userId) },
              { 'users._id': new mongoose.Types.ObjectId(userId) },
            ],
          },
        },
        {
          $group: {
            _id: { task: '$task', project: '$project', userId: '$user' },
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
        {
          $project: {
            _id: 1,
            total: {
              $sum: ['$productivitySum', '$unproductivitySum', '$nullSum'],
            },
            productivitySum: 1,
          },
        },
        {
          $project: {
            _id: 1,
            percentage: {
              $cond: {
                if: { $eq: [{ $toDouble: '$total' }, 0] }, // Check if total is zero
                then: 0, // If total is zero, set percentage to 0
                else: {
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
          },
        },
      ]);

      const [resultProm, count] = await Promise.all([resultsPromise, countPromise]);

      total = count[0] && count[0].total;
      const pages = Math.ceil(total / limit);

      const populatedResult = await Model.populate(resultProm, [
        {
          path: 'task',
          model: 'Task',
        },
      ]);

      const existData = await WeeklyModel.find({
        created: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      });

      console.log(existData);

      result = populatedResult.reduce((acc, x) => {
        const migratedItem = migrate(
          x,
          totalSpentByProject,
          totalBillableTime,
          productive,
          existData
        );
        if (migratedItem) {
          acc.push(migratedItem);
        }
        return acc;
      }, []);

      pagination = { page, pages, count: total };
    } else {
      const resultsPromise = WeeklyModel.aggregate([
        {
          $lookup: {
            from: 'admins', // Assuming the name of the client collection is 'clients'
            localField: 'userId',
            foreignField: '_id',
            as: 'users',
          },
        },
        {
          $match: {
            created: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
            $or: [
              { 'users.invitedById': new mongoose.Types.ObjectId(userId) },
              { 'users._id': new mongoose.Types.ObjectId(userId) },
            ],
            status: equal,
          },
        },
        {
          $sort: {
            created: -1,
          },
        },
      ]);

      const countPromise = WeeklyModel.aggregate([
        {
          $lookup: {
            from: 'admins', // Assuming the name of the client collection is 'clients'
            localField: 'userId',
            foreignField: '_id',
            as: 'users',
          },
        },
        {
          $match: {
            created: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
            $or: [
              { 'users.invitedById': new mongoose.Types.ObjectId(userId) },
              { 'users._id': new mongoose.Types.ObjectId(userId) },
            ],
            status: equal,
          },
        },
        {
          $count: 'total',
        },
      ]).exec();

      const [resultProm, count] = await Promise.all([resultsPromise, countPromise]);

      result = await Model.populate(resultProm, [
        {
          path: 'project',
          model: 'Project',
        },
        {
          path: 'task',
          model: 'Task',
        },
      ]);

      total = count[0] && count[0].total;
      const pages = Math.ceil(total / limit);
      pagination = { page, pages, count: total };
    }

    if (total > 0) {
      // console.log(result);
      return res.status(200).json({
        success: true,
        result,
        pagination,
      });
    } else {
      return res.status(200).json({
        success: true,
        result: [],
        pagination,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(200).json({
      success: false,
      result: '',
    });
  }
};

module.exports = paginatedList;
