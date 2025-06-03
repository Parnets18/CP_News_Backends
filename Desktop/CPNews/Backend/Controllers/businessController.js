const Business = require('../Models/businessModel');

exports.createBusiness = async (req, res) => {
  try {
    const { title, description, tags, date } = req.body;
    const image = req.file ? req.file.path.replace(/\\/g, '/') : '';

    const newBusiness = await Business.create({
      title,
      description,
      tags,
      date,
      image
    });

    res.status(201).json(newBusiness);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags, date } = req.body;
    const image = req.file ? req.file.path.replace(/\\/g, '/') :  undefined;

    const updatedBusiness = await Business.findByIdAndUpdate(
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

    res.json(updatedBusiness);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find().sort({ date: -1 });
    res.json(businesses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBusinessById = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({ message: 'Business report not found' });
    }
    res.json(business);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    await Business.findByIdAndDelete(id);
    res.json({ message: 'Business report deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
