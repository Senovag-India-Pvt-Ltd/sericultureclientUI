import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Icon } from "../../../components";
import { useState, useEffect } from "react";
import axios from "axios";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function MulberryTargetTypeEdit() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const [validated, setValidated] = useState(false);

  let name, value;
  // const handleInputs = (e) => {
  //   name = e.target.name;
  //   value = e.target.value;
  //   setData({ ...data, [name]: value });
  // };

//   const handleInputs = (e) => {
//   const { name, type, checked, value } = e.target;
//   setData({ ...data, [name]: type === "checkbox" ? checked : value });
// };

const handleInputs = (e) => {
  const { name, type, checked, value } = e.target;
  setData({ ...data, [name]: type === "checkbox" ? checked : value });
};


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
      api
        .post(baseURL + `mulberryTargetType/edit`, data)
        .then((response) => {
          if (response.data.content.error) {
            updateError(response.data.content.error_description);
          } else {
            updateSuccess();
            setData({
              mulberryTargetTypeName: "",
              mulberryTargetTypeNameInKannada: "",
              unit:"",
              mulberryRequired: false, 
            });
            setValidated(false);
          }
        })
        .catch((err) => {
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            updateError(err.response.data.validationErrors);
          }
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
      mulberryTargetTypeName: "",
      mulberryTargetTypeNameInKannada: "",
      unit:"",
      mulberryRequired: false,
    });
  };

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `mulberryTargetType/get/${id}`)
      .then((response) => {
        setData(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        const message = err.response.data.errorMessages[0].message[0].message;
        setData({});
        editError(message);
        setLoading(false);
      });
  };

  useEffect(() => {
    getIdList();
  }, [id]);

  const navigate = useNavigate();
  const updateSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Updated successfully",
      // text: "You clicked the button!",
    })
    .then(() =>getIdList());
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
    })
    // .then(() => navigate("/seriui/mulberry-target-type-list"));
  };
const [datas, setDatas] = useState({ unit: "", id: 123 });
const [isSaved, setIsSaved] = useState(false);

// const handleInputss = (e) => {
//   const { name, value } = e.target;
//   setData({ ...data, [name]: value });
// };

useEffect(() => {
  if (id) {
    setLoading(true);
    fetch(`/api/mulberryTargetType/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }

        const text = await res.text(); // read as text
        if (!text) {
          throw new Error("Empty response");
        }

        const result = JSON.parse(text); // manually parse
        setData(result);

        if (result.unit && result.unit.trim() !== "") {
          setIsSaved(true); // mark read-only only if already saved
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      })
      .finally(() => setLoading(false));
  }
}, [id]);


const handleSave = () => {
  if (data.unit.trim() === "") {
    alert("Please enter unit.");
    return;
  }

  fetch(`/api/mulberryTargetType/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then(() => {
      setIsSaved(true); // Read-only after save
      alert("Saved successfully");
    });
};


  return (
    <Layout title="Edit Mulberry Target Type">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Edit Mulberry Target Type</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/mulberry-target-type-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/mulberry-target-type-list"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n5">
        {/* <Form action="#"> */}
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 ">
            <Card>
              <Card.Body>
                {loading ? (
                  <h1 className="d-flex justify-content-center align-items-center">
                    Loading...
                  </h1>
                ) : (
                  <Row className="g-gs">
                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="mulberryVariety">
                          Mulberry Target Type<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="Mulberry Target Type"
                            name="mulberryTargetTypeName"
                            value={data.mulberryTargetTypeName}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Mulberry Target Type"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Mulberry Target Type is required.
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="variety">
                          Mulberry Target Type Name in Kannada
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="variety"
                            name="mulberryTargetTypeNameInKannada"
                            type="text"
                            value={data.mulberryTargetTypeNameInKannada}
                            onChange={handleInputs}
                            placeholder="Enter Mulberry Target Type Name in Kannada"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Mulberry Target Type Name in Kannada is required.
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                  
  <Col lg="6">
  <Form.Group className="form-group">
    <Form.Label htmlFor="unit">
      Unit
      {/* Removed mandatory asterisk */}
    </Form.Label>
    <div className="form-control-wrap">
      <Form.Control
        id="unit"
        name="unit"
        value={data.unit}
        onChange={handleInputs}
        type="text"
        placeholder="Enter Unit"
        // removed required attribute
      />
      {/* Optional: remove or uncomment the feedback below if validation is needed */}
      {/* <Form.Control.Feedback type="invalid">
        Unit is required.
      </Form.Control.Feedback> */}
    </div>
  </Form.Group>
</Col>


{/* <Col lg="6">
  <Form.Group className="form-group">
    <Form.Label htmlFor="unit">Unit</Form.Label>
    <div className="form-control-wrap">
      <Form.Control
        id="unit"
        name="unit"
        type="text"
        value={data.unit || ""}
        onChange={handleInputs}
        placeholder="Enter Unit"
        readOnly={isSaved} // read-only if value already saved
      />
    </div>
  </Form.Group>
</Col> */}





                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Check
                          type="checkbox"
                          name="mulberryRequired"
                          id="mulberryRequired"
                          label="True"
                          checked={data.mulberryRequired}
                          onChange={handleInputs}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                )}
              </Card.Body>
            </Card>

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
    </Layout>
  );
}

export default MulberryTargetTypeEdit;
