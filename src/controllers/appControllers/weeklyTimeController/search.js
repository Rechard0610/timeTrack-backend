const { migrate } = require('./migrate');

const search = async (Model, req, res) => {
  // console.log(req.query.fields)
  // if (req.query.q === undefined || req.query.q.trim() === '') {
  //   return res
  //     .status(202)
  //     .json({
  //       success: false,
  //       result: [],
  //       message: 'No document found by this request',
  //     })
  //     .end();
  // }
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
  const endOfWeek = new Date(today);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const startDate = startOfWeek.setUTCHours(0, 0, 0, 0);
  const endDate = endOfWeek.setUTCHours(23, 59, 59, 999);

  const { sortBy = 'enabled', sortValue = -1, filter, equal, userId } = req.query;
  // const fieldsArray = req.query.fields ? req.query.fields.split(',') : ['name'];

  // const fields = { $or: [] };

  // for (const field of fieldsArray) {
  //   fields.$or.push({ [field]: { $regex: new RegExp(req.query.q, 'i') } });
  // }

  let results = await Model.find({
    userId,
    status: equal,
    created: {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    },
  })
    .where('removed', false)
    .limit(20)
    .exec();

  if (results.length >= 1) {
    return res.status(200).json({
      success: true,
      result: results,
      message: 'Successfully found all documents',
    });
  } else {
    return res
      .status(202)
      .json({
        success: false,
        result: [],
        message: 'No document found by this request',
      })
      .end();
  }
};

module.exports = search;
