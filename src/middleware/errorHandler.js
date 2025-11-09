function notFound(req, res, next) {
  res.status(404).json({ success: false, error: 'Not Found' });
}

function errorHandler(err, req, res, next) {
  console.error('❌ Error:', err.message);
  res
    .status(err.status || 500)
    .json({ success: false, error: err.message || 'Internal Server Error' });
}

module.exports = { notFound, errorHandler };