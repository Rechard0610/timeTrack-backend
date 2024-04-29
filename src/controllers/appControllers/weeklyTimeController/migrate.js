exports.migrate = (result, totalSpentByProject, totalBillableTime, productive, existData) => {
  const existingDocument =
    existData.find(
      (res) =>
        res.project._id.toString() === result._id.projectId.toString() &&
        res.task._id.toString() === result._id.taskId.toString() &&
        res.userId._id.toString() === result._id.userId.toString()
    )?._id || 0;
  if (existingDocument === 0) {
    let newData = {};
    newData._id = result._id;
    newData.removed = result.removed;
    newData.totalTimeRange = result.totalTimeRangeWithManual;
    newData.project = result.project;
    newData.task = result.task;
    newData.totalBudget =
      totalSpentByProject.find((res) => res._id.toString() === result.project._id.toString())
        ?.budget || 0;
    newData.averageActivity = result.averageActivity;
    newData.totalSpent =
      totalSpentByProject.find((res) => res._id.toString() === result.project._id.toString())
        ?.totalSpent || 0;
    newData.totalBillableTime =
      totalBillableTime.find((res) => res._id.toString() === result.project._id.toString())
        ?.totalbillableTime || 0;
    newData.productivity =
      productive.find(
        (res) =>
          res._id.project.toString() === result._id.projectId.toString() &&
          res._id.task.toString() === result._id.taskId.toString() &&
          res._id.userId.toString() === result._id.userId.toString()
      )?.percentage || 0;

    return newData;
  }
};
