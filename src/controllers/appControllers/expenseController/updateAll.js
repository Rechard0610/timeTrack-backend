const mongoose = require('mongoose');

const updateAll = async (Model, req, res) => {
  try {
    const { selectedRows, type } = req.body;
    const promises = selectedRows.map(async (item) => {
      const updatedDoc = await Model.findOneAndUpdate(
        { _id: item._id, status: 'pending' }, // Find the document with the matching _id and status
        { status: type }, // Update the status and productive fields
        { new: true } // Return the updated document
      );
      if (!updatedDoc) {
        console.log(`Document with _id ${item._id} not found or status not 'pending'.`);
      } else {
        console.log(`Document with _id ${item._id} updated successfully:`, updatedDoc);
      }
      return updatedDoc;
    });
    await Promise.all(promises);

    return res.status(200).json({
      success: true,
      result: [],
      message: 'Documents updated successfully.',
    });
  } catch (err) {
    console.error('Error updating documents:', err);
    return res.status(500).json({
      success: false,
      error: err.message,
      message: 'An error occurred while updating documents.',
    });
  }
};

module.exports = updateAll;
