import { useMemo, useState } from "react";
import { AuthContext } from "./authContext";
import { signIn, signOut, signUp } from "../services/authApi";

const STORAGE_KEY = "hiresense_auth";

function readStoredAuth() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

function writeStoredAuth(value) {
  if (!value) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredAuth);

  const value = useMemo(
    () => ({
      token: session?.token || "",
      user: session?.user || null,
      async login(credentials) {
        const nextSession = await signIn(credentials);
        writeStoredAuth(nextSession);
        setSession(nextSession);
        return nextSession;
      },
      async signup(payload) {
        const nextSession = await signUp(payload);
        writeStoredAuth(nextSession);
        setSession(nextSession);
        return nextSession;
      },
      async logout() {
        const token = session?.token || "";
        writeStoredAuth(null);
        setSession(null);
        if (token) {
          await signOut(token).catch(() => {});
        }
      },
    }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
