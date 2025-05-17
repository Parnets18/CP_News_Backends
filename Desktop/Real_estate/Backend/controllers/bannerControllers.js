const Banner = require('../model/Banner');

exports.createBanner = async (req, res) => {
  try {
    console.log('Body:', req.body);
    console.log('Files:', req.files);

    const { title, description } = req.body;

    if (!req.files?.image1 || !req.files?.image2) {
      return res.status(400).json({ message: 'Both images are required' });
    }

    const banner = new Banner({
      title,
      description,
      image1: req.files.image1[0].path,
      image2: req.files.image2[0].path
    });

    await banner.save();
    res.status(201).json(banner);
  } catch (error) {
    console.error('Error creating banner:', error);
    res.status(400).json({ message: error.message });
  }
};


exports.getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (req.files) {
      if (req.files.image1) updateData.image1 = req.files.image1[0].path;
      if (req.files.image2) updateData.image2 = req.files.image2[0].path;
    }

    const updatedBanner = await Banner.findByIdAndUpdate(id, updateData, { new: true });
    res.json(updatedBanner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};