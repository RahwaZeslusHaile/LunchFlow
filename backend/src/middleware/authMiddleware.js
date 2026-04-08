import { verifyJwt } from "../services/authService.js";

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json("Authorisation required");
  }

  try {
    const token = authHeader.split(" ")[1];
    req.user = verifyJwt(token);
    console.log(`[AUTH] User Authenticated: ID=${req.user.userId}, Email=${req.user.email}, Role=${req.user.roleId}`);
    return next();
  } catch (err) {
    console.error(`[AUTH] Failed to verify token: ${err.message}`);
    return res.status(401).json("Invalid or expired token");
  }
}

export function requireAdmin(req, res, next) {
  const roleId = Number(req.user?.roleId);
  console.log(`[AUTH] Checking Admin Access. Required: 1, Found: ${roleId}`);
  if (!req.user || roleId !== 1) {
    console.warn(`[AUTH] Access Denied for user ${req.user?.email} (Role: ${roleId})`);
    return res.status(403).json("Admin access required");
  }
  return next();
}
