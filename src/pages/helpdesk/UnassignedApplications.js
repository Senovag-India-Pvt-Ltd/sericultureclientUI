import { Card, Form, Button, Modal } from "react-bootstrap";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DataTable from "../../components/AppDataTable";
import { Icon } from "../../components";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../../services/auth/api";
import { useTranslation } from "react-i18next";
import { escapeHtml } from "./helpdeskUi";

const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLMaster = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

// Applications that a TSC/officer could not be auto-assigned to (no matching
// geo-mapping yet, see TSC Geo Mapping under Masters). An admin/helpdesk user
// picks the TSC (and optionally the officer) here instead.
function UnassignedApplications() {
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const countPerPage = 10;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);

  const getList = () => {
    setLoading(true);
    api
      .get(baseURLDBT + `tsc-assignment/unassigned-applications`, { params: { pageNumber: page, size: countPerPage } })
      .then((response) => {
        setRows(response.data.content.applications || []);
        setTotalRows(response.data.content.totalItems || 0);
      })
      .catch(() => {
        setRows([]);
        setTotalRows(0);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // to get TSC
  const [tscListData, setTscListData] = useState([]);
  useEffect(() => {
    api
      .get(baseURLMaster + `tscMaster/get-all`)
      .then((response) => setTscListData(response.data.content.tscMaster))
      .catch(() => setTscListData([]));
  }, []);

  // to get Officer (user)
  const [userListData, setUserListData] = useState([]);
  useEffect(() => {
    api
      .get(baseURLMaster + `userMaster/get-all`)
      .then((response) => setUserListData(response.data.content.userMaster))
      .catch(() => setUserListData([]));
  }, []);

  // ── Assign modal ─────────────────────────────────────────────────────────
  const [showAssign, setShowAssign] = useState(false);
  const [assignRow, setAssignRow] = useState(null);
  const [assignData, setAssignData] = useState({ tscMasterId: "", officerUserId: "", remarks: "" });
  const [submitting, setSubmitting] = useState(false);

  const openAssign = (row) => {
    setAssignRow(row);
    setAssignData({ tscMasterId: "", officerUserId: "", remarks: "" });
    setShowAssign(true);
  };
  const closeAssign = () => {
    if (submitting) return;
    setShowAssign(false);
    setAssignRow(null);
  };

  const handleAssignInputs = (e) => {
    const { name, value } = e.target;
    setAssignData((prev) => ({ ...prev, [name]: value }));
  };

  const submitAssign = () => {
    if (!assignData.tscMasterId) {
      Swal.fire({ icon: "warning", title: t("Missing Details"), text: t("Please select a TSC.") });
      return;
    }
    setSubmitting(true);
    api
      .post(baseURLDBT + `tsc-assignment/assign`, {
        scApplicationFormId: assignRow.scApplicationFormId,
        tscMasterId: assignData.tscMasterId,
        officerUserId: assignData.officerUserId || null,
        assignedBy: localStorage.getItem("userMasterId"),
        remarks: assignData.remarks,
      })
      .then((response) => {
        if (response.data.content.error) {
          Swal.fire({
            icon: "error",
            title: t("Could not assign"),
            html: `<div>${escapeHtml(response.data.content.error_description)}</div>`,
          });
          return;
        }
        Swal.fire({ icon: "success", title: t("Assigned successfully") });
        setShowAssign(false);
        setAssignRow(null);
        getList();
      })
      .catch(() => {
        Swal.fire({ icon: "error", title: t("Could not assign"), text: t("Something went wrong. Please try again.") });
      })
      .finally(() => setSubmitting(false));
  };

  const columns = [
    { name: t("Beneficiary ID"), selector: (row) => row.beneficiaryId },
    { name: t("FRUITS ID"), selector: (row) => row.fruitsId },
    {
      name: t("Farmer Name"),
      selector: (row) => [row.farmerFirstName, row.farmerLastName].filter(Boolean).join(" "),
    },
    { name: t("District"), selector: (row) => row.districtName || "—" },
    { name: t("Taluk"), selector: (row) => row.talukName || "—" },
    { name: t("Village"), selector: (row) => row.villageName || "—" },
    { name: t("Status"), selector: (row) => row.applicationStatus },
    { name: t("Source"), selector: (row) => row.applicationSource || "—" },
    {
      name: t("Action"),
      cell: (row) => (
        <Button size="sm" variant="primary" onClick={() => openAssign(row)}>
          {t("Assign")}
        </Button>
      ),
      minWidth: "120px",
    },
  ];

  return (
    <Layout title={t("Unassigned Applications")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Unassigned Applications")}</Block.Title>
            <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
              {t("Applications with no matching TSC geo-mapping. Assign a TSC (and optionally an officer) manually.")}
            </p>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n2">
        <Card>
          <div style={{ overflowX: "auto" }}>
            <DataTable
              tableClassName="data-table-head-light table-responsive"
              columns={columns}
              data={rows}
              highlightOnHover
              pagination
              paginationServer
              paginationTotalRows={totalRows}
              paginationPerPage={countPerPage}
              paginationComponentOptions={{ noRowsPerPage: true }}
              onChangePage={(newPage) => setPage(newPage - 1)}
              progressPending={loading}
            />
          </div>
        </Card>
      </Block>

      <Modal show={showAssign} onHide={closeAssign} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>
            {t("Assign TSC")} {assignRow ? `— ${assignRow.beneficiaryId}` : ""}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="form-group mb-3">
            <Form.Label>
              {t("TSC")}<span className="text-danger">*</span>
            </Form.Label>
            <Form.Select name="tscMasterId" value={assignData.tscMasterId} onChange={handleAssignInputs}>
              <option value="">{t("Select TSC")}</option>
              {tscListData.map((list) => (
                <option key={list.tscMasterId} value={list.tscMasterId}>
                  {list.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="form-group mb-3">
            <Form.Label>
              {t("Officer")} <span style={{ fontWeight: 400, color: "#8896ab" }}>({t("optional")})</span>
            </Form.Label>
            <Form.Select name="officerUserId" value={assignData.officerUserId} onChange={handleAssignInputs}>
              <option value="">{t("Select Officer")}</option>
              {userListData.map((list) => (
                <option key={list.userMasterId} value={list.userMasterId}>
                  {list.username}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label>{t("Remarks")} <span style={{ fontWeight: 400, color: "#8896ab" }}>({t("optional")})</span></Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="remarks"
              value={assignData.remarks}
              onChange={handleAssignInputs}
              placeholder={t("e.g. No geo-mapping available for this village yet")}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeAssign} disabled={submitting}>
            {t("Cancel")}
          </Button>
          <Button variant="primary" onClick={submitAssign} disabled={submitting}>
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm" /> {t("Submitting...")}
              </>
            ) : (
              <>
                <Icon name="check" /> {t("Assign")}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
}

export default UnassignedApplications;
