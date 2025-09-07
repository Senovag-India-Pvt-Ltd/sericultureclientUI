import {
  Row,
  Col,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Block from "../../../components/Block/Block";
import { useState, useEffect } from "react";
import Layout from "../../../layout/default";
import api from "../../../services/auth/api";
import { useTranslation } from "react-i18next";

const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLTarget = process.env.REACT_APP_API_BASE_URL_TARGET_SETTING;

function TargetSettingDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const rainbowColors = [
    "#b82424",
    "#ca8b17",
    "#acac22",
    "#287728",
    "#575797",
    "#88699f",
    "#bf45bf",
  ];

  // Search filters state
  const [data, setData] = useState({
    month: "",
    // targetType: "",
    tscMasterId: "",
    districtId: "",
    financialYearMasterId: "",
  });

  const [editData, setEditData] = useState({
    month: "",
    // targetType: "",
    tscMasterId: "",
    districtId: "",
    financialYearMasterId: "",
       
    });

  // dropdown data
  // const [financialyearListData, setFinancialyearListData] = useState([]);
  const [tscList, setTscList] = useState([]);
  const [districtList, setDistrictList] = useState([]);

  const [dashboardData, setDashboardData] = useState([]);
  const [dashboardList, setDashboardList] = useState([]);

  // // handlers
  // const handleInputs = (e) => {
  //   let { name, value } = e.target;
  //   setData({ ...data, [name]: value });
  // };

  const handleInputs = (e) => {
  let { name, value } = e.target;

  // Convert empty string to null for numeric fields
  if (["districtId", "tscMasterId", "financialYearMasterId"].includes(name)) {
    setData({ ...data, [name]: value === "" ? null : Number(value) });
  } else {
    setData({ ...data, [name]: value });
  }
};


  // Get Default Financial Year
  const getFinancialDefaultDetails = () => {
    api
      .get(baseURLMasterData + `financialYearMaster/get-is-default`)
      .then((response) => {
        setData((prev) => ({
          ...prev,
          financialYearMasterId:
            response.data.content.financialYearMasterId || "",
        }));
      })
      .catch(() => {
        setData((prev) => ({ ...prev, financialYearMasterId: "" }));
      });
  };

   const [financialyearListData, setFinancialyearListData] = useState([]);
  
    const getFinancialList = () => {
      const response = api
        .get(baseURLMasterData + `financialYearMaster/get-all`)
        .then((response) => {
          setFinancialyearListData(response.data.content.financialYearMaster);
        })
        .catch((err) => {
          setFinancialyearListData([]);
        });
    };
  
    useEffect(() => {
      getFinancialList();
    }, []);



  //   To get TSC by District
    const [tscListData, setTscListData] = useState([]);
  
    const getTscListByDistrict = (districtId) => {
      api
        .post(baseURLMasterData + `tscMaster/get-by-districtId`, {
          districtId: districtId,
        })
        .then((response) => {
          setTscListData(response.data.content.tscMaster);
        })
        .catch((err) => {
          setTscListData([]);
        });
    };
  
    useEffect(() => {
      if (data.districtId) {
        getTscListByDistrict(data.districtId);
      }
    }, [data.districtId]);
  
    // useEffect(() => {
    //   if (editData.districtId) {
    //     getTscListByDistrict(editData.districtId);
    //   }
    // }, [editData.districtId]);


// to get State
  const [districtListData, setDistrictListData] = useState([]);

  const getList = () => {
    const response = api
      .get(baseURLMasterData + `district/get-all`)
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

  // Get Dashboard Data
  const getDashboardList = () => {
    api
      .post(baseURLTarget + `targetsDashboard/get-dashboard`, data)
      .then((response) => {
        setDashboardData(response.data.content);
      })
      .catch(() => {
        setDashboardData([]);
      });
  };

  useEffect(() => {
    getFinancialDefaultDetails();
    getFinancialList();
    getTscListByDistrict();
    getList();
  }, []);

  useEffect(() => {
    if (data.financialYearMasterId) {
      getDashboardList();
    }
  }, [data.financialYearMasterId]);

  useEffect(() => {
    if (dashboardData) {
      setDashboardList([
        {
          stepName: "Mulberry Monthly Target",
          achieveCount: dashboardData.mulberryTotalTarAchievePerMonth,
          targetCount: dashboardData.mulberryTotalTarPerMonth,
          redirect: "/seriui/mulberry-achievement",
        },
        {
          stepName: "Physical Target Monthly Setting",
          achieveCount: dashboardData.productTotalTarAchievePerMonth,
          targetCount: dashboardData.productTotalTarPerMonth,
          redirect: "/seriui/physical-achievement",
        },
        {
          stepName: "Farm Wise Target Setting",
          achieveCount: dashboardData.farmTotalTarAchievePerMonth,
          targetCount: dashboardData.farmTotalTarPerMonth,
          redirect: "/seriui/farm-achievement",
        },
        {
          stepName: "Grainage Wise Target Setting",
          achieveCount: dashboardData.grainageTotalTarAchievePerMonth,
          targetCount: dashboardData.grainageTotalTarPerMonth,
          redirect: "/seriui/grainage-achievement",
        },
        {
          stepName: "Sericulture Training Institute Wise Target Setting",
          achieveCount: dashboardData.trainingTotalTarAchievePerMonth,
          targetCount: dashboardData.trainingTotalTarPerMonth,
          redirect: "/seriui/training-achievement",
        },
        {
          stepName: "Scheme Wise Target Setting",
          achieveCount: dashboardData.schemePhyTarPerMonth,
          targetCount: dashboardData.schemeTotalPhyFinTarPerMonth,
          redirect: "",
        },
      ]);
    }
  }, [dashboardData]);

  const message = (msg) => {
    Swal.fire({
      icon: "warning",
      title: "Warning",
      text: msg,
    });
  };

  const months = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ];

  return (
    <Layout title="User Dashboard">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("User Dashboard")}</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card className="shadow-sm" style={{ maxWidth: "3000px", margin: "auto" }}>
          <Card.Body className="p-3">
          <Row 
  className="g-2 align-items-center w-100" 
  style={{ maxWidth: "3000px", margin: "auto" }}
>
  {/* Financial Year */}
  <Col>
    <Form.Group>
      <Form.Label className="mb-1">{t("Financial Year")}</Form.Label>
      <Form.Select
        name="financialYearMasterId"
        value={data.financialYearMasterId}
        onChange={handleInputs}
        className="form-control form-control-lg bg-white"
      >
        <option value="">{t("Select Year")}</option>
        {financialyearListData?.map((list) => (
          <option key={list.financialYearMasterId} value={list.financialYearMasterId}>
            {list.financialYear}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  </Col>

  {/* Month */}
  <Col>
    <Form.Group>
      <Form.Label className="mb-1">{t("Month")}</Form.Label>
      <Form.Select
        name="month"
        value={data.month}
        onChange={handleInputs}
        className="form-control form-control-lg bg-white"
      >
        <option value="">{t("Select Month")}</option>
        {months.map((m, idx) => (
          <option key={idx} value={m}>
            {m}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  </Col>

  {/* District */}
  <Col>
    <Form.Group>
      <Form.Label className="mb-1">{t("District")}</Form.Label>
      <Form.Select
        name="districtId"
        value={data.districtId}
        onChange={handleInputs}
        className="form-control form-control-lg bg-white"
      >
        <option value="">{t("Select District")}</option>
        {districtListData?.map((list) => (
          <option key={list.districtId} value={list.districtId}>
            {list.districtName}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  </Col>

  {/* TSC */}
  <Col>
    <Form.Group>
      <Form.Label className="mb-1">{t("TSC")}</Form.Label>
      <Form.Select
        name="tscMasterId"
        value={data.tscMasterId}
        onChange={handleInputs}
        className="form-control form-control-lg bg-white"
        disabled={!data.districtId}
      >
        <option value="">{t("Select TSC")}</option>
        {tscListData?.map((list) => (
          <option key={list.tscMasterId} value={list.tscMasterId}>
            {list.name}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  </Col>

  {/* Search Button */}
  <Col className="d-flex align-items-end">
    <Button
      type="button"
      variant="primary"
      onClick={getDashboardList}
      className="shadow-sm btn-lg w-100"
      style={{ backgroundColor: "#0056b3", borderRadius: "8px" }}
    >
      {t("Search")}
    </Button>
  </Col>
</Row>

          </Card.Body>
        </Card>

        <Row className="g-gs d-flex justify-content-center mt-2">
          {dashboardList.map((dashboard, i) => (
            <Col xxl="3" key={i}>
              <Card
                className="h-100"
                style={{
                  borderRadius: "3%",
                  cursor: "pointer",
                  backgroundColor: rainbowColors[i % rainbowColors.length],
                }}
                onClick={() =>
                  dashboard.redirect
                    ? navigate(dashboard.redirect)
                    : message("Scheme achievement is done automatically")
                }
              >
                <Card.Body>
                  <div className="d-flex justify-content-center text-center">
                    <div>
                      <div className="card-title">
                        <h4 className="title mb-1 bold" style={{ color: "white" }}>
                          {dashboard.stepName}
                        </h4>
                      </div>
                      <div className="my-3">
                        <div className="amount h2 fw-bold" style={{ color: "white" }}>
                          {dashboard.achieveCount}/{dashboard.targetCount}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Block>
    </Layout>
  );
}

export default TargetSettingDashboard;

