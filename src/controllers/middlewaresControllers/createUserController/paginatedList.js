const mongoose = require('mongoose');

const paginatedList = async (userModel, req, res) => {
  try {
    const User = mongoose.model(userModel);

    const page = req.query.page || 1;
    const limit = parseInt(req.query.items) || 10;
    const skip = page * limit - limit;

    const { sortBy = 'enabled', sortValue = -1, id, role, q, fields } = req.query;

    const fieldsArray = fields ? fields.split(',') : [];

    let fieldlist;

    fieldlist = fieldsArray.length === 0 ? {} : { $or: [] };

    for (const field of fieldsArray) {
      fieldlist.$or.push({ [field]: { $regex: new RegExp(q, 'i') } });
    }

    // console.log(req.query);

    const pipeline = [
      // Perform a left outer join with the 'teams' collection to populate the 'teams' field
      {
        $lookup: {
          from: 'teams',
          localField: '_id',
          foreignField: 'people',
          as: 'teams',
        },
      },
      // Match documents based on specified criteria
      {
        $match: {
          removed: false,
          ...(id && { 'teams._id': new mongoose.Types.ObjectId(id) }),
          ...(role && { role: role }),
          ...fieldlist,
        },
      },
    ];

    // Conditionally add $match stages based on filter value
    // if (id) {
    //   console.log(id);
    //   pipeline.push({
    //     $match: {
    //       'teams._id': new mongoose.Types.ObjectId(id),
    //     },
    //   });
    // }

    // if (role) {
    //   pipeline.push({
    //     $match: {
    //       role: role,
    //     },
    //   });
    // }

    // Project fields
    pipeline.push({
      $project: {
        teams: '$teams.teamname', // Include only the 'teamname' property from the 'teams' array
        firstname: 1,
        lastname: 1,
        email: 1,
        role: 1,
        initials: 1,
      },
    });

    // Sort the results
    pipeline.push({
      $sort: { [sortBy]: sortValue },
    });

    // Skip and limit for pagination
    pipeline.push(
      {
        $skip: skip,
      },
      {
        $limit: limit,
      }
    );

    // console.log(pipeline);

    // Execute aggregation pipeline
    const results = await User.aggregate(pipeline);

    // Counting the total documents
    const count = await User.countDocuments(pipeline);

    // Calculating total pages
    const pages = Math.ceil(count / limit);

    // Getting Pagination Object
    const pagination = { page, pages, count };

    if (count > 0) {
      return res.status(200).json({
        success: true,
        result: results,
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
  } catch (error) {
    // Handle error
    console.error('Error paginating list:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching data',
    });
  }
};

module.exports = paginatedList;
