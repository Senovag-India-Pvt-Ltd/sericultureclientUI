import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import DatePicker from "react-datepicker";
import DataTable from "react-data-table-component";
import { Icon, Select } from "../../../components";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { createTheme } from "react-data-table-component";

import api from "../../../../src/services/auth/api";

const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLRegistration = process.env.REACT_APP_API_BASE_URL_REGISTRATION;
const baseURLFarmerServer =
  process.env.REACT_APP_API_BASE_URL_REGISTRATION_FROM_FRUITS;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLReport = process.env.REACT_APP_API_BASE_URL_REPORT;

function ServiceApplication() {
  // Translation
  const { t } = useTranslation();
  const [data, setData] = useState({
    with: "withLand",
    subinc: "subsidy",
    equordev: "land",
    scSchemeDetailsId: "",
    scSubSchemeDetailsId: "",
    scHeadAccountId: "",
    fruitsId: "",
    scCategoryId: "",
    scSubSchemeType: "",
    scVendorId: "",
    farmerId: "",
    expectedAmount: "",
    financialYearMasterId: "",
    scComponentId: "",
    schemeAmount: "",
    sanctionNumber: "",
    approvalStageId: "",
    userMasterId: "",
    periodFrom: new Date("2023-04-01"),
    periodTo: new Date("2024-03-31"),
  });

  // console.log("nodu", data);

  const [applicationId, setApplicationId] = useState("");

  // to get scheme-Quota-details
  const [schemeQuotaDetailsListData, setSchemeQuotaDetailsListData] = useState(
    []
  );

  const getSchemeQuotaList = () => {
    api
      .get(baseURLMasterData + `schemeQuota/get-all`)
      .then((response) => {
        setSchemeQuotaDetailsListData(response.data.content.schemeQuota);
      })
      .catch((err) => {
        setSchemeQuotaDetailsListData([]);
      });
  };

  useEffect(() => {
    getSchemeQuotaList();
  }, []);

  const [developedLand, setDevelopedLand] = useState({
    landDeveloped: "",
    unitType: "",
  });

  const [equipment, setEquipment] = useState({
    unitType: "",
    description: "",
    price: "",
    vendorId: "",
    payToVendor: false,
  });

  const [developedArea, setDevelopedArea] = useState([]);

  const transformedData = Object.keys(developedArea).map((id) => ({
    // landDeveloped: developedLand.landDeveloped,
    // landDetailId: parseInt(id),
    ...developedArea[id],
  }));

  // console.log(transformedData);

  // const

  const handleInlineDevelopedLandChange = (e, i) => {
    const { name, value } = e.target;
    const farmerLandDetailsId = i;

    setDevelopedArea((prevData) => ({
      ...prevData,
      [farmerLandDetailsId]: {
        ...prevData[farmerLandDetailsId],
        [name]: value,
      },
    }));
  };

  console.log("new dev data", developedArea);



  const [landDetailsIds, setLandDetailsIds] = useState([]);

  // const handleCheckboxChange = (_id) => {
  //   // if (landDetailsIds.includes(_id)) {
  //   //   const dataList = [...landDetailsIds];
  //   //   const newDataList = dataList.filter((data) => data !== _id);
  //   //   setLandDetailsIds(newDataList);
  //   // } else {
  //   //   setLandDetailsIds((prev) => [...prev, _id]);
  //   // }
  //   setLandDetailsIds((prevIds) => {
  //     if (prevIds.includes(_id)) {
  //       const updatedIds = prevIds.filter(id => id !== _id);
  //       // Remove corresponding developed area data
  //       const { [_id]: _, ...rest } = developedArea;
  //       setDevelopedArea(rest);
  //       return updatedIds;
  //     } else {
  //       return [...prevIds, _id];
  //     }
  //   });
  // };

  // const handleCheckboxChange = (farmerLandDetailsId) => {
  //   setLandDetailsIds((prevIds) => {
  //     const isAlreadySelected = prevIds.includes(farmerLandDetailsId);
  //     const newIds = isAlreadySelected
  //       ? prevIds.filter((id) => id !== farmerLandDetailsId)
  //       : [...prevIds, farmerLandDetailsId];

  //     if (!isAlreadySelected) {
  //       setDevelopedArea((prevData) => ({
  //         ...prevData,
  //         [farmerLandDetailsId]: {
  //           acre: prevData[farmerLandDetailsId]?.acre || "0",
  //           gunta: prevData[farmerLandDetailsId]?.gunta || "0",
  //           fgunta: prevData[farmerLandDetailsId]?.fgunta || "0",
  //         },
  //       }));
  //     }

  //     return newIds;
  //   });
  // };

  // const handleCheckboxChange = (landId, row) => {
  //   console.log("hello row", row);
  //   setLandDetailsIds((prevIds) => {
  //     const isAlreadySelected = prevIds.includes(landId);
  //     const newIds = isAlreadySelected
  //       ? prevIds.filter((id) => id !== landId)
  //       : [...prevIds, landId];

  //     setDevelopedArea((prevData) => {
  //       if (isAlreadySelected) {
  //         const { [landId]: _, ...rest } = prevData;
  //         return rest;
  //       } else {
  //         // If selected, add to developedArea
  //         return {
  //           ...prevData,
  //           [landId]: {
  //             devAcre: prevData[landId]?.devAcre || "0",
  //             devGunta: prevData[landId]?.devGunta || "0",
  //             devFGunta: prevData[landId]?.devFGunta || "0",
  //             ...row,
  //           },
  //         };
  //       }
  //     });

  //     return newIds;
  //   });
  // };

  const handleCheckboxChange = (farmerLandDetailsId, selectedData) => {
    console.log(selectedData);
    setLandDetailsIds((prevIds) => {
      const isAlreadySelected = prevIds.includes(farmerLandDetailsId);
      // for single Select
      const newIds = isAlreadySelected ? [] : [farmerLandDetailsId];
      // For Multiple Select
      // const newIds = isAlreadySelected
      //   ? prevIds.filter((id) => id !== farmerLandDetailsId)
      //   : [...prevIds, farmerLandDetailsId];

      setDevelopedArea((prevData) => {
        console.log("Need to check", prevData);
        if (isAlreadySelected) {
          console.log("inside if");
          const { [farmerLandDetailsId]: _, ...rest } = prevData;
          return rest;
        } else {
          // If selected, add to developedArea
          return {
            // ...prevData,
            [farmerLandDetailsId]: {
              ...selectedData,
              devAcre: prevData[farmerLandDetailsId]?.devAcre || "0",
              devGunta: prevData[farmerLandDetailsId]?.devGunta || "0",
              devFGunta: prevData[farmerLandDetailsId]?.devFGunta || "0",
            },
          };
        }
      });

      return newIds;
    });
  };

  console.log(landDetailsIds);

  // console.log(documentAttachments);

  // // Upload Image to S3 Bucket
  // const handleAttachFileUpload = async (documentId) => {
  //   // const parameters = `applicationFormId =${data.applicationId}`;
  //   const param = {
  //     applicationFormId: applicationId,
  //     documentTypeId: documentId,
  //   };
  //   try {
  //     const formData = new FormData();
  //     formData.append("multipartFile", documentAttachments[documentId]);

  //     const response = await api.post(
  //       baseURLDBT + `service/uploadDocument`,
  //       formData,
  //       {
  //         params: param,
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  //     console.log("File upload response:", response.data);
  //   } catch (error) {
  //     console.error("Error uploading file:", error);
  //   }
  // };


  

  const [showModal, setShowModal] = useState(false);
  const [pendingPostData, setPendingPostData] = useState(null);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // const handleShowModal = (post) => {
  //   setPendingPostData(post); // Store post data in state
  //   setShowModal(true);
  // };
  // const handleCloseModal = () => {
  //   setShowModal(false);
  //   if (pendingPostData) {
  //     // Save application if there is pending post data
  //     saveApplication(pendingPostData);
  //     setPendingPostData(null); // Clear pending data after saving
  //   }
  // };

  const [showModalBreakUp, setShowModalBreakUp] = useState(false);

  const handleShowModalBreakUp = () => setShowModalBreakUp(true);
  const handleCloseModalBreakUp = () => setShowModalBreakUp(false);

  const handleCheckBox = (e) => {
    setEquipment((prev) => ({
      ...prev,
      payToVendor: e.target.checked,
    }));
  };

  const [isDisabled, setIsDisabled] = useState(true);

  const [landDetailsList, setLandDetailsList] = useState([]);

  console.log("Just Checking", landDetailsList);

  // to get sc-scheme-details
  const [scSchemeDetailsListData, setScSchemeDetailsListData] = useState([]);
  const getList = () => {
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
    getList();
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
    if (data.scSchemeDetailsId) {
      getSubSchemeList(data.scSchemeDetailsId);
    }
  }, [data.scSchemeDetailsId]);

  // const getSubSchemeList = () => {
  //    api
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

   // to get sc-sub-scheme-details by sc-scheme-details
   const [approvalStageBeforeNextStepListData, setApprovalStageBeforeNextStepListData] = useState(
    []
  );
  const getApprovalBeforeStageNextStepList = (subSchemeId) => {
    api
      .post(baseURLDBT + `service/getNextStepDetailsBeforeSubmitBySubSchemeId?subSchemeId=${subSchemeId}`)
      .then((response) => {
        if (response.data.content) {
          setApprovalStageBeforeNextStepListData(response.data.content);
        }
      })
      .catch((err) => {
        setApprovalStageBeforeNextStepListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.scSubSchemeDetailsId) {
      getApprovalBeforeStageNextStepList(data.scSubSchemeDetailsId);
    }
  }, [data.scSubSchemeDetailsId]);

  // Get Default Financial Year

  const getFinancialDefaultDetails = () => {
    api
      .get(baseURLMasterData + `financialYearMaster/get-is-default`)
      .then((response) => {
        setData((prev) => ({
          ...prev,
          financialYearMasterId: response.data.content.financialYearMasterId,
        }));
      })
      .catch((err) => {
        setData((prev) => ({
          ...prev,
          financialYearMasterId: "",
        }));
      });
  };

  useEffect(() => {
    getFinancialDefaultDetails();
  }, []);

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

  const getHeadAccountbyschemeIdAndSubSchemeIdList = (
    schemeId,
    subSchemeId
  ) => {
    api
      .post(baseURLDBT + `master/cost/get-hoa-by-schemeId-and-subSchemeId`, {
        schemeId: schemeId,
        subSchemeId: subSchemeId,
      })
      .then((response) => {
        if (response.data.content.unitCost) {
          setScHeadAccountListData(response.data.content.unitCost);
        }
      })
      .catch((err) => {
        setScHeadAccountListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.scSchemeDetailsId && data.scSubSchemeDetailsId) {
      getComponentList(data.scSchemeDetailsId, data.scSubSchemeDetailsId);
      getHeadAccountbyschemeIdAndSubSchemeIdList(
        data.scSchemeDetailsId,
        data.scSubSchemeDetailsId
      );
    }
  }, [data.scSchemeDetailsId, data.scSubSchemeDetailsId]);

  console.log(data);

  // to get head of account by sc-scheme-details
  const [scHeadAccountListData, setScHeadAccountListData] = useState([]);
  // const getHeadAccountList = (_id) => {
  //   api
  //     .get(
  //       baseURLMasterData + `scHeadAccount/get-by-sc-scheme-details-id/${_id}`
  //     )
  //     .then((response) => {
  //       if (response.data.content.scHeadAccount) {
  //         setScHeadAccountListData(response.data.content.scHeadAccount);
  //       }
  //     })
  //     .catch((err) => {
  //       setScHeadAccountListData([]);
  //       // alert(err.response.data.errorMessages[0].message[0].message);
  //     });
  // };

  // useEffect(() => {
  //   if (data.scSchemeDetailsId) {
  //     getHeadAccountList(data.scSchemeDetailsId);
  //   }
  // }, [data.scSchemeDetailsId]);
  const getHeadAccountList = (schemeId, subSchemeId, scComponentId) => {
    api
      .post(
        baseURLDBT +
          `master/cost/get-by-schemeId-and-subSchemeId-and-scComponentId`,
        {
          schemeId: schemeId,
          subSchemeId: subSchemeId,
          scComponentId: scComponentId,
        }
      )
      .then((response) => {
        if (response.data.content.unitCost) {
          setScHeadAccountListData(response.data.content.unitCost);
        }
      })
      .catch((err) => {
        setScHeadAccountListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (
      data.scSchemeDetailsId &&
      data.scSubSchemeDetailsId &&
      data.scComponentId
    ) {
      getHeadAccountList(
        data.scSchemeDetailsId,
        data.scSubSchemeDetailsId,
        data.scComponentId
      );
    }
  }, [data.scSchemeDetailsId, data.scSubSchemeDetailsId, data.scComponentId]);

  // to get category by head of account id
  const [scCategoryListData, setScCategoryListData] = useState([]);
  // const getCategoryList = (_id) => {
  //   api
  //     .get(
  //       baseURLMasterData +
  //         `scHeadAccountCategory/get-by-sc-head-account-id/${_id}`
  //     )
  //     .then((response) => {
  //       if (response.data.content.scHeadAccountCategory) {
  //         setScCategoryListData(response.data.content.scHeadAccountCategory);
  //       }
  //     })
  //     .catch((err) => {
  //       setScCategoryListData([]);
  //       // alert(err.response.data.errorMessages[0].message[0].message);
  //     });
  // };

  // useEffect(() => {
  //   if (data.scHeadAccountId) {
  //     getCategoryList(data.scHeadAccountId);
  //   }
  // }, [data.scHeadAccountId]);

  const [id, setId] = useState(localStorage.getItem("userMasterId"));

  const [districtId, setDistrictId] = useState(null);
  const [talukId, setTalukId] = useState(null);
  const [userFromDistrictData, setUserFromDistrictData] = useState(
    []
  );

    //  to get data from api
   const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURLMasterData + `userMaster/get-join/${id}`)
      .then((response) => {
        setData(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        const message = err.response.data.errorMessages[0].message[0].message;
        setData({});
        // editError(message);
        setLoading(false);
      });
  };

  useEffect(() => {
    getIdList();
  }, [id]);

 

  const getUserFromDistrictList = (subSchemeId,approvalStageId,districtId,talukId) => {
    api
      .post(baseURLDBT + `service/getUserBySubSchemeIdAndScApprovalStageIdAndTalukIdAndDistrictId?subSchemeId=${subSchemeId}&approvalStageId=${approvalStageId}&districtId=${districtId}&talukId=${talukId}`)
      .then((response) => {
        if (response.data.content) {
          setUserFromDistrictData(response.data.content);
        }
      })
      .catch((err) => {
        setUserFromDistrictData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (id) {
      getIdList();
    }
  }, [id]);
  

 

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

  // to get sc-vendor
  const [scVendorListData, setScVendorListData] = useState([]);

  const getVendorList = () => {
    api
      .get(baseURLMasterData + `scVendor/get-all`)
      .then((response) => {
        setScVendorListData(response.data.content.ScVendor);
      })
      .catch((err) => {
        setScVendorListData([]);
      });
  };

  useEffect(() => {
    getVendorList();
  }, []);

   // to get User Master
  // const [userListData, setUserListData] = useState([]);

  // const getUserList = () => {
  //   const response = api
  //     .get(baseURLMasterData + `userMaster/get-all`)
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

   const [approvalListData, setApprovalListData] = useState([]);

   const getApprovalList = () => {
     const response = api
       .get(baseURLMasterData + `scApprovalStage/get-all`)
       .then((response) => {
         setApprovalListData(response.data.content.scApprovalStage);
       })
       .catch((err) => {
         setApprovalListData([]);
       });
   };
 
   useEffect(() => {
     getApprovalList();
   }, []);



  // to get uploadable documents
  const [docListData, setDocListData] = useState([]);

  const getDocList = () => {
    api
      .get(baseURLMasterData + `documentMaster/get-all`)
      .then((response) => {
        setDocListData(response.data.content.documentMaster);
      })
      .catch((err) => {
        setDocListData([]);
      });
  };

  console.log("where",docListData);

  // const getDocList = () => {
  //   api
  //     .post(baseURLDBT + `service/getApplicableDocumentList?subSchemeId=${data.scSubSchemeDetailsId}`)
  //     .then((response) => {
  //       setDocListData(response.data.content);
  //     })
  //     .catch((err) => {
  //       setDocListData([]);
  //     });
  // };


  useEffect(() => {
    getDocList();
  }, []);

  // console.log(applicationId[0]);

  const [farmerDetails, setFarmerDetails] = useState({
    farmerName: "",
    hobli: "",
    village: "",
  });

  const [showFarmerDetails, setShowFarmerDetails] = useState(false);

  const [unitTypeList, setUnitTypeList] = useState([]);
  useEffect(() => {
    if (
      data.scSchemeDetailsId &&
      data.scHeadAccountId &&
      data.scCategoryId &&
      data.scSubSchemeDetailsId
    ) {
      api
        .post(baseURLDBT + `master/cost/getUnitType`, {
          headOfAccountId: data.scHeadAccountId,
          schemeId: data.scSchemeDetailsId,
          subSchemeId: data.scSubSchemeDetailsId,
          categoryId: data.scCategoryId,
        })
        .then((response) => {
          setUnitTypeList(response.data.content);
          // setScVendorListData(response.data.content.ScVendor);
        })
        .catch((err) => {
          // setScVendorListData([]);
        });
    }
  }, [data.scHeadAccountId, data.scCategoryId, data.scSubSchemeDetailsId]);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });

    if (name === "fruitsId" && (value.length < 16 || value.length > 16)) {
      e.target.classList.add("is-invalid");
      e.target.classList.remove("is-valid");
    } else if (name === "fruitsId" && value.length === 16) {
      e.target.classList.remove("is-invalid");
      e.target.classList.add("is-valid");
    }
  };

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  const handleDevelopedLandInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setDevelopedLand({ ...developedLand, [name]: value });
  };

  const handleEquipmentInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setEquipment({ ...equipment, [name]: value });
  };

  const postData = (event) => {
    const transformedData = Object.keys(developedArea).map((id) => ({
      // landDeveloped: developedLand.landDeveloped,
      // landDetailId: parseInt(id),
      ...developedArea[id],    
    }));
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      const sendPost = {
        approvalStageId: data.approvalStageId,
        userMasterId: data.userMasterId,
        farmerId: data.farmerId,
        fruitsId: data.fruitsId,
        payToVendor: equipment.payToVendor,
        headOfAccountId: data.scHeadAccountId,
        schemeId: data.scSchemeDetailsId,
        subSchemeId: data.scSubSchemeDetailsId,
        categoryId: data.scCategoryId,
        landDetailId: landDetailsIds[0],
        talukId: landData.talukId,
        newFarmer: true,
        componentId:data.scComponentId,
        // expectedAmount: data.expectedAmount,
        financialYearMasterId: data.financialYearMasterId,
        devAcre: 0,
        devGunta: 0,
        devFGunta: 0,
        schemeAmount: data.schemeAmount,
        sanctionNumber: data.sanctionNumber,
        initialAmount: data.expectedAmount,
        periodFrom: data.periodFrom,
        periodTo: data.periodTo,
        vendorId: equipment.vendorId,
        description: equipment.description,
        loggedInUserId:localStorage.getItem("userMasterId")
      };

      if (data.equordev === "land") {
        // sendPost.applicationFormLandDetailRequestList = [
        //   {
        //     // unitTypeMasterId: developedLand.unitType,
        //     landDeveloped: developedLand.landDeveloped,
        //   },
        // ];
        sendPost.dbtFarmerLandDetailsRequestList = transformedData;
      } else if (data.equordev === "equipment") {
        sendPost.applicationFormLineItemRequestList = [
          {
            // unitTypeMasterId: equipment.unitType,
            lineItemComment: equipment.description,
            cost: equipment.price,
            vendorId: equipment.vendorId,
          },
        ];
      }

      if (data.fruitsId.length < 16 || data.fruitsId.length > 16) {
        return;
      }
      uploadFileConfirm(sendPost);
    }
  };

  const [amountValue, setAmountValue] = useState({
    maxAmount: "",
    minAmount: "",
    unitPrice: "",
    fullPrice: false,
  });

  useEffect(() => {
    if (
      data.scSchemeDetailsId &&
      data.scSubSchemeDetailsId &&
      data.scComponentId &&
      data.scHeadAccountId
    ) {
      if (data.scCategoryId) {
        api
          .post(baseURLDBT + `master/cost/check-min-max-validation`, {
            headOfAccountId: data.scHeadAccountId,
            schemeId: data.scSchemeDetailsId,
            subSchemeId: data.scSubSchemeDetailsId,
            categoryId: data.scCategoryId,
            scComponentId: data.scComponentId,

            // headOfAccountId: 53,
            // schemeId: 20,
            // subSchemeId: 56,
            // categoryId: 11,
          })
          .then((response) => {
            // if (response.data.content.unitCost) {
            //   setScHeadAccountListData(response.data.content.unitCost);
            // }
            // console.log(response);
            setAmountValue((prev) => ({
              ...prev,
              maxAmount: response.data.content.unitCostMaster[0].maxAmount,
              minAmount: response.data.content.unitCostMaster[0].minAmount,
              unitPrice:
                response.data.content.unitCostMaster[0].unitCostInRupees,
              fullPrice: response.data.content.unitCostMaster[0].fullPrice,
              // fullPrice: true,
            }));
          })
          .catch((err) => {
            // setScHeadAccountListData([]);
            // alert(err.response.data.errorMessages[0].message[0].message);
          });
      } else {
        api
          .post(baseURLDBT + `master/cost/check-min-max-validation`, {
            headOfAccountId: data.scHeadAccountId,
            schemeId: data.scSchemeDetailsId,
            subSchemeId: data.scSubSchemeDetailsId,

            // headOfAccountId: 53,
            // schemeId: 20,
            // subSchemeId: 56,
          })
          .then((response) => {
            // if (response.data.content.unitCost) {
            //   setScHeadAccountListData(response.data.content.unitCost);
            // }
            console.log(response);
            setAmountValue((prev) => ({
              ...prev,
              maxAmount: response.data.content.unitCostMaster[0].maxAmount,
              minAmount: response.data.content.unitCostMaster[0].minAmount,
            }));
          })
          .catch((err) => {
            // setScHeadAccountListData([]);
            // alert(err.response.data.errorMessages[0].message[0].message);
          });
      }
    }
  }, [
    data.scSchemeDetailsId,
    data.scSubSchemeDetailsId,
    data.scComponentId,
    data.scCategoryId,
    data.scHeadAccountId,
  ]);

  console.log(amountValue);

  const generateAcknowledgment = async (applicationFormId) => {
  
    try {
      const response = await api.post(
        baseURLReport + `getBlankSample`,
        {
          applicationFormId: applicationFormId,
        },
        {
          responseType: "blob", //Force to receive data in a Blob Format
        }
      );

      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);

     
    } catch (error) {
      // console.log("error", error);
    }
  };

  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "10%",
    },
    top: {
      backgroundColor: "rgb(15, 108, 190, 1)",
      color: "rgb(255, 255, 255)",
      width: "50%",
      fontWeight: "bold",
      fontSize: "25px",
      textAlign: "center",
    },
    bottom: {
      fontWeight: "bold",
      fontSize: "25px",
      textAlign: "center",
    },
    sweetsize: {
      width: "100px",
      height: "100px",
    },
  };

  const clear = () => {
    setData({
      with: "withLand",
      subinc: "subsidy",
      equordev: "land",
      scSchemeDetailsId: "",
      fruitsId: "",
      scSubSchemeDetailsId: "",
      scHeadAccountId: "",
      scCategoryId: "",
      scComponentId: "",
      scVendorId: "",
      farmerId: "",
      approvalStageId: "",
      userMasterId: "",
      expectedAmount: "",
      financialYearMasterId: "",
      periodFrom: new Date("2023-04-01"),
      periodTo: new Date("2024-03-31"),
    });
    setDevelopedLand({
      landDeveloped: "",
      unitType: "",
    });
    setEquipment({
      unitType: "",
      description: "",
      price: "",
      vendorId: "",
      payToVendor: false,
    });
    setDocumentAttachments({});
    setValidated(false);
    setLandDetailsList([]);
    setShowFarmerDetails(false);
    // setDisabled(false);
  };

  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: `Generated ARN Number is ${arnNumber}`,
    });
    clear();
  };

  // const uploadFileConfirm = (post) => {
  //   Swal.fire({
  //     title: "Do you want to Upload the Documents?",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes",
  //     cancelButtonText: "Later",
  //   }).then((result) => {
  //     if (result.value) {
  //    // User clicked 'Yes', show document upload modal
  //    handleShowModal(post);
  //   } else {
  //     // User clicked 'Later', directly save the application
  //     saveApplication(post);
  //   }
  //   });
  // };
  

  // const saveApplication = (post) => {
  //   api
  //     .post(baseURLDBT + `service/saveApplicationForm`, post)
  //     .then((response) => {
  //       if (response.data.errorCode === -1) {
  //         saveError(response.data.message);
  //       } else {
  //                   // Show success message after saving
  //          saveSuccess();
  //         setApplicationId(response.data.content.applicationDocumentId);
  //         setValidated(false);
  //       }
  //     })
  //     .catch((err) => {
  //       if (
  //         err.response &&
  //         err.response.data &&
  //         err.response.data.validationErrors
  //       ) {
  //         saveError(err.response.data.validationErrors);
  //       }
  //     });
  // };
  

  const uploadFileConfirm = (post) => {
    Swal.fire({
      title: "Do you want to Upload the Documents?",
      // text: "It will delete permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Later",
    }).then((result) => {
      if (result.value) { 
        api
          .post(baseURLDBT + `service/saveApplicationForm`, post)
          .then((response) => {
            if (response.data.content.error) {
              saveError(response.data.content.error_description);
            } else {
              // saveSuccess(response.data.receiptNo);
              setApplicationId(response.data.content.applicationDocumentId);
              clear();
              // Call the acknowledgment API after a successful response
            generateAcknowledgment(response.data.content.applicationDocumentId);
              handleShowModal();

              setValidated(false);
            }
          })
          .catch((err) => {
            if (
              err.response &&
              err.response &&
              err.response.data &&
              err.response.data.validationErrors
            ) {
              if (Object.keys(err.response.data.validationErrors).length > 0) {
                saveError(err.response.data.validationErrors);
              }
            }
          });
        setValidated(true);
        // Swal.fire("Deleted", "You successfully deleted this record", "success");
      } else {
        console.log(result.value);
        api
          .post(baseURLDBT + `service/saveApplicationForm`, post)
          .then((response) => {
            if (response.data.errorCode === -1) {
              saveError(response.data.message);
            } else {
              saveSuccess();
              setApplicationId(response.data.content.applicationDocumentId);
              // add acknowledgement API here

        // Call the acknowledgment API after a successful response
            generateAcknowledgment(response.data.content.applicationDocumentId);

              // generateBiddingSlip(response.data.content.applicationDocumentId);
              // handleShowModal();
              setValidated(false);
            }
          })
          .catch((err) => {
            if (
              err.response &&
              err.response &&
              err.response.data &&
              err.response.data.validationErrors
            ) {
              if (Object.keys(err.response.data.validationErrors).length > 0) {
                saveError(err.response.data.validationErrors);
              }
            }
          });
        setValidated(true);
        // clear();
        // Swal.fire("Cancelled", "Your record is not deleted", "info");
      }
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

  const [landData, setLandData] = useState({
    landId: "",
    talukId: "",
  });

  const handleRadioChange = (_id) => {
    // if (!tId) {
    //   tId = 0;
    // }
    setLandData((prev) => ({ ...prev, landId: _id }));
  };

  const [validated, setValidated] = useState(false);
  const [searchValidated, setSearchValidated] = useState(false);
  const [listLogsData, setListLogsData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);

  const [disable, setDisable] = useState(false);

  const search = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setSearchValidated(true);
    } else {
      event.preventDefault();
      if (data.fruitsId.length < 16 || data.fruitsId.length > 16) {
        return;
      } else {
      setDisable(true);
    }
      // api
      //   .post(baseURLRegistration + `farmer/get-farmer-details`, {
      //     fruitsId: data.fruitsId,
      //   })
      //   .then((response) => {
      //     console.log(response);
      //     if (!response.data.content.error) {
      //       if (response.data.content.farmerResponse) {
      //         setData((prev) => ({
      //           ...prev,
      //           farmerId: response.data.content.farmerResponse.farmerId,
      //         }));
      //         setFarmerDetails((prev) => ({
      //           ...prev,
      //           farmerName: response.data.content.farmerResponse.firstName,
      //           hobli:
      //             response.data.content.farmerAddressDTOList &&
      //             response.data.content.farmerAddressDTOList.length > 0
      //               ? response.data.content.farmerAddressDTOList[0].hobliName
      //               : "",
      //           village:
      //             response.data.content.farmerAddressDTOList &&
      //             response.data.content.farmerAddressDTOList.length > 0
      //               ? response.data.content.farmerAddressDTOList[0].villageName
      //               : "",
      //         }));
      //         setShowFarmerDetails(true);
      //       }
      //       // if (response.data.content.farmerLandDetailsDTOList.length > 0) {
      //       //   setLandDetailsList(
      //       //     response.data.content.farmerLandDetailsDTOList
      //       //   );
      //       // }

      api
      .post(baseURLFarmerServer + `farmer/get-details-by-fruits-id`, {
        fruitsId: data.fruitsId,
      })
      .then((response) => {
        if (response.data.content.farmerResponse) {
          setData((prev) => ({
            ...prev,
            farmerId: response.data.content.farmerResponse.farmerId,
          }));
          setFarmerDetails((prev) => ({
            ...prev,
            farmerName: response.data.content.farmerResponse.firstName,
            // districtName:
            //   response.data.content.farmerAddressDTOList &&
            //   response.data.content.farmerAddressDTOList.length > 0
            //     ? response.data.content.farmerAddressDTOList[0].districtName
            //     : "",
            // talukName:
            //   response.data.content.farmerAddressDTOList &&
            //   response.data.content.farmerAddressDTOList.length > 0
            //     ? response.data.content.farmerAddressDTOList[0].talukName
            //     : "",
            // hobli:
            //   response.data.content.farmerAddressDTOList &&
            //   response.data.content.farmerAddressDTOList.length > 0
            //     ? response.data.content.farmerAddressDTOList[0].hobliName
            //     : "",
            // village:
            //   response.data.content.farmerAddressDTOList &&
            //   response.data.content.farmerAddressDTOList.length > 0
            //     ? response.data.content.farmerAddressDTOList[0].villageName
            //     : "",
          }));
          if (response.data.content.farmerAddressDTOList.length > 0) {
            setFarmerDetails((prev) => ({
              ...prev,
              address:
                response.data.content.farmerAddressDTOList[0].addressText,
            }));
          }
          setShowFarmerDetails(true);
        }
        console.log("landdetails", response.data);
        if (response.data.content.farmerLandDetailsDTOList.length > 0) {
          setLandDetailsList(response.data.content.farmerLandDetailsDTOList);
        }
      })
      .catch((err) => {
        setLandDetailsList([]);
      });
  }
};

  const LandDetailsColumns = [
    {
      name: "Select",
      selector: "select",
      cell: (row) => (
        <input
          type="radio"
          name="selectedLand"
          value={row.farmerLandDetailsId}
          // checked={selectedLandId === row.id}
          onChange={() => handleRadioChange(row.farmerLandDetailsId)}
        />
      ),
      // ignoreRowClick: true,
      // allowOverflow: true,
      button: true,
    },
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
      name: "Hobli",
      selector: (row) => row.hobliName,
      cell: (row) => <span>{row.hobliName}</span>,
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
    {
      name: "Survey Number",
      selector: (row) => row.surveyNumber,
      cell: (row) => <span>{row.surveyNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Owner",
      selector: (row) => row.ownerName,
      cell: (row) => <span>{row.ownerName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Acre",
      selector: (row) => row.acre,
      // cell: (row) => (
      //   <Form.Control
      //     // id="farmerName"
      //     // name="farmerName"
      //     type="text"
      //     value={row.acre}
      //     // onChange={handleInputs}
      //     placeholder="Edit Acre"
      //   />
      // ),
      cell: (row) => <span>{row.acre}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Gunta",
      selector: (row) => row.gunta,
      // cell: (row) => (
      //   <Form.Control
      //     // id="farmerName"
      //     // name="farmerName"
      //     type="text"
      //     value={row.gunta}
      //     // onChange={handleInputs}
      //     placeholder="Edit Gunta"
      //   />
      // ),
      cell: (row) => <span>{row.gunta}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "FGunta",
      selector: (row) => row.fgunta,
      // cell: (row) => (
      //   <Form.Control
      //     // id="farmerName"
      //     // name="farmerName"
      //     type="text"
      //     value={row.fgunta}
      //     // onChange={handleInputs}
      //     placeholder="Edit FGunta"
      //   />
      // ),
      cell: (row) => <span>{row.gunta}</span>,
      sortable: true,
      hide: "md",
    },

    // {
    //   name: "Action",
    //   cell: (row) => (
    //     //   Button style
    //     <div className="text-start w-100">
    //       <Button
    //         variant="primary"
    //         size="sm"
    //         className="ms-2"
    //         onClick={setIsDisabled(false)}
    //       >
    //         Update
    //       </Button>
    //     </div>
    //   ),
    //   // cell: (row) => <span>{row.gunta}</span>,
    //   sortable: false,
    //   hide: "md",
    // },
  ];

  const LandDetailsForDevColumns = [
    {
      name: "Select",
      selector: "select",
      cell: (row, i) => (
        <input
          type="checkbox"
          name="selectedLand"
          value={i}
          checked={landDetailsIds.includes(i)}
          onChange={() => handleCheckboxChange(i, row)}
        />
      ),
      // ignoreRowClick: true,
      // allowOverflow: true,
      button: true,
    },
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
      name: "Hobli",
      selector: (row) => row.hobliName,
      cell: (row) => <span>{row.hobliName}</span>,
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
    {
      name: "Survey Number",
      selector: (row) => row.surveyNumber,
      cell: (row) => <span>{row.surveyNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Owner",
      selector: (row) => row.ownerName,
      cell: (row) => <span>{row.ownerName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Acre",
      selector: (row) => row.acre,
      // cell: (row) => (
      //   <Form.Control
      //     // id="farmerName"
      //     // name="farmerName"
      //     type="text"
      //     value={row.acre}
      //     // onChange={handleInputs}
      //     placeholder="Edit Acre"
      //   />
      // ),
      cell: (row) => <span>{row.acre}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Gunta",
      selector: (row) => row.gunta,
      // cell: (row) => (
      //   <Form.Control
      //     // id="farmerName"
      //     // name="farmerName"
      //     type="text"
      //     value={row.gunta}
      //     // onChange={handleInputs}
      //     placeholder="Edit Gunta"
      //   />
      // ),
      cell: (row) => <span>{row.gunta}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "FGunta",
      selector: (row) => row.fgunta,
      // cell: (row) => (
      //   <Form.Control
      //     // id="farmerName"
      //     // name="farmerName"
      //     type="text"
      //     value={row.fgunta}
      //     // onChange={handleInputs}
      //     placeholder="Edit FGunta"
      //   />
      // ),
      cell: (row) => <span>{row.fgunta}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Developed Area (Acre/Gunta/FGunta)",
      // selector: (row,id) => console.log("rowDetails",id),
      cell: (row, i) => (
        <>
          {/* {console.log("dada marre",i)} */}
          <Form.Control
            name="devAcre"
            type="text"
            value={developedArea[i]?.devAcre || ""}
            onChange={(e) => handleInlineDevelopedLandChange(e, i)}
            placeholder="Acre"
            className="m-1"
          />
          <Form.Control
            name="devGunta"
            type="text"
            value={developedArea[i]?.devGunta || ""}
            onChange={(e) => handleInlineDevelopedLandChange(e, i)}
            placeholder="Gunta"
            className="m-1"
          />
          <Form.Control
            name="devFGunta"
            type="text"
            value={developedArea[i]?.devFGunta || ""}
            onChange={(e) => handleInlineDevelopedLandChange(e, i)}
            placeholder="FGunta"
            className="m-1"
          />
        </>
      ),
      // cell: (row) => <span>{row.acre}</span>,
      sortable: true,
      hide: "md",
      grow: 3,
    },
  ];

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
        minHeight: "45px", // override the row height
      },
    },
    headCells: {
      style: {
        backgroundColor: "#1e67a8",
        color: "#fff",
        fontSize: "14px",
        paddingLeft: "8px", // override the cell padding for head cells
        paddingRight: "8px",
      },
    },
    cells: {
      style: {
        paddingLeft: "8px", // override the cell padding for data cells
        paddingRight: "8px",
      },
    },
  };

    // Display Image
    const [documentAttachments, setDocumentAttachments] = useState({});
    const handleAttachFileChange = (e, documentId) => {
      if (e.target.files.length > 0) {
        const file = e.target.files[0];
        setDocumentAttachments((prevState) => ({
          ...prevState,
          [documentId]: file,
        }));
      } else {
        setDocumentAttachments((prevState) => ({
          ...prevState,
          [documentId]: null,
        }));
        // setData((prev) => ({ ...prev, hdAttachFiles: "" }));
        // document.getElementById("hdAttachFiles").value = "";
      }
      // setPhotoFile(file);
    };
  
    console.log("showdevplease", developedArea);
  
    const handleRemoveImage = (documentId) => {
      const updatedDocument = { ...documentAttachments };
      delete updatedDocument[documentId];
      setDocumentAttachments(updatedDocument);
      document.getElementById(`attImage${documentId}`).value = "";
      // setData((prev) => ({ ...prev, hdAttachFiles: "" }));
    };

    const [uploadedDocuments, setUploadedDocuments] = useState([]);

  const [uploadStatus, setUploadStatus] = useState({});

  const handleAttachFileUpload = async (documentId) => {
    const param = {
      applicationFormId: applicationId,
      documentTypeId: documentId,
    };
  
    try {
      const formData = new FormData();
      // formData.append("multipartFile", documentAttachments[documentId]);
      formData.append("multipartFile", document);
  
      const response = await api.post(
        baseURLDBT + `service/uploadDocument`,
        formData,
        {
          params: param,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      console.log("File upload response:", response.data);
  
      // Show SweetAlert success message after successful upload
      // SweetAlert success function
  Swal.fire({
    icon: "success",
    title: "File uploaded successfully",
  });
  
  // setIsUploaded(true);
  // Update the upload status for this specific document
  setUploadStatus((prevStatus) => ({
    ...prevStatus,
    [documentId]: true, // Mark this document as uploaded
  }));
   // Add the uploaded document to the list of uploaded documents
  //  setUploadedDocuments((prevDocs) => [
  //   ...prevDocs,
  //   {
  //     documentId,
  //     documentName: document.name,
  //   },
  // ]);
  // Modify the setUploadedDocuments to include documentMasterName
setUploadedDocuments((prevDocs) => [
  ...prevDocs,
  {
    documentId,
    documentName: document.name,
    documentMasterName: docListData.find(
      (list) => list.documentMasterId === documentId
    )?.documentMasterName, // Find and store the documentMasterName
    documentFile: document, // Store the file itself for image preview
  },
]);
    } catch (error) {
      console.error("Error uploading file:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error uploading file. Please try again.",
      });
    }
  };


  const [uploadDocuments, setUploadDocuments] = useState({
    applicationFormId: "",
    documentTypeId: "",
    documentPath: "",
  });

  const handleDocumentInputs = (e) => {
    let { name, value } = e.target;
    // setUploadDocuments({ ...uploadDocuments, [name]: value });
    setUploadDocuments(prev=>({...prev,  [name]: value }));
  };

   //Display Document
   const [document, setDocument] = useState("");

   const handleDocumentChange = (e) => {
     const file = e.target.files[0];
     setDocument(file);
     setUploadDocuments((prev) => ({ ...prev, documentPath: file.name }));
    //  setPhotoFile(file);
   };
  //  console.log("nodappa",document);
  //  console.log("nodappa2",uploadDocuments);

 
   // Upload Image to S3 Bucket
  //  const handleFileDocumentUpload = async (scApplicationFormDocumentDetailId) => {
  //    const parameters = `farmerBankAccountId=${scApplicationFormDocumentDetailId}`;
  //    try {
  //      const formData = new FormData();
  //      formData.append("multipartFile", document);
 
  //      const response = await api.post(
  //        baseURLDBT + `farmer-bank-account/upload-photo?${parameters}`,
  //        formData,
  //        {
  //          headers: {
  //            "Content-Type": "multipart/form-data",
  //          },
  //        }
  //      );
  //      console.log("File upload response:", response.data);
  //    } catch (error) {
  //      console.error("Error uploading file:", error);
  //    }
  //  };


   

  return (
    <Layout title="Application Form">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Application Form</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/all-application-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Applications List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/all-application-list"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>Applications List</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        {/* <Form action="#"> */}
        {/* <Form noValidate validated={searchValidated} onSubmit={search}> */}
        <Form noValidate validated={searchValidated} onSubmit={search}>
          <Card>
            <Card.Body>
              <Row className="g-gs">
                <Col lg="12">
                  <Form.Group as={Row} className="form-group" controlId="fid">
                    <Form.Label column sm={1} style={{ fontWeight: "bold" }}>
                      FRUITS ID<span className="text-danger">*</span>
                    </Form.Label>
                    <Col sm={4}>
                      <Form.Control
                        type="fruitsId"
                        name="fruitsId"
                        value={data.fruitsId}
                        onChange={handleInputs}
                        placeholder="Enter FRUITS ID"
                        required
                        maxLength="16"
                      />
                      <Form.Control.Feedback type="invalid">
                        Fruits ID Should Contain 16 digits
                      </Form.Control.Feedback>
                    </Col>
                    <Col sm={2}>
                      <Button type="submit" variant="primary">
                        Search
                      </Button>
                    </Col>
                    {/* <Col sm={2}>
                      <Button type="submit" variant="primary" onClick={clear}>
                        Clear
                      </Button>
                    </Col> */}
                  </Form.Group>
                </Col>
              </Row>
              {showFarmerDetails && (
                // <Col lg="12" className="mt-1">
                //   <Card>
                //     <Card.Header>Farmer Personal Info</Card.Header>
                //     <Card.Body>
                <Row className="g-gs mt-1">
                  <Col lg="12">
                    <table className="table small table-bordered">
                      <tbody>
                        <tr>
                        <td style={styles.ctstyle}> Farmer Name:</td>
                          <td>{farmerDetails.farmerName}</td>
                          <td style={styles.ctstyle}> Addres:</td>
                          <td>{farmerDetails.address}</td>
                        </tr>
                      </tbody>
                    </table>
                  </Col>
                </Row>
                //     </Card.Body>
                //   </Card>
                // </Col>
              )}
            </Card.Body>
          </Card>
        </Form>

        {/* <Card className="mt-1">
          <Card.Body>
            <Row lg="12" className="g-gs">
              <Col lg={6}>
                <Row>
                  <Col lg="2">
                    <Form.Group
                      as={Row}
                      className="form-group"
                      controlId="subsidy"
                    >
                      <Col sm={1}>
                        <Form.Check
                          type="radio"
                          name="subinc"
                          value="subsidy"
                          checked={data.subinc === "subsidy"}
                          onChange={handleInputs}
                        />
                      </Col>
                      <Form.Label column sm={9} className="mt-n2" id="subsidy">
                        Subsidy
                      </Form.Label>
                    </Form.Group>
                  </Col>
                  <Col lg="3">
                    <Form.Group
                      as={Row}
                      className="form-group"
                      controlId="incentive"
                    >
                      <Col sm={1}>
                        <Form.Check
                          type="radio"
                          name="subinc"
                          value="incentive"
                          checked={data.subinc === "incentive"}
                          onChange={handleInputs}
                        />
                      </Col>
                      <Form.Label
                        column
                        sm={9}
                        className="mt-n2"
                        id="incentive"
                      >
                        Incentive
                      </Form.Label>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
              <Col lg={6}>
                <Row>
                  <Col lg="3">
                    <Form.Group as={Row} className="form-group" controlId="crc">
                      <Col sm={1}>
                        <Form.Check
                          type="radio"
                          name="with"
                          value="withLand"
                          checked={data.with === "withLand"}
                          onChange={handleInputs}
                        />
                      </Col>
                      <Form.Label column sm={9} className="mt-n2" id="crc">
                        With Land
                      </Form.Label>
                    </Form.Group>
                  </Col>
                  <Col lg="3" className="ms-n2">
                    <Form.Group as={Row} className="form-group" controlId="crc">
                      <Col sm={1}>
                        <Form.Check
                          type="radio"
                          name="with"
                          value="withOutLand"
                          checked={data.with === "withOutLand"}
                          onChange={handleInputs}
                        />
                      </Col>
                      <Form.Label column sm={9} className="mt-n2" id="crc">
                        Without Land
                      </Form.Label>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card.Body>
        </Card> */}
      </Block>
      <Row>
        <Block>
          <Form noValidate validated={validated} onSubmit={postData}>
            <Row className="g-1 ">
              <Col lg={12}>
                <Block className="mt-3">
                  <Card>
                    <Card.Header style={{ fontWeight: "bold" }}>
                      Scheme Details
                    </Card.Header>
                    <Card.Body>
                      <Row className="g-gs">
                        <Col lg="6">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="sordfl">
                              Scheme
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="scSchemeDetailsId"
                                value={data.scSchemeDetailsId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                // multiple
                                required
                                isInvalid={
                                  data.scSchemeDetailsId === undefined ||
                                  data.scSchemeDetailsId === "0"
                                }
                              >
                                <option value="">Select Scheme Names</option>
                                {scSchemeDetailsListData &&
                                  scSchemeDetailsListData.map((list) => (
                                    <option
                                      key={list.scSchemeDetailsId}
                                      value={list.scSchemeDetailsId}
                                    >
                                      {list.schemeName}
                                    </option>
                                  ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                Scheme is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="6">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label>
                              Component Type
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="scSubSchemeDetailsId"
                                value={data.scSubSchemeDetailsId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                // multiple
                                required
                                isInvalid={
                                  data.scSubSchemeDetailsId === undefined ||
                                  data.scSubSchemeDetailsId === "0"
                                }
                              >
                                <option value="">Select Component Type</option>
                                {scSubSchemeDetailsListData &&
                                  scSubSchemeDetailsListData.map((list, i) => (
                                    <option key={i} value={list.subSchemeId}>
                                      {list.subSchemeName}
                                    </option>
                                  ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                Component Type is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="sordfl">
                              Component
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="scComponentId"
                                value={data.scComponentId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                // multiple
                                // required
                                isInvalid={
                                  data.scComponentId === undefined ||
                                  data.scComponentId === "0"
                                }
                              >
                                <option value="">Select Component</option>
                                {scComponentListData &&
                                  scComponentListData.map((list) => (
                                    <option
                                      key={list.scComponentId}
                                      value={list.scComponentId}
                                    >
                                      {list.scComponentName}
                                    </option>
                                  ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                Component is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        {/* <Col lg="6">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label>
                              Scheme Type
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="scSubSchemeType"
                                value={data.scSubSchemeType}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                // multiple
                                required
                                isInvalid={
                                  data.scSubSchemeType === undefined ||
                                  data.scSubSchemeType === "0"
                                }
                              >
                                <option value="">Select Sub Scheme</option>
                                {schemeQuotaDetailsListData.map((list) => (
                                  <option
                                    key={list.schemeQuotaId}
                                    value={list.schemeQuotaId}
                                  >
                                    {list.schemeQuotaName}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                Sub Scheme is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col> */}

                        {/* <Col lg="6">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="sordfl">
                              Scheme
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="scSchemeDetailsId"
                                value={data.scSchemeDetailsId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                // multiple
                                required
                                isInvalid={
                                  data.scSchemeDetailsId === undefined ||
                                  data.scSchemeDetailsId === "0"
                                }
                              >
                                <option value="">Select Scheme Names</option>
                                {scSchemeDetailsListData.map((list) => (
                                  <option
                                    key={list.scSchemeDetailsId}
                                    value={list.scSchemeDetailsId}
                                  >
                                    {list.schemeName}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                Scheme is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col> */}
                        <Col lg="6">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="sordfl">
                              Sub Component
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="scCategoryId"
                                value={data.scCategoryId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                // multiple
                                // required
                                isInvalid={
                                  data.scCategoryId === undefined ||
                                  data.scCategoryId === "0"
                                }
                              >
                                <option value="">Select Sub Component</option>
                                {scCategoryListData &&
                                  scCategoryListData.map((list) => (
                                    <option
                                      key={list.scCategoryId}
                                      value={list.scCategoryId}
                                    >
                                      {list.codeNumber}
                                    </option>
                                  ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                Sub Component is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="sordfl">
                              Head of Account
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="scHeadAccountId"
                                value={data.scHeadAccountId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                // multiple
                                required
                                isInvalid={
                                  data.scHeadAccountId === undefined ||
                                  data.scHeadAccountId === "0"
                                }
                              >
                                <option value="">Select Head of Account</option>
                                {scHeadAccountListData &&
                                  scHeadAccountListData.map((list) => (
                                    <option
                                      key={list.headOfAccountId}
                                      value={list.headOfAccountId}
                                    >
                                      {list.scHeadAccountName}
                                    </option>
                                  ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                Head of Account is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="2">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="sordfl">
                              From Date
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <DatePicker
                                selected={data.periodFrom}
                                onChange={(date) =>
                                  handleDateChange(date, "periodFrom")
                                }
                                // minDate={new Date("01/04/2023")}
                                // maxDate={new Date("31/03/2024")}
                                peekNextMonth
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                                // readOnly
                                required
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="2">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="sordfl">
                              To Date
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <DatePicker
                                selected={data.periodTo}
                                onChange={(date) =>
                                  handleDateChange(date, "periodTo")
                                }
                                // minDate={new Date("01/04/2023")}
                                // maxDate={new Date("31/03/2024")}
                                peekNextMonth
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                                required
                                // readOnly
                              />
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        Approval Stage
                        {/* <span className="text-danger">*</span> */}
                      </Form.Label>
                      <Col>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="approvalStageId"
                            value={data.approvalStageId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            // required
                            isInvalid={
                              data.approvalStageId === undefined ||
                              data.approvalStageId === "0"
                            }
                          >
                            <option value="">Select Approval Stage</option>
                            {approvalStageBeforeNextStepListData.map((list) => (
                              <option
                                key={list.approvalStageId}
                                value={list.approvalStageId}
                              >
                                {list.approvalStageName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Approval Stage Name is required
                          </Form.Control.Feedback>
                        </div>
                      </Col>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                       User Master
                       {/* <span className="text-danger">*</span> */}
                      </Form.Label>
                      <Col>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="userMasterId"
                            value={data.userMasterId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            // required
                            isInvalid={
                              data.userMasterId === undefined ||
                              data.userMasterId === "0"
                            }
                          >
                            <option value="">Select User</option>
                            {userFromDistrictData.map((list) => (
                              <option
                                key={list.userMasterId}
                                value={list.userMasterId}
                              >
                                {list.username}
                              </option>
                            ))}
                          </Form.Select>
                          {/* <Form.Control.Feedback type="invalid">
                            Approval Stage Name is required
                          </Form.Control.Feedback> */}
                        </div>
                      </Col>
                    </Form.Group>
                  </Col>

                        {/* <Col lg="6">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="schemeAmount">
                              Scheme Amount
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="schemeAmount"
                                type="text"
                                name="schemeAmount"
                                value={data.schemeAmount}
                                onChange={handleInputs}
                                placeholder="Enter Scheme Amount"
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                Scheme Amount is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col> */}

                        {/* <Col lg="6">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="sanctionNumber">
                              Sanction Number
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="sanctionNumber"
                                type="text"
                                name="sanctionNumber"
                                value={data.sanctionNumber}
                                onChange={handleInputs}
                                placeholder="Enter Sanction Number"
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                Sanction Number is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col> */}

                        {/* <Col lg="6">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="expectedAmount">
                              Initial Amount
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="expectedAmount"
                                type="text"
                                name="expectedAmount"
                                value={data.expectedAmount}
                                onChange={handleInputs}
                                placeholder="Enter Expected Amount"
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                Expected Amount is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col> */}
                      </Row>
                    </Card.Body>
                  </Card>
                </Block>
              </Col>

              {/* <Block className="mt-3">
                <Card>
                  <Card.Header style={{ fontWeight: "bold" }}>
                    Vendors List
                  </Card.Header>
                  <Card.Body>
                    <Row className="g-gs">
                      <Col lg="4">
                        <Form.Group className="form-group mt-n3">
                          <Form.Label>
                            Vendor Name<span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="scVendorId"
                              value={data.scVendorId}
                              onChange={handleInputs}
                              onBlur={() => handleInputs}
                              // multiple
                              required
                              isInvalid={
                                data.scVendorId === undefined ||
                                data.scVendorId === "0"
                              }
                            >
                              <option value="">Select Vendor Name</option>
                              {scVendorListData.map((list) => (
                                <option
                                  key={list.scVendorId}
                                  value={list.scVendorId}
                                >
                                  {list.name}
                                </option>
                              ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                              Vendor Name is required
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Block> */}

              {/* <Card className="mt-1">
                <Row className="ms-1 mt-2">
                  <Col lg="2">
                    <Form.Group
                      as={Row}
                      className="form-group"
                      controlId="land"
                    >
                      <Col sm={1}>
                        <Form.Check
                          type="radio"
                          name="equordev"
                          value="land"
                          checked={data.equordev === "land"}
                          onChange={handleInputs}
                        />
                      </Col>
                      <Form.Label column sm={9} className="mt-n2" id="land">
                        Constructed Area
                      </Form.Label>
                    </Form.Group>
                  </Col>
                  <Col lg="2">
                    <Form.Group
                      as={Row}
                      className="form-group"
                      controlId="equip"
                    >
                      <Col sm={1}>
                        <Form.Check
                          type="radio"
                          name="equordev"
                          value="equipment"
                          checked={data.equordev === "equipment"}
                          onChange={handleInputs}
                        />
                      </Col>
                      <Form.Label column sm={9} className="mt-n2" id="equip">
                        Equipment Purchase
                      </Form.Label>
                    </Form.Group>
                  </Col>

                  <Col lg="2">
                    <Form.Group
                      as={Row}
                      className="form-group"
                      controlId="land"
                    >
                      <Col sm={1}>
                        <Form.Check
                          type="radio"
                          name="equordev"
                          value="land"
                          checked={data.equordev === "land"}
                          onChange={handleInputs}
                        />
                      </Col>
                      <Form.Label column sm={9} className="mt-n2" id="land">
                        Land Wise
                      </Form.Label>
                    </Form.Group>
                  </Col>
                </Row>
              </Card>
              
              {/* {data.with === "withLand" && landDetailsList.length > 0 ? ( */}
              {/* {data.equordev === "land" && data.with === "withLand" && landDetailsList.length > 0 ? (
                <>
                  <Block className="mt-3">
                    <Card>
                
                      <Card.Body>
                        <Row>
                          <DataTable
                            tableClassName="data-table-head-light table-responsive"
                            columns={LandDetailsForDevColumns}
                            data={landDetailsList}
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
                        </Row>
                      </Card.Body>
                    </Card>
                  </Block>
                  
                 
                  <Block className="mt-3">
                    <Card>
                      <Card.Header style={{ fontWeight: "bold" }}>
                        Sanction Amount
                      </Card.Header>
                      <Card.Body>
                        <Row className="g-gs">
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="landDeveloped">
                                Unit Price
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="landDeveloped"
                                  type="text"
                                  name="unitPrice"
                                  value={amountValue.unitPrice}
                                  onChange={handleDevelopedLandInputs}
                                  placeholder="Enter Unit Price"
                                  readOnly
                                />
                                <Form.Control.Feedback type="invalid">
                                  Unit Price is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="landDeveloped">
                                Subsidy Amount
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="expectedAmount"
                                  type="text"
                                  name="expectedAmount"
                                  value={data.expectedAmount}
                                  onChange={handleInputs}
                                  placeholder="Enter Expected Amount"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Subsidy Amount is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          {amountValue.fullPrice && (
                            <Col lg="4">
                              <Form.Group className="form-group mt-n3">
                                <Form.Label htmlFor="landDeveloped">
                                  Quantity
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="landDeveloped"
                                    type="text"
                                    name="landDeveloped"
                                    value={developedLand.landDeveloped}
                                    onChange={handleDevelopedLandInputs}
                                    placeholder="Enter Quantity"
                                    required
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Quantity is required
                                  </Form.Control.Feedback>
                                </div>
                              </Form.Group>
                            </Col>
                          )}
                        </Row>
                        
                      </Card.Body>
                    </Card>
                  </Block>

                  {data.equordev === "land" ? (
                    <Block className="mt-3">
                      <Card>
                        <Card.Header style={{ fontWeight: "bold" }}>
                          Constructed Area
                        </Card.Header>
                        <Card.Body>
                          <Row className="g-gs">
                           
                            <Col lg="4">
                              <Form.Group className="form-group mt-n3">
                                <Form.Label htmlFor="landDeveloped">
                                  Unit
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="landDeveloped"
                                    type="text"
                                    name="landDeveloped"
                                    value={developedLand.landDeveloped}
                                    onChange={handleDevelopedLandInputs}
                                    placeholder="Enter Unit"
                                    required
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Unit Quantity is required
                                  </Form.Control.Feedback>
                                </div>
                              </Form.Group>
                            </Col>
                           
                          </Row>
                        </Card.Body>
                      </Card>
                    </Block>
                  ) : data.equordev === "equipment" ? (
                    <Block className="mt-3">
                      <Card>
                        <Card.Header style={{ fontWeight: "bold" }}>
                          Equipment Purchase
                        </Card.Header>
                        <Card.Body>
                          <Row className="g-gs">
                           
                            <Col lg="4">
                              <Form.Group className="form-group mt-n3">
                                <Form.Label>
                                  Vendor Name
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Select
                                    name="vendorId"
                                    value={equipment.vendorId}
                                    onChange={handleEquipmentInputs}
                                    onBlur={() => handleEquipmentInputs}
                                    // multiple
                                    // required
                                    isInvalid={
                                      equipment.vendorId === undefined ||
                                      equipment.vendorId === "0"
                                    }
                                  >
                                    <option value="">Select Vendor Name</option>
                                    {scVendorListData.map((list) => (
                                      <option
                                        key={list.scVendorId}
                                        value={list.scVendorId}
                                      >
                                        {list.name}
                                      </option>
                                    ))}
                                  </Form.Select>
                                  <Form.Control.Feedback type="invalid">
                                    Vendor Name is required
                                  </Form.Control.Feedback>
                                </div>
                              </Form.Group>
                            </Col>
                            <Col lg="4">
                              <Form.Group className="form-group mt-n3">
                                <Form.Label htmlFor="description">
                                  Description
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="description"
                                    type="text"
                                    name="description"
                                    value={equipment.description}
                                    onChange={handleEquipmentInputs}
                                    placeholder="Enter Description"
                                    required
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Description is required
                                  </Form.Control.Feedback>
                                </div>
                              </Form.Group>
                            </Col>
                            <Col lg="4">
                              <Form.Group className="form-group mt-n3">
                                <Form.Label htmlFor="price">
                                  Price
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="price"
                                    type="text"
                                    name="price"
                                    value={equipment.price}
                                    onChange={handleEquipmentInputs}
                                    placeholder="Enter Price"
                                    required
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Price is required
                                  </Form.Control.Feedback>
                                </div>
                              </Form.Group>
                            </Col>
                           
                          </Row>
                        </Card.Body>
                      </Card>
                    </Block>
                  ) : null}
                  )}
                </> 
              ) : (
                ""
              )} */} 

   <Card className="mt-1">
  <Row className="ms-1 mt-2">
    <Col lg="2">
      <Form.Group as={Row} className="form-group" controlId="land">
        <Col sm={1}>
          <Form.Check
            type="radio"
            name="equordev"
            value="constructedArea"
            checked={data.equordev === "constructedArea"}
            onChange={handleInputs}
          />
        </Col>
        <Form.Label column sm={9} className="mt-n2" id="land">
          Constructed Area
        </Form.Label>
      </Form.Group>
    </Col>
    <Col lg="2">
      <Form.Group as={Row} className="form-group" controlId="equip">
        <Col sm={1}>
          <Form.Check
            type="radio"
            name="equordev"
            value="equipment"
            checked={data.equordev === "equipment"}
            onChange={handleInputs}
          />
        </Col>
        <Form.Label column sm={9} className="mt-n2" id="equip">
          Equipment Purchase
        </Form.Label>
      </Form.Group>
    </Col>
    <Col lg="2">
      <Form.Group as={Row} className="form-group" controlId="land">
        <Col sm={1}>
          <Form.Check
            type="radio"
            name="equordev"
            value="land"
            checked={data.equordev === "land"}
            onChange={handleInputs}
          />
        </Col>
        <Form.Label column sm={9} className="mt-n2" id="land">
          Land Wise
        </Form.Label>
      </Form.Group>
    </Col>
  </Row>
</Card>

{/* Common Sanction Amount Section */}
<Block className="mt-3">
  <Card>
    <Card.Header style={{ fontWeight: "bold" }}>
      Sanction Amount
    </Card.Header>
    <Card.Body>
      <Row className="g-gs">
        <Col lg="4">
          <Form.Group className="form-group mt-n3">
            <Form.Label htmlFor="landDeveloped">
              Unit Price
              <span className="text-danger">*</span>
            </Form.Label>
            <div className="form-control-wrap">
              <Form.Control
                id="landDeveloped"
                type="text"
                name="unitPrice"
                value={amountValue.unitPrice}
                onChange={handleDevelopedLandInputs}
                placeholder="Enter Unit Price"
                readOnly
              />
              <Form.Control.Feedback type="invalid">
                Unit Price is required
              </Form.Control.Feedback>
            </div>
          </Form.Group>
        </Col>
        <Col lg="4">
          <Form.Group className="form-group mt-n3">
            <Form.Label htmlFor="expectedAmount">
              Subsidy Amount
              <span className="text-danger">*</span>
            </Form.Label>
            <div className="form-control-wrap">
              <Form.Control
                id="expectedAmount"
                type="text"
                name="expectedAmount"
                value={data.expectedAmount}
                onChange={handleInputs}
                placeholder="Enter Expected Amount"
                required
              />
              <Form.Control.Feedback type="invalid">
                Subsidy Amount is required
              </Form.Control.Feedback>
            </div>
          </Form.Group>
        </Col>
      </Row>
    </Card.Body>
  </Card>
</Block>

{/* Conditional Section Rendering */}
{data.equordev === "constructedArea" && (
  <Block className="mt-3">
    <Card>
      <Card.Header style={{ fontWeight: "bold" }}>
        Constructed Area
      </Card.Header>
      <Card.Body>
        <Row className="g-gs">
          <Col lg="4">
            <Form.Group className="form-group mt-n3">
              <Form.Label htmlFor="landDeveloped">
                Unit
                <span className="text-danger">*</span>
              </Form.Label>
              <div className="form-control-wrap">
                <Form.Control
                  id="landDeveloped"
                  type="text"
                  name="landDeveloped"
                  value={developedLand.landDeveloped}
                  onChange={handleDevelopedLandInputs}
                  placeholder="Enter Unit"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Unit Quantity is required
                </Form.Control.Feedback>
              </div>
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  </Block>
)}

{data.equordev === "equipment" && (
  <Block className="mt-3">
    <Card>
      <Card.Header style={{ fontWeight: "bold" }}>
        Equipment Purchase
      </Card.Header>
      <Card.Body>
        <Row className="g-gs">
          <Col lg="4">
            <Form.Group className="form-group mt-n3">
              <Form.Label>
                Vendor Name
                <span className="text-danger">*</span>
              </Form.Label>
              <div className="form-control-wrap">
                <Form.Select
                  name="vendorId"
                  value={equipment.vendorId}
                  onChange={handleEquipmentInputs}
                  required
                  isInvalid={
                    equipment.vendorId === undefined ||
                    equipment.vendorId === "0"
                  }
                >
                  <option value="">Select Vendor Name</option>
                  {scVendorListData.map((list) => (
                    <option
                      key={list.scVendorId}
                      value={list.scVendorId}
                    >
                      {list.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Vendor Name is required
                </Form.Control.Feedback>
              </div>
            </Form.Group>
          </Col>
          <Col lg="4">
            <Form.Group className="form-group mt-n3">
              <Form.Label htmlFor="description">
                Description
                <span className="text-danger">*</span>
              </Form.Label>
              <div className="form-control-wrap">
                <Form.Control
                  id="description"
                  type="text"
                  name="description"
                  value={equipment.description}
                  onChange={handleEquipmentInputs}
                  placeholder="Enter Description"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Description is required
                </Form.Control.Feedback>
              </div>
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  </Block>
)}

{data.equordev === "land" && data.with === "withLand" && landDetailsList.length > 0 && (
  <Block className="mt-3">
    <Card>
      <Card.Header style={{ fontWeight: "bold" }}>
        Land Wise
      </Card.Header>
      <Card.Body>
        {/* Display land-related details like the DataTable here */}
        <Row>
          <DataTable
            tableClassName="data-table-head-light table-responsive"
            columns={LandDetailsForDevColumns}
            data={landDetailsList}
            highlightOnHover
            progressPending={loading}
            theme="solarized"
            customStyles={customStyles}
          />
        </Row>
      </Card.Body>
    </Card>
  </Block>
)}



              <div className="gap-col">
                <ul className="d-flex align-items-center justify-content-center gap g-3">
                  <li>
                    {/* <Button type="button" variant="primary" onClick={postData}> */}
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
            </Row>
          </Form>
        </Block>
      </Row>
      
      <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>File Upload</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* {docListData.map(({ documentMasterId, documentMasterName }) => (
            <div key={documentMasterId}>
              <Row className="d-flex justify-content-center align-items-center">
                <Col lg="2">
                  <Form.Group className="form-group mt-1">
                    <Form.Label htmlFor="trUploadPath">
                      {documentMasterName}
                    </Form.Label>
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="form-group mt-1">
                    <div className="form-control-wrap">
                      <Form.Control
                        type="file"
                        id={`attImage${documentMasterId}`}
                        // name="hdAttachFiles"
                        // value={data.photoPath}
                        onChange={(e) => handleAttachFileChange(e, documentMasterId)}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4" style={{ position: "relative" }}>
                  <Form.Group className="form-group mt-3 d-flex justify-content-center">
                    {documentAttachments[documentMasterId] && (
                      <div style={{ position: "relative" }}>
                        <img
                          style={{ height: "150px", width: "150px" }}
                          src={URL.createObjectURL(
                            documentAttachments[documentMasterId]
                          )}
                        />
                        <button
                          style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            background: "transparent",
                            border: "none",
                            color: "black",
                            fontSize: "24px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleRemoveImage(documentMasterId)}
                        >
                          &times;
                        </button>
                      </div>
                    )}
                  </Form.Group>
                </Col>
                <Col lg="2">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => handleAttachFileUpload(documentMasterId)}
                  >
                    Upload
                  </Button>
                </Col>
                <Col lg="2">
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => handleAttachFileUpload(documentMasterId)}
                  disabled={isUploaded} // Disable button after upload
                >
                  {isUploaded ? "Uploaded" : "Upload"}
                </Button>
                <Button
                type="button"
                variant="primary"
                onClick={() => handleAttachFileUpload(documentMasterId)}
                disabled={uploadStatus[documentMasterId]} // Disable button if this document is uploaded
              >
                {uploadStatus[documentMasterId] ? "Uploaded" : "Upload"}
              </Button>
              </Col>
              </Row>
            </div>
          ))} */}
          <Block className="mt-3">
              <Row>
                <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label><strong>Documents</strong></Form.Label>
                        <Form.Select
                          name="documentTypeId"
                          value={uploadDocuments.documentTypeId}
                          onChange={handleDocumentInputs}
                        >
                          <option value="">Choose Document Type</option>
                          {docListData.map((list) => (
                            <option
                              key={list.documentMasterId}
                              value={list.documentMasterId}
                            >
                              {list.documentMasterName}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                <Col lg="6">
                <Form.Group className="form-group">
                        <Form.Label htmlFor="accountImagePath">
                          Upload Documents(PDF/jpg/png)(Max:2mb)
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            type="file"
                            id="documentPath"
                            name="documentPath"
                            // value={data.photoPath}
                            onChange={handleDocumentChange}
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3 d-flex justify-content-center">
                        {document ? (
                          <img
                            style={{ height: "100px", width: "100px" }}
                            src={URL.createObjectURL(document)}
                          />
                        ) : (
                          ""
                        )}
                      </Form.Group>
                      </Col>
              </Row>

              {/* {uploadedDocuments.length > 0 && (
    <div className="mt-3">
      <h5>Uploaded Documents</h5>
      <ul>
        {uploadedDocuments.map((doc, index) => (
          <li key={index}>
            Document Type: {doc.documentId} - {doc.documentName}
          </li>
        ))}
      </ul>
    </div>
  )} */}

  {uploadedDocuments.length > 0 && (
  <div className="mt-3">
    <h5>Uploaded Documents</h5>
    <ul>
      {uploadedDocuments.map((doc, index) => (
        <li key={index} className="d-flex align-items-center">
          {/* Show the image if it's available */}
          {doc.documentFile && (
            <img
              src={URL.createObjectURL(doc.documentFile)}
              alt={doc.documentName}
              style={{ height: "100px", width: "100px", marginRight: "10px" }}
            />
          )}
          {/* Show the document master name */}
          {/* <span>Document Type: {doc.documentMasterName }</span> */}
        </li>
      ))}
    </ul>
  </div>
)}

            </Block>

            {/* <Col lg="12"> */}
            <div className="gap-col mt-1">
            <ul className="d-flex align-items-center justify-content-center gap g-3">
              <li>
                {/* <Button type="submit" variant="success">
                  Upload Documents
                </Button> */}
                <Button
                type="button"
                variant="primary"
                onClick={() => handleAttachFileUpload(uploadDocuments.documentTypeId)}
                disabled={uploadStatus[uploadDocuments.documentTypeId]} // Disable button if this document is uploaded
              >
                {uploadStatus[uploadDocuments.documentTypeId] ? "Uploaded" : "Upload"}
              </Button>
                </li>
        </ul>
      </div>
        </Modal.Body>
      </Modal>

      <Modal show={showModalBreakUp} onHide={handleCloseModalBreakUp} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Break Up</Modal.Title>
        </Modal.Header> 
        <Modal.Body></Modal.Body>
      </Modal>
    </Layout>
  );
}

export default ServiceApplication;
