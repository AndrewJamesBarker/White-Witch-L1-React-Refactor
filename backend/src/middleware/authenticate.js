import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
  try {
    // Use environment-specific cookie name
    const cookieName = process.env.NODE_ENV === 'production' ? 'token' : 'token_dev';
    const token = req.cookies[cookieName]; 
    if (!token) {
      throw new Error('Authentication failed');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = decoded; 
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Authentication failed'
    });
  }
};

export default authenticate;
