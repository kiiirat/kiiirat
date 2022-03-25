import * as jwt from "jsonwebtoken";

export interface AuthTokenPayload {
  // 1
  adminId?: number;
  customerId?: number;
}

export function decodeAuthHeader(
  authHeader: string | undefined | null
): AuthTokenPayload {
  // 2
  const token = authHeader ? authHeader.replace("Bearer ", "") : null; // 3

  if (!token) {
    return {};
  }
  return jwt.verify(token, process.env.APP_SECRET) as AuthTokenPayload; // 4
}
