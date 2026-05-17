const Mobile = require('../models/Mobile');

const getMobiles = async (req, res) => {
  try {
    const mobiles = await Mobile.find({});
    res.json(mobiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getMobileById = async (req, res) => {
  try {
    const mobile = await Mobile.findById(req.params.id);
    if (!mobile) {
      return res.status(404).json({ message: 'Mobile not found' });
    }
    res.json(mobile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getMobiles,
  getMobileById,
};