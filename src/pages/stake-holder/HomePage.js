import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DatePicker from "react-datepicker";
import { Icon, Select } from "../../components";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";
// import axios from "axios";
import { useNavigate } from "react-router-dom";

import api from "../../services/auth/api";
import { isValidDate } from "@fullcalendar/react";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_REGISTRATION;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION_FRUITS;

function HomePage() {
  const [data, setData] = useState({
    fruitsId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    genderId: "",
    casteId: "",
    differentlyAbled: "",
    email: "",
    mobileNumber: "",
    aadhaarNumber: "",
    epicNumber: "",
    rationCardNumber: "",
    totalLandHolding: "",
    passbookNumber: "",
    landCategoryId: "",
    educationId: "",
    representativeId: "",
    khazaneRecipientId: "",
    photoPath: "",
    farmerTypeId: "",
    minority: "",
    rdNumber: "",
    casteStatus: "",
    genderStatus: "",
    fatherNameKan: "",
    fatherName: "",
    nameKan: "",
  });

  const [isOtherState, setIsOtherState] = useState(true);

  //  console.log("data",data.photoPath);

  const search = () => {
    setData({
      farmerNumber: "",
      fruitsId: "",
      firstName: "",
      middleName: "",
      lastName: "",
      dob: "",
      genderId: "",
      casteId: "",
      differentlyAbled: "",
      email: "",
      mobileNumber: "",
      aadhaarNumber: "",
      epicNumber: "",
      rationCardNumber: "",
      totalLandHolding: "",
      passbookNumber: "",
      landCategoryId: "",
      educationId: "",
      representativeId: "",
      khazaneRecipientId: "",
      photoPath: "",
      farmerTypeId: "",
      minority: "",
      rdNumber: "",
      casteStatus: "",
      genderStatus: "",
      fatherNameKan: "",
      fatherName: "",
      nameKan: "",
    });
    setFarmerAddressList([]);
    setBank({
      accountImagePath: "",
      farmerId: "",
      farmerBankName: "",
      farmerBankAccountNumber: "",
      farmerBankBranchName: "",
      farmerBankIfscCode: "",
    });

    api
      .post(baseURL2 + `farmer/get-farmer-details-by-fruits-id-test`, data)
      .then((response) => {
        if (!response.data.content.isFruitService) {
          const farmerId = response.data.content.farmerResponse.farmerId;
          navigate(`/seriui/stake-holder-edit/${farmerId}`);
        } else {
          api
            .post(
              baseURLFarmer +
                `farmer/get-farmer-details-by-fruits-id-or-farmer-number-or-mobile-number`,
              { fruitsId: data.fruitsId }
              // {
              //   headers: _header,
              // }
            )
            .then((result) => {
              setData((prev) => ({
                ...prev,
                ...result.data.content.farmerResponse,
              }));
              setFarmerAddressList((prev) => [
                ...prev,
                ...result.data.content.farmerAddressList,
              ]);

              const modified = result.data.content.farmerLandDetailsDTOList.map(
                (detail) => {
                  if (detail.stateId === 0) {
                    detail.stateId = null;
                  }
                  if (detail.districtId === 0) {
                    detail.districtId = null;
                  }
                  if (detail.talukId === 0) {
                    detail.talukId = null;
                  }
                  if (detail.hobliId === 0) {
                    detail.hobliId = null;
                  }
                  if (detail.villageId === 0) {
                    detail.villageId = null;
                  }
                  return detail;
                }
              );
              // console.log(modified);FF
            })
            .catch((error) => {});
        }
      })
      .catch((error) => {});
  };

  const [farmerAddressList, setFarmerAddressList] = useState([]);
  const [farmerAddress, setFarmerAddress] = useState({
    stateId: "",
    districtId: "",
    talukId: "",
    hobliId: "",
    villageId: "",
    addressText: "",
    pincode: "",
    defaultAddress: true,
  });

  const handleFarmerAddressInputs = (e) => {
    const { name, value } = e.target;
    setFarmerAddress({ ...farmerAddress, [name]: value });
  };

  const [bank, setBank] = useState({
    accountImagePath: "",
    farmerId: "",
    farmerBankName: "",
    farmerBankAccountNumber: "",
    farmerBankBranchName: "",
    farmerBankIfscCode: "",
  });

  const handleOtherState = (e) => {
    const { value } = e.target;
    setIsOtherState(value);
  };

  // const [farmerId, setFarmerId] = useState({
  //   farmerId: "",
  // });

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
    // setFarmerId({ ...farmerId, farmerId: value });

    if (name === "mobileNumber" && (value.length < 10 || value.length > 10)) {
      e.target.classList.add("is-invalid");
    } else {
      e.target.classList.remove("is-invalid");
      e.target.classList.add("is-valid");
    }
  };

  const clear = () => {
    setData({
      fruitsId: "",
      firstName: "",
      middleName: "",
      lastName: "",
      dob: "",
      genderId: "",
      casteId: "",
      differentlyAbled: "",
      email: "",
      mobileNumber: "",
      aadhaarNumber: "",
      epicNumber: "",
      rationCardNumber: "",
      totalLandHolding: "",
      passbookNumber: "",
      landCategoryId: "",
      educationId: "",
      representativeId: "",
      khazaneRecipientId: "",
      photoPath: "",
      farmerTypeId: "",
      minority: "",
      rdNumber: "",
      casteStatus: "",
      genderStatus: "",
      fatherNameKan: "",
      fatherName: "",
      nameKan: "",
    });
    setBank({
      accountImagePath: "",
      farmerId: "",
      farmerBankName: "",
      farmerBankAccountNumber: "",
      farmerBankBranchName: "",
      farmerBankIfscCode: "",
    });
    setFarmerAddress({
      stateId: "",
      districtId: "",
      talukId: "",
      hobliId: "",
      villageId: "",
      addressText: "",
      pincode: "",
      defaultAddress: true,
    });
  };

  const handleBankInputs = (e) => {
    const { name } = e.target;
    let value = e.target.value;

    // if (name === "farmerBankIfscCode" && value.length > 11) {
    //   value = value.slice(0, 11);
    // }
    if (
      name === "farmerBankIfscCode" &&
      (value.length < 11 || value.length > 11)
    ) {
      e.target.classList.add("is-invalid");
    } else {
      e.target.classList.remove("is-invalid");
      e.target.classList.add("is-valid");
    }
    setBank({ ...bank, [name]: value });
  };

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  const [selected, setSelected] = useState("no");
  const handleChange = (event) => {
    setSelected(event.target.value);
  };

  const [validated, setValidated] = useState(false);
  const [validatedFamilyMembers, setValidatedFamilyMembers] = useState(false);
  const [validatedFamilyMembersEdit, setValidatedFamilyMembersEdit] =
    useState(false);
  const [validatedFarmerLand, setValidatedFarmerLand] = useState(false);
  const [validatedFarmerLandEdit, setValidatedFarmerLandEdit] = useState(false);
  const [validatedFarmerAddress, setValidatedFarmerAddress] = useState(false);
  const [validatedFarmerAddressEdit, setValidatedFarmerAddressEdit] =
    useState(false);

  console.log(validated);

  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      api
        .post(baseURL2 + `farmer/add-non-karnataka-farmer`, {
          ...data,
          farmerAddressList: [{ ...farmerAddress }],
          farmerBankAccount: { ...bank },
        })
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess(
              `Generated Farmer Number ${response.data.content.farmerNumber}`
            );
            handleFileUpload(response.data.content.farmerId);
            handleFileDocumentUpload(response.data.content.farmerBankAccountId);
            setValidated(false);
          }
        })
        .catch((err) => {
          //   if (Object.keys(err.response.data.validationErrors).length > 0) {
          //     saveError(err.response.data.validationErrors);
          //   }
        });
      setValidated(true);
    }
  };

  // to get farmerType
  const [farmerTypeListData, setFarmerTypeListData] = useState([]);

  const getFarmerTypeList = () => {
    api
      .get(baseURL2 + `farmer-type/get-all`)
      .then((response) => {
        setFarmerTypeListData(response.data.content.farmerType);
      })
      .catch((err) => {
        setFarmerTypeListData([]);
      });
  };

  useEffect(() => {
    getFarmerTypeList();
  }, []);

  // to get caste
  const [casteListData, setCasteListData] = useState([]);

  const getCasteList = () =>
    api
      .get(baseURL + `caste/get-all`)
      .then((response) => {
        setCasteListData(response.data.content.caste);
      })
      .catch((err) => {
        setCasteListData([]);
      });

  useEffect(() => {
    getCasteList();
  }, []);

  // to get landHolding Category
  const [landHoldingCategoryListData, setLandHoldingCategoryListData] =
    useState([]);

  const getLandHoldingCategoryList = () =>
    api
      .get(baseURL + `landCategory/get-all`)
      .then((response) => {
        setLandHoldingCategoryListData(response.data.content.landCategory);
      })
      .catch((err) => {
        setLandHoldingCategoryListData([]);
      });

  useEffect(() => {
    getLandHoldingCategoryList();
  }, []);

  // to get education
  const [educationListData, setEducationListData] = useState([]);

  const getEducationList = () =>
    api
      .get(baseURL + `education/get-all`)
      .then((response) => {
        setEducationListData(response.data.content.education);
      })
      .catch((err) => {
        setEducationListData([]);
      });

  useEffect(() => {
    getEducationList();
  }, []);

  // to get Relationship
  const [relationshipListData, setRelationshipListData] = useState([]);

  const getRelationshipList = () => {
    api
      .get(baseURL + `relationship/get-all`)
      .then((response) => {
        setRelationshipListData(response.data.content.relationship);
      })
      .catch((err) => {
        setRelationshipListData([]);
      });
  };

  useEffect(() => {
    getRelationshipList();
  }, []);

  // to get Plantation Type
  const [plantationTypeListData, setPlantationTypeListData] = useState([]);

  const getPlantationTypeList = () =>
    api
      .get(baseURL + `plantationType/get-all`)
      .then((response) => {
        setPlantationTypeListData(response.data.content.plantationType);
      })
      .catch((err) => {
        setPlantationTypeListData([]);
      });

  useEffect(() => {
    getPlantationTypeList();
  }, []);

  // to get landOwnership
  const [landOwnershipListData, setLandOwnershipListData] = useState([]);

  const getLandOwnershipList = () =>
    api
      .get(baseURL + `landOwnership/get-all`)
      .then((response) => {
        setLandOwnershipListData(response.data.content.landOwnership);
      })
      .catch((err) => {
        setLandOwnershipListData([]);
      });

  useEffect(() => {
    getLandOwnershipList();
  }, []);

  // to get SoilType
  const [soilTypeListData, setSoilTypeListData] = useState([]);

  const getSoilTypeList = () =>
    api
      .get(baseURL + `soilType/get-all`)
      .then((response) => {
        setSoilTypeListData(response.data.content.soilType);
      })
      .catch((err) => {
        setSoilTypeListData([]);
      });

  useEffect(() => {
    getSoilTypeList();
  }, []);

  // to get MulberrySource
  const [mulberrySourceListData, setMulberrySourceListData] = useState([]);

  const getMulberrySourceList = () => {
    api
      .get(baseURL + `mulberry-source/get-all`)
      .then((response) => {
        setMulberrySourceListData(response.data.content.mulberrySource);
      })
      .catch((err) => {
        setMulberrySourceListData([]);
      });
  };

  useEffect(() => {
    getMulberrySourceList();
  }, []);

  // to get MulberryVariety
  const [mulberryVarietyListData, setMulberryVarietyListData] = useState([]);

  const getMulberryVarietyList = () => {
    api
      .get(baseURL + `mulberry-variety/get-all`)
      .then((response) => {
        setMulberryVarietyListData(response.data.content.mulberryVariety);
      })
      .catch((err) => {
        setMulberryVarietyListData([]);
      });
  };

  useEffect(() => {
    getMulberryVarietyList();
  }, []);

  // to get irrigationSource
  const [irrigationSourceListData, setIrrigationSourceListData] = useState([]);

  const getIrrigationSourceList = () => {
    api
      .get(baseURL + `irrigationSource/get-all`)
      .then((response) => {
        setIrrigationSourceListData(response.data.content.irrigationSource);
      })
      .catch((err) => {
        setIrrigationSourceListData([]);
      });
  };

  useEffect(() => {
    getIrrigationSourceList();
  }, []);

  // to get irrigationType
  const [irrigationTypeListData, setIrrigationTypeListData] = useState([]);

  const getIrrigationTypeList = () => {
    api
      .get(baseURL + `irrigationType/get-all`)
      .then((response) => {
        setIrrigationTypeListData(response.data.content.irrigationType);
      })
      .catch((err) => {
        setIrrigationTypeListData([]);
      });
  };

  useEffect(() => {
    getIrrigationTypeList();
  }, []);

  // to get roofType
  const [roofTypeListData, setRoofTypeListData] = useState([]);

  const getRoofTypeList = () => {
    api
      .get(baseURL + `roofType/get-all`)
      .then((response) => {
        setRoofTypeListData(response.data.content.roofType);
      })
      .catch((err) => {
        setRoofTypeListData([]);
      });
  };

  useEffect(() => {
    getRoofTypeList();
  }, []);

  // to get silkWormVariety
  const [silkWormVarietyListData, setSilkWormVarietyListData] = useState([]);

  const getSilkWormVarietyList = () => {
    api
      .get(baseURL + `silk-worm-variety/get-all`)
      .then((response) => {
        setSilkWormVarietyListData(response.data.content.silkWormVariety);
      })
      .catch((err) => {
        setSilkWormVarietyListData([]);
      });
  };

  useEffect(() => {
    getSilkWormVarietyList();
  }, []);

  // to get subsidyMaster
  const [subsidyMasterListData, setSubsidyMasterListData] = useState([]);

  const getSubsidyMasterList = () => {
    api
      .get(baseURL + `subsidy/get-all`)
      .then((response) => {
        setSubsidyMasterListData(response.data.content.subsidy);
      })
      .catch((err) => {
        setSubsidyMasterListData([]);
      });
  };

  useEffect(() => {
    getSubsidyMasterList();
  }, []);

  // to get State
  const [stateListData, setStateListData] = useState([]);

  const getList = () =>
    api
      .get(baseURL + `state/get-all`)
      .then((response) => {
        setStateListData(response.data.content.state);
      })
      .catch((err) => {
        setStateListData([]);
      });

  useEffect(() => {
    getList();
  }, []);

  const [addressStateListData, setAddressStateListData] = useState([]);
  const getAddressList = () => {
    api
      .get(baseURL + `state/get-all`)
      .then((response) => {
        setAddressStateListData(response.data.content.state);
      })
      .catch((err) => {
        setAddressStateListData([]);
      });
  };

  useEffect(() => {
    getAddressList();
  }, []);

  const [addressdistrictListData, setAddressDistrictListData] = useState([]);

  const getAddressDistrictList = (_id) => {
    api
      .get(baseURL + `district/get-by-state-id/${_id}`)
      .then((response) => {
        console.log(response.data);

        if (response.data.content && response.data.content.error) {
          console.log("Error in API response:", response.data.content.error);
          setAddressDistrictListData([]);
        } else {
          // Set the district list data
          setAddressDistrictListData(response.data.content.district);
        }
      })
      .catch((err) => {
        setAddressDistrictListData([]);
        console.log("Error in API call:", err);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (farmerAddress.stateId) {
      console.log("Effect triggered with stateId:", farmerAddress.stateId);
      getAddressDistrictList(farmerAddress.stateId);
    }
  }, [farmerAddress.stateId]);

  const [addressTalukListData, setAddressTalukListData] = useState([]);

  const getAddressTalukList = (_id) => {
    api
      .get(baseURL + `taluk/get-by-district-id/${_id}`)
      .then((response) => {
        console.log(response.data);

        if (response.data.content && response.data.content.error) {
          console.log("Error in API response:", response.data.content.error);
          setAddressTalukListData([]);
        } else {
          // Set the taluk list data
          setAddressTalukListData(response.data.content.taluk);
        }
      })
      .catch((err) => {
        setAddressTalukListData([]);
        console.log("Error in API call:", err);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (farmerAddress.districtId) {
      console.log(
        "Effect triggered with districtId:",
        farmerAddress.districtId
      );
      getAddressTalukList(farmerAddress.districtId);
    }
  }, [farmerAddress.districtId]);

  const [addressHobliListData, setAddressHobliListData] = useState([]);

  const getAddressHobliList = (_id) => {
    api
      .get(baseURL + `hobli/get-by-taluk-id/${_id}`)
      .then((response) => {
        console.log(response.data);

        if (response.data.content && response.data.content.error) {
          console.log("Error in API response:", response.data.content.error);
          setAddressHobliListData([]);
        } else {
          // Set the hobli list data
          setAddressHobliListData(response.data.content.hobli);
        }
      })
      .catch((err) => {
        setAddressHobliListData([]);
        console.log("Error in API call:", err);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (farmerAddress.talukId) {
      console.log("Effect triggered with talukId:", farmerAddress.talukId);
      getAddressHobliList(farmerAddress.talukId);
    }
  }, [farmerAddress.talukId]);

  const [addressVillageListData, setAddressVillageListData] = useState([]);

  const getAddressVillageList = (_id) => {
    api
      .get(baseURL + `village/get-by-hobli-id/${_id}`)
      .then((response) => {
        console.log(response.data);

        if (response.data.content && response.data.content.error) {
          console.log("Error in API response:", response.data.content.error);
          setAddressVillageListData([]);
        } else {
          // Set the village list data
          setAddressVillageListData(response.data.content.village);
        }
      })
      .catch((err) => {
        setAddressVillageListData([]);
        console.log("Error in API call:", err);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (farmerAddress.hobliId) {
      console.log("Effect triggered with hobliId:", farmerAddress.hobliId);
      getAddressVillageList(farmerAddress.hobliId);
    }
  }, [farmerAddress.hobliId]);

  const navigate = useNavigate();
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

  const saveFarmerError = (message) => {
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      text: message,
    });
  };

  // const saveFamilyError = (message) => {
  //   Swal.fire({
  //     icon: "error",
  //     title: "Save attempt was not successful",
  //     text: message,
  //   });
  // };

  // const saveBankError = (message) => {
  //   Swal.fire({
  //     icon: "error",
  //     title: "Save attempt was not successful",
  //     text: message,
  //   });
  // };

  // State
  const handleStateOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setFarmerAddress({
      ...farmerAddress,
      stateId: chooseId,
      stateName: chooseName,
    });
  };

  // District
  const handleDistrictOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setFarmerAddress({
      ...farmerAddress,
      districtId: chooseId,
      districtName: chooseName,
    });
  };

  // Taluk
  const handleTalukOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setFarmerAddress({
      ...farmerAddress,
      talukId: chooseId,
      talukName: chooseName,
    });
  };

  // Hobli
  const handleHobliOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setFarmerAddress({
      ...farmerAddress,
      hobliId: chooseId,
      hobliName: chooseName,
    });
  };

  // Village
  const handleVillageOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setFarmerAddress({
      ...farmerAddress,
      villageId: chooseId,
      villageName: chooseName,
    });
  };

  // Program
  // const handleProgramOption = (e) => {
  //   const value = e.target.value;
  //   const [chooseId, chooseName] = value.split("_");
  //   setFarmerLand({
  //     ...farmerLand,
  //     scProgramId: chooseId,
  //     scProgramName: chooseName,
  //   });
  // };

  // roofType

  // State

  // console.log(stateNameLD);

  //Display Document
  const [document, setDocument] = useState("");

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    setDocument(file);
    setBank((prev) => ({ ...prev, accountImagePath: file.name }));
    // setPhotoFile(file);
  };

  // Upload Image to S3 Bucket
  const handleFileDocumentUpload = async (farmerBankAccountid) => {
    const parameters = `farmerBankAccountId=${farmerBankAccountid}`;
    try {
      const formData = new FormData();
      formData.append("multipartFile", document);

      const response = await api.post(
        baseURL2 + `farmer-bank-account/upload-photo?${parameters}`,
        formData,
        {
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

  // Display Image
  const [image, setImage] = useState("");
  // const [photoFile,setPhotoFile] = useState("")

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setData((prev) => ({ ...prev, photoPath: file.name }));
    // setPhotoFile(file);
  };

  // Upload Image to S3 Bucket
  const handleFileUpload = async (fid) => {
    const parameters = `farmerId=${fid}`;
    try {
      const formData = new FormData();
      formData.append("multipartFile", image);

      const response = await api.post(
        baseURL2 + `farmer/upload-photo?${parameters}`,
        formData,
        {
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

  return (
    <Layout title="Home">
      <style>{`
        /* ===== BASE ===== */
        .d-home {
          font-family: 'Poppins', 'Segoe UI', sans-serif;
          background: #eef3fb;
          min-height: calc(100vh - 80px);
          padding: 0 0 48px;
          box-sizing: border-box;
        }

        /* ===== HERO BANNER ===== */
        .d-hero {
          background: linear-gradient(120deg, #062d5e 0%, #0a4d8a 40%, #0f6cbe 80%, #1e85d8 100%);
          padding: 36px 32px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(6,45,94,0.35);
        }
        .d-hero::before {
          content:''; position:absolute; top:-80px; right:-80px;
          width:300px; height:300px; border-radius:50%;
          background:rgba(255,255,255,0.05); pointer-events:none;
        }
        .d-hero::after {
          content:''; position:absolute; bottom:-100px; right:220px;
          width:320px; height:320px; border-radius:50%;
          background:rgba(255,255,255,0.04); pointer-events:none;
        }
        .d-hero-left { position:relative; z-index:1; }
        .d-hero-eyebrow {
          display:inline-block;
          background:rgba(255,255,255,0.12);
          border:1px solid rgba(255,255,255,0.2);
          border-radius:30px;
          padding:4px 16px;
          font-size:0.72rem;
          font-weight:700;
          letter-spacing:0.1em;
          color:#c8e0ff;
          text-transform:uppercase;
          margin-bottom:12px;
        }
        .d-hero-title {
          font-size:1.75rem !important;
          font-weight:900 !important;
          color:#ffffff !important;
          margin:0 0 8px !important;
          line-height:1.2 !important;
          text-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .d-hero-sub {
          font-size:0.92rem !important;
          color:rgba(255,255,255,0.82) !important;
          margin:0 !important;
          font-weight:500 !important;
        }
        .d-hero-right {
          position:relative; z-index:1;
          display:flex; flex-direction:column; align-items:flex-end; gap:10px;
        }
        .d-hero-badge {
          background:rgba(255,255,255,0.14);
          border:1px solid rgba(255,255,255,0.25);
          border-radius:10px;
          padding:10px 20px;
          text-align:center;
        }
        .d-hero-badge-num {
          font-size:1.5rem; font-weight:900; color:#fff; line-height:1;
        }
        .d-hero-badge-lbl {
          font-size:0.7rem; color:rgba(255,255,255,0.75); font-weight:600; margin-top:2px;
        }
        .d-hero-badges { display:flex; gap:10px; }

        /* ===== CONTENT WRAPPER ===== */
        .d-body { padding: 28px 28px 0; }

        /* ===== SECTION HEADER ===== */
        .d-section-hd {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0 0 16px;
        }
        .d-section-hd-bar {
          width: 4px; height: 22px;
          background: linear-gradient(180deg, #0a4d8a 0%, #1e85d8 100%);
          border-radius: 4px;
          flex-shrink: 0;
        }
        .d-section-hd-title {
          font-size:0.82rem !important;
          font-weight:800 !important;
          letter-spacing:0.07em !important;
          text-transform:uppercase !important;
          color:#0a4d8a !important;
          margin:0 !important;
        }
        .d-section-hd-line {
          flex:1; height:1px; background:#dde8f5;
        }

        /* ===== STATS ===== */
        .d-stats {
          display:grid;
          grid-template-columns:repeat(auto-fill, minmax(170px,1fr));
          gap:14px;
          margin-bottom:32px;
        }
        .d-stat {
          background:#fff;
          border-radius:14px;
          padding:20px 16px 16px;
          box-shadow:0 2px 12px rgba(10,77,138,0.07);
          border-top:3px solid #0f6cbe;
          display:flex; flex-direction:column; gap:8px;
          transition:box-shadow 0.2s, transform 0.15s;
          position:relative; overflow:hidden;
        }
        .d-stat::after {
          content:'';
          position:absolute; bottom:-14px; right:-14px;
          width:60px; height:60px; border-radius:50%;
          background:rgba(15,108,190,0.04);
        }
        .d-stat:hover { box-shadow:0 8px 24px rgba(10,77,138,0.15); transform:translateY(-3px); }
        .d-stat.gold { border-top-color:#f9a825; }
        .d-stat.gold::after { background:rgba(249,168,37,0.06); }
        .d-stat.teal { border-top-color:#00897b; }
        .d-stat.rose { border-top-color:#e53935; }
        .d-stat-icon { font-size:1.8rem; line-height:1; }
        .d-stat-val {
          font-size:1.6rem !important; font-weight:900 !important;
          color:#062d5e !important; line-height:1 !important; margin:0 !important;
        }
        .d-stat-lbl {
          font-size:0.77rem; color:#5a7a9a; font-weight:600; line-height:1.35;
        }

        /* ===== MODULE CARDS ===== */
        .d-modules {
          display:grid;
          grid-template-columns:repeat(auto-fill, minmax(220px,1fr));
          gap:16px;
          margin-bottom:32px;
        }
        .d-mod {
          background:#fff;
          border-radius:14px;
          overflow:hidden;
          box-shadow:0 2px 12px rgba(10,77,138,0.07);
          display:flex; flex-direction:column;
          text-decoration:none; color:inherit;
          transition:box-shadow 0.2s, transform 0.15s;
          border:1.5px solid transparent;
        }
        .d-mod:hover {
          box-shadow:0 8px 28px rgba(10,77,138,0.16);
          transform:translateY(-3px);
          border-color:#bfd4ec;
          text-decoration:none; color:inherit;
        }
        .d-mod-header {
          padding:20px 18px 16px;
          display:flex; align-items:center; gap:14px;
        }
        .d-mod-icon {
          width:50px; height:50px; border-radius:12px;
          display:flex; align-items:center; justify-content:center;
          font-size:1.4rem; flex-shrink:0;
          background:linear-gradient(135deg, #0a4d8a 0%, #1e85d8 100%);
        }
        .d-mod-icon.amber { background:linear-gradient(135deg, #e65100 0%, #f9a825 100%); }
        .d-mod-icon.teal  { background:linear-gradient(135deg, #004d40 0%, #00897b 100%); }
        .d-mod-icon.purple{ background:linear-gradient(135deg, #4527a0 0%, #8e24aa 100%); }
        .d-mod-icon.rose  { background:linear-gradient(135deg, #b71c1c 0%, #e53935 100%); }
        .d-mod-icon.slate { background:linear-gradient(135deg, #263238 0%, #546e7a 100%); }
        .d-mod-icon.indigo{ background:linear-gradient(135deg, #1a237e 0%, #3949ab 100%); }
        .d-mod-hd { flex:1; }
        .d-mod-title {
          font-size:0.92rem !important; font-weight:800 !important;
          color:#062d5e !important; margin:0 0 3px !important; line-height:1.25 !important;
        }
        .d-mod-sub {
          font-size:0.74rem; color:#7a96b3; line-height:1.4;
        }
        .d-mod-footer {
          border-top:1px solid #eef3fb;
          padding:10px 18px;
          display:flex; align-items:center; justify-content:space-between;
          font-size:0.75rem; color:#0f6cbe; font-weight:700;
        }
        .d-mod-arrow { font-size:0.95rem; }

        /* ===== BOTTOM ROW ===== */
        .d-bottom {
          display:grid;
          grid-template-columns:1.4fr 1fr;
          gap:16px;
          margin-bottom:28px;
        }
        .d-card {
          background:#fff;
          border-radius:14px;
          box-shadow:0 2px 12px rgba(10,77,138,0.07);
          overflow:hidden;
        }
        .d-card-hd {
          background:linear-gradient(90deg, #0a4d8a 0%, #0f6cbe 100%);
          padding:14px 18px;
          display:flex; align-items:center; gap:8px;
        }
        .d-card-hd-title {
          font-size:0.85rem !important; font-weight:700 !important;
          color:#fff !important; margin:0 !important;
        }
        .d-card-body { padding:4px 0; }

        /* Notices */
        .d-notice {
          display:flex; align-items:flex-start; gap:12px;
          padding:13px 18px;
          border-bottom:1px solid #f0f5fb;
        }
        .d-notice:last-child { border-bottom:none; }
        .d-notice-dot {
          width:8px; height:8px; border-radius:50%;
          background:#0f6cbe; flex-shrink:0; margin-top:5px;
        }
        .d-notice-text { font-size:0.82rem; color:#2e4a6a; line-height:1.5; }

        /* Contact */
        .d-contact-row {
          display:flex; align-items:center; gap:12px;
          padding:12px 18px;
          border-bottom:1px solid #f0f5fb;
        }
        .d-contact-row:last-child { border-bottom:none; }
        .d-contact-icon {
          width:34px; height:34px; border-radius:8px;
          background:#eef3fb;
          display:flex; align-items:center; justify-content:center;
          font-size:1rem; flex-shrink:0;
        }
        .d-contact-lbl { font-size:0.74rem; color:#7a96b3; font-weight:600; }
        .d-contact-val { font-size:0.84rem; color:#062d5e; font-weight:700; }

        /* ===== RESPONSIVE ===== */
        @media(max-width:1000px){
          .d-bottom { grid-template-columns:1fr; }
          .d-hero { flex-direction:column; align-items:flex-start; }
          .d-hero-right { align-items:flex-start; }
        }
        @media(max-width:700px){
          .d-hero { padding:24px 18px 20px; }
          .d-hero-title { font-size:1.3rem !important; }
          .d-body { padding:18px 14px 0; }
          .d-stats { grid-template-columns:repeat(2,1fr); gap:10px; }
          .d-modules { grid-template-columns:1fr; }
          .d-hero-badges { flex-wrap:wrap; }
        }
        @media(max-width:420px){
          .d-stats { grid-template-columns:1fr 1fr; }
        }
      `}</style>

      <div className="d-home">

        {/* ========== HERO ========== */}
        <div className="d-hero">
          <div className="d-hero-left">
            <div className="d-hero-eyebrow">e-Reshme Portal</div>
            <div className="d-hero-title">Welcome to the Dashboard</div>
            <p className="d-hero-sub">Department of Sericulture &nbsp;&mdash;&nbsp; Government of Karnataka</p>
          </div>
          <div className="d-hero-right">
            <div className="d-hero-badges">
              <div className="d-hero-badge">
                <div className="d-hero-badge-num">1,27,760</div>
                <div className="d-hero-badge-lbl">Registered Farmers</div>
              </div>
              <div className="d-hero-badge">
                <div className="d-hero-badge-num">27</div>
                <div className="d-hero-badge-lbl">Active Schemes</div>
              </div>
              <div className="d-hero-badge">
                <div className="d-hero-badge-num">40</div>
                <div className="d-hero-badge-lbl">Markets</div>
              </div>
            </div>
          </div>
        </div>

        <div className="d-body">

          {/* ========== STATISTICS ========== */}
          <div className="d-section-hd">
            <div className="d-section-hd-bar" />
            <div className="d-section-hd-title">Portal Statistics</div>
            <div className="d-section-hd-line" />
          </div>
          <div className="d-stats">
            <div className="d-stat">
              <div className="d-stat-icon">&#127806;</div>
              <div className="d-stat-val">1,27,760</div>
              <div className="d-stat-lbl">Registered Farmers</div>
            </div>
            <div className="d-stat">
              <div className="d-stat-icon">&#129525;</div>
              <div className="d-stat-val">4,017</div>
              <div className="d-stat-lbl">Registered Reelers</div>
            </div>
            <div className="d-stat">
              <div className="d-stat-icon">&#127978;</div>
              <div className="d-stat-val">63</div>
              <div className="d-stat-lbl">Registered Traders</div>
            </div>
            <div className="d-stat teal">
              <div className="d-stat-icon">&#129309;</div>
              <div className="d-stat-val">567</div>
              <div className="d-stat-lbl">RSP / CRC / NSSO</div>
            </div>
            <div className="d-stat">
              <div className="d-stat-icon">&#127985;</div>
              <div className="d-stat-val">89</div>
              <div className="d-stat-lbl">Registered Farms</div>
            </div>
            <div className="d-stat">
              <div className="d-stat-icon">&#127981;</div>
              <div className="d-stat-val">29</div>
              <div className="d-stat-lbl">Grainages</div>
            </div>
            <div className="d-stat">
              <div className="d-stat-icon">&#128205;</div>
              <div className="d-stat-val">40</div>
              <div className="d-stat-lbl">Cocoon Markets</div>
            </div>
            <div className="d-stat gold">
              <div className="d-stat-icon">&#128196;</div>
              <div className="d-stat-val">27</div>
              <div className="d-stat-lbl">Incentive &amp; Subsidy Services</div>
            </div>
          </div>

          {/* ========== MODULES ========== */}
          <div className="d-section-hd">
            <div className="d-section-hd-bar" />
            <div className="d-section-hd-title">Quick Access &mdash; Modules</div>
            <div className="d-section-hd-line" />
          </div>
          <div className="d-modules">
            <a className="d-mod" href="/seriui/stake-holder-registration">
              <div className="d-mod-header">
                <div className="d-mod-icon">&#128100;</div>
                <div className="d-mod-hd">
                  <div className="d-mod-title">Farmer Registration</div>
                  <div className="d-mod-sub">Register new farmers via FRUITS ID</div>
                </div>
              </div>
              <div className="d-mod-footer">
                <span>Go to Registration</span>
                <span className="d-mod-arrow">&#8594;</span>
              </div>
            </a>

            <a className="d-mod" href="/seriui/stake-holder-list">
              <div className="d-mod-header">
                <div className="d-mod-icon">&#128203;</div>
                <div className="d-mod-hd">
                  <div className="d-mod-title">Farmer &amp; Stakeholder List</div>
                  <div className="d-mod-sub">Search, view &amp; manage records</div>
                </div>
              </div>
              <div className="d-mod-footer">
                <span>View List</span>
                <span className="d-mod-arrow">&#8594;</span>
              </div>
            </a>

            <a className="d-mod" href="/seriui/reeler-license-list">
              <div className="d-mod-header">
                <div className="d-mod-icon amber">&#129300;</div>
                <div className="d-mod-hd">
                  <div className="d-mod-title">Reeler Licenses</div>
                  <div className="d-mod-sub">New, renew &amp; transfer licenses</div>
                </div>
              </div>
              <div className="d-mod-footer">
                <span>Manage Licenses</span>
                <span className="d-mod-arrow">&#8594;</span>
              </div>
            </a>

            <a className="d-mod" href="/seriui/new-trader-license-list">
              <div className="d-mod-header">
                <div className="d-mod-icon amber">&#127978;</div>
                <div className="d-mod-hd">
                  <div className="d-mod-title">Trader Licenses</div>
                  <div className="d-mod-sub">Manage trader license applications</div>
                </div>
              </div>
              <div className="d-mod-footer">
                <span>Manage Licenses</span>
                <span className="d-mod-arrow">&#8594;</span>
              </div>
            </a>

            <a className="d-mod" href="/seriui/service-application">
              <div className="d-mod-header">
                <div className="d-mod-icon teal">&#128184;</div>
                <div className="d-mod-hd">
                  <div className="d-mod-title">Incentives &amp; Subsidies</div>
                  <div className="d-mod-sub">Schemes, DFL &amp; chawki incentives</div>
                </div>
              </div>
              <div className="d-mod-footer">
                <span>Apply / Track</span>
                <span className="d-mod-arrow">&#8594;</span>
              </div>
            </a>

            <a className="d-mod" href="/seriui/external-unit-register-list">
              <div className="d-mod-header">
                <div className="d-mod-icon purple">&#129309;</div>
                <div className="d-mod-hd">
                  <div className="d-mod-title">External Units</div>
                  <div className="d-mod-sub">RSP, CRC &amp; NSSO registrations</div>
                </div>
              </div>
              <div className="d-mod-footer">
                <span>View Units</span>
                <span className="d-mod-arrow">&#8594;</span>
              </div>
            </a>

            <a className="d-mod" href="/seriui/market-auction-transaction-list">
              <div className="d-mod-header">
                <div className="d-mod-icon indigo">&#127942;</div>
                <div className="d-mod-hd">
                  <div className="d-mod-title">Market &amp; Auction</div>
                  <div className="d-mod-sub">Cocoon market transactions &amp; lots</div>
                </div>
              </div>
              <div className="d-mod-footer">
                <span>View Market</span>
                <span className="d-mod-arrow">&#8594;</span>
              </div>
            </a>

            <a className="d-mod" href="/seriui/grainage-report">
              <div className="d-mod-header">
                <div className="d-mod-icon rose">&#127981;</div>
                <div className="d-mod-hd">
                  <div className="d-mod-title">Seed &amp; DFL Management</div>
                  <div className="d-mod-sub">Grainage records &amp; DFL procurement</div>
                </div>
              </div>
              <div className="d-mod-footer">
                <span>View Reports</span>
                <span className="d-mod-arrow">&#8594;</span>
              </div>
            </a>

            <a className="d-mod" href="/seriui/chawki-rearing-center-list">
              <div className="d-mod-header">
                <div className="d-mod-icon slate">&#127811;</div>
                <div className="d-mod-hd">
                  <div className="d-mod-title">Chawki Management</div>
                  <div className="d-mod-sub">Chawki rearing &amp; distribution</div>
                </div>
              </div>
              <div className="d-mod-footer">
                <span>Go to Module</span>
                <span className="d-mod-arrow">&#8594;</span>
              </div>
            </a>
          </div>

          {/* ========== BOTTOM ROW ========== */}
          <div className="d-bottom">
            {/* Notices */}
            <div className="d-card">
              <div className="d-card-hd">
                <span>&#128276;</span>
                <div className="d-card-hd-title">Important Notices</div>
              </div>
              <div className="d-card-body">
                <div className="d-notice">
                  <div className="d-notice-dot" />
                  <div className="d-notice-text">All new farmer registrations require FRUITS ID verification before submission.</div>
                </div>
                <div className="d-notice">
                  <div className="d-notice-dot" />
                  <div className="d-notice-text">Reeler and Trader license renewals must be completed before the expiry date to avoid penalties.</div>
                </div>
                <div className="d-notice">
                  <div className="d-notice-dot" />
                  <div className="d-notice-text">DFL procurement and grainage records must be updated on a weekly basis.</div>
                </div>
                <div className="d-notice">
                  <div className="d-notice-dot" />
                  <div className="d-notice-text">Incentive and subsidy disbursements are processed fortnightly through DBT.</div>
                </div>
                <div className="d-notice">
                  <div className="d-notice-dot" />
                  <div className="d-notice-text">Market auction transactions must be recorded within 24 hours of completion.</div>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="d-card">
              <div className="d-card-hd">
                <span>&#128222;</span>
                <div className="d-card-hd-title">Contact &amp; Helpdesk</div>
              </div>
              <div className="d-card-body">
                <div className="d-contact-row">
                  <div className="d-contact-icon">&#128222;</div>
                  <div>
                    <div className="d-contact-lbl">Helpline Number</div>
                    <div className="d-contact-val">080 2441 3900</div>
                  </div>
                </div>
                <div className="d-contact-row">
                  <div className="d-contact-icon">&#127963;</div>
                  <div>
                    <div className="d-contact-lbl">Department</div>
                    <div className="d-contact-val">Department of Sericulture</div>
                  </div>
                </div>
                <div className="d-contact-row">
                  <div className="d-contact-icon">&#127760;</div>
                  <div>
                    <div className="d-contact-lbl">Official Website</div>
                    <a className="d-contact-val" href="https://sericulture.karnataka.gov.in/en" target="_blank" rel="noreferrer" style={{color:"#0f6cbe",textDecoration:"none"}}>
                      sericulture.karnataka.gov.in
                    </a>
                  </div>
                </div>
                <div className="d-contact-row">
                  <div className="d-contact-icon">&#127968;</div>
                  <div>
                    <div className="d-contact-lbl">Government</div>
                    <div className="d-contact-val">Government of Karnataka</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}

export default HomePage;
