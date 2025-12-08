import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon } from "../../components";
import DataTable from "react-data-table-component";
import { createTheme } from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import React from "react";
import Swal from "sweetalert2";
import api from "../../../src/services/auth/api";
import { useState, useEffect } from "react";
import CropDetailsForCommercialMarket from "./CropDetailsForCommercialMarket";

const baseURL = process.env.REACT_APP_API_BASE_URL_DBT;

function CropDetailsForSeedMarketList() {
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 50;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, pageSize: countPerPage } };

  const getList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `cropDetailsSeedMarket/getListOfCropDetailsSeedMarketDetails`, _params)
      .then((response) => {
        setListData(response.data.content);
        setTotalRows(response.data.totalRecords);
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
    navigate(`/seriui/crop-details-seed-market-edit/${_id}`);
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
          .delete(baseURL + `cropDetailsSeedMarket/delete/${_id}`)
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
          <Button
            variant="primary"
            size="sm"
            className="ms-2"
            onClick={() => handleEdit(row.cropDetailsSeedMarketId)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.cropDetailsSeedMarketId)}
            className="ms-2"
          >
            Delete
          </Button>
        </div>
      ),
      sortable: false,
      hide: "md",
      grow: 2,
    },

{
      name: "Fruits Id",
      selector: (row) => row.fruitsId,
      cell: (row) => <span>{row.fruitsId}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Name of the CRC",
      selector: (row) => row.crcName,
      cell: (row) => <span>{row.crcName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Race",
      selector: (row) => row.raceName,
      cell: (row) => <span>{row.raceName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Grainage",
      selector: (row) => row.grainageMasterName,
      cell: (row) => <span>{row.grainageMasterName}</span>,
      sortable: true,
      hide: "md",
    },
    {
        name: "Bonus Receipt No",
        selector: (row) => row.bonusReceiptNo,
        cell: (row) => <span>{row.bonusReceiptNo}</span>,
        sortable: true,
        hide: "md",
      },

      {
        name: "Incentive Receipt No",
        selector: (row) => row.incentiveReceiptNo,
        cell: (row) => <span>{row.incentiveReceiptNo}</span>,
        sortable: true,
        hide: "md",
      },

      {
        name: "Transaction date",
        selector: (row) => row.transactionDate,
        cell: (row) => <span>{row.transactionDate}</span>,
        sortable: true,
        hide: "md",
      },

      {
        name: "Lot No",
        selector: (row) => row.lotNo,
        cell: (row) => <span>{row.lotNo}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: "No Of DFLs",
        selector: (row) => row.noOfDfls,
        cell: (row) => <span>{row.noOfDfls}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: "Date Of Brushing",
        selector: (row) => row.dateOfBrushing,
        cell: (row) => <span>{row.dateOfBrushing}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: "Date Of Chawki Distribution",
        selector: (row) => row.dateOfDistributionOfChawkiWorms,
        cell: (row) => <span>{row.dateOfDistributionOfChawkiWorms}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: "Chawki Percentage",
        selector: (row) => row.chawkiPercentage,
        cell: (row) => <span>{row.chawkiPercentage}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: "Spun On Date",
        selector: (row) => row.spunOnDate,
        cell: (row) => <span>{row.spunOnDate}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: "Spun On To Date",
        selector: (row) => row.spunOnToDate,
        cell: (row) => <span>{row.spunOnToDate}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: "No Of Cocoons Per Kg",
        selector: (row) => row.noOfCocoonsPerKg,
        cell: (row) => <span>{row.noOfCocoonsPerKg}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: "Quantity Of Cocoons Produced",
        selector: (row) => row.quantityOfSeedCocoons,
        cell: (row) => <span>{row.quantityOfSeedCocoons}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: "Average Yield",
        selector: (row) => row.averageYield,
        cell: (row) => <span>{row.averageYield}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: "Market Name",
        selector: (row) => row.marketName,
        cell: (row) => <span>{row.marketName}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: "Bidding Slip LOt No",
        selector: (row) => row.biddingSlipNo,
        cell: (row) => <span>{row.biddingSlipNo}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: "Cocoon Rate Per Kg",
        selector: (row) => row.cocoonRatePerKg,
        cell: (row) => <span>{row.cocoonRatePerKg}</span>,
        sortable: true,
        hide: "md",
      },
  ];

  return (
    <Layout title="List of Crop Details-Seed Market">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">List of Crop Details-Seed Market</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/crop-details-seed-market"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/crop-details-seed-market"
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

export default CropDetailsForSeedMarketList;
