const Mobility = require('../Models/mobilityModel');

exports.createMobility = async (req, res) => {
  try {
    const { title, description, tags, date } = req.body;
    const image = req.file ? req.file.path.replace(/\\/g, '/') : '';

    const newMobility = await Mobility.create({
      title,
      description,
      tags,
      date,
      image,
    });

    res.status(201).json(newMobility);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateMobility = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags, date } = req.body;
    const image = req.file ? req.file.path.replace(/\\/g, '/') : undefined;

    const updatedMobility = await Mobility.findByIdAndUpdate(
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

    res.json(updatedMobility);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMobilities = async (req, res) => {
  try {
    const mobilities = await Mobility.find().sort({ date: -1 });
    res.json(mobilities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMobilityById = async (req, res) => {
  try {
    const mobility = await Mobility.findById(req.params.id);
    if (!mobility) {
      return res.status(404).json({ message: 'Mobility report not found' });
    }
    res.json(mobility);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteMobility = async (req, res) => {
  try {
    const { id } = req.params;
    await Mobility.findByIdAndDelete(id);
    res.json({ message: 'Mobility report deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
