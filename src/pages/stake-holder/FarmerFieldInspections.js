import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { Icon } from "../../components";
import api from "../../services/auth/api";

// SR-007: GPS-tagged field inspections of a farmer's farm / rearing house, shown on the farmer profile.
// Every inspection is attached to one land record of the farmer, so its coordinates stay with that farm /
// rearing-house record. The land record's own GPS is never changed. Optional photo (stored in S3).
// Backend: farmer-registration /v1/farmer-field-inspection/*

const baseURL = process.env.REACT_APP_API_BASE_URL_REGISTRATION;
const MAX_PHOTO = 4 * 1024 * 1024;
const KA = { minLat: 11.0, maxLat: 19.0, minLng: 73.5, maxLng: 79.0 };
const swalClass = { popup: "ffi-swal-popup", confirmButton: "ffi-swal-confirm", cancelButton: "ffi-swal-cancel" };
const swal = (o) => Swal.fire({ buttonsStyling: false, customClass: swalClass, ...o });

const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const dmy = (iso) => {
  if (!iso) return "";
  const [y, m, d] = String(iso).substring(0, 10).split("-");
  return d && m && y ? `${d}-${m}-${y}` : iso;
};
const mapUrl = (lat, lng) => `https://www.google.com/maps?q=${lat},${lng}`;
const validCoord = (lat, lng) => {
  const a = parseFloat(lat), b = parseFloat(lng);
  return !isNaN(a) && !isNaN(b) && !(a === 0 && b === 0) && Math.abs(a) <= 90 && Math.abs(b) <= 180;
};
const landTitle = (l, t) =>
  [
    l.surveyNumber ? `${t("Sy. No.")} ${l.surveyNumber}${l.hissa ? `/${l.hissa}` : ""}` : `${t("Land")} #${l.farmerLandDetailsId}`,
    l.villageName,
  ].filter(Boolean).join(" · ");
const landArea = (l, t) => {
  const parts = [];
  if (l.acre !== null && l.acre !== undefined) parts.push(`${l.acre} ${t("A")}`);
  if (l.gunta !== null && l.gunta !== undefined) parts.push(`${l.gunta} ${t("G")}`);
  return parts.join(" ");
};
const distanceLabel = (m, t) => {
  if (m === null || m === undefined) return null;
  return m >= 1000 ? `${(m / 1000).toFixed(2)} km ${t("from recorded farm GPS")}` : `${m} m ${t("from recorded farm GPS")}`;
};

const styles = `
  .ffi { --ffi-primary:#1e67a8; --ffi-ink:#1f2d3d; --ffi-muted:#6b7a8c; --ffi-line:#e3eaf3; }
  .ffi-top { display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; margin-bottom:12px; }
  .ffi-top .sum { font-size:.82rem; color:var(--ffi-muted); }
  .ffi-land { border:1px solid var(--ffi-line); border-radius:12px; background:#fbfdff; padding:12px 14px; margin-bottom:12px; }
  .ffi-land-head { display:flex; align-items:flex-start; justify-content:space-between; gap:10px; flex-wrap:wrap; }
  .ffi-land-title { font-weight:800; color:var(--ffi-ink); display:flex; align-items:center; gap:8px; }
  .ffi-land-title .icon { color:var(--ffi-primary); }
  .ffi-meta { font-size:.78rem; color:#4a5568; display:flex; flex-wrap:wrap; gap:6px 14px; margin-top:4px; }
  .ffi-meta span { display:inline-flex; align-items:center; gap:5px; }
  .ffi-meta .icon { color:#8aa4c0; }
  .ffi-gps-none { color:#b26a00; }
  .ffi-list { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:10px; margin-top:10px; }
  .ffi-item { background:#fff; border:1px solid var(--ffi-line); border-radius:10px; padding:10px 12px; position:relative; display:flex; gap:10px; }
  .ffi-thumb { width:64px; height:64px; border-radius:8px; object-fit:cover; background:#eef3f9; flex-shrink:0; cursor:pointer; display:flex; align-items:center; justify-content:center; color:#8aa4c0; font-size:1.4rem; }
  .ffi-body { min-width:0; flex:1; }
  .ffi-row1 { display:flex; align-items:center; gap:6px; flex-wrap:wrap; padding-right:26px; }
  .ffi-date { font-weight:800; color:var(--ffi-ink); font-size:.88rem; }
  .ffi-badge { border-radius:999px; padding:1px 8px; font-size:.68rem; font-weight:800; }
  .ffi-badge.FARM { background:#e7f7ee; color:#18794e; }
  .ffi-badge.REARING_HOUSE { background:#fff4e5; color:#b26a00; }
  .ffi-badge.src { background:#eef3f9; color:#4a5568; }
  .ffi-coord { font-family:SFMono-Regular,Consolas,monospace; font-size:.8rem; color:#34495e; margin-top:4px; }
  .ffi-small { font-size:.74rem; color:var(--ffi-muted); margin-top:2px; word-break:break-word; }
  .ffi-obs { font-size:.8rem; color:#4a5568; margin-top:4px; word-break:break-word; }
  .ffi-map { font-size:.78rem; font-weight:700; color:var(--ffi-primary); text-decoration:none; display:inline-flex; align-items:center; gap:4px; margin-top:4px; }
  .ffi-del { position:absolute; top:6px; right:6px; border:none; background:#fdf0f3; color:#c43257; width:26px; height:26px; border-radius:50%; display:flex; align-items:center; justify-content:center; }
  .ffi-empty { text-align:center; color:#7a8899; font-size:.82rem; padding:10px; border:1px dashed #cbd5e1; border-radius:10px; background:#fff; margin-top:10px; }
  .ffi-gpsbox { border:1px solid var(--ffi-line); border-radius:12px; padding:12px; background:#f6f9fd; }
  .ffi-gpsbox .state { font-size:.8rem; margin-top:8px; }
  .ffi-gpsbox .state.ok { color:#18794e; } .ffi-gpsbox .state.warn { color:#b26a00; } .ffi-gpsbox .state.bad { color:#c43257; }
  .ffi-site { display:flex; gap:10px; flex-wrap:wrap; }
  .ffi-site label { flex:1 1 160px; border:1px solid #d5dfeb; border-radius:10px; padding:10px 12px; cursor:pointer; display:flex; align-items:center; gap:8px; font-weight:700; color:#4a5568; margin:0; }
  .ffi-site input { accent-color:#1e67a8; }
  .ffi-site label.on { border-color:#3b8dd6; background:#eef6ff; color:var(--ffi-primary); }
  .ffi-preview { max-width:100%; max-height:160px; border-radius:10px; margin-top:8px; border:1px solid var(--ffi-line); }
  .ffi-modal .modal-content { border:none; border-radius:16px; overflow:hidden; }
  .ffi-modal .modal-header { background:linear-gradient(90deg,#174f86,#3b8dd6); border:none; }
  .ffi-modal .modal-title { color:#fff; font-weight:800; font-size:1rem; display:flex; align-items:center; gap:8px; }
  .ffi-modal .btn-close { filter:invert(1) grayscale(1) brightness(2); }
  .ffi-modal .form-label { font-size:.78rem; font-weight:700; color:#4a5568; text-transform:uppercase; letter-spacing:.03em; }
  .ffi-photo-modal .modal-content { background:#111; border:none; border-radius:14px; }
  .ffi-photo-modal img { width:100%; max-height:80vh; object-fit:contain; }
  .ffi-swal-popup { border-radius:16px !important; }
  .ffi-swal-confirm { background:linear-gradient(90deg,#1e67a8,#3b8dd6); color:#fff; border:none; border-radius:10px; padding:9px 24px; font-weight:700; margin:0 6px; }
  .ffi-swal-cancel { background:#fff; color:#4a5568; border:1px solid #d5dfeb; border-radius:10px; padding:9px 22px; font-weight:700; margin:0 6px; }
`;

const emptyForm = (landId) => ({
  farmerLandDetailsId: landId || "",
  siteType: "FARM",
  inspectionDate: todayIso(),
  latitude: "",
  longitude: "",
  gpsAccuracyM: "",
  gpsSource: "MANUAL",
  gpsCapturedAt: "",
  observations: "",
});

/** Loads a photo through the authenticated api (an <img src> could not send the token). */
function InspectionPhoto({ id, onOpen }) {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    let alive = true, objectUrl = null;
    api.get(baseURL + `farmer-field-inspection/${id}/photo`, { responseType: "blob" })
      .then((res) => { if (alive) { objectUrl = URL.createObjectURL(res.data); setUrl(objectUrl); } })
      .catch(() => {});
    return () => { alive = false; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [id]);
  if (!url) return <div className="ffi-thumb"><Icon name="img" /></div>;
  return <img className="ffi-thumb" src={url} alt="" onClick={() => onOpen(url)} />;
}

function FarmerFieldInspections({ farmerId }) {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [errors, setErrors] = useState({});
  const [photo, setPhoto] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [locating, setLocating] = useState(false);
  const [gpsMsg, setGpsMsg] = useState(null); // { tone, text }
  const [saving, setSaving] = useState(false);
  const [bigPhoto, setBigPhoto] = useState(null);

  const lands = data?.lands || [];

  const load = () => {
    if (!farmerId) return;
    setLoading(true);
    api.get(baseURL + `farmer-field-inspection/get-by-farmer-id/${farmerId}`)
      .then((res) => setData(res.data?.content || null))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  };
  useEffect(load, [farmerId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => { if (photoUrl) URL.revokeObjectURL(photoUrl); }, [photoUrl]);

  const openAdd = (landId) => {
    if (!lands.length) {
      swal({ icon: "info", title: t("No land records"), text: t("Add the farmer's land details first.") });
      return;
    }
    setForm(emptyForm(landId || (lands.length === 1 ? lands[0].farmerLandDetailsId : "")));
    setErrors({}); setPhoto(null); setPhotoUrl(null); setGpsMsg(null); setShow(true);
  };

  const set = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f, [name]: value,
      // typing the coordinates makes them a manual position
      ...(name === "latitude" || name === "longitude" ? { gpsSource: "MANUAL", gpsAccuracyM: "", gpsCapturedAt: "" } : {}),
    }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const captureGps = () => {
    if (!navigator.geolocation) {
      setGpsMsg({ tone: "bad", text: t("This device / browser cannot give a GPS location. Enter the coordinates manually.") });
      return;
    }
    if (!window.isSecureContext) {
      setGpsMsg({ tone: "bad", text: t("Location needs a secure (https) connection. Enter the coordinates manually.") });
      return;
    }
    setLocating(true);
    setGpsMsg(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setForm((f) => ({
          ...f,
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6),
          gpsAccuracyM: accuracy ? accuracy.toFixed(1) : "",
          gpsSource: "DEVICE",
          gpsCapturedAt: String(pos.timestamp || Date.now()),
        }));
        setErrors((er) => ({ ...er, latitude: undefined, longitude: undefined }));
        const acc = Math.round(accuracy || 0);
        setGpsMsg(acc > 50
          ? { tone: "warn", text: `${t("Location captured, but accuracy is low")} (±${acc} m). ${t("Move to open sky and capture again for a better fix.")}` }
          : { tone: "ok", text: `${t("Location captured")} (±${acc} m)` });
        setLocating(false);
      },
      (err) => {
        const msg = err.code === 1 ? t("Location permission was denied. Allow location for this site, or enter the coordinates manually.")
          : err.code === 3 ? t("Getting the location took too long. Try again in the open, or enter the coordinates manually.")
          : t("Location is not available right now. Enter the coordinates manually.");
        setGpsMsg({ tone: "bad", text: msg });
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  };

  const pickPhoto = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!/^image\/(jpeg|png|webp)$/.test(f.type)) {
      swal({ icon: "warning", title: t("Photo must be a JPG, PNG or WEBP image") });
      e.target.value = "";
      return;
    }
    if (f.size > MAX_PHOTO) {
      swal({ icon: "warning", title: t("Photo must be 4 MB or smaller") });
      e.target.value = "";
      return;
    }
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhoto(f);
    setPhotoUrl(URL.createObjectURL(f));
  };

  const validate = () => {
    const e = {};
    if (!form.farmerLandDetailsId) e.farmerLandDetailsId = t("Select the land / farm");
    if (!form.inspectionDate) e.inspectionDate = t("Inspection date is required");
    else if (form.inspectionDate > todayIso()) e.inspectionDate = t("Inspection date cannot be in the future");
    const lat = parseFloat(form.latitude), lng = parseFloat(form.longitude);
    if (form.latitude === "" || isNaN(lat)) e.latitude = t("Capture the location or enter the latitude");
    if (form.longitude === "" || isNaN(lng)) e.longitude = t("Capture the location or enter the longitude");
    if (!e.latitude && !e.longitude && (lat < KA.minLat || lat > KA.maxLat || lng < KA.minLng || lng > KA.maxLng)) {
      e.latitude = t("This location is outside Karnataka. Check the coordinates.");
    }
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) return;
    const fd = new FormData();
    fd.append("farmerId", farmerId);
    fd.append("farmerLandDetailsId", form.farmerLandDetailsId);
    fd.append("siteType", form.siteType);
    fd.append("inspectionDate", form.inspectionDate);
    fd.append("latitude", form.latitude);
    fd.append("longitude", form.longitude);
    if (form.gpsAccuracyM !== "") fd.append("gpsAccuracyM", form.gpsAccuracyM);
    fd.append("gpsSource", form.gpsSource);
    if (form.gpsCapturedAt) fd.append("gpsCapturedAt", form.gpsCapturedAt);
    if (form.observations.trim()) fd.append("observations", form.observations.trim());
    if (photo) fd.append("photo", photo);
    setSaving(true);
    try {
      const res = await api.post(baseURL + "farmer-field-inspection/add", fd, { headers: { "Content-Type": "multipart/form-data" } });
      const c = res.data?.content;
      if (c?.error) {
        swal({ icon: "warning", title: t("Not saved"), text: c.error_description });
        return;
      }
      setShow(false);
      load();
      swal({ icon: "success", title: t("Field inspection saved"), timer: 1500, showConfirmButton: false });
    } catch (err) {
      const v = err?.response?.data?.validationErrors;
      const big = err?.response?.status === 413;
      swal({ icon: "error", title: t("Not saved"), text: big ? t("Photo must be 4 MB or smaller") : v ? Object.values(v).join("\n") : t("Something went wrong!") });
    } finally {
      setSaving(false);
    }
  };

  const remove = (i) => {
    swal({
      icon: "warning",
      title: t("Remove this inspection?"),
      text: `${dmy(i.inspectionDate)} · ${i.latitude}, ${i.longitude}`,
      showCancelButton: true,
      confirmButtonText: t("Remove"),
      cancelButtonText: t("Cancel"),
    }).then(async (ans) => {
      if (!ans.isConfirmed) return;
      try {
        const res = await api.delete(baseURL + `farmer-field-inspection/delete/${i.farmerFieldInspectionId}`);
        if (res.data?.content?.error) {
          swal({ icon: "warning", title: t("Not removed"), text: res.data.content.error_description });
          return;
        }
        load();
      } catch {
        swal({ icon: "error", title: t("Not removed"), text: t("Something went wrong!") });
      }
    });
  };

  const selectedLand = lands.find((l) => String(l.farmerLandDetailsId) === String(form.farmerLandDetailsId));

  return (
    <div className="ffi">
      <style>{styles}</style>
      <div className="ffi-top">
        <span className="sum">
          {lands.length} {t("land record(s)")} · {data?.totalInspections || 0} {t("field inspection(s)")}
        </span>
        <Button type="button" size="sm" variant="primary" onClick={() => openAdd()} disabled={loading}>
          <Icon name="map-pin" /> <span>{t("Add Field Inspection")}</span>
        </Button>
      </div>

      {loading ? (
        <div className="ffi-empty"><Spinner size="sm" /> {t("Loading...")}</div>
      ) : lands.length === 0 ? (
        <div className="ffi-empty">{t("No land records for this farmer yet.")}</div>
      ) : (
        lands.map((l) => (
          <div className="ffi-land" key={l.farmerLandDetailsId}>
            <div className="ffi-land-head">
              <div>
                <div className="ffi-land-title"><Icon name="map" /> {landTitle(l, t)}</div>
                <div className="ffi-meta">
                  {landArea(l, t) && <span><Icon name="grid-alt" /> {landArea(l, t)}</span>}
                  {l.rearingHouseDetails && <span><Icon name="home-alt" /> {t("Rearing house")}: {l.rearingHouseDetails} {t("sq ft")}</span>}
                  {validCoord(l.gpsLat, l.gpsLng) ? (
                    <span><Icon name="map-pin" /> {t("Recorded farm GPS")}: {l.gpsLat}, {l.gpsLng}{" "}
                      <a className="ffi-map" href={mapUrl(l.gpsLat, l.gpsLng)} target="_blank" rel="noopener noreferrer">{t("Map")}</a>
                    </span>
                  ) : (
                    <span className="ffi-gps-none"><Icon name="map-pin" /> {t("No farm GPS recorded")}</span>
                  )}
                </div>
              </div>
              <Button type="button" size="sm" variant="outline-primary" onClick={() => openAdd(l.farmerLandDetailsId)}>
                <Icon name="plus" /> <span>{t("Inspect")}</span>
              </Button>
            </div>

            {l.inspections.length === 0 ? (
              <div className="ffi-empty">{t("No field inspections for this land yet.")}</div>
            ) : (
              <div className="ffi-list">
                {l.inspections.map((i) => (
                  <div className="ffi-item" key={i.farmerFieldInspectionId}>
                    {i.hasPhoto ? <InspectionPhoto id={i.farmerFieldInspectionId} onOpen={setBigPhoto} /> : <div className="ffi-thumb"><Icon name="map-pin" /></div>}
                    <div className="ffi-body">
                      <div className="ffi-row1">
                        <span className="ffi-date">{dmy(i.inspectionDate)}</span>
                        <span className={`ffi-badge ${i.siteType}`}>{i.siteType === "REARING_HOUSE" ? t("Rearing house") : t("Farm")}</span>
                        <span className="ffi-badge src">{i.gpsSource === "DEVICE" ? t("Device GPS") : t("Manual")}</span>
                      </div>
                      <div className="ffi-coord">
                        {Number(i.latitude).toFixed(6)}, {Number(i.longitude).toFixed(6)}
                        {i.gpsAccuracyM !== null && i.gpsAccuracyM !== undefined && <> · ±{Math.round(i.gpsAccuracyM)} m</>}
                      </div>
                      {distanceLabel(i.distanceFromLandGpsM, t) && <div className="ffi-small">{distanceLabel(i.distanceFromLandGpsM, t)}</div>}
                      {i.observations && <div className="ffi-obs">{i.observations}</div>}
                      {i.inspectedBy && <div className="ffi-small">{t("By")} {i.inspectedBy}</div>}
                      <a className="ffi-map" href={mapUrl(i.latitude, i.longitude)} target="_blank" rel="noopener noreferrer">
                        <Icon name="external" /> {t("Open in map")}
                      </a>
                    </div>
                    <button type="button" className="ffi-del" onClick={() => remove(i)} title={t("Remove")} aria-label={t("Remove")}><Icon name="trash" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}

      <Modal show={show} onHide={() => !saving && setShow(false)} centered size="lg" className="ffi-modal">
        <Form noValidate onSubmit={submit}>
          <Modal.Header closeButton>
            <Modal.Title><Icon name="map-pin" /> {t("Add Field Inspection")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="g-3">
              <Col md={8}>
                <Form.Label>{t("Land / Farm")} <span className="text-danger">*</span></Form.Label>
                <Form.Select name="farmerLandDetailsId" value={form.farmerLandDetailsId} onChange={set} isInvalid={!!errors.farmerLandDetailsId}>
                  <option value="">{t("Select")}</option>
                  {lands.map((l) => (
                    <option key={l.farmerLandDetailsId} value={l.farmerLandDetailsId}>
                      {landTitle(l, t)}{landArea(l, t) ? ` (${landArea(l, t)})` : ""}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.farmerLandDetailsId}</Form.Control.Feedback>
              </Col>
              <Col md={4}>
                <Form.Label>{t("Inspection date")} <span className="text-danger">*</span></Form.Label>
                <Form.Control type="date" name="inspectionDate" value={form.inspectionDate} max={todayIso()} onChange={set} isInvalid={!!errors.inspectionDate} />
                <Form.Control.Feedback type="invalid">{errors.inspectionDate}</Form.Control.Feedback>
              </Col>
              <Col md={12}>
                <Form.Label>{t("Site inspected")} <span className="text-danger">*</span></Form.Label>
                <div className="ffi-site">
                  {[["FARM", t("Farm / mulberry garden")], ["REARING_HOUSE", t("Rearing house")]].map(([v, l]) => (
                    <label key={v} className={form.siteType === v ? "on" : ""}>
                      <input type="radio" name="siteType" value={v} checked={form.siteType === v} onChange={set} /> {l}
                    </label>
                  ))}
                </div>
                {form.siteType === "REARING_HOUSE" && selectedLand && !selectedLand.rearingHouseDetails && (
                  <Form.Text className="text-warning">{t("No rearing house is recorded on this land record - check the land selected.")}</Form.Text>
                )}
              </Col>
              <Col md={12}>
                <div className="ffi-gpsbox">
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <Button type="button" variant="success" onClick={captureGps} disabled={locating}>
                      {locating ? <Spinner size="sm" /> : <Icon name="map-pin" />} <span>{locating ? t("Getting location...") : t("Capture my location")}</span>
                    </Button>
                    <span className="ffi-small">{t("Stand at the farm / rearing house and capture, or type the coordinates.")}</span>
                  </div>
                  <Row className="g-2 mt-1">
                    <Col sm={4}>
                      <Form.Label>{t("Latitude")} <span className="text-danger">*</span></Form.Label>
                      <Form.Control name="latitude" value={form.latitude} onChange={set} inputMode="decimal" placeholder="13.304512" isInvalid={!!errors.latitude} />
                      <Form.Control.Feedback type="invalid">{errors.latitude}</Form.Control.Feedback>
                    </Col>
                    <Col sm={4}>
                      <Form.Label>{t("Longitude")} <span className="text-danger">*</span></Form.Label>
                      <Form.Control name="longitude" value={form.longitude} onChange={set} inputMode="decimal" placeholder="76.912345" isInvalid={!!errors.longitude} />
                      <Form.Control.Feedback type="invalid">{errors.longitude}</Form.Control.Feedback>
                    </Col>
                    <Col sm={4}>
                      <Form.Label>{t("Accuracy / source")}</Form.Label>
                      <Form.Control readOnly value={form.gpsSource === "DEVICE" ? `±${form.gpsAccuracyM || "?"} m · ${t("Device GPS")}` : t("Manual entry")} />
                    </Col>
                  </Row>
                  {gpsMsg && <div className={`state ${gpsMsg.tone}`}>{gpsMsg.text}</div>}
                  {validCoord(form.latitude, form.longitude) && (
                    <a className="ffi-map" href={mapUrl(form.latitude, form.longitude)} target="_blank" rel="noopener noreferrer">
                      <Icon name="external" /> {t("Check on map")}
                    </a>
                  )}
                </div>
              </Col>
              <Col md={7}>
                <Form.Label>{t("Observations")}</Form.Label>
                <Form.Control as="textarea" rows={4} name="observations" value={form.observations} onChange={set} maxLength={1000}
                  placeholder={t("Condition of the mulberry garden / rearing house, remarks")} />
              </Col>
              <Col md={5}>
                <Form.Label>{t("Photo (optional)")}</Form.Label>
                <Form.Control type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={pickPhoto} />
                <Form.Text muted>{t("JPG / PNG / WEBP, up to 4 MB.")}</Form.Text>
                {photoUrl && <img className="ffi-preview" src={photoUrl} alt="" />}
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={() => setShow(false)} disabled={saving}>{t("Cancel")}</Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? <Spinner size="sm" /> : <><Icon name="save" /> <span>{t("Save Inspection")}</span></>}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={!!bigPhoto} onHide={() => setBigPhoto(null)} centered size="lg" className="ffi-photo-modal">
        <Modal.Body className="p-0">{bigPhoto && <img src={bigPhoto} alt="" />}</Modal.Body>
      </Modal>
    </div>
  );
}

export default FarmerFieldInspections;
