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

const baseURL = process.env.REACT_APP_API_BASE_URL_CHAWKI_MANAGEMENT;

function ChawkiManagement() {
  
  const [data, setData] = useState({
    farmerName: "",
    fatherName: "",
    fruitsId: "",
    dflsSource: "",
    raceOfDfls: "",
    numbersOfDfls: 0,
    lotNumberRsp: "",
    lotNumberCrc: "",
    village: "",
    district: "",
    state: "",
    tsc: "",
    soldAfter1stOr2ndMould: "",
    ratePer100Dfls: 0,
    price: 0,
    dispatchDate: ""
    
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
      .post(baseURL + `chowkimanagement/add-info`, data)
      .then((response) => {
        debugger;
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
      .get(baseURL+`chowkimanagement/get-info`)
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
    navigate(`/chawki-management-view/${_id}`);
  };


  const handleEdit = (_id) => {
    navigate(`/chawki-management-edit/${_id}`);
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
          .get(baseURL + `chowkimanagement/delete-info/${_id}`) 
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

 const ChawkiDataColumns = [
 
    {
      name: "Fruits ID",
      selector: (row) => row.fruitsId,
      cell: (row) => <span>{row.fruitsId}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Farmer's Name",
      selector: (row) => row.farmerName,
      cell: (row) => <span>{row.farmerName}</span>,
      sortable: true,
      hide: "md",
    },
     {
      name: "Source of DFLs",
      selector: (row) => row.dflsSource,
      cell: (row) => <span>{row.dflsSource}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Race of DFLs",
      selector: (row) => row.raceOfDfls,
      cell: (row) => <span>{row.raceOfDfls}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Race of DFLs",
      selector: (row) => row.raceOfDfls,
      cell: (row) => <span>{row.raceOfDfls}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Numbers Of DFLs",
      selector: (row) => row.numbersOfDfls,
      cell: (row) => <span>{row.numbersOfDfls}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Lot Number (of the RSP)",
      selector: (row) => row.lotNumberRsp,
      cell: (row) => <span>{row.lotNumberRsp}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Lot No. (CRC)",
      selector: (row) => row.lotNumberCrc,
      cell: (row) => <span>{row.lotNumberCrc}</span>,
      sortable: true,
      hide: "md",
    },
     {
      name: "Lot No. (CRC)",
      selector: (row) => row.lotNumberCrc,
      cell: (row) => <span>{row.lotNumberCrc}</span>,
      sortable: true,
      hide: "md",
    },
     {
      name: "Village",
      selector: (row) => row.village,
      cell: (row) => <span>{row.village}</span>,
      sortable: true,
      hide: "md",
    },
     {
      name: "District",
      selector: (row) => row.district,
      cell: (row) => <span>{row.district}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "State",
      selector: (row) => row.state,
      cell: (row) => <span>{row.state}</span>,
      sortable: true,
      hide: "md",
    },
     {
      name: "TSC",
      selector: (row) => row.tsc,
      cell: (row) => <span>{row.tsc}</span>,
      sortable: true,
      hide: "md",
    },
   {
      name: "Sold after 1st/2nd Moult",
      selector: (row) => row.soldAfter1stOr2ndMould,
      cell: (row) => <span>{row.soldAfter1stOr2ndMould}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Rate per 100 DFLs(optional)",
      selector: (row) => row.ratePer100Dfls,
      cell: (row) => <span>{row.ratePer100Dfls}</span>,
      sortable: true,
      hide: "md",
    },
    

    {
      name: "price",
      selector: (row) => row.price,
      cell: (row) => <span>{row.price}</span>,
      sortable: true,
      hide: "md",
    },

    
    {
      name: "Dispatch date",
      selector: (row) => row.dispatchDate,
      cell: (row) => <span>{row.dispatchDate}</span>,
      sortable: true,
      hide: "md",
    },

     {
      name: "Action",
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
          {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
           
          <Button
            variant="primary"
            size="sm"
            className="ms-2"
            onClick={() => handleEdit(row.chowki_id)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.chowki_id)}
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
   
  return (
    <Layout title="Chawki-Management">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Chawki-Management</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                {/* <li className="breadcrumb-item">
                  <Link to="#">Renew License to Reeler List</Link>
                </li> */}
                <li className="breadcrumb-item active" aria-current="page">
                 Chawki-Management
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/sale-chawki-worms-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/sale-chawki-worms-list"
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

      <Block className="mt-4">
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 "> 
            <div  >
              <Row className="g-gs">
                <Col lg="12">
                  <Block >
                    <Card>
                      <Card.Header> Create / Add Farmer </Card.Header>
                      <Card.Body>
                         <Row className="g-gs">
                        <Col lg="4" >
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="sordfl">
                              FRUITS-ID
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="fruitsId"
                                name="fruitsId"
                                value={data.fruitsId}
                                onChange={handleInputs}
                                type="text"
                                placeholder="FRUITS-ID"
                                required
                              />
                            </div>
                          </Form.Group>
                         </Col  > 
                         <Col lg="4" >
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="sordfl">
                             Lot No. (CRC)
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="lotNumberCrc"
                                name="lotNumberCrc"
                                value={data.lotNumberCrc}
                                onChange={handleInputs}
                                type="text"
                                placeholder="Lot No. (CRC)"
                                required
                                
                              />
                            </div>
                          </Form.Group>
                         </Col  >  

                         <Col lg="4" >
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="sordfl">
                             Price (in Rupees) (optional)
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="price"
                                name="price"
                                value={data.price}
                                onChange={handleInputs}
                                type="number"
                                placeholder=" Price (in Rupees) (optional)"
                                required
                              />
                            </div>
                          </Form.Group>
                         </Col  >  
 

                          <Col lg="4" >
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="sordfl">
                              Farmer’s name
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                 id="farmerName"
                                name="farmerName"
                                value={data.farmerName}
                                onChange={handleInputs}
                                type="text"
                                placeholder="Farmer’s name"
                                required
                              />
                            </div>
                          </Form.Group>
                         </Col  > 
                         <Col lg="4" >
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="sordfl">
                            Village
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                 id="village"
                                name="village"
                                value={data.village}
                                onChange={handleInputs}
                                type="text"
                                placeholder=" Village"
                                required
                              />
                            </div>
                          </Form.Group>
                         </Col  >  

                         <Col lg="4" >
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="sordfl">
                             Dispatch date
                            </Form.Label>
                            <div className="form-control-wrap">
                                                          </div>
                          </Form.Group>
                         </Col  > 


                         <Col lg="4" >
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="sordfl">
                              Father’s Name
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="fatherName"
                                name="fatherName"
                                value={data.fatherName}
                                onChange={handleInputs}
                                type="text"
                                placeholder=" fatherName"
                                required
                              />
                            </div>
                          </Form.Group>
                         </Col  > 
                         <Col lg="4" >
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="sordfl">
                             District
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="district"
                                name="district"
                                value={data.district}
                                onChange={handleInputs}
                                type="text"
                                placeholder=" District"
                                required
                              />
                            </div>
                          </Form.Group>
                         </Col  >  

                         <Col lg="4" >
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="sordfl">
                             Source of DFLs
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                               id="dflsSource"
                                name="dflsSource"
                                value={data.dflsSource}
                                onChange={handleInputs}
                                type="text"
                                placeholder=" District"
                                required
                              />
                            </div>
                          </Form.Group>
                         </Col  > 


                         <Col lg="4" >
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="sordfl">
                              State
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="state"
                                name="state"
                                value={data.state}
                                onChange={handleInputs}
                                type="text"
                                placeholder=" State"
                                required
                              />
                            </div>
                          </Form.Group>
                         </Col  > 
                         <Col lg="4" >
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="sordfl">
                            Race of DFLs
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="raceOfDfls"
                                name="raceOfDfls"
                                value={data.raceOfDfls}
                                onChange={handleInputs}
                                type="text"
                                placeholder=" Race of DFLs"
                                required
                              />
                            </div>
                          </Form.Group>
                         </Col  >  

                         <Col lg="4" >
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="sordfl">
                             TSC
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                               id="tsc"
                                name="tsc"
                                value={data.tsc}
                                onChange={handleInputs}
                                type="text"
                                placeholder="TSC"
                                required
                              />
                            </div>
                          </Form.Group>
                         </Col  >



                           <Col lg="4" >
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="sordfl">
                             Number of DFL’s
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                               id="numbersOfDfls"
                                name="numbersOfDfls"
                                value={data.numbersOfDfls}
                                onChange={handleInputs}
                                type="number"
                                placeholder=" Number of DFL’s"
                                required
                              />
                            </div>
                          </Form.Group>
                         </Col  > 
                         <Col lg="4" >
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="sordfl">
                           Sold after 1st/2nd Moult
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="soldAfter1stOr2ndMould"
                                name="soldAfter1stOr2ndMould"
                                value={data.soldAfter1stOr2ndMould}
                                onChange={handleInputs}
                                type="text"
                                placeholder=" Sold after 1st/2nd Moult"
                                required
                              />
                            </div>
                          </Form.Group>
                         </Col  >  

                         <Col lg="4" >
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="sordfl">
                            Lot Number (of the RSP)
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="lotNumberRsp"
                                name="lotNumberRsp"
                                value={data.lotNumberRsp}
                                onChange={handleInputs}
                                type="text"
                                placeholder="  Lot Number (of the RSP)"
                                required
                              />
                            </div>
                          </Form.Group>
                         </Col  >

                          <Col lg="4" >
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="sordfl">
                            Rate per 100 DFLs(optional)
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="ratePer100Dfls"
                                name="ratePer100Dfls"
                                value={data.ratePer100Dfls}
                                onChange={handleInputs}
                                type="number"
                                placeholder="    Rate per 100 DFLs(optional)"
                                required
                              />
                            </div>
                          </Form.Group>
                         </Col  >

                         <Col lg="12" className="text-center">
                        <Button type="submit" variant="primary" > Submit  </Button>  
                      </Col>
 
                      </Row>
                        
                      </Card.Body>
                    </Card>
                  </Block>
                </Col>
                <Col lg="12">
                <div> .</div>
                  
                      <Block className= "mt-n4">
        <Card>
          <DataTable
            tableClassName="data-table-head-light table-responsive"
            columns={ChawkiDataColumns}
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
            </div>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default ChawkiManagement;
