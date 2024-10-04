const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// פונקציה ליצירת JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1h", // תקופת התוקף של ה-Token
  });
};

// פונקציה לאימות JWT
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // לוקחים את ה-Token מהכותרת

  if (!token) return res.status(403).send("Token is required!");

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send("Invalid Token!");
    req.userId = decoded.id; // שומרים את ה-userId ב-req
    next(); // ממשיכים לשלב הבא
  });
};

module.exports = { generateToken, verifyToken };
