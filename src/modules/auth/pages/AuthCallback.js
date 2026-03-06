import { useEffect } from "react";
import { useMsal } from "@azure/msal-react";
 
export default function AuthCallback() {
  const { instance } = useMsal();
 
  useEffect(() => {
 
    instance.handleRedirectPromise().then(async (response) => {
 
      const account = instance.getAllAccounts()[0];
 
      if (account) {
 
        const tokenResponse = await instance.acquireTokenSilent({
          scopes: ["openid", "profile", "email"],
          account: account
        });
 
        console.log("Access Token:", tokenResponse.accessToken);
      }
 
    });
 
  }, [instance]);
  console.log("Processing login........ AUTH CALLBACK CALLED");
 
  return <div>Processing login...</div>;
}