const Web = require('../Models/WebModal');

exports.createWeb = async (req, res) => {
  try {
    const { title, description, tags, date } = req.body;
    const image = req.file ? req.file.path : '';
    const newWeb = await Web.create({
      title,
      description,
      tags,
      date,
      image,
    });
    res.status(201).json(newWeb);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateWeb = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags, date } = req.body;
    const image = req.file ? req.file.path : undefined;
    const updatedWeb = await Web.findByIdAndUpdate(
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
    res.json(updatedWeb);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getWebs = async (req, res) => {
  try {
    const webs = await Web.find().sort({ date: -1 });
    res.json(webs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getWebById = async (req, res) => {
  try {
    const web = await Web.findById(req.params.id);
    if (!web) {
      return res.status(404).json({ message: 'Web report not found' });
    }
    res.json(web);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteWeb = async (req, res) => {
  try {
    const { id } = req.params;
    await Web.findByIdAndDelete(id);
    res.json({ message: 'Report deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};