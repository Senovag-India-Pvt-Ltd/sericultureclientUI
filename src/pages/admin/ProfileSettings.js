import { Link } from "react-router-dom";
import {
  Tab,
  Nav,
  Card,
  Button,
  Alert,
  Row,
  Col,
  Form,
  ListGroup,
} from "react-bootstrap";
import Swal from "sweetalert2/src/sweetalert2.js";

import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Image, Icon, Media, Select } from "../../components";

function ProfileSettingsPage() {
  // delete account alert
  const alertConfirm = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        Swal.fire("Deleted", "Your account has been deleted.", "success");
      } else {
        Swal.fire("Cancelled", "Your account is still intact", "info");
      }
    });
  };

  return (
    <Layout title="My Settings" content="container">
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

      <Tab.Container defaultActiveKey="tab-1">
        <Block.HeadBetween>
          <div className="gap-col">
            <Nav variant="pills" className="nav-pills-border gap g-3">
              <Nav.Item>
                <Nav.Link eventKey="tab-1">Account</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="tab-2">Security</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="tab-3">Notifications</Nav.Link>
              </Nav.Item>
              {/* <Nav.Item>
                            <Nav.Link eventKey="tab-4">Connections</Nav.Link>
                        </Nav.Item> */}
            </Nav>
          </div>
          <div className="gap-col">
            <ul className="d-flex gap g-2">
              <li className="d-none d-md-block">
                <Link
                  to="/seriui/admin/profile"
                  className="btn btn-soft btn-primary"
                >
                  <Icon name="user"></Icon>
                  <span>View Profile</span>
                </Link>
              </li>
              <li className="d-md-none">
                <Link
                  to="/seriui/admin/profile"
                  className="btn btn-soft btn-primary btn-icon"
                >
                  <Icon name="user"></Icon>
                </Link>
              </li>
            </ul>
          </div>
        </Block.HeadBetween>

        <Block className="mt-4">
          <Tab.Content>
            <Tab.Pane eventKey="tab-1" transition={false}>
              <Card>
                <Card.Body>
                  <div className="bio-block">
                    <h4 className="bio-block-title mb-4">Edit Profile</h4>
                    <Form action="#">
                      <Row className="g-3">
                        <Col lg="12">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="fullname">
                              Full Name
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                type="text"
                                id="fullname"
                                placeholder="Full name"
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="email">
                              Email address
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                type="text"
                                id="email"
                                placeholder="Email address"
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="company">Company</Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                type="text"
                                id="company"
                                placeholder="Company name"
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="12">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="address">Address</Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                type="text"
                                id="address"
                                placeholder="e.g. Pune, India"
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="4">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="city">City</Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                type="text"
                                id="city"
                                placeholder="City"
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="4">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="country">Country</Form.Label>
                            <div className="form-control-wrap">
                              <Select removeItemButton>
                                <option value="">Select a country</option>
                                <option value="1">Germany</option>
                                <option value="2">Canada</option>
                                <option value="3">Usa</option>
                                <option value="4">Aus</option>
                              </Select>
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="4">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="postalcode">
                              Postal Code
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                type="text"
                                id="postalcode"
                                placeholder="Zip code"
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="12">
                          <Form.Group className="form-group">
                            <Form.Label>About Me</Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                as="textarea"
                                rows="3"
                                defaultValue="On the other hand, we denounce with righteous indignation"
                              ></Form.Control>
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="12">
                          <Button variant="primary" type="submit">
                            Update Profile
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </Card.Body>
              </Card>
            </Tab.Pane>
            <Tab.Pane eventKey="tab-2" transition={false}>
              <Card className="col-sep card-gutter-md">
                <Card.Body>
                  <div className="bio-block">
                    <h4 className="bio-block-title mb-4">Change Password</h4>
                    <Form action="#">
                      <Row className="g-3">
                        <Col lg="4">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="oldPassword">
                              Old Password
                            </Form.Label>
                            <div className="form-control-wrap">
                              <a
                                href="#password"
                                className="form-control-icon end password-toggle"
                                title="Toggle show/hide password"
                              >
                                <Icon name="eye-off" className="on"></Icon>
                                <Icon name="eye" className="off"></Icon>
                              </a>
                              <Form.Control
                                type="text"
                                placeholder="Old password"
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="4">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="newPassword">
                              New Password
                            </Form.Label>
                            <div className="form-control-wrap">
                              <a
                                href="#password"
                                className="form-control-icon end password-toggle"
                                title="Toggle show/hide password"
                              >
                                <Icon name="eye-off" className="on"></Icon>
                                <Icon name="eye" className="off"></Icon>
                              </a>
                              <Form.Control
                                type="text"
                                placeholder="New password"
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="4">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="confirmPassword">
                              Confirm New Password
                            </Form.Label>
                            <div className="form-control-wrap">
                              <a
                                href="#password"
                                className="form-control-icon end password-toggle"
                                title="Toggle show/hide password"
                              >
                                <Icon name="eye-off" className="on"></Icon>
                                <Icon name="eye" className="off"></Icon>
                              </a>
                              <Form.Control
                                type="text"
                                placeholder="Confirm New Password"
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="12">
                          <div className="d-flex flex-wrap align-items-center gap g-3">
                            <div className="gap-col">
                              <Button variant="primary" type="submit">
                                Change Password
                              </Button>
                            </div>
                            <div className="gap-col">
                              <Link
                                to="/seriui/auths/auth-reset"
                                className="text-light small"
                                target="_blank"
                              >
                                Forgot Password?
                              </Link>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </Card.Body>
                {/* <Card.Body>
                                <div className="bio-block">
                                    <div className="d-flex flex-wrap align-items-center justify-content-between pb-4">
                                        <h4 className="bio-block-title">Login History</h4>
                                        <a href="#logout" className="text-light small">All Logout</a>
                                    </div>
                                    <ul className="gap gy-3">
                                        <li>
                                            <MediaGroup>
                                                <Media size="md" variant="secondary-soft" className="flex-shrink-0">
                                                    <Icon name="mobile"></Icon>
                                                </Media>
                                                <MediaText>
                                                    <div className="lead-text">iPhone 12 Pro</div>
                                                    <span className="sub-text">Los Angeles, United States - April 18 at 2:47 PM</span>
                                                </MediaText>
                                                <MediaAction end>
                                                    <OverlayTrigger placement="top" overlay={
                                                        <Tooltip>Logout</Tooltip>
                                                    }>
                                                        <a href="#logout" className="media media-xs media-circle media-middle text-bg-danger-soft">
                                                            <em className="icon ni ni-cross"></em>
                                                        </a>
                                                    </OverlayTrigger>
                                                </MediaAction>
                                            </MediaGroup>
                                        </li>
                                        <li>
                                            <MediaGroup>
                                                <Media size="md" variant="secondary-soft" className="flex-shrink-0">
                                                    <Icon name="mobile"></Icon>
                                                </Media>
                                                <MediaText>
                                                    <div className="lead-text">Apple iPad Pro</div>
                                                    <span className="sub-text">Washington, United States - November 06 at 10:43AM</span>
                                                </MediaText>
                                                <MediaAction end>
                                                    <OverlayTrigger placement="top" overlay={
                                                        <Tooltip>Logout</Tooltip>
                                                    }>
                                                        <a href="#logout" className="media media-xs media-circle media-middle text-bg-danger-soft">
                                                            <em className="icon ni ni-cross"></em>
                                                        </a>
                                                    </OverlayTrigger>
                                                </MediaAction>
                                            </MediaGroup>
                                        </li>
                                        <li>
                                            <MediaGroup>
                                                <Media size="md" variant="secondary-soft" className="flex-shrink-0">
                                                    <Icon name="mobile"></Icon>
                                                </Media>
                                                <MediaText>
                                                    <div className="lead-text">Galaxy S21 Ultra 5G</div>
                                                    <span className="sub-text">Washington, United States - November 08 at 10:43AM</span>
                                                </MediaText>
                                                <MediaAction end>
                                                    <OverlayTrigger placement="top" overlay={
                                                        <Tooltip>Logout</Tooltip>
                                                    }>
                                                        <a href="#logout" className="media media-xs media-circle media-middle text-bg-danger-soft">
                                                            <em className="icon ni ni-cross"></em>
                                                        </a>
                                                    </OverlayTrigger>
                                                </MediaAction>
                                            </MediaGroup>
                                        </li>
                                        <li>
                                            <MediaGroup>
                                                <Media size="md" variant="secondary-soft" className="flex-shrink-0">
                                                    <Icon name="laptop"></Icon>
                                                </Media>
                                                <MediaText>
                                                    <div className="lead-text">Dell Inspiron 14</div>
                                                    <span className="sub-text">Washington, United States - November 08 at 10:43AM</span>
                                                </MediaText>
                                                <MediaAction end>
                                                    <OverlayTrigger placement="top" overlay={
                                                        <Tooltip>Logout</Tooltip>
                                                    }>
                                                        <a href="#logout" className="media media-xs media-circle media-middle text-bg-danger-soft">
                                                            <em className="icon ni ni-cross"></em>
                                                        </a>
                                                    </OverlayTrigger>
                                                </MediaAction>
                                            </MediaGroup>
                                        </li>
                                    </ul>
                                </div>
                            </Card.Body> */}
                <Card.Body>
                  <div className="bio-block">
                    <h4 className="bio-block-title mb-4">Delete Account</h4>
                    <Alert variant="warning" className="mt-2">
                      <div className="d-flex">
                        <Icon
                          size="lg"
                          name="question-alt"
                          className="opacity-75"
                        ></Icon>
                        <div className="ms-2">
                          <h6 className="alert-heading mb-1">
                            You Are Deleting Your Account!
                          </h6>
                          <span className="smaller d-block">
                            For extra security, this requires you to confirm
                            your email or phone number when you reset yousignr
                            password.
                          </span>
                          <a
                            className="smaller"
                            href="#learn-more"
                            target="_blank"
                          >
                            Learn more
                          </a>
                        </div>
                      </div>
                    </Alert>
                    <Form.Group controlId="confirmAccountDeteting">
                      <Form.Check
                        className="form-check-sm"
                        type="checkbox"
                        label="I confirm my account deleting!"
                      />
                    </Form.Group>
                    <div className="mt-3">
                      <Button variant="danger" onClick={alertConfirm}>
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Tab.Pane>
            <Tab.Pane eventKey="tab-3" transition={false}>
              <Card>
                <Card.Body>
                  <div className="bio-block">
                    <h4 className="bio-block-title">Notifications</h4>
                    <p className="mb-4">
                      You will get only notification what have enabled.
                    </p>
                    <ListGroup className="list-group-borderless">
                      <ListGroup.Item className="d-flex align-items-md-center">
                        <div className="flex-grow-1">
                          <label
                            htmlFor="directMessage"
                            className="form-check-label ps-0 fw-medium"
                          >
                            Direct messages
                          </label>
                          <p className="text-light">
                            Messages from people you follow
                          </p>
                        </div>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="directMessage"
                            defaultChecked
                          />
                        </div>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex align-items-md-center">
                        <div className="flex-grow-1">
                          <label
                            className="form-check-label ps-0 fw-medium"
                            htmlFor="desktopNotification"
                          >
                            Show desktop notifications
                          </label>
                          <p className="text-light">
                            Choose the option you want as your default setting.
                            Block a site: Next to "Not allowed to send
                            notifications," click Add.
                          </p>
                        </div>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="desktopNotification"
                            defaultChecked
                          />
                        </div>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex align-items-md-center">
                        <div className="flex-grow-1">
                          <label
                            className="form-check-label ps-0 fw-medium"
                            htmlFor="emailNotification"
                          >
                            Show email notifications
                          </label>
                          <p className="text-light">
                            Under Settings, choose Notifications. Under Select
                            an account, choose the account to enable
                            notifications for.
                          </p>
                        </div>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="emailNotification"
                            defaultChecked
                          />
                        </div>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex align-items-md-center">
                        <div className="flex-grow-1">
                          <label
                            className="form-check-label ps-0 fw-medium"
                            htmlFor="chatNotification"
                          >
                            Show chat notifications
                          </label>
                          <p className="text-light">
                            To prevent duplicate mobile notifications from the
                            Gmail and Chat apps, in settings, turn off Chat
                            notifications.
                          </p>
                        </div>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="chatNotification"
                          />
                        </div>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex align-items-md-center">
                        <div className="flex-grow-1">
                          <label
                            className="form-check-label ps-0 fw-medium"
                            htmlFor="purchaseNotification"
                          >
                            Show purchase notifications
                          </label>
                          <p className="text-light">
                            Get real-time purchase alerts to protect yourself
                            from fraudulent charges.
                          </p>
                        </div>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="purchaseNotification"
                          />
                        </div>
                      </ListGroup.Item>
                    </ListGroup>
                  </div>
                </Card.Body>
              </Card>
            </Tab.Pane>
            {/* <Tab.Pane eventKey="tab-4" transition={false}>
                        <Card className="col-sep card-gutter-md">
                            <Card.Body>
                                <div className="bio-block">
                                    <h4 className="bio-block-title">Connected accounts</h4>
                                    <p className="mb-4">Display content from your connected accounts on your site.</p>
                                    <ListGroup className="list-group-borderless">
                                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                            <MediaGroup>
                                                <Media variant="secondary-soft" className="flex-shrink-0">
                                                    <Image src="/images/icon/d.png" alt="icon" />
                                                </Media>
                                                <MediaText>
                                                    <span className="title">Google</span>
                                                    <span className="text smaller">Calendar and contacts</span>
                                                </MediaText>
                                            </MediaGroup>
                                            <Form.Check type="switch" id="checkboxGoogle" defaultChecked/>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                            <MediaGroup>
                                                <Media variant="secondary-soft" className="flex-shrink-0">
                                                    <Image src="/images/icon/f.png" alt="icon" />
                                                </Media>
                                                <MediaText>
                                                    <span className="title">Slack</span>
                                                    <span className="text smaller">Communication</span>
                                                </MediaText>
                                            </MediaGroup>
                                            <Form.Check type="switch" id="checkboxSlack"/>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                            <MediaGroup>
                                                <Media variant="secondary-soft" className="flex-shrink-0">
                                                    <Image src="/images/icon/g.png" alt="icon" />
                                                </Media>
                                                <MediaText>
                                                    <span className="title">Github</span>
                                                    <span className="text smaller">Manage your Git repositories</span>
                                                </MediaText>
                                            </MediaGroup>
                                            <Form.Check type="switch" id="checkboxGithub" defaultChecked/>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                            <MediaGroup>
                                                <Media variant="secondary-soft" className="flex-shrink-0">
                                                    <Image src="/images/icon/h.png" alt="icon" />
                                                </Media>
                                                <MediaText>
                                                    <span className="title">Mailchimp</span>
                                                    <span className="text smaller">Email marketing service</span>
                                                </MediaText>
                                            </MediaGroup>
                                            <Form.Check type="switch" id="checkboxMailchimp" defaultChecked/>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                            <MediaGroup>
                                                <Media variant="secondary-soft" className="flex-shrink-0">
                                                    <Image src="/images/icon/i.png" alt="icon" />
                                                </Media>
                                                <MediaText>
                                                    <span className="title">Asana</span>
                                                    <span className="text smaller">Communication</span>
                                                </MediaText>
                                            </MediaGroup>
                                            <Form.Check type="switch" id="checkboxAsana" defaultChecked/>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </div>
                            </Card.Body>
                            <Card.Body>
                                <div className="bio-block">
                                    <h4 className="bio-block-title">Social accounts</h4>
                                    <p className="mb-4">Display content from social accounts on your site.</p>
                                    <ListGroup className="list-group-borderless">
                                        <ListGroup.Item>
                                            <MediaGroup>
                                                <Media variant="secondary-soft" className="flex-shrink-0">
                                                    <Image src="/images/icon/b.png" alt="icon" />
                                                </Media>
                                                <MediaText>
                                                    <span className="title">Facebook</span>
                                                    <span className="text smaller text-success">Connected</span>
                                                </MediaText>
                                                <MediaAction end>
                                                    <OverlayTrigger placement="top" overlay={
                                                        <Tooltip>Disconnect</Tooltip>
                                                    }>
                                                        <a href="#disconnect" className="media media-xs media-circle media-middle text-bg-danger-soft">
                                                            <em className="icon ni ni-cross"></em>
                                                        </a>
                                                    </OverlayTrigger>
                                                </MediaAction>
                                            </MediaGroup>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <MediaGroup>
                                                <Media variant="secondary-soft" className="flex-shrink-0">
                                                    <Image src="/images/icon/e.png" alt="icon" />
                                                </Media>
                                                <MediaText>
                                                    <span className="title">Instagram</span>
                                                    <span className="text smaller">Not Connected</span>
                                                </MediaText>
                                                <MediaAction end>
                                                    <OverlayTrigger placement="top" overlay={
                                                        <Tooltip>Connect</Tooltip>
                                                    }>
                                                        <a href="#connect" className="media media-xs media-circle media-middle text-bg-secondary-soft">
                                                            <em className="icon ni ni-link-alt"></em>
                                                        </a>
                                                    </OverlayTrigger>
                                                </MediaAction>
                                            </MediaGroup>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <MediaGroup>
                                                <Media variant="secondary-soft" className="flex-shrink-0">
                                                    <Image src="/images/icon/j.png" alt="icon" />
                                                </Media>
                                                <MediaText>
                                                    <span className="title">Behance</span>
                                                    <span className="text smaller">Not Connected</span>
                                                </MediaText>
                                                <MediaAction end>
                                                    <OverlayTrigger placement="top" overlay={
                                                        <Tooltip>Connect</Tooltip>
                                                    }>
                                                        <a href="#connect" className="media media-xs media-circle media-middle text-bg-secondary-soft">
                                                            <em className="icon ni ni-link-alt"></em>
                                                        </a>
                                                    </OverlayTrigger>
                                                </MediaAction>
                                            </MediaGroup>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <MediaGroup>
                                                <Media variant="secondary-soft" className="flex-shrink-0">
                                                    <Image src="/images/icon/k.png" alt="icon" />
                                                </Media>
                                                <MediaText>
                                                    <span className="title">Behance</span>
                                                    <span className="text smaller">Not Connected</span>
                                                </MediaText>
                                                <MediaAction end>
                                                    <OverlayTrigger placement="top" overlay={
                                                        <Tooltip>Connect</Tooltip>
                                                    }>
                                                        <a href="#connect" className="media media-xs media-circle media-middle text-bg-secondary-soft">
                                                            <em className="icon ni ni-link-alt"></em>
                                                        </a>
                                                    </OverlayTrigger>
                                                </MediaAction>
                                            </MediaGroup>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </div>
                            </Card.Body>
                        </Card>
                    </Tab.Pane> */}
          </Tab.Content>
        </Block>
      </Tab.Container>
    </Layout>
  );
}

export default ProfileSettingsPage;
