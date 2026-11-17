import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../../components";
import "./farmer-count-summary.css";

// Farmer counts come from farmer-registration /dashboard/farmer-counts: one light pass over the
// farmer table (the full home-stats query is too heavy to run on every list page open).
// "Registered farmers" = all active farmers; the three groups always add up to it and each group is
// exactly what its own list page shows. Cached for a few minutes so switching lists doesn't re-query.
const REGISTRATION_BASE = process.env.REACT_APP_API_BASE_URL_REGISTRATION || "/farmer-registration/v1/";

const CACHE_KEY = "fcs-farmer-counts";
const CACHE_MS = 5 * 60 * 1000;
const readCache = () => {
  try {
    const c = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "null");
    return c && Date.now() - c.at < CACHE_MS ? c.data : null;
  } catch {
    return null;
  }
};
const writeCache = (data) => {
  try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data })); } catch { /* storage unavailable */ }
};

const fmt = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? new Intl.NumberFormat("en-IN").format(n) : "—";
};

const GROUPS = [
  { key: "with", field: "farmers_with_fruits", label: "With FRUITS ID", icon: "check-circle", to: "/seriui/stake-holder-list" },
  { key: "without", field: "farmers_without_fruits", label: "Without FRUITS ID", icon: "alert-circle", to: "/seriui/farmer-without-fruits-list" },
  { key: "other", field: "farmers_other_state", label: "Other State", icon: "map-pin", to: "/seriui/other-state-farmer-list" },
];

/** @param {{ active: "with" | "without" | "other" }} props  the list this page shows */
function FarmerCountSummary({ active }) {
  const [stats, setStats] = useState(readCache);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (stats) return undefined;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000); // never leave the strip spinning
    fetch(`${REGISTRATION_BASE}dashboard/farmer-counts`, { signal: controller.signal, cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((d) => {
        if (!d || d.error) { setFailed(true); return; }
        writeCache(d);
        setStats(d);
      })
      .catch(() => setFailed(true))
      .finally(() => clearTimeout(timer));
    return () => { clearTimeout(timer); controller.abort(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (failed) return null;
  const loading = !stats;

  return (
    <div className="fcs" aria-busy={loading}>
      <div className="fcs-total">
        <span className="fcs-total-ic" aria-hidden="true"><Icon name="users" /></span>
        <div>
          <span className="fcs-label">Total registered farmers</span>
          <strong className="fcs-total-num">{loading ? <span className="fcs-skel" /> : fmt(stats.farmers)}</strong>
        </div>
      </div>
      <span className="fcs-eq" aria-hidden="true">=</span>
      <div className="fcs-groups">
        {GROUPS.map((g, i) => (
          <span key={g.key} className="fcs-group-wrap">
            {i > 0 && <span className="fcs-plus" aria-hidden="true">+</span>}
            <Link
              to={g.to}
              className={`fcs-group${active === g.key ? " is-active" : ""}`}
              aria-current={active === g.key ? "page" : undefined}
              title={active === g.key ? "Shown in this list" : `Open the ${g.label} list`}
            >
              <span className="fcs-group-ic" aria-hidden="true"><Icon name={g.icon} /></span>
              <span>
                <span className="fcs-label">{g.label}</span>
                <strong>{loading ? <span className="fcs-skel sm" /> : fmt(stats[g.field])}</strong>
              </span>
            </Link>
          </span>
        ))}
      </div>
    </div>
  );
}

export default FarmerCountSummary;
