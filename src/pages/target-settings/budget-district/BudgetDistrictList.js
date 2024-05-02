import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
// import DataTable from "../../../components/DataTable/DataTable";
import DataTable, { createTheme } from "react-data-table-component";
import Swal from "sweetalert2/src/sweetalert2.js";
import { useNavigate } from "react-router-dom";
import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

import api from "../../../../src/services/auth/api";

const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLTargetSetting = process.env.REACT_APP_API_BASE_URL_TARGET_SETTING;

function BudgetDistrictList() {
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };
  const [show, setShow] = useState(false);

  const [data, setData] = useState({
    financialYearMasterId: "",
    scHeadAccountId: "",
    districtId: "",
  });

  const [type, setType] = useState({
    budgetType: "allocate",
  });

  const getList = () => {
    // setLoading(true);
    if (type.budgetType === "allocate") {
      api
        .post(baseURLTargetSetting + `tsBudgetDistrict/get-details`, data)
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
            setShow(false);
          } else {
            setListData(response.data.content.tsBudgetDistrict);
            setShow(true);
            // saveSuccess();
            // clear();
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
    }
    if (type.budgetType === "release") {
      api
        .post(
          baseURLTargetSetting + `tsReleaseBudgetDistrict/get-details`,
          data
        )
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
            setShow(false);
          } else {
            setListData(response.data.content.tsReleaseBudgetDistrict);
            setShow(true);
            // saveSuccess();
            // clear();
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

  // to get Financial Year
  const [financialyearListData, setFinancialyearListData] = useState([]);

  const getFinancialYearList = () => {
    api
      .get(baseURLMasterData + `financialYearMaster/get-all`)
      .then((response) => {
        setFinancialyearListData(response.data.content.financialYearMaster);
      })
      .catch((err) => {
        setFinancialyearListData([]);
      });
  };

  useEffect(() => {
    getFinancialYearList();
  }, []);

  // Head of Account

  const [headOfAccountListData, setHeadOfAccountListData] = useState([]);

  const getHeadOfAccountList = () => {
    api
      .get(baseURLMasterData + `scHeadAccount/get-all`)
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

  // District

  // to get district
  const [districtListData, setDistrictListData] = useState([]);

  const getDistrictList = () => {
    const response = api
      .get(baseURLMasterData + `district/get-all`)
      .then((response) => {
        if (response.data.content.district) {
          setDistrictListData(response.data.content.district);
        }
      })
      .catch((err) => {
        setDistrictListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    getDistrictList();
  }, []);

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

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const handleTypeInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setType({ ...type, [name]: value });
  };

  const navigate = useNavigate();
  const handleView = (id, type) => {
    navigate(`/seriui/budget-district-view/${id}/${type}`);
  };

  const handleEdit = (id, type) => {
    navigate(`/seriui/budget-district-edit/${id}/${type}`);
  };

  const deleteError = () => {
    Swal.fire({
      icon: "error",
      title: "Delete attempt was not successful",
      text: "Something went wrong!",
    });
  };

  const deleteConfirm = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "It will delete permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        const response = api
          .delete(baseURLMasterData + `tsBudgetDistrict/delete/${id}`)
          .then((response) => {
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
      } else {
        console.log(result.value);
        Swal.fire("Cancelled", "Your record is not deleted", "info");
      }
    });
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
      getList();
      setValidated(true);
    }
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

  const activityDataColumns = [
    {
      name: "Action",
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              if (type.budgetType === "allocate") {
                handleView(row.tsBudgetDistrictId, "allocate");
              }
              if (type.budgetType === "release") {
                handleView(row.tsReleaseBudgetDistrictId, "release");
              }
            }}
          >
            View
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="ms-2"
            // onClick={() => handleEdit(row.tsBudgetDistrictId)}
            onClick={() => {
              if (type.budgetType === "allocate") {
                handleEdit(row.tsBudgetDistrictId, "allocate");
              }
              if (type.budgetType === "release") {
                handleEdit(row.tsReleaseBudgetDistrictId, "release");
              }
            }}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.tsBudgetDistrictId)}
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
      selector: (row) => row.financialYear,
      cell: (row) => <span>{row.financialYear}</span>,
      sortable: false,
      hide: "md",
    },

    {
      name: "District Name",
      selector: (row) => row.districtName,
      cell: (row) => <span>{row.districtName}</span>,
      sortable: false,
      hide: "md",
    },
    {
      name: "Budget Amount",
      selector: (row) => row.budgetAmount,
      cell: (row) => <span>{row.budgetAmount}</span>,
      sortable: false,
      hide: "md",
    },
    {
      name: "Head Of Account",
      selector: (row) => row.scHeadAccountId,
      cell: (row) => <span>{row.scHeadAccountId}</span>,
      sortable: false,
      hide: "md",
    },
  ];

  return (
    <Layout title="Budget District List">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Budget District List</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/budget-district"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/budget-district"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 ">
            <Block>
              <Card>
                <Card.Header>Budget to District</Card.Header>
                <Card.Body>
                  {/* <h3>Farmers Details</h3> */}
                  <Row className="g-gs">
                    <Col lg="6">
                      <Form.Group className="form-group mt-n3">
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

                    <Col lg={6} className="mt-5">
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
                        <Col lg="3" className="ms-n4">
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
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group mt-n3">
                        <Form.Label>
                          Head Of Account<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="scHeadAccountId"
                            value={data.scHeadAccountId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.scHeadAccountId === undefined ||
                              data.scHeadAccountId === "0"
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
                      <Form.Group className="form-group mt-n3">
                        <Form.Label>
                          Select District<span className="text-danger">*</span>
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
                  </Row>
                </Card.Body>
              </Card>
            </Block>

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  <Button type="submit" variant="primary">
                    Go
                  </Button>
                </li>
                {/* <li>
                  <Button type="button" variant="secondary" onClick={clear}>
                    Cancel
                  </Button>
                </li> */}
              </ul>
            </div>
          </Row>
        </Form>

        {show ? (
          <Card className="mt-2">
            <DataTable
              tableClassName="data-table-head-light table-responsive"
              columns={activityDataColumns}
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
        ) : (
          ""
        )}
      </Block>
    </Layout>
  );
}

export default BudgetDistrictList;
