import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { createTheme } from "react-data-table-component";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import React from "react";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next"; 
import "./CumulativeReport.css";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function CumulativeReport() {
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
    schemeId: "",
    subSchemeId: "",
    financialYearId: "",
  });


const [viewType, setViewType] = useState("SCHEME"); // default Scheme Wise


  const getSchemeWiseList = () => {
  api
    .post(
      baseURLDBT + `service/getSchemeWiseDashboardCount`,
      {},
      {
        params: {
          financialYearId: data.financialYearId || 0,
          pageNumber: page,
          pageSize: countPerPage,
        },
      }
    )
    .then((response) => {
      setListData(response.data.content);
      setTotalRows(response.data.totalRecords);
    })
    .catch(() => {
      setListData([]);
    });
};


//  useEffect(() => {
//   if (viewType === "SCHEME") {
//     getSchemeWiseList();
//   } 
// //   else 
// //     {
// //     getDistrictWiseFarmerList();
// //   }
// }, [viewType, page]);
useEffect(() => {
  if (viewType === "SCHEME") {
    getSchemeWiseList();
  }
  // else {
  //   getDistrictWiseFarmerList();
  // }
}, [viewType, page, data.financialYearId]);

const getSubSchemeWiseList = (schemeId) => {
  setSubSchemeLoading(true);

  api
    .post(
      baseURLDBT + "service/getSubSchemeWiseDashboardCount",
      {},
      {
        params: {
          schemeId: schemeId,
          financialYearId: data.financialYearId || 0,
        },
      }
    )
    .then((response) => {
      setSubSchemeData(response.data.content || []);
      setShowSubSchemeTable(true);
    })
    .catch(() => {
      setSubSchemeData([]);
    })
    .finally(() => {
      setSubSchemeLoading(false);
    });
};

useEffect(() => {
  if (showSubSchemeTable && selectedScheme?.schemeId) {
    getSubSchemeWiseList(selectedScheme.schemeId);
  }
}, [data.financialYearId]);



const exportCsv = (e) => {
    api
      .post(
        baseURLFarmer + `farmer/farmer-report`,
        {},
        {
          params: {
            districtId: data.districtId || 0,
            talukId: data.talukId || 0,
            villageId: data.villageId || 0,
            tscMasterId: data.tscMasterId || 0,
            casteId: data.casteId || 0,
            landFilter: data.landFilter || null,
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
        link.download = `farmer_report.csv`;
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


  const handleInputs = (e) => {
  const { name, value } = e.target;

  setData((prev) => ({
    ...prev,
    [name]: value,
  }));

  if (name === "financialYearId") {
    setPage(0); // reset to first page on filter change
  }
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

 

  // to get District Implementing Officer
  const [tscListData, setTscListData] = useState([]);

  const getTscList = (districtId, talukId) => {
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
      getTscList(data.districtId, data.talukId);
    }
  }, [data.districtId, data.talukId]);

  const navigate = useNavigate();
 

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
  table: {
    style: {
      backgroundColor: "transparent",
      borderRadius: "16px",
    },
  },

  headRow: {
    style: {
      background: "linear-gradient(135deg, #0f6cbe, #0f6cbe)",
      borderRadius: "16px 16px 0 0",
      minHeight: "54px",
      backdropFilter: "blur(6px)",
    },
  },

  headCells: {
    style: {
      color: "#f8fafc",
      fontSize: "12px",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      justifyContent: "center",
    },
  },

  rows: {
    style: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      marginBottom: "10px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
      border: "1px solid #e5e7eb",
      transition: "all 0.25s ease",
    },
    highlightOnHoverStyle: {
      transform: "translateY(-2px)",
      boxShadow: "0 12px 32px rgba(37,99,235,0.15)",
      backgroundColor: "#f8fafc",
      cursor: "pointer",
    },
  },

  cells: {
    style: {
      padding: "14px 16px",
      fontSize: "14px",
      fontWeight: "500",
      color: "#1f2937",
      justifyContent: "center",
    },
  },

  pagination: {
    style: {
      borderTop: "none",
      marginTop: "16px",
      padding: "12px",
      backgroundColor: "#ffffff",
      borderRadius: "0 0 16px 16px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
    },
  },
};





  const viewCardStyles = {
  base: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "22px 18px",
    textAlign: "center",
    cursor: "pointer",
    border: "2px solid transparent",
    transition: "all 0.25s ease",
    boxShadow: "0 6px 18px rgba(0, 0, 0, 0.06)",
    height: "100%",
  },

  hover: {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 28px rgba(0, 0, 0, 0.12)",
  },

  active: {
    borderColor: "#0d6efd",
    background: "linear-gradient(135deg, #f4f8ff, #ffffff)",
    boxShadow: "0 10px 30px rgba(13, 110, 253, 0.25)",
  },

  icon: {
    fontSize: "34px",
    marginBottom: "10px",
  },

  title: {
    fontWeight: 700,
    fontSize: "16px",
    color: "#212529",
  },

  subtitle: {
    fontSize: "13px",
    color: "#6c757d",
    marginTop: "4px",
  },
};

const radioToggleStyles = {
  container: {
    display: "flex",
    backgroundColor: "#f1f3f5",
    borderRadius: "14px",
    padding: "6px",
    width: "fit-content",
    boxShadow: "inset 0 2px 6px rgba(0, 0, 0, 0.08)",
  },

  pillBase: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 18px",
    fontWeight: 600,
    fontSize: "14px",
    color: "#495057",
    cursor: "pointer",
    borderRadius: "12px",
    transition: "all 0.25s ease",
    userSelect: "none",
  },

  pillHover: {
    color: "#0d6efd",
  },

  pillActive: {
    backgroundColor: "#ffffff",
    color: "#0d6efd",
    boxShadow: "0 6px 18px rgba(13, 110, 253, 0.25)",
  },

  icon: {
    fontSize: "18px",
  },
};

const getRadioPillStyle = (type) => ({
  ...radioToggleStyles.pillBase,
  ...(hovered === type ? radioToggleStyles.pillHover : {}),
  ...(viewType === type ? radioToggleStyles.pillActive : {}),
});

const filterStyles = {
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    flexWrap: "wrap",
  },

  yearWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#f8f9fa",
    padding: "6px 10px",
    borderRadius: "12px",
    boxShadow: "inset 0 2px 6px rgba(0,0,0,0.08)",
  },

  yearLabel: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#495057",
    whiteSpace: "nowrap",
  },

  yearSelect: {
    border: "none",
    outline: "none",
    background: "#ffffff",
    padding: "8px 14px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    minWidth: "140px",
  },
};



const [hovered, setHovered] = useState(null);

const getCardStyle = (type) => ({
    ...viewCardStyles.base,
    ...(hovered === type ? viewCardStyles.hover : {}),
    ...(viewType === type ? viewCardStyles.active : {}),
  });

  const [financialyearListData, setFinancialyearListData] = useState([]);
  
    const getFinancialYearList = () => {
      api
        .get(baseURL + `financialYearMaster/get-all`)
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

    const [selectedScheme, setSelectedScheme] = useState(null);
const [subSchemeData, setSubSchemeData] = useState([]);
const [showSubSchemeTable, setShowSubSchemeTable] = useState(false);
const [subSchemeLoading, setSubSchemeLoading] = useState(false);


  const FarmerDataColumns = [
    {
      name: "Sl.No",
      selector: (row) => row.serialNo,
      cell: (row) => <span>{row.serialNo}</span>,
      sortable: true,
      hide: "md",
      width: "100px",        // 👈 control column space
      center: true,         // optional: center content
    },

    {
      name: "Fin-Year",
      selector: (row) => row.financialYear,
      cell: (row) => <span>{row.financialYear}</span>,
      sortable: true,
      hide: "md",
      width: "150px", 
    },

    // {
    //   name: "Scheme Name",
    //   selector: (row) => row.schemeName,
    //   cell: (row) => <span>{row.schemeName}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    {
      name: "Scheme Name",
      selector: (row) => row.schemeName,
      cell: (row) => (
        // <span
        //   style={{
        //     color: "#0F6CBE",
        //     cursor: "pointer",
        //     fontWeight: 600,
        //     textDecoration: "underline",
        //   }}
        //   onClick={() => {
        //     setSelectedScheme(row);
        //     getSubSchemeWiseList(row.schemeId);
        //   }}
        // >
        //   {row.schemeName}
        // </span>
        <span
          className="scheme-link"
          onClick={() => {
            setSelectedScheme(row);
            getSubSchemeWiseList(row.schemeId);
          }}
        >
          {row.schemeName}
        </span>
      ),
      sortable: true,
      hide: "md",
    },
    {
      name: "Total Applications Received",
      selector: (row) => row.count,
      cell: (row) => <span className="stat-pill stat-primary">{row.count}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Total Applications Processed",
      selector: (row) => row.dbtPushedCount,
      cell: (row) => <span className="stat-pill stat-success">{row.dbtPushedCount}</span>,
      sortable: true,
      hide: "md",
    },
    
    {
      name: "Total Applications Rejected",
      selector: (row) => row.dbtRejectedCount,
      cell: (row) => <span className="stat-pill stat-danger">{row.dbtRejectedCount}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Pendency After Due Date",
      selector: (row) => row.pendencyAfterDueDate,
      cell: (row) => <span className="stat-pill stat-warning">{row.pendencyAfterDueDate}</span>,
      sortable: true,
      hide: "md",
    },
    
  ];

  const SubSchemeDataColumns = [
    {
      name: "Sl.No",
      selector: (row) => row.serialNo,
      cell: (row) => <span>{row.serialNo}</span>,
      sortable: true,
      hide: "md",
      width: "100px",        // 👈 control column space
      center: true,         // optional: center content
    },
    {
      name: "Fin-Year",
      selector: (row) => row.financialYear,
      cell: (row) => <span>{row.financialYear}</span>,
      sortable: true,
      hide: "md",
      width: "150px", 
    },

    {
      name: "Sub Scheme Name",
      selector: (row) => row.subSchemeName,
      cell: (row) => <span>{row.subSchemeName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Total Applications Received",
      selector: (row) => row.count,
      cell: (row) => <span className="stat-pill stat-primary">{row.count}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Total Applications Processed",
      selector: (row) => row.dbtPushedCount,
      cell: (row) => <span className="stat-pill stat-success">{row.dbtPushedCount}</span>,
      sortable: true,
      hide: "md",
    },
    
    {
      name: "Total Applications Rejected",
      selector: (row) => row.dbtRejectedCount,
      cell: (row) => <span className="stat-pill stat-danger">{row.dbtRejectedCount}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Pendency After Due Date",
      selector: (row) => row.pendencyAfterDueDate,
      cell: (row) => <span className="stat-pill stat-warning">{row.pendencyAfterDueDate}</span>,
      sortable: true,
      hide: "md",
    },
    
  ];

  return (
    <Layout title={t("Cumulative Report")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Cumulative Report")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent></Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
  <Card className="mt-1 p-3">
   <Row className="mb-4">
  <Col md={12}>
    <div
      style={{
        display: "flex",
        alignItems: "flex-end", // 🔥 key line
        gap: "16px",
        flexWrap: "wrap",
      }}
    >
      {/* 📅 Financial Year */}
      <div style={filterStyles.yearWrapper}>
        <span style={filterStyles.yearLabel}>
          {t("Financial Year")}
        </span>

        <Form.Select
          name="financialYearId"
          value={data.financialYearId || ""}
          onChange={handleInputs}
          style={filterStyles.yearSelect}
        >
          <option value="">{t("Select Year")}</option>
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

      {/* 🔘 Scheme / District Toggle */}
      <div
        style={{
          display: "flex",
          gap: "8px",
        }}
      >
        <div
          style={getRadioPillStyle("SCHEME")}
          onMouseEnter={() => setHovered("SCHEME")}
          onMouseLeave={() => setHovered(null)}
          onClick={() => {
            setViewType("SCHEME");
            setPage(0);
          }}
        >
          <span style={radioToggleStyles.icon}>📑</span>
          Scheme Wise
        </div>

        <div
          style={getRadioPillStyle("DISTRICT")}
          onMouseEnter={() => setHovered("DISTRICT")}
          onMouseLeave={() => setHovered(null)}
          onClick={() => {
            setViewType("DISTRICT");
            setPage(0);
          }}
        >
          <span style={radioToggleStyles.icon}>📍</span>
          District Wise
        </div>
      </div>
    </div>
  </Col>
</Row>


    {/* 📊 Data Table */}
    <DataTable
      tableClassName="data-table-head-light table-responsive"
      columns={FarmerDataColumns}
      data={listData}
      highlightOnHover
      pagination
      paginationServer
      paginationTotalRows={totalRows}
      paginationPerPage={countPerPage}
      paginationComponentOptions={{ noRowsPerPage: true }}
      onChangePage={(page) => setPage(page - 1)}
      progressPending={loading}
      theme="solarized"
      customStyles={customStyles}
    />
  </Card>

  {showSubSchemeTable && (
  <Card className="mt-4 p-3 border-primary">
    <div className="d-flex justify-content-between align-items-center mb-3">
      {/* <h5 className="fw-bold text-primary">
        📌 Sub-Scheme Details – {selectedScheme?.schemeName}
      </h5> */}
      <h5 className="fw-bold text-primary d-flex align-items-center gap-2">
        📌 <span>Sub-Scheme Details</span>
        <span className="text-muted fs-6">
          ({selectedScheme?.schemeName})
        </span>
      </h5>

      <Button
        variant="outline-secondary"
        size="sm"
        onClick={() => {
          setShowSubSchemeTable(false);
          setSubSchemeData([]);
          setSelectedScheme(null);
        }}
      >
        ✖ Close
      </Button>
    </div>

    <DataTable
      columns={SubSchemeDataColumns}
      data={subSchemeData}
      highlightOnHover
      pagination
      progressPending={subSchemeLoading}
      theme="solarized"
      customStyles={customStyles}
    />
  </Card>
)}

</Block>

    </Layout>
  );
}

export default CumulativeReport;
