import { useState } from "react";
import api from "../../../src/services/auth/api";
import { useTranslation } from "react-i18next";
import LoginLogo from "../../components/Logo/LoginLogo";
import Swal from "sweetalert2";

const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;

const smallPopup = {
  width: "320px",
  padding: "12px",
  customClass: {
    popup: "small-swal-popup",
    title: "small-swal-title",
    htmlContainer: "small-swal-text",
    confirmButton: "small-swal-btn",
  },
};

function DbtApplicationStatusCheck() {
  const { t } = useTranslation();

  const [validated, setValidated] = useState(false);
  const [applicationList, setApplicationList] = useState([]);

  const [searchData, setSearchData] = useState({
    select: "fid",
    text: "",
  });

  const handleSearchInputs = (e) => {
    const { name, value } = e.target;
    setSearchData({ ...searchData, [name]: value });
  };

  const getDynamicLabel = () => {
    if (searchData.select === "mobileNo") return "Mobile Number";
    if (searchData.select === "fid") return "FRUITS ID";
    return "Acknowledgement Reference Number (ARN)";
  };

  const getNotExistMessage = () => {
    if (searchData.select === "mobileNo") return "Mobile Number does not exist";
    if (searchData.select === "fid") return "FRUITS ID does not exist";
    return "ARN does not exist";
  };

  const postData = (event) => {
    event.preventDefault();
    setValidated(true);

    if (!searchData.text.trim()) {
      Swal.fire({
        ...smallPopup,
        icon: "warning",
        title: `Please enter ${getDynamicLabel()}`,
        text: "Please try again!",
      });
      return;
    }

    api
      .post(
        baseURLDBT + "dashboard/getApplicationStatus",
        {},
        { params: { [searchData.select]: searchData.text } }
      )
      .then((response) => {
        const list = response.data?.content || [];

        if (list.length === 0) {
          Swal.fire({
            ...smallPopup,
            icon: "warning",
            title: getNotExistMessage(),
            text: "Please try again!",
          });
          setApplicationList([]);
          return;
        }

        setApplicationList(list);
      })
      .catch(() => {
        Swal.fire({
          ...smallPopup,
          icon: "warning",
          title: getNotExistMessage(),
          text: "Please try again!",
        });
        setApplicationList([]);
      });
  };

  const allPaymentSuccess = applicationList.every(
    (item) =>
      item.applicationStatus?.trim().toUpperCase() === "PAYMENT SUCCESS IN DBT"
  );

  return (
    <>
      <style>{`
        .appstatus-page {
          min-height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding: 32px 16px 48px;
          box-sizing: border-box;
          font-family: 'Poppins', 'Segoe UI', sans-serif;
          background: linear-gradient(160deg, #e8f1fb 0%, #f5f9ff 100%);
        }

        /* ---- HEADER CARD ---- */
        .appstatus-header {
          width: min(680px, 100%);
          background: linear-gradient(135deg, #0a4d8a 0%, #0f6cbe 60%, #1e85d8 100%);
          border-radius: 14px 14px 0 0;
          padding: 24px 28px 20px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(10,77,138,0.25);
          position: relative;
          overflow: hidden;
        }
        .appstatus-header::before {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 160px; height: 160px;
          background: rgba(255,255,255,0.05);
          border-radius: 50%;
        }
        .appstatus-header-logo {
          display: flex;
          justify-content: center;
          margin-bottom: 10px;
          position: relative; z-index: 1;
        }
        .appstatus-header-logo .logo-wrap {
          height: auto !important;
          position: static !important;
          display: flex !important;
          align-items: center;
          justify-content: center;
        }
        .appstatus-header-logo .logo-link {
          display: flex !important;
          align-items: center;
          justify-content: center;
        }
        .appstatus-header-logo img {
          width: 90px !important;
          height: 90px !important;
          border-radius: 50% !important;
          border: 3px solid rgba(255,255,255,0.4) !important;
          background: rgba(255,255,255,0.1) !important;
          object-fit: contain !important;
          padding: 8px !important;
          box-sizing: border-box !important;
          box-shadow: 0 4px 16px rgba(0,0,0,0.2) !important;
        }
        .appstatus-header h2 {
          color: #fff;
          font-size: 1.2rem;
          font-weight: 800;
          margin: 0 0 4px;
          position: relative; z-index: 1;
        }
        .appstatus-header p {
          color: rgba(255,255,255,0.82);
          font-size: 0.88rem;
          margin: 0;
          font-weight: 500;
          position: relative; z-index: 1;
        }

        /* ---- SEARCH CARD ---- */
        .appstatus-search-card {
          width: min(680px, 100%);
          background: #fff;
          border-radius: 0 0 14px 14px;
          box-shadow: 0 8px 28px rgba(10,77,138,0.14);
          overflow: hidden;
          margin-bottom: 32px;
        }
        .appstatus-search-header {
          background: linear-gradient(90deg, #0a4d8a 0%, #0f6cbe 100%);
          padding: 12px 20px;
          color: #fff;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          text-align: center;
        }
        .appstatus-search-body {
          padding: 28px 28px 24px;
        }
        .appstatus-field-wrap {
          margin-bottom: 16px;
        }
        .appstatus-label {
          display: block;
          font-size: 0.82rem;
          font-weight: 700;
          color: #0a4d8a;
          margin-bottom: 6px;
          letter-spacing: 0.02em;
        }
        .appstatus-required {
          color: #c0392b;
          margin-left: 2px;
        }
        .appstatus-select,
        .appstatus-input {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid #bfd4ec;
          border-radius: 8px;
          font-size: 0.9rem;
          color: #0d1a2e;
          background: #f0f6ff;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: inherit;
        }
        .appstatus-select:focus,
        .appstatus-input:focus {
          border-color: #0f6cbe;
          box-shadow: 0 0 0 3px rgba(15,108,190,0.12);
          background: #fff;
        }
        .appstatus-input.invalid {
          border-color: #e74c3c;
        }
        .appstatus-form-row {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 16px;
        }
        .appstatus-btn-row {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 24px;
        }
        .appstatus-btn-primary {
          padding: 10px 32px;
          background: linear-gradient(135deg, #0a4d8a 0%, #0f6cbe 100%);
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 0.92rem;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.03em;
          transition: opacity 0.2s;
          font-family: inherit;
        }
        .appstatus-btn-primary:hover { opacity: 0.9; }
        .appstatus-btn-secondary {
          padding: 10px 32px;
          background: #f0f6ff;
          color: #0f6cbe;
          border: 1.5px solid #a8c8e8;
          border-radius: 8px;
          font-size: 0.92rem;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.2s;
        }
        .appstatus-btn-secondary:hover { background: #e3f0fb; }

        /* ---- RESULT TABLE ---- */
        .appstatus-results {
          width: min(1200px, 100%);
        }
        .appstatus-table-card {
          background: #fff;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 8px 28px rgba(10,77,138,0.12);
        }
        .appstatus-table-header {
          background: linear-gradient(90deg, #0a4d8a 0%, #0f6cbe 100%);
          padding: 14px 20px;
          color: #fff;
          font-size: 0.95rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .appstatus-table-wrap {
          overflow-x: auto;
        }
        .appstatus-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
          font-family: inherit;
        }
        .appstatus-table thead tr {
          background: linear-gradient(90deg, #0a4d8a 0%, #0f6cbe 100%);
          color: #fff;
        }
        .appstatus-table thead th {
          padding: 12px 14px;
          font-weight: 700;
          text-align: center;
          white-space: nowrap;
          border: none;
          font-size: 0.82rem;
          letter-spacing: 0.02em;
        }
        .appstatus-table tbody tr {
          border-bottom: 1px solid #ddeaf8;
          transition: background 0.15s;
        }
        .appstatus-table tbody tr:last-child { border-bottom: none; }
        .appstatus-table tbody tr:hover { background: #eef5fd; }
        .appstatus-table tbody tr:nth-child(even) { background: #f5f9ff; }
        .appstatus-table tbody tr:nth-child(even):hover { background: #eef5fd; }
        .appstatus-table tbody td {
          padding: 11px 14px;
          text-align: center;
          color: #0d1a2e;
        }
        .appstatus-status-success { color: #0f6cbe; font-weight: 700; }
        .appstatus-status-failed  { color: #c0392b; font-weight: 700; }
        .appstatus-status-pending { color: #1565c0; font-weight: 700; }

        @media (max-width: 640px) {
          .appstatus-form-row { grid-template-columns: 1fr; }
          .appstatus-search-body { padding: 20px 16px; }
          .appstatus-header { padding: 20px 16px 16px; }
          .appstatus-table thead th,
          .appstatus-table tbody td { padding: 8px 10px; font-size: 0.78rem; }
        }
      `}</style>

      <div className="appstatus-page">

        {/* ===== HEADER ===== */}
        <div className="appstatus-header">
          <div className="appstatus-header-logo">
            <LoginLogo />
          </div>
          <h2>Department of Sericulture</h2>
          <p>Government of Karnataka</p>
        </div>

        {/* ===== SEARCH CARD ===== */}
        <div className="appstatus-search-card">
          <div className="appstatus-search-header">
            View Application Status
          </div>

          <div className="appstatus-search-body">
            <form noValidate onSubmit={postData}>
              <div className="appstatus-form-row">
                <div className="appstatus-field-wrap">
                  <label className="appstatus-label">
                    Search By <span className="appstatus-required">*</span>
                  </label>
                  <select
                    className="appstatus-select"
                    name="select"
                    value={searchData.select}
                    onChange={handleSearchInputs}
                  >
                    <option value="mobileNo">Mobile Number</option>
                    <option value="fid">FRUITS ID</option>
                    <option value="arn">Acknowledgement Reference Number (ARN)</option>
                  </select>
                </div>

                <div className="appstatus-field-wrap">
                  <label className="appstatus-label">
                    Enter {getDynamicLabel()} <span className="appstatus-required">*</span>
                  </label>
                  <input
                    className={`appstatus-input${validated && !searchData.text.trim() ? " invalid" : ""}`}
                    type="text"
                    name="text"
                    value={searchData.text}
                    onChange={handleSearchInputs}
                    placeholder={`Enter ${getDynamicLabel()}`}
                    required
                  />
                </div>
              </div>

              <div className="appstatus-btn-row">
                <button type="submit" className="appstatus-btn-primary">
                  Check Status
                </button>
                <button
                  type="button"
                  className="appstatus-btn-secondary"
                  onClick={() => {
                    setSearchData({ select: "fid", text: "" });
                    setApplicationList([]);
                    setValidated(false);
                  }}
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ===== RESULTS TABLE ===== */}
        {applicationList.length > 0 && (
          <div className="appstatus-results">
            <div className="appstatus-table-card">
              <div className="appstatus-table-header">
                Application Status Results ({applicationList.length} record{applicationList.length !== 1 ? "s" : ""} found)
              </div>
              <div className="appstatus-table-wrap">
                <table className="appstatus-table">
                  <thead>
                    <tr>
                      <th>Sl. No</th>
                      <th>Beneficiary Name</th>
                      <th>FRUITS ID</th>
                      <th>ARN No</th>
                      <th>Scheme Name</th>
                      <th>Component Name</th>
                      {!allPaymentSuccess && <th>Stage</th>}
                      <th>Amount</th>
                      <th>Status</th>
                      {!allPaymentSuccess && <th>Currently With</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {applicationList.map((item, index) => {
                      const status = item.applicationStatus?.trim().toUpperCase();
                      const isPaymentSuccess = status === "PAYMENT SUCCESS IN DBT";
                      const isAckSuccess = status === "ACKNOWLEDGEMENT SUCCESS";
                      const isFailedStatus =
                        status === "PAYMENT FAILED IN DBT" ||
                        status === "ACKNOWLEDGEMENT FAILED";

                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.farmerName}</td>
                          <td>{item.fruitsId}</td>
                          <td>{item.arn}</td>
                          <td>{item.schemeName}</td>
                          <td>{item.componentName}</td>
                          {!allPaymentSuccess && <td>{item.stageName}</td>}
                          <td>{item.schemeAmount}</td>
                          <td
                            className={
                              isFailedStatus
                                ? "appstatus-status-failed"
                                : isPaymentSuccess || isAckSuccess
                                ? "appstatus-status-success"
                                : "appstatus-status-pending"
                            }
                          >
                            {item.applicationStatus}
                          </td>
                          {!allPaymentSuccess && <td>{item.userName}</td>}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}

export default DbtApplicationStatusCheck;
