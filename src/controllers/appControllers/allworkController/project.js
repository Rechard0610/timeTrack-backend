const mongoose = require('mongoose');

const ProjectModel = mongoose.model('Project');

const projectList = async (req, res) => {
  const sort = parseInt(req.query.sort) || 'desc';

  //  Query the database for a list of all results
  const result = await ProjectModel.find({
    'people.assign': req.body.id,
    removed: false,
  })
    .sort({ created: sort })
    .populate()
    .exec();

  // console.log(result);

  if (result) {
    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully found all documents',
    });
  } else {
    return res.status(203).json({
      success: true,
      result: [],
      message: 'Collection is Empty',
    });
  }
};

module.exports = projectList;
