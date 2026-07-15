import { Card, Form, Row, Col, Button, CardBody } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useState, useEffect } from "react";
// import axios from "axios";
import api from "../../../src/services/auth/api";
import { Icon, Select } from "../../components";
import HelpDeskFaqView from "../../pages/helpdesk/HelpDeskFaqView";
import HelpDeskFaqComponent from "./HelpDeskFaqComponent";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
const baseURLMaster = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL = process.env.REACT_APP_API_BASE_URL_HELPDESK;

function RaiseTicketView() {
  // Translation
  const { t } = useTranslation();
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(CasteDatas);
  const [raiseTicket, setRaiseTicket] = useState({
    solution: "",
    hdSeverityId: "",
    assignedTo: "",
    userMasterId: "",
  });
  const [loading, setLoading] = useState(false);

  const [hideByStatus, setHideByStatus] = useState(false);

  const getIdList = () => {
    setLoading(true);
    api
      .get(baseURL + `hdTicket/get-join/${id}`)
      .then((response) => {
 if (response.data.content.hdStatusId === 3) {
  setHideByStatus(true);
} else {
  setHideByStatus(false);
}

        setRaiseTicket((prev) => ({ ...prev, ...response.data.content }));
        setLoading(false);
      })
      .catch((err) => {
        setRaiseTicket({});
        setLoading(false);
      });
  };

  //console.log(Caste);

  useEffect(() => {
    getIdList();
  }, [id]);

  //   const handleListInput = (e, row) => {
  //     // debugger;
  //     let { name, value } = e.target;
  //     const updatedRow = { ...row, [name]: value };
  //     const updatedDataList = raiseTicket.map((rowData) =>
  //       rowData.hdTicketId === row.hdTicketId ? updatedRow : rowData
  //     );
  //     setRaiseTicket(updatedDataList);
  //   };

  let name, value;
  const handleInput = (e) => {
    // debugger;
    name = e.target.name;
    value = e.target.value;
    setRaiseTicket({ ...raiseTicket, [name]: value });
  };

  const [escalate, setEscalate] = useState("0");
  const handleEscalateInput = (e) => {
    // debugger;
    let value = e.target.value;
    setEscalate(value);
  };

const [HelpDesks, setHelpDesks] = useState({});
  const getPhotoList = () => {
      setLoading(true);
      api
        .get(baseURL + `hdTicket/get-join/${id}`)
        .then((response) => {
          setHelpDesks(response.data.content);
          if (response.data.content.hdAttachFiles) {
            getFile(response.data.content.hdAttachFiles);
          }
          setLoading(false);
        })
        .catch((err) => {
          setHelpDesks({});
          setLoading(false);
        });
    };

    // ---------- Attachment helpers ----------
      const mimeByExtension = (fileName) => {
        // Normalize: backend stores "file_jpg" with underscore — convert to "file.jpg"
        const normalized = (fileName || "").replace(/_([^_.]+)$/, ".$1");
        const ext = normalized.split(".").pop().toLowerCase();
        const map = {
          pdf: "application/pdf",
          png: "image/png",
          jpg: "image/jpeg",
          jpeg: "image/jpeg",
          gif: "image/gif",
          webp: "image/webp",
          bmp: "image/bmp",
          svg: "image/svg+xml",
          txt: "text/plain",
          csv: "text/csv",
          doc: "application/msword",
          docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          xls: "application/vnd.ms-excel",
          xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          ppt: "application/vnd.ms-powerpoint",
          pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          zip: "application/zip",
        };
        return map[ext] || "application/octet-stream";
      };

      const fileKind = (fileName) => {
        const mime = mimeByExtension(fileName);
        if (mime.startsWith("image/")) return "image";
        if (mime === "application/pdf") return "pdf";
        return "other";
      };

      // To get Photo
      const [selectedFile, setSelectedFile] = useState(null);
      const [selectedFileMime, setSelectedFileMime] = useState("");
      const [fileLoadError, setFileLoadError] = useState(false);

      const getFile = async (file) => {
        if (!file) return;
        setFileLoadError(false);

        // If hdAttachFiles is already a full S3/HTTP URL, use it directly
        if (file.startsWith("http://") || file.startsWith("https://")) {
          const mime = mimeByExtension(file);
          setSelectedFile(file);
          setSelectedFileMime(mime);
          return;
        }

        const parameters = `fileName=${encodeURIComponent(file)}`;
        try {
          const response = await api.get(
            baseURL + `api/s3/download?${parameters}`,
            { responseType: "arraybuffer" }
          );

          if (!response.data || response.data.byteLength === 0) {
            console.warn("S3 download returned empty data for:", file);
            setFileLoadError(true);
            return;
          }

          const mime = mimeByExtension(file);
          const blob = new Blob([response.data], { type: mime });
          const url = URL.createObjectURL(blob);
          setSelectedFile(url);
          setSelectedFileMime(mime);
        } catch (error) {
          console.error("Error fetching file from S3:", error);
          setFileLoadError(true);
        }
      };

      useEffect(() => {
        getPhotoList();
      }, [id]);

      const downloadFile = async (file) => {
        const parameters = `fileName=${encodeURIComponent(file)}`;
        try {
          const response = await api.get(
            baseURL + `api/s3/download?${parameters}`,
            {
              responseType: "arraybuffer",
            }
          );
          const mime = mimeByExtension(file);
          const blob = new Blob([response.data], { type: mime });
          const url = URL.createObjectURL(blob);

          const link = document.createElement("a");
          link.href = url;

          // Restore the file extension that the backend stored as `_ext`
          const modifiedFileName = file.replace(/_([^_]*)$/, ".$1");

          link.download = modifiedFileName;

          document.body.appendChild(link);
          link.click();

          document.body.removeChild(link);
          // Release the URL after a short delay to let the browser start the download
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch (error) {
          console.error("Error fetching file:", error);
        }
      };

      const openFileInNewTab = () => {
        if (!selectedFile) return;
        window.open(selectedFile, "_blank", "noopener,noreferrer");
      };

  // to get Severity
  const [severityListData, setSeverityListData] = useState([]);

  const getSeverityList = () => {
    api
      .get(baseURLMaster + `hdSeverityMaster/get-all`)
      .then((response) => {
        setSeverityListData(response.data.content.hdSeverityMaster);
      })
      .catch((err) => {
        setSeverityListData([]);
      });
  };

  useEffect(() => {
    getSeverityList();
  }, []);

  // to get Status
  const [hdStatusListData, setHdStatusListData] = useState([]);

  const getStatusList = () => {
    api
      .get(baseURLMaster + `hdStatusMaster/get-all`)
      .then((response) => {
        setHdStatusListData(response.data.content.hdStatusMaster);
      })
      .catch((err) => {
        setHdStatusListData([]);
      });
  };

  useEffect(() => {
    getStatusList();
  }, []);

  // to get Escalate Users
  const [escalateListData, setEscalateListData] = useState([]);

  const getEscalateList = () => {
    const response = api
      .post(baseURLMaster + `userMaster/get-escalate-users`, {
        roleName: "escalate",
      })
      .then((response) => {
        setEscalateListData(response.data.content.userMaster);
      })
      .catch((err) => {
        setEscalateListData([]);
      });
  };

  useEffect(() => {
    getEscalateList();
  }, []);

  // Submit
  const submit = (esc) => {
    const { solution, hdSeverityId, hdTicketId } = raiseTicket;
    console.log(esc);
    let escalateDetails;
    if (esc === "0") {
      escalateDetails = {
        hdStatusId: 3,
      };
    } else {
      escalateDetails = {
        hdStatusId: 5,
      };
    }
    api
      .post(baseURL + `hdTicket/edit`, {
        ...raiseTicket,
        hdTicketId,
        solution,
        hdSeverityId,
        ...escalateDetails,
      })
      .then((response) => {
        if (esc === "1") {
          escalateSuccess();
          setRaiseTicket({
            userMasterId: "",
          });
        }
        if (esc === "0") {
          saveSuccess();
          setRaiseTicket({
            solution: "",
            hdSeverityId: "",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [show, setShow] = useState(false);
  const displaySeverity = () => {
    setShow((prev) => !prev);
  };

  const showAlert = (options) =>
    Swal.fire({
      buttonsStyling: false,
      width: 460,
      padding: "26px 24px 20px 24px",
      background: "#ffffff",
      backdrop: "rgba(15, 48, 96, 0.45)",
      confirmButtonText: "OK",
      customClass: {
        popup: "ticket-view-swal-popup",
        title: "ticket-view-swal-title",
        htmlContainer: "ticket-view-swal-html",
        confirmButton: "ticket-view-swal-confirm",
        icon: "ticket-view-swal-icon",
      },
      ...options,
    });

  const saveSuccess = () => {
    showAlert({
      icon: "success",
      title: "Solution Sent",
      html: `<div style="font-size:14px;color:#4a5b75;">The solution has been delivered to the user.</div>`,
    });
  };

  const escalateSuccess = () => {
    showAlert({
      icon: "success",
      title: "Ticket Escalated",
      html: `<div style="font-size:14px;color:#4a5b75;">The issue has been escalated to the selected user.</div>`,
    });
  };

  const ticketRows = [
    { label: t("Ticket Number"), value: raiseTicket.ticketArn, icon: "hash" },
    { label: t("ID"), value: raiseTicket.hdTicketId, icon: "tag" },
    { label: t("Module Name"), value: raiseTicket.hdModuleName, icon: "package" },
    { label: t("Feature"), value: raiseTicket.hdFeatureName, icon: "puzzle" },
    { label: t("Broad Category"), value: raiseTicket.hdBoardCategoryName, icon: "list-thumb" },
    { label: t("Category"), value: raiseTicket.hdCategoryName, icon: "folder" },
    { label: t("Sub Category"), value: raiseTicket.hdSubCategoryName, icon: "folder-list" },
    { label: t("Users Affected"), value: raiseTicket.hdUsersAffected, icon: "users" },
    { label: t("Contact Name"), value: raiseTicket.contactPerson, icon: "user" },
    { label: t("Contact Number"), value: raiseTicket.contactNumber, icon: "call" },
  ];

  const attachedFileName = raiseTicket.hdAttachFiles;
  const attachedFileKind = attachedFileName ? fileKind(attachedFileName) : null;
  const displayFileName = attachedFileName
    ? attachedFileName.replace(/_([^_]*)$/, ".$1")
    : "";

  return (
    <Layout title="View Raised Ticket Details">
      <style>{`
        .ticket-view .form-control,
        .ticket-view .form-select {
          border: 1px solid #d4e0ee;
          border-radius: 10px;
          padding: 9px 14px;
          font-size: 13.5px;
          color: #2a3f5f;
          background: #ffffff;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .ticket-view .form-control:focus,
        .ticket-view .form-select:focus {
          border-color: #1e67a8;
          box-shadow: 0 0 0 3px rgba(30, 103, 168, 0.15);
        }
        .ticket-view .form-label {
          font-weight: 600;
          color: #1a3c6e;
          font-size: 13px;
          margin-bottom: 6px;
        }
        .ticket-info-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          background: #ffffff;
          border: 1px solid #e3ecf7;
          border-radius: 10px;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          height: 100%;
        }
        .ticket-info-row:hover {
          border-color: #b9d2ec;
          box-shadow: 0 4px 12px rgba(15, 76, 138, 0.08);
        }
        .ticket-info-row .info-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #e8f1ff 0%, #d4e6ff 100%);
          color: #1e67a8;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .ticket-info-row .info-label {
          font-size: 11.5px;
          font-weight: 700;
          color: #5a7299;
          letter-spacing: 0.4px;
          text-transform: uppercase;
          line-height: 1.2;
        }
        .ticket-info-row .info-value {
          font-size: 14px;
          color: #0f3060;
          font-weight: 600;
          word-break: break-word;
          margin-top: 2px;
        }
        .ticket-view-swal-popup {
          border-radius: 16px !important;
          box-shadow: 0 20px 50px rgba(15, 48, 96, 0.25) !important;
        }
        .ticket-view-swal-title {
          color: #0f3060 !important;
          font-weight: 700 !important;
          font-size: 19px !important;
        }
        .ticket-view-swal-confirm {
          background: linear-gradient(135deg, #1e67a8 0%, #0f3060 100%) !important;
          color: #ffffff !important;
          border: none !important;
          font-weight: 700 !important;
          padding: 9px 26px !important;
          border-radius: 10px !important;
          box-shadow: 0 6px 16px rgba(15, 76, 138, 0.28) !important;
        }
      `}</style>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <div
              className="d-flex align-items-center"
              style={{
                gap: "14px",
                background: "rgba(255, 255, 255, 0.96)",
                border: "1px solid #e3ecf7",
                padding: "12px 18px",
                borderRadius: "14px",
                boxShadow: "0 4px 14px rgba(15, 76, 138, 0.12)",
                width: "fit-content",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #1e67a8 0%, #0f3060 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  boxShadow: "0 4px 12px rgba(15, 76, 138, 0.28)",
                  flexShrink: 0,
                }}
              >
                <Icon name="ticket" style={{ fontSize: "20px" }}></Icon>
              </div>
              <div style={{ lineHeight: 1.25 }}>
                <h2 style={{ color: "#0f3060", fontSize: "22px", fontWeight: 800, margin: 0, letterSpacing: "0.2px" }}>
                  {t("View Raised Ticket Details")}
                </h2>
                <span style={{ color: "#3b5278", fontSize: "13px", fontWeight: 500 }}>
                  {raiseTicket.ticketArn ? `${t("Ticket")} : ${raiseTicket.ticketArn}` : t("Review ticket information and respond")}
                </span>
              </div>
            </div>
          </Block.HeadContent>
          <Block.HeadContent>
            <Link
              to="/seriui/helpdesk-dashboard"
              className="d-inline-flex align-items-center"
              style={{
                background: "#ffffff",
                border: "1px solid #b9d2ec",
                color: "#1a3c6e",
                fontWeight: 600,
                padding: "10px 18px",
                borderRadius: "10px",
                gap: "8px",
                textDecoration: "none",
                boxShadow: "0 2px 6px rgba(15, 76, 138, 0.06)",
              }}
            >
              <Icon name="arrow-long-left" />
              <span>{t("Go To List")}</span>
            </Link>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <div className="ticket-view" style={{ marginTop: "8px" }}>
        <Card
          style={{
            border: "none",
            borderRadius: "16px",
            boxShadow: "0 6px 24px rgba(15, 76, 138, 0.10)",
            overflow: "hidden",
          }}
        >
          <Card.Header
            style={{
              background: "linear-gradient(135deg, #1e67a8 0%, #0d4f8a 100%)",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "15px",
              padding: "14px 22px",
              letterSpacing: "0.3px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              border: "none",
            }}
          >
            <Icon name="info" style={{ fontSize: "18px" }}></Icon>
            {t("Ticket Details")}
          </Card.Header>
          <Card.Body
            style={{
              background: "linear-gradient(135deg, #f8f9ff 0%, #eef3fc 100%)",
              padding: "22px",
            }}
          >
            {loading ? (
              <div className="d-flex justify-content-center align-items-center" style={{ padding: "40px", color: "#5a7299" }}>
                <Icon name="loader" style={{ fontSize: "20px", marginRight: "10px" }}></Icon>
                {t("Loading...")}
              </div>
            ) : (
              <>
                <Row className="g-3">
                  {ticketRows.map((r, idx) => (
                    <Col lg="6" md="6" sm="12" key={idx}>
                      <div className="ticket-info-row">
                        <span className="info-icon">
                          <Icon name={r.icon} style={{ fontSize: "16px" }}></Icon>
                        </span>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div className="info-label">{r.label}</div>
                          <div className="info-value">{r.value ?? "—"}</div>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>

                {(raiseTicket.query || raiseTicket.queryDetails) && (
                  <div
                    style={{
                      marginTop: "16px",
                      padding: "16px 18px",
                      background: "#ffffff",
                      border: "1px solid #e3ecf7",
                      borderRadius: "12px",
                      boxShadow: "0 2px 8px rgba(15, 76, 138, 0.05)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                      <Icon name="chat" style={{ fontSize: "16px", color: "#1a5fa8" }}></Icon>
                      <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#1a3c6e", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                        {t("Query")}
                      </span>
                    </div>
                    <div style={{ fontSize: "14px", color: "#0f3060", fontWeight: 600, marginBottom: raiseTicket.queryDetails ? "12px" : 0 }}>
                      {raiseTicket.query || "—"}
                    </div>
                    {raiseTicket.queryDetails && (
                      <>
                        <div style={{ fontSize: "11.5px", fontWeight: 700, color: "#5a7299", letterSpacing: "0.4px", textTransform: "uppercase", marginBottom: "6px" }}>
                          {t("Query Details")}
                        </div>
                        <div
                          style={{
                            fontSize: "13.5px",
                            color: "#2a3f5f",
                            lineHeight: 1.55,
                            whiteSpace: "pre-wrap",
                            padding: "10px 12px",
                            background: "#f7faff",
                            border: "1px solid #eef3fc",
                            borderRadius: "8px",
                          }}
                        >
                          {raiseTicket.queryDetails}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {attachedFileName && (
                  <div
                    style={{
                      marginTop: "16px",
                      padding: "16px 18px",
                      background: "#ffffff",
                      border: "1px solid #e3ecf7",
                      borderRadius: "12px",
                      boxShadow: "0 2px 8px rgba(15, 76, 138, 0.05)",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center flex-wrap" style={{ gap: "10px", marginBottom: "14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "10px",
                            background: "linear-gradient(135deg, #e8f1ff 0%, #d4e6ff 100%)",
                            color: "#1e67a8",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Icon
                            name={attachedFileKind === "image" ? "img" : attachedFileKind === "pdf" ? "file-pdf" : "file-text"}
                            style={{ fontSize: "16px" }}
                          ></Icon>
                        </span>
                        <div>
                          <div style={{ fontSize: "12.5px", fontWeight: 700, color: "#1a3c6e", letterSpacing: "0.4px", textTransform: "uppercase" }}>
                            {t("Attachment")}
                          </div>
                          <div style={{ fontSize: "13px", color: "#0f3060", fontWeight: 600, wordBreak: "break-all" }}>
                            {displayFileName}
                          </div>
                        </div>
                      </div>
                      <div className="d-flex" style={{ gap: "8px", flexWrap: "wrap" }}>
                        <Button
                          onClick={openFileInNewTab}
                          disabled={!selectedFile}
                          className="d-inline-flex align-items-center"
                          style={{
                            background: "#ffffff",
                            border: "1px solid #b9d2ec",
                            color: "#1a3c6e",
                            fontWeight: 600,
                            padding: "7px 14px",
                            borderRadius: "10px",
                            gap: "6px",
                            fontSize: "13px",
                            opacity: selectedFile ? 1 : 0.55,
                          }}
                        >
                          <Icon name="external" style={{ fontSize: "14px" }}></Icon>
                          {t("Open")}
                        </Button>
                        <Button
                          onClick={() => downloadFile(attachedFileName)}
                          className="d-inline-flex align-items-center"
                          style={{
                            background: "linear-gradient(135deg, #1e67a8 0%, #0f3060 100%)",
                            border: "none",
                            color: "#ffffff",
                            fontWeight: 600,
                            padding: "7px 14px",
                            borderRadius: "10px",
                            gap: "6px",
                            fontSize: "13px",
                            boxShadow: "0 4px 12px rgba(15, 76, 138, 0.22)",
                          }}
                        >
                          <Icon name="download" style={{ fontSize: "14px" }}></Icon>
                          {t("Download")}
                        </Button>
                      </div>
                    </div>

                    <div
                      style={{
                        background: "#f7faff",
                        border: "1px solid #eef3fc",
                        borderRadius: "10px",
                        padding: "14px",
                        minHeight: "120px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {!selectedFile ? (
                        fileLoadError ? (
                          <div style={{ textAlign: "center", padding: "20px" }}>
                            <div
                              style={{
                                width: "64px",
                                height: "64px",
                                borderRadius: "16px",
                                background: "linear-gradient(135deg, #fdecea 0%, #fcdbd6 100%)",
                                color: "#c0392b",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 4px 12px rgba(192, 57, 43, 0.18)",
                                marginBottom: "10px",
                              }}
                            >
                              <Icon name="alert-circle" style={{ fontSize: "28px" }}></Icon>
                            </div>
                            <div style={{ color: "#b02a1f", fontWeight: 600, fontSize: "13.5px" }}>
                              {t("The attached file could not be found")}
                            </div>
                            <div style={{ color: "#5a7299", fontSize: "12px", marginTop: "4px", wordBreak: "break-all" }}>
                              {displayFileName}
                            </div>
                          </div>
                        ) : (
                          <div style={{ color: "#5a7299", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
                            <Icon name="loader" style={{ fontSize: "16px" }}></Icon>
                            {t("Loading file…")}
                          </div>
                        )
                      ) : attachedFileKind === "image" ? (
                        <img
                          src={selectedFile}
                          alt={displayFileName}
                          style={{
                            maxWidth: "100%",
                            maxHeight: "480px",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(15, 76, 138, 0.12)",
                          }}
                        />
                      ) : attachedFileKind === "pdf" ? (
                        <embed
                          src={selectedFile}
                          type="application/pdf"
                          style={{
                            width: "100%",
                            height: "560px",
                            borderRadius: "8px",
                            border: "1px solid #dce8f5",
                          }}
                        />
                      ) : (
                        <div style={{ textAlign: "center", padding: "20px" }}>
                          <div
                            style={{
                              width: "64px",
                              height: "64px",
                              borderRadius: "16px",
                              background: "linear-gradient(135deg, #e8f1ff 0%, #d4e6ff 100%)",
                              color: "#1e67a8",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: "0 4px 12px rgba(15, 76, 138, 0.18)",
                              marginBottom: "10px",
                            }}
                          >
                            <Icon name="file-text" style={{ fontSize: "28px" }}></Icon>
                          </div>
                          <div style={{ color: "#1a3c6e", fontWeight: 600, fontSize: "13.5px" }}>
                            {t("Preview not available for this file type")}
                          </div>
                          <div style={{ color: "#5a7299", fontSize: "12px", marginTop: "4px" }}>
                            {t("Use the Download button to save it locally")}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </Card.Body>
        </Card>
      </div>
      <div className="mt-3">
        <Card
          style={{
            border: "none",
            borderRadius: "16px",
            boxShadow: "0 6px 24px rgba(15, 76, 138, 0.10)",
            overflow: "hidden",
          }}
        >
          <Card.Header
            style={{
              background: "linear-gradient(135deg, #1e67a8 0%, #0d4f8a 100%)",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "15px",
              padding: "14px 22px",
              letterSpacing: "0.3px",
              border: "none",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center" style={{ gap: "10px" }}>
                <Icon name="check-circle" style={{ fontSize: "18px" }}></Icon>
                {t("Solution")}
              </div>
              <div
                style={{
                  cursor: "pointer",
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.18)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.28)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
                onClick={displaySeverity}
                title={t("Toggle Severity field")}
              >
                <Icon name="view-row-wd"></Icon>
              </div>
            </div>
          </Card.Header>
          <Card.Body
            className="ticket-view"
            style={{
              background: "linear-gradient(135deg, #f8f9ff 0%, #eef3fc 100%)",
              padding: "22px",
            }}
          >
            <Row className="g-gs">
              <Col lg="4">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="status">{t("Status")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="hdStatusId"
                      value={raiseTicket.hdStatusId}
                      onChange={() => handleInput}
                      disabled
                      // onBlur={() => handleInputs}
                    >
                      <option value="">{t("Select Status")}</option>
                      {hdStatusListData.map((list) => (
                        <option key={list.hdStatusId} value={list.hdStatusId}>
                          {list.hdStatusName}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="4">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="escalation">
                    {t("Escalation Required")}
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="escalate"
                      value={escalate}
                      onChange={handleEscalateInput}
                    >
                      <option value="0">{t("No")}</option>
                      <option value="1">{t("Yes")}</option>
                    </Form.Select>
                  </div>
                </Form.Group>
              </Col>

              {show ? (
                <Col lg="4">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="severity">{t("Severity")}</Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="hdSeverityId"
                        value={raiseTicket.hdSeverityId}
                        onChange={() => handleInput}
                        // onBlur={() => handleInputs}
                      >
                        <option value="">{t("Select Severity")}</option>
                        {severityListData.map((list) => (
                          <option
                            key={list.hdSeverityId}
                            value={list.hdSeverityId}
                          >
                            {list.hdSeverityName}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                  </Form.Group>
                </Col>
              ) : (
                ""
              )}
            </Row>
            {escalate === "1" ? (
              <Row className="mt-2">
                {/* <Col lg="6">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="assignedTo">Assign To</Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="assignedTo"
                        name="assignedTo"
                        value={raiseTicket.assignedTo}
                        onChange={handleInput}
                        type="text"
                        placeholder="Enter Name"
                      />
                    </div>
                  </Form.Group>
                </Col> */}
                <Col lg="4">
                  <Form.Group className="form-group">
                    <Form.Label>
                      {t("Escalated To")}<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="userMasterId"
                        value={raiseTicket.userMasterId}
                        onChange={handleInput}
                        onBlur={() => handleInput}
                        // multiple
                        required
                        // isInvalid={
                        //   raiseTicket.userMasterId === undefined || raiseTicket.userMasterId === "0"
                        // }
                      >
                        <option value="">{t("Select Escalate To")}</option>
                        {escalateListData.map((list) => (
                          <option
                            key={list.userMasterId}
                            value={list.userMasterId}
                          >
                            {list.firstName}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            ) : (
              <Row className="mt-2">
                <Col lg="6">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="solution">{t("Solution")}</Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="solution"
                        name="solution"
                        value={raiseTicket.solution}
                        onChange={handleInput}
                        // type="text"
                        as="textarea"
                        rows={4}
                        placeholder={t("Enter Solutions")}
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            )}

            <div
              style={{
                marginTop: "16px",
                paddingTop: "16px",
                borderTop: "1px solid #dce8f5",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                type="button"
                onClick={() => submit(escalate)}
                disabled={hideByStatus}
                className="d-inline-flex align-items-center"
                style={{
                  background: hideByStatus
                    ? "#b9c4d6"
                    : "linear-gradient(135deg, #1e67a8 0%, #0f3060 100%)",
                  border: "none",
                  color: "#ffffff",
                  fontWeight: 700,
                  padding: "10px 24px",
                  borderRadius: "10px",
                  gap: "8px",
                  letterSpacing: "0.3px",
                  boxShadow: hideByStatus
                    ? "none"
                    : "0 6px 16px rgba(15, 76, 138, 0.28)",
                  cursor: hideByStatus ? "not-allowed" : "pointer",
                }}
              >
                <Icon name="send" style={{ fontSize: "16px" }}></Icon>
                {hideByStatus ? t("Ticket Closed") : t("Submit")}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Layout>
  );
}

export default RaiseTicketView;
