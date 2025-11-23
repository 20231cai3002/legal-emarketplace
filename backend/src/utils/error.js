class AppError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}
const errorHandler = (err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Server error' });
};
module.exports = { AppError, errorHandler };