import { verifyJwt } from "../services/authService.js";

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json("Authorisation required");
  }

  try {
    const token = authHeader.split(" ")[1];
    req.user = verifyJwt(token);
    console.log("Authenticated User:", req.user);
    return next();
  } catch (err) {
    console.error("Auth Error:", err.message);
    return res.status(401).json("Invalid or expired token");
  }
}

export function requireAdmin(req, res, next) {
  console.log("Checking Admin Access for:", req.user);
  if (!req.user || Number(req.user.roleId) !== 1) {
    console.log("Access Denied: Not an admin (roleId:", req.user?.roleId, ")");
    return res.status(403).json("Admin access required");
  }
  return next();
}
