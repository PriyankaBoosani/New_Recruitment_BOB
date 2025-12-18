// src/services/apiClients.js
import axios from 'axios';
import { store } from "../../store";
import { clearUser } from "../../app/providers/userSlice";

const REFRESH_PATH = "/recruiter-auth/recruiter-refresh-token";

// helper that calls refresh bypassing our axios instances/interceptors
async function callRefreshEndpoint() {
  // Use axios directly so no interceptors run
  const url = `${NODE_API_URL}${REFRESH_PATH}`;
  return axios.post(url, null, { withCredentials: true });
}


// --- JWT Decoder helper ---
function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1]; // payload part
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    return payload;
  } catch (err) {
    console.error("Failed to decode token", err);
    return null;
  }
}

function getToken() {
  const state = store.getState();
  const token = state.user?.authUser?.access_token || null;

  if (token) {
    const decoded = decodeJWT(token);
    if (decoded?.exp) {
      const expiry = new Date(decoded.exp * 1000);
      const timeLeft = expiry.getTime() - Date.now();

      if (timeLeft < 3 * 60 * 1000) {
        console.warn("⚠️ Token expiring soon! Refresh flow will trigger soon.");
      }
    }
  }

  return token;
}

// Environment base URLs
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_BASE_URLS = process.env.REACT_APP_API_BASE_URLS;
const NODE_API_URL = process.env.REACT_APP_NODE_API_URL;
const CANDIDATE_API_URL = process.env.REACT_APP_CANDIDATE_API_URL;
const PARSE_RESUME_URL = process.env.REACT_APP_PARSE_RESUME_URL || '';

// Create axios instances
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

const apis = axios.create({
  baseURL: API_BASE_URLS,
  headers: { 'Content-Type': 'application/json' },
});

const candidateApi = axios.create({
  baseURL: CANDIDATE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

const nodeApi = axios.create({
  baseURL: NODE_API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

const templateApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'multipart/form-data' },
  withCredentials: true,
});

const parseResumeApi = axios.create({
  baseURL: PARSE_RESUME_URL,
  headers: { 'Content-Type': 'multipart/form-data' },
});

// Shared helper to add Authorization header
const addAuthHeader = (config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers["X-Client"] = "recruiter";
  return config;
};

/* ---------------------------
   Interceptors - api (primary)
   --------------------------- */
api.interceptors.request.use(
  (config) => addAuthHeader(config),
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config || {};

    // If this request was the refresh endpoint, don't try to refresh again
    if (originalRequest && originalRequest.url && originalRequest.url.includes(REFRESH_PATH)) {
      // refresh endpoint itself failed -> bail out
      store.dispatch(clearUser?.() ?? {});
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.warn("⚠️ Java API session expired (api). Trying refresh...");
      originalRequest._retry = true;
      try {
        // call refresh bypassing axios instances (no interceptors) to avoid recursion
        await callRefreshEndpoint();
        // refresh succeeded — retry original request
        return api(originalRequest);
      } catch (err) {
        console.error("⛔ Refresh failed (api). Redirecting to login", err);
        store.dispatch(clearUser?.() ?? {});
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    if (error.response && error.response.status >= 400 && error.response.status < 500) {
      return error.response.data;
    }

    return Promise.reject(error);
  }
);

/* ---------------------------
   Interceptors - apis (master)
   --------------------------- */
apis.interceptors.request.use(
  (config) => addAuthHeader(config),
  (error) => Promise.reject(error)
);

apis.interceptors.response.use(
  (response) => {
  if (response.config?.responseType === 'blob') {
    return response;   // keep full response
  }
  return response.data;
},
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config || {};

    // If this request was the refresh endpoint, don't try to refresh again
    if (originalRequest && originalRequest.url && originalRequest.url.includes(REFRESH_PATH)) {
      // refresh endpoint itself failed -> bail out
      store.dispatch(clearUser?.() ?? {});
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.warn("⚠️ Java API session expired (api). Trying refresh...");
      originalRequest._retry = true;
      try {
        // call refresh bypassing axios instances (no interceptors) to avoid recursion
        await callRefreshEndpoint();
        // refresh succeeded — retry original request
        return apis(originalRequest);
      } catch (err) {
        console.error("⛔ Refresh failed (api). Redirecting to login", err);
        store.dispatch(clearUser?.() ?? {});
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    if (error.response && error.response.status >= 400 && error.response.status < 500) {
      return error.response.data;
    }

    return Promise.reject(error);
  }
);

/* ---------------------------
   Interceptors - candidateApi
   --------------------------- */
candidateApi.interceptors.request.use(
  (config) => addAuthHeader(config),
  (error) => Promise.reject(error)
);


candidateApi.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config || {};

    // If this request was the refresh endpoint, don't try to refresh again
    if (originalRequest && originalRequest.url && originalRequest.url.includes(REFRESH_PATH)) {
      store.dispatch(clearUser?.() ?? {});
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // call refresh without triggering interceptors
        await callRefreshEndpoint();
        return candidateApi(originalRequest);
      } catch (err) {
        console.error("⛔ Node refresh failed. Redirecting to login");
        store.dispatch(clearUser?.() ?? {});
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

/* ---------------------------
   Interceptors - nodeApi
   --------------------------- */
nodeApi.interceptors.request.use(
  (config) => addAuthHeader(config),
  (error) => Promise.reject(error)
);

nodeApi.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config || {};

    // If this request was the refresh endpoint, don't try to refresh again
    if (originalRequest && originalRequest.url && originalRequest.url.includes(REFRESH_PATH)) {
      store.dispatch(clearUser?.() ?? {});
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // call refresh without triggering interceptors
        await callRefreshEndpoint();
        return nodeApi(originalRequest);
      } catch (err) {
        console.error("⛔ Node refresh failed. Redirecting to login");
        store.dispatch(clearUser?.() ?? {});
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

/* ---------------------------
   Interceptors - parseResumeApi
   --------------------------- */
parseResumeApi.interceptors.request.use(
  (config) => addAuthHeader(config),
  (error) => Promise.reject(error)
);

parseResumeApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(clearUser?.() ?? {});
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/* ---------------------------
   Interceptors - templateApi
   --------------------------- */
templateApi.interceptors.request.use(
  (config) => addAuthHeader(config),
  (error) => Promise.reject(error)
);

templateApi.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config || {};
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await nodeApi.post("/recruiter-auth/recruiter-refresh-token", null, { withCredentials: true });
        return templateApi(originalRequest);
      } catch (err) {
        store.dispatch(clearUser?.() ?? {});
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

/* ---------------------------
   Exports
   --------------------------- */
export { api, apis, candidateApi, nodeApi, templateApi, parseResumeApi };
export default { api, apis, candidateApi, nodeApi, templateApi, parseResumeApi };
