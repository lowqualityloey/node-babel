const errorHandler = (err, req, res, next) => {
  const error = err.message ? err.message : 'Something broke!';

  return res.status(500).json({ error });
};

export default errorHandler;
