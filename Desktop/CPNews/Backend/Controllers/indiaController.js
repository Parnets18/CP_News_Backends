const India = require('../Models/indiaModel');

exports.createIndia = async (req, res) => {
  try {
    const { title, description, tags, date } = req.body;
    const image = req.file ? req.file.path : '';

    const newIndia = await India.create({
      title,
      description,
      tags,
      date,
      image,
    });
    res.status(201).json(newIndia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateIndia = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags, date } = req.body;
    const image = req.file ? req.file.path : undefined;

    const updatedIndia = await India.findByIdAndUpdate(
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

    res.json(updatedIndia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getIndias = async (req, res) => {
  try {
    const indias = await India.find().sort({ date: -1 });
    res.json(indias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getIndiaById = async (req, res) => {
  try {
    const india = await India.findById(req.params.id);
    if (!india) {
      return res.status(404).json({ message: 'India report not found' });
    }
    res.json(india);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteIndia = async (req, res) => {
  try {
    const { id } = req.params;
    await India.findByIdAndDelete(id);
    res.json({ message: 'Report deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
