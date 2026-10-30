import { useEffect, useState } from "react";
import SevaSindhuSourceCard from "./SevaSindhuSourceCard";
import api from "../../services/auth/api";

// Read-only "Application Source: Seva Sindhu" banner for the existing application pages. Renders nothing for an
// application that did not come from Seva Sindhu. Pass serviceFormId (sc_application_form_service id) or
// applicationFormId (sc_application_form id).
const BASE = (process.env.REACT_APP_API_BASE_URL_DBT || "") + "sevasindhu-application/";

function SevaSindhuSourceBanner({ serviceFormId, applicationFormId }) {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    setInfo(null);
    const path = serviceFormId ? `by-service-form/${serviceFormId}` : applicationFormId ? `by-application-form/${applicationFormId}` : null;
    if (!path) return;
    api.get(BASE + path)
      .then((res) => setInfo(res.data && res.data.id ? res.data : null))
      .catch(() => setInfo(null));
  }, [serviceFormId, applicationFormId]);

  if (!info) return null;

  const view = async (doc) => {
    try {
      const res = await api.get(BASE + `${info.id}/documents/${doc.id}`, { responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: doc.contentType }));
      window.open(url, "_blank", "noopener");
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (e) {
      // Later approvers see the same files in the application's own document list.
      window.alert("This document can be opened from the application's document list.");
    }
  };

  return (
    <SevaSindhuSourceCard
      info={info}
      state="view"
      message="This application came from Seva Sindhu. The citizen's documents are listed below and in the application's document list."
      onViewDocument={view}
    />
  );
}

export default SevaSindhuSourceBanner;
