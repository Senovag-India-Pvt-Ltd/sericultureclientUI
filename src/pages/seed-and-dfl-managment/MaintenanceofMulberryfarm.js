import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect } from "react";
import api from "../../../src/services/auth/api";
import DatePicker from "react-datepicker";
import { Icon } from "../../components";
import { useTranslation } from "react-i18next";

const baseURL2 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

function MaintenanceofMulberryfarm() {
  const [data, setData] = useState({
    plotNumber: "",
    variety: "",
    areaUnderEachVariety: "",
    pruningDate: "",
    soilTypeId: "",
    mulberrySpacing: "",
    plantationDate: "",
    irrigationCategory: "",
    totalProductionPlants: "",
    gliricidiaPlantArea: "",
    uprootedArea: "",
    leafQuantityKg: "",
    uprootedDate: "",
    leafHarvestDate: "",
    fymQuantity: "",
    ammoniumSulphateQuantity: "",
    superPhosphateQuantity: "",
    muriateOfPotashQuantity: "",
  });

  const [validated, setValidated] = useState(false);

  const { t } = useTranslation();

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });

    // Fetch plot details after entering plot number
  if (name === "plotNumber" && value.trim() !== "") {
    getLogsList(value.trim());
  }
  };
  // const handleDateChange = (newDate) => {
  //   setData({ ...data, applicationDate: newDate });
  // };

  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      const { pruningDate } = data;
      const formattedDate =
        pruningDate.getFullYear() +
        "-" +
        (pruningDate.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        pruningDate.getDate().toString().padStart(2, "0");

        const { plantationDate } = data;
      const formattedPlantationDate =
      plantationDate.getFullYear() +
        "-" +
        (plantationDate.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        plantationDate.getDate().toString().padStart(2, "0");
      // event.stopPropagation();
      api
        .post(baseURLSeedDfl + `MulberryFarm/add-info`, {
          ...data,
          pruningDate: formattedDate,
          plantationDate: formattedPlantationDate,
          uprootedDate: data.uprootedDate instanceof Date
            ? data.uprootedDate.getFullYear() + "-" + String(data.uprootedDate.getMonth() + 1).padStart(2, "0") + "-" + String(data.uprootedDate.getDate()).padStart(2, "0")
            : null,
          leafHarvestDate: data.leafHarvestDate instanceof Date
            ? data.leafHarvestDate.getFullYear() + "-" + String(data.leafHarvestDate.getMonth() + 1).padStart(2, "0") + "-" + String(data.leafHarvestDate.getDate()).padStart(2, "0")
            : null,
        })
        .then((response) => {
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess();
            setData({
              plotNumber: "",
              variety: "",
              areaUnderEachVariety: "",
              pruningDate: "",
              soilTypeId: "",
              mulberrySpacing: "",
              plantationDate: "",
              irrigationCategory: "",
              totalProductionPlants: "",
              gliricidiaPlantArea: "",
              uprootedArea: "",
              leafQuantityKg: "", uprootedDate: "", leafHarvestDate: "",
              fymQuantity: "",
              ammoniumSulphateQuantity: "",
              superPhosphateQuantity: "",
              muriateOfPotashQuantity: "",
            });
            setValidated(false);
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

  const clear = () => {
    setData({
      plotNumber: "",
      variety: "",
      areaUnderEachVariety: "",
      pruningDate: "",
      soilTypeId: "",
      mulberrySpacing: "",
      plantationDate: "",
      irrigationCategory: "",
      totalProductionPlants: "",
      gliricidiaPlantArea: "",
      uprootedArea: "",
      leafQuantityKg: "", uprootedDate: "", leafHarvestDate: "",
      fymQuantity: "",
      ammoniumSulphateQuantity: "",
      superPhosphateQuantity: "",
      muriateOfPotashQuantity: "",
    });
    setValidated(false);
  };

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  const [listData, setListData] = useState({});

  const getLogsList = (plotNumber) => {
  api
    .get(baseURLSeedDfl + `MulberryFarm/get-logs/${plotNumber}`)
    .then((response) => {
      const dataList = response.data;

      if (dataList.length > 0) {
        const { mulberryVarietyName, areaUnderEachVariety, soilTypeName } = dataList[0];

        // Find IDs by name for dropdowns
        const selectedVariety = varietyListData.find(
          (item) => item.mulberryVarietyName === mulberryVarietyName
        );
        const selectedSoil = soilTypeListData.find(
          (item) => item.soilTypeName === soilTypeName
        );

        setData((prevData) => ({
          ...prevData,
          variety: selectedVariety?.mulberryVarietyId || "",
          areaUnderEachVariety: areaUnderEachVariety || "",
          soilTypeId: selectedSoil?.soilTypeId || "",
        }));
      }
    })
    .catch((err) => {
      console.error("Error fetching plot details:", err);
    });
};


  // to get Mulberry Variety
  const [varietyListData, setVarietyListData] = useState([]);

  const getVarietyList = () => {
    const response = api
      .get(baseURL2 + `mulberry-variety/get-all`)
      .then((response) => {
        setVarietyListData(response.data.content.mulberryVariety);
      })
      .catch((err) => {
        setVarietyListData([]);
      });
  };

    // to get Soil Type
    const [soilTypeListData, setSoilTypeListData] = useState([]);

    const getSoilTypeList = () => {
      const response = api
        .get(baseURL2 + `soilType/get-all`)
        .then((response) => {
          setSoilTypeListData(response.data.content.soilType);
        })
        .catch((err) => {
          setSoilTypeListData([]);
        });
    };

  useEffect(() => {
    getSoilTypeList();
    getVarietyList();
  }, []);

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
      title: "Attempt was not successful",
      html: errorMessage,
    });
  };

  return (
    <Layout title={t("Maintenance of Mulberry Garden in the Farms")}>
      <style>{mulberryFarmFormStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("Maintenance of Mulberry Garden in the Farms")}
              </Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/Maintenance-of-mulberry-Garden-in-the-Farms-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/Maintenance-of-mulberry-Garden-in-the-Farms-list"
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
        <Form noValidate validated={validated} onSubmit={postData}>
          {/* <Row className="g-3 "> */}
          <Card>
            <Card.Header className="sh-section-header">
              <Icon name="growth" />
              <span>{t("Maintenance of Mulberry Garden in the Farms")}</span>
            </Card.Header>
            <Card.Body>
              {/* <h3>Farmers Details</h3> */}
              <Row className="g-gs">
                <Col lg="4">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="plotNumber">
                      {t("Plot Number")}<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="plotNumber"
                        name="plotNumber"
                        value={data.plotNumber}
                        onChange={handleInputs}
                        type="text"
                        placeholder={t("Enter Plot Number")}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {t("Plot Number is required")}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group">
                    <Form.Label>
                      {t("Mulberry Variety")}<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="variety"
                        value={data.variety}
                        onChange={handleInputs}
                        onBlur={() => handleInputs}
                        // multiple
                        required
                        isInvalid={
                          data.variety === undefined || data.variety === "0"
                        }
                      >
                        <option value="">{t("Select Mulberry Variety")}</option>
                        {varietyListData.map((list) => (
                          <option
                            key={list.mulberryVarietyId}
                            value={list.mulberryVarietyId}
                          >
                            {list.mulberryVarietyName}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {t("Mulberry Variety is required")}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="areaUnderEachVariety">
                      {t("Area(In Acres)")}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="areaUnderEachVariety"
                        name="areaUnderEachVariety"
                        value={data.areaUnderEachVariety}
                        onChange={handleInputs}
                        maxLength="4"
                        type="text"
                        placeholder={t("Enter Area(In Hectares)")}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      {t("Soil Type")}<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="soilTypeId"
                        value={data.soilTypeId}
                        onChange={handleInputs}
                        onBlur={() => handleInputs}
                        // multiple
                        required
                        isInvalid={
                          data.variety === undefined || data.variety === "0"
                        }
                      >
                        <option value="">{t("Select Soil Type")}</option>
                        {soilTypeListData.map((list) => (
                          <option key={list.soilTypeId} value={list.soilTypeId}>
                            {list.soilTypeName}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {t("Soil Type is required")}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="mulberrySpacing">
                      {t("Mulberry Spacing")}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="mulberrySpacing"
                        name="mulberrySpacing"
                        value={data.mulberrySpacing}
                        onChange={handleInputs}
                        maxLength="6"
                        type="text"
                        placeholder={t("Enter Mulberry Spacing")}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      {t("Irrigation Category")}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="irrigationCategory"
                        value={data.irrigationCategory}
                        onChange={handleInputs}
                      >
                        <option value="">{t("Select Irrigation Category")}</option>
                        <option value="1">{t("Irrigated")}</option>
                        <option value="2">{t("Rain-fed")}</option>
                      </Form.Select>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="totalProductionPlants">
                      {t("Total Production Plants")}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="totalProductionPlants"
                        name="totalProductionPlants"
                        value={data.totalProductionPlants}
                        onChange={handleInputs}
                        type="number"
                        min="0"
                        placeholder={t("Enter Total Production Plants")}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="gliricidiaPlantArea">
                      {t("Gliricidia Plant Area")}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="gliricidiaPlantArea"
                        name="gliricidiaPlantArea"
                        value={data.gliricidiaPlantArea}
                        onChange={handleInputs}
                        type="number"
                        min="0"
                        step="any"
                        placeholder={t("Enter Gliricidia Plant Area")}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="uprootedArea">{t("Uprooted Area")}</Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control id="uprootedArea" name="uprootedArea"
                        value={data.uprootedArea} onChange={handleInputs}
                        type="number" min="0" step="any"
                        placeholder={t("Enter Uprooted Area")} />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="leafQuantityKg">{t("Leaf Quantity (Kg)")}</Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control id="leafQuantityKg" name="leafQuantityKg"
                        value={data.leafQuantityKg} onChange={handleInputs}
                        type="number" min="0" step="any"
                        placeholder={t("Enter Leaf Quantity (Kg)")} />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="uprootedDate">{t("Uprooted Date")}</Form.Label>
                    <div className="form-control-wrap">
                      <DatePicker
                        selected={data.uprootedDate}
                        onChange={(date) => handleDateChange(date, "uprootedDate")}
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        placeholderText={t("Select Uprooted Date")}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="leafHarvestDate">{t("Leaf Harvest Date")}</Form.Label>
                    <div className="form-control-wrap">
                      <DatePicker
                        selected={data.leafHarvestDate}
                        onChange={(date) => handleDateChange(date, "leafHarvestDate")}
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        placeholderText={t("Select Leaf Harvest Date")}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="fymQuantity">{t("FYM Quantity")}</Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control id="fymQuantity" name="fymQuantity"
                        value={data.fymQuantity} onChange={handleInputs}
                        type="number" min="0" step="any"
                        placeholder={t("Enter FYM Quantity")} />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="ammoniumSulphateQuantity">{t("Ammonium Sulphate Quantity")}</Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control id="ammoniumSulphateQuantity" name="ammoniumSulphateQuantity"
                        value={data.ammoniumSulphateQuantity} onChange={handleInputs}
                        type="number" min="0" step="any"
                        placeholder={t("Enter Ammonium Sulphate Quantity")} />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="superPhosphateQuantity">{t("Super Phosphate Quantity")}</Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control id="superPhosphateQuantity" name="superPhosphateQuantity"
                        value={data.superPhosphateQuantity} onChange={handleInputs}
                        type="number" min="0" step="any"
                        placeholder={t("Enter Super Phosphate Quantity")} />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="muriateOfPotashQuantity">{t("Muriate of Potash Quantity")}</Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control id="muriateOfPotashQuantity" name="muriateOfPotashQuantity"
                        value={data.muriateOfPotashQuantity} onChange={handleInputs}
                        type="number" min="0" step="any"
                        placeholder={t("Enter Muriate of Potash Quantity")} />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="2">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="sordfl">
                      {t("Pruning Date")}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <DatePicker
                        selected={data.pruningDate}
                        onChange={(date) =>
                          handleDateChange(date, "pruningDate")
                        }
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dateFormat="dd/MM/yyyy"
                        // maxDate={new Date()}
                        className="form-control"
                        required
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="2">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="sordfl">
                      {t("Plantation Date")}
                      <span className="text-danger">*</span>
                    </Form.Label>
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
                        // maxDate={new Date()}
                        className="form-control"
                        required
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <div className="gap-col">
            <ul className="mt-1 d-flex align-items-center justify-content-center gap g-3">
              <li>
                {/* <Button type="button" variant="primary" onClick={postData}> */}
                <Button type="submit" variant="primary" className="shadow-sm px-4 py-2">
                  <Icon name="check" className="me-1" />
                  {t("Save")}
                </Button>
              </li>
              {/* <li>
                <Button type="button" variant="secondary" onClick={clear}>
                  Cancel
                </Button>
              </li> */}
              <li>
                  <Link
                    to="/seriui/Maintenance-of-mulberry-Garden-in-the-Farms-list"
                    className="btn btn-secondary border-0 sh-cancel-btn shadow-sm px-4 py-2"
                  >
                   <Icon name="cross" className="me-1" />
                   {t("Cancel")}
                  </Link>
                </li>
            </ul>
          </div>
          {/* </Row> */}
        </Form>
      </Block>
    </Layout>
  );
}

const mulberryFarmFormStyles = `
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
  .sh-form-wrap .text-danger {
    font-weight: 700;
    margin-left: 3px;
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
  .sh-section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 700 !important;
    font-size: 1rem !important;
    letter-spacing: 0.3px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    color: #ffffff !important;
    padding: 14px 20px !important;
  }
  .sh-section-header svg,
  .sh-section-header .icon {
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
`;

export default MaintenanceofMulberryfarm;
