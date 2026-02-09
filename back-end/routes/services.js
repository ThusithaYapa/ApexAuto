const express = require('express');
const Service = require('../models/Service');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const services = await Service.find().sort({ name: 1 }).lean();
    res.json({
      success: true,
      data: services.map((s) => ({
        id: s._id,
        name: s.name,
        description: s.description,
        price: s.price,
      })),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

module.exports = router;
