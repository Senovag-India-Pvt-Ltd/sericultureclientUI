import { Card, Button, Row, Col, Form, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import DataTable, { defaultThemes } from "react-data-table-component";
import Swal from "sweetalert2";
import { createTheme } from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import React from "react";
import DatePicker from "react-datepicker";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import api from "../../../services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION_FRUITS;
const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ReportRejectList() {
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 500;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };

  // const [data, setData] = useState({
  //   userMasterId: "",
  // });

  // const handleInputs = (e) => {
  //   // debugger;
  //   let { name, value } = e.target;
  //   setData({ ...data, [name]: value });
  // };

  // Search
  //   const search = (e) => {
  //     let joinColumn;
  //     if (data.searchBy === "marketMasterName") {
  //       joinColumn = "marketMaster.marketMasterName";
  //     }
  //     if (data.searchBy === "marketTypeMasterName") {
  //       joinColumn = "marketTypeMaster.marketTypeMasterName";
  //     }
  //     // console.log(joinColumn);
  //     api
  //       .post(baseURL + `marketMaster/search`, {
  //         searchText: data.text,
  //         joinColumn: joinColumn,
  //       })
  //       .then((response) => {
  //         setListData(response.data.content.marketMaster);

  //         // if (response.data.content.error) {
  //         //   // saveError();
  //         // } else {
  //         //   console.log(response);
  //         //   // saveSuccess();
  //         // }
  //       })
  //       .catch((err) => {
  //         // saveError();
  //       });
  //   };
  const [landData, setLandData] = useState({
    landId: "",
    talukId: "",
  });

  const [data, setData] = useState({
    financialYearMasterId: "",
    scHeadAccountId: "",
    scSchemeDetailsId: "",
    scSubSchemeDetailsId: "",
    scCategoryId: "",
    scComponentId: "",
  });

  const [farmer, setFarmer] = useState({
    text: "",
    select: "mobileNumber",
  });

  const [period, setPeriod] = useState({
    periodFrom: new Date(),
    periodTo: new Date(),
  });

  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // console.log(searchData);

  // to get Financial Year
  const [financialyearListData, setFinancialyearListData] = useState([]);

  const getFinancialYearList = () => {
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
    getFinancialYearList();
  }, []);

  const [viewDetailsData, setViewDetailsData] = useState({});
  const viewDetails = (_id) => {
    handleShowModal();
    api
      .get(baseURLDBT + `service/get-join/${_id}`)
      .then((response) => {
        setViewDetailsData(response.data.content);

        setLoading(false);
      })
      .catch((err) => {
        setViewDetailsData({});
        setLoading(false);
      });
  };

  const editDetails = (_id) => {
    navigate(`/seriui/application-form-edit/${_id}`);
  };

  const [validatedDisplay, setValidatedDisplay] = useState(false);

  const display = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidatedDisplay(true);
    } else {
      event.preventDefault();

      // const { text, select } = farmer;
      // let sendData;

      // if (select === "mobileNumber") {
      //   sendData = {
      //     mobileNumber: text,
      //   };
      // }
      // if (select === "fruitsId") {
      //   sendData = {
      //     fruitsId: text,
      //   };
      // }
      // if (select === "farmerNumber") {
      //   sendData = {
      //     farmerNumber: text,
      //   };
      // }

      const { year1, year2, type, searchText } = searchData;

      setLoading(true);

      api
        .post(
          baseURLDBT + `service/getDrawingOfficerList`,
          {},
          { params: searchData }
        )
        .then((response) => {
          setListData(response.data.content);
          const scApplicationFormIds = response.data.content.map(
            (item) => item.scApplicationFormId
          );
          setAllApplicationIds(scApplicationFormIds);
          setLoading(false);
        })
        .catch((err) => {
          setListData({});
          setLoading(false);
        });
    }
  };

  const handleRadioChange = (_id, tId) => {
    if (!tId) {
      tId = 0;
    }
    setLandData((prev) => ({ ...prev, landId: _id, talukId: tId }));
  };

  const [applicationIds, setApplicationIds] = useState([]);
  const [unselectedApplicationIds, setUnselectedApplicationIds] = useState([]);
  const [allApplicationIds, setAllApplicationIds] = useState([]);

  console.log(applicationIds);

  const handleCheckboxChange = (_id) => {
    if (applicationIds.includes(_id)) {
      const dataList = [...applicationIds];
      const newDataList = dataList.filter((data) => data !== _id);
      setApplicationIds(newDataList);
    } else {
      setApplicationIds((prev) => [...prev, _id]);
    }
  };

  const handlePush = (id) => {
    const pushdata = {
      applicationList: [id],
      userMasterId: localStorage.getItem("userMasterId"),
      paymentMode: "R",
    };
    api
      .post(
        baseURLDBT + `applicationTransaction/saveApplicationTransaction`,
        pushdata
      )
      .then((response) => {
        if (response.data.content.errorCode) {
          saveError(response.data.content.error_description);
        } else {
          saveSuccess();
          getList();
        }
      })
      .catch((err) => {
        saveError(err.response.data.validationErrors);
      });
    setValidated(true);
  };

  const handleFromDateChange = (date) => {
    setPeriod((prev) => ({ ...prev, periodFrom: date }));
  };

  const handleToDateChange = (date) => {
    setPeriod((prev) => ({ ...prev, periodTo: date }));
  };

  useEffect(() => {
    handleFromDateChange(new Date());
    handleToDateChange(new Date());
  }, []);

  useEffect(() => {
    setUnselectedApplicationIds(
      allApplicationIds.filter((id) => !applicationIds.includes(id))
    );
  }, [allApplicationIds, applicationIds]);

  //   console.log("Unselected",unselectedApplicationIds);
  const [validated, setValidated] = useState(false);
  const postData = (event) => {
    const post = {
      applicationList: applicationIds,
      paymentMode: "R",
      userMasterId: localStorage.getItem("userMasterId"),
    };
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      api
        .post(
          baseURLDBT + `applicationTransaction/saveApplicationTransaction`,
          post
        )
        .then((response) => {
          if (response.data.content.errorCode) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
            getList();
          }
        })
        .catch((err) => {
          saveError(err.response.data.validationErrors);
        });
      setValidated(true);
    }
  };

  const clear = () => {
    // e.preventDefault();
    // window.location.reload();
    // setAllApplicationIds([]);
    // setUnselectedApplicationIds([]);
    // setAllApplicationIds([]);
    setApplicationIds([]);
  };

  const getList = () => {
    setLoading(true);
    api
      .post(
        baseURLDBT + `service/getDbtStatusByList`,
        {},
        {
          params: {
            userMasterId: localStorage.getItem("userMasterId"),
            displayAllRecords: true,
            status: "ACKNOWLEDGEMENT FAILED",
          },
        }
      )
      .then((response) => {
        setListData(response.data.content);
        const scApplicationFormIds = response.data.content.map(
          (item) => item.scApplicationFormId
        );
        setAllApplicationIds(scApplicationFormIds);
        setLoading(false);
      })
      .catch((err) => {
        setListData({});
        setLoading(false);
      });
  };

  useEffect(() => {
    getList();
  }, [page]);

  // console.log(allApplicationIds);

  const [scSubSchemeDetailsListData, setScSubSchemeDetailsListData] = useState(
    []
  );

  const getSubSchemeList = () => {
    const response = api
      .get(baseURLMasterData + `scSubSchemeDetails/get-all`)
      .then((response) => {
        if (response.data.content.scSubSchemeDetails) {
          setScSubSchemeDetailsListData(
            response.data.content.scSubSchemeDetails
          );
        }
      })
      .catch((err) => {
        setScSubSchemeDetailsListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    getSubSchemeList();
  }, []);

  // to get sc-scheme-details
  const [scSchemeDetailsListData, setScSchemeDetailsListData] = useState([]);

  const getSchemeList = () => {
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
    getSchemeList();
  }, []);

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

  // to get component
  const [scComponentListData, setScComponentListData] = useState([]);

  const getComponentList = () => {
    api
      .get(baseURLMasterData + `scComponent/get-all`)
      .then((response) => {
        setScComponentListData(response.data.content.scComponent);
      })
      .catch((err) => {
        setScComponentListData([]);
      });
  };

  useEffect(() => {
    getComponentList();
  }, []);
  // to get User Master
  // const [userListData, setUserListData] = useState([]);

  // const getUserList = () => {
  //   api
  //     .get(baseURL + `userMaster/get-all`)
  //     .then((response) => {
  //       setUserListData(response.data.content.userMaster);
  //     })
  //     .catch((err) => {
  //       setUserListData([]);
  //     });
  // };

  // useEffect(() => {
  //   getUserList();
  // }, []);

  const navigate = useNavigate();
  const handleView = (_id) => {
    navigate(`/seriui/market-view/${_id}`);
  };

  const handleEdit = (_id) => {
    navigate(`/seriui/market-edit/${_id}`);
    // navigate("/seriui/district");
  };

  const deleteError = () => {
    Swal.fire({
      icon: "error",
      title: "Delete attempt was not successful",
      text: "Something went wrong!",
    });
  };

  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const deleteConfirm = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "It will delete permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        const response = api
          .delete(baseURL + `marketMaster/delete/${_id}`)
          .then((response) => {
            // deleteConfirm(_id);
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
        // Swal.fire("Deleted", "You successfully deleted this record", "success");
      } else {
        console.log(result.value);
        Swal.fire("Cancelled", "Your record is not deleted", "info");
      }
    });
  };

  const [searchData, setSearchData] = useState({
    year1: "",
    year2: "",
    type: 1,
    searchText: "",
  });

  console.log(searchData);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
    if (e.target.name === "financialYearMasterId") {
      const selectedYearObject = financialyearListData.find(
        (year) => year.financialYearMasterId === parseInt(e.target.value)
      );
      const year = selectedYearObject.financialYear;
      const [fromDate, toDate] = year.split("-");
      setSearchData((prev) => ({ ...prev, year1: fromDate, year2: toDate }));
    }
  };

  const handleSearchInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (e.target.name === "type") {
      setSearchData({ ...searchData, [name]: value, searchText: "" });
    } else {
      setSearchData({ ...searchData, [name]: value });
    }
  };

  // Get Default Financial Year

  const getFinancialDefaultDetails = () => {
    api
      .get(baseURLMasterData + `financialYearMaster/get-is-default`)
      .then((response) => {
        const year = response.data.content.financialYear;
        const [fromDate, toDate] = year.split("-");
        setData((prev) => ({
          ...prev,
          financialYearMasterId: response.data.content.financialYearMasterId,
        }));
        setSearchData((prev) => ({ ...prev, year1: fromDate, year2: toDate }));
      })
      .catch((err) => {
        setData((prev) => ({
          ...prev,
          financialYearMasterId: "",
        }));
        setSearchData((prev) => ({ ...prev, year1: "", year2: "" }));
      });
  };

  useEffect(() => {
    getFinancialDefaultDetails();
  }, []);

  const saveSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      text: message,
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
      title: "Save attempt was not successful",
      html: errorMessage,
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

  //   const customStyles = {
  //     rows: {
  //       style: {
  //         minHeight: "45px", // override the row height
  //       },
  //     },
  //     headCells: {
  //       style: {
  //         backgroundColor: "#1e67a8",
  //         color: "#fff",
  //         fontSize: "14px",
  //         paddingLeft: "8px", // override the cell padding for head cells
  //         paddingRight: "8px",
  //       },
  //     },
  //     cells: {
  //       style: {
  //         paddingLeft: "8px", // override the cell padding for data cells
  //         paddingRight: "8px",
  //       },
  //     },
  //   };

  const customStyles = {
    header: {
      style: {
        minHeight: "56px",
      },
    },
    headRow: {
      style: {
        borderTopStyle: "solid",
        borderTopWidth: "1px",
        // borderTop:"none",
        // borderTopColor: defaultThemes.default.divider.default,
        borderColor: "black",
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
        // borderRightWidth: "3px",
        borderWidth: "1px",
        padding: "10px",
        // borderColor: defaultThemes.default.divider.default,
        borderColor: "black",
        // },
      },
    },
  };

  const ApplicationDataColumns = [
    // {
    //   name: "Action",
    //   cell: (row) => (
    //     //   Button style
    //     <div className="text-start w-100">
    //       {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
    //       <Button
    //         variant="primary"
    //         size="sm"
    //         onClick={() => handleView(row.marketMasterId)}
    //       >
    //         View
    //       </Button>
    //       <Button
    //         variant="primary"
    //         size="sm"
    //         className="ms-2"
    //         onClick={() => handleEdit(row.marketMasterId)}
    //       >
    //         Edit
    //       </Button>
    //       <Button
    //         variant="danger"
    //         size="sm"
    //         onClick={() => deleteConfirm(row.marketMasterId)}
    //         className="ms-2"
    //       >
    //         Delete
    //       </Button>
    //     </div>
    //   ),
    //   sortable: false,
    //   hide: "md",
    // //   grow: 2,
    // },
    {
      name: "Select",
      selector: "select",
      cell: (row) => (
        <input
          type="checkbox"
          name="selectedLand"
          value={row.scApplicationFormId}
          checked={applicationIds.includes(row.scApplicationFormId)}
          onChange={() => handleCheckboxChange(row.scApplicationFormId)}
        />
      ),
      // ignoreRowClick: true,
      // allowOverflow: true,
      button: true,
    },
    // {
    //   name: "Application Id",
    //   selector: (row) => row.scApplicationFormId,
    //   cell: (row) => <span>{row.scApplicationFormId}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    {
      name: "Farmer Name",
      selector: (row) => row.farmerFirstName,
      cell: (row) => <span>{row.farmerFirstName}</span>,
      sortable: true,
      hide: "md",
    },
    // {
    //   name: "Market Name in Kannada",
    //   selector: (row) => row.marketNameInKannada,
    //   cell: (row) => <span>{row.marketNameInKannada}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    // {
    //   name: "Market Address",
    //   selector: (row) => row.marketMasterAddress,
    //   cell: (row) => <span>{row.marketMasterAddress}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    {
      name: "Fruits Id",
      selector: (row) => row.fruitsId,
      cell: (row) => <span>{row.fruitsId}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Application Status",
      selector: (row) => row.applicationStatus,
      cell: (row) => <span>{row.applicationStatus}</span>,
      sortable: true,
      hide: "md",
    },
    // {
    //   name: "State",
    //   selector: (row) => row.stateName,
    //   cell: (row) => <span>{row.stateName}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    {
      name: "Taluk",
      selector: (row) => row.talukName,
      cell: (row) => <span>{row.talukName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Hobli",
      selector: (row) => row.hobliName,
      cell: (row) => <span>{row.hobliName}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Village",
      selector: (row) => row.villageName,
      cell: (row) => <span>{row.villageName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handlePush(row.scApplicationFormId)}
          >
            Re-Push
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => viewDetails(row.scApplicationFormId)}
            className="ms-1"
          >
            view
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => editDetails(row.scApplicationFormId)}
            className="ms-1"
          >
            Edit
          </Button>
        </>
      ),
      sortable: true,
      hide: "md",
      grow: 1,
    },
  ];

  return (
    <Layout title="Report Rejected List">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Report Rejected List</Block.Title>
          </Block.HeadContent>
          {/* <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/service-application"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>New Application</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/service-application"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="plus" />
                  <span>New Application</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent> */}
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Form noValidate validated={validatedDisplay} onSubmit={display}>
          {/* <Card>
            <Card.Body>
              <Row className="g-gs">
                <Col lg={12}>
                  <Row className="g-gs">
                    <Col lg="4">
                      <Form.Group className="form-group mt-n2">
                        <Form.Label>
                          Financial Year
                          <span className="text-danger">*</span>
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
                    <Col lg="4">
                      <Form.Group className="form-group mt-n2">
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
                            required
                            isInvalid={
                              data.scSubSchemeDetailsId === undefined ||
                              data.scSubSchemeDetailsId === "0"
                            }
                          >
                            <option value="">Select Component Type</option>
                            {scSubSchemeDetailsListData.map((list) => (
                              <option
                                key={list.scSubSchemeDetailsId}
                                value={list.scSubSchemeDetailsId}
                              >
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

                    <Col lg="4">
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

                    <Col lg="4">
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
                                key={list.scHeadAccountId}
                                value={list.scHeadAccountId}
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

                    <Col lg="4">
                      <Form.Group className="form-group mt-n3">
                        <Form.Label htmlFor="sordfl">
                          Category
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="scCategoryId"
                            value={data.scCategoryId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                           
                            isInvalid={
                              data.scCategoryId === undefined ||
                              data.scCategoryId === "0"
                            }
                          >
                            <option value="">Select Category</option>
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

                    <Col lg="4">
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

                    <Col lg="4">
                      <Form.Group className="form-group mt-n3">
                        <Form.Label htmlFor="schemeAmount">
                          Scheme Amount
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="schemeAmount"
                            type="text"
                            name="schemeAmount"
                            value={data.schemeAmount}
                            onChange={handleInputs}
                            placeholder="Enter Scheme Amount"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Scheme Amount is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n3">
                        <Form.Label htmlFor="sanctionNumber">
                          Sanction Number
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="sanctionNumber"
                            type="text"
                            name="sanctionNumber"
                            value={data.sanctionNumber}
                            onChange={handleInputs}
                            placeholder="Enter Sanction Number"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Sanction Number is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                 
                </Col>
              </Row>
            </Card.Body>
          </Card> */}
        </Form>
        <Card className="mt-1">
          {/* <Row className="m-2">
            <Col>
              <Form.Group as={Row} className="form-group" id="fid">
                <Form.Label column sm={1}>
                  Search By
                </Form.Label>
                <Col sm={3}>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="searchBy"
                      value={data.searchBy}
                      onChange={handleInputs}
                    >
                     
                      <option value="marketMasterName">Market</option>
                      <option value="marketTypeMasterName">Market Type</option>
                    </Form.Select>
                  </div>
                </Col>

                <Col sm={3}>
                  <Form.Control
                    id="marketMasterId"
                    name="text"
                    value={data.text}
                    onChange={handleInputs}
                    type="text"
                    placeholder="Search"
                  />
                </Col>
                <Col sm={3}>
                  <Button type="button" variant="primary" onClick={search}>
                    Search
                  </Button>
                </Col>
              </Form.Group>
            </Col>
          </Row> */}
          <DataTable
            //  title="Market List"
            tableClassName="data-table-head-light table-responsive"
            columns={ApplicationDataColumns}
            data={listData}
            highlightOnHover
            // pagination
            // paginationServer
            // paginationTotalRows={totalRows}
            // paginationPerPage={countPerPage}
            // paginationComponentOptions={{
            //   noRowsPerPage: true,
            // }}
            // onChangePage={(page) => setPage(page - 1)}
            progressPending={loading}
            theme="solarized"
            customStyles={customStyles}
          />
        </Card>

        <Form
          noValidate
          validated={validated}
          onSubmit={postData}
          className="mt-1"
        >
          <div className="gap-col mt-1">
            <ul className="d-flex align-items-center justify-content-center gap g-3">
              <li>
                <Button type="submit" variant="primary" onClick={postData}>
                  Re-Push All
                </Button>
              </li>
              .
              <li>
                <Button type="button" variant="secondary" onClick={clear}>
                  Cancel
                </Button>
              </li>
            </ul>
          </div>
          {/* <Row className="d-flex justify-content-center mt-2">
            <Col sm={2}>
              <Button type="submit" variant="primary">
                Save
              </Button>
            </Col>
          </Row> */}
        </Form>
      </Block>

      <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>View</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <h1 className="d-flex justify-content-center align-items-center">
              Loading...
            </h1>
          ) : (
            <Row className="g-gs">
              <Col lg="12">
                <table className="table small table-bordered">
                  <tbody>
                    <tr>
                      <td style={styles.ctstyle}>Scheme Name:</td>
                      <td>{viewDetailsData.schemeName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Sub Scheme Name:</td>
                      <td>{viewDetailsData.subSchemeName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Head of Account:</td>
                      <td>{viewDetailsData.scHeadAccountName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Application Status:</td>
                      <td>{viewDetailsData.applicationStatus}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Initial Amount:</td>
                      <td>{viewDetailsData.initialAmount}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> ARN Number:</td>
                      <td>{viewDetailsData.arn}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Financial Year:</td>
                      <td>{viewDetailsData.financialYear}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Category Name:</td>
                      <td>{viewDetailsData.categoryName}</td>
                    </tr>
                    {/* <tr>
                      <td style={styles.ctstyle}> State Name in Kannada:</td>
                      <td>{viewDetailsData.stateNameInKannada}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Initial Amount:</td>
                      <td>{viewDetailsData.stateNameInKannada}</td>
                    </tr> */}
                  </tbody>
                </table>
              </Col>
            </Row>
          )}
        </Modal.Body>
      </Modal>

      {/* <Block className="">
        <Row className="g-3 ">
          <Form noValidate validated={validated} onSubmit={postData}>
            <Card>
              <Card.Body>
                <Row className="g-gs ">
                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label>
                        User<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="userMasterId"
                          value={data.userMasterId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.userMasterId === undefined ||
                            data.userMasterId === "0"
                          }
                        >
                          <option value="">Select User</option>
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
                          User name is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <div className="gap-col mt-1">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  <Button type="submit" variant="primary">
                    Save
                  </Button>
                </li>
                <li>
                  <Button type="button" variant="secondary" onClick={clear}>
                    Cancel
                  </Button>
                </li>
              </ul>
            </div>
          </Form>
        </Row>
      </Block> */}
    </Layout>
  );
}

export default ReportRejectList;
