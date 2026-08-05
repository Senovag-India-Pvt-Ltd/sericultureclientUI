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

function CropDetailsForCommercialMarketList() {
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 50;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, pageSize: countPerPage } };

  const getList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `cropDetailsCommercialMarket/getListOfCropDetailsCommercialMarketDetails`, _params)
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
    navigate(`/seriui/crop-details-commercial-market-edit/${_id}`);
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
          .delete(baseURL + `cropDetailsCommercialMarket/delete/${_id}`)
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
            onClick={() => handleEdit(row.cropDetailsCommercialMarketId)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.cropDetailsCommercialMarketId)}
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
    // {
    //   name: "Name Of the CRC",
    //   selector: (row) => row.crcName,
    //   cell: (row) => <span>{row.crcName}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
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
        name: "Receipt No",
        selector: (row) => row.receiptNo,
        cell: (row) => <span>{row.receiptNo}</span>,
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
        name: "Quantity Of Cocoons Produced",
        selector: (row) => row.quantityOfCocoonsProduced,
        cell: (row) => <span>{row.quantityOfCocoonsProduced}</span>,
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
    <Layout title="List of Crop Details-Commercial Market">
      <style>{cropDetailsCommercialMarketListStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">List of Crop Details-Commercial Market</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/crop-details-commercial-market"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="plus" />
                    <span>Create</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/crop-details-commercial-market"
                    className="btn btn-primary d-none d-md-inline-flex sh-cta-btn"
                  >
                    <Icon name="plus" />
                    <span>Create</span>
                  </Link>
                </li>
              </ul>
            </Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
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

const cropDetailsCommercialMarketListStyles = `
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
  .sh-form-wrap .card-header {
    border-bottom: none !important;
  }
`;

export default CropDetailsForCommercialMarketList;
