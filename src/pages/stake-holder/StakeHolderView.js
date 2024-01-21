import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import {
  Icon,
} from "../../components";
import axios from "axios";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA; 
const baseURL2 = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function StakeHolderViewPage() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  
  const [StakeHolder, setStakeHolder] = useState({});
  const [loading, setLoading] = useState(false);

  const [bank, setBank ]= useState({});
  const [loadingBank, setLoadingBank] = useState(false);


  const getIdList = () => {
    setLoading(true);
    axios
      .get(baseURL2 + `farmer/get-by-farmer-id-join/${id}`)
      .then((response) => {
        setStakeHolder(response.data.content);
        if(response.data.content.photoPath){
          getFile(response.data.content.photoPath)
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
    axios
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
    axios
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
    axios
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
    axios
      .get(baseURL2 + `farmer-bank-account/get-by-farmer-id/${id}`)
      .then((response) => {
        setBank(response.data.content);
        if(response.data.content.accountImagePath){
          getDocumentFile(response.data.content.accountImagePath)
        }
        setLoadingBank(false);
      })
      .catch((err) => {
        setBank({});
        setLoadingBank(false);
      });
  }

  // To get Photo
  const [selectedDocumentFile, setSelectedDocumentFile] = useState(null);

  const getDocumentFile = async (file) => {
    const parameters = `fileName=${file}`
    try {
      const response = await axios.get(baseURL2+`api/s3/download?${parameters}`, {
        responseType: 'arraybuffer',
      }); 
      const blob = new Blob([response.data]);
      const url = URL.createObjectURL(blob);
      setSelectedDocumentFile(url);
    } catch (error) {
      console.error('Error fetching file:', error);
    }
  }

  // To get Photo
  const [selectedFile, setSelectedFile] = useState(null);

  const getFile = async (file) => {
    const parameters = `fileName=${file}`
    try {
      const response = await axios.get(baseURL2+`api/s3/download?${parameters}`, {
        responseType: 'arraybuffer',
      }); 
      const blob = new Blob([response.data]);
      const url = URL.createObjectURL(blob);
      setSelectedFile(url);
    } catch (error) {
      console.error('Error fetching file:', error);
    }
  }

  // console.log(getIdList());

  useEffect(() => {
    getIdList();
    getFamilyMembersDetailsList();
    getFarmerAddressDetailsList();
    getFLDetailsList();
    getBankList();
  }, [id]);


  // console.log(getIdList());

  // useEffect(() => {
  //   getFamilyMembersList();
  // }, [familyMemberId]);


  return (
    <Layout title="Stake Holder View">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Farmer View</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/stake-holder-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/stake-holder-list"
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
          <Card.Header>Farmer Personal Info</Card.Header>
          <Card.Body>
            <Row className="g-gs">
              <Col lg="4">
                <table className="table small table-bordered">
                  <tbody>
                  <tr>
                      <td style={styles.ctstyle}> Fruits Id:</td>
                      <td>{StakeHolder.fruitsId}</td>
                    </tr>
                  <tr>
                      <td style={styles.ctstyle}> Farmer Id:</td>
                      <td>{StakeHolder.farmerId}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Farmer Name:</td>
                      <td>{StakeHolder.firstName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Farmer Name in Kannada:</td>
                      <td>{StakeHolder.nameKan}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Father's/Husband's Name:</td>
                      <td>{StakeHolder.fatherName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Farmer DOB:</td>
                      <td>{StakeHolder.dob}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Gender:</td>
                      <td>
                        {StakeHolder.gender === 1
                          ? 'Male'
                          : StakeHolder.gender === 2
                          ? 'Female'
                          : 'Other'}
                      </td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Caste:</td>
                      <td>{StakeHolder.title}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Differently Abled:</td>
                      <td>{StakeHolder.differentlyAbled === true
                        ? 'Yes'
                          : StakeHolder.differentlyAbled === false
                          ? 'No'
                          :null}
                          </td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Passbook Number:</td>
                      <td>{StakeHolder.passbookNumber}</td>
                    </tr>
                  </tbody>
                </table>
              </Col>
              <Col lg="4">
                <table className="table small table-bordered">
                  <tbody>
                    <tr>
                      <td style={styles.ctstyle}> Email ID:</td>
                      <td>{StakeHolder.email}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Mobile Number:</td>
                      <td>{StakeHolder.mobileNumber}</td>
                    </tr>
                    {/* <tr>
                      <td style={styles.ctstyle}>Aadhar Number:</td>
                      <td>{StakeHolder.aadhaarNumber}</td>
                    </tr> */}
                    <tr>
                      <td style={styles.ctstyle}> EPIC Number:</td>
                      <td>{StakeHolder.epicNumber}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Ration Card:</td>
                      <td>{StakeHolder.rationCardNumber}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>
                        {" "}
                        Extent of Total Land Holding in Acres:
                      </td>
                      <td>{StakeHolder.totalLandHolding}</td>
                    </tr>
                  </tbody>
                </table>
              </Col>
              <Col lg="4">
                <table className="table small table-bordered">
                  <tbody>
                    {/* <tr>
                      <td style={styles.ctstyle}> Landholding Category:</td>
                      <td>{StakeHolder.landCategoryName}</td>
                    </tr> */}
                    <tr>
                      <td style={styles.ctstyle}> Farmer Number:</td>
                      <td>{StakeHolder.farmerNumber}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Farmer Type:</td>
                      <td>{StakeHolder.farmerTypeName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Education:</td>
                      <td>{StakeHolder.name}</td>
                    </tr>
                    {/* <tr>
                      <td style={styles.ctstyle}>Representatives/Agent:</td>
                      <td>{StakeHolder.representativeId}</td>
                    </tr> */}
                    <tr>
                      <td style={styles.ctstyle}> Recipient ID(Khazane II):</td>
                      <td>{StakeHolder.khazaneRecipientId}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Farmer Photo:</td>
                      {/* <td>{StakeHolder.taluk}</td> */}
                      <td>
                        {" "}
                        {/* <img
                          style={{ height: "100px", width: "100px" }}
                          src="../images/user/user.png"
                        /> */}
                         {selectedFile && <img style={{ height: "100px", width: "100px" }} src={selectedFile} alt="Selected File" />}
                      </td>
                    </tr>
                    {/* <tr>
                    {selectedFile && <img style={{ height: "100px", width: "100px" }} src={selectedFile} alt="Selected File" />}
                    </tr> */}
                  </tbody>
                </table>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <Card className="mt-3">
          <Card.Header>Family Members</Card.Header>
          <Card.Body>
            {/* <Row className="g-gs"> */}
            {familyMembersList && familyMembersList.length>0?(familyMembersList.map((familyMembers)=>(
                  <Row className="g-gs">
                  {console.log(familyMembers.farmerFamilyId)}
              <Col lg="4">
                <table className="table small table-bordered">
                  <tbody>
                    <tr>
                      <td style={styles.ctstyle}> Farmer Family Id:</td>
                      <td>{familyMembers.farmerFamilyId}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Farmer  Id:</td>
                      <td>{familyMembers.farmerId}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Name:</td>
                      <td>{familyMembers.farmerFamilyName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Relationship:</td>
                      <td>{familyMembers.relationshipName}</td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>

            ))):""} 
          </Card.Body>
        </Card>

        <Card className="mt-3">
          <Card.Header>Address</Card.Header>
          <Card.Body>
      
            {farmerAddressDetailsList && farmerAddressDetailsList.length>0?(farmerAddressDetailsList.map((farmerAddressDetails)=>(
                  <Row className="g-gs">
                  {console.log(farmerAddressDetails.farmerAddressId)}
              <Col lg="4">
                <table className="table small table-bordered">
                  <tbody>
                    <tr>
                      <td style={styles.ctstyle}>Farmer Address Id:</td>
                      <td>{farmerAddressDetails.farmerAddressId}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Farmer Id:</td>
                      <td>{farmerAddressDetails.farmerId}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Address:</td>
                      <td>{farmerAddressDetails.addressText}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Village:</td>
                      <td>{farmerAddressDetails.villageName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Taluk:</td>
                      <td>{farmerAddressDetails.talukName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> District:</td>
                      <td>{farmerAddressDetails.districtName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> State:</td>
                      <td>{farmerAddressDetails.stateName}</td>
                    </tr>
                    {farmerAddressDetails.defaultAddress && (
                    <tr>
                      <td style={styles.ctstyle}> Default Address:</td>
                      <td>{farmerAddressDetails.defaultAddress.toString()}</td>
                    </tr>
                    )}
                  </tbody>
                </table>
              </Col>
            </Row>
            ))):""}
          </Card.Body>
        </Card>

        <Card className="mt-3">
          <Card.Header>Farmers Land Details</Card.Header>
          <Card.Body>
            

                {farmerLandList && farmerLandList.length>0?(farmerLandList.map((farmerLand)=>(
                  <Row className="g-gs">
                  {console.log(farmerLand.farmerLandDetailsId)}
                  <Col lg="4">
                  <table className="table small table-bordered">
                  <tbody>
                  <tr>
                      <td style={styles.ctstyle}> Farmer Land Details Id:</td>
                      <td>{farmerLand.farmerLandDetailsId}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Farmer Id:</td>
                      <td>{farmerLand.farmerId}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Land Ownership:</td>
                      <td>{farmerLand.landOwnershipName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Survey Number:</td>
                      <td>{farmerLand.surveyNumber}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Pltatantation Type:</td>
                      <td>{farmerLand.plantationTypeName}</td>
                    </tr>
                    {/* <tr>
                      <td style={styles.ctstyle}> Category Number:</td>
                      <td>{farmerLand.categoryNumber}</td>
                    </tr> */}
                  </tbody>
                </table>
                </Col>


                <Col lg="4">
                <table className="table small table-bordered">
                  <tbody>
                  <tr>
                      <td style={styles.ctstyle}> soil Type :</td>
                      <td>{farmerLand.soilTypeName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Hissa:</td>
                      <td>{farmerLand.hissa}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Mulberry Source:</td>
                      <td>{farmerLand.mulberrySourceName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Mulberry Area:</td>
                      <td>{farmerLand.mulberryArea}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Mulberry Variety:</td>
                      <td>{farmerLand.mulberryVarietyName}</td>
                    </tr>
                    {/* <tr>
                      <td style={styles.ctstyle}> Plantation Date:</td>
                      <td>{farmerLand.plantationDate}</td>
                    </tr> */}
                    <tr>
                      <td style={styles.ctstyle}> Spacing:</td>
                      <td>{farmerLand.spacing}</td>
                    </tr>
                  </tbody>
                </table>
              </Col>
              <Col lg="4">
                <table className="table small table-bordered">
                  <tbody>
                    <tr>
                      <td style={styles.ctstyle}> Irrigation Source:</td>
                      <td>{farmerLand.irrigationSourceName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Irrigation Type:</td>
                      <td>{farmerLand.irrigationTypeName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Rearing House Details:</td>
                      <td>{farmerLand.rearingHouseDetails}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Roof Type:</td>
                      <td>{farmerLand.roofTypeName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> SilkWorm Variety:</td>
                      <td>{farmerLand.silkWormVarietyName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>
                        Rearing Capacity Crops:
                      </td>
                      <td>{farmerLand.rearingCapacityCrops}</td>
                    </tr>
                  </tbody>
                </table>
              </Col>
              <Col lg="4">
                <table className="table small table-bordered">
                  <tbody>
                    <tr>
                      <td style={styles.ctstyle}> Rearing Capacity Dlf:</td>
                      <td>{farmerLand.rearingCapacityDlf}</td>
                    </tr>
                    {/* <tr>
                      <td style={styles.ctstyle}> Subsidy Availed:</td>
                      <td>{farmerLand.subsidyAvailed}</td>
                    </tr> */}
                    {/* <tr>
                      <td style={styles.ctstyle}>Subsidy:</td>
                      <td>{farmerLand.subsidyName}</td>
                    </tr> */}
                    <tr>
                      <td style={styles.ctstyle}>Loan Details:</td>
                      <td>{farmerLand.loanDetails}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Equipment Details:</td>
                      <td>{farmerLand.equipmentDetails}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Owner Name:</td>
                      <td>{farmerLand.ownerName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Owner Number:</td>
                      <td>{farmerLand.ownerNo}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Main Owner No:</td>
                      <td>{farmerLand.mainOwnerNo}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>
                        Survey NOc:
                      </td>
                      <td>{farmerLand.surNoc}</td>
                    </tr>
                  </tbody>
                </table>
              </Col>
              <Col lg="4">
                <table className="table small table-bordered">
                  <tbody>
                    <tr>
                      <td style={styles.ctstyle}> Acre:</td>
                      <td>{farmerLand.acre}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Gunta:</td>
                      <td>{farmerLand.gunta}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> State:</td>
                      <td>{farmerLand.stateName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Fgunta:</td>
                      <td>{farmerLand.fgunta}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> District:</td>
                      <td>{farmerLand.districtName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Taluk:</td>
                      <td>{farmerLand.talukName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Hobli:</td>
                      <td>{farmerLand.hobliName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Village:</td>
                      <td>{farmerLand.villageName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>
                        Address:
                      </td>
                      <td>{farmerLand.address}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Pincode:</td>
                      <td>{farmerLand.pincode}</td>
                    </tr>
                  </tbody>
                </table>
              </Col>
              </Row>

                ))):""}           
          </Card.Body>
        </Card>

        <Card className="mt-3">
          <Card.Header>Bank Account Details</Card.Header>
          <Card.Body>
            <Row className="g-gs">
              <Col lg="4">
                <table className="table small table-bordered">
                  <tbody>
                    <tr>
                      <td style={styles.ctstyle}> Farmer Bank Account Id:</td>
                      <td>{bank.farmerBankAccountId}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Farmer Id:</td>
                      <td>{bank.farmerId}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Bank Name:</td>
                      <td>{bank.farmerBankName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Bank Account Number:</td>
                      <td>{bank.farmerBankAccountNumber}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Branch Name:</td>
                      <td>{bank.farmerBankBranchName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> IFSC Code:</td>
                      <td>{bank.farmerBankIfscCode}</td>
                    </tr>

                    <tr>
                      <td style={styles.ctstyle}> Bank Passbook:</td>
                      {/* <td>{StakeHolder.taluk}</td> */}
                      <td>
                        {" "}
                        {/* <img
                          style={{ height: "100px", width: "100px" }}
                          src="../images/user/user.png"
                        /> */}
                         {selectedDocumentFile && <img style={{ height: "100px", width: "100px" }} src={selectedDocumentFile} alt="Selected File" />}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Block>
    </Layout>
  );
}

export default StakeHolderViewPage;
