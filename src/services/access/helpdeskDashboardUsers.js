// Allow-list of usernames permitted to see the Helpdesk Dashboard (menu item + page).
//
// This is a FRONTEND gate on purpose: it needs no backend endpoint, so it works with a
// UI-only deploy and can never fail due to a lagging/undeployed backend instance.
//
// To change who can access the Helpdesk Dashboard: edit this list and redeploy the UI.
export const HELPDESK_DASHBOARD_USERS = [
  "ROTEST",
  "SEOTEST",
  "ADTEST",
  "DDTEST",
  "JDTEST",
  "VENDORTEST",
  "MARKETTEST",
  "SEEDTEST1",
  "SEEDTEST2",
  "SEEDTEST3",
  "SEEDTEST4",
  "SEEDTEST5",
  "SEEDTEST6",
  "SEEDTEST7",
  "SIPLTEST",
  "SIPLTEST2",
  "SIPLTEST3",
  "SIPLTEST4",
  "SIPLTEST5",
  "SIPLTEST6",
];

/**
 * True when the currently logged-in user (localStorage "username", the same value shown
 * as "Welcome : <username>") is in the allow-list. Case-insensitive.
 */
export function isHelpdeskDashboardUser() {
  const username = (localStorage.getItem("username") || "").trim().toUpperCase();
  if (!username) return false;
  return HELPDESK_DASHBOARD_USERS.includes(username);
}
