import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import api from "../../../services/auth/api";

// IN-009: pre-inspection photos of a land subsidy case - the four boundary corners (NE, NW, SE, SW) and the centre
// of every survey parcel, each stamped with the GPS position and the compass direction the camera faced. Made for
// the inspector's phone browser. GPS and compass work only on https (or localhost).
// Backend: dbt /v1/pre-inspection-photo/* ; the case cannot leave pre-inspection until every parcel is complete.

const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const ROLE_LABEL = { NE: "North-East corner", NW: "North-West corner", SE: "South-East corner", SW: "South-West corner", CENTRE: "Centre" };
const GRID = ["NW", null, "NE", null, "CENTRE", null, "SW", null, "SE"];
const DIRECTIONS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
const MAX_EDGE = 1600;
const HEADING_FRESH_MS = 3000;

const swalClass = { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm", cancelButton: "sh-swal-cancel" };

// IN-010: KSRSAC K-GIS check of each photo's GPS against its survey parcel
const KSRSAC_LABEL = { MATCH: "K-GIS ✓", MISMATCH: "K-GIS mismatch", NOT_CHECKED: "K-GIS not checked", NO_REFERENCE: "K-GIS no reference" };

const styles = `
  .pip-head { padding:12px 18px; background:linear-gradient(90deg,#1e67a8 0%,#2b7ac0 60%,#3b8dd6 100%); border-radius:12px; color:#fff; margin-bottom:12px; }
  .pip-head h2 { color:#fff !important; font-size:1.25rem; margin:0; font-weight:700; }
  .pip-head .meta { font-size:.82rem; opacity:.92; margin-top:4px; display:flex; flex-wrap:wrap; gap:4px 14px; }
  .pip-bar { display:flex; flex-wrap:wrap; gap:8px; align-items:center; justify-content:space-between; background:#fff; border:1px solid #dbe6f3; border-radius:12px; padding:10px 14px; margin-bottom:12px; }
  .pip-pill { border-radius:999px; padding:4px 12px; font-size:.78rem; font-weight:700; display:inline-flex; align-items:center; gap:6px; }
  .pip-pill.ok { background:#e9f8ef; color:#18794e; } .pip-pill.bad { background:#fdecef; color:#c43257; } .pip-pill.info { background:#eef6ff; color:#1e67a8; } .pip-pill.warn { background:#fff4e5; color:#b26a00; }
  .pip-compass { display:inline-flex; align-items:center; gap:8px; font-size:.82rem; color:#4a5568; }
  .pip-needle { width:30px; height:30px; border-radius:50%; border:2px solid #1e67a8; position:relative; background:#f3f8fe; }
  .pip-needle::after { content:""; position:absolute; left:50%; top:3px; width:2px; height:12px; background:#c43257; transform-origin:50% 12px; transform:translateX(-50%) rotate(var(--rot,0deg)); }
  .pip-alert { border-radius:10px; padding:10px 12px; font-size:.84rem; margin-bottom:12px; display:flex; gap:8px; }
  .pip-alert.warn { background:#fff8ec; color:#8a5a00; border:1px solid #f5d9a8; } .pip-alert.bad { background:#fdf0f3; color:#8f1d3a; border:1px solid #f5c2cf; }
  .pip-parcel { background:#fff; border:1px solid #dbe6f3; border-radius:14px; margin-bottom:16px; overflow:hidden; }
  .pip-parcel-head { display:flex; justify-content:space-between; gap:8px; flex-wrap:wrap; align-items:center; padding:10px 14px; background:#f3f8fe; border-bottom:1px solid #dbe6f3; }
  .pip-parcel-head b { color:#1f2d3d; } .pip-parcel-head small { color:#6b7a8c; display:block; }
  .pip-grid { display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:8px; padding:12px; }
  .pip-gap { min-height:10px; }
  .pip-tile { border:2px dashed #c4d8ee; border-radius:12px; background:#f7fbff; min-height:150px; display:flex; flex-direction:column; overflow:hidden; }
  .pip-tile.done { border-style:solid; border-color:#9fd5b3; background:#fff; }
  .pip-tile .label { font-size:.72rem; font-weight:800; color:#1e67a8; padding:6px 8px 0; text-transform:uppercase; letter-spacing:.03em; }
  .pip-tile img { width:100%; height:92px; object-fit:cover; display:block; margin-top:4px; background:#e9eef5; }
  .pip-tile .info { font-size:.68rem; color:#4a5568; padding:4px 8px; line-height:1.35; word-break:break-word; }
  .pip-tile .actions { margin-top:auto; display:flex; gap:4px; padding:6px; }
  .pip-tile .actions .btn { flex:1; font-size:.72rem; padding:4px 6px; }
  .pip-take { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; border:none; background:transparent; color:#1e67a8; font-weight:700; font-size:.78rem; padding:10px; }
  .pip-take .icon { font-size:1.6rem; }
  .pip-warn { font-size:.78rem; color:#8a5a00; background:#fff8ec; margin:0 12px 12px; border-radius:8px; padding:6px 10px; }
  .pip-ks { font-size:.66rem; font-weight:700; margin:0 8px; border-radius:6px; padding:2px 6px; display:inline-flex; align-items:center; gap:4px; cursor:help; }
  .pip-ks.MATCH { background:#e9f8ef; color:#18794e; } .pip-ks.MISMATCH { background:#fdecef; color:#c43257; }
  .pip-ks.NOT_CHECKED, .pip-ks.NO_REFERENCE { background:#fff4e5; color:#b26a00; }
  .pip-ksmsg { font-size:.78rem; color:#8f1d3a; background:#fdf0f3; margin:0 12px 8px; border-radius:8px; padding:6px 10px; }
  .pip-modal-img { width:100%; max-height:55vh; object-fit:contain; border-radius:10px; background:#111; }
  .pip-kv { display:flex; justify-content:space-between; gap:10px; font-size:.86rem; padding:5px 0; border-bottom:1px dashed #e6eef7; }
  .pip-kv span { color:#6b7a8c; } .pip-kv b { text-align:right; }
  @media (max-width: 575px) {
    .pip-grid { gap:6px; padding:8px; }
    .pip-tile { min-height:130px; }
    .pip-tile img { height:70px; }
  }
`;

/** Resize to at most MAX_EDGE px and re-encode as JPEG (also keeps the upload far below the 5 MB limit). */
function resizeImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("encode"))), "image/jpeg", 0.85);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("decode"));
    };
    img.src = url;
  });
}

function getPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("unsupported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 });
  });
}

const directionOf = (heading) => DIRECTIONS[Math.round((((heading % 360) + 360) % 360) / 45) % 8];

/** Live compass heading (0-360, 0 = north) from the device orientation sensor; null when not available. */
function useCompass() {
  const [heading, setHeading] = useState(null);
  const [status, setStatus] = useState("off"); // off | on | denied | unsupported
  const latest = useRef({ heading: null, at: 0 });
  const listening = useRef(false);

  const onOrientation = useCallback((e) => {
    let h = null;
    if (typeof e.webkitCompassHeading === "number") {
      h = e.webkitCompassHeading; // iOS: already clockwise from north
    } else if ((e.absolute || e.type === "deviceorientationabsolute") && typeof e.alpha === "number") {
      h = 360 - e.alpha; // alpha is counter-clockwise
    }
    if (h === null || Number.isNaN(h)) return;
    const angle = (window.screen && window.screen.orientation && window.screen.orientation.angle) || 0;
    h = (((h + angle) % 360) + 360) % 360;
    latest.current = { heading: h, at: Date.now() };
    setHeading(Math.round(h));
  }, []);

  const start = useCallback(async () => {
    if (typeof window === "undefined" || !("DeviceOrientationEvent" in window)) {
      setStatus("unsupported");
      return;
    }
    try {
      if (typeof window.DeviceOrientationEvent.requestPermission === "function") {
        const answer = await window.DeviceOrientationEvent.requestPermission(); // iOS asks the user
        if (answer !== "granted") {
          setStatus("denied");
          return;
        }
      }
    } catch {
      setStatus("denied");
      return;
    }
    if (!listening.current) {
      window.addEventListener("deviceorientationabsolute", onOrientation, true);
      window.addEventListener("deviceorientation", onOrientation, true);
      listening.current = true;
    }
    setStatus("on");
  }, [onOrientation]);

  useEffect(() => () => {
    window.removeEventListener("deviceorientationabsolute", onOrientation, true);
    window.removeEventListener("deviceorientation", onOrientation, true);
  }, [onOrientation]);

  /** Heading read in the last few seconds, else null (sensor silent / desktop). */
  const freshHeading = () => (latest.current.heading !== null && Date.now() - latest.current.at < HEADING_FRESH_MS ? latest.current.heading : null);

  return { heading, status, start, freshHeading };
}

function PhotoThumb({ photoId }) {
  const [src, setSrc] = useState(null);
  useEffect(() => {
    let url = null;
    let cancelled = false;
    api.get(baseURLDBT + `pre-inspection-photo/${photoId}/image`, { responseType: "blob" })
      .then((res) => {
        if (cancelled) return;
        url = URL.createObjectURL(res.data);
        setSrc(url);
      })
      .catch(() => { if (!cancelled) setSrc(null); });
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [photoId]);
  return src ? <img src={src} alt="" /> : <img alt="" />;
}

function PreInspectionPhotos() {
  const { t } = useTranslation();
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const compass = useCompass();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [pending, setPending] = useState(null); // { parcel, role }
  const [draft, setDraft] = useState(null); // photo waiting for confirmation
  const [saving, setSaving] = useState(false);
  const fileInput = useRef(null);
  const secure = typeof window !== "undefined" && window.isSecureContext;

  const load = useCallback(() => {
    setLoading(true);
    api.get(baseURLDBT + `pre-inspection-photo/case/${applicationId}`)
      .then((res) => {
        if (res.data?.errorCode === -1) {
          setLoadError(res.data.errorMessages?.[0] || t("Application not found."));
          setData(null);
        } else {
          setData(res.data?.content || null);
          setLoadError(null);
        }
      })
      .catch(() => setLoadError(t("The case could not be loaded. Please try again.")))
      .finally(() => setLoading(false));
  }, [applicationId, t]);

  useEffect(load, [load]);

  // free the preview only when it is replaced or the page closes (choosing a direction keeps the same preview)
  const previewUrl = draft?.previewUrl;
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const openCamera = (parcel, role) => {
    if (compass.status === "off") compass.start(); // a user gesture: iOS may ask for motion permission here
    setPending({ parcel, role });
    if (fileInput.current) {
      fileInput.current.value = "";
      fileInput.current.click();
    }
  };

  const onFileChosen = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file || !pending) return;
    const headingAtShot = compass.freshHeading();
    const capturedAt = new Date().toISOString();
    Swal.fire({ title: t("Reading GPS position..."), allowOutsideClick: false, didOpen: () => Swal.showLoading(), customClass: swalClass });
    let position;
    try {
      position = await getPosition();
    } catch (err) {
      Swal.fire({
        icon: "warning",
        title: t("GPS position not available"),
        text: !secure
          ? t("Location works only on a secure (https) page. Open e-Reshme over https on the phone.")
          : t("Allow location access for this site, go outdoors for a better signal, and take the photo again."),
        customClass: swalClass,
      });
      return;
    }
    let blob;
    try {
      blob = await resizeImage(file);
    } catch {
      Swal.fire({ icon: "error", title: t("The photo could not be read. Take it again."), customClass: swalClass });
      return;
    }
    Swal.close();
    setDraft({
      ...pending,
      blob,
      previewUrl: URL.createObjectURL(blob),
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracyM: position.coords.accuracy,
      headingDeg: headingAtShot,
      directionSource: headingAtShot === null ? "MANUAL" : "COMPASS",
      direction: headingAtShot === null ? "" : directionOf(headingAtShot),
      capturedAt,
    });
  };

  const save = async () => {
    if (!draft) return;
    if (draft.directionSource === "MANUAL" && !draft.direction) {
      Swal.fire({ icon: "info", title: t("Choose the direction the camera faced"), customClass: swalClass });
      return;
    }
    const fd = new FormData();
    fd.append("applicationId", applicationId);
    fd.append("parcelId", draft.parcel.parcelId);
    fd.append("role", draft.role);
    fd.append("latitude", draft.latitude);
    fd.append("longitude", draft.longitude);
    if (draft.accuracyM != null) fd.append("accuracyM", draft.accuracyM);
    if (draft.directionSource === "COMPASS") fd.append("headingDeg", draft.headingDeg);
    fd.append("direction", draft.direction);
    fd.append("directionSource", draft.directionSource);
    fd.append("capturedAt", draft.capturedAt);
    fd.append("file", draft.blob, `${draft.role}.jpg`);
    setSaving(true);
    try {
      const res = await api.post(baseURLDBT + "pre-inspection-photo/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      if (res.data?.errorCode === -1) {
        Swal.fire({ icon: "warning", title: t("Photo not saved"), text: res.data.errorMessages?.[0], customClass: swalClass });
        return;
      }
      setDraft(null);
      setPending(null);
      load();
      const saved = res.data?.content;
      if (saved?.ksrsacStatus === "MISMATCH") {
        Swal.fire({ icon: "warning", title: t("Location does not match the survey parcel (KSRSAC)"), text: saved.ksrsacMessage, customClass: swalClass });
      } else if (saved?.ksrsacStatus === "NOT_CHECKED") {
        Swal.fire({ icon: "info", title: t("Photo saved"), text: t("KSRSAC could not be reached, so the location was not checked. Use 'Re-check with KSRSAC' later."), customClass: swalClass });
      }
    } catch {
      Swal.fire({ icon: "error", title: t("Photo not saved"), text: t("Check the connection and try again."), customClass: swalClass });
    } finally {
      setSaving(false);
    }
  };

  const remove = (photo, parcel) => {
    Swal.fire({
      icon: "warning",
      title: t("Remove this photo?"),
      text: `${t(ROLE_LABEL[photo.role])} - ${t("Survey No.")} ${parcel.surveyNumber || "-"}`,
      showCancelButton: true,
      confirmButtonText: t("Remove"),
      cancelButtonText: t("Cancel"),
      customClass: swalClass,
    }).then(async (ans) => {
      if (!ans.isConfirmed) return;
      try {
        const res = await api.delete(baseURLDBT + `pre-inspection-photo/${photo.photoId}`);
        if (res.data?.errorCode === -1) {
          Swal.fire({ icon: "warning", title: t("Not removed"), text: res.data.errorMessages?.[0], customClass: swalClass });
          return;
        }
        load();
      } catch {
        Swal.fire({ icon: "error", title: t("Not removed"), text: t("Something went wrong!"), customClass: swalClass });
      }
    });
  };

  const [rechecking, setRechecking] = useState(false);
  const recheckKsrsac = async () => {
    setRechecking(true);
    try {
      const res = await api.post(baseURLDBT + `pre-inspection-photo/case/${applicationId}/ksrsac-check`);
      if (res.data?.errorCode === -1) {
        Swal.fire({ icon: "warning", title: t("Not checked"), text: res.data.errorMessages?.[0], customClass: swalClass });
        return;
      }
      setData(res.data?.content || null);
    } catch {
      Swal.fire({ icon: "error", title: t("Not checked"), text: t("Something went wrong!"), customClass: swalClass });
    } finally {
      setRechecking(false);
    }
  };

  const parcels = data?.parcels || [];
  const doneCount = parcels.filter((p) => p.complete).length;

  return (
    <Layout title={t("Pre-Inspection Photos")}>
      <style>{styles}</style>
      <input ref={fileInput} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={onFileChosen} />
      <Block.Head>
        <div className="pip-head">
          <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap">
            <h2>{t("Pre-Inspection Photos")}</h2>
            <Button size="sm" variant="light" onClick={() => navigate(-1)}><Icon name="arrow-left" /> <span>{t("Back")}</span></Button>
          </div>
          {data && (
            <div className="meta">
              <span>{data.beneficiaryName || "-"}</span>
              <span>{t("FRUITS ID")}: {data.fruitsId || "-"}</span>
              <span>{data.subSchemeName || "-"}</span>
              <span>{t("Stage")}: {data.stageName || "-"}</span>
            </div>
          )}
        </div>
      </Block.Head>

      <Block>
        {loading && !data ? (
          <div className="text-center p-4"><Spinner /> </div>
        ) : loadError ? (
          <div className="pip-alert bad"><Icon name="alert-circle-fill" /> {loadError}</div>
        ) : data && (
          <>
            {!secure && data.captureAllowed && (
              <div className="pip-alert warn"><Icon name="alert-circle" /> {t("This page is not opened over https, so the phone will not share GPS or compass. Open e-Reshme over https to take photos.")}</div>
            )}
            {!data.captureAllowed && (
              <div className="pip-alert warn"><Icon name="info-fill" /> {t("The case is not at a pre-inspection stage. Photos can be viewed but not taken or changed.")}</div>
            )}

            <div className="pip-bar">
              {!data.landSubsidyCase ? (
                <span className="pip-pill info"><Icon name="info-fill" /> {t("No survey parcels on this application")}</span>
              ) : data.complete ? (
                <span className="pip-pill ok"><Icon name="check-circle-fill" /> {t("All parcels complete")}</span>
              ) : (
                <span className="pip-pill bad"><Icon name="alert-circle-fill" /> {doneCount} / {parcels.length} {t("parcels complete")}</span>
              )}
              {data.ksrsacEnabled && data.ksrsacStatus && (
                <span className="d-inline-flex align-items-center gap-2">
                  <span className={`pip-pill ${data.ksrsacStatus === "MATCH" ? "ok" : data.ksrsacStatus === "MISMATCH" ? "bad" : "warn"}`}>
                    <Icon name={data.ksrsacStatus === "MATCH" ? "check-circle-fill" : "alert-circle-fill"} />{" "}
                    {data.ksrsacStatus === "MISMATCH" ? t("KSRSAC: location mismatch - case flagged")
                      : data.ksrsacStatus === "MATCH" ? t("KSRSAC: locations match survey parcels")
                        : data.ksrsacStatus === "NOT_CHECKED" ? t("KSRSAC: some photos not checked")
                          : t("KSRSAC: no survey reference")}
                  </span>
                  <Button size="sm" variant="outline-primary" onClick={recheckKsrsac} disabled={rechecking}>
                    {rechecking ? <Spinner size="sm" /> : <Icon name="reload" />} <span>{t("Re-check with KSRSAC")}</span>
                  </Button>
                </span>
              )}
              {data.captureAllowed && (
                <span className="pip-compass">
                  {compass.status === "on" && compass.heading !== null ? (
                    <>
                      <span className="pip-needle" style={{ "--rot": `${-compass.heading}deg` }} />
                      {t("Facing")} <b>{directionOf(compass.heading)}</b> ({compass.heading}°)
                    </>
                  ) : compass.status === "denied" ? (
                    <span className="pip-pill warn">{t("Compass not allowed - direction will be chosen by hand")}</span>
                  ) : compass.status === "unsupported" ? (
                    <span className="pip-pill warn">{t("No compass - direction will be chosen by hand")}</span>
                  ) : compass.status === "on" ? (
                    <span className="pip-pill info">{t("Waiting for compass...")}</span>
                  ) : (
                    <Button size="sm" variant="outline-primary" onClick={compass.start}><Icon name="navigate" /> <span>{t("Enable compass")}</span></Button>
                  )}
                </span>
              )}
            </div>

            {parcels.map((parcel) => (
              <div className="pip-parcel" key={parcel.parcelId}>
                <div className="pip-parcel-head">
                  <div>
                    <b>{t("Survey No.")} {parcel.surveyNumber || "-"}{parcel.hissa ? ` / ${t("Hissa")} ${parcel.hissa}` : ""}</b>
                    <small>
                      {parcel.ownerName ? `${parcel.ownerName} · ` : ""}
                      {(parcel.acre ?? 0)} {t("acre")} {(parcel.gunta ?? 0)} {t("gunta")}
                      {" · "}
                      {parcel.latitude != null
                        ? `${Number(parcel.latitude).toFixed(6)}, ${Number(parcel.longitude).toFixed(6)}`
                        : t("No coordinates yet - set by the centre photo")}
                    </small>
                  </div>
                  {parcel.complete
                    ? <span className="pip-pill ok"><Icon name="check-circle-fill" /> {t("Complete")}</span>
                    : <span className="pip-pill bad">{t("Missing")}: {parcel.missingRoles.join(", ")}</span>}
                </div>
                <div className="pip-grid">
                  {GRID.map((role, i) => {
                    if (!role) return <div className="pip-gap" key={`g${i}`} />;
                    const photo = parcel.photos?.[role];
                    return (
                      <div className={`pip-tile ${photo ? "done" : ""}`} key={role}>
                        <div className="label">{t(ROLE_LABEL[role])}</div>
                        {photo ? (
                          <>
                            <PhotoThumb photoId={photo.photoId} />
                            <div className="info">
                              <div><b>{photo.direction}</b>{photo.headingDeg != null ? ` ${Math.round(photo.headingDeg)}°` : ""} · {photo.directionSource === "MANUAL" ? t("manual") : t("compass")}</div>
                              <div>{Number(photo.latitude).toFixed(6)}, {Number(photo.longitude).toFixed(6)}{photo.accuracyM != null ? ` ±${Math.round(photo.accuracyM)} m` : ""}</div>
                            </div>
                            {photo.ksrsacStatus && (
                              <span className={`pip-ks ${photo.ksrsacStatus}`} title={photo.ksrsacMessage || ""}>
                                {t(KSRSAC_LABEL[photo.ksrsacStatus] || photo.ksrsacStatus)}
                                {photo.ksrsacStatus === "MISMATCH" && photo.ksrsacSurveyNumber ? ` (${t("Sy.")} ${photo.ksrsacSurveyNumber})` : ""}
                              </span>
                            )}
                            {data.captureAllowed && (
                              <div className="actions">
                                <Button size="sm" variant="outline-primary" onClick={() => openCamera(parcel, role)}>{t("Retake")}</Button>
                                <Button size="sm" variant="outline-danger" onClick={() => remove(photo, parcel)}><Icon name="trash" /></Button>
                              </div>
                            )}
                          </>
                        ) : data.captureAllowed ? (
                          <button type="button" className="pip-take" onClick={() => openCamera(parcel, role)}>
                            <Icon name="camera" /> {t("Take photo")}
                          </button>
                        ) : (
                          <div className="pip-take" style={{ color: "#9aa8b8" }}>{t("Not taken")}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {Object.values(parcel.photos || {})
                  .filter((p) => p.ksrsacStatus === "MISMATCH")
                  .map((p) => (
                    <div className="pip-ksmsg" key={`ks${p.photoId}`}><Icon name="alert-circle-fill" /> KSRSAC: {p.ksrsacMessage}</div>
                  ))}
                {(parcel.warnings || []).map((w, i) => (
                  <div className="pip-warn" key={i}><Icon name="alert-circle" /> {w}</div>
                ))}
              </div>
            ))}
          </>
        )}
      </Block>

      <Modal show={!!draft} onHide={() => !saving && setDraft(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "1.05rem" }}>
            {draft ? `${t(ROLE_LABEL[draft.role])} - ${t("Survey No.")} ${draft.parcel.surveyNumber || "-"}` : ""}
          </Modal.Title>
        </Modal.Header>
        {draft && (
          <Modal.Body>
            <img className="pip-modal-img" src={draft.previewUrl} alt="" />
            <div className="mt-2">
              <div className="pip-kv"><span>{t("GPS")}</span><b>{draft.latitude.toFixed(6)}, {draft.longitude.toFixed(6)}</b></div>
              <div className="pip-kv"><span>{t("Accuracy")}</span><b>{draft.accuracyM != null ? `±${Math.round(draft.accuracyM)} m` : "-"}</b></div>
              {draft.directionSource === "COMPASS" ? (
                <div className="pip-kv"><span>{t("Camera facing")}</span><b>{draft.direction} ({Math.round(draft.headingDeg)}°, {t("compass")})</b></div>
              ) : (
                <div className="mt-2">
                  <Form.Label style={{ fontWeight: 600 }}>{t("Camera facing (no compass reading)")} <span className="text-danger">*</span></Form.Label>
                  <Form.Select value={draft.direction} onChange={(e) => setDraft((d) => ({ ...d, direction: e.target.value }))}>
                    <option value="">{t("Select direction")}</option>
                    {DIRECTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </Form.Select>
                </div>
              )}
            </div>
          </Modal.Body>
        )}
        <Modal.Footer>
          <Button variant="light" onClick={() => { const p = draft && { parcel: draft.parcel, role: draft.role }; setDraft(null); if (p) openCamera(p.parcel, p.role); }} disabled={saving}>
            {t("Retake")}
          </Button>
          <Button variant="primary" onClick={save} disabled={saving}>
            {saving ? <Spinner size="sm" /> : <><Icon name="save" /> <span>{t("Save photo")}</span></>}
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
}

export default PreInspectionPhotos;
