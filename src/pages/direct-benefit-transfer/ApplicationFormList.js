import { Card, Button, Row, Col, Form,Modal} from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon } from "../../components";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { createTheme } from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import api from "../../services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ApplicationFormList() {
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 500;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };

  // const [data, setData] = useState({
  //   userMasterId: localStorage.getItem("userMasterId"),
  //   text: "",
  //   type: 0,
  // });

  const [searchData, setSearchData] = useState({
    userMasterId: localStorage.getItem("userMasterId"),
    text: "",
    type: 4,
  });

  // const handleInputs = (e) => {
  //   // debugger;
  //   let { name, value } = e.target;
  //   setData({ ...data, [name]: value });
  // };

  // const handleInputsSearch = (e) => {
  //   let name = e.target.name;
  //   let value = e.target.value;
  //   if(value == 4){
  //     setSearchData({ ...searchData,[name]: value, text: data.financialYearMasterId });
  //   }else{
  //     setSearchData({ ...searchData, [name]: value });
  //   }
  // };
  const handleInputsSearch = (e) => {
    const { name, value } = e.target;
    
    // If type is 4, set the financial year ID in searchData
    if (value == 4) {
      setSearchData((prev) => ({
        ...prev,
        [name]: value,
        text: data.financialYearMasterId, // Use the fetched financialYearMasterId
      }));
    } else {
      setSearchData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };
  // Search
  const search = (e) => {
    api
      .post(baseURLDBT + `service/getSubmittedRecordsForMaker`, {}, { params: searchData })
      .then((response) => {
        setListData(response.data.content);
      })
      .catch((err) => {
        setListData([]);
      });
  };
 

  //   const handleRadioChange = (_id, tId) => {
  //     if (!tId) {
  //       tId = 0;
  //     }
  //     setLandData((prev) => ({ ...prev, landId: _id, talukId: tId }));
  //   };

  //   const [applicationIds, setApplicationIds] = useState([]);
  //   const [unselectedApplicationIds, setUnselectedApplicationIds] = useState([]);
  //   const [allApplicationIds, setAllApplicationIds] = useState([]);

  //   const handleCheckboxChange = (_id) => {
  //     if (applicationIds.includes(_id)) {
  //       const dataList = [...applicationIds];
  //       const newDataList = dataList.filter((data) => data !== _id);
  //       setApplicationIds(newDataList);
  //     } else {
  //       setApplicationIds((prev) => [...prev, _id]);
  //     }
  //   };

  //   useEffect(() => {
  //     setUnselectedApplicationIds(
  //       allApplicationIds.filter((id) => !applicationIds.includes(id))
  //     );
  //   }, [allApplicationIds, applicationIds]);

  //   //   console.log("Unselected",unselectedApplicationIds);
  //   const [validated, setValidated] = useState(false);
  //   const postData = (event) => {
  //     const post = {
  //       applicationFormIds: applicationIds,
  //       applicationFormIdsNotSelected: unselectedApplicationIds,
  //       inspectorId: localStorage.getItem("userMasterId"),
  //     };
  //     const form = event.currentTarget;
  //     if (form.checkValidity() === false) {
  //       event.preventDefault();
  //       event.stopPropagation();
  //       setValidated(true);
  //     } else {
  //       event.preventDefault();
  //       api
  //         .post(baseURLDBT + `service/updateApplicationStatus`, post)
  //         .then((response) => {
  //           if (response.data.content.errorCode) {
  //             saveError(response.data.content.error_description);
  //           } else {
  //             saveSuccess();
  //             getList();
  //           }
  //         })
  //         .catch((err) => {
  //           saveError(err.response.data.validationErrors);
  //         });
  //       setValidated(true);
  //     }
  //   };

  //   const clear = (e) => {
  //     e.preventDefault();
  //     window.location.reload();
  //     // setAllApplicationIds([]);
  //     // setUnselectedApplicationIds([]);
  //     // setAllApplicationIds([]);
  //   };

    // Fetch default financial year details
const getFinancialDefaultDetails = () => {
  api
    .get(baseURLMasterData + `financialYearMaster/get-is-default`)
    .then((response) => {
      const year = response.data.content.financialYear;
      const [fromDate, toDate] = year.split("-");
      setData({
        financialYearMasterId: response.data.content.financialYearMasterId,
        year1: fromDate,
        year2: toDate
      });
      setSearchData((prev) => ({
        ...prev,
        text: response.data.content.financialYearMasterId // Pre-fill text with financial year
      }));
    })
    .catch((err) => {
      setData({
        financialYearMasterId: "",
        year1: "",
        year2: ""
      });
    });
};

  const getList = () => {
    setLoading(true);
    api
      .post(
        baseURLDBT + `service/getSubmittedRecordsForMaker`,
        {},
        { params: {userMasterId: localStorage.getItem("userMasterId"), },}
      )
      .then((response) => {
        setListData(response.data.content);
        // setTotalRows(response.data.content.totalItems);
        setLoading(false);
      })
      .catch((err) => {
        setListData({});
        setLoading(false);
      });
  };

  useEffect(() => {
    getFinancialDefaultDetails();
    getList();
  }, [page]);

  //   console.log(allApplicationIds);

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

  const [data, setData] = useState({
    financialYearMasterId: "",
    year1: "",
    year2: ""
  });

  // const getFinancialDefaultDetails = () => {
  //   api
  //     .get(baseURLMasterData + `financialYearMaster/get-is-default`)
  //     .then((response) => {
  //       const year = response.data.content.financialYear;
  //       const [fromDate, toDate] = year.split("-");
  //       setData((prev) => ({
  //         ...prev,
  //         financialYearMasterId: response.data.content.financialYearMasterId,
  //       }));
  //       setSearchData((prev) => ({ ...prev, year1: fromDate, year2: toDate }));
  //     })
  //     .catch((err) => {
  //       setData((prev) => ({
  //         ...prev,
  //         financialYearMasterId: "",
  //       }));
  //       setSearchData((prev) => ({ ...prev, year1: "", year2: "" }));
  //     });
  // };

  // useEffect(() => {
  //   getFinancialDefaultDetails();
  // }, []);


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


  const navigate = useNavigate();

  const handleEdit = (_id) => {
    navigate(`/seriui/application-form-edit/${_id}`);
    // navigate("/seriui/district");
  };

  const deleteError = () => {
    Swal.fire({
      icon: "error",
      title: "Delete attempt was not successful",
      text: "Something went wrong!",
    });
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

  // const customStyles = {
  //   rows: {
  //     style: {
  //       minHeight: "10px", // adjust this value to your desired row height
  //     },
  //   },
  //   // header: {
  //   //   style: {
  //   //     minHeight: "56px",
  //   //   },
  //   // },
  //   // headRow: {
  //   //   style: {
  //   //     borderTopStyle: "solid",
  //   //     borderTopWidth: "1px",
  //   //     // borderTop:"none",
  //   //     // borderTopColor: defaultThemes.default.divider.default,
  //   //     borderColor: "black",
  //   //   },
  //   // },
  //   headCells: {
  //     style: {
  //       // '&:not(:last-of-type)': {
  //       backgroundColor: "#1e67a8",
  //       color: "#fff",
  //       borderStyle: "solid",
  //       bordertWidth: "1px",
  //       // borderColor: defaultThemes.default.divider.default,
  //       borderColor: "black",
  //       // },
  //     },
  //   },
  //   cells: {
  //     style: {
  //       // '&:not(:last-of-type)': {
  //       borderStyle: "solid",
  //       borderWidth: "1px",
  //       paddingTop: "3px",
  //       paddingBottom: "3px",
  //       paddingLeft: "8px",
  //       paddingRight: "8px",
  //       // borderColor: defaultThemes.default.divider.default,
  //       borderColor: "black",
  //       // },
  //     },
  //   },
  // };

  const customStyles = {
    rows: {
      style: {
        minHeight: "30px", // Row height
      },
    },
    headCells: {
      style: {
        backgroundColor: "#1e67a8", // Header background color
        color: "#fff", // Header text color
        borderStyle: "solid", 
        borderWidth: "1px", 
        borderColor: "black", // Header cell border color
        paddingLeft: "8px",
        paddingRight: "8px",
      },
    },
    cells: {
      style: {
        borderStyle: "solid", 
        borderWidth: "1px", 
        borderColor: "black", // Data cell border color
        paddingTop: "3px",
        paddingBottom: "3px",
        paddingLeft: "8px",
        paddingRight: "8px",
      },
    },
  };

  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);


  const [viewDetailsData, setViewDetailsData] = useState({
    applicationDetails: [],
    landDetails: []
  });

  const handleView = (_id) => {
    api
      .post(baseURLDBT + `service/viewApplicationDetails`, {
        applicationFormId: _id,
      })
      .then((response) => {
        const content = response.data.content[0];
        
        if (content.applicationDetailsResponses.length <= 0) {
          saveError("No Details Found!!!");
        } else {
          handleShowModal();
          setViewDetailsData({
            applicationDetails: content.applicationDetailsResponses,
            landDetails: content.landDetailsResponses
          });
        }
      })
      .catch((err) => {
        // saveError(err.response.data.validationErrors);
      });
  };


  const ApplicationDataColumns = [
    // {
    //   name: "Select",
    //   selector: "select",
    //   cell: (row) => (
    //     <input
    //       type="checkbox"
    //       name="selectedLand"
    //       value={row.scApplicationFormId}
    //       checked={applicationIds.includes(row.scApplicationFormId)}
    //       onChange={() => handleCheckboxChange(row.scApplicationFormId)}
    //     />
    //   ),
    //   // ignoreRowClick: true,
    //   // allowOverflow: true,
    //   button: true,
    // },
    {
      name: "Sl.No.",
      selector: (row) => row.scApplicationFormId,
      cell: (row,i) => <span>{i+1}</span>,
      sortable: true,
      width: "80px",
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
      name: "Beneficiary ID",
      selector: (row) => row.beneficiaryId,
      cell: (row) => <span>{row.beneficiaryId}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Farmer Name",
      selector: (row) => row.farmerFirstName,
      cell: (row) => <span>{row.farmerFirstName}</span>,
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
      name: "Village",
      selector: (row) => row.villageName,
      cell: (row) => <span>{row.villageName}</span>,
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
      selector: (row) => row.scComponentName,
      cell: (row) => <span>{row.scComponentName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Sanction No.",
      selector: (row) => row.sanctionNumber,
      cell: (row) => <span>{row.sanctionNumber}</span>,
      sortable: true,
      hide: "md",
    },
  
    {
      name: "Subsidy Amount",
      selector: (row) => row.actualAmount,
      cell: (row) => <span>{row.actualAmount}</span>,
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
    {
      name: "Remarks",
      selector: (row) => row.remarks,
      cell: (row) => <span>{row.remarks}</span>,
      sortable: true,
      hide: "md",
    },
   
    {
      name: "Action",
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
          {/* {!(
            row.applicationStatus === "ACKNOWLEDGEMENT SUCCESS" ||
            row.applicationStatus === "DBT PUSHED"
          ) && (
            <Button
              variant="primary"
              size="sm"
              className="ms-2"
              onClick={() => handleEdit(row.id)}
            >
              Edit
            </Button>
          )} */}
          {row.applicationStatus === "ACKNOWLEDGEMENT SUCCESS" ||
          row.applicationStatus === "DBT PUSHED" ? null : (
            <Button
              variant="primary"
              size="sm"
              className="ms-2"
              onClick={() => handleEdit(row.scApplicationFormId)}
            >
              Edit
            </Button>
          )}
            <Button
              variant="primary"
              size="sm"
              className="ms-2"
              onClick={() => handleView(row.scApplicationFormId)}
            >
              View
            </Button>
        </div>
      ),
      sortable: false,
      hide: "md",
      grow: 2,
    },
  ];

  return (
    <Layout title="Application Form List">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Application List</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/dbt-application"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>New Application</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/dbt-application"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="plus" />
                  <span>New Application</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card>
          <Row className="m-2">
            <Col>
              <Form.Group as={Row} className="form-group" id="fid">
                <Form.Label column sm={1}>
                  Search By
                </Form.Label>
                <Col sm={3}>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="type"
                      value={searchData.type}
                      onChange={handleInputsSearch}
                    >
                      {/* <option value="0">All</option> */}
                      <option value="1">Sanction No.</option>
                      <option value="2">FruitsId</option>
                      <option value="3">Beneficiary Id</option>
                      <option value="4">Financial Year</option>
                      <option value="5">Component</option>
                      <option value="6">Component Type</option>
                    </Form.Select>
                  </div>
                </Col>

                {(Number(searchData.type) === 4 )? (
                  <Col sm={2} lg={2}>
                  <Form.Group className="form-group">
                           
                            <div className="form-control-wrap">
                              <Form.Select
                                name="text"
                                value={searchData.text}
                                onChange={handleInputsSearch}
                                onBlur={() => handleInputsSearch}
                                // multiple
                                required
                                isInvalid={
                                  //  searchData.text === undefined ||
                                  searchData.text === "0"
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
                            
                            </div>
                          </Form.Group>
                        </Col>
            ) : Number(searchData.type) === 5 ? (
              <Col sm={2} lg={2}>
                <Form.Group className="form-group">
                        <div className="form-control-wrap">
                          <Form.Select
                            name="text"
                            value={searchData.text}
                            onChange={handleInputsSearch}
                            onBlur={() => handleInputsSearch}
                            // multiple
                            required
                            isInvalid={
                            //  searchData.text === undefined ||
                              searchData.text === "0"
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
                          
                        </div>
                      </Form.Group>
                    </Col>
            ) : Number(searchData.type) === 6 ? (
              <Col sm={2} lg={2}>
              <Form.Group className="form-group">     
                <div className="form-control-wrap">
                  <Form.Select
                   name="text"
                       value={searchData.text}
                       onChange={handleInputsSearch}
                       onBlur={() => handleInputsSearch}
                       // multiple
                       required
                       isInvalid={
                        //  searchData.text === undefined ||
                         searchData.text === "0"
                       }
                  >
                    <option value="">Select Component Type</option>
                    {scSubSchemeDetailsListData &&
                      scSubSchemeDetailsListData.map((list, i) => (
                        <option 
                        key={list.scSubSchemeDetailsId}
                          value={list.scSubSchemeDetailsId}>
                          {list.subSchemeName}
                        </option>
                      ))}
                  </Form.Select>
                  
                </div>
                    </Form.Group>
                  </Col>
                ) : (

                <Col sm={2} lg={2}>
                  <Form.Control
                    id="fruitsId"
                    name="text"
                    value={searchData.text}
                    onChange={handleInputsSearch}
                    type="text"
                    placeholder="Search"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Field Value is Required
                  </Form.Control.Feedback>
                </Col>
              )}

                <Col sm={3}>
                  <Button type="button" variant="primary" onClick={search}>
                    Search
                  </Button>
                </Col>

              </Form.Group>
            </Col>
          </Row>
          </Card>
          </Block>

          
      <Block className='mt-3'>
      <Card>
          <DataTable
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
      </Block>


      <Modal show={showModal} onHide={handleCloseModal} size="xl">
  <Modal.Header closeButton>
    <Modal.Title>View Details</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {loading ? (
      <h1 className="d-flex justify-content-center align-items-center">
        Loading...
      </h1>
    ) : (
      <Row className="g-gs">
        <Block className="mt-3">
          {/* Scheme Details Card */}
          <Card>
            <Card.Header style={{ fontWeight: "bold" }}>
              Scheme Details
            </Card.Header>
            <Card.Body>
              <Col lg="12">
                <table className="table small table-bordered">
                  <tbody>
                    {viewDetailsData.applicationDetails.map((detail, index) => (
                      <React.Fragment key={index}>
                        <tr>
                          <td style={styles.ctstyle}>Fruits Id:</td>
                          <td>{detail.fruitsId}</td>
                        </tr>
                        <tr>
                          <td style={styles.ctstyle}>Beneficiary Id:</td>
                          <td>{detail.beneficiaryId}</td>
                        </tr>
                        <tr>
                          <td style={styles.ctstyle}>Farmer Name:</td>
                          <td>{detail.farmerFirstName}</td>
                        </tr>
                        <tr>
                          <td style={styles.ctstyle}>District Name:</td>
                          <td>{detail.districtName}</td>
                        </tr>
                        <tr>
                          <td style={styles.ctstyle}>Taluk Name:</td>
                          <td>{detail.talukName}</td>
                        </tr>
                        <tr>
                          <td style={styles.ctstyle}>Village Name:</td>
                          <td>{detail.villageName}</td>
                        </tr>
                        <tr>
                          <td style={styles.ctstyle}>Sanction No:</td>
                          <td>{detail.sanctionNo}</td>
                        </tr>
                        <tr>
                          <td style={styles.ctstyle}>Scheme Name:</td>
                          <td>{detail.schemeName}</td>
                        </tr>
                        <tr>
                          <td style={styles.ctstyle}>Sub Scheme Name:</td>
                          <td>{detail.subSchemeName}</td>
                        </tr>
                        <tr>
                          <td style={styles.ctstyle}>Component:</td>
                          <td>{detail.scComponentName}</td>
                        </tr>
                        <tr>
                          <td style={styles.ctstyle}>Sub Component:</td>
                          <td>{detail.categoryName}</td>
                        </tr>
                        <tr>
                          <td style={styles.ctstyle}>Scheme Amount:</td>
                          <td>{detail.schemeAmount}</td>
                        </tr>
                        <tr>
                          <td style={styles.ctstyle}>Period From:</td>
                          <td>{detail.periodFrom}</td>
                        </tr>
                        <tr>
                          <td style={styles.ctstyle}>Period To:</td>
                          <td>{detail.periodTo}</td>
                        </tr>
                       
                        <tr>
                          <td style={styles.ctstyle}>Application Status:</td>
                          <td>{detail.applicationStatus}</td>
                        </tr>
                        <tr>
                          <td style={styles.ctstyle}>Remarks:</td>
                          <td>{detail.remarks}</td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </Col>
            </Card.Body>
          </Card>

          {/* RTC Details Card */}
          <Card className="mt-3">
            <Card.Header style={{ fontWeight: "bold" }}>
              RTC Details
            </Card.Header>
            <Card.Body>
              <Col lg="12">
                <table className="table small table-bordered">
                  <tbody>
                    {viewDetailsData.landDetails.map((landDetail, index) => (
                      <React.Fragment key={index}>
                        <tr>
                          <td style={styles.ctstyle}>Survey Number:</td>
                          <td>{landDetail.surveyNumber}</td>
                        </tr>
                        <tr>
                          <td style={styles.ctstyle}>District Name:</td>
                          <td>{landDetail.districtName}</td>
                        </tr>
                        <tr>
                          <td style={styles.ctstyle}>Taluk Name:</td>
                          <td>{landDetail.talukName}</td>
                        </tr>
                        <tr>
                          <td style={styles.ctstyle}>Village Name:</td>
                          <td>{landDetail.villageName}</td>
                        </tr>
                        <tr>
                          <td style={styles.ctstyle}>Acre:</td>
                          <td>{landDetail.devAcre}</td>
                        </tr>
                        <tr>
                          <td style={styles.ctstyle}>F Gunta:</td>
                          <td>{landDetail.devFGunta}</td>
                        </tr>
                        <tr>
                          <td style={styles.ctstyle}>Gunta:</td>
                          <td>{landDetail.devGunta}</td>
                        </tr>
                        <tr>
                          <td style={styles.ctstyle}>Developed Area Acre:</td>
                          <td>{landDetail.acre}</td>
                        </tr>
                        <tr>
                          <td style={styles.ctstyle}>Developed Area F Gunta:</td>
                          <td>{landDetail.fGunta}</td>
                        </tr>
                        <tr>
                          <td style={styles.ctstyle}>Developed Area Gunta:</td>
                          <td>{landDetail.gunta}</td>
                        </tr>
                        <tr> 
                          <td style={styles.ctstyle}>Hissa:</td>
                          <td>{landDetail.hissa}</td>
                        </tr>
                        <tr> 
                          <td style={styles.ctstyle}>Land Code:</td>
                          <td>{landDetail.landCode}</td>
                        </tr>
                        <tr> 
                          <td style={styles.ctstyle}>Main Owner No:</td>
                          <td>{landDetail.mainOwnerNo}</td>
                        </tr>
                        <tr> 
                          <td style={styles.ctstyle}>Owner Name:</td>
                          <td>{landDetail.ownerName}</td>
                        </tr>
                        <tr> 
                          <td style={styles.ctstyle}>Sur Noc:</td>
                          <td>{landDetail.surNoc}</td>
                        </tr>
                        {/* Add more fields as needed */}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </Col>
            </Card.Body>
          </Card>
        </Block>
      </Row>
    )}
  </Modal.Body>
</Modal>
    </Layout>
  );
}

export default ApplicationFormList;
