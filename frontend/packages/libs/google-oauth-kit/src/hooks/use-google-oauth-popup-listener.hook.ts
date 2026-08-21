import { getSessionStorage, removeSessionStorage } from "@forever/storage-kit";
import { useEffect, useState } from "react";

interface IGoogleOauthData {
    type: string;
    code?: string;
    error?: string;
    state?: string;
}

const useGoogleOauthPopupListener = (actionAfterGetCode: (code: string, codeVerifier: string) => Promise<void> = async () => { }) => {
    const [loading, setLoading] = useState(false);
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleMessage = async (event: MessageEvent<IGoogleOauthData>) => {
            if (event.origin !== window.location.origin) return;

            if (event.data?.type === "GOOGLE_AUTH_CODE" && event.data.code) {
                setPopupOpen(false);
                setLoading(true);
                setError(null);

                try {
                    const expectedState = getSessionStorage<string>("google-oauth-state", "");

                    if (expectedState !== event.data.state) {
                        throw new Error("Invalid state value");
                    }

                    const codeVerifier = getSessionStorage<string>("google-oauth-code-verifier", "");

                    if (!codeVerifier) {
                        throw new Error("Code verifier must be generate.");
                    }

                    await actionAfterGetCode(event.data.code, codeVerifier);
                } catch (err: any) {
                    setError(err?.message || "An error occurred during the process.");
                } finally {
                    setLoading(false);
                    removeSessionStorage("google-oauth-state");
                    removeSessionStorage("google-oauth-code-verifier");
                }
            } else if (event.data?.type === "GOOGLE_AUTH_ERROR") {
                setPopupOpen(false);
                setLoading(false);
                setError(event.data.error || "Google sign-in was cancelled.");
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [actionAfterGetCode]);

    return { loading, isPopupOpen, setPopupOpen, error, setError };
};

export default useGoogleOauthPopupListener;
