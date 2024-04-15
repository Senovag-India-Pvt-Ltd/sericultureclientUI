import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2/src/sweetalert2.js";
import { useNavigate } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import { useState,useEffect } from "react";
import DatePicker from "react-datepicker";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function BudgetHoa() {
  const [data, setData] = useState({
    financialYearMasterId: "",
    hoaId: "",
    date: "",
    budgetAmount: "",
  });

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };
  // const _header = { "Content-Type": "application/json", accept: "*/*" };
  // const _header = { "Content-Type": "application/json", accept: "*/*",  'Authorization': `Bearer ${localStorage.getItem("jwtToken")}`, "Access-Control-Allow-Origin": "*"};
  const _header = {
    "Content-Type": "application/json",
    accept: "*/*",
    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
  };

  

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
        .post(baseURL + `tsBudgetHoa/add`, data)
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
            setData({
              financialYearMasterId: "",
              hoaId: "",
              date: "",
              budgetAmount: "",
            });
            setValidated(false);
          }
        })
        .catch((err) => {
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            saveError(err.response.data.validationErrors);
          }
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
      financialYearMasterId: "",
      hoaId: "",
      date: "",
      budgetAmount: "",
    });
  };
  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };
 
   // to get Financial Year
   const [financialYearListData, setFinancialYearListData] = useState([]);

   const getFinancialYearList = () => {
     const response = api
       .get(baseURL + `financialYearMaster/get-all`)
       .then((response) => {
         setFinancialYearListData(response.data.content.financialYearMaster);
       })
       .catch((err) => {
         setFinancialYearListData([]);
       });
   };
 
   useEffect(() => {
     getFinancialYearList();
   }, []);
 
    // to get Head Of Account
    const [headOfAccountListData, setHeadOfAccountListData] = useState([]);
 
    const getHeadOfAccountList = () => {
      const response = api
        .get(baseURL + `scHeadAccount/get-all`)
        .then((response) => {
          setHeadOfAccountListData(response.data.content.scHeadAccount);
        })
        .catch((err) => {
         setHeadOfAccountListData([]);
        });
    };
  
    useEffect(() => {
      getHeadOfAccountList();
    }, []);

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
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
      title: "Save attempt was not successful",
      html: errorMessage,
    });
  };
  return (
    <Layout title="Budget To Head Of Account">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Budget To Head Of Account</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/budget-hoa-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/budget-hoa-list"
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

      <Block className="mt-n4">
        {/* <Form action="#"> */}
        <Form noValidate validated={validated} onSubmit={postData}>
            <Card>
              
              <Card.Header style={{ fontWeight: "bold" }}>
              Hoa Budget
            </Card.Header>
            <Card.Body>
                <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        Financial Year<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="financialYearMasterId"
                          value={data.financialYearMasterId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.financialYearMasterId === undefined || data.financialYearMasterId === "0"
                          }
                        >
                          <option value="">Select Financial Year</option>
                          {financialYearListData.map((list) => (
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
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        Head Of Account<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="hoaId"
                          value={data.hoaId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.hoaId === undefined || data.hoaId === "0"
                          }
                        >
                          <option value="">Select Head Of Account</option>
                          {headOfAccountListData.map((list) => (
                          <option
                            key={list.scHeadAccountId}
                            value={list.scHeadAccountId}
                          >
                            {list.scHeadAccountName}
                          </option>
                        ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Head Of Account is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-n4 ">
                      <Form.Label htmlFor="title">
                        Budget Amount<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="budgetAmount"
                          name="budgetAmount"
                          value={data.budgetAmount}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Budget Amount"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Budget Amount is required.
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>Date<span className="text-danger">*</span></Form.Label>
                        <div className="form-control-wrap">
                         
                          <DatePicker
                            selected={data.date}
                            onChange={(date) =>
                              handleDateChange(date, "date")
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            required
                          />
                        </div>
                        </Form.Group>
                          <Form.Control.Feedback type="invalid">
                         Date is Required
                      </Form.Control.Feedback>
                        </Col>
                </Row>
              </Card.Body>
            </Card>

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
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
            </div>
        </Form>
      </Block>
    </Layout>
  );
}

export default BudgetHoa;
