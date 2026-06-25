const express = require('express');
const router = express.Router();
const {
  createOrUpdateProfile,
  getProfile,
  getProfileByUserId,
  getAllProfiles,
} = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, createOrUpdateProfile)
  .get(protect, getProfile);

router.get('/all', protect, getAllProfiles);
router.get('/user/:userId', protect, getProfileByUserId);

module.exports = router;
