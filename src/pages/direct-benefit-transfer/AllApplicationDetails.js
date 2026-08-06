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
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import React from "react";
import DatePicker from "react-datepicker";
import { useMemo, useCallback } from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import api from "../../services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION_FRUITS;
const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

const ACCENT_HEADER = "linear-gradient(135deg,#1a5f9e 0%,#2c8fd4 60%,#38b2ac 100%)";
const ACCENT_TABLE  = "linear-gradient(135deg,#1a5f9e,#2c8fd4)";
const CTRL_H = "44px";
const lbl = { fontSize: "12px", fontWeight: 600, color: "#212529", marginBottom: "3px", display: "block" };
const sel = { height: CTRL_H, fontSize: "14px", backgroundColor: "#fff" };

const allApplicationDetailsStyles = `
  .sh-page-header {
    padding: 20px 24px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border-radius: 12px;
    border: none;
    box-shadow: 0 6px 18px rgba(30, 103, 168, 0.22);
    margin-bottom: 22px;
  }
  .sh-page-title { margin-bottom: 0; color: #ffffff !important; font-weight: 700; letter-spacing: 0.2px; }
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

function AllApplicationDetails() {

 // ✅ State declarations
  const [financialyearListData, setFinancialyearListData] = useState([]);
  const [scSubSchemeDetailsListData, setScSubSchemeDetailsListData] = useState([]);
  const [scComponentListData, setScComponentListData] = useState([]);
  const [scSchemeDetailsListData, setScSchemeDetailsListData] = useState([]);
  const [scHeadAccountListData, setScHeadAccountListData] = useState([]);
  const [scCategoryListData, setScCategoryListData] = useState([]);
  const [districtListData, setDistrictListData] = useState([]);
  const [talukListData, setTalukListData] = useState([]);
  const [hobliListData, setHobliListData] = useState([]);
  const [villageListData, setVillageListData] = useState([]);

  const [searchData, setSearchData] = useState({ type: "5", text: "" });
  const [addressDetails, setAddressDetails] = useState({
    districtId: 0,
    talukId: 0,
    hobliId: 0,
    villageId: 0,
    scCategoryId: 0,
  });

  const [data, setData] = useState({
    financialYearMasterId: "",
    year1: "",
    year2: "",
  });

  const [listData, setListData] = useState([]);
  const [page, setPage] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const countPerPage = 500;
  const _params = { params: { pageNumber: page, size: countPerPage } };
  const { t } = useTranslation();

  // ✅ API Calls
  const getFinancialYearList = () => {
    api
      .get(`${baseURLMasterData}financialYearMaster/get-all`)
      .then((response) => {
        const content = response.data?.content;
        setFinancialyearListData(content?.financialYearMaster ?? []);
      })
      .catch(() => setFinancialyearListData([]));
  };

 // Fetch default financial year, then load the report pre-filtered by that
 // year. The user can still pick a different year/search type and hit Search.
 const getFinancialDefaultDetails = () => {
  api
    .get(`${baseURLMasterData}financialYearMaster/get-is-default`)
    .then((response) => {
      const content = response.data?.content;
      if (content) {
        const year = content.financialYear ?? "";
        const financialYearMasterId = content.financialYearMasterId ?? "";
        const [fromDate = "", toDate = ""] = year.split("-");

        // ✅ Set financial year state
        setData({
          financialYearMasterId,
          year1: fromDate,
          year2: toDate,
        });

        // ✅ Set search data safely inside same scope
        setSearchData((prev) => ({
          ...prev,
          type: "5",
          text: financialYearMasterId,
        }));

        getList(financialYearMasterId);
      } else {
        getList();
      }
    })
    .catch(() => {
      setData({
        financialYearMasterId: "",
        year1: "",
        year2: "",
      });
      getList();
    });
};


  const getSubSchemeList = () => {
    api
      .get(`${baseURLMasterData}scSubSchemeDetails/get-all`)
      .then((response) => {
        const content = response.data?.content;
        setScSubSchemeDetailsListData(content?.scSubSchemeDetails ?? []);
      })
      .catch(() => setScSubSchemeDetailsListData([]));
  };

  const getComponentList = () => {
    api
      .get(`${baseURLMasterData}scComponent/get-all`)
      .then((response) => {
        const content = response.data?.content;
        setScComponentListData(content?.scComponent ?? []);
      })
      .catch(() => setScComponentListData([]));
  };

  const getSchemeList = () => {
    api
      .get(`${baseURLMasterData}scSchemeDetails/get-all`)
      .then((response) => {
        const content = response.data?.content;
        setScSchemeDetailsListData(content?.ScSchemeDetails ?? []);
      })
      .catch(() => setScSchemeDetailsListData([]));
  };

  const getHeadAccountList = () => {
    api
      .get(`${baseURLMasterData}scHeadAccount/get-all`)
      .then((response) => {
        const content = response.data?.content;
        setScHeadAccountListData(content?.scHeadAccount ?? []);
      })
      .catch(() => setScHeadAccountListData([]));
  };

  const getCategoryList = () => {
    api
      .get(`${baseURLMasterData}scCategory/get-all`)
      .then((response) => {
        const content = response.data?.content;
        setScCategoryListData(content?.scCategory ?? []);
      })
      .catch(() => setScCategoryListData([]));
  };

  const getDistrictList = () => {
    api
      .get(`${baseURL}district/get-all`)
      .then((response) => {
        const content = response.data?.content;
        setDistrictListData(content?.district ?? []);
      })
      .catch(() => setDistrictListData([]));
  };

  const getTalukList = (_id) => {
    if (!_id) {
      setTalukListData([]);
      return;
    }
    api
      .get(`${baseURL}taluk/get-by-district-id/${_id}`)
      .then((response) => {
        const content = response.data?.content;
        setTalukListData(content?.taluk ?? []);
      })
      .catch(() => setTalukListData([]));
  };

  const getHobliList = (_id) => {
    if (!_id) {
      setHobliListData([]);
      return;
    }
    api
      .get(`${baseURL}hobli/get-by-taluk-id/${_id}`)
      .then((response) => {
        const content = response.data?.content;
        setHobliListData(content?.hobli ?? []);
      })
      .catch(() => setHobliListData([]));
  };

  const getVillageList = (_id) => {
    if (!_id) {
      setVillageListData([]);
      return;
    }
    api
      .get(`${baseURL}village/get-by-hobli-id/${_id}`)
      .then((response) => {
        const content = response.data?.content;
        setVillageListData(content?.village ?? []);
      })
      .catch(() => setVillageListData([]));
  };

  // ✅ useEffects
  useEffect(() => {
    getFinancialYearList();
    getFinancialDefaultDetails();
    getSubSchemeList();
    getSchemeList();
    getComponentList();
    getHeadAccountList();
    getCategoryList();
    getDistrictList();
  }, []);

  useEffect(() => {
    if (addressDetails.districtId) getTalukList(addressDetails.districtId);
  }, [addressDetails.districtId]);

  useEffect(() => {
    if (addressDetails.talukId) getHobliList(addressDetails.talukId);
  }, [addressDetails.talukId]);

  useEffect(() => {
    if (addressDetails.hobliId) getVillageList(addressDetails.hobliId);
  }, [addressDetails.hobliId]);

  // ✅ Memos and handlers
  const memoizedFinancialYears = useMemo(() => financialyearListData, [financialyearListData]);
  const memoizedComponents = useMemo(() => scComponentListData, [scComponentListData]);
  const memoizedComponentTypes = useMemo(() => scSubSchemeDetailsListData, [scSubSchemeDetailsListData]);

  const handleInputsSearch = useCallback((e) => {
  const { name, value } = e.target;

  setSearchData((prev) => ({
    ...prev,
    [name]: value,
    // Reset text when changing search type
    ...(name === "type" ? { text: "" } : {}),
  }));
}, []);



  const [landData, setLandData] = useState({
    landId: "",
    talukId: "",
  });

  const [farmer, setFarmer] = useState({
    text: "",
    select: "mobileNumber",
  });

  const [period, setPeriod] = useState({
    periodFrom: new Date(),
    periodTo: new Date(),
  });

 

useEffect(() => {
  if (addressDetails.hobliId && addressDetails.hobliId !== 0) {
    getVillageList(addressDetails.hobliId);
  } else {
    setVillageListData([]); // Clear if no hobli
  }
}, [addressDetails.hobliId]);

  const handleInputsaddress = (e) => {
  const { name, value } = e.target;
  setAddressDetails((prev) => ({
    ...prev,
    [name]: Number(value),
  }));
};


  // Search
  const search = (e) => {
    api
      .post(
        baseURLDBT + `service/getAllApplicationDetailsList`,
        {},
        {
          params: {
            districtId: addressDetails.districtId,
            talukId: addressDetails.talukId,
            hobliId: addressDetails.hobliId,
            villageId: addressDetails.villageId,
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


  const [validatedDisplay, setValidatedDisplay] = useState(false);

  const display = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidatedDisplay(true);
    } else {
      event.preventDefault();

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
          setListData([]);
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

 const handleCategoryChange = (e) => {
  const value = e.target.value;
  setSearchData((prev) => ({
    ...prev,
    ...(prev.type === "5" ? { text: data.financialYearMasterId ?? "" } : { text: "" }),
  }));
  setAddressDetails((prev) => ({
    ...prev,
    scCategoryId: value,
  }));
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
  };

  const getList = (financialYearMasterId) => {
    setLoading(true);
    const params = {
      displayAllRecords: true,
      status: "",
    };
    if (financialYearMasterId) {
      params.type = 5;
      params.text = financialYearMasterId;
    }
    api
      .post(
        baseURLDBT + `service/getAllApplicationDetailsList`,
        {},
        { params }
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
        setListData([]);
        setLoading(false);
      });
  };

  const exportCsv = (e) => {
    api
      .post(
        baseURLDBT + `service/all-application-details-export`,
        {},
        {
          params: {
            districtId: addressDetails.districtId,
            talukId: addressDetails.talukId,
            hobliId: addressDetails.hobliId,
            villageId: addressDetails.villageId,
            text: searchData.text,
            type: searchData.type,
            scCategoryId: searchData.scCategoryId,
            displayAllRecords: true,
            status: "",
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
        link.download = `dbt_status_report.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
      })
      .catch((err) => {
        Swal.fire({
          icon: "warning",
          title: "No record found!!!",
          customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm" },
        });
      });
  };

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

  const customStyles = {
    headRow: { style: { minHeight: "52px", height: "auto" } },
    headCells: {
      style: {
        background: ACCENT_TABLE, color: "#fff", fontWeight: 700, fontSize: "13px",
        padding: "10px 8px", borderRight: "1px solid rgba(255,255,255,0.5)",
        borderBottom: "2px solid rgba(255,255,255,0.6)", whiteSpace: "normal",
        wordBreak: "break-word", overflowWrap: "break-word", overflow: "visible",
        lineHeight: "1.4", minHeight: "52px", height: "auto",
        verticalAlign: "middle", justifyContent: "center", textAlign: "center",
      },
    },
    rows: {
      style: {
        minHeight: "32px",
        "&:nth-of-type(odd)":  { background: "#fff" },
        "&:nth-of-type(even)": { background: "#f7fafd" },
      },
    },
    cells: {
      style: {
        borderRight: "1px solid #eef2f7", borderBottom: "1px solid #e8edf5",
        paddingTop: "4px", paddingBottom: "4px", paddingLeft: "8px", paddingRight: "8px",
        color: "#2d3748", fontSize: "13px", justifyContent: "center", textAlign: "center",
      },
    },
  };

  const colHeader = (label) => (
    <div style={{ whiteSpace: "normal", wordBreak: "break-word", textAlign: "center", lineHeight: "1.4", width: "100%", padding: "2px 0" }}>
      {label}
    </div>
  );

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
    { name: colHeader(t("Sl.No")),             selector: (row) => row.scApplicationFormId, cell: (row, i) => <span>{i + 1}</span>,                                                         sortable: true, width: "80px", hide: "md" },
    { name: colHeader(t("FRUITS ID")),         selector: (row) => row.fruitsId,            cell: (row) => <span>{row.fruitsId}</span>,            sortable: true, hide: "md" },
    { name: colHeader(t("Beneficiary ID")),    selector: (row) => row.beneficiaryId,       cell: (row) => <span>{row.beneficiaryId}</span>,       sortable: true, hide: "md" },
    { name: colHeader(t("beneficiary_name")),  selector: (row) => row.farmerFirstName,     cell: (row) => <span>{row.farmerFirstName}</span>,     sortable: true, hide: "md" },
    { name: colHeader(t("district")),          selector: (row) => row.districtName,        cell: (row) => <span>{row.districtName}</span>,        sortable: true, hide: "md" },
    { name: colHeader(t("taluk")),             selector: (row) => row.talukName,           cell: (row) => <span>{row.talukName}</span>,           sortable: true, hide: "md" },
    { name: colHeader(t("village")),           selector: (row) => row.villageName,         cell: (row) => <span>{row.villageName}</span>,         sortable: true, hide: "md" },
    { name: colHeader(t("Component Type")),    selector: (row) => row.subSchemeName,       cell: (row) => <span>{row.subSchemeName}</span>,       sortable: true, hide: "md" },
    { name: colHeader(t("Component")),         selector: (row) => row.scComponentName,     cell: (row) => <span>{row.scComponentName}</span>,     sortable: true, hide: "md" },
    { name: colHeader(t("Category")),          selector: (row) => row.categoryName,        cell: (row) => <span>{row.categoryName}</span>,        sortable: true, hide: "md" },
    { name: colHeader(t("Sanction Number")),   selector: (row) => row.sanctionNumber,      cell: (row) => <span>{row.sanctionNumber}</span>,      sortable: true, hide: "md" },
    { name: colHeader(t("Subsidy Amount")),    selector: (row) => row.actualAmount,        cell: (row) => <span>{row.actualAmount}</span>,        sortable: true, hide: "md" },
    { name: colHeader(t("Application Status")),selector: (row) => row.applicationStatus,   cell: (row) => <span style={{ color: "green", fontWeight: "bold" }}>{row.applicationStatus}</span>, sortable: true, hide: "md" },
  ];

   return (
  <Layout title="All Application Details">
    <style>{allApplicationDetailsStyles}</style>
    <Block.Head>
      <div className="sh-page-header">
      <Block.HeadBetween>
        <Block.HeadContent>
          <Block.Title tag="h2" className="sh-page-title">{t("All Application Details")}</Block.Title>
        </Block.HeadContent>
      </Block.HeadBetween>
      </div>
    </Block.Head>

    <Block className="mt-n4">
      <Card style={{ borderRadius: "12px", border: "none", boxShadow: "0 2px 16px rgba(30,103,168,0.10)", backgroundColor: "#fff" }}>
        <div style={{ background: ACCENT_HEADER, padding: "11px 18px", display: "flex", alignItems: "center", gap: "10px", borderRadius: "12px 12px 0 0" }}>
          <span style={{ fontSize: "20px" }}>📋</span>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: "14px" }}>All Application Details</div>
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "11px" }}>Select filters to search and export application data</div>
          </div>
        </div>
        <Card.Body className="pb-2">
          <Row className="g-2 align-items-end">
            <Col xs={6} sm={4} lg>
              <Form.Group className="form-group">
                <label style={lbl}>{t("Search By")}</label>
                <Form.Select name="type" value={searchData.type} onChange={handleInputsSearch} style={sel}>
                  <option value="2">{t("FRUITS ID")}</option>
                  <option value="4">{t("Beneficiary ID")}</option>
                  <option value="5">{t("Financial Year")}</option>
                  <option value="6">{t("Component")}</option>
                  <option value="7">{t("Component Type")}</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={6} sm={4} lg>
              <Form.Group className="form-group">
                <label style={lbl}>&nbsp;</label>
                {(() => {
                  switch (Number(searchData.type)) {
                    case 5:
                      return (
                        <Form.Select name="text" value={searchData.text} onChange={handleInputsSearch} style={sel}>
                          <option value="">{t("Select Year")}</option>
                          {memoizedFinancialYears.map((list) => (
                            <option key={list.financialYearMasterId} value={list.financialYearMasterId}>{list.financialYear}</option>
                          ))}
                        </Form.Select>
                      );
                    case 6:
                      return (
                        <Form.Select name="text" value={searchData.text} onChange={handleInputsSearch} style={sel}>
                          <option value="">{t("Select Component")}</option>
                          {memoizedComponents.map((list) => (
                            <option key={list.scComponentId} value={list.scComponentId}>{list.scComponentName}</option>
                          ))}
                        </Form.Select>
                      );
                    case 7:
                      return (
                        <Form.Select name="text" value={searchData.text} onChange={handleInputsSearch} style={sel}>
                          <option value="">{t("Select Component Type")}</option>
                          {memoizedComponentTypes.map((list) => (
                            <option key={list.scSubSchemeDetailsId} value={list.scSubSchemeDetailsId}>{list.subSchemeName}</option>
                          ))}
                        </Form.Select>
                      );
                    default:
                      return (
                        <Form.Control id="searchInput" name="text" value={searchData.text} onChange={handleInputsSearch} type="text" placeholder="Search" style={sel} />
                      );
                  }
                })()}
              </Form.Group>
            </Col>
            <Col xs={6} sm={4} lg>
              <Form.Group className="form-group">
                <label style={lbl}>{t("District")}</label>
                <Form.Select name="districtId" value={addressDetails.districtId} onChange={handleInputsaddress} style={sel}>
                  <option value="0">{t("select_district")}</option>
                  {districtListData.map((list) => (
                    <option key={list.districtId} value={list.districtId}>{list.districtName}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={6} sm={4} lg>
              <Form.Group className="form-group">
                <label style={lbl}>{t("Taluk")}</label>
                <Form.Select name="talukId" value={addressDetails.talukId} onChange={handleInputsaddress} style={sel}>
                  <option value="0">{t("select_taluk")}</option>
                  {talukListData.map((list) => (
                    <option key={list.talukId} value={list.talukId}>{list.talukName}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={6} sm={4} lg>
              <Form.Group className="form-group">
                <label style={lbl}>{t("Hobli")}</label>
                <Form.Select name="hobliId" value={addressDetails.hobliId} onChange={handleInputsaddress} style={sel}>
                  <option value="0">{t("select_hobli")}</option>
                  {hobliListData.map((list) => (
                    <option key={list.hobliId} value={list.hobliId}>{list.hobliName}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={6} sm={4} lg>
              <Form.Group className="form-group">
                <label style={lbl}>{t("Village")}</label>
                <Form.Select name="villageId" value={addressDetails.villageId} onChange={handleInputsaddress} style={sel}>
                  <option value="0">{t("select_village")}</option>
                  {villageListData.map((list) => (
                    <option key={list.villageId} value={list.villageId}>{list.villageName}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={6} sm={4} lg>
              <Form.Group className="form-group">
                <label style={lbl}>{t("Sub Component")}</label>
                <Form.Select name="scCategoryId" value={searchData.scCategoryId} onChange={handleInputsSearch} style={sel}>
                  <option value="">{t("Select Category")}</option>
                  {scCategoryListData.map((list) => (
                    <option key={list.scCategoryId} value={list.scCategoryId}>{list.categoryName}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row className="g-2 mt-2">
            <Col xs="auto">
              <button type="button" onClick={search} style={{ height: CTRL_H, padding: "0 20px", background: ACCENT_TABLE, color: "#fff", border: "none", borderRadius: "6px", fontWeight: 600, fontSize: "13px", cursor: "pointer", marginRight: "8px" }}>
                {t("Search")}
              </button>
              <button type="button" onClick={exportCsv} style={{ height: CTRL_H, padding: "0 20px", background: "linear-gradient(135deg,#2d7a2d,#38a838)", color: "#fff", border: "none", borderRadius: "6px", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}>
                {t("Export")}
              </button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Block>



      <Block className="mt-3">
        <Card style={{ borderRadius: "12px", border: "none", boxShadow: "0 2px 16px rgba(30,103,168,0.08)" }}>
          <DataTable
            tableClassName="data-table-head-light table-responsive"
            columns={ApplicationDataColumns}
            data={listData}
            highlightOnHover
            progressPending={loading}
            customStyles={customStyles}
            pagination
            paginationPerPage={50}
            paginationRowsPerPageOptions={[50]}
          />
        </Card>
      </Block>

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
                        <td style={styles.ctstyle}>{t("beneficiary_name")}</td>
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

export default AllApplicationDetails;