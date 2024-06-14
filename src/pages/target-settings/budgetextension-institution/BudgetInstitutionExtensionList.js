import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
// import DataTable from "../../../components/DataTable/DataTable";
import DataTable, { createTheme } from "react-data-table-component";
import Swal from "sweetalert2/src/sweetalert2.js";
import { useNavigate } from "react-router-dom";
import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

import api from "../../../../src/services/auth/api";

const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLTargetSetting = process.env.REACT_APP_API_BASE_URL_TARGET_SETTING;

function BudgetInstitutionExtensionList() {
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };
  const [show, setShow] = useState(false);

  const [data, setData] = useState({
    financialYearMasterId: "",
    // tsBudgetInstitutionId: "",
    scHeadAccountId: "",
    districtId: "",
    talukId: "",
    // date: "",
    // budgetAmount: "",
    scSchemeDetailsId: "",
    scSubSchemeDetailsId: "",
    scCategoryId: "",
    institutionType: "1",
    institutionId: "",
    // districtImplementingOfficerId: "",
    // talukImplementingOfficerId: "",
    // institutionImplementingOfficerId: "",
    scComponentId: "",
    scComponentTypeId: "",
  });

  const [designation, setDesignation] = useState({
    designationId: "",
  });

  

  const handleDesignationInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setDesignation({ ...data, [name]: value });
  };

  const handleTypeInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setType({ ...type, [name]: value });
  };

  const [type, setType] = useState({
    budgetType: "allocate",
  });

  const getList = () => {
    // setLoading(true);
    if (type.budgetType === "allocate") {
    api
      .post(baseURLTargetSetting + `tsBudgetInstitutionExt/get-details`, data)
      .then((response) => {
        if (response.data.content.error) {
          saveError(response.data.content.error_description);
          setShow(false);
        } else {
          setListData(response.data.content.tsBudgetInstitutionExt);
          setShow(true);
          // saveSuccess();
          // clear();
        }
      })
      .catch((err) => {
        if (
          err.response &&
          err.response &&
          err.response.data &&
          err.response.data.validationErrors
        ) {
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            // saveError(err.response.data.validationErrors);
          }
        }
      });
  };

  if (type.budgetType === "release") {
    api
      .post(baseURLTargetSetting + `tsReleaseBudgetInstitutionExt/get-details`, data)
      .then((response) => {
        if (response.data.content.error) {
          saveError(response.data.content.error_description);
          setShow(false);
        } else {
          setListData(response.data.content.tsReleaseBudgetInstitutionExt);
          setShow(true);
          // saveSuccess();
          // clear();
        }
      })
      .catch((err) => {
        if (
          err.response &&
          err.response &&
          err.response.data &&
          err.response.data.validationErrors
        ) {
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            // saveError(err.response.data.validationErrors);
          }
        }
      });
  }
};

  // to get farm
  const [farmListData, setFarmListData] = useState([]);

  const getFarmList = () => {
    api
      .get(baseURLMasterData + `farmMaster/get-all`)
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
      .get(baseURLMasterData + `grainageMaster/get-all`)
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

  // to get Grainage
  const [userListData, setUserListData] = useState([]);

  const getUserList = () => {
    const response = api
      .get(baseURLMasterData + `userMaster/get-all`)
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

   // to get TSC
   const [tscListData, setTscListData] = useState([]);

   const getTscList = () => {
     const response = api
       .get(baseURLMasterData + `tscMaster/get-all`)
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

   // to get Market
  const [marketListData, setMarketListData] = useState([]);

  const getMarketList = () => {
    const response = api
      .get(baseURLMasterData + `marketMaster/get-all`)
      .then((response) => {
        setMarketListData(response.data.content.marketMaster);
      })
      .catch((err) => {
        setMarketListData([]);
      });
  };

  useEffect(() => {
    getMarketList();
  }, []);


   // Get Default Financial Year

   const getFinancialDefaultDetails = () => {
    api
      .get(baseURLMasterData + `financialYearMaster/get-is-default`)
      .then((response) => {
        setData((prev) => ({
          ...prev,
          financialYearMasterId: response.data.content.financialYearMasterId,
        }));
      })
      .catch((err) => {
        setData((prev) => ({
          ...prev,
          financialYearMasterId: "",
        }));
      });
  };

  useEffect(() => {
    getFinancialDefaultDetails();
  }, []);

 // to get Financial Year
 const [financialYearListData, setFinancialYearListData] = useState([]);

 const getFinancialYearList = () => {
   const response = api
     .get(baseURLMasterData + `financialYearMaster/get-all`)
     .then((response) => {
       setFinancialYearListData(response.data.content.financialYearMaster);
     })
     .catch((err) => {
       setFinancialYearListData([]);
     });
 };

 useEffect(() => {
   getFinancialYearList();
 }, []);

 

 // to get District
 const [districtListData, setDistrictListData] = useState([]);

 const getDistrictList = () => {
   const response = api
     .get(baseURLMasterData + `district/get-all`)
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

 // to get Taluk
 const [talukListData, setTalukListData] = useState([]);

 const getTalukList = () => {
   const response = api
     .get(baseURLMasterData + `taluk/get-all`)
     .then((response) => {
       setTalukListData(response.data.content.taluk);
     })
     .catch((err) => {
       setTalukListData([]);
     });
 };

 useEffect(() => {
   getTalukList();
 }, []);

 // to get designation
 const [designationListData, setDesignationListData] = useState([]);

 const getDesignationList = () => {
   const response = api
     .get(baseURLMasterData + `designation/get-all`)
     .then((response) => {
       if (response.data.content.designation) {
         setDesignationListData(response.data.content.designation);
       }
     })
     .catch((err) => {
       setDesignationListData([]);
       // alert(err.response.data.errorMessages[0].message[0].message);
     });
 };

 useEffect(() => {
  getDesignationList();
 }, []);

 // to get District Implementing Officer
 const [districtImplementingOfficerListData, setDistrictImplementingOfficerListData] = useState([]);

 const getDistrictImplementingOfficerList = (designationId, districtId) => {
   api
     .post(baseURLMasterData + `userMaster/get-by-designationId-and-districtId`, {
       designationId: designationId,
       districtId: districtId,
     })
     .then((response) => {
       setDistrictImplementingOfficerListData(response.data.content.userMaster);
     })
     .catch((err) => {
       setDistrictImplementingOfficerListData([]);
     });
 };

 useEffect(() => {
   if (designation.designationId && data.districtId) {
     // getComponentList(data.scSchemeDetailsId, data.scSubSchemeDetailsId);
     getDistrictImplementingOfficerList(
       designation.designationId,
       data.districtId
     );
   }
 }, [designation.designationId, data.districtId]);

 // to get Taluk Implementing Officer
 const [talukImplementingOfficerListData, setTalukImplementingOfficerListData] = useState([]);

 const getTalukImplementingOfficerList = (designationId,districtId, talukId) => {
   api
     .post(baseURLMasterData + `userMaster/get-by-designationId-and-districtId-and-talukId`, {
       designationId: designationId,
       districtId: districtId,
       talukId: talukId,
     })
     .then((response) => {
       setTalukImplementingOfficerListData(response.data.content.userMaster);
     })
     .catch((err) => {
       setTalukImplementingOfficerListData([]);
     });
 };

 useEffect(() => {
   if (designation.designationId && data.districtId && data.talukId) {
     // getComponentList(data.scSchemeDetailsId, data.scSubSchemeDetailsId);
     getTalukImplementingOfficerList(
       designation.designationId,
       data.districtId ,
       data.talukId
     );
   }
 }, [designation.designationId,data.districtId, data.talukId]);

    // to get sc-scheme-details
    const [scSchemeDetailsListData, setScSchemeDetailsListData] = useState([]);

    const getSchemeDetailsList = () => {
      api
        .get(baseURLMasterData + `scSchemeDetails/get-all`)
        .then((response) => {
          setScSchemeDetailsListData(response.data.content.ScSchemeDetails);
        })
        .catch((err) => {
          setScSchemeDetailsListData([]);
        });
    };
  
    useEffect(() => {
      getSchemeDetailsList();
    }, []);
  
    // to get Financial Year
    const [financialyearListData, setFinancialyearListData] = useState([]);
  
    const getFinancialList = () => {
      api
        .get(baseURLMasterData + `financialYearMaster/get-all`)
        .then((response) => {
          setFinancialyearListData(response.data.content.financialYearMaster);
        })
        .catch((err) => {
          setFinancialyearListData([]);
        });
    };
  
    useEffect(() => {
      getFinancialList();
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
          } else {
            setScSubSchemeDetailsListData([]);
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
        getSchemeQuotaList(data.scSchemeDetailsId);
      }
    }, [data.scSchemeDetailsId]);
  
 
  
    // to get head of account by sc-scheme-details
    const [scHeadAccountListData, setScHeadAccountListData] = useState([]);
    
    const getHeadAccountList = () => {
      api
        .get(baseURLMasterData + `scHeadAccount/get-all`)
        .then((response) => {
          if (response.data.content.scHeadAccount) {
            setScHeadAccountListData(response.data.content.scHeadAccount);
          }
        })
        .catch((err) => {
          setScHeadAccountListData([]);
          // alert(err.response.data.errorMessages[0].message[0].message);
        });
    };
  
    useEffect(() => {
      getHeadAccountList();
    }, []);
  
    // to get category by head of account id
    const [scCategoryListData, setScCategoryListData] = useState([]);
    
    const getCategoryList = () => {
      api
        .get(baseURLMasterData + `scCategory/get-all`)
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
  
    
  
    // to get scheme-Quota-details
    const [schemeQuotaDetailsListData, setSchemeQuotaDetailsListData] = useState(
      []
    );
  
    const getSchemeQuotaList = (_id) => {
      api
        .get(baseURLMasterData + `schemeQuota/get-by-sc-scheme-details-id/${_id}`)
        .then((response) => {
          if (response.data.content.schemeQuota) {
            setSchemeQuotaDetailsListData(response.data.content.schemeQuota);
          } else {
            setSchemeQuotaDetailsListData([]);
          }
        })
        .catch((err) => {
          setSchemeQuotaDetailsListData([]);
        });
    };
  
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

  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    });
  };

  const saveError = (message) => {
    let errorMessage;
    if (typeof message === "object") {
      errorMessage = Object.values(message).join("<br>");
    } else {
      errorMessage = message;
    }
    Swal.fire({
      icon: "error",
      title: "Attempt was not successful",
      html: errorMessage,
    });
  };

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const navigate = useNavigate();
  const handleView = (id,type) => {
    navigate(`/seriui/budgetinstitutionextension-view/${id}/${type}`);
  };

  const handleEdit = (id,type) => {
    navigate(`/seriui/budgetinstitutionextension-edit/${id}/${type}`);
  };

  const deleteError = () => {
    Swal.fire({
      icon: "error",
      title: "Delete attempt was not successful",
      text: "Something went wrong!",
    });
  };

  const deleteConfirm = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "It will delete permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        const response = api
          .delete(baseURLMasterData + `tsBudgetTaluk/delete/${id}`)
          .then((response) => {
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
      } else {
        console.log(result.value);
        Swal.fire("Cancelled", "Your record is not deleted", "info");
      }
    });
  };

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      // event.stopPropagation();
      getList();
      setValidated(true);
    }
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
    rows: {
      style: {
        minHeight: "45px", // override the row height
      },
    },
    headCells: {
      style: {
        backgroundColor: "#1e67a8",
        color: "#fff",
        fontSize: "14px",
        paddingLeft: "8px", // override the cell padding for head cells
        paddingRight: "8px",
      },
    },
    cells: {
      style: {
        paddingLeft: "8px", // override the cell padding for data cells
        paddingRight: "8px",
      },
    },
  };

  const activityDataColumns = [
    {
      name: "Action",
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              if (type.budgetType === "allocate") {
                handleView(row.tsBudgetInstitutionExtId, "allocate");
              }
              if (type.budgetType === "release") {
                handleView(row.tsReleaseBudgetInstitutionExtId, "release");
              }
              }}
          >
            View
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="ms-2"
            onClick={() => {
              if (type.budgetType === "allocate") {
                handleEdit(row.tsBudgetInstitutionExtId, "allocate");
              }
              if (type.budgetType === "release") {
                handleEdit(row.tsReleaseBudgetInstitutionExtId, "release");
              }
            }}
          >
            Edit
          </Button>
          {/* <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.tsBudgetDistrictId)}
            className="ms-2"
          >
            Delete
          </Button> */}
        </div>
      ),
      sortable: false,
      hide: "md",
      grow: 2
    },
    {
      name: "Financial Year",
      selector: (row) => row.financialYear,
      cell: (row) => <span>{row.financialYear}</span>,
      sortable: false,
      hide: "md",
    },

    {
      name: "District Name",
      selector: (row) => row.districtName,
      cell: (row) => <span>{row.districtName}</span>,
      sortable: false,
      hide: "md",
    },
    {
      name: "Taluk Name",
      selector: (row) => row.talukName,
      cell: (row) => <span>{row.talukName}</span>,
      sortable: false,
      hide: "md",
    },
    // {
    //   name: "Institution Name",
    //   selector: (row) => row.institutionName,
    //   cell: (row) => <span>{row.institutionName}</span>,
    //   sortable: false,
    //   hide: "md",
    // },
    {
      name: "Budget Amount",
      selector: (row) => row.budgetAmount,
      cell: (row) => <span>{row.budgetAmount}</span>,
      sortable: false,
      hide: "md",
    },
    {
      name: "Head Of Account",
      selector: (row) => row.scHeadAccountName,
      cell: (row) => <span>{row.scHeadAccountName}</span>,
      sortable: false,
      hide: "md",
    },
    {
      name: "Scheme",
      selector: (row) => row.schemeName,
      cell: (row) => <span>{row.schemeName}</span>,
      sortable: false,
      hide: "md",
    },
    {
      name: "Scheme Type",
      selector: (row) => row.schemeQuotaName,
      cell: (row) => <span>{row.schemeQuotaName}</span>,
      sortable: false,
      hide: "md",
    },
    {
      name: "Component Type",
      selector: (row) => row.subSchemeName,
      cell: (row) => <span>{row.subSchemeName}</span>,
      sortable: false,
      hide: "md",
    },
    {
      name: "Component",
      selector: (row) => row.scComponentName,
      cell: (row) => <span>{row.scComponentName}</span>,
      sortable: false,
      hide: "md",
    },
    {
      name: "Sub Component",
      selector: (row) => row.categoryName,
      cell: (row) => <span>{row.categoryName}</span>,
      sortable: false,
      hide: "md",
    },
  ];

  return (
    <Layout title="Institution Budget mapping scheme and programs List">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              Institution Budget mapping scheme and programs List
            </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/budgetinstitutionextension"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/budgetinstitutionextension"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 ">
            <Block>
              <Card>
                <Card.Header>
                  Institution Budget mapping scheme and programs List
                </Card.Header>
                <Card.Body>
                  {/* <h3>Farmers Details</h3> */}
                  <Row className="g-gs">
                    <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          Financial Year<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="financialYearMasterId"
                            value={data.financialYearMasterId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.financialYearMasterId === undefined ||
                              data.financialYearMasterId === "0"
                            }
                          >
                            <option value="">Select Year</option>
                            {financialyearListData.map((list) => (
                              <option
                                key={list.financialYearMasterId}
                                value={list.financialYearMasterId}
                              >
                                {list.financialYear}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Financial Year is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg={6} className="mt-5">
                      <Row>
                        <Col lg="3">
                          <Form.Group
                            as={Row}
                            className="form-group"
                            controlId="with"
                          >
                            <Col sm={1}>
                              <Form.Check
                                type="radio"
                                name="budgetType"
                                value="allocate"
                                checked={type.budgetType === "allocate"}
                                onChange={handleTypeInputs}
                              />
                            </Col>
                            <Form.Label
                              column
                              sm={9}
                              className="mt-n2"
                              id="with"
                            >
                              Allocate
                            </Form.Label>
                          </Form.Group>
                        </Col>
                        <Col lg="3" className="ms-n4">
                          <Form.Group
                            as={Row}
                            className="form-group"
                            controlId="without"
                          >
                            <Col sm={1}>
                              <Form.Check
                                type="radio"
                                name="budgetType"
                                value="release"
                                checked={type.budgetType === "release"}
                                onChange={handleTypeInputs}
                              />
                            </Col>
                            <Form.Label
                              column
                              sm={9}
                              className="mt-n2"
                              id="without"
                            >
                              Release
                            </Form.Label>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>

                    {/* <Col lg="6">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label>
                              Designation
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="designationId"
                                value={designation.designationId}
                                onChange={handleDesignationInputs}
                                onBlur={() => handleDesignationInputs}
                                required
                                isInvalid={
                                  designation.designationId === undefined ||
                                  designation.designationId === "0"
                                }
                              >
                                <option value="">Select Designation</option>
                                {designationListData && designationListData.map((list) => (
                                  <option
                                    key={list.designationId}
                                    value={list.designationId}
                                  >
                                    {list.name}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                               Designation is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col> */}

                    <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          Select District<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="districtId"
                            value={data.districtId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.districtId === undefined ||
                              data.districtId === "0"
                            }
                          >
                            <option value="">Select District</option>
                            {districtListData.map((list) => (
                              <option
                                key={list.districtId}
                                value={list.districtId}
                              >
                                {list.districtName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            District is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    {/* <Col lg="6">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label>
                              District Implementing Officer
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="districtImplementingOfficerId"
                                value={data.districtImplementingOfficerId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                required
                                isInvalid={
                                  data.districtImplementingOfficerId === undefined ||
                                  data.districtImplementingOfficerId === "0"
                                }
                              >
                                <option value="">Select District Implementing Officer</option>
                                {districtImplementingOfficerListData &&districtImplementingOfficerListData.map((list) => (
                                  <option
                                    key={list.userMasterId}
                                    value={list.userMasterId}
                                  >
                                    {list.username}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                              District Implementing Officer is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col> */}

                    <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          Select Taluk<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="talukId"
                            value={data.talukId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.talukId === undefined || data.talukId === "0"
                            }
                          >
                            <option value="">Select Taluk</option>
                            {talukListData.map((list) => (
                              <option key={list.talukId} value={list.talukId}>
                                {list.talukName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Taluk is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    {/* <Col lg="6">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label>
                              Taluk Implementing Officer
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="talukImplementingOfficerId"
                                value={data.talukImplementingOfficerId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                required
                                isInvalid={
                                  data.talukImplementingOfficerId === undefined ||
                                  data.talukImplementingOfficerId === "0"
                                }
                              >
                                <option value="">Select Taluk Implementing Officer</option>
                                {talukImplementingOfficerListData &&talukImplementingOfficerListData.map((list) => (
                                  <option
                                    key={list.userMasterId}
                                    value={list.userMasterId}
                                  >
                                    {list.username}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                              Taluk Implementing Officer is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col> */}


                    <Col lg="6">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="sordfl">
                              Scheme
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="scSchemeDetailsId"
                                value={data.scSchemeDetailsId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                // multiple
                                required
                                isInvalid={
                                  data.scSchemeDetailsId === undefined ||
                                  data.scSchemeDetailsId === "0"
                                }
                              >
                                <option value="">Select Scheme Names</option>
                                {scSchemeDetailsListData.map((list) => (
                                  <option
                                    key={list.scSchemeDetailsId}
                                    value={list.scSchemeDetailsId}
                                  >
                                    {list.schemeName}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                Scheme is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label>
                              Scheme Type
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="scComponentTypeId"
                                value={data.scComponentTypeId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                // multiple
                                required
                                isInvalid={
                                  data.scComponentTypeId === undefined ||
                                  data.scComponentTypeId === "0"
                                }
                              >
                                <option value="">Select Scheme Quota </option>
                                {schemeQuotaDetailsListData.map((list) => (
                                  <option
                                    key={list.schemeQuotaId}
                                    value={list.schemeQuotaId}
                                  >
                                    {list.schemeQuotaName}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                Sub Scheme is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label>
                              Component Type
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="scSubSchemeDetailsId"
                                value={data.scSubSchemeDetailsId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                // multiple
                                required
                                isInvalid={
                                  data.scSubSchemeDetailsId === undefined ||
                                  data.scSubSchemeDetailsId === "0"
                                }
                              >
                                <option value="">Select Component Type</option>
                                {scSubSchemeDetailsListData &&
                                  scSubSchemeDetailsListData.map((list, i) => (
                                    <option key={i} value={list.subSchemeId}>
                                      {list.subSchemeName}
                                    </option>
                                  ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                Component Type is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="sordfl">
                              Component
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="scComponentId"
                                value={data.scComponentId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                // multiple
                                // required
                                isInvalid={
                                  data.scComponentId === undefined ||
                                  data.scComponentId === "0"
                                }
                              >
                                <option value="">Select Component</option>
                                {scComponentListData.map((list) => (
                                  <option
                                    key={list.scComponentId}
                                    value={list.scComponentId}
                                  >
                                    {list.scComponentName}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                Component is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="sordfl">
                              Sub Component
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="scCategoryId"
                                value={data.scCategoryId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                // multiple
                                // required
                                isInvalid={
                                  data.scCategoryId === undefined ||
                                  data.scCategoryId === "0"
                                }
                              >
                                <option value="">Select Sub Component</option>
                                {scCategoryListData.map((list) => (
                                  <option
                                    key={list.scCategoryId}
                                    value={list.scCategoryId}
                                  >
                                    {list.codeNumber}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                Category is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="sordfl">
                              Head of Account
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="scHeadAccountId"
                                value={data.scHeadAccountId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                // multiple
                                required 
                                isInvalid={
                                  data.scHeadAccountId === undefined ||
                                  data.scHeadAccountId === "0"
                                }
                              >
                                <option value="">Select Head of Account</option>
                                {scHeadAccountListData.map((list) => (
                                  <option
                                    key={list.headOfAccountId}
                                    value={list.headOfAccountId}
                                  >
                                    {list.scHeadAccountName}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                Head of Account is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          Institution Type<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="institutionType"
                            value={data.institutionType}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.institutionType === undefined ||
                              data.institutionType === "0"
                            }
                          >
                            <option value="">Select Institution Type</option>
                            <option value="1">TSC</option>
                            <option value="2">Market</option>
                            <option value="3">Farm</option>
                            <option value="4">Grainage</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Institution Type is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    {data.institutionType === "1" ||
                    data.institutionType === "" ? (
                      <Col lg="6">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label>
                            TSC<span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="institutionId"
                              value={data.institutionId}
                              onChange={handleInputs}
                              onBlur={() => handleInputs}
                              required
                              isInvalid={
                                data.institutionId === undefined ||
                                data.institutionId === "0"
                              }
                            >
                              <option value="">Select Tsc</option>
                              {tscListData.map((list) => (
                                <option
                                  key={list.tscMasterId}
                                  value={list.tscMasterId}
                                >
                                  {list.name}
                                </option>
                              ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                              TSC is required
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>
                    ) : (
                      ""
                    )}
                    {data.institutionType === "2" ? (
                      <Col lg="6">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label>
                            Market<span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="institutionId"
                              value={data.institutionId}
                              onChange={handleInputs}
                              onBlur={() => handleInputs}
                              required
                              isInvalid={
                                data.institutionId === undefined ||
                                data.institutionId === "0"
                              }
                            >
                              <option value="">Select Market</option>
                              {marketListData.map((list) => (
                                <option
                                  key={list.marketMasterId}
                                  value={list.marketMasterId}
                                >
                                  {list.marketMasterName}
                                </option>
                              ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                              Market Name is required
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>
                    ) : (
                      ""
                    )}

                    {data.institutionType === "3" ? (
                      <Col lg="6">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label>
                            Farm<span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="institutionId"
                              value={data.institutionId}
                              onChange={handleInputs}
                              onBlur={() => handleInputs}
                              // multiple
                              required
                              isInvalid={
                                data.institutionId === undefined ||
                                data.institutionId === "0"
                              }
                            >
                              <option value="">Select Farm</option>
                              {farmListData.map((list) => (
                                <option
                                  key={list.farmId}
                                  value={list.farmId}
                                >
                                  {list.farmName}
                                </option>
                              ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                              Farm is required
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>
                    ) : (
                      ""
                    )}

                    {data.institutionType === "4" ? (
                      <Col lg="6">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label>
                            Grainage<span className="text-danger">*</span>
                          </Form.Label>
                          <Col>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="institutionId"
                                value={data.institutionId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                required
                              >
                                <option value="">Select Grainage</option>
                                {grainageListData.map((list) => (
                                  <option
                                    key={list.grainageMasterId}
                                    value={list.grainageMasterId}
                                  >
                                    {list.grainageMasterName}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                Grainage is required
                              </Form.Control.Feedback>
                            </div>
                          </Col>
                        </Form.Group>
                      </Col>
                    ) : (
                      ""
                    )}

                    {/* <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                         Institution Implementing Officer
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="institutionImplementingOfficerId"
                            value={data.institutionImplementingOfficerId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.institutionImplementingOfficerId === undefined || data.institutionImplementingOfficerId === "0"
                            }
                          >
                            <option value="">Select Institution Implementing Officer</option>
                            {userListData.map((list) => (
                              <option
                                key={list.userMasterId}
                                value={list.userMasterId}
                              >
                                {list.username}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                          Institution Implementing Officer is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col> */}
                  </Row>
                </Card.Body>
              </Card>
            </Block>

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  <Button type="submit" variant="primary">
                    Go
                  </Button>
                </li>
                {/* <li>
                  <Button type="button" variant="secondary" onClick={clear}>
                    Cancel
                  </Button>
                </li> */}
              </ul>
            </div>
          </Row>
        </Form>

        {show ? (
          <Card className="mt-2">
            <DataTable
              tableClassName="data-table-head-light table-responsive"
              columns={activityDataColumns}
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
        ) : (
          ""
        )}
      </Block>
    </Layout>
  );
}

export default BudgetInstitutionExtensionList;
