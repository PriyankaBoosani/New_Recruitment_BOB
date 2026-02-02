// src/services/apiClients.js
import axios from "axios";
import { store } from "../../store";
import { clearUser } from "../../app/providers/userSlice";

/* ---------------------------
   Constants & ENV
--------------------------- */
const REFRESH_PATH = "/recruiter-auth/recruiter-refresh-token";

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

/* ---------------------------
   JWT Helpers
--------------------------- */
function decodeJWT(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(window.atob(base64));
  } catch {
    return null;
  }
}

function getToken() {
  const token = store.getState()?.user?.authUser?.access_token;
  if (!token) return null;

  const decoded = decodeJWT(token);
  if (decoded?.exp) {
    const timeLeft = decoded.exp * 1000 - Date.now();
    if (timeLeft < 15 * 60 * 1000) {
      console.warn("⚠️ Token expiring soon");
    }
  }

  return token;
}

/* ---------------------------
   Auth Header Helper
--------------------------- */
const addAuthHeader = (config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers["X-Client"] = "recruiter";
  return config;
};

const redirectToLogin = () => {
  store.dispatch(clearUser());
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

/* ---------------------------
   Axios Instances
--------------------------- */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" }
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
  instance.interceptors.request.use(addAuthHeader);

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
            return Promise.reject(err);
          }
        }

        return new Promise((resolve) => {
          subscribeTokenRefresh(() => {
            resolve(instance(originalRequest));
          });
        });
      }

      // Pass 4xx to caller (business validation)
      if (error.response && error.response.status < 500) {
        return Promise.resolve(error.response.data);
      }

      return Promise.reject(error);
    }
  );
};

/* ---------------------------
   Attach Interceptors
--------------------------- */
attachInterceptors(api);
attachInterceptors(apis);
attachInterceptors(candidateApi);
attachInterceptors(nodeApi);

masterDropdownApi.interceptors.request.use(addAuthHeader);
masterDropdownApi.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err)
);

/* ---------------------------
   Exports
--------------------------- */
export {
  api,
  apis,
  candidateApi,
  nodeApi,
  masterDropdownApi
};

export default {
  api,
  apis,
  candidateApi,
  nodeApi,
  masterDropdownApi
};
