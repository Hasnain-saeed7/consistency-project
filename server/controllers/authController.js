const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields required' });

    if (password.length < 6)
      return res.status(400).json({ message: 'Password min 6 characters' });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists)
      return res.status(400).json({ message: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email:        email.toLowerCase(),
      passwordHash,
    });

    res.status(201).json({
      token: generateToken(user._id),
      user:  { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: err.message });
  }
};



const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('LOGIN ATTEMPT:', { email, password }); // ← ADD THIS

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    
    console.log('USER FOUND:', !!user, user?.email, !!user?.passwordHash); // ← ADD THIS

    if (!user)
      return res.status(400).json({ message: 'Invalid email or password' });

    if (!user.passwordHash)
      return res.status(400).json({ message: 'Invalid email or password' });

    console.log('COMPARING:', password, 'WITH HASH:', user.passwordHash?.substring(0,20)); // ← ADD THIS

    const match = await bcrypt.compare(password, user.passwordHash);
    
    console.log('MATCH RESULT:', match); // ← ADD THIS

    if (!match)
      return res.status(400).json({ message: 'Invalid email or password' });

    res.json({
      token: generateToken(user._id),
      user:  { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message });
  }
};




const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name)  user.name  = name;
    if (email) user.email = email.toLowerCase();

    if (currentPassword && newPassword) {
      const match = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!match)
        return res.status(400).json({ message: 'Current password incorrect' });
      user.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    await user.save();
    res.json({ _id: user._id, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerUser, loginUser, getMe, updateProfile };