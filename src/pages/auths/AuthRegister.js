import React from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import Layout from "../../layout/fullpage";

import LoginLogo from "../../components/Logo/LoginLogo";

function AuthRegisterPage() {
  return (
    <Layout title="Register" centered>
      <div className="container p-2 p-sm-4">
        <Card className="overflow-hidden card-gutter-lg rounded-4 card-auth card-auth-mh">
          <Row className="g-0 flex-lg-row-reverse">
            <Col lg="5">
              <Card.Body>
                <div className="nk-block-head text-center">
                  <div className="nk-block-head-content">
                    <h3 className="nk-block-title mb-1">Create New Account</h3>
                    {/* <p className="small">Use your remail email continue with Nioboard (it's free)!</p> */}
                  </div>
                </div>
                <Form action="#">
                  <Row className="gy-3">
                    <Col className="col-12">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="username">Username</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            type="text"
                            id="username"
                            placeholder="Enter username"
                          />
                        </div>
                      </Form.Group>
                    </Col>
                    <Col className="col-12">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="email">Email</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            type="email"
                            id="email"
                            placeholder="Enter email address"
                          />
                        </div>
                      </Form.Group>
                    </Col>
                    <Col className="col-12">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="password">Password</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            type="text"
                            id="password"
                            placeholder="Enter password"
                          />
                        </div>
                      </Form.Group>
                    </Col>
                    <Col className="col-12">
                      <Form.Check
                        className="form-check-sm"
                        type="checkbox"
                        id="agreeCheckbox"
                        label="I agree to privacy policy & terms"
                      />
                    </Col>
                    <Col className="col-12">
                      <div className="d-grid">
                        <Button type="submit">Sign up</Button>
                      </div>
                    </Col>
                  </Row>
                </Form>
                {/* <div className="my-3 text-center">
                                <OverlineTitle className="overline-title-sep"><span>OR</span></OverlineTitle>
                            </div>
                            <Row className="g-2">
                                <Col xxl="6">
                                    <Button href="#auth" variant="outline-light" className="w-100">
                                        <Image src="/images/icon/d.png" alt="" className="icon"/>
                                        <span className="fw-medium">Continue with Google</span>
                                    </Button>
                                </Col>
                                <Col xxl="6">
                                    <Button href="#auth" variant="outline-light" className="w-100">
                                        <Image src="/images/icon/b.png" alt="" className="icon"/>
                                        <span className="fw-medium">Continue with Facebook</span>
                                    </Button>
                                </Col>
                            </Row> */}
                <div className="text-center mt-4">
                  <p className="small">
                    Already have an account? <Link to="/">Login</Link>
                  </p>
                </div>
              </Card.Body>
            </Col>
            <Col lg="7">
              <Card.Body className="bg-primary bg-darker1 is-theme has-mask has-mask-1 h-100 d-flex align-items-start justify-content-center">
                <div className="mask mask-1"></div>
                <div className="d-flex flex-column justify-content-center align-items-center">
                  <div className="brand-logo">
                    <LoginLogo />
                  </div>
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="mt-2 ms-3 d-flex flex-column align-items-center justify-content-center">
                        <p>Government of Karnataka</p>
                        <h1>Department of Sericulture</h1>
                        {/* <div className="h1 title mb-3">
                             Department of Sericulture
                          </div> */}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  {/* <MediaGroup className="media-group-overlap">
                                    <Media size="sm" shape="circle" border className="border-white">
                                        <Image src="/images/avatar/a.jpg" alt="" />
                                    </Media>
                                    <Media size="sm" shape="circle" border className="border-white">
                                        <Image src="/images/avatar/b.jpg" alt="" />
                                    </Media>
                                    <Media size="sm" shape="circle" border className="border-white">
                                        <Image src="/images/avatar/c.jpg" alt="" />
                                    </Media>
                                    <Media size="sm" shape="circle" border className="border-white">
                                        <Image src="/images/avatar/d.jpg" alt="" />
                                    </Media>
                                </MediaGroup>
                                <p className="small mt-2">More than 2k people joined us, it's your turn</p> */}
                </div>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </div>
    </Layout>
  );
}

export default AuthRegisterPage;
