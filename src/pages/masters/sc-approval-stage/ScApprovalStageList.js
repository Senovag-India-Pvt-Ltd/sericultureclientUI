import { Card, Button, Form, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { createTheme } from "react-data-table-component";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
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
    rows: {
      style: {
        minHeight: "45px", // override the row height
      },
    },
    headCells: {
      style: {
        backgroundColor: "#1e67a8",
        color: "#fff",
        fontSize: "14px",
        paddingLeft: "8px", // override the cell padding for head cells
        paddingRight: "8px",
      },
    },
    cells: {
      style: {
        paddingLeft: "8px", // override the cell padding for data cells
        paddingRight: "8px",
      },
    },
  };

  const ScApprovalStageDataColumns = [
    {
      name:  t("Action"),
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
          {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleView(row.scApprovalStageId)}
          >
             {t("View")}
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="ms-2"
            onClick={() => handleEdit(row.scApprovalStageId)}
          >
              {t("Edit")}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.scApprovalStageId)}
            className="ms-2"
          >
            {t("delete")}
          </Button>
        </div>
      ),
      sortable: false,
      hide: "md",
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
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("List Of Approval Stages")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/sc-approval-stage"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>{t("create")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/sc-approval-stage"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="plus" />
                  <span>{t("create")}</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
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
              <Form.Select
                style={{
                  fontSize: "13px",
                  border: "1.5px solid #1e67a8",
                  borderRadius: "6px",
                  color: "#004b8e",
                  background: "#fff",
                  padding: "5px 10px",
                  boxShadow: "none",
                  cursor: "pointer",
                }}
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
              >
                <option value="">All Stages</option>
                {stageOptions.map((name, i) => (
                  <option key={i} value={name}>{name}</option>
                ))}
              </Form.Select>
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
        </Card>
      </Block>
    </Layout>
  );
}

export default ScApprovalStageList;
