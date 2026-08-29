import { useState } from "react";
import Login from "@/components/Auth/Login/Login";
import Register from "@/components/Auth/Register/Register";
import { Helmet } from "react-helmet";
import GoogleOauthPopupProvider from "@/providers/GoogleOauthPopupProvider";

const Auth = () => {
  const [form, setForm] = useState<boolean>(true);

  return (
    <div>
      <Helmet>
        <title>{form ? "Login" : "Register"} - Forever</title>
      </Helmet>
      <GoogleOauthPopupProvider>
        {form ? (
          <Login chanceForm={() => setForm(false)} />
        ) : (
          <Register chanceForm={() => setForm(true)} />
        )}
      </GoogleOauthPopupProvider>
    </div>
  );
};

export default Auth;
