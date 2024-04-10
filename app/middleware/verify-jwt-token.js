const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {

    const token = req.headers["x-access-token"];
  
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    jwt.verify(token, process.env.MS_EXPERIENCE_TOKEN_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }
      req.user = decoded;
      next();
    });
  };

  module.exports = verifyToken;