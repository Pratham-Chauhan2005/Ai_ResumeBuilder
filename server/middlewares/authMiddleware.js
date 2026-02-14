import jwt from "jsonwebtoken";


export const protect = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized Access" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // Attach user info to request object
    next();
  } catch (error) {
    console.error("Unauthorized Access", error);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};