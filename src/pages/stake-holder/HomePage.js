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

  return <Layout title="Home"></Layout>;
}

export default HomePage;
