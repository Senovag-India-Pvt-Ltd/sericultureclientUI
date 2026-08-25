import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
// import DatePicker from "../../../components/Form/DatePicker";
import DatePicker from "react-datepicker";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
// import axios from "axios";
import { Icon } from "../../../components";
import api from "../../../services/auth/api";
import { useTranslation } from "react-i18next";


const baseURL = process.env.REACT_APP_API_BASE_URL_REGISTRATION;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION_FRUITS;

function ReelerLicenceEdit() {
   // Translation
   const { t } = useTranslation();
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  // Virtual Bank Account
  const [vbAccount, setVbAccount] = useState({
    virtualAccountNumber: "",
    branchName: "",
    ifscCode: "",
    marketMasterId: "",
  });

  const [validated, setValidated] = useState(false);
  const [validatedVbAccount, setValidatedVbAccount] = useState(false);
  const [validatedVbAccountEdit, setValidatedVbAccountEdit] = useState(false);

  const [vbAccountList, setVbAccountList] = useState([]);
  const getVbDetailsList = () => {
    api
      .get(baseURL + `reeler-virtual-bank-account/get-by-reeler-id-join/${id}`)
      .then((response) => {
        setVbAccountList(response.data.content.reelerVirtualBankAccount);
      })
      .catch((err) => {
        const message = err.response.data.errorMessages[0].message[0].message;
        setVbAccountList([]);
        editError(message);
      });
  };

  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);

  const handleShowModal = () => {
    setVbAccount({
      virtualAccountNumber: "",
      branchName: "",
      ifscCode: "",
      marketMasterId: "",
    });
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);

  const handleAdd = (event) => {
    const withReelerId = {
      ...vbAccount,
      reelerId: id,
    };
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidatedVbAccount(true);
    } else {
      event.preventDefault();
      if (vbAccount.ifscCode.length < 11 || vbAccount.ifscCode.length > 11) {
        return;
      }
      api
        .post(baseURL + `reeler-virtual-bank-account/add`, withReelerId)
        .then((response) => {
          getVbDetailsList();
          setShowModal(false);
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
              return
            }
          }
        });
      setValidatedVbAccount(true);
    }
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

  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
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

  const handleDelete = (i) => {
    api
      .delete(baseURL + `reeler-virtual-bank-account/delete/${i}`)
      .then((response) => {
        getVbDetailsList();
      })
      .catch((err) => {
        getVbDetailsList();
      });
  };

  //   const [vb, setVb] = useState({});
  const handleVbGet = (i) => {
    api
      .get(baseURL + `reeler-virtual-bank-account/get-join/${i}`)
      .then((response) => {
        setVbAccount(response.data.content);
        setShowModal2(true);
      })
      .catch((err) => {
        setVbAccount({});
      });
  };

  const handleEdit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidatedVbAccountEdit(true);
    } else {
      event.preventDefault();
      api
        .post(baseURL + `reeler-virtual-bank-account/edit`, vbAccount)
        .then((response) => {
          getVbDetailsList();
          setShowModal2(false);
        })
        .catch((err) => {
          getVbDetailsList();
        });
      setValidatedVbAccountEdit(true);
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
    if(name === "branchName"){
      setVbAccount({ ...vbAccount, [name]: value.toUpperCase() });
    }
    else if(name === "ifscCode"){
      setVbAccount({ ...vbAccount, [name]: value.toUpperCase() });
    }
    else{
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

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    // setData({ ...data, [name]: value });

    if (name === "mobileNumber" && (value.length < 10 || value.length > 10)) {
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

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  const _header = { "Content-Type": "application/json", accept: "*/*" };

  // Turns axios/server errors into plain-language text — never surfaces
  // raw things like "Request failed with status code 403" to the user.
  const getFriendlyErrorMessage = (err, fallback) => {
    const data = err && err.response && err.response.data;
    if (data && typeof data.message === "string" && data.message.trim()) {
      return data.message;
    }
    if (typeof data === "string" && data.trim()) {
      return data;
    }
    if (!err || !err.response) {
      return "Unable to reach the server. Please check your internet connection and try again.";
    }
    switch (err.response.status) {
      case 401:
        return "Your session has expired. Please log in again.";
      case 403:
        return "You don't have permission to perform this action. Please contact your administrator.";
      case 404:
        return "The requested record could not be found.";
      case 409:
        return "This record was changed elsewhere. Please refresh the page and try again.";
      case 500:
      case 502:
      case 503:
        return "The server ran into a problem. Please try again in a moment.";
      default:
        return fallback || "Something went wrong. Please try again.";
    }
  };

  // Shared persistence path used by both the manual Save button and the
  // FRUITS sync flow, so both go through the exact same update API/behavior.
  const persistReelerUpdate = (payload) => {
    return api
      .post(baseURL + `reeler/edit`, payload)
      .then((response) => {
        const reelerId = response.data.content.reelerId;
        if (reelerId) {
          handleMahajarUpload(reelerId);
        }
        if (response.data.content.error) {
          updateError(response.data.content.error_description);
          return null;
        }
        return response;
      })
      .catch((err) => {
        if (
          err.response &&
          err.response.data &&
          err.response.data.validationErrors &&
          Object.keys(err.response.data.validationErrors).length > 0
        ) {
          updateError(err.response.data.validationErrors);
        } else {
          Swal.fire({
            icon: "error",
            title: "Update attempt was not successful",
            text: getFriendlyErrorMessage(err, "Something went wrong while updating. Please try again."),
          });
        }
        return null;
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
      if (data.mobileNumber.length < 10 || data.mobileNumber.length > 10) {
        return;
      }

      if (data.ifscCode.length < 11 || data.ifscCode.length > 11) {
        return;
      }

      if (data.fruitsId.length < 16 || data.fruitsId.length > 16) {
        return;
      }
      persistReelerUpdate(data).then((response) => {
        if (response) {
          updateSuccess();
          setValidated(false);
        }
      });
      setValidated(true);
    }
  };

  // --- FRUITS re-sync for already-linked reelers ---
  const [syncingFruits, setSyncingFruits] = useState(false);
  const REELER_SYNC_FIELDS = ["reelerName", "fatherName", "gender", "casteId", "address"];

  const formatFieldLabel = (key) =>
    key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (s) => s.toUpperCase())
      .trim();

  const normalizeForCompare = (val) =>
    val === undefined || val === null ? "" : String(val).trim();

  const syncFromFruits = () => {
    if (!data.fruitsId || data.fruitsId.length !== 16) {
      Swal.fire({
        icon: "warning",
        title: "Invalid FRUITS ID",
        text: "FRUITS ID must be exactly 16 digits.",
      });
      return;
    }

    setSyncingFruits(true);
    api
      .post(
        baseURLFarmer + `farmer/get-farmer-details-by-fruits-id-or-farmer-number-or-mobile-number`,
        { fruitsId: data.fruitsId },
      )
      .then((result) => {
        if (result.data.content.error) {
          Swal.fire({
            icon: "warning",
            title: "Data not Found!!!",
            text: result.data.content.error_description,
          });
          return;
        }

        const dump = result.data.content.farmerResponse;
        if (!dump) {
          Swal.fire({
            icon: "info",
            title: "No data found",
            text: "FRUITS did not return any details for this FRUITS ID.",
          });
          return;
        }

        let dump1 = "";
        if (
          result.data.content.farmerAddressList &&
          result.data.content.farmerAddressList.length
        ) {
          dump1 = result.data.content.farmerAddressList[0];
        }

        const incoming = {
          reelerName: dump.firstName,
          fatherName: dump.fatherName,
          gender: dump.genderId,
          casteId: dump.casteId,
          address: dump1 ? dump1.addressText : "",
        };

        const changes = REELER_SYNC_FIELDS.map((key) => ({
          key,
          oldVal: data[key],
          newVal: incoming[key],
        })).filter(
          (c) =>
            c.newVal !== undefined &&
            c.newVal !== null &&
            c.newVal !== "" &&
            normalizeForCompare(c.oldVal) !== normalizeForCompare(c.newVal),
        );

        if (changes.length === 0) {
          Swal.fire({
            icon: "info",
            title: "Already up to date",
            text: "No differences were found between FRUITS and the saved reeler record.",
          });
          return;
        }

        const changeRows = changes
          .map(
            (c) =>
              `<tr><td style="text-align:left;padding:4px 8px;">${formatFieldLabel(c.key)}</td>` +
              `<td style="text-align:left;padding:4px 8px;color:#888;">${normalizeForCompare(c.oldVal) || "&mdash;"}</td>` +
              `<td style="text-align:left;padding:4px 8px;">${normalizeForCompare(c.newVal)}</td></tr>`,
          )
          .join("");

        const html =
          `<div style="text-align:left;font-size:13px;">` +
          `<p>The following details differ between FRUITS and the saved record. Confirming will replace them and update the reeler immediately.</p>` +
          `<table style="width:100%;border-collapse:collapse;">` +
          `<thead><tr><th style="text-align:left;padding:4px 8px;">Field</th><th style="text-align:left;padding:4px 8px;">Current</th><th style="text-align:left;padding:4px 8px;">FRUITS</th></tr></thead>` +
          `<tbody>${changeRows}</tbody></table></div>`;

        Swal.fire({
          icon: "question",
          title: "Update from FRUITS?",
          html,
          showCancelButton: true,
          confirmButtonText: "Update Now",
          cancelButtonText: "Cancel",
          width: 650,
        }).then((confirmResult) => {
          if (!confirmResult.isConfirmed) {
            return;
          }

          const mergedData = { ...data };
          changes.forEach((c) => {
            mergedData[c.key] = c.newVal;
          });

          persistReelerUpdate(mergedData).then((response) => {
            if (response) {
              setData(mergedData);
              updateSuccess();
            }
          });
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Sync failed",
          text: getFriendlyErrorMessage(err, "Something went wrong while fetching data from FRUITS. Please try again."),
        });
      })
      .finally(() => {
        setSyncingFruits(false);
      });
  };

  //   to get data from api
  const getIdList = () => {
    // setLoading(true);
    api
      .get(baseURL + `reeler/get/${id}`)
      .then((response) => {
        setData(response.data.content);
        // setLoading(false);
        if (response.data.content.mahajarDetails) {
          getMahajarFile(response.data.content.mahajarDetails);
        }
      })
      .catch((err) => {
        // const message = err.response.data.errorMessages[0].message[0].message;
        setData({});
        // editError(message);
        // setLoading(false);
      });
  };

  useEffect(() => {
    getIdList();
    getVbDetailsList();
  }, [id]);

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

  // to get TSC
  const [chawkiListData, setChawkiListData] = useState([]);

  const getChawkiList = () => {
    const response = api
      .get(baseURL2 + `tscMaster/get-all`)
      .then((response) => {
        setChawkiListData(response.data.content.tscMaster);
      })
      .catch((err) => {
        setChawkiListData([]);
      });
  };

  useEffect(() => {
    getChawkiList();
  }, []);

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

  // Multi-document upload state
  const [documents, setDocuments] = useState([
    { id: 1, label: "", file: null, fileName: "", uploaded: false, isDefault: true },
  ]);

  const handleDocLabelChange = (id, value) => {
    setDocuments((prev) => prev.map((d) => d.id === id ? { ...d, label: value, isDefault: false } : d));
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

  useEffect(() => {
    const first = documents[0];
    if (first?.fileName) {
      setData((prev) => ({ ...prev, mahajarDetails: first.fileName }));
    }
  }, [documents]);

  // To get existing Photo from S3 Bucket
  const [selectedMahajarFile, setMahajarFile] = useState(null);

  const getFileType = (fileName) => {
    if (!fileName) return "unknown";
    const ext = fileName.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)) return "image";
    if (ext === "pdf") return "pdf";
    if (["mp4", "avi", "mov", "wmv", "mkv", "webm"].includes(ext)) return "video";
    return "other";
  };

  const getMahajarFile = async (file) => {
    const parameters = `fileName=${file}`;
    try {
      const ext = file.split(".").pop().toLowerCase();
      const mimeMap = { pdf: "application/pdf", mp4: "video/mp4", mov: "video/quicktime", avi: "video/x-msvideo", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg" };
      const mime = mimeMap[ext] || "application/octet-stream";
      const response = await api.get(baseURL + `api/s3/download?${parameters}`, { responseType: "arraybuffer" });
      const blob = new Blob([response.data], { type: mime });
      setMahajarFile(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  };

  const navigate = useNavigate();
  const updateSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Updated successfully",
      // text: "You clicked the button!",
    }).then(() => navigate("/seriui/reeler-license-list"));
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
  const editError = (message) => {
    Swal.fire({
      icon: "error",
      title: message,
      text: "Something went wrong!",
    }).then(() => navigate("/seriui/reeler-license-list"));
  };

  return (
    <Layout title="Reeler License Edit">
      <style>{reelerEditFormStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("Reeler License Edit")}
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
                    <span>{t("Go To List")}</span>
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
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-1">
            <Card className="sh-search-card">
              <Card.Body>
                <Row className="g-gs">
                  <Col lg="12">
                    <Form.Group as={Row} className="form-group" controlId="fid">
                      <Form.Label column sm={1} className="sh-fruits-label">
                      {t("FRUITS ID")}<span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={4}>
                        <Form.Control
                          type="fruitsId"
                          name="fruitsId"
                          value={data.fruitsId}
                          onChange={handleInputs}
                          placeholder={t("Enter FRUITS ID")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Fruits ID is required.
                        </Form.Control.Feedback>
                      </Col>
                      <Col sm={3}>
                        <Button
                          type="button"
                          variant="info"
                          disabled={syncingFruits || !data.fruitsId || data.fruitsId.length !== 16}
                          onClick={syncFromFruits}
                        >
                          {syncingFruits ? t("Syncing...") : t("Sync from FRUITS")}
                        </Button>
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

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
                        {t("Reeler Name")}<span className="text-danger">*</span>
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
                        <div className="form-control-wrap">
                          <DatePicker
                            selected={data.dob ? new Date(data.dob) : null}
                            onChange={(date) => handleDateChange(date, "dob")}
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                            maxDate={new Date()}
                            className="form-control"
                          />
                        </div>
                      </Form.Group> */}

                      <Form.Group className="form-group mt-3">
                        <Form.Label>{t("gender")}</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="gender"
                            value={data.gender}
                            onChange={handleInputs}
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
                        {t("Caste")}<span className="text-danger">*</span>
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
                                {list.title}
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
                        {t("mobile_number")}<span className="text-danger">*</span>
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
                            Mobile Number is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="emailId">{t("email_id")}</Form.Label>
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

                      <Form.Group className="form-group mt-3">
                                              <Form.Label htmlFor="aadhaarNumber">{t("Aadhaar Number")}</Form.Label>
                                              <div className="form-control-wrap">
                                                <Form.Control
                                                  id="aadhaarNumber"
                                                  name="aadhaarNumber"
                                                  value={data.aadhaarNumber}
                                                  // onChange={handleInputs}
                                                  type="aadhaarNumber"
                                                  placeholder={t("Enter Aadhaar Number")}
                                                />
                                              </div>
                                            </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label>
                        {t("tsc")}<span className="text-danger">*</span>
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
                            <option value="">{t("select_tsc")}</option>
                            {tscListData.map((list) => (
                              <option
                                key={list.tscMasterId}
                                value={list.tscMasterId}
                              >
                                {list.name}
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
                        <Form.Label>
                        Assign To Inspect
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="assignToInspectId"
                            value={data.assignToInspectId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.assignToInspectId === undefined || data.assignToInspectId === "0"
                            }
                          >
                            <option value="">Select Assign To Inspect</option>
                            {userListData.map((list) => (
                              <option
                                key={list.userMasterId}
                                value={list.userMasterId}
                              >
                                {list.username}
                              </option>
                            ))}
                          </Form.Select>
                        </div>
                      </Form.Group> */}

<Form.Group className="form-group mt-3">
  <Form.Label>
  {t("Assign To Inspect")}
  </Form.Label>
  <div className="form-control-wrap">
    <Form.Select
      name="assignToInspectId"
      value={data.assignToInspectId}
      onChange={handleInputs}
      onBlur={() => handleInputs}
    >
      <option value="">{t("Select Assign To Inspect")}</option>
      {userListData.map((list) => (
        <option
          key={list.userMasterId}
          value={list.userMasterId}
        >
          {list.username}
        </option>
      ))}
    </Form.Select>
  </div>
</Form.Group>

                      {/* <Form.Group className="form-group mt-3">
                        <Form.Label>
                          TSC<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="assignToInspectId"
                            value={data.assignToInspectId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.assignToInspectId === undefined || data.assignToInspectId === "0"
                            }
                          >
                            <option value="">Select TSC</option>
                            {chawkiListData.map((list) => (
                              <option
                                key={list.tscMasterId}
                                value={list.tscMasterId}
                              >
                                {list.name}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            TSC is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group> */}
                      {/* <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="arnNumber">
                          ARN Number<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="arnNumber"
                            name="arnNumber"
                            value={data.arnNumber}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter ARN Number"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            ARN Number is required.
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group> */}
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group">
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
                            // required
                          />
                          {/* <Form.Control.Feedback type="invalid">
                            Reeler Number is required.
                          </Form.Control.Feedback> */}
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
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
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label>{t("education")}</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="educationId"
                            value={data.educationId}
                            onChange={handleInputs}
                          >
                            <option value="0">{t("select_education")}</option>
                            {educationListData.map((list) => (
                              <option key={list.id} value={list.id}>
                                {list.name}
                              </option>
                            ))}
                          </Form.Select>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
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
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="rrno">
                        {t("Electricity RR Numbers")}
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
                            placeholder={t("Enter Representative/Agent name and Address")}
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label>
                        {t("Reeler Type")} <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="reelerTypeMasterId"
                            value={data.reelerTypeMasterId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.reelerTypeMasterId === undefined ||
                              data.reelerTypeMasterId === "0"
                            }
                          >
                            <option value="">{t("Select Reeler Type")}</option>
                            {reelerTypeListData.map((list) => (
                              <option
                                key={list.reelerTypeMasterId}
                                value={list.reelerTypeMasterId}
                              >
                                {list.reelerTypeMasterName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                          {("Reeler Type is required")}
                          </Form.Control.Feedback>
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
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group">
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
                              readOnly
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
                              readOnly
                            />
                          </Col>
                        </Row>
                        {/* <div className="form-control-wrap">
                        <Form.Control
                          id="chakbandi"
                          type="text"
                          placeholder="Enter Chakbandi Details"
                        />
                      </div> */}
                      </Form.Group>
                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="passbook">
                        {t("passbook_number")}<span className="text-danger">*</span>
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
                        {t("Machine Type")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="machineTypeId"
                            value={data.machineTypeId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.machineTypeId === undefined ||
                              data.machineTypeId === "0"
                            }
                          >
                            <option value="0">{t("Select Machine Type")}</option>
                            {machineTypeListData.map((list) => (
                              <option
                                key={list.machineTypeId}
                                value={list.machineTypeId}
                              >
                                {list.machineTypeName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                          {t("Machine Type is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label>{t("Date of Machine Installation")}</Form.Label>
                        <div className="form-control-wrap">
                          <DatePicker
                            selected={
                              data.dateOfMachineInstallation
                                ? new Date(data.dateOfMachineInstallation)
                                : null
                            }
                            onChange={(date) =>
                              handleDateChange(
                                date,
                                "dateOfMachineInstallation"
                              )
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                            // maxDate={new Date()}
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
                            placeholder="Enter Number of Basins/Charaka"
                          />
                        </div>
                      </Form.Group>

                      

                      

                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="loanDetails">
                        {t("loan_details")}
                        </Form.Label>
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
                            selected={
                              data.inspectionDate
                                ? new Date(data.inspectionDate)
                                : null
                            }
                            onChange={(date) =>
                              handleDateChange(date, "inspectionDate")
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                            // maxDate={new Date()}
                            className="form-control"
                            readOnly
                          />
                        </div>
                      </Form.Group>

                      {/* Multi-document upload section */}
                      <Form.Group className="form-group mt-3">
                        <Form.Label style={{ fontWeight: "600", color: "#1a3c6e", fontSize: "13px" }}>
                          {t("Upload Documents")} <small style={{ color: "#6b7280", fontWeight: "400" }}>(PDF / JPG / PNG / MP4 — Max 5MB each)</small>
                        </Form.Label>

                        {/* Show existing uploaded file */}
                        {selectedMahajarFile && data.mahajarDetails && (
                          <div style={{ marginBottom: "10px", background: "#f0f6ff", border: "1px solid #b8d4f0", borderRadius: "8px", padding: "10px 14px", display: "flex", alignItems: "center", gap: "12px" }}>
                            <span style={{ fontSize: "20px" }}>
                              {getFileType(data.mahajarDetails) === "image" ? "🖼️" : getFileType(data.mahajarDetails) === "pdf" ? "📄" : getFileType(data.mahajarDetails) === "video" ? "🎬" : "📎"}
                            </span>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: "12px", fontWeight: "600", color: "#1a3c6e" }}>{t("Current Document")}</div>
                              <div style={{ fontSize: "11.5px", color: "#374151" }}>{data.mahajarDetails.replace(/_([^_]*)$/, ".$1")}</div>
                            </div>
                            {getFileType(data.mahajarDetails) === "image" && (
                              <img src={selectedMahajarFile} alt="current" style={{ height: "50px", width: "50px", borderRadius: "5px", objectFit: "cover" }} />
                            )}
                          </div>
                        )}

                        <div style={{ border: "1px solid #dce8f5", borderRadius: "10px", overflow: "hidden", background: "#f8faff" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto", gap: "0", background: "#e8f0fb", padding: "8px 12px", fontSize: "11.5px", fontWeight: "700", color: "#1a3c6e", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                            <span>{t("Document Type")}</span>
                            <span>{t("File")}</span>
                            <span></span>
                          </div>
                          {documents.map((doc, idx) => (
                            <div key={doc.id} style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto", gap: "8px", alignItems: "center", padding: "10px 12px", borderTop: idx > 0 ? "1px solid #dce8f5" : "none", background: "#fff" }}>
                              <Form.Control
                                type="text"
                                placeholder={t("e.g. Mahajar, Aadhaar…")}
                                value={doc.isDefault ? t("Mahajar Details") : doc.label}
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
                                title={t("Remove")}
                              >✕</button>
                            </div>
                          ))}
                          <div style={{ padding: "8px 12px", borderTop: "1px solid #dce8f5", background: "#f8faff" }}>
                            <button
                              type="button"
                              onClick={addDocumentRow}
                              style={{ background: "none", border: "1.5px dashed #1a5fa8", color: "#1a5fa8", borderRadius: "6px", padding: "5px 14px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
                            >
                              + {t("Add Another Document")}
                            </button>
                          </div>
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
                  <Icon name="map-pin" />
                  <span>{t("address")}</span>
                </Card.Header>
                <Card.Body>
                  <Row className="g-gs">
                    <Col lg="4">
                      <Form.Group className="form-group">
                        <Form.Label>
                        {t("state")}<span className="text-danger">*</span>
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
                            <option value="0">{t("select_state")}</option>
                            {stateListData.map((list) => (
                              <option key={list.stateId} value={list.stateId}>
                                {list.stateName}
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
                        {t("district")}<span className="text-danger">*</span>
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
                                    {list.districtName}
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
                        {t("taluk")}<span className="text-danger">*</span>
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
                                    {list.talukName}
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
                        {t("hobli")}<span className="text-danger">*</span>
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
                                    {list.hobliName}
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
                        <Form.Label>{t("village")}</Form.Label>
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
                                    {list.villageName}
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
                        {t("pin_code")}<span className="text-danger">*</span>
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
                        {t("address")}<span className="text-danger">*</span>
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
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="reelingLicenseNumber"
                            name="reelingLicenseNumber"
                            value={data.reelingLicenseNumber}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Reeling License Number")}
                            required
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
                        <Form.Label htmlFor="feeAmount">{t("Fee Amount")}</Form.Label>
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
                            <option value="1">Yes</option>
                            <option value="2">No</option>
                          </Form.Select>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="2">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>{t("Receipt Date")}</Form.Label>
                        <div className="form-control-wrap">
                          <DatePicker
                            selected={
                              data.receiptDate
                                ? new Date(data.receiptDate)
                                : null
                            }
                            onChange={(date) =>
                              handleRenewedDateChange(date, "receiptDate")
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                            // maxDate={new Date()}
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
                            selected={
                              data.licenseExpiryDate
                                ? new Date(data.licenseExpiryDate)
                                : null
                            }
                            onChange={(date) =>
                              handleDateChange(date, "licenseExpiryDate")
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                            // maxDate={new Date()}
                            className="form-control"
                            readOnly
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
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="bankName">
                        {t("bank_name")}<span className="text-danger">*</span>
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
                        {t("branch_name")}<span className="text-danger">*</span>
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
                        {t("ifsc_code")}<span className="text-danger">*</span>
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
                  {vbAccountList && vbAccountList.length > 0 ? (
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
                                          onClick={() =>
                                            handleVbGet(
                                              item.reelerVirtualBankAccountId
                                            )
                                          }
                                        >
                                          {t("edit")}
                                        </Button>
                                        <Button
                                          variant="danger"
                                          size="sm"
                                          onClick={() =>
                                            handleDelete(
                                              item.reelerVirtualBankAccountId
                                            )
                                          }
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
                    {t("update")}
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
            {t("Add Virtual Bank Account Details")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Form action="#"> */}
          <Form noValidate validated={validatedVbAccount} onSubmit={handleAdd}>
            <Row className="g-5 px-5">
              <Col lg="6">
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="virtualAccountNumber">
                  {t("Virtual Account Number")}<span className="text-danger">*</span>
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
                  {t("branch_name")}<span className="text-danger">*</span>
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
                  {t("ifsc_code")}<span className="text-danger">*</span>
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
                  {t("Market")}<span className="text-danger">*</span>
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
                              {list.marketMasterName}
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
                    <Button type="submit" variant="primary">
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
            onSubmit={handleEdit}
          >
            <Row className="g-5 px-5">
              <Col lg="6">
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="virtualAccountNumber">
                  {t("Virtual Account Number")}<span className="text-danger">*</span>
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
                  {t("branch_name")}<span className="text-danger">*</span>
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
                  {t("ifsc_code")}<span className="text-danger">*</span>
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
                  <Form.Label>{t("Market")}</Form.Label>
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
                              {list.marketMasterName}
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
                    {/* <Button variant="success" onClick={handleEdit}> */}
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
    </Layout>
  );
}

const reelerEditFormStyles = `
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

export default ReelerLicenceEdit;
