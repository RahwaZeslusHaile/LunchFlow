import { verifyJwt } from "../services/authService.js";

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json("Authorisation required");
  }

  try {
    const token = authHeader.split(" ")[1];
    req.user = verifyJwt(token);
    return next();
  } catch {
    return res.status(401).json("Invalid or expired token");
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.roleId !== 1) {
    return res.status(403).json("Admin access required");
  }
  return next();
}
