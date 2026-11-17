import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon } from "../../components";
import { useState } from "react";
import api from "../../services/auth/api";
import { useTranslation } from "react-i18next";

const baseURLRegistration = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

// Internal, TEST-ONLY harness for the future Seva Sindhu integration. It
// simulates the citizen redirect (mobile number + optional FRUITS ID + a
// Seva Sindhu reference) and shows exactly what the real integration would
// decide: is the farmer already registered, and which existing Sericulture
// screen the citizen would be sent to next. It never creates a farmer or an
// application on its own -- it only reports the branch and links to the
// real, existing screens for the admin/QA user to continue manually.
// NOT connected to any real Seva Sindhu system -- there is no live external
// caller yet (see the source requirement document's open points).
function SevaSindhuTestHarness() {
  const { t } = useTranslation();

  const [data, setData] = useState({
    mobileNumber: "",
    fruitsId: "",
    sevaSindhuReference: `SSAPP-TEST-${Date.now()}`,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const handleInputs = (e) => {
    const { name } = e.target;
    // FRUITS IDs are stored upper-case ("FID" + 13 digits); accept "fid..." / stray spaces as typed.
    const value = name === "fruitsId" ? e.target.value.trim().toUpperCase() : e.target.value;
    setData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errors = {};
    if (data.mobileNumber && !/^\d{10}$/.test(data.mobileNumber)) {
      errors.mobileNumber = t("Mobile number must be exactly 10 digits.");
    }
    if (data.fruitsId && !/^FID\d{13}$/.test(data.fruitsId)) {
      errors.fruitsId = t("FRUITS ID must be FID followed by 13 digits, e.g. FID2806000049272.");
    }
    if (!data.sevaSindhuReference?.trim()) {
      errors.sevaSindhuReference = t("Seva Sindhu Reference is required.");
    }
    if (!data.mobileNumber && !data.fruitsId) {
      errors.mobileNumber = t("Enter a mobile number or a FRUITS ID.");
      errors.fruitsId = t("Enter a mobile number or a FRUITS ID.");
    }
    return errors;
  };

  const simulate = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setResult(null);
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }
    setLoading(true);
    api
      .post(baseURLRegistration + `internal/sevasindhu-test/simulate-redirect`, data)
      .then((response) => {
        const content = response?.data?.content;
        if (content?.error) {
          setErrorMsg(content.error_description || t("Something went wrong. Please try again."));
        } else {
          setResult(content);
        }
      })
      .catch(() => {
        setErrorMsg(t("Something went wrong. Please try again."));
      })
      .finally(() => setLoading(false));
  };

  const reset = () => {
    setData({ mobileNumber: "", fruitsId: "", sevaSindhuReference: `SSAPP-TEST-${Date.now()}` });
    setResult(null);
    setErrorMsg("");
    setFieldErrors({});
  };

  return (
    <Layout title={t("Seva Sindhu Test Harness")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Seva Sindhu Test Harness")}</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n2">
        <div
          style={{
            background: "linear-gradient(135deg,#fff3cd,#ffe69c)",
            border: "1.5px solid #ffca2c",
            borderRadius: "10px",
            padding: "12px 18px",
            marginBottom: "18px",
            fontWeight: 700,
            color: "#664d03",
            fontSize: "13.5px",
          }}
        >
          ⚠️ {t("TEST ONLY — this page simulates the Seva Sindhu citizen redirect for internal testing. It is not connected to any real, external Seva Sindhu system.")}
        </div>

        <Card>
          <Card.Header>
            <Icon name="signup" /> <span>{t("Simulate Citizen Redirect")}</span>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={simulate}>
              <Row className="g-gs">
                <Col lg="4">
                  <Form.Group className="form-group">
                    <Form.Label>{t("Mobile Number")}</Form.Label>
                    <Form.Control
                      name="mobileNumber"
                      value={data.mobileNumber}
                      onChange={handleInputs}
                      maxLength={10}
                      placeholder={t("Enter Mobile Number")}
                      isInvalid={!!fieldErrors.mobileNumber}
                    />
                    <Form.Control.Feedback type="invalid">
                      {fieldErrors.mobileNumber}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="form-group">
                    <Form.Label>{t("FRUITS ID")}</Form.Label>
                    <Form.Control
                      name="fruitsId"
                      value={data.fruitsId}
                      onChange={handleInputs}
                      maxLength={16}
                      placeholder={t("Enter FRUITS ID")}
                      isInvalid={!!fieldErrors.fruitsId}
                    />
                    <Form.Control.Feedback type="invalid">
                      {fieldErrors.fruitsId}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col lg="4">
                  <Form.Group className="form-group">
                    <Form.Label>{t("Seva Sindhu Reference")}</Form.Label>
                    <Form.Control
                      name="sevaSindhuReference"
                      value={data.sevaSindhuReference}
                      onChange={handleInputs}
                      isInvalid={!!fieldErrors.sevaSindhuReference}
                    />
                    <Form.Control.Feedback type="invalid">
                      {fieldErrors.sevaSindhuReference}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              {errorMsg && (
                <div className="text-danger mt-2" style={{ fontSize: "13px", fontWeight: 600 }}>
                  {errorMsg}
                </div>
              )}
              <div className="mt-3 d-flex gap-2">
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" /> {t("Simulating...")}
                    </>
                  ) : (
                    <>
                      <Icon name="play" /> {t("Simulate")}
                    </>
                  )}
                </Button>
                <Button type="button" variant="secondary" onClick={reset}>
                  {t("Reset")}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>

        {result && (
          <Card className="mt-3">
            <Card.Header>
              <Icon name="info" /> <span>{t("Result")}</span>
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                <Col md="4">
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#5a6a7e", textTransform: "uppercase" }}>
                    {t("Farmer Registered")}
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: result.farmerRegistered ? "#1f7a36" : "#c47a00" }}>
                    {result.farmerRegistered ? t("Yes") : t("No")}
                  </div>
                </Col>
                <Col md="4">
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#5a6a7e", textTransform: "uppercase" }}>
                    {t("Next Action")}
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "#1e67a8" }}>{result.nextAction}</div>
                </Col>
                {result.farmerRegistered && (
                  <>
                    <Col md="4">
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "#5a6a7e", textTransform: "uppercase" }}>
                        {t("Farmer")}
                      </div>
                      <div style={{ fontSize: "15px", fontWeight: 600 }}>
                        {result.farmerName} (ID: {result.farmerId})
                      </div>
                    </Col>
                    <Col md="12">
                      <Link to="/seriui/farmer-wise-report" className="btn btn-primary btn-sm">
                        <Icon name="arrow-long-right" /> {t("Continue: View Farmer / Start Application")}
                      </Link>
                    </Col>
                  </>
                )}
                {!result.farmerRegistered && (
                  <>
                    {result.fruitsLookupAttempted && (
                      <Col md="12">
                        <div style={{ fontSize: "11px", fontWeight: 700, color: "#5a6a7e", textTransform: "uppercase" }}>
                          {t("FRUITS Lookup")}
                        </div>
                        <div style={{ fontSize: "13.5px" }}>
                          {result.fruitsLookupSuccess
                            ? t("Found: {{name}}", { name: result.fruitsLookupFarmerName })
                            : t("Not available: {{message}}", { message: result.fruitsLookupMessage || t("no response") })}
                        </div>
                      </Col>
                    )}
                    <Col md="12">
                      <Link to="/seriui/stake-holder-registration" className="btn btn-primary btn-sm">
                        <Icon name="arrow-long-right" /> {t("Continue: Farmer Registration")}
                      </Link>
                    </Col>
                  </>
                )}
              </Row>
            </Card.Body>
          </Card>
        )}
      </Block>
    </Layout>
  );
}

export default SevaSindhuTestHarness;
