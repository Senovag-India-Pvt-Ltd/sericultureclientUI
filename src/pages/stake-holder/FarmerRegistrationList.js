import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { createTheme } from "react-data-table-component";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import React from "react";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function FarmerRegistrationList() {
  const [listData, setListData] = useState({});
  const [listFarmerData, setListFarmerData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };

  const [isActive, setIsActive] = useState(false);

  const [data, setData] = useState({
    districtId: "",
    talukId: "",
    villageId: "",
    tscMasterId: "",
  });

  const [hobliData, setHobliData] = useState({
    hobliId: "",
  });


  // Search
  const search = (e) => {
    api
      .post(
        baseURLFarmer + `farmer/primaryFarmerDetails`,
        {},
        {
          params: {
            districtId: data.districtId,
            talukId: data.talukId,
            villageId: data.villageId,
            tscMasterId: data.tscMasterId,
          },
        }
      )
      .then((response) => {
        setListData(response.data.content);
      })
      .catch((err) => {
        setListData([]);
      });
  };



  const handleInputs = (e) => {
    // debugger;
    let { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleHobliInputs = (e) => {
    // debugger;
    let { name, value } = e.target;
    setHobliData({ ...hobliData, [name]: value });
  };



  // to get State
  const [districtListData, setDistrictListData] = useState([]);

  const getList = () => {
    const response = api
      .get(baseURL + `district/get-all`)
      .then((response) => {
        if (response.data.content.district) {
          setDistrictListData(response.data.content.district);
        }
      })
      .catch((err) => {
        setDistrictListData([]);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  

  // to get taluk
  const [talukListData, setTalukListData] = useState([]);

  const getTalukList = (_id) => {
    const response = api
      .get(baseURL + `taluk/get-by-district-id/${_id}`)
      .then((response) => {
        if (response.data.content.taluk) {
          setTalukListData(response.data.content.taluk);
        }
      })
      .catch((err) => {
        setTalukListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.districtId) {
      getTalukList(data.districtId);
    }
  }, [data.districtId]);

  // to get hobli
  const [hobliListData, setHobliListData] = useState([]);

  const getHobliList = (_id) => {
    const response = api
      .get(baseURL + `hobli/get-by-taluk-id/${_id}`)
      .then((response) => {
        if (response.data.content.hobli) {
          setHobliListData(response.data.content.hobli);
        }
      })
      .catch((err) => {
        setHobliListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.talukId) {
      getHobliList(data.talukId);
    }
  }, [data.talukId]);

  // to get Village
  const [villageListData, setVillageListData] = useState([]);

  const getVillageList = (_id) => {
    api
      .get(baseURL + `village/get-by-hobli-id/${_id}`)
      .then((response) => {
        setVillageListData(response.data.content.village);
      })
      .catch((err) => {
        setVillageListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (hobliData.hobliId) {
      getVillageList(hobliData.hobliId);
    }
  }, [hobliData.hobliId]);

  // to get District Implementing Officer
 const [tscListData, setTscListData] = useState([]);

 const getTscList = (districtId,talukId) => {
   api
     .post(baseURL + `tscMaster/get-by-districtId-and-talukId`, {
       districtId: districtId,
       talukId: talukId,
     })
     .then((response) => {
       setTscListData(response.data.content.tscMaster);
     })
     .catch((err) => {
       setTscListData([]);
     });
 };

 useEffect(() => {
   if (data.districtId && data.talukId) {
     // getComponentList(data.scSchemeDetailsId, data.scSubSchemeDetailsId);
     getTscList(
      data.districtId,
       data.talukId
     );
   }
 }, [data.districtId, data.talukId]);



  const navigate = useNavigate();
  const handleView = (_id) => {
    navigate(`/seriui/farmer-view/${_id}`);
  };

  const handleEdit = (_id) => {
    navigate(`/seriui/farmer-edit/${_id}`);
    // navigate("/seriui/state");
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
        const response = api
          .delete(baseURL + `farmer/delete/${_id}`)
          .then((response) => {
            // deleteConfirm(_id);
            // getList();
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
        minHeight: "30px", // override the row height
      },
    },
    headCells: {
      style: {
        // '&:not(:last-of-type)': {
        backgroundColor: "#1e67a8",
        color: "#fff",
        borderStyle: "solid",
        bordertWidth: "1px",
        // borderColor: defaultThemes.default.divider.default,
        borderColor: "black",
        // },
      },
    },
    cells: {
      style: {
        // '&:not(:last-of-type)': {
        borderStyle: "solid",
        borderWidth: "1px",
        paddingTop: "3px",
        paddingBottom: "3px",
        paddingLeft: "8px",
        paddingRight: "8px",
        // borderColor: defaultThemes.default.divider.default,
        borderColor: "black",
        // },
      },
    },
  };

  const FarmerDataColumns = [
    
    {
      name: "First Name",
      selector: (row) => row.firstName,
      cell: (row) => <span>{row.firstName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Farmer Middle Name",
      selector: (row) => row.middleName,
      cell: (row) => <span>{row.middleName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Fruits Id",
      selector: (row) => row.fruitsId,
      cell: (row) => <span>{row.fruitsId}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Farmer Number",
      selector: (row) => row.farmerNumber,
      cell: (row) => <span>{row.farmerNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Father Name",
      selector: (row) => row.fatherName,
      cell: (row) => <span>{row.fatherName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Passbook Number",
      selector: (row) => row.passbookNumber,
      cell: (row) => <span>{row.passbookNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "District Name",
      selector: (row) => row.districtName,
      cell: (row) => <span>{row.districtName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Taluk  Name",
      selector: (row) => row.talukName,
      cell: (row) => <span>{row.talukName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Village Name",
      selector: (row) => row.villageName,
      cell: (row) => <span>{row.villageName}</span>,
      sortable: true,
      hide: "md",
    },
    
  ];

 

  return (
    <Layout title="Farmer Wise Report">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Farmer Wise Report</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
           
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

     
    <Block className="mt-n4">
      <Card className="mt-1">
        <Row className="m-4">
      <Col sm={2}>
          <Form.Group className="form-group mt-n4">
            <Form.Label>
              District<span className="text-danger">*</span>
            </Form.Label>
            <div className="form-control-wrap">
              <Form.Select
                name="districtId"
                value={data.districtId}
                onChange={handleInputs}
                onBlur={() => handleInputs}
                isInvalid={
                  data.districtId === undefined ||
                  data.districtId === "0"
                }
              >
                <option value="">Select District</option>
                {districtListData && districtListData.length
                  ? districtListData.map((list) => (
                      <option
                        key={list.districtId}
                        value={list.districtId}
                      >
                        {list.districtName}
                      </option>
                    ))
                  : ""}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                District Name is required
              </Form.Control.Feedback>
            </div>
          </Form.Group>
        </Col>

        <Col sm={2}>
          <Form.Group className="form-group mt-n4">
            <Form.Label>
              Taluk
            </Form.Label>
            <div className="form-control-wrap">
              <Form.Select
                name="talukId"
                value={data.talukId}
                onChange={handleInputs}
                onBlur={() => handleInputs}
                isInvalid={
                  data.talukId === undefined || data.talukId === "0"
                }
              >
                <option value="">Select Taluk</option>
                {talukListData && talukListData.length
                  ? talukListData.map((list) => (
                      <option
                        key={list.talukId}
                        value={list.talukId}
                      >
                        {list.talukName}
                      </option>
                    ))
                  : ""}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Taluk Name is required
              </Form.Control.Feedback>
            </div>
          </Form.Group>
        </Col>

        <Col sm={2}>
          <Form.Group className="form-group mt-n4">
            <Form.Label>
              Hobli
            </Form.Label>
            <div className="form-control-wrap">
              <Form.Select
                name="hobliId"
                value={hobliData.hobliId}
                onChange={handleHobliInputs}
                onBlur={() => handleHobliInputs}
                isInvalid={
                  hobliData.hobliId === undefined || hobliData.hobliId === "0"
                }
              >
                <option value="">Select Hobli</option>
                {hobliListData && hobliListData.length
                  ? hobliListData.map((list) => (
                      <option
                        key={list.hobliId}
                        value={list.hobliId}
                      >
                        {list.hobliName}
                      </option>
                    ))
                  : ""}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Hobli Name is required
              </Form.Control.Feedback>
            </div>
          </Form.Group>
        </Col>

        <Col sm={2}>
          <Form.Group className="form-group mt-n4">
            <Form.Label>
              Village
            </Form.Label>
            <div className="form-control-wrap">
              <Form.Select
                name="villageId"
                value={data.villageId}
                onChange={handleInputs}
                onBlur={() => handleInputs}
                isInvalid={
                  data.villageId === undefined || data.villageId === "0"
                }
              >
                <option value="">Select Village</option>
                {villageListData && villageListData.length
                  ? villageListData.map((list) => (
                      <option
                        key={list.villageId}
                        value={list.villageId}
                      >
                        {list.villageName}
                      </option>
                    ))
                  : ""}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Village Name is required
              </Form.Control.Feedback>
            </div>
          </Form.Group>
        </Col>

                  <Col sm={2}>
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          TSC
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="tscMasterId"
                            value={data.tscMasterId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            isInvalid={
                              data.tscMasterId === undefined || data.tscMasterId === "0"
                            }
                          >
                            <option value="">Select TSC</option>
                            {tscListData.map((list) => (
                              <option
                                key={list.tscMasterId}
                                value={list.tscMasterId}
                              >
                                {list.name}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            TSC is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                    <Col sm={1}>
                  <Button type="button" variant="primary" onClick={search}>
                    Search
                  </Button>
                </Col>
          </Row>
          <DataTable
            tableClassName="data-table-head-light table-responsive"
            columns={FarmerDataColumns}
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
    </Layout>
  );
}

export default FarmerRegistrationList;
