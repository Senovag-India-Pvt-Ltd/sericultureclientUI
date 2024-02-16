import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DatePicker from "../../components/Form/DatePicker";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import DataTable, { createTheme } from "react-data-table-component";

 import {
  Icon,
  Select,
} from "../../components";

import api from "../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;

function SupplyofCocoonstoGrainage() {
 

   const [data, setData] = useState({
    id:"",
    lotNumber: "",
    raceOfCocoons: "",
    spunOnDate:"",
    numberOfCocoonsDispatched: "",
    generationDetails: "",
    dispatchDate: "",
    generateInvoice: "", 
     viewReciept: "", 
    
  });

  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width:"20%",
    },
  };

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const _header = {
    "Content-Type": "application/json",
    accept: "*/*",
    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
  };

  const postData = (event) =>{
  const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      
      event.preventDefault();
      // event.stopPropagation();
    api
      .post(baseURL + `supply-cocoons/add-info`, data)
      .then((response) => {

        if(response.data.error){
          saveError();
        }else{
          saveSuccess();
        }
      })
      .catch((err) => {
        setData({});
        saveError();
      });
      setValidated(true);
    }
  };

   




/* get table detais */




 const [listData, setListData] = useState([]);
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };



const getList = () => {
    setLoading(true);

    const response = api
      .get(baseURL+`supply-cocoons/get-info`)
      .then((response) => {
        console.log(response.data)
        setListData(response.data);
        // setTotalRows(response.data.content.totalItems);
        setLoading(false);
      })
      .catch((err) => {
        // setListData({});
        setLoading(false);
      });

    // axios
    //   .get(baseURL + `caste/list`, _params , {
    //     headers: _header,
    //   })
    //   .then((response) => {
    //     setListData(response.data.content.caste);
    //     setTotalRows(response.data.content.totalItems);
    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     setListData({});
    //     setLoading(false);
    //   });
  };

 useEffect(() => {
    getList();
  }, []);

createTheme(
    "solarized",
    {
      text: {
        primary: "#004b8e",
        secondary: "#2aa198",
      },
      background: {
        default: "#fff",
      }, 
      context: {
        background: "#cb4b16",
        text: "#FFFFFF",
      },
      divider: {
        default: "#d3d3d3",
      },
      action: {
        button: "rgba(0,0,0,.54)",
        hover: "rgba(0,0,0,.02)",
        disabled: "rgba(0,0,0,.12)",
      },
    },
    "light"
  );

const customStyles = {
    rows: {
      style: {
        minHeight: "45px", // override the row height
      },
    },
    headCells: {
      style: {
        backgroundColor: "#1e67a8",
        color: "#fff",
        fontSize: "14px",
        paddingLeft: "8px", // override the cell padding for head cells
        paddingRight: "8px",
      },
    },
    cells: {
      style: {
        paddingLeft: "8px", // override the cell padding for data cells
        paddingRight: "8px",
      },
    },
  };


   
  const handleView = (_id) => {
    navigate(`/SupplyofCocoonstoGrainage-view/${_id}`);
  };


  const handleEdit = (_id) => {
    navigate(`/SupplyofCocoonstoGrainage-edit/${_id}`);
    // navigate("/state");
  };

  

 const deleteError = () => {
    Swal.fire({
      icon: "error",
      title: "Delete attempt was not successful",
      text: "Something went wrong!",
    });
  };

  const deleteConfirm = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "It will delete permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        console.log("hello");
        const response = api
          .delete(baseURL + `supply-cocoons/delete-info/${_id}`)
          .then((response) => {
            // deleteConfirm(_id);
            getList();
            Swal.fire(
              "Deleted",
              "You successfully deleted this record",
              "success"
            );
          })
          .catch((err) => {
            deleteError();
          });
        // Swal.fire("Deleted", "You successfully deleted this record", "success");
      } else {
        console.log(result.value);
        Swal.fire("Cancelled", "Your record is not deleted", "info");
      }
    });
  };
 const GardenDataColumns = [
 

    {
      name: "lot Number",
      selector: (row) => row.lotNumber,
      cell: (row) => <span>{row.lotNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Race Of Cocoons",
      selector: (row) => row.raceOfCocoons,
      cell: (row) => <span>{row.raceOfCocoons}</span>,
      sortable: true,
      hide: "md",
    },
     {
      name: "Spun On Date",
      selector: (row) => row.spunOnDate,
      cell: (row) => <span>{row.spunOnDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Number Of Cocoons Dispatched",
      selector: (row) => row.numberOfCocoonsDispatched,
      cell: (row) => <span>{row.numberOfCocoonsDispatched}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Generation Details",
      selector: (row) => row.generationDetails,
      cell: (row) => <span>{row.generationDetails}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Dispatch Date",
      selector: (row) => row.dispatchDate,
      cell: (row) => <span>{row.dispatchDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Generate Invoice",
      selector: (row) => row.generateInvoice,
      cell: (row) => <span>{row.generateInvoice}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "View Reciept",
      selector: (row) => row.viewReciept,
      cell: (row) => <span>{row.viewReciept}</span>,
      sortable: true,
      hide: "md",
    },
     
    
      

     {
      name: "Action",
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
          {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
          {/*<Button
            variant="primary"
            size="sm"
            onClick={() => handleView(row.id)}
          >
            View
          </Button>*/}
          <Button
            variant="primary"
            size="sm"
            className="ms-2"
            onClick={() => handleEdit(row.id)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.id)}
            className="ms-2"
          >
            Delete
          </Button>
        </div>
      ),
      sortable: false,
      hide: "md",
    },

   



  ];
   

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    }).then(() => {
      // navigate("/caste-list");
    });
  };
  const saveError = () => {
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      text: "Something went wrong!",
    });
  };


const handleDateChange = (date, type) => {
  setData({ ...data, [type]: date });
};


  
  return (
    <Layout title="Supply of Cocoons to Grainage ">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Supply of Cocoons to Grainage</Block.Title>
           
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="#"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="#"
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
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 "> 
            <div  >
              <Row className="g-gs">
                <Col lg="12">
                  <Block >
                    <Card>
                      <Card.Header>Supply of Cocoons to Grainage </Card.Header>
                      <Card.Body>
                         <Row className="g-gs">
                        <Col lg="4" >
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="sordfl">
                             Lot Number
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="lotNumber"
                                name="lotNumber"
                                value={data.lotNumber}
                                onChange={handleInputs}
                                type="text"
                                placeholder="Lot Number "
                                required
                              />
                            </div>
                          </Form.Group>
                         </Col  > 
                         <Col lg="4" >
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="sordfl">
                        Race of Cocoons
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                 id="raceOfCocoons"
                                name="raceOfCocoons"
                                value={data.raceOfCocoons}
                                onChange={handleInputs}
                                 type="text"
                                placeholder="Race of Cocoons"
                              />
                            </div>
                          </Form.Group>
                         </Col  > 

                            <Col lg="4" >
                          <Form.Group className="form-group">
                               <Form.Label htmlFor="sordfl">
                            
                           Spun on date
                            </Form.Label>
                            <div className="form-control-wrap"> 
                              <DatePicker
                          selected={data.spunOnDate}
                          onChange={(date) => handleDateChange(date, "spunOnDate")}
                          peekNextMonth
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          dateFormat="dd/MM/yyyy"
                          className="form-control"

                        
                        />
                        </div>
                          </Form.Group>
                         </Col  >  

                         <Col lg="4" >
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="sordfl">
                           Number of Cocoons Dispatched
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                  id="numberOfCocoonsDispatched"
                                name="numberOfCocoonsDispatched"
                                value={data.numberOfCocoonsDispatched}
                                onChange={handleInputs}
                                 type="text"
                                placeholder="Number of Cocoons Dispatched"
                              />
                            </div>
                          </Form.Group>
                         </Col  >  
 

                          <Col lg="4" >
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="sordfl">
                            Generation details
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                 id="generationDetails"
                                name="generationDetails"
                                value={data.generationDetails}
                                onChange={handleInputs}
                                 type="text"
                                placeholder="Generation details"
                              />
                            </div>
                          </Form.Group>
                         </Col  > 
                         <Col lg="4" >
                          <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                            Dispatch Date
                            </Form.Label>
                            <div className="form-control-wrap">
                              <DatePicker
                          selected={data.dispatchDate}
                          onChange={(date) => handleDateChange(date, "dispatchDate")}
                          peekNextMonth
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          dateFormat="dd/MM/yyyy"
                          className="form-control"
                        />
                            </div>

                              

                          </Form.Group>
                         </Col  > 


                        

                         <Col lg="4" >
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="sordfl">
                           Genarate Invoice
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                  id="generateInvoice"
                                name="generateInvoice"
                                value={data.generateInvoice}
                                onChange={handleInputs}
                                 type="text"
                                placeholder="Genarate Invoice"
                              />
                            </div>
                          </Form.Group>
                         </Col  > 

                             <Col lg="4" >
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="sordfl">
                          View Reciept
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                 id="viewReciept"
                                name="viewReciept"
                                value={data.viewReciept}
                                onChange={handleInputs}
                                 type="text"
                                placeholder="View Reciept"
                              />
                            </div>
                          </Form.Group>
                         </Col  > 
                        

                         <Col lg="12" className="text-center">
                        <Button type="submit" variant="primary">
                           Save
                      </Button>
                      </Col>
 
                      </Row>
                        
                      </Card.Body>
                    </Card>
                  </Block>
                </Col>
                <Col lg="12">
                  <Card>
                    <Card.Body>
                      {/* <h3>Farmers Details</h3> */}
                      <Row className="g-gs">
                          <Col lg="12">
                           
                            
   <Block className= "mt-n4 m-4">
        <Card>
          <DataTable
            tableClassName="data-table-head-light table-responsive"
            columns={GardenDataColumns}
            data={listData}
            highlightOnHover
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            paginationPerPage={countPerPage}
            paginationComponentOptions={{
              noRowsPerPage: true,
            }}
            onChangePage={(page) => setPage(page - 1)}
            progressPending={loading}
            theme="solarized"
            customStyles={customStyles}
          />
        </Card>
      </Block>


                          
                          </Col>
                        </Row>
                       
                      

                    </Card.Body>
                  </Card>
                 
                
                 


                </Col>
              </Row>
            </div>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default SupplyofCocoonstoGrainage;
