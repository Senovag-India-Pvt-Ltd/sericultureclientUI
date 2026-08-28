import React, { useState, useEffect } from "react";
import { Card, Button, Col, Row, Form } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import DataTable from "../../../components/AppDataTable";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../../../src/services/auth/api";
import { Icon } from "../../../components";
import { createTheme } from "react-data-table-component";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

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
  "light",
);
// 🔥 TABLE STYLE
const customStyles = {
  table: { style: { borderRadius: "10px", overflow: "hidden", boxShadow: "0 2px 8px rgba(30, 103, 168, 0.06)" } },
  rows: {
    style: { minHeight: "52px", fontSize: "13.5px", color: "#2b2d42", borderBottom: "1px solid #eef1f6 !important", transition: "background-color 0.15s ease" },
    highlightOnHoverStyle: { backgroundColor: "#f4f8fd", cursor: "pointer", outline: "none" },
    stripedStyle: { backgroundColor: "#fbfcfe" },
  },
  headRow: { style: { minHeight: "50px", background: "linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%)", borderTopLeftRadius: "10px", borderTopRightRadius: "10px" } },
  headCells: {
    style: {
      backgroundColor: "transparent",
      color: "#fff",
      fontSize: "13px",
      fontWeight: 600,
      letterSpacing: "0.3px",
      textTransform: "uppercase",
      paddingLeft: "12px",
      paddingRight: "12px",
    },
  },
  cells: {
    style: {
      paddingLeft: "12px",
      paddingRight: "12px",
    },
  },
  pagination: { style: { borderTop: "1px solid #eef1f6", fontSize: "13px", color: "#5a6577" } },
};
function UserHierarchyMappingList() {
  // Translation
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    designationId: "",
    districtId: "",
    userId: "",
  });

  const [designationList, setDesignationList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [userList, setUserList] = useState([]);

  const [fullData, setFullData] = useState([]);
  const [managerData, setManagerData] = useState([]);
  const [reporteesData, setReporteesData] = useState([]);
  const [showTable, setShowTable] = useState(false);

  // ---------------- INPUT ----------------
  const handleInputs = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // ---------------- LOAD DROPDOWNS ----------------
  useEffect(() => {
    api
      .get(baseURL + "designation/get-all")
      .then((res) => setDesignationList(res.data.content.designation || []))
      .catch(() => setDesignationList([]));

    api
      .get(baseURL + "district/get-all")
      .then((res) => setDistrictList(res.data.content.district || []))
      .catch(() => setDistrictList([]));
  }, []);

  // ---------------- USER LIST ----------------
  useEffect(() => {
    if (filters.designationId && filters.districtId) {
      api
        .post(baseURL + "userMaster/get-by-designationId-and-districtId", {
          designationId: filters.designationId,
          districtId: filters.districtId,
        })
        .then((res) => setUserList(res.data.content.userMaster || []))
        .catch(() => setUserList([]));
    }
  }, [filters.designationId, filters.districtId]);

  // ---------------- SEARCH ----------------
  const search = () => {
    if (!filters.userId) {
      Swal.fire("Please select user");
      return;
    }

    api
      .get(
        baseURL + "userHierarchyMapping/list-with-join?pageNumber=0&size=100",
      )
      .then((res) => {
        const list = res.data.content.userHierarchyMapping || [];

        // ✅ Manager (ONLY ONE)
        const managerMap = new Map();

        list.forEach((item) => {
          if (item.employeeId == filters.userId) {
            managerMap.set(item.employeeId, item); // unique by employee
          }
        });

        const manager = Array.from(managerMap.values());

        // ✅ Reportees (UNIQUE)
        const reporteeMap = new Map();

        list.forEach((item) => {
          if (item.managerId == filters.userId) {
            reporteeMap.set(item.employeeId, item); // unique by employee
          }
        });

        const reportees = Array.from(reporteeMap.values());

        setManagerData(manager);
        setReporteesData(reportees);
        setShowTable(true);
      })
      .catch(() => {
        setManagerData([]);
        setReporteesData([]);
      });
  };
  // ---------------- DELETE ----------------
  const deleteMapping = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "It will delete permanently!",
      icon: "warning",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .delete(baseURL + `userHierarchyMapping/delete/${id}`)
          .then(() => {
            Swal.fire("Deleted Successfully");
            search();
          })
          .catch(() => Swal.fire("Delete failed"));
      }
    });
  };

  // ---------------- EDIT ----------------
  const handleEdit = (row) => {
    navigate(
      `/seriui/user-hierarchy-mapping-edit/${row.userHierarchyMappingId}`,
    );
  };

  const downloadPending = async () => {
  try {
    const res = await api.post(
      baseURL + "userHierarchyMapping/pending-report",
      {},
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = "pending_user_hierarchy.xlsx";

    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch {
    Swal.fire("Failed to download pending report");
  }
};

const downloadCompleted = async () => {
  try {
    const res = await api.post(
      baseURL + "userHierarchyMapping/completed-report",
      {},
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = "completed_user_hierarchy.xlsx";

    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch {
    Swal.fire("Failed to download completed report");
  }
};
  // ---------------- TABLE COLUMNS ----------------
  const managerColumns = [
    {
      name: t("Reports To (Manager)"),
      selector: (row) => row.managerName,
    },
    {
      name: t("Action"),
      cell: (row) => (
        <>
          <Button size="sm" onClick={() => handleEdit(row)} className="d-inline-flex align-items-center gap-1 shadow-sm">
            <Icon name="edit" />
            <span>{t("Edit")}</span>
          </Button>
          <Button
            size="sm"
            variant="danger"
            className="ms-2 d-inline-flex align-items-center gap-1 shadow-sm"
            onClick={() => deleteMapping(row.userHierarchyMappingId)}
          >
            <Icon name="trash" />
            <span>{t("delete")}</span>
          </Button>
        </>
      ),
    },
  ];

  const reporteeColumns = [
    {
      name: t("Reportee Name"),
      selector: (row) => row.employeeName,
    },
    {
      name: t("Action"),
      cell: (row) => (
        <Button
          size="sm"
          variant="danger"
          className="d-inline-flex align-items-center gap-1 shadow-sm"
          onClick={() => deleteMapping(row.userHierarchyMappingId)}
        >
          <Icon name="trash" />
          <span>{t("delete")}</span>
        </Button>
      ),
    },
  ];

  // ---------------- UI ----------------
  //  return (
  //   <Layout title="User Hierarchy Mapping List">
  //     <Block.Head>
  //       <Block.HeadBetween>
  //         <Block.HeadContent>
  //           <Block.Title tag="h2">User Hierarchy Mapping List</Block.Title>
  //         </Block.HeadContent>

  //         <Block.HeadContent>
  //           <Link to="/seriui/user-hierarchy-mapping" className="btn btn-primary">
  //             <Icon name="plus" />
  //             <span>Create</span>
  //           </Link>
  //         </Block.HeadContent>
  //       </Block.HeadBetween>
  //     </Block.Head>

  return (
    <Layout title="User Hierarchy Mapping List">
      <style>{userHierarchyMappingListStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("User Hierarchy Mapping List")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/user-hierarchy-mapping"
                    className="btn btn-primary btn-md  d-md-none sh-cta-btn"
                  >
                    <Icon name="plus" />
                    <span>{t("create")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/user-hierarchy-mapping"
                    className="btn btn-primary d-none d-md-inline-flex sh-cta-btn"
                  >
                    <Icon name="plus" />
                    <span>{t("create")}</span>
                  </Link>
                </li>
              </ul>
            </Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>
      <Block className="mt-n4 sh-list-wrap">
        <Card className="mt-1 sh-list-card">
          {/* 🔥 FILTER SECTION (Village Style) */}
          <Row className="m-4">
            <Col sm={2}>
              <Form.Group className="form-group mt-n4">
                <Form.Label>{t("Designation")}</Form.Label>
                <Form.Select name="designationId" onChange={handleInputs}>
                  <option value="">{t("Select")}</option>
                  {designationList.map((d) => (
                    <option key={d.designationId} value={d.designationId}>
                      {i18n.language === "kn"
                        ? d.designationNameInKannada || d.name
                        : d.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col sm={2}>
              <Form.Group className="form-group mt-n4">
                <Form.Label>{t("District")}</Form.Label>
                <Form.Select name="districtId" onChange={handleInputs}>
                  <option value="">{t("Select")}</option>
                  {districtList.map((d) => (
                    <option key={d.districtId} value={d.districtId}>
                      {i18n.language === "kn"
                        ? d.districtNameInKannada || d.districtName
                        : d.districtName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col sm={2}>
              <Form.Group className="form-group mt-n4">
                <Form.Label>{t("User")}</Form.Label>
                <Form.Select name="userId" onChange={handleInputs}>
                  <option value="">{t("Select")}</option>
                  {userList.map((u) => (
                    <option key={u.userMasterId} value={u.userMasterId}>
                      {u.username}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col sm={2}>
              <Button className="mt-2 w-100 sh-save-btn" onClick={search}>
                <Icon name="search" />
                <span>{t("search")}</span>
              </Button>
            </Col>
          </Row>

          {/* 🔥 TABLE SECTION */}
          {showTable && (
            <>
              <div className="px-4 sh-table-wrap">
                <h5 className="mb-3 sh-table-heading">{t("Manager Details")}</h5>
              </div>

              <div className="px-4 sh-table-wrap">
                <DataTable
                  columns={managerColumns}
                  data={managerData}
                  pagination
                  highlightOnHover
                  theme="solarized"
                  customStyles={customStyles}
                  noDataComponent={t("No Manager Found")}
                />
              </div>

              <div className="px-4 mt-4 sh-table-wrap">
                <h5 className="mb-3 sh-table-heading">{t("Reportees")}</h5>
              </div>

              <div className="px-4 sh-table-wrap">
                <DataTable
                  columns={reporteeColumns}
                  data={reporteesData}
                  pagination
                  highlightOnHover
                  theme="solarized"
                  customStyles={customStyles}
                  noDataComponent={t("No Reportees Found")}
                />
              </div>
            </>
          )}
        </Card>
      </Block>
    </Layout>
  );
}

const userHierarchyMappingListStyles = `
  .sh-page-header {
    padding: 20px 24px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border-radius: 12px;
    border: none;
    box-shadow: 0 6px 18px rgba(30, 103, 168, 0.22);
    margin-bottom: 22px;
  }
  .sh-page-title {
    margin-bottom: 4px;
    color: #ffffff !important;
    font-weight: 700;
    letter-spacing: 0.2px;
  }
  .sh-cta-btn {
    background: #ffffff;
    color: #1e67a8 !important;
    border: none;
    box-shadow: 0 4px 12px rgba(12, 40, 68, 0.25);
    font-weight: 700;
    padding: 8px 18px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
  }
  .sh-cta-btn:hover {
    background: #eef6ff;
    color: #1e67a8 !important;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(12, 40, 68, 0.32);
  }
  .sh-list-wrap {
    background: #eef2f8;
    border-radius: 14px;
    padding: 18px;
  }
  .sh-list-card {
    border: none;
    border-radius: 12px !important;
    box-shadow: 0 4px 14px rgba(30, 103, 168, 0.1);
    overflow: hidden;
  }
  .sh-table-heading {
    color: #1e3a5f;
    font-weight: 700;
    font-size: 14.5px;
  }
  .sh-table-wrap {
    margin-bottom: 8px;
  }
  .sh-save-btn {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border: none !important;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
    box-shadow: 0 4px 10px rgba(30, 103, 168, 0.25);
  }
`;

export default UserHierarchyMappingList;
