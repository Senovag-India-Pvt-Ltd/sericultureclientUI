import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { createTheme } from "react-data-table-component";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
// import DataTable from "../../../components/DataTable/DataTable";
import DataTable from "react-data-table-component";
import StateDatas from "../../../store/masters/state/StateData";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import React from "react";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
// import axios from "axios";
import api from "../../../../src/services/auth/api";

const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;

function MapComponentAndHoaList() {
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };

  const getList = () => {
    setLoading(true);
    const response = api
      .get(baseURLDBT + `master/cost/list-with-join`, _params)
      .then((response) => {
        setListData(response.data.content.unitCost);
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
    navigate(`/seriui/sc-scheme-details-view/${_id}`);
  };

  const handleEdit = (_id) => {
    navigate(`/seriui/sc-scheme-details-edit/${_id}`);
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
          .delete(baseURLDBT + `/master/cost/scSchemeDetails/delete/${_id}`)
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

  const ScSchemeDetailsDataColumns = [
    // {
    //   name: "Action",
    //   cell: (row) => (
    //     //   Button style
    //     <div className="text-start w-100">
    //       {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
    //       <Button
    //         variant="primary"
    //         size="sm"
    //         onClick={() => handleView(row.scSchemeDetailsId)}
    //       >
    //         View
    //       </Button>
    //       <Button
    //         variant="primary"
    //         size="sm"
    //         className="ms-2"
    //         onClick={() => handleEdit(row.scSchemeDetailsId)}
    //       >
    //         Edit
    //       </Button>
    //       <Button
    //         variant="danger"
    //         size="sm"
    //         onClick={() => deleteConfirm(row.scSchemeDetailsId)}
    //         className="ms-2"
    //       >
    //         Delete
    //       </Button>
    //     </div>
    //   ),
    //   sortable: false,
    //   hide: "md",
    // },
    {
        name: "Head Of Account",
        selector: (row) => row.scHeadAccountName,
        cell: (row) => <span>{row.scHeadAccountName}</span>,
        sortable: true,
        hide: "md",
      },
    {
      name: "Unit Type",
      selector: (row) => row.unitType,
      cell: (row) => <span>{row.unitType}</span>,
      sortable: true,
      hide: "md",
    },
    {
        name: "Measurement Unit",
        selector: (row) => row.measurementUnit,
        cell: (row) => <span>{row.measurementUnit}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: "Minimum Quantity",
        selector: (row) => row.minQty,
        cell: (row) => <span>{row.minQty}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: "Maximum Quantity",
        selector: (row) => row.maxQty,
        cell: (row) => <span>{row.maxQty}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: "Maximum Amount",
        selector: (row) => row.maxAmount,
        cell: (row) => <span>{row.maxAmount}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: "Minimum Amount",
        selector: (row) => row.minAmount,
        cell: (row) => <span>{row.minAmount}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: "Unit Cost In  Rupees",
        selector: (row) => row.unitCostInRupees,
        cell: (row) => <span>{row.unitCostInRupees}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: "Share in %",
        selector: (row) => row.shareInPercentage,
        cell: (row) => <span>{row.shareInPercentage}</span>,
        sortable: true,
        hide: "md",
      },
    {
      name: "Scheme Name",
      selector: (row) => row.schemeName,
      cell: (row) => <span>{row.schemeName}</span>,
      sortable: true,
      hide: "md",
    },
    {
        name: "Sub Scheme",
        selector: (row) => row.subSchemeName,
        cell: (row) => <span>{row.subSchemeName}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: "Category",
        selector: (row) => row.categoryName,
        cell: (row) => <span>{row.categoryName}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: "Scheme Quota",
        selector: (row) => row.schemeQuotaName,
        cell: (row) => <span>{row.schemeQuotaName   }</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: "Component",
        selector: (row) => row.scComponentName,
        cell: (row) => <span>{row.scComponentName   }</span>,
        sortable: true,
        hide: "md",
      },
  ];

  return (
    <Layout title="List Of Map Component and Hoa">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">List Of Map Component and Hoa</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/map-component"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/map-component"
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
            // title="TrainingProgram List"
            tableClassName="data-table-head-light table-responsive"
            columns={ScSchemeDetailsDataColumns}
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

export default MapComponentAndHoaList;
