const User = require('../models/User');
const Energy = require('../models/Energy');

const getAllUsersData = async (req, res, next) => {
  try {
    const users = await User.find({ isAdmin: false }).select('-password');
    const energyData = await Energy.find();

    const result = users.map(user => {
      const userEnergy = energyData.filter(e => e.userId.toString() === user._id.toString());
      const totalUnits = userEnergy.reduce((acc, curr) => acc + curr.units, 0);
      const totalCost = userEnergy.reduce((acc, curr) => acc + curr.cost, 0);
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        totalUnits,
        totalCost,
        readingCount: userEnergy.length
      };
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsersData };
