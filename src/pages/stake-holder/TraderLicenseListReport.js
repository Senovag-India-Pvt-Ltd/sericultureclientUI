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

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function TraderLicenseListReport() {
  const { t } = useTranslation();
//   const [listData, setListData] = useState({});
const [listData, setListData] = useState([]);
  const [listFarmerData, setListFarmerData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 25;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
//   const _params = { params: { pageNumber: page, size: countPerPage } };
const _params = { params: { pageNumber: page, pageSize: countPerPage } };

  const [isActive, setIsActive] = useState(false);

  const [data, setData] = useState({
    districtId: "",
    traderTypeMasterId: "",
    silkType: "",
  });

  const [hobliData, setHobliData] = useState({
    hobliId: "",
  });

  // Search
  const search = (e) => {
    api
      .post(
        baseURLFarmer + `trader-license/traderLicenseList`,
        {},
        {
          params: {
  districtId: data.districtId || 0,
  traderTypeMasterId: data.traderTypeMasterId || 0,
  silkType: data.silkType ? data.silkType : null,   // FIXED
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
        baseURLFarmer + `trader-license/trader-license-report`,
        {},
        {
          params: {
            districtId: data.districtId || 0,
            traderTypeMasterId: data.traderTypeMasterId || 0,
           silkType: data.silkType || null,
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
        link.download = `trader_license_report.csv`;
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

  const getReelerList = (e) => {
    api
      .post(
        baseURLFarmer + `trader-license/traderLicenseList`,
        {},
        {
          params: {
  districtId: data.districtId || 0,
  traderTypeMasterId: data.traderTypeMasterId || 0,
  silkType: data.silkType ? data.silkType : null,  
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
    getReelerList();
  }, [page]);

//   const handleInputs = (e) => {
//     // debugger;
//     let { name, value } = e.target;
//     setData({ ...data, [name]: value });
//   };

const handleInputs = (e) => {
  let { name, value } = e.target;

  if (name === "districtId" || name === "traderTypeMasterId") {
    setData({ ...data, [name]: value === "" ? "" : Number(value) });
  } else {
    setData({ ...data, [name]: value === "" ? null : value });
  }
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

  // to get traderType Unit
    const [traderTypeListData, setTraderTypeListData] = useState([]);
  
    const getTraderTypeList = () => {
      const response = api
        .get(baseURL + `traderTypeMaster/get-all`)
        .then((response) => {
          setTraderTypeListData(response.data.content.traderTypeMaster);
        })
        .catch((err) => {
          setTraderTypeListData([]);
        });
    };
  
    useEffect(() => {
      getTraderTypeList();
    }, []);

  // to get District Implementing Officer
  const [marketListData, setMarketListData] = useState([]);

  const getMarketList = (districtId) => {
    api
      .post(baseURL + `marketMaster/get-market-by-districtId`, {
        districtId: districtId,
      })
      .then((response) => {
        setMarketListData(response.data.content.marketMaster);
      })
      .catch((err) => {
        setMarketListData([]);
      });
  };

  useEffect(() => {
    if (data.districtId) {
      // getComponentList(data.scSchemeDetailsId, data.scSubSchemeDetailsId);
      getMarketList(data.districtId);
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

  const ReelerDataColumns = [
    {
      name: "Sl.No",
      selector: (row) => row.serialNumber,
      cell: (row) => <span>{row.serialNumber}</span>,
      sortable: true,
      hide: "md",
    },

   {
      name: t("ARN Number"),
      selector: (row) => row.arnNumber,
      cell: (row) => <span>{row.arnNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Trader Type"),
      selector: (row) => row.traderTypeMasterName,
      cell: (row) => <span>{row.traderTypeMasterName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Name of the Applicant"),
      selector: (row) => row.firstName,
      cell: (row) => <span>{row.firstName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("mobile_number"),
      selector: (row) => row.mobileNumber,
      cell: (row) => <span>{row.mobileNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("address"),
      selector: (row) => row.address,
      cell: (row) => <span>{row.address}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("District Name"),
      selector: (row) => row.districtName,
      cell: (row) => <span>{row.districtName}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: t("Silk Type"),
      selector: (row) => row.silkType,
      cell: (row) => <span>{row.silkType}</span>,
      sortable: true,
      hide: "md",
    },

    
    {
      name: t("Trader License Number"),
      selector: (row) => row.traderLicenseNumber,
      cell: (row) => <span>{row.traderLicenseNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Virtual Account Number"),
      selector: (row) => row.virtualAccountNumber,
      cell: (row) => <span>{row.virtualAccountNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Branch Name"),
      selector: (row) => row.branchName,
      cell: (row) => <span>{row.branchName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("IFSC Code"),
      selector: (row) => row.ifscCode,
      cell: (row) => <span>{row.ifscCode}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Market"),
      selector: (row) => row.marketMasterName,
      cell: (row) => <span>{row.marketMasterName}</span>,
      sortable: true,
      hide: "md",
    },
  ];

//   return (
//     <Layout title={t("Renewal of Reeler License Report")}>
//       <Block.Head>
//         <Block.HeadBetween>
//           <Block.HeadContent>
//             <Block.Title tag="h2">{t("Renewal of Reeler License Report")}</Block.Title>
//           </Block.HeadContent>
//           <Block.HeadContent></Block.HeadContent>
//         </Block.HeadBetween>
//       </Block.Head>

//       <Block className="mt-n4">
//         <Card className="mt-1">
//           {/* <Row className="m-4"> */}
//             {/* <Col sm={2}>
//               <Form.Group className="form-group mt-n4">
//                 <Form.Label>{t("District")}</Form.Label>
//                 <div className="form-control-wrap">
//                   <Form.Select
//                     name="districtId"
//                     value={data.districtId}
//                     onChange={handleInputs}
//                     onBlur={() => handleInputs}
//                     isInvalid={
//                       data.districtId === undefined || data.districtId === "0"
//                     }
//                   >
//                     <option value="">{t("Select District")}</option>
//                     {districtListData && districtListData.length
//                       ? districtListData.map((list) => (
//                           <option key={list.districtId} value={list.districtId}>
//                             {list.districtName}
//                           </option>
//                         ))
//                       : ""}
//                   </Form.Select>
//                   <Form.Control.Feedback type="invalid">
//                     {t("District Name is required")}
//                   </Form.Control.Feedback>
//                 </div>
//               </Form.Group>
//             </Col>

//            <Form.Group className="form-group">
//                       <Form.Label>
//                         {t("Trader Type")}<span className="text-danger">*</span>
//                       </Form.Label>
//                       <div className="form-control-wrap">
//                         <Form.Select
//                           name="traderTypeMasterId"
//                           value={data.traderTypeMasterId}
//                           onChange={handleInputs}
//                           onBlur={() => handleInputs}
//                           required
//                           isInvalid={
//                             data.traderTypeMasterId === undefined ||
//                             data.traderTypeMasterId === "0"
//                           }
//                         >
//                           <option value="">{t("Select Trader Type")}</option>
//                           {traderTypeListData.map((list) => (
//                             <option
//                               key={list.traderTypeMasterId}
//                               value={list.traderTypeMasterId}
//                             >
//                               {list.traderTypeMasterName}
//                             </option>
//                           ))}
//                         </Form.Select>
//                         <Form.Control.Feedback type="invalid">
//                           {t("Trader Type is required")}
//                         </Form.Control.Feedback>
//                       </div>
//                     </Form.Group>


            

//             <Col lg="6">
//                                 <Form.Group className="form-group">
//                                     <Form.Label>{t("Silk Type")}</Form.Label>
//                                     <div className="form-control-wrap">
//                                       <Form.Select
//                                         name="silkType"
//                                         value={data.silkType}
//                                         onChange={handleInputs}
//                                       >
//                                         <option value="">{t("Select Silk Type")}</option>
//                                         <option value="Raw Silk">Raw Silk</option>
//                                         <option value="Twisted">Twisted</option>
//                                         <option value="Dupion">Dupion</option>
//                                       </Form.Select>
//                                     </div>
//                                   </Form.Group>
//                               </Col> */}

//                               {/* ✅ Put all three dropdowns inside a single Row */}
// <Row className="m-4">
//   {/* District Dropdown */}
//   <Col sm={4}>
//     <Form.Group className="form-group">
//       <Form.Label>{t("District")}</Form.Label>
//       <div className="form-control-wrap">
//         <Form.Select
//           name="districtId"
//           value={data.districtId}
//           onChange={handleInputs}
//           isInvalid={data.districtId === undefined || data.districtId === "0"}
//         >
//           <option value="">{t("Select District")}</option>
//           {districtListData && districtListData.length
//             ? districtListData.map((list) => (
//                 <option key={list.districtId} value={list.districtId}>
//                   {list.districtName}
//                 </option>
//               ))
//             : ""}
//         </Form.Select>
//         <Form.Control.Feedback type="invalid">
//           {t("District Name is required")}
//         </Form.Control.Feedback>
//       </div>
//     </Form.Group>
//   </Col>

//   {/* Trader Type Dropdown */}
//   <Col sm={4}>
//     <Form.Group className="form-group">
//       <Form.Label>
//         {t("Trader Type")} <span className="text-danger">*</span>
//       </Form.Label>
//       <div className="form-control-wrap">
//         <Form.Select
//           name="traderTypeMasterId"
//           value={data.traderTypeMasterId}
//           onChange={handleInputs}
//           required
//           isInvalid={
//             data.traderTypeMasterId === undefined ||
//             data.traderTypeMasterId === "0"
//           }
//         >
//           <option value="">{t("Select Trader Type")}</option>
//           {traderTypeListData.map((list) => (
//             <option
//               key={list.traderTypeMasterId}
//               value={list.traderTypeMasterId}
//             >
//               {list.traderTypeMasterName}
//             </option>
//           ))}
//         </Form.Select>
//         <Form.Control.Feedback type="invalid">
//           {t("Trader Type is required")}
//         </Form.Control.Feedback>
//       </div>
//     </Form.Group>
//   </Col>

//   {/* Silk Type Dropdown */}
//   <Col sm={4}>
//     <Form.Group className="form-group">
//       <Form.Label>{t("Silk Type")}</Form.Label>
//       <div className="form-control-wrap">
//         <Form.Select
//           name="silkType"
//           value={data.silkType}
//           onChange={handleInputs}
//         >
//           <option value="">{t("Select Silk Type")}</option>
//           <option value="Raw Silk">Raw Silk</option>
//           <option value="Twisted">Twisted</option>
//           <option value="Dupion">Dupion</option>
//         </Form.Select>
//       </div>
//     </Form.Group>
//   </Col>
// </Row>


            
//             <Col sm={1}>
//               <Button type="button" variant="primary" onClick={search}>
//                 {t("Search")}
//               </Button>
//             </Col>
//             <Col sm={1}>
//               <Button type="button" variant="primary" onClick={exportCsv}>
//                 {t("Export")}
//               </Button>
//             </Col>
//           </Row>
//           <DataTable
//             tableClassName="data-table-head-light table-responsive"
//             columns={ReelerDataColumns}
//             data={listData}
//             highlightOnHover
//             pagination
//             paginationServer
//             paginationTotalRows={totalRows}
//             paginationPerPage={countPerPage}
//             paginationComponentOptions={{
//               noRowsPerPage: true,
//             }}
//             onChangePage={(page) => setPage(page - 1)}
//             progressPending={loading}
//             theme="solarized"
//             customStyles={customStyles}
//           />
//         </Card>
//       </Block>
//     </Layout>
//   );
// }

// export default TraderLicenseListReport;

return (
    <Layout title={t("Trader License Report")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {t("Trader License Report")}
            </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent></Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1">
          {/* ✅ All dropdowns & buttons in a single Row */}
          <Row className="m-4">
            {/* District Dropdown */}
            <Col sm={3}>
              <Form.Group className="form-group">
                <Form.Label>{t("District")}</Form.Label>
                <div className="form-control-wrap">
                  <Form.Select
                    name="districtId"
                    value={data.districtId}
                    onChange={handleInputs}
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
            </Col>

            {/* Trader Type Dropdown */}
            <Col sm={3}>
              <Form.Group className="form-group">
                <Form.Label>
                  {t("Trader Type")} <span className="text-danger">*</span>
                </Form.Label>
                <div className="form-control-wrap">
                  <Form.Select
                    name="traderTypeMasterId"
                    value={data.traderTypeMasterId}
                    onChange={handleInputs}
                    required
                    isInvalid={
                      data.traderTypeMasterId === undefined ||
                      data.traderTypeMasterId === "0"
                    }
                  >
                    <option value="">{t("Select Trader Type")}</option>
                    {traderTypeListData.map((list) => (
                      <option
                        key={list.traderTypeMasterId}
                        value={list.traderTypeMasterId}
                      >
                        {list.traderTypeMasterName}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {t("Trader Type is required")}
                  </Form.Control.Feedback>
                </div>
              </Form.Group>
            </Col>

            {/* Silk Type Dropdown */}
            <Col sm={3}>
              <Form.Group className="form-group">
                <Form.Label>{t("Silk Type")}</Form.Label>
                <div className="form-control-wrap">
                  <Form.Select
                    name="silkType"
                    value={data.silkType}
                    onChange={handleInputs}
                  >
                    <option value="">{t("Select Silk Type")}</option>
                    <option value="Raw Silk">Raw Silk</option>
                    <option value="Twisted">Twisted</option>
                    <option value="Dupion">Dupion</option>
                  </Form.Select>
                </div>
              </Form.Group>
            </Col>

            {/* Search Button */}
            <Col sm={1} className="d-flex align-items-end">
              <Button type="button" variant="primary" onClick={search}>
                {t("Search")}
              </Button>
            </Col>

            {/* Export Button */}
            <Col sm={1} className="d-flex align-items-end">
              <Button type="button" variant="primary" onClick={exportCsv}>
                {t("Export")}
              </Button>
            </Col>
          </Row>

          {/* ✅ Data Table */}
          <DataTable
            tableClassName="data-table-head-light table-responsive"
            columns={ReelerDataColumns}
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

export default TraderLicenseListReport;
