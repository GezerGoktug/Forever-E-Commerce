import { useState } from "react";
import { Helmet } from "react-helmet";
import Login from "@/components/Auth/Login/Login";
import Register from "@/components/Auth/Register/Register";
import GoogleOauthPopupProvider from "@/providers/GoogleOauthPopupProvider";

const AuthWrapper = () => {
  const [authForm, setAuthForm] = useState<"login" | "register">("login");

  const showLoginForm = () => setAuthForm("login");
  const showRegisterForm = () => setAuthForm("register");

  return (
    <div>
      <Helmet>
        <title>{authForm === "login" ? "Login" : "Register"} - Forever</title>
      </Helmet>
      <GoogleOauthPopupProvider>
        {authForm === "login" ? (
          <Login changeAuthForm={showRegisterForm} />
        ) : (
          <Register changeAuthForm={showLoginForm} />
        )}
      </GoogleOauthPopupProvider>
    </div>
  );
};

export default AuthWrapper;
