const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token   = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user      = decoded;
    next();

  } catch (err) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};

// Export BOTH ways — fixes all routes regardless of how they import
module.exports = protect;           // default: const auth = require('./middleware/auth')
module.exports.protect = protect;   // named:   const { protect } = require('./middleware/auth')