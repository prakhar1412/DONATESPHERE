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
    const handleGoogleCredential = useCallback((response: google.accounts.id.CredentialResponse) => {
        const decoded = decodeJwt(response.credential);
        if (decoded) {
            const googleUser: User = {
                id: decoded.sub,
                name: decoded.name,
                email: decoded.email,
                picture: decoded.picture,
                provider: "google",
            };
            setUser(googleUser);
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
                // If One Tap is suppressed or user closes it, fall back to button-click popup
                if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                    // Use the popup flow via the Google button
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
        // Simulated email sign-in — replace with real API
        if (!email || !password) throw new Error("Email and password are required");
        if (password.length < 6) throw new Error("Password must be at least 6 characters");

        // Mock: check if user exists in localStorage
        const usersRaw = localStorage.getItem("donatesphere_users");
        const users: Array<{ name: string; email: string; password: string }> = usersRaw ? JSON.parse(usersRaw) : [];
        const found = users.find((u) => u.email === email && u.password === password);
        if (!found) throw new Error("Invalid email or password");

        setUser({
            id: btoa(email),
            name: found.name,
            email: found.email,
            provider: "email",
        });
    }, []);

    const signUpWithEmail = useCallback(async (name: string, email: string, password: string) => {
        // Simulated email sign-up — replace with real API
        if (!name || !email || !password) throw new Error("All fields are required");
        if (password.length < 6) throw new Error("Password must be at least 6 characters");

        const usersRaw = localStorage.getItem("donatesphere_users");
        const users: Array<{ name: string; email: string; password: string }> = usersRaw ? JSON.parse(usersRaw) : [];
        if (users.find((u) => u.email === email)) throw new Error("An account with this email already exists");

        users.push({ name, email, password });
        localStorage.setItem("donatesphere_users", JSON.stringify(users));

        setUser({
            id: btoa(email),
            name,
            email,
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
