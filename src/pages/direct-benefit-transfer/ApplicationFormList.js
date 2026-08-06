import { Card, Button, Row, Col, Form,Modal,Accordion} from "react-bootstrap";
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
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

const applicationFormListStyles = `
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
  .sh-form-wrap .form-label { font-weight: 600; color: #2b3a55; font-size: 13.5px; }
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
  .sh-modal-content { border-radius: 12px !important; border: 1px solid #e3ebf6 !important; overflow: hidden; }
  .sh-modal-content .modal-header { background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%); border-bottom: none; padding: 16px 22px; }
  .sh-modal-content .modal-header .btn-close { filter: brightness(0) invert(1); opacity: 0.85; }
  .sh-modal-content .modal-title { color: #ffffff; font-weight: 700; }
  .sh-modal-content .modal-body { padding: 22px 24px; }
  .sh-modal-content .btn-secondary {
    background: #ffffff; color: #e3496a; border: 1.5px solid #e3496a; border-radius: 8px; font-weight: 600;
  }
  .sh-swal-popup { border-radius: 14px !important; }
  .sh-swal-confirm { background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important; border-radius: 8px !important; font-weight: 600 !important; }
  .sh-swal-cancel { background: #ffffff !important; color: #c43257 !important; border: 1px solid #e3496a !important; border-radius: 8px !important; font-weight: 600 !important; }
`;

function ApplicationFormList() {
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 500;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };

  // Translation
  const {t} = useTranslation();

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
      customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm" },
    });
  };

  const deleteConfirm = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "It will delete permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm", cancelButton: "sh-swal-cancel" },
    }).then((result) => {
      if (result.value) {
        const response = api
          .delete(baseURL + `marketMaster/delete/${_id}`)
          .then((response) => {
            // deleteConfirm(_id);
            getList();
            Swal.fire({
              title: "Deleted",
              text: "You successfully deleted this record",
              icon: "success",
              customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm" },
            });
          })
          .catch((err) => {
            deleteError();
          });
      } else {
        console.log(result.value);
        Swal.fire({
          title: "Cancelled",
          text: "Your record is not deleted",
          icon: "info",
          customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm" },
        });
      }
    });
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
        minHeight: "38px",
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
        paddingTop: "6px",
        paddingBottom: "6px",
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

  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);


  const [viewDetailsData, setViewDetailsData] = useState({
    applicationDetails: [],
    landDetails: [],
    applicationTransactionDetails: [],
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
            landDetails: content.landDetailsResponses,
            applicationTransactionDetails: content.applicationTransactionResponses
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
      name: t("Sl.No"),
      selector: (row) => row.scApplicationFormId,
      cell: (row,i) => <span>{i+1}</span>,
      sortable: true,
      width: "80px",
      hide: "md",
    },
  
    {
      name: t("FRUITS ID"),
      selector: (row) => row.fruitsId,
      cell: (row) => <span>{row.fruitsId}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Beneficiary ID"),
      selector: (row) => row.beneficiaryId,
      cell: (row) => <span>{row.beneficiaryId}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("beneficiary_name"),
      selector: (row) => row.farmerFirstName,
      cell: (row) => <span>{row.farmerFirstName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("district"),
      selector: (row) => row.districtName,
      cell: (row) => <span>{row.districtName}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: t("taluk"),
      selector: (row) => row.talukName,
      cell: (row) => <span>{row.talukName}</span>,
      sortable: true,
      hide: "md",
    },
   
    {
      name: t("village"),
      selector: (row) => row.villageName,
      cell: (row) => <span>{row.villageName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Component Type"),
      selector: (row) => row.subSchemeName,
      cell: (row) => <span>{row.subSchemeName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name:t("Component"),
      selector: (row) => row.scComponentName,
      cell: (row) => <span>{row.scComponentName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name:t("Sanction Number"),
      selector: (row) => row.sanctionNumber,
      cell: (row) => <span>{row.sanctionNumber}</span>,
      sortable: true,
      hide: "md",
    },
  
    {
      name: t("Subsidy Amount"),
      selector: (row) => row.actualAmount,
      cell: (row) => <span>{row.actualAmount}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Application Status"),
      selector: (row) => row.applicationStatus,
      cell: (row) => <span>{row.applicationStatus}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Remarks"),
      selector: (row) => row.remarks,
      cell: (row) => <span>{row.remarks}</span>,
      sortable: true,
      hide: "md",
    },
   
    {
      name: t("Action"),
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
               {t("Edit")}
            </Button>
          )}
            <Button
              variant="primary"
              size="sm"
              className="ms-2"
              onClick={() => handleView(row.scApplicationFormId)}
            >
               {t("View")}
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
      <style>{applicationFormListStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2" className="sh-page-title">{t("Application List")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/dbt-application"
                  className="btn sh-cta-btn btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>{t("New Application")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/dbt-application"
                  className="btn sh-cta-btn d-none d-md-inline-flex"
                >
                  <Icon name="plus" />
                  <span>{t("New Application")}</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        <Card>
          <Row className="m-2">
            <Col>
              <Form.Group as={Row} className="form-group" id="fid">
                <Form.Label column sm={1}>
                  {t("Search By")}
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
                                <option value="">{t("Select Year")}</option>
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
                            <option value="">{t("Select Component")}</option>
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
                    <option value="">{t("Select Component Type")}</option>
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
                    placeholder={t("Search")}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {t("Field Value is Required")}
                  </Form.Control.Feedback>
                </Col>
              )}

                <Col sm={3}>
                  <Button type="button" variant="primary" onClick={search}>
                  {t("search")}
                  </Button>
                </Col>

              </Form.Group>
            </Col>
          </Row>
          </Card>
          </Block>

      <Block className='mt-3 sh-form-wrap'>
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


      {/* <Modal show={showModal} onHide={handleCloseModal} size="xl">
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
                          <td style={styles.ctstyle}>Beneficiary Name:</td>
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
</Modal> */}
<Modal show={showModal} onHide={handleCloseModal} size="xl" contentClassName="sh-modal-content">
  <Modal.Header closeButton>
    <Modal.Title>{t("View Details")}</Modal.Title>
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
                        className="mb-2">{t("Application Details")}</Accordion.Header>
          <Accordion.Body>
            <table className="table small table-bordered">
              <tbody>
                <tr>
                  <td style={styles.ctstyle}>{t("FRUITS ID")}</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.fruitsId || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>{t("beneficiary_name")}</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.farmerFirstName || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>{t("Sanction No.")}</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.sanctionNo || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>{t("Sub Scheme Name")}</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.subSchemeName || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>{t("Component")}</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.scComponentName || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>{t("Scheme Name")}</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.schemeName || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>{t("Sub Component")}</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.categoryName || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>{t("Scheme Amount")}</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.schemeAmount || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>{t("Period From")}</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.periodFrom || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>{t("Period To")}</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.periodTo || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>{t("district")}</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.districtName || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>{t("taluk")}</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.talukName || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>{t("village")}</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.villageName || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>{t("Application Status")}</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.applicationStatus || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>{t("Remarks")}</td>
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
                        className="mb-2">{t("Land Details")}</Accordion.Header>
              <Accordion.Body>
                <table className="table small table-bordered">
                  <tbody>
                    <tr>
                      <td style={styles.ctstyle}>{t("survey_number")}</td>
                      <td>{landDetail.surveyNumber || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("district")}</td>
                      <td>{landDetail.districtName || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("taluk")}</td>
                      <td>{landDetail.talukName || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("village")}</td>
                      <td>{landDetail.villageName || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Acre")}</td>
                      <td>{landDetail.acre || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("FGunta")}</td>
                      <td>{landDetail.fGunta || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Gunta")}</td>
                      <td>{landDetail.gunta || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Developed Area Acre")}</td>
                      <td>{landDetail.devAcre || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Developed Area F Gunta")}</td>
                      <td>{landDetail.devFGunta || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Developed Area Gunta")}</td>
                      <td>{landDetail.devGunta || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("hissa")}</td>
                      <td>{landDetail.hissa || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Land Code")}</td>
                      <td>{landDetail.landCode || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Main Owner No")}</td>
                      <td>{landDetail.mainOwnerNo || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Owner Name")}</td>
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
                        className="mb-2" >{t("Land Details")}</Accordion.Header>
            <Accordion.Body>No Land Details Available</Accordion.Body>
          </Accordion.Item>
        )}

        <Accordion.Item eventKey="transaction">
  <Accordion.Header style={{ backgroundColor: "#0F6CBE",color:"white",fontWeight: "bold" }}
                        className="mb-2">{t("Application Transaction Details")}</Accordion.Header>
  <Accordion.Body>
    <div style={{ overflowX: 'auto' }}>
      <table className="table small table-bordered" style={{ maxWidth: '100%', tableLayout: 'fixed' }}>
        <thead style={styles.headerStyle}>
          <tr>
            <th style={{ width: '10%' }}>{t("FRUITS ID")}</th>
            <th style={{ width: '10%' }}>{t("Beneficiary ID")}</th>
            <th style={{ width: '10%' }}>{t("Scheme Amount")}</th>
            <th style={{ width: '10%' }}>{t("Sanction No.")}</th>
            <th style={{ width: '10%' }}>{t("Financial Year")}</th>
            <th style={{ width: '10%' }}>{t("Payment Mode")}</th>
            <th style={{ width: '10%' }}>{t("File Name")}</th>
            <th style={{ width: '10%' }}>{t("DBT Push Type")}</th>
            <th style={{ width: '10%' }}>{t("Status")}</th>
            <th style={{ width: '10%' }}>{t("Remarks")}</th>
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
    <Button variant="secondary" onClick={handleCloseModal}>
      {t("Close")}
    </Button>
  </Modal.Footer>
</Modal>
    </Layout>
  );
}

export default ApplicationFormList;
