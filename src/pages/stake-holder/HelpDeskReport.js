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
import DatePicker from "react-datepicker";
import api from "../../../src/services/auth/api";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_HELPDESK;

function HelpDeskReport() {
  const { t } = useTranslation();
  const [listData, setListData] = useState({});
  const [listFarmerData, setListFarmerData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 25;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };

  const [isActive, setIsActive] = useState(false);

  const [data, setData] = useState({
    moduleId: "",
    featureId: "",
    statusId: "",
    createdBy: "",
  });


  // Search
  const search = (e) => {
    api
      .post(
        baseURLFarmer + `hdTicket/getTicketDetails`,
        {},
        {
          params: {
            moduleId: data.moduleId || 0,
            featureId: data.featureId || 0,
            statusId: data.statusId || 0,
            createdBy: data.createdBy || 0,
            pageNumber: page,
            pageSize: countPerPage,
          },
        }
      )
      .then((response) => {
        setListData(response.data.content);
        setTotalRows(response.data.totalRecords);
      })
      .catch((err) => {
        setListData([]);
      });
  };

  const exportCsv = (e) => {
    api
      .post(
        baseURLFarmer + `hdTicket/getTicketReport`,
        {},
        {
          params: {
           moduleId: data.moduleId || 0,
            featureId: data.featureId || 0,
            statusId: data.statusId || 0,
            createdBy: data.createdBy || 0,
          },
          responseType: 'blob',
          headers: {
            accept: "text/csv",
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        const blob = new Blob([response.data], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `ticket_report.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
      })
      .catch((err) => {
        Swal.fire({
          icon: "warning",
          title: "No record found!!!",
        });
      });
};

  const getFarmerList = (e) => {
    api
      .post(
        baseURLFarmer + `hdTicket/getTicketDetails`,
        {},
        {
          params: {
            moduleId: data.moduleId || 0,
            featureId: data.featureId || 0,
            statusId: data.statusId || 0,
            createdBy: data.createdBy || 0,
            pageNumber: page,
            pageSize: countPerPage,
          },
        }
      )
      .then((response) => {
        setListData(response.data.content);
        setTotalRows(response.data.totalRecords);
      })
      .catch((err) => {
        setListData([]);
      });
  };

  useEffect(() => {
    getFarmerList();
  }, [page]);

  const handleInputs = (e) => {
    // debugger;
    let { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  
  // to get Status
  const [hdStatusListData, setHdStatusListData] = useState([]);

  const getStatusList = () => {
    const response = api
      .get(baseURL + `hdStatusMaster/get-all`)
      .then((response) => {
        setHdStatusListData(response.data.content.hdStatusMaster);
      })
      .catch((err) => {
        setHdStatusListData([]);
      });
  };

  useEffect(() => {
    getStatusList();
  }, []);

  // to get Module
  const [hdModuleListData, setHdModuleListData] = useState([]);

  const getList = () => {
    const response = api
      .get(baseURL + `hdModuleMaster/get-all`)
      .then((response) => {
        setHdModuleListData(response.data.content.hdModuleMaster);
      })
      .catch((err) => {
        setHdModuleListData([]);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  // to get Feature
  const [featureListData, setFeatureListData] = useState([]);

  const getFeatureList = (_id) => {
    const response = api
      .get(baseURL + `hdFeatureMaster/get-by-hd-module-id/${_id}`)
      .then((response) => {
        setFeatureListData(response.data.content.hdFeatureMaster);
        setLoading(false);
        if (response.data.content.error) {
          setFeatureListData([]);
        }
      })
      .catch((err) => {
        setFeatureListData([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (data.moduleId) {
      getFeatureList(data.moduleId);
    }
  }, [data.moduleId]);

    // to get username
    const [userListData, setUserListData] = useState([]);
  
    const getUserList = () => {
      api
        .get(baseURL + `userMaster/get-all`)
        .then((response) => {
          setUserListData(response.data.content.userMaster);
        })
        .catch((err) => {
          setUserListData([]);
        });
    };
  
    useEffect(() => {
      getUserList();
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
      name: "Sl.No",
      selector: (row) => row.serialNumber,
      cell: (row) => <span>{row.serialNumber}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Ticket Arn Number",
      selector: (row) => row.ticketArn,
      cell: (row) => <span>{row.ticketArn}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Users Affected",
      selector: (row) => row.usersAffected,
      cell: (row) => <span>{row.usersAffected}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Query",
      selector: (row) => row.query,
      cell: (row) => <span>{row.query}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Module",
      selector: (row) => row.moduleName,
      cell: (row) => <span>{row.moduleName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Feature",
      selector: (row) => row.featureName,
      cell: (row) => <span>{row.featureName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Broad Category",
      selector: (row) => row.boardCategoryName,
      cell: (row) => <span>{row.boardCategoryName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Created By",
      selector: (row) => row.onBehalfUsername,
      cell: (row) => <span>{row.onBehalfUsername}</span>,
      sortable: true,
      hide: "md",
    },  
    {
      name: "Status",
      selector: (row) => row.statusName,
      cell: (row) => <span>{row.statusName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Solution",
      selector: (row) => row.solution,
      cell: (row) => <span>{row.solution}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Severity",
      selector: (row) => row.severityName,
      cell: (row) => <span>{row.severityName}</span>,
      sortable: true,
      hide: "md",
    },
   
  ];

  return (
    <Layout title={t("Ticket Details Report")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Ticket Details Report")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent></Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1">
          <Row className="m-4">
            {/* <Col sm={2}>
              <Form.Group className="form-group mt-n4">
                <Form.Label>{t("District")}</Form.Label>
                <div className="form-control-wrap">
                  <Form.Select
                    name="districtId"
                    value={data.districtId}
                    onChange={handleInputs}
                    onBlur={() => handleInputs}
                    isInvalid={
                      data.districtId === undefined || data.districtId === "0"
                    }
                  >
                    <option value="">{t("Select District")}</option>
                    {districtListData && districtListData.length
                      ? districtListData.map((list) => (
                          <option key={list.districtId} value={list.districtId}>
                            {list.districtName}
                          </option>
                        ))
                      : ""}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {t("District Name is required")}
                  </Form.Control.Feedback>
                </div>
              </Form.Group>
            </Col> */}

            

                {/* <Col sm={2}>
                    <Form.Group className="form-group mt-n4">
                    <Form.Label>
                    {t("tsc")}
                    </Form.Label>
                    <div className="form-control-wrap">
                        <Form.Select
                        name="tscId"
                        value={data.tscId}
                        onChange={handleInputs}
                        // onBlur={() => handleInputs}
                        // required
                        // isInvalid={
                        //     data.tscMasterId === undefined ||
                        //     data.tscMasterId === "0"
                        // }
                        >
                        <option value="">{t("select_tsc")}</option>
                        {tscListData.map((list) => (
                            <option
                            key={list.tscMasterId}
                            value={list.tscMasterId}
                            >
                            {list.name}
                            </option>
                        ))}
                        </Form.Select>
                       
                    </div>
                    </Form.Group>
                    </Col> */}

                    <Col sm={2}>
                    <Form.Group className="form-group mt-n4">
                        <Form.Label>
                        {t("Module")}
                        {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <div className="form-control-wrap">
                        <Form.Select
                            name="moduleId"
                            value={data.moduleId}
                            onChange={handleInputs}
                        >
                            <option value="">{t("Select Module")}</option>
                            {hdModuleListData.map((list) => (
                            <option
                                key={list.hdModuleId}
                                value={list.hdModuleId}
                            >
                                {list.hdModuleName}
                            </option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {t("Module Name is required")}
                        </Form.Control.Feedback>
                        </div>
                    </Form.Group>
                    </Col>

                    <Col lsm={2}>
                    <Form.Group className="form-group mt-n4">
                        <Form.Label>
                        {t("Feature")}
                        {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <div className="form-control-wrap">
                        <Form.Select
                            name="featureId"
                            value={data.featureId}
                            onChange={handleInputs}
                            
                        >
                            <option value="">{t("Select Feature")}</option>
                            {featureListData.map((list) => (
                            <option
                                key={list.hdFeatureId}
                                value={list.hdFeatureId}
                            >
                                {list.hdFeatureName}
                            </option>
                            ))}
                        </Form.Select>
                        </div>
                    </Form.Group>
                    </Col>

                    <Col lsm={2}>
                    <Form.Group className="form-group mt-n4">
                        <Form.Label>
                        {t("Status")}
                        {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <div className="form-control-wrap">
                        <Form.Select
                            name="statusId"
                            value={data.statusId}
                            onChange={handleInputs}
                            
                        >
                            <option value="">{t("Select Status")}</option>
                            {hdStatusListData.map((list) => (
                            <option
                                key={list.hdStatusId}
                                value={list.hdStatusId}
                            >
                                {list.hdStatusName}
                            </option>
                            ))}
                        </Form.Select>
                        </div>
                    </Form.Group>
                    </Col>

                    <Col lg="4">
                    <Form.Group className="form-group mt-n3">
                    <Form.Label>
                        {t("Created By")}
                        {/* <span className="text-danger">*</span> */}
                    </Form.Label>
                    <div className="form-control-wrap">
                        <Form.Select
                        name="createdBy"
                        value={data.createdBy}
                        onChange={handleInputs}

                        // isInvalid={
                        //   data.onBehalfOf === undefined ||
                        //   data.onBehalfOf === "0"
                        // }
                        >
                        <option value="">{t("Select User")}</option>
                        {userListData.map((list) => (
                            <option
                            key={list.userMasterId}
                            value={list.userMasterId}
                            >
                            {list.username}
                            </option>
                        ))}
                        </Form.Select>
                    </div>
                    </Form.Group>
                </Col>

                    
            <Col sm={1}>
              <Button type="button" variant="primary" onClick={search}>
                {t("Search")}
              </Button>
            </Col>
            <Col sm={1}>
              <Button type="button" variant="primary" onClick={exportCsv}>
                {t("Export")}
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

export default HelpDeskReport;
