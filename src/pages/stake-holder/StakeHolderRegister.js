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

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function StakeHolderRegister() {
  const [familyMembersList, setFamilyMembersList] = useState([]);
  const [familyMembers, setFamilyMembers] = useState({
    relationshipId: "",
    farmerFamilyName: "",
  });

  const [data, setData] = useState({
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

    setFamilyMembersList([]);
    setFarmerLandList([]);
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
              "http://13.200.62.144:8000/farmer-registration/v1/farmer/get-farmer-details-by-fruits-id-or-farmer-number-or-mobile-number",
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

              setFarmerLandList((prev) => [...prev, ...modified]);
            })
            .catch((error) => {});
        }
      })
      .catch((error) => {});
  };

  // Try 3
  // const search = () => {
  //   axios
  //     .post(baseURL2 + `farmer/get-farmer-details-by-fruits-id-test`, data, {
  //       headers: _header,
  //     })
  //     .then((response) => {
  //       if (!response.data.content.isFruitService) {
  //         const farmerId = response.data.content.farmerResponse.farmerId;
  //         navigate(`/seriui/stake-holder-edit/${farmerId}`);
  //       } else {
  //         axios
  //           .post('http://13.200.62.144:8000/farmer-registration/fuits-api/get-farmer-by-fid',farmerId, {
  //             headers: _header,
  //           })
  //           .then((result) => {
  //             if (result.data.StatusCode === 1 && result.data.StatusText === "Success") {
  //               const farmerData = result.data;
  //               // console.log("hello",farmerData);

  //               setData(prevData => ({
  //                 ...prevData,

  //                 fruitsId: farmerData.FarmerID,
  //                 firstName:farmerData.Name,
  //                 middleName:farmerData.FatherName,
  //                 genderId: farmerData.Gender === "Male" ? 1 : 2,
  //               }));

  //               if (farmerData.PhysicallyChallenged === "No") {
  //                 setData(prevData => ({
  //                   ...prevData,
  //                   differentlyAbled: false,
  //                 }));
  //               }

  //               axios.post(baseURL + 'caste/get-by-title', { caste: farmerData.Caste }, {
  //                 headers: _header,
  //               })
  //               .then(casteResponse => {
  //                 const _id = casteResponse.data.content.id;
  //                 setData(prevData => ({
  //                   ...prevData,
  //                   casteId: _id,
  //                 }));
  //               })
  //               .catch(casteError => {

  //               });
  //             }
  //           })
  //           .catch(error => {

  //           });
  //       }
  //     })
  //     .catch(error => {

  //     });
  // };

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
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidatedFamilyMembers(true);
    } else {
      e.preventDefault();
      setFamilyMembersList((prev) => [...prev, familyMembers]);
      setFamilyMembers({
        relationshipId: "",
        farmerFamilyName: "",
      });
      setShowModal(false);
      setValidatedFamilyMembers(false);
    }
    // e.preventDefault();
  };

  const handleDeleteFamilyMembers = (i) => {
    setFamilyMembersList((prev) => {
      const newArray = prev.filter((item, place) => place !== i);
      return newArray;
    });
  };

  const handleShowModal1 = () => setShowModal1(true);
  const handleCloseModal1 = () => setShowModal1(false);

  const [fmId, setFmId] = useState();
  const handleGetFm = (i) => {
    setFamilyMembers(familyMembersList[i]);
    setShowModal1(true);
    setFmId(i);
  };

  // const handleUpdateFm = (i, changes) => {
  //   setFamilyMembersList((prev) =>
  //     prev.map((item, ix) => {
  //       if (ix === i) {
  //         return { ...item, ...changes };
  //       }
  //       return item;
  //     })
  //   );
  //   setShowModal1(false);
  //   setFamilyMembers({
  //     relationshipId: "",
  //     farmerFamilyName: "",
  //   });
  // };
  const handleUpdateFm = (e, i, changes) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidatedFamilyMembersEdit(true);
    } else {
      e.preventDefault();
      // setFamilyMembersList((prev) => [...prev, familyMembers]);
      // setFamilyMembers({
      //   relationshipId: "",
      //   farmerFamilyName: "",
      // });
      // setShowModal(false);
      // setValidatedFamilyMembers(false);

      setFamilyMembersList((prev) =>
        prev.map((item, ix) => {
          if (ix === i) {
            return { ...item, ...changes };
          }
          return item;
        })
      );
      setShowModal1(false);
      setValidatedFamilyMembersEdit(false);
      setFamilyMembers({
        relationshipId: "",
        farmerFamilyName: "",
      });
    }
  };

  const handleFMInputs = (e) => {
    const { name, value } = e.target;
    setFamilyMembers({ ...familyMembers, [name]: value });
  };

  const [farmerLandList, setFarmerLandList] = useState([]);
  const [farmerLand, setFarmerLand] = useState({
    categoryNumber: "",
    landOwnershipId: "",
    soilTypeId: "",
    hissa: "",
    mulberrySourceId: "",
    mulberryArea: "",
    mulberryVarietyId: "",
    plantationDate: "",
    plantationTypeId: "",
    irrigationSourceId: "",
    irrigationTypeId: "",
    rearingHouseDetails: "",
    roofTypeId: "",
    silkWormVarietyId: "",
    rearingCapacityCrops: "",
    rearingCapacityDlf: "",
    subsidyAvailed: "",
    subsidyId: "",
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

  const handleShowModal2 = () => {
    setFarmerLand({
      categoryNumber: "",
      landOwnershipId: "",
      soilTypeId: "",
      hissa: "",
      mulberrySourceId: "",
      plantationTypeId: "",
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
      subsidyId: "",
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
    setShowModal2(true);
  };
  const handleCloseModal2 = () => setShowModal2(false);

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
        plantationDate: "2023-11-07T12:12:27.400+00:00",
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
      });
      setShowModal2(false);
      setValidatedFarmerLand(false);
    }
  };

  const handleDeleteFarmerLand = (i) => {
    setFarmerLandList((prev) => {
      const newArray = prev.filter((item, place) => place !== i);
      return newArray;
    });
  };

  const handleShowModal3 = () => setShowModal3(true);
  const handleCloseModal3 = () => setShowModal3(false);

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
        plantationDate: "2023-11-07T12:12:27.400+00:00",
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
      });
    }
  };

  const handleFLInputs = (e) => {
    const { name, value } = e.target;
    setFarmerLand({ ...farmerLand, [name]: value });
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

  const handleShowModal4 = () => setShowModal4(true);
  const handleCloseModal4 = () => setShowModal4(false);

  const handleAddFarmerAddress = (e) => {
    if (farmerAddressList.length) {
      if (farmerAddress.defaultAddress) {
        setFarmerAddressList((prev) =>
          prev.map((item) => {
            if (item.defaultAddress) {
              return { ...item, defaultAddress: false };
            }
            return item;
          })
        );
      }
    }
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidatedFarmerAddress(true);
    } else {
      e.preventDefault();
      setFarmerAddressList((prev) => [...prev, farmerAddress]);
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
      setShowModal4(false);
      setValidatedFarmerAddress(false);
    }
    // e.preventDefault();
  };

  const handleShowModal5 = () => setShowModal5(true);
  const handleCloseModal5 = () => setShowModal5(false);

  const [faId, setFaId] = useState();
  const handleGetFa = (i) => {
    setFarmerAddress(farmerAddressList[i]);
    setShowModal5(true);
    setFaId(i);
  };

  // const handleUpdateFa = (i, changes) => {
  //   setFarmerAddressList((prev) =>
  //     prev.map((item, ix) => {
  //       if (ix === i) {
  //         return { ...item, ...changes };
  //       }
  //       return item;
  //     })
  //   );
  //   setShowModal5(false);
  //   setFarmerAddress({
  //     stateId: "",
  //     districtId: "",
  //     talukId: "",
  //     hobliId: "",
  //     villageId: "",
  //     addressText: "",
  //     pincode: "",
  //     defaultAddress: true,
  //   });
  // };

  //   const handleUpdateFa = (i, changes) => {
  //   if(farmerAddressList.length){
  //     if(farmerAddress.defaultAddress){
  //       setFarmerAddressList((prev)=>
  //       prev.map((item)=>{
  //         if(item.defaultAddress){
  //           return {...item,defaultAddress:false};
  //         }
  //         return item;
  //       })
  //       );
  //     }
  //   }
  //   setShowModal5(false);
  //   setFarmerAddress({
  //     stateId: "",
  //     districtId: "",
  //     talukId: "",
  //     hobliId: "",
  //     villageId: "",
  //     addressText: "",
  //     pincode: "",
  //     defaultAddress:  true,
  //   });
  // };

  const handleUpdateFa = (e, i, changes) => {
    if (farmerAddressList.length) {
      if (changes.defaultAddress) {
        setFarmerAddressList((prev) =>
          prev.map((item) => ({ ...item, defaultAddress: false }))
        );
      }
      const form = e.currentTarget;
      if (form.checkValidity() === false) {
        e.preventDefault();
        e.stopPropagation();
        setValidatedFarmerAddressEdit(true);
      } else {
        e.preventDefault();

        setFarmerAddressList((prev) => [
          ...prev.slice(0, i),
          { ...prev[i], ...changes },
          ...prev.slice(i + 1),
        ]);
      }

      setShowModal5(false);
      setValidatedFarmerAddressEdit(false);
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
    }
  };

  const handleDeleteFarmerAddress = (i) => {
    setFarmerAddressList((prev) => {
      const newArray = prev.filter((item, place) => place !== i);
      return newArray;
    });
  };

  const handleFarmerAddressInputs = (e) => {
    const { name, value } = e.target;
    setFarmerAddress({ ...farmerAddress, [name]: value });
  };

  const handleCheckBox = (e) => {
    setFarmerAddress({ ...farmerAddress, defaultAddress: e.target.checked });
  };

  const [bank, setBank] = useState({
    accountImagePath: "",
    farmerId: "",
    farmerBankName: "",
    farmerBankAccountNumber: "",
    farmerBankBranchName: "",
    farmerBankIfscCode: "",
  });

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

  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      // event.stopPropagation();
      api
        .post(baseURL2 + `farmer/add`, data)
        .then((response) => {
          const farmerId = response.data.content.farmerId;
          if (response.data.content.error) {
            saveFarmerError(response.data.content.error_description);
          }
          // postDataBankAccount

          if (farmerId) {
            api
              .post(
                baseURL2 + `farmer-bank-account/add`,
                { ...bank, farmerId }
                // {
                //   headers: _header,
                // }
              )
              .then((response) => {
                if (response.data.content.farmerBankAccountId) {
                  const bankId = response.data.content.farmerBankAccountId;
                  handleFileDocumentUpload(bankId);
                }
                if (response.data.content.error) {
                  const bankError = response.data.content.error_description;
                  saveFarmerError(bankError);
                } else {
                  saveSuccess();
                  setBank({
                    accountImagePath: "",
                    farmerId: "",
                    farmerBankName: "",
                    farmerBankAccountNumber: "",
                    farmerBankBranchName: "",
                    farmerBankIfscCode: "",
                  });
                }
              })
              .catch((err) => {
                saveError(err.response.data.validationErrors);
              });

            if (familyMembersList.length > 0) {
              familyMembersList.forEach((list) => {
                const updatedFM = {
                  ...list,
                  farmerId: farmerId,
                };
                api
                  .post(baseURL2 + `farmer-family/add`, updatedFM)
                  .then((response) => {
                    if (response.data.content.error) {
                      saveFarmerError(response.data.content.error_description);
                    } else {
                      saveSuccess();
                      setFamilyMembers([]);
                    }
                  })
                  .catch((err) => {
                    saveError(err.response.data.validationErrors);
                  });
              });
            }

            if (farmerLandList.length > 0) {
              farmerLandList.forEach((list) => {
                const updatedFL = {
                  ...list,
                  farmerId: farmerId,
                };
                api
                  .post(baseURL2 + `farmer-land-details/add`, updatedFL)
                  .then((response) => {
                    saveSuccess();
                    setFarmerLandList([]);
                  })
                  .catch((err) => {
                    saveError(err.response.data.validationErrors);
                  });
              });
            }

            if (farmerAddressList.length > 0) {
              farmerAddressList.forEach((list) => {
                const updatedFarmerAddress = {
                  ...list,
                  farmerId: farmerId,
                };
                api
                  .post(baseURL2 + `farmer-address/add`, updatedFarmerAddress)
                  .then((response) => {
                    saveSuccess();
                    setFarmerAddressList([]);
                  })
                  .catch((err) => {
                    saveError(err.response.data.validationErrors);
                  });
              });
            }

            handleFileUpload(farmerId);
          }
        })
        .catch((err) => {
          // setData({});
          saveError(err.response.data.validationErrors);
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

  // // to get Programs
  // const [programListData, setProgramListData] = useState([]);

  // const getProgramList = () => {
  //   api
  //     .get(baseURL + `scProgram/get-all`)
  //     .then((response) => {
  //       setProgramListData(response.data.content.scProgram);
  //     })
  //     .catch((err) => {
  //       setProgramListData([]);
  //     });
  // };

  // useEffect(() => {
  //   getProgramList();
  // }, []);

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

  useEffect(() => {
    if (farmerAddress.hobliId) {
      console.log("Effect triggered with hobliId:", farmerAddress.hobliId);
      getAddressVillageList(farmerAddress.hobliId);
    }
  }, [farmerAddress.hobliId]);

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    }).then(() => {
      navigate("/seriui/stake-holder-list");
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

  // subsidy
  const handleSubsidyOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setFarmerLand({
      ...farmerLand,
      subsidyId: chooseId,
      subsidyName: chooseName,
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

    // if(chooseName){
    //   setFarmerLand({
    //     ...farmerLand,
    //     stateId: chooseId,
    //     stateName: chooseName,
    //   });
    // }else{
    //   setFarmerLand({
    //     ...farmerLand,
    //     stateId: chooseId
    //   });
    // }
  };

  // console.log(stateNameLD);

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
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-1 ">
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
                          placeholder={t("Enter FRUITS ID")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Fruits ID is required.
                        </Form.Control.Feedback>
                      </Col>
                      <Col sm={2}>
                        <Button
                          type="button"
                          variant="primary"
                          onClick={search}
                        >
                          {t("search")}
                        </Button>
                      </Col>
                      <Col sm={2}>
                        <Button
                          type="button"
                          variant="primary"
                          href="https://fruits.karnataka.gov.in/OnlineUserLogin.aspx"
                          target="_blank"
                          // onClick={search}
                        >
                          Generate FRUITS ID
                        </Button>
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

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
                            readOnly
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
                        <Form.Label>Caste</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="casteId"
                            value={data.casteId}
                            onChange={handleInputs}
                            disabled
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
                    </Col>

                    <Col lg="4">
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
                      <Form.Group className="form-group mt-3">
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
                            disabled
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
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="rid">
                          {t("farmer_number")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="farmerNumber"
                            name="farmerNumber"
                            value={data.farmerNumber}
                            onChange={handleInputs}
                            type="text"
                            // placeholder={t("enter_farmer_number")}
                            placeholder="eg: TTH00001"
                            required
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
                              <option 
                                key={list.farmerTypeId} 
                                value={list.farmerTypeId}
                                >
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
                            {educationListData.map((list) => (
                              <option key={list.id} value={list.id}>
                                {list.name}
                              </option>
                            ))}
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

      <Modal show={showModal} onHide={handleCloseModal} size="xl">
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
                      value={`${familyMembers.relationshipId}_${familyMembers.relationshipName}`}
                      // value={familyMembers.relationshipId}
                      onChange={handleRelationshipOption}
                      onBlur={() => handleRelationshipOption}
                      required
                      isInvalid={
                        familyMembers.relationshipId === undefined ||
                        familyMembers.relationshipId === "0"
                      }
                    >
                      <option value="">Select Relationship</option>
                      {relationshipListData.map((list) => (
                        <option
                          key={list.relationshipId}
                          value={`${list.relationshipId}_${list.relationshipName}`}
                        >
                          {list.relationshipName}
                        </option>
                      ))}
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

      <Modal show={showModal1} onHide={handleCloseModal1} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>{t("edit")} Family Members</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Form action="#"> */}
          <Form
            noValidate
            validated={validatedFamilyMembersEdit}
            onSubmit={(e) => handleUpdateFm(e, fmId, familyMembers)}
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
                      value={`${familyMembers.relationshipId}_${familyMembers.relationshipName}`}
                      onChange={handleRelationshipOption}
                      onBlur={() => handleRelationshipOption}
                      required
                      isInvalid={
                        familyMembers.relationshipId === undefined ||
                        familyMembers.relationshipId === "0"
                      }
                    >
                      <option value="">Select Relationship</option>
                      {relationshipListData.map((list) => (
                        <option
                          key={list.relationshipId}
                          value={`${list.relationshipId}_${list.relationshipName}`}
                        >
                          {list.relationshipName}
                        </option>
                      ))}
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
                    {/* <Button
                      variant="success"
                      onClick={() => handleUpdateFm(fmId, familyMembers)}
                      
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
                      {landOwnershipListData.map((list) => (
                        <option
                          key={list.landOwnershipId}
                          value={`${list.landOwnershipId}_${list.landOwnershipName}`}
                        >
                          {list.landOwnershipName}
                        </option>
                      ))}
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
                      {soilTypeListData.map((list) => (
                        <option
                          key={list.soilTypeId}
                          value={`${list.soilTypeId}_${list.soilTypeName}`}
                        >
                          {list.soilTypeName}
                        </option>
                      ))}
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
                      {mulberrySourceListData.map((list) => (
                        <option
                          key={list.mulberrySourceId}
                          value={`${list.mulberrySourceId}_${list.mulberrySourceName}`}
                        >
                          {list.mulberrySourceName}
                        </option>
                      ))}
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
                      {mulberryVarietyListData.map((list) => (
                        <option
                          key={list.mulberryVarietyId}
                          value={`${list.mulberryVarietyId}_${list.mulberryVarietyName}`}
                        >
                          {list.mulberryVarietyName}
                        </option>
                      ))}
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
                      {plantationTypeListData.map((list) => (
                        <option
                          key={list.plantationTypeId}
                          value={`${list.plantationTypeId}_${list.plantationTypeName}`}
                        >
                          {list.plantationTypeName}
                        </option>
                      ))}
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
                      {irrigationSourceListData.map((list) => (
                        <option
                          key={list.irrigationSourceId}
                          value={`${list.irrigationSourceId}_${list.irrigationSourceName}`}
                        >
                          {list.irrigationSourceName}
                        </option>
                      ))}
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
                      {irrigationTypeListData.map((list) => (
                        <option
                          key={list.irrigationTypeId}
                          value={`${list.irrigationTypeId}_${list.irrigationTypeName}`}
                        >
                          {list.irrigationTypeName}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Irrigation Type is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="rhd">
                    {t("Rearing House (In Sq ft)")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="rearingHouseDetails"
                      name="rearingHouseDetails"
                      value={farmerLand.rearingHouseDetails}
                      onChange={handleFLInputs}
                      type="text"
                      placeholder={t("enter_rearing_house_dimensions")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Rearing House (In Sq ft) is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    Rearing House Roof Type
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="roofTypeId"
                      value={`${farmerLand.roofTypeId}_${farmerLand.roofTypeName}`}
                      onChange={handleRoofTypeOption}
                      onBlur={() => handleRoofTypeOption}
                      required
                      isInvalid={
                        farmerLand.roofTypeId === undefined ||
                        farmerLand.roofTypeId === "0"
                      }
                    >
                      <option value="">Select Rearing House Roof Type</option>
                      {roofTypeListData.map((list) => (
                        <option
                          key={list.roofTypeId}
                          value={`${list.roofTypeId}_${list.roofTypeName}`}
                        >
                          {list.roofTypeName}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Roof Type is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    Silk Worm Variety<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="silkWormVarietyId"
                      value={`${farmerLand.silkWormVarietyId}_${farmerLand.silkWormVarietyName}`}
                      onChange={handleSilkWormVarietyOption}
                      onBlur={() => handleSilkWormVarietyOption}
                      required
                      isInvalid={
                        farmerLand.silkWormVarietyId === undefined ||
                        farmerLand.silkWormVarietyId === "0"
                      }
                    >
                      <option value="">Select Silk Worm Variety</option>
                      {silkWormVarietyListData.map((list) => (
                        <option
                          key={list.silkWormVarietyId}
                          value={`${list.silkWormVarietyId}_${list.silkWormVarietyName}`}
                        >
                          {list.silkWormVarietyName}
                        </option>
                      ))}
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
                          {stateListData.map((list) => (
                            <option key={list.stateId} value={list.stateId}>
                              {list.stateName}
                            </option>
                          ))}
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
                          {districtListData && districtListData.length
                            ? districtListData.map((list) => (
                                <option
                                  key={list.districtId}
                                  value={`${list.districtId}_${list.districtName}`}
                                >
                                  {list.districtName}
                                </option>
                              ))
                            : ""}
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
                          {talukListData && talukListData.length
                            ? talukListData.map((list) => (
                                <option
                                  key={list.talukId}
                                  value={`${list.talukId}_${list.talukName}`}
                                >
                                  {list.talukName}
                                </option>
                              ))
                            : ""}
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
                          {hobliListData && hobliListData.length
                            ? hobliListData.map((list) => (
                                <option
                                  key={list.hobliId}
                                  value={`${list.hobliId}_${list.hobliName}`}
                                >
                                  {list.hobliName}
                                </option>
                              ))
                            : ""}
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
                          {villageListData && villageListData.length
                            ? villageListData.map((list) => (
                                <option
                                  key={list.villageId}
                                  value={`${list.villageId}_${list.villageName}`}
                                >
                                  {list.villageName}
                                </option>
                              ))
                            : ""}
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
                      {landOwnershipListData.map((list) => (
                        <option
                          key={list.landOwnershipId}
                          value={`${list.landOwnershipId}_${list.landOwnershipName}`}
                        >
                          {list.landOwnershipName}
                        </option>
                      ))}
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
                      {soilTypeListData.map((list) => (
                        <option
                          key={list.soilTypeId}
                          value={`${list.soilTypeId}_${list.soilTypeName}`}
                        >
                          {list.soilTypeName}
                        </option>
                      ))}
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
                      {mulberrySourceListData.map((list) => (
                        <option
                          key={list.mulberrySourceId}
                          value={`${list.mulberrySourceId}_${list.mulberrySourceName}`}
                        >
                          {list.mulberrySourceName}
                        </option>
                      ))}
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
                      {mulberryVarietyListData.map((list) => (
                        <option
                          key={list.mulberryVarietyId}
                          value={`${list.mulberryVarietyId}_${list.mulberryVarietyName}`}
                        >
                          {list.mulberryVarietyName}
                        </option>
                      ))}
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
                      {plantationTypeListData.map((list) => (
                        <option
                          key={list.plantationTypeId}
                          value={`${list.plantationTypeId}_${list.plantationTypeName}`}
                        >
                          {list.plantationTypeName}
                        </option>
                      ))}
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
                      {irrigationSourceListData.map((list) => (
                        <option
                          key={list.irrigationSourceId}
                          value={`${list.irrigationSourceId}_${list.irrigationSourceName}`}
                        >
                          {list.irrigationSourceName}
                        </option>
                      ))}
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
                      {irrigationTypeListData.map((list) => (
                        <option
                          key={list.irrigationTypeId}
                          value={`${list.irrigationTypeId}_${list.irrigationTypeName}`}
                        >
                          {list.irrigationTypeName}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Irrigation Type is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="rhd">
                    {t("Rearing House (In Sq ft)")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="rearingHouseDetails"
                      name="rearingHouseDetails"
                      value={farmerLand.rearingHouseDetails}
                      onChange={handleFLInputs}
                      type="text"
                      placeholder={t("enter_rearing_house_dimensions")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Rearing House (In Sq ft) is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    Rearing House Roof Type
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="roofTypeId"
                      value={`${farmerLand.roofTypeId}_${farmerLand.roofTypeName}`}
                      onChange={handleRoofTypeOption}
                      onBlur={() => handleRoofTypeOption}
                      required
                      isInvalid={
                        farmerLand.roofTypeId === undefined ||
                        farmerLand.roofTypeId === "0"
                      }
                    >
                      <option value="">Select Rearing House Roof Type</option>
                      {roofTypeListData.map((list) => (
                        <option
                          key={list.roofTypeId}
                          value={`${list.roofTypeId}_${list.roofTypeName}`}
                        >
                          {list.roofTypeName}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Roof Type is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    Silk Worm Variety<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="silkWormVarietyId"
                      value={`${farmerLand.silkWormVarietyId}_${farmerLand.silkWormVarietyName}`}
                      onChange={handleSilkWormVarietyOption}
                      onBlur={() => handleSilkWormVarietyOption}
                      required
                      isInvalid={
                        farmerLand.silkWormVarietyId === undefined ||
                        farmerLand.silkWormVarietyId === "0"
                      }
                    >
                      <option value="">Select Silk Worm Variety</option>
                      {silkWormVarietyListData.map((list) => (
                        <option
                          key={list.silkWormVarietyId}
                          value={`${list.silkWormVarietyId}_${list.silkWormVarietyName}`}
                        >
                          {list.silkWormVarietyName}
                        </option>
                      ))}
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
                        />
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
                          {stateListData.map((list) => (
                            <option key={list.stateId} value={list.stateId}>
                              {list.stateName}
                            </option>
                          ))}
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
                          {districtListData && districtListData.length
                            ? districtListData.map((list) => (
                                <option
                                  key={list.districtId}
                                  value={`${list.districtId}_${list.districtName}`}
                                >
                                  {list.districtName}
                                </option>
                              ))
                            : ""}
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
                          {talukListData && talukListData.length
                            ? talukListData.map((list) => (
                                <option
                                  key={list.talukId}
                                  value={`${list.talukId}_${list.talukName}`}
                                >
                                  {list.talukName}
                                </option>
                              ))
                            : ""}
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
                          {hobliListData && hobliListData.length
                            ? hobliListData.map((list) => (
                                <option
                                  key={list.hobliId}
                                  value={`${list.hobliId}_${list.hobliName}`}
                                >
                                  {list.hobliName}
                                </option>
                              ))
                            : ""}
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
                          {villageListData && villageListData.length
                            ? villageListData.map((list) => (
                                <option
                                  key={list.villageId}
                                  value={`${list.villageId}_${list.villageName}`}
                                >
                                  {list.villageName}
                                </option>
                              ))
                            : ""}
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
                      {addressdistrictListData && addressdistrictListData.length
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
                      {addressVillageListData && addressVillageListData.length
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
                      readOnly
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
                <Form.Group as={Row} className="form-group mt-4">
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

      <Modal show={showModal5} onHide={handleCloseModal5} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Edit Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Form action="#"> */}
          <Form
            noValidate
            validated={validatedFarmerAddressEdit}
            onSubmit={(e) => handleUpdateFa(e, faId, farmerAddress)}
          >
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
                      <option value="0">Select State</option>
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
                      State Name is required.
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
                      {addressdistrictListData && addressdistrictListData.length
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
                      {addressVillageListData && addressVillageListData.length
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
                <Form.Group as={Row} className="form-group mt-4">
                  <Col sm={1}>
                    <Form.Check
                      type="checkbox"
                      id="defaultAddress"
                      checked={farmerAddress.defaultAddress}
                      onChange={handleCheckBox}
                      // defaultChecked
                    />
                  </Col>
                  <Form.Label column sm={11} className="mt-n2">
                    {t("make_this_address_default")}
                  </Form.Label>
                </Form.Group>
              </Col>

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2">
                  <div className="gap-col">
                    {/* <Button
                      variant="success"
                      onClick={() => handleUpdateFa(faId, farmerAddress)}
                    > */}
                    <Button type="submit" variant="success">
                      Update
                    </Button>
                  </div>
                  {/* <div className="gap-col">
                    <Button variant="danger" onClick={handleCloseModal2}>
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

export default StakeHolderRegister;
