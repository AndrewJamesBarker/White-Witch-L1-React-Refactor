import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
  try {
    const token = req.cookies.token; 
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
