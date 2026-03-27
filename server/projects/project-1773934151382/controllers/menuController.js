const MenuItem = require('../models/MenuItem');

const getMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({});
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (menuItem) {
      res.json(menuItem);
    } else {
      res.status(404).json({ message: 'Menu item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMenuItem = async (req, res) => {
  const { name, description, price, category, imageUrl } = req.body;

  try {
    const menuItem = new MenuItem({
      name,
      description,
      price,
      category,
      imageUrl
    });

    const createdMenuItem = await menuItem.save();
    res.status(201).json(createdMenuItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateMenuItem = async (req, res) => {
  const { name, description, price, category, imageUrl } = req.body;

  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (menuItem) {
      menuItem.name = name || menuItem.name;
      menuItem.description = description || menuItem.description;
      menuItem.price = price || menuItem.price;
      menuItem.category = category || menuItem.category;
      menuItem.imageUrl = imageUrl || menuItem.imageUrl;

      const updatedMenuItem = await menuItem.save();
      res.json(updatedMenuItem);
    } else {
      res.status(404).json({ message: 'Menu item not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (menuItem) {
      await MenuItem.deleteOne({ _id: req.params.id });
      res.json({ message: 'Menu item removed' });
    } else {
      res.status(404).json({ message: 'Menu item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
};