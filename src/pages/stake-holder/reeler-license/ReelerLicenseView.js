import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import ReelerLicenseDatas from "../../../store/reeler-license/ReelerLicenseData";
// import axios from "axios";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function ReelerLicenseView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(EducationDatas);
  const [Reeler, setReeler] = useState({});
  const [loading, setLoading] = useState(false);

  // const [vbAccount, setVbAccount] = useState({});
  // const [loadingVbAccount, setLoadingVbAccount] = useState(false);

  // // grabs the id form the url and loads the corresponding data
  // useEffect(() => {
  //   let findUser = data.find((item) => item.id === id);
  //   setDistrict(findUser);
  // }, [id, data]);

  const getIdList = () => {
    setLoading(true);
    api
      .get(baseURL2 + `reeler/get-by-reeler-id-join/${id}`)
      .then((response) => {
        setReeler(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        setReeler({});
        setLoading(false);
      });
  };

  // const getVbAccountList = () => {
  //   setLoadingVbAccount(true);
  //   axios
  //     .get(baseURL2 + `reeler-virtual-bank-account/get-by-reeler-id/${id}`)
  //     .then((response) => {
  //       setVbAccount(response.data.content);
  //       setLoadingVbAccount(false);
  //     })
  //     .catch((err) => {
  //       setVbAccount({});
  //       setLoadingVbAccount(false);
  //     });
  // }

  const [vbAccountList, setVbAccountList] = useState([]);
  const getVbAccountDetailsList = () => {
    api
      .get(baseURL2 + `reeler-virtual-bank-account/get-by-reeler-id-join/${id}`)
      .then((response) => {
        setVbAccountList(response.data.content.reelerVirtualBankAccount);
      })
      .catch((err) => {
        const message = err.response.data.errorMessages[0].message[0].message;
        setVbAccountList([]);
        // editError(message);
      });
  };

  // console.log(getIdList());

  useEffect(() => {
    getIdList();
    getVbAccountDetailsList();
  }, [id]);

  return (
    <Layout title="Reeler License View">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Reeler License View</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/reeler-license-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/reeler-license-list"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card>
          <Card.Header>Reeler Personal Info</Card.Header>
          <Card.Body>
            <Row className="g-gs">
              <Col lg="4">
                <table className="table small table-bordered">
                  <tbody>
                    <tr>
                      <td style={styles.ctstyle}> Fruits ID:</td>
                      <td>{Reeler.fruitsId}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> ID:</td>
                      <td>{Reeler.reelerId}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Name:</td>
                      <td>{Reeler.reelerName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Father's/Husband's Name:</td>
                      <td>{Reeler.fatherName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Date of Birth:</td>
                      <td>{Reeler.dob}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Gender:</td>
                      <td>
                        {Reeler.gender === 1
                          ? "Male"
                          : Reeler.gender === 2
                          ? "Female"
                          : "Other"}
                      </td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Caste:</td>
                      <td>{Reeler.title}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Mobile Number:</td>
                      <td>{Reeler.mobileNumber}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Father's/Husband's Name:</td>
                      <td>{Reeler.fatherName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Email ID:</td>
                      <td>{Reeler.emailId}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Assign To Inspect:</td>
                      <td>{Reeler.assignToInspectId}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> ARN Number:</td>
                      <td>{Reeler.arnNumber}</td>
                    </tr>
                  </tbody>
                </table>
              </Col>
              <Col lg="4">
                <table className="table small table-bordered">
                  <tbody>
                    <tr>
                      <td style={styles.ctstyle}> Ward Number:</td>
                      <td>{Reeler.wardNumber}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Education:</td>
                      <td>{Reeler.name}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Ration Card:</td>
                      <td>{Reeler.rationCard}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Electricity RR Numbers:</td>
                      <td>{Reeler.electricityRrNumber}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Revenue Document:</td>
                      <td>{Reeler.revenueDocument}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Recipient Id:</td>
                      <td>{Reeler.recipientId}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>
                        {" "}
                        Representative Name and Address:
                      </td>
                      <td>{Reeler.representativeNameAddress}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Revenue Document:</td>
                      <td>{Reeler.revenueDocument}</td>
                    </tr>
                    {/* <tr>
                      <td style={styles.ctstyle}> GPS Coordinates of reeling unit:</td>
                      <td>{Reeler.gpsLat}</td>
                    </tr> */}
                    <tr>
                      <td style={styles.ctstyle}>
                        GPS Coordinates of reeling unit:
                      </td>
                      <td>
                        Latitude: {Reeler.chakbandiLat}, Longitude:{" "}
                        {Reeler.chakbandiLng}
                      </td>
                    </tr>

                    <tr>
                      <td style={styles.ctstyle}> Reeler Number:</td>
                      <td>{Reeler.reelerNumber}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Reeler Type:</td>
                      <td>{Reeler.reelerTypeMasterName}</td>
                    </tr>
                  </tbody>
                </table>
              </Col>

              <Col lg="4">
                <table className="table small table-bordered">
                  <tbody>
                    <tr>
                      <td style={styles.ctstyle}> Passbook Number:</td>
                      <td>{Reeler.passbookNumber}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Reeling Unit Boundary:</td>
                      <td>{Reeler.reelingUnitBoundary}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>
                        {" "}
                        Date of Machine Installation:
                      </td>
                      <td>{Reeler.dateOfMachineInstallation}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Machine Type:</td>
                      <td>{Reeler.machineTypeName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Number of Basins/Charaka:</td>
                      <td>{Reeler.numberOfBasins}</td>
                    </tr>

                    {/* <tr>
                      <td style={styles.ctstyle}> Mahajar Details:</td>
                      <td>{Reeler.mahajarDetails}</td>
                    </tr> */}
                    <tr>
                      <td style={styles.ctstyle}> Loan Details:</td>
                      <td>{Reeler.loanDetails}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Inspection Date:</td>
                      <td>{Reeler.inspectionDate}</td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="mt-3">
          <Card.Header>Address</Card.Header>
          <Card.Body>
            <Row className="g-gs">
              <Col lg="6">
                <table className="table small table-bordered">
                  <tbody>
                    <tr>
                      <td style={styles.ctstyle}> State:</td>
                      <td>{Reeler.stateName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> District:</td>
                      <td>{Reeler.districtName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Taluk:</td>
                      <td>{Reeler.talukName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Hobli:</td>
                      <td>{Reeler.hobliName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Village:</td>
                      <td>{Reeler.villageName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Address:</td>
                      <td>{Reeler.address}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Pincode:</td>
                      <td>{Reeler.pincode}</td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="mt-3">
          <Card.Header>License Details</Card.Header>
          <Card.Body>
            <Row className="g-gs">
              <Col lg="6">
                <table className="table small table-bordered">
                  <tbody>
                    <tr>
                      <td style={styles.ctstyle}> Receipt Number:</td>
                      <td>{Reeler.licenseReceiptNumber}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Receipt Date:</td>
                      <td>{Reeler.receiptDate}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Reeling License Number:</td>
                      <td>{Reeler.reelingLicenseNumber}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Member of RCS/FPO/Others:</td>
                      <td>{Reeler.memberLoanDetails}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> License Expiry Date:</td>
                      <td>{Reeler.licenseExpiryDate}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Function of the Unit:</td>
                      <td>{Reeler.functionOfUnit}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Fee Amount:</td>
                      <td>{Reeler.feeAmount}</td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="mt-3">
          <Card.Header>Chakbandi Details</Card.Header>
          <Card.Body>
            <Row className="g-gs">
              <Col lg="6">
                <table className="table small table-bordered">
                  <tbody>
                    <tr>
                      <td style={styles.ctstyle}> East:</td>
                      <td>{Reeler.mahajarEast}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> West:</td>
                      <td>{Reeler.mahajarWest}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>North:</td>
                      <td>{Reeler.mahajarNorth}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> South:</td>
                      <td>{Reeler.mahajarSouth}</td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="mt-3">
          <Card.Header>Bank Account Details</Card.Header>
          <Card.Body>
            <Row className="g-gs">
              <Col lg="6">
                <table className="table small table-bordered">
                  <tbody>
                    <tr>
                      <td style={styles.ctstyle}> BankName:</td>
                      <td>{Reeler.bankName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Bank Account Number:</td>
                      <td>{Reeler.bankAccountNumber}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>BranchName:</td>
                      <td>{Reeler.branchName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Ifsc Code:</td>
                      <td>{Reeler.ifscCode}</td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <Card className="mt-3">
          <Card.Header>Virtual Bank Account</Card.Header>
          <Card.Body>
            {/* {console.log('Virtual Bank Account List:', vbAccountList)}
          {vbAccountList && vbAccountList.length > 0 ? (
            vbAccountList.map((vbAccount) => (
              <Row className="g-gs" key={vbAccount.reelerVirtualBankAccountId}> */}
            {/* {console.log(vbAccount.reelerVirtualBankAccountId)} */}
            {/* <Row className="g-gs"> */}
            {vbAccountList && vbAccountList.length > 0
              ? vbAccountList.map((vbAccount) => (
                  <Row className="g-gs">
                    {console.log(vbAccount.reelerVirtualBankAccountId)}
                    <Col lg="4">
                      <table className="table small table-bordered">
                        <tbody>
                          <tr>
                            <td style={styles.ctstyle}> Virtual Bank ID:</td>
                            <td>{vbAccount.reelerVirtualBankAccountId}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}> Reeler Id:</td>
                            <td>{vbAccount.reelerId}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>
                              {" "}
                              Virtual Account Number:
                            </td>
                            <td>{vbAccount.virtualAccountNumber}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}> Branch Name:</td>
                            <td>{vbAccount.branchName}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>Ifsc Code:</td>
                            <td>{vbAccount.ifscCode}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}> Market:</td>
                            <td>{vbAccount.marketMasterName}</td>
                          </tr>
                        </tbody>
                      </table>
                    </Col>
                  </Row>
                ))
              : ""}
          </Card.Body>
        </Card>
      </Block>
    </Layout>
  );
}

export default ReelerLicenseView;
