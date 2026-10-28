import { useState } from "react";
import { Card, Form, Row, Col, Button, Alert } from "react-bootstrap";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon } from "../../components";

// Stand-in for Seva Sindhu's side of URL 1 (Token_Based_Integration_V3.pdf, Step 2): posts the same
// form fields from the browser to our department URL, so the whole citizen flow can be tested before
// Seva Sindhu UAT access exists. Staff-only page; the backend accepts these posts only when
// SEVASINDHU_URL1_MODE=TEST.
const URL1 = (process.env.REACT_APP_API_BASE_URL_DBT || "") + "dashboard/sevasindhu/redirect";

const newRef = () => `EDCS${Date.now()}`;
const newToken = () => {
  const bytes = new Uint8Array(24);
  window.crypto.getRandomValues(bytes);
  return "SIMTOKEN-" + Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
};

const initial = () => ({
  UserId: "SIMUSER01",
  edcsApplicationRefNo: newRef(),
  Token: newToken(),
  assistedmode: "false",
  ServiceId: "",
  mobile: "",
  digilockerid: "",
});

function SevaSindhuSimulator() {
  const [data, setData] = useState(initial);

  const onChange = (e) => setData((d) => ({ ...d, [e.target.name]: e.target.value }));

  // A real top-level form POST (not XHR), exactly what Seva Sindhu's redirection page does.
  const send = (e) => {
    e.preventDefault();
    const form = document.createElement("form");
    form.method = "POST";
    form.action = URL1;
    form.target = "_blank";
    Object.entries(data).forEach(([name, value]) => {
      if (value === "") return;
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      form.appendChild(input);
    });
    document.body.appendChild(form);
    form.submit();
    form.remove();
  };

  return (
    <Layout title="Seva Sindhu Simulator">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Seva Sindhu Simulator</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Alert variant="warning" className="mt-3">
        <Icon name="alert-circle" /> <strong>TEST ONLY.</strong> Plays the part of Seva Sindhu: sends a citizen to e-Reshme
        with the URL 1 fields from Token_Based_Integration_V3. The citizen page opens in a new tab. Works only when dbt runs
        with <code>SEVASINDHU_URL1_MODE=TEST</code>.
      </Alert>

      <Card className="mt-3">
        <Card.Header style={{ backgroundColor: "#0f6cbe", color: "#fff" }}>Send a citizen from Seva Sindhu (URL 1)</Card.Header>
        <Card.Body>
          <Form onSubmit={send}>
            <Row className="g-3">
              <Col lg="4">
                <Form.Group>
                  <Form.Label>UserId *</Form.Label>
                  <Form.Control name="UserId" value={data.UserId} onChange={onChange} required maxLength={100} />
                </Form.Group>
              </Col>
              <Col lg="4">
                <Form.Group>
                  <Form.Label>edcsApplicationRefNo *</Form.Label>
                  <Form.Control name="edcsApplicationRefNo" value={data.edcsApplicationRefNo} onChange={onChange} required maxLength={50} />
                  <Form.Text>Keep the same value to resume an earlier request.</Form.Text>
                </Form.Group>
              </Col>
              <Col lg="4">
                <Form.Group>
                  <Form.Label>ServiceId *</Form.Label>
                  <Form.Control name="ServiceId" value={data.ServiceId} onChange={onChange} required maxLength={50} placeholder="e.g. SERI001" />
                  <Form.Text>Must be mapped to a scheme in sc_sevasindhu_service_mapping.</Form.Text>
                </Form.Group>
              </Col>
              <Col lg="4">
                <Form.Group>
                  <Form.Label>assistedmode *</Form.Label>
                  <Form.Select name="assistedmode" value={data.assistedmode} onChange={onChange}>
                    <option value="false">false (citizen)</option>
                    <option value="true">true (assisted: K1 / B1 / G1)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col lg="4">
                <Form.Group>
                  <Form.Label>mobile</Form.Label>
                  <Form.Control name="mobile" value={data.mobile} onChange={onChange} maxLength={10} placeholder="optional" />
                </Form.Group>
              </Col>
              <Col lg="4">
                <Form.Group>
                  <Form.Label>digilockerid</Form.Label>
                  <Form.Control name="digilockerid" value={data.digilockerid} onChange={onChange} maxLength={100} placeholder="optional" />
                </Form.Group>
              </Col>
              <Col lg="12">
                <Form.Group>
                  <Form.Label>Token *</Form.Label>
                  <Form.Control name="Token" value={data.Token} onChange={onChange} required maxLength={4000} />
                  <Form.Text>Random test value. Not verified in TEST mode (Seva Sindhu has not shared how to verify it).</Form.Text>
                </Form.Group>
              </Col>
            </Row>
            <div className="mt-4 d-flex gap-2">
              <Button type="submit" variant="primary"><Icon name="send" /> Send to e-Reshme</Button>
              <Button type="button" variant="secondary" onClick={() => setData(initial())}>New reference</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Layout>
  );
}

export default SevaSindhuSimulator;
