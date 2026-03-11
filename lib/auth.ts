import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export function signJwt(payload: string | Buffer | object, expiresIn: string | number = "1d") {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
}

export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function extractUserFromRequest(request: NextRequest): { userId: string, [key: string]: unknown } | null {
  const token = request.cookies.get("token")?.value;
  if (!token) return null;
  return verifyJwt(token) as { userId: string, [key: string]: unknown } | null;
}
