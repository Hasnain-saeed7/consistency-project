const Failure = require('../models/Failure');
const Reminder = require('../models/Reminder');
const { checkFailureBadges } = require('../utils/badgeChecker');

// @desc    Get all failures
// @route   GET /api/failures
// @access  Private
const getFailures = async (req, res, next) => {
  try {
    const failures = await Failure.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(failures);
  } catch (error) {
    next(error);
  }
};

// @desc    Log a failure and save lesson to reminder pool
// @route   POST /api/failures
// @access  Private
const createFailure = async (req, res, next) => {
  try {
    const { title, cause, lesson, category } = req.body;

    if (!title || !lesson) {
      return res.status(400).json({ message: 'Title and lesson are required' });
    }

    const failure = await Failure.create({
      user: req.user.id,
      title,
      cause,
      lesson,
      category
    });

    // Auto-save the extracted lesson into the Reminder pool
    await Reminder.create({
      user: req.user.id,
      text: lesson,
      sourceId: failure._id
    });

    // Award 'honest' badge if conditions are met
    await checkFailureBadges(req.user.id);

    res.status(201).json(failure);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a failure entry and its reminder
// @route   DELETE /api/failures/:id
// @access  Private
const deleteFailure = async (req, res, next) => {
  try {
    const failure = await Failure.findById(req.params.id);

    if (!failure) {
      return res.status(404).json({ message: 'Failure entry not found' });
    }

    if (failure.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Attempt to also delete the associated reminder from the pool
    await Reminder.findOneAndDelete({ sourceId: failure._id });
    
    // Delete the failure itself
    await failure.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFailures,
  createFailure,
  deleteFailure
};