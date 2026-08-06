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

const preInspectionStyles = `
  .sh-page-header {
    padding: 20px 24px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border-radius: 12px;
    border: none;
    box-shadow: 0 6px 18px rgba(30, 103, 168, 0.22);
    margin-bottom: 22px;
  }
  .sh-page-title { margin-bottom: 4px; color: #ffffff !important; font-weight: 700; letter-spacing: 0.2px; }
  .sh-cta-btn {
    background: #ffffff; color: #1e67a8 !important; border: none;
    box-shadow: 0 4px 12px rgba(12, 40, 68, 0.25); font-weight: 700; padding: 8px 18px;
    border-radius: 8px; transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
  }
  .sh-cta-btn:hover { background: #eef6ff; color: #1e67a8 !important; transform: translateY(-1px); box-shadow: 0 6px 16px rgba(12, 40, 68, 0.32); }
  .sh-form-wrap { background: #eef2f8; border-radius: 14px; padding: 18px; }
  .sh-form-wrap .card { border: none; border-radius: 12px !important; box-shadow: 0 4px 14px rgba(30, 103, 168, 0.1); overflow: hidden; }
  .sh-form-wrap .form-control, .sh-form-wrap .form-select {
    border-radius: 8px; border: 1px solid #dbe4f0; padding: 9px 12px; font-size: 13.5px;
  }
  .sh-form-wrap .form-control:focus, .sh-form-wrap .form-select:focus {
    border-color: #3b8dd6; box-shadow: 0 0 0 0.2rem rgba(59, 141, 214, 0.15);
  }
  .sh-form-wrap .btn-primary {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important; border: none !important;
    font-weight: 600; border-radius: 8px; transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-form-wrap .btn-primary:not(:disabled):hover { transform: translateY(-1px); box-shadow: 0 6px 14px rgba(30, 103, 168, 0.25); }
  .sh-swal-popup { border-radius: 14px !important; }
  .sh-swal-confirm { background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important; border-radius: 8px !important; font-weight: 600 !important; }
  .sh-swal-cancel { background: #ffffff !important; color: #c43257 !important; border: 1px solid #e3496a !important; border-radius: 8px !important; font-weight: 600 !important; }
`;

const PreInspection = () => {
  const [helpDeskFaq, setHelpDeskFaq] = useState({
    text: "",
    searchBy: "hdQuestionName",
  });

  const [data, setData] = useState({
    userMasterId: "",
  });

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
        // { params: { userId: 27, stepId: 1 } }
        { params: { userId: localStorage.getItem("userMasterId"), stepId: 1 } }
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

  const assign = (workFlowId) => {
    // console.log(workFlowId);
    // const postData = {
    //     requestType: "sasa",
    //     requestTypeId: 100,
    //     userMasterId: data.userMasterId,
    //   };

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
          customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm" },
        });
        getList();
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
    //       })
    //       .catch((err) => {
    //         // setUserListData([]);
    //       });
    //   })
    //   .catch((err) => {
    //     // setUserListData([]);
    //   });
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
      customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm" },
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
      customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm" },
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
      name: "action",
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
          <Button
            variant="primary"
            size="sm"
            onClick={() => assign(row.workFlowId)}
            disabled={data.userMasterId ? false : true}
          >
            Assign
          </Button>
        </div>
      ),
      sortable: false,
      hide: "md",
    },
  ];

  const customStyles = {
    table: {
      style: {
        borderRadius: "12px",
        boxShadow: "0 4px 14px rgba(30, 103, 168, 0.1)",
        overflow: "hidden",
      },
    },
    headRow: {
      style: {
        background: "linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%)",
        minHeight: "44px",
      },
    },
    rows: {
      style: {
        minHeight: "45px",
        fontSize: "13.5px",
        borderBottom: "1px solid #eef2f8",
      },
      highlightOnHoverStyle: {
        backgroundColor: "#f3f8fd",
        transitionDuration: "0.15s",
      },
      stripedStyle: {
        backgroundColor: "#f8fafc",
      },
    },
    headCells: {
      style: {
        backgroundColor: "transparent",
        color: "#fff",
        fontWeight: 700,
        fontSize: "12.5px",
        textTransform: "uppercase",
        letterSpacing: "0.3px",
        paddingLeft: "12px",
        paddingRight: "12px",
      },
    },
    cells: {
      style: {
        paddingLeft: "12px",
        paddingRight: "12px",
      },
    },
    pagination: {
      style: {
        borderTop: "1px solid #eef2f8",
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
      <style>{preInspectionStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2" className="sh-page-title">Pre-Inspection List</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/application-dashboard"
                  className="btn sh-cta-btn btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/application-dashboard"
                  className="btn sh-cta-btn d-none d-md-inline-flex"
                >
                  <Icon name="plus" />
                  <span>Dashboard</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
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

      {/* <div className="gap-col mt-1">
        <ul className="d-flex align-items-center justify-content-center gap g-3">
          <li>
            <Button type="submit" variant="primary" onClick={postData}>
              Save
            </Button>
          </li>
          <li>
            <Button type="button" variant="secondary" onClick={(e) => clear(e)}>
              Cancel
            </Button>
          </li>
        </ul>
      </div> */}
    </div>
  );
};

export default PreInspection;
