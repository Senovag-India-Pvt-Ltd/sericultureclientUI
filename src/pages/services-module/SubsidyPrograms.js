import { Card, Form, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import {
  Media,
  MediaGroup,
  MediaText,
  Icon,
} from "../../components";

function SubsidyPrograms() {
  const navigate = useNavigate();

  const onClickProgram = () => {
    navigate("/providing-subsidy");
  };

  return (
    <Layout title="Subsidy Programmes" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Subsidy Programmes</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                {/* <li className="breadcrumb-item">
                  <Link to="#">Renew License to Reeler List</Link>
                </li> */}
                <li className="breadcrumb-item active" aria-current="page">
                  Subsidy Programmes
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          {/* <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link to="#" className="btn btn-primary btn-md d-md-none">
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent> */}
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-4">
        <Form action="#">
          <Row className="g-3 ">
            <Card>
              <Card.Body>
                <Row className="g-gs">
                  <h3 className="text-center">
                    Department of Sericulture Subsidy Programmes
                  </h3>
                  <Col lg="12">
                    <div style={{ paddingLeft: "15%" }}>
                      <Form.Group className="form-group mt-3">
                        {/* <Form.Label htmlFor="fid">FRUITS ID / AADHAAR NUMBER</Form.Label> */}
                        <div className="form-control-wrap d-flex">
                          <Icon name="hot-fill"></Icon>
                          <Link
                            to={`/providing-subsidy`}
                            className="mb-1 ms-2 h5"
                          >
                            Sericulture Development Programme
                          </Link>
                        </div>
                      </Form.Group>
                      <Form.Group className="form-group mt-3">
                        {/* <Form.Label htmlFor="fid">FRUITS ID / AADHAAR NUMBER</Form.Label> */}
                        <div className="form-control-wrap d-flex">
                          <Icon name="brick-fill"></Icon>
                          <Link
                            to={`/providing-subsidy`}
                            className="mb-1 ms-2 h5"
                          >
                            Pradhan Manthri Krishi Sinchayi Yojane (PMKSY)
                          </Link>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        {/* <Form.Label htmlFor="fid">FRUITS ID / AADHAAR NUMBER</Form.Label> */}
                        <div className="form-control-wrap d-flex">
                          <Icon name="b-si"></Icon>
                          <Link
                            to={`/providing-subsidy`}
                            className="mb-1 ms-2 h5"
                          >
                            Programs implemented by Price Stabilization Fund
                          </Link>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        {/* <Form.Label htmlFor="fid">FRUITS ID / AADHAAR NUMBER</Form.Label> */}
                        <div className="form-control-wrap d-flex">
                          <Icon name="sign-ada-alt"></Icon>
                          <Link
                            to={`/providing-subsidy`}
                            className="mb-1 ms-2 h5"
                          >
                            Civil works
                          </Link>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        {/* <Form.Label htmlFor="fid">FRUITS ID / AADHAAR NUMBER</Form.Label> */}
                        <div className="form-control-wrap d-flex">
                          <Icon name="sign-xem-alt"></Icon>
                          <Link
                            to={`/providing-subsidy`}
                            className="mb-1 ms-2 h5"
                          >
                            Silk Samagra(CSS)
                          </Link>
                        </div>
                      </Form.Group>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                {/* <h3>Farmers Details</h3> */}
                <Row className="g-gs">
                  <Col xxl="3">
                    <Card className="h-100" onClick={onClickProgram}>
                      <Card.Body className="d-flex justify-content-center align-items-center">
                        <div>
                          <div className="card-title ">
                            <MediaGroup>
                              <Media size="md" shape="circle" variant="primary">
                                <Icon name="hot-fill"></Icon>
                              </Media>
                              <MediaText>
                                <h4 className="text-center">
                                  Sericulture Development Programme
                                </h4>
                              </MediaText>
                            </MediaGroup>

                            {/* <p className="small">Best seller of the month</p> */}
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col xxl="3" onClick={onClickProgram}>
                    <Card className="h-100">
                      <Card.Body className="d-flex justify-content-center align-items-center">
                        <div>
                          <div className="card-title ">
                            <MediaGroup>
                              <Media size="md" shape="circle" variant="primary">
                                <Icon name="brick-fill"></Icon>
                              </Media>
                              <MediaText>
                                <h4 className="text-center">
                                  Pradhan Manthri Krishi Sinchayi Yojane (PMKSY)
                                </h4>
                              </MediaText>
                            </MediaGroup>
                            {/* <p className="small">Best seller of the month</p> */}
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col xxl="3">
                    <Card className="h-100" onClick={onClickProgram}>
                      <Card.Body className="d-flex justify-content-center align-items-center">
                        <div>
                          <div className="card-title ">
                            <MediaGroup>
                              <Media size="md" shape="circle" variant="primary">
                                <Icon name="b-si"></Icon>
                              </Media>
                              <MediaText>
                                <h4 className="text-center">
                                  Programs implemented by Price Stabilization
                                  Fund
                                </h4>
                              </MediaText>
                            </MediaGroup>

                            {/* <p className="small">Best seller of the month</p> */}
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col xxl="3">
                    <Card className="h-100" onClick={onClickProgram}>
                      <Card.Body className="d-flex justify-content-center align-items-center">
                        <div>
                          <div className="card-title ">
                            <MediaGroup>
                              <Media size="md" shape="circle" variant="primary">
                                <Icon name="sign-ada-alt"></Icon>
                              </Media>
                              <MediaText>
                                <h4 className="text-center">Civil works</h4>
                              </MediaText>
                            </MediaGroup>

                            {/* <p className="small">Best seller of the month</p> */}
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col xxl="3">
                    <Card className="h-100" onClick={onClickProgram}>
                      <Card.Body className="d-flex justify-content-center align-items-center">
                        <div>
                          <div className="card-title ">
                            <MediaGroup>
                              <Media size="md" shape="circle" variant="primary">
                                <Icon name="sign-xem-alt"></Icon>
                              </Media>
                              <MediaText>
                                <h4 className="text-center">
                                  Silk Samagra(CSS)
                                </h4>
                              </MediaText>
                            </MediaGroup>

                            {/* <p className="small">Best seller of the month</p> */}
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default SubsidyPrograms;
