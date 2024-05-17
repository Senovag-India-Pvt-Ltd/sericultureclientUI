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
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION_FRUITS;
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
    scCategoryId: "",
    scSubSchemeType: "",
    scVendorId: "",
    farmerId: "",
    expectedAmount: "",
    financialYearMasterId: "",
    scComponentId: "",
    schemeAmount: "",
    sanctionNumber: "",
  });

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
    landDeveloped: developedLand.landDeveloped,
    landDetailId: parseInt(id),
    ...developedArea[id],
  }));

  // console.log(transformedData);

  // const

  const handleInlineDevelopedLandChange = (e, row) => {
    const { name, value } = e.target;
    const farmerLandDetailsId = row.farmerLandDetailsId;

    setDevelopedArea((prevData) => ({
      ...prevData,
      [farmerLandDetailsId]: {
        ...prevData[farmerLandDetailsId],
        [name]: value,
      },
    }));
  };

  console.log(developedArea);

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

  console.log("showdev", developedArea);

  const handleRemoveImage = (documentId) => {
    const updatedDocument = { ...documentAttachments };
    delete updatedDocument[documentId];
    setDocumentAttachments(updatedDocument);
    document.getElementById(`attImage${documentId}`).value = "";
    // setData((prev) => ({ ...prev, hdAttachFiles: "" }));
  };

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

  const handleCheckboxChange = (farmerLandDetailsId) => {
    setLandDetailsIds((prevIds) => {
      const isAlreadySelected = prevIds.includes(farmerLandDetailsId);
      const newIds = isAlreadySelected
        ? prevIds.filter((id) => id !== farmerLandDetailsId)
        : [...prevIds, farmerLandDetailsId];

      setDevelopedArea((prevData) => {
        if (isAlreadySelected) {
          const { [farmerLandDetailsId]: _, ...rest } = prevData;
          return rest;
        } else {
          // If selected, add to developedArea
          return {
            ...prevData,
            [farmerLandDetailsId]: {
              acre: prevData[farmerLandDetailsId]?.acre || "0",
              gunta: prevData[farmerLandDetailsId]?.gunta || "0",
              fgunta: prevData[farmerLandDetailsId]?.fgunta || "0",
            },
          };
        }
      });

      return newIds;
    });
  };

  console.log(landDetailsIds);

  // console.log(documentAttachments);

  // Upload Image to S3 Bucket
  const handleAttachFileUpload = async (documentId) => {
    // const parameters = `applicationFormId =${data.applicationId}`;
    const param = {
      applicationFormId: applicationId,
      documentTypeId: documentId,
    };
    try {
      const formData = new FormData();
      formData.append("multipartFile", documentAttachments[documentId]);

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
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleCheckBox = (e) => {
    setEquipment((prev) => ({
      ...prev,
      payToVendor: e.target.checked,
    }));
  };

  const [isDisabled, setIsDisabled] = useState(true);

  const [landDetailsList, setLandDetailsList] = useState([]);

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

  useEffect(() => {
    if (data.scSchemeDetailsId && data.scSubSchemeDetailsId)
      getComponentList(data.scSchemeDetailsId, data.scSubSchemeDetailsId);
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

  // to get uploadable documents
  const [docListData, setDocListData] = useState([]);

  const getDocList = () => {
    api
      .post(baseURLDBT + `service/getApplicableDocumentList`)
      .then((response) => {
        setDocListData(response.data.content);
      })
      .catch((err) => {
        setDocListData([]);
      });
  };

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
      landDeveloped: developedLand.landDeveloped,
      landDetailId: parseInt(id),
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
        farmerId: data.farmerId,
        payToVendor: equipment.payToVendor,
        headOfAccountId: data.scHeadAccountId,
        schemeId: data.scSchemeDetailsId,
        subSchemeId: data.scSubSchemeDetailsId,
        categoryId: data.scCategoryId,
        landDetailId: landDetailsIds[0],
        talukId: landData.talukId,
        newFarmer: true,
        // expectedAmount: data.expectedAmount,
        financialYearMasterId: data.financialYearMasterId,
        devAcre: 0,
        devGunta: 0,
        devFGunta: 0,
        schemeAmount: data.schemeAmount,
        sanctionNumber: data.sanctionNumber,
        initialAmount: data.expectedAmount,
      };

      if (data.equordev === "land") {
        // sendPost.applicationFormLandDetailRequestList = [
        //   {
        //     // unitTypeMasterId: developedLand.unitType,
        //     landDeveloped: developedLand.landDeveloped,
        //   },
        // ];
        sendPost.applicationFormLandDetailRequestList = transformedData;
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

  const generateBiddingSlip = async (applicationId) => {
    // const newDate = new Date();
    // const formattedDate =
    //   newDate.getFullYear() +
    //   "-" +
    //   (newDate.getMonth() + 1).toString().padStart(2, "0") +
    //   "-" +
    //   newDate.getDate().toString().padStart(2, "0");

    try {
      const response = await api.post(
        baseURLReport + `getBlankSample`,
        {
          applicationFormId: applicationId,
        },
        {
          responseType: "blob", //Force to receive data in a Blob Format
        }
      );

      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);

      // const file = new Blob([response.data], { type: "application/pdf" });
      // const fileURL = URL.createObjectURL(file);
      // const printWindow = window.open(fileURL);
      // if (printWindow) {
      //   printWindow.onload = () => {
      //     printWindow.print();
      //   };
      // } else {
      //   console.error("Failed to open the print window.");
      // }
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
      scSubSchemeDetailsId: "",
      scHeadAccountId: "",
      scCategoryId: "",
      scVendorId: "",
      farmerId: "",
      expectedAmount: "",
      financialYearMasterId: "",
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
  };

  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: `Receipt Number ${message}`,
    });
  };

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
            if (response.data.errorCode === -1) {
              saveError(response.data.message);
            } else {
              // saveSuccess(response.data.receiptNo);
              setApplicationId(response.data.content.applicationDocumentId);
              handleShowModal();

              // setData({
              //   fruitsId: "",
              //   farmerName: "",
              //   mulberryVarietyId: "",
              //   area: "",
              //   dateOfPlanting: "",
              //   nurserySaleDetails: "",
              //   quantity: "",
              //   date: "",
              //   rate: "",
              //   saplingAge: "",
              //   remittanceDetails: "",
              //   challanUploadKey: "",
              // });
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
              generateBiddingSlip(response.data.content.applicationDocumentId);
              // handleShowModal();

              // setData({
              //   fruitsId: "",
              //   farmerName: "",
              //   mulberryVarietyId: "",
              //   area: "",
              //   dateOfPlanting: "",
              //   nurserySaleDetails: "",
              //   quantity: "",
              //   date: "",
              //   rate: "",
              //   saplingAge: "",
              //   remittanceDetails: "",
              //   challanUploadKey: "",
              // });
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
      }
      api
        .post(baseURLRegistration + `farmer/get-farmer-details`, {
          fruitsId: data.fruitsId,
        })
        .then((response) => {
          console.log(response);
          if (!response.data.content.error) {
            if (response.data.content.farmerResponse) {
              setData((prev) => ({
                ...prev,
                farmerId: response.data.content.farmerResponse.farmerId,
              }));
              setFarmerDetails((prev) => ({
                ...prev,
                farmerName: response.data.content.farmerResponse.firstName,
                hobli: response.data.content.farmerAddressDTOList[0].hobliName,
                village:
                  response.data.content.farmerAddressDTOList[0].villageName,
              }));
              setShowFarmerDetails(true);
            }
            if (response.data.content.farmerLandDetailsDTOList.length > 0) {
              setLandDetailsList(
                response.data.content.farmerLandDetailsDTOList
              );
            }
            if (response.data.content.farmerAddressDTOList.length > 0) {
              setLandData((prev) => ({
                ...prev,
                talukId:
                  response.data.content.farmerAddressDTOList[0].talukId || 0,
              }));
            }
          } else {
            saveError(response.data.content.error_description);
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
      cell: (row) => (
        <input
          type="checkbox"
          name="selectedLand"
          value={row.farmerLandDetailsId}
          checked={landDetailsIds.includes(row.farmerLandDetailsId)}
          onChange={() => handleCheckboxChange(row.farmerLandDetailsId)}
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

    {
      name: "Developed Area (Acre/Gunta/FGunta)",
      // selector: (row) => row.acre,
      cell: (row) => (
        <>
          <Form.Control
            name="acre"
            type="text"
            value={developedArea[row.farmerLandDetailsId]?.acre || ""}
            onChange={(e) => handleInlineDevelopedLandChange(e, row)}
            placeholder="Acre"
            className="m-1"
          />
          <Form.Control
            name="gunta"
            type="text"
            value={developedArea[row.farmerLandDetailsId]?.gunta || ""}
            onChange={(e) => handleInlineDevelopedLandChange(e, row)}
            placeholder="Gunta"
            className="m-1"
          />
          <Form.Control
            name="fgunta"
            type="text"
            value={developedArea[row.farmerLandDetailsId]?.fgunta || ""}
            onChange={(e) => handleInlineDevelopedLandChange(e, row)}
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
                  to="/seriui/application-selection"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Old Applications</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/application-selection"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>Old Applications</span>
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
                          <td style={styles.ctstyle}> Hobli :</td>
                          <td>{farmerDetails.hobli}</td>
                          <td style={styles.ctstyle}> Village:</td>
                          <td>{farmerDetails.village}</td>
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
                                {scSubSchemeDetailsListData.map((list, i) => (
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
                                {scComponentListData.map((list) => (
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
                                {scHeadAccountListData.map((list) => (
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
                                {scCategoryListData.map((list) => (
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

                        <Col lg="6">
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
                        </Col>
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

              <Card className="mt-1">
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
                        Developed Area
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
                </Row>
              </Card>
              {data.with === "withLand" && landDetailsList.length > 0 ? (
                <>
                  <Block className="mt-3">
                    <Card>
                      {/* <Card.Header style={{ fontWeight: "bold" }}>
                        RTC Details
                      </Card.Header> */}
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

                      {/* <Row className="ms-1">
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
                            <Form.Label
                              column
                              sm={9}
                              className="mt-n2"
                              id="land"
                            >
                              Developed Area
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
                            <Form.Label
                              column
                              sm={9}
                              className="mt-n2"
                              id="equip"
                            >
                              Equipment Purchase
                            </Form.Label>
                          </Form.Group>
                        </Col>
                      </Row> */}
                    </Card>
                  </Block>
                  {data.equordev === "land" ? (
                    <Block className="mt-3">
                      <Card>
                        <Card.Header style={{ fontWeight: "bold" }}>
                          Developed Area
                        </Card.Header>
                        <Card.Body>
                          <Row className="g-gs">
                            {/* <Col lg="4">
                              <Form.Group className="form-group mt-n3">
                                <Form.Label>
                                  Unit Type
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Select
                                    name="unitType"
                                    value={developedLand.unitType}
                                    onChange={handleDevelopedLandInputs}
                                    onBlur={() => handleDevelopedLandInputs}
                                    // multiple
                                    // required
                                    isInvalid={
                                      developedLand.unitType === undefined ||
                                      developedLand.unitType === "0"
                                    }
                                  >
                                    <option value="">Select Unit Type</option>
                                    {unitTypeList.map((list) => (
                                      <option key={list.id} value={list.id}>
                                        {list.measurementUnit}
                                      </option>
                                    ))}
                                  </Form.Select>
                                  <Form.Control.Feedback type="invalid">
                                    Unit Type is required
                                  </Form.Control.Feedback>
                                </div>
                              </Form.Group>
                            </Col> */}
                            <Col lg="4">
                              <Form.Group className="form-group mt-n3">
                                <Form.Label htmlFor="landDeveloped">
                                  Unit Quantity
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="landDeveloped"
                                    type="text"
                                    name="landDeveloped"
                                    value={developedLand.landDeveloped}
                                    onChange={handleDevelopedLandInputs}
                                    placeholder="Enter Unit Quantity"
                                    required
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Unit Quantity is required
                                  </Form.Control.Feedback>
                                </div>
                              </Form.Group>
                            </Col>
                            {/* <Col lg="4">
                              <Form.Group className="form-group mt-n3">
                                <Form.Label htmlFor="gunta">
                                  Gunta<span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="gunta"
                                    type="text"
                                    name="gunta"
                                    value={developedLand.gunta}
                                    onChange={handleDevelopedLandInputs}
                                    placeholder="Enter Gunta"
                                    required
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Gunta is required
                                  </Form.Control.Feedback>
                                </div>
                              </Form.Group>
                            </Col>
                            <Col lg="4">
                              <Form.Group className="form-group mt-n3">
                                <Form.Label htmlFor="fgunta">
                                  FGunta<span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    id="fgunta"
                                    type="text"
                                    name="fgunta"
                                    value={developedLand.fgunta}
                                    onChange={handleDevelopedLandInputs}
                                    placeholder="Enter FGunta"
                                    required
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    FGunta is required
                                  </Form.Control.Feedback>
                                </div>
                              </Form.Group>
                            </Col> */}
                          </Row>
                        </Card.Body>
                      </Card>
                    </Block>
                  ) : (
                    <Block className="mt-3">
                      <Card>
                        <Card.Header style={{ fontWeight: "bold" }}>
                          Equipment Purchase
                        </Card.Header>
                        <Card.Body>
                          <Row className="g-gs">
                            {/* <Col lg="4">
                              <Form.Group className="form-group mt-n3">
                                <Form.Label>
                                  Unit Type
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Select
                                    name="unitType"
                                    value={equipment.unitType}
                                    onChange={handleEquipmentInputs}
                                    onBlur={() => handleEquipmentInputs}
                                    // multiple
                                    // required
                                    isInvalid={
                                      equipment.unitType === undefined ||
                                      equipment.unitType === "0"
                                    }
                                  >
                                    <option value="">Select Unit Type</option>
                                    {unitTypeList.map((list) => (
                                      <option key={list.id} value={list.id}>
                                        {list.measurementUnit}
                                      </option>
                                    ))}
                                  </Form.Select>
                                  <Form.Control.Feedback type="invalid">
                                    Unit Type is required
                                  </Form.Control.Feedback>
                                </div>
                              </Form.Group>
                            </Col> */}
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
                            <Col lg="4">
                              <Form.Group as={Row} className="form-group mt-4">
                                <Col sm={1}>
                                  <Form.Check
                                    type="checkbox"
                                    id="payToVendor"
                                    checked={equipment.payToVendor}
                                    onChange={handleCheckBox}
                                    // Optional: disable the checkbox in view mode
                                    // defaultChecked
                                  />
                                </Col>
                                <Form.Label column sm={11} className="mt-n2">
                                  Pay to Vendor
                                </Form.Label>
                              </Form.Group>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Block>
                  )}
                </>
              ) : (
                ""
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
          {docListData.map(({ documentId, documentName }) => (
            <div key={documentId}>
              <Row className="d-flex justify-content-center align-items-center">
                <Col lg="2">
                  <Form.Group className="form-group mt-1">
                    <Form.Label htmlFor="trUploadPath">
                      {documentName}
                    </Form.Label>
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="form-group mt-1">
                    {/* <Form.Label htmlFor="trUploadPath">Attach Files</Form.Label> */}
                    <div className="form-control-wrap">
                      <Form.Control
                        type="file"
                        id={`attImage${documentId}`}
                        // name="hdAttachFiles"
                        // value={data.photoPath}
                        onChange={(e) => handleAttachFileChange(e, documentId)}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4" style={{ position: "relative" }}>
                  <Form.Group className="form-group mt-3 d-flex justify-content-center">
                    {documentAttachments[documentId] && (
                      <div style={{ position: "relative" }}>
                        <img
                          style={{ height: "150px", width: "150px" }}
                          src={URL.createObjectURL(
                            documentAttachments[documentId]
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
                          onClick={() => handleRemoveImage(documentId)}
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
                    onClick={() => handleAttachFileUpload(documentId)}
                  >
                    Upload
                  </Button>
                </Col>
              </Row>
            </div>
          ))}
        </Modal.Body>
      </Modal>
    </Layout>
  );
}

export default ServiceApplication;
