// Type declarations for Google Identity Services (GIS)
declare namespace google.accounts.id {
    interface CredentialResponse {
        credential: string;
        select_by: string;
    }

    interface PromptNotification {
        isNotDisplayed: () => boolean;
        isSkippedMoment: () => boolean;
        isDismissedMoment: () => boolean;
        getNotDisplayedReason: () => string;
        getSkippedReason: () => string;
        getDismissedReason: () => string;
    }

    interface IdConfiguration {
        client_id: string;
        callback: (response: CredentialResponse) => void;
        auto_select?: boolean;
        cancel_on_tap_outside?: boolean;
        context?: string;
    }

    interface ButtonConfig {
        type?: "standard" | "icon";
        theme?: "outline" | "filled_blue" | "filled_black";
        size?: "large" | "medium" | "small";
        text?: "signin_with" | "signup_with" | "continue_with" | "signin";
        shape?: "rectangular" | "pill" | "circle" | "square";
        width?: number;
        locale?: string;
    }

    function initialize(config: IdConfiguration): void;
    function prompt(callback?: (notification: PromptNotification) => void): void;
    function renderButton(element: HTMLElement, config: ButtonConfig): void;
    function disableAutoSelect(): void;
    function revoke(hint: string, callback?: (response: { successful: boolean; error?: string }) => void): void;
}

interface Window {
    google: {
        accounts: {
            id: typeof google.accounts.id;
        };
    };
}
