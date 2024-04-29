const mongoose = require('mongoose');

const UserData = mongoose.model('UserData');
// Assuming you're calculating for a specific userId, projectId, and taskId
const timeLine = async (req, res) => {
  // Query UserData documents with the specified conditions
  const { userId, selectedDate } = req.body;
  const startTime = new Date(selectedDate).setUTCHours(0, 0, 0, 0);
  const endTime = new Date(selectedDate).setUTCHours(23, 59, 59, 999);

  try {
    const results = await UserData.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          created: { $gte: new Date(startTime), $lte: new Date(endTime) },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
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

module.exports = timeLine;
