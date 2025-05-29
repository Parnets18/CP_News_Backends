const Sports = require('../Models/sportsModel');

exports.createSports = async (req, res) => {
  try {
    const { title, description, tags, date } = req.body;
    const image = req.file ? req.file.path : '';

    const newSports = await Sports.create({
      title,
      description,
      tags,
      date,
      image, 
    });
    res.status(201).json(newSports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSports = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags, date } = req.body;
    const image = req.file ? req.file.path : undefined;

    const updatedSports = await Sports.findByIdAndUpdate(
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
    res.json(updatedSports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSports = async (req, res) => {
  try {
    const sports = await Sports.find().sort({ date: -1 });
    res.json(sports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSportsById = async (req, res) => {
  try {
    const sports = await Sports.findById(req.params.id);
    if (!sports) {
      return res.status(404).json({ message: 'Sports report not found' });
    }
    res.json(sports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteSports = async (req, res) => {
  try {
    const { id } = req.params;
    await Sports.findByIdAndDelete(id);
    res.json({ message: 'Sports report deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};