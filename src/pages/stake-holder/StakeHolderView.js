import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col, Button } from "react-bootstrap";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon } from "../../components";
import { format } from "date-fns";
import api from "../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function StakeHolderViewPage() {
  // Translation
  const { t, i18n } = useTranslation();

  const DetailGrid = ({ items }) => {
    const visible = items.filter((it) => it && it.show !== false);
    return (
      <div className="sh-detail-grid">
        {visible.map((it, i) => (
          <div className="sh-detail-cell" key={`${it.label}-${i}`}>
            <div className="sh-detail-label">{it.label}</div>
            <div className="sh-detail-value">
              {it.value !== undefined &&
              it.value !== null &&
              it.value !== "" ? (
                it.value
              ) : (
                <span className="sh-detail-empty">—</span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const { id } = useParams();

  const [StakeHolder, setStakeHolder] = useState({});
  const [loading, setLoading] = useState(false);

  const [bank, setBank] = useState({});
  const [loadingBank, setLoadingBank] = useState(false);

  const getIdList = () => {
    setLoading(true);
    api
      .get(baseURL2 + `farmer/get-by-farmer-id-join/${id}`)
      .then((response) => {
        setStakeHolder(response.data.content);
        if (response.data.content.photoPath) {
          getFile(response.data.content.photoPath);
        }
        setLoading(false);
      })
      .catch((err) => {
        setStakeHolder({});
        setLoading(false);
      });
  };

  const [familyMembersList, setFamilyMembersList] = useState([]);
  const getFamilyMembersDetailsList = () => {
    api
      .get(baseURL2 + `farmer-family/get-by-farmer-id-join/${id}`)
      .then((response) => {
        setFamilyMembersList(response.data.content.farmerFamily);
      })
      .catch((err) => {
        const message = err.response.data.errorMessages[0].message[0].message;
        setFamilyMembersList([]);
        // editError(message);
      });
  };

  const [farmerAddressDetailsList, setFarmerAddressDetailsList] = useState([]);
  const getFarmerAddressDetailsList = () => {
    api
      .get(baseURL2 + `farmer-address/get-by-farmer-id-join/${id}`)
      .then((response) => {
        setFarmerAddressDetailsList(response.data.content.farmerAddress);
      })
      .catch((err) => {
        const message = err.response.data.errorMessages[0].message[0].message;
        setFarmerAddressDetailsList([]);
        // editError(message);
      });
  };

  const [farmerLandList, setFarmerLandList] = useState([]);
  const getFLDetailsList = () => {
    api
      .get(baseURL2 + `farmer-land-details/get-by-farmer-id-join/${id}`)
      .then((response) => {
        setFarmerLandList(response.data.content.farmerLandDetails);
      })
      .catch((err) => {
        const message = err.response.data.errorMessages[0].message[0].message;
        setFarmerLandList([]);
        // editError(message);
      });
  };

  // console.log(farmerLandList);

  const getBankList = () => {
    setLoadingBank(true);
    api
      .get(baseURL2 + `farmer-bank-account/get-by-farmer-id/${id}`)
      .then((response) => {
        setBank(response.data.content);
        if (response.data.content.accountImagePath) {
          getDocumentFile(response.data.content.accountImagePath);
        }
        setLoadingBank(false);
      })
      .catch((err) => {
        setBank({});
        setLoadingBank(false);
      });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy");
  };

  // To get Photo
  const [selectedDocumentFile, setSelectedDocumentFile] = useState(null);

  const getDocumentFile = async (file) => {
    const parameters = `fileName=${file}`;
    try {
      const response = await api.get(
        baseURL2 + `api/s3/download?${parameters}`,
        {
          responseType: "arraybuffer",
        },
      );
      const blob = new Blob([response.data]);
      const url = URL.createObjectURL(blob);
      setSelectedDocumentFile(url);
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  };

  // To get Photo
  const [selectedFile, setSelectedFile] = useState(null);

  const getFile = async (file) => {
    const parameters = `fileName=${file}`;
    try {
      const response = await api.get(
        baseURL2 + `api/s3/download?${parameters}`,
        {
          responseType: "arraybuffer",
        },
      );
      const blob = new Blob([response.data]);
      const url = URL.createObjectURL(blob);
      setSelectedFile(url);
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  };

  // console.log(getIdList());

  useEffect(() => {
    getIdList();
    getFamilyMembersDetailsList();
    getFarmerAddressDetailsList();
    getFLDetailsList();
    getBankList();
  }, [id]);

  const downloadFile = async (file) => {
    const parameters = `fileName=${file}`;
    try {
      const response = await api.get(
        baseURL2 + `api/s3/download?${parameters}`,
        {
          responseType: "arraybuffer",
        },
      );
      const blob = new Blob([response.data]);
      const url = URL.createObjectURL(blob);

      const fileExtension = file.split(".").pop();

      const link = document.createElement("a");
      link.href = url;

      const modifiedFileName = file.replace(/_([^_]*)$/, ".$1");

      link.download = modifiedFileName;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  };

  return (
    <Layout title="Stake Holder View">
      <style>{stakeHolderViewStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("View Details")}
              </Block.Title>
              <p className="sh-page-subtitle mb-0">
                {t("Detailed profile of the selected farmer")}
              </p>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex gap-2">
                <li>
                  <Link
                    to={`/seriui/stake-holder-edit/${id}`}
                    className="btn d-inline-flex align-items-center sh-edit-btn"
                  >
                    <Icon name="edit" />
                    <span className="ms-1">{t("Edit")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/stake-holder-list"
                    className="btn d-inline-flex align-items-center sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span className="ms-1">{t("Go To List")}</span>
                  </Link>
                </li>
              </ul>
            </Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-view-wrap">
        <Card className="sh-hero-card">
          <Card.Body>
            <Row className="g-3 align-items-center">
              <Col xs="auto">
                <div className="sh-avatar">
                  {selectedFile &&
                  StakeHolder.photoPath?.match(/\.(jpg|jpeg|png)$/i) ? (
                    <img src={selectedFile} alt="Farmer" />
                  ) : (
                    <Icon name="user-alt" />
                  )}
                </div>
              </Col>
              <Col>
                <h3 className="sh-hero-name mb-1">
                  {StakeHolder.firstName || "—"}
                  {StakeHolder.nameKan ? (
                    <span className="sh-hero-name-kan ms-2">
                      ({StakeHolder.nameKan})
                    </span>
                  ) : null}
                </h3>
                <div className="sh-chip-row">
                  {StakeHolder.fruitsId ? (
                    <span className="sh-chip sh-chip-primary">
                      <Icon name="hash" />
                      <span className="ms-1">FRUITS: {StakeHolder.fruitsId}</span>
                    </span>
                  ) : null}
                  {StakeHolder.farmerNumber ? (
                    <span className="sh-chip sh-chip-info">
                      <Icon name="user-list" />
                      <span className="ms-1">
                        {t("farmer_number")}: {StakeHolder.farmerNumber}
                      </span>
                    </span>
                  ) : null}
                  {StakeHolder.mobileNumber ? (
                    <span className="sh-chip sh-chip-success">
                      <Icon name="call" />
                      <span className="ms-1">{StakeHolder.mobileNumber}</span>
                    </span>
                  ) : null}
                  {StakeHolder.tscName ? (
                    <span className="sh-chip sh-chip-warning">
                      <Icon name="building" />
                      <span className="ms-1">
                        TSC:{" "}
                        {i18n.language === "kn"
                          ? StakeHolder.tscNameKannada
                          : StakeHolder.tscName}
                      </span>
                    </span>
                  ) : null}
                </div>
              </Col>
              {selectedFile && StakeHolder.photoPath && (
                <Col xs="auto">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="sh-download-btn"
                    onClick={() => downloadFile(StakeHolder.photoPath)}
                  >
                    <Icon name="download" />
                    <span className="ms-1">{t("Download Photo")}</span>
                  </Button>
                </Col>
              )}
            </Row>
          </Card.Body>
        </Card>

        <Card className="sh-section-card">
          <Card.Header className="sh-section-header">
            <span className="sh-section-accent" />
            <Icon name="user" className="me-2" />
            {t("Farmer Personal Info")}
          </Card.Header>
          <Card.Body>
            <DetailGrid
              items={[
                { label: t("FRUITS ID"), value: StakeHolder.fruitsId },
                { label: t("farmer_name"), value: StakeHolder.firstName },
                { label: t("farmer_name_kannada"), value: StakeHolder.nameKan },
                {
                  label: "TSC",
                  value:
                    i18n.language === "kn"
                      ? StakeHolder.tscNameKannada
                      : StakeHolder.tscName,
                },
                {
                  label: t("fathers_husbands_name"),
                  value:
                    i18n.language === "kn"
                      ? StakeHolder.fatherNameKan
                      : StakeHolder.fatherName,
                },
                {
                  label: t("Gender"),
                  value:
                    StakeHolder.genderId === 1
                      ? t("Male")
                      : StakeHolder.genderId === 2
                        ? t("Female")
                        : StakeHolder.genderId === 3
                          ? t("Third Gender")
                          : StakeHolder.genderId
                            ? t("Other")
                            : "",
                },
                {
                  label: t("Caste"),
                  value:
                    i18n.language === "kn"
                      ? StakeHolder.casteNameKannada
                      : StakeHolder.title,
                },
                {
                  label: t("differently_abled"),
                  value:
                    StakeHolder.differentlyAbled === true
                      ? "Yes"
                      : StakeHolder.differentlyAbled === false
                        ? "No"
                        : "",
                },
                { label: t("passbook_number"), value: StakeHolder.passbookNumber },
                { label: t("email_id"), value: StakeHolder.email },
                { label: t("mobile_number"), value: StakeHolder.mobileNumber },
                {
                  label: t("extent_of_total_land_holding_in_acres"),
                  value: StakeHolder.totalLandHolding,
                },
                { label: t("farmer_number"), value: StakeHolder.farmerNumber },
                {
                  label: t("farmer_type"),
                  value:
                    i18n.language === "kn"
                      ? StakeHolder.farmerTypeNameKannada
                      : StakeHolder.farmerTypeName,
                },
                {
                  label: t("education"),
                  value:
                    i18n.language === "kn"
                      ? StakeHolder.educationNameKannada
                      : StakeHolder.name,
                },
                { label: t("recipient_id"), value: StakeHolder.khazaneRecipientId },
              ]}
            />
            {selectedFile && StakeHolder.photoPath && (
              <div className="sh-file-block mt-3">
                <div className="sh-file-block-label">
                  {t("Farmer_Photo_(PDF/jpg/png)_(Max: 5MB)")}
                </div>
                <div className="sh-file-block-body">
                  {StakeHolder.photoPath.match(/\.(jpg|jpeg|png)$/i) ? (
                    <img
                      className="sh-file-thumb"
                      src={selectedFile}
                      alt="Farmer Photo"
                    />
                  ) : StakeHolder.photoPath.match(/\.pdf$/i) ? (
                    <iframe
                      className="sh-file-thumb"
                      src={selectedFile}
                      title="PDF Preview"
                    />
                  ) : null}
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="sh-download-btn ms-3"
                    onClick={() => downloadFile(StakeHolder.photoPath)}
                  >
                    <Icon name="download" />
                    <span className="ms-1">{t("Download File")}</span>
                  </Button>
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
        <Card className="sh-section-card mt-3">
          <Card.Header className="sh-section-header">
            <span className="sh-section-accent" />
            <Icon name="users" className="me-2" />
            {t("Family Members")}
            {familyMembersList && familyMembersList.length > 0 ? (
              <span className="sh-count-badge ms-2">
                {familyMembersList.length}
              </span>
            ) : null}
          </Card.Header>
          <Card.Body>
            {familyMembersList && familyMembersList.length > 0 ? (
              <div className="sh-subgroup-stack">
                {familyMembersList.map((familyMembers, idx) => (
                  <div
                    className="sh-subgroup"
                    key={familyMembers.farmerFamilyId}
                  >
                    <div className="sh-subgroup-title">
                      {t("Family Member")} #{idx + 1}
                    </div>
                    <DetailGrid
                      items={[
                        // {
                        //   label: t("Farmer Family Id"),
                        //   value: familyMembers.farmerFamilyId,
                        // },
                        { label: t("Name"), value: familyMembers.farmerFamilyName },
                        {
                          label: t("relationship"),
                          value:
                            i18n.language === "kn"
                              ? familyMembers.relationshipNameKannada
                              : familyMembers.relationshipName,
                        },
                      ]}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="sh-empty-section">
                <Icon name="users" />
                <p className="mt-2 mb-0">{t("No family members recorded")}</p>
              </div>
            )}
          </Card.Body>
        </Card>

        <Card className="sh-section-card mt-3">
          <Card.Header className="sh-section-header">
            <span className="sh-section-accent" />
            <Icon name="map-pin" className="me-2" />
            {t("address")}
            {farmerAddressDetailsList && farmerAddressDetailsList.length > 0 ? (
              <span className="sh-count-badge ms-2">
                {farmerAddressDetailsList.length}
              </span>
            ) : null}
          </Card.Header>
          <Card.Body>
            {farmerAddressDetailsList && farmerAddressDetailsList.length > 0 ? (
              <div className="sh-subgroup-stack">
                {farmerAddressDetailsList.map((farmerAddressDetails, idx) => (
                  <div
                    className="sh-subgroup"
                    key={farmerAddressDetails.farmerAddressId}
                  >
                    <div className="sh-subgroup-title">
                      {t("Address")} #{idx + 1}
                      {farmerAddressDetails.defaultAddress ? (
                        <span className="sh-default-pill ms-2">
                          {t("Default")}
                        </span>
                      ) : null}
                    </div>
                    <DetailGrid
                      items={[
                        // {
                        //   label: t("Farmer Address Id"),
                        //   value: farmerAddressDetails.farmerAddressId,
                        // },
                        { label: t("address"), value: farmerAddressDetails.addressText },
                        {
                          label: t("district"),
                          value:
                            i18n.language === "kn"
                              ? farmerAddressDetails.districtNameKannada
                              : farmerAddressDetails.districtName,
                        },
                        {
                          label: t("taluk"),
                          value:
                            i18n.language === "kn"
                              ? farmerAddressDetails.talukNameKannada
                              : farmerAddressDetails.talukName,
                        },
                        {
                          label: t("village"),
                          value:
                            i18n.language === "kn"
                              ? farmerAddressDetails.villageNameKannada
                              : farmerAddressDetails.villageName,
                        },
                        {
                          label: t("state"),
                          value:
                            i18n.language === "kn"
                              ? farmerAddressDetails.stateNameKannada
                              : farmerAddressDetails.stateName,
                        },
                      ]}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="sh-empty-section">
                <Icon name="map-pin" />
                <p className="mt-2 mb-0">{t("No address records found")}</p>
              </div>
            )}
          </Card.Body>
        </Card>

        <Card className="sh-section-card mt-3">
          <Card.Header className="sh-section-header">
            <span className="sh-section-accent" />
            <Icon name="map" className="me-2" />
            {t("Farmers Land Details")}
            {farmerLandList && farmerLandList.length > 0 ? (
              <span className="sh-count-badge ms-2">
                {farmerLandList.length}
              </span>
            ) : null}
          </Card.Header>
          <Card.Body>
            {farmerLandList && farmerLandList.length > 0 ? (
              <div className="sh-subgroup-stack">
                {farmerLandList.map((farmerLand, idx) => (
                  <div
                    className="sh-subgroup"
                    key={farmerLand.farmerLandDetailsId}
                  >
                    <div className="sh-subgroup-title">
                      {t("Land Record")} #{idx + 1}
                      {farmerLand.surveyNumber ? (
                        <span className="sh-default-pill sh-default-pill-info ms-2">
                          {t("survey_number")}: {farmerLand.surveyNumber}
                        </span>
                      ) : null}
                    </div>
                    <DetailGrid
                      items={[
                        // { label: t("Farmer Land Details Id"), value: farmerLand.farmerLandDetailsId },
                        {
                          label: t("land_ownership"),
                          value:
                            i18n.language === "kn"
                              ? farmerLand.landOwnershipNameKannada
                              : farmerLand.landOwnershipName,
                        },
                        { label: t("survey_number"), value: farmerLand.surveyNumber },
                        {
                          label: t("plantation_type"),
                          value:
                            i18n.language === "kn"
                              ? farmerLand.plantationTypeNameKannada
                              : farmerLand.plantationTypeName,
                        },
                        {
                          label: t("soil_type"),
                          value:
                            i18n.language === "kn"
                              ? farmerLand.soilTypeNameKannada
                              : farmerLand.soilTypeName,
                        },
                        { label: t("hissa"), value: farmerLand.hissa },
                        {
                          label: t("source_of_Mulberry"),
                          value:
                            i18n.language === "kn"
                              ? farmerLand.mulberrySourceNameKannada
                              : farmerLand.mulberrySourceName,
                        },
                        { label: t("Mulberry Area(in Acres)"), value: farmerLand.mulberryArea },
                        {
                          label: t("Mulberry_Variety"),
                          value:
                            i18n.language === "kn"
                              ? farmerLand.mulberryVarietyNameKannada
                              : farmerLand.mulberryVarietyName,
                        },
                        { label: t("Plantation Spacing"), value: farmerLand.spacing },
                        {
                          label: t("irrigation_source"),
                          value:
                            i18n.language === "kn"
                              ? farmerLand.irrigationSourceNameKannada
                              : farmerLand.irrigationSourceName,
                        },
                        {
                          label: t("irrigation_type"),
                          value:
                            i18n.language === "kn"
                              ? farmerLand.irrigationTypeNameKannada
                              : farmerLand.irrigationTypeName,
                        },
                        { label: t("Rearing House (In Sq ft)"), value: farmerLand.rearingHouseDetails },
                        {
                          label: t("rearing_house_roof_type"),
                          value:
                            i18n.language === "kn"
                              ? farmerLand.roofTypeNameKannada
                              : farmerLand.roofTypeName,
                        },
                        {
                          label: t("silk_worm"),
                          value:
                            i18n.language === "kn"
                              ? farmerLand.silkWormVarietyNameKannada
                              : farmerLand.silkWormVarietyName,
                        },
                        { label: t("rearing_capacity_crops_per_Annum"), value: farmerLand.rearingCapacityCrops },
                        { label: t("rearing_capacity_dlf_per_crop"), value: farmerLand.rearingCapacityDlf },
                        { label: t("loan_details"), value: farmerLand.loanDetails },
                        { label: t("equipment_details"), value: farmerLand.equipmentDetails },
                        { label: t("owner_name"), value: farmerLand.ownerName },
                        { label: t("Owner Number"), value: farmerLand.ownerNo },
                        { label: t("Main Owner Number"), value: farmerLand.mainOwnerNo },
                        { label: t("survey_noc"), value: farmerLand.surNoc },
                        { label: t("Acre"), value: farmerLand.acre },
                        { label: t("Gunta"), value: farmerLand.gunta },
                        { label: t("FGunta"), value: farmerLand.fgunta },
                        {
                          label: t("state"),
                          value:
                            i18n.language === "kn"
                              ? farmerLand.stateNameKannada
                              : farmerLand.stateName,
                        },
                        {
                          label: t("district"),
                          value:
                            i18n.language === "kn"
                              ? farmerLand.districtNameKannada
                              : farmerLand.districtName,
                        },
                        {
                          label: t("taluk"),
                          value:
                            i18n.language === "kn"
                              ? farmerLand.talukNameKannada
                              : farmerLand.talukName,
                        },
                        {
                          label: t("hobli"),
                          value:
                            i18n.language === "kn"
                              ? farmerLand.hobliNameKannada
                              : farmerLand.hobliName,
                        },
                        {
                          label: t("village"),
                          value:
                            i18n.language === "kn"
                              ? farmerLand.villageNameKannada
                              : farmerLand.villageName,
                        },
                        { label: t("address"), value: farmerLand.address },
                        { label: t("pin_code"), value: farmerLand.pincode },
                      ]}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="sh-empty-section">
                <Icon name="map" />
                <p className="mt-2 mb-0">{t("No land details recorded")}</p>
              </div>
            )}
          </Card.Body>
        </Card>

        <Card className="sh-section-card mt-3">
          <Card.Header className="sh-section-header">
            <span className="sh-section-accent" />
            <Icon name="cc" className="me-2" />
            {t("Bank Account Details")}
          </Card.Header>
          <Card.Body>
            <DetailGrid
              items={[
                // { label: t("Farmer Bank Account Id"), value: bank.farmerBankAccountId },
                { label: t("Bank Name"), value: bank.farmerBankName },
                { label: t("Bank Account Number"), value: bank.farmerBankAccountNumber },
                { label: t("Branch Name"), value: bank.farmerBankBranchName },
                { label: t("IFSC Code"), value: bank.farmerBankIfscCode },
              ]}
            />
            {selectedDocumentFile && (
              <div className="sh-file-block mt-3">
                <div className="sh-file-block-label">{t("Bank Passbook")}</div>
                <div className="sh-file-block-body">
                  <img
                    className="sh-file-thumb"
                    src={selectedDocumentFile}
                    alt="Bank Passbook"
                  />
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="sh-download-btn ms-3"
                    onClick={() => downloadFile(bank.accountImagePath)}
                  >
                    <Icon name="download" />
                    <span className="ms-1">{t("Download File")}</span>
                  </Button>
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
      </Block>
    </Layout>
  );
}

const stakeHolderViewStyles = `
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
  .sh-page-subtitle {
    color: rgba(255, 255, 255, 0.85);
    font-size: 13.5px;
  }
  .sh-cta-btn,
  .sh-edit-btn {
    background: #ffffff;
    border: none;
    color: #1e67a8 !important;
    box-shadow: 0 4px 12px rgba(12, 40, 68, 0.25);
    font-weight: 700;
    padding: 8px 18px;
    border-radius: 8px;
    transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
  }
  .sh-edit-btn {
    color: #1ea482 !important;
  }
  .sh-cta-btn:hover,
  .sh-edit-btn:hover {
    background: #eef6ff;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(12, 40, 68, 0.32);
  }
  .sh-edit-btn:hover {
    background: #eafaf5;
  }
  .sh-view-wrap {
    background: #eef2f8;
    border-radius: 14px;
    padding: 18px;
  }
  .sh-view-wrap .card {
    border: none;
    border-radius: 12px !important;
    box-shadow: 0 4px 14px rgba(30, 103, 168, 0.1);
    overflow: hidden;
    margin-bottom: 0;
  }
  .sh-hero-card {
    background: linear-gradient(135deg, #f5f9ff 0%, #eaf2fc 100%) !important;
    border: none !important;
    margin-bottom: 18px !important;
  }
  .sh-avatar {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    overflow: hidden;
    background: #fff;
    border: 3px solid #fff;
    box-shadow: 0 4px 14px rgba(30, 103, 168, 0.18);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .sh-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .sh-avatar svg {
    width: 40px;
    height: 40px;
    color: #8a96a8;
  }
  .sh-hero-name {
    color: #1e2a44;
    font-weight: 700;
    letter-spacing: 0.2px;
  }
  .sh-hero-name-kan {
    color: #5a6577;
    font-weight: 500;
    font-size: 16px;
  }
  .sh-chip-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 6px;
  }
  .sh-chip {
    display: inline-flex;
    align-items: center;
    padding: 5px 12px;
    border-radius: 999px;
    font-size: 12.5px;
    font-weight: 600;
    border: 1px solid transparent;
  }
  .sh-chip-primary {
    background: rgba(30, 103, 168, 0.1);
    color: #1e67a8;
    border-color: rgba(30, 103, 168, 0.18);
  }
  .sh-chip-info {
    background: rgba(38, 162, 210, 0.1);
    color: #1c7ba0;
    border-color: rgba(38, 162, 210, 0.18);
  }
  .sh-chip-success {
    background: rgba(45, 199, 163, 0.12);
    color: #14826a;
    border-color: rgba(45, 199, 163, 0.2);
  }
  .sh-chip-warning {
    background: rgba(238, 167, 67, 0.14);
    color: #a3681c;
    border-color: rgba(238, 167, 67, 0.22);
  }
  .sh-download-btn {
    border-radius: 8px;
    font-weight: 600;
    padding: 7px 14px;
  }
  .sh-section-card {
    margin-bottom: 18px !important;
  }
  .sh-section-header {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border-bottom: none !important;
    padding: 14px 20px !important;
    font-weight: 700 !important;
    color: #ffffff !important;
    font-size: 15px !important;
    letter-spacing: 0.2px;
    display: flex;
    align-items: center;
    gap: 8px;
    position: relative;
  }
  .sh-section-accent {
    display: none;
  }
  .sh-section-header svg,
  .sh-section-header .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.22);
    color: #ffffff;
    font-size: 15px;
  }
  .sh-count-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 22px;
    height: 22px;
    padding: 0 8px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.25);
    color: #ffffff;
    font-size: 12px;
    font-weight: 700;
  }
  .sh-view-wrap .card-body {
    padding: 20px !important;
  }
  .sh-view-wrap table.table-bordered {
    border: 1px solid #e6ecf4 !important;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 0;
  }
  .sh-view-wrap table.table-bordered td {
    border: 1px solid #eef2f8 !important;
    padding: 8px 12px !important;
    font-size: 13px;
    vertical-align: middle;
    color: #2b3a55;
  }
  .sh-view-wrap table.table-bordered tr td:first-child {
    background-color: #f7faff !important;
    color: #4a5568 !important;
    font-weight: 600;
    letter-spacing: 0.1px;
  }
  .sh-view-wrap table.table-bordered tr:hover td:not(:first-child) {
    background-color: #fbfdff;
  }
  .sh-empty-section {
    padding: 28px 12px;
    text-align: center;
    color: #8a96a8;
    font-size: 14px;
  }
  .sh-empty-section svg {
    width: 36px;
    height: 36px;
    opacity: 0.45;
  }
  .sh-detail-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    border: 1px solid #e6ecf4;
    border-radius: 10px;
    overflow: hidden;
    background: #fff;
  }
  .sh-detail-cell {
    display: grid;
    grid-template-columns: 42% 1fr;
    border-right: 1px solid #eef2f8;
    border-bottom: 1px solid #eef2f8;
    min-height: 40px;
  }
  .sh-detail-cell:nth-child(3n) {
    border-right: none;
  }
  .sh-detail-label {
    background-color: #f7faff;
    color: #4a5568;
    font-weight: 600;
    font-size: 13px;
    letter-spacing: 0.1px;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    border-right: 1px solid #eef2f8;
    line-height: 1.35;
  }
  .sh-detail-value {
    padding: 8px 12px;
    color: #2b3a55;
    font-size: 13.5px;
    display: flex;
    align-items: center;
    word-break: break-word;
    line-height: 1.4;
    transition: background-color 0.15s ease;
  }
  .sh-detail-cell:hover .sh-detail-value {
    background-color: #fbfdff;
  }
  .sh-detail-empty {
    color: #b0bac9;
    font-style: italic;
  }
  @media (max-width: 991px) {
    .sh-detail-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .sh-detail-cell:nth-child(3n) {
      border-right: 1px solid #eef2f8;
    }
    .sh-detail-cell:nth-child(2n) {
      border-right: none;
    }
  }
  @media (max-width: 575px) {
    .sh-detail-grid {
      grid-template-columns: 1fr;
    }
    .sh-detail-cell {
      grid-template-columns: 45% 1fr;
      border-right: none !important;
    }
  }
  .sh-subgroup-stack {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .sh-subgroup {
    border: 1px solid #eef2f8;
    border-radius: 10px;
    padding: 14px 16px;
    background: #fcfdff;
  }
  .sh-subgroup-title {
    font-size: 13.5px;
    font-weight: 700;
    color: #1e2a44;
    letter-spacing: 0.2px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
  }
  .sh-default-pill {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 11.5px;
    font-weight: 700;
    background: rgba(45, 199, 163, 0.14);
    color: #14826a;
    border: 1px solid rgba(45, 199, 163, 0.22);
    letter-spacing: 0.3px;
    text-transform: uppercase;
  }
  .sh-default-pill-info {
    background: rgba(30, 103, 168, 0.1);
    color: #1e67a8;
    border-color: rgba(30, 103, 168, 0.18);
    text-transform: none;
  }
  .sh-file-block {
    border: 1px solid #eef2f8;
    border-radius: 10px;
    padding: 12px 16px;
    background: #fcfdff;
  }
  .sh-file-block-label {
    font-size: 12.5px;
    font-weight: 700;
    color: #4a5568;
    letter-spacing: 0.3px;
    text-transform: uppercase;
    margin-bottom: 10px;
  }
  .sh-file-block-body {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
  }
  .sh-file-thumb {
    width: 96px;
    height: 96px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #e3ebf6;
    box-shadow: 0 2px 6px rgba(30, 103, 168, 0.08);
    background: #fff;
  }
  iframe.sh-file-thumb {
    object-fit: contain;
  }
`;

export default StakeHolderViewPage;
