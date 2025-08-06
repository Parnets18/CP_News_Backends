const CategoryModel = require('../Models/CategoryModel');

exports.createItem = async (req, res) => {
  try {
    const { title, description, tags, date } = req.body;
    const image = req.file ? req.file.path.replace(/\\/g, '/') : '';
    const category = req.params.category.toLowerCase();
    
    const Model = CategoryModel(category);
    const newItem = await Model.create({
      title,
      description,
      tags,
      date,
      image,
      category
    });

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { id, category } = req.params;
    const { title, description, tags, date } = req.body;
    const image = req.file ? req.file.path.replace(/\\/g, '/') : undefined;

    const Model = CategoryModel(category);
    const updatedItem = await Model.findByIdAndUpdate(
      id,
      {
        title,
        description,
        tags,
        date,
        ...(image && { image }),
      },
      { new: true }
    );

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getItems = async (req, res) => {
  try {
    const category = req.params.category.toLowerCase();
    const Model = CategoryModel(category);
    const items = await Model.find().sort({ date: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const { id, category } = req.params;
    const Model = CategoryModel(category);
    const item = await Model.findById(id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { id, category } = req.params;
    const Model = CategoryModel(category);
    await Model.findByIdAndDelete(id);
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};