exports.ensureAdmin = (req, res, next) => {
  try {
    if (req.userRole && req.userRole === 'admin') {
      return next();
    }
    return res.status(403).json({ success: false, message: 'Admin access required' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
