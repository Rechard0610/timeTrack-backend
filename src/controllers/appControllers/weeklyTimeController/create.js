const create = async (Model, req, res) => {
  // Creating a new document in the collection
  const { selectedRows, type } = req.body;
  console.log(selectedRows);
  console.log(type);
  const createData = selectedRows.map((item) => {
    const percentage = item.percentage === undefined ? 0 : parseFloat(item.percentage);
    return {
      removed: false,
      userId: item._id.userId,
      project: item._id.projectId,
      task: item._id.taskId,
      totalTimeRange: item.totalTimeRange,
      percentage: percentage,
      billabletime: item.billabletime,
      totalBudget: item.totalBudget,
      totalSpent: item.totalSpent,
      totalBillableTime: item.totalBillableTime,
      averageActivity: item.averageActivity,
      productivity: item.productivity,
      status: type,
    };
  });
  const result = await Model.insertMany(createData);

  // Returning successfull response
  return res.status(200).json({
    success: true,
    result,
    message: 'Successfully Created the document ',
  });
};

module.exports = create;
