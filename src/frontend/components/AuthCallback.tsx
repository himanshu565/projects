import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function AuthCallback(){
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const state = queryParams.get('state');
    const code = queryParams.get('code');
    const callbackResp = null;
    const navigate = useNavigate();

    useEffect( () => {
        const fetchJwt = async () => {
            const callbackResp = await fetch(`/auth/callback?state=${state}&code=${code}`,{
                method: "GET",
                credentials: "include",
            });
            if(callbackResp.ok){
                const jsonResp = await callbackResp.json();
                localStorage.setItem("UserJwt", jsonResp.jwt);
                navigate("/dashboard");
            }
            else{
                navigate("/error");
            }
        }
        fetchJwt();
    },[]);
    

    if(callbackResp === null){
        return <div>Loading...</div>;
    }

    return null;
}
