import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
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
const baseURLFarmerServer =
  process.env.REACT_APP_API_BASE_URL_REGISTRATION_FROM_FRUITS;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;

function ServiceApplicationEdit() {
  const { id } = useParams();
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

  const [developedLand, setDevelopedLand] = useState({
    dbtFarmerLandDetailsId: "",
    scApplicationFormId: "",
    farmerId: "",
    hissa: "",
    subsidyAvailed: "",
    surveyNumber: "",
    ownerName: "",
    surNoc: "",
    ownerNo: "",
    mainOwnerNo: "",
    acre: "",
    gunta: "",
    landCode: "",
    districtCode: "",
    talukCode: "",
    hobliCode: "",
    villageCode: "",
    fgunta: "",
  });

  const [equipment, setEquipment] = useState({
    unitType: "",
    description: "",
    price: "",
    vendorId: "",
    payToVendor: false,
  });

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

     
    
      const handleEditDocument = async (documentPath) => {
        await getDocumentFile(documentPath);
        handleShowModal();
      };

      const [currentDocumentPath, setCurrentDocumentPath] = useState(null);

      const handleDocumentClick = async (documentPath) => {
        setCurrentDocumentPath(documentPath);
        await getDocumentFile(documentPath);
      };
      
        // To get Photo from S3 Bucket
        const [selectedDocumentFile, setSelectedDocumentFile] = useState(null);
      
        const getDocumentFile = async (file) => {
          const parameters = `fileName=${file}`;
          try {
            const response = await api.get(
              baseURLDBT + `service/downLoadFile?${parameters}`,
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

        const downloadFile = async (file) => {
          const parameters = `fileName=${file}`;
          try {
            const response = await api.get(
              baseURLDBT + `service/downLoadFile?${parameters}`,
              {
                responseType: "arraybuffer",
              }
            );
            const blob = new Blob([response.data]);
            const url = URL.createObjectURL(blob);
      
            const fileExtension = file.split(".").pop();
      
            const link = document.createElement("a");
            link.href = url;
      
            const modifiedFileName = file.replace(/_([^_]*)$/, ".$1");
      
            link.download = modifiedFileName;
      
            document.body.appendChild(link);
            link.click();
      
            document.body.removeChild(link);
          } catch (error) {
            console.error("Error fetching file:", error);
          }
        };

        const deleteFile = async (file) => {
          const parameters = `fileName=${file}`;
          try {
            const response = await api.delete(
              baseURLDBT + `service/delete?${parameters}`
            );
            if (response.status === 200) {
              console.log("File deleted successfully");
              // Optionally, you can refresh the file list or update the UI
            }
          } catch (error) {
            console.error("Error deleting file:", error);
          }
        };
        

  const [farmerDetails, setFarmerDetails] = useState({
    farmerName: "",
    hobli: "",
    village: "",
    talukName: "",
    fid: "",
  });

  const [farmerId, setFarmerId] = useState(0);

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURLDBT + `service/get-application-form-service-join/${id}`)
      .then((response) => {
        const datas = response.data.content;
        setData((prev) => ({
          ...prev,
          scSchemeDetailsId: datas.schemeId,
          scSubSchemeDetailsId: datas.subSchemeId,
          scComponentId: datas.componentId,
          scCategoryId: datas.categoryId,
          scHeadAccountId: datas.headOfAccountId,
          financialYearMasterId: datas.financialYearMasterId,
          schemeAmount: datas.schemeAmount,
          sanctionNumber: datas.sanctionNo,
          scSubSchemeType: datas.componentType,
          periodFrom: new Date("2023-04-01"),
          periodTo: new Date("2024-03-31"),
        }));

        setFarmerId(datas.farmerId);

        api
          .get(
            baseURLRegistration +
              `farmer-address/get-by-farmer-id-join/${datas.farmerId}`
          )
          .then((response) => {
            if (response.data.errorCode === -1) {
              saveError(response.data.message);
            } else {
              // console.log("Fruits ID",response.data.content.fruitsId);
              setFarmerDetails((prev) => ({
                ...prev,
                village:
                  response.data.content.farmerAddress &&
                  response.data.content.farmerAddress[0].villageName,
                talukName:
                  response.data.content.farmerAddress &&
                  response.data.content.farmerAddress[0].talukName,
              }));
              setValidated(false);
            }
          })
          .catch((err) => {
            handleError(err);
          });

        api
          .get(
            baseURLRegistration +
              `farmer/get-by-farmer-id-join/${datas.farmerId}`
          )
          .then((response) => {
            if (response.data.errorCode === -1) {
              saveError(response.data.message);
            } else {
              setFarmerDetails((prev) => ({
                ...prev,
                farmerName: response.data.content.firstName,
                fid: response.data.content.fruitsId,
              }));
              setValidated(false);
            }
          })
          .catch((err) => {
            handleError(err);
          });

        api
          .get(
            baseURLDBT +
              `dbt-farmer-land-details/get-by-farmer-id/${datas.farmerId}`
          )
          .then((response) => {
            if (response.data.errorCode === -1) {
              saveError(response.data.message);
            } else {
              const landDetails =
                response.data.content.dbtFarmerLandDetails || [];
              console.log("Fetched land details:", landDetails);
              setSavedLandDetailsList(landDetails);
            }
            setLoading(false);
          })
          .catch((err) => {
            handleError(err);
            setLoading(false);
          });

       // Call handleView with applicationFormId
      handleView(id); // Ensure applicationFormId exists in datas
      
      setLoading(false);
    })
      .catch((err) => {
        const message = err.response.data.errorMessages[0].message[0].message;
        setData({});
        setLoading(false);
      }); 
  };

  useEffect(() => {
    getIdList();
  }, [id]);

  const getDirectData = () => {
    api
      .post(baseURLFarmerServer + `farmer/get-details-by-fruits-id`, {
        fruitsId: farmerDetails.fid,
      })
      .then((response) => {
        console.log("landdetails", response.data);
        if (response.data.content.farmerLandDetailsDTOList.length > 0) {
          setLandDetailsList(response.data.content.farmerLandDetailsDTOList);
        }
      })
      .catch((err) => {
        setLandDetailsList([]);
      });
  };

  useEffect(() => {
    getDirectData();
  }, [farmerDetails.fid]);

  const handleError = (err) => {
    if (
      err.response &&
      err.response.data &&
      err.response.data.validationErrors
    ) {
      if (Object.keys(err.response.data.validationErrors).length > 0) {
        saveError(err.response.data.validationErrors);
      }
    }
  };

  const [savedLandDetailsList, setSavedLandDetailsList] = useState([]);
 

  console.log("changes", data);

  const handleRemoveImage = (documentId) => {
    const updatedDocument = { ...documentAttachments };
    delete updatedDocument[documentId];
    setDocumentAttachments(updatedDocument);
    document.getElementById(`attImage${documentId}`).value = "";
    // setData((prev) => ({ ...prev, hdAttachFiles: "" }));
  };

  // console.log(documentAttachments);

  // const handleAttachFileUpload = async (documentId) => {
  //   const param = {
  //     applicationFormId: id,
  //     documentTypeId: documentId,
  //   };
  
  //   try {
  //     const formData = new FormData();
  //     formData.append("multipartFile", documentAttachments[documentId]);
  
  //     const response = await api.post(
  //       baseURLDBT + `service/uploadDocument`,
  //       formData,
  //       {
  //         params: param,
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  
  //     console.log("File upload response:", response.data);
  
     
  // Swal.fire({
  //   icon: "success",
  //   title: "File uploaded successfully",
  // });
 
  // setUploadStatus((prevStatus) => ({
  //   ...prevStatus,
  //   [documentId]: true, // Mark this document as uploaded
  // }));
  //   } catch (error) {
  //     console.error("Error uploading file:", error);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: "Error uploading file. Please try again.",
  //     });
  //   }
  // };

  const [uploadDocuments, setUploadDocuments] = useState({
    applicationFormId: "",
    documentTypeId: "",
    documentPath: "",
  });
  const handleDocumentInputs = (e) => {
    let { name, value } = e.target;
    // setUploadDocuments({ ...uploadDocuments, [name]: value });
    setUploadDocuments(prev=>({...prev,  [name]: value }));
  };

  //Display Document
   const [document, setDocument] = useState("");

   const handleDocumentChange = (e) => {
     const file = e.target.files[0];
     setDocument(file);
     setUploadDocuments((prev) => ({ ...prev, documentPath: file.name }));
    //  setPhotoFile(file);
   };

  const [uploadedDocuments, setUploadedDocuments] = useState([]);

  const handleAttachFileUpload = async (documentId) => {
    const param = {
      applicationFormId: id,
      documentTypeId: documentId,
    };
  
    try {
      const formData = new FormData();
      // formData.append("multipartFile", documentAttachments[documentId]);
      formData.append("multipartFile", document);
  
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
  
      // Show SweetAlert success message after successful upload
      // SweetAlert success function
  Swal.fire({
    icon: "success",
    title: "File uploaded successfully",
  });
  // setIsUploaded(true);
  // Update the upload status for this specific document
  setUploadStatus((prevStatus) => ({
    ...prevStatus,
    [documentId]: true, // Mark this document as uploaded
  }));
   // Add the uploaded document to the list of uploaded documents
  //  setUploadedDocuments((prevDocs) => [
  //   ...prevDocs,
  //   {
  //     documentId,
  //     documentName: document.name,
  //   },
  // ]);
  // Modify the setUploadedDocuments to include documentMasterName
setUploadedDocuments((prevDocs) => [
  ...prevDocs,
  {
    documentId,
    documentName: document.name,
    documentMasterName: docListData.find(
      (list) => list.documentMasterId === documentId
    )?.documentMasterName, // Find and store the documentMasterName
    documentFile: document, // Store the file itself for image preview
  },
]);
    } catch (error) {
      console.error("Error uploading file:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error uploading file. Please try again.",
      });
    }
  };
const[applicationFormId ,setApplicationFormId] = useState ("");

  const [showModal, setShowModal] = useState(false);
  const handleShowModal = (applicationFormId) => {
    // Check if the applicationFormId is valid
    if (applicationFormId) {
      setApplicationId(applicationFormId);  // Set applicationId if passed from the button click
    }
    setShowModal(true);  // Open the modal
  };
  
  
  
  // const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleCheckBox = (e) => {
    setEquipment((prev) => ({
      ...prev,
      payToVendor: e.target.checked,
    }));
  };

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  console.log("hehehehehe", data);

  const [isDisabled, setIsDisabled] = useState(true);

  const [landDetailsList, setLandDetailsList] = useState([]);

  const [landDetailsIds, setLandDetailsIds] = useState([]);

  const [developedArea, setDevelopedArea] = useState([]);

  // const handleCheckboxChange = (farmerLandDetailsId) => {
  //   setLandDetailsIds((prevIds) => {
  //     const isAlreadySelected = prevIds.includes(farmerLandDetailsId);
  //     const newIds = isAlreadySelected
  //       ? prevIds.filter((id) => id !== farmerLandDetailsId)
  //       : [...prevIds, farmerLandDetailsId];

  //     setDevelopedArea((prevData) => {
  //       if (isAlreadySelected) {
  //         const { [farmerLandDetailsId]: _, ...rest } = prevData;
  //         return rest;
  //       } else {
  //         // If selected, add to developedArea
  //         return {
  //           ...prevData,
  //           [farmerLandDetailsId]: {
  //             acre: prevData[farmerLandDetailsId]?.acre || "0",
  //             gunta: prevData[farmerLandDetailsId]?.gunta || "0",
  //             fgunta: prevData[farmerLandDetailsId]?.fgunta || "0",
  //           },
  //         };
  //       }
  //     });

  //     return newIds;
  //   });
  // };

  const handleCheckboxChange = (farmerLandDetailsId, selectedData) => {
    setLandDetailsIds((prevIds) => {
      const isAlreadySelected = prevIds.includes(farmerLandDetailsId);
      // For Single Select
      const newIds = isAlreadySelected ? [] : [farmerLandDetailsId];
      // For Multiple Select
      // const newIds = isAlreadySelected
      //   ? prevIds.filter((id) => id !== farmerLandDetailsId)
      //   : [...prevIds, farmerLandDetailsId];

      setDevelopedArea((prevData) => {
        if (isAlreadySelected) {
          const { [farmerLandDetailsId]: _, ...rest } = prevData;
          return rest;
        } else {
          // If selected, add to developedArea
          return {
            // ...prevData,
            [farmerLandDetailsId]: {
              ...selectedData,
              devAcre: prevData[farmerLandDetailsId]?.devAcre || "0",
              devGunta: prevData[farmerLandDetailsId]?.devFGunta || "0",
              devFGunta: prevData[farmerLandDetailsId]?.devFGunta || "0",
            },
          };
        }
      });

      return newIds;
    });
  };

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

  // to get Financial Year
  const [financialyearListData, setFinancialyearListData] = useState([]);

  const getFinancialList = () => {
    const response = api
      .get(baseURLMasterData + `financialYearMaster/get-all`)
      .then((response) => {
        setFinancialyearListData(response.data.content.financialYearMaster);
      })
      .catch((err) => {
        setFinancialyearListData([]);
      });
  };

  useEffect(() => {
    getFinancialList();
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
      getSchemeQuotaList(data.scSchemeDetailsId);
    }
  }, [data.scSchemeDetailsId]);

  // const getSubSchemeList = () => {
  //   const response = api
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

  const [viewDetailsData, setViewDetailsData] = useState({
    // applicationDetails: [],
    // landDetails: [],
    // applicationTransactionDetails: [],
    documentsResponses: [],
  });

  const handleView = (_id) => {
    api
      .post(baseURLDBT + `service/viewServiceApplicationDetails`, {
        applicationFormId: _id,
      })
      .then((response) => {
        const content = response.data.content[0];
        
        // if (content.applicationDetailsResponses.length <= 0) {
        //   saveError("No Details Found!!!");
        // } else {
          // Update state with document responses and other details if needed
          setViewDetailsData(content.documentsResponses);
          
          // Fetch the ID list based on applicationFormId
          // getIdList(_id);
        // }
      })
      .catch((err) => {
        // Handle error if needed
      });
  };
  
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
  const getHeadAccountList = () => {
    api
      .get(baseURLMasterData + `scHeadAccount/get-all`)
      .then((response) => {
        if (response.data.content.scHeadAccount) {
          setScHeadAccountListData(response.data.content.scHeadAccount);
        }
      })
      .catch((err) => {
        setScHeadAccountListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    getHeadAccountList();
  }, []);

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
  // const [docListData, setDocListData] = useState([]);

  // const getDocList = () => {
  //   api
  //     .post(baseURLDBT + `service/getApplicableDocumentList`)
  //     .then((response) => {
  //       setDocListData(response.data.content);
  //     })
  //     .catch((err) => {
  //       setDocListData([]);
  //     });
  // };

  // useEffect(() => {
  //   getDocList();
  // }, []);

  // to get scheme-Quota-details
  const [schemeQuotaDetailsListData, setSchemeQuotaDetailsListData] = useState(
    []
  );

  const getSchemeQuotaList = (_id) => {
    api
      .get(baseURLMasterData + `schemeQuota/get-by-sc-scheme-details-id/${_id}`)
      .then((response) => {
        setSchemeQuotaDetailsListData(response.data.content.schemeQuota);
      })
      .catch((err) => {
        setSchemeQuotaDetailsListData([]);
      });
  };

  // to get component
  const [scComponentListData, setScComponentListData] = useState([]);

  // const getComponentList = () => {
  //   api
  //     .get(baseURLMasterData + `scComponent/get-all`)
  //     .then((response) => {
  //       setScComponentListData(response.data.content.scComponent);
  //     })
  //     .catch((err) => {
  //       setScComponentListData([]);
  //     });
  // };

  // useEffect(() => {
  //   getComponentList();
  // }, []);

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

  const getHeadAccountbyschemeIdAndSubSchemeIdList = (
    schemeId,
    subSchemeId
  ) => {
    api
      .post(baseURLDBT + `master/cost/get-hoa-by-schemeId-and-subSchemeId`, {
        schemeId: schemeId,
        subSchemeId: subSchemeId,
      })
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
    if (data.scSchemeDetailsId && data.scSubSchemeDetailsId) {
      getComponentList(data.scSchemeDetailsId, data.scSubSchemeDetailsId);
      getHeadAccountbyschemeIdAndSubSchemeIdList(
        data.scSchemeDetailsId,
        data.scSubSchemeDetailsId
      );
    }
  }, [data.scSchemeDetailsId, data.scSubSchemeDetailsId]);

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
      // landDeveloped: developedLand.landDeveloped,
      // landDetailId: parseInt(id),
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
        id: id,
        farmerId: farmerId,
        headOfAccountId: data.scHeadAccountId,
        schemeId: data.scSchemeDetailsId,
        subSchemeId: data.scSubSchemeDetailsId,
        componentType: data.scSubSchemeType,
        componentTypeName: "",
        sanctionAmount: data.sanctionAmount,
        schemeAmount: data.schemeAmount,
        sanctionNo: data.sanctionNumber,
        acre: developedLand.acre,
        gunta: developedLand.gunta,
        fgunta: developedLand.fgunta,
        categoryId: data.scCategoryId,
        componentId: data.scComponentId,
        landDetailId: landDetailsIds[0],
        talukId: landData.talukId,
        newFarmer: true,
        expectedAmount: data.expectedAmount,
        financialYearMasterId: data.financialYearMasterId,
        periodFrom: data.periodFrom,
        periodTo: data.periodTo,
        devAcre: 0,
        devGunta: 0,
        devFGunta: 0,
      };

      if (data.equordev === "land") {
        // sendPost.applicationFormLandDetailRequestList = [
        //   {
        //     unitTypeMasterId: developedLand.unitType,
        //     landDeveloped: developedLand.landDeveloped,
        //   },
        // ];
        sendPost.dbtFarmerLandDetailsRequestList = transformedData;
      } else if (data.equordev === "equipment") {
        sendPost.applicationFormLineItemRequestList = [
          {
            unitTypeMasterId: equipment.unitType,
            lineItemComment: equipment.description,
            cost: equipment.price,
            vendorId: equipment.vendorId,
          },
        ];
      }

      // if (data.fruitsId.length < 16 || data.fruitsId.length > 16) {
      //   return;
      // }
      api
        .post(baseURLDBT + `service/editServiceApplicationForm`, sendPost)
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
            setApplicationId(response.data.content.applicationDocumentId);
            clear();
            
            getIdList();
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

  // const clear = () => {
  //   setData({
  //   with: "withLand",
  //   subinc: "subsidy",
  //   equordev: "land",
  //   scSchemeDetailsId: "",
  //   scSubSchemeDetailsId: "",
  //   scHeadAccountId: "",
  //   scCategoryId: "",
  //   scSubSchemeType: "",
  //   scVendorId: "",
  //   farmerId: "",
  //   expectedAmount: "",
  //   financialYearMasterId: "",
  //   scComponentId: "",
  //   schemeAmount: "",
  //   sanctionNumber: "",
  //   });
  //   setDevelopedLand({
  //     landDeveloped: "",
  //     unitType: "",
  //   });
  //   setEquipment({
  //     unitType: "",
  //     description: "",
  //     price: "",
  //     vendorId: "",
  //     payToVendor: false,
  //   });
  //   setDocumentAttachments({});
  //   setSavedLandDetailsList([]);
  //   setLandDetailsList([]);
  //   setDevelopedArea([]);
  //   setLandDetailsIds([]);
  //   getIdList();
  //   getDirectData();
  // };

  const clear = () => {
    // Resetting all data and states
    setData({
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
  
    // Clear developed land details
    setDevelopedLand({
      landDeveloped: "",
      unitType: "",
    });
  
    // Clear equipment-related fields
    setEquipment({
      unitType: "",
      description: "",
      price: "",
      vendorId: "",
      payToVendor: false,
    });
  
    // Clear document attachments
    setDocumentAttachments({});
  
    // Clear saved and editable land details
    setSavedLandDetailsList([]);
    setLandDetailsList([]);
  
    // Clear developed area data
    setDevelopedArea([]);
  
    // Clear land detail IDs
    setLandDetailsIds([]);
  
    // Fetch new IDs and other related data again after clearing
    getIdList();
    getDirectData();
  };
  

  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Updated Successfully",
      //   text: `Receipt Number ${message}`,
    });
    clear();
  };

  const [uploadStatus, setUploadStatus] = useState({});

  const [applicationId, setApplicationId] = useState("");

  
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

  // const handleInlineDevelopedLandChange = (e, row) => {
  //   const { name, value } = e.target;
  //   const farmerLandDetailsId = row.farmerLandDetailsId;

  const handleInlineDevelopedLandChange = (e, row,i) => {
    const { name, value } = e.target;
    const farmerLandDetailsId =i;

    setDevelopedArea((prevData) => ({
      ...prevData,
      [farmerLandDetailsId]: {
        ...prevData[farmerLandDetailsId],
        [name]: value,
      },
    }));
  };

  const LandDetailsForDevColumns = [
    {
      // name: "Select",
      // selector: "select",
      // cell: (row) => (
      //   <input
      //     type="checkbox"
      //     name="selectedLand"
      //     value={row.farmerLandDetailsId}
      //     checked={landDetailsIds.includes(row.farmerLandDetailsId)}
      //     onChange={() => handleCheckboxChange(row.farmerLandDetailsId)}
      //   />
      name: "Select",
      selector: "select",
      cell: (row, i) => (
        <input
          type="checkbox"
          name="selectedLand"
          value={i}
          checked={landDetailsIds.includes(i)}
          onChange={() => handleCheckboxChange(i, row)}
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

  //   {
  //     name: "Developed Area (Acre/Gunta/FGunta)",
  //     // selector: (row) => row.acre,
  //     cell: (row) => (
  //       <>
  //         <Form.Control
  //           name="acre"
  //           type="text"
  //           value={developedArea[row.farmerLandDetailsId]?.acre || ""}
  //           onChange={(e) => handleInlineDevelopedLandChange(e, row)}
  //           placeholder="Acre"
  //           className="m-1"
  //         />
  //         <Form.Control
  //           name="gunta"
  //           type="text"
  //           value={developedArea[row.farmerLandDetailsId]?.gunta || ""}
  //           onChange={(e) => handleInlineDevelopedLandChange(e, row)}
  //           placeholder="Gunta"
  //           className="m-1"
  //         />
  //         <Form.Control
  //           name="fgunta"
  //           type="text"
  //           value={developedArea[row.farmerLandDetailsId]?.fgunta || ""}
  //           onChange={(e) => handleInlineDevelopedLandChange(e, row)}
  //           placeholder="FGunta"
  //           className="m-1"
  //         />
  //       </>
  //     ),
  //     // cell: (row) => <span>{row.acre}</span>,
  //     sortable: true,
  //     hide: "md",
  //     grow: 3,
  //   },
  // ];
  {
    name: "Developed Area (Acre/Gunta/FGunta)",
    // selector: (row) => row.acre,
    cell: (row, i) => (
      <>
        <Form.Control
          name="devAcre"
          type="text"
          value={developedArea[i]?.devAcre || ""}
          onChange={(e) => handleInlineDevelopedLandChange(e, row, i)}
          placeholder="Acre"
          className="m-1"
        />
        <Form.Control
          name="devGunta"
          type="text"
          value={developedArea[i]?.devGunta || ""}
          onChange={(e) => handleInlineDevelopedLandChange(e, row, i)}
          placeholder="Gunta"
          className="m-1"
        />
        <Form.Control
          name="devFGunta"
          type="text"
          value={developedArea[i]?.devFGunta || ""}
          onChange={(e) => handleInlineDevelopedLandChange(e, row, i)}
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

  const LandDetailsColumns = [
    // {
    //   name: "Select",
    //   selector: "select",
    //   cell: (row) => (
    //     <input
    //       type="radio"
    //       name="selectedLand"
    //       value={row.farmerLandDetailsId}
    //       // checked={selectedLandId === row.id}
    //       onChange={() => handleRadioChange(row.farmerLandDetailsId)}
    //     />
    //   ),
    //   // ignoreRowClick: true,
    //   // allowOverflow: true,
    //   button: true,
    // },
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
      cell: (row) => <span>{row.fgunta}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "DevAcre",
      selector: (row) => row.devAcre,
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
      cell: (row) => <span>{row.devAcre}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "DevGunta",
      selector: (row) => row.devGunta,
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
      cell: (row) => <span>{row.devGunta}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "DevFGunta",
      selector: (row) => row.devFGunta,
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
      cell: (row) => <span>{row.devFGunta}</span>,
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

   // to get uploadable documents
   const [docListData, setDocListData] = useState([]);

   const getDocList = () => {
     api
       .get(baseURLMasterData + `documentMaster/get-all`)
       .then((response) => {
         setDocListData(response.data.content.documentMaster);
       })
       .catch((err) => {
         setDocListData([]);
       });
   };

   useEffect(() => {
    getDocList();
  }, []);

  const deleteError = () => {
    Swal.fire({
      icon: "error",
      title: "Delete attempt was not successful",
      text: "Something went wrong!",
    });
  };

  const deleteConfirm = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "It will delete permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        const response = api
          .delete(baseURLDBT + `service/delete/${id}`)
          .then((response) => {
            // deleteConfirm(_id);
            handleView();
            Swal.fire(
              "Deleted",
              "You successfully deleted this record",
              "success"
            );
          })
          .catch((err) => {
            deleteError();
          });
        // Swal.fire("Deleted", "You successfully deleted this record", "success");
      } else {
        console.log(result.value);
        Swal.fire("Cancelled", "Your record is not deleted", "info");
      }
    });
  };

  const DocumentsUploaded = [
    
    {
      name: "Document Name",
      selector: (row) => row.documentName,  
      cell: (row) => <span>{row.documentName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Document Path",
      selector: (row) => row.documentPath,
      cell: (row) => <span>{row.documentPath}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Documents",
      selector: (row) => row.documentPath,
      cell: (row) => (
        <div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleDocumentClick(row.documentPath)}
          >
            View Document
          </Button>
          {currentDocumentPath === row.documentPath && selectedDocumentFile && (
            <>
              <img
                style={{ height: "100px", width: "100px" }}
                src={selectedDocumentFile}
                alt="Selected File"
              />
              <Button
                variant="primary"
                size="sm"
                className="ms-2"
                onClick={() => downloadFile(row.documentPath)}
              >
                Download Selected File
              </Button>
            </>
          )}
        </div>
      ),
      sortable: false,
      hide: "md",
    },
        
    {
      name: "Action",
      // selector: (row) => row.documentPath,
      cell: (row) => (
        <div className="text-start w-100">
       
        <Button
          variant="danger"
          size="sm"
          onClick={() => deleteConfirm(row.id)}
          className="ms-2"
        >
          Delete
        </Button>
      </div>
    ),
    sortable: false,
    hide: "md",
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
    <Layout title="Service Application Edit">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Service Application Edit</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/all-application-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Application Form List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/all-application-list"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>Service Application List</span>
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
                  {/* <Form.Group as={Row} className="form-group" controlId="fid">
                    <Form.Label column sm={1} style={{ fontWeight: "bold" }}>
                      Farmer Name<span className="text-danger">*</span>
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
                  </Form.Group> */}
                  <Row className="g-gs mt-1">
                    <Col lg="12">
                      <table className="table small table-bordered">
                        <tbody>
                          <tr>
                            <td style={styles.ctstyle}> Farmer Name:</td>
                            <td>{farmerDetails.farmerName}</td>
                            <td style={styles.ctstyle}> FID:</td>
                            <td>{farmerDetails.fid}</td>
                            <td style={styles.ctstyle}> Taluk :</td>
                            <td>{farmerDetails.talukName}</td>
                            <td style={styles.ctstyle}> Village:</td>
                            <td>{farmerDetails.village}</td>
                          </tr>
                        </tbody>
                      </table>
                    </Col>
                  </Row>
                </Col>
              </Row>
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
                            <Form.Label>
                              Financial Year
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="financialYearMasterId"
                                value={data.financialYearMasterId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                required
                                disabled
                                isInvalid={
                                  data.financialYearMasterId === undefined ||
                                  data.financialYearMasterId === "0"
                                }
                              >
                                <option value="">Select Year</option>
                                {financialyearListData.map((list) => (
                                  <option
                                    key={list.financialYearMasterId}
                                    value={list.financialYearMasterId}
                                  >
                                    {list.financialYear}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                Financial Year is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

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
                                {scSchemeDetailsListData && scSchemeDetailsListData.length > 0 ? (
                                  scSchemeDetailsListData.map((list) => (
                                  <option
                                    key={list.scSchemeDetailsId}
                                    value={list.scSchemeDetailsId}
                                  >
                                    {list.schemeName}
                                  </option>
                                ))
                              ) : (
                                <></> 
                              )} 
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
                                {scSubSchemeDetailsListData && scSubSchemeDetailsListData.length > 0 ? (
                                  scSubSchemeDetailsListData.map((list, i) => (
                                    <option key={i} value={list.subSchemeId}>
                                      {list.subSchemeName}
                                    </option>
                                  ))
                              ) : (
                                <></> 
                              )} 
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                Component Type is required
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
                                <option value="">Select Category</option>
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
                                Category is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

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
                            <Form.Label htmlFor="sanctionAmount">
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
                        </Col>

                        <Col lg="6">
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

                        <Col lg="2">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="sordfl">
                              From Date
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <DatePicker
                                selected={data.periodFrom ? new Date(data.periodFrom) : null}
                                onChange={(date) =>
                                  handleDateChange(date, "periodFrom")
                                }
                                peekNextMonth
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                                required
                                // readOnly
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="2">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="sordfl">
                              To Date
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <DatePicker
                                selected={data.periodTo ? new Date(data.periodTo):null}
                                onChange={(date) =>
                                  handleDateChange(date, "periodTo")
                                }
                                peekNextMonth
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                                required
                                // readOnly
                              />
                            </div>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Block>
              </Col>

              <Block className="mt-3">
                <Card>
                  <Card.Header style={{ fontWeight: "bold" }}>
                    Saved Land Details
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <DataTable
                        tableClassName="data-table-head-light table-responsive"
                        columns={LandDetailsColumns}
                        data={savedLandDetailsList}
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
                </Card>
              </Block>

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
              {data.with === "withLand" && landDetailsList.length > 0 ? (
                <>
                  <Block className="mt-3">
                    <Card>
                      {/* <Card.Header style={{ fontWeight: "bold" }}>
                        RTC Details
                      </Card.Header> */}
                      <Card.Body>
                      <Card.Header style={{ fontWeight: "bold" }}>
                        Edit Land Details
                      </Card.Header>
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

                  <Block className="mt-3">
                <Card>
                  <Card.Header style={{ fontWeight: "bold" }}>
                    Documents
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <DataTable
                        tableClassName="data-table-head-light table-responsive"
                        columns={DocumentsUploaded}
                        data={viewDetailsData}
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
                    <div className="gap-col">
                <ul className="d-flex align-items-center justify-content-center gap g-3">
                  <li>
                    {/* <Button type="button" variant="primary" onClick={postData}> */}
                    {/* <Button type="submit" variant="primary"onClick={handleShowModal}>
                      Upload Documents
                    </Button> */}
                    <Button
                    variant="secondary"
                    size="sm"
                    className="ms-2"
                    onClick={() => handleShowModal(applicationId)}
                  >
                    Upload Documents
                  </Button>
                  </li>
                  
                </ul>
              </div>
                  </Card.Body>
                </Card>
              </Block>
                </>
              ) : (
                ""
              )}

              <div className="gap-col">
                <ul className="d-flex align-items-center justify-content-center gap g-3">
                  <li>
                    {/* <Button type="button" variant="primary" onClick={postData}> */}
                    <Button type="submit" variant="primary">
                      Update
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
          <Modal.Title>Upload Documents</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* {docListData.map(({ documentMasterId, documentMasterName }) => (
            <div key={documentMasterId}>
              <Row className="d-flex justify-content-center align-items-center">
                <Col lg="2">
                  <Form.Group className="form-group mt-1">
                    <Form.Label htmlFor="trUploadPath">
                      {documentMasterName}
                    </Form.Label>
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="form-group mt-1">
                    <div className="form-control-wrap">
                      <Form.Control
                        type="file"
                        id={`attImage${documentMasterId}`}
                        onChange={(e) => handleAttachFileChange(e, documentMasterId)}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4" style={{ position: "relative" }}>
                  <Form.Group className="form-group mt-3 d-flex justify-content-center">
                    {documentAttachments[documentMasterId] && (
                      <div style={{ position: "relative" }}>
                        <img
                          style={{ height: "150px", width: "150px" }}
                          src={URL.createObjectURL(
                            documentAttachments[documentMasterId]
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
                          onClick={() => handleRemoveImage(documentMasterId)}
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
                onClick={() => handleAttachFileUpload(documentMasterId)}
                disabled={uploadStatus[documentMasterId]} // Disable button if this document is uploaded
              >
                {uploadStatus[documentMasterId] ? "Uploaded" : "Upload"}
              </Button>
              </Col>
              </Row>
            </div>
          ))} */}
          <Block className="mt-3">
              <Row>
                <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label><strong>Documents</strong></Form.Label>
                        <Form.Select
                          name="documentTypeId"
                          value={uploadDocuments.documentTypeId}
                          onChange={handleDocumentInputs}
                        >
                          <option value="">Choose Document Type</option>
                          {docListData.map((list) => (
                            <option
                              key={list.documentMasterId}
                              value={list.documentMasterId}
                            >
                              {list.documentMasterName}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                <Col lg="6">
                <Form.Group className="form-group">
                        <Form.Label htmlFor="accountImagePath">
                          Upload Documents(PDF/jpg/png)(Max:2mb)
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            type="file"
                            id="documentPath"
                            name="documentPath"
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

              {/* {uploadedDocuments.length > 0 && (
    <div className="mt-3">
      <h5>Uploaded Documents</h5>
      <ul>
        {uploadedDocuments.map((doc, index) => (
          <li key={index}>
            Document Type: {doc.documentId} - {doc.documentName}
          </li>
        ))}
      </ul>
    </div>
  )} */}

  {uploadedDocuments.length > 0 && (
  <div className="mt-3">
    <h5>Uploaded Documents</h5>
    <ul>
      {uploadedDocuments.map((doc, index) => (
        <li key={index} className="d-flex align-items-center">
          {/* Show the image if it's available */}
          {doc.documentFile && (
            <img
              src={URL.createObjectURL(doc.documentFile)}
              alt={doc.documentName}
              style={{ height: "100px", width: "100px", marginRight: "10px" }}
            />
          )}
          {/* Show the document master name */}
          {/* <span>Document Type: {doc.documentMasterName }</span> */}
        </li>
      ))}
    </ul>
  </div>
)}

            </Block>

            {/* <Col lg="12"> */}
            <div className="gap-col mt-1">
            <ul className="d-flex align-items-center justify-content-center gap g-3">
              <li>
                {/* <Button type="submit" variant="success">
                  Upload Documents
                </Button> */}
                <Button
                type="button"
                variant="primary"
                onClick={() => handleAttachFileUpload(uploadDocuments.documentTypeId)}
                disabled={uploadStatus[uploadDocuments.documentTypeId]} // Disable button if this document is uploaded
              >
                {uploadStatus[uploadDocuments.documentTypeId] ? "Uploaded" : "Upload"}
              </Button>
                </li>
        </ul>
      </div>
        </Modal.Body>
      </Modal>

    

      {/* <Modal show={showModal} onHide={handleCloseModal} size="xl">
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
                    <div className="form-control-wrap">
                      <Form.Control
                        type="file"
                        id={`attImage${documentId}`}
                       
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
      </Modal> */}
    </Layout>
  );
}

export default ServiceApplicationEdit;
