import { Card, Button, Row, Col, Form,Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon } from "../../components";
import DataTable, { defaultThemes } from "react-data-table-component";
import Swal from "sweetalert2";
import { createTheme } from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import React from "react";
import DatePicker from "react-datepicker";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import api from "../../services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION_FRUITS;
const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function DbtPushedList() {
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 500;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };

  const [addressDetails, setAddressDetails] = useState({
    districtId: 0,
    talukId: 0,
    financialYearMasterId:0,
  });

  
  const [data, setData] = useState({
    financialYearMasterId: "",
    scHeadAccountId: "",
    scSchemeDetailsId: "",
    scSubSchemeDetailsId: "",
    scCategoryId: "",
    scComponentId: "",
  });

 
  const [period, setPeriod] = useState({
    periodFrom: new Date(),
    periodTo: new Date(),
  });

  // To get District
  const [districtListData, setDistrictListData] = useState([]);

  const getDistrictList = () => {
    api
      .get(baseURL + `district/get-all`)
      .then((response) => {
        if (response.data.content.district) {
          setDistrictListData(response.data.content.district);
        }
      })
      .catch((err) => {
        setDistrictListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    getDistrictList();
  }, []);
 

  // to get taluk
  const [talukListData, setTalukListData] = useState([]);

  const getTalukList = (_id) => {
    api
      .get(baseURL + `taluk/get-by-district-id/${_id}`)
      .then((response) => {
        if (response.data.content.taluk) {
          setTalukListData(response.data.content.taluk);
        } else {
          setTalukListData([]);
        }
      })
      .catch((err) => {
        setTalukListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (addressDetails.districtId) {
      getTalukList(addressDetails.districtId);
    }
  }, [addressDetails.districtId]);

  const handleInputsaddress = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setAddressDetails({ ...addressDetails, [name]: value });
  };

  const handleInputsSearch = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setSearchData({ ...searchData, [name]: value });
  };

   // Search
   const search = (e) => {
    api
      .post(
        baseURLDBT + `service/getDbtTscStatusByList`,
        {},
        {
          params: {
            districtId: addressDetails.districtId,
            talukId: addressDetails.talukId,
            financialYearMasterId: addressDetails.financialYearMasterId,
            userMasterId: localStorage.getItem("userMasterId"),
            text: searchData.text,
            type: searchData.type,
            displayAllRecords: true,
            // status:
            // status: "DBT PUSHED",
            // status: "REJECTED BY ADS",

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

  

  const [applicationIds, setApplicationIds] = useState([]);
  const [unselectedApplicationIds, setUnselectedApplicationIds] = useState([]);
  const [allApplicationIds, setAllApplicationIds] = useState([]);

  console.log(applicationIds);

  
 
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
 
  const getList = () => {
    setLoading(true);
    api
      .post(
        baseURLDBT + `service/getDbtTscStatusByList`,
        {},
        {
          params: {
            userMasterId: localStorage.getItem("userMasterId"),
            displayAllRecords: true,
            // status: "DBT PUSHED",
            // status: "REJECTED BY ADS",


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

  const exportCsv = (e) => {
    api
      .post(
        baseURLDBT + `service/dbt-pushed-list-report`,
        {},
        {
          params: {
            districtId: addressDetails.districtId,
            talukId: addressDetails.talukId,
            userMasterId: localStorage.getItem("userMasterId"),
            text: searchData.text,
            type: searchData.type,
            displayAllRecords: true,
          },
          responseType: 'blob',
          headers: {
            accept: "text/csv",
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        const blob = new Blob([response.data], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `dbt_pushed_status_report.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
      })
      .catch((err) => {
        Swal.fire({
          icon: "warning",
          title: "No record found!!!",
        });
      });
}; 


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
  // const handleView = (_id) => {
  //   navigate(`/seriui/market-view/${_id}`);
  // };

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
    text: "",
    type: 0,
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

  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
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

  // const customStyles = {
  //   header: {
  //     style: {
  //       minHeight: "56px",
  //     },
  //   },
  //   headRow: {
  //     style: {
  //       borderTopStyle: "solid",
  //       borderTopWidth: "1px",
  //       // borderTop:"none",
  //       // borderTopColor: defaultThemes.default.divider.default,
  //       borderColor: "black",
  //     },
  //   },
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
  //       // borderRightWidth: "3px",
  //       borderWidth: "1px",
  //       padding: "10px",
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
      name: "Financial Year",
      selector: (row) => row.financialYear,
      cell: (row) => <span>{row.financialYear}</span>,
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
      name: "Fruits Id",
      selector: (row) => row.fruitsId,
      cell: (row) => <span>{row.fruitsId}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Sanction Number",
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
      name: "Beneficiary Id",
      selector: (row) => row.beneficiaryId,
      cell: (row) => <span>{row.beneficiaryId}</span>,
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
   

    // {
    //   name: "State",
    //   selector: (row) => row.stateName,
    //   cell: (row) => <span>{row.stateName}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
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
    // {
    //   name: "Action",
    //   cell: (row) => (
    //     <text style={{ color: "green", fontWeight: "bold" }}>Successfull</text>
    //   ),
    //   sortable: true,
    //   hide: "md",
    // },
    {
      name: "Application Status",
      selector: (row) => row.applicationStatus,
      cell: (row) => (
        <span style={{ color: "green", fontWeight: "bold" }}>
          {row.applicationStatus}
        </span>
      ),
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
            onClick={() => handleView(row.scApplicationFormId)}
            className="ms-1"
          >
            View
          </Button>   
        </>
      ),
      sortable: true,
      hide: "md",
      // grow: 2,
    },
  ];

  return (
    <Layout title="DBT Pushed List">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">DBT Pushed List</Block.Title>
          </Block.HeadContent>
          
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
       
        <Card className="mt-1">
        <Row className="m-2">
            <Col>
              <Form.Group as={Row} className="form-group" id="fid">
                <Form.Label column sm={1}>
                  Search By
                </Form.Label>
                <Col sm={2}>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="type"
                      value={searchData.type}
                      onChange={handleInputsSearch}
                      style={{ width: "100%", marginLeft: "-14%" }}
                    >
                      <option value="0">All</option>
                      <option value="1">Fruits Id</option>
                      <option value="2">Beneficiary Id</option>
                      <option value="3">Application Status</option>
                      <option value="4">Component</option>
                      <option value="5">Component Type</option>
                    </Form.Select>
                  </div>
                </Col>

                {(Number(searchData.type) === 3)?(
                 <Col sm={2} lg={2}>
                 <Form.Group className="form-group ">
                   <div className="form-control-wrap">
                     <Form.Select
                       name="text"
                       value={searchData.text}
                       onChange={handleInputsSearch}
                       onBlur={() => handleInputsSearch}
                       >
                         {/* <option value="0">All</option> */}
                      <option value=" ">Select Status</option> 
                       <option value="DBT PUSHED">DBT PUSHED</option>
                      <option value="REJECTED BY ADS">REJECTED BY ADS</option>
                      <option value="ACKNOWLEDGEMENT FAILED">ACKNOWLEDGEMENT FAILED</option>
                      <option value="ACKNOWLEDGEMENT SUCCESS">ACKNOWLEDGEMENT SUCCESS</option>
                      <option value="SUBSIDY SANCTIONED">"SUBSIDY SANCTIONED"</option> 
                     
                       {/* // multiple
                       required
                       isInvalid={
                        //  searchData.text === undefined ||
                         searchData.text === "0"
                       }
                     >
                       <option value="">Select Status</option>
                       {statusListData && statusListData.map((list) => (
                         <option
                           key={list.statusList}
                           value={list.statusList}
                         >
                           {list.statusList}
                         </option>
                       ))} */}
                     </Form.Select>
                     {/* <Form.Control.Feedback type="invalid">
                       Status is required
                     </Form.Control.Feedback> */}
                   </div>
                 </Form.Group>
               </Col> 
               ) : Number(searchData.type) === 4 ? (
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
                </Col>)}
                </Form.Group>
                </Col>               
          </Row>


          <Row className="m-2">
            <Col>
              <Form.Group as={Row} className="form-group" id="fid">
                <Form.Label column sm={1}>
                  District
                </Form.Label>
                <Col sm={2}>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="districtId"
                      value={addressDetails.districtId}
                      onChange={handleInputsaddress}
                      style={{ width: "100%", marginLeft: "-14%" }}
                    >
                      <option value="0">Select District</option>
                      {districtListData.map((list) => (
                        <option key={list.districtId} value={list.districtId}>
                          {list.districtName}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Col>

                <Form.Label column sm={1}>
                  Taluk 
                </Form.Label>
                <Col sm={2}>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="talukId"
                      value={addressDetails.talukId}
                      onChange={handleInputsaddress}
                      // style={{ marginLeft: "-14%" }}
                      style={{ width: "100%", marginLeft: "-14%" }}
                    >
                      <option value="0">Select Taluk</option>
                      {talukListData.map((list) => (
                        <option key={list.talukId} value={list.talukId}>
                          {list.talukName}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Col>
                
                <Form.Label column sm={1}>
                  Financial Year
                </Form.Label>
                <Col sm={2  }>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="financialYearMasterId"
                      value={addressDetails.financialYearMasterId}
                      onChange={handleInputsaddress}
                      style={{ marginLeft: "-14%" }}
                    >
                      <option value="0">Select Financial Year</option>
                      {financialyearListData.map((list) => (
                        <option key={list.financialYearMasterId} value={list.financialYearMasterId}>
                          {list.financialYear}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Col>
               

                <Col sm={1}>
                  <Button type="button" variant="primary" onClick={search}>
                    Search
                  </Button>
                </Col>
                <Col sm={1}>
              <Button type="button" variant="primary" onClick={exportCsv}>
                Export
              </Button>
            </Col>
            </Form.Group>
            </Col>
          </Row>

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
                          <td style={styles.ctstyle}>Farmer Name:</td>
                          <td>{detail.farmerFirstName}</td>
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
                          <td style={styles.ctstyle}>Application Status:</td>
                          <td>{detail.applicationStatus}</td>
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

export default  DbtPushedList;
