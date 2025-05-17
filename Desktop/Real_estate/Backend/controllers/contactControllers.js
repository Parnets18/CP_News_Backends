const ContactInfo = require('../model/Contact');

exports.createContactInfo = async (req, res) => {
  try {
    const { phoneAndEmail, officeAddress, visitHours } = req.body;

    // Validate required content fields
    if (!phoneAndEmail?.content || !officeAddress?.content || !visitHours?.content) {
      return res.status(400).json({ message: 'All content fields are required' });
    }

    const newContact = new ContactInfo({
      phoneAndEmail: {
        title: phoneAndEmail.title || 'Phone and Email',
        content: phoneAndEmail.content
      },
      officeAddress: {
        title: officeAddress.title || 'Office Address',
        content: officeAddress.content
      },
      visitHours: {
        title: visitHours.title || 'Visit Between',
        content: visitHours.content
      }
    });

    await newContact.save();
    res.status(201).json(newContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllContactInfo = async (req, res) => {
  try {
    const contacts = await ContactInfo.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateContactInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const existing = await ContactInfo.findById(id);

    if (!existing) {
      return res.status(404).json({ message: 'Contact info not found' });
    }

    // Merge updates
    if (updates.phoneAndEmail) {
      existing.phoneAndEmail = {
        title: updates.phoneAndEmail.title || existing.phoneAndEmail.title,
        content: updates.phoneAndEmail.content || existing.phoneAndEmail.content
      };
    }

    if (updates.officeAddress) {
      existing.officeAddress = {
        title: updates.officeAddress.title || existing.officeAddress.title,
        content: updates.officeAddress.content || existing.officeAddress.content
      };
    }

    if (updates.visitHours) {
      existing.visitHours = {
        title: updates.visitHours.title || existing.visitHours.title,
        content: updates.visitHours.content || existing.visitHours.content
      };
    }

    const updatedInfo = await existing.save();
    res.json(updatedInfo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteContactInfo = async (req, res) => {
  try {
    await ContactInfo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contact info deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};