//Controllers/viralController
const Viral = require('../Models/viralModel');

exports.createViral = async(req, res)=>{
    try{
        const { title, description, tags, date } = req.body;
    const image = req.file ? req.file.path : '';

    const newViral = await Viral.create({
        title,
      description,
      tags,
      date,
      image, 
    });
     res.status(201).json(newViral);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
    
};

exports.updateViral = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags, date } = req.body;
    const image = req.file ? req.file.path : undefined; // Changed from fileUrl to image

    const updatedViral = await Viral.findByIdAndUpdate(
      id,
      { 
        title, 
        description, 
        tags, 
        date, 
        ...(image && { image }) // Changed from fileUrl to image
      },
      { new: true }
    );

    res.json(updatedViral);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getVirals = async (req, res) => {
  try {
    const virals = await Viral.find().sort({ date: -1 });
    res.json(virals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getViralsById = async (req, res) => {
  try {
    const viral = await Viral.findById(req.params.id);
    if (!viral) {
      return res.status(404).json({ message: 'Viral report not found' });
    }
    res.json(viral);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteViral = async (req, res) => {
  try {
    const { id } = req.params;
    await Viral.findByIdAndDelete(id);
    res.json({ message: 'Report deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};