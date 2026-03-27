const MenuItem = require('../models/MenuItem');

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
exports.getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get menu item by ID
// @route   GET /api/menu/:id
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

// @desc    Create a menu item
// @route   POST /api/menu
// @access  Private (e.g., admin)
exports.createMenuItem = async (req, res) => {
  const { name, description, price, category, imageUrl } = req.body;

  try {
    const newMenuItem = new MenuItem({
      name,
      description,
      price,
      category,
      imageUrl
    });

    const menuItem = await newMenuItem.save();
    res.status(201).json(menuItem);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a menu item
// @route   PUT /api/menu/:id
// @access  Private (e.g., admin)
exports.updateMenuItem = async (req, res) => {
  const { name, description, price, category, imageUrl } = req.body;

  // Build menu item object
  const menuItemFields = {};
  if (name) menuItemFields.name = name;
  if (description) menuItemFields.description = description;
  if (price) menuItemFields.price = price;
  if (category) menuItemFields.category = category;
  if (imageUrl) menuItemFields.imageUrl = imageUrl;

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
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Menu item not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a menu item
// @route   DELETE /api/menu/:id
// @access  Private (e.g., admin)
exports.deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ msg: 'Menu item not found' });
    }

    await MenuItem.findByIdAndDelete(req.params.id); // Updated to use findByIdAndDelete

    res.json({ msg: 'Menu item removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Menu item not found' });
    }
    res.status(500).send('Server Error');
  }
};