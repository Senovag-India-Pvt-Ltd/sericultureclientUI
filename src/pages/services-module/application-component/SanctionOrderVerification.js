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
import { useState } from "react";
import { useEffect } from "react";
import api from "../../../../src/services/auth/api";

const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLReport = process.env.REACT_APP_API_BASE_URL_REPORT;

const SanctionOrderVerification = () => {
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

  // To get Photo
  const [selectedDocumentFile, setSelectedDocumentFile] = useState([]);
  const [selectedDocumentFileName, setSelectedDocumentFileName] = useState([]);

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
    } catch (error) {
      console.error("Error fetching file:", error);
    }
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

  const sanctionOrderReport = async (applicationId) => {
    try {
      const response = await api.post(
        baseURLReport + `getAuthorisationLetterFromFarmer`,
        {
          applicationFormId: applicationId,
        },
        {
          responseType: "blob", //Force to receive data in a Blob Format
        }
      );

      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);

      // const file = new Blob([response.data], { type: "application/pdf" });
      // const fileURL = URL.createObjectURL(file);
      // const printWindow = window.open(fileURL);
      // if (printWindow) {
      //   printWindow.onload = () => {
      //     printWindow.print();
      //   };
      // } else {
      //   console.error("Failed to open the print window.");
      // }
    } catch (error) {
      // console.log("error", error);
    }
  };

  const getList = () => {
    setLoading(true);
    api
      .post(
        baseURLDBT + `service/getInProgressTaskListByUserIdAndStepId`,
        {},
        { params: { userId: localStorage.getItem("userMasterId"), stepId: 6 } }
        // { params: { userId: 113, stepId: 6 } }
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

  // handleShowModal();
  const [workOrderId, setWorkOrderId] = useState("");

  const pushToProceedForPayment = () => {
    api
      .post(
        baseURLDBT + `service/updateCompletionStatusFromWeb`,
        {},
        { params: { id: workOrderId } }
      )
      .then((response) => {
        // setUserListData(response.data.content.userMaster);
        handleCloseModal();
        api
          .post(
            baseURLDBT + `service/triggerWorkFlowNextStep`,
            {},
            { params: { id: workOrderId } }
          )
          .then((response) => {
            // setUserListData(response.data.content.userMaster);
            sanctionOrderReport(response.data.content);
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
        stepId: 1,
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
                  type: "SUBSIDY_PRE_INSPECTION",
                },
              }
            )
            .then((response) => {
              if (response.data.content.documentResponses.length > 0) {
                //TODO  Need to Change here after response
              } else {
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
            Check Status
          </Button>
        </div>
      ),
      sortable: false,
      hide: "md",
    },
  ];

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
        borderTopColor: defaultThemes.default.divider.default,
      },
    },
    headCells: {
      style: {
        // '&:not(:last-of-type)': {
        backgroundColor: "#1e67a8",
        color: "#fff",
        borderStyle: "solid",
        bordertWidth: "1px",
        borderColor: defaultThemes.default.divider.default,
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
        borderColor: defaultThemes.default.divider.default,
        // },
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
            <Block.Title tag="h2">Sanction Order Verification List</Block.Title>
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
            // dense
          />
        </Card>
      </Block>
      <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>File Upload</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDocumentFile.length > 0 &&
            selectedDocumentFile.map((file, i) => (
              <div key={i}>
                <div className="d-flex justify-content-center">
                  <img
                    style={{ height: "300px", width: "300px" }}
                    src={file}
                    alt="Selected File"
                  />
                </div>
                {/* <div className="text-center">{file.documentMasterName}</div> */}
                <div className="text-center">{selectedDocumentFileName[i]}</div>
              </div>
            ))}
          <div className="gap-col">
            <ul className="d-flex align-items-center justify-content-center gap g-3">
              <li>
                {/* <Button type="button" variant="primary" onClick={postData}> */}
                <Button
                  type="button"
                  variant="primary"
                  onClick={pushToProceedForPayment}
                >
                  Proceed for Payment
                </Button>
              </li>
              {/* <li>
                <Button type="button" variant="secondary" onClick={clear}>
                  Cancel
                </Button>
              </li> */}
            </ul>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SanctionOrderVerification;
