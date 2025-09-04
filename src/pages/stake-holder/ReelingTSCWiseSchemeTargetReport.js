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

function ReelingTSCWiseSchemeTargetReport() {
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
    tscId: "",
    scSchemeDetailsId: "",
    scSubSchemeDetailsId: "",
    scComponentId: "",
    scCategoryId: "",
    scHeadAccountId: "",
    targetType: "",
  });


  // Search
  const search = (e) => {
    api
      .post(
        baseURLFarmer + `schemeTargets/getReelingTscSchemeTargetsDetails`,
        {},
        {
          params: {
            financialYearId: data.financialYearId || 0,
            districtId: data.districtId || 0,
            tscId: data.tscId || 0,
            scSchemeDetailsId: data.scSchemeDetailsId || 0,
            scSubSchemeDetailsId: data.scSubSchemeDetailsId || 0,
            scComponentId: data.scComponentId || 0,
            scCategoryId: data.scCategoryId || 0,
            scHeadAccountId: data.scHeadAccountId || 0,
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
        baseURLFarmer + `schemeTargets/getReelingTscSchemeTargetsReport`,
        {},
        {
          params: {
           financialYearId: data.financialYearId || 0,
            districtId: data.districtId || 0,
            tscId: data.tscId || 0,
            scSchemeDetailsId: data.scSchemeDetailsId || 0,
            scSubSchemeDetailsId: data.scSubSchemeDetailsId || 0,
            scComponentId: data.scComponentId || 0,
            scCategoryId: data.scCategoryId || 0,
            scHeadAccountId: data.scHeadAccountId || 0,
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
        link.download = `reeling_tsc_scheme_targets_report.csv`;
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
        baseURLFarmer + `schemeTargets/getReelingTscSchemeTargetsDetails`,
        {},
        {
          params: {
            financialYearId: data.financialYearId || 0,
            districtId: data.districtId || 0,
            tscId: data.tscId || 0,
            scSchemeDetailsId: data.scSchemeDetailsId || 0,
            scSubSchemeDetailsId: data.scSubSchemeDetailsId || 0,
            scComponentId: data.scComponentId || 0,
            scCategoryId: data.scCategoryId || 0,
            scHeadAccountId: data.scHeadAccountId || 0,
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

    // to get sc-scheme-details
  const [scSchemeDetailsListData, setScSchemeDetailsListData] = useState([]);
  const getSchemeList = () => {
    api
      .get(baseURL + `scSchemeDetails/get-all`)
      .then((response) => {
        setScSchemeDetailsListData(response.data.content.ScSchemeDetails);
      })
      .catch((err) => {
        setScSchemeDetailsListData([]);
      });
  };

  useEffect(() => {
    getSchemeList();
  }, []);

  // to get sc-sub-scheme-details by sc-scheme-details
  const [scSubSchemeDetailsListData, setScSubSchemeDetailsListData] = useState(
    []
  );
  const getSubSchemeList = (_id) => {
    api
      .get(baseURLDBT + `master/cost/get-by-scheme-id/${_id}`)
      .then((response) => {
        if (response.data.content.unitCost) {
          setScSubSchemeDetailsListData(response.data.content.unitCost);
        }
      })
      .catch((err) => {
        setScSubSchemeDetailsListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.scSchemeDetailsId) {
      getSubSchemeList(data.scSchemeDetailsId);
    }
  }, [data.scSchemeDetailsId]);



  // to get component
  const [scComponentListData, setScComponentListData] = useState([]);

  const getComponentList = (schemeId, subSchemeId) => {
    api
      .post(baseURLDBT + `master/cost/get-by-schemeId-and-subSchemeId`, {
        schemeId: schemeId,
        subSchemeId: subSchemeId,
      })
      .then((response) => {
        setScComponentListData(response.data.content.unitCost);
      })
      .catch((err) => {
        setScComponentListData([]);
      });
  };

  const getHeadAccountbyschemeIdAndSubSchemeIdList = (
    schemeId,
    subSchemeId
  ) => {
    api
      .post(baseURLDBT + `master/cost/get-hoa-by-schemeId-and-subSchemeId`, {
        schemeId: schemeId,
        subSchemeId: subSchemeId,
      })
      .then((response) => {
        if (response.data.content.unitCost) {
          setScHeadAccountListData(response.data.content.unitCost);
        }
      })
      .catch((err) => {
        setScHeadAccountListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.scSchemeDetailsId && data.scSubSchemeDetailsId) {
      getComponentList(data.scSchemeDetailsId, data.scSubSchemeDetailsId);
      getHeadAccountbyschemeIdAndSubSchemeIdList(
        data.scSchemeDetailsId,
        data.scSubSchemeDetailsId
      );
    }
  }, [data.scSchemeDetailsId, data.scSubSchemeDetailsId]);

    // to get head of account by sc-scheme-details
    const [scHeadAccountListData, setScHeadAccountListData] = useState([]);
    const getHeadAccountList = (schemeId, subSchemeId, scComponentId) => {
      api
        .post(
          baseURLDBT +
            `master/cost/get-by-schemeId-and-subSchemeId-and-scComponentId`,
          {
            schemeId: schemeId,
            subSchemeId: subSchemeId,
            scComponentId: scComponentId,
          }
        )
        .then((response) => {
          if (response.data.content.unitCost) {
            setScHeadAccountListData(response.data.content.unitCost);
          }
        })
        .catch((err) => {
          setScHeadAccountListData([]);
          // alert(err.response.data.errorMessages[0].message[0].message);
        });
    };
  
    useEffect(() => {
      if (
        data.scSchemeDetailsId &&
        data.scSubSchemeDetailsId &&
        data.scComponentId
      ) {
        getHeadAccountList(
          data.scSchemeDetailsId,
          data.scSubSchemeDetailsId,
          data.scComponentId
        );
      }
    }, [data.scSchemeDetailsId, data.scSubSchemeDetailsId, data.scComponentId]);
  
     
// get Category List
  const [scCategoryListData, setScCategoryListData] = useState([]);

  const getCategoryList = () => {
    api
      .get(baseURL + `scCategory/get-all`)
      .then((response) => {
        if (response.data.content.scCategory) {
          setScCategoryListData(response.data.content.scCategory);
        }
      })
      .catch((err) => {
        setScCategoryListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    getCategoryList();
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
      name: "Scheme",
      selector: (row) => row.schemeName,
      cell: (row) => <span>{row.schemeName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Component Type",
      selector: (row) => row.subSchemeName,
      cell: (row) => <span>{row.subSchemeName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Component",
      selector: (row) => row.componentName,
      cell: (row) => <span>{row.componentName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Sub Component",
      selector: (row) => row.categoryName,
      cell: (row) => <span>{row.categoryName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Head of Account",
      selector: (row) => row.headAccountName,
      cell: (row) => <span>{row.headAccountName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "State Share",
      selector: (row) => row.stateShare,
      cell: (row) => <span>{row.stateShare}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Central Share",
      selector: (row) => row.centralShare,
      cell: (row) => <span>{row.centralShare}</span>,
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
      name: "Month",
      selector: (row) => row.month,
      cell: (row) => <span>{row.month}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Value",
      selector: (row) => row.value,
      cell: (row) => <span>{row.value}</span>,
      sortable: true,
      hide: "md",
    },
   {
      name: "User Name",
      selector: (row) => row.userName,
      cell: (row) => <span>{row.userName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Institution",
      selector: (row) => row.institution,
      cell: (row) => <span>{row.institution}</span>,
      sortable: true,
      hide: "md",
    },
   
    
  ];

  return (
    <Layout title={t("Reeling TSC Wise Scheme Target Details Report")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Reeling TSC Wise Scheme Target Details Report")}</Block.Title>
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
                        <Form.Label htmlFor="sordfl">
                            {t("Scheme")}
                            {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <div className="form-control-wrap">
                            <Form.Select
                            name="scSchemeDetailsId"
                            value={data.scSchemeDetailsId}
                            onChange={handleInputs}
                            
                            >
                            <option value="">{t("Select Scheme Names")}</option>
                            {scSchemeDetailsListData &&
                                scSchemeDetailsListData.length ? scSchemeDetailsListData.map((list) => (
                                <option
                                    key={list.scSchemeDetailsId}
                                    value={list.scSchemeDetailsId}
                                >
                                    {list.schemeName}
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
                            {t("Component Type")}
                            {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <div className="form-control-wrap">
                            <Form.Select
                            name="scSubSchemeDetailsId"
                            value={data.scSubSchemeDetailsId}
                            onChange={handleInputs}
                            
                            >
                            <option value="">{t("Select Component Type")}</option>
                            {scSubSchemeDetailsListData &&
                                scSubSchemeDetailsListData.length ? scSubSchemeDetailsListData.map((list, i) => (
                                <option key={i} value={list.subSchemeId}>
                                    {list.subSchemeName}
                                </option>
                                ))
                                : ""}
                            </Form.Select>
                           
                        </div>
                        </Form.Group>
                    </Col>

                    <Col sm={2}>
                        <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                            {t("Component")}
                            {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <div className="form-control-wrap">
                            <Form.Select
                            name="scComponentId"
                            value={data.scComponentId}
                            onChange={handleInputs}
                            
                            >
                            <option value="">{t("Select Component")}</option>
                            {scComponentListData &&
                                scComponentListData.length ? scComponentListData.map((list) => (
                                <option
                                    key={list.scComponentId}
                                    value={list.scComponentId}
                                >
                                    {list.scComponentName}
                                </option>
                                ))
                                : ""}
                            </Form.Select>
                            
                        </div>
                        </Form.Group>
                    </Col>

                    <Col sm={2}>
                        <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="sordfl">
                            {t("Sub Component")}
                            {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <div className="form-control-wrap">
                            <Form.Select
                            name="scCategoryId"
                            value={data.scCategoryId}
                            onChange={handleInputs}
                            
                            >
                            <option value="">{t("Select Sub Component")}</option>
                            {scCategoryListData &&
                                scCategoryListData.length ? scCategoryListData.map((list) => (
                                <option
                                    key={list.scCategoryId}
                                    value={list.scCategoryId}
                                >
                                    {list.codeNumber}
                                </option>
                                ))
                                : ""}
                            </Form.Select>
                            {/* <Form.Control.Feedback type="invalid">
                            {t("Sub Component is required")}
                            </Form.Control.Feedback> */}
                        </div>
                        </Form.Group>
                    </Col>

                    <Col sm={2}>
                        <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="sordfl">
                            {t("Head of Account")}
                            {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <div className="form-control-wrap">
                            <Form.Select
                            name="scHeadAccountId"
                            value={data.scHeadAccountId}
                            onChange={handleInputs}
                           
                            >
                            <option value="">{t("Select Head of Account")}</option>
                            {scHeadAccountListData &&
                                scHeadAccountListData.length ?
                                scHeadAccountListData.map((list) => (
                                <option
                                    key={list.headOfAccountId}
                                    value={list.headOfAccountId}
                                >
                                    {list.scHeadAccountName}
                                </option>
                                ))
                                :""}
                            </Form.Select>
                            
                        </div>
                        </Form.Group>
                    </Col>

                    <Col sm={2}>
                        <Form.Group className="form-group mt-3">
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

                       

                        {/* <Col sm={2}>
                          <Form.Group className="form-group mt-n4">
                            <Form.Label>
                              {t("Race")}
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
                              </div>
                            </Col>
                          </Form.Group>
                        </Col>

                         <Col sm={2}>
                            <Form.Group className="form-group mt-n4">
                            <Form.Label>
                            {t("tsc")}
                            </Form.Label>
                            <div className="form-control-wrap">
                                <Form.Select
                                name="tscId"
                                value={data.tscId}
                                onChange={handleInputs}
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
                            </div>
                            </Form.Group>
                            </Col> */}
                        
            {/* <Col sm={2}>
              <Button type="button" variant="primary" onClick={search}>
                {t("Search")}
              </Button>
            </Col>
            <Col sm={2}>
              <Button type="button" variant="primary" onClick={exportCsv}>
                {t("Export")}
              </Button>
            </Col> */}
            <Col sm={4} className="d-flex align-items-end gap-2">
            <Button type="button" variant="primary" onClick={search}>
                {t("Search")}
            </Button>
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

export default ReelingTSCWiseSchemeTargetReport;
