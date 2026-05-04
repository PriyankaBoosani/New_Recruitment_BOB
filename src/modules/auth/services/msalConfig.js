// export const msalConfig = {
//   auth: {
//     clientId: "5ef1ea14-0b56-4c9e-ac14-896dd0a92c1c", // Replace with your Azure AD app's client ID
//     authority: "https://login.microsoftonline.com/be73ba9d-1d9a-4698-b9ae-6d5eab36e08e", // Replace with your Azure AD tenant ID
//     redirectUri: "http://localhost:3000/auth/callback", // Replace with your app's redirect URI
//   },
// };

// export const loginRequest = {
//   // scopes: ["openid", "profile", "email"]
//   scopes: ["api://5ef1ea14-0b56-4c9e-ac14-896dd0a92c1c/access_as_user"]
// };

export const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_MSAL_CLIENT_ID,
    authority: process.env.REACT_APP_MSAL_AUTHORITY,
    redirectUri: process.env.REACT_APP_MSAL_REDIRECT_URI,
  },
};

export const loginRequest = {
  scopes: [process.env.REACT_APP_MSAL_SCOPE],
};

export const tokenRequest = (account) => ({
  scopes: [process.env.REACT_APP_MSAL_SCOPE],
  account,
});