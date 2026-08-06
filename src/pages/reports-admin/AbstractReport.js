// import { Card, Form, Row, Col, Button } from "react-bootstrap";
// import { Link } from "react-router-dom";
// import Swal from "sweetalert2/src/sweetalert2.js";
// import { useNavigate } from "react-router-dom";
// import Layout from "../../layout/default";
// import Block from "../../components/Block/Block";
// import DatePicker from "react-datepicker";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import api from "../../services/auth/api";

// const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
// const baseURLReport = process.env.REACT_APP_API_BASE_URL_REPORT;

// function AbstractReport() {
//   const [data, setData] = useState({
//     marketId: localStorage.getItem("marketId"),
//     fromDate: new Date(),
//     toDate: new Date(),
//   });

//   const [validated, setValidated] = useState(false);

//   let name, value;
//   const handleInputs = (e) => {
//     name = e.target.name;
//     value = e.target.value;
//     setData({ ...data, [name]: value });
//   };

//   const handleFromDateChange = (date) => {
//     setData((prev) => ({ ...prev, fromDate: date }));
//   };

//   const handleToDateChange = (date) => {
//     setData((prev) => ({ ...prev, toDate: date }));
//   };

//   useEffect(() => {
//     handleFromDateChange(new Date());
//     handleToDateChange(new Date());
//   }, []);
//   // const _header = { "Content-Type": "application/json", accept: "*/*" };
//   // const _header = { "Content-Type": "application/json", accept: "*/*",  'Authorization': `Bearer ${localStorage.getItem("jwtToken")}`, "Access-Control-Allow-Origin": "*"};
//   const _header = {
//     "Content-Type": "application/json",
//     accept: "*/*",
//     Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
//   };

//   const postData = (event) => {
//     const { marketId,fromDate,toDate  } = data;
//     const fDate = new Date(fromDate);
//     const tDate = new Date(toDate);
//     const formattedFromDate =
//       fDate.getFullYear() +
//       "-" +
//       (fDate.getMonth() + 1).toString().padStart(2, "0") +
//       "-" +
//       fDate.getDate().toString().padStart(2, "0");

//     const formattedToDate =
//       tDate.getFullYear() +
//       "-" +
//       (tDate.getMonth() + 1).toString().padStart(2, "0") +
//       "-" +
//       tDate.getDate().toString().padStart(2, "0");
//     const form = event.currentTarget;
//     if (form.checkValidity() === false) {
//       event.preventDefault();
//       event.stopPropagation();
//       setValidated(true);
//     } else {
//       event.preventDefault();
//       // event.stopPropagation();
//       api
//         .post(
//           baseURLReport + `get-form-13-report`,
//           {
//             marketId: marketId,
//             fromDate: formattedFromDate,
//             toDate: formattedToDate,
//           },
//           {
//             responseType: "blob", //Force to receive data in a Blob Format
//           }
//         )
//         .then((response) => {
//           console.log(response.data.size);
//           if (response.data.size > 800) {
//             const file = new Blob([response.data], { type: "application/pdf" });
//             const fileURL = URL.createObjectURL(file);
//             window.open(fileURL);
//           } else {
//             Swal.fire({
//               icon: "warning",
//               title: "No Record Found",
//             });
//           }
//           //console.log("hello world", response.data);
//         })
//         .catch((err) => {
//           Swal.fire({
//             icon: "warning",
//             title: "No record found!!!",
//           });
//         });
//     }
//   };

//   const navigate = useNavigate();
//   const saveSuccess = () => {
//     Swal.fire({
//       icon: "success",
//       title: "Saved successfully",
//       // text: "You clicked the button!",
//     })
//   };
//   const saveError = () => {
//     Swal.fire({
//       icon: "error",
//       title: "Save attempt was not successful",
//       text: "Something went wrong!",
//     });
//   };
//   return (
//     <Layout title="Abstract Report">
//       <Block.Head>
//         <Block.HeadBetween>
//           <Block.HeadContent>
//             <Block.Title tag="h2">Abstract Report</Block.Title>
//           </Block.HeadContent>
//           <Block.HeadContent>
           
//           </Block.HeadContent>
//         </Block.HeadBetween>
//       </Block.Head>

//       <Block className="mt-n5">
//         {/* <Form action="#"> */}
//         <Form noValidate validated={validated} onSubmit={postData}>
//           <Row className="g-3 ">
//             <Card>
//               <Card.Body>
//                 {/* <h3>Farmers Details</h3> */}
//                 <Row className="g-gs">
//                   <Col lg="12">
//                     <Form.Group as={Row} className="form-group">                    
//                       <Form.Label column sm={1}>
//                         From Date
//                         <span className="text-danger">*</span>
//                       </Form.Label>
//                       <Col sm={2}>
//                         <div className="form-control-wrap">
//                           <DatePicker
//                             dateFormat="dd/MM/yyyy"
//                             selected={data.fromDate}
//                             onChange={handleFromDateChange}
//                             className="form-control"
//                             maxDate={new Date()}
//                           />
//                         </div>
//                       </Col>
//                       <Form.Label column sm={1}>
//                         To Date
//                         <span className="text-danger">*</span>
//                       </Form.Label>
//                       <Col sm={2}>
//                         <div className="form-control-wrap">
//                           <DatePicker
//                             dateFormat="dd/MM/yyyy"
//                             selected={data.toDate}
//                             onChange={handleToDateChange}
//                             className="form-control"
//                             maxDate={new Date()}
//                           />
//                         </div>
//                       </Col>
//                       <Col sm={2}>
                       
//                         <Button type="submit" variant="primary">
//                           Generate Report
//                         </Button>
//                       </Col>
//                     </Form.Group>
//                   </Col> 
//                 </Row>
//               </Card.Body>
//             </Card>
//           </Row>
//         </Form>
//       </Block>
//     </Layout>
//   );
// }

// export default AbstractReport;

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
import { useTranslation } from 'react-i18next'; // Import useTranslation

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLReport = process.env.REACT_APP_API_BASE_URL_REPORT;

function AbstractReport() {
  const { t } = useTranslation(); // Initialize useTranslation
  const [data, setData] = useState({
    marketId: localStorage.getItem("marketId"),
    fromDate: new Date(),
    toDate: new Date(),
    raceId:"",
  });

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const handleFromDateChange = (date) => {
    setData((prev) => ({ ...prev, fromDate: date }));
  };

  const handleToDateChange = (date) => {
    setData((prev) => ({ ...prev, toDate: date }));
  };

  useEffect(() => {
    handleFromDateChange(new Date());
    handleToDateChange(new Date());
  }, []);
  // const _header = { "Content-Type": "application/json", accept: "*/*" };
  // const _header = { "Content-Type": "application/json", accept: "*/*",  'Authorization': `Bearer ${localStorage.getItem("jwtToken")}`, "Access-Control-Allow-Origin": "*"};
  const _header = {
    "Content-Type": "application/json",
    accept: "*/*",
    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
  };

// to get Race
const [raceListData, setRaceListData] = useState([]);

const getRaceList = () => {
  const response = api
    .get(baseURL + `raceMaster/get-all`)
    .then((response) => {
      setRaceListData(response.data.content.raceMaster);
    })
    .catch((err) => {
      setRaceListData([]);
    });
};

useEffect(() => {
  getRaceList();
}, []);

  const postData = (event) => {
    const { marketId,fromDate,toDate,raceId } = data;
    const fDate = new Date(fromDate);
    const tDate = new Date(toDate);
    const formattedFromDate =
      fDate.getFullYear() +
      "-" +
      (fDate.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      fDate.getDate().toString().padStart(2, "0");

    const formattedToDate =
      tDate.getFullYear() +
      "-" +
      (tDate.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      tDate.getDate().toString().padStart(2, "0");
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      // event.stopPropagation();
      api
        .post(
          baseURLReport + `get-form-13-report`,
          {
            marketId: marketId,
            fromDate: formattedFromDate,
            toDate: formattedToDate,
            raceId: raceId,
          },
          {
            responseType: "blob", //Force to receive data in a Blob Format
          }
        )
        .then((response) => {
          console.log(response.data.size);
          if (response.data.size > 800) {
            const file = new Blob([response.data], { type: "application/pdf" });
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL);
          } else {
            Swal.fire({
              icon: "warning",
              title: t("No Record Found"),
            });
          }
          //console.log("hello world", response.data);
        })
        .catch((err) => {
          Swal.fire({
            icon: "warning",
            title: t("No record found!!!"),
          });
        });
    }
  };

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: t("Saved successfully"),
    })
  };
  const saveError = () => {
    Swal.fire({
      icon: "error",
      title: t("Save attempt was not successful"),
      text: t("Something went wrong!"),
    });
  };
  return (
    <Layout title={t("Abstract Report")}>
      <style>{abstractReportStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("Abstract Report")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>

            </Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        {/* <Form action="#"> */}
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 ">
            <Card>
              <Card.Body>
                {/* <h3>Farmers Details</h3> */}
                <Row className="g-gs">
                  <Col lg="12">
                  
                  <Form.Group as={Row} className="form-group">                    
    <Form.Label column sm={1} style={{ fontWeight: "bold" }}>{t("Race")}</Form.Label>
    <Col>
        <Form.Select
            name="raceId"
            value={data.raceId}
            onChange={handleInputs}
            onBlur={() => handleInputs}
            // Removed required attribute
            // required
            // Removed validation for raceId being undefined or "0"
            isInvalid={false}
        >
            <option value="">{t("Select Race")}</option>
            {raceListData.map((list) => (
                <option
                    key={list.raceMasterId}
                    value={list.raceMasterId}
                >
                    {list.raceMasterName}
                </option>
            ))}
        </Form.Select>
        {/* Removed validation feedback */}
        {/* <Form.Control.Feedback type="invalid">
            Race is required
        </Form.Control.Feedback> */}
    </Col>
{/* </Form.Group> */}
      
                      <Form.Label column sm={1}>
                        {t("From Date")}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={2}>
                        <div className="form-control-wrap">
                          <DatePicker
                            dateFormat="dd/MM/yyyy"
                            selected={data.fromDate}
                            onChange={handleFromDateChange}
                            className="form-control"
                            maxDate={new Date()}
                          />
                        </div>
                      </Col>
                      <Form.Label column sm={1}>
                        {t("To Date")}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={2}>
                        <div className="form-control-wrap">
                          <DatePicker
                            dateFormat="dd/MM/yyyy"
                            selected={data.toDate}
                            onChange={handleToDateChange}
                            className="form-control"
                            maxDate={new Date()}
                          />
                        </div>
                      </Col>
                      <Col sm={2}>
                       
                        <Button type="submit" variant="primary">
                          {t("Generate Report")}
                        </Button>
                      </Col>
                    </Form.Group>
                  </Col> 
                </Row>
              </Card.Body>
            </Card>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

const abstractReportStyles = `
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
  }
`;

export default AbstractReport;

