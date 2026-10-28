import axios from "axios";

// Seva Sindhu citizen flow: talks only to dbt /v1/dashboard/sevasindhu/** with the citizen session
// header. Never sends or touches the staff login token (localStorage jwtToken): a stale Bearer token
// makes the shared auth layer answer 403 even on public endpoints, and clearing jwtToken would log
// out staff tabs (see App.js storage listener).
export const SEVASINDHU_BASE = (process.env.REACT_APP_API_BASE_URL_DBT || "") + "dashboard/sevasindhu/";
const SESSION_KEY = "sevasindhuSession";

export const getSession = () => {
  try {
    return sessionStorage.getItem(SESSION_KEY);
  } catch (e) {
    return null;
  }
};

export const setSession = (token) => {
  try {
    if (token) sessionStorage.setItem(SESSION_KEY, token);
    else sessionStorage.removeItem(SESSION_KEY);
  } catch (e) {
    /* private mode: the session simply lasts for this page view */
  }
};

const withSession = (config) => {
  const token = getSession();
  if (token) config.headers["X-SevaSindhu-Session"] = token;
  return config;
};

const sevasindhuApi = axios.create({ baseURL: SEVASINDHU_BASE, timeout: 30000 });
sevasindhuApi.interceptors.request.use(withSession);

// Farmer check / self-registration live in farmer-registration (same citizen session).
// Longer timeout: a check for a new farmer calls the FRUITS service.
export const farmerApi = axios.create({
  baseURL: (process.env.REACT_APP_API_BASE_URL_REGISTRATION || "") + "dashboard/sevasindhu/farmer/",
  timeout: 60000,
});
farmerApi.interceptors.request.use(withSession);

/** Turns any failure into { code, message } with user-safe text. */
export const toError = (err) => {
  if (axios.isCancel(err)) return null;
  if (err.code === "ECONNABORTED" || err.code === "ETIMEDOUT") {
    return { code: "TIMEOUT", message: "The service did not respond in time. Please try again." };
  }
  if (!err.response) return { code: "NETWORK", message: "Could not connect. Please check your internet connection and try again." };
  const data = err.response.data || {};
  if (data.code && data.message) return { code: data.code, message: data.message };
  if (err.response.status === 429) return { code: "TOO_MANY_REQUESTS", message: "Too many requests. Please wait a minute and try again." };
  return { code: "SERVICE_UNAVAILABLE", message: "The service is temporarily unavailable. Please try again later." };
};

export default sevasindhuApi;
