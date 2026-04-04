import User from '../models/User.js';

// @desc    Toggle property favorite
// @route   POST /api/users/favorites/:propertyId
// @access  Private
export const toggleFavorite = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const propertyId = req.params.propertyId;

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isFavorite = user.favorites.includes(propertyId);

    if (isFavorite) {
      user.favorites = user.favorites.filter((id) => id.toString() !== propertyId);
    } else {
      user.favorites.push(propertyId);
    }

    await user.save();
    res.status(200).json({ success: true, favorites: user.favorites });
  } catch (error) {
    console.error('[Backend Error] toggleFavorite:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user favorites
// @route   GET /api/users/favorites
// @access  Private
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
