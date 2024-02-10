import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Tab, Nav, Card, Button, Alert, Row, Col } from "react-bootstrap";
import parse from "html-react-parser";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import {
  Image,
  Icon,
  Schedule,
  Media,
  MediaGroup,
  MediaText,
} from "../../components";
import UsersData from "../../store/users/UsersData";
import { toInitials } from "../../utilities";

function UserProfilePage() {
  const { id } = useParams();
  const [data] = useState(UsersData);
  const [user, setUser] = useState(data[0]);

  // grabs the id form the url and loads the corresponding data
  useEffect(() => {
    let findUser = data.find((item) => item.id === id);
    setUser(findUser);
  }, [id, data]);

  return (
    <Layout title="Users Profile" content="container">
      <Block.Head>
        <Block.HeadBetween className="align-items-start">
          <Block.HeadContent>
            <div className="d-flex flex-column flex-md-row align-items-md-center">
              <Media
                size="huge"
                shape="circle"
                variant={user.theme && user.theme}
              >
                {user.avatar ? (
                  <Image src={user.avatar} staticImage thumbnail alt="user" />
                ) : (
                  <span className="fw-medium">{toInitials(user.name)}</span>
                )}
              </Media>
              <div className="mt-3 mt-md-0 ms-md-3">
                <h3 className="title mb-1">{user.name}</h3>
                <span className="small">{user.role}</span>
                <ul className="nk-list-option pt-1">
                  <li>
                    <Icon name="map-pin"></Icon>
                    <span className="small">{user.address}</span>
                  </li>
                  <li>
                    <Icon name="building"></Icon>
                    <span className="small">{user.company}</span>
                  </li>
                </ul>
              </div>
            </div>
          </Block.HeadContent>
          <Block.HeadContent>
            <div className="d-flex gap g-3">
              <div className="gap-col">
                <div className="box-dotted py-2">
                  <div className="d-flex align-items-center">
                    <div className="h4 mb-0">{user.followers}k</div>
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
                    <div className="h4 mb-0">{user.following}k</div>
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
      </Block.Head>

      <Tab.Container defaultActiveKey="tabOne">
        <Block.HeadBetween>
          <div className="gap-col">
            <Nav variant="pills" className="nav-pills-border gap g-3">
              <Nav.Item>
                <Nav.Link eventKey="tabOne">Overview</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link>Project</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link>Documents</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link>Disabled</Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
          <div className="gap-col">
            <ul className="d-flex gap g-2">
              <li className="d-none d-md-block">
                <Link
                  to={`/user-manage/user-edit/${user.id}`}
                  className="btn btn-soft btn-primary"
                >
                  <Icon name="edit"></Icon>
                  <span>Edit Profile</span>
                </Link>
              </li>
              <li className="d-md-none">
                <Link
                  to={`/user-manage/user-edit/${user.id}`}
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
            <Tab.Pane eventKey="tabOne">
              <Card>
                <div className="card-row card-row-lg col-sep col-sep-lg">
                  <div className="card-aside">
                    <Card.Body>
                      <div className="bio-block">
                        <h4 className="bio-block-title">Details</h4>
                        <ul className="list-group list-group-borderless small">
                          <li className="list-group-item">
                            <span className="title fw-medium w-40 d-inline-block">
                              Account ID:
                            </span>
                            <span className="text">45453423</span>
                          </li>
                          <li className="list-group-item">
                            <span className="title fw-medium w-40 d-inline-block">
                              Full Name:
                            </span>
                            <span className="text">{user.name}</span>
                          </li>
                          <li className="list-group-item">
                            <span className="title fw-medium w-40 d-inline-block">
                              Email:
                            </span>
                            <span className="text">{user.email}</span>
                          </li>
                          <li className="list-group-item">
                            <span className="title fw-medium w-40 d-inline-block">
                              Address:
                            </span>
                            <span className="text">{user.address}</span>
                          </li>
                          <li className="list-group-item">
                            <span className="title fw-medium w-40 d-inline-block">
                              Joining Date
                            </span>
                            <span className="text">{user.joining}</span>
                          </li>
                        </ul>
                      </div>
                      <div className="bio-block">
                        <h4 className="bio-block-title mb-2">Skills</h4>
                        <ul className="d-flex flex-wrap gap gx-1">
                          {user.skills.map((item) => {
                            return (
                              <li key={item}>
                                <Link
                                  to="/seriui/user-manage/user-profile"
                                  className="badge text-bg-secondary-soft"
                                >
                                  {item}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                      <div className="bio-block">
                        <h4 className="bio-block-title mb-3">Social</h4>
                        <ul className="d-flex flex-wrap gap g-2">
                          {user.social.map((item) => {
                            return (
                              <li key={item.site}>
                                <Media
                                  size="sm"
                                  to={item.link}
                                  className={`${item.variant}`}
                                >
                                  <Icon name={item.site}></Icon>
                                </Media>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </Card.Body>
                  </div>
                  <div className="card-content col-sep">
                    <Card.Body>
                      <div className="bio-block">
                        <h4 className="bio-block-title">About Me</h4>
                        {parse(user.description)}
                        <Row className="g-gs pt-2">
                          <Col lg="6">
                            <div className="small">Designation:</div>
                            <h5 className="small">{user.designation}</h5>
                          </Col>
                          <Col lg="6">
                            <div className="small">Website:</div>
                            <h5 className="small">{user.website}</h5>
                          </Col>
                        </Row>
                      </div>
                    </Card.Body>
                    <Card.Body>
                      <div className="bio-block">
                        <h4 className="bio-block-title">Recent Activity</h4>
                        {user.activity && (
                          <Schedule className="mt-4">
                            {user.activity.map((item, index) => {
                              return (
                                <Schedule.Item
                                  symbol="active"
                                  key={index}
                                  contentClass={`${
                                    item.type === "file"
                                      ? "nk-schedule-content-no-border"
                                      : item.type === "alert"
                                      ? "nk-schedule-content-no-border flex-grow-1"
                                      : ""
                                  }`}
                                >
                                  <span className="smaller">{item.time}</span>
                                  <div className="h6">{item.title}</div>
                                  {item.images && (
                                    <ul className="d-flex flex-wrap gap g-2 pt-2">
                                      {item.images.map((el, index) => (
                                        <li key={index}>
                                          <Media size="xxl">
                                            <Image
                                              src={el.src}
                                              alt={el.alt}
                                              thumbnail
                                            />
                                          </Media>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                  {item.files && (
                                    <div className="list-group-dotted mt-3">
                                      <div className="list-group-wrap">
                                        {item.files.map((el, index) => (
                                          <div className="p-3" key={index}>
                                            <MediaGroup>
                                              <Media className="rounded-0">
                                                <Image
                                                  src={`${
                                                    el.type === "pdf"
                                                      ? "/images/icon/file-type-pdf.svg"
                                                      : el.type === "doc"
                                                      ? "/images/icon/file-type-doc.svg"
                                                      : el.type === "code"
                                                      ? "/images/icon/file-type-code.svg"
                                                      : "/images/icon/file-type-pdf.svg"
                                                  }`}
                                                  alt="icon"
                                                />
                                              </Media>
                                              <MediaText className="ms-1">
                                                <a
                                                  href="#download"
                                                  className="title"
                                                >
                                                  {el.title}
                                                </a>
                                                <span className="text smaller">
                                                  {el.size}
                                                </span>
                                              </MediaText>
                                            </MediaGroup>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {item.alerts &&
                                    item.alerts.map((el, index) => {
                                      return (
                                        <Alert
                                          variant="info"
                                          className="mt-2"
                                          key={index}
                                        >
                                          <div className="d-flex">
                                            <Icon
                                              className="opacity-75"
                                              size="lg"
                                              name={el.icon}
                                            ></Icon>
                                            <div className="ms-2 d-flex flex-wrap flex-grow-1 justify-content-between">
                                              <div>
                                                <h6 className="alert-heading mb-0">
                                                  {el.title}
                                                </h6>
                                                <span className="smaller">
                                                  {el.description}
                                                </span>
                                              </div>
                                              <ul className="d-flex gap g-2 pt-1">
                                                {el.buttons &&
                                                  el.buttons.map(
                                                    (btn, index) => {
                                                      return (
                                                        <li key={index}>
                                                          <Button
                                                            size="md"
                                                            variant="info"
                                                          >
                                                            <Icon
                                                              name={btn.icon}
                                                            ></Icon>
                                                            <span>
                                                              {btn.text}
                                                            </span>
                                                          </Button>
                                                        </li>
                                                      );
                                                    }
                                                  )}
                                              </ul>
                                            </div>
                                          </div>
                                        </Alert>
                                      );
                                    })}
                                </Schedule.Item>
                              );
                            })}
                          </Schedule>
                        )}
                      </div>
                    </Card.Body>
                  </div>
                </div>
              </Card>
            </Tab.Pane>
          </Tab.Content>
        </Block>
      </Tab.Container>
    </Layout>
  );
}

export default UserProfilePage;
