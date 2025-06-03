const Crime = require('../Models/crimeModel');

exports.createCrime = async (req, res) => {
  try {
    const { title, description, tags, date } = req.body;
    const image = req.file ? req.file.path.replace(/\\/g, '/') : ''; // Changed from fileUrl to image

    const newCrime = await Crime.create({
      title,
      description,
      tags,
      date,
      image, // Changed from fileUrl to image
    });

    res.status(201).json(newCrime);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCrime = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags, date } = req.body;
    const image = req.file ? req.file.path.replace(/\\/g, '/') : undefined; // Changed from fileUrl to image

    const updatedCrime = await Crime.findByIdAndUpdate(
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

    res.json(updatedCrime);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCrimes = async (req, res) => {
  try {
    const crimes = await Crime.find().sort({ date: -1 });
    res.json(crimes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get a single crime report
exports.getCrimesById = async (req, res) => {
  try {
    const crime = await Crime.findById(req.params.id);
    if (!crime) {
      return res.status(404).json({ message: 'Crime report not found' });
    }
    res.json(crime);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// exports.updateCrime = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, description, tags, date } = req.body;
//     const fileUrl = req.file ? req.file.path : undefined;

//     const updatedCrime = await Crime.findByIdAndUpdate(
//       id,
//       { title, description, tags, date, ...(fileUrl && { fileUrl }) },
//       { new: true }
//     );

//     res.json(updatedCrime);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.deleteCrime = async (req, res) => {
  try {
    const { id } = req.params;
    await Crime.findByIdAndDelete(id);
    res.json({ message: 'Report deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
