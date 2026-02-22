import { useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface GoogleSignInButtonProps {
    text?: "signin_with" | "signup_with" | "continue_with" | "signin";
}

const GoogleSignInButton = ({ text = "continue_with" }: GoogleSignInButtonProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { user } = useAuth();

    useEffect(() => {
        // Don't render button if user is already signed in
        if (user) return;

        const renderBtn = () => {
            if (containerRef.current && window.google?.accounts?.id) {
                // Clear previous button
                containerRef.current.innerHTML = "";
                window.google.accounts.id.renderButton(containerRef.current, {
                    theme: "outline",
                    size: "large",
                    text,
                    shape: "rectangular",
                    width: 350,
                });
            }
        };

        // If google is already loaded, render immediately
        if (window.google?.accounts?.id) {
            renderBtn();
        } else {
            // Otherwise, wait for the script to load
            const interval = setInterval(() => {
                if (window.google?.accounts?.id) {
                    renderBtn();
                    clearInterval(interval);
                }
            }, 100);
            return () => clearInterval(interval);
        }
    }, [text, user]);

    if (user) return null;

    return (
        <div className="w-full flex justify-center">
            <div ref={containerRef} id="google-signin-btn" />
        </div>
    );
};

export default GoogleSignInButton;
