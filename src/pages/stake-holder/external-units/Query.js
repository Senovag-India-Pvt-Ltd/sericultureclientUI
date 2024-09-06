// import { Card, Form, Row, Col, Button } from "react-bootstrap";
// import { Link } from "react-router-dom";
// import Layout from "../../../layout/default";
// import Block from "../../../components/Block/Block";
// import { useState, useEffect } from "react";
// // import axios from "axios";
// import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";
// import { Icon, Select } from "../../../components";
// import api from "../../../../src/services/auth/api";

// const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
// const baseURL2 = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

// function Query() {
//   const [data, setData] = useState({
//     queryName: "",
//   });

//   const [validated, setValidated] = useState(false);

//   let name, value;
//   const handleInputs = (e) => {
//     // debugger;
//     name = e.target.name;
//     value = e.target.value;
//     setData({ ...data, [name]: value });
//   };
//   const _header = { "Content-Type": "application/json", accept: "*/*" };

//   const postData = (event) => {
//     const form = event.currentTarget;
//     if (form.checkValidity() === false) {
//       event.preventDefault();
//       event.stopPropagation();
//       setValidated(true);
//     } else {
//       event.preventDefault();
//       // event.stopPropagation();
//       api
//         .post(baseURL + `query/add`, data)
//         .then((response) => {
//           if (response.data.content.error) {
//             saveError(response.data.content.error_description);
//           } else {
//           saveSuccess();
//           setData({
//             queryName: "",
//           });
//           setValidated(false);
//           }
//         })
//         .catch((err) => {
//           if (Object.keys(err.response.data.validationErrors).length > 0) {
//             saveError(err.response.data.validationErrors);
//           }
//         });
//       setValidated(true);
//     }
//   };

//   const clear = () => {
//     setData({
//         queryName: "",
//     });
//   };

  

//   const navigate = useNavigate();
//   const saveSuccess = () => {
//     Swal.fire({
//       icon: "success",
//       title: "Saved successfully",
//       // text: "You clicked the button!",
//     })
//   };
//   const saveError = (message) => {
//     let errorMessage;
//     if (typeof message === "object") {
//       errorMessage = Object.values(message).join("<br>");
//     } else {
//       errorMessage = message;
//     }
//     Swal.fire({
//       icon: "error",
//       title: "Save attempt was not successful",
//       html: errorMessage,
//     });
//   };

//   return (
//     <Layout title="Query">
//       <Block.Head>
//         <Block.HeadBetween>
//           <Block.HeadContent>
//             <Block.Title tag="h2">
//               Query
//             </Block.Title>
//           </Block.HeadContent>
//           <Block.HeadContent>
//             <ul className="d-flex">
//               <li>
//                 {/* <Link
//                   to="/seriui/external-unit-registration-list"
//                   className="btn btn-primary btn-md d-md-none"
//                 >
//                   <Icon name="arrow-long-left" />
//                   <span>Go to List</span>
//                 </Link> */}
//               </li>
//               <li>
//                 {/* <Link
//                   to="/seriui/external-unit-registration-list"
//                   className="btn btn-primary d-none d-md-inline-flex"
//                 >
//                   <Icon name="arrow-long-left" />
//                   <span>Go to List</span>
//                 </Link> */}
//               </li>
//             </ul>
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
                  

//                   <Col lg="6">
                    

                    
//                     <Form.Group className="form-group">
//                         <Form.Label htmlFor="queryName">
//                           Query<span className="text-danger">*</span>
//                         </Form.Label>
//                         <div className="form-control-wrap">
//                           <Form.Control
//                             as="textarea"
//                             id="queryName"
//                             name="queryName"
//                             value={data.queryName}
//                             onChange={handleInputs}
//                             type="text"
//                             placeholder="Enter Query"
//                             rows="2"
//                             required
//                           />
//                           <Form.Control.Feedback type="invalid">
//                             Query is required
//                           </Form.Control.Feedback>
//                         </div>
//                       </Form.Group>

                    
                    
//                   </Col>
//                 </Row>
//               </Card.Body>
//             </Card>

//             <div className="gap-col">
//               <ul className="d-flex align-items-center justify-content-center gap g-3">
//                 <li>
//                   {/* <Button type="button" variant="primary" onClick={postData}> */}
//                   <Button type="submit" variant="primary">
//                     Execute
//                   </Button>
//                 </li>
//                 <li>
//                 <Button type="button" variant="secondary" onClick={clear}>
//                     Clear
//                   </Button>
//                 </li>
//               </ul>
//             </div>
//           </Row>
//         </Form>
//       </Block>
//     </Layout>
//   );
// }

// export default Query;

import { Card, Form, Row, Col, Button } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useState } from "react";
import Swal from "sweetalert2";
import api from "../../../../src/services/auth/api";
import { useNavigate } from "react-router-dom";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function Query() {
  const [data, setData] = useState({
    queryName: "",
  });

  const payload = {
    query: data.queryName,
  };
  const _params = { params: { query: payload.query } };
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();

  // Handling form inputs
  const handleInputs = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  // Handling form submission
  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();

      if (!data.queryName.toUpperCase().includes("WHERE")) {
        saveError("Error: Query must contain a WHERE clause.");
        return;
      }

      // Prepare request payload
      

      // API call to execute query
      api
        .post(baseURL + `query/execute`,{},_params)
        .then((response) => {
          saveSuccess(response.data);
          clear();
        })
        .catch((err) => {
          saveError(err.response?.data?.message || "Error executing query");
        });
    }
  };

  // Display success message
  const saveSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Query executed successfully",
      text: message,
    });
  };

  // Display error message
  const saveError = (message) => {
    Swal.fire({
      icon: "error",
      title: "Error",
      html: typeof message === "string" ? message : "An error occurred",
    });
  };

  // Clear form data
  const clear = () => {
    setData({ queryName: "" });
    setValidated(false);
  };

  return (
    <Layout title="Query">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Query</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n5">
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3">
            <Card>
              <Card.Body>
                <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="queryName">
                        Query<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          as="textarea"
                          id="queryName"
                          name="queryName"
                          value={data.queryName}
                          onChange={handleInputs}
                          placeholder="Enter SQL query with a WHERE clause"
                          rows="6"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Query is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  <Button type="submit" variant="primary">
                    Execute
                  </Button>
                </li>
                <li>
                  <Button type="button" variant="secondary" onClick={clear}>
                    Clear
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

export default Query;
