import React, { useState, useEffect } from "react";
import { Card, Button, Col, Row, Form } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import DataTable from "react-data-table-component";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../../../src/services/auth/api";
import { Icon } from "../../../components";
import { createTheme } from "react-data-table-component";

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
  rows: {
    style: {
      minHeight: "45px",
    },
  },
  headCells: {
    style: {
      backgroundColor: "#1e67a8",
      color: "#fff",
      fontSize: "14px",
      paddingLeft: "8px",
      paddingRight: "8px",
    },
  },
  cells: {
    style: {
      paddingLeft: "8px",
      paddingRight: "8px",
    },
  },
};
function UserHierarchyMappingList() {
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
      name: "Reports To (Manager)",
      selector: (row) => row.managerName,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <Button size="sm" onClick={() => handleEdit(row)}>
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            className="ms-2"
            onClick={() => deleteMapping(row.userHierarchyMappingId)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  const reporteeColumns = [
    {
      name: "Reportee Name",
      selector: (row) => row.employeeName,
    },
    {
      name: "Action",
      cell: (row) => (
        <Button
          size="sm"
          variant="danger"
          onClick={() => deleteMapping(row.userHierarchyMappingId)}
        >
          Delete
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
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">User Hierarchy Mapping List</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/user-hierarchy-mapping"
                  className="btn btn-primary btn-md  d-md-none"
                >
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/user-hierarchy-mapping"
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
        <Card className="mt-1">
          {/* 🔥 FILTER SECTION (Village Style) */}
          <Row className="m-4">
            <Col sm={2}>
              <Form.Group className="form-group mt-n4">
                <Form.Label>Designation</Form.Label>
                <Form.Select name="designationId" onChange={handleInputs}>
                  <option value="">Select</option>
                  {designationList.map((d) => (
                    <option key={d.designationId} value={d.designationId}>
                      {d.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col sm={2}>
              <Form.Group className="form-group mt-n4">
                <Form.Label>District</Form.Label>
                <Form.Select name="districtId" onChange={handleInputs}>
                  <option value="">Select</option>
                  {districtList.map((d) => (
                    <option key={d.districtId} value={d.districtId}>
                      {d.districtName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col sm={2}>
              <Form.Group className="form-group mt-n4">
                <Form.Label>User</Form.Label>
                <Form.Select name="userId" onChange={handleInputs}>
                  <option value="">Select</option>
                  {userList.map((u) => (
                    <option key={u.userMasterId} value={u.userMasterId}>
                      {u.username}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col sm={2}>
              <Button className="mt-2 w-100" onClick={search}>
                Search
              </Button>
            </Col>
          </Row>

          {/* 🔥 TABLE SECTION */}
          {showTable && (
            <>
              <div className="px-4">
                <h5 className="mb-3">Manager Details</h5>
              </div>

              <DataTable
                columns={managerColumns}
                data={managerData}
                pagination
                highlightOnHover
                theme="solarized"
                customStyles={customStyles}
                noDataComponent="No Manager Found"
              />

              <div className="px-4 mt-4">
                <h5 className="mb-3">Reportees</h5>
              </div>

              <DataTable
                columns={reporteeColumns}
                data={reporteesData}
                pagination
                highlightOnHover
                theme="solarized"
                customStyles={customStyles}
                noDataComponent="No Reportees Found"
              />
            </>
          )}
        </Card>
      </Block>
    </Layout>
  );
}

export default UserHierarchyMappingList;
