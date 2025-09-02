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
import TrainingTarget from "../new-target-setting/training-target/TrainingTarget";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_TARGET_SETTING;

function FarmTargetReport() {
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
    financialYearId: "",
    raceId: "",
    farmId: "",
    targetType: "",
  });


  // Search
  const search = (e) => {
    api
      .post(
        baseURLFarmer + `targets/getFarmTargetsDetails`,
        {},
        {
          params: {
            financialYearId: data.financialYearId || 0,
            raceId: data.raceId || 0,
            farmId: data.farmId || 0,
            targetType: data.targetType || '',
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
        baseURLFarmer + `targets/getFarmTargetsReport`,
        {},
        {
          params: {
            financialYearId: data.financialYearId || 0,
            raceId: data.raceId || 0,
            farmId: data.farmId || 0,
            targetType: data.targetType || '',
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
        link.download = `farm_targets_report.csv`;
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
        baseURLFarmer + `targets/getFarmTargetsDetails`,
        {},
        {
          params: {
            financialYearId: data.financialYearId || 0,
            raceId: data.raceId || 0,
            farmId: data.farmId || 0,
            targetType: data.targetType || '',
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



  // to get Financial Year
    const [financialyearListData, setFinancialyearListData] = useState([]);
  
    const getFinancialYearList = () => {
       api
        .get(baseURL + `financialYearMaster/get-all`)
        .then((response) => {
          setFinancialyearListData(response.data.content.financialYearMaster);
        })
        .catch((err) => {
          setFinancialyearListData([]);
        });
    };
  
    useEffect(() => {
      getFinancialYearList();
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

         // to get Farm
          const [farmListData, setFarmListData] = useState([]);
        
          const getFarmList = () => {
            const response = api
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
         

    // to get username
    const [userListData, setUserListData] = useState([]);
  
    const getUserList = () => {
      api
        .get(baseURL + `userMaster/get-all`)
        .then((response) => {
          setUserListData(response.data.content.userMaster);
        })
        .catch((err) => {
          setUserListData([]);
        });
    };
  
    useEffect(() => {
      getUserList();
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
      name: "Financial Year",
      selector: (row) => row.financialYear,
      cell: (row) => <span>{row.financialYear}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Race Name",
      selector: (row) => row.raceName,
      cell: (row) => <span>{row.raceName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Farm Name",
      selector: (row) => row.farmName,
      cell: (row) => <span>{row.farmName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Month",
      selector: (row) => row.month,
      cell: (row) => <span>{row.month}</span>,
      sortable: true,
      hide: "md",
    },
    
    {
      name: "Target Type",
      selector: (row) => row.targetType,
      cell: (row) => <span>{row.targetType}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Target",
      selector: (row) => row.value,
      cell: (row) => <span>{row.value}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "User",
      selector: (row) => row.username,
      cell: (row) => <span>{row.username}</span>,
      sortable: true,
      hide: "md",
    },
   
    
  ];

  return (
    <Layout title={t("Farm Target Details Report")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Farm Target Details Report")}</Block.Title>
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
                        {t("Financial Year")}
                        {/* <span className="text-danger">*</span> */}
                    </Form.Label>
                    <div className="form-control-wrap">
                        <Form.Select
                        name="financialYearId"
                        value={data.financialYearId}
                        onChange={handleInputs}
                        >
                        <option value="">{t("Select Year")}</option>
                        {financialyearListData && financialyearListData.length
                        ?financialyearListData.map((list) => (
                            <option
                            key={list.financialYearMasterId}
                            value={list.financialYearMasterId}
                            >
                            {list.financialYear}
                            </option>
                        ))
                        :""}
                        </Form.Select>
                       
                    </div>
                    </Form.Group>
                </Col>

                        
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
                                
                              >
                                <option value="">{t("Select Farm")}</option>
                                {farmListData && farmListData 
                                  ?farmListData.map((list) => (
                                  <option key={list.farmId} value={list.farmId}>
                                    {list.farmName}
                                  </option>
                                ))
                                :""}
                              </Form.Select>
                            </div>
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

                    <Col sm={2}>
                    <Form.Group className="form-group mt-n4">
                    <Form.Label>
                        {t("Target Type")}
                        {/* <span className="text-danger">*</span> */}
                    </Form.Label>
                    <div className="form-control-wrap">
                        <Form.Select
                        name="targetType"
                        value={data.targetType}
                        onChange={handleInputs}
                        
                        >
                        <option value="">{t("Select Target Type")}</option>
                        <option value="Brushing">{t("Brushing")}</option>
                        <option value="Cocoon Production">{t("Cocoon Production")}</option>

                        </Form.Select>
                        {/* <Form.Control.Feedback type="invalid">
                        {t("Month is required")}
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

export default FarmTargetReport;
