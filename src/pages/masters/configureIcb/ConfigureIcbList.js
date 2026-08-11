import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { createTheme } from "react-data-table-component";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ConfigureIcbList() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [listData, setListData] = useState([]);
  const [page, setPage] = useState(0);
  const countPerPage = 10;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);

  // 👇 API params for pagination
  const _params = { params: { pageNumber: page, size: countPerPage } };

  // ✅ Fetch Configure ICB list with JOIN
  const getList = () => {
    setLoading(true);
    api
      .get(`${baseURL}configureIcb/list-with-join`, _params)
      .then((response) => {
        const content = response.data.content || {};
        setListData(content.configureIcb || []);
        setTotalRows(content.totalItems || 0);
        setLoading(false);
      })
      .catch(() => {
        setListData([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    getList();
  }, [page]);

  // 👇 Navigation actions
  const handleView = (id) => {
    navigate(`/seriui/configure-icb-view/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/seriui/configure-icb-edit/${id}`);
  };

  // 👇 SweetAlert delete handling
  const deleteError = () => {
    Swal.fire({
      icon: "error",
      title: t("Delete attempt was not successful"),
      text: t("Something went wrong!"),
    });
  };

  const deleteConfirm = (id) => {
    Swal.fire({
      title: t("Are you sure?"),
      text: t("It will delete permanently!"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("Yes, delete it!"),
    }).then((result) => {
      if (result.value) {
        api
          .delete(`${baseURL}configureIcb/delete/${id}`)
          .then(() => {
            getList();
            Swal.fire(t("Deleted!"), t("Record deleted successfully!"), "success");
          })
          .catch(() => deleteError());
      } else {
        Swal.fire(t("Cancelled"), t("Your record is not deleted"), "info");
      }
    });
  };

  // ✅ Table theme setup
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

  // ✅ Columns based on ConfigureIcbResponse (joined data)
  const ConfigureIcbColumns = [
    {
      name: t("Action"),
      cell: (row) => (
        <div className="d-flex flex-nowrap align-items-center text-start w-100">
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleView(row.icbId)}
            className="d-inline-flex align-items-center gap-1 shadow-sm text-nowrap"
          >
            <Icon name="eye" />
            {t("View")}
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="ms-2 d-inline-flex align-items-center gap-1 shadow-sm text-nowrap"
            onClick={() => handleEdit(row.icbId)}
          >
            <Icon name="edit" />
            {t("Edit")}
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="ms-2 d-inline-flex align-items-center gap-1 shadow-sm text-nowrap"
            onClick={() => deleteConfirm(row.icbId)}
          >
            <Icon name="trash" />
            {t("Delete")}
          </Button>
        </div>
      ),
      width: "300px",
      minWidth: "300px",
      grow: 0,
      sortable: false,
    },
    {
      name: t("ICB Basin Ends"),
      selector: (row) => row.icbBasinEnds,
      sortable: true,
      wrap: true,
    },
    {
      name: t("Category"),
      selector: (row) => row.categoryName,
      sortable: true,
      wrap: true,
    },
    {
      name: t("Component"),
      selector: (row) => row.scComponentName,
      sortable: true,
      wrap: true,
    },
    {
      name: t("Component Type"),
      selector: (row) => row.subSchemeName,
      sortable: true,
      wrap: true,
    },
    {
      name: t("Unit Cost"),
      selector: (row) => row.unitCost,
      right: true,
      sortable: true,
    },
    {
      name: t("Min"),
      selector: (row) => row.min,
      right: true,
      sortable: true,
    },
    {
      name: t("Max"),
      selector: (row) => row.max,
      right: true,
      sortable: true,
    },
  ];

  return (
    <Layout title={t("Configure ICB List")}>
      <style>{configureIcbListStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("Configure ICB List")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/configureIcb"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="plus" />
                    <span>{t("Create")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/configureIcb"
                    className="btn btn-primary d-none d-md-inline-flex sh-cta-btn"
                  >
                    <Icon name="plus" />
                    <span>{t("Create")}</span>
                  </Link>
                </li>
              </ul>
            </Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        <Card>
          <div style={{ overflowX: "auto" }}>
            <DataTable
              tableClassName="data-table-head-light table-responsive"
              columns={ConfigureIcbColumns}
              data={listData}
              highlightOnHover
              pagination
              paginationServer
              paginationTotalRows={totalRows}
              paginationPerPage={countPerPage}
              paginationComponentOptions={{ noRowsPerPage: true }}
              onChangePage={(page) => setPage(page - 1)}
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

const configureIcbListStyles = `
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

export default ConfigureIcbList;
