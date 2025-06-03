const RealEstate = require('../Models/realEstateModel');

exports.createRealEstate = async (req, res) => {
  try {
    const { title, description, tags, date } = req.body;
    const image = req.file ? req.file.path.replace(/\\/g, '/') : '';


    const newProperty = await RealEstate.create({
      title,
      description,
      tags,
      date,
      image,
    });

    res.status(201).json(newProperty);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateRealEstate = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags, date } = req.body;
    const image = req.file ? req.file.path.replace(/\\/g, '/') : undefined;

    const updatedProperty = await RealEstate.findByIdAndUpdate(
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

    res.json(updatedProperty);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRealEstates = async (req, res) => {
  try {
    const properties = await RealEstate.find().sort({ date: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRealEstateById = async (req, res) => {
  try {
    const property = await RealEstate.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Real estate entry not found' });
    }
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteRealEstate = async (req, res) => {
  try {
    const { id } = req.params;
    await RealEstate.findByIdAndDelete(id);
    res.json({ message: 'Real estate entry deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
