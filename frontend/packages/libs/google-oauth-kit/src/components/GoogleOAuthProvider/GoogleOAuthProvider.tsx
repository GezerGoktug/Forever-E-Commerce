import { buildQuery } from '@forever/query-kit';
import { createContext, useContext, useEffect, type ReactNode } from 'react'
import useGoogleOauthPopupListener from '../../hooks/use-google-oauth-popup-listener.hook';
import generateUUIDv4 from '../../utils/uuid';
import { generatePkcePair } from "../../utils/pkce"
import { setSessionStorage } from '@forever/storage-kit';

export interface GoogleOauthCredentials {
    client_id: string;
    redirect_uri: string;
    response_type: "token" | "code";
    scope: string;
    access_type?: "online" | "offline";
    prompt?: "none" | "consent" | "select_account";
}

interface GoogleAuthContextType {
    loading: boolean;
    isPopupOpen: boolean;
    error: string | null;
    loginWithGoogle: (customCredentials?: GoogleOauthCredentials) => Promise<void>;
}

const GoogleAuthContext = createContext<GoogleAuthContextType | undefined>(
    undefined
);

export const useGoogleOauth = () => {
    const context = useContext(GoogleAuthContext);
    if (!context) {
        throw new Error(
            "useGoogleOauth must be used within a GoogleOAuthPopupProvider."
        );
    }
    return context;
};

export const GoogleOAuthPopupProvider = ({
    children,
    onSuccess,
    onError,
    credentials
}: {
    children: ReactNode,
    onSuccess: (code: string, codeVerifier: string) => Promise<void>,
    onError?: (error: string) => void,
    credentials?: GoogleOauthCredentials
}) => {
    const { loading, isPopupOpen, setPopupOpen, error, setError } = useGoogleOauthPopupListener(onSuccess);
    
    useEffect(() => {
        if (onError && error && error.trim().length > 0)
            onError(error);
    }, [error, onError]);

    const loginWithGoogle = async (customCredentials?: GoogleOauthCredentials) => {
        if (isPopupOpen || loading) {
            return;
        }
        setError(null);
        const redirectUri = `${window.location.origin}/@forever-static/templates/google-oauth-callback/index.html`;

        const googleOauthOrigin = "https://accounts.google.com/o/oauth2/v2/auth";

        const state = generateUUIDv4();

        setSessionStorage("google-oauth-state", state, 1000 * 60 * 5);

        const { codeVerifier, codeChallenge } = await generatePkcePair();

        setSessionStorage("google-oauth-code-verifier", codeVerifier);

        const url = `${googleOauthOrigin}?${buildQuery({
            // @ts-ignore
            client_id: import.meta.env.VITE_REACT_GOOGLE_CLIENT_ID,
            // @ts-ignore
            redirect_uri: redirectUri,
            // @ts-ignore
            response_type: "code",
            // @ts-ignore
            scope: "openid email profile",
            prompt: "select_account",
            state,
            code_challenge: codeChallenge,
            code_challenge_method: "S256",
            ...(customCredentials || credentials)
        })}`;

        const width = 500;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const popup = window.open(
            url,
            'Google OAuth',
            `width=${width},height=${height},left=${left},top=${top},popup=yes`
        );

        if (popup) {
            setPopupOpen(true);
            const timer = setInterval(() => {
                if (popup.closed) {
                    clearInterval(timer);
                    setPopupOpen(false);
                }
            }, 500);
        } else {
            setError("Pop-up blocked. Please check your browser permissions.");
        }
    };
    return (
        <GoogleAuthContext.Provider
            value={{ loading, isPopupOpen, error, loginWithGoogle }}
        >
            {children}
        </GoogleAuthContext.Provider>
    );
}

export const GoogleOauthPopupActionButton = ({ children, credentials }: { children: ReactNode; credentials?: GoogleOauthCredentials }) => {
    const { loginWithGoogle } = useGoogleOauth();
    return (
        <div
            onClick={async () => await loginWithGoogle(credentials)}
            style={{ display: "contents", cursor: "pointer" }}
        >
            {children}
        </div>
    );
};
