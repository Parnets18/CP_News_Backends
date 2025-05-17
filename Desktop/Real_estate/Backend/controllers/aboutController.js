const AboutCard = require('../model/About');

exports.createAboutCard = async (req, res) => {
  try {
    const { title, description, points } = req.body;

    // Validate required fields
    if (!title || !description || !points) {
      return res.status(400).json({ message: 'Title, description, and points are required' });
    }

    // Parse points if sent as JSON string
    let pointsArray;
    try {
      pointsArray = JSON.parse(points);
    } catch (error) {
      return res.status(400).json({ message: 'Points must be a valid JSON array' });
    }

    if (!Array.isArray(pointsArray)) {
      return res.status(400).json({ message: 'Points must be an array' });
    }

    // Create new About Card
    const aboutCard = new AboutCard({
      title,
      description,
      points: pointsArray,
      image: req.file ? req.file.path : undefined,
    });

    await aboutCard.save();
    res.status(201).json(aboutCard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllAboutCards = async (req, res) => {
  try {
    const aboutCards = await AboutCard.find();
    res.json(aboutCards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAboutCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, points, removeImage } = req.body;
    const updateData = {};

    // Update title and description if provided
    if (title) updateData.title = title;
    if (description) updateData.description = description;

    // Handle points update
    if (points) {
      let pointsArray;
      try {
        pointsArray = JSON.parse(points);
      } catch (error) {
        return res.status(400).json({ message: 'Points must be a valid JSON array' });
      }

      if (!Array.isArray(pointsArray)) {
        return res.status(400).json({ message: 'Points must be an array' });
      }
      updateData.points = pointsArray;
    }

    // Handle image removal or update
    if (removeImage === 'true') {
      updateData.image = null;
    } else if (req.file) {
      updateData.image = req.file.path;
    }

    // Update the card
    const updatedCard = await AboutCard.findByIdAndUpdate(id, updateData, { new: true });
    res.json(updatedCard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteAboutCard = async (req, res) => {
  try {
    await AboutCard.findByIdAndDelete(req.params.id);
    res.json({ message: 'About card deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};