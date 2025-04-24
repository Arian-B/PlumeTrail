import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  console.log("🔐 Incoming token:", token);

  if (!token) {
    return res.status(401).json("Not authenticated!");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) {
      console.log("❌ JWT verification error:", err.message); // << We need this
      return res.status(403).json("Token is not valid! 🔒"); // helps confirm exact error source
    }

    console.log("✅ Token verified. User info:", userInfo);
    req.user = userInfo;
    next();
  });
};
