const mongoose = require('mongoose');
const Admin = mongoose.model('Admin');

// Function to get the start date of the current week
const date = new Date();
const day = date.getDay();
const diff = date.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is Sunday
const startOfWeek = new Date(date.setDate(diff));
const endOfWeek = new Date(date.setDate(diff + 6));

console.log('++++++++++++++++++');
console.log(new Date(startOfWeek));
console.log(endOfWeek);

const create = async (Model, req, res) => {
  const { userId } = req.body;
  try {
    const admins = await Admin.find({
      $or: [
        { _id: new mongoose.Types.ObjectId(userId) },
        { invitedById: new mongoose.Types.ObjectId(userId) },
      ],
    });

    if (admins.length === 0) {
      throw new Error('No matching Admin found');
    }

    let lunchCreated = false;

    for (const admin of admins) {
      console.log(admin._id);
      const existingLunch = await Model.find({
        userId: admin._id,
        created: { $gte: new Date(startOfWeek), $lte: new Date(endOfWeek) },
      });

      console.log(existingLunch);

      if (!existingLunch.length > 0) {
        console.log(admin);
        // Create a new Lunch instance only if no existing entry is found
        const newLunch = new Model({
          userId: admin._id,
          mon: 0,
          tue: 0,
          wed: 0,
          thu: 0,
          fri: 0,
          sat: 0,
          sun: 0,
          total: 0,
        });

        // Save the new Lunch instance to the database
        await newLunch.save();
        lunchCreated = true;
      }
    }
    return res.status(200).json({
      success: true,
      result: lunchCreated,
      message: 'Successfully',
    });
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
};

module.exports = create;
