import { Card, Form, Row, Col, Button,Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2/src/sweetalert2.js";
import { useNavigate } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import DataTable from "react-data-table-component";
// import axios from "axios";
import api from "../../../services/auth/api";

const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLTargetSetting = process.env.REACT_APP_API_BASE_URL_TARGET_SETTING;

function SiSdMulberryTarget() {
  const [data, setData] = useState({
   mulberryTargetTypeId: "",
    financialYearMasterId: "",
    districtId: "",
    tscMasterId: "",
    month: "",
    targetType: "",
    value: "",
    userMasterId: "",
  });

  const [type, setType] = useState({
    budgetType: "allocate",
  });

  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };

  const [validatedAllDateEdit, setValidatedAllDateEdit] = useState(false);

  const [showModal3, setShowModal3] = useState(false);

  const handleShowModal3 = () => setShowModal3(true);
  const handleCloseModal3 = () => setShowModal3(false);


  // to get Financial Year
  const [financialyearListData, setFinancialyearListData] = useState([]);

  const getFinancialList = () => {
    const response = api
      .get(baseURLMasterData + `financialYearMaster/get-all`)
      .then((response) => {
        setFinancialyearListData(response.data.content.financialYearMaster);
      })
      .catch((err) => {
        setFinancialyearListData([]);
      });
  };

  useEffect(() => {
    getFinancialList();
  }, []);

  // get list
  const getList = () => {
    setLoading(true);
    api
      .get(
        baseURLTargetSetting + `mulberryTargets/list-sisd-join`,
        _params
      )
      .then((response) => {
        setListData(response.data.content.body.content.mulberryTargets);
        setTotalRows(response.data.content.body.content.totalItems);
        setLoading(false);
      })
      .catch((err) => {
        setListData({});
        setLoading(false);
      });
  };

  useEffect(() => {
    getList();
  }, [page]);

  const [editData, setEditData] = useState({
    mulberryTargetTypeId: "",
    financialYearMasterId: "",
    districtId: "",
    tscMasterId: "",
    month: "",
    targetType: "",
    value: "",
    userMasterId: "",
  });

  const handleEdit = (mulberryTargetsId) => {
    setLoading(true);
    const response = api
      .get(baseURLTargetSetting + `mulberryTargets/get-by-id?id=${mulberryTargetsId}`)
      .then((response) => {
        setEditData(response.data.content.body.content.mulberryTargets);
        setShowModal3(true);
        setLoading(false);
      })
      .catch((err) => {
        // const message = err.response.data.errorMessages[0].message[0].message;
        setEditData({});
        // editError(message);
        setLoading(false);
      });
  };

  const handleEditInputs = (e) => {
    // debugger;
    name = e.target.name;
    value = e.target.value;
    setEditData({ ...editData, [name]: value });
  };

  // to get District
  const [districtListData, setDistrictListData] = useState([]);

  const getDistrictList = () => {
    const response = api
      .get(baseURLMasterData + `district/get-all`)
      .then((response) => {
        setDistrictListData(response.data.content.district);
      })
      .catch((err) => {
        setDistrictListData([]);
      });
  };

  useEffect(() => {
    getDistrictList();
  }, []);

  // to get mulberry target type
  const [mulberryTargetTypeData, setMulberryTargetTypeData] = useState([]);

  const getMulberryTargetTypeList = () => {
    api
      .get(baseURLMasterData + `mulberryTargetType/get-all`)
      .then((response) => {
        setMulberryTargetTypeData(response.data.content.mulberryTargetType);
      })
      .catch((err) => {
        setMulberryTargetTypeData([]);
      });
  };

  useEffect(() => {
    getMulberryTargetTypeList();
  }, []);

  // to get TSC
  const [chawkiListData, setChawkiListData] = useState([]);

  const getChawkiList = () => {
    api
      .get(baseURLMasterData + `tscMaster/get-all`)
      .then((response) => {
        setChawkiListData(response.data.content.tscMaster);
      })
      .catch((err) => {
        setChawkiListData([]);
      });
  };

  useEffect(() => {
    getChawkiList();
  }, []);

//   To get TSC by District
    const [tscListData, setTscListData] = useState([]);

    const getTscListByDistrict = (distId) => {
        api
          .post(baseURLMasterData + `tscMaster/get-by-districtId`,{districtId:distId })
          .then((response) => {
            setTscListData(response.data.content.tscMaster);
          })
          .catch((err) => {
            setTscListData([]);
          });
      };
    
      useEffect(() => {
        if(data.districtId){
        getTscListByDistrict(data.districtId);
        }
      }, [data.districtId]);

      useEffect(() => {
        if(editData.districtId){
        getTscListByDistrict(editData.districtId);
        }
      }, [editData.districtId]);

//   To get user by TSC
    const [userListData, setUserListData] = useState([]);
    const getUserListByTsc = (tscId) => {
        console.log("tsc",tscId);
        api
          .get(baseURLMasterData + `userMaster/get-by-tsc-master-id/${tscId}` )
          .then((response) => {
            setUserListData(response.data.content.userMaster);
          })
          .catch((err) => {
            setUserListData([]);
          });
      };
    
      useEffect(() => {
        if(data.tscMasterId){
            getUserListByTsc(data.tscMasterId);
        }
      }, [data.tscMasterId]);

      useEffect(() => {
        if(editData.tscMasterId){
            getUserListByTsc(editData.tscMasterId);
        }
      }, [editData.tscMasterId]);

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

      const navigate = useNavigate();

  const handleView = (_id) => {
    navigate(`/seriui/taluk-view/${_id}`);
  };
  const postEditData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidatedAllDateEdit(true);
    } else {
      event.preventDefault();
      // event.stopPropagation();
      console.log("Entered Allocate");
      api
        .post(
          baseURLTargetSetting +
            `mulberryTargets/editSiSdMulberryTargets`,
          editData  
        )
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
            getList();
            editClear();
          }
        })
        .catch((err) => {
          if (
            err.response &&
            err.response &&
            err.response.data &&
            err.response.data.validationErrors
          ) {
            if (Object.keys(err.response.data.validationErrors).length > 0) {
              saveError(err.response.data.validationErrors);
            }
          }
        });
        setValidatedAllDateEdit(true);
    }
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
          .delete(baseURLTargetSetting + `mulberryTargets/delete-mulberry-targets/${_id}`)
          .then((response) => {
            // deleteConfirm(_id);
            getFinancialList();
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

  const editClear = () => {
    setEditData({
    mulberryTargetTypeId: "",
    financialYearMasterId: "",
    districtId: "",
    tscMasterId: "",
    month: "",
    targetType: "",
    value: "",
    userMasterId: "",
    });
    setType({
      budgetType: "allocate",
    });
    getFinancialDefaultDetails();
    setValidatedAllDateEdit(false);
  };


      const ProductionPhysicalDataColumns = [
        {
          name: "Action",
          cell: (row) => (
            //   Button style
            <div className="text-start w-100">
              {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
              {/* <Button
                variant="primary"
                size="sm"
                onClick={() => handleView(row.productionTargetsId)}
              >
                View
              </Button> */}
              <Button
                variant="primary"
                size="sm"
                className="ms-2"
                onClick={() => handleEdit(row.mulberryTargetsId)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => deleteConfirm(row.mulberryTargetsId)}
                className="ms-2"
              >
                Delete
              </Button>
            </div>
          ),
          sortable: false,
          hide: "md",
        },
        {
          name: "Financial Year",
          selector: (row) => row.financialYearMaster,
          cell: (row) => <span>{row.financialYearMaster}</span>,
          sortable: true,
          hide: "md",
        },
        {
          name: "Mulberry Target Type",
          selector: (row) => row.mulberryTargetTypeName,
          cell: (row) => <span>{row.mulberryTargetTypeName}</span>,
          sortable: true,
          hide: "md",
        },
        {
          name: "District",
          selector: (row) => row.districtName,
          cell: (row) => <span>{row.districtName}</span>,
          sortable: true,
          hide: "md",
        },
        {
          name: "TSC",
          selector: (row) => row.tscMasterName,
          cell: (row) => <span>{row.tscMasterName}</span>,
          sortable: true,
          hide: "md",
        },
        {
          name: "Target Type",
          selector: (row) => row.targetType,
          cell: (row) => <span>{row.targetType}</span>,
          sortable: true,
          hide: "md",
        },
    
        {
          name: "Month",
          selector: (row) => row.month,
          cell: (row) => <span>{row.month}</span>,
          sortable: true,
          hide: "md",
        },
        {
          name: " User Name",
          selector: (row) => row.userMasterName,
          cell: (row) => <span>{row.userMasterName}</span>,
          sortable: true,
          hide: "md",
        },
        {
          name: "Target No.",
          selector: (row) => row.value,
          cell: (row) => <span>{row.value}</span>,
          sortable: true,
          hide: "md",
        },
      ];




  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    // setData({ ...data, [name]: value });
    let updatedData = { ...data, [name]: value };
    if (name === "centralBudget" || name === "stateBudget") {
      const centralBudget = parseFloat(updatedData.centralBudget);
      const stateBudget = parseFloat(updatedData.stateBudget);
      const totalAmount =
        (isNaN(centralBudget) ? 0 : centralBudget) +
        (isNaN(stateBudget) ? 0 : stateBudget);
      updatedData = { ...updatedData, amount: totalAmount.toString() };
    }
    setData(updatedData);
  };

  const handleTypeInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setType({ ...type, [name]: value });
  };
  // const _header = { "Content-Type": "application/json", accept: "*/*" };
  // const _header = { "Content-Type": "application/json", accept: "*/*",  'Authorization': `Bearer ${localStorage.getItem("jwtToken")}`, "Access-Control-Allow-Origin": "*"};
  const _header = {
    "Content-Type": "application/json",
    accept: "*/*",
    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
  };

  // const postData = (e) => {
  //   axios
  //     .post(baseURLMasterData + `Budget/add`, data, {
  //       headers: _header,
  //     })
  //     .then((response) => {
  //       saveSuccess();
  //     })
  //     .catch((err) => {
  //       setData({});
  //       saveError();
  //     });
  // };

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
        .post(
          baseURLTargetSetting + `mulberryTargets/saveSISDMulberryTargets`,
          data
        )
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
            getList();
            clear();
          }
        })
        .catch((err) => {
          if (
            err.response &&
            err.response &&
            err.response.data &&
            err.response.data.validationErrors
          ) {
            if (Object.keys(err.response.data.validationErrors).length > 0) {
              saveError(err.response.data.validationErrors);
            }
          }
        });
      setValidated(true);
    }
  };

  // Get Default Financial Year

  const getFinancialDefaultDetails = () => {
    api
      .get(baseURLMasterData + `financialYearMaster/get-is-default`)
      .then((response) => {
        setData((prev) => ({
          ...prev,
          financialYearMasterId: response.data.content.financialYearMasterId,
        }));
      })
      .catch((err) => {
        setData((prev) => ({
          ...prev,
          financialYearMasterId: "",
        }));
      });
  };

  useEffect(() => {
    getFinancialDefaultDetails();
  }, []);

  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
    top: {
      backgroundColor: "rgb(15, 108, 190, 1)",
      color: "rgb(255, 255, 255)",
      width: "50%",
      fontWeight: "bold",
      fontSize: "25px",
      textAlign: "center",
    },
    bottom: {
      fontWeight: "bold",
      fontSize: "25px",
      textAlign: "center",
    },
    sweetsize: {
      width: "100px",
      height: "100px",
    },
  };

  const clear = () => {
    setData({
        mulberryTargetTypeId: "",
        financialYearMasterId: "",
        districtId: "",
        tscMasterId: "",
        month: "",
        targetType: "",
        value: "",
        userMasterId: "",
    });
    setType({
      budgetType: "allocate",
    });
    getFinancialDefaultDetails();
    setValidated(false);
  };

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
    <Layout title="SI-SD Mulberry Target">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">SI-SD Mulberry Target</Block.Title>
          </Block.HeadContent>
          {/* <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/Budget-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/Budget-list"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent> */}
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        {/* <Form action="#"> */}
        <Row>
          <Col lg={type.budgetType === "release" ? "8" : "12"}>
            <Form noValidate validated={validated} onSubmit={postData}>
              <Row className="g-3 ">
                <Block>
                  <Card>
                    <Card.Header>SI-SD Mulberry Target </Card.Header>
                    <Card.Body>
                      {/* <h3>Farmers Details</h3> */}
                      <Row className="g-gs">
                        <Col lg="6">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label>
                              Financial Year
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="financialYearMasterId"
                                value={data.financialYearMasterId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                required
                                isInvalid={
                                  data.financialYearMasterId === undefined ||
                                  data.financialYearMasterId === "0"
                                }
                              >
                                <option value="">Select Year</option>
                                {financialyearListData.map((list) => (
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
                          <Form.Group className="form-group mt-n3">
                            <Form.Label>
                              Target
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="mulberryTargetTypeId"
                                value={data.mulberryTargetTypeId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                required
                                isInvalid={
                                  data.mulberryTargetTypeId === undefined ||
                                  data.mulberryTargetTypeId === "0"
                                }
                              >
                                <option value="">Select Target</option>
                                {mulberryTargetTypeData.map((list) => (
                                  <option
                                    key={list.mulberryTargetTypeId}
                                    value={list.mulberryTargetTypeId}
                                  >
                                    {list.mulberryTargetTypeName}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                Target is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        {/* <Col lg={6} className="mt-5">
                          <Row>
                            <Col lg="3">
                              <Form.Group
                                as={Row}
                                className="form-group"
                                controlId="with"
                              >
                                <Col sm={1}>
                                  <Form.Check
                                    type="radio"
                                    name="budgetType"
                                    value="allocate"
                                    checked={type.budgetType === "allocate"}
                                    onChange={handleTypeInputs}
                                  />
                                </Col>
                                <Form.Label
                                  column
                                  sm={9}
                                  className="mt-n2"
                                  id="with"
                                >
                                  Allocate
                                </Form.Label>
                              </Form.Group>
                            </Col>
                            <Col
                              lg="3"
                              className={
                                type.budgetType === "release"
                                  ? "ms-n3"
                                  : "ms-n5"
                              }
                            >
                              <Form.Group
                                as={Row}
                                className="form-group"
                                controlId="without"
                              >
                                <Col sm={1}>
                                  <Form.Check
                                    type="radio"
                                    name="budgetType"
                                    value="release"
                                    checked={type.budgetType === "release"}
                                    onChange={handleTypeInputs}
                                  />
                                </Col>
                                <Form.Label
                                  column
                                  sm={9}
                                  className="mt-n2"
                                  id="without"
                                >
                                  Release
                                </Form.Label>
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col> */}

                        {/* <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="title">
                        Budget Name in Kannada
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="title"
                          name="nameInKannada"
                          value={data.nameInKannada}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Title Name in Kannda"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Activity Name is required.
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col> */}

                        <Col lg="6">
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
                                required
                                isInvalid={
                                  data.districtId === undefined ||
                                  data.districtId === "0"
                                }
                              >
                                <option value="">Select District</option>
                                {districtListData.map((list) => (
                                  <option
                                    key={list.districtId}
                                    value={list.districtId}
                                  >
                                    {list.districtName}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                District is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label>
                              TSC<span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="tscMasterId"
                                value={data.tscMasterId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                required
                                isInvalid={
                                  data.tscMasterId === undefined ||
                                  data.tscMasterId === "0"
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

                        <Col lg="6">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label>
                              User<span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="userMasterId"
                                value={data.userMasterId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                required
                                isInvalid={
                                  data.userMasterId === undefined ||
                                  data.userMasterId === "0"
                                }
                              >
                                <option value="">Select TSC</option>
                                {userListData.map((list) => (
                                  <option
                                    key={list.userMasterId}
                                    value={list.userMasterId}
                                  >
                                    {list.username}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                User is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label>
                              Target Type<span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="targetType"
                                value={data.targetType}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                required
                                // isInvalid={
                                //   data.targetType === undefined ||
                                //   data.targetType === "0"
                                // }
                              >
                                <option value="">Select Target Type</option>
                                <option value="NAREGA">NAREGA</option>
                                <option value="NON NERAGA">NON NERAGA</option>
                                {/* {districtListData.map((list) => (
                          <option key={list.districtId} value={list.districtId}>
                            {list.districtName}
                          </option>
                        ))} */}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                Target Type is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label>
                              Month<span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="month"
                                value={data.month}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                required
                                // isInvalid={
                                //   data.month === undefined ||
                                //   data.month === "0"
                                // }
                              >
                                <option value="">Select Month</option>
                                <option value="JANUARY">January</option>
                                <option value="FEBRUARY">February</option>
                                <option value="MARCH">March</option>
                                <option value="APRIL">April</option>
                                <option value="MAY">May</option>
                                <option value="JUNE">June</option>
                                <option value="JULY">July</option>
                                <option value="AUGUST">August</option>
                                <option value="SEPTEMBER">September</option>
                                <option value="OCTOBER">October</option>
                                <option value="NOVEMBER">November</option>
                                <option value="DECEMBER">December</option>

                                {/* {districtListData.map((list) => (
                          <option key={list.districtId} value={list.districtId}>
                            {list.districtName}
                          </option>
                        ))} */}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                Month is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label htmlFor="value">
                              Target No.
                              {/* <span className="text-danger">*</span> */}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="value"
                                name="value"
                                value={data.value}
                                onChange={handleInputs}
                                type="text"
                                placeholder="Enter Target No."
                                // required
                              />
                              <Form.Control.Feedback type="invalid">
                                Target No. is required.
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        {/* <Col lg="6">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label htmlFor="amount">
                              Budget Amount (in Lakhs)
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="amount"
                                name="amount"
                                value={data.amount}
                                onChange={handleInputs}
                                type="text"
                                placeholder="Enter Amount"
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                Amount is required.
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="2">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label htmlFor="sordfl"> Date</Form.Label>
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
                                maxDate={new Date()}
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                                required
                              />
                            </div>
                          </Form.Group>
                        </Col> */}
                        {/* <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="code">Code</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="code"
                          name="code"
                          value={data.code}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Code"
                        />
                      </div>
                    </Form.Group>
                  </Col> */}
                      </Row>
                    </Card.Body>
                  </Card>
                </Block>

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
              </Row>
            </Form>
          </Col>
          {type.budgetType === "release" ? (
            <Col lg="4">
              <Card>
                <Card.Header style={{ fontWeight: "bold" }}>
                  Available Budget Balance
                </Card.Header>
                <Card.Body>
                  <table className="table small table-bordered">
                    <tbody>
                      <tr>
                        <td style={styles.ctstyle}> Balance Amount:</td>
                        {/* <td>{balanceAmount}</td> */}
                        <td>0</td>
                      </tr>
                    </tbody>
                  </table>
                </Card.Body>
              </Card>
            </Col>
          ) : (
            ""
          )}
        </Row>
        <Row className="mt-2">
          <DataTable
            tableClassName="data-table-head-light table-responsive"
            columns={ProductionPhysicalDataColumns}
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
        </Row>
      </Block>

      <Modal show={showModal3} onHide={handleCloseModal3} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>SI SD Wise Monthly Mulberry</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Form action="#"> */}
          <Form
            noValidate
            validated={validatedAllDateEdit}
            onSubmit={postEditData}
          >
            <Row className="g-5 px-5">
            <Col lg="6">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label>
                              Financial Year
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="financialYearMasterId"
                                value={editData.financialYearMasterId}
                                onChange={handleEditInputs}
                                onBlur={() => handleEditInputs}
                                required
                                isInvalid={
                                  editData.financialYearMasterId === undefined ||
                                  editData.financialYearMasterId === "0"
                                }
                              >
                                <option value="">Select Year</option>
                                {financialyearListData.map((list) => (
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
                          <Form.Group className="form-group mt-n3">
                            <Form.Label>
                              Target
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="mulberryTargetTypeId"
                                value={editData.mulberryTargetTypeId}
                                onChange={handleEditInputs}
                                onBlur={() => handleEditInputs}
                                required
                                isInvalid={
                                  editData.mulberryTargetTypeId === undefined ||
                                  editData.mulberryTargetTypeId === "0"
                                }
                              >
                                <option value="">Select Target</option>
                                {mulberryTargetTypeData.map((list) => (
                                  <option
                                    key={list.mulberryTargetTypeId}
                                    value={list.mulberryTargetTypeId}
                                  >
                                    {list.mulberryTargetTypeName}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                Target is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>


                        <Col lg="6">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label>
                              District<span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="districtId"
                                value={editData.districtId}
                                onChange={handleEditInputs}
                                onBlur={() => handleEditInputs}
                                required
                                isInvalid={
                                  editData.districtId === undefined ||
                                  editData.districtId === "0"
                                }
                              >
                                <option value="">Select District</option>
                                {districtListData.map((list) => (
                                  <option
                                    key={list.districtId}
                                    value={list.districtId}
                                  >
                                    {list.districtName}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                District is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label>
                              TSC<span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="tscMasterId"
                                value={editData.tscMasterId}
                                onChange={handleEditInputs}
                                onBlur={() => handleEditInputs}
                                required
                                isInvalid={
                                  editData.tscMasterId === undefined ||
                                  editData.tscMasterId === "0"
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

                        <Col lg="6">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label>
                              User<span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="userMasterId"
                                value={editData.userMasterId}
                                onChange={handleEditInputs}
                                onBlur={() => handleEditInputs}
                                required
                                isInvalid={
                                  editData.userMasterId === undefined ||
                                  editData.userMasterId === "0"
                                }
                              >
                                <option value="">Select TSC</option>
                                {userListData.map((list) => (
                                  <option
                                    key={list.userMasterId}
                                    value={list.userMasterId}
                                  >
                                    {list.username}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                User is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label>
                              Target Type<span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="targetType"
                                value={editData.targetType}
                                onChange={handleEditInputs}
                                onBlur={() => handleEditInputs}
                                required
                                // isInvalid={
                                //   editData.targetType === undefined ||
                                //   editData.targetType === "0"
                                // }
                              >
                                <option value="">Select Target Type</option>
                                <option value="NAREGA">NAREGA</option>
                                <option value="NON NERAGA">NON NERAGA</option>
                                {/* {districtListData.map((list) => (
                          <option key={list.districtId} value={list.districtId}>
                            {list.districtName}
                          </option>
                        ))} */}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                Target Type is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label>
                              Month<span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="month"
                                value={editData.month}
                                onChange={handleEditInputs}
                                onBlur={() => handleEditInputs}
                                required
                                // isInvalid={
                                //   editData.month === undefined ||
                                //   editData.month === "0"
                                // }
                              >
                                <option value="">Select Month</option>
                                <option value="JANUARY">January</option>
                                <option value="FEBRUARY">February</option>
                                <option value="MARCH">March</option>
                                <option value="APRIL">April</option>
                                <option value="MAY">May</option>
                                <option value="JUNE">June</option>
                                <option value="JULY">July</option>
                                <option value="AUGUST">August</option>
                                <option value="SEPTEMBER">September</option>
                                <option value="OCTOBER">October</option>
                                <option value="NOVEMBER">November</option>
                                <option value="DECEMBER">December</option>

                                {/* {districtListData.map((list) => (
                          <option key={list.districtId} value={list.districtId}>
                            {list.districtName}
                          </option>
                        ))} */}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                Month is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label htmlFor="value">
                              Target No.
                              {/* <span className="text-danger">*</span> */}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="value"
                                name="value"
                                value={editData.value}
                                onChange={handleEditInputs}
                                type="text"
                                placeholder="Enter Target No."
                                // required
                              />
                              <Form.Control.Feedback type="invalid">
                                Target No. is required.
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2">
                  <div className="gap-col">
                    {/* <Button variant="success" onClick={handleAdd}> */}
                    <Button type="submit" variant="success">
                      Update
                    </Button>
                  </div>
                 
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </Layout>
  );
}

export default SiSdMulberryTarget;
