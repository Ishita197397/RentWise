const RoommateRequest = require('../models/RoommateRequest');

exports.sendRequest = async (req, res) => {
  try {
    const { to, message } = req.body;

    if (to === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot send request to yourself' });
    }

    const existing = await RoommateRequest.findOne({ from: req.user._id, to });
    if (existing) {
      return res.status(400).json({ message: 'Request already sent to this user' });
    }

    const request = await RoommateRequest.create({
      from: req.user._id,
      to,
      message: message || '',
    });

    const populated = await request.populate(['from', 'to']);
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const sent = await RoommateRequest.find({ from: req.user._id })
      .populate('to', 'name email');
    const received = await RoommateRequest.find({ to: req.user._id })
      .populate('from', 'name email');
    res.json({ sent, received });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.respondToRequest = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await RoommateRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    if (request.to.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to respond to this request' });
    }

    request.status = status;
    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
