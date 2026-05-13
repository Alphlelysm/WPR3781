const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }

  console.error(err)

  const statusCode = err.statusCode || err.status || 500
  const message = statusCode === 500 ? "Server error" : err.message

  return res.status(statusCode).json({ message })
}

module.exports = errorHandler
