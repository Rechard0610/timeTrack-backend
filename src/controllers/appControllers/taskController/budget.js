const mongoose = require('mongoose');
const ProjectModel = mongoose.model('Project');

const budget = async (Model, req, res) => {
  // Find document by id and updates with the required fields
  try {
    const result = await Model.find({
      project: new mongoose.Types.ObjectId(req.params.id),
      removed: false,
    });
    let totalbudget = 0;
    let isfixed = false;

    if (result[0]) {
      const budgetWithDollarSign = result[0].project.budget;
      isfixed = result[0].project.isfixed;

      if (isfixed) {
        const budgetWithoutDollarSign = budgetWithDollarSign.replace(/\$/g, '');
        totalbudget = Number(budgetWithoutDollarSign);
        console.log(totalbudget);

        result.forEach((element) => {
          totalbudget -= Number(element.budget.replace(/\$/g, ''));
        });
        console.log(totalbudget);
      } else {
        const budgetWithoutDollarSign = budgetWithDollarSign.replace(' H', '');
        totalbudget = Number(budgetWithoutDollarSign);
        console.log(totalbudget);

        result.forEach((element) => {
          totalbudget -= Number(element.budget.replace(' H', ''));
        });
        console.log(totalbudget);
      }

      console.log('totalbudget');
      console.log(totalbudget);
    } else {
      const result = await ProjectModel.find({ _id: new mongoose.Types.ObjectId(req.params.id) });
      const budgetWithDollarSign = result[0].budget;
      isfixed = result[0].isfixed;
      console.log(isfixed);
      console.log(budgetWithDollarSign);
      if (isfixed) {
        const budgetWithoutDollarSign = budgetWithDollarSign.replace(/\$/g, '');
        totalbudget = Number(budgetWithoutDollarSign);

        console.log(totalbudget);
      } else {
        const budgetWithoutDollarSign = budgetWithDollarSign.replace(' H', '');
        totalbudget = Number(budgetWithoutDollarSign);
        console.log(totalbudget);
      }
    }
    let resultbudget = { totalbudget, isfixed, id: req.params.id };
    return res.status(200).json({
      success: true,
      result: resultbudget,
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'An error occurred while fetching the total budget',
    });
  }
};

module.exports = budget;
