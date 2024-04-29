const paginatedList = async (Model, req, res) => {
  const page = req.query.page || 1;
  const limit = parseInt(req.query.items) || 10;
  const skip = page * limit - limit;

  const {
    sortBy = 'enabled',
    sortValue = -1,
    q,
    fields,
    startDay,
    endDay,
    status,
    sort,
    client,
  } = req.query;

  const fieldsArray = fields ? fields.split(',') : [];

  const end = new Date(endDay).setUTCHours(23, 59, 59, 999);

  // let fieldList;
  // fieldList = fieldsArray.length === 0 ? {} : { $or: [] };
  let sortVal = -1;
  if (sort) {
    sortVal = Number(sort);
  }

  const query = {
    removed: false,
  };

  if (q && q !== '') {
    query.$or = [];
    for (const field of fieldsArray) {
      query.$or.push({ [field]: { $regex: new RegExp(q, 'i') } });
    }
  }

  if (startDay && startDay != '') {
    query['created'] = { $gte: new Date(startDay), $lte: new Date(end) };
  }

  if (status && status != '') {
    query['status'] = status;
  }

  if (client && client != '') {
    query['clientname'] = client;
  }

  //  Query the database for a list of all results
  const resultsPromise = Model.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ created: sortVal })
    .exec();

  // Counting the total documents
  const countPromise = Model.countDocuments(query);

  // Resolving both promises
  const [result, count] = await Promise.all([resultsPromise, countPromise]);

  // Calculating total pages
  const pages = Math.ceil(count / limit);

  // Getting Pagination Object
  const pagination = { page, pages, count };
  if (count > 0) {
    return res.status(200).json({
      success: true,
      result,
      pagination,
      message: 'Successfully found all documents',
    });
  } else {
    return res.status(203).json({
      success: true,
      result: [],
      pagination,
      message: 'Collection is Empty',
    });
  }
};

module.exports = paginatedList;
