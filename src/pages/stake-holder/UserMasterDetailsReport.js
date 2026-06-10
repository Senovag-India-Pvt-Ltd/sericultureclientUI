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
import { useTranslation } from "react-i18next";
import ChawkiManagement from "../chawki-management/ChawkiManagement";
import DispatchofCocoonstoP4Grainage from "../seed-and-dfl-managment/DispatchofCocoonstoP4Grainage";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
// const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

function UserMasterDetailsReport() {
  const { t } = useTranslation();
  const [listData, setListData] = useState({});
  const [listDispatchOfCocoonsData, setListDispatchOfCocoonsData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 25;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };

  const [isActive, setIsActive] = useState(false);

  const [data, setData] = useState({
    designationId: "",
    districtId: "",
    talukId: "",
    mobileNumber: "",
    username: "",
  });

  // Search
  const search = (e) => {
    api
      .post(
        baseURL + `userMaster/userMasterDetails`,
        {},
        {
          params: {
            designationId: data.designationId || 0,
            districtId: data.districtId || 0,
            talukId: data.talukId || 0,
            mobileNumber: data.mobileNumber || '',
            username: data.username || '',
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
        baseURL + `userMaster/userMasterDetailsReport`,
        {},
        {
          params: {
            designationId: data.designationId || 0,
            districtId: data.districtId || 0,
            talukId: data.talukId || 0,
            mobileNumber: data.mobileNumber || '',
            username: data.username || '',
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
        link.download = `user_master_report.csv`;
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

  const getUserMastersList = (e) => {
    api
      .post(
        baseURL + `userMaster/userMasterDetails`,
        {},
        {
          params: {
            designationId: data.designationId || 0,
            districtId: data.districtId || 0,
            talukId: data.talukId || 0,
            mobileNumber: data.mobileNumber || '',
            username: data.username || '',
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
    getUserMastersList();
  }, [page]);

  const handleInputs = (e) => {
    // debugger;
    let { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  // to get designation
  const [designationListData, setDesignationListData] = useState([]);

  const getDesignationList = () => {
    const response = api
      .get(baseURL + `designation/get-all`)
      .then((response) => {
        setDesignationListData(response.data.content.designation);
      })
      .catch((err) => {
        setDesignationListData([]);
      });
  };

  useEffect(() => {
    getDesignationList();
  }, []);

  // to get district
    const [districtListData, setDistrictListData] = useState([]);
  
    const getDistrictList = (_id) => {
      const response = api
        .get(baseURL + `district/get-all`)
        .then((response) => {
          setDistrictListData(response.data.content.district);
        })
        .catch((err) => {
          setDistrictListData([]);
          // alert(err.response.data.errorMessages[0].message[0].message);
        });
    };
  
    useEffect(() => {
    //   if (data.stateId) {
        getDistrictList();
    //   }
    }, []);
  
    // to get taluk
    const [talukListData, setTalukListData] = useState([]);
  
    const getTalukList = (_id) => {
      const response = api
        .get(baseURL + `taluk/get-by-district-id/${_id}`)
        .then((response) => {
          setTalukListData(response.data.content.taluk);
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

  const DispatchOfCocoonsDataColumns = [
    {
      name: "Sl.No",
      selector: (row) => row.serialNumber,
      cell: (row) => <span>{row.serialNumber}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "First Name",
      selector: (row) => row.firstName,
      cell: (row) => <span>{row.firstName}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Last Name",
      selector: (row) => row.lastName,
      cell: (row) => <span>{row.lastName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "User Name",
      selector: (row) => row.username,
      cell: (row) => <span>{row.username}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Designation",
      selector: (row) => row.designationName,
      cell: (row) => <span>{row.designationName}</span>,
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
      name: "Taluk",
      selector: (row) => row.talukName,
      cell: (row) => <span>{row.talukName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "TSC",
      selector: (row) => row.tscName,
      cell: (row) => <span>{row.tscName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Mobile Number",
      selector: (row) => row.phoneNumber,
      cell: (row) => <span>{row.phoneNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "DDO Code",
      selector: (row) => row.ddoCode,
      cell: (row) => <span>{row.ddoCode || "—"}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Email",
      selector: (row) => row.emailId,
      cell: (row) => <span>{row.emailId}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Working Institution",
      selector: (row) => row.workingInstitutionName,
      cell: (row) => <span>{row.workingInstitutionName}</span>,
      sortable: true,
      hide: "md",
    },

    
  ];

  return (
    <Layout title={t("User Details Report")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("User Details Report")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent></Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1">
          <Row className="m-4">
           

           <Col sm={2}>
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          {t("Designation")}
                        </Form.Label>
                        <Col>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="designationId"
                              value={data.designationId}
                              onChange={handleInputs}
                            >
                              <option value="">{t("Select Designation")}</option>
                               {designationListData && designationListData.length
                            ? designationListData.map((list) => (
                                <option
                                  key={list.designationId}
                                  value={list.designationId}
                                >
                                  {list.name}
                                </option>
                              ))
                            : ""}
                            </Form.Select>
                            
                          </div>
                        </Col>
                      </Form.Group>
                    </Col>

                     <Col sm={2}>
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          {t("district")}
                        </Form.Label>
                        <Col>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="districtId"
                              value={data.districtId}
                              onChange={handleInputs}
                            >
                              <option value="">{t("select_district")}</option>
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
                            
                          </div>
                         </Col>
                      </Form.Group>
                    </Col>

                        <Col sm={2}>
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          {t("taluk")}
                        </Form.Label>
                        <Col>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="talukId"
                              value={data.talukId}
                              onChange={handleInputs}
                            >
                              <option value="">{t("select_taluk")}</option>
                               {talukListData && talukListData.length
                            ? talukListData.map((list) => (
                                <option key={list.talukId} value={list.talukId}>
                                  {list.talukName}
                                </option>
                              ))
                            : ""}
                            </Form.Select>
                            
                          </div>
                        </Col>
                      </Form.Group>
                    </Col>

                        
                    <Form.Label column sm={1}>
                            {t("Mobile Number")}
                        </Form.Label>
                        <Col sm={2}>
                            <Form.Control
                            id="mobileNumber"
                            name="mobileNumber"
                            value={data.mobileNumber || ""}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Mobile Number")}
                            />
                        </Col>

            
                        <Form.Label column sm={1}>
                            {t("User Name")}
                        </Form.Label>
                        <Col sm={2}>
                            <Form.Control
                            id="username"
                            name="username"
                            value={data.username || ""}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter User Name")}
                            />
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
            columns={DispatchOfCocoonsDataColumns}
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

export default UserMasterDetailsReport;
