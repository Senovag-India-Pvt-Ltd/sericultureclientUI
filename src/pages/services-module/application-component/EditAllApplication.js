import { Card, Button, Row, Col, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { createTheme } from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import api from "../../../../src/services/auth/api";

const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;

const EditAllApplication = ({ details }) => {
  const [helpDeskFaq, setHelpDeskFaq] = useState({
    text: "",
    searchBy: "hdQuestionName",
  });

  const [applicationDetails, setApplicationDetails] = useState(
    details.applicationDetailsResponses
  );
  const [documentsDetails, setDocumentsDetails] = useState(
    details.documentsResponses
  );
  const [landDetails, setLandDetails] = useState(details.landDetailsResponses);
  const [workFlowDetails, setWorkFlowDetails] = useState(
    details.workFlowDetailsResponses
  );

  // debugger

  useEffect(() => {
    // debugger
    setApplicationDetails(details[0].applicationDetailsResponses);
    setDocumentsDetails(details[0].documentsResponses);
    setLandDetails(details[0].landDetailsResponses);
    setWorkFlowDetails(details[0].workFlowDetailsResponses);
  }, [details]);

  const [data, setData] = useState({
    userMasterId: "",
  });

  const [
    selectedDocumentOriginalFileName,
    setSelectedDocumentOriginalFileName,
  ] = useState([]);
  const [selectedDocumentFileName, setSelectedDocumentFileName] = useState([]);

  const click = async (file) => {
    // console.log("you clicked", file);
    const parameters = `fileName=${file}`;
    try {
      const response = await api.post(
        baseURLDBT + `service/downLoadFile?${parameters}`,
        {},
        {
          responseType: "arraybuffer",
        }
      );
      const blob = new Blob([response.data]);
      const url = URL.createObjectURL(blob);

      const fileExtension = file.split(".").pop();

      const link = document.createElement("a");
      link.href = url;

      const modifiedFileName = file.replace(/_([^_]*)$/, ".$1");

      link.download = modifiedFileName;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  };

  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
    headerStyle: {
      backgroundColor: "#0f6cbe",
      color: "white",
      borderTopLeftRadius: "8px",
      borderTopRightRadius: "8px",
    },
  };

  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 500;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };

  const handleHelpDeskFaqInputs = (e) => {
    let { name, value } = e.target;
    setHelpDeskFaq({ ...helpDeskFaq, [name]: value });
  };

  const handleListInput = (e, row) => {
    // debugger;
    let { name, value } = e.target;
    // const updatedRow = { ...row, [name]: value };
    // const updatedDataList = hdTicketDataList.map((rowData) =>
    //   rowData.hdTicketId === row.hdTicketId ? updatedRow : rowData
    // );
    // setHdTicketDataList(updatedDataList);
  };

  const handleInputs = (e) => {
    let { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const [faqData, setFaqData] = useState([]);
  const [validated, setValidated] = useState(false);

  //   const getFaq = () => {
  //     api
  //       .get(baseURLMasterData + `hdQuestionMaster/get-all`)
  //       .then((response) => {
  //         setFaqData(response.data.content.hdQuestionMaster);
  //       })
  //       .catch((err) => {
  //         // Handle error
  //       });
  //   };

  //   useEffect(() => {
  //     getFaq();
  //   }, []);

  const getList = () => {
    setLoading(true);
    api
      .post(
        baseURLDBT + `service/getInProgressTaskListByUserIdAndStepId`,
        {},
        { params: { userId: localStorage.getItem("userMasterId"), stepId: 7 } }
        // { params: { userId: 113, stepId: 7 } }
      )
      .then((response) => {
        setListData(response.data.content);
        const scApplicationFormIds = response.data.content.map(
          (item) => item.scApplicationFormId
        );
        // setAllApplicationIds(scApplicationFormIds);
        setLoading(false);
      })
      .catch((err) => {
        setListData({});
        setLoading(false);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  // to get userList
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

  const assign = (workFlowId, applicationDocumentId) => {
    // console.log(workFlowId);
    // const postData = {
    //     requestType: "sasa",
    //     requestTypeId: 100,
    //     userMasterId: data.userMasterId,
    //   };

    // const postData = {
    //   requestType: "SUBSIDY_PRE_INSPECTION",
    //   requestTypeId: workFlowId,
    //   //   userMasterId: data.userMasterId,
    //   userMasterId: 114,
    // };

    // api
    //   .post(baseURLDBT + `service/assignInspection`, postData)
    //   .then((response) => {
    //     // setUserListData(response.data.content.userMaster);
    //     getList();
    //   })
    //   .catch((err) => {
    //     // setUserListData([]);
    //   });

    api
      .post(
        baseURLDBT + `service/updateCompletionStatusFromWeb`,
        {},
        { params: { id: workFlowId } }
      )
      .then((response) => {
        // setUserListData(response.data.content.userMaster);
        // getList();
        api
          .post(
            baseURLDBT + `service/updateApplicationFormProcessCompleted`,
            {},
            {
              params: {
                docId: applicationDocumentId,
                loggedInUserId: localStorage.getItem("userMasterId"),
              },
            }
          )
          .then((response) => {
            // setUserListData(response.data.content.userMaster);
            getList();
          })
          .catch((err) => {
            // setUserListData([]);
          });
      })
      .catch((err) => {
        // setUserListData([]);
      });
  };

  const postData = (event) => {
    // const post = {
    //   applicationFormIds: applicationIds,
    //   applicationFormIdsNotSelected: unselectedApplicationIds,
    //   inspectorId: localStorage.getItem("userMasterId"),
    // };
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      api
        .post(baseURLDBT + `service/updateApplicationStatus`)
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

  const clear = (e) => {
    e.preventDefault();
    window.location.reload();
    // setAllApplicationIds([]);
    // setUnselectedApplicationIds([]);
    // setAllApplicationIds([]);
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
      name: "Farmer Name",
      selector: (row) => row.farmerFirstName,
      cell: (row) => <span>{row.farmerFirstName}</span>,
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
      name: "Scheme Name",
      selector: (row) => row.schemeName,
      cell: (row) => <span>{row.schemeName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Sub Scheme Name",
      selector: (row) => row.subSchemeName,
      cell: (row) => <span>{row.subSchemeName}</span>,
      sortable: true,
      hide: "md",
    },
    // {
    //   name: "Minimum Quantity",
    //   selector: (row) => row.minQty,
    //   cell: (row) => <span>{row.minQty}</span>,
    //   sortable: true,
    //   hide: "md",
    // },

    // {
    //   name: "Maximum Quantity",
    //   selector: (row) => row.maxQty,
    //   cell: (row) => <span>{row.maxQty}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    // {
    //   name: "Assign To",
    //   cell: (row) => (
    //     <div className="text-start w-100">
    //       <Form.Group className="form-group">
    //         <div className="form-control-wrap">
    //           <Form.Select
    //             name="userMasterId"
    //             value={data.userMasterId}
    //             // onChange={(e) => handleListInput(e, row)}
    //             onChange={handleInputs}
    //             // onBlur={() => handleInputs}
    //           >
    //             <option value="">Select User</option>
    //             {userListData.map((list) => (
    //               <option key={list.userMasterId} value={list.userMasterId}>
    //                 {list.username}
    //               </option>
    //             ))}
    //           </Form.Select>
    //         </div>
    //       </Form.Group>
    //     </div>
    //   ),
    //   sortable: true,
    //   hide: "md",
    // },
    {
      name: "action",
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
          <Button
            variant="primary"
            size="sm"
            onClick={() => assign(row.workFlowId, row.applicationDocumentId)}
            // disabled={data.userMasterId ? false : true}
          >
            Send to Drawing officer
          </Button>
        </div>
      ),
      sortable: false,
      hide: "md",
    },
  ];

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

  //   const search = (e) => {
  //     api
  //       .post(baseURL + `hdQuestionMaster/search`, {
  //         searchText: helpDeskFaq.text,
  //         searchBy: helpDeskFaq.searchBy,
  //       })
  //       .then((response) => {
  //         setFaqData(response.data.content.hdQuestionMaster);
  //       })
  //       .catch((err) => {
  //         // Handle error
  //       });
  //   };

  return (
    <div>
      {/* <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Proceed To Payment List</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/application-dashboard"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/application-dashboard"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="plus" />
                  <span>Dashboard</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head> */}

      <Block className="mt-1">
        {/* <Card> */}
        {/* <DataTable
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
          /> */}
        <Row className="g-gs">
          <Col lg="6">
            <table className="table small table-bordered">
              <thead style={styles.headerStyle}>
                <tr>
                  <th colSpan="2">Personal Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={styles.ctstyle}>BID:</td>
                  <td>not coming</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}> FID:</td>
                  <td>
                    {applicationDetails && applicationDetails[0].fruitsId}
                  </td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}> First Name:</td>
                  <td>
                    {applicationDetails &&
                      applicationDetails[0].farmerFirstName}
                  </td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}> Middle Name:</td>
                  <td>
                    {applicationDetails && applicationDetails[0].middleName}
                  </td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}> Last Name:</td>
                  <td>
                    {applicationDetails && applicationDetails[0].lastName}
                  </td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}> District:</td>
                  <td>
                    {applicationDetails && applicationDetails[0].districtName}
                  </td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}> Taluk:</td>
                  <td>
                    {applicationDetails && applicationDetails[0].talukName}
                  </td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}> Hobli:</td>
                  <td>
                    {applicationDetails && applicationDetails[0].hobliName}
                  </td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}> Village:</td>
                  <td>
                    {applicationDetails && applicationDetails[0].villageName}
                  </td>
                </tr>
              </tbody>
            </table>
          </Col>

          <Col lg="6">
            <table className="table small table-bordered">
              <thead style={styles.headerStyle}>
                <tr>
                  <th colSpan="2">Scheme Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={styles.ctstyle}>Scheme:</td>
                  <td>
                    {applicationDetails && applicationDetails[0].schemeName}
                  </td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}> Component Type:</td>
                  <td>
                    {applicationDetails && applicationDetails[0].subSchemeName}
                  </td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}> Component:</td>
                  <td>
                    {applicationDetails &&
                      applicationDetails[0].scComponentName}
                  </td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}> Sub Component:</td>
                  <td>
                    {applicationDetails && applicationDetails[0].categoryName}
                  </td>
                </tr>
              </tbody>
            </table>
          </Col>
        </Row>

        <Row>
          <Col lg="12">
            <Card>
              <Card.Header>RTC Details</Card.Header>
              <Card.Body>
                <Row className="g-gs">
                  <Col sm={8} lg={12}>
                    <table className="table small table-bordered">
                      <thead style={styles.headerStyle}>
                        <tr>
                          <th>District</th>
                          <th>Taluk</th>
                          <th>Hobli</th>
                          <th>Village</th>
                          <th>Owner</th>
                          <th>SurveyNo</th>
                          <th>Actual Area</th>
                          <th>Developed Area</th>
                        </tr>
                      </thead>
                      <tbody>
                        {landDetails &&
                          landDetails.length > 0 &&
                          landDetails.map((landDetail) => {
                            // console.log(landDetail.districtName);
                            return (
                              <tr>
                                <td>{landDetail.districtName}</td>
                                <td>{landDetail.talukName}</td>
                                <td>{landDetail.hobliName}</td>
                                <td>{landDetail.villageName}</td>
                                <td>{landDetail.ownerName}</td>
                                <td>{landDetail.surveyNumber}</td>
                                <td>{landDetail.acre}</td>
                                <td>{landDetail.devAcre}</td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="d-flex">
              {documentsDetails &&
                documentsDetails.length > 0 &&
                documentsDetails.map((file, i) => (
                  <div key={i}>
                    <div className="d-flex justify-content-center">
                      <img
                        style={{ height: "300px", width: "300px" }}
                        src={file}
                        alt="Selected File"
                        onClick={(e) =>
                          click(selectedDocumentOriginalFileName[i])
                        }
                      />
                    </div>
                    {/* <div className="text-center">{file.documentMasterName}</div> */}
                    <div className="text-center">
                      {selectedDocumentFileName[i]}
                    </div>
                  </div>
                ))}
            </div>
          </Col>
        </Row>
        <Row>
          <Col sm={8} lg={12}>
            <table className="table small table-bordered">
              <thead style={styles.headerStyle}>
                <tr>
                  <th>Step Name</th>
                  <th>Status</th>
                  <th>Assigned By</th>
                  <th>Assigned To</th>
                  <th>Reject Reason</th>
                  <th>Rejected By</th>
                  <th>Comment</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {workFlowDetails &&
                  workFlowDetails.length > 0 &&
                  workFlowDetails.map((workFlowDetail) => {
                    return (
                      <tr>
                        <td>{workFlowDetail.stepName}</td>
                        <td>{workFlowDetail.status}</td>
                        <td>{workFlowDetail.assignedBy}</td>
                        <td>{workFlowDetail.assignedTo}</td>
                        <td>{workFlowDetail.rejectReason}</td>
                        <td>{workFlowDetail.rejectedBy}</td>
                        <td>{workFlowDetail.comment}</td>
                        <td>{workFlowDetail.reason}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </Col>
        </Row>

        {/* </Card> */}
      </Block>
    </div>
  );
};

export default EditAllApplication;
