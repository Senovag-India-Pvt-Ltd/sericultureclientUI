import { Card, Button, Row, Col, Form, Modal,Accordion } from "react-bootstrap";
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
import ViewAllApplication from "../services-module/application-component/ViewAllApplication";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function AllApplicationList() {
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 30;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, pageSize: countPerPage } };
  const [applicationDetails, setApplicationDetails] = useState([]);

  // const [data, setData] = useState({
  //   userMasterId: "",
  // });

  // const handleInputs = (e) => {
  //   // debugger;
  //   let { name, value } = e.target;
  //   setData({ ...data, [name]: value });
  // };

  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const [searchData, setSearchData] = useState({
    userMasterId: localStorage.getItem("userMasterId"),
    searchText: "",
    type: 4,
    pageNumber: page,
    pageSize: countPerPage,
  });


  // console.log("Nodo Batha antha", data);
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

  const handleInputsSearch = (e) => {
    const { name, value } = e.target;
    
    // If type is 4, set the financial year ID in searchData
    if (value == 4) {
      setSearchData((prev) => ({
        ...prev,
        [name]: value,
        searchText: data.financialYearMasterId, // Use the fetched financialYearMasterId
      }));
    } else {
      setSearchData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };
  // const handleInputsSearch = (e) => {
  //   const { name, value } = e.target;
  
  //   // Check if type is 4 (for financial year)
  //   if (name === "type" && value == 4) {
  //     // Reset the text to ensure correct financial year is selected later
  //     setSearchData((prev) => ({
  //       ...prev,
  //       [name]: value,
  //       text: "" // Reset text for a new financial year selection
  //     }));
  //   } else if (name === "type" && value !== 4) {
  //     // If not financial year, just set the type and reset the text
  //     setSearchData((prev) => ({
  //       ...prev,
  //       [name]: value,
  //       text: "" // Reset text if the type is not 4
  //     }));
  //   } else {
  //     // Set the value for other inputs, like the 'text' field
  //     setSearchData((prev) => ({
  //       ...prev,
  //       [name]: value
  //     }));
  //   }
  // };
  
  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });

   
    // Below code to Split Financial Year

    // if (e.target.name === "financialYearMasterId") {
    //   const selectedYearObject = financialyearListData.find(
    //     (year) => year.financialYearMasterId === parseInt(e.target.value)
    //   );
    //   if (selectedYearObject && selectedYearObject.financialYear) {
    //     const year = selectedYearObject.financialYear;
    //     const [fromDate, toDate] = year.split("-");
    //     setSearchData((prev) => ({ ...prev, year1: fromDate, year2: toDate }));
    //   }
    // }
  };

  // const getFinancialDefaultDetails = () => {
  //   api
  //     .get(baseURLMasterData + `financialYearMaster/get-is-default`)
  //     .then((response) => {
  //       setData((prev) => ({
  //         ...prev,
  //         financialYearMasterId: response.data.content.financialYearMasterId,
  //       }));
  //     })
  //     .catch((err) => {
  //       setData((prev) => ({
  //         ...prev,
  //         financialYearMasterId: "",
  //       }));
  //     });
  // };

  // useEffect(() => {
  //   getFinancialDefaultDetails();
  // }, []);

  // useEffect(() => {
  //   // debugger
  //   // const selectedYearObject = financialyearListData.find(
  //   //   (year) => year.financialYearMasterId === data.financialYearMasterId
  //   // );
  //   // // console.log("Master Master",selectedYearObject);
  //   // const year = selectedYearObject.financialYear;
  //   // const [fromDate, toDate] = year.split("-");
  //   // setSearchData((prev) => ({ ...prev, year1: fromDate, year2: toDate }));

  //   if (data.financialYearMasterId && financialyearListData.length > 0) {
  //     // debugger
  //     const selectedYearObject = financialyearListData.find(
  //       (year) => year.financialYearMasterId === data.financialYearMasterId
  //     );

  //     if (selectedYearObject && selectedYearObject.financialYear) {
  //       const year = selectedYearObject.financialYear;
  //       const [fromDate, toDate] = year.split("-");
  //       setSearchData((prev) => ({ ...prev, year1: fromDate, year2: toDate }));
  //     }
  //   }
  // }, [data.financialYearMasterId, financialyearListData]);

  // const handleSearchInputs = (e) => {
  //   let name = e.target.name;
  //   let value = e.target.value;
  //   if (e.target.name === "type") {
  //     setSearchData({ ...searchData, [name]: value, searchText: "" });
  //   } else {
  //     setSearchData({ ...searchData, [name]: value });
  //   }
  // };

  // const handleSchemeInputs = (e) => {
  //   let name = e.target.name;
  //   let value = e.target.value;
  //   if (name === "scheme") {
  //     setScheme({ ...scheme, [name]: value, subScheme: "" });
  //   }
  //   setScheme({ ...scheme, [name]: value });
  // };

   // Search
   const search = (e) => {
    api
      .post(baseURLDBT + `service/getAllApplicationsListForDbt`, {}, 
      { 
        params:{
          userMasterId: localStorage.getItem("userMasterId"),
            searchText: searchData.searchText,
            type: searchData.type,
            pageNumber: searchData.pageNumber,
            pageSize:searchData.pageSize,
        },
      }
      )
      .then((response) => {
        setListData(response.data.content);
      })
      .catch((err) => {
        setListData([]);
      });
  };

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
          searchText: response.data.content.financialYearMasterId // Pre-fill text with financial year
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
          baseURLDBT + `service/getAllApplicationsListForDbt`,
          {},{params:{..._params.params,userMasterId:localStorage.getItem("userMasterId")}}
        )
        .then((response) => {
          setListData(response.data.content);
          setTotalRows(response.data.totalRecords);
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
  

  // const [validatedDisplay, setValidatedDisplay] = useState(false);

  // const display = (event) => {
  //   const form = event.currentTarget;
  //   if (form.checkValidity() === false) {
  //     event.preventDefault();
  //     event.stopPropagation();
  //     setValidatedDisplay(true);
  //   } else {
  //     event.preventDefault();
  //     const sendData = {
  //       financialYearId: data.financialYearMasterId,
  //       schemeId: scheme.scheme,
  //       subSchemeId: scheme.subScheme,
  //       type: searchData.type,
  //       searchText: searchData.searchText,
  //       pageNumber: page,
  //       pageSize: countPerPage,
  //     };
  //     // const { text, select } = farmer;
  //     // let sendData;

  //     // if (select === "mobileNumber") {
  //     //   sendData = {
  //     //     mobileNumber: text,
  //     //   };
  //     // }
  //     // if (select === "fruitsId") {
  //     //   sendData = {
  //     //     fruitsId: text,
  //     //   };
  //     // }
  //     // if (select === "farmerNumber") {
  //     //   sendData = {
  //     //     farmerNumber: text,
  //     //   };
  //     // }

  //     // const { year1, year2, type, searchText } = searchData;

  //     setLoading(true);

  //     api
  //       .post(
  //         baseURLDBT + `service/getAllApplicationsListForDbt`,
  //         {},
  //         { params: sendData }
  //       )
  //       .then((response) => {
  //         setListData(response.data.content);
  //         const scApplicationFormIds = response.data.content.map(
  //           (item) => item.scApplicationFormId
  //         );
  //         setAllApplicationIds(scApplicationFormIds);
  //         setLoading(false);
  //       })
  //       .catch((err) => {
  //         setListData({});
  //         setLoading(false);
  //       });
  //   }
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
  
  const [data, setData] = useState({
    financialYearMasterId: "",
    year1: "",
    year2: ""
  });
  const [landData, setLandData] = useState({
    landId: "",
    talukId: "",
  });

  const handleRadioChange = (_id, tId) => {
    if (!tId) {
      tId = 0;
    }
    setLandData((prev) => ({ ...prev, landId: _id, talukId: tId }));
  };

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
  const postData = (event) => {
    const post = {
      applicationFormIds: applicationIds,
      applicationFormIdsNotSelected: unselectedApplicationIds,
      inspectorId: localStorage.getItem("userMasterId"),
    };
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      api
        .post(baseURLDBT + `service/updateApplicationStatus`, post)
        .then((response) => {
          if (response.data.content.errorCode) {
            saveError(response.data.content.error_description);
          } else if (response.data.content.error === true) {
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

  const clear = (e) => {
    e.preventDefault();
    window.location.reload();
    // setAllApplicationIds([]);
    // setUnselectedApplicationIds([]);
    // setAllApplicationIds([]);
  };

  // const getList = () => {
  //   const sendData = {
  //     financialYearId: data.financialYearMasterId,
  //     schemeId: scheme.scheme,
  //     subSchemeId: scheme.subScheme,
  //     type: searchData.type,
  //     searchText: searchData.searchText,
  //     pageNumber: page,
  //     pageSize: countPerPage,
  //   };
  //   setLoading(true);
  //   api
  //     .post(
  //       baseURLDBT + `service/getAllApplicationsListForDbt`,
  //       {},
  //       { params: sendData }
  //     )
  //     .then((response) => {
  //       setListData(response.data.content);
  //       // const scApplicationFormIds = response.data.content.map(
  //       //   (item) => item.scApplicationFormId
  //       // );
  //       // setAllApplicationIds(scApplicationFormIds);
  //       setTotalRows(response.data.totalRecords);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       setListData({});
  //       setLoading(false);
  //     });
  // };

  // useEffect(() => {
  //   getList();
  // }, [page]);

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


  console.log(allApplicationIds);

  // const [scSubSchemeDetailsListData, setScSubSchemeDetailsListData] = useState(
  //   []
  // );

  // const getSubSchemeList = () => {
  //   const response = api
  //     .get(baseURLMasterData + `scSubSchemeDetails/get-all`)
  //     .then((response) => {
  //       if (response.data.content.scSubSchemeDetails) {
  //         setScSubSchemeDetailsListData(
  //           response.data.content.scSubSchemeDetails
  //         );
  //       }
  //     })
  //     .catch((err) => {
  //       setScSubSchemeDetailsListData([]);
  //       // alert(err.response.data.errorMessages[0].message[0].message);
  //     });
  // };

  // useEffect(() => {
  //   getSubSchemeList();
  // }, []);

  const [scheme, setScheme] = useState({
    scheme: 0,
    subScheme: 0,
  });

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

  console.log("select scheme", scheme);

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
          handleShowModal();
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

  const handleEdit = (_id) => {
    navigate(`/seriui/service-application-edit/${_id}`);
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
      title: "Selected Application list will be proceeded for preinspection",
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
      title: "Attempt was not successful",
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
      name: "Sl.No",
      selector: (row,i) => row.serialNumber,
      cell: (row, i) => <span>{row.serialNumber}</span>,
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
      name: "ARN Number",
      selector: (row) => row.arn,
      cell: (row) => <span>{row.arn}</span>,
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
      name: "Sanction No.",
      selector: (row) => row.sanctionNo,
      cell: (row) => <span>{row.sanctionNo}</span>,
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
          {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleView(row.scApplicationFormId)}
          >
            View
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="ms-2"
            onClick={() => handleEdit(row.scApplicationFormId)}
          >
            Edit
          </Button>
          {/* <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.marketMasterId)}
            className="ms-2"
          >
            Delete
          </Button> */}
        </div>
      ),
      sortable: false,
      hide: "md",
      //   grow: 2,
    },
  ];

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


  return (
    <Layout title="Application List">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Application List</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
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
                                name="searchText"
                                value={searchData.searchText}
                                onChange={handleInputsSearch}
                                onBlur={() => handleInputsSearch}
                                // multiple
                                required
                                isInvalid={
                                  //  searchData.text === undefined ||
                                  searchData.searchText === "0"
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
                            name="searchText"
                            value={searchData.searchText}
                            onChange={handleInputsSearch}
                            onBlur={() => handleInputsSearch}
                            // multiple
                            required
                            isInvalid={
                            //  searchData.text === undefined ||
                              searchData.searchText === "0"
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
                   name="searchText"
                       value={searchData.searchText}
                       onChange={handleInputsSearch}
                       onBlur={() => handleInputsSearch}
                       // multiple
                       required
                       isInvalid={
                        //  searchData.text === undefined ||
                         searchData.searchText === "0"
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
                    name="searchText"
                    value={searchData.searchText}
                    onChange={handleInputsSearch}
                    type="searchText"
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
            //  title="Market List"
            tableClassName="data-table-head-light table-responsive"
            columns={ApplicationDataColumns}
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

      {/* // <Modal show={showModal} onHide={handleCloseModal} size="xl">
      //   <Modal.Header closeButton>
      //     <Modal.Title>View</Modal.Title>
      //   </Modal.Header>
      //   <Modal.Body>
      //     <ViewAllApplication details={applicationDetails} />
      //   </Modal.Body>
      // </Modal> */}
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
                  <td style={styles.ctstyle}>ARN Number:</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.arn || 'N/A'}</td>
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

        {/* {viewDetailsData?.documents?.length > 0 ? (
          viewDetailsData.documents.map((fileDocuments, index) => (
            <Accordion.Item eventKey={index + 1} key={index}>
              <Accordion.Header style={{ backgroundColor: "#0F6CBE",color:"white",fontWeight: "bold" }}
                        className="mb-2">Documents</Accordion.Header>
              <Accordion.Body>
                <table className="table small table-bordered">
                  <tbody>
                    <tr>
                      <td style={styles.ctstyle}>Document Name:</td>
                      <td>{fileDocuments.documentName || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Document Path:</td>
                      <td>{fileDocuments.documentPath || 'N/A'}</td>
                    </tr>

                    <tr>
                      <td style={styles.ctstyle}>Download Document:</td>
                      <td>
                        {selectedDocumentFile && (
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
                                onClick={() =>
                                  downloadFile(fileDocuments.documentPath)
                                }
                              >
                                Download File
                              </Button>
                            </>
                        )}
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
                   
                  </tbody>
                </table>
              </Accordion.Body>
            </Accordion.Item>
          ))
        ) : (
          <Accordion.Item eventKey="land">
            <Accordion.Header style={{ backgroundColor: "#0F6CBE",color:"white",fontWeight: "bold" }}
                        className="mb-2" >Documents</Accordion.Header>
            <Accordion.Body>No Documents Available</Accordion.Body>
          </Accordion.Item>
        )} */}

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
            <Accordion.Item eventKey={index + 2} key={index}>
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
    <Button variant="secondary" onClick={handleCloseModal}>
      Close
    </Button>
  </Modal.Footer>
</Modal>
    </Layout>
  );
}

export default AllApplicationList;
