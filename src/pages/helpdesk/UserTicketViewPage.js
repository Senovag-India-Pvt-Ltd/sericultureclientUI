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
import { useTranslation } from "react-i18next";

const baseURLMaster = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL = process.env.REACT_APP_API_BASE_URL_HELPDESK;

function UserTicketView() {
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
  const [raiseTicket, setRaiseTicket] = useState({});
  const [loading, setLoading] = useState(false);

  // grabsthe id form the url and loads the corresponding data
  // useEffect(() => {
  // let findUser = data.find((item) => item.id === id);
  // setCaste(findUser);
  // }, [id, data]);

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `hdTicket/get-join/${id}`)
      .then((response) => {
        setRaiseTicket(response.data.content);
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
  const handleListInput = (e) => {
    // debugger;
    name = e.target.name;
    value = e.target.value;
    setRaiseTicket({ ...raiseTicket, [name]: value });
  };

  // ---------- Attachment helpers ----------
  const mimeByExtension = (fileName) => {
    const ext = (fileName || "").split(".").pop().toLowerCase();
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

  // Inline preview URL for the attached file
  const [selectedFile, setSelectedFile] = useState(null);

  const getFile = async (file) => {
    const parameters = `fileName=${encodeURIComponent(file)}`;
    try {
      const response = await api.get(
        baseURL + `api/s3/download?${parameters}`,
        { responseType: "arraybuffer" }
      );
      const mime = mimeByExtension(file);
      const blob = new Blob([response.data], { type: mime });
      const url = URL.createObjectURL(blob);
      setSelectedFile(url);
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  };

  // Auto-load the file for inline preview when the ticket arrives
  useEffect(() => {
    if (raiseTicket?.hdAttachFiles) {
      getFile(raiseTicket.hdAttachFiles);
    } else {
      setSelectedFile(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raiseTicket?.hdAttachFiles]);

  const downloadHdAttachFile = async (file) => {
    if (!file) {
      console.error("No file provided for download");
      return;
    }

    try {
      const parameters = `fileName=${encodeURIComponent(file)}`;
      const response = await api.get(baseURL + `api/s3/download?${parameters}`, {
        responseType: "arraybuffer",
      });

      const mime = mimeByExtension(file);
      const blob = new Blob([response.data], { type: mime });
      const url = URL.createObjectURL(blob);

      const fileParts = file.split("/");
      const fileName = (fileParts[fileParts.length - 1] || "download").replace(/_([^_]*)$/, ".$1");

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const openFileInNewTab = () => {
    if (!selectedFile) return;
    window.open(selectedFile, "_blank", "noopener,noreferrer");
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
  ];

  const attachedFileName = raiseTicket?.hdAttachFiles;
  const attachedFileKind = attachedFileName ? fileKind(attachedFileName) : null;
  const displayFileName = attachedFileName
    ? attachedFileName.replace(/_([^_]*)$/, ".$1")
    : "";

  return (
    <Layout title="View User Ticket Details">
      <style>{`
        .user-ticket-view .form-control,
        .user-ticket-view .form-select {
          border: 1px solid #d4e0ee;
          border-radius: 10px;
          padding: 9px 14px;
          font-size: 13.5px;
          color: #2a3f5f;
          background: #ffffff;
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
                  {t("View User Ticket Details")}
                </h2>
                <span style={{ color: "#3b5278", fontSize: "13px", fontWeight: 500 }}>
                  {raiseTicket.ticketArn ? `${t("Ticket")} : ${raiseTicket.ticketArn}` : t("Your raised ticket details and the response")}
                </span>
              </div>
            </div>
          </Block.HeadContent>
          <Block.HeadContent>
            <Link
              to="/seriui/user-dashboard"
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

      <div className="user-ticket-view" style={{ marginTop: "8px" }}>
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
                          onClick={() => downloadHdAttachFile(attachedFileName)}
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
                        <div style={{ color: "#5a7299", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
                          <Icon name="loader" style={{ fontSize: "16px" }}></Icon>
                          {t("Loading file…")}
                        </div>
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

                {raiseTicket.solution && (
                  <div
                    style={{
                      marginTop: "16px",
                      padding: "18px 22px",
                      background: "linear-gradient(135deg, #e6f6ea 0%, #d4ecda 100%)",
                      border: "1px solid #b6dabc",
                      borderRadius: "14px",
                      boxShadow: "0 4px 14px rgba(31, 122, 54, 0.12)",
                    }}
                  >
                    <div className="d-flex align-items-center" style={{ gap: "10px", marginBottom: "10px" }}>
                      <span
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "10px",
                          background: "linear-gradient(135deg, #34a853 0%, #1f7a36 100%)",
                          color: "#ffffff",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 4px 12px rgba(31, 122, 54, 0.30)",
                        }}
                      >
                        <Icon name="check-circle-fill" style={{ fontSize: "18px" }}></Icon>
                      </span>
                      <div>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: "#1f7a36", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                          {t("Resolution from Support")}
                        </div>
                        <div style={{ fontSize: "11.5px", color: "#3b6a45", fontWeight: 500 }}>
                          {t("Solution sent for your raised ticket")}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#1f4d28",
                        fontWeight: 600,
                        lineHeight: 1.55,
                        whiteSpace: "pre-wrap",
                        padding: "12px 14px",
                        background: "#ffffff",
                        border: "1px solid #c7e2cd",
                        borderRadius: "10px",
                      }}
                    >
                      {raiseTicket.solution}
                    </div>
                  </div>
                )}
              </>
            )}
          </Card.Body>
        </Card>
      </div>
    </Layout>
  );
}

export default UserTicketView;
