const express = require('express');
const Build = require('../models/Build');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const { carModel, color, selectedParts } = req.body;
    if (!carModel) {
      return res.status(400).json({
        success: false,
        message: 'carModel is required.',
      });
    }

    const build = await Build.create({
      userId: req.user._id,
      carModel: String(carModel).trim(),
      color: color || '#ffffff',
      selectedParts: selectedParts || {},
    });

    res.status(201).json({
      success: true,
      data: {
        id: build._id,
        userId: build.userId,
        carModel: build.carModel,
        color: build.color,
        selectedParts: build.selectedParts,
        createdAt: build.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

router.get('/:userId', protect, async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not allowed to view another user's builds.",
      });
    }

    const builds = await Build.find({ userId }).sort({ createdAt: -1 }).lean();
    res.json({
      success: true,
      data: builds.map((b) => ({
        id: b._id,
        userId: b.userId,
        carModel: b.carModel,
        color: b.color,
        selectedParts: b.selectedParts,
        createdAt: b.createdAt,
      })),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

module.exports = router;
