// middleware/validation.js
const validateProduct = (req, res, next) => {
  const { name, price } = req.body;
  if (!name) {
    const error = new Error('Product name is required');
    error.status = 400;
    return next(error);
  }
  if (!price || typeof price !== 'number' || price <= 0) {
    const error = new Error('Invalid price. Price must be a positive number.');
    error.status = 400;
    return next(error);
  }
  next();
};