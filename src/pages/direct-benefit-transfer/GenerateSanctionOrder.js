import React, { useEffect, useState } from "react";
import api from "../../services/auth/api";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Button, Card, Form, Row, Col } from "react-bootstrap";
import DataTable, { defaultThemes } from "react-data-table-component";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

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
    const { t } = useTranslation();

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
        setScApplicationFormServiceId(recordData?.scApplicationFormServiceId);
        setWorkOrderSchemeId(recordData?.schemeId);

        setWorkOrderNumber(recordData?.workOrderNumber);
        setWorkOrderForScheme(recordData?.workOrderForScheme);

        setSanctionOrderNumber(recordData?.sanctionOrderNumber);
        setSanctionOrderForScheme(recordData?.sanctionOrderForScheme);
        setCategoryId(recordData?.categoryId);
        setSubSchemeId(recordData?.subSchemeId);
        setSchemeId(recordData?.schemeId);
        setSubSchemeType(recordData?.subSchemeType);
        setLoading(false);
    })
    .catch((err) => {
      setListData([]);
    });
};

const [applicationFormId, setApplicationFormId] = useState(null);
const [scApplicationFormServiceId, setScApplicationFormServiceId] = useState(null);
const [workOrderSchemeId, setWorkOrderSchemeId] = useState(null);
const [categoryId, setCategoryId] = useState(null);
const [subSchemeId, setSubSchemeId] = useState(null);
const [schemeId, setSchemeId] = useState(null);
const [workOrderNumber, setWorkOrderNumber] = useState(null);
const [workOrderForScheme, setWorkOrderForScheme] = useState(null);
const [sanctionOrderNumber, setSanctionOrderNumber] = useState(null);
const [sanctionOrderForScheme, setSanctionOrderForScheme] = useState(null);
const [allApplicationIds, setAllApplicationIds] = useState([]);
const [subSchemeType, setSubSchemeType] = useState([]);

const getList = () => {
    setLoading(true);
    api
      .post(
        baseURLDBT + `service/getSanctionOrderData`,
        {},
        {
          params: {
             schemeId: addressDetails.schemeId || 0,
          subSchemeId: addressDetails.subSchemeId || 0,
          componentId: addressDetails.componentId || 0,
          scCategoryId: addressDetails.scCategoryId || 0,
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
        setScApplicationFormServiceId(recordData?.scApplicationFormServiceId);
        setWorkOrderSchemeId(recordData?.schemeId);

        setWorkOrderNumber(recordData?.workOrderNumber);
        setWorkOrderForScheme(recordData?.workOrderForScheme);

        setSanctionOrderNumber(recordData?.sanctionOrderNumber);
        setSanctionOrderForScheme(recordData?.sanctionOrderForScheme);
        setCategoryId(recordData?.categoryId);
        setSubSchemeId(recordData?.subSchemeId);
        setSubSchemeType(recordData?.subSchemeType);
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
          `service/getSanctionOrderNumbers?financialYearId=${addressDetails.financialYearId}&schemeId=${addressDetails.scSchemeDetailsId}&subSchemeId=${addressDetails.subSchemeId}&componentId=${addressDetails.componentId}&categoryId=${addressDetails.scCategoryId}`
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
            name: t("farmer_name"),
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

  
  const handleDownloadSanctionOrder = (
      applicationFormId,
      schemeId,
      schemeType,
      subSchemeId,
      categoryId
    ) => {
      Swal.fire({
        title: "Generate Sanction Order",
        text: "Select the recipient:",
        showCancelButton: true,
        confirmButtonText: "Farmer/Reeler",
        cancelButtonText: "Company",
        showCloseButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          // ✅ Farmer
          if (schemeType === "PMKSY" || schemeType === "PDMC") {
            downloadSanctionOrderAcknowledgment(applicationFormId, schemeId, "farmer", schemeType);
          } else if (
            schemeType === "Silk Samagra State" ||
            schemeType === "Silk Samagra Central"
          ) {
            downloadSanctionOrderAcknowledgment(
              applicationFormId,
              schemeId,
              "farmer",
              schemeType,
              subSchemeId,
              categoryId
            );
          } else {
            console.error("Unknown scheme type for farmer sanction order.");
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // ✅ Company
          if (schemeType === "PMKSY" || schemeType === "PDMC") {
            downloadSanctionOrderAcknowledgment(applicationFormId, schemeId, "company", schemeType);
          } else if (
            schemeType === "Silk Samagra State" ||
            schemeType === "Silk Samagra Central"
          ) {
            downloadSanctionOrderAcknowledgment(
              applicationFormId,
              schemeId,
              "company",
              schemeType,
              subSchemeId,
              categoryId
            );
          } else {
            console.error("Unknown scheme type for company sanction order.");
          }
        }
      });
    };
    
     const downloadSanctionOrderAcknowledgment = async (
       applicationId,
       schemeId,
       recipientType,
       schemeType,
       subSchemeId,
       categoryId,
       userId
     ) => {
       try {
         const userId = localStorage.getItem("userMasterId");
         let endpoint;
     
         if (
           schemeType === "Silk Samagra State" ||
           schemeType === "Silk Samagra Central"
         ) {
           endpoint = baseURLReport + `getSanctionOrderRH`;
         } else {
           if (recipientType === "farmer") {
             endpoint =
               schemeType === "PMKSY"
                 ? baseURLReport + `getSanctionOrderPmksy`
                 : baseURLReport + `getSanctionOrderPDMC`;
           } else if (recipientType === "company") {
             endpoint =
               schemeType === "PMKSY"
                 ? baseURLReport + `getSanctionOrderPmksyCompany`
                 : baseURLReport + `getSanctionOrderPDMCCompany`;
           } else {
             throw new Error("Invalid recipient type.");
           }
         }
     
         const payload =
           schemeType === "Silk Samagra State" || schemeType === "Silk Samagra Central"
             ? {
                 applicationFormId: applicationId,
                 schemeId,
                 subSchemeId,
                 categoryId,
                 userId,
               }
             : {
                 applicationFormId: applicationId,
                 schemeId,
               };
     
         const response = await api.post(endpoint, payload, {
           responseType: "blob",
         });
     
         const file = new Blob([response.data], { type: "application/pdf" });
         const fileURL = URL.createObjectURL(file);
         window.open(fileURL);
       } catch (error) {
         console.error("Error generating sanction order:", error);
       }
     };

     const handleDownload = () => {
  const selectedSanctionOrder = addressDetails.sanctionOrderNumber;

  if (!selectedSanctionOrder) {
    Swal.fire({
      icon: "warning",
      title: "Sanction Order Required",
      text: "Please select a Sanction Order Number",
      confirmButtonColor: "#3085d6",
    });
    return;
  }

  // --- Conditions based on sanctionOrderForScheme ---
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
    generateReportForSilkIncentive(selectedSanctionOrder);

  } else {
    Swal.fire({
      icon: "error",
      title: "Invalid Selection",
      text: "No download available for selected Sanction Order",
      confirmButtonColor: "#d33",
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
    alert("Invalid Sub Scheme Type");
  }
};


// const generateReportForIncentive = async (rows, selectedSanctionOrder) => {
//   const applicationFormIds = rows.map(r => r.applicationDocumentId);

//   await api.post(
//     baseURLReport + `get-Incentive`,
//     {
//       userMasterId: localStorage.getItem("userMasterId"),
//       schemeId:addressDetails.scSchemeDetailsId,
//       subSchemeId:addressDetails.subSchemeId,
//       applicationFormIds: allApplicationIds,
//       sanctionOrderNumber: selectedSanctionOrder,
//     },
//     { responseType: "blob" }
//   );
// };

// const generateReportForBonus = async (rows, selectedSanctionOrder) => {
//   const applicationFormIds = rows.map(r => r.applicationDocumentId);

//   await api.post(
//     baseURLReport + `get-Bonus`,
//     {
//       userMasterId: localStorage.getItem("userMasterId"),
//       schemeId:addressDetails.scSchemeDetailsId,
//       subSchemeId:addressDetails.subSchemeId,
//       applicationFormIds: allApplicationIds,
//       sanctionOrderNumber: selectedSanctionOrder,
//     },
//     { responseType: "blob" }
//   );
// };

// const generateReportForSeedCocoon = async (rows, selectedSanctionOrder) => {
//   const applicationFormIds = rows.map(r => r.applicationDocumentId);

//   await api.post(
//     baseURLReport + `get-seed-cocoon`,
//     {
//       userMasterId: localStorage.getItem("userMasterId"),
//       schemeId:addressDetails.scSchemeDetailsId,
//       subSchemeId:addressDetails.subSchemeId,
//       applicationFormIds: allApplicationIds,
//       sanctionOrderNumber: selectedSanctionOrder,
//     },
//     { responseType: "blob" }
//   );
// };



        const generateReportForBonusIncentiveSeedCocoon = (selectedRows) => {
       if (subSchemeType === 2) {
         generateReportForIncentive(selectedRows);
       } else if (subSchemeType === 3) {
         generateReportForBonus(selectedRows);
       } else if (subSchemeType === 4) {
         generateReportForSeedCocoon(selectedRows);
       }
     };



     const generateReportForIncentive = async (rows, selectedSanctionOrder) => {
       try {
        //  const applicationFormIds = selectedRows.map(row => row.applicationDocumentId);
     
         const response = await api.post(
           baseURLReport + `get-Incentive`,
           {
            //  userMasterId: localStorage.getItem("userMasterId"),
            //  schemeId,
            //  subSchemeId,
            //  applicationFormIds,
            userMasterId: localStorage.getItem("userMasterId"),
            schemeId:addressDetails.scSchemeDetailsId,
            subSchemeId:addressDetails.subSchemeId,
            applicationFormIds: allApplicationIds,
            sanctionOrderNumber: selectedSanctionOrder,
           },
           {
             responseType: "blob",
           }
         );
     
         const file = new Blob([response.data], { type: "application/pdf" });
         const fileURL = URL.createObjectURL(file);
         window.open(fileURL);
       } catch (error) {
         // console.error("Error generating bonus report", error);
       }
     };
     
     const generateReportForBonus = async (rows, selectedSanctionOrder) => {
       try {
        //  const applicationFormIds = selectedRows.map(row => row.applicationDocumentId);
     
         const response = await api.post(
           baseURLReport + `get-Bonus`,
           {
            //  userMasterId: localStorage.getItem("userMasterId"),
            //  schemeId,
            //  subSchemeId,
            //  applicationFormIds,
            userMasterId: localStorage.getItem("userMasterId"),
            schemeId:addressDetails.scSchemeDetailsId,
            subSchemeId:addressDetails.subSchemeId,
            applicationFormIds: allApplicationIds,
            sanctionOrderNumber: selectedSanctionOrder,
           },
           {
             responseType: "blob",
           }
         );
     
         const file = new Blob([response.data], { type: "application/pdf" });
         const fileURL = URL.createObjectURL(file);
         window.open(fileURL);
       } catch (error) {
         // console.error("Error generating bonus report", error);
       }
     };
     
     const generateReportForSeedCocoon = async (rows, selectedSanctionOrder) => {
       try {
        //  const applicationFormIds = selectedRows.map(row => row.applicationDocumentId);
     
         const response = await api.post(
           baseURLReport + `get-seed-cocoon`,
           {
            //  userMasterId: localStorage.getItem("userMasterId"),
            //  schemeId,
            //  subSchemeId,
            //  applicationFormIds,
            userMasterId: localStorage.getItem("userMasterId"),
            schemeId:addressDetails.scSchemeDetailsId,
            subSchemeId:addressDetails.subSchemeId,
            applicationFormIds: allApplicationIds,
            sanctionOrderNumber: selectedSanctionOrder,
           },
           {
             responseType: "blob",
           }
         );
     
         const file = new Blob([response.data], { type: "application/pdf" });
         const fileURL = URL.createObjectURL(file);
         window.open(fileURL);
       } catch (error) {
         // console.error("Error generating seed cocoon report", error);
       }
     };

     const generateReportForNorthKarnataka = async (rows, selectedSanctionOrder) => {
       try {
        //  const applicationFormIds = selectedRows.map(row => row.applicationDocumentId);
     
         const response = await api.post(
           baseURLReport + `get-TransportSubsidy`,
           {
             userMasterId: localStorage.getItem("userMasterId"),
            schemeId:addressDetails.scSchemeDetailsId,
            subSchemeId:addressDetails.subSchemeId,
            applicationFormIds: allApplicationIds,
            sanctionOrderNumber: selectedSanctionOrder,
           },
           {
             responseType: "blob",
           }
         );
     
         const file = new Blob([response.data], { type: "application/pdf" });
         const fileURL = URL.createObjectURL(file);
         window.open(fileURL);
       } catch (error) {
         // console.error("Error generating bonus report", error);
       }
     };
     
     
     const generateReportFor30Rs = async (rows, selectedSanctionOrder) => {
       try {
        //  const applicationFormIds = selectedRows.map(row => row.applicationDocumentId);
     
         const response = await api.post(
           baseURLReport + `get-PriceStabilizationIncentive`,
           {
            //  userMasterId: localStorage.getItem("userMasterId"),
            //  schemeId,
            //  subSchemeId,
            //  applicationFormIds,
            userMasterId: localStorage.getItem("userMasterId"),
            schemeId:addressDetails.scSchemeDetailsId,
            subSchemeId:addressDetails.subSchemeId,
            applicationFormIds: allApplicationIds,
            sanctionOrderNumber: selectedSanctionOrder,
           },
           {
             responseType: "blob",
           }
         );
     
         const file = new Blob([response.data], { type: "application/pdf" });
         const fileURL = URL.createObjectURL(file);
         window.open(fileURL);
       } catch (error) {
         // console.error("Error generating bonus report", error);
       }
     };
     
     const generateReportFor100Rs = async (rows, selectedSanctionOrder) => {
       try {
        //  const applicationFormIds = selectedRows.map(row => row.applicationDocumentId);
     
         const response = await api.post(
           baseURLReport + `get-MscSeedChawki1000`,
           {
            //  userMasterId: localStorage.getItem("userMasterId"),
            //  schemeId,
            //  subSchemeId,
            //  applicationFormIds,
            userMasterId: localStorage.getItem("userMasterId"),
            schemeId:addressDetails.scSchemeDetailsId,
            subSchemeId:addressDetails.subSchemeId,
            applicationFormIds: allApplicationIds,
            sanctionOrderNumber: selectedSanctionOrder,
           },
           {
             responseType: "blob",
           }
         );
     
         const file = new Blob([response.data], { type: "application/pdf" });
         const fileURL = URL.createObjectURL(file);
         window.open(fileURL);
       } catch (error) {
         // console.error("Error generating bonus report", error);
       }
     };

      const generateReportForSilkIncentive = async (rows, selectedSanctionOrder) => {
       try {
        //  const applicationFormIds = selectedRows.map(row => row.applicationDocumentId);
     
         const response = await api.post(
           baseURLReport + `sanction-silk-incentive`,
           {
            //  userMasterId: localStorage.getItem("userMasterId"),
            //  schemeId,
            //  subSchemeId,
            //  applicationFormIds,
            userMasterId: localStorage.getItem("userMasterId"),
            schemeId:addressDetails.scSchemeDetailsId,
            subSchemeId:addressDetails.subSchemeId,
            applicationFormIds: allApplicationIds,
            sanctionOrderNumber: selectedSanctionOrder,
           },
           {
             responseType: "blob",
           }
         );
     
         const file = new Blob([response.data], { type: "application/pdf" });
         const fileURL = URL.createObjectURL(file);
         window.open(fileURL);
       } catch (error) {
         // console.error("Error generating bonus report", error);
       }
     };
     
     
     const generateReportFor1500dfls = async (rows, selectedSanctionOrder) => {
       try {
        //  const applicationFormIds = selectedRows.map(row => row.applicationDocumentId);
     
         const response = await api.post(
           baseURLReport + `get-MscSeedChawki`,
           {
            //  userMasterId: localStorage.getItem("userMasterId"),
            //  schemeId,
            //  subSchemeId,
            //  applicationFormIds,
            userMasterId: localStorage.getItem("userMasterId"),
            schemeId:addressDetails.scSchemeDetailsId,
            subSchemeId:addressDetails.subSchemeId,
            applicationFormIds: allApplicationIds,
            sanctionOrderNumber: selectedSanctionOrder,
           },
           {
             responseType: "blob",
           }
         );
     
         const file = new Blob([response.data], { type: "application/pdf" });
         const fileURL = URL.createObjectURL(file);
         window.open(fileURL);
       } catch (error) {
         // console.error("Error generating bonus report", error);
       }
     };

  

  return (
    <Layout title="Generate Sanction Order">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Sanction Order Download</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

     <Block className="mt-n4">
       <Card className="mt-1">
         <Row className="m-2">
           <Col>
             <Form.Group className="form-group" id="fid">
    
               <Row className="mb-3">
                        <Form.Label column sm={1}>
                          Type
                          {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                         <Col sm={3}>
                          <Form.Select
                            name="type"
                            value={addressDetails.type}
                            onChange={handleInputsaddress}
                            // required
                            // isInvalid={
                            //   data.calculationBasedOn === undefined ||
                            //   data.calculationBasedOn === "0"
                            // }
                          >
                            <option value="">
                              Select Type
                            </option>
                            {/* <option value="Acknowledgement">Acknowledgement</option>
                            <option value="Work Order">Work Order</option> */}
                            <option value="Sanction Order">Sanction Order</option>
                            {/* <option value="Sericulture Development Programme">Sericulture Development Programme</option>
                            <option value="Silk Samagra State">Silk Samagra State</option>
                            <option value="Silk Samagra Central">Silk Samagra Central</option>
                            <option value="Bivoltine Bonus">Bivoltine Bonus</option>
                            <option value="Silk Incentive-PSF">Silk Incentive-PSF</option>
                            <option value="IMCB-PSF">IMCB-PSF</option>
                            <option value="ICB-PSF">ICB-PSF</option>
                            <option value="MERM-PSF">MERM-PSF</option>
                            <option value="Atomatic Reeling Machine">Atomatic Reeling Machine</option>
                            <option value="Reeling Shed-PSF">Reeling Shed-PSF</option>
                            <option value="Adopting Heat Recovery Unit-PSF">Adopting Heat Recovery Unit-PSF</option>
                            <option value="Adopting Boiler-PSF">Adopting Boiler-PSF</option> */}
                          </Form.Select>
                          </Col>

                        <Form.Label column sm={1}>
                          {t("Financial Year")}
                        </Form.Label>
                        <Col sm={3}>
                          <Form.Select
                            name="financialYearId"
                            value={addressDetails.financialYearId || 0}
                            onChange={handleInputsaddress}
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
                        </Col>
     
               <Form.Label column sm={1}>
                   Scheme
                 </Form.Label>
                 <Col sm={3}>
                   <Form.Select
                     name="scSchemeDetailsId"
                     value={addressDetails.scSchemeDetailsId || 0}
                     onChange={handleInputsaddress}
                   >
                     <option value="">Select Scheme Name</option>
                     {scSchemeDetailsListData && scSchemeDetailsListData.length ?
                       scSchemeDetailsListData.map((list) => (
                         <option
                           key={list.scSchemeDetailsId}
                           value={list.scSchemeDetailsId}
                         >
                           {list.schemeName}
                       </option>
                     ))
                           : ""}
                   </Form.Select>
                 </Col>
                 </Row> 
     
     <Row className="mb-3">
                <Form.Label column sm={1}>
                 Component Type
               </Form.Label>
               <Col sm={3}>
                 <Form.Select
                   name="subSchemeId"
                   value={addressDetails.subSchemeId || 0}
                   onChange={handleInputsaddress}
                 >
                   <option value="">Select Component Type</option>
                   {scSubSchemeDetailsListData && scSubSchemeDetailsListData.length
                           ? scSubSchemeDetailsListData.map((list) => (
                     <option
                       key={list.scSubSchemeDetailsId}
                       value={list.subSchemeId}
                     >
                       {list.subSchemeName}
                     </option>
                   ))
                   : ""}
                 </Form.Select>
               </Col>
                
     
     
                 <Form.Label column sm={1}>
                   Component
                 </Form.Label>
                 <Col sm={3}>
                   <Form.Select
                     name="componentId"
                     value={addressDetails.componentId || 0}
                     onChange={handleInputsaddress}
                   >
                     <option value="">Select Component</option>
                     {scComponentListData  && scComponentListData.length
                           ? scComponentListData.map((list) => (
                       <option key={list.scComponentId} value={list.scComponentId}>
                         {list.scComponentName}
                       </option>
                    ))
                           : ""}
                   </Form.Select>
                 </Col> 
                
     
                 
               
     
               {/* Row 3 */}
               
     
               <Form.Label column sm={1}>
                   Sub Component
                 </Form.Label>
                 <Col sm={3}>
                   <Form.Select
                     name="scCategoryId"
                     value={addressDetails.scCategoryId || 0}
                     onChange={handleInputsaddress}
                   >
                     <option value="">Select Sub Component</option>
                     {scCategoryListData &&
                       scCategoryListData.length ? scCategoryListData.map((list) => (
                         <option
                           key={list.scCategoryId}
                           value={list.scCategoryId}
                         >
                           {list.categoryName}
                       </option>
                     ))
                           : ""}
                   </Form.Select>
                 </Col> 
                 </Row>

          <Row className="mb-3">
                 <Form.Label column sm={1}>
                    Sanction Order
                  </Form.Label>
                  <Col sm={3}>
                    <Form.Select
                      name="sanctionOrderNumber"
                      value={addressDetails.sanctionOrderNumber}
                      onChange={handleSanctionOrderChange}
                    >
                      <option value="">Select Sanction Order</option>
                      {sanctionOrderNumbers && sanctionOrderNumbers.length
                        ? sanctionOrderNumbers.map((num, index) => (
                            <option key={index} value={num}>
                              {num}
                            </option>
                          ))
                        : ""}
                    </Form.Select>
                  </Col>


     
                 <Col sm={2} className="d-flex">
                   <Button
                      type="button"
                      variant="primary"
                      onClick={handleDownload}
                      className="me-2"
                      disabled={!addressDetails.sanctionOrderNumber}
                    >
                      Download
                    </Button>

                   {/* <Button type="button" variant="primary" onClick={exportCsv}>
                     Export
                   </Button> */}
                 </Col>
               </Row>
     
             </Form.Group>
           </Col>
         </Row>
       </Card>
     </Block>


     {/* <Block className='mt-3'>
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
                 theme="solarized"
                 customStyles={customStyles}
               />
             </Card>
     
           
     
           </Block> */}
    </Layout>
  );
}

export default GenerateSanctionOrder;
