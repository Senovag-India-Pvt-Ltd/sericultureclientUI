import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import DataTable from "react-data-table-component";
import { createTheme } from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import React from "react";
import Swal from "sweetalert2";
import api from "../../../services/auth/api";
import { useState, useEffect } from "react";
import RegisteredPrivateChawki from "./RegisteredPrivateChawki";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;

function RegisteredPrivateChawkiList() {
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 50;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, pageSize: countPerPage } };

  const getList = () => {
    setLoading(true);
    const response = api
      .get(baseURLDBT + `registeredPrivateChawki/getChawkiSanctionOrderActiveList`, _params)
      .then((response) => {
        setListData(response.data.content);
        setTotalRows(response.data.content.totalRecords);
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
//   const handleView = (_id) => {
//     navigate(`/seriui/race-mapping-view/${_id}`);
//   };

  const handleEdit = (_id) => {
    navigate(`/seriui/registered-private-chawki-edit/${_id}`);
    // navigate("/seriui/taluk");
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
          .delete(baseURLDBT + `registeredPrivateChawki/delete/${_id}`)
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

  const RaceMappingDataColumns = [
    {
      name: "Action",
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
          {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
          {/* <Button
            variant="primary"
            size="sm"
            onClick={() => handleView(row.raceMarketMasterId)}
          >
            View
          </Button> */}
          {/* <Button
            variant="primary"
            size="sm"
            className="ms-2"
            onClick={() => handleEdit(row.configureRHAmountId)}
          >
            Edit
          </Button> */}
          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.id)}
            className="ms-2"
          >
            Delete
          </Button>
        </div>
      ),
      sortable: false,
      hide: "md",
    },
    {
        name: "Component Type",
        selector: (row) => row.subSchemeName,
        cell: (row) => <span>{row.subSchemeName}</span>,
        sortable: true,
        hide: "md",
      },

    {
      name: "Component",
      selector: (row) => row.componentName,
      cell: (row) => <span>{row.componentName}</span>,
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
        name: "Rearing Equipment Details",
        selector: (row) => row.subsidyName,
        cell: (row) => <span>{row.subsidyName}</span>,
        sortable: true,
        hide: "md",
      },
    {
        name: "Eligible Equipment In Nos",
        selector: (row) => row.eligibleEquipmentInNos,
        cell: (row) => <span>{row.eligibleEquipmentInNos}</span>,
        sortable: true,
        hide: "md",
    },

    {
        name: "Eligible Total Value In Rs",
        selector: (row) => row.eligibleTotalValueInRs,
        cell: (row) => <span>{row.eligibleTotalValueInRs}</span>,
        sortable: true,
        hide: "md",
    },

    {
        name: "Rate",
        selector: (row) => row.ratePerEligibleEquipment,
        cell: (row) => <span>{row.ratePerEligibleEquipment}</span>,
        sortable: true,
        hide: "md",
    },
    {
        name: "Max Amount Of Subsidy",
        selector: (row) => row.maxAmountOfSubsidyEligible,
        cell: (row) => <span>{row.maxAmountOfSubsidyEligible}</span>,
        sortable: true,
        hide: "md",
    },
    {
        name: "Establishment Of Mulberry Garden Eligible Amount",
        selector: (row) => row.establishmentOfMulberryGardenEligibleAmount,
        cell: (row) => <span>{row.establishmentOfMulberryGardenEligibleAmount}</span>,
        sortable: true,
        hide: "md",
    },

    {
        name: "Installation Of Drip Irrigation Eligible Amount",
        selector: (row) => row.installationOfDripIrrigationEligibleAmount,
        cell: (row) => <span>{row.installationOfDripIrrigationEligibleAmount}</span>,
        sortable: true,
        hide: "md",
    },

    {
        name: "Chawki Rearing Building  Eligible Amount",
        selector: (row) => row.chawkiRearingBuildingEligibleAmount,
        cell: (row) => <span>{row.chawkiRearingBuildingEligibleAmount}</span>,
        sortable: true,
        hide: "md",
    },
  ];

  return (
    <Layout title="List of Registered Private Bivoltine Chawki Rearing Center Subsidy">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">List of Registered Private Bivoltine Chawki Rearing Center Subsidy</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/registered-private-chawki"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/registered-private-chawki"
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
            // title="Crate List"
            tableClassName="data-table-head-light table-responsive"
            columns={RaceMappingDataColumns}
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

export default RegisteredPrivateChawkiList;
