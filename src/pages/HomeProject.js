import { Row, Col, Card, Button, Dropdown, Table, Badge, ProgressBar } from 'react-bootstrap';
import Layout from '../layout/default';
import { ChartBar, ChartLine } from "../components/Chart/Charts";
import { Pureknob, Icon, Media, MediaGroup, MediaText, CustomDropdownMenu, CustomDropdownToggle, OverlineTitle, Schedule, Image } from '../components';
import { Colors } from '../utilities/index';
import hexRGB from '../utilities/hexRGB';

function HomeProject() {

  // active project knob chart
  let activeProject = {
    size: 110,
    value: 73,
    angleOffset: 0.4,
    angleStart: 1,
    angleEnd: 1,
    colorFg: Colors.primary,
    trackWidth: "0.15"
  };

  // earnings chart
  let earningsChart = {
    labels: ["M", "T", "W", "T", "F", "S", "S"],
    yAxis: false,
    xGridColor: Colors.white,
    yGridColor: Colors.white,
    xGridBorderColor: Colors.white,
    yGridBorderColor: Colors.white,
    barThickness: 6,
    datasets: [
      {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.info,
        backgroundColor: Colors.info,
        hoverBackgroundColor: Colors.info,
        label: "Earnings",
        data: [700, 780, 570, 870, 670, 910, 770]
      },
    ]
  };

  // total clients Chart
  let totalClientsChart = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    yAxis: false,
    xAxis: false,
    maxTicksLimit: 4,
    datasets: [
      {
        tension: .4,
        label: "Total Clients",
        borderColor: Colors.success,
        backgroundColor: hexRGB(Colors.success, 0.2),
        borderWidth: 4,
        pointBorderColor: 'transparent',
        pointBackgroundColor: 'transparent',
        pointHoverBackgroundColor: Colors.success,
        borderCapStyle: "round",
        fill: true,
        data: [38, 40, 23, 80, 70, 110]
      }
    ]
  };

  // active project knob chart
  let totalTaskDone = {
    size: 136,
    value: 65,
    angleOffset: -0.5,
    angleStart: 0.7,
    angleEnd: 0.7,
    colorFg: Colors.pink,
    trackWidth: "0.15"
  };

  // project overview Chart
  let projectsOverviewChart = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    stacked: false,
    ticksValue: 'k',
    borderDash: [8, 4],
    xGridColor: Colors.white,
    xGridBorderColor: Colors.white,
    yGridBorderColor: Colors.white,
    datasets: [
      {
        borderColor: Colors.primary,
        backgroundColor: Colors.primary,
        borderWidth: 1,
        label: "Total Income",
        data: [120, 160, 95, 105, 98, 99, 167, 140, 155, 267, 237, 250],
        order: 1
      },
      {
        borderColor: Colors.warning,
        backgroundColor: Colors.warning,
        borderWidth: 2,
        label: "Total Profit",
        data: [110, 80, 125, 55, 95, 75, 90, 110, 80, 125, 55, 95],
        type: 'line',
        order: 0
      }
    ]
  };

  // avg earnings Chart
  let avgEarningsChart = {
    labels: ["01 Jan", "02 Jan", "03 Jan", "04 Jan", "05 Jan", "06 Jan", "07 Jan", "08 Jan", "09 Jan", "10 Jan", "11 Jan", "12 Jan", "13 Jan", "14 Jan", "15 Jan"],
    ticksValue: 'k',
    borderDash: [8, 4],
    xAxis: false,
    yGridBorderColor: Colors.white,
    datasets: [
      {
        tension: .4,
        label: "Avg Earnings",
        borderColor: Colors.success,
        backgroundColor: hexRGB(Colors.success, 0.2),
        pointBackgroundColor: 'transparent',
        borderWidth: 2,
        pointBorderColor: 'transparent',
        pointHoverBackgroundColor: Colors.success,
        fill: true,
        data: [55, 105, 100, 115, 150, 145, 190, 150, 200, 190, 230, 200, 256, 234, 300]
      }
    ]
  };

  return (
    <Layout title="Project Manage">
      <Row className="g-gs">
        <Col xxl="7">
          <Row className="g-gs">
            <Col md="6">
              <Card className="h-100">
                <Card.Body>
                  <div className="d-flex flex-column flex-sm-row-reverse align-items-sm-center justify-content-sm-between">
                    <Pureknob data={activeProject} className="nk-chart-project-active" />
                    <div className="card-title mb-0 mt-4 mt-sm-0">
                      <h5 className="title mb-3 mb-xl-5">Active Projects</h5>
                      <div className="amount h1">284</div>
                      <div className="d-flex align-items-center smaller flex-wrap">
                        <div className="change up">
                          <Icon name="upword-alt-fill"></Icon> +2.7%
                        </div>
                        <span className="text-light"> Projects this month</span>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md="6">
              <Card className="h-100">
                <Card.Body>
                  <div className="d-flex flex-column flex-sm-row-reverse align-items-sm-center justify-content-sm-between gx-xl-5">
                    <div className="nk-chart-project-earnings">
                      <ChartBar data={earningsChart} />
                    </div>
                    <div className="card-title mb-0 mt-4 mt-sm-0">
                      <h5 className="title mb-3 mb-xl-5">Projects Earnings</h5>
                      <div className="amount h1">$169</div>
                      <div className="d-flex align-items-center smaller flex-wrap">
                        <div className="change up">
                          <Icon name="upword-alt-fill"></Icon> 10.5%
                        </div>
                        <span className="text-light">From last Week</span>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md="6">
              <Card className="h-100">
                <Card.Body>
                  <div className="d-flex flex-column flex-sm-row-reverse align-items-sm-center justify-content-sm-between gx-xl-5">
                    <div className="nk-chart-project-earnings">
                      <ChartLine data={totalClientsChart} />
                    </div>
                    <div className="card-title mb-0 mt-4 mt-sm-0">
                      <h5 className="title mb-3 mb-xl-5">Total Clients</h5>
                      <div className="amount h1">970</div>
                      <div className="d-flex align-items-center smaller flex-wrap">
                        <div className="change up">
                          <Icon name="upword-alt-fill"></Icon> 2%
                        </div>
                        <span className="text-light">Than last month</span>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md="6">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex flex-column flex-sm-row-reverse align-items-sm-center justify-content-sm-between gx-xl-5">
                    <Pureknob data={totalTaskDone} className="nk-chart-project-done">
                      <span className="knob-title small text-light">Task Done</span>
                    </Pureknob>
                    <div className="card-title mb-0 mt-4 mt-sm-0">
                      <h5 className="title mb-3 mb-xl-5">Total Task Done</h5>
                      <div className="amount h1">768</div>
                      <div className="d-flex align-items-center smaller flex-wrap">
                        <div className="change up">
                          <Icon name="upword-alt-fill"></Icon> 14.2%
                        </div>
                        <span className="text-light">From last week</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xxl="5">
          <Card className="h-100 col-sep">
            <Card.Body className="py-2 flex-grow-0">
              <div className="card-title-group">
                <div className="card-title">
                  <h5 className="title">Projects Overview</h5>
                </div>
                <div className="card-tools">
                  <Dropdown>
                    <Dropdown.Toggle size="sm" as={CustomDropdownToggle} className="btn btn-sm btn-icon btn-zoom me-n1">
                      <Icon name="more-v"></Icon>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="dropdown-menu-sm" as={CustomDropdownMenu} align="end">
                      <Dropdown.Header className="py-2">
                        <h6 className="mb-0">Actions</h6>
                      </Dropdown.Header>
                      <Dropdown.Divider className="mt-0" />
                      <Dropdown.Item>7 Days</Dropdown.Item>
                      <Dropdown.Item>15 Days</Dropdown.Item>
                      <Dropdown.Item>30 Days</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </Card.Body>
            <Card.Body className="d-flex flex-column justify-content-between">
              <Row className="g-gs text-center">
                <Col className="col-6" sm="3">
                  <div className="amount h2 mb-0 text-success">946</div>
                  <span className="smaller">Total Projects</span>
                </Col>
                <Col className="col-6" sm="3">
                  <div className="amount h2 mb-0 text-primary">280</div>
                  <span className="smaller">Active Projects</span>
                </Col>
                <Col className="col-6" sm="3">
                  <div className="amount h2 mb-0 text-secondary">586</div>
                  <span className="smaller">Revenue</span>
                </Col>
                <Col className="col-6" sm="3">
                  <div className="amount h2 mb-0 text-warning">9,453</div>
                  <span className="smaller">Working Hours</span>
                </Col>
              </Row>
              <div className="nk-chart-project-overview mt-3">
                <ChartBar data={projectsOverviewChart} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xxl="12">
          <Card className="h-100">
            <Card.Body className="py-2 flex-grow-0">
              <div className="card-title-group">
                <div className="card-title">
                  <h5 className="title">Projects Stats</h5>
                </div>
                <div className="card-tools d-none d-sm-inline-block">
                  <Button size="sm" variant="secondary" className="btn-soft">Export Report</Button>
                </div>
              </div>
            </Card.Body>
            <Table responsive className="table-middle mb-0">
              <thead className="table-light table-head-sm">
                <tr>
                  <th className="tb-col">
                    <OverlineTitle tag="span">items</OverlineTitle>
                  </th>
                  <th className="tb-col tb-col-end tb-col-xxl">
                    <OverlineTitle tag="span">budget</OverlineTitle>
                  </th>
                  <th className="tb-col tb-col-end tb-col-sm">
                    <OverlineTitle tag="span">progress</OverlineTitle>
                  </th>
                  <th className="tb-col tb-col-end  tb-col-xxl">
                    <OverlineTitle tag="span">asign</OverlineTitle>
                  </th>
                  <th className="tb-col tb-col-end">
                    <OverlineTitle tag="span">status</OverlineTitle>
                  </th>
                  <th className="tb-col tb-col-end">
                    <OverlineTitle tag="span"><span className="d-none d-sm-inline-blcok">due</span> date</OverlineTitle>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="tb-col">
                    <MediaGroup>
                      <Media size="md" shape="circle">
                        <Image src="/images/product/a.jpg" alt="" />
                      </Media>
                      <MediaText>
                        <a href="#link" className="title">Create Wireframe</a>
                        <span className="text smaller">Esther Howard</span>
                      </MediaText>
                    </MediaGroup>
                  </td>
                  <td className="tb-col tb-col-end tb-col-xxl">
                    <span className="small">$32,400</span>
                  </td>
                  <td className="tb-col tb-col-end tb-col-sm">
                    <div className="d-flex align-items-center">
                      <span className="small me-1">63%</span>
                      <ProgressBar className="w-100 progress-sm" variant="success" now={63} />
                    </div>
                  </td>
                  <td className="tb-col tb-col-end  tb-col-xxl">
                    <MediaGroup className="media-group-overlap">
                      <Media size="xs" shape="circle" border className="border-white">
                        <Image src="/images/avatar/a.jpg" alt="" />
                      </Media>
                      <Media size="xs" shape="circle" border className="border-white">
                        <Image src="/images/avatar/b.jpg" alt="" />
                      </Media>
                      <Media size="xs" shape="circle" border className="border-white">
                        <Image src="/images/avatar/c.jpg" alt="" />
                      </Media>
                    </MediaGroup>
                  </td>
                  <td className="tb-col tb-col-end">
                    <Badge className="text-bg-info-soft">In progress</Badge>
                  </td>
                  <td className="tb-col tb-col-end">
                    <span className="small">07 Sep 2022</span>
                  </td>
                </tr>
                <tr>
                  <td className="tb-col">
                    <MediaGroup>
                      <Media size="md" shape="circle">
                        <Image src="/images/product/b.jpg" alt="" />
                      </Media>
                      <MediaText>
                        <a href="#link" className="title">Divine Opulence</a>
                        <span className="text smaller">Jenny Wilson</span>
                      </MediaText>
                    </MediaGroup>
                  </td>
                  <td className="tb-col tb-col-end tb-col-xxl">
                    <span className="small">$265,816</span>
                  </td>
                  <td className="tb-col tb-col-end tb-col-sm">
                    <div className="d-flex align-items-center">
                      <span className="small me-1">100%</span>
                      <ProgressBar className="w-100 progress-sm" variant="success" now={100} />
                    </div>
                  </td>
                  <td className="tb-col tb-col-end tb-col-xxl">
                    <MediaGroup className="media-group-overlap">
                      <Media size="xs" shape="circle" border className="border-white">
                        <Image src="/images/avatar/a.jpg" alt="" />
                      </Media>
                      <Media size="xs" shape="circle" border className="border-white">
                        <Image src="/images/avatar/b.jpg" alt="" />
                      </Media>
                      <Media size="xs" shape="circle" border className="border-white">
                        <Image src="/images/avatar/c.jpg" alt="" />
                      </Media>
                    </MediaGroup>
                  </td>
                  <td className="tb-col tb-col-end">
                    <Badge className="text-bg-success-soft">Completed</Badge>
                  </td>
                  <td className="tb-col tb-col-end">
                    <span className="small">12 Aug 2022</span>
                  </td>
                </tr>
                <tr>
                  <td className="tb-col">
                    <MediaGroup>
                      <Media size="md" shape="circle">
                        <Image src="/images/product/c.jpg" alt="" />
                      </Media>
                      <MediaText>
                        <a href="#link" className="title">Charto CRM</a>
                        <span className="text smaller">Cody Fisher</span>
                      </MediaText>
                    </MediaGroup>
                  </td>
                  <td className="tb-col tb-col-end tb-col-xxl">
                    <span className="small">$9,538</span>
                  </td>
                  <td className="tb-col tb-col-end tb-col-sm">
                    <div className="d-flex align-items-center">
                      <span className="small me-1">30%</span>
                      <ProgressBar className="w-100 progress-sm" variant="success" now={30} />
                    </div>
                  </td>
                  <td className="tb-col tb-col-end tb-col-xxl">
                    <MediaGroup className="media-group-overlap">
                      <Media size="xs" shape="circle" border className="border-white">
                        <Image src="/images/avatar/a.jpg" alt="" />
                      </Media>
                      <Media size="xs" shape="circle" border className="border-white">
                        <Image src="/images/avatar/b.jpg" alt="" />
                      </Media>
                    </MediaGroup>
                  </td>
                  <td className="tb-col tb-col-end">
                    <Badge className="text-bg-info-soft">In progress</Badge>
                  </td>
                  <td className="tb-col tb-col-end">
                    <span className="small">18 Oct 2022</span>
                  </td>
                </tr>
                <tr>
                  <td className="tb-col">
                    <MediaGroup>
                      <Media size="md" shape="circle">
                        <Image src="/images/product/d.jpg" alt="" />
                      </Media>
                      <MediaText>
                        <a href="#link" className="title">Mountain Trip Kit </a>
                        <span className="text smaller">Savannah Nguyen</span>
                      </MediaText>
                    </MediaGroup>
                  </td>
                  <td className="tb-col tb-col-end tb-col-xxl">
                    <span className="small">$12,930</span>
                  </td>
                  <td className="tb-col tb-col-end tb-col-sm">
                    <div className="d-flex align-items-center">
                      <span className="small me-1">0%</span>
                      <ProgressBar className="w-100 progress-sm" variant="success" now={0} />
                    </div>
                  </td>
                  <td className="tb-col tb-col-end tb-col-xxl">
                    <MediaGroup className="media-group-overlap">
                      <Media size="xs" shape="circle" border className="border-white">
                        <Image src="/images/avatar/a.jpg" alt="" />
                      </Media>
                      <Media size="xs" shape="circle" border className="border-white">
                        <Image src="/images/avatar/b.jpg" alt="" />
                      </Media>
                    </MediaGroup>
                  </td>
                  <td className="tb-col tb-col-end">
                    <span className="badge text-bg-warning-soft">Pending</span>
                  </td>
                  <td className="tb-col tb-col-end">
                    <span className="small">25 Jul 2022</span>
                  </td>
                </tr>
                <tr>
                  <td className="tb-col">
                    <MediaGroup>
                      <Media size="md" shape="circle">
                        <Image src="/images/product/e.jpg" alt="" />
                      </Media>
                      <MediaText>
                        <a href="#link" className="title">Chat Application</a>
                        <span className="text smaller">Jane Cooper</span>
                      </MediaText>
                    </MediaGroup>
                  </td>
                  <td className="tb-col tb-col-end tb-col-xxl">
                    <span className="small">$184,384</span>
                  </td>
                  <td className="tb-col tb-col-end tb-col-sm">
                    <div className="d-flex align-items-center">
                      <span className="small me-1">80%</span>
                      <ProgressBar className="w-100 progress-sm" variant="success" now={80} />
                    </div>
                  </td>
                  <td className="tb-col tb-col-end tb-col-xxl">
                    <MediaGroup className="media-group-overlap">
                      <Media size="xs" shape="circle" border className="border-white">
                        <Image src="/images/avatar/a.jpg" alt="" />
                      </Media>
                      <Media size="xs" shape="circle" border className="border-white">
                        <Image src="/images/avatar/b.jpg" alt="" />
                      </Media>
                      <Media size="xs" shape="circle" border className="border-white">
                        <Image src="/images/avatar/c.jpg" alt="" />
                      </Media>
                    </MediaGroup>
                  </td>
                  <td className="tb-col tb-col-end">
                    <Badge className="text-bg-info-soft">In progress</Badge>
                  </td>
                  <td className="tb-col tb-col-end">
                    <span className="small">07 Sep 2022</span>
                  </td>
                </tr>
                <tr>
                  <td className="tb-col">
                    <MediaGroup>
                      <Media size="md" shape="circle">
                        <Image src="/images/product/a.jpg" alt="" />
                      </Media>
                      <MediaText>
                        <a href="#link" className="title">Mountain Trip Kit </a>
                        <span className="text smaller">Jane Cooper</span>
                      </MediaText>
                    </MediaGroup>
                  </td>
                  <td className="tb-col tb-col-end tb-col-xxl">
                    <span className="small">$12,930</span>
                  </td>
                  <td className="tb-col tb-col-end tb-col-sm">
                    <div className="d-flex align-items-center">
                      <span className="small me-1">36%</span>
                      <ProgressBar className="w-100 progress-sm" variant="success" now={36} />
                    </div>
                  </td>
                  <td className="tb-col tb-col-end tb-col-xxl">
                    <MediaGroup className="media-group-overlap">
                      <Media size="xs" shape="circle" border className="border-white">
                        <Image src="/images/avatar/a.jpg" alt="" />
                      </Media>
                      <Media size="xs" shape="circle" border className="border-white">
                        <Image src="/images/avatar/b.jpg" alt="" />
                      </Media>
                    </MediaGroup>
                  </td>
                  <td className="tb-col tb-col-end">
                    <Badge className="text-bg-info-soft">In progress</Badge>
                  </td>
                  <td className="tb-col tb-col-end">
                    <span className="small">25 Jul 2022</span>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Card>
        </Col>
        {/* <Col xxl="5">
          <Card className="h-100">
            <Card.Body>
              <Row className="g-gs">
                <Col sm="6">
                    <div className="card-title">
                      <div className="mb-1 small text-light">Next Delivery</div>
                      <h2 className="title">Chat Application</h2>
                    </div>
                    <MediaGroup className="my-4">
                      <Media size="md" shape="circle">
                        <Image src="/images/avatar/a.jpg" alt="" />
                      </Media>
                      <MediaText>
                        <span className="title">Jenny Wilson</span>
                        <span className="text smaller">Manager</span>
                      </MediaText>
                    </MediaGroup>
                    <p className="small">Flat cartoony illustrations with vivid unblended colors and asymmetrical beautiful purple hair lady</p>
                    <div className="list-group-dotted mt-4 mb-5">
                        <div className="list-group-wrap">
                            <div className="p-3">
                                <div className="h5 mb-0">25 Oct 2022</div>
                                <span className="smaller">Due Date</span>
                            </div>
                            <div className="p-3">
                                <div className="h5 mb-0">$58,642</div>
                                <span className="smaller">Budget</span>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-wrap gap g-3">
                        <div className="gap-col">
                          <Button href="#" size="sm" variant="primary" className="btn-soft">
                            <span>View Project</span>
                            <Icon name="external-alt"></Icon>
                          </Button>
                        </div>
                        <div className="gap-col">
                          <MediaGroup className="media-group-overlap">
                            <Media size="sm" shape="circle" border className="border-white">
                              <Image src="/images/avatar/a.jpg" alt="" />
                            </Media>
                            <Media size="sm" shape="circle" border className="border-white">
                              <Image src="/images/avatar/b.jpg" alt="" />
                            </Media>
                          </MediaGroup>
                        </div>
                    </div>
                </Col>
                <Col sm="6" className="text-sm-end">
                  <Image src="/images/product/a-lg.jpg" alt="" className="rounded img-cover" />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col> */}
        {/* <Col md="6" xxl="4">
          <Card className="h-100">
            <Card.Body>
              <div className="card-title-group">
                  <div className="card-title mb-0">
                      <h5 className="title">Avg. Agent Earnings</h5>
                  </div>
                  <div className="card-tools">
                    <Dropdown>
                        <Dropdown.Toggle size="sm" as={CustomDropdownToggle} className="btn btn-sm btn-icon btn-zoom me-n1">
                          <Icon name="more-v"></Icon>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="dropdown-menu-sm" as={CustomDropdownMenu} align="end">
                          <Dropdown.Header className="py-2">
                            <h6 className="mb-0">Actions</h6>
                          </Dropdown.Header>
                          <Dropdown.Divider className="mt-0" />
                          <Dropdown.Item>7 Days</Dropdown.Item>
                          <Dropdown.Item>15 Days</Dropdown.Item>
                          <Dropdown.Item>30 Days</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                  </div>
              </div>
              <div className="amount-wrap mt-3 mb-4">
                  <div className="amount h2 mb-1">$238,560.93</div>
                  <div className="d-flex align-items-center smaller">
                      <div className="change up">
                          <Icon name="trend-up"></Icon> +2% 
                      </div>
                      <span>than last Week</span>
                  </div>
              </div>
              <div className="list-group-dotted">
                <div className="list-group-wrap flex-column">
                  <div className="py-1 px-2">
                    <div className="d-flex flex-wrap justify-content-between">
                      <span className="small">2:30 PM</span>
                      <span className="small">$5,256.26</span>
                      <span className="change down small">-129.34</span>
                    </div>
                  </div>
                  <div className="py-1 px-2">
                    <div className="d-flex flex-wrap justify-content-between">
                      <span className="small">3:55 PM</span>
                      <span className="small">$5,837.34</span>
                      <span className="change up small">+539.84</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="nk-chart-project-avg-earnings mt-4">
                <ChartLine data={avgEarningsChart}/>
              </div>
            </Card.Body>
          </Card>
        </Col> */}
        {/* <Col md="6" xxl="4">
          <Card className="h-100">
            <Card.Body>
              <div className="card-title-group">
                <div className="card-title">
                  <h5 className="title mb-1">Daily Task</h5>
                  <p className="small">Percentage of product a user demands</p>
                </div>
              </div>
              <Schedule className="mt-4">
                <Schedule.Item symbol="active">
                  <span className="smaller">10:00</span>
                  <div className="h6 mb-0">IOS Dev Team Meeting</div>
                </Schedule.Item>
                <Schedule.Item symbol="active">
                  <span className="smaller">12:00</span>
                  <div className="h6 mb-0">Believing is the absence of doubt</div>
                </Schedule.Item>
                <Schedule.Item symbol="active">
                  <span className="smaller">16:00</span>
                  <div className="h6 mb-0">Start with a baseline</div>
                </Schedule.Item>
                <Schedule.Item symbol="active">
                  <span className="smaller">18:00</span>
                  <div className="h6 mb-0">Break through self doubt and fear</div>
                </Schedule.Item>
              </Schedule>
            </Card.Body>
          </Card>
        </Col> */}
        {/* <Col xxl="4">
          <Card className="h-100">
              <Card.Body className="py-2 flex-grow-0">
                <div className="card-title-group">
                  <div className="card-title">
                      <h5 className="title">Members of Employee</h5>
                  </div>
                  <div className="card-tools d-none d-sm-inline-block">
                      <Button href="#" size="sm" variant="secondary" className="btn-soft"><span>Add Member</span></Button>
                  </div>
                </div>
              </Card.Body>
              <Table responsive className="table-middle mb-0">
                  <thead className="table-light table-head-sm">
                      <tr>
                          <th className="tb-col">
                            <OverlineTitle tag="span">members</OverlineTitle>
                          </th>
                          <th className="tb-col tb-col-end">
                            <OverlineTitle tag="span">tasks</OverlineTitle>
                          </th>
                          <th className="tb-col tb-col-end tb-col-sm">
                            <OverlineTitle tag="span">status</OverlineTitle>
                          </th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                          <td className="tb-col">
                              <MediaGroup>
                                  <Media size="md" shape="circle">
                                      <Image src="/images/product/a.jpg" alt="" />
                                  </Media>
                                  <MediaText>
                                      <span className="title">Timothy Smith</span>
                                      <span className="text smaller">Product Manager</span>
                                  </MediaText>
                              </MediaGroup>
                          </td>
                          <td className="tb-col tb-col-end">
                              <span className="small">238</span>
                          </td>
                          <td className="tb-col tb-col-end tb-col-sm">
                            <Pureknob className="nk-chart-knob" data={
                              {
                                size: 24,
                                value: 60,
                                angleOffset: 0.4,
                                colorFg: Colors.success,
                                trackWidth: "0.3",
                                hideValue: true
                              }
                            } />
                          </td>
                      </tr>
                      <tr>
                          <td className="tb-col">
                              <MediaGroup>
                                  <Media size="md" shape="circle">
                                      <Image src="/images/product/b.jpg" alt="" />
                                  </Media>
                                  <MediaText>
                                      <span className="title">Alexis Clarke</span>
                                      <span className="text smaller">React Developer</span>
                                  </MediaText>
                              </MediaGroup>
                          </td>
                          <td className="tb-col tb-col-end">
                              <span className="small">107</span>
                          </td>
                          <td className="tb-col tb-col-end tb-col-sm">
                            <Pureknob className="nk-chart-knob" data={
                              {
                                size: 24,
                                value: 42,
                                angleOffset: 0.4,
                                colorFg: Colors.info,
                                trackWidth: "0.3",
                                hideValue: true
                              }
                            } />
                          </td>
                      </tr>
                      <tr>
                          <td className="tb-col">
                              <MediaGroup>
                                  <Media size="md" shape="circle">
                                      <Image src="/images/product/c.jpg" alt="" />
                                  </Media>
                                  <MediaText>
                                      <span className="title">Herbert Stokes</span>
                                      <span className="text smaller">Lead Designer</span>
                                  </MediaText>
                              </MediaGroup>
                          </td>
                          <td className="tb-col tb-col-end">
                              <span className="small">76</span>
                          </td>
                          <td className="tb-col tb-col-end tb-col-sm">
                            <Pureknob className="nk-chart-knob" data={
                              {
                                size: 24,
                                value: 50,
                                angleOffset: 0.4,
                                colorFg: Colors.primary,
                                trackWidth: "0.3",
                                hideValue: true
                              }
                            } />
                          </td>
                      </tr>
                      <tr>
                          <td className="tb-col">
                              <MediaGroup>
                                  <Media size="md" shape="circle">
                                      <Image src="/images/product/d.jpg" alt="" />
                                  </Media>
                                  <MediaText>
                                      <span className="title">Nancy Martino</span>
                                      <span className="text smaller">UI/UX Designer</span>
                                  </MediaText>
                              </MediaGroup>
                          </td>
                          <td className="tb-col tb-col-end">
                              <span className="small">683</span>
                          </td>
                          <td className="tb-col tb-col-end tb-col-sm">
                            <Pureknob className="nk-chart-knob" data={
                              {
                                size: 24,
                                value: 34,
                                angleOffset: 0.4,
                                colorFg: Colors.warning,
                                trackWidth: "0.3",
                                hideValue: true
                              }
                            } />
                          </td>
                      </tr>
                      <tr>
                          <td className="tb-col">
                              <MediaGroup>
                                  <Media size="md" shape="circle">
                                      <Image src="/images/product/e.jpg" alt="" />
                                  </Media>
                                  <MediaText>
                                      <span className="title">Michael Morris</span>
                                      <span className="text smaller">Lead Developer</span>
                                  </MediaText>
                              </MediaGroup>
                          </td>
                          <td className="tb-col tb-col-end">
                              <span className="small">395</span>
                          </td>
                          <td className="tb-col tb-col-end tb-col-sm">
                            <Pureknob className="nk-chart-knob" data={
                              {
                                size: 24,
                                value: 26,
                                angleOffset: 0.4,
                                colorFg: Colors.primary,
                                trackWidth: "0.3",
                                hideValue: true
                              }
                            } />
                          </td>
                      </tr>
                      <tr>
                          <td className="tb-col">
                              <MediaGroup>
                                  <Media size="md" shape="circle">
                                      <Image src="/images/product/b.jpg" alt="" />
                                  </Media>
                                  <MediaText>
                                      <span className="title">Glen Matney</span>
                                      <span className="text smaller">Lead Designer</span>
                                  </MediaText>
                              </MediaGroup>
                          </td>
                          <td className="tb-col tb-col-end">
                              <span className="small">46</span>
                          </td>
                          <td className="tb-col tb-col-end tb-col-sm">
                            <Pureknob className="nk-chart-knob" data={
                              {
                                size: 24,
                                value: 46,
                                angleOffset: 0.4,
                                colorFg: Colors.primary,
                                trackWidth: "0.3",
                                hideValue: true
                              }
                            } />
                          </td>
                      </tr>
                  </tbody>
              </Table>
          </Card>
        </Col> */}
      </Row>
    </Layout>
  )
}

export default HomeProject;
