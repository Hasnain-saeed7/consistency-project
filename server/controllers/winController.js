const Win = require('../models/Win');
const { checkWinBadges } = require('../utils/badgeChecker');

// @desc    Get all wins (paginated)
// @route   GET /api/wins
// @access  Private
const getWins = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const total = await Win.countDocuments({ user: req.user.id });
    
    const wins = await Win.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: wins.length,
      pagination: {
        page,
        limit,
        total
      },
      data: wins
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log a win
// @route   POST /api/wins
// @access  Private
const createWin = async (req, res, next) => {
  try {
    const { title, description, size, mood } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    if (title.length > 120) {
      return res.status(400).json({ message: 'Title cannot exceed 120 characters' });
    }

    const win = await Win.create({
      user: req.user.id,
      title,
      description,
      size: size || 'small',
      mood: mood || 3
    });

    // Award badge based on win counts
    await checkWinBadges(req.user.id);

    res.status(201).json(win);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a win
// @route   DELETE /api/wins/:id
// @access  Private
const deleteWin = async (req, res, next) => {
  try {
    const win = await Win.findById(req.params.id);

    if (!win) {
      return res.status(404).json({ message: 'Win not found' });
    }

    if (win.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await win.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
};

// @desc    Get win stats (count, this week, by size)
// @route   GET /api/wins/stats
// @access  Private
const getWinStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 1. Total Count
    const totalCount = await Win.countDocuments({ user: userId });

    // 2. This Week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const thisWeekCount = await Win.countDocuments({
      user: userId,
      createdAt: { $gte: oneWeekAgo }
    });

    // 3. By Size
    const sizeStats = await Win.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$size", count: { $sum: 1 } } }
    ]);

    // Format size stats into an object (e.g., { small: 5, medium: 2, big: 1 })
    const formattedSizeStats = { small: 0, medium: 0, big: 0 };
    sizeStats.forEach(stat => {
      if (formattedSizeStats[stat._id] !== undefined) {
        formattedSizeStats[stat._id] = stat.count;
      }
    });

    res.status(200).json({
      totalCount,
      thisWeekCount,
      bySize: formattedSizeStats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWins,
  createWin,
  deleteWin,
  getWinStats
};