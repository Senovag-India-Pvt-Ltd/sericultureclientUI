import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

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
  const DbtStatusCheckDataColumns = [
    {
          name: t("Action"),
          cell: (row) => (
            //   Button style
            <div className="text-start w-100">
              {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleView(row.dbtStatusCheckId)}
              >
                {t("View")}
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="ms-2"
                onClick={() => handleEdit(row.dbtStatusCheckId)}
              >
                {t("Edit")}
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => deleteConfirm(row.dbtStatusCheckId)}
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
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Dbt Status Check List")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/dbtStatusCheck"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>{t("Create")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/dbtStatusCheck"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="plus" />
                  <span>{t("Create")}</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

     <Block className="mt-n4">
             <Card>
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
                 theme="solarized"
                 customStyles={customStyles}
               />
             </Card>
           </Block>
         </Layout>
       );
     }

export default DbtStatusCheckList;
