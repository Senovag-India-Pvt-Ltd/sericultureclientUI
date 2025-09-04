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
import api from "../../services/auth/api";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import TrainingTarget from "../new-target-setting/training-target/TrainingTarget";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_TARGET_SETTING;

function ProductionAchievementReport() {
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
    districtId: "",
    mulberryTargetTypeId: "",
    raceId: "",
    tscId: "",
  });


  // Search
  const search = (e) => {
    api
      .post(
        baseURLFarmer + `schemeAchievement/getProductionAchievements`,
        {},
        {
          params: {
            financialYearId: data.financialYearId || 0,
            districtId: data.districtId || 0,
            mulberryTargetTypeId: data.mulberryTargetTypeId || 0,
            raceId: data.raceId || 0,
            tscId: data.tscId || 0,
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
        baseURLFarmer + `schemeAchievement/getProductionAchievementsReport`,
        {},
        {
          params: {
           financialYearId: data.financialYearId || 0,
            districtId: data.districtId || 0,
            mulberryTargetTypeId: data.mulberryTargetTypeId || 0,
            raceId: data.raceId || 0,
            tscId: data.tscId || 0,
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
        link.download = `production_achievement_report.csv`;
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
        baseURLFarmer + `schemeAchievement/getProductionAchievements`,
        {},
        {
          params: {
            financialYearId: data.financialYearId || 0,
            districtId: data.districtId || 0,
            mulberryTargetTypeId: data.mulberryTargetTypeId || 0,
            raceId: data.raceId || 0,
            tscId: data.tscId || 0,
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

  const [message, setMessage] = useState("");
  const getMulberryTargetTypeLists = (mulberryId) => {
    const response = api
      .get(baseURL + `mulberryTargetType/get/${mulberryId}`)
      .then((response) => {
        // setMulberryTargetTypeData(response.data.content.mulberryTargetType);
        setMessage(response.data.content.unit)
      })
      .catch((err) => {
        // setMulberryTargetTypeData([]);
      });
  };

  useEffect(() => {
    if(data.mulberryTargetTypeId){
      getMulberryTargetTypeLists(data.mulberryTargetTypeId)
    }
  }, [data.mulberryTargetTypeId]);

  // to get mulberry target type
  const [mulberryTargetTypeData, setMulberryTargetTypeData] = useState([]);

  const getMulberryTargetTypeList = () => {
    api
      .get(baseURL + `mulberryTargetType/get-by-required-false`)
      .then((response) => {
         setMulberryTargetTypeData(response.data.mulberryTargetType);
      })
      .catch((err) => {
        setMulberryTargetTypeData([]);
      });
  };

  useEffect(() => {
    getMulberryTargetTypeList();
  }, []);

  // to get District
    const [districtListData, setDistrictListData] = useState([]);
  
    const getDistrictList = () => {
      const response = api
        .get(baseURL + `district/get-all`)
        .then((response) => {
          setDistrictListData(response.data.content.district);
        })
        .catch((err) => {
          setDistrictListData([]);
        });
    };
  
    useEffect(() => {
      getDistrictList();
    }, []);
  

  

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
      name: "Target",
      selector: (row) => row.mulberryTargetTypeName,
      cell: (row) => <span>{row.mulberryTargetTypeName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "District",
      selector: (row) => row.districtName,
      cell: (row) => <span>{row.districtName}</span>,
      sortable: true,
      hide: "md", 
    },
    {
      name: "Taluk",
      selector: (row) => row.talukName,
      cell: (row) => <span>{row.talukName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "TSC",
      selector: (row) => row.tscName,
      cell: (row) => <span>{row.tscName}</span>,
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
      name: "Month",
      selector: (row) => row.month,
      cell: (row) => <span>{row.month}</span>,
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
      selector: (row) => row.userName,
      cell: (row) => <span>{row.userName}</span>,
      sortable: true,
      hide: "md",
    },
   
    
  ];

  return (
    <Layout title={t("Range Wise Physical Target Details Report")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Range Wise Physical Target Details Report")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent></Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1">
          <Row className="m-4">
            

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
                        <Form.Label>{t("District")}</Form.Label>
                        <div className="form-control-wrap">
                        <Form.Select
                            name="districtId"
                            value={data.districtId}
                            onChange={handleInputs}
                            
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
                        
                        </div>
                    </Form.Group>
                    </Col>
                       <Col sm={2}>
                          <Form.Group className="form-group mt-n4">
                            <Form.Label>
                              {t("Target")}
                              {/* <span className="text-danger">*</span> */}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="mulberryTargetTypeId"
                                value={data.mulberryTargetTypeId}
                                onChange={handleInputs}
                                
                              >
                                <option value="">
                                  {t("Select Target")}
                                </option>
                                {mulberryTargetTypeData &&
                                mulberryTargetTypeData.length
                                  ? mulberryTargetTypeData.map((list) => (
                                      <option
                                        key={list.mulberryTargetTypeId}
                                        value={list.mulberryTargetTypeId}
                                      >
                                        {list.mulberryTargetTypeName}
                                      </option>
                                    ))
                                  : ""}
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
                                  
                                >
                                  <option value="">{t("Select Race")}</option>
                                  {raceListData && raceListData.length
                                  ? raceListData.map((list) => (
                                    <option
                                      key={list.raceMasterId}
                                      value={list.raceMasterId}
                                    >
                                      {list.raceMasterName}
                                    </option>
                                  ))
                                  :""}
                                </Form.Select>
                                {/* <Form.Control.Feedback type="invalid">
                                  {t("Race is required")}
                                </Form.Control.Feedback> */}
                              </div>
                            </Col>
                          </Form.Group>
                        </Col>

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

export default ProductionAchievementReport;
