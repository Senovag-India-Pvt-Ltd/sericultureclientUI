import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Tab, Nav, Card } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import {
  Icon,
} from "../../../components";
import CompaniesData from "../../../store/masters/company/CompaniesData";

function CompanyViewPage() {
  const { id } = useParams();
  const [data] = useState(CompaniesData);
  const [company, setCompany] = useState(data[0]);

  // grabs the id form the url and loads the corresponding data
  useEffect(() => {
    let findUser = data.find((item) => item.id === id);
    setCompany(findUser);
  }, [id, data]);

  return (
    <Layout title="Company View" content="container">
      {/* <Block.Head>
            <Block.HeadBetween className="align-items-start">
                <Block.HeadContent>
                    <div className="d-flex flex-column flex-md-row align-items-md-center">
                        <Media size="huge" shape="circle" variant={company.theme && company.theme}>
                            {company.avatar ? 
                                <Image src={company.avatar} staticImage thumbnail alt="company"/> :
                                <span className="fw-medium">{toInitials(company.name)}</span>
                            }
                        </Media>
                        <div className="mt-3 mt-md-0 ms-md-3">
                            <h3 className="title mb-1">{company.name}</h3>
                            <span className="small">{company.role}</span>
                            <ul className="nk-list-option pt-1">
                                <li><Icon name="map-pin"></Icon><span className="small">{company.address}</span></li>
                                <li><Icon name="building"></Icon><span className="small">{company.company}</span></li>
                            </ul>
                        </div>
                    </div>
                </Block.HeadContent>
                <Block.HeadContent>
                    <div className="d-flex gap g-3">
                        <div className="gap-col">
                            <div className="box-dotted py-2">
                                <div className="d-flex align-items-center">
                                    <div className="h4 mb-0">{company.followers}k</div>
                                    <span className="change up ms-1 small">
                                        <Icon name="arrow-down"></Icon>
                                    </span>
                                </div>
                                <div className="smaller">Followers</div>
                            </div>
                        </div>
                        <div className="gap-col">
                            <div className="box-dotted py-2">
                                <div className="d-flex align-items-center">
                                    <div className="h4 mb-0">{company.following}k</div>
                                    <span className="change up ms-1 small">
                                        <Icon name="arrow-up"></Icon>
                                    </span>
                                </div>
                                <div className="smaller">Following</div>
                            </div>
                        </div>
                    </div>
                </Block.HeadContent>
            </Block.HeadBetween>
        </Block.Head> */}

      <Tab.Container defaultActiveKey="basic-info">
        <Block.HeadBetween>
          <div className="gap-col">
            <Nav variant="pills" className="nav-pills-border gap g-3">
              <Nav.Item>
                <Nav.Link eventKey="basic-info">Basic Info</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="account">Accounts</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="address">Address</Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
          <div className="gap-col">
            <ul className="d-flex gap g-2">
              <li className="d-none d-md-block">
                <Link
                  to={`/user-manage/user-edit/${company.id}`}
                  className="btn btn-soft btn-primary"
                >
                  <Icon name="edit"></Icon>
                  <span>Edit Company</span>
                </Link>
              </li>
              <li className="d-md-none">
                <Link
                  to={`/user-manage/user-edit/${company.id}`}
                  className="btn btn-soft btn-primary btn-icon"
                >
                  <Icon name="edit"></Icon>
                </Link>
              </li>
            </ul>
          </div>
        </Block.HeadBetween>

        <Block className="mt-4">
          <Tab.Content>
            <Tab.Pane eventKey="basic-info">
              <Card>
                <Card.Body>
                  <div className="bio-block">
                    <h4 className="bio-block-title">Company Details</h4>
                    <ul className="list-group list-group-borderless small">
                      <li className="list-group-item">
                        <span className="title fw-medium w-40 d-inline-block">
                          Company Name:
                        </span>
                        <span className="text">{company.name}</span>
                      </li>
                      <li className="list-group-item">
                        <span className="title fw-medium w-40 d-inline-block">
                          Company Code:
                        </span>
                        <span className="text">{company.code}</span>
                      </li>
                      <li className="list-group-item">
                        <span className="title fw-medium w-40 d-inline-block">
                          GSTN:
                        </span>
                        <span className="text">{company.gstn}</span>
                      </li>
                      <li className="list-group-item">
                        <span className="title fw-medium w-40 d-inline-block">
                          PAN
                        </span>
                        <span className="text">{company.pan}</span>
                      </li>
                      <li className="list-group-item">
                        <span className="title fw-medium w-40 d-inline-block">
                          TAAN
                        </span>
                        <span className="text">{company.taan}</span>
                      </li>
                    </ul>
                  </div>
                </Card.Body>
              </Card>
            </Tab.Pane>
          </Tab.Content>
        </Block>

        <Block className="mt-4">
          <Tab.Content>
            <Tab.Pane eventKey="account">
              <Card>
                <Card.Body>
                  <div className="bio-block">
                    <h4 className="bio-block-title">Bank Details</h4>
                    <ul className="list-group list-group-borderless small">
                      <li className="list-group-item">
                        <span className="title fw-medium w-40 d-inline-block">
                          Bank Name:
                        </span>
                        <span className="text">{company.bankName}</span>
                      </li>
                      <li className="list-group-item">
                        <span className="title fw-medium w-40 d-inline-block">
                          Account Name:
                        </span>
                        <span className="text">{company.accName}</span>
                      </li>
                      <li className="list-group-item">
                        <span className="title fw-medium w-40 d-inline-block">
                          Account Number:
                        </span>
                        <span className="text">{company.accNo}</span>
                      </li>
                      <li className="list-group-item">
                        <span className="title fw-medium w-40 d-inline-block">
                          Branch Name
                        </span>
                        <span className="text">{company.branch}</span>
                      </li>
                      <li className="list-group-item">
                        <span className="title fw-medium w-40 d-inline-block">
                          IFSC
                        </span>
                        <span className="text">{company.ifsc}</span>
                      </li>
                      <li className="list-group-item">
                        <span className="title fw-medium w-40 d-inline-block">
                          Bank Address
                        </span>
                        <span className="text">{company.bnkAddress}</span>
                      </li>
                    </ul>
                  </div>
                </Card.Body>
              </Card>
            </Tab.Pane>
          </Tab.Content>
        </Block>

        <Block className="mt-4">
          <Tab.Content>
            <Tab.Pane eventKey="address">
              <Card>
                <Card.Body>
                  <div className="bio-block">
                    <h4 className="bio-block-title">Company Address</h4>
                    <ul className="list-group list-group-borderless small">
                      <li className="list-group-item">
                        <span className="title fw-medium w-40 d-inline-block">
                          Address1:
                        </span>
                        <span className="text">{company.cmpAddress1}</span>
                      </li>
                      <li className="list-group-item">
                        <span className="title fw-medium w-40 d-inline-block">
                          Address2:
                        </span>
                        <span className="text">{company.cmpAddress2}</span>
                      </li>
                      <li className="list-group-item">
                        <span className="title fw-medium w-40 d-inline-block">
                          City:
                        </span>
                        <span className="text">{company.cmpCity}</span>
                      </li>
                      <li className="list-group-item">
                        <span className="title fw-medium w-40 d-inline-block">
                          State
                        </span>
                        <span className="text">{company.cmpState}</span>
                      </li>
                      <li className="list-group-item">
                        <span className="title fw-medium w-40 d-inline-block">
                          Country
                        </span>
                        <span className="text">{company.cmpCounty}</span>
                      </li>
                    </ul>
                  </div>
                </Card.Body>

                <Card.Body>
                  <div className="bio-block">
                    <h4 className="bio-block-title">Billing Address</h4>
                    <ul className="list-group list-group-borderless small">
                      <li className="list-group-item">
                        <span className="title fw-medium w-40 d-inline-block">
                          Address1:
                        </span>
                        <span className="text">{company.billAddress1}</span>
                      </li>
                      <li className="list-group-item">
                        <span className="title fw-medium w-40 d-inline-block">
                          Address2:
                        </span>
                        <span className="text">{company.billAddress2}</span>
                      </li>
                      <li className="list-group-item">
                        <span className="title fw-medium w-40 d-inline-block">
                          City:
                        </span>
                        <span className="text">{company.billCity}</span>
                      </li>
                      <li className="list-group-item">
                        <span className="title fw-medium w-40 d-inline-block">
                          State
                        </span>
                        <span className="text">{company.billState}</span>
                      </li>
                      <li className="list-group-item">
                        <span className="title fw-medium w-40 d-inline-block">
                          Country
                        </span>
                        <span className="text">{company.billCounty}</span>
                      </li>
                    </ul>
                  </div>
                </Card.Body>

                <Card.Body>
                  <div className="bio-block">
                    <h4 className="bio-block-title">Delivery Address</h4>
                    <ul className="list-group list-group-borderless small">
                      <li className="list-group-item">
                        <span className="title fw-medium w-40 d-inline-block">
                          Address1:
                        </span>
                        <span className="text">{company.delAddress1}</span>
                      </li>
                      <li className="list-group-item">
                        <span className="title fw-medium w-40 d-inline-block">
                          Address2:
                        </span>
                        <span className="text">{company.delAddress2}</span>
                      </li>
                      <li className="list-group-item">
                        <span className="title fw-medium w-40 d-inline-block">
                          City:
                        </span>
                        <span className="text">{company.delCity}</span>
                      </li>
                      <li className="list-group-item">
                        <span className="title fw-medium w-40 d-inline-block">
                          State
                        </span>
                        <span className="text">{company.delState}</span>
                      </li>
                      <li className="list-group-item">
                        <span className="title fw-medium w-40 d-inline-block">
                          Country
                        </span>
                        <span className="text">{company.delCounty}</span>
                      </li>
                    </ul>
                  </div>
                </Card.Body>
              </Card>
            </Tab.Pane>
          </Tab.Content>
        </Block>
      </Tab.Container>
    </Layout>
  );
}

export default CompanyViewPage;
