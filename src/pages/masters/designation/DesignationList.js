import { Card, Button, Form, InputGroup } from "react-bootstrap";
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
import axios from "axios";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";
const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function DesignationList() {
    // Translation
    const { t } = useTranslation();
  const [listData, setListData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  const getList = () => {
    setLoading(true);
    api
      .get(baseURL + `designation/list`, { params: { pageNumber: 0, size: 5000 } })
      .then((response) => {
        setListData(response.data.content.designation || []);
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

  const filteredData = Array.isArray(listData)
    ? listData.filter((row) =>
        !searchText ||
        (row.name || "").toLowerCase().includes(searchText.toLowerCase()) ||
        (row.designationNameInKannada || "").toLowerCase().includes(searchText.toLowerCase())
      )
    : [];

  const navigate = useNavigate();
  const handleView = (_id) => {
    navigate(`/seriui/designation-view/${_id}`);
  };

  const handleEdit = (_id) => {
    navigate(`/seriui/designation-edit/${_id}`);
    // navigate("/seriui/designation");
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
          .delete(baseURL + `designation/delete/${_id}`)
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

  const DesignationDataColumns = [
    {
      name: t("Action"),
      cell: (row) => (
        //   Button style
        <div className="d-flex flex-nowrap align-items-center text-start w-100">
          {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleView(row.designationId)}
            className="d-inline-flex align-items-center gap-1 shadow-sm text-nowrap"
          >
            <Icon name="eye" />
            {t("View")}
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="ms-2 d-inline-flex align-items-center gap-1 shadow-sm text-nowrap"
            onClick={() => handleEdit(row.designationId)}
          >
            <Icon name="edit" />
            {t("Edit")}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.designationId)}
            className="ms-2 d-inline-flex align-items-center gap-1 shadow-sm text-nowrap"
          >
            <Icon name="trash" />
            {t("delete")}
          </Button>
        </div>
      ),
      sortable: false,
      hide: "md",
      width: "300px",
      minWidth: "300px",
      grow: 0,
    },
    {
      name: t("Designation"),
      selector: (row) => row.name,
      cell: (row) => <span>{row.name}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Designation Name in Kannada"),
      selector: (row) => row.designationNameInKannada,
      cell: (row) => <span>{row.designationNameInKannada}</span>,
      sortable: true,
      hide: "md",
    },
  
    {
      name: t("Level"),
      selector: (row) => row.level,
      cell: (row) => <span>{row.level}</span>,
      sortable: true,
      hide: "md",
    },
  ];

  return (
    <Layout title="Designation List">
      <style>{designationListStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("Designation List")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/designation"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="plus" />
                    <span>{t("create")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/designation"
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
          {/* Search Bar */}
          <div style={{ padding: "12px 16px", borderBottom: "2px solid #1e67a8", background: "#f0f5fb", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <InputGroup style={{ maxWidth: "360px" }}>
              <InputGroup.Text style={{ background: "#1e67a8", border: "none", color: "#fff", borderRadius: "6px 0 0 6px" }}>
                🔍
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder={t("Search Designation...")}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ border: "1.5px solid #1e67a8", borderLeft: "none", borderRadius: "0 6px 6px 0", fontSize: "13px", color: "#004b8e" }}
              />
              {searchText && (
                <button
                  onClick={() => setSearchText("")}
                  style={{ background: "#fff", border: "1.5px solid #1e67a8", borderLeft: "none", borderRadius: "0 6px 6px 0", padding: "0 10px", cursor: "pointer", color: "#dc3545", fontWeight: 700, fontSize: "14px" }}
                >
                  ✕
                </button>
              )}
            </InputGroup>
            {searchText && (
              <span style={{ fontSize: "12px", color: "#1e67a8", fontWeight: 600 }}>
                {filteredData.length} {t("result(s) found")}
              </span>
            )}
          </div>

          <div style={{ overflowX: "auto" }}>
            <DataTable
              tableClassName="data-table-head-light table-responsive"
              columns={DesignationDataColumns}
              data={filteredData}
              highlightOnHover
              pagination
              paginationPerPage={20}
              paginationRowsPerPageOptions={[20, 50, 100]}
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

const designationListStyles = `
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

export default DesignationList;
