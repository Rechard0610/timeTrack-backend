const mongoose = require('mongoose');

const UserData = mongoose.model('UserData');
const AdminModel = mongoose.model('Admin');
const SurveyModel = mongoose.model('Survey');
// Assuming you're calculating for a specific userId, projectId, and taskId
const desktime = async (req, res) => {
  const { userId, selectedDate } = req.body;
  const startTime = new Date(selectedDate).setUTCHours(0, 0, 0, 0);
  const endTime = new Date(selectedDate).setUTCHours(23, 59, 59, 999);

  let invitedId = userId;
  let memberCnt = 0;

  console.log(req.body);

  try {
    const results = await UserData.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          created: { $gte: new Date(startTime), $lte: new Date(endTime) },
        },
      },
      { $sort: { created: -1 } }, // Sort by 'created' field in descending order
    ]);

    const user = await AdminModel.find({ _id: userId });
    if (user.length > 0) {
      if (user[0].role !== 'owner') invitedId = user[0].invitedById;
    }

    const members = await AdminModel.find({ invitedById: invitedId });
    if (members.length > 0) {
      memberCnt = members.length + 1;
    }

    const activity = await UserData.aggregate([
      {
        $lookup: {
          from: 'admins',
          localField: 'userId',
          foreignField: '_id',
          as: 'userAdmin',
        },
      },
      {
        $match: {
          created: {
            $gte: new Date(startTime),
            $lte: new Date(endTime),
          },

          userAdmin: {
            $elemMatch: {
              invitedById: new mongoose.Types.ObjectId(invitedId),
            },
          },
        },
      },
      {
        $group: {
          _id: '$userId',
          active: { $push: '$$ROOT' }, // Accumulate all documents associated with each user
        },
      },
      { $sort: { created: -1 } },
    ]);

    const productivity = await SurveyModel.aggregate([
      {
        $lookup: {
          from: 'admins',
          localField: 'user',
          foreignField: '_id',
          as: 'userAdmin',
        },
      },
      {
        $match: {
          created: {
            $gte: new Date(startTime),
            $lte: new Date(endTime),
          },
          userAdmin: {
            $elemMatch: {
              invitedById: new mongoose.Types.ObjectId(invitedId),
            },
          },
        },
      },
      {
        $group: {
          _id: '$user',
          surveys: { $push: '$$ROOT' }, // Accumulate all documents associated with each user
        },
      },
      { $sort: { created: -1 } },
    ]);

    // console.log(activity);

    if (results.length > 0) {
      const latestEntry = results[0];
      //   const timezoneOffset = latestEntry.created.getTimezoneOffset() * 60000; // Convert minutes to milliseconds
      //   const localTime = latestEntry.created - timezoneOffset;
      const endTimestamp = new Date(latestEntry.created).getTime() + latestEntry.timeRange * 1000;
      const endTime = new Date(endTimestamp);

      // Calculate working time excluding 'idle limit' entries
      let workingTime = results.reduce((total, entry) => {
        if (entry.spentType !== 'idle limit') {
          return total + entry.timeRange;
        }
        return total;
      }, 0);

      //   console.log(new Date(results[results.length - 1].created));
      //   console.log(endTime);
      console.log(activity);

      return res.status(200).json({
        success: true,
        activity: activity,
        productivity: productivity,
        members: memberCnt,
        startTime: new Date(results[results.length - 1].created), // Last element's created time
        endTime,
        workingTime,
      });
    } else {
      return res.status(200).json({
        success: true,
        activity: activity,
        productivity: productivity,
        members: memberCnt,
        startTime: 0, // Last element's created time
        endTime: 0,
        workingTime: 0,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

module.exports = desktime;
