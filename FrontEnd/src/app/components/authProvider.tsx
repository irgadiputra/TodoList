'use client'

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onLogin, onLogout } from "@/lib/redux/features/authSlices";
import { showError } from "@/utils/toast";
import { jwtDecode } from "jwt-decode"; // Assuming jwt-decode is used

interface DecodedToken {
  email: string;
  name: string;
  exp?: number;
  iat?: number;
}

export default function Auth({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { token, isLogin } = useAppSelector((state) => state.auth);

  // Function to refresh login status by validating the token
  const refreshLogin = async () => {
    try {
      if (!token || typeof token !== "string") {
        console.warn("No access token found in Redux state.");
        dispatch(onLogout()); // Log the user out if no token exists
        router.push("/login"); // Redirect to login
        return;
      }

      // Decode the JWT token to extract the payload and expiration date
      const decoded = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;

      // Check if the token is expired
      if (!decoded.exp || decoded.exp < currentTime) {
        console.warn("Access token expired.");
        showError("Session expired, please log in again.");
        dispatch(onLogout()); // Clear user state in Redux
        router.push("/login"); // Redirect to login page
        return;
      }

      // Validate the token structure (ensure `user` data is available)
      if (!decoded.email || !decoded.name) {
        console.warn("Invalid token payload:", decoded);
        showError("Invalid token, please log in again.");
        dispatch(onLogout()); // Clear user state in Redux
        router.push("/login"); // Redirect to login page
        return;
      }

      // If everything is valid, dispatch the user info to Redux
      dispatch(onLogin({
        user: { 
          email: decoded.email,
          name: decoded.name,
        },
        token: token,
      }));

    } catch (error) {
      console.error("Token verification failed:", error);
      showError("Token verification failed, please log in again.");
      dispatch(onLogout()); // Clear user state in Redux
      router.push("/login"); // Redirect to login page
    }
  };

  useEffect(() => {
    // Refresh the login status if the token is available and the user isn't logged in
    if (token && !isLogin) {
      refreshLogin();
    }
  }, [isLogin, token]); // Dependency array to re-run the effect when `isLogin` or `token` changes

  return <>{children}</>;
}
