import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DatePicker from "react-datepicker";
import { Icon, Select } from "../../components";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
// import axios from "axios";
import { useNavigate } from "react-router-dom";

import api from "../../services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_REGISTRATION;
const baseURLFarmerServer =
  process.env.REACT_APP_API_BASE_URL_REGISTRATION_FROM_FRUITS;

function WithoutFruitsIdStakeHolderEdit() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const [familyMembers, setFamilyMembers] = useState({
    relationshipId: "",
    farmerFamilyName: "",
  });

  const [familyMembersList, setFamilyMembersList] = useState([]);
  const getFMDetailsList = () => {
    api
      .get(baseURL2 + `farmer-family/get-by-farmer-id-join/${id}`)
      .then((response) => {
        setFamilyMembersList(response.data.content.farmerFamily);
      })
      .catch((err) => {
        // const message = err.response.data.errorMessages[0].message[0].message;
        setFamilyMembersList([]);
        // editError(message);
      });
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

  // Modal popup
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [showModal4, setShowModal4] = useState(false);
  const [showModal5, setShowModal5] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleAddFamilyMembers = (e) => {
    const withFarmerId = {
      ...familyMembers,
      farmerId: id,
    };
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidatedFamilyMembers(true);
    } else {
      e.preventDefault();
      api
        .post(baseURL2 + `farmer-family/add`, withFarmerId)
        .then((response) => {
          getFMDetailsList();
          setShowModal(false);
        })
        .catch((err) => {
          getFMDetailsList();
          // saveError();
        });
      setValidatedFamilyMembers(false);
    }
  };

  const handleDeleteFamilyMembers = (i) => {
    api
      .delete(baseURL2 + `farmer-family/delete/${i}`)
      .then((response) => {
        getFMDetailsList();
      })
      .catch((err) => {
        getFMDetailsList();
      });
  };

  //   const [vb, setVb] = useState({});
  const handleFMGet = (i) => {
    api
      .get(baseURL2 + `farmer-family/get/${i}`)
      .then((response) => {
        setFamilyMembers(response.data.content);
        setShowModal1(true);
      })
      .catch((err) => {
        setFamilyMembers({});
      });
  };

  const handleEdit = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidatedFamilyMembersEdit(true);
    } else {
      e.preventDefault();
      api
        .post(baseURL2 + `farmer-family/edit`, familyMembers)
        .then((response) => {
          getFMDetailsList();
          setShowModal1(false);
        })
        .catch((err) => {
          getFMDetailsList();
        });
      setValidatedFamilyMembersEdit(false);
    }
  };

  const handleFMInputs = (e) => {
    const { name, value } = e.target;
    setFamilyMembers({ ...familyMembers, [name]: value });
  };

  const handleShowModal1 = () => setShowModal1(true);
  const handleCloseModal1 = () => {
    setShowModal1(false);
    setFamilyMembers({
      relationshipId: "",
      farmerFamilyName: "",
    });
  };

  const [farmerLand, setFarmerLand] = useState({
    categoryNumber: "",
    landOwnershipId: "",
    soilTypeId: "",
    hissa: "",
    mulberrySourceId: "",
    mulberryArea: "",
    mulberryVarietyId: "",
    plantationDate: "",
    irrigationSourceId: "",
    irrigationTypeId: "",
    rearingHouseDetails: "",
    roofTypeId: "",
    silkWormVarietyId: "",
    rearingCapacityCrops: "",
    rearingCapacityDlf: "",
    subsidyAvailed: "",
    subsidyMasterId: "",
    loanDetails: "",
    equipmentDetails: "",
    gpsLat: "",
    gpsLng: "",
    surveyNumber: "",
    stateId: "",
    districtId: "",
    talukId: "",
    hobliId: "",
    villageId: "",
    address: "",
    pincode: "",
    ownerName: "",
    surNoc: "",
    nameScore: "",
    ownerNo: "",
    mainOwnerNo: "",
    acre: "",
    gunta: "",
    fgunta: "",
    tscMasterId: "",
  });

  const [farmerLandList, setFarmerLandList] = useState([]);
  const getFLDetailsList = () => {
    api
      .get(baseURL2 + `farmer-land-details/get-by-farmer-id-join/${id}`)
      .then((response) => {
        setFarmerLandList(response.data.content.farmerLandDetails);
      })
      .catch((err) => {
        // const message = err.response.data.errorMessages[0].message[0].message;
        setFarmerLandList([]);
        // editError(message);
      });
  };

  const handleShowModal2 = () => setShowModal2(true);
  const handleCloseModal2 = () => setShowModal2(false);

  // const handleAddFarmerLand = (e) => {
  //   const withFarmerId = {
  //     ...farmerLand,
  //     farmerId: id,
  //   };
  //   const form = e.currentTarget;
  //   if (form.checkValidity() === false) {
  //     e.preventDefault();
  //     e.stopPropagation();
  //     setValidatedFarmerLand(true);
  //   } else {
  //     e.preventDefault();
  //     api
  //       .post(baseURL2 + `farmer-land-details/add`, withFarmerId)
  //       .then((response) => {
  //         getFLDetailsList();
  //         setShowModal2(false);
  //       })
  //       .catch((err) => {
  //         getFLDetailsList();
  //         // saveError();
  //       });
  //     setValidatedFarmerLand(false);
  //   }
  // };
  const handleAddFarmerLand = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidatedFarmerLand(true);
    } else {
      e.preventDefault();
      setFarmerLandList((prev) => [...prev, farmerLand]);
      setFarmerLand({
        categoryNumber: "",
        landOwnershipId: "",
        soilTypeId: "",
        hissa: "",
        mulberrySourceId: "",
        mulberryArea: "",
        mulberryVarietyId: "",
        plantationDate: new Date(),
        plantationTypeId: "",
        irrigationSourceId: "",
        irrigationTypeId: "",
        rearingHouseDetails: "",
        roofTypeId: "",
        silkWormVarietyId: "",
        rearingCapacityCrops: "",
        rearingCapacityDlf: "",
        subsidyAvailed: "",
        subsidyMasterId: "",
        loanDetails: "",
        equipmentDetails: "",
        gpsLat: "",
        gpsLng: "",
        surveyNumber: "",
        stateId: "",
        districtId: "",
        talukId: "",
        hobliId: "",
        villageId: "",
        address: "",
        pincode: "",
        ownerName: "",
        surNoc: "",
        nameScore: "",
        ownerNo: "",
        mainOwnerNo: "",
        acre: "",
        gunta: "",
        fgunta: "",
        landCode: "",
        districtCode: "",
        talukCode: "",
        hobliCode: "",
        villageCode: "",
      });
      setShowModal2(false);
      setValidatedFarmerLand(false);
    }
  };


  const [flId, setFlId] = useState();
  const handleGetFl = (i) => {
    setFarmerLand(farmerLandList[i]);
    setShowModal3(true);
    setFlId(i);
  };

  const handleUpdateFl = (e, i, changes) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidatedFarmerLandEdit(true);
    } else {
      e.preventDefault();
      setFarmerLandList((prev) =>
        prev.map((item, ix) => {
          if (ix === i) {
            return { ...item, ...changes };
          }
          return item;
        })
      );
      setShowModal3(false);
      setValidatedFarmerLandEdit(false);
      setFarmerLand({
        categoryNumber: "",
        landOwnershipId: "",
        soilTypeId: "",
        hissa: "",
        mulberrySourceId: "",
        mulberryArea: "",
        mulberryVarietyId: "",
        plantationDate: new Date(),
        plantationTypeId: "",
        irrigationSourceId: "",
        irrigationTypeId: "",
        rearingHouseDetails: "",
        roofTypeId: "",
        silkWormVarietyId: "",
        rearingCapacityCrops: "",
        rearingCapacityDlf: "",
        subsidyAvailed: "",
        subsidyMasterId: "",
        loanDetails: "",
        equipmentDetails: "",
        gpsLat: "",
        gpsLng: "",
        surveyNumber: "",
        stateId: "",
        districtId: "",
        talukId: "",
        hobliId: "",
        villageId: "",
        address: "",
        pincode: "",
        ownerName: "",
        surNoc: "",
        nameScore: "",
        ownerNo: "",
        mainOwnerNo: "",
        acre: "",
        gunta: "",
        fgunta: "",
        landCode: "",
        districtCode: "",
        talukCode: "",
        hobliCode: "",
        villageCode: "",
      });
    }
  };


  const handleDeleteFarmerLand = (i) => {
    api
      .delete(baseURL2 + `farmer-land-details/delete/${i}`)
      .then((response) => {
        getFLDetailsList();
      })
      .catch((err) => {
        getFLDetailsList();
      });
  };

  //   const [vb, setVb] = useState({});
  const handleFLGet = (i) => {
    api
      .get(baseURL2 + `farmer-land-details/get/${i}`)
      .then((response) => {
        setFarmerLand(response.data.content);
        setShowModal3(true);
      })
      .catch((err) => {
        setFarmerLand({});
      });
  };

  const handleEditFl = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidatedFarmerLandEdit(true);
    } else {
      e.preventDefault();
      api
        .post(baseURL2 + `farmer-land-details/edit`, farmerLand)
        .then((response) => {
          getFLDetailsList();
          setShowModal3(false);
        })
        .catch((err) => {
          getFLDetailsList();
        });
      setValidatedFarmerLandEdit(false);
    }
  };

  const handleFLInputs = (e) => {
    const { name, value } = e.target;
    setFarmerLand({ ...farmerLand, [name]: value });
  };
  const handleShowModal3 = () => setShowModal3(true);
  const handleCloseModal3 = () => {
    setShowModal3(false);
    setFarmerLand({
      categoryNumber: "",
      landOwnershipId: "",
      soilTypeId: "",
      hissa: "",
      mulberrySourceId: "",
      mulberryArea: "",
      mulberryVarietyId: "",
      plantationDate: "",
      irrigationSourceId: "",
      irrigationTypeId: "",
      rearingHouseDetails: "",
      roofTypeId: "",
      silkWormVarietyId: "",
      rearingCapacityCrops: "",
      rearingCapacityDlf: "",
      subsidyAvailed: "",
      subsidyMasterId: "",
      loanDetails: "",
      equipmentDetails: "",
      gpsLat: "",
      gpsLng: "",
      surveyNumber: "",
      stateId: "",
      districtId: "",
      talukId: "",
      hobliId: "",
      villageId: "",
      address: "",
      pincode: "",
      ownerName: "",
      surNoc: "",
      nameScore: "",
      ownerNo: "",
      mainOwnerNo: "",
      acre: "",
      gunta: "",
      fgunta: "",
    });
  };
  const [farmerAddress, setFarmerAddress] = useState({
    stateId: "",
    districtId: "",
    talukId: "",
    hobliId: "",
    villageId: "",
    addressText: "",
    pincode: "",
    defaultAddress: "",
  });

  const [farmerAddressList, setFarmerAddressList] = useState([]);
  const getFarmerAddressDetailsList = () => {
    api
      .get(baseURL2 + `farmer-address/get-by-farmer-id-join/${id}`)
      .then((response) => {
        setFarmerAddressList(response.data.content.farmerAddress);
      })
      .catch((err) => {
        // const message = err.response.data.errorMessages[0].message[0].message;
        setFarmerAddressList([]);
        // editError(message);
      });
  };

  const handleShowModal4 = () => setShowModal4(true);
  const handleCloseModal4 = () => setShowModal4(false);

  const handleAddFarmerAddress = (e) => {
    const withFarmerId = {
      ...farmerAddress,
      farmerId: id,
    };
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidatedFarmerAddress(true);
    } else {
      e.preventDefault();
      api
        .post(baseURL2 + `farmer-address/add`, withFarmerId)
        .then((response) => {
          getFarmerAddressDetailsList();
          setShowModal4(false);
        })
        .catch((err) => {
          getFarmerAddressDetailsList();
          // saveError();
        });
      setValidatedFarmerAddress(false);
    }
  };

  const handleDeleteFarmerAddress = (i) => {
    api
      .delete(baseURL2 + `farmer-address/delete/${i}`)
      .then((response) => {
        getFarmerAddressDetailsList();
      })
      .catch((err) => {
        getFarmerAddressDetailsList();
      });
  };

  //   const [vb, setVb] = useState({});
  const handleFAGet = (i) => {
    api
      .get(baseURL2 + `farmer-address/get/${i}`)
      .then((response) => {
        setFarmerAddress(response.data.content);
        setShowModal5(true);
      })
      .catch((err) => {
        setFarmerAddress({});
      });
  };

  const handleEditFA = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidatedFarmerAddressEdit(true);
    } else {
      e.preventDefault();
      api
        .post(baseURL2 + `farmer-address/edit`, farmerAddress)
        .then((response) => {
          getFarmerAddressDetailsList();
          setShowModal5(false);
        })
        .catch((err) => {
          getFarmerAddressDetailsList();
        });
      setValidatedFarmerAddressEdit(false);
    }
  };

  const handleFarmerAddressInputs = (e) => {
    const { name, value } = e.target;
    setFarmerAddress({ ...farmerAddress, [name]: value });
  };

  const handleShowModal5 = () => setShowModal5(true);
  const handleCloseModal5 = () => {
    setShowModal5(false);
    setFarmerAddress({
      stateId: "",
      districtId: "",
      talukId: "",
      hobliId: "",
      villageId: "",
      addressText: "",
      pincode: "",
      defaultAddress: "",
    });
  };

  const [bank, setBank] = useState({
    accountImagePath: "",
    farmerId: "",
    farmerBankName: "",
    farmerBankAccountNumber: "",
    farmerBankBranchName: "",
    farmerBankIfscCode: "",
  });

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
      e.target.classList.remove("is-valid");
    } else if (name === "farmerBankIfscCode" && value.length === 11) {
      e.target.classList.remove("is-invalid");
      e.target.classList.add("is-valid");
    }
    if(name === "farmerBankIfscCode"){
      setBank({ ...bank, [name]: value.toUpperCase() });
    }
    else if(name === "farmerBankBranchName"){
      setBank({ ...bank, [name]: value.toUpperCase() });
    }
    else if(name === "farmerBankName"){
      setBank({ ...bank, [name]: value.toUpperCase() });
    }
    else{
      setBank({ ...bank, [name]: value });
    } 
  };

  const handleCheckBox = (e) => {
    setFarmerAddress({ ...farmerAddress, defaultAddress: e.target.checked });
  };

  // const saveSuccess = () => {
  //   Swal.fire({
  //     icon: "success",
  //     title: "Saved successfully",
  //     // text: "You clicked the button!",
  //   }).then(() => navigate("/seriui/stake-holder-list"));
  // };
  // const saveError = () => {
  //   Swal.fire({
  //     icon: "error",
  //     title: "Save attempt was not successful",
  //     text: "Something went wrong!",
  //   });
  // };

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });

    if (name === "mobileNumber" && (value.length < 10 || value.length > 10)) {
      e.target.classList.add("is-invalid");
      e.target.classList.remove("is-valid");
    } else if (name === "mobileNumber" && value.length === 10) {
      e.target.classList.remove("is-invalid");
      e.target.classList.add("is-valid");
    }

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

  const [selected, setSelected] = useState("no");
  const handleChange = (event) => {
    setSelected(event.target.value);
  };

  const _header = { "Content-Type": "application/json", accept: "*/*" };

  // const postData = (event) => {
  //   const form = event.currentTarget;
  //   if (form.checkValidity() === false) {
  //     event.preventDefault();
  //     event.stopPropagation();
  //     setValidated(true);
  //   } else {
  //     event.preventDefault();
  //     if (data.fruitsId.length < 16 || data.fruitsId.length > 16) {
  //       return;
  //     }

  //     if (data.mobileNumber.length < 10 || data.mobileNumber.length > 10) {
  //       return;
  //     }
  //     if (
  //       bank.farmerBankIfscCode.length < 11 ||
  //       bank.farmerBankIfscCode.length > 11
  //     ) {
  //       return;
  //     }
  //     api
  //       .post(baseURL2 + `farmer/edit`, data)
  //       .then((response) => {
  //         const farmerId = response.data.content.farmerId;
  //         if (farmerId) {
  //           handleFileUpload(farmerId);
  //         }
  //         if (bank.farmerBankAccountId) {
  //           api
  //             .post(
  //               baseURL2 + `farmer-bank-account/edit`,
  //               { ...bank, farmerId }
  //               // {
  //               //   headers: _header,
  //               // }
  //             )
  //             .then((response) => {
  //               // saveSuccess();
  //               const bankId = response.data.content.farmerBankAccountId;
  //               if (bankId) {
  //                 handleFileDocumentUpload(bankId);
  //               }
  //               if (response.data.content.error) {
  //                 const bankError = response.data.content.error_description;
  //                 updateError(bankError);
  //               } else {
  //                 updateSuccess();
  //               }
  //             })
  //             .catch((err) => {
  //               setBank({});
  //               if (
  //                 Object.keys(err.response.data.validationErrors).length > 0
  //               ) {
  //                 updateError(err.response.data.validationErrors);
  //               }
  //             });

  //           updateSuccess();
  //         } else {
  //           api
  //             .post(
  //               baseURL2 + `farmer-bank-account/add`,
  //               { ...bank, farmerId }
  //               // {
  //               //   headers: _header,
  //               // }
  //             )
  //             .then((response) => {
  //               if (response.data.content.error) {
  //                 const bankError = response.data.content.error_description;
  //                 updateError(bankError);
  //               } else {
  //                 updateSuccess();
  //               }
  //             })
  //             .catch((err) => {
  //               setBank({});
  //               if (
  //                 Object.keys(err.response.data.validationErrors).length > 0
  //               ) {
  //                 updateError(err.response.data.validationErrors);
  //               }
  //             });

  //           updateSuccess();
  //         }

  //         // postDataBankAccount
  //       })
  //       .catch((err) => {
  //         setData({});
  //         if (Object.keys(err.response.data.validationErrors).length > 0) {
  //           updateError(err.response.data.validationErrors);
  //         }
  //       });
  //     setValidated(true);
  //   }
  // };

  const [searchValidated, setSearchValidated] = useState(false);
  const [disable, setDisable] = useState(false);

  // const search = (event) => {
  //   setData({
  //     farmerNumber: "",
  //     fruitsId: "",
  //     firstName: "",
  //     middleName: "",
  //     lastName: "",
  //     dob: null,
  //     genderId: "",
  //     casteId: "",
  //     differentlyAbled: "",
  //     email: "",
  //     mobileNumber: "",
  //     aadhaarNumber: "",
  //     epicNumber: "",
  //     rationCardNumber: "",
  //     totalLandHolding: "",
  //     passbookNumber: "",
  //     landCategoryId: "",
  //     educationId: "",
  //     representativeId: "",
  //     khazaneRecipientId: "",
  //     photoPath: "",
  //     farmerTypeId: "",
  //     minority: "",
  //     rdNumber: "",
  //     casteStatus: "",
  //     genderStatus: "",
  //     fatherNameKan: "",
  //     fatherName: "",
  //     nameKan: "",
  //     tscMasterId: "",
  //   });

  //   setFamilyMembersList([]);
  //   setFarmerLandList([]);
  //   setFarmerAddressList([]);
  //   setBank({
  //     accountImagePath: "",
  //     farmerId: "",
  //     farmerBankName: "",
  //     farmerBankAccountNumber: "",
  //     farmerBankBranchName: "",
  //     farmerBankIfscCode: "",
  //   });
  //   const form = event.currentTarget;
  //   if (form.checkValidity() === false) {
  //     event.preventDefault();
  //     event.stopPropagation();
  //     setSearchValidated(true);
  //   } else {
  //     event.preventDefault();
  //     if (data.fruitsId.length < 16 || data.fruitsId.length > 16) {
  //       return;
  //     } else {
  //       setDisable(true);
  //     }
  //     api
  //       .post(baseURL2 + `farmer/get-farmer-details-by-fruits-id-test`, data)
  //       .then((response) => {
  //         if (!response.data.content.isFruitService) {
  //           const farmerId = response.data.content.farmerResponse.farmerId;
  //           navigate(`/seriui/stake-holder-edit/${farmerId}`);
  //         } else {
  //           api
  //             .post(
  //               baseURLFarmer +
  //                 `farmer/get-farmer-details-by-fruits-id-or-farmer-number-or-mobile-number`,
  //               { fruitsId: data.fruitsId }
  //               // {
  //               //   headers: _header,
  //               // }
  //             )
  //             .then((result) => {
  //               if (!result.data.content.error) {
  //                 setData((prev) => ({
  //                   ...prev,
  //                   ...result.data.content.farmerResponse,
  //                 }));
  //                 setFarmerAddressList((prev) => [
  //                   ...prev,
  //                   ...result.data.content.farmerAddressList,
  //                 ]);

  //                 const modified =
  //                   result.data.content.farmerLandDetailsDTOList.map(
  //                     (detail) => {
  //                       if (detail.stateId === 0) {
  //                         detail.stateId = null;
  //                       }
  //                       if (detail.districtId === 0) {
  //                         detail.districtId = null;
  //                       }
  //                       if (detail.talukId === 0) {
  //                         detail.talukId = null;
  //                       }
  //                       if (detail.hobliId === 0) {
  //                         detail.hobliId = null;
  //                       }
  //                       if (detail.villageId === 0) {
  //                         detail.villageId = null;
  //                       }
  //                       return detail;
  //                     }
  //                   );
  //                 // console.log(modified);FF

  //                 setFarmerLandList((prev) => [...prev, ...modified]);
  //               } else {
  //                 searchError(result.data.content.error_description);
  //               }
  //             })
  //             .catch((error) => {});
  //         }
  //       })
  //       .catch((error) => {});
  //   }
  // };

  // const search = (event) => {
  //   event.preventDefault();
  //   const form = event.currentTarget;
  //   if (form.checkValidity() === false) {
  //     event.stopPropagation();
  //     setSearchValidated(true);
  //   } else {
  //     if (data.fruitsId.length !== 16) {
  //       return;
  //     }
  //     setDisableSearch(true);
  //     // api
  //       // .post(`${baseURL2}farmer/get-farmer-details-by-fruits-id-test`, { fruitsId: data.fruitsId })
  //       // .then((response) => {
  //       //   // if (!response.data.content.isFruitService) {
  //       //   //   const farmerId = response.data.content.farmerResponse.farmerId;
  //       //   //   navigate(`/seriui/stake-holder-edit/${farmerId}`);
  //       //   // } else {
  //       // api
  //       //       .post(`${baseURLFarmer}farmer/get-farmer-details-by-fruits-id-or-farmer-number-or-mobile-number`, { fruitsId: data.fruitsId })
  //           //  "http://13.200.62.144:8000/farmer-registration/v1/farmer/get-farmer-details-by-fruits-id-or-farmer-number-or-mobile-number", 
  //           //   { fruitsId: data.fruitsId }
  //           // )
  //           api
  //           .post(baseURLFarmerServer + `farmer/get-details-by-fruits-id`, {
  //             fruitsId: data.fruitsId,
  //           })
  //             .then((result) => {
  //               if (!result.data.content.error) {
  //                 setData((prev) => ({
  //                   ...prev,
  //                   ...result.data.content.farmerResponse,
  //                 }));
  //                 setFarmerAddressList((prev) => [
  //                   ...prev,
  //                   ...result.data.content.farmerAddressList,
  //                 ]);

  //                 const modified = result.data.content.farmerLandDetailsDTOList.map((detail) => {
  //                   return {
  //                     ...detail,
  //                     stateId: detail.stateId === 0 ? null : detail.stateId,
  //                     districtId: detail.districtId === 0 ? null : detail.districtId,
  //                     talukId: detail.talukId === 0 ? null : detail.talukId,
  //                     hobliId: detail.hobliId === 0 ? null : detail.hobliId,
  //                     villageId: detail.villageId === 0 ? null : detail.villageId,
  //                   };
  //                 });

  //                 setFarmerLandList((prev) => [...prev, ...modified]);
  //               } else {
  //                 searchError(result.data.content.error_description);
  //               }
  //             })
  //             .catch((error) => {
  //               console.error(error);
  //             });
  //         }
  //   //     })
  //   //     .catch((error) => {
  //   //       console.error(error);
  //   //     })
  //   //     .finally(() => {
  //   //       setDisableSearch(false);
  //   //     });
  //   // }
  // };

  const search = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setSearchValidated(true);
    } else {
      if (data.fruitsId.length !== 16) {
        return;
      }
      setDisableSearch(true);
  
      api
        .post(baseURLFarmerServer + `farmer/get-details-by-fruits-id`, {
          fruitsId: data.fruitsId,
        })
        .then((result) => {
          if (!result.data.content.error) {
            // Update farmer data
            setData((prev) => ({
              ...prev,
              ...result.data.content.farmerResponse,
            }));
  
            // Update farmer address list, ensuring 'prev' and 'farmerAddressList' are arrays
            setFarmerAddressList((prev) => [
              ...(Array.isArray(prev) ? prev : []),
              ...(Array.isArray(result.data.content.farmerAddressList)
                ? result.data.content.farmerAddressList
                : []),
            ]);
  
            // Prepare modified land details
            const modified = result.data.content.farmerLandDetailsDTOList.map((detail) => ({
              ...detail,
              stateId: detail.stateId === 0 ? null : detail.stateId,
              districtId: detail.districtId === 0 ? null : detail.districtId,
              talukId: detail.talukId === 0 ? null : detail.talukId,
              hobliId: detail.hobliId === 0 ? null : detail.hobliId,
              villageId: detail.villageId === 0 ? null : detail.villageId,
            }));
  
            // Update farmer land list, ensuring 'prev' and 'modified' are arrays
            setFarmerLandList((prev) => [
              ...(Array.isArray(prev) ? prev : []),
              ...(Array.isArray(modified) ? modified : []),
            ]);
          } else {
            searchError(result.data.content.error_description);
          }
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setDisableSearch(false);
        });
    }
  };
  


  const searchError = (message) => {
    Swal.fire({
      icon: "warning",
      title: "Data not Found!!!",
      text: message,
    });
  };

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      if (data.fruitsId.length < 16 || data.fruitsId.length > 16) {
        return;
      }

      if (data.mobileNumber.length < 10 || data.mobileNumber.length > 10) {
        return;
      }
      if (
        bank.farmerBankIfscCode.length < 11 ||
        bank.farmerBankIfscCode.length > 11
      ) {
        return;
      }

      const sendData = {
        editFarmerRequest: data,
        editFarmerBankAccountRequest: bank,
        editFarmerFamilyRequests: familyMembersList,
        editFarmerAddressRequests: farmerAddressList,
        editFarmerLandDetailsRequests: farmerLandList,
      };

      api
        .post(baseURL2 + `farmer/edit-complete-farmer-details`, sendData)
        .then((response) => {
          const farmerId = response.data.content.farmerId;
          const farmerBankAccountId = response.data.content.farmerBankAccountId;
          if (response.data.content.error) {
            updateFarmerError(response.data.content.error_description);
          } else {
            if (data.photoPath) {
              handleFileUpload(farmerId);
            }
            if (bank.accountImagePath) {
              handleFileDocumentUpload(farmerBankAccountId);
            }
            updateSuccess();
          }
          // if (farmerId) {
          //   handleFileUpload(farmerId);
          // }
          // if (bank.farmerBankAccountId) {
          //   api
          //     .post(
          //       baseURL2 + `farmer-bank-account/edit`,
          //       { ...bank, farmerId }
          //       // {
          //       //   headers: _header,
          //       // }
          //     )
          //     .then((response) => {
          //       // saveSuccess();
          //       const bankId = response.data.content.farmerBankAccountId;
          //       if (bankId) {
          //         handleFileDocumentUpload(bankId);
          //       }
          //       if (response.data.content.error) {
          //         const bankError = response.data.content.error_description;
          //         updateError(bankError);
          //       } else {
          //         updateSuccess();
          //       }
          //     })
          //     .catch((err) => {
          //       setBank({});
          //       if (
          //         Object.keys(err.response.data.validationErrors).length > 0
          //       ) {
          //         updateError(err.response.data.validationErrors);
          //       }
          //     });

          //   updateSuccess();
          // } else {
          //   api
          //     .post(
          //       baseURL2 + `farmer-bank-account/add`,
          //       { ...bank, farmerId }
          //       // {
          //       //   headers: _header,
          //       // }
          //     )
          //     .then((response) => {
          //       if (response.data.content.error) {
          //         const bankError = response.data.content.error_description;
          //         updateError(bankError);
          //       } else {
          //         updateSuccess();
          //       }
          //     })
          //     .catch((err) => {
          //       setBank({});
          //       if (
          //         Object.keys(err.response.data.validationErrors).length > 0
          //       ) {
          //         updateError(err.response.data.validationErrors);
          //       }
          //     });

          //   updateSuccess();
          // }

          // postDataBankAccount
        })
        .catch((err) => {
          // setData({});

          if (
            err.response &&
            err.response &&
            err.response.data &&
            err.response.data.validationErrors
          ) {
            if (Object.keys(err.response.data.validationErrors).length > 0) {
              updateError(err.response.data.validationErrors);
            }
          }
        });
      setValidated(true);
    }
  };

  const getBankDetails = () => {
    // setLoading(true);
    api
      .get(baseURL2 + `farmer-bank-account/get-by-farmer-id/${id}`)
      .then((response) => {
        setBank(response.data.content);
        // setLoading(false);
        if (response.data.content.accountImagePath) {
          getDocumentFile(response.data.content.accountImagePath);
        }
      })
      .catch((err) => {
        // const message = err.response.data.errorMessages[0].message[0].message;
        // setBank({});
        if (
          err.response &&
          err.response &&
          err.response.data &&
          err.response.data.validationErrors
        ) {
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            updateError(err.response.data.validationErrors);
          }
        }
        // editError(message);
        // setLoading(false);
      });
  };

  // const getIdList = () => {
  //   // setLoading(true);
  //   api
  //     .get(baseURL2 + `farmer/get/${id}`)
  //     .then((response) => {
  //       setData(response.data.content);

  //       // setLoading(false);
  //       if (response.data.content.photoPath) {
  //         getFile(response.data.content.photoPath);
  //       }
  //     })
  //     .catch((err) => {
  //       // const message = err.response.data.errorMessages[0].message[0].message;
  //       setData({});
  //       // editError(message);
  //       // setLoading(false);
  //     });
  // };

  // useEffect(() => {
  //   getIdList();
  //   getFarmerAddressDetailsList();
  //   getFLDetailsList();
  //   getFMDetailsList();
  //   getBankDetails();
  // }, [id]);
  const [disableSearch, setDisableSearch] = useState(true);
  const [editFruits,setEditFruits] = useState(true);
  const getIdList = () => {
    api
      .get(baseURL2 + `farmer/get/${id}`)
      .then((response) => {
        setData(response.data.content);
        if (response.data.content.photoPath) {
          getFile(response.data.content.photoPath);
        }
        // Check condition to enable or disable search button
        if (!response.data.content.isOtherStateFarmer && response.data.content.fruitsId === null) {
          setDisableSearch(false);
          setEditFruits(false)
        } else {
          setDisableSearch(true); 
        }
      })
      .catch((err) => {
        setData({});
      });
  };

  useEffect(() => {
    getIdList();
    getFarmerAddressDetailsList();
    getFLDetailsList();
    getFMDetailsList();
    getBankDetails();
  }, [id]);

  const isDataDobSet = !!data.dob;

  // to get tsc
  const [tscListData, setTscListData] = useState([]);

  const getTscList = () => {
    const response = api
      .get(baseURL + `tscMaster/get-all`)
      .then((response) => {
        setTscListData(response.data.content.tscMaster);
      })
      .catch((err) => {
        setTscListData([]);
      });
  };

  useEffect(() => {
    getTscList();
  }, []);

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

  const getRelationshipList = () =>
    api
      .get(baseURL + `relationship/get-all`)
      .then((response) => {
        setRelationshipListData(response.data.content.relationship);
      })
      .catch((err) => {
        setRelationshipListData([]);
      });

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

  const getMulberrySourceList = () =>
    api
      .get(baseURL + `mulberry-source/get-all`)
      .then((response) => {
        setMulberrySourceListData(response.data.content.mulberrySource);
      })
      .catch((err) => {
        setMulberrySourceListData([]);
      });

  useEffect(() => {
    getMulberrySourceList();
  }, []);

  // to get MulberryVariety
  const [mulberryVarietyListData, setMulberryVarietyListData] = useState([]);

  const getMulberryVarietyList = () =>
    api
      .get(baseURL + `mulberry-variety/get-all`)
      .then((response) => {
        setMulberryVarietyListData(response.data.content.mulberryVariety);
      })
      .catch((err) => {
        setMulberryVarietyListData([]);
      });

  useEffect(() => {
    getMulberryVarietyList();
  }, []);

  // to get irrigationSource
  const [irrigationSourceListData, setIrrigationSourceListData] = useState([]);

  const getIrrigationSourceList = () =>
    api
      .get(baseURL + `irrigationSource/get-all`)
      .then((response) => {
        setIrrigationSourceListData(response.data.content.irrigationSource);
      })
      .catch((err) => {
        setIrrigationSourceListData([]);
      });

  useEffect(() => {
    getIrrigationSourceList();
  }, []);

  // to get irrigationType
  const [irrigationTypeListData, setIrrigationTypeListData] = useState([]);

  const getIrrigationTypeList = () =>
    api
      .get(baseURL + `irrigationType/get-all`)
      .then((response) => {
        setIrrigationTypeListData(response.data.content.irrigationType);
      })
      .catch((err) => {
        setIrrigationTypeListData([]);
      });

  useEffect(() => {
    getIrrigationTypeList();
  }, []);

  // to get roofType
  const [roofTypeListData, setRoofTypeListData] = useState([]);

  const getRoofTypeList = () =>
    api
      .get(baseURL + `roofType/get-all`)
      .then((response) => {
        setRoofTypeListData(response.data.content.roofType);
      })
      .catch((err) => {
        setRoofTypeListData([]);
      });

  useEffect(() => {
    getRoofTypeList();
  }, []);

  // to get silkWormVariety
  const [silkWormVarietyListData, setSilkWormVarietyListData] = useState([]);

  const getSilkWormVarietyList = () =>
    api
      .get(baseURL + `silk-worm-variety/get-all`)
      .then((response) => {
        setSilkWormVarietyListData(response.data.content.silkWormVariety);
      })
      .catch((err) => {
        setSilkWormVarietyListData([]);
      });

  useEffect(() => {
    getSilkWormVarietyList();
  }, []);

  // to get subsidyMaster
  const [subsidyMasterListData, setSubsidyMasterListData] = useState([]);

  const getSubsidyMasterList = () =>
    api
      .get(baseURL + `subsidy/get-all`)
      .then((response) => {
        setSubsidyMasterListData(response.data.content.subsidy);
      })
      .catch((err) => {
        setSubsidyMasterListData([]);
      });

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
  const getAddressList = () =>
    api
      .get(baseURL + `state/get-all`)
      .then((response) => {
        setAddressStateListData(response.data.content.state);
      })
      .catch((err) => {
        setAddressStateListData([]);
      });

  useEffect(() => {
    getAddressList();
  }, []);

  // // to get district
  // const [districtListData, setDistrictListData] = useState([]);

  // const getDistrictList = (_id) => {
  //   axios
  //     .get(baseURL + `district/get-by-state-id/${_id}`)
  //     .then((response) => {
  //       setDistrictListData(response.data.content.district);
  //     })
  //     .catch((err) => {
  //       setDistrictListData([]);
  //       // alert(err.response.data.errorMessages[0].message[0].message);
  //     });
  // };

  // useEffect(() => {
  //   if (farmerLand.stateId) {
  //     getDistrictList(farmerLand.stateId);
  //   }
  // }, [farmerLand.stateId]);

  // const [addressdistrictListData, setAddressDistrictListData] = useState([]);

  // const getAddressDistrictList = (_id) => {
  //   axios
  //     .get(baseURL + `district/get-by-state-id/${_id}`)
  //     .then((response) => {
  //       setAddressDistrictListData(response.data.content.district);
  //     })
  //     .catch((err) => {
  //       setAddressDistrictListData([]);
  //       // alert(err.response.data.errorMessages[0].message[0].message);
  //     });
  // };

  // useEffect(() => {
  //   if (farmerAddress.stateId) {
  //     getAddressDistrictList(farmerAddress.stateId);
  //   }
  // }, [farmerAddress.stateId]);

  // to get district
  const [districtListData, setDistrictListData] = useState([]);

  const getDistrictList = (_id) => {
    api
      .get(baseURL + `district/get-by-state-id/${_id}`)
      .then((response) => {
        setDistrictListData(response.data.content.district);
      })
      .catch((err) => {
        setDistrictListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (farmerLand.stateId) {
      getDistrictList(farmerLand.stateId);
    }
  }, [farmerLand.stateId]);

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

  // to get taluk
  const [talukListData, setTalukListData] = useState([]);

  const getTalukList = (_id) => {
    api
      .get(baseURL + `taluk/get-by-district-id/${_id}`)
      .then((response) => {
        console.log("hello");
        console.log(response.data.content.error);

        if (response.data.content.error) {
          setTalukListData([]);
        } else {
          setTalukListData(response.data.content.taluk);
        }
      })
      .catch((err) => {
        setTalukListData([]);
        console.log("error");
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (farmerLand.districtId) {
      getTalukList(farmerLand.districtId);
    }
  }, [farmerLand.districtId]);

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

  // to get hobli
  // const [hobliListData, setHobliListData] = useState([]);

  // const getHobliList = (_id) => {
  //   axios
  //     .get(baseURL + `hobli/get-by-taluk-id/${_id}`)
  //     .then((response) => {
  //       setHobliListData(response.data.content.hobli);
  //     })
  //     .catch((err) => {
  //       setHobliListData([]);
  //       // alert(err.response.data.errorMessages[0].message[0].message);
  //     });
  // };

  // useEffect(() => {
  //   if (farmerLand.talukId) {
  //     getHobliList(farmerLand.talukId);
  //   }
  // }, [farmerLand.talukId]);

  // const [addressHobliListData, setAddressHobliListData] = useState([]);

  // const getAddressHobliList = (_id) => {
  //   axios
  //     .get(baseURL + `hobli/get-by-taluk-id/${_id}`)
  //     .then((response) => {
  //       setAddressHobliListData(response.data.content.hobli);
  //     })
  //     .catch((err) => {
  //       setAddressHobliListData([]);
  //       // alert(err.response.data.errorMessages[0].message[0].message);
  //     });
  // };

  // useEffect(() => {
  //   if (farmerAddress.talukId) {
  //     getAddressHobliList(farmerAddress.talukId);
  //   }
  // }, [farmerAddress.talukId]);

  // to get hobli
  const [hobliListData, setHobliListData] = useState([]);

  const getHobliList = (_id) => {
    api
      .get(baseURL + `hobli/get-by-taluk-id/${_id}`)
      .then((response) => {
        setHobliListData(response.data.content.hobli);
      })
      .catch((err) => {
        setHobliListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (farmerLand.talukId) {
      getHobliList(farmerLand.talukId);
    }
  }, [farmerLand.talukId]);

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

  // to get Village
  // const [villageListData, setVillageListData] = useState([]);

  // const getVillageList = (_id) => {
  //   axios
  //     .get(baseURL + `village/get-by-hobli-id/${_id}`)
  //     .then((response) => {
  //       setVillageListData(response.data.content.village);
  //     })
  //     .catch((err) => {
  //       setVillageListData([]);
  //       // alert(err.response.data.errorMessages[0].message[0].message);
  //     });
  // };

  // useEffect(() => {
  //   if (farmerLand.hobliId) {
  //     getVillageList(farmerLand.hobliId);
  //   }
  // }, [farmerLand.hobliId]);

  // const [addressVillageListData, setAddressVillageListData] = useState([]);

  // const getAddressVillageList = (_id) => {
  //   axios
  //     .get(baseURL + `village/get-by-hobli-id/${_id}`)
  //     .then((response) => {
  //       setAddressVillageListData(response.data.content.village);
  //     })
  //     .catch((err) => {
  //       setAddressVillageListData([]);
  //       // alert(err.response.data.errorMessages[0].message[0].message);
  //     });
  // };

  // useEffect(() => {
  //   if (farmerAddress.hobliId) {
  //     getAddressVillageList(farmerAddress.hobliId);
  //   }
  // }, [farmerAddress.hobliId]);

  // to get Village
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
    if (farmerLand.hobliId) {
      getVillageList(farmerLand.hobliId);
    }
  }, [farmerLand.hobliId]);

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

  // console.log(data);
  // console.log(new Date(data.dob));
  // console.log(data.dob);

  useEffect(() => {
    if (farmerAddress.hobliId) {
      console.log("Effect triggered with hobliId:", farmerAddress.hobliId);
      getAddressVillageList(farmerAddress.hobliId);
    }
  }, [farmerAddress.hobliId]);

  const navigate = useNavigate();
  const updateSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Updated successfully",
      // text: "You clicked the button!",
    }).then(() => navigate("/seriui/stake-holder-list"));
  };
  const updateError = (message) => {
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

  const updateFarmerError = (message) => {
    Swal.fire({
      icon: "error",
      title: "Update attempt was not successful",
      text: message,
    });
  };

  const editError = (message) => {
    Swal.fire({
      icon: "error",
      title: message,
      text: "Something went wrong!",
    }).then(() => navigate("/seriui/stake-holder-list"));
  };

   // District
   const handleDistrictLandOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setFarmerLand({
      ...farmerLand,
      districtId: chooseId,
      districtName: chooseName,
    });
  };

  // State
  // const [stateNameLD,setStateNameLD] = useState("")
  const handleStateLandOption = (e) => {
    const value = e.target.value;
    // const [chooseId, chooseName] = value.split("_");

    api
      .get(baseURL + `state/get/${value}`)
      .then((response) => {
        const name = response.data.content.stateName;
        setFarmerLand((prev) => ({ ...prev, stateId: value, stateName: name }));
        // setStateNameLD(response.data.content.stateName);
      })
      .catch((err) => {
        // setStateNameLD("");
      });

    };


  // Taluk
  const handleTalukLandOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setFarmerLand({
      ...farmerLand,
      talukId: chooseId,
      talukName: chooseName,
    });
  };

  // Hobli
  const handleHobliLandOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setFarmerLand({
      ...farmerLand,
      hobliId: chooseId,
      hobliName: chooseName,
    });
  };

  // Village
  const handleVillageLandOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setFarmerLand({
      ...farmerLand,
      villageId: chooseId,
      villageName: chooseName,
    });
  };

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

  // Relationship
  const handleRelationshipOption = (e) => {
    const value = e.target.value;
    console.log(value);
    const [chooseId, chooseName] = value.split("_");
    setFamilyMembers({
      ...familyMembers,
      relationshipId: chooseId,
      relationshipName: chooseName,
    });
  };

  // LandOwnership
  const handleLandOwnershipOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setFarmerLand({
      ...farmerLand,
      landOwnershipId: chooseId,
      landOwnershipName: chooseName,
    });
  };
  // SoilType
  const handleSoilTypeOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setFarmerLand({
      ...farmerLand,
      soilTypeId: chooseId,
      soilTypeName: chooseName,
    });
  };

  // mulberrySource
  const handleMulberrySourceOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setFarmerLand({
      ...farmerLand,
      mulberrySourceId: chooseId,
      mulberrySourceName: chooseName,
    });
  };

  // mulberryVariety
  const handleMulberryVarietyOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setFarmerLand({
      ...farmerLand,
      mulberryVarietyId: chooseId,
      mulberryVarietyName: chooseName,
    });
  };

  // plantationType
  const handlePlantationTypeOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setFarmerLand({
      ...farmerLand,
      plantationTypeId: chooseId,
      plantationTypeName: chooseName,
    });
  };

  // irrigationSource
  const handleIrrigationSourceOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setFarmerLand({
      ...farmerLand,
      irrigationSourceId: chooseId,
      irrigationSourceName: chooseName,
    });
  };

  // irrigationType
  const handleIrrigationTypeOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setFarmerLand({
      ...farmerLand,
      irrigationTypeId: chooseId,
      irrigationTypeName: chooseName,
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
  const handleRoofTypeOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setFarmerLand({
      ...farmerLand,
      roofTypeId: chooseId,
      roofTypeName: chooseName,
    });
  };

  // silkWormVariety
  const handleSilkWormVarietyOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setFarmerLand({
      ...farmerLand,
      silkWormVarietyId: chooseId,
      silkWormVarietyName: chooseName,
    });
  };

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

  // To get Photo from S3 Bucket
  const [selectedDocumentFile, setSelectedDocumentFile] = useState(null);

  const getDocumentFile = async (file) => {
    const parameters = `fileName=${file}`;
    try {
      const response = await api.get(
        baseURL2 + `api/s3/download?${parameters}`,
        {
          responseType: "arraybuffer",
        }
      );
      const blob = new Blob([response.data]);
      const url = URL.createObjectURL(blob);
      setSelectedDocumentFile(url);
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  };

  // Display Image
  const [image, setImage] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setData((prev) => ({ ...prev, photoPath: file.name }));
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

  // To get Photo from S3 Bucket
  const [selectedFile, setSelectedFile] = useState(null);

  const getFile = async (file) => {
    const parameters = `fileName=${file}`;
    try {
      const response = await api.get(
        baseURL2 + `api/s3/download?${parameters}`,
        {
          responseType: "arraybuffer",
        }
      );
      const blob = new Blob([response.data]);
      const url = URL.createObjectURL(blob);
      setSelectedFile(url);
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  };

  // Translation
  const { t } = useTranslation();

  return (
    <Layout title="Farmer Registration">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("farmer_registration")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/stake-holder-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/stake-holder-list"
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
        <Form noValidate validated={searchValidated} onSubmit={search}>
        {/* <Form noValidate validated={validated} onSubmit={postData}> */}
          {/* <Row className="g-1"> */}
            <Card>
              <Card.Body>
                <Row className="g-gs">
                  <Col lg="12">
                    <Form.Group as={Row} className="form-group">
                      <Form.Label column sm={1} style={{ fontWeight: "bold" }}>
                        {t("FRUITS ID")}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={4}>
                        <Form.Control
                          id="fruitsId"
                          name="fruitsId"
                          value={data.fruitsId}
                          onChange={handleInputs}
                          type="text"
                          maxLength="16"
                          placeholder={t("Enter FRUITS ID")}
                          readOnly ={editFruits}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Fruits ID should contain 16 digits.
                        </Form.Control.Feedback>
                      </Col>
                      <Col sm={2}>
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={disableSearch}
                        // onClick={display}
                      >
                        {t("search")}
                      </Button>
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            </Form>

          <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-1 ">
            <Block className="mt-3">
              <Card>
                <Card.Header style={{ fontWeight: "bold" }}>
                  {t("farmer_personal_information")}
                </Card.Header>
                <Card.Body>
                  <Row className="g-gs">
                    <Col lg="4">
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
                            readOnly
                          />
                          <Form.Control.Feedback type="invalid">
                            Farmer Name is required.
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="FarmerName">
                          {t("Farmer Name in Kannada")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="nameKan"
                            name="nameKan"
                            value={data.nameKan}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Farmer Name in Kannada")}
                            required
                            readOnly
                          />
                          <Form.Control.Feedback type="invalid">
                            Farmer Name in Kannada is required.
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="fatherName">
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
                            readOnly
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
                            readOnly
                          />
                          <Form.Control.Feedback type="invalid">
                            Fathers/Husband Name in Kannada is required.
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      {/* <Form.Group className="form-group mt-3">
                        <Form.Label>{t("farmer_dob")}</Form.Label>
                        <div className="form-control-wrap">
                          <DatePicker
                            // selected={data.dob}
                            selected={new Date(data.dob)}
                            onChange={(date) => handleDateChange(date, "dob")}
                          />
                        </div>
                      </Form.Group> */}

                      {/* <Form.Group className="form-group mt-3">
                        <Form.Label>{t("farmer_dob")}</Form.Label>
                        <div className="form-control-wrap">
                          <DatePicker
                            selected={new Date(data.dob)}
                            onChange={(date) => handleDateChange(date, "dob")}
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                          />
                        </div>
                      </Form.Group> */}

                      <Form.Group className="form-group mt-3">
                        <Form.Label>{t("farmer_dob")}</Form.Label>
                        <div className="form-control-wrap">
                          {isDataDobSet && (
                            <DatePicker
                              selected={new Date(data.dob)}
                              onChange={(date) => handleDateChange(date, "dob")}
                              peekNextMonth
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              dateFormat="dd/MM/yyyy"
                              maxDate={new Date()}
                            />
                          )}
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label>{t("gender")}</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="genderId"
                            value={data.genderId}
                            onChange={handleInputs}
                            disabled
                          >
                            <option value="">{t("select_gender")}</option>
                            <option value="1">Male</option>
                            <option value="2">Female</option>
                            <option value="3">Third Gender</option>
                          </Form.Select>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label>
                          Caste<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="casteId"
                            value={data.casteId}
                            onChange={handleInputs}
                            disabled
                          >
                            <option value="0">Select Caste</option>
                            {casteListData && casteListData.length 
                            ? casteListData.map((list) => (
                              <option key={list.id} value={list.id}>
                                {list.title}
                              </option>
                            )): ""}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Caste is required.
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label>{t("differently_abled")}</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="differentlyAbled"
                            value={data.differentlyAbled}
                            onChange={handleInputs}
                            disabled
                          >
                            <option value="">{t("select")}</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </Form.Select>
                        </div>
                      </Form.Group>
                      <Form.Group className="form-group">
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
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group">
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
                            maxLength="10"
                            placeholder={t("enter_mobile_number")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Mobile Number should contain 10 digits.
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

                      <Form.Group className="form-group mt-3">
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
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
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
                      </Form.Group>

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
                        <Form.Label>Land Holding Category</Form.Label>
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
                            disabled
                            isInvalid={
                              data.farmerTypeId === undefined ||
                              data.farmerTypeId === "0"
                            }
                          >
                            <option value="">Select Farmer Type </option>
                            {farmerTypeListData && farmerTypeListData.length
                            ? farmerTypeListData.map((list) => (
                              <option
                                key={list.farmerTypeId}
                                value={list.farmerTypeId}
                              >
                                {list.farmerTypeName}
                              </option>
                            ))
                            :""}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Farmer Type is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="rid">
                          {t("farmer_number")}
                          {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="farmerNumber"
                            name="farmerNumber"
                            value={data.farmerNumber}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("enter_farmer_number")}
                            // required
                          />
                          <Form.Control.Feedback type="invalid">
                            Farmer Number is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      {/* <Form.Group className="form-group mt-3">
                        <Form.Label>Farmer Type</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="farmerTypeId"
                            value={data.farmerTypeId}
                            onChange={handleInputs}
                          >
                            <option value="">Select Farmer Type </option>
                            {farmerTypeListData.map((list) => (
                              <option key={list.farmerTypeId} value={list.farmerTypeId}>
                                {list.farmerTypeName}
                              </option>
                            ))}
                          </Form.Select>
                        </div>
                      </Form.Group> */}

                      <Form.Group className="form-group mt-3">
                        <Form.Label>Education</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="educationId"
                            value={data.educationId}
                            onChange={handleInputs}
                          >
                            <option value="">Select Education </option>
                            {educationListData && educationListData
                            ? educationListData.map((list) => (
                              <option key={list.id} value={list.id}>
                                {list.name}
                              </option>
                            )) 
                            : ""}
                          </Form.Select>
                        </div>
                      </Form.Group>

                      {/* <Form.Group className="form-group mt-3">
                        <Form.Label>{t("representative_agent")}</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="representativeId"
                            value={data.representativeId}
                            onChange={handleInputs}
                          >
                            <option value="">{t("select")}</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                          </Form.Select>
                        </div>
                      </Form.Group> */}

                      <Form.Group className="form-group mt-3">
                        <Form.Label>
                          TSC<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="tscMasterId"
                            value={data.tscMasterId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.tscMasterId === undefined ||
                              data.tscMasterId === "0"
                            }
                          >
                            <option value="">Select TSC</option>
                            {tscListData && tscListData.length
                            ? tscListData.map((list) => (
                              <option
                                key={list.tscMasterId}
                                value={list.tscMasterId}
                              >
                                {list.name}
                              </option>
                            ))
                            : ""}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            TSC is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="rid">
                          {t("recipient_id")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="khazaneRecipientId"
                            name="khazaneRecipientId"
                            value={data.khazaneRecipientId}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("enter_recipient_id")}
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="photoPath">
                          {t("farmer_photo")} (PDF/jpg/png)(Max:2mb)
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            type="file"
                            id="photoPath"
                            name="photoPath"
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
                          selectedFile && (
                            <img
                              style={{ height: "100px", width: "100px" }}
                              src={selectedFile}
                              alt="Selected File"
                            />
                          )
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Block>

            <Block className="mt-3">
              <Card>
                <Card.Header style={{ fontWeight: "bold" }}>
                  {t("family_members")}
                </Card.Header>
                <Card.Body>
                  {/* <h3>Family Members</h3> */}
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
                            // style={{ paddingBottom: "30px" }}
                          >
                            <table className="table small">
                              <thead>
                                <tr style={{ backgroundColor: "#f1f2f7" }}>
                                  {/* <th></th> */}
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
                                          //onClick={handleShowModal2}
                                          onClick={() =>
                                            handleFMGet(item.farmerFamilyId)
                                          }
                                        >
                                          {t("edit")}
                                        </Button>
                                        <Button
                                          variant="danger"
                                          size="sm"
                                          onClick={() =>
                                            handleDeleteFamilyMembers(
                                              item.farmerFamilyId
                                            )
                                          }
                                          // onClick={handleShowModal2}
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
            </Block>

            <Block className="mt-3">
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
                            // style={{ paddingBottom: "30px" }}
                          >
                            <table className="table small">
                              <thead>
                                <tr style={{ backgroundColor: "#f1f2f7" }}>
                                  {/* <th></th> */}
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
                                          onClick={() =>
                                            handleFAGet(item.farmerAddressId)
                                          }
                                        >
                                          {t("edit")}
                                        </Button>
                                        {/* <Button
                                          variant="danger"
                                          size="sm"
                                          onClick={() =>
                                            handleDeleteFarmerAddress(
                                              item.farmerAddressId
                                            )
                                          }
                                          className="ms-2"
                                        >
                                          {t("delete")}
                                        </Button> */}
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
            </Block>

            <Block className="mt-3">
              <Card>
                <Card.Header style={{ fontWeight: "bold" }}>
                  {t("farmer_land_details")}
                </Card.Header>
                <Card.Body>
                  {/* <h3>Farmers Land Details</h3> */}
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
                            // style={{ paddingBottom: "30px" }}
                          >
                            <table className="table small">
                              <thead>
                                <tr style={{ backgroundColor: "#f1f2f7" }}>
                                  {/* <th></th> */}
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
                                          {t("update")}
                                        </Button>
                                        {/* <Button
                                          variant="danger"
                                          size="sm"
                                          onClick={() =>
                                            handleDeleteFarmerLand(i)
                                          }
                                          className="ms-2"
                                        >
                                          {t("delete")}
                                        </Button> */}
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
                            maxLength="11"
                            placeholder={t("enter_ifsc_code")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            IFSC should contain 11 digits
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
                          Upload Bank Passbok
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
                          selectedDocumentFile && (
                            <img
                              style={{ height: "100px", width: "100px" }}
                              src={selectedDocumentFile}
                              alt="Selected File"
                            />
                          )
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
                    {t("update")}
                  </Button>
                </li>
                <li>
                  <Link
                    to="/seriui/stake-holder-list"
                    className="btn btn-secondary border-0"
                  >
                    {t("cancel")}
                  </Link>
                </li>
              </ul>
            </div>
          </Row>
        </Form>
      </Block>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{t("add_family_members")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Form action="#"> */}
          <Form
            noValidate
            validated={validatedFamilyMembers}
            onSubmit={handleAddFamilyMembers}
          >
            <Row className="g-3">
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="farmerFamilyName">
                    {t("name")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="farmerFamilyName"
                      name="farmerFamilyName"
                      value={familyMembers.farmerFamilyName}
                      onChange={handleFMInputs}
                      type="text"
                      placeholder={t("enter_name")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Name is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label>
                    Relationship<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="relationshipId"
                      value={familyMembers.relationshipId}
                      onChange={handleFMInputs}
                      onBlur={() => handleFMInputs}
                      required
                      isInvalid={
                        familyMembers.relationshipId === undefined ||
                        familyMembers.relationshipId === "0"
                      }
                    >
                      <option value="">Select Relationship</option>
                      {relationshipListData && relationshipListData.length
                      ? relationshipListData.map((list) => (
                        <option
                          key={list.relationshipId}
                          value={list.relationshipId}
                        >
                          {list.relationshipName}
                        </option>
                      ))
                      : ""}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Relationship is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="12">
                <div className="d-flex gap g-2 justify-content-center">
                  <div className="gap-col">
                    {/* <Button variant="primary" onClick={handleAddFamilyMembers}> */}
                    <Button type="submit" variant="primary">
                      {t("add")}
                    </Button>
                  </div>
                  <div className="gap-col">
                    <Button variant="secondary" onClick={handleCloseModal}>
                      {t("cancel")}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      {/* <Modal show={showModal1} onHide={handleCloseModal1} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Family Members</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form action="#">
            <Row className="g-5 px-5">
              <Col lg="6">
 
                    <Button variant="secondary" onClick={handleCloseModal1}>
                      Close
                    </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal> */}

      <Modal show={showModal1} onHide={handleCloseModal1} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{t("edit")}Family Members</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Form action="#"> */}
          <Form
            noValidate
            validated={validatedFamilyMembersEdit}
            onSubmit={handleEdit}
          >
            <Row className="g-5 px-5">
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="farmerFamilyName">
                    {t("name")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="farmerFamilyName"
                      name="farmerFamilyName"
                      value={familyMembers.farmerFamilyName}
                      onChange={handleFMInputs}
                      type="text"
                      placeholder={t("enter_name")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Name is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label>
                    Relationship<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="relationshipId"
                      value={familyMembers.relationshipId}
                      onChange={handleFMInputs}
                      onBlur={() => handleFMInputs}
                      required
                      isInvalid={
                        familyMembers.relationshipId === undefined ||
                        familyMembers.relationshipId === "0"
                      }
                    >
                      <option value="">Select Relationship</option>
                      {relationshipListData && relationshipListData.length
                      ? relationshipListData.map((list) => (
                        <option
                          key={list.relationshipId}
                          value={list.relationshipId}
                        >
                          {list.relationshipName}
                        </option>
                      )) :""}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Relationship is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2 mt-3">
                  <div className="gap-col">
                    {/* <Button variant="success" onClick={handleEdit}> */}
                    <Button type="submit" variant="success">
                      {t("update")}
                    </Button>
                  </div>
                  {/* <div className="gap-col">
                    <Button variant="danger" onClick={handleCloseModal2}>
                      Reject
                    </Button>
                  </div> */}
                  <div className="gap-col">
                    <Button variant="secondary" onClick={handleCloseModal1}>
                      {t("cancel")}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showModal2} onHide={handleCloseModal2} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>{t("add_farmer_land_details")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Form action="#"> */}
          <Form
            noValidate
            validated={validatedFarmerLand}
            onSubmit={handleAddFarmerLand}
          >
            <Row className="g-5 px-5">
              <Col lg="4">
                {/* <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="categoryNumber">
                    {t("category_no")}
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="categoryNumber"
                      name="categoryNumber"
                      value={farmerLand.categoryNumber}
                      onChange={handleFLInputs}
                      type="text"
                      placeholder={t("enter_category_no")}
                    />
                  </div>
                </Form.Group> */}

                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    Land Ownership<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="landOwnershipId"
                      value={`${farmerLand.landOwnershipId}_${farmerLand.landOwnershipName}`}
                      onChange={handleLandOwnershipOption}
                      onBlur={() => handleLandOwnershipOption}
                      required
                      isInvalid={
                        farmerLand.landOwnershipId === undefined ||
                        farmerLand.landOwnershipId === "0"
                      }
                    >
                      <option value="">Select Land Ownership</option>
                      {landOwnershipListData && landOwnershipListData.length
                      ? landOwnershipListData.map((list) => (
                        <option
                          key={list.landOwnershipId}
                          value={`${list.landOwnershipId}_${list.landOwnershipName}`}
                        >
                          {list.landOwnershipName}
                        </option>
                      ))
                      : ""}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Land Ownership is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    Soil Type<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="soilTypeId"
                      value={`${farmerLand.soilTypeId}_${farmerLand.soilTypeName}`}
                      onChange={handleSoilTypeOption}
                      onBlur={() => handleSoilTypeOption}
                      required
                      isInvalid={
                        farmerLand.soilTypeId === undefined ||
                        farmerLand.soilTypeId === "0"
                      }
                    >
                      <option value="">Select Soil Type</option>
                      {soilTypeListData && soilTypeListData.length
                      ? soilTypeListData.map((list) => (
                        <option
                          key={list.soilTypeId}
                          value={`${list.soilTypeId}_${list.soilTypeName}`}
                        >
                          {list.soilTypeName}
                        </option>
                      )) 
                      :""}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Soil Type is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="hissa">{t("hissa")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="hissa"
                      name="hissa"
                      value={farmerLand.hissa}
                      onChange={handleFLInputs}
                      type="text"
                      placeholder={t("enter_hissa")}
                      readOnly
                    />
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    Source of Mulberry<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="mulberrySourceId"
                      value={`${farmerLand.mulberrySourceId}_${farmerLand.mulberrySourceName}`}
                      onChange={handleMulberrySourceOption}
                      onBlur={() => handleMulberrySourceOption}
                      required
                      isInvalid={
                        farmerLand.mulberrySourceId === undefined ||
                        farmerLand.mulberrySourceId === "0"
                      }
                    >
                      <option value="">Select Source of Mulberry</option>
                      {mulberrySourceListData && mulberrySourceListData.length
                      ? mulberrySourceListData.map((list) => (
                        <option
                          key={list.mulberrySourceId}
                          value={`${list.mulberrySourceId}_${list.mulberrySourceName}`}
                        >
                          {list.mulberrySourceName}
                        </option>
                      ))
                      : ""}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Mulberry Source is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="mulberryArea">
                    {t("Mulberry Area(in Acres)")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="mulberryArea"
                      name="mulberryArea"
                      value={farmerLand.mulberryArea}
                      onChange={handleFLInputs}
                      type="text"
                      placeholder={t("enter_mulberry_area")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Mulberry Area is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    Mulberry Variety<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="mulberryVarietyId"
                      value={`${farmerLand.mulberryVarietyId}_${farmerLand.mulberryVarietyName}`}
                      onChange={handleMulberryVarietyOption}
                      onBlur={() => handleMulberryVarietyOption}
                      required
                      isInvalid={
                        farmerLand.mulberryVarietyId === undefined ||
                        farmerLand.mulberryVarietyId === "0"
                      }
                    >
                      <option value="">Select Mulberry Variety</option>
                      {mulberryVarietyListData && mulberryVarietyListData.length
                      ? mulberryVarietyListData.map((list) => (
                        <option
                          key={list.mulberryVarietyId}
                          value={`${list.mulberryVarietyId}_${list.mulberryVarietyName}`}
                        >
                          {list.mulberryVarietyName}
                        </option>
                      )) 
                      : ""}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Mulberry Variety is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label>{t("plantation_date")}</Form.Label>
                  <div className="form-control-wrap">
                    {/* <DatePicker
                      selected={data.plantationDate}
                      onChange={(date) =>
                        handleDateChange(date, "plantationDate")
                      }
                    /> */}
                    <DatePicker
                      selected={data.plantationDate}
                      onChange={(date) =>
                        handleDateChange(date, "plantationDate")
                      }
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      dateFormat="dd/MM/yyyy"
                    />
                  </div>
                </Form.Group>
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="spacing">
                    {t("Plantation Spacing")}
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="spacing"
                      name="spacing"
                      value={farmerLand.spacing}
                      onChange={handleFLInputs}
                      type="text"
                      placeholder={t("enter_spacing")}
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col lg="4">
                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    Plantation Type<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="plantationTypeId"
                      value={`${farmerLand.plantationTypeId}_${farmerLand.plantationTypeName}`}
                      onChange={handlePlantationTypeOption}
                      onBlur={() => handlePlantationTypeOption}
                      required
                      isInvalid={
                        farmerLand.plantationTypeId === undefined ||
                        farmerLand.plantationTypeId === "0"
                      }
                    >
                      <option value="">Select Plantation Type</option>
                      {plantationTypeListData && plantationTypeListData.length
                      ? plantationTypeListData.map((list) => (
                        <option
                          key={list.plantationTypeId}
                          value={`${list.plantationTypeId}_${list.plantationTypeName}`}
                        >
                          {list.plantationTypeName}
                        </option>
                      ))
                      :""}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Plantation Type is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    Irrigation Source<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="irrigationSourceId"
                      value={`${farmerLand.irrigationSourceId}_${farmerLand.irrigationSourceName}`}
                      onChange={handleIrrigationSourceOption}
                      onBlur={() => handleIrrigationSourceOption}
                      required
                      isInvalid={
                        farmerLand.irrigationSourceId === undefined ||
                        farmerLand.irrigationSourceId === "0"
                      }
                    >
                      <option value="">Select Irrigation Source</option>
                      {irrigationSourceListData && irrigationSourceListData.length
                      ? irrigationSourceListData.map((list) => (
                        <option
                          key={list.irrigationSourceId}
                          value={`${list.irrigationSourceId}_${list.irrigationSourceName}`}
                        >
                          {list.irrigationSourceName}
                        </option>
                      )) :""}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Irrigation Source is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    Irrigation Type<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="irrigationTypeId"
                      value={`${farmerLand.irrigationTypeId}_${farmerLand.irrigationTypeName}`}
                      onChange={handleIrrigationTypeOption}
                      onBlur={() => handleIrrigationTypeOption}
                      required
                      isInvalid={
                        farmerLand.irrigationTypeId === undefined ||
                        farmerLand.irrigationTypeId === "0"
                      }
                    >
                      <option value="">Select Irrigation Type</option>
                      {irrigationTypeListData && irrigationTypeListData.length > 0
                      ? (irrigationTypeListData.map((list) => (
                        <option
                          key={list.irrigationTypeId}
                          value={`${list.irrigationTypeId}_${list.irrigationTypeName}`}
                        >
                          {list.irrigationTypeName}
                        </option>
                      ))
                    ) : (
                      <option disabled>No options available</option>
                    )}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Irrigation Type is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="rhd">
                    {t("Rearing House (In Sq ft)")}
                    {/* <span className="text-danger">*</span> */}
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="rearingHouseDetails"
                      name="rearingHouseDetails"
                      value={farmerLand.rearingHouseDetails}
                      onChange={handleFLInputs}
                      type="text"
                      placeholder={t("enter_rearing_house_dimensions")}
                      // required
                    />
                    {/* <Form.Control.Feedback type="invalid">
                      Rearing House (In Sq ft) is required
                    </Form.Control.Feedback> */}
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    Rearing House Roof Type
                    {/* <span className="text-danger">*</span> */}
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="roofTypeId"
                      value={`${farmerLand.roofTypeId}_${farmerLand.roofTypeName}`}
                      onChange={handleRoofTypeOption}
                      onBlur={() => handleRoofTypeOption}
                      // required
                      // isInvalid={
                      //   farmerLand.roofTypeId === undefined ||
                      //   farmerLand.roofTypeId === "0"
                      // }
                    >
                      <option value="">Select Rearing House Roof Type</option>
                      {roofTypeListData && roofTypeListData.length > 0
                      ? (roofTypeListData.map((list) => (
                        <option
                          key={list.roofTypeId}
                          value={`${list.roofTypeId}_${list.roofTypeName}`}
                        >
                          {list.roofTypeName}
                        </option>
                      ))
                    ) : (
                      <option disabled>No options available</option>
                    )}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Roof Type is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    Silk Worm Variety
                    {/* <span className="text-danger">*</span> */}
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="silkWormVarietyId"
                      value={`${farmerLand.silkWormVarietyId}_${farmerLand.silkWormVarietyName}`}
                      onChange={handleSilkWormVarietyOption}
                      onBlur={() => handleSilkWormVarietyOption}
                      // required
                      // isInvalid={
                      //   farmerLand.silkWormVarietyId === undefined ||
                      //   farmerLand.silkWormVarietyId === "0"
                      // }
                    >
                      <option value="">Select Silk Worm Variety</option>
                      {silkWormVarietyListData && silkWormVarietyListData.length > 0
                      ? (silkWormVarietyListData.map((list) => (
                        <option
                          key={list.silkWormVarietyId}
                          value={`${list.silkWormVarietyId}_${list.silkWormVarietyName}`}
                        >
                          {list.silkWormVarietyName}
                        </option>
                      ))
                    ) : (
                      <option disabled>No options available</option>
                    )}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Silk Worm Variety is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="rearingCapacityCrops">
                    {t("rearing_capacity_crops_per_Annum")}
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="rearingCapacityCrops"
                      name="rearingCapacityCrops"
                      value={farmerLand.rearingCapacityCrops}
                      onChange={handleFLInputs}
                      type="text"
                      placeholder={t("enter_rearing_capacity_crops_per_Annum")}
                    />
                  </div>
                </Form.Group>
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="loandetails">
                    {t("loan_details")}
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="loanDetails"
                      name="loanDetails"
                      value={farmerLand.loanDetails}
                      onChange={handleFLInputs}
                      type="text"
                      placeholder={t("enter_loan_details")}
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col lg="4">
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="equipmentDetails">
                    {t("equipment_details")}
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="equipmentDetails"
                      name="equipmentDetails"
                      value={farmerLand.equipmentDetails}
                      onChange={handleFLInputs}
                      type="text"
                      placeholder={t("enter_equipment_details")}
                    />
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="rcapd">
                    {t("rearing_capacity_dlf_per_crop")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="rearingCapacityDlf"
                      name="rearingCapacityDlf"
                      value={farmerLand.rearingCapacityDlf}
                      onChange={handleFLInputs}
                      type="text"
                      placeholder={t("enter_rearing_capacity_dlf_per_crop")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Rearing Capacity dlf per crop is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    {t("subsidy_availed_from_the_department")}
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Row>
                      <Col>
                        <Form.Check
                          type="radio"
                          id="yes"
                          name="subsidyAvailed"
                          label={t("yes")}
                          value="yes"
                          onChange={handleChange}
                          checked={selected === "yes"}
                        />
                      </Col>
                      <Col>
                        <Form.Check
                          type="radio"
                          id="no"
                          value="no"
                          name="subsidyAvailed"
                          defaultChecked
                          onChange={handleChange}
                          checked={selected === "no"}
                          label={t("no")}
                        />
                      </Col>
                    </Row>
                  </div>
                </Form.Group>

                {/* {selected === "yes" && (
                  <Form.Group className="form-group mt-3">
                    <Form.Label>{t("programs")}</Form.Label>
                    <div className="form-control-wrap">
                      <Select multiple removeItemButton>
                        <option value="">{t("select")}</option>
                        <option value="1">Rearing House</option>
                        <option value="2">Drip</option>
                        <option value="3">Plantation</option>
                        <option value="4">Nursery</option>
                        <option value="5">Equipments</option>
                        <option value="6">Others</option>
                      </Select>
                    </div>
                  </Form.Group>
                )}

                <Form.Group className="form-group mt-3">
                  <Form.Label>Subsidy Details</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="subsidyId"
                      value={`${farmerLand.subsidyId}_${farmerLand.subsidyName}`}
                      onChange={handleSubsidyOption}
                    >
                      <option value="0">Select Subsidy Details</option>
                      {subsidyMasterListData.map((list) => (
                        <option
                          key={list.subsidyId}
                          value={`${list.subsidyId}_${list.subsidyName}`}
                        >
                          {list.subsidyName}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Form.Group> */}

                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="gpsLat">
                    {t("gps_coordinates")}
                  </Form.Label>
                  <Row>
                    <Col lg="6">
                      <Form.Control
                        id="gpsLat"
                        name="gpsLat"
                        value={farmerLand.gpsLat}
                        onChange={handleFLInputs}
                        type="text"
                        placeholder={t("Enter Latitude")}
                      />
                    </Col>
                    <Col lg="6">
                      <Form.Control
                        id="gpsLng"
                        name="gpsLng"
                        value={farmerLand.gpsLng}
                        onChange={handleFLInputs}
                        type="text"
                        placeholder="Enter Longitude"
                      />
                    </Col>
                  </Row>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="ownerName">{t("owner_name")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="ownerName"
                      name="ownerName"
                      value={farmerLand.ownerName}
                      onChange={handleFLInputs}
                      type="text"
                      placeholder={t("enter_owner_name")}
                      readOnly
                    />
                  </div>
                </Form.Group>
                {/* <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="ownerName">{t("owner_name")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="ownerName"
                      name="ownerName"
                      value={farmerLand.ownerName}
                      onChange={handleFLInputs}
                      type="text"
                      placeholder={t("enter_owner_name")}
                    />
                  </div>
                </Form.Group> */}

                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="ownerNo">{t("Owner Number")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="ownerNo"
                      name="ownerNo"
                      value={farmerLand.ownerNo}
                      onChange={handleFLInputs}
                      type="text"
                      placeholder={t("Enter owner Number")}
                      readOnly
                    />
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="mainOwnerNo">
                    {t("Main Owner Number")}
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="mainOwnerNo"
                      name="mainOwnerNo"
                      value={farmerLand.mainOwnerNo}
                      onChange={handleFLInputs}
                      type="text"
                      placeholder={t("Enter owner Number")}
                      readOnly
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col lg="12">
                <h3>{t("survey_details")}</h3>
                <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="surveyNumber">
                        {t("survey_number")}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="surveyNumber"
                          name="surveyNumber"
                          value={farmerLand.surveyNumber}
                          onChange={handleFLInputs}
                          type="text"
                          placeholder={t("enter_survey_number")}
                          readOnly
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Survey Number is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="acre">{t("Acre")}</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="acre"
                          name="acre"
                          value={farmerLand.acre}
                          onChange={handleFLInputs}
                          type="text"
                          placeholder={t("Enter acre")}
                          readOnly
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>State</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="stateId"
                          // value={`${farmerLand.stateId}_${farmerLand.stateName}`}
                          value={farmerLand.stateId}
                          onChange={handleStateLandOption}
                        >
                          <option value="0">Select State</option>
                          {stateListData && stateListData.length > 0
                          ? (stateListData.map((list) => (
                            <option key={list.stateId} value={list.stateId}>
                              {list.stateName}
                            </option>
                          ))
                        ) : (
                          <option disabled>No options available</option>
                        )}
                        </Form.Select>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>District</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="districtId"
                          value={`${farmerLand.districtId}_${farmerLand.districtName}`}
                          onChange={handleDistrictLandOption}
                        >
                          <option value="">Select District</option>
                          {districtListData && districtListData.length > 0
                            ? (districtListData.map((list) => (
                                <option
                                  key={list.districtId}
                                  value={`${list.districtId}_${list.districtName}`}
                                >
                                  {list.districtName}
                                </option>
                              ))
                            ) : (
                              <option disabled>No options available</option>
                            )}
                        </Form.Select>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>Taluk</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="talukId"
                          value={`${farmerLand.talukId}_${farmerLand.talukName}`}
                          onChange={handleTalukLandOption}
                        >
                          <option value="">Select Taluk</option>
                          {talukListData && talukListData.length > 0
                            ? (talukListData.map((list) => (
                                <option
                                  key={list.talukId}
                                  value={`${list.talukId}_${list.talukName}`}
                                >
                                  {list.talukName}
                                </option>
                              ))
                    ) : (
                      <option disabled>No options available</option>
                    )}
                        </Form.Select>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>Hobli</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="hobliId"
                          value={`${farmerLand.hobliId}_${farmerLand.hobliName}`}
                          onChange={handleHobliLandOption}
                        >
                          <option value="">Select Hobli</option>
                          {hobliListData && hobliListData.length > 0
                            ? (hobliListData.map((list) => (
                                <option
                                  key={list.hobliId}
                                  value={`${list.hobliId}_${list.hobliName}`}
                                >
                                  {list.hobliName}
                                </option>
                              ))
                    ) : (
                      <option disabled>No options available</option>
                    )}
                        </Form.Select>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="Village">Village</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="villageId"
                          value={`${farmerLand.villageId}_${farmerLand.villageName}`}
                          onChange={handleVillageLandOption}
                        >
                          <option value="">Select Village</option>
                          {villageListData && villageListData.length > 0
                            ? (villageListData.map((list) => (
                                <option
                                  key={list.villageId}
                                  value={`${list.villageId}_${list.villageName}`}
                                >
                                  {list.villageName}
                                </option>
                              ))
                    ) : (
                      <option disabled>No options available</option>
                    )}
                        </Form.Select>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="surNoc">
                        {t("survey_noc")}
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="surNoc"
                          name="surNoc"
                          value={farmerLand.surNoc}
                          onChange={handleFLInputs}
                          type="text"
                          placeholder={t("enter_survey_noc")}
                          readOnly
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="gunta">{t("Gunta")}</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="gunta"
                          name="gunta"
                          value={farmerLand.gunta}
                          onChange={handleFLInputs}
                          type="text"
                          placeholder={t("Enter gunta")}
                          readOnly
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="fgunta">{t("FGunta")}</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="fgunta"
                          name="fgunta"
                          value={farmerLand.fgunta}
                          onChange={handleFLInputs}
                          type="text"
                          placeholder={t("Enter fgunta")}
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="pincode">{t("pin_code")}</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="pincode"
                          name="pincode"
                          value={farmerLand.pincode}
                          onChange={handleFLInputs}
                          type="text"
                          placeholder={t("enter_pin_code")}
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="address">{t("address")}</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          as="textarea"
                          id="address"
                          name="address"
                          value={farmerLand.address}
                          onChange={handleFLInputs}
                          type="text"
                          placeholder={t("enter_address")}
                          rows="5"
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2">
                  <div className="gap-col">
                    {/* <Button variant="success" onClick={handleAddFarmerLand}> */}
                    <Button type="submit" variant="success">
                      {t("add")}
                    </Button>
                  </div>
                  {/* <div className="gap-col">
                    <Button variant="danger" onClick={handleCloseModal1}>
                      Reject
                    </Button>
                  </div> */}
                  <div className="gap-col">
                    <Button variant="secondary" onClick={handleCloseModal2}>
                      {t("cancel")}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showModal3} onHide={handleCloseModal3} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Edit Farmer Land</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Form action="#"> */}
          <Form
            noValidate
            validated={validatedFarmerLandEdit}
            onSubmit={(e) => handleUpdateFl(e, flId, farmerLand)}
          >
            <Row className="g-5 px-5">
              <Col lg="4">
                {/* <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="categoryNumber">
                    {t("category_no")}
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="categoryNumber"
                      name="categoryNumber"
                      value={farmerLand.categoryNumber}
                      onChange={handleFLInputs}
                      type="text"
                      placeholder={t("enter_category_no")}
                    />
                  </div>
                </Form.Group> */}

                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    Land Ownership<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="landOwnershipId"
                      value={`${farmerLand.landOwnershipId}_${farmerLand.landOwnershipName}`}
                      onChange={handleLandOwnershipOption}
                      onBlur={() => handleLandOwnershipOption}
                      required
                      isInvalid={
                        farmerLand.landOwnershipId === undefined ||
                        farmerLand.landOwnershipId === "0"
                      }
                    >
                      <option value="">Select Land Ownership</option>
                      {landOwnershipListData && landOwnershipListData.length > 0
                      ? (landOwnershipListData.map((list) => (
                        <option
                          key={list.landOwnershipId}
                          value={`${list.landOwnershipId}_${list.landOwnershipName}`}
                        >
                          {list.landOwnershipName}
                        </option>
                      ))
                    ) : (
                      <option disabled>No options available</option>
                    )}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Land Ownership is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    Soil Type<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="soilTypeId"
                      value={`${farmerLand.soilTypeId}_${farmerLand.soilTypeName}`}
                      onChange={handleSoilTypeOption}
                      onBlur={() => handleSoilTypeOption}
                      required
                      isInvalid={
                        farmerLand.soilTypeId === undefined ||
                        farmerLand.soilTypeId === "0"
                      }
                    >
                      <option value="">Select Soil Type</option>
                      {soilTypeListData && soilTypeListData.length > 0
                      ? (soilTypeListData.map((list) => (
                        <option
                          key={list.soilTypeId}
                          value={`${list.soilTypeId}_${list.soilTypeName}`}
                        >
                          {list.soilTypeName}
                        </option>
                      ))
                    ) : (
                      <option disabled>No options available</option>
                    )}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Soil Type is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="hissa">{t("hissa")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="hissa"
                      name="hissa"
                      value={farmerLand.hissa}
                      onChange={handleFLInputs}
                      type="text"
                      placeholder={t("enter_hissa")}
                      readOnly
                    />
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    Source of Mulberry<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="mulberrySourceId"
                      value={`${farmerLand.mulberrySourceId}_${farmerLand.mulberrySourceName}`}
                      onChange={handleMulberrySourceOption}
                      onBlur={() => handleMulberrySourceOption}
                      required
                      isInvalid={
                        farmerLand.mulberrySourceId === undefined ||
                        farmerLand.mulberrySourceId === "0"
                      }
                    >
                      <option value="">Select Source of Mulberry</option>
                      {mulberrySourceListData && mulberrySourceListData.length > 0
                      ? (mulberrySourceListData.map((list) => (
                        <option
                          key={list.mulberrySourceId}
                          value={`${list.mulberrySourceId}_${list.mulberrySourceName}`}
                        >
                          {list.mulberrySourceName}
                        </option>
                      ))
                    ) : (
                      <option disabled>No options available</option>
                    )}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Mulberry Source is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="mulberryArea">
                    {t("Mulberry Area(in Acres)")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="mulberryArea"
                      name="mulberryArea"
                      value={farmerLand.mulberryArea}
                      onChange={handleFLInputs}
                      type="text"
                      placeholder={t("enter_mulberry_area")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Mulberry Area is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    Mulberry Variety<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="mulberryVarietyId"
                      value={`${farmerLand.mulberryVarietyId}_${farmerLand.mulberryVarietyName}`}
                      onChange={handleMulberryVarietyOption}
                      onBlur={() => handleMulberryVarietyOption}
                      required
                      isInvalid={
                        farmerLand.mulberryVarietyId === undefined ||
                        farmerLand.mulberryVarietyId === "0"
                      }
                    >
                      <option value="">Select Mulberry Variety</option>
                      {mulberryVarietyListData && mulberryVarietyListData.length > 0
                      ? (mulberryVarietyListData.map((list) => (
                        <option
                          key={list.mulberryVarietyId}
                          value={`${list.mulberryVarietyId}_${list.mulberryVarietyName}`}
                        >
                          {list.mulberryVarietyName}
                        </option>
                      ))
                    ) : (
                      <option disabled>No options available</option>
                    )}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Mulberry Variety is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                {/* <Form.Group className="form-group mt-3">
                  <Form.Label>{t("plantation_date")}</Form.Label>
                  <div className="form-control-wrap">
                    <DatePicker
                      selected={data.plantationDate}
                      onChange={(date) =>
                        handleDateChange(date, "plantationDate")
                      }
                    />
                  </div>
                </Form.Group> */}
                {/* <Form.Group className="form-group mt-3">
                  <Form.Label>{t("plantation_date")}</Form.Label>
                  <div className="form-control-wrap">
                  
                    <DatePicker
                      selected={data.plantationDate}
                      onChange={(date) =>
                        handleDateChange(date, "plantationDate")
                      }
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      dateFormat="dd/MM/yyyy"
                    />
                  </div>
                </Form.Group> */}

                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="spacing">
                    {t("Plantation Spacing")}
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="spacing"
                      name="spacing"
                      value={farmerLand.spacing}
                      onChange={handleFLInputs}
                      type="text"
                      placeholder={t("enter_spacing")}
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col lg="4">
                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    Plantation Type<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="plantationTypeId"
                      value={`${farmerLand.plantationTypeId}_${farmerLand.plantationTypeName}`}
                      onChange={handlePlantationTypeOption}
                      onBlur={() => handlePlantationTypeOption}
                      required
                      isInvalid={
                        farmerLand.plantationTypeId === undefined ||
                        farmerLand.plantationTypeId === "0"
                      }
                    >
                      <option value="">Select Plantation Type</option>
                      {plantationTypeListData && plantationTypeListData.length > 0
                      ? (plantationTypeListData.map((list) => (
                        <option
                          key={list.plantationTypeId}
                          value={`${list.plantationTypeId}_${list.plantationTypeName}`}
                        >
                          {list.plantationTypeName}
                        </option>
                      ))
                    ) : (
                      <option disabled>No options available</option>
                    )}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Plantation Type is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    Irrigation Source<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="irrigationSourceId"
                      value={`${farmerLand.irrigationSourceId}_${farmerLand.irrigationSourceName}`}
                      onChange={handleIrrigationSourceOption}
                      onBlur={() => handleIrrigationSourceOption}
                      required
                      isInvalid={
                        farmerLand.irrigationSourceId === undefined ||
                        farmerLand.irrigationSourceId === "0"
                      }
                    >
                      <option value="0">Select Irrigation Source</option>
                      {irrigationSourceListData && irrigationSourceListData.length > 0
                      ? (irrigationSourceListData.map((list) => (
                        <option
                          key={list.irrigationSourceId}
                          value={`${list.irrigationSourceId}_${list.irrigationSourceName}`}
                        >
                          {list.irrigationSourceName}
                        </option>
                      ))
                    ) : (
                      <option disabled>No options available</option>
                    )}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Irrigation Source is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    Irrigation Type<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="irrigationTypeId"
                      value={`${farmerLand.irrigationTypeId}_${farmerLand.irrigationTypeName}`}
                      onChange={handleIrrigationTypeOption}
                      onBlur={() => handleIrrigationTypeOption}
                      required
                      isInvalid={
                        farmerLand.irrigationTypeId === undefined ||
                        farmerLand.irrigationTypeId === "0"
                      }
                    >
                      <option value="">Select Irrigation Type</option>
                      {irrigationTypeListData && irrigationTypeListData.length > 0
                      ? (irrigationTypeListData.map((list) => (
                        <option
                          key={list.irrigationTypeId}
                          value={`${list.irrigationTypeId}_${list.irrigationTypeName}`}
                        >
                          {list.irrigationTypeName}
                        </option>
                      ))
                    ) : (
                      <option disabled>No options available</option>
                    )}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Irrigation Type is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="rhd">
                    {t("Rearing House (In Sq ft)")}
                    {/* <span className="text-danger">*</span> */}
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="rearingHouseDetails"
                      name="rearingHouseDetails"
                      value={farmerLand.rearingHouseDetails}
                      onChange={handleFLInputs}
                      type="text"
                      placeholder={t("enter_rearing_house_dimensions")}
                      // required
                    />
                    {/* <Form.Control.Feedback type="invalid">
                      Rearing House (In Sq ft) is required
                    </Form.Control.Feedback> */}
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    Rearing House Roof Type
                    {/* <span className="text-danger">*</span> */}
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="roofTypeId"
                      value={`${farmerLand.roofTypeId}_${farmerLand.roofTypeName}`}
                      onChange={handleRoofTypeOption}
                      onBlur={() => handleRoofTypeOption}
                      // required
                      // isInvalid={
                      //   farmerLand.roofTypeId === undefined ||
                      //   farmerLand.roofTypeId === "0"
                      // }
                    >
                      <option value="">Select Rearing House Roof Type</option>
                      {roofTypeListData && roofTypeListData.length > 0
                      ? (roofTypeListData.map((list) => (
                        <option
                          key={list.roofTypeId}
                          value={`${list.roofTypeId}_${list.roofTypeName}`}
                        >
                          {list.roofTypeName}
                        </option>
                      ))
                    ) : (
                      <option disabled>No options available</option>
                    )}
                    </Form.Select>
                    {/* <Form.Control.Feedback type="invalid">
                      Roof Type is required
                    </Form.Control.Feedback> */}
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    Silk Worm Variety
                    {/* <span className="text-danger">*</span> */}
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="silkWormVarietyId"
                      value={`${farmerLand.silkWormVarietyId}_${farmerLand.silkWormVarietyName}`}
                      onChange={handleSilkWormVarietyOption}
                      onBlur={() => handleSilkWormVarietyOption}
                      // required
                      // isInvalid={
                      //   farmerLand.silkWormVarietyId === undefined ||
                      //   farmerLand.silkWormVarietyId === "0"
                      // }
                    >
                      <option value="">Select Silk Worm Variety</option>
                      {silkWormVarietyListData && silkWormVarietyListData.length > 0
                      ? (silkWormVarietyListData.map((list) => (
                        <option
                          key={list.silkWormVarietyId}
                          value={`${list.silkWormVarietyId}_${list.silkWormVarietyName}`}
                        >
                          {list.silkWormVarietyName}
                        </option>
                      ))
                    ) : (
                      <option disabled>No options available</option>
                    )}
                    </Form.Select>
                    {/* <Form.Control.Feedback type="invalid">
                      Silk Worm Variety is required
                    </Form.Control.Feedback> */}
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="rearingCapacityCrops">
                    {t("rearing_capacity_crops_per_Annum")}
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="rearingCapacityCrops"
                      name="rearingCapacityCrops"
                      value={farmerLand.rearingCapacityCrops}
                      onChange={handleFLInputs}
                      type="text"
                      placeholder={t("enter_rearing_capacity_crops_per_Annum")}
                    />
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="loandetails">
                    {t("loan_details")}
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="loanDetails"
                      name="loanDetails"
                      value={farmerLand.loanDetails}
                      onChange={handleFLInputs}
                      type="text"
                      placeholder={t("enter_loan_details")}
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col lg="4">
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="equipmentDetails">
                    {t("equipment_details")}
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="equipmentDetails"
                      name="equipmentDetails"
                      value={farmerLand.equipmentDetails}
                      onChange={handleFLInputs}
                      type="text"
                      placeholder={t("enter_equipment_details")}
                    />
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="rcapd">
                    {t("rearing_capacity_dlf_per_crop")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="rearingCapacityDlf"
                      name="rearingCapacityDlf"
                      value={farmerLand.rearingCapacityDlf}
                      onChange={handleFLInputs}
                      type="text"
                      placeholder={t("enter_rearing_capacity_dlf_per_crop")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Rearing Capacity dlf per crop is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    {t("subsidy_availed_from_the_department")}
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Row>
                      <Col>
                        <Form.Check
                          type="radio"
                          id="yes"
                          name="subsidyAvailed"
                          label={t("yes")}
                          value="yes"
                          onChange={handleChange}
                          checked={selected === "yes"}
                        />
                      </Col>
                      <Col>
                        <Form.Check
                          type="radio"
                          id="no"
                          value="no"
                          name="subsidyAvailed"
                          defaultChecked
                          onChange={handleChange}
                          checked={selected === "no"}
                          label={t("no")}
                        />
                      </Col>
                    </Row>
                  </div>
                </Form.Group>

                {/* {selected === "yes" && (
                  <Form.Group className="form-group mt-3">
                    <Form.Label>{t("programs")}</Form.Label>
                    <div className="form-control-wrap">
                      <Select multiple removeItemButton>
                        <option value="">{t("select")}</option>
                        <option value="1">Rearing House</option>
                        <option value="2">Drip</option>
                        <option value="3">Plantation</option>
                        <option value="4">Nursery</option>
                        <option value="5">Equipments</option>
                        <option value="6">Others</option>
                      </Select>
                    </div>
                  </Form.Group>
                )} */}

                {/* {selected === "yes" && (
                  <Form.Group className="form-group mt-3">
                  <Form.Label>Programs</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="scProgramId"
                      value={`${farmerLand.scProgramId}_${farmerLand.scProgramName}`}
                      onChange={handleProgramOption}
                    >
                      <option value="0">Select Programs</option>
                      {programListData.map((list) => (
                        <option
                          key={list.scProgramId}
                          value={`${list.scProgramId}_${list.scProgramName}`}
                        >
                          {list.scProgramName}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Form.Group> 
                )} */}

                {/* <Form.Group className="form-group mt-3">
                  <Form.Label>Subsidy Details</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="subsidyId"
                      value={`${farmerLand.subsidyId}_${farmerLand.subsidyName}`}
                      onChange={handleSubsidyOption}
                    >
                      <option value="0">Select Subsidy Details</option>
                      {subsidyMasterListData.map((list) => (
                        <option
                          key={list.subsidyId}
                          value={`${list.subsidyId}_${list.subsidyName}`}
                        >
                          {list.subsidyName}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Form.Group>  */}

                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="gpsLat">
                    {t("gps_coordinates")}
                  </Form.Label>
                  <Row>
                    <Col lg="6">
                      <Form.Control
                        id="gpsLat"
                        name="gpsLat"
                        value={farmerLand.gpsLat}
                        onChange={handleFLInputs}
                        type="text"
                        placeholder={t("enter_latitude")}
                      />
                    </Col>
                    <Col lg="6">
                      <Form.Control
                        id="gpsLng"
                        name="gpsLng"
                        value={farmerLand.gpsLng}
                        onChange={handleFLInputs}
                        type="text"
                        placeholder="Enter Longitude"
                      />
                    </Col>
                  </Row>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="ownerName">{t("owner_name")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="ownerName"
                      name="ownerName"
                      value={farmerLand.ownerName}
                      onChange={handleFLInputs}
                      type="text"
                      placeholder={t("enter_owner_name")}
                      readOnly
                    />
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="ownerNo">{t("Owner Number")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="ownerNo"
                      name="ownerNo"
                      value={farmerLand.ownerNo}
                      onChange={handleFLInputs}
                      type="text"
                      placeholder={t("Enter owner Number")}
                      readOnly
                    />
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="mainOwnerNo">
                    {t("Main Owner Number")}
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="mainOwnerNo"
                      name="mainOwnerNo"
                      value={farmerLand.mainOwnerNo}
                      onChange={handleFLInputs}
                      type="text"
                      placeholder={t("Enter owner Number")}
                      readOnly
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col lg="12">
                <h3>{t("survey_details")}</h3>
                <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="surveyNumber">
                        {t("survey_number")}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="surveyNumber"
                          name="surveyNumber"
                          value={farmerLand.surveyNumber}
                          onChange={handleFLInputs}
                          type="text"
                          placeholder={t("enter_survey_number")}
                          required
                          readOnly
                        />
                        <Form.Control.Feedback type="invalid">
                          Survey Number is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="acre">{t("Acre")}</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="acre"
                          name="acre"
                          value={farmerLand.acre}
                          onChange={handleFLInputs}
                          type="text"
                          placeholder={t("Enter acre")}
                          readOnly
                        />
                      </div>
                    </Form.Group>

                    {/* <Form.Group className="form-group mt-3">
                      <Form.Label>State</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="stateId"
                          value={`${farmerLand.stateId}_${farmerLand.stateName}`}
                          // value={farmerLand.stateId}
                          onChange={handleStateLandOption}
                        >
                          <option value="0">Select State</option>
                          {stateListData.map((list) => (
                            <option
                              key={list.stateId}
                              value={`${list.stateId}_${list.stateName}`}
                            >
                              {list.stateName}
                            </option>
                          ))}
                        </Form.Select>
                      </div>
                    </Form.Group> */}

                    <Form.Group className="form-group mt-3">
                      <Form.Label>State</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="stateId"
                          value={farmerLand.stateId}
                          onChange={handleStateLandOption}
                        >
                          <option value="0">Select State</option>
                          {stateListData && stateListData.length > 0
                          ? (stateListData.map((list) => (
                            <option key={list.stateId} value={list.stateId}>
                              {list.stateName}
                            </option>
                          ))
                    ) : (
                      <option disabled>No options available</option>
                    )}
                        </Form.Select>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>District</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="districtId"
                          value={`${farmerLand.districtId}_${farmerLand.districtName}`}
                          onChange={handleDistrictLandOption}
                        >
                          <option value="">Select District</option>
                          {districtListData && districtListData.length > 0
                            ? (districtListData.map((list) => (
                                <option
                                  key={list.districtId}
                                  value={`${list.districtId}_${list.districtName}`}
                                >
                                  {list.districtName}
                                </option>
                              ))
                    ) : (
                      <option disabled>No options available</option>
                    )}
                        </Form.Select>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>Taluk</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="talukId"
                          value={`${farmerLand.talukId}_${farmerLand.talukName}`}
                          onChange={handleTalukLandOption}
                        >
                          <option value="">Select Taluk</option>
                          {talukListData && talukListData.length > 0
                            ? (talukListData.map((list) => (
                                <option
                                  key={list.talukId}
                                  value={`${list.talukId}_${list.talukName}`}
                                >
                                  {list.talukName}
                                </option>
                              ))
                    ) : (
                      <option disabled>No options available</option>
                    )}
                        </Form.Select>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>Hobli</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="hobliId"
                          value={`${farmerLand.hobliId}_${farmerLand.hobliName}`}
                          onChange={handleHobliLandOption}
                        >
                          <option value="">Select Hobli</option>
                          {hobliListData && hobliListData.length > 0
                            ? (hobliListData.map((list) => (
                                <option
                                  key={list.hobliId}
                                  value={`${list.hobliId}_${list.hobliName}`}
                                >
                                  {list.hobliName}
                                </option>
                              ))
                    ) : (
                      <option disabled>No options available</option>
                    )}
                        </Form.Select>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="Village">Village</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="villageId"
                          value={`${farmerLand.villageId}_${farmerLand.villageName}`}
                          onChange={handleVillageLandOption}
                        >
                          <option value="">Select Village</option>
                          {villageListData && villageListData.length > 0
                            ? (villageListData.map((list) => (
                                <option
                                  key={list.villageId}
                                  value={`${list.villageId}_${list.villageName}`}
                                >
                                  {list.villageName}
                                </option>
                              ))
                    ) : (
                      <option disabled>No options available</option>
                    )}
                        </Form.Select>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="surNoc">
                        {t("survey_noc")}
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="surNoc"
                          name="surNoc"
                          value={farmerLand.surNoc}
                          onChange={handleFLInputs}
                          type="text"
                          placeholder={t("enter_survey_noc")}
                          readOnly
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="gunta">{t("Gunta")}</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="gunta"
                          name="gunta"
                          value={farmerLand.gunta}
                          onChange={handleFLInputs}
                          type="text"
                          placeholder={t("Enter gunta")}
                          readOnly
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="fgunta">{t("FGunta")}</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="fgunta"
                          name="fgunta"
                          value={farmerLand.fgunta}
                          onChange={handleFLInputs}
                          type="text"
                          placeholder={t("Enter fgunta")}
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="pincode">{t("pin_code")}</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="pincode"
                          name="pincode"
                          value={farmerLand.pincode}
                          onChange={handleFLInputs}
                          type="text"
                          placeholder={t("enter_pin_code")}
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="address">{t("address")}</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          as="textarea"
                          id="address"
                          name="address"
                          value={farmerLand.address}
                          onChange={handleFLInputs}
                          type="text"
                          placeholder={t("enter_address")}
                          rows="5"
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2 mt-3">
                  <div className="gap-col">
                    {/* <Button
                      variant="success"
                      onClick={() => handleUpdateFl(flId, farmerLand)}
                    > */}
                    <Button type="submit" variant="success">
                      {t("update")}
                    </Button>
                  </div>
                  {/* <div className="gap-col">
                    <Button variant="danger" onClick={handleCloseModal2}>
                      Reject
                    </Button>
                  </div> */}
                  <div className="gap-col">
                    <Button variant="secondary" onClick={handleCloseModal3}>
                      {t("cancel")}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showModal4} onHide={handleCloseModal4} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>{t("add_address")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Form action="#"> */}
          <Form
            noValidate
            validated={validatedFarmerAddress}
            onSubmit={handleAddFarmerAddress}
          >
            <Row className="g-3">
              <Col lg="6">
                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    State<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="stateId"
                      value={farmerAddress.stateId}
                      onChange={handleFarmerAddressInputs}
                      onBlur={() => handleFarmerAddressInputs}
                      required
                      isInvalid={
                        farmerAddress.stateId === undefined ||
                        farmerAddress.stateId === "0"
                      }
                    >
                      <option value="">Select State</option>
                      {addressStateListData && addressStateListData.length > 0
                      ? (addressStateListData.map((list) => (
                        <option key={list.stateId} value={list.stateId}>
                          {list.stateName}
                        </option>
                      ))
                    ) : (
                      <option disabled>No options available</option>
                    )}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      State Name is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    District<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="districtId"
                      value={farmerAddress.districtId}
                      onChange={handleFarmerAddressInputs}
                      onBlur={() => handleFarmerAddressInputs}
                      required
                      isInvalid={
                        farmerAddress.districtId === undefined ||
                        farmerAddress.districtId === "0"
                      }
                    >
                      <option value="">Select District</option>
                      {addressdistrictListData && addressdistrictListData.length > 0
                        ? (addressdistrictListData.map((list) => (
                            <option
                              key={list.districtId}
                              value={list.districtId}
                            >
                              {list.districtName}
                            </option>
                          ))
                    ) : (
                      <option disabled>No options available</option>
                    )}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      District Name is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    Taluk<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="talukId"
                      value={farmerAddress.talukId}
                      onChange={handleFarmerAddressInputs}
                      onBlur={() => handleFarmerAddressInputs}
                      required
                      isInvalid={
                        farmerAddress.talukId === undefined ||
                        farmerAddress.talukId === "0"
                      }
                    >
                      <option value="">Select Taluk</option>
                      {addressTalukListData && addressTalukListData.length > 0
                        ? (addressTalukListData.map((list) => (
                            <option key={list.talukId} value={list.talukId}>
                              {list.talukName}
                            </option>
                          ))
                    ) : (
                      <option disabled>No options available</option>
                    )}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Taluk Name is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    Hobli<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="hobliId"
                      value={farmerAddress.hobliId}
                      onChange={handleFarmerAddressInputs}
                      onBlur={() => handleFarmerAddressInputs}
                      required
                      isInvalid={
                        farmerAddress.hobliId === undefined ||
                        farmerAddress.hobliId === "0"
                      }
                    >
                      <option value="">Select Hobli</option>
                      {addressHobliListData && addressHobliListData.length > 0
                        ? (addressHobliListData.map((list) => (
                            <option key={list.hobliId} value={list.hobliId}>
                              {list.hobliName}
                            </option>
                          ))
                    ) : (
                      <option disabled>No options available</option>
                    )}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Hobli Name is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="Village">
                    Village<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="villageId"
                      value={farmerAddress.villageId}
                      onChange={handleFarmerAddressInputs}
                      onBlur={() => handleFarmerAddressInputs}
                      required
                      isInvalid={
                        farmerAddress.villageId === undefined ||
                        farmerAddress.villageId === "0"
                      }
                    >
                      <option value="">Select Village</option>
                      {addressVillageListData && addressVillageListData.length > 0
                        ? (addressVillageListData.map((list) => (
                            <option key={list.villageId} value={list.villageId}>
                              {list.villageName}
                            </option>
                          ))
                    ) : (
                      <option disabled>No options available</option>
                    )}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Village Name is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
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
                      readOnly
                    />
                    <Form.Control.Feedback type="invalid">
                      Address is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-3">
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

                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="defaultAddress">
                    {t("make_this_address_default")}
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Check
                      type="checkbox"
                      id="defaultAddress"
                      checked={farmerAddress.defaultAddress}
                      onChange={handleCheckBox}
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2 mt-3">
                  <div className="gap-col">
                    {/* <Button variant="success" onClick={handleAddFarmerAddress}> */}
                    <Button type="submit" variant="success">
                      {t("add")}
                    </Button>
                  </div>
                  {/* <div className="gap-col">
                    <Button variant="danger" onClick={handleCloseModal2}>
                      Reject
                    </Button>
                  </div> */}
                  <div className="gap-col">
                    <Button variant="secondary" onClick={handleCloseModal4}>
                      {t("cancel")}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showModal5} onHide={handleCloseModal5} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Form action="#"> */}
          <Form
            noValidate
            validated={validatedFarmerAddressEdit}
            onSubmit={handleEditFA}
          >
            <Row className="g-5 px-5">
              <Col lg="6">
                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    State<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="stateId"
                      value={farmerAddress.stateId}
                      onChange={handleFarmerAddressInputs}
                      onBlur={() => handleFarmerAddressInputs}
                      required
                      isInvalid={
                        farmerAddress.stateId === undefined ||
                        farmerAddress.stateId === "0"
                      }
                    >
                      <option value="">Select State</option>
                      {addressStateListData && addressStateListData.length
                      ? addressStateListData.map((list) => (
                        <option key={list.stateId} value={list.stateId}>
                          {list.stateName}
                        </option>
                      ))
                      : ""}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      State Name is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    District<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="districtId"
                      value={farmerAddress.districtId}
                      onChange={handleFarmerAddressInputs}
                      onBlur={() => handleFarmerAddressInputs}
                      required
                      isInvalid={
                        farmerAddress.districtId === undefined ||
                        farmerAddress.districtId === "0"
                      }
                    >
                      <option value="">Select District</option>
                      {addressdistrictListData && addressdistrictListData.length > 0
                        ? (addressdistrictListData.map((list) => (
                            <option
                              key={list.districtId}
                              value={list.districtId}
                            >
                              {list.districtName}
                            </option>
                          ))
                    ) : (
                      <option disabled>No options available</option>
                    )}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      District Name is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    Taluk<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="talukId"
                      value={farmerAddress.talukId}
                      onChange={handleFarmerAddressInputs}
                      onBlur={() => handleFarmerAddressInputs}
                      required
                      isInvalid={
                        farmerAddress.talukId === undefined ||
                        farmerAddress.talukId === "0"
                      }
                    >
                      <option value="">Select Taluk</option>
                      {addressTalukListData && addressTalukListData.length > 0
                        ? (addressTalukListData.map((list) => (
                            <option key={list.talukId} value={list.talukId}>
                              {list.talukName}
                            </option>
                          ))
                    ) : (
                      <option disabled>No options available</option>
                    )}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Taluk Name is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    Hobli<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="hobliId"
                      value={farmerAddress.hobliId}
                      onChange={handleFarmerAddressInputs}
                      onBlur={() => handleFarmerAddressInputs}
                      required
                      isInvalid={
                        farmerAddress.hobliId === undefined ||
                        farmerAddress.hobliId === "0"
                      }
                    >
                      <option value="">Select Hobli</option>
                      {addressHobliListData && addressHobliListData.length > 0
                        ? (addressHobliListData.map((list) => (
                            <option key={list.hobliId} value={list.hobliId}>
                              {list.hobliName}
                            </option>
                          ))
                    ) : (
                      <option disabled>No options available</option>
                    )}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Hobli Name is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="Village">
                    Village<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="villageId"
                      value={farmerAddress.villageId}
                      onChange={handleFarmerAddressInputs}
                      onBlur={() => handleFarmerAddressInputs}
                      required
                      isInvalid={
                        farmerAddress.villageId === undefined ||
                        farmerAddress.villageId === "0"
                      }
                    >
                      <option value="">Select Village</option>
                      {addressVillageListData && addressVillageListData.length > 0
                        ? (addressVillageListData.map((list) => (
                            <option key={list.villageId} value={list.villageId}>
                              {list.villageName}
                            </option>
                          ))
                    ) : (
                      <option disabled>No options available</option>
                    )}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Village Name is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
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
                      readOnly
                    />
                    <Form.Control.Feedback type="invalid">
                      Address is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-3">
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

                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="defaultAddress">
                    {t("make_this_address_default")}
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Check
                      type="checkbox"
                      id="defaultAddress"
                      checked={farmerAddress.defaultAddress}
                      onChange={handleCheckBox}
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2">
                  <div className="gap-col">
                    {/* <Button variant="success" onClick={handleEditFA}> */}
                    <Button type="submit" variant="success">
                      Update
                    </Button>
                  </div>
                  {/* <div className="gap-col">
                    <Button variant="danger" onClick={handleCloseModal1}>
                      Reject
                    </Button>
                  </div> */}
                  <div className="gap-col">
                    <Button variant="secondary" onClick={handleCloseModal5}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </Layout>
  );
}

export default WithoutFruitsIdStakeHolderEdit;