import Layout from "../layout/default";
import {
  Row,
  Col,
  Card,
  Dropdown,
  Table,
  Badge,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import {
  Icon,
  Media,
  MediaGroup,
  MediaText,
  CustomDropdownMenu,
  CustomDropdownToggle,
  OverlineTitle,
  ChartLegend,
  LinkList,
  LinkListItem,
} from "../components";
import { ChartBar, ChartLine, ChartDoughnut } from "../components/Chart/Charts";
import { Colors } from "../utilities/index";
import hexRGB from "../utilities/hexRGB";

function HomeNFT() {
  // total revenue chart
  let totalRevenueChart = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    yAxis: false,
    xAxis: false,
    datasets: [
      {
        tension: 0.4,
        label: "Revenue",
        borderColor: Colors.primary,
        backgroundColor: hexRGB(Colors.primary, 0.2),
        borderWidth: 2,
        pointBorderColor: "transparent",
        pointBackgroundColor: "transparent",
        pointHoverBackgroundColor: Colors.primary,
        fill: true,
        data: [420, 460, 295, 505, 288, 699, 667, 740, 655, 967, 837, 1450],
      },
    ],
  };

  // estimated chart
  let estimatedChart = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    yAxis: false,
    xAxis: false,
    datasets: [
      {
        tension: 0.4,
        label: "Revenue",
        borderColor: Colors.warning,
        backgroundColor: hexRGB(Colors.warning, 0.2),
        borderWidth: 2,
        pointBorderColor: "transparent",
        pointBackgroundColor: "transparent",
        pointHoverBackgroundColor: Colors.warning,
        fill: true,
        data: [420, 460, 295, 505, 288, 699, 667, 740, 655, 967, 837, 1450],
      },
    ],
  };

  // marketplace Chart
  let marketplaceChart = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    borderDash: [8, 4],
    xGridColor: Colors.white,
    xGridBorderColor: Colors.white,
    yGridBorderColor: Colors.white,
    datasets: [
      {
        tension: 0.4,
        borderWidth: 2,
        borderColor: Colors.yellow,
        pointBorderColor: Colors.white,
        pointBackgroundColor: Colors.yellow,
        pointHoverBackgroundColor: Colors.yellow,
        backgroundColor: hexRGB(Colors.yellow, 0.2),
        label: "Total Atwork",
        fill: true,
        data: [0, 15, 10, 28, 20, 38, 30, 22, 30, 12, 38, 30],
      },
      {
        tension: 0.4,
        borderWidth: 2,
        pointBorderColor: Colors.white,
        pointBackgroundColor: Colors.success,
        borderColor: Colors.success,
        pointHoverBackgroundColor: Colors.success,
        backgroundColor: hexRGB(Colors.success, 0.2),
        label: "Total Auction",
        fill: true,
        data: [30, 24, 49, 36, 40, 49, 39, 38, 59, 50, 56, 66],
      },
      {
        tension: 0.4,
        borderWidth: 2,
        pointBorderColor: Colors.white,
        pointBackgroundColor: Colors.pink,
        borderColor: Colors.pink,
        pointHoverBackgroundColor: Colors.pink,
        label: "Total Artist",
        borderDash: [8, 4],
        data: [44, 34, 39, 68, 29, 61, 10, 48, 45, 70, 46, 55],
      },
    ],
  };

  // popularity chart
  let popularityChart = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    ticksValue: "k",
    borderDash: [8, 4],
    xGridColor: Colors.white,
    yGridBorderColor: Colors.white,
    barPercentage: 0.7,
    categoryPercentage: 0.6,
    datasets: [
      {
        borderRadius: 10,
        borderColor: Colors.success,
        backgroundColor: Colors.success,
        label: "Like",
        data: [110, 80, 125, 55, 95, 75, 90, 110, 80, 125, 55, 95],
      },
      {
        borderRadius: 10,
        borderColor: Colors.info,
        backgroundColor: Colors.info,
        label: "Share",
        data: [75, 90, 110, 80, 125, 55, 95, 75, 90, 110, 80, 125],
      },
    ],
  };

  let pendingOrdersData = {
    labels: [
      "Production Not Planned",
      "0% Completed",
      "<50% Completed",
      ">=50% Completed",
      "Delivery Ready",
    ],
    datasets: [
      {
        backgroundColor: [
          Colors.info,
          Colors.yellow,
          Colors.green,
          Colors.purple,
          Colors.red,
        ],
        data: [90, 170, 10, 60, 50],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <Layout title="NFT">
      <Row className="g-gs">
        <Col xxl="12">
          <Card className="h-100">
            <Card.Body className="flex-grow-0 py-2">
              <div className="card-title-group">
                <div className="card-title">
                  <h5 className="title">Production Overview</h5>
                </div>
                {/* <div className="card-tools">
                        <Dropdown>
                            <Dropdown.Toggle size="sm" as={CustomDropdownToggle} className="btn btn-sm btn-icon btn-zoom me-n1">
                              <Icon name="more-v"></Icon>
                            </Dropdown.Toggle>
                            <Dropdown.Menu as={CustomDropdownMenu} align="end">
                              <Dropdown.Header className="py-2">
                                <h6 className="mb-0">Actions</h6>
                              </Dropdown.Header>
                              <Dropdown.Divider className="mt-0" />
                              <Dropdown.Item>New Ticket</Dropdown.Item>
                              <Dropdown.Item>New Customer</Dropdown.Item>
                              <Dropdown.Item>New Contact</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                      </div> */}
              </div>
            </Card.Body>
            <Table responsive className="table-middle mb-0">
              <thead className="table-light table-head-sm">
                <tr>
                  <th className="tb-col">
                    <OverlineTitle tag="span"></OverlineTitle>
                  </th>
                  <th className="tb-col tb-col-end">
                    <OverlineTitle tag="span">FG Produced</OverlineTitle>
                  </th>
                  <th className="tb-col tb-col-end">
                    <OverlineTitle tag="span">RM Consumed</OverlineTitle>
                  </th>
                  <th className="tb-col tb-col-end">
                    <OverlineTitle tag="span">Scrap Generated</OverlineTitle>
                  </th>
                  <th className="tb-col tb-col-end">
                    <OverlineTitle tag="span">RM Rejected</OverlineTitle>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="tb-col">
                    <MediaGroup>
                      {/* <Media size="md" shape="circle" className="flex-shrink-0">
                                      <Image src="/images/product/a.jpg" alt="" />
                                  </Media> */}
                      <MediaText>
                        <span className="title text-truncate">
                          Month to Date
                        </span>
                        {/* <span className="text smaller">Artworks</span> */}
                      </MediaText>
                    </MediaGroup>
                  </td>
                  <td className="tb-col tb-col-end">
                    <span className="small">&#8377; 0.00</span>
                  </td>
                  <td className="tb-col tb-col-end">
                    {/* <div className="change up small"> */}
                    {/* <Icon name="trend-up"></Icon> */}
                    <span className="small">&#8377; 0.00</span>
                    {/* </div> */}
                  </td>
                  <td className="tb-col tb-col-end">
                    <span className="small">&#8377; 0.00</span>
                  </td>
                  <td className="tb-col tb-col-end">
                    <span className="small">&#8377; 0.00</span>
                  </td>
                </tr>
                <tr>
                  <td className="tb-col">
                    <MediaGroup>
                      {/* <Media size="md" shape="circle" className="flex-shrink-0">
                                      <Image src="/images/product/b.jpg" alt="" />
                                  </Media> */}
                      <MediaText>
                        <span className="title text-truncate">
                          Last 30 Days{" "}
                        </span>
                        {/* <span className="text smaller">16 Oct 2022</span> */}
                      </MediaText>
                    </MediaGroup>
                  </td>
                  <td className="tb-col tb-col-end">
                    <span className="small">&#8377; 0.00</span>
                  </td>
                  <td className="tb-col tb-col-end">
                    {/* <div className="change up small">  */}
                    {/* <Icon name="trend-up"></Icon>    */}
                    <span className="small">&#8377; 0.00</span>
                    {/* </div> */}
                  </td>
                  <td className="tb-col tb-col-end">
                    <span className="small">&#8377; 0.00</span>
                  </td>
                  <td className="tb-col tb-col-end">
                    <span className="small">&#8377; 0.00</span>
                  </td>
                </tr>
                <tr>
                  <td className="tb-col">
                    <MediaGroup>
                      {/* <Media size="md" shape="circle" className="flex-shrink-0">
                                      <Image src="/images/product/c.jpg" alt="" />
                                  </Media> */}
                      <MediaText>
                        <span className="title text-truncate">
                          Financial Year to Date
                        </span>
                        {/* <span className="text smaller">21 Feb 2022</span> */}
                      </MediaText>
                    </MediaGroup>
                  </td>
                  <td className="tb-col tb-col-end">
                    <span className="small">&#8377; 0.00</span>
                  </td>
                  <td className="tb-col tb-col-end">
                    {/* <div className="change down small"> */}
                    {/* <Icon name="trend-down"></Icon> */}
                    <span className="small">&#8377; 0.00</span>
                    {/* </div> */}
                  </td>
                  <td className="tb-col tb-col-end">
                    <span className="small">&#8377; 0.00</span>
                  </td>
                  <td className="tb-col tb-col-end">
                    <span className="small">&#8377; 0.00</span>
                  </td>
                </tr>
                <tr>
                  <td className="tb-col">
                    <MediaGroup>
                      {/* <Media size="md" shape="circle" className="flex-shrink-0">
                                      <Image src="/images/product/d.jpg" alt="" />
                                  </Media> */}
                      <MediaText>
                        <span className="title text-truncate">
                          Previous Financial Year
                        </span>
                        {/* <span className="text smaller">14 Jun 2022</span> */}
                      </MediaText>
                    </MediaGroup>
                  </td>
                  <td className="tb-col tb-col-end">
                    <span className="small">&#8377; 0.00</span>
                  </td>
                  <td className="tb-col tb-col-end">
                    {/* <div className="change up small"> */}
                    {/* <Icon name="trend-up"></Icon> */}
                    <span className="small">&#8377; 0.00</span>
                    {/* </div> */}
                  </td>
                  <td className="tb-col tb-col-end">
                    <span className="small">&#8377; 0.00</span>
                  </td>
                  <td className="tb-col tb-col-end">
                    <span className="small">&#8377; 0.00</span>
                  </td>
                </tr>
                {/* <tr>
                          <td className="tb-col">
                              <MediaGroup>
                                  <Media size="md" shape="circle" className="flex-shrink-0">
                                      <Image src="/images/product/e.jpg" alt="" />
                                  </Media>
                                  <MediaText>
                                      <span className="title text-truncate">One Seater Sofa</span>
                                      <span className="text smaller">28 Jul 2022</span>
                                  </MediaText>
                              </MediaGroup>
                          </td>
                          <td className="tb-col tb-col-end">
                              <span className="small">18,735.20</span>
                          </td>
                          <td className="tb-col tb-col-end">
                              <div className="change down small">
                                <Icon name="trend-down"></Icon>
                                <span className="ms-1">7.65</span>
                              </div>
                          </td>
                          <td className="tb-col tb-col-end">
                              <span className="small">7.5k</span>
                          </td>
                          <td className="tb-col tb-col-end">
                              <span className="small">15.6k</span>
                          </td>
                      </tr> */}
              </tbody>
            </Table>
          </Card>
        </Col>

        <Col md="6" xxl="6">
          <Card className="h-100">
            <Card.Body>
              <div className="card-title-group">
                <div className="card-title">
                  <h5 className="title">Pending Orders (OCs) in Production</h5>
                </div>
                <div className="card-tools">
                  <OverlayTrigger
                    placement="left"
                    overlay={
                      <Tooltip id="tooltip-another">
                        Pending Orders (OCs) in Production
                      </Tooltip>
                    }
                  >
                    <em className="icon-hint icon ni ni-help-fill"></em>
                  </OverlayTrigger>
                </div>
              </div>
              <div className="nk-chart-analytics-session-device mt-4">
                <ChartDoughnut data={pendingOrdersData} />
              </div>
              <ChartLegend.Group className="justify-content-around pt-4 flex-wrap gap g-2">
                <ChartLegend symbol="info">Production Not Planned</ChartLegend>
                <ChartLegend symbol="warning">0% Completed</ChartLegend>
                <ChartLegend symbol="success">&lt; 50% Completed</ChartLegend>
                <ChartLegend symbol="purple">&gt;= 50% Completed</ChartLegend>
                <ChartLegend symbol="danger">Delivery Ready</ChartLegend>
              </ChartLegend.Group>
            </Card.Body>
          </Card>
        </Col>

        <Col xxl="6">
          <Card className="h-100">
            <Card.Body>
              <div className="card-title-group mb-4 align-items-start">
                <div className="card-title">
                  <h4 className="title mb-0">Accounts Data</h4>
                  {/* <span className="small">Latest social statistics</span> */}
                </div>
                <div className="card-tools">
                  <Dropdown>
                    <Dropdown.Toggle
                      size="sm"
                      as={CustomDropdownToggle}
                      className="btn btn-sm btn-icon btn-zoom me-n1"
                    >
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
                            <ChartLegend
                              className="chart-legend-small"
                              symbol="success"
                            >
                              Received
                            </ChartLegend>
                          </div>
                          <div className="gap-col">
                            <ChartLegend
                              className="chart-legend-small"
                              symbol="info"
                            >
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

        {/* <Col xl="6">
          <Card className="h-100">
              <Card.Body>
                  <div className="d-flex flex-column flex-md-row-reverse justify-content-between align-items-md-center gap g-3">
                      <div className="gap-col d-xl-none d-xxl-block">
                          <Image src="/images/award/b.png" alt="" className="pt-lg-3"/>
                      </div>
                      <div className="gap-col">
                          <div className="card-title mb-4">
                              <h4 className="title mb-1 lh-base">Discover, Collect, Sell and Create your own NFTs.</h4>
                              <p className="small">The world's first and largest digital marketplace.</p>
                          </div>
                          <div className="d-flex flex-wrap gap g-3">
                              <div className="gap-col">
                                  <div className="d-flex align-items-center">
                                      <div className="amount h3 mb-0">25k</div>
                                      <span className="ms-1 small">At work</span>
                                  </div>
                              </div>
                              <div className="gap-col">
                                  <div className="d-flex align-items-center">
                                      <div className="amount h3 mb-0">80k</div>
                                      <span className="ms-1 small">Auction</span>
                                  </div>
                              </div>
                              <div className="gap-col">
                                  <div className="d-flex align-items-center">
                                      <div className="amount h3 mb-0">22k</div>
                                      <span className="ms-1 small">Artist</span>
                                  </div>
                              </div>
                          </div>
                          <ul className="d-flex flex-wrap gap g-2 pt-4">
                              <li>
                                  <Button href="#" size="sm" variant="primary">Explore Now</Button>
                              </li>
                              <li>
                                  <Button href="#" size="sm" variant="secondary">Create Your Own</Button>
                              </li>
                          </ul>
                      </div>
                  </div>
              </Card.Body>
          </Card>
        </Col> */}

        <Col sm="6" xl="6">
          <Card className="h-100 overflow-hidden">
            <Card.Body className="pb-0">
              <div className="card-title-group">
                <MediaGroup>
                  <Media size="sm" shape="circle" variant="primary">
                    <Icon name="coins"></Icon>
                  </Media>
                  <MediaText>
                    <h4>Total Revenue</h4>
                  </MediaText>
                </MediaGroup>
                <div className="card-tools">
                  <Dropdown>
                    <Dropdown.Toggle
                      size="sm"
                      as={CustomDropdownToggle}
                      className="btn btn-sm btn-icon btn-zoom me-n1"
                    >
                      <Icon name="more-v"></Icon>
                    </Dropdown.Toggle>
                    <Dropdown.Menu as={CustomDropdownMenu} align="end">
                      <Dropdown.Header className="py-2">
                        <h6 className="mb-0">Actions</h6>
                      </Dropdown.Header>
                      <Dropdown.Divider className="mt-0" />
                      <Dropdown.Item>New Ticket</Dropdown.Item>
                      <Dropdown.Item>New Customer</Dropdown.Item>
                      <Dropdown.Item>New Contact</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
              <div className="amount-wrap mt-3">
                <div className="amount h2 mb-2">$2,526.56</div>
                <div className="d-flex flex-wrap align-items-center gap g-1">
                  <div className="gap-col">
                    <Badge className="text-bg-success-soft">
                      <Icon name="trend-up"></Icon> 4.55%
                    </Badge>
                  </div>
                  <div className="gap-col">
                    <span className="small">Previous month</span>
                  </div>
                </div>
              </div>
            </Card.Body>
            <div className="nk-chart-nft-total-revenue m-n1">
              <ChartLine data={totalRevenueChart}></ChartLine>
            </div>
          </Card>
        </Col>
        <Col sm="6" xl="6">
          <Card className="h-100 overflow-hidden">
            <Card.Body className="pb-0">
              <div className="card-title-group">
                <MediaGroup>
                  <Media size="sm" shape="circle" variant="warning">
                    <Icon name="wallet-fill" className="text-white"></Icon>
                  </Media>
                  <MediaText>
                    <h4>Estimated</h4>
                  </MediaText>
                </MediaGroup>
                <div className="card-tools">
                  <Dropdown>
                    <Dropdown.Toggle
                      size="sm"
                      as={CustomDropdownToggle}
                      className="btn btn-sm btn-icon btn-zoom me-n1"
                    >
                      <Icon name="more-v"></Icon>
                    </Dropdown.Toggle>
                    <Dropdown.Menu as={CustomDropdownMenu} align="end">
                      <Dropdown.Header className="py-2">
                        <h6 className="mb-0">Actions</h6>
                      </Dropdown.Header>
                      <Dropdown.Divider className="mt-0" />
                      <Dropdown.Item>New Ticket</Dropdown.Item>
                      <Dropdown.Item>New Customer</Dropdown.Item>
                      <Dropdown.Item>New Contact</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
              <div className="amount-wrap mt-3">
                <div className="amount h2 mb-2">$5,625.64</div>
                <div className="d-flex flex-wrap align-items-center gap g-1">
                  <div className="gap-col">
                    <Badge className="text-bg-danger-soft">
                      <Icon name="trend-down"></Icon> 3.8%
                    </Badge>
                  </div>
                  <div className="gap-col">
                    <span className="small">Previous month</span>
                  </div>
                </div>
              </div>
            </Card.Body>
            <div className="nk-chart-nft-estimated m-n1">
              <ChartLine data={estimatedChart}></ChartLine>
            </div>
          </Card>
        </Col>

        {/* <Col xxl="6">
          <Card className="h-100">
              <Card.Body className="py-2">
                  <div className="card-title-group mb-4">
                      <div className="card-title">
                          <h5 className="title">Marketplace</h5>
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
                              <Dropdown.Item>New Ticket</Dropdown.Item>
                              <Dropdown.Item>New Customer</Dropdown.Item>
                              <Dropdown.Item>New Contact</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                      </div>
                  </div>
                  <div className="nk-chart-nft-marketplace mb-3">
                      <ChartLine data={marketplaceChart}/>
                  </div>
                  <ChartLegend.Group className="justify-content-center flex-wrap gap gy-2 gx-4">
                      <div className="gap-col">
                        <ChartLegend className="chart-legend-small" symbol="warning">
                          Total Atwork
                        </ChartLegend>
                      </div>
                      <div className="gap-col">
                        <ChartLegend className="chart-legend-small" symbol="success">
                          Total Auction
                        </ChartLegend>
                      </div>  
                      <div className="gap-col">
                        <ChartLegend className="chart-legend-small" symbol="pink">
                          Total Artist
                        </ChartLegend>
                      </div>  
                  </ChartLegend.Group>
              </Card.Body>
          </Card>
        </Col> */}

        {/* <Col xxl="6">
          <Card className="h-100">
              <Card.Body className="flex-grow-0 py-2">
                  <div className="card-title-group">
                      <div className="card-title">
                          <h5 className="title">Recent NFT Collections</h5>
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
                              <Dropdown.Item>New Ticket</Dropdown.Item>
                              <Dropdown.Item>New Customer</Dropdown.Item>
                              <Dropdown.Item>New Contact</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                      </div>
                  </div>
              </Card.Body>
              <Table responsive className="table-middle mb-0">
                  <thead className="table-light table-head-sm">
                      <tr>
                          <th className="tb-col">
                            <OverlineTitle tag="span">Collections</OverlineTitle>
                          </th>
                          <th className="tb-col tb-col-end">
                            <OverlineTitle tag="span">Volume</OverlineTitle>
                          </th>
                          <th className="tb-col tb-col-end">
                            <OverlineTitle tag="span">24h%</OverlineTitle>
                          </th>
                          <th className="tb-col tb-col-end">
                            <OverlineTitle tag="span">creators</OverlineTitle>
                          </th>
                          <th className="tb-col tb-col-end">
                            <OverlineTitle tag="span">items</OverlineTitle>
                          </th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                          <td className="tb-col">
                              <MediaGroup>
                                  <Media size="md" shape="circle" className="flex-shrink-0">
                                      <Image src="/images/product/a.jpg" alt="" />
                                  </Media>
                                  <MediaText>
                                      <span className="title text-truncate">Nike v22 Running</span>
                                      <span className="text smaller">Artworks</span>
                                  </MediaText>
                              </MediaGroup>
                          </td>
                          <td className="tb-col tb-col-end">
                              <span className="small">8,568.02</span>
                          </td>
                          <td className="tb-col tb-col-end">
                              <div className="change up small">
                                <Icon name="trend-up"></Icon>
                                <span className="ms-1">3.08</span>
                              </div>
                          </td>
                          <td className="tb-col tb-col-end">
                              <span className="small">6.0k</span>
                          </td>
                          <td className="tb-col tb-col-end">
                              <span className="small">18.6k</span>
                          </td>
                      </tr>
                      <tr>
                          <td className="tb-col">
                              <MediaGroup>
                                  <Media size="md" shape="circle" className="flex-shrink-0">
                                      <Image src="/images/product/b.jpg" alt="" />
                                  </Media>
                                  <MediaText>
                                      <span className="title text-truncate">Business Kit (Mug)</span>
                                      <span className="text smaller">16 Oct 2022</span>
                                  </MediaText>
                              </MediaGroup>
                          </td>
                          <td className="tb-col tb-col-end">
                              <span className="small">24,718.40</span>
                          </td>
                          <td className="tb-col tb-col-end">
                              <div className="change up small">
                                <Icon name="trend-up"></Icon>
                                <span className="ms-1">1.20</span>
                              </div>
                          </td>
                          <td className="tb-col tb-col-end">
                              <span className="small">3.0k</span>
                          </td>
                          <td className="tb-col tb-col-end">
                              <span className="small">13.6k</span>
                          </td>
                      </tr>
                      <tr>
                          <td className="tb-col">
                              <MediaGroup>
                                  <Media size="md" shape="circle" className="flex-shrink-0">
                                      <Image src="/images/product/c.jpg" alt="" />
                                  </Media>
                                  <MediaText>
                                      <span className="title text-truncate">Borosil Paper Cup</span>
                                      <span className="text smaller">21 Feb 2022</span>
                                  </MediaText>
                              </MediaGroup>
                          </td>
                          <td className="tb-col tb-col-end">
                              <span className="small">3,280.45</span>
                          </td>
                          <td className="tb-col tb-col-end">
                              <div className="change down small">
                                <Icon name="trend-down"></Icon>
                                <span className="ms-1">0.34</span>
                              </div>
                          </td>
                          <td className="tb-col tb-col-end">
                              <span className="small">5.0k</span>
                          </td>
                          <td className="tb-col tb-col-end">
                              <span className="small">12.1k</span>
                          </td>
                      </tr>
                      <tr>
                          <td className="tb-col">
                              <MediaGroup>
                                  <Media size="md" shape="circle" className="flex-shrink-0">
                                      <Image src="/images/product/d.jpg" alt="" />
                                  </Media>
                                  <MediaText>
                                      <span className="title text-truncate">Mountain Trip Kit</span>
                                      <span className="text smaller">14 Jun 2022</span>
                                  </MediaText>
                              </MediaGroup>
                          </td>
                          <td className="tb-col tb-col-end">
                              <span className="small">28,843.25</span>
                          </td>
                          <td className="tb-col tb-col-end">
                              <div className="change up small">
                                <Icon name="trend-up"></Icon>
                                <span className="ms-1">8.26</span>
                              </div>
                          </td>
                          <td className="tb-col tb-col-end">
                              <span className="small">5.0k</span>
                          </td>
                          <td className="tb-col tb-col-end">
                              <span className="small">19.6k</span>
                          </td>
                      </tr>
                      <tr>
                          <td className="tb-col">
                              <MediaGroup>
                                  <Media size="md" shape="circle" className="flex-shrink-0">
                                      <Image src="/images/product/e.jpg" alt="" />
                                  </Media>
                                  <MediaText>
                                      <span className="title text-truncate">One Seater Sofa</span>
                                      <span className="text smaller">28 Jul 2022</span>
                                  </MediaText>
                              </MediaGroup>
                          </td>
                          <td className="tb-col tb-col-end">
                              <span className="small">18,735.20</span>
                          </td>
                          <td className="tb-col tb-col-end">
                              <div className="change down small">
                                <Icon name="trend-down"></Icon>
                                <span className="ms-1">7.65</span>
                              </div>
                          </td>
                          <td className="tb-col tb-col-end">
                              <span className="small">7.5k</span>
                          </td>
                          <td className="tb-col tb-col-end">
                              <span className="small">15.6k</span>
                          </td>
                      </tr>
                  </tbody>
              </Table>
          </Card>
        </Col> */}

        {/* <Col xxl="4">
          <Card className="h-100">
              <Card.Body className="flex-grow-0 py-2">
                  <div className="card-title-group">
                      <div className="card-title">
                          <h5 className="title">History of Bids</h5>
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
                              <Dropdown.Item>New Ticket</Dropdown.Item>
                              <Dropdown.Item>New Customer</Dropdown.Item>
                              <Dropdown.Item>New Contact</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                      </div>
                  </div>
              </Card.Body>
              <Table responsive className="table-middle mb-0">
                  <tbody>
                      <tr>
                          <td className="tb-col">
                              <MediaGroup>
                                  <Media size="md" shape="circle" className="flex-shrink-0">
                                    <Image src="/images/product/a.jpg" alt="" />
                                  </Media>
                                  <MediaText>
                                    <a href="#link" className="title">Jane Cooper</a>
                                    <span className="text smaller">@janeCooper12</span>
                                  </MediaText>
                              </MediaGroup>
                          </td>
                          <td className="tb-col tb-col-end">
                              <span className="small">346.47 ETH</span>
                          </td>
                      </tr>
                      <tr>
                          <td className="tb-col">
                              <MediaGroup>
                                  <Media size="md" shape="circle" className="flex-shrink-0">
                                    <Image src="/images/product/b.jpg" alt="" />
                                  </Media>
                                  <MediaText>
                                    <a href="#link" className="title">Esther Howard</a>
                                    <span className="text smaller">@estherHoward</span>
                                  </MediaText>
                              </MediaGroup>
                          </td>
                          <td className="tb-col tb-col-end">
                              <span className="small">852.34 ETH</span>
                          </td>
                      </tr>
                      <tr>
                          <td className="tb-col">
                              <MediaGroup>
                                  <Media size="md" shape="circle" className="flex-shrink-0">
                                    <Image src="/images/product/c.jpg" alt="" />
                                  </Media>
                                  <MediaText>
                                    <a href="#link" className="title">Tower Hill</a>
                                    <span className="text smaller">@towerHill</span>
                                  </MediaText>
                              </MediaGroup>
                          </td>
                          <td className="tb-col tb-col-end">
                              <span className="small">754.15 ETH</span>
                          </td>
                      </tr>
                      <tr>
                          <td className="tb-col">
                              <MediaGroup>
                                  <Media size="md" shape="circle" className="flex-shrink-0">
                                    <Image src="/images/product/d.jpg" alt="" />
                                  </Media>
                                  <MediaText>
                                    <a href="#link" className="title">Michael Morris</a>
                                    <span className="text smaller">@michael21</span>
                                  </MediaText>
                              </MediaGroup>
                          </td>
                          <td className="tb-col tb-col-end">
                              <span className="small">14.92 ETH</span>
                          </td>
                      </tr>
                      <tr>
                          <td className="tb-col">
                              <MediaGroup>
                                  <Media size="md" shape="circle" className="flex-shrink-0">
                                    <Image src="/images/product/e.jpg" alt="" />
                                  </Media>
                                  <MediaText>
                                    <a href="#link" className="title">Alexis Clarke</a>
                                    <span className="text smaller">@alexis_30</span>
                                  </MediaText>
                              </MediaGroup>
                          </td>
                          <td className="tb-col tb-col-end">
                              <span className="small">30.749 ETH</span>
                          </td>
                      </tr>
                  </tbody>
              </Table>
          </Card>
        </Col> */}

        {/* <Col md="6" xxl="4">
          <Card className="h-100">
              <Card.Body>
                  <div className="card-title-group mb-4">
                      <div className="card-title">
                          <h5 className="title">Popularity</h5>
                      </div>
                      <ChartLegend.Group className="gap gx-3 align-items-center">
                          <div className="gap-col">
                            <ChartLegend className="chart-legend-small" symbol="success">
                              Like
                            </ChartLegend>
                          </div>
                          <div className="gap-col">
                            <ChartLegend className="chart-legend-small" symbol="info">
                              Share
                            </ChartLegend>
                          </div>
                      </ChartLegend.Group>
                  </div>
                  <div className="nk-chart-nft-popularity">
                    <ChartBar data={popularityChart}></ChartBar>
                  </div>
              </Card.Body>
          </Card>
        </Col> */}
        {/* <Col md="6" xxl="4">
          <Card className="h-100">
              <Card.Body className="flex-grow-0 py-2">
                  <div className="card-title-group">
                      <div className="card-title">
                          <h5 className="title">Popular Creators</h5>
                      </div>
                      <div className="card-tools d-none d-sm-inline-block">
                          <Link to="/seriui/" className="btn btn-sm btn-soft btn-secondary">
                            <span>See all</span>
                          </Link>
                      </div>
                  </div>
              </Card.Body>
              <Table responsive className="table-middle mb-0">
                  <tbody>
                      <tr>
                          <td className="tb-col">
                              <MediaGroup>
                                  <Media size="md" shape="circle" className="flex-shrink-0">
                                    <Image src="/images/avatar/a.jpg" alt="" />
                                  </Media>
                                  <MediaText>
                                    <a href="#link" className="title">Timothy Smith</a>
                                    <span className="text smaller">68,945 ETH</span>
                                  </MediaText>
                              </MediaGroup>
                          </td>
                          <td className="tb-col tb-col-end">
                            <Dropdown>
                                <Dropdown.Toggle size="sm" as={CustomDropdownToggle} className="btn btn-sm btn-icon btn-zoom me-n1">
                                    <Icon name="more-v"></Icon>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="dropdown-menu-sm" as={CustomDropdownMenu} align="end">
                                    <div className="dropdown-content py-1">
                                        <LinkList className="link-list-hover-bg-primary link-list-md">
                                            <LinkListItem to="/seriui/">
                                                <Icon name="share"></Icon><span>Share</span>
                                            </LinkListItem>
                                            <LinkListItem to="/seriui/">
                                                <Icon name="flag"></Icon><span>Report</span>
                                            </LinkListItem>
                                            <LinkListItem to="/seriui/">
                                                <Icon name="eye"></Icon><span>View Details</span>
                                            </LinkListItem>
                                        </LinkList>
                                    </div>
                                </Dropdown.Menu>
                            </Dropdown>
                          </td>
                      </tr>
                      <tr>
                          <td className="tb-col">
                              <MediaGroup>
                                  <Media size="md" shape="circle" className="flex-shrink-0">
                                    <Image src="/images/avatar/b.jpg" alt="" />
                                  </Media>
                                  <MediaText>
                                    <a href="#link" className="title">Alexis Clarke</a>
                                    <span className="text smaller">58,943 ETH</span>
                                  </MediaText>
                              </MediaGroup>
                          </td>
                          <td className="tb-col tb-col-end">
                              <Dropdown>
                                <Dropdown.Toggle size="sm" as={CustomDropdownToggle} className="btn btn-sm btn-icon btn-zoom me-n1">
                                    <Icon name="more-v"></Icon>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="dropdown-menu-sm" as={CustomDropdownMenu} align="end">
                                    <div className="dropdown-content py-1">
                                        <LinkList className="link-list-hover-bg-primary link-list-md">
                                            <LinkListItem to="/seriui/">
                                                <Icon name="share"></Icon><span>Share</span>
                                            </LinkListItem>
                                            <LinkListItem to="/seriui/">
                                                <Icon name="flag"></Icon><span>Report</span>
                                            </LinkListItem>
                                            <LinkListItem to="/seriui/">
                                                <Icon name="eye"></Icon><span>View Details</span>
                                            </LinkListItem>
                                        </LinkList>
                                    </div>
                                </Dropdown.Menu>
                            </Dropdown>
                          </td>
                      </tr>
                      <tr>
                          <td className="tb-col">
                              <MediaGroup>
                                  <Media size="md" shape="circle" className="flex-shrink-0">
                                    <Image src="/images/avatar/c.jpg" alt="" />
                                  </Media>
                                  <MediaText>
                                    <a href="#link" className="title">Herbert Stokes</a>
                                    <span className="text smaller">45,657 ETH</span>
                                  </MediaText>
                              </MediaGroup>
                          </td>
                          <td className="tb-col tb-col-end">
                              <Dropdown>
                                <Dropdown.Toggle size="sm" as={CustomDropdownToggle} className="btn btn-sm btn-icon btn-zoom me-n1">
                                    <Icon name="more-v"></Icon>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="dropdown-menu-sm" as={CustomDropdownMenu} align="end">
                                    <div className="dropdown-content py-1">
                                        <LinkList className="link-list-hover-bg-primary link-list-md">
                                            <LinkListItem to="/seriui/">
                                                <Icon name="share"></Icon><span>Share</span>
                                            </LinkListItem>
                                            <LinkListItem to="/seriui/">
                                                <Icon name="flag"></Icon><span>Report</span>
                                            </LinkListItem>
                                            <LinkListItem to="/seriui/">
                                                <Icon name="eye"></Icon><span>View Details</span>
                                            </LinkListItem>
                                        </LinkList>
                                    </div>
                                </Dropdown.Menu>
                            </Dropdown>
                          </td>
                      </tr>
                      <tr>
                          <td className="tb-col">
                              <MediaGroup>
                                  <Media size="md" shape="circle" className="flex-shrink-0">
                                    <Image src="/images/avatar/d.jpg" alt="" />
                                  </Media>
                                  <MediaText>
                                    <a href="#link" className="title">Nancy Martino</a>
                                    <span className="text smaller">38,945 ETH</span>
                                  </MediaText>
                              </MediaGroup>
                          </td>
                          <td className="tb-col tb-col-end">
                              <Dropdown>
                                <Dropdown.Toggle size="sm" as={CustomDropdownToggle} className="btn btn-sm btn-icon btn-zoom me-n1">
                                    <Icon name="more-v"></Icon>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="dropdown-menu-sm" as={CustomDropdownMenu} align="end">
                                    <div className="dropdown-content py-1">
                                        <LinkList className="link-list-hover-bg-primary link-list-md">
                                            <LinkListItem to="/seriui/">
                                                <Icon name="share"></Icon><span>Share</span>
                                            </LinkListItem>
                                            <LinkListItem to="/seriui/">
                                                <Icon name="flag"></Icon><span>Report</span>
                                            </LinkListItem>
                                            <LinkListItem to="/seriui/">
                                                <Icon name="eye"></Icon><span>View Details</span>
                                            </LinkListItem>
                                        </LinkList>
                                    </div>
                                </Dropdown.Menu>
                            </Dropdown>
                          </td>
                      </tr>
                      <tr>
                          <td className="tb-col">
                              <MediaGroup>
                                  <Media size="md" shape="circle" className="flex-shrink-0">
                                    <Image src="/images/avatar/e.jpg" alt="" />
                                  </Media>
                                  <MediaText>
                                    <a href="#link" className="title">Michael Morris</a>
                                    <span className="text smaller">18,945 ETH</span>
                                  </MediaText>
                              </MediaGroup>
                          </td>
                          <td className="tb-col tb-col-end">
                              <Dropdown>
                                <Dropdown.Toggle size="sm" as={CustomDropdownToggle} className="btn btn-sm btn-icon btn-zoom me-n1">
                                    <Icon name="more-v"></Icon>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="dropdown-menu-sm" as={CustomDropdownMenu} align="end">
                                    <div className="dropdown-content py-1">
                                        <LinkList className="link-list-hover-bg-primary link-list-md">
                                            <LinkListItem to="/seriui/">
                                                <Icon name="share"></Icon><span>Share</span>
                                            </LinkListItem>
                                            <LinkListItem to="/seriui/">
                                                <Icon name="flag"></Icon><span>Report</span>
                                            </LinkListItem>
                                            <LinkListItem to="/seriui/">
                                                <Icon name="eye"></Icon><span>View Details</span>
                                            </LinkListItem>
                                        </LinkList>
                                    </div>
                                </Dropdown.Menu>
                            </Dropdown>
                          </td>
                      </tr>
                  </tbody>
              </Table>
          </Card>
        </Col> */}
      </Row>
    </Layout>
  );
}

export default HomeNFT;
