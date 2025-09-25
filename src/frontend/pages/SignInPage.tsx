import React from "react";
import SignINPage from "../components/signIn.js";
export function SignInPage() {

    const googleSignIn = async () => {
        const loginRes = await fetch("/auth/login");
        const loginResJson = await loginRes.json();
        const authUrl: string = loginResJson.authUrl;
        if(!authUrl){
            window.alert("Something's wrong!");
        }
        else{
            window.location.href = authUrl;
        }
    }

    return (
        <div>
             <SignINPage />;
        </div>
    );
}
