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

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function BudgetTscList() {
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };

  const [data, setData] = useState({
    financialYearMasterId: "",
    scHeadAccountId: "",
    districtId: "",
    talukId: "",
    date: "",
    budgetAmount: "",
    institutionType: "1",
    institutionId: "",
  });

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
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
        .post(baseURL + `tsBudgetInstitution/add`, data)
        .then((response) => {
          if (response.data.content.error) {
            // saveError(response.data.content.error_description);
          } else {
            // saveSuccess();
            // clear();
          }
        })
        .catch((err) => {
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            // saveError(err.response.data.validationErrors);
          }
        });
      setValidated(true);
    }
  };

  const getList = () => {
    setLoading(true);

    const response = api
      .get(baseURL + `tsBudgetInstitution/list`, _params)
      .then((response) => {
        setListData(response.data.content.tsBudgetInstitution);
        setTotalRows(response.data.content.totalItems);
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

  // to get farm
  const [farmListData, setFarmListData] = useState([]);

  const getFarmList = () => {
    api
      .get(baseURL + `farmMaster/get-all`)
      .then((response) => {
        setFarmListData(response.data.content.farmMaster);
      })
      .catch((err) => {
        setFarmListData([]);
      });
  };

  useEffect(() => {
    getFarmList();
  }, []);

  // to get Grainage
  const [grainageListData, setGrainageListData] = useState([]);

  const getGrainageList = () => {
    const response = api
      .get(baseURL + `grainageMaster/get-all`)
      .then((response) => {
        setGrainageListData(response.data.content.grainageMaster);
      })
      .catch((err) => {
        setGrainageListData([]);
      });
  };

  useEffect(() => {
    getGrainageList();
  }, []);

  // to get District
  const [districtListData, setDistrictListData] = useState([]);

  const getDistrictList = () => {
    const response = api
      .get(baseURL + `district/get-all`)
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

  // to get Taluk
  const [talukListData, setTalukListData] = useState([]);

  const getTalukList = () => {
    const response = api
      .get(baseURL + `taluk/get-all`)
      .then((response) => {
        setTalukListData(response.data.content.taluk);
      })
      .catch((err) => {
        setTalukListData([]);
      });
  };

  useEffect(() => {
    getTalukList();
  }, []);

  // to get TSC
  const [tscListData, setTscListData] = useState([]);

  const getTscList = () => {
    const response = api
      .get(baseURL + `tscMaster/get-all`)
      .then((response) => {
        setTscListData(response.data.content.tscMaster);
      })
      .catch((err) => {
        setTscListData([]);
      });
  };

  useEffect(() => {
    getTscList();
  }, []);

  // to get Market
  const [marketListData, setMarketListData] = useState([]);

  const getMarketList = () => {
    const response = api
      .get(baseURL + `marketMaster/get-all`)
      .then((response) => {
        setMarketListData(response.data.content.marketMaster);
      })
      .catch((err) => {
        setMarketListData([]);
      });
  };

  useEffect(() => {
    getMarketList();
  }, []);

  const navigate = useNavigate();
  const handleView = (id) => {
    navigate(`/seriui/budget-tsc-view/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/seriui/budget-tsc-edit/${id}`);
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
          .delete(baseURL + `tsBudgetInstitution/delete/${id}`)
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
            onClick={() => handleView(row.tsBudgetInstitutionId)}
          >
            View
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="ms-2"
            onClick={() => handleEdit(row.tsBudgetInstitutionId)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.tsBudgetInstitutionId)}
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
      name: "Head of Account",
      selector: (row) => row.scHeadAccountName,
      cell: (row) => <span>{row.scHeadAccountName}</span>,
      sortable: false,
      hide: "md",
    },
    {
      name: "Date",
      selector: (row) => row.date,
      cell: (row) => <span>{row.date}</span>,
      sortable: false,
      hide: "md",
    },
    {
      name: "District",
      selector: (row) => row.districtName,
      cell: (row) => <span>{row.districtName}</span>,
      sortable: false,
      hide: "md",
    },
    {
      name: "Taluk",
      selector: (row) => row.talukName,
      cell: (row) => <span>{row.talukName}</span>,
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
  ];

  return (
    <Layout title="Allocate Budget to Institution List">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              Allocate Budget to Institution List
            </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/budget-tsc"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/budget-tsc"
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
          <Card>
            <Card.Header style={{ fontWeight: "bold" }}>
              Allocate Budget To Institution
            </Card.Header>
            <Card.Body>
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

                {/* <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      Target Type<span className="text-danger">*</span>
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
                        <option value="">Select Financial Year</option>
                        <option value="1">Financial</option>
                        <option value="2">Physical</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Target Type is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col> */}

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
                          <option key={list.districtId} value={list.districtId}>
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
                      Taluk<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="talukId"
                        value={data.talukId}
                        onChange={handleInputs}
                        onBlur={() => handleInputs}
                        required
                        isInvalid={
                          data.talukId === undefined || data.talukId === "0"
                        }
                      >
                        <option value="">Select Taluk</option>
                        {talukListData.map((list) => (
                          <option key={list.talukId} value={list.talukId}>
                            {list.talukName}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Taluk is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      Institution Type<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="institutionType"
                        value={data.institutionType}
                        onChange={handleInputs}
                        onBlur={() => handleInputs}
                        required
                        isInvalid={
                          data.institutionType === undefined ||
                          data.institutionType === "0"
                        }
                      >
                        <option value="">Select Institution Type</option>
                        <option value="1">TSC</option>
                        <option value="2">Market</option>
                        <option value="3">Farm</option>
                        <option value="4">Grainage</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Institution Type is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                {data.institutionType === "1" || data.institutionType === "" ? (
                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        TSC<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="institutionId"
                          value={data.institutionId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.institutionId === undefined ||
                            data.institutionId === "0"
                          }
                        >
                          <option value="">Select Tsc</option>
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
                ) : (
                  ""
                )}
                {data.institutionType === "2" ? (
                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        Market<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="institutionId"
                          value={data.institutionId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.institutionId === undefined ||
                            data.institutionId === "0"
                          }
                        >
                          <option value="">Select Market</option>
                          {marketListData.map((list) => (
                            <option
                              key={list.marketMasterId}
                              value={list.marketMasterId}
                            >
                              {list.marketMasterName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Market Name is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                ) : (
                  ""
                )}

                {data.institutionType === "3" ? (
                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        Farm<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="institutionId"
                          value={data.institutionId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          // multiple
                          required
                          isInvalid={
                            data.institutionId === undefined ||
                            data.institutionId === "0"
                          }
                        >
                          <option value="">Select Farm</option>
                          {farmListData.map((list) => (
                            <option key={list.farmId} value={list.userMasterId}>
                              {list.farmName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Farm is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                ) : (
                  ""
                )}

                {data.institutionType === "4" ? (
                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        Grainage<span className="text-danger">*</span>
                      </Form.Label>
                      <Col>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="institutionId"
                            value={data.institutionId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                          >
                            <option value="">Select Grainage</option>
                            {grainageListData.map((list) => (
                              <option
                                key={list.grainageMasterId}
                                value={list.grainageMasterId}
                              >
                                {list.grainageMasterName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Grainage is required
                          </Form.Control.Feedback>
                        </div>
                      </Col>
                    </Form.Group>
                  </Col>
                ) : (
                  ""
                )}
              </Row>
            </Card.Body>
          </Card>

          <div className="gap-col mt-1">
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
        </Form>
        <Card className="mt-1">
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
      </Block>
    </Layout>
  );
}

export default BudgetTscList;
