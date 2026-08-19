import { Card, Button, Row, Col, Form, Modal,Accordion } from "react-bootstrap";
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
import CreditedBankDetailsButton from "./CreditedBankDetailsButton";
import { isPaymentSuccessInDbt } from "../../utils/dbtStatus";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION_FRUITS;
const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

const dbtPushedListStyles = `
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
  .sh-form-wrap .card { border: none; border-radius: 12px !important; box-shadow: 0 4px 14px rgba(30, 103, 168, 0.1); overflow: hidden; margin-bottom: 18px; }
  .sh-form-wrap .card-header { border-bottom: none !important; }
  .sh-form-wrap .card-body { padding: 20px !important; }
  .sh-form-wrap .form-label { font-size: 13px; font-weight: 600; color: #4a5568; margin-bottom: 6px; letter-spacing: 0.2px; }
  .sh-form-wrap .form-control, .sh-form-wrap .form-select {
    border-radius: 10px !important; border: 1.5px solid #d8e0ec !important; background-color: #fbfcfe !important;
    padding: 0.62rem 0.9rem !important; font-size: 13.5px; color: #2b3a55;
    transition: border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
  }
  .sh-form-wrap .form-control:hover:not(:disabled):not([readonly]), .sh-form-wrap .form-select:hover:not(:disabled) {
    border-color: #a9c4e0 !important; background-color: #ffffff !important;
  }
  .sh-form-wrap .form-control:focus, .sh-form-wrap .form-select:focus {
    border-color: #2b7ac0 !important; background-color: #ffffff !important; box-shadow: 0 0 0 3px rgba(30, 103, 168, 0.14) !important; outline: none;
  }
  .sh-form-wrap .form-control[readonly], .sh-form-wrap .form-control:read-only, .sh-form-wrap .form-select:disabled {
    background-color: #f1f5fa !important; border-color: #e4e9f2 !important; color: #8a96a8 !important; cursor: not-allowed;
  }
  .sh-form-wrap .form-control.is-invalid, .sh-form-wrap .form-select.is-invalid {
    border-color: #e3496a !important; box-shadow: 0 0 0 3px rgba(227, 73, 106, 0.12) !important;
  }
  .sh-form-wrap .form-check-input { border-radius: 5px; border: 1.5px solid #c9d4e3; cursor: pointer; }
  .sh-form-wrap .form-check-input:checked { background-color: #1e67a8; border-color: #1e67a8; }
  .sh-form-wrap .text-danger { font-weight: 700; margin-left: 3px; }
  .sh-form-wrap .btn-primary { border-radius: 8px; font-weight: 600; letter-spacing: 0.3px; transition: transform 0.15s ease, box-shadow 0.15s ease; }
  .sh-form-wrap .btn-primary:not(:disabled):hover { transform: translateY(-1px); box-shadow: 0 6px 14px rgba(30, 103, 168, 0.25); }
  .sh-form-wrap .btn-success { font-weight: 600; }
  .sh-cancel-btn {
    background: #ffffff; color: #e3496a; border: 1.5px solid #e3496a; border-radius: 8px;
    transition: background-color 0.15s ease, color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-cancel-btn:hover:not(:disabled), .sh-cancel-btn:focus:not(:disabled) {
    background: linear-gradient(135deg, #e3496a 0%, #c43257 100%); color: #ffffff; border-color: transparent;
    transform: translateY(-1px); box-shadow: 0 6px 14px rgba(227, 73, 106, 0.32);
  }
  .sh-form-wrap table { border-radius: 8px; overflow: hidden; }
  .sh-form-wrap table thead th {
    background-color: #eef4fc !important; color: #2b3a55 !important; font-weight: 700; font-size: 13px;
    letter-spacing: 0.2px; border-bottom: 2px solid #d6e3f3 !important;
  }
  .sh-form-wrap table tbody tr:hover { background-color: #f7faff !important; }
  .sh-section-header {
    display: flex; align-items: center; gap: 10px; font-weight: 700 !important; font-size: 1rem !important;
    letter-spacing: 0.3px; background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border-left: none !important; color: #ffffff !important; padding: 14px 20px !important;
  }
  .sh-section-header svg, .sh-section-header .icon, .sh-modal-content .modal-header svg, .sh-modal-content .modal-header .icon {
    display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px;
    border-radius: 50%; background: rgba(255, 255, 255, 0.22); color: #ffffff; font-size: 15px;
  }
  .sh-modal-content { border-radius: 12px !important; border: 1px solid #e3ebf6 !important; overflow: hidden; }
  .sh-modal-content .modal-header { background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%); border-bottom: none; padding: 16px 22px; }
  .sh-modal-content .modal-header .btn-close { filter: brightness(0) invert(1); opacity: 0.85; }
  .sh-modal-content .modal-title { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 1.05rem; letter-spacing: 0.3px; color: #ffffff; }
  .sh-modal-content .modal-body { padding: 22px 24px; max-height: 72vh; overflow-y: auto; }
  .sh-modal-content .btn-primary {
    background: linear-gradient(135deg, #1e67a8 0%, #2b7ac0 100%); border: none; border-radius: 8px; font-weight: 600;
    letter-spacing: 0.3px; box-shadow: 0 4px 10px rgba(30, 103, 168, 0.2); transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-modal-content .btn-secondary {
    background: #ffffff; color: #e3496a; border: 1.5px solid #e3496a; border-radius: 8px; font-weight: 600;
    transition: background-color 0.15s ease, color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-modal-content .btn-secondary:hover:not(:disabled) {
    background: linear-gradient(135deg, #e3496a 0%, #c43257 100%); color: #ffffff; border-color: transparent;
    transform: translateY(-1px); box-shadow: 0 6px 14px rgba(227, 73, 106, 0.28);
  }
  .sh-swal-popup { border-radius: 14px !important; }
  .sh-swal-confirm { background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important; border-radius: 8px !important; font-weight: 600 !important; box-shadow: 0 4px 12px rgba(30,103,168,0.25) !important; }
  .sh-swal-cancel { background: #ffffff !important; color: #c43257 !important; border: 1px solid #e3496a !important; border-radius: 8px !important; font-weight: 600 !important; }
`;

function DbtPushedList() {

  // Translation
  const { t } = useTranslation();
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 500;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };

  const [addressDetails, setAddressDetails] = useState({
    districtId: 0,
    talukId: 0,
    financialYearMasterId: "",
  });

  const [data, setData] = useState({
    financialYearMasterId: "",
    year1: "",
    year2: ""
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
  // const handleInputsSearch = (e) => {
  //   const { name, value } = e.target;
    
  //   // If type is 4, set the financial year ID in searchData
  //   if (value == 4) {
  //     setSearchData((prev) => ({
  //       ...prev,
  //       [name]: value,
  //       text: data.financialYearMasterId, // Use the fetched financialYearMasterId
  //     }));
  //   } else {
  //     setSearchData((prev) => ({
  //       ...prev,
  //       [name]: value
  //     }));
  //   }
  // };

  

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

       // Fetch default financial year details
       const getFinancialDefaultDetails = () => {
        api
          .get(baseURLMasterData + `financialYearMaster/get-is-default`)
          .then((response) => {
            setAddressDetails((prev) => ({
              ...prev,
              financialYearMasterId: response.data.content.financialYearMasterId,
            }));
          })
          .catch((err) => {
            setAddressDetails((prev) => ({
              ...prev,
              financialYearMasterId: "",
            }));
          });
      };
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
    getFinancialDefaultDetails();
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
          responseType: "blob",
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
    table: { style: { borderRadius: "10px", overflow: "hidden", boxShadow: "0 2px 8px rgba(30, 103, 168, 0.06)" } },
    headRow: { style: { minHeight: "44px", background: "linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%)", borderTopLeftRadius: "10px", borderTopRightRadius: "10px" } },
    rows: {
      style: {
        minHeight: "38px", // Row height
        fontSize: "13.5px",
        color: "#2b2d42",
        borderBottom: "1px solid #eef1f6 !important",
      },
      highlightOnHoverStyle: { backgroundColor: "#f4f8fd", cursor: "pointer", outline: "none" },
    },
    headCells: {
      style: {
        backgroundColor: "transparent", // Header background color
        color: "#fff", // Header text color
        fontSize: "13px",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.3px",
        paddingLeft: "10px",
        paddingRight: "10px",
      },
    },
    cells: {
      style: {
        paddingTop: "3px",
        paddingBottom: "3px",
        paddingLeft: "10px",
        paddingRight: "10px",
      },
    },
    pagination: { style: { borderTop: "1px solid #eef1f6", fontSize: "13px", color: "#5a6577" } },
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
      name: t("Name"),
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
      name:t("village"),
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
      name:  t("Sanction Number"),
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

    {
      name: t("Action"),
      cell: (row) =>
        isPaymentSuccessInDbt(row.applicationStatus) ? (
          <CreditedBankDetailsButton applicationFormId={row.scApplicationFormId} />
        ) : (
        <>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleView(row.scApplicationFormId)}
            className="ms-1"
          >
             {t("View")}
          </Button>
        </>
        ),
      sortable: true,
      hide: "md",
      // grow: 2,
    },
  ];

  return (
    <Layout title="DBT Pushed Applications">
      <style>{dbtPushedListStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2" className="sh-page-title">{t("DBT Pushed Applications")}</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        <Card className="mt-1">
          <Row className="m-2">
            <Col sm={12}>
              <Form.Group as={Row} className="form-group" id="fid">
              <Form.Label column sm={1}>
              {t("Financial Year")}
                </Form.Label>
                <Col sm={1}>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="financialYearMasterId"
                      value={addressDetails.financialYearMasterId}
                      onChange={handleInputsaddress}
                      style={{ marginLeft: "-14%" }}
                    >
                      <option value="0">{t("Select Financial Year")}</option>
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
                </Col>
                <Form.Label column sm={1}>
                  {t("Search By")}
                </Form.Label>
                <Col sm={1}>
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

                {Number(searchData.type) === 3 ? (
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
                          <option value=" ">{t("Select Status")}</option>
                          <option value="DBT PUSHED">{t("DBT PUSHED")}</option>
                          <option value="REJECTED BY ADS">
                            {t("REJECTED BY ADS")}
                          </option>
                          <option value="ACKNOWLEDGEMENT FAILED">
                            {t("ACKNOWLEDGEMENT FAILED")}
                          </option>
                          <option value="ACKNOWLEDGEMENT SUCCESS">
                            {t("ACKNOWLEDGEMENT SUCCESS")}
                          </option>
                          <option value="SUBSIDY SANCTIONED">
                            {t("SUBSIDY SANCTIONED")}
                          </option>

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
                          <option value="">{t("Select Component Type")}</option>
                          {scSubSchemeDetailsListData &&
                            scSubSchemeDetailsListData.map((list, i) => (
                              <option
                                key={list.scSubSchemeDetailsId}
                                value={list.scSubSchemeDetailsId}
                              >
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
                <Form.Label column sm={1}>
                {t("district")}
                </Form.Label>
                <Col sm={1}>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="districtId"
                      value={addressDetails.districtId}
                      onChange={handleInputsaddress}
                      style={{ width: "100%", marginLeft: "-14%" }}
                    >
                      <option value="0">{t("select_district")}</option>
                      {districtListData.map((list) => (
                        <option key={list.districtId} value={list.districtId}>
                          {list.districtName}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Col>
                <Form.Label column sm={1}>
                {t("taluk")}
                </Form.Label>
                <Col sm={1}>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="talukId"
                      value={addressDetails.talukId}
                      onChange={handleInputsaddress}
                      // style={{ marginLeft: "-14%" }}
                      style={{ width: "100%", marginLeft: "-14%" }}
                    >
                      <option value="0">{t("select_taluk")}</option>
                      {talukListData.map((list) => (
                        <option key={list.talukId} value={list.talukId}>
                          {list.talukName}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Col>
                <Col sm={1}>
                  <Button type="button" variant="primary" onClick={search}>
                  {t("search")}
                  </Button>
                </Col>
                <Col sm={1}>
                  <Button type="button" variant="primary" onClick={exportCsv}>
                  {t("Export")}
                  </Button>
                </Col>
              </Form.Group>
            </Col>

            {/* <Col sm={6}>
              <Form.Group as={Row} className="form-group" id="fid">
                <Form.Label column sm={1}>
                  District
                </Form.Label>
                <Col sm={1}>
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
                <Col sm={2}>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="financialYearMasterId"
                      value={addressDetails.financialYearMasterId}
                      onChange={handleInputsaddress}
                      style={{ marginLeft: "-14%" }}
                    >
                      <option value="0">Select Financial Year</option>
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
            </Col> */}
          </Row>

          {/* <Row className="m-2">
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
          </Row> */}

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
                          {viewDetailsData.applicationDetails.map(
                            (detail, index) => (
                              <React.Fragment key={index}>
                                <tr>
                                  <td style={styles.ctstyle}>Fruits Id:</td>
                                  <td>{detail.fruitsId}</td>
                                </tr>
                                <tr>
                                  <td style={styles.ctstyle}>Beneficiary Name:</td>
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
                                  <td style={styles.ctstyle}>
                                    Sub Scheme Name:
                                  </td>
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
                                  <td style={styles.ctstyle}>
                                    Application Status:
                                  </td>
                                  <td>{detail.applicationStatus}</td>
                                </tr>
                              </React.Fragment>
                            )
                          )}
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
                          {viewDetailsData.landDetails.map(
                            (landDetail, index) => (
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
                                  <td style={styles.ctstyle}>
                                    Developed Area Acre:
                                  </td>
                                  <td>{landDetail.acre}</td>
                                </tr>
                                <tr>
                                  <td style={styles.ctstyle}>
                                    Developed Area F Gunta:
                                  </td>
                                  <td>{landDetail.fGunta}</td>
                                </tr>
                                <tr>
                                  <td style={styles.ctstyle}>
                                    Developed Area Gunta:
                                  </td>
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
                            )
                          )}
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
                        className="mb-2"> {t("Application Details")}</Accordion.Header>
          <Accordion.Body>
            <table className="table small table-bordered">
              <tbody>
                <tr>
                  <td style={styles.ctstyle}>{t("FRUITS ID")}</td>
                  <td>{viewDetailsData?.applicationDetails?.[0]?.fruitsId || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={styles.ctstyle}>{t("Name")}</td>
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
          <Accordion.Item eventKey="landDetails">
              <Accordion.Header
                style={{ backgroundColor: "#0F6CBE", color: "white", fontWeight: "bold" }}
                className="mb-2"
              >
                Land Details
              </Accordion.Header>
              <Accordion.Body>
                {viewDetailsData.landDetails.map((landDetail, index) => (
                  <table className="table small table-bordered mb-3" key={index}>
                    <tbody>
                      <tr>
                        <td style={styles.ctstyle}>Survey Number:</td>
                        <td>{landDetail.surveyNumber || "N/A"}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>District Name:</td>
                        <td>{landDetail.districtName || "N/A"}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Taluk Name:</td>
                        <td>{landDetail.talukName || "N/A"}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Village Name:</td>
                        <td>{landDetail.villageName || "N/A"}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Acre:</td>
                        <td>{landDetail.acre || "N/A"}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>F Gunta:</td>
                        <td>{landDetail.fGunta || "N/A"}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Gunta:</td>
                        <td>{landDetail.gunta || "N/A"}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Developed Area Acre:</td>
                        <td>{landDetail.devAcre || "N/A"}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Developed Area F Gunta:</td>
                        <td>{landDetail.devFGunta || "N/A"}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Developed Area Gunta:</td>
                        <td>{landDetail.devGunta || "N/A"}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Hissa:</td>
                        <td>{landDetail.hissa || "N/A"}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Land Code:</td>
                        <td>{landDetail.landCode || "N/A"}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Main Owner No:</td>
                        <td>{landDetail.mainOwnerNo || "N/A"}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Owner Name:</td>
                        <td>{landDetail.ownerName || "N/A"}</td>
                      </tr>
                    </tbody>
                  </table>
                ))}
              </Accordion.Body>
            </Accordion.Item>
          ) : (
            <Accordion.Item eventKey="land">
              <Accordion.Header
                style={{ backgroundColor: "#0F6CBE", color: "white", fontWeight: "bold" }}
                className="mb-2"
              >
                Land Details
              </Accordion.Header>
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
          <th style={{ width: "10%" }}>{t("FRUITS ID")}</th>
                          <th style={{ width: "10%" }}>{t("Beneficiary ID")}</th>
                          <th style={{ width: "10%" }}>{t("Scheme Amount")}</th>
                          <th style={{ width: "10%" }}>{t("Sanction No.")}</th>
                          <th style={{ width: "10%" }}>{t("Financial Year")}</th>
                          <th style={{ width: "10%" }}>{t("Payment Mode")}</th>
                          <th style={{ width: "10%" }}>{t("File Name")}</th>
                          <th style={{ width: "10%" }}>{t("DBT Push Type")}</th>
                          <th style={{ width: "10%" }}>{t("Status")}</th>
                          <th style={{ width: "10%" }}>{t("Remarks")}</th>
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
              <td colSpan="10" className="text-center">{t("No Transaction Details Available")}</td>
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

export default DbtPushedList;
