const Profile = require('../models/Profile');

exports.createOrUpdateProfile = async (req, res) => {
  try {
    const profileData = { ...req.body, user: req.user._id };
    let profile = await Profile.findOne({ user: req.user._id });

    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { user: req.user._id },
        profileData,
        { new: true, runValidators: true }
      );
      return res.json(profile);
    }

    profile = await Profile.create(profileData);
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id }).populate('user', 'name email');
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found. Please create one.' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProfileByUserId = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId }).populate('user', 'name email');
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find({ user: { $ne: req.user._id } })
      .populate('user', 'name email');
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
