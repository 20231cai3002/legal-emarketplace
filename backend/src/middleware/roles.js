const { AppError } = require('../utils/error');

const allowRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError('Forbidden', 403));
  }
  next();
};

module.exports = { allowRoles };