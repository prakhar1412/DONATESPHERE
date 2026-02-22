import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export interface User {
    id: string;
    name: string;
    email: string;
    picture?: string;
    provider: "google" | "email";
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    signInWithGoogle: () => void;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signUpWithEmail: (name: string, email: string, password: string) => Promise<void>;
    signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GOOGLE_CLIENT_ID = "331084500815-ni47i9omtdr35qvehfa9hnbe4g5k8lf9.apps.googleusercontent.com";
const API_URL = "http://localhost:5000/api";

// Helper to decode JWT (Google credential is a JWT)
function decodeJwt(token: string) {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Restore session from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem("donatesphere_user");
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch {
                localStorage.removeItem("donatesphere_user");
            }
        }
        setIsLoading(false);
    }, []);

    // Persist user to localStorage whenever it changes
    useEffect(() => {
        if (user) {
            localStorage.setItem("donatesphere_user", JSON.stringify(user));
        } else {
            localStorage.removeItem("donatesphere_user");
        }
    }, [user]);

    // Handle Google credential response
    const handleGoogleCredential = useCallback(async (response: google.accounts.id.CredentialResponse) => {
        const decoded = decodeJwt(response.credential);
        if (decoded) {
            const googleData = {
                name: decoded.name,
                email: decoded.email,
                picture: decoded.picture,
                provider: "google" as const,
                id: decoded.sub
            };

            try {
                // Sync with MongoDB backend
                const res = await fetch(`${API_URL}/auth/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(googleData)
                });

                // If user exists, signup endpoint returns 400, but we can still log in
                // In a more robust app, we'd handle this better
                const userData = await res.json();

                const googleUser: User = {
                    id: decoded.sub,
                    name: decoded.name,
                    email: decoded.email,
                    picture: decoded.picture,
                    provider: "google",
                };
                setUser(googleUser);
            } catch (err) {
                console.error("Failed to sync Google user with backend", err);
                // Fallback to local session even if backend sync fails (standard for simple apps)
                const googleUser: User = {
                    id: decoded.sub,
                    name: decoded.name,
                    email: decoded.email,
                    picture: decoded.picture,
                    provider: "google",
                };
                setUser(googleUser);
            }
        }
    }, []);

    // Initialize Google Identity Services
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => {
            if (window.google?.accounts?.id) {
                window.google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: handleGoogleCredential,
                    auto_select: false,
                });
            }
        };
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, [handleGoogleCredential]);

    const signInWithGoogle = useCallback(() => {
        if (window.google?.accounts?.id) {
            window.google.accounts.id.prompt((notification) => {
                if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                    const btn = document.getElementById("google-signin-btn");
                    if (btn) {
                        window.google.accounts.id.renderButton(btn, {
                            theme: "outline",
                            size: "large",
                            width: 350,
                            text: "continue_with",
                        });
                        btn.querySelector<HTMLElement>("div[role='button']")?.click();
                    }
                }
            });
        }
    }, []);

    const signInWithEmail = useCallback(async (email: string, password: string) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Invalid email or password");
        }

        const userData = await res.json();
        setUser({
            id: userData._id,
            name: userData.name,
            email: userData.email,
            picture: userData.picture,
            provider: "email",
        });
    }, []);

    const signUpWithEmail = useCallback(async (name: string, email: string, password: string) => {
        const res = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, provider: "email" })
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Sign up failed");
        }

        const userData = await res.json();
        setUser({
            id: userData._id,
            name: userData.name,
            email: userData.email,
            picture: userData.picture,
            provider: "email",
        });
    }, []);

    const signOut = useCallback(() => {
        setUser(null);
        if (window.google?.accounts?.id) {
            window.google.accounts.id.disableAutoSelect();
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{ user, isLoading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
};
