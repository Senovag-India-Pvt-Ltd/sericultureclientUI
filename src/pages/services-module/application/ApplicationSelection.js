import { Card, Button, Row, Col, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { createTheme } from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ApplicationSelection() {
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 500;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };

  // const [data, setData] = useState({
  //   userMasterId: "",
  // });

  // const handleInputs = (e) => {
  //   // debugger;
  //   let { name, value } = e.target;
  //   setData({ ...data, [name]: value });
  // };

  const [searchData, setSearchData] = useState({
    year1: "",
    year2: "",
    type: 0,
    searchText: "",
  });

  console.log("Search Data", searchData);

  const [data, setData] = useState({
    financialYearMasterId: "",
  });

  // console.log("Nodo Batha antha", data);
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

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
    if (e.target.name === "financialYearMasterId") {
      const selectedYearObject = financialyearListData.find(
        (year) => year.financialYearMasterId === parseInt(e.target.value)
      );
      // const year = selectedYearObject.financialYear;
      // const [fromDate, toDate] = year.split("-");
      // setSearchData((prev) => ({ ...prev, year1: fromDate, year2: toDate }));

      if (selectedYearObject && selectedYearObject.financialYear) {
        const year = selectedYearObject.financialYear;
        const [fromDate, toDate] = year.split("-");
        setSearchData((prev) => ({ ...prev, year1: fromDate, year2: toDate }));
      }
    }
  };

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

  useEffect(() => {
    // debugger
    // const selectedYearObject = financialyearListData.find(
    //   (year) => year.financialYearMasterId === data.financialYearMasterId
    // );
    // // console.log("Master Master",selectedYearObject);
    // const year = selectedYearObject.financialYear;
    // const [fromDate, toDate] = year.split("-");
    // setSearchData((prev) => ({ ...prev, year1: fromDate, year2: toDate }));

    if (data.financialYearMasterId && financialyearListData.length > 0) {
      // debugger
      const selectedYearObject = financialyearListData.find(
        (year) => year.financialYearMasterId === data.financialYearMasterId
      );

      if (selectedYearObject && selectedYearObject.financialYear) {
        const year = selectedYearObject.financialYear;
        const [fromDate, toDate] = year.split("-");
        setSearchData((prev) => ({ ...prev, year1: fromDate, year2: toDate }));
      }
    }
  }, [data.financialYearMasterId, financialyearListData]);

  const handleSearchInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (e.target.name === "type") {
      setSearchData({ ...searchData, [name]: value, searchText: "" });
    } else {
      setSearchData({ ...searchData, [name]: value });
    }
  };

  const [validatedDisplay, setValidatedDisplay] = useState(false);

  const display = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidatedDisplay(true);
    } else {
      event.preventDefault();

      // const { text, select } = farmer;
      // let sendData;

      // if (select === "mobileNumber") {
      //   sendData = {
      //     mobileNumber: text,
      //   };
      // }
      // if (select === "fruitsId") {
      //   sendData = {
      //     fruitsId: text,
      //   };
      // }
      // if (select === "farmerNumber") {
      //   sendData = {
      //     farmerNumber: text,
      //   };
      // }

      // const { year1, year2, type, searchText } = searchData;

      setLoading(true);

      api
        .post(
          baseURLDBT + `service/getSubmittedApplicationForm`,
          {},
          { params: searchData }
        )
        .then((response) => {
          setListData(response.data.content);
          const scApplicationFormIds = response.data.content.map(
            (item) => item.scApplicationFormId
          );
          setAllApplicationIds(scApplicationFormIds);
          setLoading(false);
        })
        .catch((err) => {
          setListData({});
          setLoading(false);
        });
    }
  };

  // Search
  //   const search = (e) => {
  //     let joinColumn;
  //     if (data.searchBy === "marketMasterName") {
  //       joinColumn = "marketMaster.marketMasterName";
  //     }
  //     if (data.searchBy === "marketTypeMasterName") {
  //       joinColumn = "marketTypeMaster.marketTypeMasterName";
  //     }
  //     // console.log(joinColumn);
  //     api
  //       .post(baseURL + `marketMaster/search`, {
  //         searchText: data.text,
  //         joinColumn: joinColumn,
  //       })
  //       .then((response) => {
  //         setListData(response.data.content.marketMaster);

  //         // if (response.data.content.error) {
  //         //   // saveError();
  //         // } else {
  //         //   console.log(response);
  //         //   // saveSuccess();
  //         // }
  //       })
  //       .catch((err) => {
  //         // saveError();
  //       });
  //   };
  const [landData, setLandData] = useState({
    landId: "",
    talukId: "",
  });

  const handleRadioChange = (_id, tId) => {
    if (!tId) {
      tId = 0;
    }
    setLandData((prev) => ({ ...prev, landId: _id, talukId: tId }));
  };

  const [applicationIds, setApplicationIds] = useState([]);
  const [unselectedApplicationIds, setUnselectedApplicationIds] = useState([]);
  const [allApplicationIds, setAllApplicationIds] = useState([]);

  const handleCheckboxChange = (_id) => {
    if (applicationIds.includes(_id)) {
      const dataList = [...applicationIds];
      const newDataList = dataList.filter((data) => data !== _id);
      setApplicationIds(newDataList);
    } else {
      setApplicationIds((prev) => [...prev, _id]);
    }
  };

  useEffect(() => {
    setUnselectedApplicationIds(
      allApplicationIds.filter((id) => !applicationIds.includes(id))
    );
  }, [allApplicationIds, applicationIds]);

  //   console.log("Unselected",unselectedApplicationIds);
  const [validated, setValidated] = useState(false);
  const postData = (event) => {
    const post = {
      applicationFormIds: applicationIds,
      applicationFormIdsNotSelected: unselectedApplicationIds,
      inspectorId: localStorage.getItem("userMasterId"),
    };
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      api
        .post(baseURLDBT + `service/updateApplicationStatus`, post)
        .then((response) => {
          if (response.data.content.errorCode) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
            getList();
          }
        })
        .catch((err) => {
          saveError(err.response.data.validationErrors);
        });
      setValidated(true);
    }
  };

  const clear = (e) => {
    e.preventDefault();
    window.location.reload();
    // setAllApplicationIds([]);
    // setUnselectedApplicationIds([]);
    // setAllApplicationIds([]);
  };

  const getList = () => {
    setLoading(true);
    api
      .post(
        baseURLDBT + `service/getSubmittedApplicationForm`,
        {},
        { params: searchData }
      )
      .then((response) => {
        setListData(response.data.content);
        const scApplicationFormIds = response.data.content.map(
          (item) => item.scApplicationFormId
        );
        setAllApplicationIds(scApplicationFormIds);
        setLoading(false);
      })
      .catch((err) => {
        setListData({});
        setLoading(false);
      });
  };

  useEffect(() => {
    getList();
  }, [page, searchData.year1]);

  console.log(allApplicationIds);

  const [scSubSchemeDetailsListData, setScSubSchemeDetailsListData] = useState(
    []
  );

  const getSubSchemeList = () => {
    const response = api
      .get(baseURLMasterData + `scSubSchemeDetails/get-all`)
      .then((response) => {
        if (response.data.content.scSubSchemeDetails) {
          setScSubSchemeDetailsListData(
            response.data.content.scSubSchemeDetails
          );
        }
      })
      .catch((err) => {
        setScSubSchemeDetailsListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    getSubSchemeList();
  }, []);

  // to get User Master
  // const [userListData, setUserListData] = useState([]);

  // const getUserList = () => {
  //   api
  //     .get(baseURL + `userMaster/get-all`)
  //     .then((response) => {
  //       setUserListData(response.data.content.userMaster);
  //     })
  //     .catch((err) => {
  //       setUserListData([]);
  //     });
  // };

  // useEffect(() => {
  //   getUserList();
  // }, []);

  const navigate = useNavigate();
  const handleView = (_id) => {
    navigate(`/seriui/market-view/${_id}`);
  };

  const handleEdit = (_id) => {
    navigate(`/seriui/service-application-edit/${_id}`);
    // navigate("/seriui/district");
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
          .delete(baseURL + `marketMaster/delete/${_id}`)
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

  const saveSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Selected Application list will be proceeded for preinspection",
      text: message,
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

  const ApplicationDataColumns = [
    {
      name: "Select",
      selector: "select",
      cell: (row) => (
        <input
          type="checkbox"
          name="selectedLand"
          value={row.scApplicationFormId}
          checked={applicationIds.includes(row.scApplicationFormId)}
          onChange={() => handleCheckboxChange(row.scApplicationFormId)}
        />
      ),
      // ignoreRowClick: true,
      // allowOverflow: true,
      button: true,
    },
    {
      name: "Farmer Name",
      selector: (row) => row.farmerFirstName,
      cell: (row) => <span>{row.farmerFirstName}</span>,
      sortable: true,
      hide: "md",
    },
    // {
    //   name: "Market Name in Kannada",
    //   selector: (row) => row.marketNameInKannada,
    //   cell: (row) => <span>{row.marketNameInKannada}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    // {
    //   name: "Market Address",
    //   selector: (row) => row.marketMasterAddress,
    //   cell: (row) => <span>{row.marketMasterAddress}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    {
      name: "Head of Account",
      selector: (row) => row.headAccountName,
      cell: (row) => <span>{row.headAccountName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Scheme Name",
      selector: (row) => row.schemeName,
      cell: (row) => <span>{row.schemeName}</span>,
      sortable: true,
      hide: "md",
    },
    // {
    //   name: "State",
    //   selector: (row) => row.stateName,
    //   cell: (row) => <span>{row.stateName}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    {
      name: "Sub Scheme Name",
      selector: (row) => row.subSchemeName,
      cell: (row) => <span>{row.subSchemeName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Minimum Quantity",
      selector: (row) => row.minQty,
      cell: (row) => <span>{row.minQty}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Maximum Quantity",
      selector: (row) => row.maxQty,
      cell: (row) => <span>{row.maxQty}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Action",
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
          {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
          {/* <Button
            variant="primary"
            size="sm"
            onClick={() => handleView(row.marketMasterId)}
          >
            View
          </Button> */}
          <Button
            variant="primary"
            size="sm"
            className="ms-2"
            onClick={() => handleEdit(row.id)}
          >
            Edit
          </Button>
          {/* <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.marketMasterId)}
            className="ms-2"
          >
            Delete
          </Button> */}
        </div>
      ),
      sortable: false,
      hide: "md",
    //   grow: 2,
    },
  ];

  return (
    <Layout title="Application Selection List">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Application Selection List</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/service-application"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>New Application</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/service-application"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="plus" />
                  <span>New Application</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Form noValidate validated={validatedDisplay} onSubmit={display}>
          <Card>
            <Card.Body>
              <Row className="g-gs">
                <Col sm={8} lg={12}>
                  <Form.Group as={Row} className="form-group" id="fid">
                    <Form.Label column sm={1} lg={2}>
                      Search
                    </Form.Label>
                    <Col sm={1} lg={2} style={{ marginLeft: "-10%" }}>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="financialYearMasterId"
                          value={data.financialYearMasterId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          // required
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
                      </div>
                    </Col>

                    <Col sm={1} lg={2}>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="type"
                          value={searchData.type}
                          onChange={handleSearchInputs}
                        >
                          <option value="0">All</option>
                          <option value="1">Application Id</option>
                          <option value="2">Sub Scheme</option>
                          <option value="3">Fruits Id</option>
                          {/* <option value="4">Sanction Order Number</option> */}
                        </Form.Select>
                      </div>
                    </Col>
                    {searchData.type == 2 ? (
                      <Col sm={2} lg={2}>
                        <Form.Select
                          name="searchText"
                          value={searchData.searchText}
                          onChange={handleSearchInputs}
                          onBlur={() => handleSearchInputs}
                          // multiple
                          // required
                          isInvalid={
                            searchData.searchText === undefined ||
                            searchData.searchText === "0"
                          }
                        >
                          <option value="">Select Sub Scheme</option>
                          {scSubSchemeDetailsListData.map((list) => (
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
                      </Col>
                    ) : (
                      <Col sm={2} lg={2}>
                        <Form.Control
                          id="fruitsId"
                          name="searchText"
                          value={searchData.searchText}
                          onChange={handleSearchInputs}
                          type="text"
                          placeholder="Search"
                          // required
                        />
                        <Form.Control.Feedback type="invalid">
                          Field Value is Required
                        </Form.Control.Feedback>
                      </Col>
                    )}

                    <Col sm={2} lg={3}>
                      <Button type="submit" variant="primary">
                        Search
                      </Button>
                    </Col>
                    {}
                    {/* <Col sm={2} style={{ marginLeft: "-280px" }}> */}
                    {/* <Col sm={1} lg={2} style={{ marginLeft: "-15%" }}>
                      <Link
                        to="/seriui/stake-holder-registration"
                        className="btn btn-primary border-0"
                      >
                        Add New
                      </Link>
                    </Col> */}
                    {/* <Col sm={1} lg={3} style={{ marginLeft: "-5%" }}>
                      <Form.Group as={Row} className="form-group" id="date">
                        <Form.Label column sm={2} lg={3}>
                          Date
                        </Form.Label>
                        <Col sm={1} lg={1} style={{ marginLeft: "-10%" }}>
                          <div className="form-control-wrap">
                            <DatePicker
                              dateFormat="dd/MM/yyyy"
                              selected={new Date()}
                              // className="form-control"
                              readOnly
                            />
                          </div>
                        </Col>
                      </Form.Group>
                    </Col> */}
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Form>
        <Card>
          {/* <Row className="m-2">
            <Col>
              <Form.Group as={Row} className="form-group" id="fid">
                <Form.Label column sm={1}>
                  Search By
                </Form.Label>
                <Col sm={3}>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="searchBy"
                      value={data.searchBy}
                      onChange={handleInputs}
                    >
                     
                      <option value="marketMasterName">Market</option>
                      <option value="marketTypeMasterName">Market Type</option>
                    </Form.Select>
                  </div>
                </Col>

                <Col sm={3}>
                  <Form.Control
                    id="marketMasterId"
                    name="text"
                    value={data.text}
                    onChange={handleInputs}
                    type="text"
                    placeholder="Search"
                  />
                </Col>
                <Col sm={3}>
                  <Button type="button" variant="primary" onClick={search}>
                    Search
                  </Button>
                </Col>
              </Form.Group>
            </Col>
          </Row> */}
          <DataTable
            //  title="Market List"
            tableClassName="data-table-head-light table-responsive"
            columns={ApplicationDataColumns}
            data={listData}
            highlightOnHover
            // pagination
            // paginationServer
            // paginationTotalRows={totalRows}
            // paginationPerPage={countPerPage}
            // paginationComponentOptions={{
            //   noRowsPerPage: true,
            // }}
            // onChangePage={(page) => setPage(page - 1)}
            progressPending={loading}
            theme="solarized"
            customStyles={customStyles}
          />
        </Card>
      </Block>

      <div className="gap-col mt-1">
        <ul className="d-flex align-items-center justify-content-center gap g-3">
          <li>
            <Button type="submit" variant="primary" onClick={postData}>
              Save
            </Button>
          </li>
          <li>
            <Button type="button" variant="secondary" onClick={(e) => clear(e)}>
              Cancel
            </Button>
          </li>
        </ul>
      </div>
      {/* <Block className="">
        <Row className="g-3 ">
          <Form noValidate validated={validated} onSubmit={postData}>
            <Card>
              <Card.Body>
                <Row className="g-gs ">
                  <Col lg="6">
                    <Form.Group className="form-group">
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
                          <option value="">Select User</option>
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
                          User name is required
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
          </Form>
        </Row>
      </Block> */}
    </Layout>
  );
}

export default ApplicationSelection;
