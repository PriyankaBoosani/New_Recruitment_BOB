// src/services/apiClients.js
import axios from "axios";
import { store } from "../../store";
import { clearUser } from "../../app/providers/userSlice";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig, loginRequest } from "../../modules/auth/services/msalConfig";
import { msalInstance } from "../..";

const REFRESH_PATH = "/recruiter-auth/recruiter-refresh-token";

/* ---------------------------
   Constants & ENV
--------------------------- */
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_BASE_URLS = process.env.REACT_APP_API_BASE_URLS;
const NODE_API_URL = process.env.REACT_APP_NODE_API_URL;
const CANDIDATE_API_URL = process.env.REACT_APP_CANDIDATE_API_URL;
const MASTER_DROPDOWN_URL = process.env.REACT_APP_MASTER_DROPDOWN_URL;

/* ---------------------------
   Refresh Token Control
--------------------------- */
let isRefreshing = false;
let refreshSubscribers = [];
 
const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};
 
const onRefreshed = () => {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
};
 
/* ---------------------------
   Refresh API (no interceptors)
--------------------------- */
async function callRefreshEndpoint() {
  const url = `${NODE_API_URL}${REFRESH_PATH}`;
  return axios.post(url, null, { withCredentials: true });
}

async function getToken() {
  try {
    let account = msalInstance.getActiveAccount();

    if (!account) {
      const accounts = msalInstance.getAllAccounts();
      account = accounts[0];

      if (account) {
        msalInstance.setActiveAccount(account);
      }
    }

    if (!account) {
      throw new Error("No account available");
    }

    const response = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account,
    });

    return response.accessToken;

  } catch (error) {
    console.error("Token acquisition failed", error);

    // 🔥 fallback to interactive login
    msalInstance.loginRedirect(loginRequest);

    return null;
  }
}

/* ---------------------------
   Auth Header Helper
--------------------------- */
const addAuthHeader = async (config) => {
  const token = await getToken();

  if (!token) {
    // 🚨 No token → force login
    redirectToLogin();
    return Promise.reject("No token available");
  }

  config.headers.Authorization = `Bearer ${token}`;
  config.headers["X-Client"] = "AzureAD";

  return config;
};

const redirectToLogin = () => {
  store.dispatch(clearUser());
  msalInstance.logoutRedirect();
};

/* ---------------------------
   Axios Instances
--------------------------- */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" }
});

const formDataApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "multipart/form-data" }
});

const apis = axios.create({
  baseURL: API_BASE_URLS,
  headers: { "Content-Type": "application/json" }
});

const candidateApi = axios.create({
  baseURL: CANDIDATE_API_URL,
  headers: { "Content-Type": "application/json" }
});

const nodeApi = axios.create({
  baseURL: NODE_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true
});

const masterDropdownApi = axios.create({
  baseURL: MASTER_DROPDOWN_URL,
  headers: { "Content-Type": "application/json" }
});

/* ---------------------------
  Shared Interceptor Logic
--------------------------- */
const attachInterceptors = (instance) => {
  instance.interceptors.request.use(async (config) => {
    return await addAuthHeader(config);
  });

  instance.interceptors.response.use(
    (response) => {
      if (response.config?.responseType === "blob") return response;
      return response.data;
    },
    async (error) => {
      const originalRequest = error.config || {};
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url?.includes(REFRESH_PATH)
      ) {
        originalRequest._retry = true;

        if (!isRefreshing) {
          isRefreshing = true;
          try {
            await callRefreshEndpoint();
            isRefreshing = false;
            onRefreshed();
          } catch (err) {
            isRefreshing = false;
            redirectToLogin();
            throw err;
          }
        }

        return new Promise((resolve) => {
          subscribeTokenRefresh(() => {
            resolve(instance(originalRequest));
          });
        });
      }

      if (error.response && error.response.status < 500) {
       // return Promise.resolve(error.response.data);
       return error.response.data;
      }

      throw error;
    }
  );
};

/* ---------------------------
   Attach Interceptors
--------------------------- */
attachInterceptors(api);
attachInterceptors(formDataApi);
attachInterceptors(apis);
attachInterceptors(candidateApi);
attachInterceptors(nodeApi);

masterDropdownApi.interceptors.request.use(addAuthHeader);
masterDropdownApi.interceptors.response.use(
  (res) => res.data,
  (err) => { throw err; }
);

/* ---------------------------
   Exports
--------------------------- */
export {
  api,
  formDataApi,
  apis,
  candidateApi,
  nodeApi,
  masterDropdownApi
};

export default {
  api,
  formDataApi,
  apis,
  candidateApi,
  nodeApi,
  masterDropdownApi
};
