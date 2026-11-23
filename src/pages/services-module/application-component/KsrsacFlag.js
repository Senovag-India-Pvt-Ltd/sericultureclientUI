import { useEffect, useState } from "react";
import api from "../../../services/auth/api";

// IN-010: case-level KSRSAC K-GIS flag (MATCH / MISMATCH / NOT_CHECKED) of the pre-inspection photos, for lists.
// Backend: dbt POST /v1/pre-inspection-photo/ksrsac-flags (ids = sc_application_form_service id = row.applicationDocumentId).

const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;

/** Map of application id -> { ksrsacStatus, mismatchCount, photoCount } for the inspection-stage rows. */
export function useKsrsacFlags(rows, idKey = "applicationDocumentId") {
  const [flags, setFlags] = useState({});
  const ids = (Array.isArray(rows) ? rows : [])
    .filter((r) => r?.inspection)
    .map((r) => Number(r?.[idKey]))
    .filter((id) => Number.isFinite(id) && id > 0);
  const key = Array.from(new Set(ids)).sort((a, b) => a - b).join(",");

  useEffect(() => {
    if (!key) {
      setFlags({});
      return undefined;
    }
    let cancelled = false;
    api.post(baseURLDBT + "pre-inspection-photo/ksrsac-flags", key.split(",").map(Number))
      .then((res) => {
        if (cancelled) return;
        const map = {};
        (res.data?.content || []).forEach((f) => { map[f.applicationId] = f; });
        setFlags(map);
      })
      .catch(() => { if (!cancelled) setFlags({}); });
    return () => { cancelled = true; };
  }, [key]);

  return flags;
}
