import { useLocation } from "react-router-dom";
import  DashboardPage  from "../pages/DashboardPage.js";
import { ErrorPage } from "../pages/ErrorPage.js";
import { useEffect, useState } from "react";

export function AuthCallback(){
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const state = queryParams.get('state');
    const code = queryParams.get('code');
    const [callbackResp, setCallbackResp] = useState<Response | null>(null);

    useEffect( () => {
        const fetchJwt = async () => {
            const callbackResp = await fetch(`/auth/callback?state=${state}&code=${code}`,{
                method: "GET",
                credentials: "include",
            });
            setCallbackResp(callbackResp);
        }
        fetchJwt();
    },[]);
    

    if(callbackResp === null){
        return <div>Loading...</div>;
    }

    if(!callbackResp.ok){
        //TODO: Should Navigate to Error Page
        return <ErrorPage errorCode={callbackResp.status} errorDesc={callbackResp.statusText}/>
    }

    //TODO: Should Navigate to Dashboard or requested page (TBD)
    return <DashboardPage />
}
