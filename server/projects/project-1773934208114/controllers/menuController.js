const MenuItem = require('../models/MenuItem');

// @route   GET api/menu
// @desc    Get all menu items
// @access  Public
exports.getMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find().sort({ category: 1, name: 1 });
    res.json(menuItems);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/menu/:id
// @desc    Get menu item by ID
// @access  Public
exports.getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ msg: 'Menu item not found' });
    }
    res.json(menuItem);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Menu item not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @route   POST api/menu
// @desc    Create a menu item
// @access  Private (e.g., admin only)
exports.createMenuItem = async (req, res) => {
  const { name, description, price, category, imageUrl } = req.body;
  try {
    const newMenuItem = new MenuItem({
      name,
      description,
      price,
      category,
      imageUrl,
    });
    const menuItem = await newMenuItem.save();
    res.status(201).json(menuItem);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   PUT api/menu/:id
// @desc    Update a menu item
// @access  Private (e.g., admin only)
exports.updateMenuItem = async (req, res) => {
  const { name, description, price, category, imageUrl } = req.body;
  const menuItemFields = { name, description, price, category, imageUrl };

  try {
    let menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ msg: 'Menu item not found' });
    }

    menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { $set: menuItemFields },
      { new: true }
    );
    res.json(menuItem);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   DELETE api/menu/:id
// @desc    Delete a menu item
// @access  Private (e.g., admin only)
exports.deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ msg: 'Menu item not found' });
    }

    await MenuItem.deleteOne({ _id: req.params.id });
    res.json({ msg: 'Menu item removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};