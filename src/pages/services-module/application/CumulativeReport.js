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

const [showDivisionTable, setShowDivisionTable] = useState(false);
const [divisionData, setDivisionData] = useState([]);
const [selectedSubScheme, setSelectedSubScheme] = useState(null);

const [showDistrictTable, setShowDistrictTable] = useState(false);
const [districtData, setDistrictData] = useState([]);
const [selectedDivision, setSelectedDivision] = useState(null);

const [showTscTable, setShowTscTable] = useState(false);
const [tscData, setTscData] = useState([]);
const [selectedDistrict, setSelectedDistrict] = useState(null);

const tscMasterList = [
  "Test", "Devanahalli", "Yaliyur", "Chintamani", "Ronuru",
  "Honganur", "Vijayapura R", "Kodambali", "Hosakote", "Nandagudi",
  "Thittamaranahalli", "Doddalahalli", "Doddaballapur", "Kanakpur",
  "Tubagere", "Santekodihalli", "Nelamangala", "Kanakapur R",
  "Bannikuppe", "Ramanagara R", "Lakshmipur", "Cikkajala",
  "Yalahanka", "Chikkaballapur", "Kengeri", "Kaiwara", "K R Pete",
  "Bookanakere", "Yagavakote", "Kikkeri", "Shidlaghatta",
  "Shidlaghatta R", "Gauribidanur", "Darinayakanapalya", "Bagepally",
  "Cheluru", "Gudibande", "Byadagi", "Nagamangala", "Hangal",
  "Hirekerur", "Chinya", "Baburayanakoppal", "Ranebennur",
  "Savanur", "Mandya", "Keragodu", "Koppa", "Belakavadi",
  "Byrakur", "Yeldur", "Kolar", "Vemagal", "Chitradurga",
  "Chitradurga R", "Hosadurga", "Holakere", "Heriyur",
  "Challakere", "Parashrampura", "Molakalmoor", "Bellary R",
  "Hagari bommanahalli", "Kaluburgi", "Afjalpura", "Bhadravathi",
  "Hosanagra", "Chikkaballapura", "Nandhi", "Kaivara",
  "Chintamani R", "Gowribidanur", "Bagepalli", "Yelduru",
  "Kasaba", "Rayalpad", "Muthakapalli", "Bevur", "Jadigenahalli",
  "Sulibele", "Doddamaralavadi", "Harohalli", "Mayaganahalli",
  "Shanubhoganahalli", "Nandi", "Andarlahalli", "Enigadele",
  "Dibburuhalli", "Sheelanere", "Melur", "Jangamkote",
  "Varthur", "Anekal", "Pandavapura", "Bellale", "Haveri",
  "Shiggaon", "Doddagarudanahalli", "Mandya R", "K M Doddi",
  "Toreshettyhalli", "Malavalli", "Halaguru", "Halasahalli",
  "Purigali", "H H Koppalu", "Mulbagilu", "Tayalur",
  "Srinivasapura", "Gownipalli", "Holoor", "Vakkaleri",
  "Kolar R", "Bangarpet", "Kamasamudra", "Bethamangala",
  "Malur", "Masti", "Tekal", "Suliya", "Kaluburgi R",
  "Alanda", "Madanahepparaga", "Hoovenahadagali", "Hosapet",
  "Kudligi", "Hosahalli", "Sandoor", "Jevargi",
  "S N Hipparaga", "Shikaripura", "Shivamoga", "Haranahalli",
  "Miloor", "Chelur", "Harave", "Kuderu", "ChIlakavadi",
  "Hanooru", "Kamagere", "Palya", "Ramapura",
  "Chamarajanagra", "Vedeyarapalya", "Kollegala Reeling",
  "Honnuru", "Davanagere", "Yalanduru", "Jagalur",
  "Channagiri", "Tumakur", "Tumakur Reeling", "Madhugiri",
  "KodIgenahalli", "Holuvanahalli", "Koratgere", "Pavagada",
  "Y N Hosakote", "Chikkanayakanahalli", "Baraguru",
  "Tipturu", "Chikkamagaluru", "Kaduru", "Narshimhapura",
  "Aluru", "Beluru", "Arsikere", "Holenarasipura",
  "Hallymysore", "Shilanare", "Kadakola", "Bannur", "Muguru"
];

const TscDataColumns = [
  {
    name: "Sl.No",
    selector: (row) => row.serialNo,
    width: "100px",
    center: true,
  },
  {
    name: "TSC Name",
    selector: (row) => row.tscName,
    sortable: true,
  },
  {
    name: "Total Applications Received",
    selector: (row) => row.count,
    cell: (row) => (
      <span className="stat-pill stat-primary">{row.count}</span>
    ),
  },
  {
    name: "Total Applications Processed",
    selector: (row) => row.dbtPushedCount,
    cell: (row) => (
      <span className="stat-pill stat-success">{row.dbtPushedCount}</span>
    ),
  },
  {
    name: "Total Applications Rejected",
    selector: (row) => row.dbtRejectedCount,
    cell: (row) => (
      <span className="stat-pill stat-danger">{row.dbtRejectedCount}</span>
    ),
  },
  {
    name: "Pendency After Due Date",
    selector: (row) => row.pendencyAfterDueDate,
    cell: (row) => (
      <span className="stat-pill stat-warning">
        {row.pendencyAfterDueDate}
      </span>
    ),
  },
];

const getTscDataByDistrict = (districtRow) => {
  return tscMasterList.map((name, index) => {
    // realistic dummy numbers
    const total = Math.floor(Math.random() * 40) + 20; // 20–60
    const processed = Math.floor(total * (0.6 + Math.random() * 0.3)); // 60–90%
    const rejected = Math.floor((total - processed) * 0.3); // some rejected
    const pending = total - processed - rejected;

    return {
      serialNo: index + 1,
      tscName: name,

      count: total,
      dbtPushedCount: processed,
      dbtRejectedCount: rejected,
      pendencyAfterDueDate: pending,
    };
  });
};




const divisionDistrictMap = {
  BANGALORE: [
    "Bengaluru Urban",
    "Bengaluru Rural",
    "Ramanagara",
    "Kolar",
    "Chikkaballapur",
  ],
  BELAGAVI: [
    "Belagavi",
    "Bagalkot",
    "Vijayapura",
    "Gadag",
    "Dharwad",
    "Haveri",
  ],
  MYSORE: [
    "Mysuru",
    "Mandya",
    "Hassan",
    "Kodagu",
    "Chamarajanagar",
  ],
  KALABURAGI: [
    "Kalaburagi",
    "Bidar",
    "Yadgir",
    "Raichur",
    "Koppal",
    "Ballari",
    "Vijayanagara",
  ],
  "MYSORE SEED AREA": [
    "Mysuru Seed Area – 1",
    "Mysuru Seed Area – 2",
  ],
};

const getDistrictWiseDataByDivision = (divisionRow) => {
  const districts = divisionDistrictMap[divisionRow.divisionName] || [];

  const districtCount = districts.length || 1;

  return districts.map((district, index) => ({
    serialNo: index + 1,
    districtName: district,

    // distribute division counts (simple split)
    count: Math.floor(divisionRow.count / districtCount),
    dbtPushedCount: Math.floor(divisionRow.dbtPushedCount / districtCount),
    dbtRejectedCount: Math.floor(divisionRow.dbtRejectedCount / districtCount),
    pendencyAfterDueDate: Math.floor(
      divisionRow.pendencyAfterDueDate / districtCount
    ),
  }));
};



const getDivisionWiseHardcodedData = () => {
  return [
    {
      serialNo: 1,
      divisionName: "BANGALORE",
      count: 120,
      dbtPushedCount: 90,
      dbtRejectedCount: 20,
      pendencyAfterDueDate: 10,
    },
    {
      serialNo: 2,
      divisionName: "BELAGAVI",
      count: 80,
      dbtPushedCount: 60,
      dbtRejectedCount: 10,
      pendencyAfterDueDate: 10,
    },
    {
      serialNo: 3,
      divisionName: "MYSORE",
      count: 70,
      dbtPushedCount: 55,
      dbtRejectedCount: 5,
      pendencyAfterDueDate: 10,
    },
    {
      serialNo: 4,
      divisionName: "KALABURAGI",
      count: 65,
      dbtPushedCount: 40,
      dbtRejectedCount: 15,
      pendencyAfterDueDate: 10,
    },
    {
      serialNo: 5,
      divisionName: "MYSORE SEED AREA",
      count: 50,
      dbtPushedCount: 35,
      dbtRejectedCount: 5,
      pendencyAfterDueDate: 10,
    },
  ];
};



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

  const DistrictDataColumns = [
  {
    name: "Sl.No",
    selector: (row) => row.serialNo,
    width: "100px",
    center: true,
  },
  {
  name: "District Name",
  selector: (row) => row.districtName,
  cell: (row) => (
    <span
      className="scheme-link"
      onClick={() => {
        setSelectedDistrict(row);
        setTscData(getTscDataByDistrict(row));
        setShowTscTable(true);
        setShowDistrictTable(false);
      }}
    >
      {row.districtName}
    </span>
  ),
},
  {
    name: "Total Applications Received",
    selector: (row) => row.count,
    cell: (row) => <span className="stat-pill stat-primary">{row.count}</span>,
  },
  {
    name: "Total Applications Processed",
    selector: (row) => row.dbtPushedCount,
    cell: (row) => <span className="stat-pill stat-success">{row.dbtPushedCount}</span>,
  },
  {
    name: "Total Applications Rejected",
    selector: (row) => row.dbtRejectedCount,
    cell: (row) => <span className="stat-pill stat-danger">{row.dbtRejectedCount}</span>,
  },
  {
    name: "Pendency After Due Date",
    selector: (row) => row.pendencyAfterDueDate,
    cell: (row) => <span className="stat-pill stat-warning">{row.pendencyAfterDueDate}</span>,
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

    // {
    //   name: "Sub Scheme Name",
    //   selector: (row) => row.subSchemeName,
    //   cell: (row) => <span>{row.subSchemeName}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    {
        name: "Sub Scheme Name",
        selector: (row) => row.subSchemeName,
        cell: (row) => (
          <span
            className="scheme-link"
            onClick={() => {
              resetAllTables();  
              setSelectedSubScheme(row);
              setDivisionData(getDivisionWiseHardcodedData());
              setShowDivisionTable(true);
              setShowSubSchemeTable(false);
            }}
          >
            {row.subSchemeName}
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

  const DivisionDataColumns = [
  {
    name: "Sl.No",
    selector: (row) => row.serialNo,
    width: "100px",
    center: true,
  },
  {
  name: "Division Name",
  selector: (row) => row.divisionName,
  cell: (row) => (
    <span
      className="scheme-link"
      onClick={() => {
        setSelectedDivision(row);
        setDistrictData(getDistrictWiseDataByDivision(row));
        setShowDistrictTable(true);
        setShowDivisionTable(false);
      }}
    >
      {row.divisionName}
    </span>
  ),
},
  {
    name: "Total Applications Received",
    selector: (row) => row.count,
    cell: (row) => <span className="stat-pill stat-primary">{row.count}</span>,
  },
  {
    name: "Total Applications Processed",
    selector: (row) => row.dbtPushedCount,
    cell: (row) => <span className="stat-pill stat-success">{row.dbtPushedCount}</span>,
  },
  {
    name: "Total Applications Rejected",
    selector: (row) => row.dbtRejectedCount,
    cell: (row) => <span className="stat-pill stat-danger">{row.dbtRejectedCount}</span>,
  },
  {
    name: "Pendency After Due Date",
    selector: (row) => row.pendencyAfterDueDate,
    cell: (row) => <span className="stat-pill stat-warning">{row.pendencyAfterDueDate}</span>,
  },
];

const resetAllTables = () => {
  setShowSubSchemeTable(false);
  setShowDivisionTable(false);
  setShowDistrictTable(false);
  setShowTscTable(false);
  setShowDistrictWiseTable(false);
  setShowDistrictSubSchemeTable(false);
};



const [districtWiseData, setDistrictWiseData] = useState([]);
const [showDistrictWiseTable, setShowDistrictWiseTable] = useState(false);

const [districtSubSchemeData, setDistrictSubSchemeData] = useState([]);
const [showDistrictSubSchemeTable, setShowDistrictSubSchemeTable] = useState(false);
const [selectedDistrictWise, setSelectedDistrictWise] = useState(null);


const loadDistrictWiseData = () => {
  setDistrictWiseData([
    {
      serialNo: 1,
      districtName: "Bengaluru Urban",
      count: 500,
      dbtPushedCount: 380,
      dbtRejectedCount: 70,
      pendencyAfterDueDate: 50,
    },
    {
      serialNo: 2,
      districtName: "Bengaluru Rural",
      count: 360,
      dbtPushedCount: 260,
      dbtRejectedCount: 50,
      pendencyAfterDueDate: 50,
    },
    {
      serialNo: 3,
      districtName: "Mysuru",
      count: 420,
      dbtPushedCount: 300,
      dbtRejectedCount: 60,
      pendencyAfterDueDate: 60,
    },
    {
      serialNo: 4,
      districtName: "Mandya",
      count: 310,
      dbtPushedCount: 220,
      dbtRejectedCount: 40,
      pendencyAfterDueDate: 50,
    },
    {
      serialNo: 5,
      districtName: "Tumakuru",
      count: 340,
      dbtPushedCount: 240,
      dbtRejectedCount: 45,
      pendencyAfterDueDate: 55,
    },
    {
      serialNo: 6,
      districtName: "Hassan",
      count: 330,
      dbtPushedCount: 235,
      dbtRejectedCount: 40,
      pendencyAfterDueDate: 55,
    },
    {
      serialNo: 7,
      districtName: "Shivamogga",
      count: 295,
      dbtPushedCount: 210,
      dbtRejectedCount: 35,
      pendencyAfterDueDate: 50,
    },
    {
      serialNo: 8,
      districtName: "Davanagere",
      count: 280,
      dbtPushedCount: 200,
      dbtRejectedCount: 30,
      pendencyAfterDueDate: 50,
    },
    {
      serialNo: 9,
      districtName: "Belagavi",
      count: 390,
      dbtPushedCount: 280,
      dbtRejectedCount: 50,
      pendencyAfterDueDate: 60,
    },
    {
      serialNo: 10,
      districtName: "Vijayapura",
      count: 260,
      dbtPushedCount: 180,
      dbtRejectedCount: 35,
      pendencyAfterDueDate: 45,
    },
    {
      serialNo: 11,
      districtName: "Ballari",
      count: 275,
      dbtPushedCount: 195,
      dbtRejectedCount: 35,
      pendencyAfterDueDate: 45,
    },
    {
      serialNo: 12,
      districtName: "Kalaburagi",
      count: 300,
      dbtPushedCount: 200,
      dbtRejectedCount: 40,
      pendencyAfterDueDate: 60,
    },
    {
      serialNo: 13,
      districtName: "Raichur",
      count: 245,
      dbtPushedCount: 165,
      dbtRejectedCount: 30,
      pendencyAfterDueDate: 50,
    },
    {
      serialNo: 14,
      districtName: "Koppal",
      count: 230,
      dbtPushedCount: 155,
      dbtRejectedCount: 25,
      pendencyAfterDueDate: 50,
    },
    {
      serialNo: 15,
      districtName: "Chitradurga",
      count: 255,
      dbtPushedCount: 175,
      dbtRejectedCount: 30,
      pendencyAfterDueDate: 50,
    },
  ]);
};


const DistrictWiseColumns = [
  {
    name: "Sl.No",
    selector: (row) => row.serialNo,
    width: "80px",
    center: true,
  },
  {
    name: "District Name",
    selector: (row) => row.districtName,
    cell: (row) => (
      <span
        className="scheme-link"
       onClick={() => {
      resetAllTables(); // 🔥 IMPORTANT

      setSelectedDistrictWise(row);
      setDistrictSubSchemeData(getSubSchemeDataForDistrict(row));

      setShowDistrictSubSchemeTable(true); // 🔥 only this stays
    }}
      >
        {row.districtName}
      </span>
    ),
  },
  {
    name: "Total Applications Received",
    selector: (row) => row.count,
    cell: (row) => <span className="stat-pill stat-primary">{row.count}</span>,
  },
  {
    name: "Total Applications Processed",
    selector: (row) => row.dbtPushedCount,
    cell: (row) => <span className="stat-pill stat-success">{row.dbtPushedCount}</span>,
  },
  {
    name: "Total Applications Rejected",
    selector: (row) => row.dbtRejectedCount,
    cell: (row) => <span className="stat-pill stat-danger">{row.dbtRejectedCount}</span>,
  },
  {
    name: "Pendency After Due Date",
    selector: (row) => row.pendencyAfterDueDate,
    cell: (row) => <span className="stat-pill stat-warning">{row.pendencyAfterDueDate}</span>,
  },
];

const subSchemeMasterList = [
  "Subsidy For Construction of Rearing House (1000 sq ft)",
  "NA",
  "Per Drop More Crop (PDMC)",
  "Central State Mandatory",
  "Bonus for BIVOLTINE/Bivoltine Cocoons",
  "Incentive for Bivoltine Cocoons",
  "North Karnataka Cocoon Transportation lncentive",
  "Pure Mysore Bonus - Rs.225 Per Kg",
  "Rearing Equipment SDP",
  "Rearing Equipment SS",
  "Rearing House",
  "Reeling Shed SDP",
  "Reeling Shed PSF",
  "Subsidy For Construction of Rearing House (600 sq ft)",
  "Multi End Reeling Machinery MERM",
  "Multi End Reeling Machinery MERM-SDP",
  "Improved Cottage Basin (ICB)-SDP",
  "Subsidy for Adopting Boiler-SDP",
  "Subsidy For Adopting Boiler-PSF",
  "Adopting Silent Generator-PSF",
  "Adopting Solar power Generator-SDP",
  "Adopting Solar Water Heater-PSF",
  "Adopting Heat Recovery Unit-PSF",
  "Silk Incentive-PSF",
  "Silk Incentive-SDP",
  "Silk Incentive",
  "Bivoltine Chawki Incentive",
  "MSC Chawki incentive Unit cost for 100 DFLs Rs.1500",
  "Registered Private Bivoltine Chawki Rearing Center Subsidy",
  "Drip Irrigation State Top Up (PMKSY)",
  "Incentive for MSC Cocoons Rs 120 per Kg",
  "Rearing House SS",
  "Improved Cottage Basin (ICB)-PSF",
  "Italian Model Cottage Basin (IMCB)-SDP",
  "Italian Model Cottage Basin (IMCB)-PSF",
  "Multi End Reeling Machinery MERM-PSF",
];

const getSubSchemeDataForDistrict = (districtRow) => {
  const size = subSchemeMasterList.length;

  return subSchemeMasterList.map((name, index) => ({
    serialNo: index + 1,
    subSchemeName: name,
    count: Math.floor(districtRow.count / size),
    dbtPushedCount: Math.floor(districtRow.dbtPushedCount / size),
    dbtRejectedCount: Math.floor(districtRow.dbtRejectedCount / size),
    pendencyAfterDueDate: Math.floor(
      districtRow.pendencyAfterDueDate / size
    ),
  }));
};


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

          // 🔥 RESET DISTRICT FLOW
          setShowDistrictWiseTable(false);
          setShowDistrictSubSchemeTable(false);
          setSelectedDistrictWise(null);

          // Scheme table will show by default
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
        resetAllTables(); // 🔥

          setShowDistrictWiseTable(true);
          loadDistrictWiseData();
                  }}

        >
          <span style={radioToggleStyles.icon}>📍</span>
          All Schemes Consolidated
        </div>
      </div>
    </div>
  </Col>
</Row>


    {/* 📊 Data Table */}
    {viewType === "SCHEME" &&
 !showSubSchemeTable &&
 !showDivisionTable &&
 !showDistrictTable &&
 !showTscTable && (
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
    )}
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

{showDivisionTable && (
  <Card className="mt-4 p-3 border-success">
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h5 className="fw-bold text-success">
        📍 Division Details
        <span className="text-muted fs-6">
          {" "}({selectedSubScheme?.subSchemeName})
        </span>
      </h5>

      <Button
        variant="outline-secondary"
        size="sm"
        onClick={() => {
          setShowDivisionTable(false);
          setDivisionData([]);
          setShowSubSchemeTable(true);
        }}
      >
        ⬅ Back
      </Button>
    </div>

    <DataTable
      columns={DivisionDataColumns}
      data={divisionData}
      highlightOnHover
      pagination
      theme="solarized"
      customStyles={customStyles}
    />
  </Card>
)}

{showDistrictTable && (
  <Card className="mt-4 p-3 border-info">
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h5 className="fw-bold text-info">
        🏙️ District Details
        <span className="text-muted fs-6">
          {" "}({selectedDivision?.divisionName})
        </span>
      </h5>

      <Button
        variant="outline-secondary"
        size="sm"
        onClick={() => {
          setShowDistrictTable(false);
          setDistrictData([]);
          setShowDivisionTable(true);
        }}
      >
        ⬅ Back
      </Button>
    </div>

    <DataTable
      columns={DistrictDataColumns}
      data={districtData}
      highlightOnHover
      pagination
      theme="solarized"
      customStyles={customStyles}
    />
  </Card>
)}

{showTscTable && (
  <Card className="mt-4 p-3 border-dark">
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h5 className="fw-bold">
        🧵 TSC Details
        <span className="text-muted fs-6">
          {" "}({selectedDistrict?.districtName})
        </span>
      </h5>

      <Button
        variant="outline-secondary"
        size="sm"
        onClick={() => {
          setShowTscTable(false);
          setTscData([]);

          // show District back
          setShowDistrictTable(true);
        }}
      >
        ⬅ Back
      </Button>
    </div>

    <DataTable
      columns={TscDataColumns}
      data={tscData}
      highlightOnHover
      pagination
      theme="solarized"
      customStyles={customStyles}
    />
  </Card>
)}

{showDistrictSubSchemeTable && (
  <Card className="mt-4 p-3 border-primary">
    <div className="d-flex justify-content-between mb-3">
      <h5 className="fw-bold text-primary">
        📌 Sub-Scheme Details
        <span className="text-muted fs-6">
          {" "}({selectedDistrictWise?.districtName})
        </span>
      </h5>

      <Button
        size="sm"
        variant="outline-secondary"
        onClick={() => {
          setShowDistrictSubSchemeTable(false);
          setShowDistrictWiseTable(true);
        }}
      >
        ⬅ Back
      </Button>
    </div>

    <DataTable
      columns={SubSchemeDataColumns}
      data={districtSubSchemeData}
      pagination
      highlightOnHover
      theme="solarized"
      customStyles={customStyles}
    />
  </Card>
)}

{viewType === "DISTRICT" && showDistrictWiseTable && (
  <DataTable
    columns={DistrictWiseColumns}
    data={districtWiseData}
    pagination
    highlightOnHover
    theme="solarized"
    customStyles={customStyles}
  />
)}


</Block>

    </Layout>
  );
}

export default CumulativeReport;
