import { Card, Button, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { createTheme } from "react-data-table-component";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import SearchableSelect from "../../../components/SearchableSelect/SearchableSelect";
// import DataTable from "../../../components/DataTable/DataTable";
import DataTable from "react-data-table-component";
import StateDatas from "../../../store/masters/state/StateData";
import { useNavigate } from "react-router-dom";
import React from "react";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
// import axios from "axios";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ScApprovalStageList() {
  // Translation
  const { t } = useTranslation();

  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [stageFilter, setStageFilter] = useState("");
  const [checkboxFilters, setCheckboxFilters] = useState([]);

  const CHECKBOX_OPTIONS = [
    { label: "Inspection",          field: "inspection" },
    { label: "Work Order",          field: "workOrder" },
    { label: "Sanction Order",      field: "sanctionOrder" },
    { label: "Push to DBT",         field: "pushToDbt" },
    { label: "Directly To Fruits",  field: "directlyToFruits" },
    { label: "Financial Delegation",field: "financialDelegation" },
  ];

  const toggleCheckboxFilter = (field) => {
    setCheckboxFilters((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const filteredData = Array.isArray(listData)
    ? listData.filter((row) => {
        const matchStage = stageFilter === "" || row.stageName === stageFilter;
        const matchCheckbox =
          checkboxFilters.length === 0 ||
          checkboxFilters.every((field) => row[field] === true || row[field] === 1);
        return matchStage && matchCheckbox;
      })
    : [];

  const stageOptions = Array.isArray(listData)
    ? [...new Set(listData.map((r) => r.stageName).filter(Boolean))]
    : [];
  // Load ALL rows upfront so client-side filter works across all 307 records
  const getList = () => {
    setLoading(true);
    api
      .get(baseURL + `scApprovalStage/list`, { params: { pageNumber: 0, size: 5000 } })
      .then((response) => {
        setListData(response.data.content.scApprovalStage || []);
        setLoading(false);
      })
      .catch((err) => {
        setListData([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  const navigate = useNavigate();
  const handleView = (_id) => {
    navigate(`/seriui/sc-approval-stage-view/${_id}`);
  };

  const handleEdit = (_id) => {
    navigate(`/seriui/sc-approval-stage-edit/${_id}`);
    // navigate("/seriui/state");
  };

  const deleteError = () => {
    Swal.fire({
      icon: "error",
      title: "Delete attempt was not successful",
      text: "Something went wrong!",
    });
  };

  const deleteConfirm = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "It will delete permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        const response = api
          .delete(baseURL + `scApprovalStage/delete/${_id}`)
          .then((response) => {
            // deleteConfirm(_id);
            getList();
            Swal.fire(
              "Deleted",
              "You successfully deleted this record",
              "success"
            );
          })
          .catch((err) => {
            deleteError();
          });
        // Swal.fire("Deleted", "You successfully deleted this record", "success");
      } else {
        console.log(result.value);
        Swal.fire("Cancelled", "Your record is not deleted", "info");
      }
    });
  };

  createTheme(
    "solarized",
    {
      text: {
        primary: "#004b8e",
        secondary: "#2aa198",
      },
      background: {
        default: "#fff",
      },
      context: {
        background: "#cb4b16",
        text: "#FFFFFF",
      },
      divider: {
        default: "#d3d3d3",
      },
      action: {
        button: "rgba(0,0,0,.54)",
        hover: "rgba(0,0,0,.02)",
        disabled: "rgba(0,0,0,.12)",
      },
    },
    "light"
  );

  const customStyles = {
    table: { style: { borderRadius: "10px", overflow: "hidden", boxShadow: "0 2px 8px rgba(30, 103, 168, 0.06)" } },
    rows: {
      style: { minHeight: "52px", fontSize: "13.5px", color: "#2b2d42", borderBottom: "1px solid #eef1f6 !important", transition: "background-color 0.15s ease" },
      highlightOnHoverStyle: { backgroundColor: "#f4f8fd", cursor: "pointer", outline: "none" },
      stripedStyle: { backgroundColor: "#fbfcfe" },
    },
    headRow: { style: { minHeight: "50px", background: "linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%)", borderTopLeftRadius: "10px", borderTopRightRadius: "10px" } },
    headCells: {
      style: {
        backgroundColor: "transparent",
        color: "#fff",
        fontSize: "13px",
        fontWeight: 600,
        letterSpacing: "0.3px",
        textTransform: "uppercase",
        paddingLeft: "12px",
        paddingRight: "12px",
      },
    },
    cells: {
      style: {
        paddingLeft: "12px",
        paddingRight: "12px",
      },
    },
    pagination: { style: { borderTop: "1px solid #eef1f6", fontSize: "13px", color: "#5a6577" } },
  };

  const ScApprovalStageDataColumns = [
    {
      name:  t("Action"),
      cell: (row) => (
        //   Button style
        <div className="d-flex flex-nowrap align-items-center text-start w-100">
          {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleView(row.scApprovalStageId)}
            className="d-inline-flex align-items-center gap-1 shadow-sm text-nowrap"
          >
             <Icon name="eye" />
             {t("View")}
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="ms-2 d-inline-flex align-items-center gap-1 shadow-sm text-nowrap"
            onClick={() => handleEdit(row.scApprovalStageId)}
          >
              <Icon name="edit" />
              {t("Edit")}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.scApprovalStageId)}
            className="ms-2 d-inline-flex align-items-center gap-1 shadow-sm text-nowrap"
          >
            <Icon name="trash" />
            {t("delete")}
          </Button>
        </div>
      ),
      sortable: false,
      hide: "md",
      minWidth: "340px",
      grow: 0,
    },
    {
      name: t("Approval Stage"),
      selector: (row) => row.stageName,
      cell: (row) => <span>{row.stageName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Approval Stage Name in Kannada"),
      selector: (row) => row.stageNameInKannada,
      cell: (row) => <span>{row.stageNameInKannada}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Action"),
      selector: (row) => row.action,
      cell: (row) => <span>{row.action}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("ARM Stage Config"),
      selector: (row) => row.armStageConfig,
      cell: (row) => {
        const labels = {
          ESCROW_BANK:       "Escrow Bank Account Card",
          PROFORMA_INVOICE:  "Proforma Invoice Table",
          CSTRI_1:           "CSTRI (First Release)",
          CSTRI_2:           "CSTRI (Final Release)",
          ADVANCE_PAYMENT:   "Advance Payment Letter",
          FIRST_RELEASE:     "First Release Letter",
          SECOND_RELEASE:    "Second Release Letter",
        };
        return row.armStageConfig
          ? <span style={{ background: "#e3f0fb", color: "#1e67a8", padding: "2px 8px", borderRadius: 4, fontSize: 12, fontWeight: 600 }}>
              {labels[row.armStageConfig] || row.armStageConfig}
            </span>
          : <span style={{ color: "#aaa" }}>—</span>;
      },
      sortable: true,
      hide: "md",
    },
  ];

  return (
    <Layout title="List Of Approval Stages">
      <style>{scApprovalStageListStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("List Of Approval Stages")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/sc-approval-stage"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="plus" />
                    <span>{t("create")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/sc-approval-stage"
                    className="btn btn-primary d-none d-md-inline-flex sh-cta-btn"
                  >
                    <Icon name="plus" />
                    <span>{t("create")}</span>
                  </Link>
                </li>
              </ul>
            </Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        <Card>
          {/* ── Filter Row ── */}
          <div
            style={{
              background: "#f0f5fb",
              borderBottom: "2px solid #1e67a8",
              padding: "14px 18px",
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
              alignItems: "flex-end",
            }}
          >
            {/* Dropdown 1: Filter by Approval Stage */}
            <div style={{ display: "flex", flexDirection: "column", minWidth: "240px" }}>
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#1e67a8",
                  marginBottom: "4px",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {t("Approval Stage")}
              </label>
              <SearchableSelect
                options={stageOptions}
                value={stageFilter}
                onChange={setStageFilter}
                placeholder="All Stages"
              />
            </div>

            {/* Dropdown 2: Filter by Checkbox/Action flags */}
            <div style={{ display: "flex", flexDirection: "column", minWidth: "220px" }}>
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#1e67a8",
                  marginBottom: "4px",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {t("Filter By Action")}
              </label>
              <Dropdown>
                <Dropdown.Toggle
                  style={{
                    fontSize: "13px",
                    border: "1.5px solid #1e67a8",
                    borderRadius: "6px",
                    color: checkboxFilters.length > 0 ? "#fff" : "#004b8e",
                    background: checkboxFilters.length > 0 ? "#1e67a8" : "#fff",
                    padding: "5px 10px",
                    width: "100%",
                    textAlign: "left",
                    boxShadow: "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  variant=""
                >
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "180px" }}>
                    {checkboxFilters.length === 0
                      ? "Select Actions"
                      : `${checkboxFilters.length} selected`}
                  </span>
                </Dropdown.Toggle>
                <Dropdown.Menu
                  style={{
                    padding: "10px 14px",
                    minWidth: "220px",
                    border: "1.5px solid #1e67a8",
                    borderRadius: "6px",
                    boxShadow: "0 4px 16px rgba(30,103,168,0.15)",
                  }}
                >
                  {CHECKBOX_OPTIONS.map((opt) => (
                    <div
                      key={opt.field}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "5px 0",
                        borderBottom: "1px solid #e8f0fa",
                        cursor: "pointer",
                      }}
                      onClick={() => toggleCheckboxFilter(opt.field)}
                    >
                      <div
                        style={{
                          width: "16px",
                          height: "16px",
                          border: "2px solid #1e67a8",
                          borderRadius: "3px",
                          background: checkboxFilters.includes(opt.field) ? "#1e67a8" : "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {checkboxFilters.includes(opt.field) && (
                          <span style={{ color: "#fff", fontSize: "10px", fontWeight: 900, lineHeight: 1 }}>✓</span>
                        )}
                      </div>
                      <span style={{ fontSize: "13px", color: "#004b8e", fontWeight: checkboxFilters.includes(opt.field) ? 600 : 400 }}>
                        {opt.label}
                      </span>
                    </div>
                  ))}
                  {checkboxFilters.length > 0 && (
                    <div
                      style={{ marginTop: "8px", textAlign: "right" }}
                      onClick={(e) => { e.stopPropagation(); setCheckboxFilters([]); }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#dc3545",
                          cursor: "pointer",
                          fontWeight: 600,
                          textDecoration: "underline",
                        }}
                      >
                        Clear All
                      </span>
                    </div>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </div>

            {/* Active filter summary */}
            {(stageFilter || checkboxFilters.length > 0) && (
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <button
                  onClick={() => { setStageFilter(""); setCheckboxFilters([]); }}
                  style={{
                    fontSize: "12px",
                    padding: "5px 12px",
                    border: "1.5px solid #dc3545",
                    borderRadius: "6px",
                    background: "#fff",
                    color: "#dc3545",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          <div style={{ overflowX: "auto" }}>
            <DataTable
              // title="scCategory List"
              tableClassName="data-table-head-light table-responsive"
              columns={ScApprovalStageDataColumns}
              data={filteredData}
              highlightOnHover
              pagination
              paginationPerPage={50}
              paginationRowsPerPageOptions={[50, 100, 200]}
              progressPending={loading}
              theme="solarized"
              customStyles={customStyles}
            />
          </div>
        </Card>
      </Block>
    </Layout>
  );
}

const scApprovalStageListStyles = `
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
  .sh-form-wrap {
    background: #eef2f8;
    border-radius: 14px;
    padding: 18px;
  }
  .sh-form-wrap .card {
    border: none;
    border-radius: 12px !important;
    box-shadow: 0 4px 14px rgba(30, 103, 168, 0.1);
    overflow: hidden;
  }
`;

export default ScApprovalStageList;
