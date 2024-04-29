const count = async (Model, req, res) => {
  // Find document by id
  const countPromise = await Model.find().exec();
  const result = await Promise.all(countPromise);
  // If no results found, return document not found
  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No document found ',
    });
  } else {
    // Return success resposne
    return res.status(200).json({
      success: true,
      result,
      message: 'we found this document ',
    });
  }
};

module.exports = count;
