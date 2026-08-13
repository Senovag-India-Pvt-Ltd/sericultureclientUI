import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
// import DatePicker from "../../../components/Form/DatePicker";
import DatePicker from "react-datepicker";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
// import axios from "axios";
import { Icon } from "../../../components";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_REGISTRATION;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION_FRUITS;

function NewReelerLicense() {
  // Translation
  const { t, i18n } = useTranslation();
  // Same page for both Registration > Reeler License menu items; the "Without License"
  // menu link adds ?licenseType=without to this URL, which skips the mandatory
  // validation on a few license-specific fields below.
  const location = useLocation();
  const withLicense =
    new URLSearchParams(location.search).get("licenseType") !== "without";
  // Virtual Bank Account
  const [vbAccountList, setVbAccountList] = useState([]);
  const [vbAccount, setVbAccount] = useState({
    virtualAccountNumber: "",
    branchName: "",
    ifscCode: "",
    marketMasterId: "",
  });

  const [validated, setValidated] = useState(false);
  const [validatedVbAccount, setValidatedVbAccount] = useState(false);
  const [validatedVbAccountEdit, setValidatedVbAccountEdit] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleAdd = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidatedVbAccount(true);
    } else {
      e.preventDefault();
      if (vbAccount.ifscCode.length < 11 || vbAccount.ifscCode.length > 11) {
        return;
      }
      setVbAccountList((prev) => [...prev, vbAccount]);
      setVbAccount({
        virtualAccountNumber: "",
        branchName: "",
        ifscCode: "",
        marketMasterId: "",
      });
      setShowModal(false);
      setValidatedVbAccount(false);
    }
  };

  const handleDelete = (i) => {
    setVbAccountList((prev) => {
      const newArray = prev.filter((item, place) => place !== i);
      return newArray;
    });
  };

  const [vbId, setVbId] = useState();
  const handleGet = (i) => {
    setVbAccount(vbAccountList[i]);
    setShowModal2(true);
    setVbId(i);
  };

  const handleUpdate = (e, i, changes) => {
    setVbAccountList((prev) =>
      prev.map((item, ix) => {
        if (ix === i) {
          return { ...item, ...changes };
        }
        return item;
      }),
    );
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidatedVbAccountEdit(true);
    } else {
      e.preventDefault();
      if (vbAccount.ifscCode.length < 11 || vbAccount.ifscCode.length > 11) {
        return;
      }
      setShowModal2(false);
      setValidatedVbAccountEdit(false);
      setVbAccount({
        virtualAccountNumber: "",
        branchName: "",
        ifscCode: "",
        marketMasterId: "",
      });
    }
  };

  const handleVbInputs = (e) => {
    const { name, value } = e.target;
    // setVbAccount({ ...vbAccount, [name]: value });

    if (name === "ifscCode" && (value.length < 11 || value.length > 11)) {
      e.target.classList.add("is-invalid");
      e.target.classList.remove("is-valid");
    } else if (name === "ifscCode" && value.length === 11) {
      e.target.classList.remove("is-invalid");
      e.target.classList.add("is-valid");
    }
    if (name === "branchName") {
      setVbAccount({ ...vbAccount, [name]: value.toUpperCase() });
    } else if (name === "ifscCode") {
      setVbAccount({ ...vbAccount, [name]: value.toUpperCase() });
    } else {
      setVbAccount({ ...vbAccount, [name]: value });
    }
  };

  const handleShowModal2 = () => setShowModal2(true);
  const handleCloseModal2 = () => {
    setShowModal2(false);
    setVbAccount({
      virtualAccountNumber: "",
      branchName: "",
      ifscCode: "",
      marketMasterId: "",
    });
  };

  const clear = (event) => {
    setDisable(false);
    setData({
      fruitsId: "",
      reelerName: "",
      wardNumber: "",
      tscMasterId: "",
      passbookNumber: "",
      fatherName: "",
      educationId: "",
      reelingUnitBoundary: "",
      dob: "",
      rationCard: "",
      machineTypeId: "",
      gender: "",
      dateOfMachineInstallation: "",
      electricityRrNumber: "",
      casteId: "",
      revenueDocument: "",
      numberOfBasins: "",
      mobileNumber: "",
      recipientId: "",
      mahajarDetails: "",
      emailId: "",
      representativeNameAddress: "",
      loanDetails: "",
      assignToInspectId: "",
      gpsLat: "",
      gpsLng: "",
      inspectionDate: "",
      arnNumber: "",
      chakbandiLat: "",
      chakbandiLng: "",
      address: "",
      pincode: "",
      stateId: "",
      districtId: "",
      talukId: "",
      hobliId: "",
      villageId: "",
      licenseReceiptNumber: "",
      licenseExpiryDate: "",
      receiptDate: "",
      functionOfUnit: "",
      reelingLicenseNumber: "",
      feeAmount: "",
      memberLoanDetails: "",
      mahajarEast: "",
      mahajarWest: "",
      mahajarNorth: "",
      mahajarSouth: "",
      mahajarNorthEast: "",
      mahajarNorthWest: "",
      mahajarSouthEast: "",
      mahajarSouthWest: "",
      bankName: "",
      bankAccountNumber: "",
      branchName: "",
      ifscCode: "",
      status: "",
      licenseRenewalDate: "",
      reelerNumber: "",
      reelerTypeMasterId: "",
      transferReelerId: "0",
      username: "",
      aadhaarNumber: "",
    });
    setSearchValidated(false);
  };

  // Switching between "With License" / "Without License" wipes the form back to
  // blank, the same as pressing the existing "Clear" button.
  useEffect(() => {
    clear();
    setValidated(false);
  }, [location.search]);

  const [data, setData] = useState({
    fruitsId: "",
    reelerName: "",
    wardNumber: "",
    tscMasterId: "",
    passbookNumber: "",
    fatherName: "",
    educationId: "",
    reelingUnitBoundary: "",
    dob: "",
    rationCard: "",
    machineTypeId: "",
    gender: "",
    dateOfMachineInstallation: "",
    electricityRrNumber: "",
    casteId: "",
    revenueDocument: "",
    numberOfBasins: "",
    mobileNumber: "",
    recipientId: "",
    mahajarDetails: "",
    emailId: "",
    representativeNameAddress: "",
    loanDetails: "",
    assignToInspectId: "",
    gpsLat: "",
    gpsLng: "",
    inspectionDate: "",
    arnNumber: "",
    chakbandiLat: "",
    chakbandiLng: "",
    address: "",
    pincode: "",
    stateId: "",
    districtId: "",
    talukId: "",
    hobliId: "",
    villageId: "",
    licenseReceiptNumber: "",
    licenseExpiryDate: "",
    receiptDate: "",
    functionOfUnit: "",
    reelingLicenseNumber: "",
    feeAmount: "",
    memberLoanDetails: "",
    mahajarEast: "",
    mahajarWest: "",
    mahajarNorth: "",
    mahajarSouth: "",
    mahajarNorthEast: "",
    mahajarNorthWest: "",
    mahajarSouthEast: "",
    mahajarSouthWest: "",
    bankName: "",
    bankAccountNumber: "",
    branchName: "",
    ifscCode: "",
    status: "",
    licenseRenewalDate: "",
    reelerNumber: "",
    reelerTypeMasterId: "",
    transferReelerId: "0",
    username: "",
    aadhaarNumber: "",
  });

  const [searchValidated, setSearchValidated] = useState(false);
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
      api
        .post(
          baseURLFarmer + `reeler/get-reeler-details-by-fruits-id`,
          { fruitsId: data.fruitsId },
          // {
          //   headers: _header,
          // }
        )
        .then((response) => {
          // console.log("Hello");
          if (response.data.content) {
            const reelerId = response.data.content.reelerResponse.reelerId;
            navigate(`/seriui/reeler-license-edit/${reelerId}`);
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
                const dump = result.data.content.farmerResponse;
                let dump1 = "";
                if (
                  result.data.content.farmerAddressList &&
                  result.data.content.farmerAddressList.length
                ) {
                  dump1 = result.data.content.farmerAddressList[0];
                }

                if (dump) {
                  setData((prev) => ({
                    ...prev,
                    // ...result.data.content.farmerResponse,
                    reelerName: dump.firstName,
                    fatherName: dump.fatherName,
                    gender: dump.genderId,
                    casteId: dump.casteId,
                    address: dump1 ? dump1.addressText : "",
                  }));
                }

                if (result.data.content.error) {
                  saveError(result.data.content.error_description);
                }
                // setFarmerAddressList((prev) => [
                //   ...prev,
                //   ...result.data.content.farmerAddressList,
                // ]);
                // setFarmerLandList((prev) => [
                //   ...prev,
                //   ...result.data.content.farmerLandDetailsList,
                // ]);
              })
              .catch((error) => {});
          }
        })
        .catch((error) => {
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
              // console.log(result);
              // console.log("result",result);
              const dump = result.data.content.farmerResponse;
              let dump1 = "";
              if (
                result.data.content.farmerAddressList &&
                result.data.content.farmerAddressList.length
              ) {
                dump1 = result.data.content.farmerAddressList[0];
              }
              if (dump) {
                setData((prev) => ({
                  ...prev,
                  // ...result.data.content.farmerResponse,
                  reelerName: dump.firstName,
                  fatherName: dump.fatherName,
                  gender: dump.genderId,
                  casteId: dump.casteId,
                  address: dump1 ? dump1.addressText : "",
                }));
              }

              if (result.data.content.error) {
                saveError(result.data.content.error_description);
              }
            })
            .catch((error) => {});
        });
    }
  };

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    // setData({ ...data, [name]: value });

    if (name === "mobileNumber" && (value.length < 10 || value.length > 10)) {
      console.log("hellohello");
      e.target.classList.add("is-invalid");
      e.target.classList.remove("is-valid");
    } else if (name === "mobileNumber" && value.length === 10) {
      e.target.classList.remove("is-invalid");
      e.target.classList.add("is-valid");
    }

    if (name === "ifscCode" && (value.length < 11 || value.length > 11)) {
      e.target.classList.add("is-invalid");
      e.target.classList.remove("is-valid");
    } else if (name === "ifscCode" && value.length === 11) {
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
    if (["bankName", "branchName", "ifscCode"].includes(name)) {
      value = value.toUpperCase();
    }

    setData({ ...data, [name]: value });
  };

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const date = String(now.getDate()).padStart(2, "0");

    const timeString = hours + minutes + seconds + date + month + year;
    setData((prev) => ({ ...prev, reelerNumber: timeString }));
  }, [data.fruitsId]);

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
      if (data.mobileNumber.length < 10 || data.mobileNumber.length > 10) {
        return;
      }

      if (data.ifscCode.length < 11 || data.ifscCode.length > 11) {
        return;
      }

      if (data.fruitsId.length < 16 || data.fruitsId.length > 16) {
        return;
      }

      const FormDob = dateFormatter(data.dob);
      const FormDateOfMachineInstallation = dateFormatter(
        data.dateOfMachineInstallation,
      );
      const FormInspectionDate = dateFormatter(data.inspectionDate);
      const FormLicenseExpiryDate = dateFormatter(data.licenseExpiryDate);
      const FormReceiptDate = dateFormatter(data.receiptDate);
      const FormLicenseRenewalDate = dateFormatter(data.licenseRenewalDate);

      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const date = String(now.getDate()).padStart(2, "0");

      const timeString = hours + minutes + seconds + date + month + year;
      // setData((prev) => ({ ...prev, reelerNumber: timeString }));
      const updatedData = {
  ...data,
  reelerNumber: timeString,
};

      api
        .post(baseURL + `reeler/add`, {
          ...updatedData,
          dob: FormDob,
          dateOfMachineInstallation: FormDateOfMachineInstallation,
          inspectionDate: FormInspectionDate,
          licenseExpiryDate: FormLicenseExpiryDate,
          receiptDate: FormReceiptDate,
          licenseRenewalDate: FormLicenseRenewalDate,
        })
        .then((response) => {
          if (response.data.content.reelerId) {
            const mahajarId = response.data.content.reelerId;
            handleMahajarUpload(mahajarId);
          }
          if (response.data.content.error) {
            const reelerError = response.data.content.error_description;
            saveReelerError(reelerError);
          } else {
            const arnNumber = response.data.content.arnNumber;
            if (vbAccountList.length > 0) {
              const reelerId = response.data.content.reelerId;
              vbAccountList.forEach((list) => {
                const updatedVb = {
                  ...list,
                  reelerId: reelerId,
                };
                api
                  .post(baseURL + `reeler-virtual-bank-account/add`, updatedVb)
                  .then((response) => {
                    if (response.data.content.error) {
                      const bankError = response.data.content.error_description;
                      saveReelerError(bankError);
                    } else {
                      saveSuccess(arnNumber, updatedData.reelerNumber);
                    }
                  })
                  .catch((err) => {
                    setVbAccount({});
                    if (
                      Object.keys(err.response.data.validationErrors).length > 0
                    ) {
                      saveError(err.response.data.validationErrors);
                    }
                  });
              });
            } else {
              saveSuccess(arnNumber, updatedData.reelerNumber);
            }
          }
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
              saveError(err.response.data.validationErrors);
              return;
            }
          }
        });
      setValidated(true);
    }
  };

  // to get tsc
  const [tscListData, setTscListData] = useState([]);

  const getTscList = () => {
    const response = api
      .get(baseURL2 + `tscMaster/get-all`)
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

  // // to get User
  // const [userListData, setUserListData] = useState([]);

  // const getUserList = () => {
  //   const response = api
  //     .get(baseURL2 + `userMaster/get-all`)
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

  // to get taluk
  const [userListData, setUserListData] = useState([]);

  const getUserList = (_id) => {
    const response = api
      .get(baseURL2 + `userMaster/get-by-tsc-master-id/${_id}`)
      .then((response) => {
        if (response.data.content.userMaster) {
          setUserListData(response.data.content.userMaster);
        }
      })
      .catch((err) => {
        setUserListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.tscMasterId) {
      getUserList(data.tscMasterId);
    }
  }, [data.tscMasterId]);

  // to get Caste
  const [casteListData, setCasteListData] = useState([]);

  const getCasteList = () => {
    api
      .get(baseURL2 + `caste/get-all`)
      .then((response) => {
        setCasteListData(response.data.content.caste);
      })
      .catch((err) => {
        setCasteListData([]);
      });
  };

  useEffect(() => {
    getCasteList();
  }, []);

  // to get Reeler Type
  const [reelerTypeListData, setReelerTypeListData] = useState([]);

  const getReelerTypeList = () => {
    api
      .get(baseURL2 + `reelerTypeMaster/get-all`)
      .then((response) => {
        setReelerTypeListData(response.data.content.reelerTypeMaster);
      })
      .catch((err) => {
        setReelerTypeListData([]);
      });
  };

  useEffect(() => {
    getReelerTypeList();
  }, []);

  // to get Education
  const [educationListData, setEducationListData] = useState([]);

  const getEducationList = () => {
    api
      .get(baseURL2 + `education/get-all`)
      .then((response) => {
        setEducationListData(response.data.content.education);
      })
      .catch((err) => {
        setEducationListData([]);
      });
  };

  useEffect(() => {
    getEducationList();
  }, []);

  // to get Machine Type
  const [machineTypeListData, setMachineTypeListData] = useState([]);

  const getMachineTypeList = () => {
    api
      .get(baseURL2 + `machine-type-master/get-all`)
      .then((response) => {
        setMachineTypeListData(response.data.content.machineTypeMaster);
      })
      .catch((err) => {
        setMachineTypeListData([]);
      });
  };

  useEffect(() => {
    getMachineTypeList();
  }, []);

  // to get Market
  const [marketMasterListData, setMarketMasterListData] = useState([]);

  const getMarketMasterList = () => {
    api
      .get(baseURL2 + `marketMaster/get-all`)
      .then((response) => {
        setMarketMasterListData(response.data.content.marketMaster);
      })
      .catch((err) => {
        setMarketMasterListData([]);
      });
  };

  useEffect(() => {
    getMarketMasterList();
  }, []);

  // to get State
  const [stateListData, setStateListData] = useState([]);

  const getList = () => {
    api
      .get(baseURL2 + `state/get-all`)
      .then((response) => {
        setStateListData(response.data.content.state);
      })
      .catch((err) => {
        setStateListData([]);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  // to get district
  const [districtListData, setDistrictListData] = useState([]);

  const getDistrictList = (_id) => {
    api
      .get(baseURL2 + `district/get-by-state-id/${_id}`)
      .then((response) => {
        setDistrictListData(response.data.content.district);
      })
      .catch((err) => {
        setDistrictListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.stateId) {
      getDistrictList(data.stateId);
    }
  }, [data.stateId]);

  // to get taluk
  const [talukListData, setTalukListData] = useState([]);

  const getTalukList = (_id) => {
    api
      .get(baseURL2 + `taluk/get-by-district-id/${_id}`)
      .then((response) => {
        setTalukListData(response.data.content.taluk);
      })
      .catch((err) => {
        setTalukListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.districtId) {
      getTalukList(data.districtId);
    }
  }, [data.districtId]);

  // to get hobli
  const [hobliListData, setHobliListData] = useState([]);

  const getHobliList = (_id) => {
    api
      .get(baseURL2 + `hobli/get-by-taluk-id/${_id}`)
      .then((response) => {
        setHobliListData(response.data.content.hobli);
      })
      .catch((err) => {
        setHobliListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.talukId) {
      getHobliList(data.talukId);
    }
  }, [data.talukId]);

  // to get Village
  const [villageListData, setVillageListData] = useState([]);

  const getVillageList = (_id) => {
    api
      .get(baseURL2 + `village/get-by-hobli-id/${_id}`)
      .then((response) => {
        setVillageListData(response.data.content.village);
      })
      .catch((err) => {
        setVillageListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.hobliId) {
      getVillageList(data.hobliId);
    }
  }, [data.hobliId]);

  // Multi-document upload state
  const [documents, setDocuments] = useState([
    { id: 1, label: "Mahajar Details", file: null, fileName: "", uploaded: false },
  ]);

  const handleDocLabelChange = (id, value) => {
    setDocuments((prev) => prev.map((d) => d.id === id ? { ...d, label: value } : d));
  };

  const handleDocFileChange = (id, e) => {
    const file = e.target.files[0];
    if (!file) return;
    setDocuments((prev) => prev.map((d) => d.id === id ? { ...d, file, fileName: file.name, uploaded: false } : d));
  };

  const addDocumentRow = () => {
    setDocuments((prev) => [...prev, { id: Date.now(), label: "", file: null, fileName: "", uploaded: false }]);
  };

  const removeDocumentRow = (id) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  // Upload all selected documents to S3
  const handleMahajarUpload = async (reelerid) => {
    for (const doc of documents) {
      if (!doc.file) continue;
      const parameters = `reelerId=${reelerid}`;
      try {
        const formData = new FormData();
        formData.append("multipartFile", doc.file);
        await api.post(baseURL + `reeler/upload-document?${parameters}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setDocuments((prev) => prev.map((d) => d.id === doc.id ? { ...d, uploaded: true } : d));
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  // Keep mahajarDetails in sync with first doc filename for save payload
  useEffect(() => {
    const first = documents[0];
    if (first?.fileName) {
      setData((prev) => ({ ...prev, mahajarDetails: first.fileName }));
    }
  }, [documents]);

  const navigate = useNavigate();
  // const saveSuccess = (arn) => {
  //   Swal.fire({
  //     icon: "success",
  //     title: "Saved successfully",
  //     text: `Generated ARN Number is ${arn}`,
  //     text: `Reeler Number: ${data.reelerNumber}`,
  //   }).then(() => navigate("/seriui/reeler-license-list"));
  // };
  const saveSuccess = (arn, reelerNumber) => {
  Swal.fire({
    icon: "success",
    title: "Saved successfully",
    html: `
      Generated ARN Number: <b>${arn}</b><br/>
      Reeler Number: <b>${reelerNumber}</b>
    `,
  }).then(() => navigate("/seriui/reeler-license-list"));
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

  const saveReelerError = (message) => {
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      text: message,
    });
  };

  // // const YourFormComponent = ({ data, handleDateChange }) => {
  // const handleRenewedDateChange = (date) => {
  //   // Calculate expiration date by adding 3 years to the renewed date
  //   const expirationDate = new Date(date);
  //   expirationDate.setFullYear(expirationDate.getFullYear() + 3);

  //   setData({
  //     ...data,
  //     receiptDate: date,
  //     licenseExpiryDate: expirationDate,
  //   });
  // };

  const handleRenewedDateChange = (date) => {
    if (!date) return;

    const receiptDate = new Date(date);
    let expiryYear;

    if (receiptDate.getMonth() + 1 >= 4) {
      // If April (4) or later → expiry = 31st March (year + 3)
      expiryYear = receiptDate.getFullYear() + 3;
    } else {
      // If Jan–Mar → expiry = 31st March (year + 2)
      expiryYear = receiptDate.getFullYear() + 2;
    }

    const expirationDate = new Date(expiryYear, 2, 31); // March is month=2 (0-indexed)

    setData({
      ...data,
      receiptDate,
      licenseExpiryDate: expirationDate,
    });
  };

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  // Handle Options
  // Market
  const handleMarketOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setVbAccount({
      ...vbAccount,
      marketMasterId: chooseId,
      marketMasterName: chooseName,
    });
  };

  // Display Document
  const [document, setDocument] = useState("");

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    setDocument(file);
  };

  // Date Formate
  const dateFormatter = (date) => {
    if (date) {
      return (
        new Date(date).getFullYear() +
        "-" +
        (new Date(date).getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        new Date(date).getDate().toString().padStart(2, "0")
      );
    } else {
      return "";
    }
  };

  return (
    <Layout title="Reeler License">
      <style>{reelerFormStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("Reeler License")}
                <span className="sh-mode-badge">
                  {withLicense ? t("With License") : t("Without License")}
                </span>
              </Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/reeler-license-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span> {t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/reeler-license-list"
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
        {/* <Form action="#"> */}
        <Form noValidate validated={searchValidated} onSubmit={search}>
          <Card className="sh-search-card">
            <Card.Body>
              <Row className="g-gs">
                <Col lg="12">
                  <Form.Group as={Row} className="form-group" controlId="fid">
                    <Form.Label column sm={1} className="sh-fruits-label">
                      {t("FRUITS ID")}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Col sm={4}>
                      <Form.Control
                        type="fruitsId"
                        name="fruitsId"
                        value={data.fruitsId}
                        onChange={handleInputs}
                        placeholder={t("Enter FRUITS ID")}
                        maxLength="16"
                        readOnly={disable}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {t("Fruits ID Should Contain 16 digits")}.
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
                  <span>{t("Reeler Personal info")}</span>
                </Card.Header>
                <Card.Body>
                  <Row className="g-gs">
                    <Col lg="4">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="reelerName">
                          {t("Reeler Name")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="reelerName"
                            name="reelerName"
                            value={data.reelerName}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Reeler Name")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {t("Reeler Name is required.")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="fatherName">
                          {t("Father's/Husband's Name")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="fatherName"
                            name="fatherName"
                            value={data.fatherName}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Father's/Husband's Name")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {t("Fathers/Husband Name is required.")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      {/* <Form.Group className="form-group mt-3">
                        <Form.Label>{t("DOB")}</Form.Label>
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
                          />
                        </div>
                      </Form.Group> */}

                      <Form.Group className="form-group mt-3">
                        <Form.Label>{t("Gender")}</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="gender"
                            value={data.gender}
                            onChange={handleInputs}
                          >
                            <option value="">{t("select_gender")}</option>
                            <option value="1">{t("Male")}</option>
                            <option value="2">{t("Female")}</option>
                            <option value="3">{t("Other")}</option>
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
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.casteId === undefined || data.casteId === "0"
                            }
                          >
                            <option value="">{t("select_Caste")}</option>
                            {casteListData.map((list) => (
                              <option key={list.id} value={list.id}>
                                {i18n.language === "kn"
                                  ? list.nameInKannada
                                  : list.title}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {t("caste_is_required")}
                          </Form.Control.Feedback>
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
                            maxLength="10"
                            type="tel"
                            placeholder={t("enter_mobile_number")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Mobile Number is required or Number is greater than
                            and less than 10 Digit
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="emailId">
                          {t("email_id")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="emailId"
                            name="emailId"
                            value={data.emailId}
                            onChange={handleInputs}
                            type="email"
                            placeholder={t("enter_email_id")}
                          />
                        </div>
                      </Form.Group>

                      {/* <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="aadhaarNumber">
                          {t("Aadhaar Number")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="aadhaarNumber"
                            name="aadhaarNumber"
                            value={data.aadhaarNumber}
                            //  onChange={handleInputs}
                            type="aadhaarNumber"
                            placeholder={t("Enter Aadhaar Number")}
                          />
                        </div>
                      </Form.Group> */}

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

                      {/* <Form.Group className="form-group mt-3">
                        <Form.Label>Assign To Inspect</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="assignToInspectId"
                            value={data.assignToInspectId}
                            onChange={handleInputs}
                          >
                            <option value="">Select TSC</option>
                            <option value="1">TSC(G)</option>
                            <option value="2">TSC(R)</option>
                            <option value="3">PCT</option>
                          </Form.Select>
                        </div>
                      </Form.Group> */}

                      {/* <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="reelerNumber">
                          {t("Reeler Number")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="reelerNumber"
                            name="reelerNumber"
                            value={data.reelerNumber}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Reeler Number")}
                          />
                          <Form.Control.Feedback type="invalid">
                            Reeler Number is required.
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group> */}
                    </Col>

                    <Col lg="4">
                      {/* <Form.Group className="form-group">
                        <Form.Label htmlFor="wnumber">{t("Ward Number")}</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="wardNumber"
                            name="wardNumber"
                            value={data.wardNumber}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Ward Number")}
                          />
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
                            <option value="0">{t("select_education")}</option>
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

                      {/* <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="rationCard">
                        {t("ration_number")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="rationCard"
                            name="rationCard"
                            value={data.rationCard}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("enter_ration_number")}
                          />
                        </div>
                      </Form.Group> */}

                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="rrno">
                          {t("Electricity RR Numbers")}
                          {withLicense && <span className="text-danger">*</span>}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="electricityRrNumber"
                            name="electricityRrNumber"
                            value={data.electricityRrNumber}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Electricity RR Numbers")}
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="revenueDocument">
                          {t("Revenue Document (e-Khata / Reeling Unit)")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="revenueDocument"
                            name="revenueDocument"
                            value={data.revenueDocument}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Revenue Document")}
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="recipientId">
                          {t("Recipient ID(From Khazane)")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="recipientId"
                            name="recipientId"
                            value={data.recipientId}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Recipient ID")}
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="representativeNameAddress">
                          {t("Representative/Agent name and Address")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="representativeNameAddress"
                            name="representativeNameAddress"
                            value={data.representativeNameAddress}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t(
                              "Enter Representative/Agent name and Address",
                            )}
                          />
                        </div>
                      </Form.Group>
                      {/* <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="gpsLat">
                          GPS Coordinates of reeling unit
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="gpsLat"
                            name="gpsLat"
                            value={data.gpsLat}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter GPS Coordinates of reeling unit"
                          />
                        </div>
                      </Form.Group> */}
                      {/* <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="chakbandi">
                          {t("GPS Coordinates of reeling unit")}
                        </Form.Label>
                        <Row>
                          <Col lg="6">
                            <Form.Control
                              id="chakbandiLng"
                              name="chakbandiLng"
                              value={data.chakbandiLng}
                              onChange={handleInputs}
                              placeholder={t("Enter Longitude")}
                            />
                          </Col>

                          <Col lg="6">
                            <Form.Control
                              id="chakbandiLat"
                              name="chakbandiLat"
                              value={data.chakbandiLat}
                              onChange={handleInputs}
                              type="text"
                              placeholder={t("Enter Latitude")}
                            />
                          </Col>
                        </Row>
                      </Form.Group> */}
                      <Form.Group className="form-group mt-3">
                        <Form.Label>
                          {t("Reeler Type")}
                          {withLicense && <span className="text-danger">*</span>}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="reelerTypeMasterId"
                            value={data.reelerTypeMasterId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required={withLicense}
                            isInvalid={
                              withLicense &&
                              (data.reelerTypeMasterId === undefined ||
                                data.reelerTypeMasterId === "0")
                            }
                          >
                            <option value="">{t("Select Reeler Type")}</option>
                            {reelerTypeListData.map((list) => (
                              <option
                                key={list.reelerTypeMasterId}
                                value={list.reelerTypeMasterId}
                              >
                                {i18n.language === "kn"
                                  ? list.reelerTypeNameInKannada
                                  : list.reelerTypeMasterName}
                              </option>
                            ))}
                          </Form.Select>
                        </div>
                      </Form.Group>
                      <Form.Control.Feedback type="invalid">
                        {"Reeler Type is required"}
                      </Form.Control.Feedback>
                      <Form.Group className="form-group mt-3">
                        <Form.Label>
                          {t("Assign To Inspect")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="assignToInspectId"
                            value={data.assignToInspectId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.assignToInspectId === undefined ||
                              data.assignToInspectId === "0"
                            }
                          >
                            <option value="">
                              {t("Select Assign To Inspect")}
                            </option>
                            {userListData.map((list) => (
                              <option
                                key={list.userMasterId}
                                value={list.userMasterId}
                              >
                                {list.username}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {t("Assign To Inspect is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="passbook">
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
                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="reelunt">
                          {t("Reeling Unit Boundary(In Sqft)")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="reelingUnitBoundary"
                            name="reelingUnitBoundary"
                            value={data.reelingUnitBoundary}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Reeling Unit Boundary")}
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label>
                          {t("Machine Type")}
                          {withLicense && <span className="text-danger">*</span>}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="machineTypeId"
                            value={data.machineTypeId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required={withLicense}
                            isInvalid={
                              withLicense &&
                              (data.machineTypeId === undefined ||
                                data.machineTypeId === "0")
                            }
                          >
                            <option value="">{t("Select Machine Type")}</option>
                            {machineTypeListData.map((list) => (
                              <option
                                key={list.machineTypeId}
                                value={list.machineTypeId}
                              >
                                {i18n.language === "kn"
                                  ? list.machineTypeNameInKannada
                                  : list.machineTypeName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {t("Machine Type is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label>
                          {t("Date of Machine Installation")}
                          {withLicense && <span className="text-danger">*</span>}
                        </Form.Label>
                        <div className="form-control-wrap">
                          {/* <DatePicker
                            selected={data.dateOfMachineInstallation}
                            onChange={(date) =>
                              handleDateChange(
                                date,
                                "dateOfMachineInstallation"
                              )
                            }
                          /> */}
                          <DatePicker
                            selected={data.dateOfMachineInstallation}
                            onChange={(date) =>
                              handleDateChange(
                                date,
                                "dateOfMachineInstallation",
                              )
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            // maxDate={new Date()}
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="numberOfBasins">
                          {t("Number of Basins/Charaka")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="numberOfBasins"
                            name="numberOfBasins"
                            value={data.numberOfBasins}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Number of Basins/Charaka")}
                          />
                        </div>
                      </Form.Group>

                      {/* <Form.Group className="form-group mt-3">
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
                              data.tscMasterId === undefined || data.tscMasterId === "0"
                            }
                          >
                            <option value="">Select TSC</option>
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
                            TSC is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group> */}

                      {/* <Col lg="4"> */}
                      {/* Multi-document upload + Loan Details + Inspection Date in one row */}
                      <Row className="g-3 mt-1">
                        <Col lg="8">
                          <Form.Group className="form-group">
                            <Form.Label style={{ fontWeight: "600", color: "#1a3c6e", fontSize: "13px" }}>
                              {t("Upload Documents")} <small style={{ color: "#6b7280", fontWeight: "400" }}>(PDF / JPG / PNG / MP4 — Max 5MB each)</small>
                            </Form.Label>
                            <div style={{ border: "1px solid #dce8f5", borderRadius: "10px", overflow: "hidden", background: "#f8faff" }}>
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto", background: "#e8f0fb", padding: "8px 12px", fontSize: "11.5px", fontWeight: "700", color: "#1a3c6e", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                                <span>Document Type</span>
                                <span>File</span>
                                <span></span>
                              </div>
                              {documents.map((doc, idx) => (
                                <div key={doc.id} style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto", gap: "8px", alignItems: "center", padding: "10px 12px", borderTop: idx > 0 ? "1px solid #dce8f5" : "none", background: "#fff" }}>
                                  <Form.Control
                                    type="text"
                                    placeholder="e.g. Mahajar, Aadhaar…"
                                    value={doc.label}
                                    onChange={(e) => handleDocLabelChange(doc.id, e.target.value)}
                                    style={{ fontSize: "12.5px", padding: "6px 10px", borderRadius: "6px", border: "1.5px solid #c9d8ec" }}
                                  />
                                  <div>
                                    <Form.Control
                                      type="file"
                                      accept=".pdf,.jpg,.jpeg,.png,.gif,.mp4,.mov,.avi"
                                      onChange={(e) => handleDocFileChange(doc.id, e)}
                                      style={{ fontSize: "12px", padding: "4px 8px", borderRadius: "6px", border: "1.5px solid #c9d8ec" }}
                                    />
                                    {doc.fileName && (
                                      <div style={{ fontSize: "11px", color: doc.uploaded ? "#0d7a4f" : "#1a5fa8", marginTop: "3px", display: "flex", alignItems: "center", gap: "4px" }}>
                                        {doc.uploaded ? "✔" : "📎"} {doc.fileName}
                                      </div>
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeDocumentRow(doc.id)}
                                    disabled={documents.length === 1}
                                    style={{ background: "none", border: "none", color: documents.length === 1 ? "#ccc" : "#dc2626", fontSize: "16px", cursor: documents.length === 1 ? "default" : "pointer", padding: "2px 6px", lineHeight: 1 }}
                                    title="Remove"
                                  >✕</button>
                                </div>
                              ))}
                              <div style={{ padding: "8px 12px", borderTop: "1px solid #dce8f5", background: "#f8faff" }}>
                                <button
                                  type="button"
                                  onClick={addDocumentRow}
                                  style={{ background: "none", border: "1.5px dashed #1a5fa8", color: "#1a5fa8", borderRadius: "6px", padding: "5px 14px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
                                >
                                  + Add Another Document
                                </button>
                              </div>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="4">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="loanDetails">{t("loan_details")}</Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="loanDetails"
                                name="loanDetails"
                                value={data.loanDetails}
                                onChange={handleInputs}
                                type="text"
                                placeholder={t("enter_loan_details")}
                              />
                            </div>
                          </Form.Group>

                          <Form.Group className="form-group mt-3">
                            <Form.Label>{t("Mahajar/Inspection Date")}</Form.Label>
                            <div className="form-control-wrap">
                              <DatePicker
                                selected={data.inspectionDate}
                                onChange={(date) => handleDateChange(date, "inspectionDate")}
                                peekNextMonth
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                              />
                            </div>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
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
                  <Row className="g-gs">
                    <Col lg="4">
                      <Form.Group className="form-group">
                        <Form.Label>
                          {t("state")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="stateId"
                            value={data.stateId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.stateId === undefined || data.stateId === "0"
                            }
                          >
                            <option value="">{t("select_state")}</option>
                            {stateListData.map((list) => (
                              <option key={list.stateId} value={list.stateId}>
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

                      <Form.Group className="form-group mt-3">
                        <Form.Label>
                          {t("district")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="districtId"
                            value={data.districtId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.districtId === undefined ||
                              data.districtId === "0"
                            }
                          >
                            <option value="">{t("select_district")}</option>
                            {districtListData && districtListData.length
                              ? districtListData.map((list) => (
                                  <option
                                    key={list.districtId}
                                    value={list.districtId}
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
                      <Form.Group className="form-group mt-3">
                        <Form.Label>
                          {t("taluk")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="talukId"
                            value={data.talukId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.talukId === undefined || data.talukId === "0"
                            }
                          >
                            <option value="">{t("select_taluk")}</option>
                            {talukListData && talukListData.length
                              ? talukListData.map((list) => (
                                  <option
                                    key={list.talukId}
                                    value={list.talukId}
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
                    <Col lg="4">
                      <Form.Group className="form-group">
                        <Form.Label>
                          {t("hobli")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="hobliId"
                            value={data.hobliId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.hobliId === undefined || data.hobliId === "0"
                            }
                          >
                            <option value="">{t("select_hobli")}</option>
                            {hobliListData && hobliListData.length
                              ? hobliListData.map((list) => (
                                  <option
                                    key={list.hobliId}
                                    value={list.hobliId}
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
                      <Form.Group className="form-group mt-3">
                        <Form.Label>
                          {t("village")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="villageId"
                            value={data.villageId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.villageId === undefined ||
                              data.villageId === "0"
                            }
                          >
                            <option value="">{t("select_village")}</option>
                            {villageListData && villageListData.length
                              ? villageListData.map((list) => (
                                  <option
                                    key={list.villageId}
                                    value={list.villageId}
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

                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="pincode">
                          {t("pin_code")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="pincode"
                            name="pincode"
                            value={data.pincode}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("enter_pin_code")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Pincode is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="address">
                          {t("address")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            as="textarea"
                            id="address"
                            name="address"
                            value={data.address}
                            onChange={handleInputs}
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
                  </Row>
                </Card.Body>
              </Card>
            </Block>

            <Block className="mt-3">
              <Card>
                <Card.Header className="sh-section-header">
                  <Icon name="award" />
                  <span>{t("License Details")}</span>
                </Card.Header>
                <Card.Body>
                  <Row className="g-gs">
                    <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="licenseReceiptNumber">
                          {t("Receipt number")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="licenseReceiptNumber"
                            name="licenseReceiptNumber"
                            value={data.licenseReceiptNumber}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Receipt number")}
                            // required
                          />
                          {/* <Form.Control.Feedback type="invalid">
                            Receipt number is required
                          </Form.Control.Feedback> */}
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="reelingLicenseNumber">
                          {t("Reeling License Number")}
                          {withLicense && <span className="text-danger">*</span>}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="reelingLicenseNumber"
                            name="reelingLicenseNumber"
                            value={data.reelingLicenseNumber}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Reeling License Number")}
                            required={withLicense}
                          />
                          <Form.Control.Feedback type="invalid">
                            {t("Reeling License Number is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="memberLoanDetails">
                          {t("Member of RCS/FPO/Others")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="memberLoanDetails"
                            name="memberLoanDetails"
                            value={data.memberLoanDetails}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Member of RCS/FPO/Others")}
                          />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="feeAmount">
                          {t("Fee Amount")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="feeAmount"
                            name="feeAmount"
                            value={data.feeAmount}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Fee Amount")}
                          />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>{t("Function of the Unit")}</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="functionOfUnit"
                            value={data.functionOfUnit}
                            onChange={handleInputs}
                          >
                            <option value="">{t("Select")}</option>
                            <option value="1">{t("Yes")}</option>
                            <option value="2">{t("No")}</option>
                          </Form.Select>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="2">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>{t("Receipt Date")}</Form.Label>
                        <div className="form-control-wrap">
                          <DatePicker
                            selected={data.receiptDate}
                            onChange={(date) =>
                              handleRenewedDateChange(date, "receiptDate")
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                          />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="2">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>{t("License Expiry Date")}</Form.Label>
                        <div className="form-control-wrap">
                          <DatePicker
                            selected={data.licenseExpiryDate}
                            onChange={(date) =>
                              handleDateChange(date, "licenseExpiryDate")
                            }
                            disabled={data.licenseRenewalDate !== null}
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                          />
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Block>

            <Block className="mt-3">
              <Card>
                <Card.Header className="sh-section-header">
                  <Icon name="crop" />
                  <span>{t("Chakbandi Details")}</span>
                </Card.Header>
                <Card.Body>
                  <Row className="g-gs">
                    <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="mahajarEast">
                          {t("East")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="mahajarEast"
                            name="mahajarEast"
                            value={data.mahajarEast}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter East")}
                            // required
                          />
                          {/* <Form.Control.Feedback type="invalid">
                            This Field is required
                          </Form.Control.Feedback> */}
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="mahajarWest">
                          {t("West")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="mahajarWest"
                            name="mahajarWest"
                            value={data.mahajarWest}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("West")}
                            // required
                          />
                          {/* <Form.Control.Feedback type="invalid">
                            This Field is required
                          </Form.Control.Feedback> */}
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="mahajarNorth">
                          {t("North")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="mahajarNorth"
                            name="mahajarNorth"
                            value={data.mahajarNorth}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("North")}
                            // required
                          />
                          {/* <Form.Control.Feedback type="invalid">
                            This Field is required
                          </Form.Control.Feedback> */}
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="mahajarSouth">
                          {t("South")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="mahajarSouth"
                            name="mahajarSouth"
                            value={data.mahajarSouth}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("South")}
                            // required
                          />
                          {/* <Form.Control.Feedback type="invalid">
                            This Field is required
                          </Form.Control.Feedback> */}
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
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
                      <Form.Group className="form-group ">
                        <Form.Label htmlFor="bankName">
                          {t("bank_name")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="bankName"
                            name="bankName"
                            value={data.bankName}
                            onChange={handleInputs}
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
                        <Form.Label htmlFor="branchName">
                          {t("branch_name")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="branchName"
                            name="branchName"
                            value={data.branchName}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("enter_branch_name")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Branch Name is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="accno">
                          {t("bank_account_number")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="bankAccountNumber"
                            name="bankAccountNumber"
                            value={data.bankAccountNumber}
                            onChange={handleInputs}
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
                        <Form.Label htmlFor="ifsc">
                          {t("ifsc_code")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="ifscCode"
                            name="ifscCode"
                            value={data.ifscCode}
                            onChange={handleInputs}
                            maxLength="11"
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
                  {/* <h3>Virtual Bank account</h3> */}
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
                                <span> {t("add")}</span>
                              </Button>
                            </li>
                            <li>
                              <Button
                                className="d-none d-md-inline-flex"
                                variant="primary"
                                onClick={handleShowModal}
                              >
                                <Icon name="plus" />
                                <span> {t("add")}</span>
                              </Button>
                            </li>
                          </ul>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  {vbAccountList.length > 0 ? (
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
                                  <th>{t("Virtual Account Number")}</th>
                                  <th>{t("branch_name")}</th>
                                  <th>{t("ifsc_code")}</th>
                                  <th>{t("Market")}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {vbAccountList.map((item, i) => (
                                  <tr>
                                    <td>
                                      <div>
                                        <Button
                                          variant="primary"
                                          size="sm"
                                          onClick={() => handleGet(i)}
                                        >
                                          {t("edit")}
                                        </Button>
                                        <Button
                                          variant="danger"
                                          size="sm"
                                          onClick={() => handleDelete(i)}
                                          className="ms-2"
                                        >
                                          {t("delete")}
                                        </Button>
                                      </div>
                                    </td>
                                    <td>{item.virtualAccountNumber}</td>
                                    <td>{item.branchName}</td>
                                    <td>{item.ifscCode}</td>
                                    <td>{item.marketMasterName}</td>
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

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  {/* <Button type="button" variant="primary" onClick={postData}> */}
                  <Button type="submit" variant="primary" className="shadow-sm px-4 py-2">
                    <Icon name="check" className="me-1" />
                    {t("save")}
                  </Button>
                </li>
                <li>
                  <Link
                    to="/seriui/reeler-license-list"
                    className="btn sh-cancel-btn shadow-sm px-4 py-2"
                  >
                    <Icon name="cross" className="me-1" />
                    {t("cancel")}
                  </Link>
                </li>
              </ul>
            </div>
          </Row>
        </Form>
      </Block>

      <Modal show={showModal} onHide={handleCloseModal} size="xl" centered contentClassName="sh-modal-content">
        <Modal.Header closeButton>
          <Modal.Title>
            <Icon name="wallet" className="me-1" />
            Add Virtual Bank Account Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Form action="#"> */}
          <Form noValidate validated={validatedVbAccount} onSubmit={handleAdd}>
            <Row className="g-5 px-5">
              <Col lg="6">
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="virtualAccountNumber">
                    {t("Virtual Account Number")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="virtualAccountNumber"
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

                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="branchNamevb">
                    {t("branch_name")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="branchNamevb"
                      name="branchName"
                      value={vbAccount.branchName}
                      onChange={handleVbInputs}
                      type="text"
                      placeholder={t("enter_branch_name")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Branch Name is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="ifscCodevb">
                    {t("ifsc_code")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="ifscCodevb"
                      name="ifscCode"
                      value={vbAccount.ifscCode}
                      onChange={handleVbInputs}
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

                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    {t("Market")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="marketMasterId"
                      // value={vbAccount.marketMasterId}
                      value={`${vbAccount.marketMasterId}_${vbAccount.marketMasterName}`}
                      onChange={handleMarketOption}
                      onBlur={() => handleMarketOption}
                      required
                      isInvalid={
                        vbAccount.marketMasterId === undefined ||
                        vbAccount.marketMasterId === "0"
                      }
                    >
                      <option value="">{t("Select Market")}</option>
                      {marketMasterListData.length
                        ? marketMasterListData.map((list) => (
                            <option
                              key={list.marketMasterId}
                              value={`${list.marketMasterId}_${list.marketMasterName}`}
                            >
                              {i18n.language === "kn"
                                ? list.marketNameInKannada
                                : list.marketMasterName}
                            </option>
                          ))
                        : ""}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("Market is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2 sh-modal-footer">
                  <div className="gap-col">
                    {/* <Button variant="success" onClick={handleAdd}> */}
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

      <Modal show={showModal2} onHide={handleCloseModal2} size="lg" centered contentClassName="sh-modal-content">
        <Modal.Header closeButton>
          <Modal.Title>
            <Icon name="wallet" className="me-1" />
            {t("Edit Virtual Bank Account")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Form action="#"> */}
          <Form
            noValidate
            validated={validatedVbAccountEdit}
            onSubmit={(e) => handleUpdate(e, vbId, vbAccount)}
          >
            <Row className="g-5 px-5">
              <Col lg="6">
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="virtualAccountNumber">
                    {t("Virtual Account Number")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="virtualAccountNumber"
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

                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="branchNamevb">
                    {t("branch_name")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="branchNamevb"
                      name="branchName"
                      value={vbAccount.branchName}
                      onChange={handleVbInputs}
                      type="text"
                      placeholder={t("enter_branch_name")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Branch Name is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="ifscCodevb">
                    {t("ifsc_code")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="ifscCodevb"
                      name="ifscCode"
                      value={vbAccount.ifscCode}
                      onChange={handleVbInputs}
                      type="text"
                      placeholder={t("enter_ifsc_code")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      IFSC Code is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    {t("Market")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="marketMasterId"
                      // value={vbAccount.marketMasterId}
                      value={`${vbAccount.marketMasterId}_${vbAccount.marketMasterName}`}
                      onChange={handleMarketOption}
                      onBlur={() => handleMarketOption}
                      required
                      isInvalid={
                        vbAccount.marketMasterId === undefined ||
                        vbAccount.marketMasterId === "0"
                      }
                    >
                      <option value="">{t("Select Market")}</option>
                      {marketMasterListData.length
                        ? marketMasterListData.map((list) => (
                            <option
                              key={list.marketMasterId}
                              value={`${list.marketMasterId}_${list.marketMasterName}`}
                            >
                              {i18n.language === "kn"
                                ? list.marketNameInKannada
                                : list.marketMasterName}
                            </option>
                          ))
                        : ""}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("Market is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2 sh-modal-footer">
                  <div className="gap-col">
                    {/* <Button
                      variant="success"
                      onClick={() => handleUpdate(vbId, vbAccount)}
                    > */}
                    <Button type="submit" variant="success">
                      <Icon name="check" className="me-1" />
                      {t("update")}
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
    </Layout>
  );
}

const reelerFormStyles = `
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
  .sh-mode-badge {
    display: inline-block;
    margin-left: 10px;
    padding: 3px 12px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.22);
    color: #ffffff;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.3px;
    vertical-align: middle;
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
  .modal-backdrop.show {
    background-color: #0c2844;
    opacity: 0.75;
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
  .sh-modal-footer {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-top: 10px;
    padding-top: 18px;
    border-top: 1px solid #eef1f6;
  }
`;

export default NewReelerLicense;
