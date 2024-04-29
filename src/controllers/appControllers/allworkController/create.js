const mongoose = require('mongoose');

const UserDataModel = mongoose.model('UserData');

const create = async (req, res) => {
  let {
    id,
    idleTime,
    mouseIdleTime,
    mouseClickIdleTime,
    keyIdleTime,
    range,
    type,
    taskId,
    projectId,
  } = req.body;
  let privateTime = 0;
  let restRange = 0; // this using to calculate created pos

  if (type == 'private time') {
    privateTime = range;
    restRange = range;
    mouseIdleTime = 0;
    mouseClickIdleTime = 0;
    keyIdleTime = 0;
    idleTime = 0;
    range = 0;
  } else if (type == 'idle limit') {
    idleTime = range;
    privateTime = 0;
    mouseIdleTime = 0;
    mouseClickIdleTime = 0;
    keyIdleTime = 0;
  }

  if (restRange === 0) restRange = range;

  const workData = [];

  // console.log(idleTime);
  // console.log(mouseIdleTime);
  // console.log(keyIdleTime);
  // console.log(mouseClickIdleTime);
  // console.log(range);
  // console.log(id);
  // console.log(type);

  if (type !== 'idle limit' && range > 62) {
    // If range is greater than 62 and type is not 'idle limit', divide it into two parts
    let partRange = range;

    workData.push({
      privateTime: 0,
      mouseIdle: mouseIdleTime % 60,
      mouseClickIdle: mouseClickIdleTime % 60,
      idleTime: 0,
      keyIdle: keyIdleTime % 60,
      range: partRange % 60,
    });
    // Create first part of workData
    while (partRange > 60) {
      workData.push({
        privateTime: privateTime,
        mouseIdle: 60,
        mouseClickIdle: 60,
        idleTime: idleTime,
        keyIdle: 60,
        range: 60,
      });
      partRange -= 60;
    }
  } else {
    // Otherwise, create workData as usual
    workData.push({
      privateTime: privateTime,
      mouseIdle: mouseIdleTime,
      mouseClickIdle: mouseClickIdleTime,
      idleTime: idleTime,
      keyIdle: keyIdleTime,
      range: range,
    });
  }

  // console.log(idleTime);
  // console.log(mouseIdleTime);
  // console.log(keyIdleTime);
  // console.log(mouseClickIdleTime);
  // console.log(range);
  // console.log(id);
  // console.log(type);
  // console.log(taskId);

  // Find document by id
  try {
    const existingRecord = await UserDataModel.findOne({
      userId: new mongoose.Types.ObjectId(id),
      taskId,
      projectId,
      created: {
        $gte: new Date().setUTCHours(0, 0, 0, 0),
        $lte: new Date().setUTCHours(23, 59, 59, 999),
      },
    }).sort({ created: -1 }); // Sort to get the latest record

    // console.log(existingRecord);

    if (existingRecord && existingRecord.spentType === type) {
      workData.forEach((item) => {
        existingRecord.workData.push(item);
      });
      existingRecord.timeRange += range;
      await existingRecord.save();
    } else {
      // Create new record
      const start = new Date();
      const timezoneOffset = start.getTimezoneOffset() * 60000; // Convert minutes to milliseconds
      const localTime = start - timezoneOffset;
      const newRecord = new UserDataModel({
        userId: id,
        taskId,
        projectId,
        spentType: type,
        workData: workData,
        timeRange: range,
        created: new Date(Date.now() - restRange * 1000),
      });
      await newRecord.save();
    }

    // if (result) {
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error('Error updating/creating UserData:', error);
    return res.status(404).json({
      success: false,
    });
  }
};

module.exports = create;
