import { Card, Button, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useMemo } from "react";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const ITEMS_PER_PAGE = 5;

function ScCategoryList() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [rawData, setRawData]         = useState([]);
  const [loading, setLoading]         = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const getList = () => {
    setLoading(true);
    api
      .get(baseURL + `scCategory/list`, { params: { pageNumber: 0, size: 1000 } })
      .then((res) => {
        setRawData(res.data.content.scCategory || []);
        setLoading(false);
      })
      .catch(() => {
        setRawData([]);
        setLoading(false);
      });
  };

  useEffect(() => { getList(); }, []);

  // Each item from /list now has a `mappings` array — use it directly
  const groupedData = useMemo(() => {
    return rawData.map((item) => ({
      scCategoryId:         item.scCategoryId,
      categoryName:         item.categoryName,
      categoryNameInKannada: item.categoryNameInKannada,
      codeNumber:           item.codeNumber,
      description:          item.description,
      categoryShortName:    item.categoryShortName,
      mappings: (item.mappings || []).map((m) => ({
        scCategoryMappingId: m.scCategoryMappingId,
        schemeName:   m.schemeName,
        subSchemeName: m.subSchemeName,
        dbtCode:      m.dbtCode,
      })),
    }));
  }, [rawData]);

  const totalPages = Math.ceil(groupedData.length / ITEMS_PER_PAGE);

  const paginatedGroups = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return groupedData.slice(start, start + ITEMS_PER_PAGE);
  }, [groupedData, currentPage]);

  const tableRows = useMemo(() => {
    const rows = [];
    paginatedGroups.forEach((group, gi) => {
      group.mappings.forEach((m, mi) => {
        rows.push({
          isFirst:  mi === 0,
          rowSpan:  group.mappings.length,
          groupIdx: gi,
          scCategoryId: group.scCategoryId,
          categoryName: group.categoryName,
          categoryNameInKannada: group.categoryNameInKannada,
          codeNumber: group.codeNumber,
          description: group.description,
          categoryShortName: group.categoryShortName,
          schemeName: m.schemeName,
          subSchemeName: m.subSchemeName,
          dbtCode: m.dbtCode,
          mappingId: m.scCategoryMappingId,   // now uses mapping table ID
          totalMappings: group.mappings.length,
        });
      });
    });
    return rows;
  }, [paginatedGroups]);

  const handleEdit   = (id) => navigate(`/seriui/sc-category-edit/${id}`);

  const deleteMapping = (mappingId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "It will delete this scheme mapping permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        api.delete(baseURL + `scCategory/mapping/delete/${mappingId}`)
          .then(() => { getList(); Swal.fire("Deleted", "Scheme mapping deleted successfully", "success"); })
          .catch(() => Swal.fire({ icon: "error", title: "Delete failed", text: "Something went wrong!" }));
      } else {
        Swal.fire("Cancelled", "Your record is not deleted", "info");
      }
    });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const items = [];
    items.push(<Pagination.Prev key="prev" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} />);
    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <Pagination.Item key={i} active={i === currentPage} onClick={() => setCurrentPage(i)}>{i}</Pagination.Item>
      );
    }
    items.push(<Pagination.Next key="next" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} />);
    return (
      <div className="d-flex justify-content-between align-items-center px-3 py-2"
        style={{ borderTop: "1px solid #d0dff0", backgroundColor: "#f0f6ff", borderRadius: "0 0 14px 14px" }}>
        <span style={{ fontSize: "13px", color: "#1e67a8", fontWeight: 500 }}>
          {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, groupedData.length)} of {groupedData.length} categories
        </span>
        <Pagination size="sm" className="mb-0">{items}</Pagination>
      </div>
    );
  };

  const thStyle = {
    backgroundColor: "#1e67a8",
    color: "#fff",
    fontSize: "13px",
    fontWeight: 600,
    padding: "10px 10px",
    verticalAlign: "middle",
    whiteSpace: "nowrap",
    borderColor: "#1e67a8",
  };

  const tdBase = (isMapping = false) => ({
    padding: "9px 10px",
    verticalAlign: "middle",
    fontSize: "13px",
    color: "#333",
    borderColor: "#dee2e6",
    backgroundColor: isMapping ? "#f9fafb" : "#fff",
  });

  return (
    <Layout title="List of Sub Component">
      <style>{scCategoryListHeaderStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("List Of Sub Component")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link to="/seriui/sc-category" className="btn btn-primary btn-md d-md-none sh-cta-btn">
                    <Icon name="plus" /><span>{t("create")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/seriui/sc-category" className="btn btn-primary d-none d-md-inline-flex sh-cta-btn">
                    <Icon name="plus" /><span>{t("create")}</span>
                  </Link>
                </li>
              </ul>
            </Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4">
        <Card style={{
          borderRadius: "14px",
          overflow: "hidden",
          border: "none",
          boxShadow: "0 4px 20px rgba(30,103,168,0.13)",
        }}>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              <div className="spinner-border text-primary me-2" role="status" />
              <span className="text-muted">{t("Loading...")}</span>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-bordered mb-0" style={{ borderCollapse: "collapse" }}>
                  <thead>
                    {/* Level 1 — section labels */}
                    <tr>
                      <th colSpan={6} style={{ ...thStyle, textAlign: "center", borderRight: "2px solid #fff" }}>
                        {t("Category Details")}
                      </th>
                      <th colSpan={4} style={{ ...thStyle, textAlign: "center" }}>
                        {t("Scheme Wise Mapping")}
                      </th>
                    </tr>
                    {/* Level 2 — column names */}
                    <tr>
                      <th style={{ ...thStyle, width: "80px" }}>{t("Action")}</th>
                      <th style={thStyle}>{t("Sub Component")}</th>
                      <th style={thStyle}>{t("Sub Component in Kannada")}</th>
                      <th style={{ ...thStyle, width: "110px" }}>{t("Code Number")}</th>
                      <th style={{ ...thStyle, width: "110px" }}>{t("Short Name")}</th>
                      <th style={{ ...thStyle, borderRight: "2px solid #fff" }}>{t("Description")}</th>
                      <th style={{ ...thStyle, backgroundColor: "#145a8a" }}>{t("Scheme Name")}</th>
                      <th style={{ ...thStyle, backgroundColor: "#145a8a" }}>{t("Sub Scheme Name")}</th>
                      <th style={{ ...thStyle, backgroundColor: "#1e67a8", width: "90px" }}>{t("Dbt Code")}</th>
                      <th style={{ ...thStyle, backgroundColor: "#1e67a8", width: "90px" }}>{t("Action")}</th>
                    </tr>
                  </thead>

                  <tbody>
                    {tableRows.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="text-center py-4 text-muted" style={{ fontSize: "14px" }}>
                          {t("No records found")}
                        </td>
                      </tr>
                    ) : (
                      tableRows.map((row, idx) => (
                        <tr key={idx} style={{ borderTop: row.isFirst && idx !== 0 ? "2px solid #dee2e6" : undefined }}>

                          {/* ── Merged category columns ── */}
                          {row.isFirst && (
                            <>
                              <td rowSpan={row.rowSpan} style={{ ...tdBase(), textAlign: "center" }}>
                                <Button variant="primary" size="sm" onClick={() => handleEdit(row.scCategoryId)}>
                                  {t("Edit")}
                                </Button>
                              </td>
                              <td rowSpan={row.rowSpan} style={{ ...tdBase(), fontWeight: 600, color: "#1e67a8" }}>
                                {row.categoryName || "-"}
                                <div style={{ fontSize: "11px", color: "#888", fontWeight: 400, marginTop: "2px" }}>
                                  {row.totalMappings} {row.totalMappings === 1 ? "scheme" : "schemes"}
                                </div>
                              </td>
                              <td rowSpan={row.rowSpan} style={tdBase()}>{row.categoryNameInKannada || "-"}</td>
                              <td rowSpan={row.rowSpan} style={tdBase()}>{row.codeNumber || "-"}</td>
                              <td rowSpan={row.rowSpan} style={tdBase()}>{row.categoryShortName || "-"}</td>
                              <td rowSpan={row.rowSpan} style={{ ...tdBase(), borderRight: "2px solid #dee2e6" }}>{row.description || "-"}</td>
                            </>
                          )}

                          {/* ── Scheme columns ── */}
                          <td style={tdBase(true)}>{row.schemeName || "-"}</td>
                          <td style={tdBase(true)}>{row.subSchemeName || "-"}</td>
                          <td style={{ ...tdBase(true), textAlign: "center", fontWeight: 600 }}>{row.dbtCode || "-"}</td>
                          <td style={{ ...tdBase(true), textAlign: "center" }}>
                            <Button variant="danger" size="sm" onClick={() => deleteMapping(row.mappingId)}>
                              {t("delete")}
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {renderPagination()}
            </>
          )}
        </Card>
      </Block>
    </Layout>
  );
}

const scCategoryListHeaderStyles = `
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
    transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
  }
  .sh-cta-btn:hover {
    background: #eef6ff;
    color: #1e67a8 !important;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(12, 40, 68, 0.32);
  }
`;

export default ScCategoryList;
