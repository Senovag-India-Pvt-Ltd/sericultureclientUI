import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Button, Row, Col, Form } from "react-bootstrap";

import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Image, Icon, Media, Select } from "../../components";
import UsersData from "../../store/users/UsersData";
import { toInitials } from "../../utilities";

function UserEditPage() {
  const { id } = useParams();
  const [data] = useState(UsersData);
  const [user, setUser] = useState(data[0]);

  // grabs the id form the url and loads the corresponding data
  useEffect(() => {
    let findUser = data.find((item) => item.id === id);
    setUser(findUser);
  }, [id, data]);

  return (
    <Layout title="Users Edit" content="container">
      <Block.Head>
        <Block.HeadBetween>
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
            <ul className="d-flex gap g-2">
              <li className="d-none d-md-block">
                <Link
                  to={`/user-manage/user-profile/${user.id}`}
                  className="btn btn-soft btn-primary"
                >
                  <Icon name="user"></Icon>
                  <span>View Profile</span>
                </Link>
              </li>
              <li className="d-md-none">
                <Link
                  to={`/user-manage/user-profile/${user.id}`}
                  className="btn btn-soft btn-primary btn-icon"
                >
                  <Icon name="user"></Icon>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>
      <Block>
        <Card>
          <Card.Body>
            <div className="bio-block">
              <h4 className="bio-block-title mb-4">Edit Profile</h4>
              <Form action="#">
                <Row className="g-3">
                  <Col lg="12">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="fullname">Full Name</Form.Label>
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
                      <Form.Label htmlFor="email">Email address</Form.Label>
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
                          placeholder="e.g. California, United States"
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
                      <Form.Label htmlFor="postalcode">Postal Code</Form.Label>
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
      </Block>
    </Layout>
  );
}

export default UserEditPage;
