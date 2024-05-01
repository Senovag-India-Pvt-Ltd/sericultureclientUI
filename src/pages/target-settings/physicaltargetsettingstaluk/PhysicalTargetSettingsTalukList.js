import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
// import DataTable from "../../../components/DataTable/DataTable";
import DataTable, { createTheme } from "react-data-table-component";
import Swal from "sweetalert2/src/sweetalert2.js";
import { useNavigate } from "react-router-dom";
import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

import api from "../../../../src/services/auth/api";

const baseURLTargetSetting = process.env.REACT_APP_API_BASE_URL_TARGET_SETTING;

function PhysicalTargetSettingsTalukList() {
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };

  const getList = () => {
    setLoading(true);

    const response = api
      .get(baseURLTargetSetting + `tsPhysicalTaluk/list-with-join`, _params)
      .then((response) => {
        setListData(response.data.content.tsPhysicalTaluk);
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
  const handleView = (id) => {
    navigate(`/seriui/physicaltargetsettingstaluk-view/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/seriui/physicaltargetsettingstaluk-edit/${id}`);
  };

  const deleteError = () => {
    Swal.fire({
      icon: "error",
      title: "Delete attempt was not successful",
      text: "Something went wrong!",
    });
  };

  const deleteConfirm = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "It will delete permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        const response = api
          .delete(baseURLTargetSetting + `tsPhysicalTaluk/delete/${id}`)
          .then((response) => {
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

  const activityDataColumns = [
    {
      name: "Action",
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleView(row.tsPhysicalTalukId)}
          >
            View
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="ms-2"
            onClick={() => handleEdit(row.tsPhysicalTalukId)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.tsPhysicalTalukId)}
            className="ms-2"
          >
            Delete
          </Button>
        </div>
      ),
      sortable: false,
      hide: "md",
      grow:2
    },
    {
      name: "Financial Year",
      selector: (row) => row.financialYear,
      cell: (row) => <span>{row.financialYear}</span>,
      sortable: false,
      hide: "md",
    },

    {
      name: "Scheme",
      selector: (row) => row.schemeName,
      cell: (row) => <span>{row.schemeName}</span>,
      sortable: false,
      hide: "md",
    },
    {
      name: "Sub Scheme",
      selector: (row) => row.subSchemeName,
      cell: (row) => <span>{row.subSchemeName}</span>,
      sortable: false,
      hide: "md",
    },
    {
      name: "District",
      selector: (row) => row.districtName,
      cell: (row) => <span>{row.districtName}</span>,
      sortable: false,
      hide: "md",
    },
    {
      name: "Taluk",
      selector: (row) => row.talukName,
      cell: (row) => <span>{row.talukName}</span>,
      sortable: false,
      hide: "md",
    },
    {
      name: "Date",
      selector: (row) => row.date,
      cell: (row) => <span>{row.date}</span>,
      sortable: false,
      hide: "md",
    },
    {
      name: "Reporting Officer",
      selector: (row) => row.username,
      cell: (row) => <span>{row.username}</span>,
      sortable: false,
      hide: "md",
    },
    {
      name: "Implementing Officer",
      selector: (row) => row.username,
      cell: (row) => <span>{row.username}</span>,
      sortable: false,
      hide: "md",
    },
    {
      name: "Activity",
      selector: (row) => row.name,
      cell: (row) => <span>{row.name}</span>,
      sortable: false,
      hide: "md",
    },
    {
      name: "Unit Of Measurement",
      selector: (row) => row.unitMeasurementId,
      cell: (row) => <span>{row.unitMeasurementId}</span>,
      sortable: false,
      hide: "md",
    },
  ];

  return (
    <Layout title="Taluk Physical Target Settings List">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              Taluk Physical Target Settings List
            </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/physicaltargetsettings-taluk"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/physicaltargetsettingstaluk"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="plus" />
                  <span>Create</span>
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
            columns={activityDataColumns}
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

export default PhysicalTargetSettingsTalukList;
