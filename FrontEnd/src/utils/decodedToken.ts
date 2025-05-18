import { jwtDecode } from "jwt-decode";
import { IAuth } from "@/lib/redux/features/authSlices";

export const decodeTokenToAuth = (token: string): IAuth | null => {
  try {
    const decoded: any = jwtDecode(token);

    if (!decoded.email || !decoded.id) {
      console.error("Invalid token: Missing required user information");
      return null;
    }

    return {
      user: {
        email: decoded.email,
        name: decoded.name,
        id: decoded.id,
      },
      isLogin: true,
      token,
    };
  } catch (e) {
    console.error("Error decoding token:", e);
    return null;
  }
};
