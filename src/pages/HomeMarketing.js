import { Row, Col, Card, Button, Dropdown, Tooltip, OverlayTrigger } from 'react-bootstrap';

import Layout from '../layout/default';
import { Icon, CustomDropdownMenu, CustomDropdownToggle, ChartLegend } from '../components';
import { ChartBar, ChartDoughnut } from "../components/Chart/Charts";
import { Colors } from '../utilities/index';
import hexRGB from '../utilities/hexRGB';

function HomeMarketing() {
  
  // campaign chart
  let campaignChart = {
    labels: ["M", "T", "W", "T", "F", "S", "S"],
    xGridColor: hexRGB(Colors.white, 0.1),
    yGridColor: hexRGB(Colors.white, 0.1),
    xGridBorderColor: hexRGB(Colors.white, 0.1),
    yGridBorderColor: hexRGB(Colors.white, 0.1),
    datasets: [
        {
            borderRadius: 10,
            borderWidth: 1,
            borderColor: 'transparent',
            backgroundColor: hexRGB(Colors.white, 0.8),
            hoverBackgroundColor: Colors.white,
            label: "Visitors",
            data: [600, 680, 470, 770, 570, 810, 670]
        },
    ]
};

// campaign Overview Chart
let campaignOverviewChart = {
  labels : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  ticksValue: 'k',
  borderDash: [8, 4],
  xGridColor: Colors.white,
  yGridColor: Colors.gray100,
  xGridBorderColor: Colors.gray100,
  yGridBorderColor: Colors.white,
  datasets: [
      {
        tension: 0.4,
        borderWidth: 2,
        borderColor: Colors.primary,
        pointBorderColor: Colors.white,
        pointBackgroundColor: Colors.primary,
        pointHoverBackgroundColor: Colors.primary,
        backgroundColor: hexRGB(Colors.primary, 0.2),
        label: "Social",
        fill: true,
        data: [0, 15, 10, 28, 20, 38, 30, 22, 30, 12, 38, 30]
      },
      {
        tension: 0.4,
        borderWidth: 2,
        pointBorderColor: Colors.white,
        pointBackgroundColor: Colors.success,
        borderColor: Colors.success,
        pointHoverBackgroundColor: Colors.success,
        backgroundColor: hexRGB(Colors.success, 0.2),
        label: "Email Newsletter",
        fill: true,
        data: [30, 24, 49, 36, 40, 49, 39, 38, 59, 50, 56, 66]
      },
      {
        tension: 0.4,
        borderWidth: 2,
        pointBorderColor: Colors.white,
        pointBackgroundColor: Colors.warning,
        borderColor: Colors.warning,
        pointHoverBackgroundColor: Colors.warning,
        label: "Google Ads",
        borderDash: [8,4],
        data: [44, 34, 39, 68, 29, 61, 10, 48, 45, 70, 46, 55]
      },
  ]
};

 // effectiveness Chart
 let effectivenessChart = {
  labels: ['AdSense','Facebook','Video ads','Pop-ups','Email marketing','Banners',],
  borderDash: [8, 4],
  yAxis: false,
  xAxis: false,
  ticksNumberLabel: false,
  datasets: [
      {
        borderWidth: 2,
        borderColor: Colors.primary,
        backgroundColor: hexRGB(Colors.primary, 0.2),
        pointBorderColor: Colors.white,
        pointBackgroundColor: Colors.primary,
        pointHoverBackgroundColor: Colors.primary,
        label: '# of Votes',
        data: [80, 70, 56, 91, 86, 80],
      },
  ]
};

// top channels data
let channelsData = [
  {
    id: 'uid01',
    theme: 'dark',
    icon: 'github-circle',
    website: 'github.com',
    visitor: '3.4K',
    revenue: '$3.877',
    conversion: '4.7%'
  },
  {
    id: 'uid02',
    theme: 'info',
    icon: 'twitter',
    website: 'twitter.com',
    visitor: '2.5K',
    revenue: '$3.426',
    conversion: '4.4%'
  },
  {
    id: 'uid03',
    theme: 'danger',
    icon: 'google',
    website: 'google.com',
    visitor: '2.0K',
    revenue: '$2.444	',
    conversion: '4.7%'
  },
  {
    id: 'uid04',
    theme: 'info',
    icon: 'vimeo',
    website: 'vimeo.com',
    visitor: '1.9K',
    revenue: '$2.877',
    conversion: '3.6%'
  },
  {
    id: 'uid05',
    theme: 'danger',
    icon: 'youtube',
    website: 'youtube.com',
    visitor: '1.8K',
    revenue: '$2.870',
    conversion: '3.4%'
  },
  {
    id: 'uid06',
    theme: 'info',
    icon: 'facebook-f',
    website: 'facebook.com',
    visitor: '1.5K',
    revenue: '$2.543',
    conversion: '2.6%'
  },
];

// popularity chart
let popularityChart = {
    labels : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    ticksValue: 'k',
    borderDash: [8, 4],
    xGridColor: Colors.white,
    yGridBorderColor: Colors.white,
    barPercentage : 0.7,
    categoryPercentage: 0.6,
    datasets: [
      {
        borderRadius: 10,
        borderColor: Colors.success,
        backgroundColor: Colors.success,
        label: "Received",
        data: [110, 80, 125, 55, 95, 75, 90, 110, 80, 125, 55, 95]
      },
      {
        borderRadius: 10,
        borderColor: Colors.info,
        backgroundColor: Colors.info,
        label: "Paid",
        data: [75, 90, 110, 80, 125, 55, 95, 75, 90, 110, 80, 125]
      }
    ]
  };

// payable-wise data
let suppierWisePayableData = {
    labels: ["Surya Industries", "Special Steel", "Venus Marketing", "Mangal Supplier"],
    datasets: [
    {
        backgroundColor: [Colors.info, Colors.yellow, Colors.green, Colors.purple],
        data: [90, 170, 10, 60],
        hoverOffset: 4
    }
    ]
};

// customer-wise receivable data
let customerWiseReceivableData = {
    labels: ["Sun Industries", "Moon", "Jupiter Ind", "Mars Manufacturer"],
    datasets: [
    {
        backgroundColor: [Colors.info, Colors.yellow, Colors.green, Colors.purple],
        data: [140, 70, 110, 120],
        hoverOffset: 4
    }
    ]
};

  return (
    <Layout title="Marketing">
      <Row className="g-gs">

      <Col xxl="12">
          <Card className="h-100">
              <Card.Body>
                  <div className="card-title-group mb-4 align-items-start">
                      <div className="card-title">
                          <h4 className="title mb-0">Highlights</h4>
                          <span className="small">Latest Account statistics</span>
                      </div>
                      <div className="card-tools">
                        <Dropdown>
                            <Dropdown.Toggle size="sm" as={CustomDropdownToggle} className="btn btn-sm btn-icon btn-zoom me-n1">
                              <Icon name="more-v"></Icon>
                            </Dropdown.Toggle>
                            <Dropdown.Menu as={CustomDropdownMenu} align="end">
                              <Dropdown.Header className="py-2">
                                <h6 className="mb-0">Actions</h6>
                              </Dropdown.Header>
                              <Dropdown.Divider className="mt-0" />
                              <Dropdown.Item>This week</Dropdown.Item>
                              <Dropdown.Item>This month</Dropdown.Item>
                              <Dropdown.Item>This year</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                      </div>
                  </div>
                  <Row className="g-gs">
                      <Col sm="6" md="4" lg="6" xl="3">
                          <div className="box-dotted h-100">
                              <Icon size="lg" variant="primary" name="chart-up"></Icon>
                              <h5 className="title mt-2 mb-3">Receipts Overdue</h5>
                              <div className="amount h3">&#8377; 11,800.00</div>
                              <div className="d-flex align-items-center smaller flex-wrap">
                                <ul className="d-flex flex-wrap gap g-2 pt-4">
                                    <li>
                                        <Button href="#" size="sm" variant="primary">View Details</Button>
                                    </li>
                                </ul>
                              </div>
                          </div>
                      </Col>
                      <Col sm="6" md="4" lg="6" xl="3">
                          <div className="box-dotted h-100">
                              <Icon size="lg" variant="success" name="user-add"></Icon>
                              <h5 className="title mt-2 mb-3">Receipts due in 7 days</h5>
                              <div className="amount h3">&#8377; 5,800.00</div>
                              <div className="d-flex align-items-center smaller flex-wrap">
                                <ul className="d-flex flex-wrap gap g-2 pt-4">
                                    <li>
                                        <Button href="#" size="sm" variant="primary">View Details</Button>
                                    </li>
                                </ul>
                              </div>
                          </div>
                      </Col>
                      <Col md="4" lg="12" xl="3">
                          <div className="box-dotted h-100">
                              <Icon size="lg" variant="warning" name="coins"></Icon>
                              <h5 className="title mt-2 mb-3">Payments Overdue</h5>
                              <div className="amount h3">&#8377; 22,496.00</div>
                              <div className="d-flex align-items-center smaller flex-wrap">
                                <ul className="d-flex flex-wrap gap g-2 pt-4">
                                    <li>
                                        <Button href="#" size="sm" variant="primary">View Details</Button>
                                    </li>
                                </ul>
                              </div>
                          </div>
                      </Col>
                      <Col md="4" lg="12" xl="3">
                          <div className="box-dotted h-100">
                              <Icon size="lg" variant="warning" name="coins"></Icon>
                              <h5 className="title mt-2 mb-3">Payments due in 7 days</h5>
                              <div className="amount h3">&#8377; 0.00</div>
                              <div className="d-flex align-items-center smaller flex-wrap">
                                <ul className="d-flex flex-wrap gap g-2 pt-4">
                                    <li>
                                        <Button href="#" size="sm" variant="primary">View Details</Button>
                                    </li>
                                </ul>
                              </div>
                          </div>
                      </Col>
                  </Row>
              </Card.Body>
          </Card>
        </Col>


        <Col xxl="12">
          <Card className="h-100">
              <Card.Body>
                  <div className="card-title-group mb-4 align-items-start">
                      <div className="card-title">
                          <h4 className="title mb-0">Accounts Data</h4>
                          {/* <span className="small">Latest social statistics</span> */}
                      </div>
                      <div className="card-tools">
                        <Dropdown>
                            <Dropdown.Toggle size="sm" as={CustomDropdownToggle} className="btn btn-sm btn-icon btn-zoom me-n1">
                              <Icon name="more-v"></Icon>
                            </Dropdown.Toggle>
                            <Dropdown.Menu as={CustomDropdownMenu} align="end">
                              <Dropdown.Header className="py-2">
                                <h6 className="mb-0">Actions</h6>
                              </Dropdown.Header>
                              <Dropdown.Divider className="mt-0" />
                              <Dropdown.Item>This week</Dropdown.Item>
                              <Dropdown.Item>This month</Dropdown.Item>
                              <Dropdown.Item>This year</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                      </div>
                  </div>
                  <Row className="g-gs">
                      <Col sm="12" md="12" lg="12" xl="12">
                          
                        <Card className="h-100">
                            <Card.Body>
                                <div className="card-title-group mb-4">
                                    <div className="card-title">
                                        <h5 className="title">Accounts</h5>
                                    </div>
                                    <ChartLegend.Group className="gap gx-3 align-items-center">
                                        <div className="gap-col">
                                            <ChartLegend className="chart-legend-small" symbol="success">
                                            Received
                                            </ChartLegend>
                                        </div>
                                        <div className="gap-col">
                                            <ChartLegend className="chart-legend-small" symbol="info">
                                            Paid
                                            </ChartLegend>
                                        </div>
                                    </ChartLegend.Group>
                                </div>
                                <div className="nk-chart-nft-popularity">
                                    <ChartBar data={popularityChart}></ChartBar>
                                </div>
                            </Card.Body>
                        </Card>
                     </Col>   
                 </Row>
              </Card.Body>
            </Card>
        </Col>

            <Col md="6" xxl="6">
            <Card className="h-100">
                <Card.Body>
                <div className="card-title-group">
                    <div className="card-title">
                        <h5 className="title">Supplier Wise Payable</h5>
                    </div>
                    <div className="card-tools">
                        <OverlayTrigger 
                        placement="left"
                        overlay={
                            <Tooltip id="tooltip-another">Supplier Wise Payable</Tooltip>
                        }>
                        <em className="icon-hint icon ni ni-help-fill"></em>
                        </OverlayTrigger>
                    </div>
                </div>
                <div className="nk-chart-analytics-session-device mt-4">
                    <ChartDoughnut data={suppierWisePayableData}/>
                </div>
                <ChartLegend.Group className="justify-content-around pt-4 flex-wrap gap g-2">
                    <ChartLegend symbol="info">
                    Surya Industries
                    </ChartLegend>
                    <ChartLegend symbol="warning">
                    Special Steel
                    </ChartLegend>
                    <ChartLegend symbol="success">
                    Venus Marketing
                    </ChartLegend>
                    <ChartLegend symbol="purple">
                    Mangal Supplier
                    </ChartLegend>
                </ChartLegend.Group>
                </Card.Body>
            </Card>
            </Col>

            <Col md="6" xxl="6">
            <Card className="h-100">
                <Card.Body>
                <div className="card-title-group">
                    <div className="card-title">
                        <h5 className="title">Customer Wise Receivable</h5>
                    </div>
                    <div className="card-tools">
                        <OverlayTrigger 
                        placement="left"
                        overlay={
                            <Tooltip id="tooltip-another">Customer Wise Receivable</Tooltip>
                        }>
                        <em className="icon-hint icon ni ni-help-fill"></em>
                        </OverlayTrigger>
                    </div>
                </div>
                <div className="nk-chart-analytics-session-device mt-4">
                    <ChartDoughnut data={customerWiseReceivableData}/>
                </div>
                <ChartLegend.Group className="justify-content-around pt-4 flex-wrap gap g-2">
                    <ChartLegend symbol="info">
                    Sun Industries
                    </ChartLegend>
                    <ChartLegend symbol="warning">
                    Moon
                    </ChartLegend>
                    <ChartLegend symbol="success">
                    Jupiter Ind
                    </ChartLegend>
                    <ChartLegend symbol="purple">
                    Mars Manufacturer
                    </ChartLegend>
                </ChartLegend.Group>
                </Card.Body>
            </Card>
            </Col>

            {/* <Col xxl="6">
                <Card className="h-100">
                    <Card.Body>
                        <div className="card-title-group mb-4 align-items-start">
                            <div className="card-title">
                                <h4 className="title mb-0">Highlights</h4>
                                <span className="small">Latest social statistics</span>
                            </div>
                            <div className="card-tools">
                                <Dropdown>
                                    <Dropdown.Toggle size="sm" as={CustomDropdownToggle} className="btn btn-sm btn-icon btn-zoom me-n1">
                                    <Icon name="more-v"></Icon>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu as={CustomDropdownMenu} align="end">
                                    <Dropdown.Header className="py-2">
                                        <h6 className="mb-0">Actions</h6>
                                    </Dropdown.Header>
                                    <Dropdown.Divider className="mt-0" />
                                    <Dropdown.Item>This week</Dropdown.Item>
                                    <Dropdown.Item>This month</Dropdown.Item>
                                    <Dropdown.Item>This year</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                        <Row className="g-gs">
                            <Col sm="6" md="4" lg="6" xl="4">
                                <div className="box-dotted h-100">
                                    <Icon size="lg" variant="primary" name="chart-up"></Icon>
                                    <h5 className="title mt-2 mb-3">Avg. Client Rating</h5>
                                    <div className="amount h3">7.8/10</div>
                                    <div className="d-flex align-items-center smaller flex-wrap">
                                        <div className="change up">
                                            <Icon name="trend-up"></Icon> +2.5%
                                        </div>
                                        <span>than last Week</span>
                                    </div>
                                </div>
                            </Col>
                            <Col sm="6" md="4" lg="6" xl="4">
                                <div className="box-dotted h-100">
                                    <Icon size="lg" variant="success" name="user-add"></Icon>
                                    <h5 className="title mt-2 mb-3">Instagram Followers</h5>
                                    <div className="amount h3">7784k</div>
                                    <div className="d-flex align-items-center smaller flex-wrap">
                                        <div className="change down">
                                            <Icon name="trend-down"></Icon> -1.5%
                                        </div>
                                        <span>than last Week</span>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4" lg="12" xl="4">
                                <div className="box-dotted h-100">
                                    <Icon size="lg" variant="warning" name="coins"></Icon>
                                    <h5 className="title mt-2 mb-3">Google Ads CPC</h5>
                                    <div className="amount h3">$5.02</div>
                                    <div className="d-flex align-items-center smaller flex-wrap">
                                        <div className="change up">
                                            <Icon name="trend-up"></Icon> +2.6%
                                        </div>
                                        <span>than last Week</span>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
        </Col> */}

        {/* <Col sm="6" xxl="3">
          <Card className="h-100 overflow-hidden">
              <div className="col-sep">
                  <Card.Body>
                      <div className="card-title-group align-items-start">
                          <div className="card-title">
                              <h4 className="title mb-0">External Links</h4>
                              <span className="small">Most used resources</span>
                          </div>
                          <div className="card-tools">
                              <Dropdown>
                                <Dropdown.Toggle size="sm" as={CustomDropdownToggle} className="btn btn-sm btn-icon btn-zoom me-n1">
                                  <Icon name="more-v"></Icon>
                                </Dropdown.Toggle>
                                <Dropdown.Menu as={CustomDropdownMenu} align="end">
                                  <Dropdown.Header className="py-2">
                                    <h6 className="mb-0">Quick Actions</h6>
                                  </Dropdown.Header>
                                  <Dropdown.Divider className="mt-0" />
                                  <Dropdown.Item>This week</Dropdown.Item>
                                    <Dropdown.Item>This month</Dropdown.Item>
                                    <Dropdown.Item>This year</Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                          </div>
                      </div>
                  </Card.Body>
                  <ListGroup variant="flush">
                      <ListGroup.Item className="py-3 d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                              <Image src="/images/icon/a.png" className="me-2" alt=""/>
                              <a href="#link" className="h6">Google Analytics</a>
                          </div>
                          <a href="#link" className="btn-link"><Icon name="external-alt"></Icon></a>
                      </ListGroup.Item>
                      <ListGroup.Item className="py-3 d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                              <Image src="/images/icon/b.png" className="me-2" alt=""/>
                              <a href="#link" className="h6">Facebook Ads</a>
                          </div>
                          <a href="#link" className="btn-link"><Icon name="external-alt"></Icon></a>
                      </ListGroup.Item>
                      <ListGroup.Item className="py-3 d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                              <Image src="/images/icon/c.png" className="me-2" alt=""/>
                              <a href="#link" className="h6">Seranking</a>
                          </div>
                          <a href="#link" className="btn-link"><Icon name="external-alt"></Icon></a>
                      </ListGroup.Item>
                  </ListGroup>
              </div>
          </Card>
        </Col> */}
        {/* <Col sm="6" xxl="3">
          <Card className="h-100 overflow-hidden">
              <div className="nk-chart-marketing-campaign bg-primary">
                  <Card.Body>
                    <div className="nk-chart-marketing-campaign-visitor">
                        <ChartBar data={campaignChart}/>
                    </div>
                  </Card.Body>
              </div>
              <Card.Body>
                  <div className="card-title-group">
                      <div className="card-title">
                          <h4 className="title mb-0">Campaign Visitors</h4>
                          <p className="small mt-1">Last Campaign Performance</p>
                      </div>
                      <div className="amount-wrap text-end">
                          <div className="amount h3 mb-0">784k</div>
                          <div className="change down small">
                              <Icon name="trend-down"></Icon> <span className="ms-1">-1.4%</span>
                          </div>
                      </div>
                  </div>
              </Card.Body>
          </Card>
        </Col>
        <Col xxl="6">
          <Card className="h-100">
              <Card.Body>
                  <div className="card-title-group">
                      <div className="card-title">
                          <h4 className="title mb-0">Campaign Overview</h4>
                      </div>
                      <div className="card-tools">
                          <Dropdown>
                            <Dropdown.Toggle size="sm" as={CustomDropdownToggle} className="btn btn-sm btn-icon btn-zoom me-n1">
                              <Icon name="more-v"></Icon>
                            </Dropdown.Toggle>
                            <Dropdown.Menu as={CustomDropdownMenu} align="end">
                              <Dropdown.Header className="py-2">
                                <h6 className="mb-0">Quick Actions</h6>
                              </Dropdown.Header>
                              <Dropdown.Divider className="mt-0" />
                              <Dropdown.Item>This week</Dropdown.Item>
                              <Dropdown.Item>This month</Dropdown.Item>
                              <Dropdown.Item>This year</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                      </div>
                  </div>
                  <div className="amount-wrap mt-3 mb-4">
                      <div className="d-flex align-items-center">
                          <div className="amount h1 mb-0">$560.93</div>
                          <div className="change up smaller ms-1">
                              <Icon name="trend-up"></Icon> 
                              <span className="ms-1">+2.7%</span>
                          </div>
                      </div>
                      <span className="smaller">Avarage cost per interaction</span>
                  </div>
                  <div className="nk-chart-marketing-campaign-overview mb-3">
                      <ChartLine data={campaignOverviewChart} />
                  </div>
                  <ChartLegend.Group className="justify-content-center flex-wrap gap gy-2 gx-4">
                      <div className="gap-col">
                        <ChartLegend className="chart-legend-small" symbol="primary">
                          Social Campaigns
                        </ChartLegend>
                      </div>
                      <div className="gap-col">
                        <ChartLegend className="chart-legend-small" symbol="success">
                          Email Newsletter
                        </ChartLegend>
                      </div>  
                      <div className="gap-col">
                        <ChartLegend className="chart-legend-small" symbol="warning">
                          Google Ads
                        </ChartLegend>
                      </div>  
                  </ChartLegend.Group>
              </Card.Body>
          </Card>
        </Col> */}
        {/* <Col xxl="6">
          <Card className="h-100">
            <Tab.Container defaultActiveKey="tab-1">
              <Card.Body className="flex-grow-0">
                  <div className="card-title-group mb-4 align-items-start">
                      <div className="card-title">
                          <h4 className="title mb-0">Top Referral Sources</h4>
                          <span className="small">80% activity growth</span>
                      </div>
                      <div className="card-tools">
                        <Dropdown>
                            <Dropdown.Toggle size="sm" as={CustomDropdownToggle} className="btn btn-sm btn-icon btn-zoom me-n1">
                              <Icon name="more-v"></Icon>
                            </Dropdown.Toggle>
                            <Dropdown.Menu as={CustomDropdownMenu} align="end">
                              <Dropdown.Header className="py-2">
                                <h6 className="mb-0">Quick Actions</h6>
                              </Dropdown.Header>
                              <Dropdown.Divider className="mt-0" />
                              <Dropdown.Item>This week</Dropdown.Item>
                              <Dropdown.Item>This month</Dropdown.Item>
                              <Dropdown.Item>This year</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                      </div>
                  </div>
                  <Nav variant="pills" className="nav-pills-border gap g-1">
                      <Nav.Item>
                        <Nav.Link eventKey="tab-1">
                          <div className="d-flex align-items-center">
                            <Media size="tiny" sharp>
                                <Image src="/images/icon/d.png" alt="icon" /> 
                            </Media>
                            <div className="h6 d-none d-md-inline-block ms-2">Google</div>
                          </div>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="tab-2">
                          <div className="d-flex align-items-center">
                            <Media size="tiny" sharp>
                                <Image src="/images/icon/b.png" alt="icon" /> 
                            </Media>
                            <div className="h6 d-none d-md-inline-block ms-2">Facebook</div>
                          </div>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="tab-3">
                          <div className="d-flex align-items-center">
                            <Media size="tiny" sharp>
                            <Image src="/images/icon/e.png" alt="icon" /> 
                            </Media>
                              <div className="h6 d-none d-md-inline-block ms-2">Instagram</div>
                          </div>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="tab-4">
                          <div className="d-flex align-items-center">
                            <Media size="tiny" sharp>
                                <Image src="/images/icon/c.png" alt="icon" /> 
                            </Media>
                              <div className="h6 d-none d-md-inline-block ms-2">Seranking</div>
                          </div>
                        </Nav.Link>
                      </Nav.Item>
                  </Nav>
              </Card.Body>
              <Tab.Content>
                <Tab.Pane eventKey="tab-1" transition={false}>
                    <Table responsive className="table-middle mb-0">
                        <thead className="table-light table-head-sm">
                            <tr>
                                <th className="tb-col">
                                    <OverlineTitle tag="span">parameter</OverlineTitle>
                                </th>
                                <th className="tb-col tb-col-end tb-col-sm">
                                    <OverlineTitle tag="span">status</OverlineTitle>
                                </th>
                                <th className="tb-col tb-col-end tb-col-sm">
                                    <OverlineTitle tag="span">conversion</OverlineTitle>
                                </th>
                                <th className="tb-col tb-col-end">
                                    <OverlineTitle tag="span">revenue</OverlineTitle>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="tb-col">
                                    <div className="h6">Email Marketing Campaign</div>
                                </td>
                                <td className="tb-col tb-col-end tb-col-sm">
                                    <Badge className="text-bg-info-soft">Active</Badge>
                                </td>
                                <td className="tb-col tb-col-end tb-col-sm">
                                    <span className="small">37%(438)</span>
                                </td>
                                <td className="tb-col tb-col-end">
                                    <span className="small">$84,034</span>
                                </td>
                            </tr>
                            <tr>
                                <td className="tb-col">
                                    <div className="h6">Google Workspace</div>
                                </td>
                                <td className="tb-col tb-col-end tb-col-sm">
                                    <Badge className="text-bg-success-soft">Completed</Badge>
                                </td>
                                <td className="tb-col tb-col-end tb-col-sm">
                                    <span className="small">100%(1.6k)</span>
                                </td>
                                <td className="tb-col tb-col-end">
                                    <span className="small">$3,326</span>
                                </td>
                            </tr>
                            <tr>
                                <td className="tb-col">
                                    <div className="h6">Google AdSense</div>
                                </td>
                                <td className="tb-col tb-col-end tb-col-sm">
                                    <Badge className="text-bg-info-soft">Active</Badge>
                                </td>
                                <td className="tb-col tb-col-end tb-col-sm">
                                    <span className="small">18%(634)</span>
                                </td>
                                <td className="tb-col tb-col-end">
                                    <span className="small">$28,359</span>
                                </td>
                            </tr>
                            <tr>
                                <td className="tb-col">
                                    <div className="h6">New Model BS 2000 X</div>
                                </td>
                                <td className="tb-col tb-col-end tb-col-sm">
                                    <Badge className="text-bg-danger-soft">In draft</Badge>
                                </td>
                                <td className="tb-col tb-col-end tb-col-sm">
                                    <span className="small">0%(0)</span>
                                </td>
                                <td className="tb-col tb-col-end">
                                    <span className="small">$14,945</span>
                                </td>
                            </tr>
                            <tr>
                                <td className="tb-col">
                                    <div className="h6">Affiliation Program</div>
                                </td>
                                <td className="tb-col tb-col-end tb-col-sm">
                                    <Badge className="text-bg-danger-soft">In draft</Badge>
                                </td>
                                <td className="tb-col tb-col-end tb-col-sm">
                                    <span className="small">0.1%(153)</span>
                                </td>
                                <td className="tb-col tb-col-end">
                                    <span className="small">$5,806</span>
                                </td>
                            </tr>
                            <tr>
                                <td className="tb-col">
                                    <div className="h6">Best Rated Headsets of 2022</div>
                                </td>
                                <td className="tb-col tb-col-end tb-col-sm">
                                    <Badge className="text-bg-success-soft">Completed</Badge>
                                </td>
                                <td className="tb-col tb-col-end tb-col-sm">
                                    <span className="small">18%(6.4k)</span>
                                </td>
                                <td className="tb-col tb-col-end">
                                    <span className="small">$15,342</span>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Tab.Pane>
                <Tab.Pane eventKey="tab-2" transition={false}>
                  <Table className="table-middle mb-0">
                      <thead className="table-light table-head-sm">
                          <tr>
                              <th className="tb-col">
                                <OverlineTitle tag="span">parameter</OverlineTitle>
                              </th>
                              <th className="tb-col tb-col-end tb-col-sm">
                                <OverlineTitle tag="span">status</OverlineTitle>
                              </th>
                              <th className="tb-col tb-col-end tb-col-sm">
                                <OverlineTitle tag="span">conversion</OverlineTitle>
                              </th>
                              <th className="tb-col tb-col-end">
                                <OverlineTitle tag="span">revenue</OverlineTitle>
                              </th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr>
                              <td className="tb-col">
                                  <div className="h6">Google AdSense</div>
                              </td>
                              <td className="tb-col tb-col-end tb-col-sm">
                                  <Badge className="text-bg-info-soft">Active</Badge>
                              </td>
                              <td className="tb-col tb-col-end tb-col-sm">
                                  <span className="small">18%(634)</span>
                              </td>
                              <td className="tb-col tb-col-end">
                                  <span className="small">$28,359</span>
                              </td>
                          </tr>
                          <tr>
                              <td className="tb-col">
                                  <div className="h6">New Model BS 2000 X</div>
                              </td>
                              <td className="tb-col tb-col-end tb-col-sm">
                                  <Badge className="text-bg-danger-soft">In draft</Badge>
                              </td>
                              <td className="tb-col tb-col-end tb-col-sm">
                                  <span className="small">0%(0)</span>
                              </td>
                              <td className="tb-col tb-col-end">
                                  <span className="small">$14,945</span>
                              </td>
                          </tr>
                          <tr>
                              <td className="tb-col">
                                  <div className="h6">Email Marketing Campaign</div>
                              </td>
                              <td className="tb-col tb-col-end tb-col-sm">
                                  <Badge className="text-bg-info-soft">Active</Badge>
                              </td>
                              <td className="tb-col tb-col-end tb-col-sm">
                                  <span className="small">37%(438)</span>
                              </td>
                              <td className="tb-col tb-col-end">
                                  <span className="small">$84,034</span>
                              </td>
                          </tr>
                          <tr>
                              <td className="tb-col">
                                  <div className="h6">Google Workspace</div>
                              </td>
                              <td className="tb-col tb-col-end tb-col-sm">
                                  <Badge className="text-bg-success-soft">Completed</Badge>
                              </td>
                              <td className="tb-col tb-col-end tb-col-sm">
                                  <span className="small">100%(1.6k)</span>
                              </td>
                              <td className="tb-col tb-col-end">
                                  <span className="small">$3,326</span>
                              </td>
                          </tr>
                          <tr>
                              <td className="tb-col">
                                  <div className="h6">Affiliation Program</div>
                              </td>
                              <td className="tb-col tb-col-end tb-col-sm">
                                  <Badge className="text-bg-danger-soft">In draft</Badge>
                              </td>
                              <td className="tb-col tb-col-end tb-col-sm">
                                  <span className="small">0.1%(153)</span>
                              </td>
                              <td className="tb-col tb-col-end">
                                  <span className="small">$5,806</span>
                              </td>
                          </tr>
                          <tr>
                              <td className="tb-col">
                                  <div className="h6">Best Rated Headsets of 2022</div>
                              </td>
                              <td className="tb-col tb-col-end tb-col-sm">
                                  <Badge className="text-bg-success-soft">Completed</Badge>
                              </td>
                              <td className="tb-col tb-col-end tb-col-sm">
                                  <span className="small">18%(6.4k)</span>
                              </td>
                              <td className="tb-col tb-col-end">
                                  <span className="small">$15,342</span>
                              </td>
                          </tr>
                      </tbody>
                  </Table>
                </Tab.Pane>
                <Tab.Pane eventKey="tab-3" transition={false}>
                    <Table className="table-middle mb-0">
                        <thead className="table-light table-head-sm">
                            <tr>
                                <th className="tb-col">
                                    <OverlineTitle tag="span">parameter</OverlineTitle>
                                </th>
                                <th className="tb-col tb-col-end tb-col-sm">
                                    <OverlineTitle tag="span">status</OverlineTitle>
                                </th>
                                <th className="tb-col tb-col-end tb-col-sm">
                                    <OverlineTitle tag="span">conversion</OverlineTitle>
                                </th>
                                <th className="tb-col tb-col-end">
                                    <OverlineTitle tag="span">revenue</OverlineTitle>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="tb-col">
                                    <div className="h6">Email Marketing Campaign</div>
                                </td>
                                <td className="tb-col tb-col-end tb-col-sm">
                                    <Badge className="text-bg-info-soft">Active</Badge>
                                </td>
                                <td className="tb-col tb-col-end tb-col-sm">
                                    <span className="small">37%(438)</span>
                                </td>
                                <td className="tb-col tb-col-end">
                                    <span className="small">$84,034</span>
                                </td>
                            </tr>
                            <tr>
                                <td className="tb-col">
                                    <div className="h6">Google AdSense</div>
                                </td>
                                <td className="tb-col tb-col-end tb-col-sm">
                                    <Badge className="text-bg-info-soft">Active</Badge>
                                </td>
                                <td className="tb-col tb-col-end tb-col-sm">
                                    <span className="small">18%(634)</span>
                                </td>
                                <td className="tb-col tb-col-end">
                                    <span className="small">$28,359</span>
                                </td>
                            </tr>
                            <tr>
                                <td className="tb-col">
                                    <div className="h6">New Model BS 2000 X</div>
                                </td>
                                <td className="tb-col tb-col-end tb-col-sm">
                                    <Badge className="text-bg-danger-soft">In draft</Badge>
                                </td>
                                <td className="tb-col tb-col-end tb-col-sm">
                                    <span className="small">0%(0)</span>
                                </td>
                                <td className="tb-col tb-col-end">
                                    <span className="small">$14,945</span>
                                </td>
                            </tr>
                            <tr>
                                <td className="tb-col">
                                    <div className="h6">Google Workspace</div>
                                </td>
                                <td className="tb-col tb-col-end tb-col-sm">
                                    <Badge className="text-bg-success-soft">Completed</Badge>
                                </td>
                                <td className="tb-col tb-col-end tb-col-sm">
                                    <span className="small">100%(1.6k)</span>
                                </td>
                                <td className="tb-col tb-col-end">
                                    <span className="small">$3,326</span>
                                </td>
                            </tr>
                            <tr>
                                <td className="tb-col">
                                    <div className="h6">Affiliation Program</div>
                                </td>
                                <td className="tb-col tb-col-end tb-col-sm">
                                    <Badge className="text-bg-danger-soft">In draft</Badge>
                                </td>
                                <td className="tb-col tb-col-end tb-col-sm">
                                    <span className="small">0.1%(153)</span>
                                </td>
                                <td className="tb-col tb-col-end">
                                    <span className="small">$5,806</span>
                                </td>
                            </tr>
                            <tr>
                                <td className="tb-col">
                                    <div className="h6">Best Rated Headsets of 2022</div>
                                </td>
                                <td className="tb-col tb-col-end tb-col-sm">
                                    <Badge className="text-bg-success-soft">Completed</Badge>
                                </td>
                                <td className="tb-col tb-col-end tb-col-sm">
                                    <span className="small">18%(6.4k)</span>
                                </td>
                                <td className="tb-col tb-col-end">
                                    <span className="small">$15,342</span>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Tab.Pane>
                <Tab.Pane eventKey="tab-4" transition={false}>
                    <Table className="table-middle mb-0">
                      <thead className="table-light table-head-sm">
                          <tr>
                              <th className="tb-col">
                                <OverlineTitle tag="span">parameter</OverlineTitle>
                              </th>
                              <th className="tb-col tb-col-end tb-col-sm">
                                <OverlineTitle tag="span">status</OverlineTitle>
                              </th>
                              <th className="tb-col tb-col-end tb-col-sm">
                                <OverlineTitle tag="span">conversion</OverlineTitle>
                              </th>
                              <th className="tb-col tb-col-end">
                                <OverlineTitle tag="span">revenue</OverlineTitle>
                              </th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr>
                              <td className="tb-col">
                                  <div className="h6">Google AdSense</div>
                              </td>
                              <td className="tb-col tb-col-end tb-col-sm">
                                  <Badge className="text-bg-info-soft">Active</Badge>
                              </td>
                              <td className="tb-col tb-col-end tb-col-sm">
                                  <span className="small">18%(634)</span>
                              </td>
                              <td className="tb-col tb-col-end">
                                  <span className="small">$28,359</span>
                              </td>
                          </tr>
                          <tr>
                              <td className="tb-col">
                                  <div className="h6">New Model BS 2000 X</div>
                              </td>
                              <td className="tb-col tb-col-end tb-col-sm">
                                  <Badge className="text-bg-danger-soft">In draft</Badge>
                              </td>
                              <td className="tb-col tb-col-end tb-col-sm">
                                  <span className="small">0%(0)</span>
                              </td>
                              <td className="tb-col tb-col-end">
                                  <span className="small">$14,945</span>
                              </td>
                          </tr>
                          <tr>
                              <td className="tb-col">
                                  <div className="h6">Email Marketing Campaign</div>
                              </td>
                              <td className="tb-col tb-col-end tb-col-sm">
                                  <Badge className="text-bg-info-soft">Active</Badge>
                              </td>
                              <td className="tb-col tb-col-end tb-col-sm">
                                  <span className="small">37%(438)</span>
                              </td>
                              <td className="tb-col tb-col-end">
                                  <span className="small">$84,034</span>
                              </td>
                          </tr>
                          <tr>
                              <td className="tb-col">
                                  <div className="h6">Google Workspace</div>
                              </td>
                              <td className="tb-col tb-col-end tb-col-sm">
                                  <Badge className="text-bg-success-soft">Completed</Badge>
                              </td>
                              <td className="tb-col tb-col-end tb-col-sm">
                                  <span className="small">100%(1.6k)</span>
                              </td>
                              <td className="tb-col tb-col-end">
                                  <span className="small">$3,326</span>
                              </td>
                          </tr>
                          <tr>
                              <td className="tb-col">
                                  <div className="h6">Affiliation Program</div>
                              </td>
                              <td className="tb-col tb-col-end tb-col-sm">
                                  <Badge className="text-bg-danger-soft">In draft</Badge>
                              </td>
                              <td className="tb-col tb-col-end tb-col-sm">
                                  <span className="small">0.1%(153)</span>
                              </td>
                              <td className="tb-col tb-col-end">
                                  <span className="small">$5,806</span>
                              </td>
                          </tr>
                          <tr>
                              <td className="tb-col">
                                  <div className="h6">Best Rated Headsets of 2022</div>
                              </td>
                              <td className="tb-col tb-col-end tb-col-sm">
                                  <Badge className="text-bg-success-soft">Completed</Badge>
                              </td>
                              <td className="tb-col tb-col-end tb-col-sm">
                                  <span className="small">18%(6.4k)</span>
                              </td>
                              <td className="tb-col tb-col-end">
                                  <span className="small">$15,342</span>
                              </td>
                          </tr>
                      </tbody>
                    </Table>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Card>
        </Col> */}
        {/* <Col xl="6" xxl="4">
          <Card className="h-100">
              <Card.Body className="flex-grow-0 py-2">
                  <div className="card-title-group align-items-start">
                      <div className="card-title">
                          <h4 className="title mb-0">Top Channels</h4>
                          <span className="small">Users from all channels</span>
                      </div>
                      <div className="card-tools">
                        <Dropdown>
                            <Dropdown.Toggle size="sm" as={CustomDropdownToggle} className="btn btn-sm btn-icon btn-zoom me-n1">
                              <Icon name="more-v"></Icon>
                            </Dropdown.Toggle>
                            <Dropdown.Menu as={CustomDropdownMenu} align="end">
                              <Dropdown.Header className="py-2">
                                <h6 className="mb-0">Quick Actions</h6>
                              </Dropdown.Header>
                              <Dropdown.Divider className="mt-0" />
                              <Dropdown.Item>This week</Dropdown.Item>
                              <Dropdown.Item>This month</Dropdown.Item>
                              <Dropdown.Item>This year</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                      </div>
                  </div>
              </Card.Body>
              <Table responsive className="table-middle mb-0">
                  <thead className="table-light table-head-sm">
                      <tr>
                        <th className="tb-col">
                          <OverlineTitle tag="span">source</OverlineTitle>
                        </th>
                        <th className="tb-col tb-col-end">
                          <OverlineTitle tag="span">visitors</OverlineTitle>
                        </th>
                        <th className="tb-col tb-col-end">
                          <OverlineTitle tag="span">revenues</OverlineTitle>
                        </th>
                        <th className="tb-col tb-col-end">
                          <OverlineTitle tag="span">conversion</OverlineTitle>
                        </th>
                      </tr>
                  </thead>
                  <tbody>
                    {channelsData.map(item =>
                      <tr key={item.id}>
                          <td className="tb-col">
                            <MediaGroup>
                              <Media size="sm" shape="circle" variant={item.theme}>
                                <Icon name={item.icon}></Icon>
                              </Media>
                              <MediaText>
                                <span className="title">{item.website}</span>
                              </MediaText>
                            </MediaGroup>
                          </td>
                          <td className="tb-col tb-col-end">
                            <span className="small">{item.visitor}</span>
                          </td>
                          <td className="tb-col tb-col-end">
                            <span className="change up small">{item.revenue}</span>
                          </td>
                          <td className="tb-col tb-col-end">
                            <span className="small">{item.conversion}</span>
                          </td>
                      </tr>
                    )}
                  </tbody>
              </Table>
          </Card>
        </Col> */}
        {/* <Col xl="6" xxl="4">
          <Card className="h-100">
              <div className="col-sep">
                  <Card.Body className="py-2">
                      <div className="card-title-group">
                          <div className="card-title">
                              <h4 className="title mb-0">Feedback</h4>
                          </div>
                          <div className="card-tools">
                              <Button href="#" size="sm" variant="secondary" className="btn-soft">View All</Button>
                          </div>
                      </div>
                  </Card.Body>
                  <Card.Body>
                      <Timeline className="nk-timeline-center">
                          <Timeline.List>
                              <Timeline.Item avatar="/images/avatar/a.jpg">
                                <p className="small"><strong>Timothy Smith</strong> Commented on Cloud <strong>Killan James</strong></p>
                                <span className="smaller time">1 hour ago</span>
                                <p className="small">It's an Affiliate commissions SaaS application that allows you to track your affiliate revenue.</p>
                              </Timeline.Item>
                              <Timeline.Item avatar="/images/avatar/b.jpg">
                                <p className="small"><strong>Nancy Martino</strong> Commented on Cloud <strong>Glen Matney</strong></p>
                                <span className="smaller time">2 hours ago</span>
                                <p className="small">There are many variations of passages of Lorem Ipsum available, but the majority have suffered.</p>
                              </Timeline.Item>
                              <Timeline.Item avatar="/images/avatar/c.jpg">
                                <p className="small"><strong>Michael Morris</strong> Commented on Cloud <strong>Williams Son</strong></p>
                                <span className="smaller time">3 hours ago</span>
                                <p className="small">But I must explain to you how all this mistaken idea of denouncing pleasure.</p>
                              </Timeline.Item>
                          </Timeline.List>
                      </Timeline>
                  </Card.Body>
              </div>
          </Card>
        </Col> */}
        {/* <Col xxl="4">
          <Card className="h-100">
              <Card.Body>
                  <div className="card-title-group align-items-start">
                      <div className="card-title">
                          <h4 className="title mb-0">Effectiveness</h4>
                          <span className="small">User involment by ads type</span>
                      </div>
                      <div className="card-tools">
                        <Dropdown>
                            <Dropdown.Toggle size="sm" as={CustomDropdownToggle} className="btn btn-sm btn-icon btn-zoom me-n1">
                              <Icon name="more-v"></Icon>
                            </Dropdown.Toggle>
                            <Dropdown.Menu as={CustomDropdownMenu} align="end">
                              <Dropdown.Header className="py-2">
                                <h6 className="mb-0">Quick Actions</h6>
                              </Dropdown.Header>
                              <Dropdown.Divider className="mt-0" />
                              <Dropdown.Item>This week</Dropdown.Item>
                              <Dropdown.Item>This month</Dropdown.Item>
                              <Dropdown.Item>This year</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                      </div>
                  </div>
                  <div className="nk-chart-marketing-effectiveness mt-3">
                      <ChartRadar data={effectivenessChart} />
                  </div>
              </Card.Body>
          </Card>
        </Col> */}
      </Row>
    </Layout>
  )
}

export default HomeMarketing;
