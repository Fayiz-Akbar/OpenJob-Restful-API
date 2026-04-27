const jwt = require('jsonwebtoken');
const AuthenticationError = require('../exceptions/AuthenticationError');

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Token tidak ditemukan');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    req.user = decoded; // Menyimpan ID user di req.user
    next();
  } catch (error) {
    next(new AuthenticationError('Token tidak valid atau kadaluarsa'));
  }
};

module.exports = authenticate;