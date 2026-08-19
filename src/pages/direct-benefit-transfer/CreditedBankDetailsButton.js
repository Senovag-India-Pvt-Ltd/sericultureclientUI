import { useState } from "react";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import api from "../../services/auth/api";
import { Icon } from "../../components";

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

const FIELD_ROWS = [
  { label: "Beneficiary Amount", key: "dbtBeneficiaryAmount", icon: "coins", prefix: "₹" },
  { label: "Payment Date", key: "paymentDate", icon: "calendar" },
  { label: "UTR No.", key: "utrNo", icon: "notes-alt", copyable: true },
  { label: "K2 Payment ID", key: "k2PaymentId", icon: "tag", copyable: true },
  { label: "Bank Account Number", key: "bankAccountNumber", icon: "wallet", copyable: true },
  { label: "Bank IIN", key: "creditBankIin", icon: "building" },
  { label: "Account Holder Name", key: "bankAccountHolderName", icon: "user-circle" },
  { label: "DBT Scheme", key: "dbtScheme", icon: "list-index" },
  { label: "Farmer Reg No.", key: "farmerRegNo", icon: "user-list" },
  { label: "Period", key: "period", icon: "calender-date" },
];

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);

  if (!value) return null;

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <button type="button" className="cbd-copy-btn" onClick={handleCopy} title="Copy">
      {copied ? "✓" : "⧉"}
    </button>
  );
}

function CreditedBankDetailsButton({ arn, applicationFormId, label }) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [details, setDetails] = useState(null);

  const fetchDetails = () => {
    if (!arn && !applicationFormId) return;

    setLoading(true);
    api
      .post(
        baseURLDBT + "dashboard/getCreditedBankDetails",
        {},
        { params: arn ? { arn } : { applicationFormId } }
      )
      .then((response) => {
        setDetails(response.data?.content || null);
        setShowModal(true);
      })
      .catch((error) => {
        Swal.fire({
          ...smallPopup,
          icon: "warning",
          title: "Bank details not available",
          text:
            error?.response?.data?.errorMessages?.[0] ||
            "Please try again later.",
        });
      })
      .finally(() => setLoading(false));
  };

  const period =
    details?.periodFrom && details?.periodTo
      ? `${details.periodFrom} to ${details.periodTo}`
      : details?.periodFrom || details?.periodTo || "";

  const fieldValue = (key) => (key === "period" ? period : details?.[key]);

  return (
    <>
      <style>{`
        .cbd-trigger-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 6px 12px;
          border: none;
          border-radius: 16px;
          background: linear-gradient(135deg, #0a4d8a 0%, #0f6cbe 60%, #1e85d8 100%);
          color: #fff;
          font-size: 0.76rem;
          font-weight: 700;
          letter-spacing: 0.01em;
          white-space: normal;
          text-align: center;
          line-height: 1.25;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
          box-shadow: 0 2px 8px rgba(10,77,138,0.25);
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
        }
        .cbd-trigger-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(10,77,138,0.35); }
        .cbd-trigger-btn:disabled { opacity: 0.7; cursor: progress; transform: none; }
        .cbd-trigger-btn .icon { font-size: 1rem; line-height: 1; flex-shrink: 0; }

        @media (max-width: 1400px) {
          .cbd-trigger-btn { font-size: 0.7rem; padding: 5px 10px; gap: 4px; border-radius: 14px; }
        }
        @media (max-width: 1100px) {
          .cbd-trigger-btn { font-size: 0.66rem; padding: 5px 8px; }
          .cbd-trigger-btn .icon { font-size: 0.9rem; }
        }

        .cbd-modal .modal-content {
          border: none;
          border-radius: 16px;
          overflow: hidden;
          font-family: 'Poppins', 'Segoe UI', sans-serif;
        }
        .cbd-modal-header {
          background: linear-gradient(135deg, #0a4d8a 0%, #0f6cbe 60%, #1e85d8 100%);
          padding: 22px 26px 20px;
          position: relative;
          overflow: hidden;
        }
        .cbd-modal-header::before {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 160px; height: 160px;
          background: rgba(255,255,255,0.06);
          border-radius: 50%;
        }
        .cbd-modal-header-inner { position: relative; z-index: 1; display: flex; align-items: center; gap: 12px; }
        .cbd-modal-header-icon {
          width: 44px; height: 44px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          border: 1.5px solid rgba(255,255,255,0.4);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.3rem; color: #fff;
          flex-shrink: 0;
        }
        .cbd-modal-title { color: #fff; font-weight: 800; font-size: 1.15rem; margin: 0; }
        .cbd-modal-subtitle { color: rgba(255,255,255,0.85); font-size: 0.82rem; margin: 2px 0 0; }
        .cbd-modal-close {
          position: absolute; top: 16px; right: 18px; z-index: 2;
          background: rgba(255,255,255,0.15); border: none; color: #fff;
          width: 30px; height: 30px; border-radius: 50%;
          font-size: 1rem; line-height: 1; cursor: pointer;
        }
        .cbd-modal-close:hover { background: rgba(255,255,255,0.28); }

        .cbd-status-pill {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.18);
          border: 1px solid rgba(255,255,255,0.4);
          border-radius: 20px;
          padding: 4px 12px;
          color: #fff;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.03em;
          margin-top: 10px;
        }

        .cbd-modal-body { background: #f5f9ff; padding: 22px 24px 26px; }
        .cbd-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 14px;
        }
        .cbd-card {
          background: #fff;
          border-radius: 12px;
          padding: 14px 16px;
          box-shadow: 0 3px 10px rgba(10,77,138,0.08);
          border: 1px solid #e4edf9;
        }
        .cbd-card-label {
          display: flex; align-items: center; gap: 6px;
          font-size: 0.72rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.04em;
          color: #6b87a8; margin-bottom: 6px;
        }
        .cbd-card-label .icon { font-size: 0.95rem; color: #0f6cbe; }
        .cbd-card-value {
          font-size: 0.95rem; font-weight: 700; color: #0d1a2e;
          word-break: break-word;
          display: flex; align-items: center; gap: 6px;
        }
        .cbd-copy-btn {
          border: none; background: #eef5fd; color: #0f6cbe;
          width: 22px; height: 22px; border-radius: 6px;
          font-size: 0.8rem; line-height: 1; cursor: pointer; flex-shrink: 0;
        }
        .cbd-copy-btn:hover { background: #dcebfa; }
        .cbd-empty-value { color: #b3bfcf; font-weight: 500; font-size: 0.85rem; }

        .cbd-modal-footer {
          background: #fff;
          padding: 14px 24px;
          border-top: 1px solid #e4edf9;
          display: flex; justify-content: flex-end;
        }
        .cbd-close-btn {
          padding: 8px 26px;
          background: #f0f6ff;
          color: #0f6cbe;
          border: 1.5px solid #a8c8e8;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
        }
        .cbd-close-btn:hover { background: #e3f0fb; }
      `}</style>

      <button
        type="button"
        className="cbd-trigger-btn"
        onClick={fetchDetails}
        disabled={loading}
      >
        <Icon name="wallet" />
        {loading ? "Loading..." : label || "View Credited Bank Details"}
      </button>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
        className="cbd-modal"
      >
        <div className="cbd-modal-header">
          <button className="cbd-modal-close" onClick={() => setShowModal(false)}>
            ✕
          </button>
          <div className="cbd-modal-header-inner">
            <div className="cbd-modal-header-icon">
              <Icon name="wallet" />
            </div>
            <div>
              <p className="cbd-modal-title">Credited Bank Details</p>
              <p className="cbd-modal-subtitle">Payment disbursed via Direct Benefit Transfer</p>
            </div>
          </div>
          <div className="cbd-status-pill">
            <Icon name="check-circle" /> {details?.applicationStatus || "PAYMENT SUCCESS IN DBT"}
          </div>
        </div>

        <div className="cbd-modal-body">
          <div className="cbd-grid">
            {FIELD_ROWS.map((row) => {
              const value = fieldValue(row.key);
              return (
                <div className="cbd-card" key={row.key}>
                  <div className="cbd-card-label">
                    <Icon name={row.icon} />
                    {row.label}
                  </div>
                  <div className="cbd-card-value">
                    {value ? (
                      <>
                        <span>
                          {row.prefix || ""}
                          {value}
                        </span>
                        {row.copyable && <CopyButton value={value} />}
                      </>
                    ) : (
                      <span className="cbd-empty-value">Not available</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="cbd-modal-footer">
          <button className="cbd-close-btn" onClick={() => setShowModal(false)}>
            Close
          </button>
        </div>
      </Modal>
    </>
  );
}

export default CreditedBankDetailsButton;
