import { Card, Button, Row, Col, Form, Modal,Accordion } from "react-bootstrap";
import { Link,useParams } from "react-router-dom";
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
import axios from "axios";
import api from "../../../services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function DashboardReportList() {
  const { id } = useParams();
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 35;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };
  const [applicationDetails, setApplicationDetails] = useState([]);

  const [data, setData] = useState({
    userMasterId: "",
    stepId: "",
  });

  const [rejectReason, setRejectReason] = useState({
    rejectReasonWorkFlowMasterId: "",
    reason: "",
  });

  const [showModal, setShowModal] = useState(false);

  // const handleShowModal = () => setShowModal(true);
  const handleShowModal = ( fid ) => {
    setShowModal(true);
    getActionFarmerList(fid); // Call getList with userId and stepId
  };
  const handleCloseModal = () => setShowModal(false);

  const [showModal1, setShowModal1] = useState(false);

  const handleShowModal1 = () => setShowModal1(true);
  const handleCloseModal1 = () => setShowModal1(false);

  const [showModal2, setShowModal2] = useState(false);

  const handleShowModal2 = () => setShowModal2(true);
  const handleCloseModal2 = () => setShowModal2(false);

  
  const handleRejectInputs = (e) => {
    let { name, value } = e.target;
    setRejectReason({ ...rejectReason, [name]: value });
  }; 
  const handleInputs = (e) => {
    let { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  
  const getList = () => {
    setLoading(true);
    api
      .post(
        baseURLDBT + `service/getInProgressTaskListByUserIdAndStepId`,
        {},
        // { params: { userId: 27, stepId: 1 } }
        { params: { userId: localStorage.getItem("userMasterId"), stepId:id } }
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

  // const [actionListData, setActionListData] = useState({
  //   userMasterId: "",
  //   stepId: "",
  // });

const [actionFarmerData, setActionFarmerData] = useState({});

  const getActionFarmerList = (fid) => {
    setLoading(true);
    api
      .post(
        baseURLDBT + `service/getInProgressTaskListByUserIdAndStepId`,
        {},
        // { params: { userId: 27, stepId: 1 } }
        { params: { userId: localStorage.getItem("userMasterId"), stepId: id,fid: fid } }
      )
      .then((response) => {
        setActionFarmerData(response.data.content);
        const scApplicationFormIds = response.data.content.map(
          (item) => item.scApplicationFormId
        );

        // Extract and set the applicationDocumentId
      const applicationDocumentId = response.data.content[0]?.applicationDocumentId;

      // Set the applicationDocumentId for both uploadDocuments and sanctionOrderData
      setUploadDocuments((prev) => ({
        ...prev,
        applicationFormId: applicationDocumentId, // Set applicationDocumentId here
      }));

      setSanctionOrderData((prev) => ({
        ...prev,
        applicationFormId: applicationDocumentId, // Set applicationDocumentId here
      }));
        // setAllApplicationIds(scApplicationFormIds);
        setLoading(false);
      })
      .catch((err) => {
        setActionFarmerData({});
        setLoading(false);
      });
  };


  
  // to get uploadable documents
  const [docListData, setDocListData] = useState([]);

  const getDocList = () => {
    api
      .get(baseURLMasterData + `documentMaster/get-all`)
      .then((response) => {
        setDocListData(response.data.content.documentMaster);
      })
      .catch((err) => {
        setDocListData([]);
      });
  };

  useEffect(() => {
   getDocList();
 }, []);


  const [applicationIds, setApplicationIds] = useState([]);
  const [unselectedApplicationIds, setUnselectedApplicationIds] = useState([]);
  const [allApplicationIds, setAllApplicationIds] = useState([]);

  const handleCheckboxChange = (_id) => {
    if (applicationIds.includes(_id)) {
      const dataList = [...applicationIds];
      const newDataList = dataList.filter((data) => data !== _id);
      setApplicationIds(newDataList);
    } else {
      setApplicationIds((prev) => [...prev, _id]);
    }
  };

  useEffect(() => {
    setUnselectedApplicationIds(
      allApplicationIds.filter((id) => !applicationIds.includes(id))
    );
  }, [allApplicationIds, applicationIds]);

  //   console.log("Unselected",unselectedApplicationIds);
  const [validated, setValidated] = useState(false);
  
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

  const assign = (workFlowId) => {
   

    const postData = {
      requestType: "SUBSIDY_PRE_INSPECTION",
      requestTypeId: workFlowId,
      userMasterId: data.userMasterId,
      // userMasterId: 114,
    };

    api
      .post(baseURLDBT + `service/assignInspection`, postData)
      .then((response) => {
        // setUserListData(response.data.content.userMaster);
        Swal.fire({
          icon: "success",
          title: "Task Assigned for Inspection",
        });
        getList();
      })
      .catch((err) => {
        // setUserListData([]);
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

  const [inspectionData, setInspectionData] = useState({
    comment: "",
    rejectReasonWorkflowMasterId: "",
    applicationFormId: "",
  });


  const postInspectionData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      
      const sendPost = {
       
        description: inspectionData.comment,
        rejectedReasonId: inspectionData.rejectReasonWorkflowMasterId,
        applicationFormId: inspectionData.applicationFormId,
        
      };
         api
        .post(
          baseURLDBT + `service/inspectionUpdate`,
          sendPost
        )
        .then((response) => {
          if (response.data.errorCode === -1) {
            saveError(response.data.errorMessages[0]);
          } else if (response.data.content && response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
            clear();
            setValidated(false);
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
              saveError(err.response.data.validationErrors);
            }
          }
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
      // title: "Save attempt was not successful",
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

  // to get Financial Year
  const [rejectReasonListData, setRejectReasonListData] = useState([]);

  const getRejectReasonList = () => {
    api
      .get(baseURLMasterData + `rejectReasonWorkFlowMaster/get-all`)
      .then((response) => {
        setRejectReasonListData(response.data.content.rejectReasonWorkFlowMaster);
      })
      .catch((err) => {
        setRejectReasonListData([]);
      });
  };

  useEffect(() => {
    getRejectReasonList();
  }, []);

  //  // Display Image
  //  const [documentAttachments, setDocumentAttachments] = useState({});
  //  const handleAttachFileChange = (e, documentId) => {
  //    if (e.target.files.length > 0) {
  //      const file = e.target.files[0];
  //      setDocumentAttachments((prevState) => ({
  //        ...prevState,
  //        [documentId]: file,
  //      }));
  //    } else {
  //      setDocumentAttachments((prevState) => ({
  //        ...prevState,
  //        [documentId]: null,
  //      }));
  //      // setData((prev) => ({ ...prev, hdAttachFiles: "" }));
  //      // document.getElementById("hdAttachFiles").value = "";
  //    }
  //    // setPhotoFile(file);
  //  };

  //  const handleRemoveImage = (documentId) => {
  //   const updatedDocument = { ...documentAttachments };
  //   delete updatedDocument[documentId];
  //   setDocumentAttachments(updatedDocument);
  //   document.getElementById(`attImage${documentId}`).value = "";
  //   // setData((prev) => ({ ...prev, hdAttachFiles: "" }));
  // };

  // const [applicationId, setApplicationId] = useState("");

 
  const [viewDetailsData, setViewDetailsData] = useState({
    applicationDetails: [],
    landDetails: [],
    applicationTransactionDetails: [],
    documents: [],
    workflowDetails: [],
  });

  const handleView = (_id) => {
    api
      .post(baseURLDBT + `service/viewServiceApplicationDetails`, {
        applicationFormId: _id,
      })
      .then((response) => {
        const content = response.data.content[0];
        
        if (content.applicationDetailsResponses.length <= 0) {
          saveError("No Details Found!!!");
        } else {
          handleShowModal2();
          setViewDetailsData({
            applicationDetails: content.applicationDetailsResponses,
            landDetails: content.landDetailsResponses,
            applicationTransactionDetails: content.applicationTransactionResponses,
            documents: content.documentsResponses,
            workflowDetails: content.workFlowDetailsResponses,
          });
        }
      })
      .catch((err) => {
        // saveError(err.response.data.validationErrors);
      });
  };

  // useEffect(() => {
  //   getList();
  // }, []);

  const ApplicationDataColumns = [
  
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
    {
      name: "Assign To",
      cell: (row) => (
        <div className="text-start w-100">
          <Form.Group className="form-group">
            <div className="form-control-wrap">
              <Form.Select
                name="userMasterId"
                value={data.userMasterId}
                // onChange={(e) => handleListInput(e, row)}
                onChange={handleInputs}
                // onBlur={() => handleInputs}
              >
                <option value="">Select User</option>
                {userListData.map((list) => (
                  <option key={list.userMasterId} value={list.userMasterId}>
                    {list.username}
                  </option>
                ))}
              </Form.Select>
            </div>
          </Form.Group>
        </div>
      ),
      sortable: true,
      hide: "md",
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="text-start w-100">
          <Button
            variant="primary"
            size="sm"
            onClick={() => assign(row.workFlowId)}
            className="me-2" // Adds space between buttons
            disabled={data.userMasterId ? false : true}
          >
            Assign
          </Button>
    
          <Button
            variant="primary"
            size="sm" 
            onClick={()=>handleShowModal(row.fruitsId,row.applicationDocumentId)}
            className="me-2" // Adds space between buttons
          >
            Action
          </Button>
    
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleView(row.applicationDocumentId)}
          >
            View  
          </Button>
        </div>
      ),
      sortable: false,
      hide: "md",
    }
    
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

  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
    headerStyle: {
      // backgroundColor: "#0f6cbe",
      backgroundColor: "#0a2463",
      color: "white",
      borderTopLeftRadius: "8px",
      borderTopRightRadius: "8px",
    },
  };

  const [currentDocumentPath, setCurrentDocumentPath] = useState(null);

  const handleDocumentClick = async (documentPath) => {
    setCurrentDocumentPath(documentPath);
    await getDocumentFile(documentPath);
  };

  const [selectedDocumentFile, setSelectedDocumentFile] = useState(null);
      
  const getDocumentFile = async (file) => {
    const parameters = `fileName=${file}`;
    try {
      const response = await api.get(
        baseURLDBT + `service/downLoadFile?${parameters}`,
        {
          responseType: "arraybuffer",
        }
      );
      const blob = new Blob([response.data]);
      const url = URL.createObjectURL(blob);
      setSelectedDocumentFile(url);
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  };

  const downloadFile = async (file) => {
    const parameters = `fileName=${file}`;
    try {
      const response = await api.get(
        baseURLDBT + `service/downLoadFile?${parameters}`,
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

  const handleDocumentInputs = (e) => {
    let { name, value } = e.target;
    setUploadDocuments({ ...uploadDocuments, [name]: value });
  };

  const handleSanctionOrderInputs = (e) => {
    let { name, value } = e.target;
    setSanctionOrderData({ ...sanctionOrderData, [name]: value });
  };

  const [uploadStatus, setUploadStatus] = useState({});

  const handleAttachFileUpload = async (documentId) => {
    const param = {
      applicationFormId: uploadDocuments.applicationFormId,
      documentTypeId: documentId,
    };

    try {
        const formData = new FormData();
        formData.append("multipartFile", document);
    
        const response = await api.post(
          baseURLDBT + `service/uploadDocument`,
          formData,
          {
            params: param,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        Swal.fire({
            icon: "success",
            title: "File uploaded successfully",
          });
         
          setUploadStatus((prevStatus) => ({
            ...prevStatus,
            [documentId]: true, // Mark this document as uploaded
          }));

          setUploadedDocuments((prevDocs) => [
            ...prevDocs,
            {
              documentId,
              // documentName: document.name,
              documentName: document?.name || "Unknown Document",
              documentMasterName: docListData.find(
                (list) => list.documentMasterId === documentId
              )?.documentMasterName, // Find and store the documentMasterName
              documentFile: document, // Store the file itself for image preview
            },
          ]);

            } catch (error) {
              console.error("Error uploading file:", error);
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error uploading file. Please try again.",
              });
            }
          };


  const [uploadDocuments, setUploadDocuments] = useState({
    applicationFormId: "",
    documentTypeId: "",
    documentPath: ''
  });

  
  const [uploadedDocuments, setUploadedDocuments] = useState([]);

 //Display Document
 const [document, setDocument] = useState("");

 const handleDocumentChange = (e) => {
  const file = e.target.files[0];
  if (file) { // Added null check
    setDocument(file);
    setUploadDocuments((prev) => ({ ...prev, documentPath: file.name }));
  }
}

 const [sanctionOrderData, setSanctionOrderData] = useState({
  applicationFormId: "",
  documentTypeId: "",
});

 const [sanctionOrderUploadedDocuments, setSanctionOrderUploadedDocuments] = useState([]);

 //Display Document
 const [sanctionOrderDocument, setSanctionOrderDocument] = useState("");

 const handleSanctionOrderChange = (e) => {
   const file = e.target.files[0];
   setSanctionOrderDocument(file);
   setSanctionOrderData((prev) => ({ ...prev, documentPath: file.name }));
  //  setPhotoFile(file);
 };

 const [uploadSanctionOrderStatus, setSanctionOrderStatus] = useState({});

  const handleSanctionOrderUpload = async (documentId) => {
    const param = {
      applicationFormId: sanctionOrderData.applicationFormId,
      documentTypeId: documentId,
    };

    try {
        const formData = new FormData();
        formData.append("multipartFile", sanctionOrderDocument);
    
        const response = await api.post(
          baseURLDBT + `service/uploadDocument`,
          formData,
          {
            params: param,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        Swal.fire({
            icon: "success",
            title: "File uploaded successfully",
          });
         
          setSanctionOrderStatus((prevStatus) => ({
            ...prevStatus,
            [documentId]: true, // Mark this document as uploaded
          }));

          setSanctionOrderUploadedDocuments((prevDocs) => [
            ...prevDocs,
            {
              documentId,
              documentName: sanctionOrderDocument.name,
              documentMasterName: docListData.find(
                (list) => list.documentMasterId === documentId
              )?.documentMasterName, // Find and store the documentMasterName
              documentFile: sanctionOrderDocument, // Store the file itself for image preview
            },
          ]);

            } catch (error) {
              console.error("Error uploading file:", error);
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error uploading file. Please try again.",
              });
            }
          };
  


  return (
    <Layout title="Pre-Inspection List">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Pre-Inspection List</Block.Title>
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
      </Block.Head>

      <Modal show={showModal} onHide={handleCloseModal} size="xl">
  <Modal.Body>
    {loading ? (
      <h1 className="d-flex justify-content-center align-items-center">
        Loading...
      </h1>
    ) : (
      <>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
        <Form noValidate validated={validated} onSubmit={postInspectionData}>
          <Accordion.Header
            style={{
              backgroundColor: "#0F6CBE",
              color: "white",
              fontWeight: "bold",
              fontSize: "3rem",
              padding: "3px",
              borderRadius: "5px",
              position: "relative",
              overflow: "hidden",
            }}
            className="mb-3"
          >
            Application Details
          </Accordion.Header>
          <Accordion.Body>
            <Block className="mt-n3">
              <Card className="mt-3" style={{ border: "none", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
                <Card.Body>
                  <table className="table small table-bordered" style={{ width: "100%" }}>
                    <tbody>
                      <tr>
                        <td style={{ color: "red", fontWeight: "bold", fontSize: "1.1rem" }}>
                          {actionFarmerData.length>0 && actionFarmerData[0].action || 'N/A'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Card.Body>
              </Card>
            </Block>

            <Block className="mt-3">
              <Card className="mt-3" style={{ border: "none", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
                {/* <Card.Header
                  style={{
                    backgroundColor: "#0a2463",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    padding: "10px 15px",
                  }}
                >
                  Farmers Details
                </Card.Header> */}
                <Card.Header
                style={{
                  // backgroundColor: "#0a2463",
                  backgroundColor: "#0F6CBE",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  padding: "7px 12px",
                  position: "relative",
                  color: "white",
                  overflow: "hidden",
                }}
              >
                <span>Farmers Details</span>
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "3rem",
                    color: "rgba(255, 255, 255, 0.1)", // Light watermark color
                    zIndex: 0,
                    pointerEvents: "none", // Allow interactions to pass through
                    whiteSpace: "nowrap",
                  }}
                >
                  {/* Farmers Details */}
                </div>
              </Card.Header>

                <Card.Body>
                  <div style={{ overflowX: "auto" }}>
                    <table className="table small table-bordered table-hover" style={{ tableLayout: "fixed" }}>
                      <thead style={{ backgroundColor: "#27488A" }}>
                        <tr>
                          {["Fruits Id", "Farmer Name", "Farmer Middle Name", "Mobile Number","District", "Taluk"].map(header => (
                            <th key={header} style={{ width: "10%",color: "white"}}>{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {actionFarmerData?.length > 0 ? (
                          actionFarmerData.map((action, index) => (
                            <tr key={index}>
                              {["fruitsId", "farmerFirstName", "farmerMiddleName", "mobileNumber", "districtName", "talukName"].map(key => (
                                <td key={key} style={{ wordBreak: "break-word" }}>{action[key] || 'N/A'}</td>
                              ))}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="10" className="text-center">No Farmer Details Available</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card.Body>
              </Card>
            </Block>

            <Block className="mt-3">
              <Card className="mt-3" style={{ border: "none", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
                <Card.Body >
                  <Button
                    variant="secondary"
                    size="sm"
                    className="ms-2"
                    onClick={handleShowModal1}
                    style={{ padding: "10px 20px", fontSize: "16px" }}
                  > 
                    Upload Documents
                  </Button>
                </Card.Body>
              </Card>
            </Block>

            <Block className="mt-3">
              <Card className="mt-3" style={{ border: "none", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
                <Card.Body>
                  <Row>
                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label><strong>Reject Reason</strong></Form.Label>
                        <Form.Select
                          name="rejectReasonWorkFlowMasterId"
                          value={inspectionData.rejectReasonWorkflowMasterId}
                          onChange={handleRejectInputs}
                        >
                          <option value="">Select Reject Reason</option>
                          {rejectReasonListData.map((list) => (
                            <option
                              key={list.rejectReasonWorkFlowMasterId}
                              value={list.rejectReasonWorkFlowMasterId}
                            >
                              {list.reason}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label><strong>Description</strong></Form.Label>
                        <Form.Control
                          id="comment"
                          type="text"
                          name="comment"
                          value={inspectionData.comment}
                          onChange={handleInputs}
                          placeholder="Enter Description"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Block>

            <Col lg="12">
              <div className="d-flex justify-content-center gap-2">
                <Button type="submit" variant="success">
                  Submit
                </Button>
              </div>
            </Col>
          </Accordion.Body>
          </Form>
        </Accordion.Item>

        {/* Work Order Details Accordion */}
        <Accordion.Item eventKey="transaction">
          <Accordion.Header
            style={{
              backgroundColor: "#0F6CBE",
              color: "white",
              fontWeight: "bold",
              padding: "3px",
              borderRadius: "5px",
            }}
            className="mb-3"
          >
            Work Order Details
          </Accordion.Header>
          <Accordion.Body>
            <Block className="mt-3">
              <Row>
                <Col lg="6">
                  <Form.Group className="form-group">
                    <Form.Label><strong>Work Order No.</strong></Form.Label>
                    <Form.Control
                      id="description"
                      type="text"
                      name="workOrder"
                      value={data.workOrder}
                      onChange={handleInputs}
                      placeholder="Enter Work Order 1"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Block>

            {/* <Col lg="12"> */}
            <div className="gap-col mt-1">
            <ul className="d-flex align-items-center justify-content-center gap g-3">
              <li>
                <Button type="submit" variant="success">
                  Generate Work Order
                </Button>
                </li>
        </ul>
      </div>
            {/* </Col> */}
          </Accordion.Body>
        </Accordion.Item>


        <Accordion.Item eventKey="transaction">
          <Accordion.Header
            style={{
              backgroundColor: "#0F6CBE",
              color: "white",
              fontWeight: "bold",
              padding: "3px",
              borderRadius: "5px",
            }}
            className="mb-3"
          >
            Sanction Order Details
          </Accordion.Header>
          <Accordion.Body>
            <Block className="mt-3">
              <Row>
                <Col lg="6">
                  <Form.Group className="form-group">
                    <Form.Label><strong>Sanction Order No.</strong></Form.Label>
                    <Form.Control
                      id="sanctionOrder"
                      type="text"
                      name="sanctionOrder"
                      value={data.sanctionOrder}
                      onChange={handleInputs}
                      placeholder="Enter Sanction Order NO."
                    />
                  </Form.Group>
                </Col>

                <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label><strong>Documents</strong></Form.Label>
                        <Form.Select
                          name="documentTypeId"
                          value={sanctionOrderData.documentTypeId}
                          onChange={handleSanctionOrderInputs}
                        >
                          <option value="">Select Document Type</option>
                          {docListData.map((list) => (
                            <option
                              key={list.documentMasterId}
                              value={list.documentMasterId}
                            >
                              {list.documentMasterName}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                <Col lg="6">
                <Form.Group className="form-group">
                        <Form.Label htmlFor="accountImagePath">
                          Upload Sanction Order (PDF/jpg/png)(Max:2mb)
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            type="file"
                            id="documentPath"
                            name="documentPath"
                            // value={data.photoPath}
                            onChange={handleSanctionOrderChange}
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3 d-flex justify-content-center">
                        {sanctionOrderDocument ? (
                          <img
                            style={{ height: "100px", width: "100px" }}
                            src={URL.createObjectURL(sanctionOrderDocument)}
                          />
                        ) : (
                          ""
                        )}
                      </Form.Group>
                      </Col>
              </Row>

   {sanctionOrderUploadedDocuments.length > 0 && (
  <div className="mt-3">
    <h5>Uploaded Documents</h5>
    <ul>
      {sanctionOrderUploadedDocuments.map((doc, index) => (
        <li key={index} className="d-flex align-items-center">
          {/* Show the image if it's available */}
          {doc.documentFile && (
            <img
              src={URL.createObjectURL(doc.documentFile)}
              alt={doc.documentName}
              style={{ height: "100px", width: "100px", marginRight: "10px" }}
            />
          )}
          {/* Show the document master name */}
          {/* <span>Document Type: {doc.documentMasterName }</span> */}
        </li>
      ))}
    </ul>
  </div>
)}
            </Block>

            {/* <Col lg="12"> */}
            <div className="gap-col mt-1">
            <ul className="d-flex align-items-center justify-content-center gap g-3">
              <li>
                {/* <Button type="submit" variant="success">
                  Upload Documents
                </Button> */}
                <Button
                type="button"
                variant="primary"
                onClick={() => handleSanctionOrderUpload(sanctionOrderData.documentTypeId)}
                disabled={uploadSanctionOrderStatus[sanctionOrderData.documentTypeId]} // Disable button if this document is uploaded
              >
                {uploadSanctionOrderStatus[sanctionOrderData.documentTypeId] ? "Uploaded" : "Upload"}
              </Button>
                </li>
        </ul>
      </div>
            {/* </Col> */}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>  
      </>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseModal}>
      Close
    </Button>
  </Modal.Footer>
</Modal>



      <Block className="mt-n4">
        <Card>
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
      </Block>

      <Modal show={showModal1} onHide={handleCloseModal1} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Upload Documents</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* {docListData.map(({ documentMasterId, documentMasterName }) => ( */}
            <div>
              <Row >
              <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label><strong>Documents</strong></Form.Label>
                        <Form.Select
                          name="documentTypeId"
                          value={uploadDocuments.documentTypeId}
                          onChange={handleDocumentInputs}
                        >
                          <option value="">Select Document Type</option>
                          {docListData.map((list) => (
                            <option
                              key={list.documentMasterId}
                              value={list.documentMasterId}
                            >
                              {list.documentMasterName}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

               
                    <Col lg="6">
                <Form.Group className="form-group">
                        <Form.Label htmlFor="accountImagePath">
                          Upload Documents(PDF/jpg/png)(Max:2mb)
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            type="file"
                            id="documentPath"
                            name="documentPath"
                            // value={data.photoPath}
                            onChange={handleDocumentChange}
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3 d-flex justify-content-center">
                        {document ? (
                          <img
                            style={{ height: "100px", width: "100px" }}
                            src={URL.createObjectURL(document)}
                          />
                        ) : (
                          ""
                        )}
                      </Form.Group>
                      </Col>
              </Row>

              {uploadedDocuments.length > 0 && (
  <div className="mt-3">
    <h5>Uploaded Documents</h5>
    <ul>
      {uploadedDocuments.map((doc, index) => (
        <li key={index} className="d-flex align-items-center">
          {/* Show the image if it's available */}
          {doc.documentFile && (
            <img
              src={URL.createObjectURL(doc.documentFile)}
              alt={doc.documentName}
              style={{ height: "100px", width: "100px", marginRight: "10px" }}
            />
          )}
          {/* Show the document master name */}
          {/* <span>Document Type: {doc.documentMasterName }</span> */}
        </li>
      ))}
    </ul>
  </div>
)}
<div className="gap-col mt-1">
            <ul className="d-flex align-items-center justify-content-center gap g-3">
              <li>
                {/* <Button type="submit" variant="success">
                  Upload Documents
                </Button> */}
                <Button
                type="button"
                variant="primary"
                onClick={() => handleAttachFileUpload(uploadDocuments.documentTypeId)}
                disabled={uploadStatus[uploadDocuments.documentTypeId]} // Disable button if this document is uploaded
              >
                {uploadStatus[uploadDocuments.documentTypeId] ? "Uploaded" : "Upload"}
              </Button>
                </li>
        </ul>

            </div>
            </div>
          {/* ))} */}
        </Modal.Body>
      </Modal>

      <Modal show={showModal2} onHide={handleCloseModal2} size="xl">
  <Modal.Header closeButton>
    <Modal.Title>View Details</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {loading ? (
      <h1 className="d-flex justify-content-center align-items-center">
        Loading...
      </h1>
    ) : (
      <Accordion defaultActiveKey="0">
        {/* Application Details Accordion */}
        <Accordion.Item eventKey="0">
          <Accordion.Header style={{ backgroundColor: "#0F6CBE",color:"white",fontWeight: "bold" }}
                        className="mb-2">Application Details</Accordion.Header>
          <Accordion.Body>
            <table className="table small table-bordered">
              <tbody>
                <tr>
                  <td style={styles.ctstyle}>Fruits Id:</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.fruitsId || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>Farmer Name:</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.farmerFirstName || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>Sanction No:</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.sanctionNo || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>Sub Scheme Name:</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.subSchemeName || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>Component:</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.scComponentName || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>Scheme Name:</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.schemeName || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>Sub Component:</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.categoryName || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>Scheme Amount:</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.schemeAmount || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>Period From:</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.periodFrom || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>Period To:</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.periodTo || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>District Name:</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.districtName || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>Taluk Name:</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.talukName || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>Village Name:</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.villageName || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>Application Status:</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.applicationStatus || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>Remarks:</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.remarks || 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </Accordion.Body>
        </Accordion.Item>

        {/* Land Details Accordion */}
        {viewDetailsData?.landDetails?.length > 0 ? (
          viewDetailsData.landDetails.map((landDetail, index) => (
            <Accordion.Item eventKey={index + 1} key={index}>
              <Accordion.Header style={{ backgroundColor: "#0F6CBE",color:"white",fontWeight: "bold" }}
                        className="mb-2">Land Details</Accordion.Header>
              <Accordion.Body>
                <table className="table small table-bordered">
                  <tbody>
                    <tr>
                      <td style={styles.ctstyle}>Survey Number:</td>
                      <td>{landDetail.surveyNumber || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>District Name:</td>
                      <td>{landDetail.districtName || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Taluk Name:</td>
                      <td>{landDetail.talukName || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Village Name:</td>
                      <td>{landDetail.villageName || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Acre:</td>
                      <td>{landDetail.acre || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>F Gunta:</td>
                      <td>{landDetail.fGunta || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Gunta:</td>
                      <td>{landDetail.gunta || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Developed Area Acre:</td>
                      <td>{landDetail.devAcre || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Developed Area F Gunta:</td>
                      <td>{landDetail.devFGunta || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Developed Area Gunta:</td>
                      <td>{landDetail.devGunta || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Hissa:</td>
                      <td>{landDetail.hissa || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Land Code:</td>
                      <td>{landDetail.landCode || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Main Owner No:</td>
                      <td>{landDetail.mainOwnerNo || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Owner Name:</td>
                      <td>{landDetail.ownerName || 'N/A'}</td>
                    </tr>
                  </tbody>
                </table>
              </Accordion.Body>
            </Accordion.Item>
          ))
        ) : (
          <Accordion.Item eventKey="land">
            <Accordion.Header style={{ backgroundColor: "#0F6CBE",color:"white",fontWeight: "bold" }}
                        className="mb-2" >Land Details</Accordion.Header>
            <Accordion.Body>No Land Details Available</Accordion.Body>
          </Accordion.Item>
        )}

       

  <Accordion.Item eventKey="documents">
  <Accordion.Header style={{ backgroundColor: "#0F6CBE", color: "white", fontWeight: "bold" }} className="mb-2">
    Documents
  </Accordion.Header>
  <Accordion.Body>
    {viewDetailsData?.documents?.length > 0 ? (
      <table className="table small table-bordered">
        <thead>
          <tr>
            <th>Document Name</th>
            {/* <th>Document Path</th> */}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {viewDetailsData.documents.map((fileDocuments, index) => (
            <tr key={index}>
              <td>{fileDocuments.documentName || 'N/A'}</td>
              {/* <td>{fileDocuments.documentPath || 'N/A'}</td> */}
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleDocumentClick(fileDocuments.documentPath)}
                >
                  View Document
                </Button>
                {currentDocumentPath === fileDocuments.documentPath && selectedDocumentFile && (
                  <>
                    <img
                      style={{ height: "100px", width: "100px" }}
                      src={selectedDocumentFile}
                      alt="Selected File"
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      className="ms-2"
                      onClick={() => downloadFile(fileDocuments.documentPath)}
                    >
                      Download Selected File
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>No Documents Available</p>
    )}
  </Accordion.Body>
</Accordion.Item>

{viewDetailsData?.workflowDetails?.length > 0 ? (
          viewDetailsData.workflowDetails.map((workFlow, index) => (
            <Accordion.Item eventKey={index + 1} key={index}>
              <Accordion.Header style={{ backgroundColor: "#0F6CBE",color:"white",fontWeight: "bold" }}
                        className="mb-2">Work Flow Details</Accordion.Header>
              <Accordion.Body>
                <table className="table small table-bordered">
                  <tbody>
                    <tr>
                      <td style={styles.ctstyle}>Step Name:</td>
                      <td>{workFlow.stepName || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Status:</td>
                      <td>{workFlow.status || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Assigned By:</td>
                      <td>{workFlow.assignedBy || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Reject Reason:</td>
                      <td>{workFlow.rejectReason || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Rejected By:</td>
                      <td>{workFlow.rejectReason || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Comment:</td>
                      <td>{workFlow.comment || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Reason:</td>
                      <td>{workFlow.reason || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Assigned To:</td>
                      <td>{workFlow.assignedTo || 'N/A'}</td>
                    </tr>
                    
                  </tbody>
                </table>
              </Accordion.Body>
            </Accordion.Item>
          ))
        ) : (
          <Accordion.Item eventKey="land">
            <Accordion.Header style={{ backgroundColor: "#0F6CBE",color:"white",fontWeight: "bold" }}
                        className="mb-2" >Work Flow Details</Accordion.Header>
            <Accordion.Body>No Work Flow Details Available</Accordion.Body>
          </Accordion.Item>
        )}



        <Accordion.Item eventKey="transaction">
  <Accordion.Header style={{ backgroundColor: "#0F6CBE",color:"white",fontWeight: "bold" }}
                        className="mb-2">Application Transaction Details</Accordion.Header>
  <Accordion.Body>
    <div style={{ overflowX: 'auto' }}>
      <table className="table small table-bordered" style={{ maxWidth: '100%', tableLayout: 'fixed' }}>
        <thead style={styles.headerStyle}>
          <tr>
            <th style={{ width: '10%' }}>Fruits Id</th>
            <th style={{ width: '10%' }}>Beneficiary Id</th>
            <th style={{ width: '10%' }}>Scheme Amount</th>
            <th style={{ width: '10%' }}>Sanction No</th>
            <th style={{ width: '10%' }}>Financial Year</th>
            <th style={{ width: '10%' }}>Payment Mode</th>
            <th style={{ width: '10%' }}>File Name</th>
            <th style={{ width: '10%' }}>DBT Push Type</th>
            <th style={{ width: '10%' }}>Status</th>
            <th style={{ width: '10%' }}>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {viewDetailsData?.applicationTransactionDetails?.length > 0 ? (
            viewDetailsData.applicationTransactionDetails.map((transaction, index) => (
              <tr key={index}>
                <td style={{ wordBreak: 'break-word' }}>{transaction.fruitsId || 'N/A'}</td>
                <td style={{ wordBreak: 'break-word' }}>{transaction.beneficiaryId || 'N/A'}</td>
                <td style={{ wordBreak: 'break-word' }}>{transaction.schemeAmount || 'N/A'}</td>
                <td style={{ wordBreak: 'break-word' }}>{transaction.sanctionNo || 'N/A'}</td>
                <td style={{ wordBreak: 'break-word' }}>{transaction.financialYear || 'N/A'}</td>
                <td style={{ wordBreak: 'break-word' }}>{transaction.paymentMode || 'N/A'}</td>
                <td style={{ wordBreak: 'break-word' }}>{transaction.fileName || 'N/A'}</td>
                <td style={{ wordBreak: 'break-word' }}>{transaction.dbtPushType || 'N/A'}</td>
                <td style={{ wordBreak: 'break-word' }}>{transaction.status || 'N/A'}</td>
                <td style={{ wordBreak: 'break-word' }}>{transaction.remarks || 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="text-center">No Transaction Details Available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </Accordion.Body>
</Accordion.Item>
      </Accordion>
    )}

 
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseModal2}>
      Close
    </Button>
  </Modal.Footer>
</Modal>
    </Layout>
  );
}

export default DashboardReportList;
