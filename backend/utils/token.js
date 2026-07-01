const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change-me';
const JWT_EXPIRES_IN = '2h';

function verifyToken(req) {
  try {
    return jwt.verify(req.headers['authentication'], JWT_SECRET);
  } catch (error) {
    console.error('Requête avec token invalide: ', error);
    return false;
  }
}

function createToken(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

module.exports = { verifyToken, createToken };
