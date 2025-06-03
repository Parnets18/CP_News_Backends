const World = require('../Models/worldModel');

exports.createWorld = async (req, res) => {
  try {
    const { title, description, tags, date } = req.body;
    const image = req.file ? req.file.path.replace(/\\/g, '/') : '';


    const newWorld = await World.create({
      title,
      description,
      tags,
      date,
      image, 
    });
    res.status(201).json(newWorld);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateWorld = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags, date } = req.body;
   const image = req.file ? req.file.path.replace(/\\/g, '/') : undefined;

    const updatedWorld = await World.findByIdAndUpdate(
      id,
      { 
        title, 
        description, 
        tags, 
        date, 
        ...(image && { image })
      },
      { new: true }
    );
    res.json(updatedWorld);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getWorlds = async (req, res) => {
  try {
    const worlds = await World.find().sort({ date: -1 });
    res.json(worlds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getWorldById = async (req, res) => {
  try {
    const world = await World.findById(req.params.id);
    if (!world) {
      return res.status(404).json({ message: 'World report not found' });
    }
    res.json(world);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteWorld = async (req, res) => {
  try {
    const { id } = req.params;
    await World.findByIdAndDelete(id);
    res.json({ message: 'World report deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
