const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/error');

module.exports = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next(new AppError('Unauthorized', 401));
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, role }
    next();
  } catch {
    next(new AppError('Invalid token', 401));
  }
};