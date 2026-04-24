const DEFAULT_BASE_PATH = "/seriui";

const normalizeBasePath = (basePath) => {
  const cleaned = (basePath || DEFAULT_BASE_PATH).trim();
  const withLeadingSlash = cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
  return withLeadingSlash.replace(/\/+$/, "") || DEFAULT_BASE_PATH;
};

const normalizeSuffix = (suffix = "") => {
  if (!suffix || suffix === "/") return "";
  return suffix.startsWith("/") ? suffix : `/${suffix}`;
};

export const APP_BASE_PATH = normalizeBasePath(process.env.PUBLIC_URL || DEFAULT_BASE_PATH);
export const APP_BASE_SEGMENT = APP_BASE_PATH.slice(1);
export const appPath = (suffix = "") => `${APP_BASE_PATH}${normalizeSuffix(suffix)}`;

export const APP_ROUTES = {
  root: appPath("/"),
  login: appPath("/login"),
  home: appPath("/home"),
  homepage: appPath("/homepage"),
  applicationStatus: appPath("/application-status"),
  downloadSanctionOrder: appPath("/download-sanction-order"),
  displayAllLotPrefix: appPath("/display-all-lot"),
  mobileAppDownload: appPath("/sericulture.apk"),
};
