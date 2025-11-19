import React, { useEffect, useState } from "react";
import api from "../../services/auth/api";
import { Button, Card, Form, Row, Col } from "react-bootstrap";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";

const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLReport = process.env.REACT_APP_API_BASE_URL_REPORT;

function GenerateSanctionOrder() {
  const [form, setForm] = useState({
    schemeId: "",
    subSchemeId: "",
    componentId: "",
    sanctionOrderIndex: "",
    sanctionOrderNumber: "",
    applicationFormId: "",
    farmerName: "",
    fruitsId: "",
    type: "RH",
  });

  const [scSchemeDetailsListData, setScSchemeDetailsListData] = useState([]);
  const [scSubSchemeDetailsListData, setScSubSchemeDetailsListData] = useState([]);
  const [scComponentListData, setScComponentListData] = useState([]);
  const [sanctionOrders, setSanctionOrders] = useState([]);

  // -------------------------------------------------------
  // 🔹 Load Scheme List
  // -------------------------------------------------------
  useEffect(() => {
    api
      .get(baseURLMasterData + `scSchemeDetails/get-all`)
      .then((res) =>
        setScSchemeDetailsListData(res.data.content.ScSchemeDetails || [])
      )
      .catch(() => setScSchemeDetailsListData([]));
  }, []);

  // -------------------------------------------------------
  // 🔹 Load Sub Scheme List by SchemeId
  // -------------------------------------------------------
  const getSubSchemeList = (schemeId) => {
    if (!schemeId) return;

    api
      .get(baseURLDBT + `master/cost/get-by-scheme-id/${schemeId}`)
      .then((res) =>
        setScSubSchemeDetailsListData(res.data.content.unitCost || [])
      )
      .catch(() => setScSubSchemeDetailsListData([]));
  };

  // -------------------------------------------------------
  // 🔹 Load Component List (Scheme + SubScheme)
  // -------------------------------------------------------
  const getComponentList = (schemeId, subSchemeId) => {
    if (!schemeId || !subSchemeId) return;

    api
      .post(baseURLDBT + `master/cost/get-by-schemeId-and-subSchemeId`, {
        schemeId,
        subSchemeId,
      })
      .then((res) =>
        setScComponentListData(res.data.content.unitCost || [])
      )
      .catch(() => setScComponentListData([]));
  };

  // -------------------------------------------------------
  // 🔹 Fetch Sanction Order list
  // -------------------------------------------------------
  const loadSanctionOrders = async () => {
    if (!form.schemeId || !form.subSchemeId || !form.componentId) return;

    const payload = {
      schemeId: form.schemeId,
      subSchemeId: form.subSchemeId,
      componentId: form.componentId,
    };

    const res = await api.post(
      baseURLDBT + `v1/service/application/fetchSanctionOrder`,
      payload
    );

    setSanctionOrders(res.data.content || []);
  };

  // -------------------------------------------------------
  // 🔹 Handle Change for all inputs
  // -------------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    // auto fill when selecting sanction order
    if (name === "sanctionOrderIndex") {
      const selected = sanctionOrders[value];

      setForm({
        ...form,
        sanctionOrderIndex: value,
        sanctionOrderNumber: selected?.sanctionOrderNumber || "",
        applicationFormId: selected?.applicationFormId || "",
        farmerName: selected?.farmerFirstName || "",
        fruitsId: selected?.fruitsId || "",
      });

      return;
    }

    setForm({ ...form, [name]: value });

    // --- When scheme changes ---
    if (name === "schemeId") {
      setScSubSchemeDetailsListData([]);
      setScComponentListData([]);
      setSanctionOrders([]);
      getSubSchemeList(value);
    }

    // --- When sub-scheme changes ---
    if (name === "subSchemeId") {
      setScComponentListData([]);
      setSanctionOrders([]);
      getComponentList(form.schemeId, value);
    }

    // --- When component changes ---
    if (name === "componentId") {
      setSanctionOrders([]);
      loadSanctionOrders();
    }
  };

  // -------------------------------------------------------
  // 🔹 Download PDF
  // -------------------------------------------------------
  const downloadReport = async () => {
    const payload = {
      schemeId: form.schemeId,
      subSchemeId: form.subSchemeId,
      componentId: form.componentId,
      sanctionOrderNumber: form.sanctionOrderNumber,
      applicationFormIds: [form.applicationFormId],
      type: form.type,
      userMasterId: localStorage.getItem("userMasterId"),
    };

    const response = await api.post(
      baseURLReport + `download/sanction-order`,
      payload,
      { responseType: "blob" }
    );

    const file = new Blob([response.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  };

  // -------------------------------------------------------
  // UI Rendering
  // -------------------------------------------------------
  return (
    <Layout title="Generate Sanction Order">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Sanction Order Download</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n5">
        <Form>
          <Row className="g-3">

            <Card>
              <Card.Body>
                <Row className="g-gs">

                  {/* Scheme */}
                  <Form.Label column sm={1}>Scheme</Form.Label>
                  <Col sm={3}>
                    <Form.Select
                      name="schemeId"
                      value={form.schemeId}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      {scSchemeDetailsListData.map((list) => (
                        <option
                          key={list.scSchemeDetailsId}
                          value={list.scSchemeDetailsId}
                        >
                          {list.schemeName}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>

                  {/* Sub Scheme */}
                  <Form.Label column sm={1}>Component Type</Form.Label>
                  <Col sm={3}>
                    <Form.Select
                      name="subSchemeId"
                      value={form.subSchemeId}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      {scSubSchemeDetailsListData.map((list) => (
                        <option
                          key={list.scSubSchemeDetailsId}
                          value={list.subSchemeId}
                        >
                          {list.subSchemeName}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>

                  {/* Component */}
                  <Form.Label column sm={1}>Component</Form.Label>
                  <Col sm={3}>
                    <Form.Select
                      name="componentId"
                      value={form.componentId}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      {scComponentListData.map((list) => (
                        <option
                          key={list.scComponentId}
                          value={list.scComponentId}
                        >
                          {list.scComponentName}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>

                  {/* Sanction Order */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Sanction Order</Form.Label>
                      <Form.Select
                        name="sanctionOrderIndex"
                        value={form.sanctionOrderIndex}
                        onChange={handleChange}
                      >
                        <option value="">Select</option>
                        {sanctionOrders.map((so, index) => (
                          <option key={index} value={index}>
                            {so.sanctionOrderNumber} - {so.farmerFirstName}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {/* Auto Filled */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Farmer Name</Form.Label>
                      <Form.Control value={form.farmerName} disabled />

                      <Form.Label className="mt-2">Fruits ID</Form.Label>
                      <Form.Control value={form.fruitsId} disabled />
                    </Form.Group>
                  </Col>

                  {/* Type */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Type</Form.Label>
                      <Form.Select
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                      >
                        <option value="RH">RH</option>
                        <option value="SILK">SILK</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                </Row>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <div className="d-flex justify-content-center">
                  <Button variant="primary" onClick={downloadReport}>
                    Download
                  </Button>
                </div>
              </Card.Body>
            </Card>

          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default GenerateSanctionOrder;
