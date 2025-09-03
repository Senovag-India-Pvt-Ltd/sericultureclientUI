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

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

function RearingOfDFLsAssessmentReport() {
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
    grainageId: "",
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
        baseURLFarmer + `8linesController/rearing-of-dfls-assessment-details`,
        {},
        {
          params: {
            fromDate: formatDate(data.fromDate),
            toDate: formatDate(data.toDate),
            grainageId: data.grainageId || 0,
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
        baseURLFarmer + `8linesController/rearing-of-dfls-assessment-report`,
        {},
        {
          params: {
            fromDate: formatDate(data.fromDate),
            toDate: formatDate(data.toDate),
            grainageId: data.grainageId || 0,
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
        link.download = `rearing_of_dfls_assessment_report.csv`;
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
        baseURLFarmer + `8linesController/rearing-of-dfls-assessment-details`,
        {},
        {
          params: {
            fromDate: formatDate(data.fromDate),
            toDate: formatDate(data.toDate),
            grainageId: data.grainageId || 0,
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

   // to get Grainage
         const [grainageListData, setGrainageListData] = useState([]);
       
         const getGrainageList = () => {
           const response = api
             .get(baseURL + `grainageMaster/get-all`)
             .then((response) => {
               setGrainageListData(response.data.content.grainageMaster);
             })
             .catch((err) => {
               setGrainageListData([]);
             });
         };
       
         useEffect(() => {
           getGrainageList();
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
      selector: (row) => row.grainageMasterName,
      cell: (row) => <span>{row.grainageMasterName}</span>,
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
      name: "Bed",
      selector: (row) => row.bedName,
      cell: (row) => <span>{row.bedName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Weight Of 25 Cocoons",
      selector: (row) => row.weightCacoons,
      cell: (row) => <span>{row.weightCacoons}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Weight Of 25 Pupa",
      selector: (row) => row.weightPupa,
      cell: (row) => <span>{row.weightPupa}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Weight Of 25 Shells",
      selector: (row) => row.weightShells,
      cell: (row) => <span>{row.weightShells}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Single Weight Of Cocoon",
      selector: (row) => row.singleWeightCacoons,
      cell: (row) => <span>{row.singleWeightCacoons}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Single Weight Pupa",
      selector: (row) => row.singleWeightPupa,
      cell: (row) => <span>{row.singleWeightPupa}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Single Weight Shells",
      selector: (row) => row.singleWeightShells,
      cell: (row) => <span>{row.singleWeightShells}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Male Ratio",
      selector: (row) => row.maleRatio,
      cell: (row) => <span>{row.maleRatio}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Female Ratio",
      selector: (row) => row.femaleRatio,
      cell: (row) => <span>{row.femaleRatio}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Shell Percentage",
      selector: (row) => row.shellPercentage,
      cell: (row) => <span>{row.shellPercentage}</span>,
      sortable: true,
      hide: "md",
    },
   
    {
      name: "Cocoons Formed",
      selector: (row) => row.cacoonsFormed,
      cell: (row) => <span>{row.cacoonsFormed}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Worms Brushed",
      selector: (row) => row.wormsBrushed,
      cell: (row) => <span>{row.wormsBrushed}</span>,
      sortable: true,
      hide: "md",
    },
  ];

  return (
    <Layout title={t("Rearing Of DFLs Assessment Details Report")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Rearing Of DFLs Assessment Details Report")}</Block.Title>
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
                               {t("Grainage")}
                               {/* <span className="text-danger">*</span> */}
                           </Form.Label>
                           <Col>
                               <div className="form-control-wrap">
                               <Form.Select
                                   name="grainageId"
                                   value={data.grainageId}
                                   onChange={handleInputs}
                                   // onBlur={() => handleInputs}
                                   // required
                               >
                                   <option value="">{t("Select Grainage")}</option>
                                   {grainageListData && grainageListData.length?(grainageListData.map((list) => (
                                   <option
                                       key={list.grainageMasterId}
                                       value={list.grainageMasterId}
                                   >
                                       {list.grainageMasterName}
                                   </option>
                                   ))):""}
                               </Form.Select>
                               {/* <Form.Control.Feedback type="invalid">
                                   {t("Grainage is required")}
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

export default RearingOfDFLsAssessmentReport;
