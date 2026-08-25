import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col, Button } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import ReelerLicenseDatas from "../../../store/reeler-license/ReelerLicenseData";
// import axios from "axios";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";


const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function ReelerLicenseView() {
   // Translation
   const { t } = useTranslation();

  const DetailGrid = ({ items }) => {
    const visible = items.filter((it) => it && it.show !== false);
    return (
      <div className="sh-detail-grid">
        {visible.map((it, i) => (
          <div className="sh-detail-cell" key={`${it.label}-${i}`}>
            <div className="sh-detail-label">{it.label}</div>
            <div className="sh-detail-value">
              {it.value !== undefined &&
              it.value !== null &&
              it.value !== "" ? (
                it.value
              ) : (
                <span className="sh-detail-empty">—</span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const { id } = useParams();
  // const [data] = useState(EducationDatas);
  const [Reeler, setReeler] = useState({});
  const [loading, setLoading] = useState(false);

  // const [vbAccount, setVbAccount] = useState({});
  // const [loadingVbAccount, setLoadingVbAccount] = useState(false);

  // // grabs the id form the url and loads the corresponding data
  // useEffect(() => {
  //   let findUser = data.find((item) => item.id === id);
  //   setDistrict(findUser);
  // }, [id, data]);

  const getIdList = () => {
    setLoading(true);
    api
      .get(baseURL2 + `reeler/get-by-reeler-id-join/${id}`)
      .then((response) => {
        setReeler(response.data.content);
        if (response.data.content.mahajarDetails) {
          getMahajarFile(response.data.content.mahajarDetails);
        }
        setLoading(false);
      })
      .catch((err) => {
        setReeler({});
        setLoading(false);
      });
  };

  const [vbAccountList, setVbAccountList] = useState([]);
  const getVbAccountDetailsList = () => {
    api
      .get(baseURL2 + `reeler-virtual-bank-account/get-by-reeler-id-join/${id}`)
      .then((response) => {
        setVbAccountList(response.data.content.reelerVirtualBankAccount);
      })
      .catch((err) => {
        const message = err.response.data.errorMessages[0].message[0].message;
        setVbAccountList([]);
        // editError(message);
      });
  };

  // Detect file type from extension
  const getFileType = (fileName) => {
    if (!fileName) return "unknown";
    const ext = fileName.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)) return "image";
    if (ext === "pdf") return "pdf";
    if (["mp4", "avi", "mov", "wmv", "mkv", "webm"].includes(ext)) return "video";
    return "other";
  };

  // Get clean display filename (strip timestamp prefix if any)
  const getDisplayName = (fileName) => {
    if (!fileName) return "";
    return fileName.replace(/_([^_]*)$/, ".$1");
  };

  // To get Photo/Doc from S3 Bucket
  const [selectedMahajarFile, setMahajarFile] = useState(null);
  const [mahajarFileType, setMahajarFileType] = useState("unknown");

  const getMahajarFile = async (file) => {
    const parameters = `fileName=${file}`;
    try {
      const response = await api.get(
        baseURL2 + `api/s3/download?${parameters}`,
        { responseType: "arraybuffer" }
      );
      const ext = file.split(".").pop().toLowerCase();
      const mimeMap = { pdf: "application/pdf", mp4: "video/mp4", mov: "video/quicktime", avi: "video/x-msvideo", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg" };
      const mime = mimeMap[ext] || "application/octet-stream";
      const blob = new Blob([response.data], { type: mime });
      const url = URL.createObjectURL(blob);
      setMahajarFile(url);
      setMahajarFileType(getFileType(file));
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  };

  useEffect(() => {
    getIdList();
    getVbAccountDetailsList();
  }, [id]);

  const downloadFile = async (file) => {
    const parameters = `fileName=${file}`;
    try {
      const response = await api.get(
        baseURL2 + `api/s3/download?${parameters}`,
        {
          responseType: "arraybuffer",
        }
      );
      const blob = new Blob([response.data]);
      const url = URL.createObjectURL(blob);

      const fileExtension = file.split(".").pop();

      const link = document.createElement("a");
      link.href = url;

      const modifiedFileName = file.replace(/_([^_]*)$/, ".$1");

      link.download = modifiedFileName;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  };

  // Date Formate
  const dateFormatter = (date) => {
    if (date) {
      return (
        new Date(date).getFullYear() +
        "-" +
        (new Date(date).getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        new Date(date).getDate().toString().padStart(2, "0")
      );
    } else {
      return "";
    }
  };

  return (
    <Layout title="Reeler License View">
      <style>{reelerViewStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("Reeler License View")}
              </Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/reeler-license-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/reeler-license-list"
                    className="btn btn-primary d-none d-md-inline-flex sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
              </ul>
            </Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-view-wrap">
        <Card className="sh-hero-card">
          <Card.Body>
            <Row className="g-3 align-items-center">
              <Col xs="auto">
                <div className="sh-avatar">
                  <Icon name="user-alt" />
                </div>
              </Col>
              <Col>
                <h3 className="sh-hero-name mb-1">{Reeler.reelerName || "—"}</h3>
                <div className="sh-chip-row">
                  {Reeler.fruitsId ? (
                    <span className="sh-chip sh-chip-primary">
                      <Icon name="hash" />
                      <span className="ms-1">{t("FRUITS")}: {Reeler.fruitsId}</span>
                    </span>
                  ) : null}
                  {Reeler.reelerNumber ? (
                    <span className="sh-chip sh-chip-info">
                      <Icon name="user-list" />
                      <span className="ms-1">
                        {t("Reeler Number")}: {Reeler.reelerNumber}
                      </span>
                    </span>
                  ) : null}
                  {Reeler.mobileNumber ? (
                    <span className="sh-chip sh-chip-success">
                      <Icon name="call" />
                      <span className="ms-1">{Reeler.mobileNumber}</span>
                    </span>
                  ) : null}
                  {Reeler.tscName ? (
                    <span className="sh-chip sh-chip-warning">
                      <Icon name="building" />
                      <span className="ms-1">{t("tsc")}: {Reeler.tscName}</span>
                    </span>
                  ) : null}
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="sh-section-card">
          <Card.Header className="sh-section-header">
            <Icon name="user" />
            <span>{t("Reeler Personal info")}</span>
          </Card.Header>
          <Card.Body>
            <DetailGrid
              items={[
                { label: t("FRUITS ID"), value: Reeler.fruitsId },
                { label: t("Reeler Id"), value: Reeler.reelerId },
                { label: t("Reeler Name"), value: Reeler.reelerName },
                { label: t("Father's/Husband's Name"), value: Reeler.fatherName },
                { label: t("DOB"), value: dateFormatter(Reeler.dob) },
                {
                  label: t("gender"),
                  value:
                    Reeler.gender === 1
                      ? "Male"
                      : Reeler.gender === 2
                        ? "Female"
                        : Reeler.gender
                          ? "Other"
                          : "",
                },
                { label: t("Caste"), value: Reeler.title },
                { label: t("mobile_number"), value: Reeler.mobileNumber },
                { label: t("email_id"), value: Reeler.emailId },
                { label: t("Aadhaar Number"), value: Reeler.aadhaarNumber },
                { label: t("Assign To Inspect"), value: Reeler.assignToInspectId },
                { label: t("ARN Number"), value: Reeler.arnNumber },
                { label: t("TSC"), value: Reeler.tscName },
                { label: t("Ward Number"), value: Reeler.wardNumber },
                { label: t("education"), value: Reeler.name },
                { label: t("ration_number"), value: Reeler.rationCard },
                {
                  label: t("Electricity RR Numbers"),
                  value: Reeler.electricityRrNumber,
                },
                {
                  label: t("Revenue Document (e-Khata / Reeling Unit)"),
                  value: Reeler.revenueDocument,
                },
                {
                  label: t("Recipient ID(From Khazane)"),
                  value: Reeler.recipientId,
                },
                { label: t("User Name"), value: Reeler.username },
                {
                  label: t("Representative/Agent name and Address"),
                  value: Reeler.representativeNameAddress,
                },
                {
                  label: t("GPS Coordinates of reeling unit"),
                  value:
                    Reeler.chakbandiLat || Reeler.chakbandiLng
                      ? `Latitude: ${Reeler.chakbandiLat || ""}, Longitude: ${Reeler.chakbandiLng || ""}`
                      : "",
                },
                { label: t("Select Reeler Type"), value: Reeler.reelerTypeMasterName },
                { label: t("passbook_number"), value: Reeler.passbookNumber },
                {
                  label: t("Reeling Unit Boundary(In Sqft)"),
                  value: Reeler.reelingUnitBoundary,
                },
                {
                  label: t("Date of Machine Installation"),
                  value: dateFormatter(Reeler.dateOfMachineInstallation),
                },
                { label: t("Select Machine Type"), value: Reeler.machineTypeName },
                {
                  label: t("Number of Basins/Charaka"),
                  value: Reeler.numberOfBasins,
                },
                { label: t("loan_details"), value: Reeler.loanDetails },
                {
                  label: t("Mahajar/Inspection Date"),
                  value: dateFormatter(Reeler.inspectionDate),
                },
              ]}
            />
            <div className="sh-file-block mt-3">
              <div className="sh-file-block-label">{t("Uploaded Document")}</div>
              <div className="sh-file-block-body">
                {Reeler.mahajarDetails ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <span style={{ fontSize: "12px", color: "#374151", fontWeight: "600", display: "flex", alignItems: "center", gap: "5px" }}>
                      {mahajarFileType === "image" ? "🖼" : mahajarFileType === "pdf" ? "📄" : mahajarFileType === "video" ? "🎬" : "📎"}
                      {getDisplayName(Reeler.mahajarDetails)}
                    </span>
                    {selectedMahajarFile && mahajarFileType === "image" && (
                      <img src={selectedMahajarFile} alt="Document" style={{ height: "90px", width: "90px", borderRadius: "6px", objectFit: "cover", border: "1px solid #dce8f5" }} />
                    )}
                    {selectedMahajarFile && mahajarFileType === "video" && (
                      <video src={selectedMahajarFile} controls style={{ height: "120px", borderRadius: "6px", border: "1px solid #dce8f5" }} />
                    )}
                    {selectedMahajarFile && mahajarFileType === "pdf" && (
                      <a href={selectedMahajarFile} target="_blank" rel="noreferrer" style={{ fontSize: "12px", color: "#1a5fa8" }}>Open PDF ↗</a>
                    )}
                    <Button
                      size="sm"
                      className="sh-download-btn"
                      variant="outline-primary"
                      onClick={() => downloadFile(Reeler.mahajarDetails)}
                      style={{ alignSelf: "flex-start" }}
                    >
                      <Icon name="download" />
                      <span className="ms-1">{t("Download File")}</span>
                    </Button>
                  </div>
                ) : (
                  <span style={{ color: "#9ca3af", fontSize: "12px" }}>No document uploaded</span>
                )}
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card className="sh-section-card mt-3">
          <Card.Header className="sh-section-header">
            <Icon name="map-pin" />
            <span>{t("address")}</span>
          </Card.Header>
          <Card.Body>
            <DetailGrid
              items={[
                { label: t("state"), value: Reeler.stateName },
                { label: t("district"), value: Reeler.districtName },
                { label: t("taluk"), value: Reeler.talukName },
                { label: t("hobli"), value: Reeler.hobliName },
                { label: t("village"), value: Reeler.villageName },
                { label: t("address"), value: Reeler.address },
                { label: t("pin_code"), value: Reeler.pincode },
              ]}
            />
          </Card.Body>
        </Card>

        <Card className="sh-section-card mt-3">
          <Card.Header className="sh-section-header">
            <Icon name="award" />
            <span>{t("License Details")}</span>
          </Card.Header>
          <Card.Body>
            <DetailGrid
              items={[
                { label: t("Receipt number"), value: Reeler.licenseReceiptNumber },
                { label: t("Receipt Date"), value: dateFormatter(Reeler.receiptDate) },
                {
                  label: t("Reeling License Number"),
                  value: Reeler.reelingLicenseNumber,
                },
                {
                  label: t("Member of RCS/FPO/Others"),
                  value: Reeler.memberLoanDetails,
                },
                {
                  label: t("License Expiry Date"),
                  value: dateFormatter(Reeler.licenseExpiryDate),
                },
                { label: t("Function of the Unit"), value: Reeler.functionOfUnit },
                { label: t("Fee Amount"), value: Reeler.feeAmount },
              ]}
            />
          </Card.Body>
        </Card>

        <Card className="sh-section-card mt-3">
          <Card.Header className="sh-section-header">
            <Icon name="crop" />
            <span>{t("Chakbandi Details")}</span>
          </Card.Header>
          <Card.Body>
            <DetailGrid
              items={[
                { label: t("East"), value: Reeler.mahajarEast },
                { label: t("West"), value: Reeler.mahajarWest },
                { label: t("North"), value: Reeler.mahajarNorth },
                { label: t("South"), value: Reeler.mahajarSouth },
              ]}
            />
          </Card.Body>
        </Card>

        <Card className="sh-section-card mt-3">
          <Card.Header className="sh-section-header">
            <Icon name="cc" />
            <span>{t("bank_account_details")}</span>
          </Card.Header>
          <Card.Body>
            <DetailGrid
              items={[
                { label: t("bank_name"), value: Reeler.bankName },
                { label: t("bank_account_number"), value: Reeler.bankAccountNumber },
                { label: t("branch_name"), value: Reeler.branchName },
                { label: t("ifsc_code"), value: Reeler.ifscCode },
              ]}
            />
          </Card.Body>
        </Card>
        {/* Documents Card */}
        {Reeler.mahajarDetails && (
          <Card className="sh-section-card mt-3" style={{ border: "1px solid #dce8f5", borderRadius: "10px", overflow: "hidden" }}>
            <Card.Header style={{ background: "linear-gradient(135deg, #1e67a8, #0d4f8a)", color: "#fff", fontWeight: "700", fontSize: "13.5px", padding: "10px 18px" }}>
              📁 {t("Uploaded Documents")}
            </Card.Header>
            <Card.Body style={{ background: "#f8faff", padding: "16px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                {[Reeler.mahajarDetails].filter(Boolean).map((fileName, idx) => {
                  const fileType = getFileType(fileName);
                  const displayName = getDisplayName(fileName);
                  return (
                    <div key={idx} style={{ background: "#fff", border: "1px solid #dce8f5", borderRadius: "10px", padding: "14px 16px", minWidth: "200px", maxWidth: "260px", boxShadow: "0 2px 8px rgba(26,95,168,0.07)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                        <span style={{ fontSize: "22px" }}>
                          {fileType === "image" ? "🖼️" : fileType === "pdf" ? "📄" : fileType === "video" ? "🎬" : "📎"}
                        </span>
                        <span style={{ fontSize: "12px", color: "#374151", fontWeight: "600", wordBreak: "break-all" }}>{displayName}</span>
                      </div>
                      {selectedMahajarFile && fileType === "image" && (
                        <img src={selectedMahajarFile} alt={displayName} style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "6px", marginBottom: "10px", border: "1px solid #e5eef8" }} />
                      )}
                      {selectedMahajarFile && fileType === "video" && (
                        <video src={selectedMahajarFile} controls style={{ width: "100%", borderRadius: "6px", marginBottom: "10px" }} />
                      )}
                      {selectedMahajarFile && fileType === "pdf" && (
                        <a href={selectedMahajarFile} target="_blank" rel="noreferrer" style={{ display: "block", fontSize: "12px", color: "#1a5fa8", marginBottom: "10px" }}>👁 {t("Open PDF in browser")} ↗</a>
                      )}
                      <Button
                        size="sm"
                        onClick={() => downloadFile(fileName)}
                        style={{ width: "100%", background: "linear-gradient(135deg, #1a5fa8, #0d4f8a)", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: "600", color: "#fff", padding: "6px 0" }}
                      >
                        ⬇ {fileType === "pdf" ? t("Download PDF") : fileType === "video" ? t("Download Video") : fileType === "image" ? t("Download Photo") : t("Download File")}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </Card.Body>
          </Card>
        )}

        <Card className="sh-section-card mt-3">
          <Card.Header className="sh-section-header">
            <Icon name="wallet" />
            <span>{t("Virtual Bank Account")}</span>
            {vbAccountList && vbAccountList.length > 0 ? (
              <span className="sh-count-badge ms-2">{vbAccountList.length}</span>
            ) : null}
          </Card.Header>
          <Card.Body>
            {vbAccountList && vbAccountList.length > 0 ? (
              <div className="sh-subgroup-stack">
                {vbAccountList.map((vbAccount, idx) => (
                  <div
                    className="sh-subgroup"
                    key={vbAccount.reelerVirtualBankAccountId}
                  >
                    <div className="sh-subgroup-title">
                      {t("Virtual Bank Account")} #{idx + 1}
                    </div>
                    <DetailGrid
                      items={[
                        {
                          label: t("Virtual Account Number"),
                          value: vbAccount.virtualAccountNumber,
                        },
                        { label: t("branch_name"), value: vbAccount.branchName },
                        { label: t("ifsc_code"), value: vbAccount.ifscCode },
                        { label: t("Market"), value: vbAccount.marketMasterName },
                      ]}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="sh-empty-section">
                <Icon name="wallet" />
                <p className="mt-2 mb-0">{t("No records found")}</p>
              </div>
            )}
          </Card.Body>
        </Card>
      </Block>
    </Layout>
  );
}

const reelerViewStyles = `
  .sh-page-header {
    padding: 20px 24px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border-radius: 12px;
    border: none;
    box-shadow: 0 6px 18px rgba(30, 103, 168, 0.22);
    margin-bottom: 22px;
  }
  .sh-page-title {
    margin-bottom: 4px;
    color: #ffffff !important;
    font-weight: 700;
    letter-spacing: 0.2px;
  }
  .sh-page-subtitle {
    color: rgba(255, 255, 255, 0.85);
    font-size: 13.5px;
  }
  .sh-cta-btn,
  .sh-edit-btn {
    background: #ffffff;
    border: none;
    color: #1e67a8 !important;
    box-shadow: 0 4px 12px rgba(12, 40, 68, 0.25);
    font-weight: 700;
    padding: 8px 18px;
    border-radius: 8px;
    transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
  }
  .sh-edit-btn {
    color: #1ea482 !important;
  }
  .sh-cta-btn:hover,
  .sh-edit-btn:hover {
    background: #eef6ff;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(12, 40, 68, 0.32);
  }
  .sh-edit-btn:hover {
    background: #eafaf5;
  }
  .sh-view-wrap {
    background: #eef2f8;
    border-radius: 14px;
    padding: 18px;
  }
  .sh-view-wrap .card {
    border: none;
    border-radius: 12px !important;
    box-shadow: 0 4px 14px rgba(30, 103, 168, 0.1);
    overflow: hidden;
    margin-bottom: 0;
  }
  .sh-hero-card {
    background: linear-gradient(135deg, #f5f9ff 0%, #eaf2fc 100%) !important;
    border: none !important;
    margin-bottom: 18px !important;
  }
  .sh-avatar {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    overflow: hidden;
    background: #fff;
    border: 3px solid #fff;
    box-shadow: 0 4px 14px rgba(30, 103, 168, 0.18);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .sh-avatar svg {
    width: 40px;
    height: 40px;
    color: #8a96a8;
  }
  .sh-hero-name {
    color: #1e2a44;
    font-weight: 700;
    letter-spacing: 0.2px;
  }
  .sh-chip-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 6px;
  }
  .sh-chip {
    display: inline-flex;
    align-items: center;
    padding: 5px 12px;
    border-radius: 999px;
    font-size: 12.5px;
    font-weight: 600;
    border: 1px solid transparent;
  }
  .sh-chip-primary {
    background: rgba(30, 103, 168, 0.1);
    color: #1e67a8;
    border-color: rgba(30, 103, 168, 0.18);
  }
  .sh-chip-info {
    background: rgba(38, 162, 210, 0.1);
    color: #1c7ba0;
    border-color: rgba(38, 162, 210, 0.18);
  }
  .sh-chip-success {
    background: rgba(45, 199, 163, 0.12);
    color: #14826a;
    border-color: rgba(45, 199, 163, 0.2);
  }
  .sh-chip-warning {
    background: rgba(238, 167, 67, 0.14);
    color: #a3681c;
    border-color: rgba(238, 167, 67, 0.22);
  }
  .sh-download-btn {
    border-radius: 8px;
    font-weight: 600;
    padding: 7px 14px;
  }
  .sh-section-card {
    margin-bottom: 18px !important;
  }
  .sh-section-header {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border-bottom: none !important;
    padding: 14px 20px !important;
    font-weight: 700 !important;
    color: #ffffff !important;
    font-size: 15px !important;
    letter-spacing: 0.2px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .sh-section-header svg,
  .sh-section-header .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.22);
    color: #ffffff;
    font-size: 15px;
  }
  .sh-count-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 22px;
    height: 22px;
    padding: 0 8px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.25);
    color: #ffffff;
    font-size: 12px;
    font-weight: 700;
  }
  .sh-view-wrap .card-body {
    padding: 20px !important;
  }
  .sh-empty-section {
    padding: 28px 12px;
    text-align: center;
    color: #8a96a8;
    font-size: 14px;
  }
  .sh-empty-section svg {
    width: 36px;
    height: 36px;
    opacity: 0.45;
  }
  .sh-detail-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    border: 1px solid #e6ecf4;
    border-radius: 10px;
    overflow: hidden;
    background: #fff;
  }
  .sh-detail-cell {
    display: grid;
    grid-template-columns: 42% 1fr;
    border-right: 1px solid #eef2f8;
    border-bottom: 1px solid #eef2f8;
    min-height: 40px;
  }
  .sh-detail-cell:nth-child(3n) {
    border-right: none;
  }
  .sh-detail-label {
    background-color: #f7faff;
    color: #4a5568;
    font-weight: 600;
    font-size: 13px;
    letter-spacing: 0.1px;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    border-right: 1px solid #eef2f8;
    line-height: 1.35;
  }
  .sh-detail-value {
    padding: 8px 12px;
    color: #2b3a55;
    font-size: 13.5px;
    display: flex;
    align-items: center;
    word-break: break-word;
    line-height: 1.4;
    transition: background-color 0.15s ease;
  }
  .sh-detail-cell:hover .sh-detail-value {
    background-color: #fbfdff;
  }
  .sh-detail-empty {
    color: #b0bac9;
    font-style: italic;
  }
  @media (max-width: 991px) {
    .sh-detail-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .sh-detail-cell:nth-child(3n) {
      border-right: 1px solid #eef2f8;
    }
    .sh-detail-cell:nth-child(2n) {
      border-right: none;
    }
  }
  @media (max-width: 575px) {
    .sh-detail-grid {
      grid-template-columns: 1fr;
    }
    .sh-detail-cell {
      grid-template-columns: 45% 1fr;
      border-right: none !important;
    }
  }
  .sh-subgroup-stack {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .sh-subgroup {
    border: 1px solid #eef2f8;
    border-radius: 10px;
    padding: 14px 16px;
    background: #fcfdff;
  }
  .sh-subgroup-title {
    font-size: 13.5px;
    font-weight: 700;
    color: #1e2a44;
    letter-spacing: 0.2px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
  }
  .sh-file-block {
    border: 1px solid #eef2f8;
    border-radius: 10px;
    padding: 12px 16px;
    background: #fcfdff;
  }
  .sh-file-block-label {
    font-size: 12.5px;
    font-weight: 700;
    color: #4a5568;
    letter-spacing: 0.3px;
    text-transform: uppercase;
    margin-bottom: 10px;
  }
  .sh-file-block-body {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
  }
`;

export default ReelerLicenseView;
