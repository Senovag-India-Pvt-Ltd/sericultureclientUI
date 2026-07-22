import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import api from "../../../../src/services/auth/api";
import { Icon } from "../../../components";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ArmCalculationEdit() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const ARM_ENDS_OPTIONS = ["120 Ends", "200 Ends", "400 Ends"];

  const [data, setData] = useState({
    armCalculationId: "",
    scCategoryId: "",
    componentId: "",
    componentTypeId: "",
    armEnds: "",
    equipmentName: "",
    quantity: "",
    unitRate: "",
    unitCost: "",
    centralPercentage: "",
    statePercentage: "",
    advancePercentage: "",
    firstPayment: "",
    finalPayment: "",
  });
  const [validated, setValidated] = useState(false);

  const totalAmount =
    data.quantity && data.unitRate
      ? (parseFloat(data.quantity) * parseFloat(data.unitRate)).toFixed(2)
      : "";

  const [scCategoryList, setScCategoryList] = useState([]);
  const [componentList, setComponentList] = useState([]);
  const [componentTypeList, setComponentTypeList] = useState([]);

  useEffect(() => {
    // Load dropdowns
    api.get(baseURL + "scCategory/get-all").then((r) => setScCategoryList(r.data.content.scCategory || [])).catch(() => {});
    api.get(baseURL + "scComponent/get-all").then((r) => setComponentList(r.data.content.scComponent || [])).catch(() => {});
    api.get(baseURL + "scSubSchemeDetails/get-all").then((r) => setComponentTypeList(r.data.content.scSubSchemeDetails || [])).catch(() => {});

    // Load existing record
    api.get(baseURL + `armCalculation/get/${id}`)
      .then((r) => {
        const c = r.data.content;
        setData({
          armCalculationId: c.armCalculationId || id,
          scCategoryId: c.scCategoryId || "",
          componentId: c.componentId || "",
          componentTypeId: c.componentTypeId || "",
          armEnds: c.armEnds || "",
          equipmentName: c.equipmentName || "",
          quantity: c.quantity || "",
          unitRate: c.unitRate || "",
          unitCost: c.unitCost || "",
          centralPercentage: c.centralPercentage || "",
          statePercentage: c.statePercentage || "",
          advancePercentage: c.advancePercentage || "",
          firstPayment: c.firstPayment || "",
          finalPayment: c.finalPayment || "",
        });
      })
      .catch(() => Swal.fire({ icon: "error", title: t("Error"), text: t("Record not found") }));
  }, [id]);

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: ["scCategoryId", "componentId", "componentTypeId"].includes(name)
        ? parseInt(value)
        : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) { e.stopPropagation(); setValidated(true); return; }
    setValidated(false);

    const payload = {
      armCalculationId: parseInt(id),
      scCategoryId: data.scCategoryId || null,
      componentId: data.componentId || null,
      componentTypeId: data.componentTypeId || null,
      armEnds: data.armEnds || null,
      equipmentName: data.equipmentName,
      quantity: data.quantity ? parseFloat(data.quantity) : null,
      unitRate: data.unitRate ? parseFloat(data.unitRate) : null,
      unitCost: data.unitCost ? parseFloat(data.unitCost) : null,
      centralPercentage: data.centralPercentage ? parseFloat(data.centralPercentage) : null,
      statePercentage: data.statePercentage ? parseFloat(data.statePercentage) : null,
      advancePercentage: data.advancePercentage ? parseFloat(data.advancePercentage) : null,
      firstPayment: data.firstPayment ? parseFloat(data.firstPayment) : null,
      finalPayment: data.finalPayment ? parseFloat(data.finalPayment) : null,
    };

    api.post(baseURL + "armCalculation/edit", payload)
      .then(() => {
        Swal.fire({ icon: "success", title: t("Updated successfully") }).then(() =>
          navigate("/seriui/arm-calculation-list")
        );
      })
      .catch((err) => {
        const msg = err.response?.data?.errorMessages?.[0]?.message?.[0]?.message || t("Something went wrong!");
        Swal.fire({ icon: "error", title: t("Error"), text: typeof msg === "string" ? msg : JSON.stringify(msg) });
      });
  };

  const labelStyle = { fontWeight: 600, fontSize: "13px", color: "#4a5568" };
  const inputStyle = { borderRadius: "7px", border: "1.5px solid #d0d9e8", fontSize: "13px" };

  return (
    <Layout title={t("Edit ARM Calculation")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Edit ARM Calculation")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <Link to="/seriui/arm-calculation-list" className="btn btn-primary d-none d-md-inline-flex">
              <Icon name="arrow-left" /><span>{t("Back to List")}</span>
            </Link>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 24px rgba(30,103,168,0.10)" }}>
          <div style={{ background: "linear-gradient(135deg,#1e67a8,#2d9cdb)", padding: "14px 24px", borderRadius: "14px 14px 0 0", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>✏️</div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: "15px" }}>{t("Edit ARM Calculation")}</div>
          </div>
          <Card.Body style={{ padding: "24px" }}>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Row className="g-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>{t("SC Category")} <span className="text-danger">*</span></Form.Label>
                    <Form.Select name="scCategoryId" value={data.scCategoryId} onChange={handleInputs} required style={inputStyle}>
                      <option value="">{t("-- Select Category --")}</option>
                      {scCategoryList.map((c) => <option key={c.scCategoryId} value={c.scCategoryId}>{c.categoryName}</option>)}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{t("Category is required")}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>{t("Component Type")}</Form.Label>
                    <Form.Select name="componentTypeId" value={data.componentTypeId} onChange={handleInputs} style={inputStyle}>
                      <option value="">{t("-- Select Component Type --")}</option>
                      {componentTypeList.map((c) => <option key={c.scSubSchemeDetailsId} value={c.scSubSchemeDetailsId}>{c.subSchemeName}</option>)}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>{t("Component")}</Form.Label>
                    <Form.Select name="componentId" value={data.componentId} onChange={handleInputs} style={inputStyle}>
                      <option value="">{t("-- Select Component --")}</option>
                      {componentList.map((c) => <option key={c.scComponentId} value={c.scComponentId}>{c.scComponentName}</option>)}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>{t("ARM Ends")} <span className="text-danger">*</span></Form.Label>
                    <Form.Select name="armEnds" value={data.armEnds} onChange={handleInputs} required style={inputStyle}>
                      <option value="">{t("-- Select ARM Ends --")}</option>
                      {ARM_ENDS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{t("ARM Ends is required")}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={8}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>{t("Name of the Equipment")} <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="text" name="equipmentName" value={data.equipmentName} onChange={handleInputs} required style={inputStyle} />
                    <Form.Control.Feedback type="invalid">{t("Equipment name is required")}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>{t("Quantity (in No's)")} <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="number" name="quantity" value={data.quantity} onChange={handleInputs} min="0" step="0.01" required style={inputStyle} />
                    <Form.Control.Feedback type="invalid">{t("Quantity is required")}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>{t("Unit Rate (in Rs)")} <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="number" name="unitRate" value={data.unitRate} onChange={handleInputs} min="0" step="0.01" required style={inputStyle} />
                    <Form.Control.Feedback type="invalid">{t("Unit rate is required")}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>{t("Total Amount (in Rs.)")}</Form.Label>
                    <Form.Control type="text" value={totalAmount ? `₹ ${parseFloat(totalAmount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : ""} readOnly style={{ ...inputStyle, background: "#f0f5fb", color: "#1e67a8", fontWeight: 700 }} />
                    <Form.Text className="text-muted" style={{ fontSize: "11px" }}>{t("Auto-calculated")}</Form.Text>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>{t("Unit Cost (in Rs)")}</Form.Label>
                    <Form.Control type="number" name="unitCost" value={data.unitCost} onChange={handleInputs} min="0" step="0.01" style={inputStyle} />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>{t("Central Share (%)")} <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="number" name="centralPercentage" value={data.centralPercentage} onChange={handleInputs} min="0" max="100" step="0.01" required style={inputStyle} />
                    <Form.Control.Feedback type="invalid">{t("Central percentage is required")}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>{t("State Share (%)")} <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="number" name="statePercentage" value={data.statePercentage} onChange={handleInputs} min="0" max="100" step="0.01" required style={inputStyle} />
                    <Form.Control.Feedback type="invalid">{t("State percentage is required")}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>{t("Advance Payment (%)")}</Form.Label>
                    <Form.Control type="number" name="advancePercentage" value={data.advancePercentage} onChange={handleInputs} min="0" max="100" step="0.01" style={inputStyle} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>{t("First Payment (%)")}</Form.Label>
                    <Form.Control type="number" name="firstPayment" value={data.firstPayment} onChange={handleInputs} min="0" max="100" step="0.01" style={inputStyle} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>{t("Final Payment (%)")}</Form.Label>
                    <Form.Control type="number" name="finalPayment" value={data.finalPayment} onChange={handleInputs} min="0" max="100" step="0.01" style={inputStyle} />
                  </Form.Group>
                </Col>
              </Row>

              <div className="mt-4 d-flex gap-2">
                <Button type="submit" style={{ background: "linear-gradient(135deg,#1e67a8,#2d9cdb)", border: "none", borderRadius: "8px", padding: "8px 28px", fontWeight: 700 }}>
                  {t("Update")}
                </Button>
                <Link to="/seriui/arm-calculation-list" className="btn" style={{ border: "1.5px solid #1e67a8", borderRadius: "8px", padding: "8px 20px", fontWeight: 700, color: "#1e67a8" }}>
                  {t("Cancel")}
                </Link>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Block>
    </Layout>
  );
}

export default ArmCalculationEdit;
