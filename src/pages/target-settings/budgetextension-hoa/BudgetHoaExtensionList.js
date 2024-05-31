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

import api from "../../../../src/services/auth/api";

const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLTargetSetting = process.env.REACT_APP_API_BASE_URL_TARGET_SETTING;

function BudgetHoaExtensionList() {
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };
  const [data, setData] = useState({
    financialYearMasterId: "",
    scHeadAccountId: "",
    scSchemeDetailsId: "",
    scSubSchemeDetailsId: "",
    scCategoryId: "",
  });

  const [type, setType] = useState({
    budgetType: "allocate",
  });
  const [show, setShow] = useState(false);

  const [validated, setValidated] = useState(false);

  const getList = () => {
    // setLoading(true);
    if (type.budgetType === "allocate") {
    api
      .post(baseURLTargetSetting + `tsBudgetHoaExt/get-details`, data)
      .then((response) => {
        if (response.data.content.error) {
          saveError(response.data.content.error_description);
          setShow(false);
        } else {
          setListData(response.data.content.tsBudgetHoaExt);
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
            // saveError(err.response.data.validationErrors);
          }
        }
      });
  };

  if (type.budgetType === "release") {
    api
      .post(baseURLTargetSetting + `tsBudgetReleaseHoaExt/get-details`, data)
      .then((response) => {
        if (response.data.content.error) {
          saveError(response.data.content.error_description);
          setShow(false);
        } else {
          setListData(response.data.content.tsBudgetReleaseHoaExt);
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
            // saveError(err.response.data.validationErrors);
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
      title: "Attempt was not successful",
      html: errorMessage,
    });
  };

  // to get Financial Year
  const [financialYearListData, setFinancialYearListData] = useState([]);

  const getFinancialYearList = () => {
    const response = api
      .get(baseURLMasterData + `financialYearMaster/get-all`)
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

  // to get get Scheme
const [schemeListData, setSchemeListData] = useState([]);

const getSchemeList = () => {
  const response = api
    .get(baseURLMasterData + `scSchemeDetails/get-all`)
    .then((response) => {
      setSchemeListData(response.data.content.ScSchemeDetails);
    })
    .catch((err) => {
     setSchemeListData([]);
    });
};

useEffect(() => {
  getSchemeList();
}, []);

// to get Sub Scheme
const [subSchemeListData, setSubSchemeListData] = useState([]);

const getSubSchemeList = () => {
  const response = api
    .get(baseURLMasterData + `scSubSchemeDetails/get-all`)
    .then((response) => {
      setSubSchemeListData(response.data.content.scSubSchemeDetails);
    })
    .catch((err) => {
     setSubSchemeListData([]);
    });
};

useEffect(() => {
  getSubSchemeList();
}, []);

// to get Category
const [categoryListData, setCategoryListData] = useState([]);

const getCategoryList = () => {
  const response = api
    .get(baseURLMasterData + `scCategory/get-all`)
    .then((response) => {
      setCategoryListData(response.data.content.scCategory);
    })
    .catch((err) => {
     setCategoryListData([]);
    });
};

useEffect(() => {
  getCategoryList();
}, []);

  const navigate = useNavigate();
  const handleView = (id,type) => {
    navigate(`/seriui/budgethoaextension-view/${id}/${type}`);
  };

  const handleEdit = (id,type) => {
    navigate(`/seriui/budgethoaextension-edit/${id}/${type}`);
  };

  const handleTypeInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setType({ ...type, [name]: value });
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
          .delete(baseURLMasterData + `tsBudgetHoa/delete/${id}`)
          .then((response) => {
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
      } else {
        console.log(result.value);
        Swal.fire("Cancelled", "Your record is not deleted", "info");
      }
    });
  };

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

  // Date Formate
  const dateFormatter = (date) => {
    if (date) {
      return (
        new Date(date).getDate().toString().padStart(2, "0") +
        "-" +
        (new Date(date).getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        new Date(date).getFullYear()
      );
    } else {
      return "";
    }
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
                handleView(row.tsBudgetHoaExtId, "allocate");
              }
              if (type.budgetType === "release") {
                handleView(row.tsBudgetReleaseHoaExtId, "release");
              }
            }}
          >
            View
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="ms-2"
            onClick={() => {
              if (type.budgetType === "allocate") {
                handleEdit(row.tsBudgetHoaExtId, "allocate");
              }
              if (type.budgetType === "release") {
                handleEdit(row.tsBudgetReleaseHoaExtId, "release");
              }
            }}
          >
            Edit
          </Button>
          {/* <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.tsBudgetHoaId)}
            className="ms-2"
          >
            Delete
          </Button> */}
        </div>
      ),
      sortable: false,
      hide: "md",
      grow:2
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
      cell: (row) => <span>{dateFormatter(row.date)}</span>,
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
      name: "Scheme",
      selector: (row) => row.schemeName,
      cell: (row) => <span>{row.schemeName}</span>,
      sortable: false,
      hide: "md",
    },
    {
      name: "Sub Scheme",
      selector: (row) => row.subSchemeName,
      cell: (row) => <span>{row.subSchemeName}</span>,
      sortable: false,
      hide: "md",
    },
    {
      name: "Category",
      selector: (row) => row.codeNumber,
      cell: (row) => <span>{row.codeNumber}</span>,
      sortable: false,
      hide: "md",
    },
  ];

  return (
    <Layout title="List Of Budget To Head of Account Mapping">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
            List Of Budget To Head of Account Mapping
            </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/budgethoaextension"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/budgethoaextension"
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
            List Of Budget To Head of Account Mapping
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
                        <Form.Label column sm={9} className="mt-n2" id="with">
                          Allocate
                        </Form.Label>
                      </Form.Group>
                    </Col>
                    <Col lg="3" className="ms-n5">
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
                  <Form.Group className="form-group mt-n4">
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
                          Select Scheme
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="scSchemeDetailsId"
                            value={data.scSchemeDetailsId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.scSchemeDetailsId === undefined ||
                              data.scSchemeDetailsId === "0"
                            }
                          >
                            <option value="">Select Scheme</option>
                            {schemeListData && schemeListData.map((list) => (
                              <option key={list.scSchemeDetailsId} value={list.scSchemeDetailsId}>
                                {list.schemeName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Scheme is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          Select Sub Scheme
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="scSubSchemeDetailsId"
                            value={data.scSubSchemeDetailsId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.scSubSchemeDetailsId === undefined ||
                              data.scSubSchemeDetailsId === "0"
                            }
                          >
                            <option value="">Select Sub Scheme</option>
                            {subSchemeListData && subSchemeListData.map((list) => (
                              <option
                                key={list.scSubSchemeDetailsId}
                                value={list.scSubSchemeDetailsId}
                              >
                                {list.subSchemeName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Sub Scheme is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          Select Category
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="scCategoryId"
                            value={data.scCategoryId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.scCategoryId === undefined ||
                              data.scCategoryId === "0"
                            }
                          >
                            <option value="">Select Category</option>
                            {categoryListData && categoryListData.map((list) => (
                              <option key={list.scCategoryId} value={list.scCategoryId}>
                                {list.codeNumber}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Category is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
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
        {show ? (
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
        ) : (
          ""
        )}
      </Block>
    </Layout>
  );
}

export default BudgetHoaExtensionList;
