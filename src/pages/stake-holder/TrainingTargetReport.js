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

function TrainingTargetReport() {
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
    trainingInstitutionId: "",
    trainingProgramId: "",
    targetType: "",
  });

  // 🔍 Search (getTargetDetails)
const search = (e) => {
  api
    .post(
      baseURLFarmer + `targets/getGrainageTargetsDetails`,
      {
        financialYearMasterId: data.financialYearId || 0,
        trainingInstitutionId: data.trainingInstitutionId || 0,
        courseId: data.trainingProgramId || 0,   // maps to courseId/trainingProgramId
        raceMasterId: data.raceId || 0,
        grainageMasterId: data.grainageId || 0,
        targetType: data.targetType || '',
        targetTypetraining: data.targetTypetraining || 'training', // training OR grainage
      },
      {
        params: {
          pageNumber: page,
          pageSize: countPerPage,
        },
      }
    )
    .then((response) => {
  const records = response?.data?.content?.body?.content || [];
  setListData(records);

  const total = response?.data?.content?.body?.totalRecords || 0;
  setTotalRows(total);
})

    .catch((err) => {
      setListData([]);
    });
};

// 📤 Export Report (getTargetReport)
const exportCsv = (e) => {
  api
    .post(
      baseURLFarmer + `targets/getGrainageTargetsReport`,
      {
        financialYearMasterId: data.financialYearId || 0,
        trainingInstitutionId: data.trainingInstitutionId || 0,
        courseId: data.trainingProgramId || 0,
        raceMasterId: data.raceId || 0,
        grainageMasterId: data.grainageId || 0,
        targetType: data.targetType || '',
        targetTypetraining: data.targetTypetraining || 'training',
      },
      {
        responseType: "blob",
        headers: {
          accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `targets_report.xlsx`;
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

// 📥 Init Load (calls getTargetDetails)
const getFarmerList = (e) => {
  api
    .post(
      baseURLFarmer + `targets/getGrainageTargetsDetails`,
      {
        financialYearMasterId: data.financialYearId || 0,
        trainingInstitutionId: data.trainingInstitutionId || 0,
        courseId: data.trainingProgramId || 0,
        raceMasterId: data.raceId || 0,
        grainageMasterId: data.grainageId || 0,
        targetType: data.targetType || '',
        targetTypetraining: data.targetTypetraining || 'training',
      },
      {
        params: {
          pageNumber: page,
          pageSize: countPerPage,
        },
      }
    )
    .then((response) => {
  const records = response?.data?.content?.body?.content || [];
  setListData(records);

  const total = response?.data?.content?.body?.totalRecords || 0;
  setTotalRows(total);
})

    .catch((err) => {
      setListData([]);
    });
};

useEffect(() => {
  getFarmerList();
}, [page]);

// 📝 Input Handler
const handleInputs = (e) => {
  let { name, value } = e.target;
  setData({ ...data, [name]: value });
};



//   // Search
//   const search = (e) => {
//     api
//       .post(
//         baseURLFarmer + `targets/getGrainageTargetsDetails`,
//         {},
//         {
//           params: {
//             financialYearId: data.financialYearId || 0,
//             trainingInstitutionId: data.trainingInstitutionId || 0,
//             trainingProgramId: data.trainingProgramId || 0,
//             targetType: data.targetType || '',
//             pageNumber: page,
//             pageSize: countPerPage,
//           },
//         }
//       )
//       .then((response) => {
//         setListData(response.data.content);
//         setTotalRows(response.data.totalRecords);
//       })
//       .catch((err) => {
//         setListData([]);
//       });
//   };

//   const exportCsv = (e) => {
//     api
//       .post(
//         baseURLFarmer + `targets/getGrainageTargetsReport`,
//         {},
//         {
//           params: {
//            financialYearId: data.financialYearId || 0,
//             trainingInstitutionId: data.trainingInstitutionId || 0,
//             trainingProgramId: data.trainingProgramId || 0,
//             targetType: data.targetType || '',
//           },
//           responseType: 'blob',
//           headers: {
//             accept: "text/csv",
//             "Content-Type": "application/json",
//           },
//         }
//       )
//       .then((response) => {
//         const blob = new Blob([response.data], { type: "text/csv" });
//         const link = document.createElement("a");
//         link.href = window.URL.createObjectURL(blob);
//         link.download = `training_targets_report.csv`;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         window.URL.revokeObjectURL(link.href);
//       })
//       .catch((err) => {
//         Swal.fire({
//           icon: "warning",
//           title: "No record found!!!",
//         });
//       });
// };

//   const getFarmerList = (e) => {
//     api
//       .post(
//         baseURLFarmer + `targets/getGrainageTargetsDetails`,
//         {},
//         {
//           params: {
//             financialYearId: data.financialYearId || 0,
//             trainingInstitutionId: data.trainingInstitutionId || 0,
//             trainingProgramId: data.trainingProgramId || 0,
//             targetType: data.targetType || '',
//             pageNumber: page,
//             pageSize: countPerPage,
//           },
//         }
//       )
//       .then((response) => {
//         setListData(response.data.content);
//         setTotalRows(response.data.totalRecords);
//       })
//       .catch((err) => {
//         setListData([]);
//       });
//   };

//   useEffect(() => {
//     getFarmerList();
//   }, [page]);

//   const handleInputs = (e) => {
//     // debugger;
//     let { name, value } = e.target;
//     setData({ ...data, [name]: value });
//   };

  
    // to get TrGroup
  const [trGroupListData, setTrGroupListData] = useState([]);

  const getTrGroupList = () => {
    const response = api
      .get(baseURL + `trGroupMaster/get-all`)
      .then((response) => {
        setTrGroupListData(response.data.content.trGroupMaster);
      })
      .catch((err) => {
        setTrGroupListData([]);
      });
  };

  useEffect(() => {
    getTrGroupList();
  }, []);

  // to get TrProgram
  const [trProgramListData, setTrProgramListData] = useState([]);

  const getTrProgramList = () => {
    const response = api
      .get(baseURL + `trProgramMaster/get-all`)
      .then((response) => {
        setTrProgramListData(response.data.content.trProgramMaster);
      })
      .catch((err) => {
        setTrProgramListData([]);
      });
  };

  useEffect(() => {
    getTrProgramList();
  }, []);

  // to get Course
  const [trCourseListData, setTrCourseListData] = useState([]);

  const getTrCourseList = () => {
    const response = api
      .get(baseURL + `trCourseMaster/get-all`)
      .then((response) => {
        setTrCourseListData(response.data.content.trCourseMaster);
      })
      .catch((err) => {
        setTrCourseListData([]);
      });
  };

  useEffect(() => {
    getTrCourseList();
  }, []);

  // to get TrInstitutionMaster
  const [trInstituteListData, setTrInstituteListData] = useState([]);

  const getTrInstitutionMasterList = () => {
    api
      .get(baseURL + `trInstitutionMaster/get-all`)
      .then((response) => {
        setTrInstituteListData(response.data.content.trInstitutionMaster);
      })
      .catch((err) => {
        setTrInstituteListData([]);
      });
  };

  useEffect(() => {
    getTrInstitutionMasterList();
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
      name: "Institution Name",
      selector: (row) => row.tscName,
      cell: (row) => <span>{row.tscName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Training Program",
      selector: (row) => row.courseName,
      cell: (row) => <span>{row.courseName}</span>,
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
    {
      name: "Target",
      selector: (row) => row.value,
      cell: (row) => <span>{row.value}</span>,
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
   
    
  ];

  return (
    <Layout title={t("Training Target Details Report")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Training Target Details Report")}</Block.Title>
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
                              {t("Training Institution")}
                              {/* <span className="text-danger">*</span> */}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="trainingInstitutionId"
                                value={data.trainingInstitutionId}
                                onChange={handleInputs}
                                
                              >
                                <option value="">{t("Select Institution")}</option>
                                {trInstituteListData && trInstituteListData.length ?
                                trInstituteListData.map((list) => (
                                  <option
                                    key={list.trInstitutionMasterId}
                                    value={list.trInstitutionMasterId}
                                  >
                                    {list.trInstitutionMasterName}
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
                              {t("Training Program")}
                              {/* <span className="text-danger">*</span> */}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="trainingProgramId"
                                value={data.trainingProgramId}
                                onChange={handleInputs}
                               
                              >
                                <option value="">{t("Select Program")}</option>
                                {trCourseListData && trCourseListData.length
                                ?trCourseListData.map((list) => (
                                  <option
                                    key={list.trCourseMasterId}
                                    value={list.trCourseMasterId}
                                  >
                                    {list.trCourseMasterName}
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
                            <option value="PHYSICAL TARGET">PHYSICAL TARGET</option>
                            <option value="FINANCIAL TARGET">FINANCIAL TARGET</option>

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

export default TrainingTargetReport;
