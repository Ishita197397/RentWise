const express = require('express');
const router = express.Router();
const { sendRequest, getMyRequests, respondToRequest } = require('../controllers/requestController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, sendRequest)
  .get(protect, getMyRequests);

router.put('/:id', protect, respondToRequest);

module.exports = router;
