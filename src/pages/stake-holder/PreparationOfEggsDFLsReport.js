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

function PreparationOfEggsDFLsReport() {
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
    lineNameId: "",
    raceId: "",
  });



  // Search
  const search = (e) => {
    api
      .post(
        baseURLFarmer + `EggPreparation/preparationOfEggsLotsDetails`,
        {},
        {
          params: {
            lineNameId: data.lineNameId || 0,
            raceId: data.raceId || 0,
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
        baseURLFarmer + `EggPreparation/preparationOfEggsLotsReport`,
        {},
        {
          params: {
            lineNameId: data.lineNameId || 0,
            raceId: data.raceId || 0,
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
        link.download = `preparation_of_eggs_lots_report.csv`;
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
        baseURLFarmer + `EggPreparation/preparationOfEggsLotsDetails`,
        {},
        {
          params: {
            lineNameId: data.lineNameId || 0,
            raceId: data.raceId || 0,
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
      name: "Lot Number",
      selector: (row) => row.preparationEggsLotNumber,
      cell: (row) => <span>{row.preparationEggsLotNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Number Of Cocoons",
      selector: (row) => row.numberOfCocoonscb,
      cell: (row) => <span>{row.numberOfCocoonscb}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Line Name",
      selector: (row) => row.lineName,
      cell: (row) => <span>{row.lineName}</span>,
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
      name: "Date Of Moth Emergence",
      selector: (row) => row.lotDateOfMothEmergence,
      cell: (row) => <span>{row.lotDateOfMothEmergence}</span>,
      sortable: true,
      hide: "md",
    },
    
    {
      name: "Laid On Date",
      selector: (row) => row.lotLaidOnDate,
      cell: (row) => <span>{row.lotLaidOnDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Egg Sheet Serial number",
      selector: (row) => row.lotEggSheetSerialNumber,
      cell: (row) => <span>{row.lotEggSheetSerialNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "DFLs Obtained",
      selector: (row) => row.lotDflsObtained,
      cell: (row) => <span>{row.lotDflsObtained}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Egg Recovery Percentage",
      selector: (row) => row.lotEggRecoveryPercentage,
      cell: (row) => <span>{row.lotEggRecoveryPercentage}</span>,
      sortable: true,
      hide: "md",
    },
     {
      name: "Remaining DFLs",
      selector: (row) => row.lotRemainingDfls,
      cell: (row) => <span>{row.lotRemainingDfls}</span>,
      sortable: true,
      hide: "md",
    },
 
  ];

  return (
    <Layout title={t("Added DFLs Details Report")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Added DFLs Details Report")}</Block.Title>
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
                {t("Line")}
                {/* <span className="text-danger">*</span> */}
            </Form.Label>
            <Col>
                <div className="form-control-wrap">
                <Form.Select
                    name="lineNameId"
                    value={data.lineNameId}
                    onChange={handleInputs}
                //   onBlur={() => handleInputs}
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

             
            <Col sm={2}>
            <Form.Group className="form-group mt-n4">
            <Form.Label>
                {t("Race")}
                {/* <span className="text-danger">*</span> */}
            </Form.Label>
            <Col>
                <div className="form-control-wrap">
                <Form.Select
                    name="raceId"
                    value={data.raceId}
                    onChange={handleInputs}
                //   onBlur={() => handleInputs}
                    // required
                >
                    <option value="">{t("Select Race")}</option>
                    {raceListData.map((list) => (
                    <option
                        key={list.raceMasterId}
                        value={list.raceMasterId}
                    >
                        {list.raceMasterName}
                    </option>
                    ))}
                </Form.Select>
                {/* <Form.Control.Feedback type="invalid">
                    Race is required
                </Form.Control.Feedback> */}
                </div>
            </Col>
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

export default PreparationOfEggsDFLsReport







;
