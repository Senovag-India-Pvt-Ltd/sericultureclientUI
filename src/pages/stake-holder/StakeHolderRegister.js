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
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION_FRUITS;

function StakeHolderRegister() {

  const [isSaving, setIsSaving] = useState(false);
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
    dob: null,
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
    tscMasterId: "",
  });

  const [bankCheck, setBankCheck] = useState("This field is required");
  const [searchValidated, setSearchValidated] = useState(false);
  const [disable, setDisable] = useState(false);
  const clear = (event) => {
    setDisable(false);
    setData({
      farmerNumber: "",
      fruitsId: "",
      firstName: "",
      middleName: "",
      lastName: "",
      dob: null,
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
      tscMasterId: "",
    });

    setFamilyMembersList([]);
    setFarmerLandList([]);
    setFarmerAddressList([]);
    setVbAccountList([]);
    setVbLock(false);
    setBank({
      accountImagePath: "",
      farmerId: "",
      farmerBankName: "",
      farmerBankAccountNumber: "",
      reenterFarmerBankAccountNumber: "",
      farmerBankBranchName: "",
      farmerBankIfscCode: "",
      lock: "",
    });
    setSearchValidated(false);
  };

  const resetForm = () => {
    clear();
    setValidated(false);
    setImage("");
    setDocumentFile("");
  };

  //  console.log("data",data.photoPath);
  // const [disable, setDisable] = useState(false);

  const search = (event) => {
    setData({
      farmerNumber: "",
      fruitsId: "",
      firstName: "",
      middleName: "",
      lastName: "",
      dob: null,
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
      tscMasterId: "",
    });

    setFamilyMembersList([]);
    setFarmerLandList([]);
    setFarmerAddressList([]);
    setBank({
      accountImagePath: "",
      farmerId: "",
      farmerBankName: "",
      farmerBankAccountNumber: "",
      reenterFarmerBankAccountNumber: "",
      farmerBankBranchName: "",
      farmerBankIfscCode: "",
      lock: "",
    });
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
                { fruitsId: data.fruitsId },
                // {
                //   headers: _header,
                // }
              )
              .then((result) => {
                if (!result.data.content.error) {
                  setData((prev) => ({
                    ...prev,
                    ...result.data.content.farmerResponse,
                  }));
                  setFarmerAddressList((prev) => [
                    ...prev,
                    ...result.data.content.farmerAddressList,
                  ]);

                  const modified =
                    result.data.content.farmerLandDetailsDTOList.map(
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
                      },
                    );
                  // console.log(modified);FF

                  setFarmerLandList((prev) => [...prev, ...modified]);
                } else {
                  searchError(result.data.content.error_description);
                }
              })
              .catch((error) => {});
          }
        })
        .catch((error) => {});
    }
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
  const [showModalVb, setShowModalVb] = useState(false);
  const [showModalVb2, setShowModalVb2] = useState(false);

  const [vbLock, setVbLock] = useState(false);
  const [vbAccountList, setVbAccountList] = useState([]);
  const [vbAccount, setVbAccount] = useState({
    virtualAccountNumber: "",
    reenterVirtualAccountNumber: "",
    branchName: "",
    ifscCode: "",
    marketMasterId: "",
  });
  const [validatedVbAccount, setValidatedVbAccount] = useState(false);
  const [validatedVbAccountEdit, setValidatedVbAccountEdit] = useState(false);
  const [vbId, setVbId] = useState();

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
        }),
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
    landCode: "",
    districtCode: "",
    talukCode: "",
    hobliCode: "",
    villageCode: "",
  });

  // console.log("Farmer Land List", farmerLandList);

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
      landCode: "",
      districtCode: "",
      talukCode: "",
      hobliCode: "",
      villageCode: "",
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
        }),
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

  const handleFLInputs = (e) => {
    const { name, value } = e.target;
    setFarmerLand({ ...farmerLand, [name]: value });
  };

  // useEffect(() => {
  //   const now = new Date();
  //   const year = now.getFullYear();
  //   const month = String(now.getMonth() + 1).padStart(2, "0");
  //   const hours = String(now.getHours()).padStart(2, "0");
  //   const minutes = String(now.getMinutes()).padStart(2, "0");
  //   const seconds = String(now.getSeconds()).padStart(2, "0");
  //   const date = String(now.getDate()).padStart(2, "0");

  //   const timeString = hours + minutes + seconds + date + month + year;
  //   setData((prev) => ({ ...prev, farmerNumber: timeString }));
  // }, [data.fruitsId]);

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
          }),
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
          prev.map((item) => ({ ...item, defaultAddress: false })),
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
  const handleBankCheckBox = (e) => {
    setBank({ ...bank, lock: e.target.checked });
  };
  const handleVbLockCheckBox = (e) => {
    setVbLock(e.target.checked);
  };

  const handleVbShowModal = () => setShowModalVb(true);
  const handleVbCloseModal = () => setShowModalVb(false);

  const handleVbAdd = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidatedVbAccount(true);
    } else {
      e.preventDefault();
      if (vbAccount.ifscCode.length !== 11) {
        Swal.fire({ icon: "warning", title: t("Invalid IFSC Code"), text: t("IFSC Code must be exactly 11 characters.") });
        return;
      }
      if (vbAccount.virtualAccountNumber !== vbAccount.reenterVirtualAccountNumber) {
        Swal.fire({ icon: "warning", title: t("Account Number Mismatch"), text: t("Virtual Account Number and Re-enter Account Number do not match.") });
        return;
      }
      setVbAccountList((prev) => [...prev, { ...vbAccount, lock: vbLock }]);
      setVbAccount({ virtualAccountNumber: "", reenterVirtualAccountNumber: "", branchName: "", ifscCode: "", marketMasterId: "" });
      setShowModalVb(false);
      setValidatedVbAccount(false);
    }
  };

  const handleVbDelete = (i) => {
    setVbAccountList((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleVbGet = (i) => {
    setVbAccount(vbAccountList[i]);
    setShowModalVb2(true);
    setVbId(i);
  };

  const handleVbUpdate = (e, i, changes) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidatedVbAccountEdit(true);
    } else {
      e.preventDefault();
      if (vbAccount.ifscCode.length !== 11) return;
      setVbAccountList((prev) =>
        prev.map((item, ix) => (ix === i ? { ...item, ...changes } : item))
      );
      setShowModalVb2(false);
      setValidatedVbAccountEdit(false);
      setVbAccount({ virtualAccountNumber: "", branchName: "", ifscCode: "", marketMasterId: "" });
    }
  };

  const handleVbInputs = (e) => {
    const { name, value } = e.target;
    if (name === "ifscCode") {
      if (value.length !== 11) {
        e.target.classList.add("is-invalid");
        e.target.classList.remove("is-valid");
      } else {
        e.target.classList.remove("is-invalid");
        e.target.classList.add("is-valid");
      }
    }
    if (name === "virtualAccountNumber") {
      if (value !== vbAccount.reenterVirtualAccountNumber && vbAccount.reenterVirtualAccountNumber) {
        e.target.classList.add("is-invalid");
      } else {
        e.target.classList.remove("is-invalid");
        if (value) e.target.classList.add("is-valid");
      }
    }
    if (name === "reenterVirtualAccountNumber") {
      if (value !== vbAccount.virtualAccountNumber) {
        e.target.classList.add("is-invalid");
      } else {
        e.target.classList.remove("is-invalid");
        if (value) e.target.classList.add("is-valid");
      }
    }
    const formatted = (name === "branchName" || name === "ifscCode") ? value.toUpperCase() : value;
    setVbAccount({ ...vbAccount, [name]: formatted });
  };

  const handleVbCloseModal2 = () => {
    setShowModalVb2(false);
    setVbAccount({ virtualAccountNumber: "", branchName: "", ifscCode: "", marketMasterId: "" });
  };

  const handleMarketOption = (e) => {
    const [chooseId, chooseName] = e.target.value.split("_");
    setVbAccount({ ...vbAccount, marketMasterId: chooseId, marketMasterName: chooseName });
  };

  const [bank, setBank] = useState({
    accountImagePath: "",
    farmerId: "",
    farmerBankName: "",
    farmerBankAccountNumber: "",
    reenterFarmerBankAccountNumber: "",
    farmerBankBranchName: "",
    farmerBankIfscCode: "",
    lock: "",
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

    if (name === "fruitsId" && (value.length < 16 || value.length > 16)) {
      e.target.classList.add("is-invalid");
      e.target.classList.remove("is-valid");
    } else if (name === "fruitsId" && value.length === 16) {
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

    if (
      name === "farmerBankAccountNumber" ||
      name === "reenterFarmerBankAccountNumber"
    ) {
      if (name === "farmerBankAccountNumber") {
        if (value !== bank.reenterFarmerBankAccountNumber) {
          e.target.classList.add("is-invalid");
          setBankCheck("Bank Account Mismatch");
          if (!bank.reenterFarmerBankAccountNumber) {
            document
              .getElementById("reenterFarmerBankAccountNumber")
              .classList.remove("is-invalid");
            e.target.classList.remove("is-invalid");
          }

        } else {
          e.target.classList.remove("is-invalid");
          e.target.classList.add("is-valid");
          document
            .getElementById("reenterFarmerBankAccountNumber")
            .classList.remove("is-invalid");
        }
      } else {
        if (value !== bank.farmerBankAccountNumber) {
          e.target.classList.add("is-invalid");
          setBankCheck("Bank Account Mismatch");
          if (!bank.farmerBankAccountNumber) {
            document
              .getElementById("farmerBankAccountNumber")
              .classList.remove("is-invalid");
            e.target.classList.remove("is-invalid");
          }
        } else {
          e.target.classList.remove("is-invalid");
          e.target.classList.add("is-valid");
          document
            .getElementById("farmerBankAccountNumber")
            .classList.remove("is-invalid");
        }
      }
    }

    if (name === "farmerBankIfscCode") {
      setBank({ ...bank, [name]: value.toUpperCase() });
    } else if (name === "farmerBankBranchName") {
      setBank({ ...bank, [name]: value.toUpperCase() });
    } else if (name === "farmerBankName") {
      setBank({ ...bank, [name]: value.toUpperCase() });
    } else {
      setBank({ ...bank, [name]: value });
    }
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
  // Old Postdata Commented
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
  //       .post(baseURL2 + `farmer/add`, data)
  //       .then((response) => {
  //         const farmerId = response.data.content.farmerId;
  //         if (response.data.content.error) {
  //           saveFarmerError(response.data.content.error_description);
  //         }
  //         // postDataBankAccount

  //         if (farmerId) {
  //           api
  //             .post(
  //               baseURL2 + `farmer-bank-account/add`,
  //               { ...bank, farmerId }
  //               // {
  //               //   headers: _header,
  //               // }
  //             )
  //             .then((response) => {
  //               if (response.data.content.farmerBankAccountId) {
  //                 const bankId = response.data.content.farmerBankAccountId;
  //                 handleFileDocumentUpload(bankId);
  //               }
  //               if (response.data.content.error) {
  //                 const bankError = response.data.content.error_description;
  //                 saveFarmerError(bankError);
  //               } else {
  //                 saveSuccess();
  //                 setBank({
  //                   accountImagePath: "",
  //                   farmerId: "",
  //                   farmerBankName: "",
  //                   farmerBankAccountNumber: "",
  //                   farmerBankBranchName: "",
  //                   farmerBankIfscCode: "",
  //                 });
  //               }
  //             })
  //             .catch((err) => {
  //               if (
  //                 Object.keys(err.response.data.validationErrors).length > 0
  //               ) {
  //                 saveError(err.response.data.validationErrors);
  //               }
  //             });

  //           if (familyMembersList.length > 0) {
  //             familyMembersList.forEach((list) => {
  //               const updatedFM = {
  //                 ...list,
  //                 farmerId: farmerId,
  //               };
  //               api
  //                 .post(baseURL2 + `farmer-family/add`, updatedFM)
  //                 .then((response) => {
  //                   if (response.data.content.error) {
  //                     saveFarmerError(response.data.content.error_description);
  //                   } else {
  //                     saveSuccess();
  //                     setFamilyMembers([]);
  //                   }
  //                 })
  //                 .catch((err) => {
  //                   if (
  //                     Object.keys(err.response.data.validationErrors).length > 0
  //                   ) {
  //                     saveError(err.response.data.validationErrors);
  //                   }
  //                 });
  //             });
  //           }

  //           if (farmerLandList.length > 0) {
  //             farmerLandList.forEach((list) => {
  //               const updatedFL = {
  //                 ...list,
  //                 farmerId: farmerId,
  //               };
  //               api
  //                 .post(baseURL2 + `farmer-land-details/add`, updatedFL)
  //                 .then((response) => {
  //                   saveSuccess();
  //                   setFarmerLandList([]);
  //                 })
  //                 .catch((err) => {
  //                   if (
  //                     Object.keys(err.response.data.validationErrors).length > 0
  //                   ) {
  //                     saveError(err.response.data.validationErrors);
  //                   }
  //                 });
  //             });
  //           }

  //           if (farmerAddressList.length > 0) {
  //             farmerAddressList.forEach((list) => {
  //               const updatedFarmerAddress = {
  //                 ...list,
  //                 farmerId: farmerId,
  //               };
  //               api
  //                 .post(baseURL2 + `farmer-address/add`, updatedFarmerAddress)
  //                 .then((response) => {
  //                   saveSuccess();
  //                   setFarmerAddressList([]);
  //                 })
  //                 .catch((err) => {
  //                   if (
  //                     Object.keys(err.response.data.validationErrors).length > 0
  //                   ) {
  //                     saveError(err.response.data.validationErrors);
  //                   }
  //                 });
  //             });
  //           }

  //           handleFileUpload(farmerId);
  //         }
  //       })
  //       .catch((err) => {
  //         // setData({});
  //         if (Object.keys(err.response.data.validationErrors).length > 0) {
  //           saveError(err.response.data.validationErrors);
  //         }
  //       });
  //     setValidated(true);
  //   }
  // };
  // Old Postdata Commented Close

  const postData = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    if (!data.fruitsId || data.fruitsId.length !== 16) {
      setValidated(true);
      Swal.fire({
        icon: "warning",
        title: "Invalid FRUITS ID",
        text: "FRUITS ID must be exactly 16 digits.",
      });
      return;
    }
    if (!data.mobileNumber || data.mobileNumber.length !== 10) {
      setValidated(true);
      Swal.fire({
        icon: "warning",
        title: "Invalid Mobile Number",
        text: "Mobile Number must be exactly 10 digits.",
      });
      return;
    }
    if (!bank.lock) {
      if (!bank.farmerBankIfscCode || bank.farmerBankIfscCode.length !== 11) {
        setValidated(true);
        Swal.fire({
          icon: "warning",
          title: "Invalid IFSC Code",
          text: "Bank IFSC Code must be exactly 11 characters.",
        });
        return;
      }
      if (bank.farmerBankAccountNumber !== bank.reenterFarmerBankAccountNumber) {
        setValidated(true);
        Swal.fire({
          icon: "warning",
          title: "Bank Account Number Mismatch",
          text: "Account Number and Re-enter Account Number do not match.",
        });
        return;
      }
    }

    if (farmerAddressList && farmerAddressList.length > 0) {
      if (
        !farmerAddressList[0].stateId &&
        !farmerAddressList[0].districtId &&
        !farmerAddressList[0].talukId &&
        !farmerAddressList[0].hobliId &&
        !farmerAddressList[0].villageId
      ) {
        Swal.fire({
          icon: "warning",
          title: "Edit or Add Farmer First Record!!!",
        });
        return;
      }
    }

    if (farmerLandList && farmerLandList.length <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Land Details is Mandatory!!!",
      });
      return;
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const date = String(now.getDate()).padStart(2, "0");
    const timeString = hours + minutes + seconds + date + month + year;
    const updatedFarmerData = {
      ...data,
      farmerNumber: timeString,
    };

    setIsSaving(true);
    try {
      const sendData = {
        farmerRequest: updatedFarmerData,
        farmerBankAccountRequest: bank,
        farmerAddressRequests: farmerAddressList,
        farmerFamilyRequestList: familyMembersList,
        farmerLandDetailsRequests: farmerLandList,
      };

      const response = await api.post(
        baseURL2 + `farmer/save-complete-farmer-details`,
        sendData
      );
      const farmerId = response.data.content.farmerId;
      const farmerBankAccountId = response.data.content.farmerBankAccountId;
      const farmerNumber = response.data.content.farmerNumber;
      if (response.data.content.error) {
        saveFarmerError(response.data.content.error_description);
      } else {
        if (data.photoPath && image) {
          await handleFileUpload(farmerId);
        }
        if (bank.accountImagePath && documentFile) {
          await handleFileDocumentUpload(farmerBankAccountId);
        }
        if (vbAccountList.length > 0) {
          for (const vb of vbAccountList) {
            await api.post(baseURL2 + `farmer-virtual-bank-account/add`, {
              ...vb,
              farmerId,
            });
          }
        }
        saveSuccess(farmerNumber);
      }
    } catch (err) {
      const validationErrors =
        err && err.response && err.response.data && err.response.data.validationErrors;
      if (validationErrors && Object.keys(validationErrors).length > 0) {
        saveError(validationErrors);
      } else {
        const serverMessage =
          (err && err.response && err.response.data && err.response.data.message) ||
          (err && err.message) ||
          "Something went wrong while saving. Please try again.";
        Swal.fire({
          icon: "error",
          title: "Save attempt was not successful",
          text: serverMessage,
        });
      }
    } finally {
      setIsSaving(false);
      setValidated(true);
    }
  };
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

  // to get Market
  const [marketMasterListData, setMarketMasterListData] = useState([]);

  const getMarketMasterList = () => {
    api
      .get(baseURL + `marketMaster/get-all`)
      .then((response) => {
        setMarketMasterListData(response.data.content.marketMaster);
      })
      .catch(() => {
        setMarketMasterListData([]);
      });
  };

  useEffect(() => {
    getMarketMasterList();
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
        farmerAddress.districtId,
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
  const saveSuccess = (farmerNumber) => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      text: `Farmer Number: ${farmerNumber}`,
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

  const searchError = (message) => {
    Swal.fire({
      icon: "warning",
      title: "Data not Found!!!",
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
  const [documentFile, setDocumentFile] = useState("");

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    setDocumentFile(file);
    setBank((prev) => ({ ...prev, accountImagePath: file.name }));
    // setPhotoFile(file);
  };

  // Upload Image to S3 Bucket
  const handleFileDocumentUpload = async (farmerBankAccountid) => {
    const parameters = `farmerBankAccountId=${farmerBankAccountid}`;
    try {
      const formData = new FormData();
      formData.append("multipartFile", documentFile);

      const response = await api.post(
        baseURL2 + `farmer-bank-account/upload-photo?${parameters}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
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
        },
      );
      console.log("File upload response:", response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  // Translation
  const { t, i18n } = useTranslation();

  return (
    <Layout title="Farmer Registration">
      <style>{stakeHolderFormStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("farmer_registration")}
              </Block.Title>
              <p className="sh-page-subtitle mb-0">
                {/* {t("Register a new farmer with personal, land, address and bank details")} */}
              </p>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/stake-holder-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/stake-holder-list"
                    className="btn btn-primary d-none d-md-inline-flex sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
              </ul>
            </Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        <Form noValidate validated={searchValidated} onSubmit={search}>
          <Card className="sh-search-card">
            <Card.Body>
              <Row className="g-gs">
                <Col lg="12">
                  <Form.Group as={Row} className="form-group">
                    <Form.Label column sm={1} className="sh-fruits-label">
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
                        readOnly={disable}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Fruits ID 16 Digits is required.
                      </Form.Control.Feedback>
                    </Col>
                    <Col sm={6}>
                      <div className="d-flex flex-wrap gap-2">
                        <Button type="submit" variant="primary">
                          {t("search")}
                        </Button>
                        <Button type="submit" variant="primary" onClick={clear}>
                          {t("Clear")}
                        </Button>
                        <Button
                          type="button"
                          variant="primary"
                          href="https://fruits.karnataka.gov.in/OnlineUserLogin.aspx"
                          target="_blank"
                          // onClick={search}
                        >
                          {t("Generate_FRUITS_ID")}
                        </Button>
                      </div>
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
                <Card.Header className="sh-section-header">
                  <Icon name="user" />
                  <span>{t("farmer_personal_information")}</span>
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
                              "enter_fathers_husbands_name_in_kannada",
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
                        <div className="form-control-wrap"> */}
                      {/* <DatePicker
                            selected={data.dob}
                            onChange={(date) => handleDateChange(date, "dob")}
                          /> */}
                      {/* <DatePicker
                            selected={data.dob}
                            onChange={(date) => handleDateChange(date, "dob")}
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            maxDate={new Date()}
                          />
                        </div>
                      </Form.Group> */}

                      <Form.Group className="form-group mt-3">
                        <Form.Label>{t("Gender")}</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="genderId"
                            value={data.genderId}
                            onChange={handleInputs}
                            disabled
                          >
                            <option value="">{t("select_gender")}</option>
                            <option value="1">{t("Male")}</option>
                            <option value="2">{t("Female")}</option>
                            <option value="3">{t("Third Gender")}</option>
                          </Form.Select>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label>
                          {t("Caste")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="casteId"
                            value={data.casteId}
                            onChange={handleInputs}
                            disabled
                          >
                            <option value="0">{t("select_Caste")}</option>
                            {casteListData.map((list) => (
                              <option key={list.id} value={list.id}>
                                {list.title}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {t("caste_is_required")}
                          </Form.Control.Feedback>
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
                            maxLength="10"
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

                      {/* <Form.Group className="form-group mt-3">
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
                      </Form.Group> */}

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
                        <Form.Label htmlFor="rcard">
                          {t("Aadhaar Number")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="aadhaarNumber"
                            name="aadhaarNumber"
                            value={data.aadhaarNumber}
                            // onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Aadhaar Number")}
                          />a
                        </div>
                      </Form.Group> */}

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
                          {t("farmer_type")}{" "}
                          <span className="text-danger">*</span>
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
                            <option value="">{t("select_farmer_type")} </option>
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
                            {t("select_farmer_type_is_required")}
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
                    </Col>

                    <Col lg="4">
                      {/* <Form.Group className="form-group">
                        <Form.Label htmlFor="rid">
                          {t("farmer_number")} */}
                      {/* <span className="text-danger">*</span> */}
                      {/* </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="farmerNumber"
                            name="farmerNumber"
                            value={data.farmerNumber}
                            onChange={handleInputs}
                            type="text"
                            // placeholder={t("enter_farmer_number")}
                            placeholder="eg: TTH00001"
                            // required
                          />
                          <Form.Control.Feedback type="invalid">
                            Farmer Number is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group> */}

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

                      <Form.Group className="form-group">
                        <Form.Label>
                          {t("education")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="educationId"
                            value={data.educationId}
                            onChange={handleInputs}
                          >
                            <option value="">{t("select_education")} </option>
                            {educationListData.map((list) => (
                              <option key={list.id} value={list.id}>
                                {i18n.language === "kn"
                                  ? list.educationNameInKannada
                                  : list.name}
                              </option>
                            ))}
                          </Form.Select>
                        </div>
                      </Form.Group>

                      {/* <Col lg="4"> */}
                      <Form.Group className="form-group mt-3">
                        <Form.Label>
                          {t("tsc")}
                          <span className="text-danger">*</span>
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
                            <option value="">{t("select_tsc")}</option>
                            {tscListData.map((list) => (
                              <option
                                key={list.tscMasterId}
                                value={list.tscMasterId}
                              >
                                {i18n.language === "kn"
                                  ? list.nameInKannada
                                  : list.name}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {t("tsc_is_required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                      {/* </Col> */}

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

                      {/* <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="photoPath">
                          {t("farmer_photo")} (PDF/jpg/png)(Max:5MB)
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
                      </Form.Group> */}
                      {/* <Form.Group className="form-group mt-3 d-flex justify-content-center">
                        {image ? (
                          <img
                            style={{ height: "100px", width: "100px" }}
                            src={URL.createObjectURL(image)}
                          />
                        ) : (
                          ""
                        )}
                      </Form.Group> */}
                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="photoPath">
                          {t("Farmer_Photo_(PDF/jpg/png)_(Max: 5MB)")}
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
                          <>
                            {image.type.startsWith("image/") ||
                            image.name.endsWith(".jpeg") ||
                            image.name.endsWith(".jpg") ||
                            image.name.endsWith(".png") ? (
                              <img
                                style={{
                                  height: "300px",
                                  width: "auto",
                                  objectFit: "cover",
                                }}
                                src={URL.createObjectURL(image)}
                                alt="Uploaded Image"
                              />
                            ) : image.type === "application/pdf" ? (
                              <embed
                                src={URL.createObjectURL(image)}
                                type="application/pdf"
                                width="300px"
                                height="300px"
                              />
                            ) : image.name.endsWith(".docx") ? (
                              <p>
                                Preview not available for .docx files. File
                                name: {image.name}
                              </p>
                            ) : (
                              <p>
                                Preview not available for this file type:{" "}
                                {image.name}
                              </p>
                            )}
                          </>
                        ) : (
                          <p>{t("No_File_Selected_Or_File_Was_Canceled")}</p>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Block>

            <Block className="mt-3">
              <Card>
                <Card.Header className="sh-section-header">
                  <Icon name="users" />
                  <span>{t("family_members")}</span>
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
                                  <th>{t("Action")}</th>
                                  <th>{t("Name")}</th>
                                  <th>{t("relationship")}</th>
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
                <Card.Header className="sh-section-header">
                  <Icon name="map-pin" />
                  <span>{t("address")}</span>
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
                                  <th>{t("Action")}</th>
                                  <th>{t("address")}</th>
                                  <th>{t("village")}</th>
                                  <th>{t("taluk")}</th>
                                  <th>{t("district")}</th>
                                  <th>{t("state")}</th>
                                  <th>{t("Default Address")}</th>
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
                                        {/* <Button
                                          variant="danger"
                                          size="sm"
                                          onClick={() =>
                                            handleDeleteFarmerAddress(i)
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
                <Card.Header className="sh-section-header">
                  <Icon name="map" />
                  <span>{t("farmer_land_details")}</span>
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
                                  <th>{t("Action")}</th>
                                  <th>{t("land_ownership")}</th>
                                  <th>{t("survey_number")}</th>
                                  <th>{t("plantation_type")}</th>
                                  <th>{t("state")}</th>
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
                <Card.Header className="sh-section-header">
                  <Icon name="cc" />
                  <span>{t("bank_account_details")}</span>
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
                            type="password"
                            autoComplete="new-password"
                            placeholder={t("enter_bank_account_number")}
                            required
                          />
                          <Form.Control.Feedback id="enter" type="invalid">
                            {bankCheck}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="reenterFarmerBankAccountNumber">
                          {t("reenter_bank_account_number")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="reenterFarmerBankAccountNumber"
                            name="reenterFarmerBankAccountNumber"
                            value={bank.reenterFarmerBankAccountNumber}
                            onChange={handleBankInputs}
                            type="password"
                            placeholder={t("reenter_bank_account_number")}
                            onPaste={(e) => e.preventDefault()}
                            onCopy={(e) => e.preventDefault()}
                            onCut={(e) => e.preventDefault()}
                            required
                          />
                          <Form.Control.Feedback id="reenter" type="invalid">
                            {bankCheck}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

            {/* <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="accountImagePath">
                          Upload Bank Passbook (PDF/jpg/png)(Max:5MB)
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
                      </Form.Group> */}

            <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="accountImagePath">
                          {t("upload_bank")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            type="file"
                            id="accountImagePath"
                            name="accountImagePath"
                            onChange={handleDocumentChange}
                          />
                        </div>
                      </Form.Group>

            {/* Preview section for uploaded file */}
            <Form.Group className="form-group mt-3 d-flex justify-content-center">
                        {documentFile ? (
                          <>
                            {documentFile.type.startsWith("image/") ||
                            documentFile.name.endsWith(".jpeg") ||
                            documentFile.name.endsWith(".jpg") ||
                            documentFile.name.endsWith(".png") ? (
                              <img
                                style={{
                                  height: "300px",
                                  width: "auto",
                                  objectFit: "cover",
                                }}
                                src={URL.createObjectURL(documentFile)}
                                alt="Uploaded Image"
                              />
                            ) : documentFile.type === "application/pdf" ? (
                              <embed
                                src={URL.createObjectURL(documentFile)}
                                type="application/pdf"
                                width="300px"
                                height="300px"
                              />
                            ) : (
                              <p>
                                Preview not available for this file type:{" "}
                                {documentFile.name}
                              </p>
                            )}
                          </>
                        ) : (
                          <p>No file selected or file was canceled.</p>
                        )}
                      </Form.Group>

            {/* <Form.Group className="form-group mt-3 d-flex justify-content-center">
                        {document ? (
                          <img
                            style={{ height: "100px", width: "100px" }}
                            src={URL.createObjectURL(document)}
                          />
                        ) : (
                          ""
                        )}
                      </Form.Group> */}
            </Col>

            <Col lg="6">
                      <Form.Group as={Row} className="form-group">
                        <Col sm={1}>
                          <Form.Check
                            type="checkbox"
                            id="lock"
                            checked={bank.lock}
                            onChange={handleBankCheckBox}
                            // defaultChecked
                          />
                        </Col>
                        <Form.Label column sm={11} className="mt-n1">
                          {t("Lock Bank Details")}
                        </Form.Label>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Block>

            <Block className="mt-3">
              <Card>
                <Card.Header className="sh-section-header">
                  <Icon name="wallet" />
                  <span>{t("Virtual Bank Account")}</span>
                </Card.Header>
                <Card.Body>
                  <Row className="g-gs mb-1">
                    <Col lg="6"></Col>
                    <Col lg="6">
                      <Form.Group className="form-group d-flex align-items-center justify-content-end gap g-3">
                        <div className="form-control-wrap">
                          <Button variant="primary" onClick={handleVbShowModal}>
                            <Icon name="plus" />
                            <span> {t("add")}</span>
                          </Button>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  {vbAccountList.length > 0 && (
                    <Row className="g-gs">
                      <Block>
                        <Card>
                          <div className="table-responsive">
                            <table className="table small">
                              <thead>
                                <tr style={{ backgroundColor: "#f1f2f7" }}>
                                  <th>{t("Action")}</th>
                                  <th>{t("Virtual Account Number")}</th>
                                  <th>{t("branch_name")}</th>
                                  <th>{t("ifsc_code")}</th>
                                  <th>{t("Market")}</th>
                                  <th>{t("Lock Status")}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {vbAccountList.map((item, i) => (
                                  <tr key={i}>
                                    <td>
                                      <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => handleVbGet(i)}
                                        disabled={item.lock}
                                        title={item.lock ? t("Account is locked and cannot be edited") : ""}
                                      >
                                        {t("edit")}
                                      </Button>
                                      <Button
                                        variant="danger"
                                        size="sm"
                                        className="ms-2"
                                        onClick={() => handleVbDelete(i)}
                                        disabled={item.lock}
                                        title={item.lock ? t("Account is locked and cannot be deleted") : ""}
                                      >
                                        {t("delete")}
                                      </Button>
                                    </td>
                                    <td>{item.virtualAccountNumber}</td>
                                    <td>{item.branchName}</td>
                                    <td>{item.ifscCode}</td>
                                    <td>{item.marketMasterName}</td>
                                    <td>
                                      {item.lock ? (
                                        <span style={{ color: "#e3496a", fontWeight: 600, fontSize: "0.75rem" }}>🔒 {t("Locked")}</span>
                                      ) : (
                                        <span style={{ color: "#1e8449", fontWeight: 600, fontSize: "0.75rem" }}>🔓 {t("Unlocked")}</span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </Card>
                      </Block>
                    </Row>
                  )}
                </Card.Body>
              </Card>
            </Block>

            <div className="gap-col mt-4">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSaving}
                    className="shadow-sm px-4 py-2"
                    style={{
                      minWidth: "140px",
                      fontWeight: 600,
                      letterSpacing: "0.3px",
                    }}
                  >
                    {isSaving ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        {t("Saving...")}
                      </>
                    ) : (
                      t("save")
                    )}
                  </Button>
                </li>
                <li>
                  <Button
                    type="button"
                    onClick={resetForm}
                    disabled={isSaving}
                    className="sh-cancel-btn shadow-sm px-4 py-2"
                    style={{
                      minWidth: "140px",
                      fontWeight: 600,
                      letterSpacing: "0.3px",
                    }}
                  >
                    {t("cancel")}
                  </Button>
                </li>
              </ul>
            </div>
          </Row>
        </Form>
      </Block>

      <Modal show={showModal} onHide={handleCloseModal} size="xl" centered contentClassName="sh-modal-content">
        <Modal.Header closeButton>
          <Modal.Title>
            <Icon name="users" className="me-1" />
            {t("add_family_members")}
          </Modal.Title>
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
                    {t("relationship")}
                    <span className="text-danger">*</span>
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
                      <option value="">{t("select_relationship")}</option>
                      {relationshipListData.map((list) => (
                        <option
                          key={list.relationshipId}
                          value={`${list.relationshipId}_${list.relationshipName}`}
                        >
                          {i18n.language === "kn"
                            ? list.relationshipNameInKannada
                            : list.relationshipName}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("relationship_is_required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="12">
                <div className="d-flex gap g-2 justify-content-center sh-modal-footer">
                  <div className="gap-col">
                    {/* <Button variant="primary" onClick={handleAddFamilyMembers}> */}
                    <Button type="submit" variant="primary">
                      <Icon name="plus" className="me-1" />
                      {t("add")}
                    </Button>
                  </div>
                  <div className="gap-col">
                    <Button variant="secondary" onClick={handleCloseModal}>
                      <Icon name="cross" className="me-1" />
                      {t("cancel")}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showModal1} onHide={handleCloseModal1} size="xl" centered contentClassName="sh-modal-content">
        <Modal.Header closeButton>
          <Modal.Title>
            <Icon name="users" className="me-1" />
            {t("edit")} {t("family_members")}
          </Modal.Title>
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
                    {t("relationship")}
                    <span className="text-danger">*</span>
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
                          {i18n.language === "kn"
                            ? list.relationshipNameInKannada
                            : list.relationshipName}
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
                <div className="d-flex justify-content-center gap g-2 mt-3 sh-modal-footer">
                  <div className="gap-col">
                    {/* <Button
                      variant="success"
                      onClick={() => handleUpdateFm(fmId, familyMembers)}
                      
                    > */}
                    <Button type="submit" variant="success">
                      <Icon name="check" className="me-1" />
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
                      <Icon name="cross" className="me-1" />
                      {t("cancel")}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showModal2} onHide={handleCloseModal2} size="xl" centered scrollable contentClassName="sh-modal-content">
        <Modal.Header closeButton>
          <Modal.Title>
            <Icon name="map" className="me-1" />
            {t("add_farmer_land_details")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Form action="#"> */}
          <Form
            noValidate
            validated={validatedFarmerLand}
            onSubmit={handleAddFarmerLand}
          >
            <div className="sh-modal-section-label">
              <Icon name="map" />
              {t("land_mulberry_rearing_details")}
            </div>
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

                <Form.Group className="form-group">
                  <Form.Label>
                    {t("land_ownership")}
                    <span className="text-danger">*</span>
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
                      <option value="">{t("select_land_ownership")}</option>
                      {landOwnershipListData.map((list) => (
                        <option
                          key={list.landOwnershipId}
                          value={`${list.landOwnershipId}_${list.landOwnershipName}`}
                        >
                          {i18n.language === "kn"
                            ? list.landOwnershipNameInKannada
                            : list.landOwnershipName}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("land_ownership_required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    {t("soil_type")}
                    <span className="text-danger">*</span>
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
                      <option value="">{t("select_soil_type")}</option>
                      {soilTypeListData.map((list) => (
                        <option
                          key={list.soilTypeId}
                          value={`${list.soilTypeId}_${list.soilTypeName}`}
                        >
                          {i18n.language === "kn"
                            ? list.soilTypeNameInKannada
                            : list.soilTypeName}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("soil_type_required")}
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
                    {t("source_of_Mulberry")}
                    <span className="text-danger">*</span>
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
                      <option value="">{t("select_source_of_Mulberry")}</option>
                      {mulberrySourceListData.map((list) => (
                        <option
                          key={list.mulberrySourceId}
                          value={`${list.mulberrySourceId}_${list.mulberrySourceName}`}
                        >
                          {i18n.language === "kn"
                            ? list.mulberrySourceNameInKannada
                            : list.mulberrySourceName}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("Mulberry_source_required")}
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
                      {t("Mulberry Area(in Acres_required)")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    {t("Mulberry_Variety")}
                    <span className="text-danger">*</span>
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
                      <option value="">{t("select_Mulberry_Variety")}</option>
                      {mulberryVarietyListData.map((list) => (
                        <option
                          key={list.mulberryVarietyId}
                          value={`${list.mulberryVarietyId}_${list.mulberryVarietyName}`}
                        >
                          {i18n.language === "kn"
                            ? list.mulberryVarietyNameInKannada
                            : list.mulberryVarietyName}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("Mulberry_Variety_required")}
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
                <Form.Group className="form-group">
                  <Form.Label>
                    {t("plantation_type")}
                    <span className="text-danger">*</span>
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
                      <option value="">{t("select_plantation_type")}</option>
                      {plantationTypeListData.map((list) => (
                        <option
                          key={list.plantationTypeId}
                          value={`${list.plantationTypeId}_${list.plantationTypeName}`}
                        >
                          {i18n.language === "kn"
                            ? list.plantationTypeNameInKannada
                            : list.plantationTypeName}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("plantation_type_required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    {t("irrigation_source")}
                    <span className="text-danger">*</span>
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
                      <option value="">{t("select_irrigation_source")}</option>
                      {irrigationSourceListData.map((list) => (
                        <option
                          key={list.irrigationSourceId}
                          value={`${list.irrigationSourceId}_${list.irrigationSourceName}`}
                        >
                          {i18n.language === "kn"
                            ? list.irrigationSourceNameInKannada
                            : list.irrigationSourceName}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("irrigation_source_required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    {t("irrigation_type")}
                    <span className="text-danger">*</span>
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
                      <option value="">{t("select_irrigation_type")}</option>
                      {irrigationTypeListData.map((list) => (
                        <option
                          key={list.irrigationTypeId}
                          value={`${list.irrigationTypeId}_${list.irrigationTypeName}`}
                        >
                          {i18n.language === "kn"
                            ? list.irrigationTypeNameInKannada
                            : list.irrigationTypeName}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("irrigation_type_required")}
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
                    {t("rearing_house_roof_type")}
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
                      <option value="">
                        {t("select_rearing_house_roof_type")}
                      </option>
                      {roofTypeListData.map((list) => (
                        <option
                          key={list.roofTypeId}
                          value={`${list.roofTypeId}_${list.roofTypeName}`}
                        >
                          {i18n.language === "kn"
                            ? list.roofTypeNameInKannada
                            : list.roofTypeName}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("rearing_house_roof_type_required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    {t("silk_worm")}
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
                      <option value="">{t("select_silk_worm_variety")}</option>
                      {silkWormVarietyListData.map((list) => (
                        <option
                          key={list.silkWormVarietyId}
                          value={`${list.silkWormVarietyId}_${list.silkWormVarietyName}`}
                        >
                          {i18n.language === "kn"
                            ? list.silkWormVarietyNameInKannada
                            : list.silkWormVarietyName}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("silk_worm_required")}
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
                <Form.Group className="form-group">
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
                      {t("rearing_required")}
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
                        placeholder={t("Enter Longitude")}
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
                      placeholder={t("Enter Main owner Number")}
                      readOnly
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col lg="12">
                <div className="sh-modal-section-label">
                  <Icon name="map-pin" />
                  {t("survey_details")}
                </div>
                <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group">
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
                      <Form.Label>{t("state")}</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="stateId"
                          // value={`${farmerLand.stateId}_${farmerLand.stateName}`}
                          value={farmerLand.stateId}
                          onChange={handleStateLandOption}
                        >
                          <option value="0">{t("select_state")}</option>
                          {stateListData.map((list) => (
                            <option key={list.stateId} value={list.stateId}>
                              {i18n.language === "kn"
                                ? list.stateNameInKannada
                                : list.stateName}
                            </option>
                          ))}
                        </Form.Select>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>{t("district")}</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="districtId"
                          value={`${farmerLand.districtId}_${farmerLand.districtName}`}
                          onChange={handleDistrictLandOption}
                        >
                          <option value="">{t("select_district")}</option>
                          {districtListData && districtListData.length
                            ? districtListData.map((list) => (
                                <option
                                  key={list.districtId}
                                  value={`${list.districtId}_${list.districtName}`}
                                >
                                  {i18n.language === "kn"
                                    ? list.districtNameInKannada
                                    : list.districtName}
                                </option>
                              ))
                            : ""}
                        </Form.Select>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>{t("taluk")}</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="talukId"
                          value={`${farmerLand.talukId}_${farmerLand.talukName}`}
                          onChange={handleTalukLandOption}
                        >
                          <option value="">{t("select_taluk")}</option>
                          {talukListData && talukListData.length
                            ? talukListData.map((list) => (
                                <option
                                  key={list.talukId}
                                  value={`${list.talukId}_${list.talukName}`}
                                >
                                  {i18n.language === "kn"
                                    ? list.talukNameInKannada
                                    : list.talukName}
                                </option>
                              ))
                            : ""}
                        </Form.Select>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>{t("hobli")}</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="hobliId"
                          value={`${farmerLand.hobliId}_${farmerLand.hobliName}`}
                          onChange={handleHobliLandOption}
                        >
                          <option value="">{t("select_hobli")}</option>
                          {hobliListData && hobliListData.length
                            ? hobliListData.map((list) => (
                                <option
                                  key={list.hobliId}
                                  value={`${list.hobliId}_${list.hobliName}`}
                                >
                                  {i18n.language === "kn"
                                    ? list.hobliNameInKannada
                                    : list.hobliName}
                                </option>
                              ))
                            : ""}
                        </Form.Select>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="village">{t("village")}</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="villageId"
                          value={`${farmerLand.villageId}_${farmerLand.villageName}`}
                          onChange={handleVillageLandOption}
                        >
                          <option value="">{t("select_village")}</option>
                          {villageListData && villageListData.length
                            ? villageListData.map((list) => (
                                <option
                                  key={list.villageId}
                                  value={`${list.villageId}_${list.villageName}`}
                                >
                                  {i18n.language === "kn"
                                    ? list.villageNameInKannada
                                    : list.villageName}
                                </option>
                              ))
                            : ""}
                        </Form.Select>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
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
                <div className="d-flex justify-content-center gap g-2 sh-modal-footer">
                  <div className="gap-col">
                    {/* <Button variant="success" onClick={handleAddFarmerLand}> */}
                    <Button type="submit" variant="success">
                      <Icon name="plus" className="me-1" />
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
                      <Icon name="cross" className="me-1" />
                      {t("cancel")}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showModal3} onHide={handleCloseModal3} size="xl" centered scrollable contentClassName="sh-modal-content">
        <Modal.Header closeButton>
          <Modal.Title>
            <Icon name="map" className="me-1" />
            {t("edit")} {t("farmer_land_details")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Form action="#"> */}
          <Form
            noValidate
            validated={validatedFarmerLandEdit}
            onSubmit={(e) => handleUpdateFl(e, flId, farmerLand)}
          >
            <div className="sh-modal-section-label">
              <Icon name="map" />
             {t("land_mulberry_rearing_details")}
            </div>
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

                <Form.Group className="form-group">
                  <Form.Label>
                    {t("land_ownership")}
                    <span className="text-danger">*</span>
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
                      <option value="">{t("select_land_ownership")}</option>
                      {landOwnershipListData.map((list) => (
                        <option
                          key={list.landOwnershipId}
                          value={`${list.landOwnershipId}_${list.landOwnershipName}`}
                        >
                          {i18n.language === "kn"
                            ? list.landOwnershipNameInKannada
                            : list.landOwnershipName}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("land_ownership_required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    {t("soil_type")}
                    <span className="text-danger">*</span>
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
                      <option value="">{t("select_soil_type")}</option>
                      {soilTypeListData.map((list) => (
                        <option
                          key={list.soilTypeId}
                          value={`${list.soilTypeId}_${list.soilTypeName}`}
                        >
                          {i18n.language === "kn"
                            ? list.soilTypeNameInKannada
                            : list.soilTypeName}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("soil_type_required")}
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
                    {t("source_of_Mulberry")}
                    <span className="text-danger">*</span>
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
                      <option value="">{t("select_source_of_Mulberry")}</option>
                      {mulberrySourceListData.map((list) => (
                        <option
                          key={list.mulberrySourceId}
                          value={`${list.mulberrySourceId}_${list.mulberrySourceName}`}
                        >
                          {i18n.language === "kn"
                            ? list.mulberrySourceNameInKannada
                            : list.mulberrySourceName}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("Mulberry_source_required")}
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
                      {t("Mulberry Area(in Acres_required)")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    {t("Mulberry_Variety")}
                    <span className="text-danger">*</span>
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
                      <option value="">{t("select_Mulberry_Variety")}</option>
                      {mulberryVarietyListData.map((list) => (
                        <option
                          key={list.mulberryVarietyId}
                          value={`${list.mulberryVarietyId}_${list.mulberryVarietyName}`}
                        >
                          {i18n.language === "kn"
                            ? list.mulberryVarietyNameInKannada
                            : list.mulberryVarietyName}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("Mulberry_Variety_required")}
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
                <Form.Group className="form-group">
                  <Form.Label>
                    {t("plantation_type")}
                    <span className="text-danger">*</span>
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
                      <option value="">{t("select_plantation_type")}</option>
                      {plantationTypeListData.map((list) => (
                        <option
                          key={list.plantationTypeId}
                          value={`${list.plantationTypeId}_${list.plantationTypeName}`}
                        >
                          {i18n.language === "kn"
                            ? list.plantationTypeNameInKannada
                            : list.plantationTypeName}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("plantation_type_required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    {t("irrigation_source")}
                    <span className="text-danger">*</span>
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
                      <option value="0">{t("select_irrigation_source")}</option>
                      {irrigationSourceListData.map((list) => (
                        <option
                          key={list.irrigationSourceId}
                          value={`${list.irrigationSourceId}_${list.irrigationSourceName}`}
                        >
                          {i18n.language === "kn"
                            ? list.irrigationSourceNameInKannada
                            : list.irrigationSourceName}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("irrigation_source_required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    {t("irrigation_type")}
                    <span className="text-danger">*</span>
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
                      <option value="">{t("select_irrigation_type")}</option>
                      {irrigationTypeListData.map((list) => (
                        <option
                          key={list.irrigationTypeId}
                          value={`${list.irrigationTypeId}_${list.irrigationTypeName}`}
                        >
                          {i18n.language === "kn"
                            ? list.irrigationTypeNameInKannada
                            : list.irrigationTypeName}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("irrigation_type_required")}
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
                    {t("rearing_house_roof_type")}
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
                      <option value="">
                        {t("select_rearing_house_roof_type")}
                      </option>
                      {roofTypeListData.map((list) => (
                        <option
                          key={list.roofTypeId}
                          value={`${list.roofTypeId}_${list.roofTypeName}`}
                        >
                          {i18n.language === "kn"
                            ? list.roofTypeNameInKannada
                            : list.roofTypeName}
                        </option>
                      ))}
                    </Form.Select>
                    {/* <Form.Control.Feedback type="invalid">
                      Roof Type is required
                    </Form.Control.Feedback> */}
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    {t("silk_worm")}
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
                      <option value="">{t("select_silk_worm_variety")}</option>
                      {silkWormVarietyListData.map((list) => (
                        <option
                          key={list.silkWormVarietyId}
                          value={`${list.silkWormVarietyId}_${list.silkWormVarietyName}`}
                        >
                          {i18n.language === "kn"
                            ? list.silkWormVarietyNameInKannada
                            : list.silkWormVarietyName}
                        </option>
                      ))}
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
                <Form.Group className="form-group">
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
                      {t("rearing_required")}
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
                        placeholder={t("Enter Longitude")}
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
                <div className="sh-modal-section-label">
                  <Icon name="map-pin" />
                  {t("survey_details")}
                </div>
                <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group">
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
                          placeholder={t("enter_acres")}
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
                      <Form.Label>{t("state")}</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="stateId"
                          value={farmerLand.stateId}
                          onChange={handleStateLandOption}
                        >
                          <option value="0">{t("select_state")}</option>
                          {stateListData.map((list) => (
                            <option key={list.stateId} value={list.stateId}>
                              {i18n.language === "kn"
                                ? list.stateNameInKannada
                                : list.stateName}
                            </option>
                          ))}
                        </Form.Select>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>{t("district")}</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="districtId"
                          value={`${farmerLand.districtId}_${farmerLand.districtName}`}
                          onChange={handleDistrictLandOption}
                        >
                          <option value="">{t("select_district")}</option>
                          {districtListData && districtListData.length
                            ? districtListData.map((list) => (
                                <option
                                  key={list.districtId}
                                  value={`${list.districtId}_${list.districtName}`}
                                >
                                  {i18n.language === "kn"
                                    ? list.districtNameInKannada
                                    : list.districtName}
                                </option>
                              ))
                            : ""}
                        </Form.Select>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>{t("taluk")}</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="talukId"
                          value={`${farmerLand.talukId}_${farmerLand.talukName}`}
                          onChange={handleTalukLandOption}
                        >
                          <option value="">{t("select_taluk")}</option>
                          {talukListData && talukListData.length
                            ? talukListData.map((list) => (
                                <option
                                  key={list.talukId}
                                  value={`${list.talukId}_${list.talukName}`}
                                >
                                  {i18n.language === "kn"
                                    ? list.talukNameInKannada
                                    : list.talukName}
                                </option>
                              ))
                            : ""}
                        </Form.Select>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label>{t("hobli")}</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="hobliId"
                          value={`${farmerLand.hobliId}_${farmerLand.hobliName}`}
                          onChange={handleHobliLandOption}
                        >
                          <option value="">{t("select_hobli")}</option>
                          {hobliListData && hobliListData.length
                            ? hobliListData.map((list) => (
                                <option
                                  key={list.hobliId}
                                  value={`${list.hobliId}_${list.hobliName}`}
                                >
                                  {i18n.language === "kn"
                                    ? list.hobliNameInKannada
                                    : list.hobliName}
                                </option>
                              ))
                            : ""}
                        </Form.Select>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="Village">{t("village")}</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="villageId"
                          value={`${farmerLand.villageId}_${farmerLand.villageName}`}
                          onChange={handleVillageLandOption}
                        >
                          <option value="">{t("select_village")}</option>
                          {villageListData && villageListData.length
                            ? villageListData.map((list) => (
                                <option
                                  key={list.villageId}
                                  value={`${list.villageId}_${list.villageName}`}
                                >
                                  {i18n.language === "kn"
                                    ? list.villageNameInKannada
                                    : list.villageName}
                                </option>
                              ))
                            : ""}
                        </Form.Select>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
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
                          placeholder={t("Enter_gunta")}
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
                <div className="d-flex justify-content-center gap g-2 mt-3 sh-modal-footer">
                  <div className="gap-col">
                    {/* <Button
                      variant="success"
                      onClick={() => handleUpdateFl(flId, farmerLand)}
                    > */}
                    <Button type="submit" variant="success">
                      <Icon name="check" className="me-1" />
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
                      <Icon name="cross" className="me-1" />
                      {t("cancel")}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showModal4} onHide={handleCloseModal4} size="xl" centered scrollable contentClassName="sh-modal-content">
        <Modal.Header closeButton>
          <Modal.Title>
            <Icon name="map-pin" className="me-1" />
            {t("add_address")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Form action="#"> */}
          <Form
            noValidate
            validated={validatedFarmerAddress}
            onSubmit={handleAddFarmerAddress}
          >
            <div className="sh-modal-section-label">
              <Icon name="map-pin" />
              {t("location_details")}
            </div>
            <Row className="g-3">
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label>
                    {t("state")}
                    <span className="text-danger">*</span>
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
                      <option value="">{t("select_state")}</option>
                      {addressStateListData.map((list) => (
                        <option
                          key={list.stateId}
                          value={`${list.stateId}_${list.stateName}`}
                        >
                          {i18n.language === "kn"
                            ? list.stateNameInKannada
                            : list.stateName}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("state_is_required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label>
                    {t("district")}
                    <span className="text-danger">*</span>
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
                      <option value="">{t("select_district")}</option>
                      {addressdistrictListData && addressdistrictListData.length
                        ? addressdistrictListData.map((list) => (
                            <option
                              key={list.districtId}
                              value={`${list.districtId}_${list.districtName}`}
                            >
                              {i18n.language === "kn"
                                ? list.districtNameInKannada
                                : list.districtName}
                            </option>
                          ))
                        : ""}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("district_is_required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label>
                    {t("taluk")}
                    <span className="text-danger">*</span>
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
                      <option value="">{t("select_taluk")}</option>
                      {addressTalukListData && addressTalukListData.length
                        ? addressTalukListData.map((list) => (
                            <option
                              key={list.talukId}
                              value={`${list.talukId}_${list.talukName}`}
                            >
                              {i18n.language === "kn"
                                ? list.talukNameInKannada
                                : list.talukName}
                            </option>
                          ))
                        : ""}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("taluk_is_required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label>
                    {t("hobli")}
                    <span className="text-danger">*</span>
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
                      <option value="">{t("select_hobli")}</option>
                      {addressHobliListData && addressHobliListData.length
                        ? addressHobliListData.map((list) => (
                            <option
                              key={list.hobliId}
                              value={`${list.hobliId}_${list.hobliName}`}
                            >
                              {i18n.language === "kn"
                                ? list.hobliNameInKannada
                                : list.hobliName}
                            </option>
                          ))
                        : ""}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("hobli_is_required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="Village">
                    {t("village")}
                    <span className="text-danger">*</span>
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
                      <option value="">{t("select_village")}</option>
                      {addressVillageListData && addressVillageListData.length
                        ? addressVillageListData.map((list) => (
                            <option
                              key={list.villageId}
                              value={`${list.villageId}_${list.villageName}`}
                            >
                              {i18n.language === "kn"
                                ? list.villageNameInKannada
                                : list.villageName}
                            </option>
                          ))
                        : ""}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("village_is_required")}
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
                <div className="d-flex justify-content-center gap g-2 mt-3 sh-modal-footer">
                  <div className="gap-col">
                    {/* <Button variant="success" onClick={handleAddFarmerAddress}> */}
                    <Button type="submit" variant="success">
                      <Icon name="plus" className="me-1" />
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
                      <Icon name="cross" className="me-1" />
                      {t("cancel")}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showModal5} onHide={handleCloseModal5} size="xl" centered scrollable contentClassName="sh-modal-content">
        <Modal.Header closeButton>
          <Modal.Title>
            <Icon name="map-pin" className="me-1" />
            {t("edit")} {t("address")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Form action="#"> */}
          <Form
            noValidate
            validated={validatedFarmerAddressEdit}
            onSubmit={(e) => handleUpdateFa(e, faId, farmerAddress)}
          >
            <div className="sh-modal-section-label">
              <Icon name="map-pin" />
             {t("location_details")}
            </div>
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
                          {i18n.language === "kn"
                            ? list.stateNameInKannada
                            : list.stateName}
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
                              {i18n.language === "kn"
                                ? list.districtNameInKannada
                                : list.districtName}
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
                              {i18n.language === "kn"
                                ? list.talukNameInKannada
                                : list.talukName}
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
                              {i18n.language === "kn"
                                ? list.hobliNameInKannada
                                : list.hobliName}
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
                              {i18n.language === "kn"
                                ? list.villageNameInKannada
                                : list.villageName}
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
                      // defaultChecked
                    />
                  </Col>
                  <Form.Label column sm={11} className="mt-n2">
                    {t("make_this_address_default")}
                  </Form.Label>
                </Form.Group>
              </Col>

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2 sh-modal-footer">
                  <div className="gap-col">
                    {/* <Button
                      variant="success"
                      onClick={() => handleUpdateFa(faId, farmerAddress)}
                    > */}
                    <Button type="submit" variant="success">
                      <Icon name="check" className="me-1" />
                      {t("update")}
                    </Button>
                  </div>
                  {/* <div className="gap-col">
                    <Button variant="danger" onClick={handleCloseModal2}>
                      Reject
                    </Button>
                  </div> */}
                  <div className="gap-col">
                    <Button variant="secondary" onClick={handleCloseModal5}>
                      <Icon name="cross" className="me-1" />
                      {t("cancel")}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
      {/* Add Virtual Bank Account Modal */}
      <Modal show={showModalVb} onHide={handleVbCloseModal} size="xl" centered contentClassName="sh-modal-content">
        <Modal.Header closeButton>
          <Modal.Title>
            <Icon name="wallet" className="me-1" />
            {t("Add Virtual Bank Account Details")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validatedVbAccount} onSubmit={handleVbAdd}>
            <Row className="g-3 px-4">
              <Col lg="6">
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="vbVirtualAccountNumber">
                    {t("Virtual Account Number")}<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="vbVirtualAccountNumber"
                      name="virtualAccountNumber"
                      value={vbAccount.virtualAccountNumber}
                      onChange={handleVbInputs}
                      type="text"
                      placeholder={t("Enter Virtual Account Number")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Virtual Account Number is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="vbReenterVirtualAccountNumber">
                    {t("Re-enter Virtual Account Number")}<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="vbReenterVirtualAccountNumber"
                      name="reenterVirtualAccountNumber"
                      value={vbAccount.reenterVirtualAccountNumber}
                      onChange={handleVbInputs}
                      onPaste={(e) => e.preventDefault()}
                      onCopy={(e) => e.preventDefault()}
                      onCut={(e) => e.preventDefault()}
                      type="password"
                      placeholder={t("Re-enter Virtual Account Number")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Account Number Mismatch")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="vbBranchName">
                    {t("branch_name")}<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="vbBranchName"
                      name="branchName"
                      value={vbAccount.branchName}
                      onChange={handleVbInputs}
                      type="text"
                      placeholder={t("enter_branch_name")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Branch Name is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="vbIfscCode">
                    {t("ifsc_code")}<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="vbIfscCode"
                      name="ifscCode"
                      value={vbAccount.ifscCode}
                      onChange={handleVbInputs}
                      type="text"
                      maxLength="11"
                      placeholder={t("enter_ifsc_code")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("IFSC Code is required and equals to 11 digit")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    {t("Market")}<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="marketMasterId"
                      value={`${vbAccount.marketMasterId}_${vbAccount.marketMasterName}`}
                      onChange={handleMarketOption}
                      required
                      isInvalid={!vbAccount.marketMasterId || vbAccount.marketMasterId === "0"}
                    >
                      <option value="">{t("Select Market")}</option>
                      {marketMasterListData.map((list) => (
                        <option key={list.marketMasterId} value={`${list.marketMasterId}_${list.marketMasterName}`}>
                          {i18n.language === "kn"
                            ? list.marketNameInKannada
                            : list.marketMasterName}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("Market is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group as={Row} className="form-group mt-5">
                  <Col sm={1}>
                    <Form.Check
                      type="checkbox"
                      id="vbLockModal"
                      checked={vbLock}
                      onChange={handleVbLockCheckBox}
                    />
                  </Col>
                  <Form.Label column sm={11} className="mt-n1">
                    {t("Lock Virtual Bank Account")}
                  </Form.Label>
                </Form.Group>
              </Col>
              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2 sh-modal-footer">
                  <div className="gap-col">
                    <Button type="submit" variant="success">
                      <Icon name="plus" className="me-1" />
                      {t("add")}
                    </Button>
                  </div>
                  <div className="gap-col">
                    <Button variant="secondary" onClick={handleVbCloseModal}>
                      <Icon name="cross" className="me-1" />
                      {t("cancel")}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Virtual Bank Account Modal */}
      <Modal show={showModalVb2} onHide={handleVbCloseModal2} size="lg" centered contentClassName="sh-modal-content">
        <Modal.Header closeButton>
          <Modal.Title>
            <Icon name="wallet" className="me-1" />
            {t("Edit Virtual Bank Account")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validatedVbAccountEdit} onSubmit={(e) => handleVbUpdate(e, vbId, vbAccount)}>
            <Row className="g-3 px-4">
              <Col lg="6">
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="vbEditVirtualAccountNumber">
                    {t("Virtual Account Number")}<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="vbEditVirtualAccountNumber"
                      name="virtualAccountNumber"
                      value={vbAccount.virtualAccountNumber}
                      onChange={handleVbInputs}
                      type="text"
                      placeholder={t("Enter Virtual Account Number")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Virtual Account Number is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="vbEditReenterVirtualAccountNumber">
                    {t("Re-enter Virtual Account Number")}<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="vbEditReenterVirtualAccountNumber"
                      name="reenterVirtualAccountNumber"
                      value={vbAccount.reenterVirtualAccountNumber}
                      onChange={handleVbInputs}
                      onPaste={(e) => e.preventDefault()}
                      onCopy={(e) => e.preventDefault()}
                      onCut={(e) => e.preventDefault()}
                      type="password"
                      placeholder={t("Re-enter Virtual Account Number")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Account Number Mismatch")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="vbEditBranchName">
                    {t("branch_name")}<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="vbEditBranchName"
                      name="branchName"
                      value={vbAccount.branchName}
                      onChange={handleVbInputs}
                      type="text"
                      placeholder={t("enter_branch_name")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Branch Name is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="vbEditIfscCode">
                    {t("ifsc_code")}<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="vbEditIfscCode"
                      name="ifscCode"
                      value={vbAccount.ifscCode}
                      onChange={handleVbInputs}
                      type="text"
                      maxLength="11"
                      placeholder={t("enter_ifsc_code")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("IFSC Code is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    {t("Market")}<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="marketMasterId"
                      value={`${vbAccount.marketMasterId}_${vbAccount.marketMasterName}`}
                      onChange={handleMarketOption}
                      required
                      isInvalid={!vbAccount.marketMasterId || vbAccount.marketMasterId === "0"}
                    >
                      <option value="">{t("Select Market")}</option>
                      {marketMasterListData.map((list) => (
                        <option key={list.marketMasterId} value={`${list.marketMasterId}_${list.marketMasterName}`}>
                          {i18n.language === "kn"
                            ? list.marketNameInKannada
                            : list.marketMasterName}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("Market is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group as={Row} className="form-group mt-5">
                  <Col sm={1}>
                    <Form.Check
                      type="checkbox"
                      id="vbLockModalEdit"
                      checked={vbLock}
                      onChange={handleVbLockCheckBox}
                    />
                  </Col>
                  <Form.Label column sm={11} className="mt-n1">
                    {t("Lock Virtual Bank Account")}
                  </Form.Label>
                </Form.Group>
              </Col>
              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2 sh-modal-footer">
                  <div className="gap-col">
                    <Button type="submit" variant="success">
                      <Icon name="check" className="me-1" />
                      {t("update")}
                    </Button>
                  </div>
                  <div className="gap-col">
                    <Button variant="secondary" onClick={handleVbCloseModal2}>
                      <Icon name="cross" className="me-1" />
                      {t("cancel")}
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

const stakeHolderFormStyles = `
  .sh-page-header {
    padding: 20px 24px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border-radius: 12px;
    border: none;
    box-shadow: 0 6px 18px rgba(30, 103, 168, 0.22);
    margin-bottom: 22px;
  }
  .sh-page-title {
    margin-bottom: 4px;
    color: #ffffff !important;
    font-weight: 700;
    letter-spacing: 0.2px;
  }
  .sh-page-subtitle {
    color: rgba(255, 255, 255, 0.85);
    font-size: 13.5px;
  }
  .sh-cta-btn {
    background: #ffffff;
    color: #1e67a8 !important;
    border: none;
    box-shadow: 0 4px 12px rgba(12, 40, 68, 0.25);
    font-weight: 700;
    padding: 8px 18px;
    border-radius: 8px;
    transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
  }
  .sh-cta-btn:hover {
    background: #eef6ff;
    color: #1e67a8 !important;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(12, 40, 68, 0.32);
  }
  .sh-form-wrap {
    background: #eef2f8;
    border-radius: 14px;
    padding: 18px;
  }
  .sh-form-wrap .card {
    border: none;
    border-radius: 12px !important;
    box-shadow: 0 4px 14px rgba(30, 103, 168, 0.1);
    overflow: hidden;
    margin-bottom: 18px;
  }
  .sh-form-wrap .card-header {
    border-bottom: none !important;
  }
  .sh-form-wrap .card-body {
    padding: 20px !important;
  }
  .sh-form-wrap .form-label {
    font-size: 13px;
    font-weight: 600;
    color: #4a5568;
    margin-bottom: 6px;
    letter-spacing: 0.2px;
  }
  .sh-form-wrap .form-control,
  .sh-form-wrap .form-select {
    border-radius: 10px !important;
    border: 1.5px solid #d8e0ec !important;
    background-color: #fbfcfe !important;
    padding: 0.62rem 0.9rem !important;
    font-size: 13.5px;
    color: #2b3a55;
    transition: border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
  }
  .sh-form-wrap .form-control::placeholder {
    color: #a7b0c0;
    font-weight: 400;
  }
  .sh-form-wrap .form-control:hover:not(:disabled):not([readonly]),
  .sh-form-wrap .form-select:hover:not(:disabled) {
    border-color: #a9c4e0 !important;
    background-color: #ffffff !important;
  }
  .sh-form-wrap .form-control:focus,
  .sh-form-wrap .form-select:focus {
    border-color: #2b7ac0 !important;
    background-color: #ffffff !important;
    box-shadow: 0 0 0 3px rgba(30, 103, 168, 0.14) !important;
    outline: none;
  }
  .sh-form-wrap .form-control[readonly],
  .sh-form-wrap .form-control:read-only,
  .sh-form-wrap .form-select:disabled {
    background-color: #f1f5fa !important;
    border-color: #e4e9f2 !important;
    color: #8a96a8 !important;
    cursor: not-allowed;
  }
  .sh-form-wrap .form-control.is-invalid,
  .sh-form-wrap .form-select.is-invalid {
    border-color: #e3496a !important;
    box-shadow: 0 0 0 3px rgba(227, 73, 106, 0.12) !important;
  }
  .sh-form-wrap .form-check-input {
    border-radius: 5px;
    border: 1.5px solid #c9d4e3;
    cursor: pointer;
  }
  .sh-form-wrap .form-check-input:checked {
    background-color: #1e67a8;
    border-color: #1e67a8;
  }
  .sh-form-wrap .form-check-input:focus {
    box-shadow: 0 0 0 3px rgba(30, 103, 168, 0.14);
    border-color: #2b7ac0;
  }
  .sh-form-wrap .text-danger {
    font-weight: 700;
    margin-left: 3px;
  }
  .sh-search-card {
    background: #ffffff !important;
    border: none !important;
    border-top: 4px solid #2b7ac0 !important;
  }
  .sh-fruits-label {
    font-weight: 700 !important;
    color: #1e67a8 !important;
    font-size: 14px !important;
    letter-spacing: 0.3px;
  }
  .sh-form-wrap .btn-primary {
    border-radius: 8px;
    font-weight: 600;
    letter-spacing: 0.3px;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-form-wrap .btn-primary:not(:disabled):hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(30, 103, 168, 0.25);
  }
  .sh-form-wrap .btn-success {
    border-radius: 8px;
    font-weight: 600;
  }
  .sh-cancel-btn {
    background: #ffffff;
    color: #e3496a;
    border: 1.5px solid #e3496a;
    border-radius: 8px;
    transition: background-color 0.15s ease, color 0.15s ease,
      transform 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-cancel-btn:hover:not(:disabled),
  .sh-cancel-btn:focus:not(:disabled) {
    background: linear-gradient(135deg, #e3496a 0%, #c43257 100%);
    color: #ffffff;
    border-color: transparent;
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(227, 73, 106, 0.32);
  }
  .sh-cancel-btn:disabled {
    background: #f8f9fa;
    color: #b8c0cc;
    border-color: #d8dde6;
    cursor: not-allowed;
  }
  .sh-form-wrap table {
    border-radius: 8px;
    overflow: hidden;
  }
  .sh-form-wrap table thead th {
    background-color: #eef4fc !important;
    color: #2b3a55 !important;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.2px;
    border-bottom: 2px solid #d6e3f3 !important;
  }
  .sh-form-wrap table tbody tr:hover {
    background-color: #f7faff !important;
  }
  .sh-section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 700 !important;
    font-size: 1rem !important;
    letter-spacing: 0.3px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border-left: none !important;
    color: #ffffff !important;
    padding: 14px 20px !important;
  }
  .sh-section-header svg,
  .sh-section-header .icon,
  .sh-modal-content .modal-header svg,
  .sh-modal-content .modal-header .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.22);
    color: #ffffff;
    font-size: 15px;
  }
  .sh-modal-content {
    border-radius: 12px !important;
    border: 1px solid #e3ebf6 !important;
    overflow: hidden;
  }
  .sh-modal-content .modal-header {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border-bottom: none;
    padding: 16px 22px;
  }
  .sh-modal-content .modal-header .btn-close {
    filter: brightness(0) invert(1);
    opacity: 0.85;
  }
  .sh-modal-content .modal-header .btn-close:hover {
    opacity: 1;
  }
  .sh-modal-content .modal-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 700;
    font-size: 1.05rem;
    letter-spacing: 0.3px;
    color: #ffffff;
  }
  .sh-modal-content .modal-body {
    padding: 22px 24px;
  }
  .sh-modal-content .form-label {
    font-size: 13px;
    font-weight: 600;
    color: #4a5568;
    margin-bottom: 6px;
    letter-spacing: 0.2px;
  }
  .sh-modal-content .form-control,
  .sh-modal-content .form-select {
    border-radius: 10px !important;
    border: 1.5px solid #d8e0ec !important;
    background-color: #fbfcfe !important;
    padding: 0.62rem 0.9rem !important;
    font-size: 13.5px;
    color: #2b3a55;
    transition: border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
  }
  .sh-modal-content .form-control::placeholder {
    color: #a7b0c0;
    font-weight: 400;
  }
  .sh-modal-content .form-control:hover:not(:disabled):not([readonly]),
  .sh-modal-content .form-select:hover:not(:disabled) {
    border-color: #a9c4e0 !important;
    background-color: #ffffff !important;
  }
  .sh-modal-content .form-control:focus,
  .sh-modal-content .form-select:focus {
    border-color: #2b7ac0 !important;
    background-color: #ffffff !important;
    box-shadow: 0 0 0 3px rgba(30, 103, 168, 0.14) !important;
    outline: none;
  }
  .sh-modal-content .form-control[readonly],
  .sh-modal-content .form-control:read-only,
  .sh-modal-content .form-select:disabled {
    background-color: #f1f5fa !important;
    border-color: #e4e9f2 !important;
    color: #8a96a8 !important;
    cursor: not-allowed;
  }
  .sh-modal-content .form-check-input {
    border-radius: 5px;
    border: 1.5px solid #c9d4e3;
    cursor: pointer;
  }
  .sh-modal-content .form-check-input:checked {
    background-color: #1e67a8;
    border-color: #1e67a8;
  }
  .sh-modal-content .form-check-input:focus {
    box-shadow: 0 0 0 3px rgba(30, 103, 168, 0.14);
    border-color: #2b7ac0;
  }
  .sh-modal-content .form-control.is-invalid,
  .sh-modal-content .form-select.is-invalid {
    border-color: #e3496a !important;
    box-shadow: 0 0 0 3px rgba(227, 73, 106, 0.12) !important;
  }
  .sh-modal-content .text-danger {
    font-weight: 700;
    margin-left: 3px;
  }
  .sh-modal-content .btn-primary {
    background: linear-gradient(135deg, #1e67a8 0%, #2b7ac0 100%);
    border: none;
    border-radius: 8px;
    font-weight: 600;
    letter-spacing: 0.3px;
    box-shadow: 0 4px 10px rgba(30, 103, 168, 0.2);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-modal-content .btn-primary:not(:disabled):hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(30, 103, 168, 0.3);
  }
  .sh-modal-content .btn-success {
    background: linear-gradient(135deg, #1e67a8 0%, #2b7ac0 100%);
    border: none;
    border-radius: 8px;
    font-weight: 600;
    letter-spacing: 0.3px;
    box-shadow: 0 4px 10px rgba(30, 103, 168, 0.2);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-modal-content .btn-success:not(:disabled):hover {
    background: linear-gradient(135deg, #1e67a8 0%, #2b7ac0 100%);
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(30, 103, 168, 0.3);
  }
  .sh-modal-content .btn-secondary {
    background: #ffffff;
    color: #e3496a;
    border: 1.5px solid #e3496a;
    border-radius: 8px;
    font-weight: 600;
    transition: background-color 0.15s ease, color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-modal-content .btn-secondary:hover:not(:disabled) {
    background: linear-gradient(135deg, #e3496a 0%, #c43257 100%);
    color: #ffffff;
    border-color: transparent;
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(227, 73, 106, 0.28);
  }
  .sh-modal-content table {
    border-radius: 8px;
    overflow: hidden;
  }
  .sh-modal-content table thead th {
    background-color: #eef4fc !important;
    color: #2b3a55 !important;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.2px;
    border-bottom: 2px solid #d6e3f3 !important;
  }
  .sh-modal-section-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 12.5px;
    font-weight: 700;
    color: #1e67a8;
    letter-spacing: 0.4px;
    text-transform: uppercase;
    margin: 4px 0 18px;
    padding: 6px 14px;
    background: #eaf2fc;
    border-radius: 999px;
  }
  .sh-modal-section-label:not(:first-child) {
    margin-top: 26px;
  }
  .sh-modal-section-label .icon {
    color: #1e67a8;
    font-size: 14px;
  }
  .sh-modal-footer {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-top: 10px;
    padding-top: 18px;
    border-top: 1px solid #eef1f6;
  }
  .sh-modal-content .modal-body {
    max-height: 72vh;
    overflow-y: auto;
  }
  .sh-modal-content .modal-body::-webkit-scrollbar {
    width: 8px;
  }
  .sh-modal-content .modal-body::-webkit-scrollbar-thumb {
    background: #c9dcf0;
    border-radius: 8px;
  }
  .sh-modal-content .modal-body::-webkit-scrollbar-track {
    background: transparent;
  }
`;

export default StakeHolderRegister;
