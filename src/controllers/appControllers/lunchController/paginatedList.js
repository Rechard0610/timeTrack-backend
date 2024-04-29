const mongoose = require('mongoose');

const paginatedList = async (Model, req, res) => {
  const page = req.query.page || 1;
  const limit = parseInt(req.query.items) || 10;
  const skip = page * limit - limit;

  const { sortBy = 'enabled', sortValue = -1, userId, startDate, endDate } = req.query;
  console.log('=====================');
  console.log(new Date(startDate));
  console.log(new Date(endDate));
  try {
    const userData = await Model.aggregate([
      {
        $lookup: {
          from: 'admins', // Assuming the name of the admin collection is 'admins'
          localField: 'userId',
          foreignField: '_id',
          as: 'userId',
        },
      },
      {
        $unwind: '$userId',
      },
      {
        $match: {
          $or: [
            { 'userId._id': new mongoose.Types.ObjectId(userId) },
            { 'userId.invitedById': new mongoose.Types.ObjectId(userId) },
          ],
          created: { $gte: new Date(startDate), $lte: new Date(endDate) },
          status: 'pending',
        },
      },
      {
        $sort: { created: -1 },
      },
    ]);

    const total = userData.length;
    const pages = Math.ceil(total / limit);
    pagination = { page, pages, count: total };

    console.log(userData);

    // console.log(userData);

    return res.status(200).json({
      success: true,
      result: userData,
      pagination,
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

module.exports = paginatedList;
