import { Card, Button, Form, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function SchemeDocumentList() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [listData, setListData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const getList = () => {
    setLoading(true);
    api
      .get(baseURL + `schemeDocumentMaster/get-all`)
      .then((response) => {
        setListData(response.data.content.schemeDocumentMaster || []);
        setLoading(false);
      })
      .catch(() => {
        setListData([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  const deleteConfirm = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "It will delete permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        api
          .delete(baseURL + `schemeDocumentMaster/delete/${id}`)
          .then(() => {
            getList();
            Swal.fire("Deleted", "You successfully deleted this record", "success");
          })
          .catch(() =>
            Swal.fire({ icon: "error", title: "Delete attempt was not successful", text: "Something went wrong!" })
          );
      } else {
        Swal.fire("Cancelled", "Your record is not deleted", "info");
      }
    });
  };

  const filtered = listData.filter((row) => {
    const q = search.toLowerCase();
    return (
      (row.schemeName || "").toLowerCase().includes(q) ||
      (row.subSchemeName || "").toLowerCase().includes(q) ||
      (row.documentMasterName || "").toLowerCase().includes(q)
    );
  });

  return (
    <Layout title="Scheme Document List">
      <style>{schemeDocumentListStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("Scheme Document List")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link to="/seriui/scheme-document" className="btn btn-primary btn-md d-md-none sh-cta-btn">
                    <Icon name="plus" />
                    <span>{t("Add New")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/seriui/scheme-document" className="btn btn-primary d-none d-md-inline-flex sh-cta-btn">
                    <Icon name="plus" />
                    <span>{t("Add New")}</span>
                  </Link>
                </li>
              </ul>
            </Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        <Card className="sh-section-card">
          <Card.Header className="sh-section-header sh-list-card-header">
            <span>
              <Icon name="list" />
              {t("Scheme Document List")}
            </span>
            <InputGroup style={{ width: "260px" }}>
              <InputGroup.Text style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "white" }}>
                🔍
              </InputGroup.Text>
              <Form.Control
                placeholder={t("Search...")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  color: "white",
                  fontSize: "0.875rem",
                }}
              />
            </InputGroup>
          </Card.Header>
          <Card.Body style={{ padding: "0" }}>
            {loading ? (
              <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                <div className="spinner-border text-primary" role="status" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "180px", color: "#aaa" }}>
                <span style={{ fontSize: "2.5rem" }}>📂</span>
                <p className="mt-2 mb-0">{t("No records found.")}</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table mb-0" style={{ fontSize: "0.875rem" }}>
                  <thead>
                    <tr style={{ background: "#f0f6ff" }}>
                      <th style={{ padding: "12px 16px", color: "#1e67a8", fontWeight: 700, whiteSpace: "nowrap" }}>#</th>
                      <th style={{ padding: "12px 16px", color: "#1e67a8", fontWeight: 700 }}>{t("Scheme")}</th>
                      <th style={{ padding: "12px 16px", color: "#1e67a8", fontWeight: 700 }}>{t("Sub Scheme")}</th>
                      <th style={{ padding: "12px 16px", color: "#1e67a8", fontWeight: 700 }}>{t("Document")}</th>
                      <th style={{ padding: "12px 16px", color: "#1e67a8", fontWeight: 700, textAlign: "center" }}>{t("Actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((row, index) => (
                      <tr
                        key={row.schemeDocumentId}
                        style={{ borderBottom: "1px solid #f0f0f0", transition: "background 0.15s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fbff")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                      >
                        <td style={{ padding: "12px 16px", color: "#888", fontWeight: 600 }}>{index + 1}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <span
                            style={{
                              background: "#e8f0fe",
                              color: "#1e67a8",
                              padding: "3px 10px",
                              borderRadius: "20px",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                            }}
                          >
                            {(i18n.language === "kn"
                              ? row.schemeNameInKannada || row.schemeName
                              : row.schemeName) || "—"}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", color: "#444" }}>
                          {(i18n.language === "kn"
                            ? row.subSchemeNameInKannada || row.subSchemeName
                            : row.subSchemeName) || "—"}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span
                            style={{
                              background: "#e6f4ea",
                              color: "#2e7d32",
                              padding: "3px 10px",
                              borderRadius: "20px",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                            }}
                          >
                            {row.documentMasterName || "—"}
                          </span>
                        </td>
                        <td style={{ padding: "10px 16px", textAlign: "center", whiteSpace: "nowrap" }}>
                          <Button
                            size="sm"
                            onClick={() => navigate(`/seriui/scheme-document-view/${row.schemeDocumentId}`)}
                            style={{
                              background: "linear-gradient(135deg, #1e67a8, #0d4f8a)",
                              border: "none",
                              borderRadius: "6px",
                              padding: "4px 12px",
                              fontSize: "0.78rem",
                              marginRight: "6px",
                            }}
                          >
                            {t("View")}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => navigate(`/seriui/scheme-document-edit/${row.schemeDocumentId}`)}
                            style={{
                              background: "linear-gradient(135deg, #f59e0b, #d97706)",
                              border: "none",
                              borderRadius: "6px",
                              padding: "4px 12px",
                              fontSize: "0.78rem",
                              marginRight: "6px",
                            }}
                          >
                            {t("Edit")}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => deleteConfirm(row.schemeDocumentId)}
                            style={{
                              background: "linear-gradient(135deg, #ef4444, #dc2626)",
                              border: "none",
                              borderRadius: "6px",
                              padding: "4px 12px",
                              fontSize: "0.78rem",
                            }}
                          >
                            {t("Delete")}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card.Body>
          {!loading && filtered.length > 0 && (
            <Card.Footer style={{ background: "#fafbff", borderTop: "1px solid #eef0f5", padding: "10px 20px", fontSize: "0.82rem", color: "#888" }}>
              {t("Showing")} <strong>{filtered.length}</strong> {t("of")} <strong>{listData.length}</strong> {t("records")}
            </Card.Footer>
          )}
        </Card>
      </Block>
    </Layout>
  );
}

const schemeDocumentListStyles = `
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
  .sh-cta-btn {
    background: #ffffff;
    color: #1e67a8 !important;
    border: none;
    box-shadow: 0 4px 12px rgba(12, 40, 68, 0.25);
    font-weight: 700;
    padding: 8px 18px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
  }
  .sh-cta-btn:hover {
    background: #eef6ff;
    color: #1e67a8 !important;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(12, 40, 68, 0.32);
  }
  .sh-form-wrap {
    background: #eef2f8;
    border-radius: 14px;
    padding: 18px;
  }
  .sh-form-wrap .card,
  .sh-section-card {
    border: none;
    border-radius: 12px !important;
    box-shadow: 0 4px 14px rgba(30, 103, 168, 0.1);
    overflow: hidden;
  }
  .sh-section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 700 !important;
    font-size: 1rem !important;
    letter-spacing: 0.3px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border-left: none !important;
    border-bottom: none !important;
    color: #ffffff !important;
    padding: 14px 20px !important;
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
  .sh-list-card-header {
    justify-content: space-between;
  }
  .sh-list-card-header span {
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }
`;

export default SchemeDocumentList;
