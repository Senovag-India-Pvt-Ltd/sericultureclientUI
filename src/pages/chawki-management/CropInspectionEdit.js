import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon } from "../../components";
import { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import api from "../../services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_CHAWKI_MANAGEMENT;
const baseURLRegistration = process.env.REACT_APP_API_BASE_URL_REGISTRATION;
const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function CropInspectionEdit() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const editFormRef = useRef(null);

  // Farmer search
  const [farmer, setFarmer] = useState({ select: "fruitsId", text: "" });
  const [validatedSearch, setValidatedSearch] = useState(false);
  const [farmerDetails, setFarmerDetails] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  // Crop inspection list
  const [inspectionList, setInspectionList] = useState([]);
  const [listLoading, setListLoading] = useState(false);

  // Edit form
  const [editData, setEditData] = useState(null);
  const [saving, setSaving] = useState(false);

  // Dropdown lists
  const [raceList, setRaceList] = useState([]);
  const [cropStatusList, setCropStatusList] = useState([]);
  const [grainageList, setGrainageList] = useState([]);

  useEffect(() => {
    api
      .get(baseURLMasterData + `raceMaster/get-all`)
      .then((res) => setRaceList(res.data.content.raceMaster || []))
      .catch(() => setRaceList([]));
  }, []);

  useEffect(() => {
    api
      .get(baseURLMasterData + `cropStatus/get-all`)
      .then((res) => setCropStatusList(res.data.content.cropStatus || []))
      .catch(() => setCropStatusList([]));
  }, []);

  useEffect(() => {
    api
      .get(baseURLMasterData + `grainageMaster/get-all`)
      .then((res) => setGrainageList(res.data.content.grainageMaster || []))
      .catch(() => setGrainageList([]));
  }, []);

  const handleFarmerInput = (e) => {
    const { name, value } = e.target;
    setFarmer((prev) => ({ ...prev, [name]: value }));
  };

  const searchFarmer = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      setValidatedSearch(true);
      return;
    }
    setValidatedSearch(false);
    setFarmerDetails(null);
    setInspectionList([]);
    setEditData(null);
    setSearchLoading(true);

    api
      .post(
        baseURLRegistration +
          `farmer/get-farmer-details-by-fruits-id-or-mobile-number-or-csb-register-number`,
        { text: farmer.text, type: farmer.select }
      )
      .then((response) => {
        const resData = response.data;

        if (resData?.errorMessages && resData.errorMessages.length > 0) {
          const apiMsg =
            resData.errorMessages[0]?.message?.[0]?.message ||
            resData.errorMessages[0]?.message ||
            "Validation error from server.";
          Swal.fire({ icon: "warning", title: "Not Found", text: apiMsg });
          setSearchLoading(false);
          return;
        }

        if (Array.isArray(resData) && resData.length > 0) {
          const found = resData[0];
          setFarmerDetails(found);
          loadInspectionList(found.farmerId);
          setSearchLoading(false);
        } else {
          Swal.fire({ icon: "warning", title: "Details not Found", text: "No details found" });
          setSearchLoading(false);
        }
      })
      .catch((err) => {
        const errData = err.response?.data;
        if (errData?.errorMessages && errData.errorMessages.length > 0) {
          const apiMsg =
            errData.errorMessages[0]?.message?.[0]?.message ||
            errData.errorMessages[0]?.message ||
            "Validation error from server.";
          Swal.fire({ icon: "warning", title: "Not Found", text: apiMsg });
        } else {
          Swal.fire({ icon: "warning", title: "Details not Found" });
        }
        setSearchLoading(false);
      });
  };

  const loadInspectionList = (farmerId) => {
    setListLoading(true);
    api
      .get(`${baseURL}cropInspection/getCropInspectionPath/${farmerId}`)
      .then((response) => {
        setInspectionList(response.data || []);
        setListLoading(false);
      })
      .catch(() => {
        setInspectionList([]);
        setListLoading(false);
      });
  };

  const handleEditClick = (row) => {
    const matchedGrainage = grainageList.find(g => g.grainageMasterName === row.grainageName);
    const matchedCropStatus = cropStatusList.find(c => c.name === row.cropStatusName);
    setEditData({
      cropInspectionId: row.fitnessCertificateId,
      farmerId: row.farmerId ?? farmerDetails?.farmerId ?? "",
      fruitsId: row.fruitsId || "",
      cropInspectionPath: row.cropInspectionPath || "",
      cropStatusId: matchedCropStatus ? String(matchedCropStatus.cropStatusId) : "",
      raceOfDfls: row.raceOfDfls ? String(row.raceOfDfls) : "",
      grainageMasterId: matchedGrainage ? String(matchedGrainage.grainageMasterId) : "",
      numbersOfDfls: row.numbersOfDfls || "",
      lotNumberRsp: row.lotNumberRsp || "",
      dflsSource: row.dflsSource || "",
      dateOfBrushing: row.dateOfBrushing ? row.dateOfBrushing.substring(0, 10) : "",
      spunFromDate: row.spunFromDate ? row.spunFromDate.substring(0, 10) : "",
      spunToDate: row.spunToDate ? row.spunToDate.substring(0, 10) : "",
      note: row.note || "",
    });
    setTimeout(() => editFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const handleEditInput = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = () => {
    setSaving(true);
    api
      .post(`${baseURL}cropInspection/editCropInspectionDetails`, {
        cropInspectionId: editData.cropInspectionId,
        farmerId: editData.farmerId,
        fruitsId: editData.fruitsId,
        cropInspectionPath: editData.cropInspectionPath,
        note: editData.note,
        cropStatusId: editData.cropStatusId,
        raceOfDfls: editData.raceOfDfls,
        grainageMasterId: editData.grainageMasterId,
        numbersOfDfls: editData.numbersOfDfls,
        lotNumberRsp: editData.lotNumberRsp,
        dflsSource: editData.dflsSource,
        dateOfBrushing: editData.dateOfBrushing,
        spunFromDate: editData.spunFromDate,
        spunToDate: editData.spunToDate,
      })
      .then((response) => {
        setSaving(false);
        if (response.data.content?.error) {
          Swal.fire({ icon: "error", title: "Update failed", text: response.data.content.error_description || "Something went wrong!" });
        } else {
          Swal.fire({ icon: "success", title: "Updated successfully" }).then(() => {
            setEditData(null);
            if (farmerDetails?.farmerId) loadInspectionList(farmerDetails.farmerId);
          });
        }
      })
      .catch(() => {
        setSaving(false);
        Swal.fire({ icon: "error", title: "Update attempt was not successful", text: "Something went wrong!" });
      });
  };

  const labelStyle = { fontWeight: 600, color: "#444", fontSize: "0.875rem" };
  const inputStyle = { borderRadius: "8px", borderColor: "#d0dff0", fontSize: "0.875rem" };
  const readOnlyStyle = { ...inputStyle, background: "#f0f6ff", color: "#555", cursor: "not-allowed" };

  return (
    <Layout title={t("Crop Inspection Edit")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Crop Inspection Edit")}</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">{t("Home")}</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/seriui/crop-inspection-list">{t("Crop Inspection List")}</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {t("Edit Crop Inspection")}
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          <Block.HeadContent>
            <Link to="/seriui/crop-inspection-list" className="btn btn-primary d-none d-md-inline-flex">
              <Icon name="arrow-long-left" />
              <span>{t("Go To List")}</span>
            </Link>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-3">

        {/* ── Farmer Search ── */}
        <Card style={{ borderRadius: "12px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", border: "none", overflow: "hidden", marginBottom: "20px" }}>
          <Card.Header style={{ background: "linear-gradient(135deg, #1e67a8 0%, #0d4f8a 100%)", padding: "14px 24px" }}>
            <span style={{ color: "white", fontWeight: 700, fontSize: "1rem" }}>🔍 {t("Search Farmer")}</span>
          </Card.Header>
          <Card.Body style={{ padding: "20px 24px" }}>
            <Form noValidate validated={validatedSearch} onSubmit={searchFarmer}>
              <Form.Group as={Row} className="align-items-start g-3 mb-0">
                <Form.Label column lg={2} style={{ fontWeight: 600, fontSize: "13px", color: "#4a5568" }}>
                  {t("Search Farmer Details By")}
                </Form.Label>
                <Col lg={2}>
                  <Form.Select
                    name="select"
                    value={farmer.select}
                    onChange={handleFarmerInput}
                    style={{ borderRadius: "8px", border: "1.5px solid #d0d9e8", fontSize: "13px" }}
                  >
                    <option value="fruitsId">{t("Fruits Id")}</option>
                    <option value="mobileNumber">{t("Mobile Number")}</option>
                    <option value="farmerNumber">{t("RSCP Number")}</option>
                  </Form.Select>
                </Col>
                <Col lg={2}>
                  <Form.Control
                    name="text"
                    value={farmer.text}
                    onChange={handleFarmerInput}
                    type="text"
                    placeholder={t("Search")}
                    required
                    style={{ borderRadius: "8px", border: "1.5px solid #d0d9e8", fontSize: "13px" }}
                  />
                  <Form.Control.Feedback type="invalid">{t("Field Value is Required")}</Form.Control.Feedback>
                </Col>
                <Col lg={2}>
                  <Button
                    type="submit"
                    disabled={searchLoading}
                    style={{ background: "linear-gradient(135deg,#1e67a8,#2d9cdb)", border: "none", borderRadius: "8px", padding: "7px 22px", fontWeight: 700, fontSize: "13px", color: "#fff" }}
                  >
                    {searchLoading ? <span className="spinner-border spinner-border-sm me-1" /> : "🔍 "}
                    {t("Search")}
                  </Button>
                </Col>
              </Form.Group>
            </Form>
          </Card.Body>
        </Card>

        {/* ── Farmer Info ── */}
        {farmerDetails && (
          <Card style={{ borderRadius: "12px", border: "none", boxShadow: "0 2px 10px rgba(30,103,168,0.10)", marginBottom: "20px", overflow: "hidden" }}>
            <div style={{ background: "linear-gradient(135deg, #1e67a8 0%, #2d9cdb 100%)", padding: "12px 24px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "17px" }}>👤</span>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: "15px" }}>{t("Farmer Information")}</span>
              <span style={{ marginLeft: "auto", background: "rgba(255,255,255,0.2)", borderRadius: "20px", padding: "3px 14px", color: "#fff", fontSize: "12px", fontWeight: 600 }}>
                {farmerDetails.firstName} {farmerDetails.lastName || ""}
              </span>
            </div>
            <Card.Body style={{ padding: "14px 24px" }}>
              <Row className="g-3">
                {[
                  { label: t("Farmer Name"), value: `${farmerDetails.firstName || ""} ${farmerDetails.lastName || ""}` },
                  { label: t("Fruits ID"), value: farmerDetails.fruitsId },
                  { label: t("Mobile"), value: farmerDetails.mobileNumber },
                  { label: t("Village"), value: farmerDetails.villageName },
                ].map((f) => f.value ? (
                  <Col lg={3} md={6} key={f.label}>
                    <div style={{ background: "#f0f6ff", borderRadius: "8px", padding: "10px 14px" }}>
                      <div style={{ fontSize: "0.72rem", color: "#1e67a8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{f.label}</div>
                      <div style={{ fontSize: "0.9rem", color: "#1a1a2e", fontWeight: 600 }}>{f.value}</div>
                    </div>
                  </Col>
                ) : null)}
              </Row>
            </Card.Body>
          </Card>
        )}

        {/* ── Crop Inspection List ── */}
        {farmerDetails && (
          <Card style={{ borderRadius: "12px", border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", marginBottom: "20px", overflow: "hidden" }}>
            <Card.Header style={{ background: "linear-gradient(135deg, #1e67a8 0%, #0d4f8a 100%)", padding: "14px 24px" }}>
              <span style={{ color: "white", fontWeight: 700, fontSize: "1rem" }}>📋 {t("Crop Inspection List")}</span>
            </Card.Header>
            <Card.Body style={{ padding: 0 }}>
              {listLoading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "120px" }}>
                  <div className="spinner-border text-primary" role="status" />
                </div>
              ) : inspectionList.length === 0 ? (
                <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "120px", color: "#aaa" }}>
                  <span style={{ fontSize: "2rem" }}>📭</span>
                  <p className="mt-2 mb-0">{t("No crop inspection records found.")}</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table mb-0" style={{ fontSize: "0.875rem" }}>
                    <thead>
                      <tr style={{ background: "#f0f6ff" }}>
                        <th style={{ padding: "12px 16px", color: "#1e67a8", fontWeight: 700 }}>#</th>
                        <th style={{ padding: "12px 16px", color: "#1e67a8", fontWeight: 700 }}>{t("Fruits ID")}</th>
                        <th style={{ padding: "12px 16px", color: "#1e67a8", fontWeight: 700 }}>{t("Race")}</th>
                        <th style={{ padding: "12px 16px", color: "#1e67a8", fontWeight: 700 }}>{t("Grainage")}</th>
                        <th style={{ padding: "12px 16px", color: "#1e67a8", fontWeight: 700 }}>{t("Spun From")}</th>
                        <th style={{ padding: "12px 16px", color: "#1e67a8", fontWeight: 700 }}>{t("Lot No")}</th>
                        <th style={{ padding: "12px 16px", color: "#1e67a8", fontWeight: 700 }}>{t("Crop Inspection Path")}</th>
                        <th style={{ padding: "12px 16px", color: "#1e67a8", fontWeight: 700, textAlign: "center" }}>{t("Action")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inspectionList.map((row, index) => (
                        <tr
                          key={row.fitnessCertificateId}
                          style={{
                            borderBottom: "1px solid #f0f0f0",
                            background: editData?.cropInspectionId === row.fitnessCertificateId ? "#e8f0fe" : "white",
                          }}
                        >
                          <td style={{ padding: "11px 16px", color: "#888" }}>{index + 1}</td>
                          <td style={{ padding: "11px 16px" }}>{row.fruitsId || "—"}</td>
                          <td style={{ padding: "11px 16px" }}>{row.raceName || "—"}</td>
                          <td style={{ padding: "11px 16px" }}>{row.grainageName || "—"}</td>
                          <td style={{ padding: "11px 16px" }}>{row.spunFromDate ? row.spunFromDate.substring(0, 10) : "—"}</td>
                          <td style={{ padding: "11px 16px" }}>{row.lotNumberRsp || "—"}</td>
                          <td style={{ padding: "11px 16px", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.cropInspectionPath || "—"}</td>
                          <td style={{ padding: "10px 16px", textAlign: "center" }}>
                            <Button
                              size="sm"
                              onClick={() => handleEditClick(row)}
                              style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", border: "none", borderRadius: "6px", padding: "4px 14px", fontSize: "0.78rem", fontWeight: 600 }}
                            >
                              ✏️ {t("Edit")}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card.Body>
          </Card>
        )}

        {/* ── Edit Form ── */}
        {editData && (
          <Card
            ref={editFormRef}
            style={{ borderRadius: "12px", boxShadow: "0 2px 12px rgba(0,0,0,0.10)", border: "2px solid #1e67a8", overflow: "hidden" }}
          >
            <Card.Header style={{ background: "linear-gradient(135deg, #1e67a8 0%, #0d4f8a 100%)", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ color: "white", fontWeight: 700, fontSize: "1rem" }}>✏️ {t("Edit Crop Inspection")}</span>
              <button
                type="button"
                onClick={() => setEditData(null)}
                style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "6px", color: "white", padding: "4px 12px", cursor: "pointer", fontSize: "0.8rem" }}
              >
                ✕ {t("Close")}
              </button>
            </Card.Header>
            <Card.Body style={{ padding: "24px" }}>
              <Row className="g-4">
                <Col lg={4} md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>{t("Grainage")}</Form.Label>
                    <Form.Select name="grainageMasterId" value={editData.grainageMasterId} onChange={handleEditInput} style={{ ...inputStyle, padding: "9px 12px" }}>
                      <option value="">{t("Select Grainage")}</option>
                      {grainageList.map((g) => (
                        <option key={g.grainageMasterId} value={String(g.grainageMasterId)}>{g.grainageMasterName}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col lg={4} md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>{t("Race")}</Form.Label>
                    <Form.Select name="raceOfDfls" value={editData.raceOfDfls} onChange={handleEditInput} style={{ ...inputStyle, padding: "9px 12px" }}>
                      <option value="">{t("Select Race")}</option>
                      {raceList.map((r) => (
                        <option key={r.raceMasterId} value={String(r.raceMasterId)}>{r.raceMasterName}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col lg={4} md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>{t("Fruits ID")}</Form.Label>
                    <Form.Control name="fruitsId" value={editData.fruitsId} readOnly disabled style={readOnlyStyle} />
                  </Form.Group>
                </Col>

                <Col lg={4} md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>{t("Crop Status")}</Form.Label>
                    <Form.Select name="cropStatusId" value={editData.cropStatusId} onChange={handleEditInput} style={{ ...inputStyle, padding: "9px 12px" }}>
                      <option value="">{t("Select Crop Status")}</option>
                      {cropStatusList.map((c) => (
                        <option key={c.cropStatusId} value={String(c.cropStatusId)}>{c.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col lg={4} md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>{t("No. of DFLs")}</Form.Label>
                    <Form.Control name="numbersOfDfls" value={editData.numbersOfDfls} onChange={handleEditInput} type="text" placeholder={t("Enter No. of DFLs")} style={inputStyle} />
                  </Form.Group>
                </Col>

                <Col lg={4} md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>{t("Lot No")}</Form.Label>
                    <Form.Control name="lotNumberRsp" value={editData.lotNumberRsp} onChange={handleEditInput} type="text" placeholder={t("Enter Lot No")} style={inputStyle} />
                  </Form.Group>
                </Col>

                <Col lg={4} md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>{t("Rate per 100 DFLs")}</Form.Label>
                    <Form.Control name="dflsSource" value={editData.dflsSource} onChange={handleEditInput} type="number" placeholder={t("Enter Rate per 100 DFLs")} style={inputStyle} />
                  </Form.Group>
                </Col>

                <Col lg={4} md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>{t("Date of Brushing")}</Form.Label>
                    <Form.Control name="dateOfBrushing" value={editData.dateOfBrushing} onChange={handleEditInput} type="date" style={inputStyle} />
                  </Form.Group>
                </Col>

                <Col lg={4} md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>{t("Spun From Date")}</Form.Label>
                    <Form.Control name="spunFromDate" value={editData.spunFromDate} onChange={handleEditInput} type="date" style={inputStyle} />
                  </Form.Group>
                </Col>

                <Col lg={4} md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>{t("Spun To Date")}</Form.Label>
                    <Form.Control name="spunToDate" value={editData.spunToDate} onChange={handleEditInput} type="date" style={inputStyle} />
                  </Form.Group>
                </Col>

                <Col lg={4} md={6}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>{t("Crop Inspection Path")}</Form.Label>
                    <Form.Control name="cropInspectionPath" value={editData.cropInspectionPath} readOnly disabled style={readOnlyStyle} />
                  </Form.Group>
                </Col>

                <Col lg={12}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>{t("Note")}</Form.Label>
                    <Form.Control as="textarea" rows={2} name="note" value={editData.note} onChange={handleEditInput} placeholder={t("Enter Note")} style={{ ...inputStyle, resize: "none" }} />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer style={{ background: "#fafbff", borderTop: "1px solid #eef0f5", padding: "14px 24px", display: "flex", justifyContent: "center", gap: "12px" }}>
              <Button
                type="button"
                onClick={saveEdit}
                disabled={saving}
                style={{ background: "linear-gradient(135deg, #1e67a8, #0d4f8a)", border: "none", borderRadius: "8px", padding: "9px 32px", fontWeight: 700, fontSize: "0.9rem", minWidth: "120px" }}
              >
                {saving ? <><span className="spinner-border spinner-border-sm me-2" />{t("Updating...")}</> : t("Update")}
              </Button>
              <Button
                type="button"
                onClick={() => setEditData(null)}
                style={{ background: "#f1f3f5", border: "none", borderRadius: "8px", padding: "9px 28px", fontWeight: 600, fontSize: "0.9rem", color: "#555" }}
              >
                {t("Cancel")}
              </Button>
            </Card.Footer>
          </Card>
        )}
      </Block>
    </Layout>
  );
}

export default CropInspectionEdit;
