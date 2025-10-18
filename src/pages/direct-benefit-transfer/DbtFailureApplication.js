import {
  Card,
  Button,
  Row,
  Col,
  Form,
  Modal,
  Accordion,
} from "react-bootstrap";
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
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION_FRUITS;
const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function DbtFailureApplication() {
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 500;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };

  const [addressDetails, setAddressDetails] = useState({
    districtId: 0,
    talukId: 0,
    hobliId: 0,
    villageId: 0,
    scCategoryId: 0,
  });

  // Translation
  const { t } = useTranslation();

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
    year1: "",
    year2: "",
  });

  const [farmer, setFarmer] = useState({
    text: "",
    select: "mobileNumber",
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

  // to get hobli
  const [hobliListData, setHobliListData] = useState([]);

  const getHobliList = (_id) => {
    const response = api
      .get(baseURL + `hobli/get-by-taluk-id/${_id}`)
      .then((response) => {
        if (response.data.content.hobli) {
          setHobliListData(response.data.content.hobli);
        }
      })
      .catch((err) => {
        setHobliListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (addressDetails.talukId) {
      getHobliList(addressDetails.talukId);
    }
  }, [addressDetails.talukId]);

  // to get village
  const [villageListData, setVillageListData] = useState([]);

  const getVillageList = (_id) => {
    api
      .get(baseURL + `village/get-by-hobli-id/${_id}`)
      .then((response) => {
        setVillageListData(response.data.content.village);
      })
      .catch((err) => {
        setVillageListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (addressDetails.hobliId) {
      getVillageList(addressDetails.hobliId);
    }
  }, [addressDetails.hobliId]);

  const handleInputsaddress = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setAddressDetails({ ...addressDetails, [name]: value });
  };

  // const handleInputsSearch = (e) => {
  //   let name = e.target.name;
  //   let value = e.target.value;
  //   setSearchData({ ...searchData, [name]: value });
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
        [name]: value,
      }));
    }
  };

  // Search
  const search = (e) => {
    api
      .post(
        baseURLDBT + `service/getDbtFailureByList`,
        {},
        {
          params: {
            districtId: addressDetails.districtId,
            talukId: addressDetails.talukId,
            hobliId: addressDetails.hobliId,
            villageId: addressDetails.villageId,
            userMasterId: localStorage.getItem("userMasterId"),
            text: searchData.text,
            type: searchData.type,
            scCategoryId: searchData.scCategoryId,
            displayAllRecords: true,
            status: "",
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

  const handleCategoryChange = (e) => {
  const value = e.target.value;
  setSearchData((prev) => ({
    ...prev,
    scCategoryId: value,
  }));
  setAddressDetails((prev) => ({
    ...prev,
    scCategoryId: value,
  }));
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
      paymentMode: 1,
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
      paymentMode: 1,
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
  };

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
          year2: toDate,
        });
        setSearchData((prev) => ({
          ...prev,
          text: response.data.content.financialYearMasterId, // Pre-fill text with financial year
        }));
      })
      .catch((err) => {
        setData({
          financialYearMasterId: "",
          year1: "",
          year2: "",
        });
      });
  };

  const getList = () => {
    setLoading(true);
    api
      .post(
        baseURLDBT + `service/getDbtFailureByList`,
        {},
        {
          params: {
            userMasterId: localStorage.getItem("userMasterId"),
            displayAllRecords: true,
            status: "",
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
    getFinancialDefaultDetails();
    getList();
  }, [page]);

  // const exportCsv = (e) => {
  //   api
  //     .post(
  //       baseURLDBT + `service/dbt-failure-list-report`,
  //       {},
  //       {
  //         params: {
  //           districtId: addressDetails.districtId,
  //           talukId: addressDetails.talukId,
  //           hobliId: addressDetails.hobliId,
  //           villageId: addressDetails.villageId,
  //           userMasterId: localStorage.getItem("userMasterId"),
  //           text: searchData.text,
  //           type: searchData.type,
  //           scCategoryId: searchData.scCategoryId,
  //           displayAllRecords: true,
  //           status: "",
  //         },
  //         responseType: "blob",
  //         headers: {
  //           accept: "text/csv",
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       const blob = new Blob([response.data], { type: "text/csv" });
  //       const link = document.createElement("a");
  //       link.href = window.URL.createObjectURL(blob);
  //       link.download = `dbt_status_report.csv`;
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //       window.URL.revokeObjectURL(link.href);
  //     })
  //     .catch((err) => {
  //       Swal.fire({
  //         icon: "warning",
  //         title: "No record found!!!",
  //       });
  //     });
  // };

  // // console.log(allApplicationIds);

  const exportCsv = (e) => {
  // ✅ Use null-safe defaults so API never gets undefined or null
  const params = {
    districtId: addressDetails?.districtId || 0,
    talukId: addressDetails?.talukId || 0,
    hobliId: addressDetails?.hobliId || 0,
    villageId: addressDetails?.villageId || 0,
    userMasterId: localStorage.getItem("userMasterId") || 0,
    text: searchData?.text ? searchData.text : null,
    type: searchData?.type || 0,
    scCategoryId: searchData?.scCategoryId || 0,
    displayAllRecords: true,
    status: "",
  };

  api
    .post(
      baseURLDBT + `service/dbt-failure-list-report`,
      {}, // empty body
      {
        params,
        responseType: "blob",
        headers: {
          accept: "text/csv",
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      if (response && response.data) {
        const blob = new Blob([response.data], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `dbt_failure_report.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
      } else {
        Swal.fire({
          icon: "warning",
          title: "No records found!",
        });
      }
    })
    .catch((err) => {
      Swal.fire({
        icon: "warning",
        title: "No record found or server error!",
      });
    });
};


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
    // year1: "",
    // year2: "",
    type: 5,
    searchText: "",
    scCategoryId: 0,
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
            applicationTransactionDetails:
              content.applicationTransactionResponses,
          });
        }
      })
      .catch((err) => {
        // saveError(err.response.data.validationErrors);
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
      name: t("Sl.No"),
      selector: (row) => row.scApplicationFormId,
      cell: (row, i) => <span>{i + 1}</span>,
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
      name: t("farmer_name"),
      selector: (row) => row.farmerFirstName,
      cell: (row) => <span>{row.farmerFirstName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Category"),
      selector: (row) => row.categoryName,
      cell: (row) => <span>{row.categoryName}</span>,
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
      name: t("Component"),
      selector: (row) => row.scComponentName,
      cell: (row) => <span>{row.scComponentName}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: t("Sanction Number"),
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
      cell: (row) => (
        <span style={{ color: "green", fontWeight: "bold" }}>
          {row.applicationStatus}
        </span>
      ),
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
    // {
    //   name: t("Action"),
    //   cell: (row) => (
    //     <>
    //       <Button
    //         variant="primary"
    //         size="sm"
    //         onClick={() => handleView(row.scApplicationFormId)}
    //         className="ms-1"
    //       >
    //         {t("View")}
    //       </Button>
    //     </>
    //   ),
    //   sortable: true,
    //   hide: "md",
    //   // grow: 2,
    // },
  ];

  return (
  <Layout title="DBT Failure Application Report">
    <Block.Head>
      <Block.HeadBetween>
        <Block.HeadContent>
          <Block.Title tag="h2">{t("DBT Failure Application Report")}</Block.Title>
        </Block.HeadContent>
      </Block.HeadBetween>
    </Block.Head>

    <Block className="mt-n4">
      <Card className="mt-1">
        {/* First Row: Search By and District/Taluk */}
        <Row className="m-4">
          {/* Search By */}
          <Col sm={3}>
            <Form.Group className="form-group mt-n4">
              <Form.Label>{t("Search By")}</Form.Label>
              <Form.Select
                name="type"
                value={searchData.type}
                onChange={handleInputsSearch}
              >
                <option value="2">{t("FRUITS ID")}</option>
                <option value="4">{t("Beneficiary ID")}</option>
                <option value="5">{t("Financial Year")}</option>
                <option value="6">{t("Component")}</option>
                <option value="7">{t("Component Type")}</option>
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Conditional Input/Select */}
          <Col sm={3}>
            <Form.Group className="form-group mt-n4">
              <Form.Label>&nbsp;</Form.Label>
              <div className="form-control-wrap">
                {Number(searchData.type) === 5 ? (
                  <Form.Select
                    name="text"
                    value={searchData.text}
                    onChange={handleInputsSearch}
                    isInvalid={searchData.text === "0"}
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
                ) : Number(searchData.type) === 6 ? (
                  <Form.Select
                    name="text"
                    value={searchData.text}
                    onChange={handleInputsSearch}
                    isInvalid={searchData.text === "0"}
                  >
                    <option value="">{t("Select Component")}</option>
                    {scComponentListData.map((list) => (
                      <option key={list.scComponentId} value={list.scComponentId}>
                        {list.scComponentName}
                      </option>
                    ))}
                  </Form.Select>
                ) : Number(searchData.type) === 7 ? (
                  <Form.Select
                    name="text"
                    value={searchData.text}
                    onChange={handleInputsSearch}
                    isInvalid={searchData.text === "0"}
                  >
                    <option value="">{t("Select Component Type")}</option>
                    {scSubSchemeDetailsListData.map((list) => (
                      <option
                        key={list.scSubSchemeDetailsId}
                        value={list.scSubSchemeDetailsId}
                      >
                        {list.subSchemeName}
                      </option>
                    ))}
                  </Form.Select>
                ) : (
                  <Form.Control
                    id="fruitsId"
                    name="text"
                    value={searchData.text}
                    onChange={handleInputsSearch}
                    type="text"
                    placeholder="Search"
                    required
                  />
                )}
              </div>
            </Form.Group>
          </Col>

          {/* District */}
          <Col sm={3}>
            <Form.Group className="form-group mt-n4">
              <Form.Label>{t("District")}</Form.Label>
              <Form.Select
                name="districtId"
                value={addressDetails.districtId}
                onChange={handleInputsaddress}
              >
                <option value="0">{t("select_district")}</option>
                {districtListData.map((list) => (
                  <option key={list.districtId} value={list.districtId}>
                    {list.districtName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Taluk */}
          <Col sm={3}>
            <Form.Group className="form-group mt-n4">
              <Form.Label>{t("Taluk")}</Form.Label>
              <Form.Select
                name="talukId"
                value={addressDetails.talukId}
                onChange={handleInputsaddress}
              >
                <option value="0">{t("select_taluk")}</option>
                {talukListData.map((list) => (
                  <option key={list.talukId} value={list.talukId}>
                    {list.talukName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Second Row: Hobli, Village, Sub Component, Search & Export */}
        <Row className="m-4 mt-2">
          {/* Hobli */}
          <Col sm={3}>
            <Form.Group className="form-group mt-n4">
              <Form.Label>{t("Hobli")}</Form.Label>
              <Form.Select
                name="hobliId"
                value={addressDetails.hobliId}
                onChange={handleInputsaddress}
              >
                <option value="0">{t("select_hobli")}</option>
                {hobliListData.map((list) => (
                  <option key={list.hobliId} value={list.hobliId}>
                    {list.hobliName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Village */}
          <Col sm={3}>
            <Form.Group className="form-group mt-n4">
              <Form.Label>{t("Village")}</Form.Label>
              <Form.Select
                name="villageId"
                value={addressDetails.villageId}
                onChange={handleInputsaddress}
              >
                <option value="0">{t("select_village")}</option>
                {villageListData.map((list) => (
                  <option key={list.villageId} value={list.villageId}>
                    {list.villageName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Sub Component */}
          <Col sm={3}>
            <Form.Group className="form-group mt-n4">
              <Form.Label>{t("Sub Component")}</Form.Label>
              <Form.Select
                name="scCategoryId"
                value={searchData.scCategoryId}
                onChange={handleInputsSearch}
                isInvalid={
                  searchData.scCategoryId === undefined ||
                  searchData.scCategoryId === "0"
                }
              >
                <option value="">{t("Select Category")}</option>
                {scCategoryListData.map((list) => (
                  <option key={list.scCategoryId} value={list.scCategoryId}>
                    {list.categoryName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Buttons */}
          <Col sm={3} className="d-flex align-items-end gap-2 mt-n4">
            <Button type="button" variant="primary" onClick={search}>
              {t("Search")}
            </Button>
            <Button type="button" variant="primary" onClick={exportCsv}>
              {t("Export")}
            </Button>
          </Col>
        </Row>
      </Card>
    </Block>
  {/* </Layout>
); */}


      <Block className="mt-3">
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

        {/* <Form
          noValidate
          validated={validated}
          onSubmit={postData}
          className="mt-1"
        >
          <div className="gap-col mt-1">
            <ul className="d-flex align-items-center justify-content-center gap g-3">
              <li>
                <Button type="submit" variant="primary" onClick={postData}>
                  Save
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
        </Form> */}
      </Block>

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
</Modal>  */}
      <Modal show={showModal} onHide={handleCloseModal} size="xl">
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
                <Accordion.Header
                  style={{
                    backgroundColor: "#0F6CBE",
                    color: "white",
                    fontWeight: "bold",
                  }}
                  className="mb-2"
                >
                  {t("Application Details")}
                </Accordion.Header>
                <Accordion.Body>
                  <table className="table small table-bordered">
                    <tbody>
                      <tr>
                        <td style={styles.ctstyle}>{t("FRUITS ID")}</td>
                        <td>
                          {viewDetailsData?.applicationDetails?.[0]?.fruitsId ||
                            "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("farmer_name")}</td>
                        <td>
                          {viewDetailsData?.applicationDetails?.[0]
                            ?.farmerFirstName || "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Sanction No.")}</td>
                        <td>
                          {viewDetailsData?.applicationDetails?.[0]
                            ?.sanctionNo || "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Sub Scheme Name")}</td>
                        <td>
                          {viewDetailsData?.applicationDetails?.[0]
                            ?.subSchemeName || "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Component")}</td>
                        <td>
                          {viewDetailsData?.applicationDetails?.[0]
                            ?.scComponentName || "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Scheme Name")}</td>
                        <td>
                          {viewDetailsData?.applicationDetails?.[0]
                            ?.schemeName || "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Sub Component")}</td>
                        <td>
                          {viewDetailsData?.applicationDetails?.[0]
                            ?.categoryName || "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Scheme Amount")}</td>
                        <td>
                          {viewDetailsData?.applicationDetails?.[0]
                            ?.schemeAmount || "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Period From")}</td>
                        <td>
                          {viewDetailsData?.applicationDetails?.[0]
                            ?.periodFrom || "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Period To")}</td>
                        <td>
                          {viewDetailsData?.applicationDetails?.[0]?.periodTo ||
                            "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("district")}</td>
                        <td>
                          {viewDetailsData?.applicationDetails?.[0]
                            ?.districtName || "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("taluk")}</td>
                        <td>
                          {viewDetailsData?.applicationDetails?.[0]
                            ?.talukName || "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("village")}</td>
                        <td>
                          {viewDetailsData?.applicationDetails?.[0]
                            ?.villageName || "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          {t("Application Status")}
                        </td>
                        <td>
                          {viewDetailsData?.applicationDetails?.[0]
                            ?.applicationStatus || "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Remarks")}</td>
                        <td>
                          {viewDetailsData?.applicationDetails?.[0]?.remarks ||
                            "N/A"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Accordion.Body>
              </Accordion.Item>

              {/* Land Details Accordion */}
              {viewDetailsData?.landDetails?.length > 0 ? (
                viewDetailsData.landDetails.map((landDetail, index) => (
                  <Accordion.Item eventKey={index + 1} key={index}>
                    <Accordion.Header
                      style={{
                        backgroundColor: "#0F6CBE",
                        color: "white",
                        fontWeight: "bold",
                      }}
                      className="mb-2"
                    >
                      {t("Land Details")}
                    </Accordion.Header>
                    <Accordion.Body>
                      <table className="table small table-bordered">
                        <tbody>
                          <tr>
                            <td style={styles.ctstyle}>{t("survey_number")}</td>
                            <td>{landDetail.surveyNumber || "N/A"}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>{t("district")}</td>
                            <td>{landDetail.districtName || "N/A"}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>{t("taluk")}</td>
                            <td>{landDetail.talukName || "N/A"}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>{t("village")}</td>
                            <td>{landDetail.villageName || "N/A"}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>{t("Acre")}</td>
                            <td>{landDetail.acre || "N/A"}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>{t("FGunta")}</td>
                            <td>{landDetail.fGunta || "N/A"}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>{t("Gunta")}</td>
                            <td>{landDetail.gunta || "N/A"}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>
                              {t("Developed Area Acre")}
                            </td>
                            <td>{landDetail.devAcre || "N/A"}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>
                              {" "}
                              {t("Developed Area F Gunta")}
                            </td>
                            <td>{landDetail.devFGunta || "N/A"}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>
                              {t("Developed Area Gunta")}
                            </td>
                            <td>{landDetail.devGunta || "N/A"}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>{t("hissa")}</td>
                            <td>{landDetail.hissa || "N/A"}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>{t("Land Code")}</td>
                            <td>{landDetail.landCode || "N/A"}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>{t("Main Owner No")}</td>
                            <td>{landDetail.mainOwnerNo || "N/A"}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>{t("owner_name")}</td>
                            <td>{landDetail.ownerName || "N/A"}</td>
                          </tr>
                        </tbody>
                      </table>
                    </Accordion.Body>
                  </Accordion.Item>
                ))
              ) : (
                <Accordion.Item eventKey="land">
                  <Accordion.Header
                    style={{
                      backgroundColor: "#0F6CBE",
                      color: "white",
                      fontWeight: "bold",
                    }}
                    className="mb-2"
                  >
                    {t("Land Details")}
                  </Accordion.Header>
                  <Accordion.Body>
                    {t("No Land Details Available")}
                  </Accordion.Body>
                </Accordion.Item>
              )}

              <Accordion.Item eventKey="transaction">
                <Accordion.Header
                  style={{
                    backgroundColor: "#0F6CBE",
                    color: "white",
                    fontWeight: "bold",
                  }}
                  className="mb-2"
                >
                  {t("Application Transaction Details")}
                </Accordion.Header>
                <Accordion.Body>
                  <div style={{ overflowX: "auto" }}>
                    <table
                      className="table small table-bordered"
                      style={{ maxWidth: "100%", tableLayout: "fixed" }}
                    >
                      <thead style={styles.headerStyle}>
                        <tr>
                          <th style={{ width: "10%" }}>{t("FRUITS ID")}</th>
                          <th style={{ width: "10%" }}>
                            {t("Beneficiary ID")}
                          </th>
                          <th style={{ width: "10%" }}>{t("Scheme Amount")}</th>
                          <th style={{ width: "10%" }}>{t("Sanction No.")}</th>
                          <th style={{ width: "10%" }}>
                            {t("Financial Year")}
                          </th>
                          <th style={{ width: "10%" }}>{t("Payment Mode")}</th>
                          <th style={{ width: "10%" }}>{t("File Name")}</th>
                          <th style={{ width: "10%" }}>{t("DBT Push Type")}</th>
                          <th style={{ width: "10%" }}>{t("Status")}</th>
                          <th style={{ width: "10%" }}>{t("Remarks")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewDetailsData?.applicationTransactionDetails
                          ?.length > 0 ? (
                          viewDetailsData.applicationTransactionDetails.map(
                            (transaction, index) => (
                              <tr key={index}>
                                <td style={{ wordBreak: "break-word" }}>
                                  {transaction.fruitsId || "N/A"}
                                </td>
                                <td style={{ wordBreak: "break-word" }}>
                                  {transaction.beneficiaryId || "N/A"}
                                </td>
                                <td style={{ wordBreak: "break-word" }}>
                                  {transaction.schemeAmount || "N/A"}
                                </td>
                                <td style={{ wordBreak: "break-word" }}>
                                  {transaction.sanctionNo || "N/A"}
                                </td>
                                <td style={{ wordBreak: "break-word" }}>
                                  {transaction.financialYear || "N/A"}
                                </td>
                                <td style={{ wordBreak: "break-word" }}>
                                  {transaction.paymentMode || "N/A"}
                                </td>
                                <td style={{ wordBreak: "break-word" }}>
                                  {transaction.fileName || "N/A"}
                                </td>
                                <td style={{ wordBreak: "break-word" }}>
                                  {transaction.dbtPushType || "N/A"}
                                </td>
                                <td style={{ wordBreak: "break-word" }}>
                                  {transaction.status || "N/A"}
                                </td>
                                <td style={{ wordBreak: "break-word" }}>
                                  {transaction.remarks || "N/A"}
                                </td>
                              </tr>
                            )
                          )
                        ) : (
                          <tr>
                            <td colSpan="10" className="text-center">
                              {t("No Transaction Details Available")}
                            </td>
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

export default DbtFailureApplication;
