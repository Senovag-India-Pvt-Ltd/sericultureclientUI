import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2/src/sweetalert2.js";
import { useNavigate } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DatePicker from "react-datepicker";
import { useState, useEffect } from "react";
import axios from "axios";
import api from "../../services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLReport = process.env.REACT_APP_API_BASE_URL_REPORT;

function AverageReport() {
  const [data, setData] = useState({
    marketId: localStorage.getItem("marketId"),
    startYear: "",
    endYear: "",
  });
  console.log("printBid", data);

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const handleFromDateChange = (date) => {
    setData((prev) => ({ ...prev, startYear: date }));
  };

  const handleToDateChange = (date) => {
    setData((prev) => ({ ...prev, endYear: date }));
  };

  // useEffect(() => {
  //   handleFromDateChange(new Date());
  //   handleToDateChange();
  // }, []);
 
  const _header = {
    "Content-Type": "application/json",
    accept: "*/*",
    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
  };

 

  const exportCsv = (e) => {
    const { marketId, startYear, endYear } = data;
    const newDate = new Date();
    const formattedDate =
      startYear.getFullYear() +
      "-" +
      (startYear.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      startYear.getDate().toString().padStart(2, "0");
      const formattedEndDate =
      endYear.getFullYear() +
      "-" +
      (endYear.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      endYear.getDate().toString().padStart(2, "0");
    api
      .post(
        baseURLReport + `excel-report/average-report`,
        {
            // marketId: data.marketId,
            // startYear: data.startYear,
            // endYear: data.endYear,
            marketId: marketId,
            startYear: formattedDate,
            endYear: formattedEndDate,
          },
          {
          responseType: 'blob',
          headers: {
            accept: "application/csv",
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        const blob = new Blob([response.data], { type: "application/csv" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `average_report.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
      })
      .catch((err) => {
        Swal.fire({
          icon: "warning",
          title: "No record found!!!",
        });
      });
};

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    }).then(() => {
      navigate("/seriui/caste-list");
    });
  };
 
  return (
    <Layout title="Average Report">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Average Report</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
           
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n5">
        {/* <Form action="#"> */}
        {/* <Form noValidate validated={validated} onSubmit={postData}> */}
          <Row className="g-3 ">
            <Card>
              <Card.Body>
                {/* <h3>Farmers Details</h3> */}
                <Row className="g-gs">
                  <Col lg="12">
                    <Form.Group as={Row} className="form-group">
                      
                      <Form.Label column sm={1}>
                        Start Year
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={2}>
                        <div className="form-control-wrap">
                          <DatePicker
                            dateFormat="dd/MM/yyyy"
                            selected={data.startYear}
                            onChange={handleFromDateChange}
                            className="form-control"
                            // maxDate={new Date()}
                          />
                        </div>
                      </Col>
                      <Form.Label column sm={1}>
                        End Year
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={2}>
                        <div className="form-control-wrap">
                          <DatePicker
                            dateFormat="dd/MM/yyyy"
                            selected={data.endYear}
                            onChange={handleToDateChange}
                            className="form-control"
                            // maxDate={new Date()}
                          />
                        </div>
                      </Col>
                      <Col sm={2}>   
                        <Button type="button" variant="primary" onClick={exportCsv}>
                        Export
                    </Button>
                      </Col>
                    </Form.Group>
                  </Col>

                 
                </Row>
              </Card.Body>
            </Card>

           
          </Row>
        {/* </Form> */}
      </Block>
    </Layout>
  );
}

export default AverageReport;
