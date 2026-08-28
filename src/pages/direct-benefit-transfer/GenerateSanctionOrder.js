import React, { useEffect, useState } from "react";
import api from "../../services/auth/api";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Card, Form, Row, Col } from "react-bootstrap";
import DataTable from "../../components/AppDataTable";
import { defaultThemes } from "react-data-table-component";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import SearchableSelect from "../../components/SearchableSelect/SearchableSelect";

const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLReport = process.env.REACT_APP_API_BASE_URL_REPORT;

function GenerateSanctionOrder() {

  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const [validated, setValidated] = useState(false);
    const countPerPage = 50;
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(false);
    const _params = { params: { pageNumber: page, size: countPerPage } };
    const { t, i18n } = useTranslation();

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

  const [addressDetails, setAddressDetails] = useState({
    fruitsId: "",
    financialYearId: "",
      schemeId: "",
     componentId: "",
      subSchemeId: "",
      sanctionOrderNumber: "",
      scCategoryId: "",
      type: "",
    });

    const search = (details = addressDetails) => {
  api.post(baseURLDBT + `service/getSanctionOrderData`, {}, {
    params: {
      financialYearId: details.financialYearId || 0,
      schemeId: details.scSchemeDetailsId || 0,
      subSchemeId: details.subSchemeId || 0,
      componentId: details.componentId || 0,
      scCategoryId: details.scCategoryId || 0,
      sanctionOrderNumber: details.sanctionOrderNumber || "",
      fruitsId: details.fruitsId || "",
      pageNumber: page,
      pageSize: countPerPage,
    }
  })

    .then((response) => {
       setListData(response.data.content);
        const scApplicationFormIds = response.data.content.map(
          (item) => item.scApplicationFormId
        );
        const data = response.data.content;
        const recordData = data[0];
        setAllApplicationIds(scApplicationFormIds);

        setApplicationFormId(recordData?.scApplicationFormId);
        setSubSchemeType(recordData?.subSchemeType);
        setSecurityKey(recordData?.securityKey || "");
        setSanctionOrderForScheme(recordData?.sanctionOrderForScheme || null);
        setLoading(false);
    })
    .catch((err) => {
      setListData([]);
    });
};

const [applicationFormId, setApplicationFormId] = useState(null);

const [sanctionOrderForScheme, setSanctionOrderForScheme] = useState(null);
const [allApplicationIds, setAllApplicationIds] = useState([]);
const [subSchemeType, setSubSchemeType] = useState([]);
const [securityKey, setSecurityKey] = useState("");

const getList = () => {
    setLoading(true);
    api
      .post(
        baseURLDBT + `service/getSanctionOrderData`,
        {},
        {
          params: {
            financialYearId: addressDetails.financialYearId || 0,
            schemeId: addressDetails.schemeId || 0,
            subSchemeId: addressDetails.subSchemeId || 0,
            componentId: addressDetails.componentId || 0,
            scCategoryId: addressDetails.scCategoryId || 0,
            fruitsId: addressDetails.fruitsId || "",
            pageNumber: page,
            pageSize: countPerPage,
          },
        }
      )
      .then((response) => {
        setListData(response.data.content);
        // const scApplicationFormIds = response.data.content.map(
        //   (item) => item.scApplicationFormId
        // );


        const data = response.data.content;
        const recordData = data[0];
        // setAllApplicationIds(scApplicationFormIds);

        // ⬅️ FIX: read applicationFormIds from response.extra
        const applicationFormIdsFromApi = response.data.extra?.applicationFormIds || [];

        setAllApplicationIds(applicationFormIdsFromApi);

        setApplicationFormId(recordData?.scApplicationFormId);
        setSubSchemeType(recordData?.subSchemeType);
        setSecurityKey(recordData?.securityKey || "");
        setSanctionOrderForScheme(recordData?.sanctionOrderForScheme || null);
        setLoading(false);
      })
      .catch((err) => {
        setListData({});
        setLoading(false);
      });
  };

  useEffect(() => {
    // getFinancialDefaultDetails();
    getList();
  }, [page]);


  //   const handleInputsaddress = (e) => {
  //   let name = e.target.name;
  //   let value = e.target.value;
  //   setAddressDetails({ ...addressDetails, [name]: value });
    
  // };
 const handleInputsaddress = (e) => {
  let name = e.target.name;
  let value = e.target.value;

  const updated = { ...addressDetails, [name]: value };
  setAddressDetails(updated);

  if (
    updated.financialYearId &&
    updated.scSchemeDetailsId &&
    updated.subSchemeId &&
    updated.componentId &&
    updated.scCategoryId
  ) {
    loadSanctionOrderNumbers(updated);   // pass updated values
  }
};

// const handleSanctionOrderChange = (e) => {
//   const value = e.target.value;

//   setAddressDetails({
//     ...addressDetails,
//     sanctionOrderNumber: value
//   });

//   // IMPORTANT: Load data for this Sanction Order
//   search();
// };
const handleSanctionOrderChange = (e) => {
  const value = e.target.value;

  const updated = {
    ...addressDetails,
    sanctionOrderNumber: value
  };

  setAddressDetails(updated);

  // ✅ pass updated values to search
  search(updated);
};


const [sanctionOrderNumbers, setSanctionOrderNumbers] = useState([]);

  const loadSanctionOrderNumbers = () => {
  if (
    addressDetails.financialYearId &&
    addressDetails.scSchemeDetailsId &&
    addressDetails.subSchemeId &&
    addressDetails.componentId &&
    addressDetails.scCategoryId
  ) {
    api
      .post(
        baseURLDBT +
          `service/getSanctionOrderNumbers?financialYearId=${addressDetails.financialYearId}&schemeId=${addressDetails.scSchemeDetailsId}&subSchemeId=${addressDetails.subSchemeId}&componentId=${addressDetails.componentId}&categoryId=${addressDetails.scCategoryId}&fruitsId=${addressDetails.fruitsId || ""}`
      )
      .then((res) => {
        if (res.data && res.data.content) {
          setSanctionOrderNumbers(res.data.content);
        }
      })
      .catch((err) => {
        console.log("Error loading sanction order numbers", err);
      });
  }
};

useEffect(() => {
  if (
    addressDetails.financialYearId &&
    addressDetails.scSchemeDetailsId &&
    addressDetails.subSchemeId &&
    addressDetails.componentId &&
    addressDetails.scCategoryId
  ) {
    loadSanctionOrderNumbers(addressDetails);
  }
}, [
  addressDetails.financialYearId,
  addressDetails.scSchemeDetailsId,
  addressDetails.subSchemeId,
  addressDetails.componentId,
  addressDetails.scCategoryId,
  addressDetails.fruitsId
]);


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


    // to get sc-scheme-details
      const [scSchemeDetailsListData, setScSchemeDetailsListData] = useState([]);
      const getSchemesList = () => {
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
        getSchemesList();
      }, []);
    
      // to get sc-sub-scheme-details by sc-scheme-details
      const [scSubSchemeDetailsListData, setScSubSchemeDetailsListData] = useState(
        []
      );
      const getSubSchemeList = (_id) => {
        api
          .get(baseURLDBT + `master/cost/get-by-scheme-id/${_id}`)
          .then((response) => {
            if (response.data.content.unitCost) {
              setScSubSchemeDetailsListData(response.data.content.unitCost);
            }
          })
          .catch((err) => {
            setScSubSchemeDetailsListData([]);
            // alert(err.response.data.errorMessages[0].message[0].message);
          });
      };
    
      useEffect(() => {
        if (addressDetails.scSchemeDetailsId) {
          getSubSchemeList(addressDetails.scSchemeDetailsId);
        }
      }, [addressDetails.scSchemeDetailsId]);
    
      // to get component
        const [scComponentListData, setScComponentListData] = useState([]);
      
        const getComponentList = (schemeId, subSchemeId) => {
          api
            .post(baseURLDBT + `master/cost/get-by-schemeId-and-subSchemeId`, {
              schemeId: schemeId,
              subSchemeId: subSchemeId,
            })
            .then((response) => {
              setScComponentListData(response.data.content.unitCost);
            })
            .catch((err) => {
              setScComponentListData([]);
            });
        };
    
        useEffect(() => {
            if (addressDetails.scSchemeDetailsId && addressDetails.subSchemeId) {
              getComponentList(addressDetails.scSchemeDetailsId, addressDetails.subSchemeId);
              
            }
          }, [addressDetails.scSchemeDetailsId, addressDetails.subSchemeId,addressDetails.scCategoryId]);
    
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

      const ApplicationDataColumns = [
          {
            name: t("Sl.No"),
            selector: (row) => row.serialNumber,
            cell: (row,i) => <span>{row.serialNumber}</span>,
            sortable: true,
            width: "80px",
            hide: "md",
          },
          
          {
            name:  t("FRUITS ID"),
            selector: (row) => row.fruitsId,
            cell: (row) => <span>{row.fruitsId}</span>,
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
            name: t("Scheme"),
            selector: (row) => row.schemeName,
            cell: (row) => <span>{row.schemeName}</span>,
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
            name: t("Sub Component"),
            selector: (row) => row.categoryName,
            cell: (row) => <span>{row.categoryName}</span>,
            sortable: true,
            hide: "md",
          },
         
          {
            name: t("Sanction Order Number"),
            selector: (row) => row.sanctionOrderNumber,
            cell: (row) => <span>{row.sanctionOrderNumber}</span>,
            sortable: true,
            hide: "md",
          },

          {
            name: t("Work Order Number"),
            selector: (row) => row.workOrderNumber,
            cell: (row) => <span>{row.workOrderNumber}</span>,
            sortable: true,
            hide: "md",
          },

          {
            name: t("Arn"),
            selector: (row) => row.arn,
            cell: (row) => <span>{row.arn}</span>,
            sortable: true,
            hide: "md",
          },
          
        ];

  
  const handleDownload = () => {
    const selectedSanctionOrder = addressDetails.sanctionOrderNumber;
    if (!selectedSanctionOrder) {
      Swal.fire({
        icon: "warning",
        title: t("Selection Required", { ns: "reports" }),
        html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fffbeb,#fef9ec);border:1.5px solid #fcd34d;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#fbbf24);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;box-shadow:0 4px 10px rgba(245,158,11,0.3)">⚠️</div><div><p style="color:#92400e;font-size:14px;font-weight:700;margin:0 0 5px">${t("Action Needed", { ns: "reports" })}</p><p style="color:#78350f;font-size:13px;margin:0;line-height:1.65">${t("Please select a <b>Sanction Order Number</b> from the dropdown before generating the PDF.", { ns: "reports" })}</p></div></div></div>`,
        confirmButtonText: t("Got it", { ns: "reports" }),
        confirmButtonColor: "#d97706",
        background: "#fff",
        showClass: { popup: "animate__animated animate__headShake animate__faster" },
        customClass: { popup: "swal-pop" },
      });
      return;
    }
    if (sanctionOrderForScheme === "Bivoltine Bonus") {
      downloadBonusIncentiveSeedCocoon(selectedSanctionOrder);
    } else if (sanctionOrderForScheme === "Incentive For Bivoltine Cocoons-30/kg-PSF") {
      generateReportFor30Rs(selectedSanctionOrder);
    } else if (sanctionOrderForScheme === "North Karnataka Cocoon Transportation Incentive-10/kg-PSF/SDP") {
      generateReportForNorthKarnataka(selectedSanctionOrder);
    } else if (sanctionOrderForScheme === "MSC Chawki incentive Unit cost for 100 DFLs Rs.1500") {
      generateReportFor1500dfls(selectedSanctionOrder);
    } else if (sanctionOrderForScheme === "Incentive For Bivoltine Chawki Rearing Cost") {
      generateReportFor100Rs(selectedSanctionOrder);
    } else if (sanctionOrderForScheme === "Silk Incentive-PSF") {
      generateReportForSilkIncentive(allApplicationIds, selectedSanctionOrder);
    } else if (sanctionOrderForScheme === "Reeling Shed-PSF") {
      generateReportForReelingShed(applicationFormId, selectedSanctionOrder);
    } else if (sanctionOrderForScheme === "Adopting Heat Recovery Unit-PSF") {
      generateReportForHRU(applicationFormId, selectedSanctionOrder);
    } else if (sanctionOrderForScheme === "Registered Private Bivoltine Chawki Rearing Center Subsidy") {
      generateReportForRegisteredPrivate(applicationFormId, selectedSanctionOrder);
    } else if (sanctionOrderForScheme === "Rearing Equipment SS") {
      generateReportForRearingEquipment(applicationFormId, selectedSanctionOrder);
    } else {
      Swal.fire({
        icon: "error",
        title: t("Report Not Available", { ns: "reports" }),
        html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;box-shadow:0 4px 10px rgba(229,62,62,0.3)">📭</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">${t("Not Configured", { ns: "reports" })}</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${t("No downloadable report is configured for the selected Sanction Order scheme.", { ns: "reports" })}</p></div></div></div>`,
        confirmButtonText: t("Close"),
        confirmButtonColor: "#e53e3e",
        background: "#fff",
        showClass: { popup: "animate__animated animate__shakeX animate__faster" },
        customClass: { popup: "swal-pop" },
      });
    }
  };

  const downloadBonusIncentiveSeedCocoon = (selectedSanctionOrder) => {
    const type = Number(subSchemeType);
    if (type === 2) {
      generateReportForIncentive(listData, selectedSanctionOrder);
    } else if (type === 3) {
      generateReportForBonus(listData, selectedSanctionOrder);
    } else if (type === 4) {
      generateReportForSeedCocoon(listData, selectedSanctionOrder);
    } else {
      Swal.fire({
        icon: "error",
        title: t("Unsupported Scheme Type", { ns: "reports" }),
        html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;box-shadow:0 4px 10px rgba(229,62,62,0.3)">⛔</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">${t("Not Supported", { ns: "reports" })}</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${t("The selected sub-scheme type is not supported for PDF generation.", { ns: "reports" })}</p></div></div></div>`,
        confirmButtonText: t("Close"),
        confirmButtonColor: "#e53e3e",
        background: "#fff",
        showClass: { popup: "animate__animated animate__shakeX animate__faster" },
        customClass: { popup: "swal-pop" },
      });
    }
  };

  const generateReportForIncentive = async (rows, selectedSanctionOrder) => {
    try {
      const response = await api.post(baseURLReport + `get-Incentive`, { userMasterId: localStorage.getItem("userMasterId"), schemeId: addressDetails.scSchemeDetailsId, subSchemeId: addressDetails.subSchemeId, applicationFormIds: allApplicationIds, sanctionOrderNumber: selectedSanctionOrder }, { responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([response.data], { type: "application/pdf" })));
    } catch (error) {}
  };

  const generateReportForBonus = async (rows, selectedSanctionOrder) => {
    try {
      const response = await api.post(baseURLReport + `get-Bonus`, { userMasterId: localStorage.getItem("userMasterId"), schemeId: addressDetails.scSchemeDetailsId, subSchemeId: addressDetails.subSchemeId, applicationFormIds: allApplicationIds, sanctionOrderNumber: selectedSanctionOrder }, { responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([response.data], { type: "application/pdf" })));
    } catch (error) {}
  };

  const generateReportForSeedCocoon = async (rows, selectedSanctionOrder) => {
    try {
      const response = await api.post(baseURLReport + `get-seed-cocoon`, { userMasterId: localStorage.getItem("userMasterId"), schemeId: addressDetails.scSchemeDetailsId, subSchemeId: addressDetails.subSchemeId, applicationFormIds: allApplicationIds, sanctionOrderNumber: selectedSanctionOrder }, { responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([response.data], { type: "application/pdf" })));
    } catch (error) {}
  };

  const generateReportForNorthKarnataka = async (rows, selectedSanctionOrder) => {
    try {
      const response = await api.post(baseURLReport + `get-TransportSubsidy`, { userMasterId: localStorage.getItem("userMasterId"), schemeId: addressDetails.scSchemeDetailsId, subSchemeId: addressDetails.subSchemeId, applicationFormIds: allApplicationIds, sanctionOrderNumber: selectedSanctionOrder }, { responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([response.data], { type: "application/pdf" })));
    } catch (error) {}
  };

  const generateReportFor30Rs = async (rows, selectedSanctionOrder) => {
    try {
      const response = await api.post(baseURLReport + `get-PriceStabilizationIncentive`, { userMasterId: localStorage.getItem("userMasterId"), schemeId: addressDetails.scSchemeDetailsId, subSchemeId: addressDetails.subSchemeId, applicationFormIds: allApplicationIds, sanctionOrderNumber: selectedSanctionOrder }, { responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([response.data], { type: "application/pdf" })));
    } catch (error) {}
  };

  const generateReportFor100Rs = async (rows, selectedSanctionOrder) => {
    try {
      const response = await api.post(baseURLReport + `get-MscSeedChawki1000`, { userMasterId: localStorage.getItem("userMasterId"), schemeId: addressDetails.scSchemeDetailsId, subSchemeId: addressDetails.subSchemeId, applicationFormIds: allApplicationIds, sanctionOrderNumber: selectedSanctionOrder }, { responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([response.data], { type: "application/pdf" })));
    } catch (error) {}
  };

  const generateReportForSilkIncentive = async (rows, selectedSanctionOrder) => {
    try {
      const response = await api.post(baseURLReport + `sanction-silk-incentive`, { userMasterId: localStorage.getItem("userMasterId"), schemeId: addressDetails.scSchemeDetailsId, subSchemeId: addressDetails.subSchemeId, applicationFormIds: allApplicationIds, sanctionOrderNumber: selectedSanctionOrder }, { responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([response.data], { type: "application/pdf" })));
    } catch (error) {}
  };

  const generateReportForReelingShed = async (rows, selectedSanctionOrder) => {
    try {
      const response = await api.post(baseURLReport + `sanction-psfa-reeling-shed`, { schemeId: addressDetails.scSchemeDetailsId, subSchemeId: addressDetails.subSchemeId, categoryId: addressDetails.scCategoryId, applicationFormId: applicationFormId, sanctionOrderNumber: selectedSanctionOrder }, { responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([response.data], { type: "application/pdf" })));
    } catch (error) {}
  };

  const generateReportForHRU = async (rows, selectedSanctionOrder) => {
    try {
      const response = await api.post(baseURLReport + `sanction-heat-unit`, { schemeId: addressDetails.scSchemeDetailsId, subSchemeId: addressDetails.subSchemeId, categoryId: addressDetails.scCategoryId, applicationFormId: applicationFormId, sanctionOrderNumber: selectedSanctionOrder }, { responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([response.data], { type: "application/pdf" })));
    } catch (error) {}
  };

  const generateReportForRegisteredPrivate = async (rows, selectedSanctionOrder) => {
    try {
      const response = await api.post(baseURLReport + `getChawkiSanctionOrderPdf`, { schemeId: addressDetails.scSchemeDetailsId, subSchemeId: addressDetails.subSchemeId, categoryId: addressDetails.scCategoryId, applicationFormId: applicationFormId, sanctionOrderNumber: selectedSanctionOrder }, { responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([response.data], { type: "application/pdf" })));
    } catch (error) {}
  };

  const generateReportForRearingEquipment = async (rows, selectedSanctionOrder) => {
    try {
      const response = await api.post(baseURLReport + `getSanctionOrderRHEquipment`, { schemeId: addressDetails.scSchemeDetailsId, subSchemeId: addressDetails.subSchemeId, categoryId: addressDetails.scCategoryId, applicationFormId: applicationFormId, sanctionOrderNumber: selectedSanctionOrder }, { responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([response.data], { type: "application/pdf" })));
    } catch (error) {}
  };

  const generateReportFor1500dfls = async (rows, selectedSanctionOrder) => {
    try {
      const response = await api.post(baseURLReport + `get-MscSeedChawki`, { userMasterId: localStorage.getItem("userMasterId"), schemeId: addressDetails.scSchemeDetailsId, subSchemeId: addressDetails.subSchemeId, applicationFormIds: allApplicationIds, sanctionOrderNumber: selectedSanctionOrder }, { responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([response.data], { type: "application/pdf" })));
    } catch (error) {}
  };

  const [isDownloading, setIsDownloading] = useState(false);

  const downloadFile = async () => {
    if (!securityKey) {
      Swal.fire({
        icon: "info",
        title: t("No File Found", { ns: "reports" }),
        html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#ebf8ff,#fff);border:1.5px solid #90cdf4;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#1e67a8,#2d9cdb);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;box-shadow:0 4px 10px rgba(30,103,168,0.3)">📂</div><div><p style="color:#2c5282;font-size:14px;font-weight:700;margin:0 0 5px">${t("No Pre-Generated PDF", { ns: "reports" })}</p><p style="color:#2a4365;font-size:13px;margin:0;line-height:1.65">${t("No pre-generated PDF was found for this sanction order. Try <b>Generate PDF</b> instead.", { ns: "reports" })}</p></div></div></div>`,
        confirmButtonText: t("OK", { ns: "reports" }),
        confirmButtonColor: "#1e67a8",
        background: "#fff",
        showClass: { popup: "animate__animated animate__fadeInDown animate__faster" },
        customClass: { popup: "swal-pop" },
      });
      return;
    }
    setIsDownloading(true);
    try {
      const fileNameWithExtension = `${securityKey}.pdf`;
      const response = await api.get(
        baseURLDBT + "dashboard/downLoadFileForURL",
        {
          params: { fileName: fileNameWithExtension },
          responseType: "arraybuffer",
        }
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileNameWithExtension;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      Swal.fire({
        icon: "success",
        title: t("Download Complete!", { ns: "reports" }),
        html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#f0fff4,#fff);border:1.5px solid #9ae6b4;border-radius:14px;padding:18px 20px;text-align:center"><div style="font-size:34px;margin-bottom:10px">🎉</div><p style="color:#276749;font-size:14.5px;font-weight:700;margin:0 0 5px">${t("Sanction Order PDF Saved!", { ns: "reports" })}</p><p style="color:#2f855a;font-size:13px;margin:0;line-height:1.6">${t("Your file has been saved to your <b>Downloads</b> folder.", { ns: "reports" })}</p></div></div>`,
        confirmButtonText: "✓ " + t("Done", { ns: "reports" }),
        confirmButtonColor: "#38a169",
        background: "#fff",
        timer: 3000,
        timerProgressBar: true,
        showClass: { popup: "animate__animated animate__bounceIn animate__faster" },
        customClass: { popup: "swal-pop" },
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: t("Download Failed", { ns: "reports" }),
        html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left;margin-bottom:10px"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;box-shadow:0 4px 10px rgba(229,62,62,0.3)">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">${t("Could Not Download", { ns: "reports" })}</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${t("We couldn't retrieve the PDF. Please check your connection and try again.", { ns: "reports" })}</p></div></div><div style="background:#f7fafc;border-radius:10px;padding:10px 14px;display:flex;align-items:center;gap:8px"><span style="font-size:16px">💡</span><span style="color:#4a5568;font-size:12.5px">${t("If the problem persists, contact your system administrator.", { ns: "reports" })}</span></div></div>`,
        confirmButtonText: "🔄 " + t("Retry", { ns: "reports" }),
        confirmButtonColor: "#e53e3e",
        showCancelButton: true,
        cancelButtonText: t("Cancel"),
        cancelButtonColor: "#718096",
        background: "#fff",
        showClass: { popup: "animate__animated animate__shakeX animate__faster" },
        customClass: { popup: "swal-pop" },
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // inject Swal custom styles once
  if (!document.getElementById("swal-custom-styles")) {
    const style = document.createElement("style");
    style.id = "swal-custom-styles";
    style.innerHTML = `
      .swal-pop { border-radius: 22px !important; padding: 8px !important; box-shadow: 0 30px 90px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.03) !important; }
      .swal-pop .swal2-title { font-size: 21px !important; font-weight: 800 !important; color: #1a202c !important; letter-spacing: -0.02em !important; padding-top: 2px !important; }
      .swal-pop .swal2-icon { margin: 20px auto 4px !important; }
      .swal-pop .swal2-html-container { margin: 0 !important; padding: 0 !important; }
      .swal-pop .swal2-actions { gap: 10px !important; padding-bottom: 4px !important; margin-top: 2px !important; }
      .swal-pop .swal2-confirm, .swal-pop .swal2-cancel { border-radius: 11px !important; padding: 12px 30px !important; font-weight: 700 !important; font-size: 14px !important; letter-spacing: 0.02em !important; box-shadow: 0 4px 14px rgba(0,0,0,0.13) !important; }
      .swal-pop .swal2-timer-progress-bar { height: 4px !important; border-radius: 0 0 4px 4px !important; }
    `;
    document.head.appendChild(style);
  }

  const selectStyle = {
    borderRadius: "8px",
    border: "1.5px solid #d0d9e8",
    padding: "8px 12px",
    fontSize: "14px",
    background: "#f8fafd",
    color: "#333",
    width: "100%",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    fontSize: "13px",
    fontWeight: 600,
    color: "#4a5568",
    marginBottom: "5px",
    display: "block",
  };

  const fieldGroupStyle = {
    display: "flex",
    flexDirection: "column",
    marginBottom: "4px",
  };

  return (
    <Layout title={t("Generate Sanction Order", { ns: "reports" })}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Generate Sanction Order", { ns: "reports" })}</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card
          className="mt-1"
          style={{
            borderRadius: "14px",
            border: "none",
            boxShadow: "0 4px 24px rgba(30,103,168,0.10)",
            overflow: "hidden",
          }}
        >
          {/* Card Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #1e67a8 0%, #2d9cdb 100%)",
              padding: "18px 28px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
              }}
            >
              📄
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: "17px", lineHeight: 1.2 }}>
                {t("Sanction Order Filter", { ns: "reports" })}
              </div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px", marginTop: "2px" }}>
                {t("Select filters to load and download sanction order", { ns: "reports" })}
              </div>
            </div>
          </div>

          <Card.Body style={{ padding: "28px 32px 24px" }}>

            {/* Fruits ID — first field */}
            <Row className="mb-3">
              <Col md={6} style={fieldGroupStyle}>
                <label style={labelStyle}>{t("Fruits ID", { ns: "reports" })}</label>
                <Form.Control
                  type="text"
                  name="fruitsId"
                  value={addressDetails.fruitsId || ""}
                  onChange={handleInputsaddress}
                  placeholder={t("Enter Fruits ID", { ns: "reports" })}
                  style={selectStyle}
                />
              </Col>
            </Row>

            {/* Section label */}
            <div
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#1e67a8",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "18px",
              }}
            >
              {t("Step 1 — Select Scheme Details", { ns: "reports" })}
            </div>

            {/* Row 1 — Financial Year & Scheme */}
            <Row className="mb-3">
              <Col md={6} style={fieldGroupStyle}>
                <label style={labelStyle}>{t("Financial Year")}</label>
                <Form.Select
                  name="financialYearId"
                  value={addressDetails.financialYearId || ""}
                  onChange={handleInputsaddress}
                  style={selectStyle}
                >
                  <option value="">{`— ${t("Select Financial Year")} —`}</option>
                  {financialyearListData.map((list) => (
                    <option key={list.financialYearMasterId} value={list.financialYearMasterId}>
                      {list.financialYear}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col md={6} style={fieldGroupStyle}>
                <label style={labelStyle}>{t("Scheme")}</label>
                <Form.Select
                  name="scSchemeDetailsId"
                  value={addressDetails.scSchemeDetailsId || ""}
                  onChange={handleInputsaddress}
                  style={selectStyle}
                >
                  <option value="">{`— ${t("Select Scheme")} —`}</option>
                  {scSchemeDetailsListData && scSchemeDetailsListData.length
                    ? scSchemeDetailsListData.map((list) => (
                        <option key={list.scSchemeDetailsId} value={list.scSchemeDetailsId}>
                          {i18n.language === "kn" ? (list.schemeNameInKannada || list.schemeName) : list.schemeName}
                        </option>
                      ))
                    : ""}
                </Form.Select>
              </Col>
            </Row>

            {/* Row 2 — Component Type & Component */}
            <Row className="mb-3">
              <Col md={6} style={fieldGroupStyle}>
                <label style={labelStyle}>{t("Component Type")}</label>
                <Form.Select
                  name="subSchemeId"
                  value={addressDetails.subSchemeId || ""}
                  onChange={handleInputsaddress}
                  style={selectStyle}
                >
                  <option value="">{`— ${t("Select Component Type")} —`}</option>
                  {scSubSchemeDetailsListData && scSubSchemeDetailsListData.length
                    ? scSubSchemeDetailsListData.map((list) => (
                        <option key={list.scSubSchemeDetailsId} value={list.subSchemeId}>
                          {i18n.language === "kn" ? (list.subSchemeNameInKannada || list.subSchemeName) : list.subSchemeName}
                        </option>
                      ))
                    : ""}
                </Form.Select>
              </Col>

              <Col md={6} style={fieldGroupStyle}>
                <label style={labelStyle}>{t("Component")}</label>
                <Form.Select
                  name="componentId"
                  value={addressDetails.componentId || ""}
                  onChange={handleInputsaddress}
                  style={selectStyle}
                >
                  <option value="">{`— ${t("Select Component")} —`}</option>
                  {scComponentListData && scComponentListData.length
                    ? scComponentListData.map((list) => (
                        <option key={list.scComponentId} value={list.scComponentId}>
                          {i18n.language === "kn" ? (list.scComponentNameInKannada || list.scComponentName) : list.scComponentName}
                        </option>
                      ))
                    : ""}
                </Form.Select>
              </Col>
            </Row>

            {/* Row 3 — Sub Component */}
            <Row className="mb-4">
              <Col md={6} style={fieldGroupStyle}>
                <label style={labelStyle}>{t("Sub Component")}</label>
                <Form.Select
                  name="scCategoryId"
                  value={addressDetails.scCategoryId || ""}
                  onChange={handleInputsaddress}
                  style={selectStyle}
                >
                  <option value="">{`— ${t("Select Sub Component")} —`}</option>
                  {scCategoryListData && scCategoryListData.length
                    ? scCategoryListData.map((list) => (
                        <option key={list.scCategoryId} value={list.scCategoryId}>
                          {i18n.language === "kn" ? (list.categoryNameInKannada || list.categoryName) : list.categoryName}
                        </option>
                      ))
                    : ""}
                </Form.Select>
              </Col>
            </Row>

            {/* Divider with Step 2 label */}
            <div
              style={{
                borderTop: "1.5px dashed #d0d9e8",
                margin: "8px 0 20px",
              }}
            />
            <div
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#1e67a8",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "18px",
              }}
            >
              {t("Step 2 — Select Sanction Order & Download", { ns: "reports" })}
            </div>

            {/* Row 4 — Sanction Order + Buttons */}
            <Row className="align-items-end">
              <Col md={5} style={fieldGroupStyle}>
                <label style={labelStyle}>{t("Sanction Order Number", { ns: "reports" })}</label>
                <SearchableSelect
                  name="sanctionOrderNumber"
                  value={addressDetails.sanctionOrderNumber}
                  onChange={(val) =>
                    handleSanctionOrderChange({
                      target: { name: "sanctionOrderNumber", value: val },
                    })
                  }
                  placeholder={`— ${t("Select Sanction Order", { ns: "reports" })} —`}
                  options={(sanctionOrderNumbers || []).map((num) =>
                    typeof num === "object" ? num.sanctionOrderNumber : num
                  )}
                />
                {!securityKey && addressDetails.sanctionOrderNumber && (
                  <small style={{ color: "#e53e3e", fontSize: "12px", marginTop: "4px" }}>
                    {t("No pre-generated file found for this order.", { ns: "reports" })}
                  </small>
                )}
              </Col>

              <Col md={7} className="d-flex gap-3 flex-wrap pb-1">
                {/* Download PDF — uses security key */}
                <button
                  type="button"
                  onClick={downloadFile}
                  disabled={!addressDetails.sanctionOrderNumber || isDownloading}
                  style={{
                    background:
                      addressDetails.sanctionOrderNumber && !isDownloading
                        ? "linear-gradient(135deg, #1e67a8, #2d9cdb)"
                        : "#c8d6e5",
                    border: "none",
                    borderRadius: "9px",
                    padding: "10px 26px",
                    fontWeight: 700,
                    fontSize: "14px",
                    color: "#fff",
                    cursor: addressDetails.sanctionOrderNumber && !isDownloading ? "pointer" : "not-allowed",
                    boxShadow:
                      addressDetails.sanctionOrderNumber && !isDownloading
                        ? "0 4px 14px rgba(30,103,168,0.35)"
                        : "none",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    minWidth: "160px",
                    justifyContent: "center",
                  }}
                >
                  {isDownloading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                      {t("Downloading…", { ns: "reports" })}
                    </>
                  ) : (
                    <>⬇ {t("Download PDF")}</>
                  )}
                </button>

                {/* Generate PDF — uses scheme-based report endpoints */}
                {/* <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!addressDetails.sanctionOrderNumber}
                  style={{
                    background: addressDetails.sanctionOrderNumber
                      ? "linear-gradient(135deg, #1a7a4a, #28a745)"
                      : "#c8d6e5",
                    border: "none",
                    borderRadius: "9px",
                    padding: "10px 26px",
                    fontWeight: 700,
                    fontSize: "14px",
                    color: "#fff",
                    cursor: addressDetails.sanctionOrderNumber ? "pointer" : "not-allowed",
                    boxShadow: addressDetails.sanctionOrderNumber
                      ? "0 4px 14px rgba(26,122,74,0.35)"
                      : "none",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    minWidth: "160px",
                    justifyContent: "center",
                  }}
                >
                  🖨 Generate PDF
                </button> */}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Block>
    </Layout>
  );
}

export default GenerateSanctionOrder;
