const Entertainment = require('../Models/entertainmentModel');

exports.createEntertainment = async (req, res) => {
  try {
    const { title, description, tags, date } = req.body;
    const image = req.file ? req.file.path.replace(/\\/g, '/') : '';
    const newEntertainment = await Entertainment.create({
      title,
      description,
      tags,
      date,
      image,
    });

    res.status(201).json(newEntertainment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateEntertainment = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags, date } = req.body;
    const image = req.file ? req.file.path.replace(/\\/g, '/') :  undefined;

    const updatedEntertainment = await Entertainment.findByIdAndUpdate(
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

    res.json(updatedEntertainment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEntertainments = async (req, res) => {
  try {
    const entertainments = await Entertainment.find().sort({ date: -1 });
    res.json(entertainments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEntertainmentById = async (req, res) => {
  try {
    const entertainment = await Entertainment.findById(req.params.id);
    if (!entertainment) {
      return res.status(404).json({ message: 'Entertainment report not found' });
    }
    res.json(entertainment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteEntertainment = async (req, res) => {
  try {
    const { id } = req.params;
    await Entertainment.findByIdAndDelete(id);
    res.json({ message: 'Report deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
