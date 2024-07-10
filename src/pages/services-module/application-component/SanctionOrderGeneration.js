import { Card, Button, Row, Col, Form, Modal } from "react-bootstrap";
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
import ViewAllApplication from "./ViewAllApplication";

const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;

const SanctionOrderGeneration = () => {
  const [helpDeskFaq, setHelpDeskFaq] = useState({
    text: "",
    searchBy: "hdQuestionName",
  });

  const [data, setData] = useState({
    userMasterId: "",
  });

  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // To get Photo
  const [selectedDocumentFile, setSelectedDocumentFile] = useState([]);
  const [selectedDocumentFileName, setSelectedDocumentFileName] = useState([]);
  const [
    selectedDocumentOriginalFileName,
  setSelectedDocumentOriginalFileName,
  ] = useState([]);
  const [workOrderId, setWorkOrderId] = useState("");

  const getDocumentFile = async (file, name) => {
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
      setSelectedDocumentFile((prev) => [...prev, url]);
      setSelectedDocumentFileName((prev) => [...prev, name]);
      setSelectedDocumentOriginalFileName((prev) => [...prev, file]);
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  };

  // const handleListInput = (e, i) => {
  //   // debugger;
  //   let { name, value } = e.target;
  //   const updatedRow = { ...row, [name]: value };
  //   const updatedDataList = hdTicketDataList.map((rowData) =>
  //     rowData.hdTicketId === row.hdTicketId ? updatedRow : rowData
  //   );
  //   setHdTicketDataList(updatedDataList);
  // };

  // to get Document List
  const [documentListData, setDocumentListData] = useState([]);

  const getDocumentList = () => {
    const response = api
      .get(baseURLMasterData + `documentMaster/get-all`)
      .then((response) => {
        setDocumentListData(response.data.content.documentMaster);
      })
      .catch((err) => {
        setDocumentListData([]);
      });
  };

  useEffect(() => {
    getDocumentList();
  }, []);

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

  const [docIds, setDocIds] = useState([]);
  const handleListInput = (e, i) => {
    // debugger;
    let { name, value } = e.target;
    // letDocIds((prev) => [...prev, { [name]: value }]);

    setDocIds((prev) => {
      const existingIndex = prev.findIndex((item) => item[name] !== undefined);
      if (existingIndex !== -1) {
        // Update the existing entry
        const updatedDocIds = [...prev];
        updatedDocIds[existingIndex] = { [name]: value };
        return updatedDocIds;
      } else {
        // Add a new entry
        return [...prev, { [name]: value }];
      }
    });
  };

  console.log("Oh man!!!", docIds);

  const handleInputs = (e) => {
    let { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

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

  // Display Image
  const [attachFiles, setAttachFiles] = useState("");
  // const [photoFile,setPhotoFile] = useState("")

  console.log("attached", attachFiles);

  const handleAttachFileChange = (e) => {
    const file = e.target.files[0];
    setAttachFiles(file);
    //  setData((prev) => ({ ...prev, hdAttachFiles: file.name }));
    // setPhotoFile(file);
  };

  // Upload Image to S3 Bucket
  const handleAttachFileUpload = async (applicationId, position, workId) => {
    // const parameters = `hdTicketId=${hdTicketid}`;
    // console.log("Checking", applicationId, position);
    const docTypeId = docIds.find((docId) => docId.hasOwnProperty(position))[
      position
    ];
    const param = {
      applicationFormId: applicationId,
      // TODO need to get documentId from API
      documentTypeId: docTypeId,
    };
    try {
      const formData = new FormData();
      formData.append("multipartFile", attachFiles);

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
      console.log("File upload response:", response.data);
      if (response.status === 200) {
        generateWorkOrder(workId);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
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

  // // Upload Image to S3 Bucket
  // const handleAttachFileUpload = async (documentId) => {
  //   // const parameters = `applicationFormId =${data.applicationId}`;
  //   const param = {
  //     applicationFormId: applicationId,
  //     documentTypeId: documentId,
  //   };
  //   try {
  //     const formData = new FormData();
  //     formData.append("multipartFile", documentAttachments[documentId]);

  //     const response = await api.post(
  //       baseURLDBT + `service/uploadDocument`,
  //       formData,
  //       {
  //         params: param,
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  //     console.log("File upload response:", response.data);
  //   } catch (error) {
  //     console.error("Error uploading file:", error);
  //   }
  // };

  const getList = () => {
    setLoading(true);
    api
      .post(
        baseURLDBT + `service/getInProgressTaskListByUserIdAndStepId`,
        {},
        { params: { userId: localStorage.getItem("userMasterId"), stepId: 5 } }
        // { params: { userId: 113, stepId: 5 } }
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
    setSelectedDocumentFile([]);
    setWorkOrderId(workFlowId);
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
    // fodododbsjdsdhs
    api
      .post(baseURLDBT + `service/checkInspectionStatus`, {
        applicationFormId: applicationDocumentId,
        stepId: 4,
      })
      .then((response) => {
        // setUserListData(response.data.content.userMaster);
        if (response.data.content) {
          handleShowModal();
          api
            .post(
              baseURLDBT +
                `service/getInspectedDocumentsListAndGpsByApplicationDocId`,
              {},
              {
                params: {
                  docId: applicationDocumentId,
                  type: "SUBSIDY_POST_INSPECTION",
                },
              }
            )
            .then((response) => {
              if (response.data.content.documentResponses.length > 0) {
                //TODO  Need to Change here after response
                const documents = response.data.content.documentResponses;
                documents.forEach((data) => {
                  getDocumentFile(data.uploadPath, data.documentMasterName);
                });
              } else {
                //TODO  Need to comment below code after test
                const resData = {
                  content: {
                    documentResponses: [
                      {
                        uploadPath:
                          "applicationForm/_1c2cadf5-1ad1-4cf8-81a9-1f3fd67898bf_jpg",
                        documentMasterName: "xyz",
                      },
                      {
                        uploadPath:
                          "applicationForm/_0529af52-77e7-48e9-bbc7-2921265b9842_jpeg",
                        documentMasterName: "abc",
                      },
                    ],
                    lat: 12.33,
                    lng: 2.33,
                  },
                  errorMessages: [],
                  errorCode: 0,
                };
                resData.content.documentResponses.forEach((data) => {
                  getDocumentFile(data.uploadPath, data.documentMasterName);
                });
              }

              // setUserListData(response.data.content.userMaster);
              // api
              //   .post(
              //     baseURLDBT + `service/triggerWorkFlowNextStep`,
              //     {},
              //     { params: { id: workFlowId } }
              //   )
              //   .then((response) => {
              //     // setUserListData(response.data.content.userMaster);
              //     getList();
              //   })
              //   .catch((err) => {
              //     // setUserListData([]);
              //   });
            })
            .catch((err) => {
              // setUserListData([]);
            });

          // api
          //   .post(
          //     baseURLDBT +
          //       `service/updateApplicationWorkFlowStatusAndTriggerNextStep`,
          //     {},
          //     { params: { id: workFlowId } }
          //   )
          //   .then((response) => {
          //     // setUserListData(response.data.content.userMaster);
          //     api
          //       .post(
          //         baseURLDBT + `service/triggerWorkFlowNextStep`,
          //         {},
          //         { params: { id: workFlowId } }
          //       )
          //       .then((response) => {
          //         // setUserListData(response.data.content.userMaster);
          //         getList();
          //       })
          //       .catch((err) => {
          //         // setUserListData([]);
          //       });
          //   })
          //   .catch((err) => {
          //     // setUserListData([]);
          //   });
        } else {
          Swal.fire({
            icon: "warning",
            title: "In Process",
            // text: message,
          });
        }
      })
      .catch((err) => {
        // setUserListData([]);
      });
    // fodododbsjdsdhs
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

  const generateWorkOrder = (wid) => {
    api
      .post(
        baseURLDBT + `service/updateCompletionStatusFromWeb`,
        {},
        { params: { id: wid } }
      )
      .then((response) => {
        // setUserListData(response.data.content.userMaster);
        handleCloseModal();
        api
          .post(
            baseURLDBT + `service/triggerWorkFlowNextStep`,
            {},
            { params: { id: wid } }
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
      name: "Generate Copy  ",
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
          <Button
            variant="primary"
            size="sm"
            onClick={() => assign(row.workFlowId, row.applicationDocumentId)}
            // disabled={data.userMasterId ? false : true}
          >
            Show Status
          </Button>
        </div>
        // <span>This step to be done through mobile app</span>
      ),
      sortable: false,
      hide: "md",
    },

    {
      name: "Select Document Type",
      cell: (row, i) => (
        //   Button style
        <div className="text-start w-100">
          <Form.Group className="form-group">
            <div className="form-control-wrap">
              <Form.Select
                name={i}
                value={row.hdStatusId}
                onChange={(e) => handleListInput(e, i)}
                // onBlur={() => handleInputs}
              >
                <option value="">Select Status</option>
                {documentListData.map((list) => (
                  <option
                    key={list.documentMasterId}
                    value={list.documentMasterId}
                  >
                    {list.documentMasterName}
                  </option>
                ))}
              </Form.Select>
            </div>
          </Form.Group>
        </div>
        // <span>This step to be done through mobile app</span>
      ),
      sortable: false,
      hide: "md",
    },

    {
      name: "Upload Signed Copy",
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
          {/* <Button
              variant="primary"
              size="sm"
              onClick={() => assign(row.workFlowId)}
              // disabled={data.userMasterId ? false : true}
            >
              Download Work Order
            </Button> */}
          {/* <input type="file"></input> */}
          {/* <form action="/upload" method="post" enctype="multipart/form-data"> */}
          {/* <input type="file" name="fileToUpload" id="fileToUpload"></input>
          <input
            type="submit"
            value="Choose File"
            name="submit"
            onClick={() => document.getElementById("fileToUpload").click()}
            onChange={handleAttachFileChange}
          ></input> */}
          {/* <label htmlFor="fileToUpload" className="custom-file-upload">
            Choose File
          </label> */}
          <input
            type="file"
            id={`fileToUpload${row.workFlowId}`}
            // style={{ backgroundColor: "red" }}
            onChange={handleAttachFileChange}
          />

          {/* </form> */}
        </div>
        // <span>This step to be done through mobile app</span>
      ),
      sortable: false,
      hide: "md",
    },
    {
      name: "action",
      cell: (row, i) => (
        //   Button style
        <div className="text-start w-100">
          <Button
            variant="primary"
            size="sm"
            onClick={() =>
              handleAttachFileUpload(
                row.applicationDocumentId,
                i,
                row.workFlowId
              )
            }
            // disabled={data.userMasterId ? false : true}
          >
            Upload
          </Button>
        </div>
        // <span>This step to be done through mobile app</span>
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
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Sanction Order Generation List</Block.Title>
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
      <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>File Upload</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ViewAllApplication />
          <div className="d-flex">
            {selectedDocumentFile.length > 0 &&
              selectedDocumentFile.map((file, i) => (
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

          {/* <div className="gap-col">
            <ul className="d-flex align-items-center justify-content-center gap g-3">
              <li>
                <Button
                  type="button"
                  variant="primary"
                  onClick={generateWorkOrder}
                >
                  Generate Work Order
                </Button>
              </li>
            </ul>
          </div> */}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SanctionOrderGeneration;
