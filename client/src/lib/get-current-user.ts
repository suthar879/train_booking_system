import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  userId: string;
  iat: number;
  exp: number;
};

export function getCurrentUser() {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token) as DecodedToken;
    return decoded;
  } catch (err) {
    return null;
  }
}
