const paginatedList = async (Model, req, res) => {
  try {
    const { userId } = req.query; // Assuming userId is a property of the req.body
    const result = await Model.find({
      removed: false,
      userId: userId,
    });

    console.log(result);

    if (result.length > 0) {
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
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = paginatedList;
