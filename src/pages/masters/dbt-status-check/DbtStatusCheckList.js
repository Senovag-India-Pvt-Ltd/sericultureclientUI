import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
// import DataTable from "../../../components/DataTable/DataTable";
import DataTable from "../../../components/AppDataTable";
import StateDatas from "../../../store/masters/state/StateData";
import { useNavigate } from "react-router-dom";
import React from "react";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function DbtStatusCheckList() {
   // Translation
   const { t } = useTranslation();

  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };

  const getList = () => {
    setLoading(true);
    api
      .get(baseURL + `dbtStatusCheck/list`, _params)
      .then((response) => {
        setListData(response.data.content.dbtStatusCheck);
        setTotalRows(response.data.content.totalItems);
        setLoading(false);
      })
      .catch((err) => {
        setListData({});
        setLoading(false);
      });
  };

  useEffect(() => {
    getList();
  }, [page]);

  const navigate = useNavigate();
  const handleView = (_id) => {
    navigate(`/seriui/dbtStatusCheck-view/${_id}`);
  };

  const handleEdit = (_id) => {
    navigate(`/seriui/dbtStatusCheck-edit/${_id}`);
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
        api
          .delete(baseURL + `dbtStatusCheck/delete/${_id}`)
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
  const DbtStatusCheckDataColumns = [
    {
          name: t("Action"),
          cell: (row) => (
            //   Button style
            <div className="d-flex flex-nowrap align-items-center text-start w-100">
              {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleView(row.dbtStatusCheckId)}
                className="d-inline-flex align-items-center gap-1 shadow-sm text-nowrap"
              >
                <Icon name="eye" />
                {t("View")}
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="ms-2 d-inline-flex align-items-center gap-1 shadow-sm text-nowrap"
                onClick={() => handleEdit(row.dbtStatusCheckId)}
              >
                <Icon name="edit" />
                {t("Edit")}
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => deleteConfirm(row.dbtStatusCheckId)}
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
          grow: 0
        },
        {
          name: t("Dept Code"),
          selector: (row) => row.deptCode,
          cell: (row) => <span>{row.deptCode}</span>,
          sortable: true,
          hide: "md",
        },
        {
            name: t("Scheme Id"),
            selector: (row) => row.schemeId,
            cell: (row) => <span>{row.schemeId}</span>,
            sortable: true,
            hide: "md",
          },
          {
            name: t("Component Type Id"),
            selector: (row) => row.componentTypeId,
            cell: (row) => <span>{row.componentTypeId}</span>,
            sortable: true,
            hide: "md",
          },
      {
          name: t("Component Id"),
          selector: (row) => row.componentId,
          cell: (row) => <span>{row.componentId}</span>,
          sortable: true,
          hide: "md",
        },
        {
          name: t("Sub Component Id"),
          selector: (row) => row.subComponentId,
          cell: (row) => <span>{row.subComponentId}</span>,
          sortable: true,
          hide: "md",
        },

        {
          name: t("Dbt Scheme"),
          selector: (row) => row.dbtScheme,
          cell: (row) => <span>{row.dbtScheme}</span>,
          sortable: true,
          hide: "md",
        },
    {
        name: t("User Name"),
        selector: (row) => row.username,
        cell: (row) => <span>{row.username}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: t("Password"),
        selector: (row) => row.password,
        cell: (row) => <span>{row.password}</span>,
        sortable: true,
        hide: "md",
      },
  ];

  return (
    <Layout title={t("Dbt Status Check List")}>
      <style>{dbtStatusCheckListStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("Dbt Status Check List")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/dbtStatusCheck"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="plus" />
                    <span>{t("Create")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/dbtStatusCheck"
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
                   columns={DbtStatusCheckDataColumns}
                   data={listData}
                   highlightOnHover
                   pagination
                   paginationServer
                   paginationTotalRows={totalRows}
                   paginationPerPage={countPerPage}
                   paginationComponentOptions={{
                     noRowsPerPage: true,
                   }}
                   onChangePage={(page) => setPage(page - 1)}
                   progressPending={loading}
                   progressComponent={<div className="py-4">{t("Loading...")}</div>}
                   theme="solarized"
                   customStyles={customStyles}
                 />
               </div>
             </Card>
           </Block>
         </Layout>
       );
     }

const dbtStatusCheckListStyles = `
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

export default DbtStatusCheckList;
