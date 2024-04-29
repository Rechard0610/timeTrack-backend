const mongoose = require('mongoose');
const Admin = mongoose.model('Admin');

const paginatedList = async (Model, req, res) => {
  const page = req.query.page || 1;
  const limit = parseInt(req.query.items) || 10;
  const skip = page * limit - limit;

  const { sortBy = 'enabled', sortValue = -1, filter, equal, userId } = req.query;
  const fieldsArray = req.query.fields ? req.query.fields.split(',') : [];

  let fields;

  fields = fieldsArray.length === 0 ? {} : { $or: [] };

  for (const field of fieldsArray) {
    fields.$or.push({ [field]: { $regex: new RegExp(req.query.q, 'i') } });
  }

  console.log(userId);

  try {
    const userData = await Admin.aggregate([
      {
        $match: {
          removed: false,
          $or: [
            { invitedById: new mongoose.Types.ObjectId(userId) },
            { _id: new mongoose.Types.ObjectId(userId) },
          ],
        },
      },
      {
        $lookup: {
          from: 'membersettings', // Assuming the name of the client collection is 'clients'
          let: { id: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$userId', '$$id'] }],
                },
              },
            },
          ],
          as: 'membersettings',
        },
      },
      {
        $unwind: {
          path: '$membersettings',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          userId: '$_id',
          _id: { $ifNull: ['$membersettings._id', false] },
          hideowner: { $ifNull: ['$membersettings.hideowner', false] },
          companyexpenses: { $ifNull: ['$membersettings.companyexpenses', false] },
          payments: { $ifNull: ['$membersettings.payments', false] },
          lunch: { $ifNull: ['$membersettings.lunch', false] },
          projectcreation: { $ifNull: ['$membersettings.projectcreation', false] },
          projectdelecting: { $ifNull: ['$membersettings.projectdelecting', false] },
          reportexporting: { $ifNull: ['$membersettings.reportexporting', false] },
          financialreports: { $ifNull: ['$membersettings.financialreports', false] },
          otheruserdata: { $ifNull: ['$membersettings.otheruserdata', false] },
          screenshot: { $ifNull: ['$membersettings.screenshot', false] },
          privatetime: { $ifNull: ['$membersettings.privatetime', false] },
          forceproject: { $ifNull: ['$membersettings.forceproject', false] },
          forcetask: { $ifNull: ['$membersettings.forcetask', false] },
          hideprojectfixedprice: { $ifNull: ['$membersettings.hideprojectfixedprice', false] },
          hidepage: { $ifNull: ['$membersettings.hidepage', false] },
        },
      },
    ]);

    const total = userData.length;
    const pages = Math.ceil(total / limit);
    pagination = { page, pages, count: total };

    const result = await Model.populate(userData, [
      {
        path: 'userId',
        model: 'Admin',
      },
    ]);
    return res.status(200).json({
      success: true,
      result,
      pagination,
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

module.exports = paginatedList;
