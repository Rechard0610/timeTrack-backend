const mongoose = require('mongoose');
const AppTypeModel = mongoose.model('AppType');

const create = async (Model, req, res) => {
  try {
    let typeId = null;
    const currentDate = new Date();
    let startDayOfWeek = currentDate.setUTCHours(0, 0, 0, 0);
    let endDayOfWeek = currentDate.setUTCHours(23, 59, 59, 999);

    const { user, apps, urls, type, projectId, taskId, range } = req.body;
    const ele = apps === '' ? urls : apps;

    const existingEntry = await Model.findOne({
      $or: [{ app: apps }, { url: urls }],
    });

    if (existingEntry) {
      // Entry already exists, retrieve the typeId
      typeId = existingEntry.typeId;
    }

    const foundEntries = await Model.find({
      user: user,
      app: apps,
      url: urls,
      created: {
        $gte: new Date(startDayOfWeek),
        $lt: new Date(endDayOfWeek),
      },
    });

    if (foundEntries.length > 0) {
      const timeRange = { range: foundEntries[0].range + range };
      await Model.findOneAndUpdate({ _id: foundEntries[0]._id }, timeRange).exec();
    } else {
      // There isn't an item that matches, so add a new item
      const saveData = {
        user: user,
        project: projectId,
        task: taskId,
        app: apps,
        url: urls,
        typeId: typeId,
        range: range,
      };

      const result = await new Model({
        ...saveData,
      }).save();
    }

    return res.status(200).json({
      success: true,
      message: 'Successfully',
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing the request.',
    });
  }
};

module.exports = create;
