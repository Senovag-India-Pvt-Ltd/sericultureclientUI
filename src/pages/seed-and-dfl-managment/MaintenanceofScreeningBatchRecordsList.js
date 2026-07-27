import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
// import axios from "axios";
import Swal from "sweetalert2";
import { createTheme } from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { Icon, Select } from "../../components";
import { AiOutlineInfoCircle } from "react-icons/ai";
import api from "../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

// const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

function MaintenanceofScreeningBatchRecordsList() {
  const { t } = useTranslation();
  const [listData, setListData] = useState({});
  const [listLogsData, setListLogsData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };
  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleShowModal1 = () => setShowModal1(true);
  const handleCloseModal1 = () => setShowModal1(false);

  const handleShowModal2 = () => setShowModal2(true);
  const handleCloseModal2 = () => setShowModal2(false);

  const [validated, setValidated] = useState(false);
  const [validated1, setValidated1] = useState(false);

  const [data, setData] = useState({
    cocoonsProducedAtEachGeneration: "",
    lotNumber: "",
    lineNameId: "",
    incubationDate: "",
    blackBoxingDate: "",
    brushedOnDate: "",
    spunOnDate: "",
    screeningBatchNo: "",
    cocoonsProducedAtEachScreening: "",
    screeningBatchResults: "",
    chawkiPercentage: "",
    selectedBedAsPerTheMeanPerformance: "",
    cropFailureDetails: "",
  });
const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  // const clear = () => {
  //   setData({
  //     cocoonsProducedAtEachGeneration: "",
  //     lotNumber: "",
  //     lineNameId: "",
  //     incubationDate: "",
  //     blackBoxingDate: "",
  //     brushedOnDate: "",
  //     spunOnDate: "",
  //     screeningBatchNo: "",
  //     cocoonsProducedAtEachScreening: "",
  //     screeningBatchResults: "",
  //     chawkiPercentage: "",
  //     selectedBedAsPerTheMeanPerformance: "",
  //     cropFailureDetails: "",
  //   });
  //   setValidated(false);
  // };

  const clear = () => {
    setBedDetails((prev) => ({
      ...prev,
      bed1: "",
      bed2: "",
      bed3: "",
      bed4: "",
      bed5: "",
      bed6: "",
      bed7: "",
      bed8: "",
      bed9: "",
      bed10: "",
    }));
    setValidated(false);
    handleCloseModal();
  };

  const clearCocoon = () => {
    setCocoonAssesmentDetails((prev) => ({
      ...prev,
      weightCacoons: "",
      weightPupa: "",
      weightShells: "",
      singleWeightCacoons: "",
      singleWeightPupa: "",
      singleWeightShells: "",
      shellPercentage: "",
      err: "",
      cacoonsFormed: "",
      wormsBrushed: "",
      maleRatio: "",
      femaleRatio:""
    }));
    setValidated1(false);
    handleCloseModal1();
  };

  const handleInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setCocoonAssesmentDetailsBedWise({ ...cocoonAssesmentDetailsBedWise, [name]: value });
  };

  const handleBedInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setBedDetails({ ...bedDetails, [name]: value });
  };

  const [cocoonAssesmentDetailsBedWise, setCocoonAssesmentDetailsBedWise] = useState({
    bed1Id: "",
    bed1Name: "",
    bed1WeightCacoons: "",
    bed1WeightPupa: "",
    bed1WeightShells: "",
    bed1ShellPercentage: "",
    bed1Err:"",
    bed1CacoonsFormed: "",
    bed1WormsBrushed: "",
    bed1SingleWeightCacoons: "",
    bed1SingleWeightPupa: "",
    bed1SingleWeightShells: "",
    bed1MaleRatio: "",
    bed1FemaleRatio: "",
    bed2Id: "",
    bed2Name: "",
    bed2WeightCacoons: "",
    bed2WeightPupa: "",
    bed2WeightShells: "",
    bed2SingleWeightCacoons: "",
    bed2SingleWeightPupa: "",
    bed2SingleWeightShells: "",
    bed2ShellPercentage: "",
    bed2Err:"",
    bed2CacoonsFormed: "",
    bed2WormsBrushed: "",
    bed2MaleRatio: "",
    bed2FemaleRatio: "",
    bed3Id: "",
    bed3Name: "",
    bed3WeightCacoons: "",
    bed3WeightPupa: "",
    bed3WeightShells: "",
    bed3ShellPercentage: "",
    bed3Err:"",
    bed3CacoonsFormed: "",
    bed3WormsBrushed: "",
    bed3SingleWeightCacoons: "",
    bed3SingleWeightPupa: "",
    bed3SingleWeightShells: "",
    bed3MaleRatio: "",
    bed3FemaleRatio: "",
    bed4Id: "",
    bed4Name: "",
    bed4WeightCacoons: "",
    bed4WeightPupa: "",
    bed4WeightShells: "",
    bed4ShellPercentage: "",
    bed4Err:"",
    bed4CacoonsFormed: "",
    bed4WormsBrushed: "",
    bed4SingleWeightCacoons: "",
    bed4SingleWeightPupa: "",
    bed4SingleWeightShells: "",
    bed4MaleRatio: "",
    bed4FemaleRatio: "",
    bed5Id: "",
    bed5Name: "",
    bed5WeightCacoons: "",
    bed5WeightPupa: "",
    bed5WeightShells: "",
    bed5ShellPercentage: "",
    bed5Err:"",
    bed5CacoonsFormed: "",
    bed5WormsBrushed: "",
    bed5SingleWeightCacoons: "",
    bed5SingleWeightPupa: "",
    bed5SingleWeightShells: "",
    bed5MaleRatio: "",
    bed5FemaleRatio: "",
  });

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      api
        .post(
          baseURLSeedDfl + `MaintenanceOfScreen/update-bedwise-test-data-by-id`,
          bedDetails
        )
        .then((response) => {
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess(response.data.message);
            clear();
            handleCloseModal();
          }
        })
        .catch((err) => {
          if (
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

  const postData1 = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated1(true);
    } else {
      event.preventDefault();
      const sendPost = {
        id: cocoonAssesmentDetailsBedWise.bed1Id,
        bedName: cocoonAssesmentDetailsBedWise.bed1Name,
        weightCacoons: cocoonAssesmentDetailsBedWise.bed1WeightCacoons,
        weightPupa: cocoonAssesmentDetailsBedWise.bed1WeightPupa,
        weightShells: cocoonAssesmentDetailsBedWise.bed1WeightShells,
        singleWeightCacoons: cocoonAssesmentDetailsBedWise.bed1SingleWeightCacoons,
        singleWeightPupa: cocoonAssesmentDetailsBedWise.bed1SingleWeightPupa,
        singleWeightShells: cocoonAssesmentDetailsBedWise.bed1SingleWeightShells,
        shellPercentage:cocoonAssesmentDetailsBedWise.bed1ShellPercentage,
        err: cocoonAssesmentDetailsBedWise.bed1Err,
        cacoonsFormed: cocoonAssesmentDetailsBedWise.bed1CacoonsFormed,
        wormsBrushed: cocoonAssesmentDetailsBedWise.bed1WormsBrushed, 
        maleRatio: cocoonAssesmentDetailsBedWise.bed1MaleRatio,
        femaleRatio: cocoonAssesmentDetailsBedWise.bed1FemaleRatio, 
      };
      api
        .post(
          baseURLSeedDfl + `MaintenanceOfScreen/update-cacoon-assesment-data-by-id`,
          sendPost
        )
        .then((response) => {
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess(response.data.message);
            // clear();
            // handleCloseModal();
          }
        })
        .catch((err) => {
          if (
            err.response &&
            err.response.data &&
            err.response.data.validationErrors
          ) {
            if (Object.keys(err.response.data.validationErrors).length > 0) {
              saveError(err.response.data.validationErrors);
            }
          }
        });
      setValidated1(true);
    }
  };

  const postBed2Data = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated1(true);
    } else {
      event.preventDefault();
      const sendPost = {
        id: cocoonAssesmentDetailsBedWise.bed2Id,
        bedName: cocoonAssesmentDetailsBedWise.bed2Name,
        weightCacoons: cocoonAssesmentDetailsBedWise.bed2WeightCacoons,
        weightPupa: cocoonAssesmentDetailsBedWise.bed2WeightPupa,
        weightShells: cocoonAssesmentDetailsBedWise.bed2WeightShells,
        shellPercentage:cocoonAssesmentDetailsBedWise.bed2ShellPercentage,
        singleWeightCacoons: cocoonAssesmentDetailsBedWise.bed2SingleWeightCacoons,
        singleWeightPupa: cocoonAssesmentDetailsBedWise.bed2SingleWeightPupa,
        singleWeightShells: cocoonAssesmentDetailsBedWise.bed2SingleWeightShells,
        err: cocoonAssesmentDetailsBedWise.bed2Err,
        cacoonsFormed: cocoonAssesmentDetailsBedWise.bed2CacoonsFormed,
        wormsBrushed: cocoonAssesmentDetailsBedWise.bed2WormsBrushed,
        maleRatio: cocoonAssesmentDetailsBedWise.bed2MaleRatio,
        femaleRatio: cocoonAssesmentDetailsBedWise.bed2FemaleRatio,
      };
      api
        .post(
          baseURLSeedDfl + `MaintenanceOfScreen/update-cacoon-assesment-data-by-id`,
          sendPost
        )
        .then((response) => {
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess(response.data.message);
            // clear();
            // handleCloseModal();
          }
        })
        .catch((err) => {
          if (
            err.response &&
            err.response.data &&
            err.response.data.validationErrors
          ) {
            if (Object.keys(err.response.data.validationErrors).length > 0) {
              saveError(err.response.data.validationErrors);
            }
          }
        });
      setValidated1(true);
    }
  };

  const postBed3Data = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated1(true);
    } else {
      event.preventDefault();
      const sendPost = {
        id: cocoonAssesmentDetailsBedWise.bed3Id,
        bedName: cocoonAssesmentDetailsBedWise.bed3Name,
        weightCacoons: cocoonAssesmentDetailsBedWise.bed3WeightCacoons,
        weightPupa: cocoonAssesmentDetailsBedWise.bed3WeightPupa,
        weightShells: cocoonAssesmentDetailsBedWise.bed3WeightShells,
        singleWeightCacoons: cocoonAssesmentDetailsBedWise.bed3SingleWeightCacoons,
        singleWeightPupa: cocoonAssesmentDetailsBedWise.bed3SingleWeightPupa,
        singleWeightShells: cocoonAssesmentDetailsBedWise.bed3SingleWeightShells,
        shellPercentage:cocoonAssesmentDetailsBedWise.bed3ShellPercentage,
        err: cocoonAssesmentDetailsBedWise.bed3Err,
        cacoonsFormed: cocoonAssesmentDetailsBedWise.bed3CacoonsFormed,
        wormsBrushed: cocoonAssesmentDetailsBedWise.bed3WormsBrushed,
        maleRatio: cocoonAssesmentDetailsBedWise.bed3MaleRatio,
        femaleRatio: cocoonAssesmentDetailsBedWise.bed3FemaleRatio,
      };
      api
        .post(
          baseURLSeedDfl + `MaintenanceOfScreen/update-cacoon-assesment-data-by-id`,
          sendPost
        )
        .then((response) => {
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess(response.data.message);
            // clear();
            // handleCloseModal();
          }
        })
        .catch((err) => {
          if (
            err.response &&
            err.response.data &&
            err.response.data.validationErrors
          ) {
            if (Object.keys(err.response.data.validationErrors).length > 0) {
              saveError(err.response.data.validationErrors);
            }
          }
        });
      setValidated1(true);
    }
  };

  const postBed4Data = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated1(true);
    } else {
      event.preventDefault();
      const sendPost = {
        id: cocoonAssesmentDetailsBedWise.bed4Id,
        bedName: cocoonAssesmentDetailsBedWise.bed4Name,
        weightCacoons: cocoonAssesmentDetailsBedWise.bed4WeightCacoons,
        weightPupa: cocoonAssesmentDetailsBedWise.bed4WeightPupa,
        weightShells: cocoonAssesmentDetailsBedWise.bed4WeightShells,
        singleWeightCacoons: cocoonAssesmentDetailsBedWise.bed4SingleWeightCacoons,
        singleWeightPupa: cocoonAssesmentDetailsBedWise.bed4SingleWeightPupa,
        singleWeightShells: cocoonAssesmentDetailsBedWise.bed4SingleWeightShells,
        shellPercentage:cocoonAssesmentDetailsBedWise.bed4ShellPercentage,
        err: cocoonAssesmentDetailsBedWise.bed4Err,
        cacoonsFormed: cocoonAssesmentDetailsBedWise.bed4CacoonsFormed,
        wormsBrushed: cocoonAssesmentDetailsBedWise.bed4WormsBrushed,
        maleRatio: cocoonAssesmentDetailsBedWise.bed4MaleRatio,
        femaleRatio: cocoonAssesmentDetailsBedWise.bed4FemaleRatio,  
      };
      api
        .post(
          baseURLSeedDfl + `MaintenanceOfScreen/update-cacoon-assesment-data-by-id`,
          sendPost
        )
        .then((response) => {
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess(response.data.message);
            // clear();
            // handleCloseModal();
          }
        })
        .catch((err) => {
          if (
            err.response &&
            err.response.data &&
            err.response.data.validationErrors
          ) {
            if (Object.keys(err.response.data.validationErrors).length > 0) {
              saveError(err.response.data.validationErrors);
            }
          }
        });
      setValidated1(true);
    }
  };

  const postBed5Data = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated1(true);
    } else {
      event.preventDefault();
      const sendPost = {
        id: cocoonAssesmentDetailsBedWise.bed5Id,
        bedName: cocoonAssesmentDetailsBedWise.bed5Name,
        weightCacoons: cocoonAssesmentDetailsBedWise.bed5WeightCacoons,
        weightPupa: cocoonAssesmentDetailsBedWise.bed5WeightPupa,
        weightShells: cocoonAssesmentDetailsBedWise.bed5WeightShells,
        singleWeightCacoons: cocoonAssesmentDetailsBedWise.bed5SingleWeightCacoons,
        singleWeightPupa: cocoonAssesmentDetailsBedWise.bed5SingleWeightPupa,
        singleWeightShells: cocoonAssesmentDetailsBedWise.bed5SingleWeightShells,
        shellPercentage:cocoonAssesmentDetailsBedWise.bed5ShellPercentage,
        err: cocoonAssesmentDetailsBedWise.bed5Err,
        cacoonsFormed: cocoonAssesmentDetailsBedWise.bed5CacoonsFormed,
        wormsBrushed: cocoonAssesmentDetailsBedWise.bed5WormsBrushed,
        maleRatio: cocoonAssesmentDetailsBedWise.bed5MaleRatio,
        femaleRatio: cocoonAssesmentDetailsBedWise.bed5FemaleRatio,  
      };
      api
        .post(
          baseURLSeedDfl + `MaintenanceOfScreen/update-cacoon-assesment-data-by-id`,
          sendPost
        )
        .then((response) => {
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess(response.data.message);
            // clear();
            // handleCloseModal();
          }
        })
        .catch((err) => {
          if (
            err.response &&
            err.response.data &&
            err.response.data.validationErrors
          ) {
            if (Object.keys(err.response.data.validationErrors).length > 0) {
              saveError(err.response.data.validationErrors);
            }
          }
        });
      setValidated1(true);
    }
  };

  const [viewDetailsData, setViewDetailsData] = useState({
    bed1Id: "",
    bed1Name: "",
    bed1WeightCacoons: "",
    bed1WeightPupa: "",
    bed1WeightShells: "",
    bed1ShellPercentage: "",
    bed1Err:"",
    bed1CacoonsFormed: "",
    bed1WormsBrushed: "",
    bed1SingleWeightCacoons: "",
    bed1SingleWeightPupa: "",
    bed1SingleWeightShells: "",
    bed1MaleRatio: "",
    bed1FemaleRatio: "",
    bed2Id: "",
    bed2Name: "",
    bed2WeightCacoons: "",
    bed2WeightPupa: "",
    bed2WeightShells: "",
    bed2SingleWeightCacoons: "",
    bed2SingleWeightPupa: "",
    bed2SingleWeightShells: "",
    bed2ShellPercentage: "",
    bed2Err:"",
    bed2CacoonsFormed: "",
    bed2WormsBrushed: "",
    bed2MaleRatio: "",
    bed2FemaleRatio: "",
    bed3Id: "",
    bed3Name: "",
    bed3WeightCacoons: "",
    bed3WeightPupa: "",
    bed3WeightShells: "",
    bed3ShellPercentage: "",
    bed3Err:"",
    bed3CacoonsFormed: "",
    bed3WormsBrushed: "",
    bed3SingleWeightCacoons: "",
    bed3SingleWeightPupa: "",
    bed3SingleWeightShells: "",
    bed3MaleRatio: "",
    bed3FemaleRatio: "",
    bed4Id: "",
    bed4Name: "",
    bed4WeightCacoons: "",
    bed4WeightPupa: "",
    bed4WeightShells: "",
    bed4ShellPercentage: "",
    bed4Err:"",
    bed4CacoonsFormed: "",
    bed4WormsBrushed: "",
    bed4SingleWeightCacoons: "",
    bed4SingleWeightPupa: "",
    bed4SingleWeightShells: "",
    bed4MaleRatio: "",
    bed4FemaleRatio: "",
    bed5Id: "",
    bed5Name: "",
    bed5WeightCacoons: "",
    bed5WeightPupa: "",
    bed5WeightShells: "",
    bed5ShellPercentage: "",
    bed5Err:"",
    bed5CacoonsFormed: "",
    bed5WormsBrushed: "",
    bed5SingleWeightCacoons: "",
    bed5SingleWeightPupa: "",
    bed5SingleWeightShells: "",
    bed5MaleRatio: "",
    bed5FemaleRatio: "",
  });

  const viewDetails = (_id) => {
    handleShowModal2();
    api
      .get(baseURLSeedDfl + `MaintenanceOfScreen/get-cacoon-assesment-data-by-id/${_id}`)
      .then((response) => {
        const data = response.data;
        setViewDetailsData({
          bed1Id: data[0]?.id || "",
          bed1Name: data[0]?.bedName || "",
          bed1WeightCacoons: data[0]?.weightCacoons || "",
          bed1WeightPupa: data[0]?.weightPupa || "",
          bed1WeightShells: data[0]?.weightShells || "",
          bed1SingleWeightCacoons: data[0]?.singleWeightCacoons || "",
          bed1SingleWeightPupa: data[0]?.singleWeightPupa || "",
          bed1SingleWeightShells: data[0]?.singleWeightShells || "",
          bed1ShellPercentage: data[0]?.shellPercentage || "",
          bed1Err: data[0]?.err || "",
          bed1CacoonsFormed: data[0]?.cacoonsFormed || "",
          bed1WormsBrushed: data[0]?.wormsBrushed || "",
          bed1MaleRatio: data[0]?.maleRatio || "",
          bed1FemaleRatio: data[0]?.femaleRatio || "",
          bed2Id: data[1]?.id || "",
          bed2Name: data[1]?.bedName || "",
          bed2WeightCacoons: data[1]?.weightCacoons || "",
          bed2WeightPupa: data[1]?.weightPupa || "",
          bed2WeightShells: data[1]?.weightShells || "",
          bed2SingleWeightCacoons: data[1]?.singleWeightCacoons || "",
          bed2SingleWeightPupa: data[1]?.singleWeightPupa || "",
          bed2SingleWeightShells: data[1]?.singleWeightShells || "",
          bed2ShellPercentage: data[1]?.shellPercentage || "",
          bed2Err: data[1]?.err || "",
          bed2CacoonsFormed: data[1]?.cacoonsFormed || "",
          bed2WormsBrushed: data[1]?.wormsBrushed || "",
          bed2MaleRatio: data[1]?.maleRatio || "",
          bed2FemaleRatio: data[1]?.femaleRatio || "",
          bed3Id: data[2]?.id || "",
          bed3Name: data[2]?.bedName || "",
          bed3WeightCacoons: data[2]?.weightCacoons || "",
          bed3WeightPupa: data[2]?.weightPupa || "",
          bed3WeightShells: data[2]?.weightShells || "",
          bed3SingleWeightCacoons: data[2]?.singleWeightCacoons || "",
          bed3SingleWeightPupa: data[2]?.singleWeightPupa || "",
          bed3SingleWeightShells: data[2]?.singleWeightShells || "",
          bed3ShellPercentage: data[2]?.shellPercentage || "",
          bed3Err: data[2]?.err || "",
          bed3CacoonsFormed: data[2]?.cacoonsFormed || "",
          bed3WormsBrushed: data[2]?.wormsBrushed || "",
          bed3MaleRatio: data[2]?.maleRatio || "",
          bed3FemaleRatio: data[2]?.femaleRatio || "",
          bed4Id: data[3]?.id || "",
          bed4Name: data[3]?.bedName || "",
          bed4WeightCacoons: data[3]?.weightCacoons || "",
          bed4WeightPupa: data[3]?.weightPupa || "",
          bed4WeightShells: data[3]?.weightShells || "",
          bed4SingleWeightCacoons: data[3]?.singleWeightCacoons || "",
          bed4SingleWeightPupa: data[3]?.singleWeightPupa || "",
          bed4SingleWeightShells: data[3]?.singleWeightShells || "",
          bed4ShellPercentage: data[3]?.shellPercentage || "",
          bed4Err: data[3]?.err || "",
          bed4CacoonsFormed: data[3]?.cacoonsFormed || "",
          bed4WormsBrushed: data[3]?.wormsBrushed || "",
          bed4MaleRatio: data[3]?.maleRatio || "",
          bed4FemaleRatio: data[3]?.femaleRatio || "",
          bed5Id: data[4]?.id || "",
          bed5Name: data[4]?.bedName || "",
          bed5WeightCacoons: data[4]?.weightCacoons || "",
          bed5WeightPupa: data[4]?.weightPupa || "",
          bed5WeightShells: data[4]?.weightShells || "",
          bed5SingleWeightCacoons: data[4]?.singleWeightCacoons || "",
          bed5SingleWeightPupa: data[4]?.singleWeightPupa || "",
          bed5SingleWeightShells: data[4]?.singleWeightShells || "",
          bed5ShellPercentage: data[4]?.shellPercentage || "",
          bed5Err: data[4]?.err || "",
          bed5CacoonsFormed: data[4]?.cacoonsFormed || "",
          bed5WormsBrushed: data[4]?.wormsBrushed || "",
          bed5MaleRatio: data[4]?.maleRatio || "",
          bed5FemaleRatio: data[4]?.femaleRatio || "",
        });
  
        // setViewDetailsData(response.data);

        setLoading(false);
      })
      .catch((err) => {
        setViewDetailsData({});
        setLoading(false);
      });
  };

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
      title: "Attempt was not successful",
      html: errorMessage,
    });
  };

  const getList = () => {
    setLoading(true);

    const response = api
      .get(baseURLSeedDfl + `MaintenanceOfScreen/get-info`)
      .then((response) => {
        // console.log(response.data)
        setListData(response.data);
        // setTotalRows(response.data.content.totalItems);
        setLoading(false);
      })
      .catch((err) => {
        // setListData({});
        setLoading(false);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  const [bedDetails, setBedDetails] = useState({
    id: "",
    bed1: "",
    bed2: "",
    bed3: "",
    bed4: "",
    bed5: "",
    bed6: "",
    bed7: "",
    bed8: "",
    bed9: "",
    bed10: "",
  });

  const [cocoonAssesmentDetails, setCocoonAssesmentDetails] = useState({
    id: "",
    weightCacoons: "",
    weightPupa: "",
    weightShells: "",
    shellPercentage: "",
    err: "",
    cacoonsFormed: "",
    wormsBrushed: "",
  });

  console.log(bedDetails);
  const getLogsList = (_id) => {
    setLoading(true);
    setShowModal(true);

    api
      .get(
        baseURLSeedDfl +
          `MaintenanceOfScreen/get-bedwise-test-data-by-id/${_id}`
      )
      .then((response) => {
        // console.log(response.data)
        setBedDetails(response.data);
        // setTotalRows(response.data.content.totalItems);
        setLoading(false);
      })
      .catch((err) => {
        // setListData({});
        setLoading(false);
      });
  };

  const getCocoonList = (_id) => {
    setLoading(true);
    handleShowModal1();

    api
      .get(
        baseURLSeedDfl +
          `MaintenanceOfScreen/get-cacoon-assesment-data-by-id/${_id}`
      )
      .then((response) => {
        // console.log(response.data)
        const data = response.data;
  
        // Update the state for each bed based on the response
        setCocoonAssesmentDetailsBedWise({
          bed1Id: data[0]?.id || "",
          bed1Name: data[0]?.bedName || "",
          bed1WeightCacoons: data[0]?.weightCacoons || "",
          bed1WeightPupa: data[0]?.weightPupa || "",
          bed1WeightShells: data[0]?.weightShells || "",
          bed1SingleWeightCacoons: data[0]?.singleWeightCacoons || "",
          bed1SingleWeightPupa: data[0]?.singleWeightPupa || "",
          bed1SingleWeightShells: data[0]?.singleWeightShells || "",
          bed1ShellPercentage: data[0]?.shellPercentage || "",
          bed1Err: data[0]?.err || "",
          bed1CacoonsFormed: data[0]?.cacoonsFormed || "",
          bed1WormsBrushed: data[0]?.wormsBrushed || "",
          bed1MaleRatio: data[0]?.maleRatio || "",
          bed1FemaleRatio: data[0]?.femaleRatio || "",
          bed2Id: data[1]?.id || "",
          bed2Name: data[1]?.bedName || "",
          bed2WeightCacoons: data[1]?.weightCacoons || "",
          bed2WeightPupa: data[1]?.weightPupa || "",
          bed2WeightShells: data[1]?.weightShells || "",
          bed2SingleWeightCacoons: data[1]?.singleWeightCacoons || "",
          bed2SingleWeightPupa: data[1]?.singleWeightPupa || "",
          bed2SingleWeightShells: data[1]?.singleWeightShells || "",
          bed2ShellPercentage: data[1]?.shellPercentage || "",
          bed2Err: data[1]?.err || "",
          bed2CacoonsFormed: data[1]?.cacoonsFormed || "",
          bed2WormsBrushed: data[1]?.wormsBrushed || "",
          bed2MaleRatio: data[1]?.maleRatio || "",
          bed2FemaleRatio: data[1]?.femaleRatio || "",
          bed3Id: data[2]?.id || "",
          bed3Name: data[2]?.bedName || "",
          bed3WeightCacoons: data[2]?.weightCacoons || "",
          bed3WeightPupa: data[2]?.weightPupa || "",
          bed3WeightShells: data[2]?.weightShells || "",
          bed3SingleWeightCacoons: data[2]?.singleWeightCacoons || "",
          bed3SingleWeightPupa: data[2]?.singleWeightPupa || "",
          bed3SingleWeightShells: data[2]?.singleWeightShells || "",
          bed3ShellPercentage: data[2]?.shellPercentage || "",
          bed3Err: data[2]?.err || "",
          bed3CacoonsFormed: data[2]?.cacoonsFormed || "",
          bed3WormsBrushed: data[2]?.wormsBrushed || "",
          bed3MaleRatio: data[2]?.maleRatio || "",
          bed3FemaleRatio: data[2]?.femaleRatio || "",
          bed4Id: data[3]?.id || "",
          bed4Name: data[3]?.bedName || "",
          bed4WeightCacoons: data[3]?.weightCacoons || "",
          bed4WeightPupa: data[3]?.weightPupa || "",
          bed4WeightShells: data[3]?.weightShells || "",
          bed4SingleWeightCacoons: data[3]?.singleWeightCacoons || "",
          bed4SingleWeightPupa: data[3]?.singleWeightPupa || "",
          bed4SingleWeightShells: data[3]?.singleWeightShells || "",
          bed4ShellPercentage: data[3]?.shellPercentage || "",
          bed4Err: data[3]?.err || "",
          bed4CacoonsFormed: data[3]?.cacoonsFormed || "",
          bed4WormsBrushed: data[3]?.wormsBrushed || "",
          bed4MaleRatio: data[3]?.maleRatio || "",
          bed4FemaleRatio: data[3]?.femaleRatio || "",
          bed5Id: data[4]?.id || "",
          bed5Name: data[4]?.bedName || "",
          bed5WeightCacoons: data[4]?.weightCacoons || "",
          bed5WeightPupa: data[4]?.weightPupa || "",
          bed5WeightShells: data[4]?.weightShells || "",
          bed5SingleWeightCacoons: data[4]?.singleWeightCacoons || "",
          bed5SingleWeightPupa: data[4]?.singleWeightPupa || "",
          bed5SingleWeightShells: data[4]?.singleWeightShells || "",
          bed5ShellPercentage: data[4]?.shellPercentage || "",
          bed5Err: data[4]?.err || "",
          bed5CacoonsFormed: data[4]?.cacoonsFormed || "",
          bed5WormsBrushed: data[4]?.wormsBrushed || "",
          bed5MaleRatio: data[4]?.maleRatio || "",
          bed5FemaleRatio: data[4]?.femaleRatio || "",
        });
  
        setLoading(false);
      })
      .catch((err) => {
        // setListData({});
        setLoading(false);
      });
  };

  const navigate = useNavigate();
  const handleView = (_id) => {
    navigate(`/seriui/maintenance-of-Screening-Batch-Records-view/${_id}`);
  };

  const handleEdit = (_id) => {
    navigate(`/seriui/maintenance-of-Screening-Batch-Records-edit/${_id}`);
    // navigate("/seriui/training Schedule");
  };

  
  const deleteError = () => {
    Swal.fire({
      icon: "error",
      title: "Delete attempt was not successful",
      text: "Something went wrong!",
    });
  };

  const deleteConfirm = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "It will delete permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        // console.log("hello");
        api
          .delete(baseURLSeedDfl + `/MaintenanceOfScreen/delete-info/${_id}`)
          .then((response) => {
            // deleteConfirm(_id);
            getList();
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
    table: {
      style: {
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(30, 103, 168, 0.06)",
      },
    },
    rows: {
      style: {
        minHeight: "52px",
        fontSize: "13.5px",
        color: "#2b2d42",
        borderBottom: "1px solid #eef1f6 !important",
        transition: "background-color 0.15s ease",
      },
      highlightOnHoverStyle: {
        backgroundColor: "#f4f8fd",
        cursor: "pointer",
        outline: "none",
      },
      stripedStyle: {
        backgroundColor: "#fbfcfe",
      },
    },
    headRow: {
      style: {
        minHeight: "50px",
        background:
          "linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%)",
        borderTopLeftRadius: "10px",
        borderTopRightRadius: "10px",
      },
    },
    headCells: {
      style: {
        backgroundColor: "transparent",
        color: "#fff",
        fontSize: "13px",
        fontWeight: 600,
        letterSpacing: "0.3px",
        textTransform: "uppercase",
        paddingLeft: "12px",
        paddingRight: "12px",
      },
    },
    cells: {
      style: {
        paddingLeft: "12px",
        paddingRight: "12px",
      },
    },
    pagination: {
      style: {
        borderTop: "1px solid #eef1f6",
        fontSize: "13px",
        color: "#5a6577",
      },
    },
  };

  const MaintenanceofScreeningBatchDataColumns = [
    {
      name: t("Action"),
      cell: (row) => (
        //   Button style
        <div className="d-flex align-items-center gap-2">
          {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => handleView(row.id)}
            className="d-inline-flex align-items-center gap-1 shadow-sm"
            style={{ borderRadius: "6px", fontWeight: 500, fontSize: "12.5px", paddingInline: "10px" }}
            title={t("View")}
          >
            <Icon name="eye" />
            <span>{t("View")}</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleEdit(row.id)}
            className="d-inline-flex align-items-center gap-1 shadow-sm"
            style={{ borderRadius: "6px", fontWeight: 500, fontSize: "12.5px", paddingInline: "10px" }}
            title={t("Edit")}
          >
            <Icon name="edit" />
            <span>{t("Edit")}</span>
          </Button>
          {/* <Button
            variant="danger"
            size="sm"
            className="ms-2"
            onClick={() => deleteConfirm(row.id)}
          >
            Delete
          </Button> */}
        </div>
      ),
      sortable: false,
      hide: "md",
      grow: 2,
      minWidth: "220px",
    },

    {
      name: t("Total number of cocoons produced"),
      selector: (row) => row.cocoonsProducedAtEachGeneration,
      cell: (row) => <span>{row.cocoonsProducedAtEachGeneration}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Lot number"),
      selector: (row) => row.lotNumber,
      cell: (row) => <span>{row.lotNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Line Name"),
      selector: (row) => row.lineName,
      cell: (row) => <span>{row.lineName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Incubation Date"),
      selector: (row) => row.incubationDate,
      cell: (row) => <span>{row.incubationDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Black Boxing Date"),
      selector: (row) => row.blackBoxingDate,
      cell: (row) => <span>{row.blackBoxingDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Brushed on date"),
      selector: (row) => row.brushedOnDate,
      cell: (row) => <span>{row.brushedOnDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Spun on date(From)"),
      selector: (row) => row.spunOnDate,
      cell: (row) => <span>{row.spunOnDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t(" Spun On Date(To)"),
      selector: (row) => row.spunOnToDate,
      cell: (row) => <span>{row.spunOnToDate}</span>,
      sortable: true,
      hide: "md",
    },
    // {
    //   name: "Worm Test details  and result",
    //   selector: (row) => row.spunOnDate,
    //   cell: (row) => <span>{row.spunOnDate}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    {
      name: t("Total No of Cocoons Produced at each Screening"),
      selector: (row) => row.cocoonsProducedAtEachScreening,
      cell: (row) => <span>{row.cocoonsProducedAtEachScreening}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: t("Screening Batch Results"),
      selector: (row) => row.screeningBatchResults,
      cell: (row) => <span>{row.screeningBatchResults}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Chawki Percentage"),
      selector: (row) => row.chawkiPercentage,
      cell: (row) => <span>{row.chawkiPercentage}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Selected Bed as per the Mean Performance"),
      selector: (row) => row.selectedBedAsPerTheMeanPerformance,
      cell: (row) => <span>{row.selectedBedAsPerTheMeanPerformance}</span>,
      sortable: true,
      hide: "md",
    },
    // {
    //   name: "Selected Bed as per the Mean Performance",
    //   selector: (row) => row.selectedBedAsPerTheMeanPerformance,
    //   cell: (row) => {
    //     const value = row.selectedBedAsPerTheMeanPerformance;
    //     return (
    //       <span>
    //         {value === "1" || value === 1
    //           ? "Bed 1"
    //           : value === "2" || value === 2
    //           ? "Bed 2"
    //           : value === "3" || value === 3
    //           ? "Bed 3"
    //           : value === "4" || value === 4
    //           ? "Bed 4"
    //           : value === "5" || value === 5
    //           ? "Bed 5"
    //           : "Other"}
    //       </span>
    //     );
    //   },
    //   sortable: true,
    //   hide: "md",
    // },    
    {
      name: t("Worms Weight in grams of 10 Larvae on on 5th Instar 5th Day (Bedwise)"),
      cell: (row) => (
        <Button
          className="d-flex justify-content-center"
          variant="primary"
          size="sm"
          onClick={() => getLogsList(row.id)}
        >
          {t("Show")}
        </Button>
      ),
      sortable: true,
      hide: "md",
    },
    {
      name: t("Cocoon Assesment Details"),
      cell: (row) => (
        <Button
          className="d-flex justify-content-center"
          variant="primary"
          size="sm"
          onClick={() => getCocoonList(row.id)}
        >
          Show
        </Button>
      ),
      sortable: true,
      hide: "md",
    },
   {
      name: t("View Cocoon Assesment Details"),
      cell: (row) => (
        <Button
          className="d-flex justify-content-center"
          variant="primary"
          size="sm"
          onClick={() => viewDetails(row.id)}
        >
          {t("View")}
        </Button>
      ),
      sortable: true,
      hide: "md",
    },
    
    {
      name: t("Crop Failure Details"),
      selector: (row) => row.cropFailureDetails,
      cell: (row) => <span>{row.cropFailureDetails}</span>,
      sortable: true,
      hide: "md",
    },
  ];

  
  return (
    <Layout title={t("Maintenance of screening batch records List")}>
      <style>{screeningBatchListStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("Maintenance of screening batch records List")}
              </Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/Maintenance-of-Screening-Batch-Records"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="plus" />
                    <span>{t("Create")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/Maintenance-of-Screening-Batch-Records"
                    className="btn btn-primary d-none d-md-inline-flex sh-cta-btn"
                  >
                    <Icon name="plus" />
                    <span>{t("Create")}</span>
                  </Link>
                </li>
              </ul>
            </Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-list-wrap">
        <Card className="sh-list-card">
          <div className="sh-table-wrap">
            <DataTable
              // title="New Trader License List"
              tableClassName="data-table-head-light table-responsive"
              columns={MaintenanceofScreeningBatchDataColumns}
              data={listData}
              highlightOnHover
              striped
              pointerOnHover
              pagination
              paginationServer
              paginationTotalRows={totalRows}
              paginationPerPage={countPerPage}
              paginationComponentOptions={{
                noRowsPerPage: true,
              }}
              onChangePage={(page) => setPage(page - 1)}
              progressPending={loading}
              theme="solarized"
              customStyles={customStyles}
              noDataComponent={
                <div className="sh-empty">
                  <Icon name="inbox" />
                  <p className="mt-2 mb-0">{t("No records found")}</p>
                </div>
              }
            />
          </div>
        </Card>
      </Block>

      <Modal show={showModal} onHide={handleCloseModal} size="xl" contentClassName="sh-modal-content">
        <Modal.Header closeButton>
          <Modal.Title>
            <Icon name="activity" className="me-1" />
            {t("Worms Weight in grams of 10 Larvae on on 5th Instar 5th Day (Bedwise)")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Block className="mt-2">
            <Card>
              <DataTable
                // title="New Trader License List"
                tableClassName="data-table-head-light table-responsive"
                columns={MaintenanceofmulberryGardenLogsDataColumns}
                data={listLogsData}
                highlightOnHover
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                paginationPerPage={countPerPage}
                paginationComponentOptions={{
                  noRowsPerPage: true,
                }}
                onChangePage={(page) => setPage(page - 1)}
                progressPending={loading}
                theme="solarized"
                customStyles={customStyles}
              />
            </Card>
          </Block> */}
          <Block className="mt-4">
            <Form noValidate validated={validated} onSubmit={postData}>
              <Row className="g-3 ">
                <div>
                  <Row className="g-gs">
                    <Col lg="12">
                      <Block>
                        {/* <Card>
                      <Card.Header>
                        {" "}
                        Maintenance of screening batch records{" "}
                      </Card.Header>
                      <Card.Body> */}
                        <Row className="g-gs">
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="bed1">
                                {t("Bed 1")}<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed1"
                                  name="bed1"
                                  value={bedDetails.bed1 || ""}
                                  onChange={handleBedInputs}
                                  type="text"
                                  placeholder={t("Bed 1")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t("Bed 1 is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="bed2">
                                {t("Bed 2")}<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed2"
                                  name="bed2"
                                  value={bedDetails.bed2 || ""}
                                  onChange={handleBedInputs}
                                  type="text"
                                  placeholder={t("Bed 2")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t("Bed 2 is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="bed3">
                                {t("Bed 3")}<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed3"
                                  name="bed3"
                                  value={bedDetails.bed3 || ""}
                                  onChange={handleBedInputs}
                                  type="text"
                                  placeholder={t("Bed 3")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t("Bed 3 is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="bed4">
                                {t("Bed 4")}<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed4"
                                  name="bed4"
                                  value={bedDetails.bed4 || ""}
                                  onChange={handleBedInputs}
                                  type="text"
                                  placeholder={t("Bed 4")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t("Bed 4 is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="bed5">
                                {t("Bed 5")}<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed5"
                                  name="bed5"
                                  value={bedDetails.bed5 || ""}
                                  onChange={handleBedInputs}
                                  type="text"
                                  placeholder={t("Bed 5")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t("Bed 5 is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="bed6">
                                {t("Bed 6")}<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed6"
                                  name="bed6"
                                  value={bedDetails.bed6 || ""}
                                  onChange={handleBedInputs}
                                  type="text"
                                  placeholder={t("Bed 6")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t("Bed 6 is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="bed7">
                                {t("Bed 7")}<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed7"
                                  name="bed7"
                                  value={bedDetails.bed7 || ""}
                                  onChange={handleBedInputs}
                                  type="text"
                                  placeholder={t("Bed 7")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t("Bed 7 is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="bed8">
                                {t("Bed 8")}<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed8"
                                  name="bed8"
                                  value={bedDetails.bed8 || ""}
                                  onChange={handleBedInputs}
                                  type="text"
                                  placeholder={t("Bed 8")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t("Bed 8 is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="bed9">
                                {t("Bed 9")}<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed9"
                                  name="bed9"
                                  value={bedDetails.bed9 || ""}
                                  onChange={handleBedInputs}
                                  type="text"
                                  placeholder={t("Bed 9")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t("Bed 9 is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="bed10">
                                {t("Bed 10")}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed10"
                                  name="bed10"
                                  value={bedDetails.bed10 || ""}
                                  onChange={handleBedInputs}
                                  type="text"
                                  placeholder={t("Bed 10")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t("Bed 10 is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                        </Row>
                        {/* </Card.Body>
                    </Card> */}
                      </Block>
                      <div className="gap-col mt-2 sh-modal-footer">
                        <ul className="d-flex align-items-center justify-content-center gap g-3">
                          <li>
                            {/* <Button type="button" variant="primary" onClick={postData}> */}
                            <Button type="submit" variant="success">
                              <Icon name="check" className="me-1" />
                              {t("Save")}
                            </Button>
                          </li>
                          <li>
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={clear}
                            >
                              <Icon name="cross" className="me-1" />
                              {t("Cancel")}
                            </Button>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Row>
            </Form>
          </Block>
        </Modal.Body>
      </Modal>

      <Modal show={showModal1} onHide={handleCloseModal1} size="xl" contentClassName="sh-modal-content">
        <Modal.Header closeButton>
          <Modal.Title>
            <Icon name="layers" className="me-1" />
            {t("Cocoon Assesment Details")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Block className="mt-4">
            <Form noValidate validated={validated1} onSubmit={postData1}>
              <Row className="g-3 ">
                <div>
                  <Row className="g-gs">
                    <Col lg="12">
                      <Block>
                      <Card>
                      <Card.Header>
                       {t("Bed 1")}
                      </Card.Header>
                      <Card.Body>
                        <Row className="g-gs">
                        <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightCacoons">
                                {t("Bed Name")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed1Name"
                                  name="bed1Name"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed1Name || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Bed Name")}
                                  readOnly
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                Bed Name is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightCacoons">
                                {t("Average Weight of 25 Cocoons")}
        
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed1WeightCacoons"
                                  name="bed1WeightCacoons"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed1WeightCacoons || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Average Weight of 25 Cocoons")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Average Weight of 25 Cocoons is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                           <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightCacoons">
                                {t("Weight of Single Cocoons")}
        
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed1SingleWeightCacoons"
                                  name="bed1SingleWeightCacoons"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed1SingleWeightCacoons || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Weight of Single Cocoons")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Average Weight of 25 Cocoons is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightPupa">
                                {t("Average Weight of 25 Pupa")}
        
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed1WeightPupa"
                                  name="bed1WeightPupa"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed1WeightPupa || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Average Weight of 25 Pupa")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Average Weight of 25 Pupa is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                           <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightPupa">
                                {t("Weight of Single Pupa")}
        
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed1SingleWeightPupa"
                                  name="bed1SingleWeightPupa"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed1SingleWeightPupa || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Weight of Single Pupa")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Average Weight of 25 Pupa is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightShells">
                                {t("Average Weight of 25 Shells")}
        
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed1WeightShells"
                                  name="bed1WeightShells"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed1WeightShells || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Average Weight of 25 Shells")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Average Weight of 25 Shells is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                           <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightShells">
                                {t("Weight of Single Shells")}
        
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed1SingleWeightShells"
                                  name="bed1SingleWeightShells"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed1SingleWeightShells || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Weight of Single Shells")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Average Weight of 25 Shells is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="shellPercentage">
                                {t("Shell Percentage")}
        
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed1ShellPercentage"
                                  name="bed1ShellPercentage"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed1ShellPercentage || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Shell Percentage")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Shell Percentage is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="err">
                              {t("Err")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed1Err"
                                  name="bed1Err"
                                  value={cocoonAssesmentDetailsBedWise.bed1Err || ""}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("ERR")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  ERR is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="cacoonsFormed">
                                {t("No of Cocoon's Formed")}
        
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed1CacoonsFormed"
                                  name="bed1CacoonsFormed"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed1CacoonsFormed || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("No of Cocoon's Formed")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  No of Cocoon's Formed is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="wormsBrushed">
                                {t("No of Worms Brushed")}
        
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed1WormsBrushed"
                                  name="bed1WormsBrushed"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed1WormsBrushed || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("No of Worms Brushed")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  No of Worms Brushed is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="err">
                              {t("Male Ratio")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed1MaleRatio"
                                  name="bed1MaleRatio"
                                  value={cocoonAssesmentDetailsBedWise.bed1MaleRatio || ""}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Male Ratio")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  ERR is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="err">
                              {t("Female Ratio")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed1FemaleRatio"
                                  name="bed1FemaleRatio"
                                  value={cocoonAssesmentDetailsBedWise.bed1FemaleRatio || ""}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Female Ratio")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  ERR is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                        </Row>
                        <div className="gap-col mt-2 sh-modal-footer">
                        <ul className="d-flex align-items-center justify-content-center gap g-3">
                          <li>
                            {/* <Button type="button" variant="primary" onClick={postData}> */}
                            <Button type="submit" variant="success">
                              <Icon name="check" className="me-1" />
                              {t("Update")}
                            </Button>
                          </li>
                          <li>
                            {/* <Button
                              type="button"
                              variant="secondary"
                              onClick={clear}
                            >
                              Cancel
                            </Button> */}
                          </li>
                        </ul>
                      </div>
                        </Card.Body>
                    </Card>
                      </Block>
                     
                    </Col>
                  </Row>
                </div>
              </Row>
            </Form>
          </Block>

          <Block className="mt-4">
            <Form noValidate validated={validated1} onSubmit={postBed2Data}>
              <Row className="g-3 ">
                <div>
                  <Row className="g-gs">
                    <Col lg="12">
                      <Block>
                      <Card>
                      <Card.Header>
                       {t("Bed 2")}
                      </Card.Header>
                      <Card.Body>
                        <Row className="g-gs">
                       
                        <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightCacoons">
                                {t("Bed Name")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed2Name"
                                  name="bed2Name"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed2Name || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Bed Name")}
                                  readOnly
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                Bed Name is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightCacoons">
                                {t("Average Weight of 25 Cocoons")}
        
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed2WeightCacoons"
                                  name="bed2WeightCacoons"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed2WeightCacoons || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Average Weight of 25 Cocoons")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Average Weight of 25 Cocoons is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                           <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightCacoons">
                                {t("Weight of Single Cocoons")}
        
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed2SingleWeightCacoons"
                                  name="bed2SingleWeightCacoons"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed2SingleWeightCacoons || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Weight of Single Cocoons")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Average Weight of 25 Cocoons is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightPupa">
                                {t("Average Weight of 25 Pupa")}
        
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed2WeightPupa"
                                  name="bed2WeightPupa"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed2WeightPupa || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Average Weight of 25 Pupa")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Average Weight of 25 Pupa is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightPupa">
                                {t(" Weight of Single Pupa")}
        
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed2SingleWeightPupa"
                                  name="bed2SingleWeightPupa"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed2SingleWeightPupa || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Weight of Single Pupa")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Average Weight of 25 Pupa is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightShells">
                                {t("Average Weight of 25 Shells")}
        
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed2WeightShells"
                                  name="bed2WeightShells"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed2WeightShells || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Average Weight of 25 Shells")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Average Weight of 25 Shells is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightShells">
                                {t("Weight of Single Shells")}
        
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed2SingleWeightShells"
                                  name="bed2SingleWeightShells"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed2SingleWeightShells || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Weight of Single Shells")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Average Weight of 25 Shells is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="shellPercentage">
                                {t("Shell Percentage")}
        
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed2ShellPercentage"
                                  name="bed2ShellPercentage"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed2ShellPercentage || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Shell Percentage")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Shell Percentage is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="err">
                              {t("Err")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed2Err"
                                  name="bed2Err"
                                  value={cocoonAssesmentDetailsBedWise.bed2Err || ""}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("ERR")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  ERR is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="cacoonsFormed">
                                {t("No of Cocoon's Formed")}
        
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed2CacoonsFormed"
                                  name="bed2CacoonsFormed"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed2CacoonsFormed || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("No of Cocoon's Formed")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  No of Cocoon's Formed is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="wormsBrushed">
                                {t("No of Worms Brushed")}
        
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed2WormsBrushed"
                                  name="bed2WormsBrushed"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed2WormsBrushed || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("No of Worms Brushed")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  No of Worms Brushed is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="err">
                              {t("Male Ratio")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed2MaleRatio"
                                  name="bed2MaleRatio"
                                  value={cocoonAssesmentDetailsBedWise.bed2MaleRatio || ""}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Male Ratio")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  ERR is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="err">
                              {t("Female Ratio")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed2FemaleRatio"
                                  name="bed2FemaleRatio"
                                  value={cocoonAssesmentDetailsBedWise.bed2FemaleRatio || ""}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Female Ratio")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  ERR is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                        </Row>
                        <div className="gap-col mt-2 sh-modal-footer">
                        <ul className="d-flex align-items-center justify-content-center gap g-3">
                          <li>
                            {/* <Button type="button" variant="primary" onClick={postData}> */}
                            <Button type="submit" variant="success">
                              <Icon name="check" className="me-1" />
                              {t("Update")}
                            </Button>
                          </li>
                          <li>
                            {/* <Button
                              type="button"
                              variant="secondary"
                              onClick={clear}
                            >
                              Cancel
                            </Button> */}
                          </li>
                        </ul>
                      </div>
                        </Card.Body>
                    </Card>
                      </Block>
                    </Col>
                  </Row>
                </div>
              </Row>
            </Form>
          </Block>

          <Block className="mt-4">
            <Form noValidate validated={validated1} onSubmit={postBed3Data}>
              <Row className="g-3 ">
                <div>
                  <Row className="g-gs">
                    <Col lg="12">
                      <Block>
                      <Card>
                      <Card.Header>
                       {t("Bed 3")}
                      </Card.Header>
                      <Card.Body>
                        <Row className="g-gs">
                        <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightCacoons">
                                {t("Bed Name")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed3Name"
                                  name="bed3Name"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed3Name || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Bed Name")}
                                  readOnly
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                Bed Name is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightCacoons">
                                {t("Average Weight of 25 Cocoons")}
        
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed3WeightCacoons"
                                  name="bed3WeightCacoons"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed3WeightCacoons || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Average Weight of 25 Cocoons")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Average Weight of 25 Cocoons is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                            <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightCacoons">
                                {t("Weight of Single Cocoons")}
        
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed3SingleWeightCacoons"
                                  name="bed3SingleWeightCacoons"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed3SingleWeightCacoons || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Weight of Single Cocoons")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Average Weight of 25 Cocoons is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightPupa">
                                {t("Average Weight of 25 Pupa")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed3WeightPupa"
                                  name="bed3WeightPupa"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed3WeightPupa || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Average Weight of 25 Pupa")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Average Weight of 25 Pupa is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                           <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightPupa">
                                {t("Weight of Single Pupa")}
        
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed3SingleWeightPupa"
                                  name="bed3SingleWeightPupa"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed3SingleWeightPupa || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Weight of Single Pupa")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Average Weight of 25 Pupa is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightShells">
                                {t("Average Weight of 25 Shells")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed3WeightShells"
                                  name="bed3WeightShells"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed3WeightShells || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Average Weight of 25 Shells")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Average Weight of 25 Shells is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                           <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightShells">
                                {t("Weight of Single Shells")}
        
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed3SingleWeightShells"
                                  name="bed3SingleWeightShells"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed3SingleWeightShells || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Weight of Single Shells")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Average Weight of 25 Shells is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="shellPercentage">
                                {t("Shell Percentage")}        
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed3ShellPercentage"
                                  name="bed3ShellPercentage"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed3ShellPercentage || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Shell Percentage")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Shell Percentage is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="err">
                                  {t("Err")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed3Err"
                                  name="bed3Err"
                                  value={cocoonAssesmentDetailsBedWise.bed3Err || ""}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("ERR")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  ERR is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="cacoonsFormed">
                                {t("No of Cocoon's Formed")}       
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed3CacoonsFormed"
                                  name="bed3CacoonsFormed"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed3CacoonsFormed || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("No of Cocoon's Formed")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  No of Cocoon's Formed is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="bed3WormsBrushed">
                                {t("No of Worms Brushed")}        
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed3WormsBrushed"
                                  name="bed3WormsBrushed"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed3WormsBrushed || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("No of Worms Brushed")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  No of Worms Brushed is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="err">
                              {t("Male Ratio")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed3MaleRatio"
                                  name="bed3MaleRatio"
                                  value={cocoonAssesmentDetailsBedWise.bed3MaleRatio || ""}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Male Ratio")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  ERR is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="err">
                              {t("Female Ratio")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed3FemaleRatio"
                                  name="bed3FemaleRatio"
                                  value={cocoonAssesmentDetailsBedWise.bed3FemaleRatio || ""}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Female Ratio")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  ERR is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                        </Row>
                        <div className="gap-col mt-2 sh-modal-footer">
                        <ul className="d-flex align-items-center justify-content-center gap g-3">
                          <li>
                            {/* <Button type="button" variant="primary" onClick={postData}> */}
                            <Button type="submit" variant="success">
                              <Icon name="check" className="me-1" />
                              {t("Update")}
                            </Button>
                          </li>
                          <li>
                            {/* <Button
                              type="button"
                              variant="secondary"
                              onClick={clear}
                            >
                              Cancel
                            </Button> */}
                          </li>
                        </ul>
                      </div>
                        </Card.Body>
                    </Card>
                      </Block> 
                    </Col>
                  </Row>
                </div>
              </Row>
            </Form>
          </Block>

          <Block className="mt-4">
            <Form noValidate validated={validated1} onSubmit={postBed4Data}>
              <Row className="g-3 ">
                <div>
                  <Row className="g-gs">
                    <Col lg="12">
                      <Block>
                      <Card>
                      <Card.Header>
                       {t("Bed 4")}
                      </Card.Header>
                      <Card.Body>
                        <Row className="g-gs">
                        <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightCacoons">
                                {t("Bed Name")}      
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed4Name"
                                  name="bed4Name"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed4Name || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Bed Name")}
                                  readOnly
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                Bed Name is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightCacoons">
                                {t("Average Weight of 25 Cocoons")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed4WeightCacoons"
                                  name="bed4WeightCacoons"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed4WeightCacoons || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Average Weight of 25 Cocoons")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Average Weight of 25 Cocoons is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                           <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightCacoons">
                                {t("Weight of Single Cocoons")}
        
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed4SingleWeightCacoons"
                                  name="bed4SingleWeightCacoons"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed4SingleWeightCacoons || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Weight of Single Cocoons")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Average Weight of 25 Cocoons is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightPupa">
                                {t("Average Weight of 25 Pupa")}
        
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed4WeightPupa"
                                  name="bed4WeightPupa"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed4WeightPupa || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Average Weight of 25 Pupa")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Average Weight of 25 Pupa is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightPupa">
                                {t("Weight of Single Pupa")}
        
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed4SingleWeightPupa"
                                  name="bed4SingleWeightPupa"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed4SingleWeightPupa || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Weight of Single Pupa")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Average Weight of 25 Pupa is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightShells">
                                {t("Average Weight of 25 Shells")}
        
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed4WeightShells"
                                  name="bed4WeightShells"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed4WeightShells || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Average Weight of 25 Shells")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Average Weight of 25 Shells is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                           <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightShells">
                                {t("Weight of Single Shells")}
        
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed4SingleWeightShells"
                                  name="bed4SingleWeightShells"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed4SingleWeightShells || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Weight of Single Shells")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Average Weight of 25 Shells is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="shellPercentage">
                                {t("Shell Percentage")}
        
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed4ShellPercentage"
                                  name="bed4ShellPercentage"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed4ShellPercentage || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Shell Percentage")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Shell Percentage is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="err">
                              {t("Err")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed4Err"
                                  name="bed4Err"
                                  value={cocoonAssesmentDetailsBedWise.bed4Err || ""}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("ERR")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  ERR is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="cacoonsFormed">
                                {t("No of Cocoon's Formed")}
        
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed4CacoonsFormed"
                                  name="bed4CacoonsFormed"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed4CacoonsFormed || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("No of Cocoon's Formed")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  No of Cocoon's Formed is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="wormsBrushed">
                                {t("No of Worms Brushed")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed4WormsBrushed"
                                  name="bed4WormsBrushed"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed4WormsBrushed || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("No of Worms Brushed")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  No of Worms Brushed is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="err">
                              {t("Male Ratio")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed4MaleRatio"
                                  name="bed4MaleRatio"
                                  value={cocoonAssesmentDetailsBedWise.bed4MaleRatio || ""}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Male Ratio")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  ERR is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="err">
                              {t("Female Ratio")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed4FemaleRatio"
                                  name="bed4FemaleRatio"
                                  value={cocoonAssesmentDetailsBedWise.bed4FemaleRatio || ""}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Female Ratio")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  ERR is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                        </Row>
                        <div className="gap-col mt-2 sh-modal-footer">
                        <ul className="d-flex align-items-center justify-content-center gap g-3">
                          <li>
                            {/* <Button type="button" variant="primary" onClick={postData}> */}
                            <Button type="submit" variant="success">
                              <Icon name="check" className="me-1" />
                              {t("Update")}
                            </Button>
                          </li>
                          <li>
                            {/* <Button
                              type="button"
                              variant="secondary"
                              onClick={clear}
                            >
                              Cancel
                            </Button> */}
                          </li>
                        </ul>
                      </div>
                        </Card.Body>
                    </Card>
                      </Block>
                    </Col>
                  </Row>
                </div>
              </Row>
            </Form>
          </Block>

          <Block className="mt-4">
            <Form noValidate validated={validated1} onSubmit={postBed5Data}>
              <Row className="g-3 ">
                <div>
                  <Row className="g-gs">
                    <Col lg="12">
                      <Block>
                      <Card>
                      <Card.Header>
                       {t("Bed 5")}
                      </Card.Header>
                      <Card.Body>
                        <Row className="g-gs">
                        <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightCacoons">
                                {t("Bed Name")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed5Name"
                                  name="bed5Name"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed5Name || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Bed Name")}
                                  readOnly
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                Bed Name is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightCacoons">
                                {t("Average Weight of 25 Cocoons")}
        
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed5WeightCacoons"
                                  name="bed5WeightCacoons"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed5WeightCacoons || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Average Weight of 25 Cocoons")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Average Weight of 25 Cocoons is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightCacoons">
                                {t("Weight of Single Cocoons")}
        
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed5SingleWeightCacoons"
                                  name="bed5SingleWeightCacoons"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed5SingleWeightCacoons || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Weight of Single Cocoons")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Average Weight of 25 Cocoons is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightPupa">
                                {t("Average Weight of 25 Pupa")}
        
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed5WeightPupa"
                                  name="bed5WeightPupa"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed5WeightPupa || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Average Weight of 25 Pupa")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Average Weight of 25 Pupa is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightPupa">
                                {t("Weight of Single Pupa")}
        
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed5SingleWeightPupa"
                                  name="bed5SingleWeightPupa"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed5SingleWeightPupa || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Weight of Single Pupa")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Average Weight of 25 Pupa is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightShells">
                                {t("Average Weight of 25 Shells")}
        
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed5WeightShells"
                                  name="bed5WeightShells"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed5WeightShells || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Average Weight of 25 Shells")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Average Weight of 25 Shells is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                           <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="weightShells">
                                {t("Weight of Single Shells")}
        
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed5SingleWeightShells"
                                  name="bed5SingleWeightShells"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed5SingleWeightShells || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Weight of Single Shells")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Average Weight of 25 Shells is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="bed5ShellPercentage">
                                {t("Shell Percentage")}
        
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed5ShellPercentage"
                                  name="bed5ShellPercentage"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed5ShellPercentage || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Shell Percentage")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Shell Percentage is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="err">
                              {t("Err")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed5Err"
                                  name="bed5Err"
                                  value={cocoonAssesmentDetailsBedWise.bed5Err || ""}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("ERR")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  ERR is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="bed5CacoonsFormed">
                                {t("No of Cocoon's Formed")}
        
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed5CacoonsFormed"
                                  name="bed5CacoonsFormed"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed5CacoonsFormed || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("No of Cocoon's Formed")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  No of Cocoon's Formed is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="wormsBrushed">
                                {t("No of Worms Brushed")}
        
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed5WormsBrushed"
                                  name="bed5WormsBrushed"
                                  value={
                                    cocoonAssesmentDetailsBedWise.bed5WormsBrushed || ""
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("No of Worms Brushed")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  No of Worms Brushed is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="err">
                              {t("Male Ratio")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed5MaleRatio"
                                  name="bed5MaleRatio"
                                  value={cocoonAssesmentDetailsBedWise.bed5MaleRatio || ""}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Male Ratio")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  ERR is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="err">
                              {t("Female Ratio")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="bed5FemaleRatio"
                                  name="bed5FemaleRatio"
                                  value={cocoonAssesmentDetailsBedWise.bed5FemaleRatio || ""}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Female Ratio")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  ERR is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                        </Row>

                        <div className="gap-col mt-2 sh-modal-footer">
                        <ul className="d-flex align-items-center justify-content-center gap g-3">
                          <li>
                            {/* <Button type="button" variant="primary" onClick={postData}> */}
                            <Button type="submit" variant="success">
                              <Icon name="check" className="me-1" />
                              {t("Update")}
                            </Button>
                          </li>
                          <li>
                            {/* <Button
                              type="button"
                              variant="secondary"
                              onClick={clear}
                            >
                              Cancel
                            </Button> */}
                          </li>
                        </ul>
                      </div>
                        </Card.Body>
                    </Card>
                      </Block>
                      
                    </Col>
                  </Row>
                </div>
              </Row>
            </Form>
          </Block>
        </Modal.Body>
      </Modal>

       <Modal show={showModal2} onHide={handleCloseModal2} size="xl" contentClassName="sh-modal-content">
        <Modal.Header closeButton>
          <Modal.Title>
            <Icon name="eye" className="me-1" />
            {t("View")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <h1 className="d-flex justify-content-center align-items-center">
              {t("Loading...")}
            </h1>
          ) : (
            <>
            <Card className="mt-3">
            <Card.Header>
              {t("Bed 1")}
            </Card.Header>
            <Card.Body>
            <Row className="g-gs">
              <Col lg="12">
                <table className="table small table-bordered">
                  <tbody>
                  <tr>
                      <td style={styles.ctstyle}>{t("Bed Name")}:</td>
                      <td>{viewDetailsData.bed1Name}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Average Weight of 25 Cocoons")}:</td>
                      <td>{viewDetailsData.bed1WeightCacoons}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Weight of Single Cocoons")}:</td>
                      <td>{viewDetailsData.bed1SingleWeightCacoons}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> {t("Average Weight of 25 Pupa")}:</td>
                      <td>{viewDetailsData.bed1WeightPupa}</td>
                    </tr>
                     <tr>
                      <td style={styles.ctstyle}> {t("Weight of Single Pupa")}:</td>
                      <td>{viewDetailsData.bed1SingleWeightPupa}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Average Weight of 25 Shells")}:</td>
                      <td>{viewDetailsData.bed1WeightShells}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Weight of Single Shells")}:</td>
                      <td>{viewDetailsData.bed1SingleWeightShells}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Shell Percentage")}</td>
                      <td>{viewDetailsData.bed1ShellPercentage}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("ERR")}</td>
                      <td>{viewDetailsData.bed1Err}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("No of Worms Brushed")}:</td>
                      <td>{viewDetailsData.bed1CacoonsFormed}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("No of Cocoon's Formed")}:</td>
                      <td>{viewDetailsData.bed1WormsBrushed}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Male Ratio")}:</td>
                      <td>{viewDetailsData.bed1MaleRatio}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Female Ratio")}:</td>
                      <td>{viewDetailsData.bed1FemaleRatio}</td>
                    </tr>
                    
                  </tbody>
                </table>
              </Col>
            </Row>
            </Card.Body>
            </Card>

            <Card className="mt-3">
            <Card.Header>
              {t("Bed 2")}
            </Card.Header>
            <Card.Body>
            <Row className="g-gs">
              <Col lg="12">
                <table className="table small table-bordered">
                  <tbody>
                  <tr>
                      <td style={styles.ctstyle}>{t("Bed Name")}:</td>
                      <td>{viewDetailsData.bed2Name}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Average Weight of 25 Cocoons")}:</td>
                      <td>{viewDetailsData.bed2WeightCacoons}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Weight of Single Cocoons")}:</td>
                      <td>{viewDetailsData.bed2SingleWeightCacoons}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> {t("Average Weight of 25 Pupa")}:</td>
                      <td>{viewDetailsData.bed2WeightPupa}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> {t("Weight of Single Pupa")}:</td>
                      <td>{viewDetailsData.bed2SingleWeightPupa}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Average Weight of 25 Shells")}:</td>
                      <td>{viewDetailsData.bed2WeightShells}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Weight of Single Shells")}:</td>
                      <td>{viewDetailsData.bed2SingleWeightShells}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Shell Percentage")}</td>
                      <td>{viewDetailsData.bed2ShellPercentage}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("ERR")}</td>
                      <td>{viewDetailsData.bed2Err}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("No of Worms Brushed")}:</td>
                      <td>{viewDetailsData.bed2WormsBrushed}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("No of Cocoon's Formed")}:</td>
                      <td>{viewDetailsData.bed2CacoonsFormed}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Male Ratio")}:</td>
                      <td>{viewDetailsData.bed2MaleRatio}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Female Ratio")}:</td>
                      <td>{viewDetailsData.bed2FemaleRatio}</td>
                    </tr>
                    
                  </tbody>
                </table>
              </Col>
            </Row>
            </Card.Body>
            </Card>

            <Card className="mt-3">
            <Card.Header>
              {t("Bed 3")}
            </Card.Header>
            <Card.Body>
            <Row className="g-gs">
              <Col lg="12">
                <table className="table small table-bordered">
                  <tbody>
                  <tr>
                      <td style={styles.ctstyle}>{t("Bed Name")}:</td>
                      <td>{viewDetailsData.bed3Name}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Average Weight of 25 Cocoons")}:</td>
                      <td>{viewDetailsData.bed3WeightCacoons}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Weight of Single Cocoons")}:</td>
                      <td>{viewDetailsData.bed3SingleWeightCacoons}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> {t("Average Weight of 25 Pupa")}:</td>
                      <td>{viewDetailsData.bed3WeightPupa}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> {t("Weight of Single Pupa")}:</td>
                      <td>{viewDetailsData.bed3SingleWeightPupa}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Average Weight of 25 Shells")}:</td>
                      <td>{viewDetailsData.bed3WeightShells}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Weight of Single Shells")}:</td>
                      <td>{viewDetailsData.bed3SingleWeightShells}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Shell Percentage")}</td>
                      <td>{viewDetailsData.bed3ShellPercentage}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("ERR")}</td>
                      <td>{viewDetailsData.bed3Err}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("No of Worms Brushed")}:</td>
                      <td>{viewDetailsData.bed3WormsBrushed}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("No of Cocoon's Formed")}:</td>
                      <td>{viewDetailsData.bed3CacoonsFormed}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Male Ratio")}:</td>
                      <td>{viewDetailsData.bed3MaleRatio}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Female Ratio")}:</td>
                      <td>{viewDetailsData.bed3FemaleRatio}</td>
                    </tr>
                    
                  </tbody>
                </table>
              </Col>
            </Row>
            </Card.Body>
            </Card>

            <Card className="mt-3">
            <Card.Header>
              {t("Bed 4")}
            </Card.Header>
            <Card.Body>
            <Row className="g-gs">
              <Col lg="12">
                <table className="table small table-bordered">
                  <tbody>
                  <tr>
                      <td style={styles.ctstyle}>{t("Bed Name")}:</td>
                      <td>{viewDetailsData.bed4Name}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Average Weight of 25 Cocoons")}:</td>
                      <td>{viewDetailsData.bed4WeightCacoons}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Weight of Single Cocoons")}:</td>
                      <td>{viewDetailsData.bed4SingleWeightCacoons}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> {t("Average Weight of 25 Pupa")}:</td>
                      <td>{viewDetailsData.bed4WeightPupa}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> {t("Weight of Single Pupa")}:</td>
                      <td>{viewDetailsData.bed4SingleWeightPupa}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Average Weight of 25 Shells")}:</td>
                      <td>{viewDetailsData.bed4WeightShells}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Weight of Single Shells")}:</td>
                      <td>{viewDetailsData.bed4SingleWeightShells}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Shell Percentage")}</td>
                      <td>{viewDetailsData.bed4ShellPercentage}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("ERR")}</td>
                      <td>{viewDetailsData.bed4Err}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("No of Worms Brushed")}:</td>
                      <td>{viewDetailsData.bed4WormsBrushed}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("No of Cocoon's Formed")}:</td>
                      <td>{viewDetailsData.bed4CacoonsFormed}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Male Ratio")}:</td>
                      <td>{viewDetailsData.bed4MaleRatio}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Female Ratio")}:</td>
                      <td>{viewDetailsData.bed4FemaleRatio}</td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
            </Card.Body>
            </Card>

            <Card className="mt-3">
            <Card.Header>
              {t("Bed 5")}
            </Card.Header>
            <Card.Body>
            <Row className="g-gs">
              <Col lg="12">
                <table className="table small table-bordered">
                  <tbody>
                  <tr>
                      <td style={styles.ctstyle}>{t("Bed Name")}:</td>
                      <td>{viewDetailsData.bed5Name}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Average Weight of 25 Cocoons")}:</td>
                      <td>{viewDetailsData.bed5WeightCacoons}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Weight of Single Cocoons")}:</td>
                      <td>{viewDetailsData.bed5SingleWeightCacoons}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> {t("Average Weight of 25 Pupa")}:</td>
                      <td>{viewDetailsData.bed5WeightPupa}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> {t("Weight of Single Pupa")}:</td>
                      <td>{viewDetailsData.bed5SingleWeightPupa}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Average Weight of 25 Shells")}:</td>
                      <td>{viewDetailsData.bed5WeightShells}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Weight of Single Shells")}:</td>
                      <td>{viewDetailsData.bed5SingleWeightShells}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Shell Percentage")}</td>
                      <td>{viewDetailsData.bed5ShellPercentage}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("ERR")}</td>
                      <td>{viewDetailsData.bed5Err}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("No of Worms Brushed")}:</td>
                      <td>{viewDetailsData.bed5WormsBrushed}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("No of Cocoon's Formed")}:</td>
                      <td>{viewDetailsData.bed5CacoonsFormed}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Male Ratio")}:</td>
                      <td>{viewDetailsData.bed5MaleRatio}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Female Ratio")}:</td>
                      <td>{viewDetailsData.bed5FemaleRatio}</td>
                    </tr> 
                  </tbody>
                </table>
              </Col>
            </Row>
            </Card.Body>
            </Card>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Layout>
  );
}

const screeningBatchListStyles = `
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
  .sh-list-wrap {
    background: #eef2f8;
    border-radius: 14px;
    padding: 18px;
  }
  .sh-list-card {
    border: none;
    border-radius: 12px;
    box-shadow: 0 4px 14px rgba(30, 103, 168, 0.1);
    overflow: hidden;
  }
  .sh-table-wrap {
    padding: 0 4px 4px;
  }
  .sh-empty {
    padding: 36px 12px;
    text-align: center;
    color: #8a96a8;
    font-size: 14px;
  }
  .sh-empty svg {
    width: 40px;
    height: 40px;
    opacity: 0.5;
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

export default MaintenanceofScreeningBatchRecordsList;
