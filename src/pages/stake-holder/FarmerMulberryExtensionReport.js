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
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_CHAWKI_MANAGEMENT;

function FarmerMulberryExtensionReport() {
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
    tscId: "",
    applicationType: "", 
  });


  // Search
  const search = (e) => {
    api
      .post(
        baseURLFarmer + `cropInspection/getFarmerMulberryExtensionDetails`,
        {},
        {
          params: {
            tscId: data.tscId || 0,
            applicationType: data.applicationType || '',
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
        baseURLFarmer + `cropInspection/getFarmerMulberryExtensionReport`,
        {},
        {
          params: {
            tscId: data.tscId || 0,
            applicationType: data.applicationType || '',
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
        link.download = `farmer_mulberry_extension_report.csv`;
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
        baseURLFarmer + `cropInspection/getFarmerMulberryExtensionDetails`,
        {},
        {
          params: {
            tscId: data.tscId || 0,
            applicationType: data.applicationType || '',
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

     // to get Race
     const [raceListData, setRaceListData] = useState([]);
   
     const getRaceList = () => {
       const response = api
         .get(baseURL + `raceMaster/get-all`)
         .then((response) => {
           setRaceListData(response.data.content.raceMaster);
         })
         .catch((err) => {
           setRaceListData([]);
         });
     };
   
     useEffect(() => {
       getRaceList();
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

         // to get tsc
         const [tscListData, setTscListData] = useState([]);
       
         const getTscList = () => {
           const response = api
             .get(baseURL + `tscMaster/get-all`)
             .then((response) => {
               setTscListData(response.data.content.tscMaster);
             })
             .catch((err) => {
               setTscListData([]);
             });
         };
       
         useEffect(() => {
           getTscList();
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
      name: "Farmer Name",
      selector: (row) => row.firstName,
      cell: (row) => <span>{row.firstName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Father Name",
      selector: (row) => row.fatherName,
      cell: (row) => <span>{row.fatherName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Fruits Id",
      selector: (row) => row.fruitsId,
      cell: (row) => <span>{row.fruitsId}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Address",
      selector: (row) => row.addressText,
      cell: (row) => <span>{row.addressText}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Scheme",
      selector: (row) => row.scheme,
      cell: (row) => <span>{row.scheme}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Mulberry Area",
      selector: (row) => row.mulberryArea,
      cell: (row) => <span>{row.mulberryArea}</span>,
      sortable: true,
      hide: "md",
    },  
    {
      name: "Mulberry Variety",
      selector: (row) => row.mulberryVarietyName,
      cell: (row) => <span>{row.mulberryVarietyName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Plantation Date",
      selector: (row) => row.plantationDate,
      cell: (row) => <span>{row.plantationDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Number of Saplings",
      selector: (row) => row.numberOfSaplings,
      cell: (row) => <span>{row.numberOfSaplings}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Spacing",
      selector: (row) => row.spacing,
      cell: (row) => <span>{row.spacing}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Application Type",
      selector: (row) => row.applicationType,
      cell: (row) => <span>{row.applicationType}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Uprooting Reason",
      selector: (row) => row.uprootingReason,
      cell: (row) => <span>{row.uprootingReason}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Uprooting Date",
      selector: (row) => row.uprootingDate,
      cell: (row) => <span>{row.uprootingDate}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Tsc",
      selector: (row) => row.tscName,
      cell: (row) => <span>{row.tscName}</span>,
      sortable: true,
      hide: "md",
    },
  ];

  return (
    <Layout title={t("Farmer Mulberry Extension Report")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Farmer Mulberry Extension Report")}</Block.Title>
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
                    {t("tsc")}
                    {/* <span className="text-danger">*</span> */}
                    </Form.Label>
                    <div className="form-control-wrap">
                        <Form.Select
                        name="tscId"
                        value={data.tscId}
                        onChange={handleInputs}
                        // onBlur={() => handleInputs}
                        // required
                        // isInvalid={
                        //     data.tscMasterId === undefined ||
                        //     data.tscMasterId === "0"
                        // }
                        >
                        <option value="">{t("select_tsc")}</option>
                        {tscListData.map((list) => (
                            <option
                            key={list.tscMasterId}
                            value={list.tscMasterId}
                            >
                            {list.name}
                            </option>
                        ))}
                        </Form.Select>
                        {/* <Form.Control.Feedback type="invalid">
                        {t("tsc_is_required")}
                        </Form.Control.Feedback> */}
                    </div>
                    </Form.Group>
                    </Col>

                    <Col sm={2}>
                        <Form.Group className="form-group mt-n4">
                            <Form.Label>
                            {t("Application Type")}
                            {/* <span className="text-danger">*</span> */}
                            </Form.Label>
                            <div className="form-control-wrap">
                            <Form.Select
                                name="applicationType"
                                value={data.applicationType}
                                onChange={handleInputs}
                            //   onBlur={() => handleInputs}
                            //   required
                            //   isInvalid={
                            //     data.schemeQuotaType === undefined || data.schemeQuotaType === "0"
                            //   }
                            >
                                <option value="0">{t("Application Type")}</option>
                                <option value="Mulberry Extension">Mulberry Extension</option>
                                <option value="New Plantation">New Plantation</option>
                                <option value="Uprooting">Uprooting</option>  
                                <option value="Nursery">Nursery</option>    
                            </Form.Select>
                            {/* <Form.Control.Feedback type="invalid">
                            {t("Scheme Quota Type is required")}
                            </Form.Control.Feedback> */}
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

export default FarmerMulberryExtensionReport;
