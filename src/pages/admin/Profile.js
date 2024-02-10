import { Link } from "react-router-dom";
import { Tab, Nav, Card, Button, Alert, Row, Col } from "react-bootstrap";

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

function MyProfilePage() {
  return (
    <Layout title="My Profile" content="container">
      <Block.Head>
        <Block.HeadBetween className="align-items-start">
          <Block.HeadContent>
            <div className="d-flex flex-column flex-md-row align-items-md-center">
              <Media size="huge" shape="circle">
                <Image
                  src="/images/avatar/profile-img.png"
                  staticImage
                  thumbnail
                  alt="user"
                />
              </Media>
              <div className="mt-3 mt-md-0 ms-md-3">
                <h3 className="title mb-1">Prabhu Patil</h3>
                <span className="small">Admin</span>
                <ul className="nk-list-option pt-1">
                  <li>
                    <Icon name="map-pin"></Icon>
                    <span className="small">Bangalore, India</span>
                  </li>
                  <li>
                    <Icon name="building"></Icon>
                    <span className="small">M-2 Group</span>
                  </li>
                </ul>
              </div>
            </div>
          </Block.HeadContent>
          {/* <Block.HeadContent>
                    <div className="d-flex gap g-3">
                        <div className="gap-col">
                            <div className="box-dotted py-2">
                                <div className="d-flex align-items-center">
                                    <div className="h4 mb-0">44.3k</div>
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
                                    <div className="h4 mb-0">4.5k</div>
                                    <span className="change up ms-1 small">
                                        <Icon name="arrow-up"></Icon>
                                    </span>
                                </div>
                                <div className="smaller">Following</div>
                            </div>
                        </div>
                    </div>
                </Block.HeadContent> */}
        </Block.HeadBetween>
      </Block.Head>

      <Tab.Container defaultActiveKey="tabOne">
        <Block.HeadBetween>
          <div className="gap-col">
            <Nav variant="pills" className="nav-pills-border gap g-3">
              <Nav.Item>
                <Nav.Link eventKey="tabOne">Overview</Nav.Link>
              </Nav.Item>
              {/* <Nav.Item>
                            <Nav.Link>Project</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link>Documents</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link>Disabled</Nav.Link>
                        </Nav.Item> */}
            </Nav>
          </div>
          <div className="gap-col">
            <ul className="d-flex gap g-2">
              <li className="d-none d-md-block">
                <Link
                  to="/seriui/admin/profile-settings"
                  className="btn btn-soft btn-primary"
                >
                  <Icon name="edit"></Icon>
                  <span>Edit Profile</span>
                </Link>
              </li>
              <li className="d-md-none">
                <Link
                  to="/seriui/admin/profile-settings"
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
                            <span className="text">ID-45453423</span>
                          </li>
                          <li className="list-group-item">
                            <span className="title fw-medium w-40 d-inline-block">
                              Full Name:
                            </span>
                            <span className="text">Prabhu Patil</span>
                          </li>
                          <li className="list-group-item">
                            <span className="title fw-medium w-40 d-inline-block">
                              Email:
                            </span>
                            <span className="text">
                              prabhu.nija.patil@gmail.com
                            </span>
                          </li>
                          <li className="list-group-item">
                            <span className="title fw-medium w-40 d-inline-block">
                              Address:
                            </span>
                            <span className="text">Bangalore, India</span>
                          </li>
                          <li className="list-group-item">
                            <span className="title fw-medium w-40 d-inline-block">
                              Joining Date
                            </span>
                            <span className="text">2 Dec 2022</span>
                          </li>
                        </ul>
                      </div>
                      <div className="bio-block">
                        <h4 className="bio-block-title mb-2">Skills</h4>
                        <ul className="d-flex flex-wrap gap gx-1">
                          <li>
                            <a
                              href="#skill"
                              className="badge text-bg-secondary-soft"
                            >
                              Photoshop
                            </a>
                          </li>
                          <li>
                            <a
                              href="#skill"
                              className="badge text-bg-secondary-soft"
                            >
                              illustrator
                            </a>
                          </li>
                          <li>
                            <a
                              href="#skill"
                              className="badge text-bg-secondary-soft"
                            >
                              HTML
                            </a>
                          </li>
                          <li>
                            <a
                              href="#skill"
                              className="badge text-bg-secondary-soft"
                            >
                              CSS
                            </a>
                          </li>
                          <li>
                            <a
                              href="#skill"
                              className="badge text-bg-secondary-soft"
                            >
                              Javascript
                            </a>
                          </li>
                          <li>
                            <a
                              href="#skill"
                              className="badge text-bg-secondary-soft"
                            >
                              React
                            </a>
                          </li>
                          <li>
                            <a
                              href="#skill"
                              className="badge text-bg-secondary-soft"
                            >
                              Vue
                            </a>
                          </li>
                          <li>
                            <a
                              href="#skill"
                              className="badge text-bg-secondary-soft"
                            >
                              Angular
                            </a>
                          </li>
                          <li>
                            <a
                              href="#skill"
                              className="badge text-bg-secondary-soft"
                            >
                              Python
                            </a>
                          </li>
                        </ul>
                      </div>
                      {/* <div className="bio-block">
                                            <h4 className="bio-block-title mb-3">Social</h4>
                                            <ul className="d-flex flex-wrap gap g-2">
                                                <li>
                                                    <Media size="sm" to="/seriui/" variant="dark">
                                                        <Icon name="github-circle"></Icon>
                                                    </Media>
                                                </li>
                                                <li>
                                                    <Media size="sm" to="/seriui/" variant="danger">
                                                        <Icon name="dribbble"></Icon>
                                                    </Media>
                                                </li>
                                                <li>
                                                    <Media size="sm" to="/seriui/" variant="info">
                                                        <Icon name="twitter"></Icon>
                                                    </Media>
                                                </li>
                                                <li>
                                                    <Media size="sm" to="/seriui/" variant="pink">
                                                        <Icon name="linkedin"></Icon>
                                                    </Media>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="bio-block">
                                            <h4 className="bio-block-title mb-3">Suggestions</h4>
                                            <ul className="d-flex flex-column gap gy-2">
                                                <li>
                                                    <MediaGroup>
                                                        <Media size="md">
                                                            <Image src="/images/avatar/a.jpg" alt="user" />
                                                        </Media>
                                                        <MediaText>
                                                            <div className="lead-text">Kamran Ahmed</div>
                                                            <span className="sub-text">Frontend Developer</span>
                                                        </MediaText>
                                                        <MediaAction end>
                                                            <Button size="sm" variant="secondary" className="btn-icon btn-soft">
                                                                <Icon name="user-add"></Icon>
                                                            </Button>
                                                        </MediaAction>
                                                    </MediaGroup>
                                                </li>
                                                <li>
                                                    <MediaGroup>
                                                        <Media size="md">
                                                            <Image src="/images/avatar/b.jpg" alt="user" />
                                                        </Media>
                                                        <MediaText>
                                                            <div className="lead-text">Harriett Adkins</div>
                                                            <span className="sub-text">UI/UX Designer</span>
                                                        </MediaText>
                                                        <MediaAction end>
                                                            <Button size="sm" variant="secondary" className="btn-icon btn-soft">
                                                                <Icon name="user-add"></Icon>
                                                            </Button>
                                                        </MediaAction>
                                                    </MediaGroup>
                                                </li>
                                                <li>
                                                    <MediaGroup>
                                                        <Media size="md">
                                                            <Image src="/images/avatar/c.jpg" alt="user" />
                                                        </Media>
                                                        <MediaText>
                                                            <div className="lead-text">George Whalen</div>
                                                            <span className="sub-text">Backend Developer</span>
                                                        </MediaText>
                                                        <MediaAction end>
                                                            <Button size="sm" variant="secondary" className="btn-icon btn-soft">
                                                                <Icon name="user-add"></Icon>
                                                            </Button>
                                                        </MediaAction>
                                                    </MediaGroup>
                                                </li>
                                                <li>
                                                    <MediaGroup>
                                                        <Media size="md">
                                                            <Image src="/images/avatar/d.jpg" alt="user" />
                                                        </Media>
                                                        <MediaText>
                                                            <div className="lead-text">Claudia Chandler</div>
                                                            <span className="sub-text">Node.js Developer</span>
                                                        </MediaText>
                                                        <MediaAction end>
                                                            <Button size="sm" variant="secondary" className="btn-icon btn-soft">
                                                                <Icon name="user-add"></Icon>
                                                            </Button>
                                                        </MediaAction>
                                                    </MediaGroup>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="bio-block">
                                            <h4 className="bio-block-title mb-3">Popular Posts</h4>
                                            <ul className="d-flex flex-wrap gap gy-3">
                                                <li>
                                                    <MediaGroup>
                                                        <Media>
                                                            <Image src="/images/product/a.jpg" alt="post" />
                                                        </Media>
                                                        <MediaText>
                                                            <a href="#post" className="lead-text">How to get creative in your work</a>
                                                            <span className="sub-text">15 Dec 2021</span>
                                                        </MediaText>
                                                    </MediaGroup>
                                                </li>
                                                <li>
                                                    <MediaGroup>
                                                        <Media>
                                                            <Image src="/images/product/b.jpg" alt="post" />
                                                        </Media>
                                                        <MediaText>
                                                            <a href="#post" className="lead-text">Create FureStibe branding logo</a>
                                                            <span className="sub-text">13 Dec 2021</span>
                                                        </MediaText>
                                                    </MediaGroup>
                                                </li>
                                                <li>
                                                    <MediaGroup>
                                                        <Media>
                                                            <Image src="/images/product/c.jpg" alt="post" />
                                                        </Media>
                                                        <MediaText>
                                                            <a href="#post" className="lead-text">9 Degree Project Estimation</a>
                                                            <span className="sub-text">10 Dec 2021</span>
                                                        </MediaText>
                                                    </MediaGroup>
                                                </li>
                                                <li>
                                                    <MediaGroup>
                                                        <Media>
                                                            <Image src="/images/product/d.jpg" alt="post" />
                                                        </Media>
                                                        <MediaText>
                                                            <a href="#post" className="lead-text">Smartest Applications for Business</a>
                                                            <span className="sub-text">10 Dec 2021</span>
                                                        </MediaText>
                                                    </MediaGroup>
                                                </li>
                                                <li>
                                                    <MediaGroup>
                                                        <Media>
                                                            <Image src="/images/product/e.jpg" alt="post" />
                                                        </Media>
                                                        <MediaText>
                                                            <a href="#post" className="lead-text">A well-written bio allows viewers</a>
                                                            <span className="sub-text">20 Dec 2021</span>
                                                        </MediaText>
                                                    </MediaGroup>
                                                </li>
                                            </ul>
                                            <div className="pt-3">
                                                <Link to="/seriui/" className="btn btn-sm btn-soft btn-primary">View All</Link>
                                            </div>
                                        </div> */}
                    </Card.Body>
                  </div>
                  <div className="card-content col-sep">
                    <Card.Body>
                      <div className="bio-block">
                        <h4 className="bio-block-title">About Me</h4>
                        <p>
                          I code and design websites worldwide. Mauris varius
                          tellus vitae tristique sagittis. Sed aliquet, est nec
                          auctor aliquet, orci ex vestibulum ex, non pharetra
                          lacus erat ac nulla.
                        </p>
                        <p>
                          Sed vulputate, ligula eget mollis auctor, lectus elit
                          feugiat urna, eget euismod turpis lectus sed ex. Orci
                          varius natoque penatibus et magnis dis parturient
                          montes, nascetur ridiculus mus. Nunc ut velit finibus,
                          scelerisque sapien vitae, pharetra est. Nunc accumsan
                          ligula vehicula scelerisque vulputate. Lorem ipsum
                          dolor sit, amet consectetur adipisicing elit.
                          Deleniti, dolore?
                        </p>
                        <Row className="g-gs pt-2">
                          <Col lg="6">
                            <div className="small">Designation:</div>
                            <h5 className="small">Chief Technology Officer</h5>
                          </Col>
                          <Col lg="6">
                            <div className="small">Website:</div>
                            <h5 className="small">www.sevencrore.com</h5>
                          </Col>
                        </Row>
                      </div>
                    </Card.Body>
                    <Card.Body>
                      <div className="bio-block">
                        <h4 className="bio-block-title">Recent Activity</h4>
                        <Schedule className="mt-4">
                          <Schedule.Item symbol="active">
                            <span className="smaller">2:12 PM</span>
                            <div className="h6">Added 3 New Images</div>
                            <ul className="d-flex flex-wrap gap g-2 pt-2">
                              <li>
                                <Media size="xxl">
                                  <Image
                                    src="/images/product/a.jpg"
                                    alt="gallery-img"
                                    thumbnail
                                  />
                                </Media>
                              </li>
                              <li>
                                <Media size="xxl">
                                  <Image
                                    src="/images/product/b.jpg"
                                    alt="gallery-img"
                                    thumbnail
                                  />
                                </Media>
                              </li>
                              <li>
                                <Media size="xxl">
                                  <Image
                                    src="/images/product/c.jpg"
                                    alt="gallery-img"
                                    thumbnail
                                  />
                                </Media>
                              </li>
                            </ul>
                          </Schedule.Item>
                          <Schedule.Item symbol="active">
                            <span className="smaller">4:23 PM</span>
                            <div className="h6">
                              Invitation for creative designs pattern
                            </div>
                          </Schedule.Item>
                          <Schedule.Item
                            symbol="active"
                            contentClass="nk-schedule-content-no-border"
                          >
                            <span className="smaller">10:30 PM</span>
                            <div className="h6">
                              Task report - uploaded weekly reports
                            </div>
                            <div className="list-group-dotted mt-3">
                              <div className="list-group-wrap">
                                <div className="p-3">
                                  <MediaGroup>
                                    <Media className="rounded-0">
                                      <Image
                                        src="/images/icon/file-type-pdf.svg"
                                        alt="icon"
                                      />
                                    </Media>
                                    <MediaText className="ms-1">
                                      <a href="#download" className="title">
                                        Modern Designs Pattern
                                      </a>
                                      <span className="text smaller">
                                        1.6.mb
                                      </span>
                                    </MediaText>
                                  </MediaGroup>
                                </div>
                                <div className="p-3">
                                  <MediaGroup>
                                    <Media className="rounded-0">
                                      <Image
                                        src="/images/icon/file-type-doc.svg"
                                        alt="icon"
                                      />
                                    </Media>
                                    <MediaText className="ms-1">
                                      <a href="#download" className="title">
                                        cPanel Upload Guidelines
                                      </a>
                                      <span className="text smaller">18kb</span>
                                    </MediaText>
                                  </MediaGroup>
                                </div>
                                <div className="p-3">
                                  <MediaGroup>
                                    <Media className="rounded-0">
                                      <Image
                                        src="/images/icon/file-type-code.svg"
                                        alt="icon"
                                      />
                                    </Media>
                                    <MediaText className="ms-1">
                                      <a href="#download" className="title">
                                        Weekly Finance Reports
                                      </a>
                                      <span className="text smaller">10mb</span>
                                    </MediaText>
                                  </MediaGroup>
                                </div>
                              </div>
                            </div>
                          </Schedule.Item>
                          <Schedule.Item symbol="active">
                            <span className="smaller">3:23 PM</span>
                            <div className="h6">
                              Assigned you to new database design project
                            </div>
                          </Schedule.Item>
                          <Schedule.Item
                            symbol="active"
                            contentClass="nk-schedule-content-no-border flex-grow-1"
                          >
                            <span className="smaller">5:05 PM</span>
                            <div className="h6">
                              You have received a new order
                            </div>
                            <Alert variant="info" className="mt-2">
                              <div className="d-flex">
                                <Icon
                                  size="lg"
                                  name="file-code"
                                  className="opacity-75"
                                ></Icon>
                                <div className="ms-2 d-flex flex-wrap flex-grow-1 justify-content-between">
                                  <div>
                                    <h6 className="alert-heading mb-0">
                                      Business Template - UI/UX design
                                    </h6>
                                    <span className="smaller">
                                      Shared information with your team to
                                      understand and contribute to your project.
                                    </span>
                                  </div>
                                  <div className="d-block mt-1">
                                    <Button size="md" variant="info">
                                      <Icon name="download"></Icon>
                                      <span>Download</span>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </Alert>
                          </Schedule.Item>
                          <Schedule.Item symbol="active">
                            <span className="smaller">2:45 PM</span>
                            <div className="h6">
                              Project status updated successfully
                            </div>
                          </Schedule.Item>
                        </Schedule>
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

export default MyProfilePage;
