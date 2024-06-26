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

import api from "../../../src/services/auth/api";
import { isValidDate } from "@fullcalendar/react";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_REGISTRATION;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION_FRUITS;

function FarmerWithoutFruits() {
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
        .post(baseURL2 + `farmer/add-karnataka-farmer-without-fruits-id`, {
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
        // console.log(response.data);
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

  // Translation
  const { t } = useTranslation();

  return (
    <Layout title="Farmers Without Fruits ID">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Farmers Without Fruits ID</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/farmer-without-fruits-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/farmer-without-fruits-list"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        {/* <Form action="#"> */}
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-1 ">
            {/* <Card>
              <Card.Body>
                <Row className="g-gs">
                  <Col lg="12">
                    <Form.Group as={Row} className="form-group">
                      <Form.Label column sm={1}>
                        Other State
                      </Form.Label>
                      <Col sm={4}>
                        <Form.Select
                          name="isOtherState"
                          value={isOtherState}
                          onChange={handleOtherState}
                        >
                          <option value={true}>Yes</option>
                          <option value={false}>No</option>
                        </Form.Select>
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card> */}

            <Block className="mt-3">
              <Card>
                <Card.Header style={{ fontWeight: "bold" }}>
                  {t("farmer_personal_information")}
                </Card.Header>
                <Card.Body>
                  <Row className="g-gs">
                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="FarmerName">
                          {t("farmer_name")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="firstName"
                            name="firstName"
                            value={data.firstName}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("enter_farmer_name")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Farmer Name is required.
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="FarmerName">
                          {t("farmer_name_kannada")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="nameKan"
                            name="nameKan"
                            value={data.nameKan}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("enter_farmer_name")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Farmer Name in Kannada is required.
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="FatherName">
                          {t("fathers_husbands_name")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="fatherName"
                            name="fatherName"
                            value={data.fatherName}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("enter_fathers_husbands_name")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Fathers/Husband Name is required.
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="FatherName">
                          {t("fathers_husbands_name_in_kannada")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="fatherNameKan"
                            name="fatherNameKan"
                            value={data.fatherNameKan}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t(
                              "enter_fathers_husbands_name_in_kannada"
                            )}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Fathers/Husband Name in Kannada is required.
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label>{t("farmer_dob")}</Form.Label>
                        <div className="form-control-wrap">
                          {/* <DatePicker
                            selected={data.dob}
                            onChange={(date) => handleDateChange(date, "dob")}
                          /> */}
                          <DatePicker
                            selected={data.dob}
                            onChange={(date) => handleDateChange(date, "dob")}
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                          />
                        </div>
                      </Form.Group>

                      {/* <Form.Group className="form-group mt-3">
                        <Form.Label>{t("gender")}</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="genderId"
                            value={data.genderId}
                            onChange={handleInputs}
                            
                          >
                            <option value="">{t("select_gender")}</option>
                            <option value="1">Male</option>
                            <option value="2">Female</option>
                            <option value="3">Third Gender</option>
                          </Form.Select>
                        </div>
                      </Form.Group> */}

                      <Form.Group className="form-group mt-3">
                        <Form.Label>Caste</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="casteId"
                            value={data.casteId}
                            onChange={handleInputs}
                          >
                            <option value="0">Select Caste</option>
                            {casteListData.map((list) => (
                              <option key={list.id} value={list.id}>
                                {list.title}
                              </option>
                            ))}
                          </Form.Select>
                        </div>
                      </Form.Group>

                      {/* <Form.Group className="form-group mt-3">
                        <Form.Label>{t("differently_abled")}</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="differentlyAbled"
                            value={data.differentlyAbled}
                            onChange={handleInputs}
                            
                          >
                            <option value="">{t("select")}</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </Form.Select>
                        </div>
                      </Form.Group> */}
                    </Col>

                    <Col lg="6">
                      {/* <Form.Group className="form-group">
                        <Form.Label htmlFor="email">{t("email_id")}</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="email"
                            name="email"
                            value={data.email}
                            onChange={handleInputs}
                            type="email"
                            placeholder={t("enter_email_id")}
                          />
                        </div>
                      </Form.Group> */}
                      <Form.Group className="form-group ">
                        <Form.Label htmlFor="mobileNumber">
                          {t("mobile_number")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="mobileNumber"
                            name="mobileNumber"
                            value={data.mobileNumber}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("enter_mobile_number")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Mobile Number is required or Number is greater than
                            and less than 10 Digit
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      {/* <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="aadhaarNumber">
                          {t("aadhaar_number")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="aadhaarNumber"
                            name="aadhaarNumber"
                            value={data.aadhaarNumber}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("enter_aadhaar_number")}
                          />
                        </div>
                      </Form.Group> */}

                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="epicNumber">
                          {t("epic_number")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="epicNumber"
                            name="epicNumber"
                            value={data.epicNumber}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("enter_epic_number")}
                          />
                        </div>
                      </Form.Group>

                      {/* <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="rcard">
                          {t("ration_number")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="rationCardNumber"
                            name="rationCardNumber"
                            value={data.rationCardNumber}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("enter_ration_number")}
                          />
                        </div>
                      </Form.Group> */}

                      {/* <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="totalLandHolding">
                          {t("extent_of_total_land_holding_in_acres")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="totalLandHolding"
                            name="totalLandHolding"
                            value={data.totalLandHolding}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("enter_acres")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Land Holding is required.
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group> */}

                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="passbookNumber">
                          {t("passbook_number")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="passbookNumber"
                            name="passbookNumber"
                            value={data.passbookNumber}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("enter_passbook_number")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Passbook Number is required.
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      {/* <Form.Group className="form-group mt-3">
                        <Form.Label> Holding CategoLandry</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="landCategoryId"
                            value={data.landCategoryId}
                            onChange={handleInputs}
                          >
                            <option value="">Select Land Holding </option>
                            {landHoldingCategoryListData.map((list) => (
                              <option key={list.id} value={list.id}>
                                {list.landCategoryName}
                              </option>
                            ))}
                          </Form.Select>
                        </div>
                      </Form.Group> */}
                      <Form.Group className="form-group mt-3">
                        <Form.Label>
                          Farmer Type<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="farmerTypeId"
                            value={data.farmerTypeId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.farmerTypeId === undefined ||
                              data.farmerTypeId === "0"
                            }
                          >
                            <option value="">Select Farmer Type </option>
                            {farmerTypeListData.map((list) => (
                              <option
                                key={list.farmerTypeId}
                                value={list.farmerTypeId}
                              >
                                {list.farmerTypeName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Farmer Type is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="photoPath">
                          {t("farmer_photo")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            type="file"
                            id="photoPath"
                            name="photoPath"
                            // value={data.photoPath}
                            onChange={handleImageChange}
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3 d-flex justify-content-center">
                        {image ? (
                          <img
                            style={{ height: "100px", width: "100px" }}
                            src={URL.createObjectURL(image)}
                          />
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Block>

            {/* <Block className="mt-3">
              <Card>
                <Card.Header style={{ fontWeight: "bold" }}>
                  {t("family_members")}
                </Card.Header>
                <Card.Body>
                  <Row className="g-gs mb-1">
                    <Col lg="6">
                      <Form.Group className="form-group mt-1">
                        <div className="form-control-wrap"></div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group d-flex align-items-center justify-content-end gap g-3">
                        <div className="form-control-wrap">
                          <ul className="">
                            <li>
                              <Button
                                className="d-md-none"
                                size="md"
                                variant="primary"
                                onClick={handleShowModal}
                              >
                                <Icon name="plus" />
                                <span>{t("add")}</span>
                              </Button>
                            </li>
                            <li>
                              <Button
                                className="d-none d-md-inline-flex"
                                variant="primary"
                                onClick={handleShowModal}
                              >
                                <Icon name="plus" />
                                <span>{t("add")}</span>
                              </Button>
                            </li>
                          </ul>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  {familyMembersList && familyMembersList.length > 0 ? (
                    <Row className="g-gs">
                      <Block>
                        <Card>
                          <div
                            className="table-responsive"
                          >
                            <table className="table small">
                              <thead>
                                <tr style={{ backgroundColor: "#f1f2f7" }}>
                                  <th>Action</th>
                                  <th>Name</th>
                                  <th>Relationship</th>
                                </tr>
                              </thead>
                              <tbody>
                                {familyMembersList.map((item, i) => (
                                  <tr>
                                    <td>
                                      <div>
                                        <Button
                                          variant="primary"
                                          size="sm"
                                          onClick={() => handleGetFm(i)}
                                        >
                                          {t("edit")}
                                        </Button>
                                        <Button
                                          variant="danger"
                                          size="sm"
                                          onClick={() =>
                                            handleDeleteFamilyMembers(i)
                                          }
                                          className="ms-2"
                                        >
                                          {t("delete")}
                                        </Button>
                                      </div>
                                    </td>
                                    <td>{item.farmerFamilyName}</td>
                                    <td>{item.relationshipName}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </Card>
                      </Block>
                    </Row>
                  ) : (
                    ""
                  )}
                </Card.Body>
              </Card>
            </Block> */}

            {/* <Block className="mt-3">
              <Card>
                <Card.Header style={{ fontWeight: "bold" }}>
                  {t("address")}
                </Card.Header>
                <Card.Body>
                  <Row className="g-gs mb-1">
                    <Col lg="6">
                      <Form.Group className="form-group mt-1">
                        <div className="form-control-wrap"></div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group d-flex align-items-center justify-content-end gap g-3">
                        <div className="form-control-wrap">
                          <ul className="">
                            <li>
                              <Button
                                className="d-md-none"
                                size="md"
                                variant="primary"
                                onClick={handleShowModal4}
                              >
                                <Icon name="plus" />
                                <span>{t("add")}</span>
                              </Button>
                            </li>
                            <li>
                              <Button
                                className="d-none d-md-inline-flex"
                                variant="primary"
                                onClick={handleShowModal4}
                              >
                                <Icon name="plus" />
                                <span>{t("add")}</span>
                              </Button>
                            </li>
                          </ul>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  {farmerAddressList && farmerAddressList.length > 0 ? (
                    <Row className="g-gs">
                      <Block>
                        <Card>
                          <div
                            className="table-responsive"
                          >
                            <table className="table small">
                              <thead>
                                <tr style={{ backgroundColor: "#f1f2f7" }}>
                                  <th>Action</th>
                                  <th>Address</th>
                                  <th>Village</th>
                                  <th>Taluk</th>
                                  <th>District</th>
                                  <th>State</th>
                                  <th>Default Address</th>
                                </tr>
                              </thead>
                              <tbody>
                                {farmerAddressList.map((item, i) => (
                                  <tr>
                                    <td>
                                      <div>
                                        <Button
                                          variant="primary"
                                          size="sm"
                                          onClick={() => handleGetFa(i)}
                                        >
                                          {t("edit")}
                                        </Button>
                                        <Button
                                          variant="danger"
                                          size="sm"
                                          onClick={() =>
                                            handleDeleteFarmerAddress(i)
                                          }
                                          className="ms-2"
                                        >
                                          {t("delete")}
                                        </Button>
                                      </div>
                                    </td>
                                    <td>{item.addressText}</td>
                                    <td>{item.villageName}</td>
                                    <td>{item.talukName}</td>
                                    <td>{item.districtName}</td>
                                    <td>{item.stateName}</td>
                                    <td>
                                      {item.defaultAddress
                                        ? "Default Address"
                                        : ""}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </Card>
                      </Block>
                    </Row>
                  ) : (
                    ""
                  )}
                </Card.Body>
              </Card>
            </Block> */}

            {/* <Block className="mt-3">
              <Card>
                <Card.Header style={{ fontWeight: "bold" }}>
                  {t("farmer_land_details")}
                </Card.Header>
                <Card.Body>
                  <Row className="g-gs mb-1">
                    <Col lg="6">
                      <Form.Group className="form-group mt-1">
                        <div className="form-control-wrap"></div>
                      </Form.Group>
                    </Col>
                    <Col lg="6">
                      <Form.Group className="form-group d-flex align-items-center justify-content-end gap g-3">
                        <div className="form-control-wrap">
                          <ul className="">
                            <li>
                              <Button
                                className="d-md-none"
                                size="md"
                                variant="primary"
                                onClick={handleShowModal2}
                              >
                                <Icon name="plus" />
                                <span>{t("add")}</span>
                              </Button>
                            </li>
                            <li>
                              <Button
                                className="d-none d-md-inline-flex"
                                variant="primary"
                                onClick={handleShowModal2}
                              >
                                <Icon name="plus" />
                                <span>{t("add")}</span>
                              </Button>
                            </li>
                          </ul>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  {farmerLandList && farmerLandList.length > 0 ? (
                    <Row className="g-gs">
                      <Block>
                        <Card>
                          <div
                            className="table-responsive"
                          >
                            <table className="table small">
                              <thead>
                                <tr style={{ backgroundColor: "#f1f2f7" }}>
                                  <th>Action</th>
                                  <th>Land Ownership</th>
                                  <th>Survey Number</th>
                                  <th>Plantation Type</th>
                                  <th>State</th>
                                </tr>
                              </thead>
                              <tbody>
                                {farmerLandList.map((item, i) => (
                                  <tr>
                                    <td>
                                      <div className="">
                                        <Button
                                          variant="primary"
                                          size="sm"
                                          onClick={() => handleGetFl(i)}
                                        >
                                          {t("edit")}
                                        </Button>
                                        <Button
                                          variant="danger"
                                          size="sm"
                                          onClick={() =>
                                            handleDeleteFarmerLand(i)
                                          }
                                          className="ms-2"
                                        >
                                          {t("delete")}
                                        </Button>
                                      </div>
                                    </td>
                                    <td>{item.landOwnershipName}</td>
                                    <td>{item.surveyNumber}</td>
                                    <td>{item.plantationTypeName}</td>
                                    <td>{item.stateName}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </Card>
                      </Block>
                    </Row>
                  ) : (
                    ""
                  )}
                </Card.Body>
              </Card>
            </Block> */}

            <Block className="mt-3">
              <Card>
                <Card.Header style={{ fontWeight: "bold" }}>
                  Address
                </Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label>
                          State<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="stateId"
                            value={`${farmerAddress.stateId}_${farmerAddress.stateName}`}
                            onChange={handleStateOption}
                            onBlur={() => handleStateOption}
                            required
                            isInvalid={
                              farmerAddress.stateId === undefined ||
                              farmerAddress.stateId === "0"
                            }
                          >
                            <option value="">Select State</option>
                            {addressStateListData.map((list) => (
                              <option
                                key={list.stateId}
                                value={`${list.stateId}_${list.stateName}`}
                              >
                                {list.stateName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            State Name is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label>
                          District<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="districtId"
                            value={`${farmerAddress.districtId}_${farmerAddress.districtName}`}
                            onChange={handleDistrictOption}
                            onBlur={() => handleDistrictOption}
                            required
                            isInvalid={
                              farmerAddress.districtId === undefined ||
                              farmerAddress.districtId === "0"
                            }
                          >
                            <option value="">Select District</option>
                            {addressdistrictListData &&
                            addressdistrictListData.length
                              ? addressdistrictListData.map((list) => (
                                  <option
                                    key={list.districtId}
                                    value={`${list.districtId}_${list.districtName}`}
                                  >
                                    {list.districtName}
                                  </option>
                                ))
                              : ""}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            District Name is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label>
                          Taluk<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="talukId"
                            value={`${farmerAddress.talukId}_${farmerAddress.talukName}`}
                            onChange={handleTalukOption}
                            onBlur={() => handleTalukOption}
                            required
                            isInvalid={
                              farmerAddress.talukId === undefined ||
                              farmerAddress.talukId === "0"
                            }
                          >
                            <option value="">Select Taluk</option>
                            {addressTalukListData && addressTalukListData.length
                              ? addressTalukListData.map((list) => (
                                  <option
                                    key={list.talukId}
                                    value={`${list.talukId}_${list.talukName}`}
                                  >
                                    {list.talukName}
                                  </option>
                                ))
                              : ""}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Taluk Name is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label>
                          Hobli<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="hobliId"
                            value={`${farmerAddress.hobliId}_${farmerAddress.hobliName}`}
                            onChange={handleHobliOption}
                            onBlur={() => handleHobliOption}
                            required
                            isInvalid={
                              farmerAddress.hobliId === undefined ||
                              farmerAddress.hobliId === "0"
                            }
                          >
                            <option value="">Select Hobli</option>
                            {addressHobliListData && addressHobliListData.length
                              ? addressHobliListData.map((list) => (
                                  <option
                                    key={list.hobliId}
                                    value={`${list.hobliId}_${list.hobliName}`}
                                  >
                                    {list.hobliName}
                                  </option>
                                ))
                              : ""}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Hobli Name is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="Village">
                          Village<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="villageId"
                            value={`${farmerAddress.villageId}_${farmerAddress.villageName}`}
                            onChange={handleVillageOption}
                            onBlur={() => handleVillageOption}
                            required
                            isInvalid={
                              farmerAddress.villageId === undefined ||
                              farmerAddress.villageId === "0"
                            }
                          >
                            <option value="">Select Village</option>
                            {addressVillageListData &&
                            addressVillageListData.length
                              ? addressVillageListData.map((list) => (
                                  <option
                                    key={list.villageId}
                                    value={`${list.villageId}_${list.villageName}`}
                                  >
                                    {list.villageName}
                                  </option>
                                ))
                              : ""}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Village Name is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-2">
                        <Form.Label htmlFor="address">
                          {t("address")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            as="textarea"
                            id="addressText"
                            name="addressText"
                            value={farmerAddress.addressText}
                            onChange={handleFarmerAddressInputs}
                            type="text"
                            placeholder={t("enter_address")}
                            rows="2"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Address is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="pincode">
                          {t("pin_code")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="pincode"
                            name="pincode"
                            value={farmerAddress.pincode}
                            onChange={handleFarmerAddressInputs}
                            type="text"
                            placeholder={t("enter_pin_code")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Pincode is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                      {/* <Form.Group className="form-group">
                  <Form.Label htmlFor="defaultAddress">
                    {t("make_this_address_default")}
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Check
                      type="checkbox"
                      id="defaultAddress"
                      checked={farmerAddress.defaultAddress}
                      onChange={handleCheckBox}
                      // defaultChecked
                    />
                  </div>
                </Form.Group> */}
                      {/* <Form.Group as={Row} className="form-group mt-4">
                  <Col sm={1}>
                    <Form.Check
                      type="checkbox"
                      id="defaultAddress"
                      checked={farmerAddress.defaultAddress}
                      onChange={handleCheckBox}
                      // Optional: disable the checkbox in view mode
                      // defaultChecked
                    />
                  </Col>
                  <Form.Label column sm={11} className="mt-n2">
                    {t("make_this_address_default")}
                  </Form.Label>
                </Form.Group> */}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Block>

            <Block className="mt-3">
              <Card>
                <Card.Header style={{ fontWeight: "bold" }}>
                  {t("bank_account_details")}
                </Card.Header>
                <Card.Body>
                  <Row className="g-gs">
                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="farmerBankName">
                          {t("bank_name")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="farmerBankName"
                            name="farmerBankName"
                            value={bank.farmerBankName}
                            onChange={handleBankInputs}
                            type="text"
                            placeholder={t("enter_bank_name")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Bank Name is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="farmerBankBranchName">
                          {t("branch_name")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="farmerBankBranchName"
                            name="farmerBankBranchName"
                            value={bank.farmerBankBranchName}
                            onChange={handleBankInputs}
                            type="text"
                            placeholder={t("enter_branch_name")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Branch Name is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="farmerBankIfscCode">
                          {" "}
                          {t("ifsc_code")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="farmerBankIfscCode"
                            name="farmerBankIfscCode"
                            value={bank.farmerBankIfscCode}
                            onChange={handleBankInputs}
                            type="text"
                            placeholder={t("enter_ifsc_code")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            IFSC Code is required and equals to 11 digit
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="farmerBankAccountNumber">
                          {t("bank_account_number")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="farmerBankAccountNumber"
                            name="farmerBankAccountNumber"
                            value={bank.farmerBankAccountNumber}
                            onChange={handleBankInputs}
                            type="text"
                            placeholder={t("enter_bank_account_number")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Bank Account Number is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="accountImagePath">
                          Upload Bank Passbook
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            type="file"
                            id="accountImagePath"
                            name="accountImagePath"
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
                </Card.Body>
              </Card>
            </Block>

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  {/* <Button type="button" variant="primary" onClick={postData}> */}
                  <Button type="submit" variant="primary">
                    {t("save")}
                  </Button>
                </li>
                <li>
                  {/* <Link
                    to="/seriui/stake-holder-list"
                    className="btn btn-secondary border-0"
                  >
                    {t("cancel")}
                  </Link> */}
                  <Button variant="secondary" onClick={clear}>
                    {t("cancel")}
                  </Button>
                </li>
              </ul>
            </div>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default FarmerWithoutFruits;
