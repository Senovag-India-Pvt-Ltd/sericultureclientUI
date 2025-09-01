import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { createTheme } from "react-data-table-component";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import React from "react";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import api from "../../../src/services/auth/api";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import ChawkiManagement from "../chawki-management/ChawkiManagement";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;

function SupplyOfCocoonsReport() {
  const { t } = useTranslation();
  const [listData, setListData] = useState({});
  const [listFarmerData, setListFarmerData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 25;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };

  const [isActive, setIsActive] = useState(false);

  const [data, setData] = useState({
    fromDate: "",
    toDate: "",
    farmId: "",
    lineId: "",
  });

const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  const formatDate = (date) => {
  return date ? format(new Date(date), "yyyy-MM-dd") : null;
};

  // Search
  const search = (e) => {
    api
      .post(
        baseURLFarmer + `supply-cocoons/primarySupplyOfCocoonsDetailsDetails`,
        {},
        {
          params: {
            fromDate: formatDate(data.fromDate),
            toDate: formatDate(data.toDate),
            farmId: data.farmId || 0,
            lineId: data.lineId || 0,
            pageNumber: page,
            pageSize: countPerPage,
          },
        }
      )
      .then((response) => {
        setListData(response.data.content);
        setTotalRows(response.data.totalRecords);
      })
      .catch((err) => {
        setListData([]);
      });
  };

  const exportCsv = (e) => {
    api
      .post(
        baseURLFarmer + `supply-cocoons/supply-of-cocoons-report`,
        {},
        {
          params: {
            fromDate: formatDate(data.fromDate),
            toDate: formatDate(data.toDate),
            farmId: data.farmId || 0,
            lineId: data.lineId || 0,
          },
          responseType: 'blob',
          headers: {
            accept: "text/csv",
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        const blob = new Blob([response.data], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `supply_of_cocoons_report.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
      })
      .catch((err) => {
        Swal.fire({
          icon: "warning",
          title: "No record found!!!",
        });
      });
};

  const getFarmerList = (e) => {
    api
      .post(
        baseURLFarmer + `supply-cocoons/primarySupplyOfCocoonsDetailsDetails`,
        {},
        {
          params: {
            fromDate: formatDate(data.fromDate),
            toDate: formatDate(data.toDate),
            farmId: data.farmId || 0,
            lineId: data.lineId || 0,
            pageNumber: page,
            pageSize: countPerPage,
          },
        }
      )
      .then((response) => {
        setListData(response.data.content);
        setTotalRows(response.data.totalRecords);
      })
      .catch((err) => {
        setListData([]);
      });
  };

  useEffect(() => {
    getFarmerList();
  }, [page]);

  const handleInputs = (e) => {
    // debugger;
    let { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  
  // to get farm
  const [farmListData, setFarmListData] = useState([]);

  const getFarmList = () => {
    api
      .get(baseURL + `farmMaster/get-all`)
      .then((response) => {
        setFarmListData(response.data.content.farmMaster);
      })
      .catch((err) => {
        setFarmListData([]);
      });
  };

  useEffect(() => {
    getFarmList();
  }, []);
     // to get Line Year
   const [lineYearListData, setLineYearListData] = useState([]);

   const getLineYearList = () => {
     const response = api
       .get(baseURL + `lineNameMaster/get-all`)
       .then((response) => {
         setLineYearListData(response.data.content.lineNameMaster);
       })
       .catch((err) => {
        setLineYearListData([]);
       });
   };
 
   useEffect(() => {
     getLineYearList();
   }, []);


  


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
        minHeight: "30px", // override the row height
      },
    },
    headCells: {
      style: {
        // '&:not(:last-of-type)': {
        backgroundColor: "#1e67a8",
        color: "#fff",
        borderStyle: "solid",
        bordertWidth: "1px",
        // borderColor: defaultThemes.default.divider.default,
        borderColor: "black",
        // },
      },
    },
    cells: {
      style: {
        // '&:not(:last-of-type)': {
        borderStyle: "solid",
        borderWidth: "1px",
        paddingTop: "3px",
        paddingBottom: "3px",
        paddingLeft: "8px",
        paddingRight: "8px",
        // borderColor: defaultThemes.default.divider.default,
        borderColor: "black",
        // },
      },
    },
  };

  const FarmerDataColumns = [
    {
      name: "Sl.No",
      selector: (row) => row.serialNumber,
      cell: (row) => <span>{row.serialNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Lot Number",
      selector: (row) => row.lotNumber,
      cell: (row) => <span>{row.lotNumber}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Grainage",
      selector: (row) => row.grainageMasterNameInKannada,
      cell: (row) => <span>{row.grainageMasterNameInKannada}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Brushing Date",
      selector: (row) => row.brushingDate,
      cell: (row) => <span>{row.brushingDate}</span>,
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
      name: "No of DFLs Released",
      selector: (row) => row.numberOfDflsReleased,
      cell: (row) => <span>{row.numberOfDflsReleased}</span>,
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
      name: "Average Cocoons",
      selector: (row) => row.avgCocoons,
      cell: (row) => <span>{row.avgCocoons}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Spun On Date(From)",
      selector: (row) => row.spunOnDate,
      cell: (row) => <span>{row.spunOnDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Spun On Date(To)",
      selector: (row) => row.spunOnToDate,
      cell: (row) => <span>{row.spunOnToDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Hatching Date",
      selector: (row) => row.hatchingDate,
      cell: (row) => <span>{row.hatchingDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Crop Number",
      selector: (row) => row.cropNumber,
      cell: (row) => <span>{row.cropNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Disinfectant",
      selector: (row) => row.disinfectantMasterName,
      cell: (row) => <span>{row.disinfectantMasterName}</span>,
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
      name: "Released Date",
      selector: (row) => row.releasedOnDate,
      cell: (row) => <span>{row.releasedOnDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Farm",
      selector: (row) => row.farmNameInKannada,
      cell: (row) => <span>{row.farmNameInKannada}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Line",
      selector: (row) => row.lineName,
      cell: (row) => <span>{row.lineName}</span>,
      sortable: true,
      hide: "md",
    },
  ];

  return (
    <Layout title={t("Rearing And Supply Of Cocoons Report")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Rearing And Supply Of Cocoons Report")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent></Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1">
          <Row className="m-4">
            {/* <Col sm={2}>
              <Form.Group className="form-group mt-n4">
                <Form.Label>{t("District")}</Form.Label>
                <div className="form-control-wrap">
                  <Form.Select
                    name="districtId"
                    value={data.districtId}
                    onChange={handleInputs}
                    onBlur={() => handleInputs}
                    isInvalid={
                      data.districtId === undefined || data.districtId === "0"
                    }
                  >
                    <option value="">{t("Select District")}</option>
                    {districtListData && districtListData.length
                      ? districtListData.map((list) => (
                          <option key={list.districtId} value={list.districtId}>
                            {list.districtName}
                          </option>
                        ))
                      : ""}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {t("District Name is required")}
                  </Form.Control.Feedback>
                </div>
              </Form.Group>
            </Col> */}

            <Col sm={2}>
                        <Form.Group className="form-group mt-n4">
                          <Form.Label>
                            {t("Farm")}
                            {/* <span className="text-danger">*</span> */}
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="farmId"
                              value={data.farmId}
                              onChange={handleInputs}
                              onBlur={() => handleInputs}
                              // multiple
                              // required
                              // isInvalid={
                              //   data.userTypeId === undefined ||
                              //   data.userTypeId === "0"
                              // }
                            >
                              <option value="">{t("Select Farm")}</option>
                              {farmListData.map((list) => (
                                <option
                                  key={list.farmId}
                                  value={list.farmId}
                                >
                                  {list.farmName}
                                </option>
                              ))}
                            </Form.Select>
                            {/* <Form.Control.Feedback type="invalid">
                              Farm is required
                            </Form.Control.Feedback> */}
                          </div>
                        </Form.Group>
                      </Col>

                      <Col sm={2}>
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          {t("Line")}
                          {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <Col>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="lineId"
                              value={data.lineId}
                              onChange={handleInputs}
                              onBlur={() => handleInputs}
                              // required
                            >
                              <option value="">{t("Select Line Details")}</option>
                              {lineYearListData && lineYearListData.length?(lineYearListData.map((list) => (
                                <option
                                  key={list.lineNameId}
                                  value={list.lineNameId}
                                >
                                  {list.lineName}
                                </option>
                              ))):""}
                            </Form.Select>
                            {/* <Form.Control.Feedback type="invalid">
                              Line Details is required
                            </Form.Control.Feedback> */}
                          </div>
                        </Col>
                      </Form.Group>
                    </Col>

            <Col lg="2">
                <Form.Group className="form-group mt-n4">
                  <Form.Label htmlFor="sordfl">
                  {t("Spun Date(From)")}
                  {/* <span className="text-danger">*</span> */}
                </Form.Label>
                  <div className="form-control-wrap">
                    {/* <DatePicker
                          selected={data.dob}
                          onChange={(date) => handleDateChange(date, "dob")}
                        /> */}
                    <DatePicker
                      selected={data.fromDate}
                      onChange={(date) => handleDateChange(date, "fromDate")}
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      dateFormat="dd/MM/yyyy"
                      className="form-control"
                    //   required
                    />
                  </div>
                  </Form.Group>
                </Col>

                 <Col lg="2">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="sordfl">
                        {t(" Spun On Date(To)")}
                      </Form.Label>
                      <div className="form-control-wrap">
                        <DatePicker
                          selected={data.toDate}
                          onChange={(date) =>
                            handleDateChange(date, "toDate")
                          }
                          peekNextMonth
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          dateFormat="dd/MM/yyyy"
                          className="form-control"
                        />
                      </div>
                    </Form.Group>
                  </Col>
            <Col sm={1}>
              <Button type="button" variant="primary" onClick={search}>
                {t("Search")}
              </Button>
            </Col>
            <Col sm={1}>
              <Button type="button" variant="primary" onClick={exportCsv}>
                {t("Export")}
              </Button>
            </Col>
          </Row>
          <DataTable
            tableClassName="data-table-head-light table-responsive"
            columns={FarmerDataColumns}
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

export default SupplyOfCocoonsReport;
