import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon, Select } from "../../components";
import DatePicker from "react-datepicker";
// import axios from "axios";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../src/services/auth/api";
// import Quill from "../../components/Form/editors/Quill";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_HELPDESK;

function HelpDesk() {

  // Translation
  const { t } = useTranslation();
  const [data, setData] = useState({
    hdModuleId: "",
    hdFeatureId: "",
    hdBoardCategoryId: "",
    hdCategoryId: "",
    hdSubCategoryId: "",
    hdUsersAffected: "",
    query: "",
    queryDetails: "",
    hdAttachFiles: "",
    ticketNumber: "",
    hdStatusId: "1",
    hdSeverityId: "4",
    onBehalfOf: localStorage.getItem("userMasterId"),
    contactPerson: "",
  contactNumber: "",
  });

  const placeholder = t("Enter your Query");

  const { quill, quillRef } = useQuill({ placeholder });

  // console.log(quillRef);

  useEffect(() => {
    if (quill) {
      quill.on("text-change", (delta, oldDelta, source) => {
        console.log(quill.getText());
        setData((prev) => ({
          ...prev,
          queryDetails: quill.getText().replace(/\n+$/, ""),
        }));
      });
    }
  }, [quill]);

  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    // debugger;
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  // const handleDateChange = (newDate) => {
  //   setData({ ...data, applicationDate: newDate });
  // };
  const [check, setCheck] = useState(false);

  const handleCheckBox = (e) => {
    setCheck(e.target.checked);
    if (!e.target.checked) {
      setData((prev) => ({
        ...prev,
        onBehalfOf: localStorage.getItem("userMasterId"),
      }));
    }
  };

  console.log(data.onBehalfOf);

  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const showAlert = (options) =>
    Swal.fire({
      buttonsStyling: false,
      reverseButtons: true,
      width: 460,
      padding: "26px 24px 20px 24px",
      background: "#ffffff",
      backdrop: "rgba(15, 48, 96, 0.45)",
      confirmButtonText: "OK",
      customClass: {
        popup: "helpdesk-swal-popup",
        title: "helpdesk-swal-title",
        htmlContainer: "helpdesk-swal-html",
        confirmButton: "helpdesk-swal-confirm",
        cancelButton: "helpdesk-swal-cancel",
        icon: "helpdesk-swal-icon",
      },
      ...options,
    });

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();

      const isContactPersonEmpty =
  !data.contactPerson || data.contactPerson.trim() === "";

const isContactNumberEmpty =
  !data.contactNumber || data.contactNumber.trim() === "";

if (isContactPersonEmpty && isContactNumberEmpty) {
  showAlert({
    icon: "warning",
    title: "Missing Details",
    text: "Please enter the Contact Name and Contact Number",
  });
  return;
}

if (isContactPersonEmpty) {
  showAlert({
    icon: "warning",
    title: "Missing Details",
    text: "Please enter the Contact Name",
  });
  return;
}

if (isContactNumberEmpty) {
  showAlert({
    icon: "warning",
    title: "Missing Details",
    text: "Please enter the Contact Number",
  });
  return;
}

if (data.contactNumber.length !== 10) {
  showAlert({
    icon: "warning",
    title: "Invalid Contact Number",
    text: "Contact Number must be exactly 10 digits",
  });
  return;
}
      setIsSubmitting(true);
      api
        .post(baseURL2 + `hdTicket/add`, data)
        .then((response) => {
          if (response.data.content.hdTicketId) {
            const hdAttach = response.data.content.hdTicketId;
            handleAttachFileUpload(hdAttach);
          }
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
            setIsSubmitting(false);
          } else {
            saveSuccess(response.data.content.ticketArn);
            // Keep button disabled — page will reload from the SweetAlert OK
          }
        })
        .catch((err) => {
          if (err?.response?.data?.validationErrors && Object.keys(err.response.data.validationErrors).length > 0) {
            saveError(err.response.data.validationErrors);
          } else {
            saveError("Unable to submit the ticket. Please try again.");
          }
          setIsSubmitting(false);
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
      hdModuleId: "",
      hdFeatureId: "",
      hdBoardCategoryId: "",
      hdCategoryId: "",
      hdSubCategoryId: "",
      hdUsersAffected: "",
      query: "",
      queryDetails: "",
      hdAttachFiles: "",
      hdCreatedBy: "",
      ticketNumber: "",
      hdStatusId: "1",
      hdSeverityId: "4",
      onBehalfOf: localStorage.getItem("userMasterId"),
      contactPerson: "",
      contactNumber: "",
    });
    setAttachFiles("");
    document.getElementById("hdAttachFiles").value = "";
    quill.setText("");
  };

  const [loading, setLoading] = useState(false);

  // to get Status
  const [hdStatusListData, setHdStatusListData] = useState([]);

  const getStatusList = () => {
    const response = api
      .get(baseURL + `hdStatusMaster/get-all`)
      .then((response) => {
        setHdStatusListData(response.data.content.hdStatusMaster);
      })
      .catch((err) => {
        setHdStatusListData([]);
      });
  };

  useEffect(() => {
    getStatusList();
  }, []);

  // to get Module
  const [hdModuleListData, setHdModuleListData] = useState([]);

  const getList = () => {
    const response = api
      .get(baseURL + `hdModuleMaster/get-all`)
      .then((response) => {
        setHdModuleListData(response.data.content.hdModuleMaster);
      })
      .catch((err) => {
        setHdModuleListData([]);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  // to get Feature
  const [featureListData, setFeatureListData] = useState([]);

  const getFeatureList = (_id) => {
    const response = api
      .get(baseURL + `hdFeatureMaster/get-by-hd-module-id/${_id}`)
      .then((response) => {
        setFeatureListData(response.data.content.hdFeatureMaster);
        setLoading(false);
        if (response.data.content.error) {
          setFeatureListData([]);
        }
      })
      .catch((err) => {
        setFeatureListData([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (data.hdModuleId) {
      getFeatureList(data.hdModuleId);
    }
  }, [data.hdModuleId]);

  
    // Display Image
    const [image, setImage] = useState("");
    // const [photoFile,setPhotoFile] = useState("")
  
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      setImage(file);
      setData((prev) => ({ ...prev, hdAttachFiles: file.name }));
      // setPhotoFile(file);
    };
  
    // // Upload Image to S3 Bucket
    // const handleAttachFileUpload = async (hdid) => {
    //   const parameters = `hdTicketId=${hdid}`;
    //   try {
    //     const formData = new FormData();
    //     formData.append("multipartFile", image);
  
    //     const response = await api.post(
    //       baseURL2 + `hdTicket/hd-attach-files?${parameters}`,
    //       formData,
    //       {
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

  // to get BoardCategory
  const [hdBoardCategoryListData, setHdBoardCategoryListData] = useState([]);

  const getHdBoardCategoryList = (_id) => {
    const response = api
      .get(baseURL + `hdBoardCategoryMaster/get-all`)
      .then((response) => {
        if (response.data.content.hdBoardCategoryMaster) {
          setHdBoardCategoryListData(
            response.data.content.hdBoardCategoryMaster
          );
        }
      })
      .catch((err) => {
        setHdBoardCategoryListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    getHdBoardCategoryList();
  }, []);

  // to get hdCategory
  const [hdCategoryListData, setHdCategoryListData] = useState([]);

  const getHdCategoryList = (_id) => {
    const response = api
      .get(baseURL + `hdCategoryMaster/get-by-hd-board-category-id/${_id}`)
      .then((response) => {
        if (response.data.content.hdCategoryMaster) {
          setHdCategoryListData(response.data.content.hdCategoryMaster);
        }
      })
      .catch((err) => {
        setHdCategoryListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.hdBoardCategoryId) {
      getHdCategoryList(data.hdBoardCategoryId);
    }
  }, [data.hdBoardCategoryId]);

  // to get hdCategory
  const [hdSubCategoryListData, setHdSubCategoryListData] = useState([]);

  const getHdSubCategoryList = (_id) => {
    const response = api
      .get(baseURL + `hdSubCategoryMaster/get-by-hd-category-id/${_id}`)
      .then((response) => {
        if (response.data.content.hdSubCategoryMaster) {
          setHdSubCategoryListData(response.data.content.hdSubCategoryMaster);
        }
      })
      .catch((err) => {
        setHdSubCategoryListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.hdCategoryId) {
      getHdSubCategoryList(data.hdCategoryId);
    }
  }, [data.hdCategoryId]);

  // to get username
  const [userListData, setUserListData] = useState([]);

  const getUserList = () => {
    api
      .get(baseURL + `userMaster/get-all`)
      .then((response) => {
        setUserListData(response.data.content.userMaster);
      })
      .catch((err) => {
        setUserListData([]);
      });
  };

  useEffect(() => {
    getUserList();
  }, []);

  //  // const YourFormComponent = ({ data, handleDateChange }) => {
  //   const handleRenewedDateChange = (date) => {
  //     // Calculate expiration date by adding 3 years to the renewed date
  //     const expirationDate = new Date(date);
  //     expirationDate.setFullYear(expirationDate.getFullYear() + 3);

  //     setData({
  //       ...data,
  //       receiptDate: date,
  //       licenseExpiryDate: expirationDate,
  //     });
  //   };

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  // Display Image
  const [attachFiles, setAttachFiles] = useState("");
  // const [photoFile,setPhotoFile] = useState("")

  // const handleAttachFileChange = (e) => {
  //   const file = e.target.files[0];
  //   setAttachFiles(file);
  //   setData((prev) => ({ ...prev, hdAttachFiles: file.name }));
  //   // setPhotoFile(file);
  // };

  const handleAttachFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachFiles(file);
      setData((prev) => ({ ...prev, hdAttachFiles: file.name }));
    } else {
      // Handle the case when the file selection is canceled
      setAttachFiles(null);
      setData((prev) => ({ ...prev, hdAttachFiles: "" }));
    }
  };
  

 // ✅ Corrected File Upload Function (matches backend @RequestParam)
const handleAttachFileUpload = async (hdTicketId) => {
  if (!attachFiles) {
    console.error("No file selected for upload");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("multipartFile", attachFiles); // matches @RequestParam("multipartFile")
    formData.append("hdTicketId", hdTicketId);     // matches @RequestParam("hdTicketId")

    const response = await api.post(
      `${baseURL2}hdTicket/hd-attach-files`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("✅ File upload response:", response.data);
  } catch (error) {
    console.error("❌ Error uploading file:", error);
  }
};



  const navigate = useNavigate();
  const saveSuccess = (message) => {
    showAlert({
      icon: "success",
      title: "Ticket Submitted",
      html: `<div style="font-size:14px;color:#4a5b75;">Your ticket has been raised successfully.</div><div style="margin-top:14px;padding:10px 14px;background:linear-gradient(135deg,#e8f4ea 0%,#d6ecd9 100%);border:1px solid #b6dabc;border-radius:10px;color:#1f6b2d;font-weight:700;letter-spacing:0.4px;">Ticket No: <span style="color:#0f3060">${message}</span></div>`,
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then(() => {
      window.location.reload();
    });
  };
  const saveError = (message) => {
    let errorMessage;
    if (typeof message === "object") {
      errorMessage = Object.values(message).join("<br>");
    } else {
      errorMessage = message;
    }
    showAlert({
      icon: "error",
      title: "Submission Failed",
      html: `<div style="font-size:13.5px;color:#4a5b75;line-height:1.5;">${errorMessage}</div>`,
    });
  };

  return (
    <Layout title="Create Ticket">
      <style>{`
        .helpdesk-form .form-label {
          font-weight: 600;
          color: #1a3c6e;
          font-size: 13px;
          letter-spacing: 0.2px;
          margin-bottom: 6px;
        }
        .helpdesk-form .form-label .text-danger {
          margin-left: 3px;
        }
        .helpdesk-form .form-control,
        .helpdesk-form .form-select {
          border: 1px solid #d4e0ee;
          border-radius: 10px;
          padding: 9px 14px;
          font-size: 13.5px;
          color: #2a3f5f;
          background: #ffffff;
          box-shadow: 0 1px 2px rgba(15, 76, 138, 0.04);
          transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
        }
        .helpdesk-form .form-control::placeholder {
          color: #94a4b8;
          font-weight: 400;
        }
        .helpdesk-form .form-control:hover:not(:focus):not(.is-invalid),
        .helpdesk-form .form-select:hover:not(:focus):not(.is-invalid) {
          border-color: #b9d2ec;
        }
        .helpdesk-form .form-control:focus,
        .helpdesk-form .form-select:focus {
          border-color: #1e67a8;
          box-shadow: 0 0 0 3px rgba(30, 103, 168, 0.15);
          background: #ffffff;
          outline: none;
        }
        /* Kill Bootstrap's repeating validation icon background on EVERY field state */
        .helpdesk-form .form-control,
        .helpdesk-form .form-select,
        .helpdesk-form .form-control.is-invalid,
        .helpdesk-form .form-select.is-invalid,
        .helpdesk-form.was-validated .form-control:invalid,
        .helpdesk-form.was-validated .form-select:invalid,
        .helpdesk-form .form-control.is-valid,
        .helpdesk-form .form-select.is-valid,
        .helpdesk-form.was-validated .form-control:valid,
        .helpdesk-form.was-validated .form-select:valid {
          background-image: none !important;
          padding-right: 14px !important;
        }
        /* Restore ONLY the chevron-down on selects */
        .helpdesk-form .form-select,
        .helpdesk-form .form-select.is-invalid,
        .helpdesk-form.was-validated .form-select:invalid,
        .helpdesk-form .form-select.is-valid,
        .helpdesk-form.was-validated .form-select:valid {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e") !important;
          background-repeat: no-repeat !important;
          background-position: right 0.75rem center !important;
          background-size: 16px 12px !important;
          padding-right: 2.25rem !important;
        }
        /* Invalid border colour */
        .helpdesk-form .form-control.is-invalid,
        .helpdesk-form .form-select.is-invalid,
        .helpdesk-form.was-validated .form-control:invalid,
        .helpdesk-form.was-validated .form-select:invalid {
          border-color: #e74c3c !important;
        }
        .helpdesk-form .form-control.is-invalid:focus,
        .helpdesk-form .form-select.is-invalid:focus,
        .helpdesk-form.was-validated .form-control:invalid:focus,
        .helpdesk-form.was-validated .form-select:invalid:focus {
          box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.18) !important;
        }
        .helpdesk-form .invalid-feedback {
          display: none;
          align-items: center;
          gap: 5px;
          margin-top: 5px;
          padding: 4px 10px;
          background: linear-gradient(135deg, #fdecea 0%, #fcdbd6 100%);
          border: 1px solid #f5c4be;
          border-radius: 8px;
          color: #b02a1f;
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.2px;
          width: fit-content;
        }
        .helpdesk-form.was-validated .form-control:invalid ~ .invalid-feedback,
        .helpdesk-form.was-validated .form-select:invalid ~ .invalid-feedback,
        .helpdesk-form .form-control.is-invalid ~ .invalid-feedback,
        .helpdesk-form .form-select.is-invalid ~ .invalid-feedback {
          display: inline-flex;
        }
        .helpdesk-form .invalid-feedback::before {
          content: "⚠";
          font-size: 12px;
        }
        .helpdesk-form .form-check-input {
          width: 1.15em;
          height: 1.15em;
          border: 1.5px solid #b9d2ec;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .helpdesk-form .form-check-input:checked {
          background-color: #1e67a8;
          border-color: #1e67a8;
          box-shadow: 0 2px 6px rgba(30, 103, 168, 0.25);
        }
        .helpdesk-form .form-check-input:focus {
          box-shadow: 0 0 0 3px rgba(30, 103, 168, 0.15);
        }
        .helpdesk-form input[type="file"].form-control {
          padding: 8px 12px;
          cursor: pointer;
        }
        .helpdesk-form input[type="file"].form-control::file-selector-button {
          background: linear-gradient(135deg, #1e67a8 0%, #0f3060 100%);
          color: #ffffff;
          border: none;
          padding: 7px 14px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 12.5px;
          margin-right: 14px;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .helpdesk-form input[type="file"].form-control::file-selector-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(15, 76, 138, 0.22);
        }
        .helpdesk-form .ql-toolbar.ql-snow {
          border: 1px solid #d4e0ee;
          border-bottom: none;
          background: #f7faff;
          border-radius: 0;
        }
        .helpdesk-form .ql-container.ql-snow {
          border: 1px solid #d4e0ee;
          border-top: none;
          font-size: 13.5px;
          color: #2a3f5f;
          min-height: 140px;
          background: #ffffff;
        }
        .helpdesk-form .ql-editor::before {
          color: #94a4b8;
          font-style: normal;
        }

        .helpdesk-swal-popup {
          border-radius: 16px !important;
          box-shadow: 0 20px 50px rgba(15, 48, 96, 0.25) !important;
          border: 1px solid #e3ecf7 !important;
        }
        .helpdesk-swal-title {
          color: #0f3060 !important;
          font-weight: 700 !important;
          font-size: 19px !important;
          letter-spacing: 0.3px !important;
        }
        .helpdesk-swal-html {
          color: #4a5b75 !important;
          font-size: 13.5px !important;
          line-height: 1.55 !important;
        }
        .helpdesk-swal-icon {
          margin-top: 6px !important;
          margin-bottom: 8px !important;
          transform: scale(0.85);
        }
        .helpdesk-swal-confirm {
          background: linear-gradient(135deg, #1e67a8 0%, #0f3060 100%) !important;
          color: #ffffff !important;
          border: none !important;
          font-weight: 700 !important;
          padding: 9px 26px !important;
          border-radius: 10px !important;
          letter-spacing: 0.3px !important;
          box-shadow: 0 6px 16px rgba(15, 76, 138, 0.28) !important;
          transition: transform 0.15s ease, box-shadow 0.15s ease !important;
        }
        .helpdesk-swal-confirm:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 8px 22px rgba(15, 76, 138, 0.35) !important;
        }
        .helpdesk-swal-cancel {
          background: #ffffff !important;
          color: #1a3c6e !important;
          border: 1px solid #b9d2ec !important;
          font-weight: 600 !important;
          padding: 8px 22px !important;
          border-radius: 10px !important;
          margin-right: 8px !important;
        }
      `}</style>
      <Block.Head className="pt-3 mt-0">
        <Block.HeadBetween>
          <Block.HeadContent>
            <div
              className="d-flex align-items-center"
              style={{
                gap: "14px",
                background: "rgba(255, 255, 255, 0.96)",
                backdropFilter: "blur(6px)",
                border: "1px solid #e3ecf7",
                padding: "12px 18px",
                borderRadius: "14px",
                boxShadow: "0 4px 14px rgba(15, 76, 138, 0.12)",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background:
                    "linear-gradient(135deg, #1e67a8 0%, #0f3060 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  boxShadow: "0 4px 12px rgba(15, 76, 138, 0.28)",
                  flexShrink: 0,
                }}
              >
                <Icon name="help" style={{ fontSize: "20px" }}></Icon>
              </div>
              <div style={{ lineHeight: 1.25 }}>
                <h2
                  className="mb-1"
                  style={{
                    color: "#0f3060",
                    fontSize: "22px",
                    fontWeight: 800,
                    margin: 0,
                    letterSpacing: "0.2px",
                  }}
                >
                  {t("Create Ticket")}
                </h2>
                <span style={{ color: "#3b5278", fontSize: "13px", fontWeight: 500 }}>
                  {/* {t("Raise a support request — we'll get back to you shortly")} */}
                </span>
              </div>
            </div>
          </Block.HeadContent>
          <Block.HeadContent>
            <div style={{ display: "flex", alignItems: "stretch", gap: "16px" }}>

              {/* ── Helpdesk Number Card ── */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                flex: 1,
                minWidth: "280px",
                background: "linear-gradient(135deg, #ffffff 0%, #eef5ff 100%)",
                border: "2px solid #c8ddf7",
                borderRadius: "16px",
                padding: "14px 22px",
                boxShadow: "0 6px 24px rgba(15,76,138,0.15)",
              }}>
                <div style={{
                  width: "54px", height: "54px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #1e67a8 0%, #0f3060 100%)",
                  color: "#fff", display: "flex", alignItems: "center",
                  justifyContent: "center", flexShrink: 0,
                  boxShadow: "0 4px 14px rgba(15,76,138,0.30)",
                  fontSize: "22px",
                }}>
                  📞
                </div>
                <div style={{ lineHeight: 1.4 }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#1e67a8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "3px" }}>
                    Helpdesk Number
                  </div>
                  <div style={{ fontSize: "20px", fontWeight: 900, color: "#0f3060" }}>
                    080-24413900
                  </div>
                </div>
              </div>

              {/* ── Seed Market Support Card ── */}
              {(() => {
                const people = ["Shraddha", "Ashwika", "Vaishnavi", "Amulya"];
                const weekIdx = Math.min(Math.ceil(new Date().getDate() / 7) - 1, 3);
                const person = people[weekIdx];
                return (
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    flex: 1,
                    minWidth: "280px",
                    background: "linear-gradient(135deg, #ffffff 0%, #eef5ff 100%)",
                    border: "2px solid #c8ddf7",
                    borderRadius: "16px",
                    padding: "14px 22px",
                    boxShadow: "0 6px 24px rgba(15,76,138,0.15)",
                  }}>
                    <div style={{
                      width: "54px", height: "54px", borderRadius: "50%",
                      background: "linear-gradient(135deg, #1e67a8 0%, #0f3060 100%)",
                      color: "#fff", display: "flex", alignItems: "center",
                      justifyContent: "center", fontWeight: 900, fontSize: "22px",
                      flexShrink: 0, boxShadow: "0 4px 14px rgba(15,76,138,0.30)",
                    }}>
                      {person.charAt(0)}
                    </div>
                    <div style={{ lineHeight: 1.4 }}>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#1e67a8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "3px" }}>
                        Seed Market Support For Sunday
                      </div>
                      <div style={{ fontSize: "20px", fontWeight: 900, color: "#0f3060" }}>
                        {person}
                      </div>
                    </div>
                  </div>
                );
              })()}

            </div>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block style={{ marginTop: "8px" }}>
        <Form noValidate validated={validated} onSubmit={postData} className="helpdesk-form">
            <Card
              style={{
                border: "none",
                borderRadius: "16px",
                boxShadow: "0 6px 24px rgba(15, 76, 138, 0.10)",
                overflow: "hidden",
              }}
            >
              <Card.Header
                style={{
                  background:
                    "linear-gradient(135deg, #1e67a8 0%, #0d4f8a 100%)",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "15px",
                  padding: "14px 22px",
                  letterSpacing: "0.3px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  border: "none",
                }}
              >
                <Icon name="edit" style={{ fontSize: "18px" }}></Icon>
                {t("Ticket Information")}
              </Card.Header>
              <Card.Body
                className="helpdesk-form"
                style={{
                  background:
                    "linear-gradient(135deg, #f8f9ff 0%, #eef3fc 100%)",
                  padding: "22px",
                }}
              >
                <Row className="g-gs">
                  <Col lg="12">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "6px 0 4px 0",
                        marginBottom: "-4px",
                      }}
                    >
                      <span
                        style={{
                          width: "4px",
                          height: "18px",
                          background: "#1a5fa8",
                          borderRadius: "2px",
                          display: "inline-block",
                        }}
                      />
                      <span
                        style={{
                          fontSize: "13.5px",
                          fontWeight: 700,
                          color: "#1a3c6e",
                          letterSpacing: "0.5px",
                          textTransform: "uppercase",
                        }}
                      >
                        {t("Classification")}
                      </span>
                    </div>
                  </Col>
                  <Col lg="4">
                    <Form.Group className="form-group mt-n3">
                      <Form.Label>
                      {t("Module")}<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="hdModuleId"
                          value={data.hdModuleId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.hdModuleId === undefined ||
                            data.hdModuleId === "0"
                          }
                        >
                          <option value="">{t("Select Module")}</option>
                          {hdModuleListData.map((list) => (
                            <option
                              key={list.hdModuleId}
                              value={list.hdModuleId}
                            >
                              {list.hdModuleName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {t("Module Name is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n3">
                      <Form.Label>
                        {t("Feature")}<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="hdFeatureId"
                          value={data.hdFeatureId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.hdFeatureId === undefined ||
                            data.hdFeatureId === "0"
                          }
                        >
                          <option value="">{t("Select Feature")}</option>
                          {featureListData.map((list) => (
                            <option
                              key={list.hdFeatureId}
                              value={list.hdFeatureId}
                            >
                              {list.hdFeatureName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {t("Feature Name is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n3">
                      <Form.Label>
                        {t("Broad Category")}<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="hdBoardCategoryId"
                          value={data.hdBoardCategoryId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.hdBoardCategoryId === undefined ||
                            data.hdBoardCategoryId === "0"
                          }
                        >
                          <option value="">{t("Select Broad Category")}</option>
                          {hdBoardCategoryListData.map((list) => (
                            <option
                              key={list.hdBoardCategoryId}
                              value={list.hdBoardCategoryId}
                            >
                              {list.hdBoardCategoryName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {t("Broad Category Name is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                      {t("Category")}<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="hdCategoryId"
                          value={data.hdCategoryId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.hdCategoryId === undefined ||
                            data.hdCategoryId === "0"
                          }
                        >
                          <option value="">{t("Select Category")}</option>
                          {hdCategoryListData.map((list) => (
                            <option
                              key={list.hdCategoryId}
                              value={list.hdCategoryId}
                            >
                              {list.hdCategoryName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                        {t("Category is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        {t("Sub Category")}<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="hdSubCategoryId"
                          value={data.hdSubCategoryId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.hdSubCategoryId === undefined ||
                            data.hdSubCategoryId === "0"
                          }
                        >
                          <option value="">{t("Select Sub Category")}</option>
                          {hdSubCategoryListData.map((list) => (
                            <option
                              key={list.hdSubCategoryId}
                              value={list.hdSubCategoryId}
                            >
                              {list.hdSubCategoryName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {t("Sub Category Name is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>


                 <Col lg="4">
  <Form.Group className="form-group mt-n4">
    <Form.Label htmlFor="hdUsersAffected">
      {t("Number Of Users Affected   (Numeric  Only)")}
    </Form.Label>

    <div className="form-control-wrap">
      <Form.Control
        id="hdUsersAffected"
        name="hdUsersAffected"
        value={data.hdUsersAffected}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*$/.test(value)) {
            handleInputs(e);
          }
        }}
        type="text"
        placeholder={t("Enter Number Of Users Affected")}
      />

      {/* Smaller helper text (non-italic) */}
      <small
        className="text-secondary d-block mt-1"
        style={{ fontSize: "11px", letterSpacing: "0.3px" }}
      >
        {t("")}
      </small>
    </div>
  </Form.Group>
</Col>

<Col lg="12">
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "8px 0 4px 0",
      marginTop: "8px",
      marginBottom: "-4px",
    }}
  >
    <span
      style={{
        width: "4px",
        height: "18px",
        background: "#1a5fa8",
        borderRadius: "2px",
        display: "inline-block",
      }}
    />
    <span
      style={{
        fontSize: "13.5px",
        fontWeight: 700,
        color: "#1a3c6e",
        letterSpacing: "0.5px",
        textTransform: "uppercase",
      }}
    >
      {t("Contact & Assignment")}
    </span>
  </div>
</Col>
<Col lg="4">
  <Form.Group className="form-group mt-n4">
    <Form.Label>
      {t("Contact Name")}
      <span className="text-danger">*</span>
    </Form.Label>
    <div className="form-control-wrap">
      <Form.Control
        type="text"
        name="contactPerson"                 // ✅ backend expects this
        value={data.contactPerson}
        onChange={handleInputs}
        placeholder={t("Enter Contact Name")}
        required
      />
      <Form.Control.Feedback type="invalid">
        {t("Contact Name is mandatory")}
      </Form.Control.Feedback>
    </div>
  </Form.Group>
</Col>

<Col lg="4">
  <Form.Group className="form-group mt-n4">
    <Form.Label>
      {t("Contact Number")}
      <span className="text-danger">*</span>
    </Form.Label>
    <div className="form-control-wrap">
      <Form.Control
        type="text"
        name="contactNumber"                // ✅ backend expects this
        value={data.contactNumber}
        maxLength={10}
        required
        placeholder={t("Enter Contact Number")}
        onChange={(e) => {
          // ✅ numbers only
          if (/^\d*$/.test(e.target.value)) {
            handleInputs(e);
          }
        }}
      />
      <Form.Control.Feedback type="invalid">
        {t("Contact Number is mandatory")}
      </Form.Control.Feedback>
    </div>
  </Form.Group>
</Col>

                  <Col lg="4">
                    <Form.Group as={Row} className="form-group mt-2">
                      <Form.Label column sm={3} className="mt-n2">
                        {t("On Behalf Of")}
                      </Form.Label>
                      <Col sm={1}>
                        <Form.Check
                          type="checkbox"
                          id="defaultAddress"
                          checked={check}
                          onChange={handleCheckBox}
                          // Optional: disable the checkbox in view mode
                          // defaultChecked
                        />
                      </Col>
                    </Form.Group>
                  </Col>

                  {check ? (
                    <Col lg="4">
                      <Form.Group className="form-group mt-n3">
                        <Form.Label>
                          {t("User Name")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="onBehalfOf"
                            value={data.onBehalfOf}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}

                            // isInvalid={
                            //   data.onBehalfOf === undefined ||
                            //   data.onBehalfOf === "0"
                            // }
                          >
                            <option value="">{t("Select Feature")}</option>
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
                    </Col>
                  ) : (
                    ""
                  )}

                  <Col lg="12">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "8px 0 4px 0",
                        marginTop: "8px",
                        marginBottom: "-4px",
                      }}
                    >
                      <span
                        style={{
                          width: "4px",
                          height: "18px",
                          background: "#1a5fa8",
                          borderRadius: "2px",
                          display: "inline-block",
                        }}
                      />
                      <span
                        style={{
                          fontSize: "13.5px",
                          fontWeight: 700,
                          color: "#1a3c6e",
                          letterSpacing: "0.5px",
                          textTransform: "uppercase",
                        }}
                      >
                        {t("Describe the Issue")}
                      </span>
                    </div>
                  </Col>
                  <Col lg="12">
                    <Form.Group className="form-group mt-n1">
                      <div
                        style={{
                          background: "#ffffff",
                          padding: "10px 14px",
                          borderRadius: "10px 10px 0 0",
                          border: "1px solid #dce8f5",
                          borderBottom: "none",
                          fontWeight: 600,
                          color: "#1a3c6e",
                          fontSize: "13.5px",
                          letterSpacing: "0.3px",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <Icon name="chat" style={{ fontSize: "15px", color: "#1a5fa8" }}></Icon>
                        {t("Query")}
                      </div>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="query"
                          name="query"
                          value={data.query}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Brief summary of your issue")}
                          rows="1"
                          style={{
                            borderRadius: "0 0 10px 10px",
                            border: "1px solid #dce8f5",
                          }}
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  {/* <Col lg="12">
                    <Form.Group className="form-group mt-n1">
                      <Card.Header>{t("Query Details")} </Card.Header>
                      <div className="form-control-wrap">
                        <div ref={quillRef} />
                      </div>
                    </Form.Group>
                  </Col> */}

                  <Col lg="12">
  <Form.Group className="form-group mt-n1">
    <div
      style={{
        background: "#ffffff",
        padding: "10px 14px",
        borderRadius: "10px 10px 0 0",
        border: "1px solid #dce8f5",
        borderBottom: "none",
        fontWeight: 600,
        color: "#1a3c6e",
        fontSize: "13.5px",
        letterSpacing: "0.3px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginTop: "8px",
      }}
    >
      <Icon name="text-a" style={{ fontSize: "15px", color: "#1a5fa8" }}></Icon>
      {t("Query Details")}
    </div>
    <div
      className="form-control-wrap"
      style={{
        border: "1px solid #dce8f5",
        borderTop: "none",
        borderRadius: "0 0 10px 10px",
        overflow: "hidden",
        background: "#ffffff",
      }}
    >
      <div ref={quillRef} />
    </div>
  </Form.Group>
</Col>


                  {/* <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        Status<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="hdStatusId"
                          value={data.hdStatusId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.hdStatusId === undefined ||
                            data.hdStatusId === "0"
                          }
                        >
                          <option value="">Select Status</option>
                          {hdStatusListData.map((list) => (
                            <option
                              key={list.hdStatusId}
                              value={list.hdStatusId}
                            >
                              {list.hdStatusName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Status is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col> */}

                  {/* <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="trUploadPath">
                        Attach Files
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          type="file"
                          id="hdAttachFiles"
                          name="hdAttachFiles"
                          // value={data.photoPath}
                          onChange={handleAttachFileChange}
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3 d-flex justify-content-center">
                      {attachFiles ? (
                        <img
                          style={{ height: "100px", width: "100px" }}
                          src={URL.createObjectURL(attachFiles)}
                        />
                      ) : (
                        ""
                      )}
                    </Form.Group>
                  </Col> */}
                  

<Col lg="12">
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "8px 0 4px 0",
      marginTop: "8px",
      marginBottom: "-4px",
    }}
  >
    <span
      style={{
        width: "4px",
        height: "18px",
        background: "#1a5fa8",
        borderRadius: "2px",
        display: "inline-block",
      }}
    />
    <span
      style={{
        fontSize: "13.5px",
        fontWeight: 700,
        color: "#1a3c6e",
        letterSpacing: "0.5px",
        textTransform: "uppercase",
      }}
    >
      {t("Attachments")}
    </span>
  </div>
</Col>
<Col lg="12">
  <Form.Group className="form-group mt-n2">
    <div
      style={{
        background: "#ffffff",
        border: "2px dashed #b9d2ec",
        borderRadius: "12px",
        padding: "18px 18px 6px 18px",
        transition: "border-color 0.15s ease, background 0.15s ease",
      }}
    >
      <Form.Label
        htmlFor="hdAttachFiles"
        className="d-flex align-items-center"
        style={{
          gap: "10px",
          fontWeight: 600,
          color: "#1a3c6e",
          marginBottom: "10px",
        }}
      >
        <span
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #e8f1ff 0%, #d4e6ff 100%)",
            color: "#1e67a8",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="upload" style={{ fontSize: "16px" }}></Icon>
        </span>
        {t("Attach Files")}
      </Form.Label>
      <div className="form-control-wrap">
        <Form.Control
          type="file"
          id="hdAttachFiles"
          name="hdAttachFiles"
          onChange={handleImageChange}
        />
      </div>
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
                            <p>No file selected or file was canceled.</p>
                          )}
                        </Form.Group>

  {/* Show preview and download option for the uploaded file */}
  {/* <Form.Group className="form-group mt-3 d-flex flex-column align-items-center">
    {attachFiles && attachFiles.name ? (
      <>
        {attachFiles.type.startsWith('image/') || 
          attachFiles.name.endsWith('.jpeg') || 
          attachFiles.name.endsWith('.jpg') || 
          attachFiles.name.endsWith('.png') ? ( // Check if the uploaded file is an image
          <img
            style={{ height: "300px", width: "auto", objectFit: "cover" }} // Larger size for image preview
            src={URL.createObjectURL(attachFiles)}
            alt="Uploaded Image"
          />
        ) : attachFiles.type === 'application/pdf' ? ( // Check if the uploaded file is a PDF
          <embed
            src={URL.createObjectURL(attachFiles)}
            type="application/pdf"
            width="300px" // Larger size for PDF preview
            height="300px"
          />
        ) : attachFiles.name.endsWith('.docx') ? ( // Handle `.docx` files
          <p>Preview not available for .docx files. File name: {attachFiles.name}</p>
        ) : (
          <p>Preview not available for this file type: {attachFiles.name}</p> // Fallback for unsupported file types
        )}

        {/* Download link for all file types */}
        {/* <a
          href={URL.createObjectURL(attachFiles)}
          download={attachFiles.name}
          className="btn btn-primary mt-3"
        >
          {t("Download")} {attachFiles.name}
        </a>
      </>
    ) : (
      <p>{t("No file selected or file was canceled.")}</p>
    )}
  </Form.Group> */}
  
  </Col>  

  
  
                        

                  <Col lg="12">
                    <div
                      style={{
                        marginTop: "14px",
                        paddingTop: "16px",
                        borderTop: "1px solid #dce8f5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: "12px",
                        flexWrap: "wrap",
                      }}
                    >
                      <Button
                        type="button"
                        onClick={clear}
                        disabled={isSubmitting}
                        className="d-inline-flex align-items-center"
                        style={{
                          background: "#ffffff",
                          border: "1px solid #b9d2ec",
                          color: "#1a3c6e",
                          fontWeight: 600,
                          padding: "9px 18px",
                          borderRadius: "10px",
                          gap: "8px",
                          boxShadow: "0 2px 6px rgba(15, 76, 138, 0.06)",
                          opacity: isSubmitting ? 0.55 : 1,
                          cursor: isSubmitting ? "not-allowed" : "pointer",
                        }}
                      >
                        <Icon name="plus-circle" style={{ fontSize: "16px" }}></Icon>
                        {t("Create New Ticket")}
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="d-inline-flex align-items-center"
                        style={{
                          background: isSubmitting
                            ? "#b9c4d6"
                            : "linear-gradient(135deg, #1e67a8 0%, #0f3060 100%)",
                          border: "none",
                          color: "#ffffff",
                          fontWeight: 700,
                          padding: "9px 22px",
                          borderRadius: "10px",
                          gap: "8px",
                          letterSpacing: "0.3px",
                          boxShadow: isSubmitting
                            ? "none"
                            : "0 6px 16px rgba(15, 76, 138, 0.28)",
                          cursor: isSubmitting ? "not-allowed" : "pointer",
                        }}
                      >
                        {isSubmitting ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                              style={{ width: "14px", height: "14px", borderWidth: "2px" }}
                            ></span>
                            {t("Submitting…")}
                          </>
                        ) : (
                          <>
                            <Icon name="send" style={{ fontSize: "16px" }}></Icon>
                            {t("Submit Ticket")}
                          </>
                        )}
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  <Button type="button" variant="primary" onClick={postData}>
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
            </div> */}
        </Form>
      </Block>
    </Layout>
  );
}
export default HelpDesk;
