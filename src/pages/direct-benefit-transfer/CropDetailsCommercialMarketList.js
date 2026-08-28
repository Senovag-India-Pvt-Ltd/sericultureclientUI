import { Card, Button, Row, Col, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon } from "../../components";
import DataTable from "../../components/AppDataTable";
import { createTheme } from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import React from "react";
import Swal from "sweetalert2";
import api from "../../../src/services/auth/api";
import { useState, useEffect } from "react";
import CropDetailsForCommercialMarket from "./CropDetailsForCommercialMarket";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_DBT;

function CropDetailsForCommercialMarketList() {
  const { t } = useTranslation();
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 50;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState({ type: 1, searchText: "" });

  const handleInputsSearch = (e) => {
    const { name, value } = e.target;
    setSearchData((prev) => ({ ...prev, [name]: value }));
  };

  const getList = () => {
    setLoading(true);
    const effectiveType =
      searchData.searchText.trim() === "" ? 0 : Number(searchData.type);
    api
      .get(baseURL + `cropDetailsCommercialMarket/getListOfCropDetailsCommercialMarketDetails`, {
        params: {
          pageNumber: page,
          pageSize: countPerPage,
          type: effectiveType,
          searchText: searchData.searchText.trim(),
        },
      })
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

  const search = () => {
    if (page === 0) {
      getList();
    } else {
      setPage(0);
    }
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
      title: t("Delete attempt was not successful"),
      text: t("Something went wrong!"),
    });
  };

  const deleteConfirm = (_id) => {
    Swal.fire({
      title: t("Are you sure?"),
      text: t("It will delete permanently!"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("Yes, delete it!"),
    }).then((result) => {
      if (result.value) {
        const response = api
          .delete(baseURL + `cropDetailsCommercialMarket/delete/${_id}`)
          .then((response) => {
            // deleteConfirm(_id);
            getList();
            Swal.fire(
              t("Deleted"),
              t("You successfully deleted this record"),
              "success"
            );
          })
          .catch((err) => {
            deleteError();
          });
        // Swal.fire("Deleted", "You successfully deleted this record", "success");
      } else {
        console.log(result.value);
        Swal.fire(t("Cancelled"), t("Your record is not deleted"), "info");
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
      name: t("Action"),
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
            {t("Edit")}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.cropDetailsCommercialMarketId)}
            className="ms-2"
          >
            {t("Delete")}
          </Button>
        </div>
      ),
      sortable: false,
      hide: "md",
      grow: 2,
    },

{
      name: t("Fruits Id"),
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
      name: t("Race"),
      selector: (row) => row.raceName,
      cell: (row) => <span>{row.raceName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Grainage"),
      selector: (row) => row.grainageMasterName,
      cell: (row) => <span>{row.grainageMasterName}</span>,
      sortable: true,
      hide: "md",
    },
    {
        name: t("Receipt No"),
        selector: (row) => row.receiptNo,
        cell: (row) => <span>{row.receiptNo}</span>,
        sortable: true,
        hide: "md",
      },

      {
        name: t("Transaction Date"),
        selector: (row) => row.transactionDate,
        cell: (row) => <span>{row.transactionDate}</span>,
        sortable: true,
        hide: "md",
      },

      {
        name: t("Lot No"),
        selector: (row) => row.lotNo,
        cell: (row) => <span>{row.lotNo}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: t("No Of DFLs"),
        selector: (row) => row.noOfDfls,
        cell: (row) => <span>{row.noOfDfls}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: t("Brushing Date"),
        selector: (row) => row.dateOfBrushing,
        cell: (row) => <span>{row.dateOfBrushing}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: t("Date Of Chawki Distribution"),
        selector: (row) => row.dateOfDistributionOfChawkiWorms,
        cell: (row) => <span>{row.dateOfDistributionOfChawkiWorms}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: t("Chawki Percentage"),
        selector: (row) => row.chawkiPercentage,
        cell: (row) => <span>{row.chawkiPercentage}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: t("Spun On Date"),
        selector: (row) => row.spunOnDate,
        cell: (row) => <span>{row.spunOnDate}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: t("Spun On To Date"),
        selector: (row) => row.spunOnToDate,
        cell: (row) => <span>{row.spunOnToDate}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: t("Quantity Of Cocoons Produced"),
        selector: (row) => row.quantityOfCocoonsProduced,
        cell: (row) => <span>{row.quantityOfCocoonsProduced}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: t("Average Yield"),
        selector: (row) => row.averageYield,
        cell: (row) => <span>{row.averageYield}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: t("Market Name"),
        selector: (row) => row.marketName,
        cell: (row) => <span>{row.marketName}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: t("Bidding Slip Lot No"),
        selector: (row) => row.biddingSlipNo,
        cell: (row) => <span>{row.biddingSlipNo}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: t("Cocoon Rate Per Kg"),
        selector: (row) => row.cocoonRatePerKg,
        cell: (row) => <span>{row.cocoonRatePerKg}</span>,
        sortable: true,
        hide: "md",
      },
  ];

  return (
    <Layout title={t("List of Crop Details-Commercial Market")}>
      <style>{cropDetailsCommercialMarketListStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("List of Crop Details-Commercial Market")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/crop-details-commercial-market"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="plus" />
                    <span>{t("Create")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/crop-details-commercial-market"
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
          <Row className="m-2">
            <Col>
              <Form.Group as={Row} className="form-group" id="fid">
                <Form.Label column sm={1}>
                  {t("Search By")}
                </Form.Label>
                <Col sm={3}>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="type"
                      value={searchData.type}
                      onChange={handleInputsSearch}
                    >
                      <option value="1">{t("Fruits Id")}</option>
                      <option value="2">{t("Lot No")}</option>
                      <option value="3">{t("Receipt No")}</option>
                    </Form.Select>
                  </div>
                </Col>

                <Col sm={2} lg={2}>
                  <Form.Control
                    name="searchText"
                    value={searchData.searchText}
                    onChange={handleInputsSearch}
                    type="text"
                    placeholder={t("search")}
                  />
                </Col>

                <Col sm={3}>
                  <Button type="button" variant="primary" onClick={search}>
                    {t("search")}
                  </Button>
                </Col>
              </Form.Group>
            </Col>
          </Row>
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
            progressComponent={<div className="p-3 text-center">{t("Loading...")}</div>}
            noDataComponent={
              <div className="sh-empty">
                <Icon name="inbox" />
                <p className="mt-2 mb-0">{t("No records found")}</p>
              </div>
            }
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
