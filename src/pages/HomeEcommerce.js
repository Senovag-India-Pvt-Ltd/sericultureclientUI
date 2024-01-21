// import { Row, Col, Card, Button, Dropdown, Table, Badge } from 'react-bootstrap';
import { Row, Col, Card, Button } from 'react-bootstrap';


import Layout from '../layout/default';
// import {
//   Image, 
//   Icon, 
//   Media, 
//   MediaGroup, 
//   MediaText, 
//   Pureknob, 
//   CustomDropdownMenu, 
//   CustomDropdownToggle, 
//   OverlineTitle, 
//   ChartLegend 
// } from '../components';

import {
    Image
  } from '../components';

// import { ChartBar, ChartLine } from "../components/Chart/Charts"
// import { Colors } from '../utilities/index';
// import hexRGB from '../utilities/hexRGB';
import crmUsers, { crmUserColumns } from '../store/dashboard/DashboardData';
import Block from '../components/Block/Block';
import DataTable from '../components/DataTable/DataTable';

// visitor chart data
// let visitorsChartData = {
//   labels : ["M", "T", "W", "T", "F", "S", "S"],
//   yAxis: false,
//   xGridColor: Colors.white,
//   xGridBorderColor: Colors.white,
//   datasets: [
//       {
//           label: "Visitors",
//           borderColor: 'transparent',
//           backgroundColor: hexRGB(Colors.info,.3),
//           hoverBackgroundColor: Colors.info,
//           borderWidth: 1,
//           borderRadius: 10,
//           borderSkipped: false,
//           data: [600, 680, 470, 770, 570, 810, 670]
//       }
//   ]
// };

// // activity Chart
// let activityChart = {
//   labels : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
//   xAxis: false,
//   yAxis: false,
//   datasets: [
//       {
//         tension: .4,
//         label: "Activity",
//         borderColor: Colors.success,
//         pointBackgroundColor: Colors.success,
//         backgroundColor: hexRGB(Colors.success, 0.2),
//         borderWidth: 2,
//         pointBorderColor: 'transparent',
//         pointHoverBackgroundColor: Colors.success,
//         fill: true,
//         data: [120, 160, 95, 105, 98, 99, 167, 140, 155, 267, 237, 250]
//       }
//   ]
// };

// // total Profit Chart
// let totalProfitChart = {
//   labels : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
//   stacked: true,
//   ticksValue: 'k',
//   borderDash: [8, 4],
//   xGridColor: Colors.white,
//   xGridBorderColor: Colors.white,
//   yGridBorderColor: Colors.white,
//   maxTicksLimit: 20,
//   datasets: [
//     {
//       borderRadius: {topLeft: 50, topRight: 50, bottomLeft: 50, bottomRight: 50},
//       backgroundColor: Colors.primary,
//       label: "Total Income",
//       borderSkipped: false,
//       data: [120, 160, 95, 105, 98, 99, 167, 140, 155, 267, 237, 250]
      
//     },
//     {
//       borderRadius: {topLeft: 50, topRight: 50, bottomLeft: 50, bottomRight: 50},
//       backgroundColor: Colors.success,
//       label: "Total Profit",
//       borderSkipped: false,
//       data: [110, 80, 125, 55, 95, 75, 90, 110, 80, 125, 55, 95]
//     },
//     {
//       borderRadius: {topLeft: 50, topRight: 50, bottomLeft: 50, bottomRight: 50},
//       backgroundColor: Colors.gray300,
//       label: "Total Expense",
//       borderSkipped: false,
//       data: [75, 90, 110, 80, 125, 55, 95, 75, 90, 110, 80, 125]
//     }
//   ]
// };

// // total sales knob chart
// let totalSales = {
//   size: 120,
//   value: 65,
//   angleOffset: -0.5,
//   angleStart: 0.5,
//   angleEnd: 0.5,
//   colorFg: Colors.info
// };

// // total revenue Chart
// let totalRevenueChart = {
//   labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
//   yAxis:  false,
//   xAxis:  false,
//   datasets : [
//       {
//         tension: .4,
//         label: "Total",
//         borderColor: Colors.primary,
//         backgroundColor: 'transparent',
//         borderWidth: 4,
//         pointBorderColor: 'transparent',
//         pointBackgroundColor: 'transparent',
//         pointHoverBackgroundColor: Colors.primary,
//         borderCapStyle: 'round',
//         data: [12, 40, 13, 130, 70, 210]
//       }
//   ]
// };

// // sales analytics Chart
// let salesAnalyticsChart = {
//   labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
//   borderDash: [8, 4],
//   maxTicksLimit: 10,
//   ticksValue: 'k',
//   xAxis: false,
//   xGridBorderColor: Colors.white,
//   yGridBorderColor: Colors.white,
//   datasets: [
//     {
//       tension: .4,
//       borderWidth: 3,
//       borderColor: Colors.yellow,
//       backgroundColor: hexRGB(Colors.yellow, 0.2),
//       pointBorderColor: 'transparent',
//       pointBackgroundColor: 'transparent',
//       pointHoverBackgroundColor: Colors.yellow,
//       label: "Total Sales",
//       fill: true,
//       data: [40, 60, 30, 65, 60, 95, 90, 100, 96, 120, 105, 134]
//     },
//     {
//       tension: .4,
//       borderWidth: 2,
//       pointBorderColor: 'transparent',
//       pointBackgroundColor: 'transparent',
//       borderColor: Colors.danger,
//       pointHoverBackgroundColor: Colors.danger,
//       label: "Total Orders",
//       borderDash: [8,4],
//       data: [70, 44, 49, 78, 39, 49, 39, 38, 59, 80, 56, 101]
//     },
//   ]
// };

function HomeEcommerce() {
  return (
    <Layout title="eCommerce">
      <Row className="g-gs">

      <Col xxl="3">
          <Card className="h-100">
              <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                      <div>
                          <div className="card-title">
                              <h4 className="title mb-1">Congrats Akshay!</h4>
                              {/* <p className="small">Employee of the month</p> */}
                          </div>
                          <div className="my-3">
                              <div className="amount h2 fw-bold text-primary">&#8377;42.5k</div>
                              {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                          </div>
                          <Button href="#" size="sm" variant="primary">View Sales</Button>
                      </div>
                      <div className="d-none d-sm-block d-xl-none d-xxl-block me-md-5 me-xxl-0">
                          <Image src="/images/award/a.png" alt=""/>
                      </div>
                  </div>
              </Card.Body>
          </Card>
        </Col>

        <Col xxl="3">
          <Card className="h-100">
              <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                      <div>
                          <div className="card-title">
                              <h4 className="title mb-1">Total Sale</h4>
                              <p className="small">Best seller of the month</p>
                          </div>
                          <div className="my-3">
                              <div className="amount h2 fw-bold text-primary">&#8377;35,89,46,466</div>
                              {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                          </div>
                          <Button href="#" size="sm" variant="primary">View Sales</Button>
                      </div>
                      {/* <div className="d-none d-sm-block d-xl-none d-xxl-block me-md-5 me-xxl-0">
                          <Image src="/images/award/a.png" alt=""/>
                      </div> */}
                  </div>
              </Card.Body>
          </Card>
        </Col>

        <Col xxl="3">
          <Card className="h-100">
              <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                      <div>
                          <div className="card-title">
                              <h4 className="title mb-1">Today New Call</h4>
                              {/* <p className="small">Best seller of the month</p> */}
                          </div>
                          <div className="my-3">
                              <div className="amount h2 fw-bold text-primary">23</div>
                              {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                          </div>
                          <Button href="#" size="sm" variant="primary">Show</Button>
                      </div>
                      {/* <div className="d-none d-sm-block d-xl-none d-xxl-block me-md-5 me-xxl-0">
                          <Image src="/images/award/a.png" alt=""/>
                      </div> */}
                  </div>
              </Card.Body>
          </Card>
        </Col>

        <Col xxl="3">
          <Card className="h-100">
              <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                      <div>
                          <div className="card-title">
                              <h4 className="title mb-1">Today Follow Up</h4>
                              {/* <p className="small">Best seller of the month</p> */}
                          </div>
                          <div className="my-3">
                              <div className="amount h2 fw-bold text-primary ">10</div>
                              {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                          </div>
                          <Button href="#" size="sm" variant="primary">Show</Button>
                      </div>
                      {/* <div className="d-none d-sm-block d-xl-none d-xxl-block me-md-5 me-xxl-0">
                          <Image src="/images/award/a.png" alt=""/>
                      </div> */}
                  </div>
              </Card.Body>
          </Card>
        </Col>

        <Col xxl="3">
          <Card className="h-100">
              <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                      <div>
                          <div className="card-title">
                              <h4 className="title mb-1">Lapsed Follow Up</h4>
                              {/* <p className="small">Best seller of the month</p> */}
                          </div>
                          <div className="my-3">
                              <div className="amount h2 fw-bold text-primary ">111</div>
                              {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                          </div>
                          <Button href="#" size="sm" variant="primary">Show</Button>
                      </div>
                      {/* <div className="d-none d-sm-block d-xl-none d-xxl-block me-md-5 me-xxl-0">
                          <Image src="/images/award/a.png" alt=""/>
                      </div> */}
                  </div>
              </Card.Body>
          </Card>
        </Col>

        <Col xxl="3">
          <Card className="h-100">
              <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                      <div>
                          <div className="card-title">
                              <h4 className="title mb-1">Today Demo</h4>
                              {/* <p className="small">Best seller of the month</p> */}
                          </div>
                          <div className="my-3">
                              <div className="amount h2 fw-bold text-primary">100</div>
                              {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                          </div>
                          <Button href="#" size="sm" variant="primary">Show</Button>
                      </div>
                      {/* <div className="d-none d-sm-block d-xl-none d-xxl-block me-md-5 me-xxl-0">
                          <Image src="/images/award/a.png" alt=""/>
                      </div> */}
                  </div>
              </Card.Body>
          </Card>
        </Col>

        <Col xxl="3">
          <Card className="h-100">
              <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                      <div>
                          <div className="card-title">
                              <h4 className="title mb-1">Today Meetings</h4>
                              {/* <p className="small">Best seller of the month</p> */}
                          </div>
                          <div className="my-3">
                              <div className="amount h2 fw-bold text-primary ">27</div>
                              {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                          </div>
                          <Button href="#" size="sm" variant="primary">Show</Button>
                      </div>
                      {/* <div className="d-none d-sm-block d-xl-none d-xxl-block me-md-5 me-xxl-0">
                          <Image src="/images/award/a.png" alt=""/>
                      </div> */}
                  </div>
              </Card.Body>
          </Card>
        </Col>

        <Col xxl="3">
          <Card className="h-100">
              <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                      <div>
                          <div className="card-title">
                              <h4 className="title mb-1">Lapsed Meetings</h4>
                              {/* <p className="small">Best seller of the month</p> */}
                          </div>
                          <div className="my-3">
                              <div className="amount h2 fw-bold text-primary ">5</div>
                              {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                          </div>
                          <Button href="#" size="sm" variant="primary">Show</Button>
                      </div>
                      {/* <div className="d-none d-sm-block d-xl-none d-xxl-block me-md-5 me-xxl-0">
                          <Image src="/images/award/a.png" alt=""/>
                      </div> */}
                  </div>
              </Card.Body>
          </Card>
        </Col>

        <Col xxl="3">
          <Card className="h-100">
              <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                      <div>
                          <div className="card-title">
                              <h4 className="title mb-1">Today Quotation Follow Up</h4>
                              {/* <p className="small">Best seller of the month</p> */}
                          </div>
                          <div className="my-3">
                              <div className="amount h2 fw-bold text-primary ">28</div>
                              {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                          </div>
                          <Button href="#" size="sm" variant="primary">Show</Button>
                      </div>
                      {/* <div className="d-none d-sm-block d-xl-none d-xxl-block me-md-5 me-xxl-0">
                          <Image src="/images/award/a.png" alt=""/>
                      </div> */}
                  </div>
              </Card.Body>
          </Card>
        </Col>

        <Col xxl="3">
          <Card className="h-100">
              <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                      <div>
                          <div className="card-title">
                              <h4 className="title mb-1">Lapsed Quotation Follow Up</h4>
                              {/* <p className="small">Best seller of the month</p> */}
                          </div>
                          <div className="my-3">
                              <div className="amount h2 fw-bold text-primary ">35</div>
                              {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                          </div>
                          <Button href="#" size="sm" variant="primary">Show</Button>
                      </div>
                      {/* <div className="d-none d-sm-block d-xl-none d-xxl-block me-md-5 me-xxl-0">
                          <Image src="/images/award/a.png" alt=""/>
                      </div> */}
                  </div>
              </Card.Body>
          </Card>
        </Col>

        <Col xxl="3">
          <Card className="h-100">
              <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                      <div>
                          <div className="card-title">
                              <h4 className="title mb-1">Pending Transfer Lead Acceptance</h4>
                              {/* <p className="small">Best seller of the month</p> */}
                          </div>
                          <div className="my-3">
                              <div className="amount h2 fw-bold text-primary ">84</div>
                              {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                          </div>
                          <Button href="#" size="sm" variant="primary">Show</Button>
                      </div>
                      {/* <div className="d-none d-sm-block d-xl-none d-xxl-block me-md-5 me-xxl-0">
                          <Image src="/images/award/a.png" alt=""/>
                      </div> */}
                  </div>
              </Card.Body>
          </Card>
        </Col>

        <Col xxl="3">
          <Card className="h-100">
              <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                      <div>
                          <div className="card-title">
                              <h4 className="title mb-1">Unassign Call</h4>
                              {/* <p className="small">Best seller of the month</p> */}
                          </div>
                          <div className="my-3">
                              <div className="amount h2 fw-bold text-primary">97</div>
                              {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                          </div>
                          <Button href="#" size="sm" variant="primary">Show</Button>
                      </div>
                      {/* <div className="d-none d-sm-block d-xl-none d-xxl-block me-md-5 me-xxl-0">
                          <Image src="/images/award/a.png" alt=""/>
                      </div> */}
                  </div>
              </Card.Body>
          </Card>
        </Col>

        <Col xxl="3">
          <Card className="h-100">
              <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                      <div>
                          <div className="card-title">
                              <h4 className="title mb-1">Today Unassign Call</h4>
                              {/* <p className="small">Best seller of the month</p> */}
                          </div>
                          <div className="my-3">
                              <div className="amount h2 fw-bold text-primary ">48</div>
                              {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                          </div>
                          <Button href="#" size="sm" variant="primary">Show</Button>
                      </div>
                      {/* <div className="d-none d-sm-block d-xl-none d-xxl-block me-md-5 me-xxl-0">
                          <Image src="/images/award/a.png" alt=""/>
                      </div> */}
                  </div>
              </Card.Body>
          </Card>
        </Col>

        <Block>
        <Card>
          <DataTable tableClassName="data-table-head-light table-responsive data-table-checkbox" data={crmUsers} columns={crmUserColumns} selectableRows ></DataTable>
        </Card>
      </Block>

        {/* <Col xxl="4">
          <Card className="h-100">
              <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                      <div>
                          <div className="card-title">
                              <h4 className="title mb-1">Congratulations Smith!</h4>
                              <p className="small">Best seller of the month</p>
                          </div>
                          <div className="my-3">
                              <div className="amount h2 fw-bold text-primary">$42.5k</div>
                              <div className="smaller">You have done 69.5% more sales today.</div>
                          </div>
                          <Button href="#" size="sm" variant="primary">View Sales</Button>
                      </div>
                      <div className="d-none d-sm-block d-xl-none d-xxl-block me-md-5 me-xxl-0">
                          <Image src="/images/award/a.png" alt=""/>
                      </div>
                  </div>
              </Card.Body>
          </Card>
        </Col>
        <Col sm="6" xxl="4">
          <Card className="h-100">
              <Card.Body>
                  <div className="card-title">
                      <h4 className="title">New Visitors</h4>
                  </div>
                  <div className="d-flex justify-content-between align-items-end gap g-2">
                      <div className="flex-grow-1">
                          <div className="smaller">
                              <strong className="text-base">48%</strong> new visitors
                              <span className="d-block">this week.</span>
                          </div>
                          <div className="d-flex align-items-center mt-1">
                              <div className="amount h2 mb-0 fw-bold">16,328</div>
                              <div className="change up smaller ms-1">
                                  <Icon name="trend-up"></Icon> 48
                              </div>
                          </div>
                      </div>
                      <div className="nk-chart-ecommerce-visitor">
                        <ChartBar data={visitorsChartData} />
                      </div>
                  </div>
              </Card.Body>
          </Card>
        </Col>
        <Col sm="6" xxl="4">
          <Card className="h-100">
              <Card.Body>
                  <div className="card-title">
                    <h4 className="title">Activity</h4>
                  </div>
                  <div className="d-flex justify-content-between align-items-end gap g-2">
                      <div className="flex-grow-1">
                          <div className="smaller">
                              <strong className="text-base">70%</strong> new activity
                              <span className="d-block">this week.</span>
                          </div>
                          <div className="d-flex align-items-center mt-1">
                              <div className="amount h2 mb-0 fw-bold">89,720</div>
                              <div className="change up smaller ms-1">
                                  <Icon name="trend-up"></Icon> 38
                              </div>
                          </div>
                      </div>
                      <div className="nk-chart-ecommerce-activity">
                          <ChartLine data={activityChart} />
                      </div>
                  </div>
              </Card.Body>
          </Card>
        </Col>
        <Col xxl="8">
          <Card className="h-100">
              <Row className="g-0 col-sep col-sep-md">
                  <Col md="8">
                      <Card.Body>
                          <div className="card-title-group mb-4">
                              <div className="card-title">
                                  <h4 className="title">Total Profit</h4>
                              </div>
                          </div>
                          <div className="nk-chart-ecommerce-total-profit">
                              <ChartBar data={totalProfitChart} />
                          </div>
                      </Card.Body>
                  </Col>
                  <Col md="4">
                      <Card.Body>
                          <div className="total-profit-data">
                              <div className="amount-wrap pb-4">
                                  <div className="amount h2 mb-0 fw-bold">$842.50k</div>
                                  <span className="smaller">Last month balance $428.20k</span>
                              </div>
                              <ul className="nk-data-list-group d-flex flex-column flex-sm-row flex-md-column gap g-4">
                                  <li className="nk-data-list-item">
                                      <Media shape="circle" variant="primary-soft">
                                        <Icon name="coins"></Icon>
                                      </Media>
                                      <div className="amount-wrap">
                                          <div className="amount h3 mb-0">$68,740</div>
                                          <span className="smaller">Total Income</span>
                                      </div>
                                  </li>
                                  <li className="nk-data-list-item">
                                      <Media shape="circle" variant="success-soft">
                                        <Icon name="trend-up"></Icon>
                                      </Media>
                                      <div className="amount-wrap">
                                          <div className="amount h3 mb-0">$38,643</div>
                                          <span className="smaller">Total Profit</span>
                                      </div>
                                  </li>
                                  <li className="nk-data-list-item">
                                      <Media shape="circle" variant="secondary-soft">
                                        <Icon name="coin-alt"></Icon>
                                      </Media>
                                      <div className="amount-wrap">
                                          <div className="amount h3 mb-0">$12,836</div>
                                          <span className="smaller">Total Expense</span>
                                      </div>
                                  </li>
                              </ul>
                              <div className="pt-5">
                                  <Button href="#" variant="primary">View Report</Button>
                              </div>
                          </div>
                      </Card.Body>
                  </Col>
              </Row>
          </Card>
        </Col>
        <Col xxl="4">
          <Row className="g-gs">
              <Col sm="6" xl="3" xxl="6">
                  <Card className="h-100">
                      <Card.Body>
                          <Media shape="circle" variant="warning" className="mb-3">
                            <Icon name="trend-up"></Icon>
                          </Media>
                          <h5>Transactions</h5>
                          <div className="d-flex align-items-center mb-3">
                              <div className="amount h4 mb-0">$14.3k</div>
                              <div className="change up smaller ms-1">
                                  <Icon name="plus"></Icon> 12%
                              </div>
                          </div>
                          <p className="small">Daily Transactions</p>
                      </Card.Body>
                  </Card>
              </Col>
              <Col sm="6" xl="3" xxl="6">
                  <Card className="h-100">
                      <Card.Body>
                          <Media shape="circle" variant="success" className="mb-3">
                            <Icon name="sign-mxn"></Icon>
                          </Media>
                          <h5>Revenue</h5>
                          <div className="d-flex align-items-center mb-3">
                              <div className="amount h4 mb-0">$37.2k</div>
                              <div className="change up smaller ms-1">
                                  <Icon name="plus"></Icon> 18%
                              </div>
                          </div>
                          <p className="small">Revenue Increase</p>
                      </Card.Body>
                  </Card>
              </Col>
              <Col sm="6" xl="3" xxl="6">
                  <Card className="h-100">
                      <Card.Body className="text-center">
                          <div className="amount h4 mb-3">185k</div>
                          <Pureknob data={totalSales} className="nk-chart-ecommerce-knob"/>
                          <p className="small mt-3">Total Sales</p>
                      </Card.Body>
                  </Card>
              </Col>
              <Col sm="6" xl="3" xxl="6">
                  <Card className="h-100">
                      <Card.Body className="text-center">
                          <div className="amount h4 mb-0">$64.35k</div>
                          <div className="nk-chart-ecommerce-total-revenue">
                              <ChartLine data={totalRevenueChart}/>
                          </div>
                          <p className="small mt-3">Total Revenue</p>
                      </Card.Body>
                  </Card>
              </Col>
          </Row>
        </Col>
        <Col xxl="6">
          <Card className="h-100">
              <Card.Body className="flex-grow-0 py-2">
                <div className="card-title-group">
                    <div className="card-title">
                        <h4 className="title">Top Selling Products</h4>
                    </div>
                    <div className="card-tools">
                      <Dropdown>
                          <Dropdown.Toggle size="sm" as={CustomDropdownToggle} className="btn btn-sm btn-icon btn-zoom me-n1">
                            <Icon name="more-v"></Icon>
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="dropdown-menu-sm" as={CustomDropdownMenu} align="end">
                            <Dropdown.Header className="py-2">
                              <h6 className="mb-0">Options</h6>
                            </Dropdown.Header>
                            <Dropdown.Divider className="mt-0" />
                            <Dropdown.Item>Low to high</Dropdown.Item>
                            <Dropdown.Item>High to low</Dropdown.Item>
                          </Dropdown.Menu>
                      </Dropdown>
                    </div>
                </div>
              </Card.Body>
              <Table responsive className="table-middle mb-0">
                  <thead className="table-light table-head-sm">
                      <tr>
                          <th className="tb-col">
                            <OverlineTitle tag="span">products</OverlineTitle>
                          </th>
                          <th className="tb-col tb-col-end tb-col-sm">
                            <OverlineTitle tag="span">price</OverlineTitle>
                          </th>
                          <th className="tb-col tb-col-end tb-col-sm">
                            <OverlineTitle tag="span">orders</OverlineTitle>
                          </th>
                          <th className="tb-col tb-col-end tb-col-sm">
                            <OverlineTitle tag="span">stock</OverlineTitle>
                          </th>
                          <th className="tb-col tb-col-end">
                            <OverlineTitle tag="span">amount</OverlineTitle>
                          </th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                          <td className="tb-col">
                            <MediaGroup>
                                <Media size="md" shape="circle" className="flex-shrink-0">
                                  <Image src="/images/product/a.jpg" alt="product"/>
                                </Media>
                                <MediaText>
                                  <span className="title">Nike v22 Running</span>
                                  <span className="text smaller">28 Jul 2022</span>
                                </MediaText>
                            </MediaGroup>
                          </td>
                          <td className="tb-col tb-col-end tb-col-sm">
                              <span className="small">$130.20</span>
                          </td>
                          <td className="tb-col tb-col-end tb-col-sm">
                              <span className="small">38</span>
                          </td>
                          <td className="tb-col tb-col-end tb-col-sm">
                              <span className="small">436</span>
                          </td>
                          <td className="tb-col tb-col-end">
                              <span className="small">$14,945</span>
                          </td>
                      </tr>
                      <tr>
                          <td className="tb-col">
                            <MediaGroup>
                                <Media size="md" shape="circle" className="flex-shrink-0">
                                  <Image src="/images/product/b.jpg" alt="product"/>
                                </Media>
                                <MediaText>
                                  <span className="title">Business Kit (Mug)</span>
                                  <span className="text smaller">16 Oct 2022</span>
                                </MediaText>
                            </MediaGroup>
                          </td>
                          <td className="tb-col tb-col-end tb-col-sm">
                              <span className="small">$18.35</span>
                          </td>
                          <td className="tb-col tb-col-end tb-col-sm">
                              <span className="small">12</span>
                          </td>
                          <td className="tb-col tb-col-end tb-col-sm">
                              <Badge className="text-bg-danger-soft">Out of Stock</Badge>
                          </td>
                          <td className="tb-col tb-col-end">
                              <span className="small">$7,458</span>
                          </td>
                      </tr>
                      <tr>
                          <td className="tb-col">
                            <MediaGroup>
                                <Media size="md" shape="circle" className="flex-shrink-0">
                                  <Image src="/images/product/c.jpg" alt="product"/>
                                </Media>
                                <MediaText>
                                  <span className="title">Borosil Paper Cup</span>
                                  <span className="text smaller">21 Feb 2022</span>
                                </MediaText>
                            </MediaGroup>
                          </td>
                          <td className="tb-col tb-col-end tb-col-sm">
                              <span className="small">$328.00</span>
                          </td>
                          <td className="tb-col tb-col-end tb-col-sm">
                              <span className="small">120</span>
                          </td>
                          <td className="tb-col tb-col-end tb-col-sm">
                              <span className="small">867</span>
                          </td>
                          <td className="tb-col tb-col-end">
                              <span className="small">$7,806</span>
                          </td>
                      </tr>
                      <tr>
                          <td className="tb-col">
                            <MediaGroup>
                                <Media size="md" shape="circle" className="flex-shrink-0">
                                  <Image src="/images/product/d.jpg" alt="product"/>
                                </Media>
                                <MediaText>
                                  <span className="title">Mountain Trip Kit</span>
                                  <span className="text smaller">14 Jun 2022</span>
                                </MediaText>
                            </MediaGroup>
                          </td>
                          <td className="tb-col tb-col-end tb-col-sm">
                              <span className="small">$130.20</span>
                          </td>
                          <td className="tb-col tb-col-end tb-col-sm">
                              <span className="small">184</span>
                          </td>
                          <td className="tb-col tb-col-end tb-col-sm">
                              <span className="small">226</span>
                          </td>
                          <td className="tb-col tb-col-end">
                              <span className="small">$17,945</span>
                          </td>
                      </tr>
                      <tr>
                          <td className="tb-col">
                            <MediaGroup>
                                <Media size="md" shape="circle" className="flex-shrink-0">
                                  <Image src="/images/product/e.jpg" alt="product"/>
                                </Media>
                                <MediaText>
                                  <span className="title">One Seater Sofa</span>
                                  <span className="text smaller">28 Jul 2022</span>
                                </MediaText>
                            </MediaGroup>
                          </td>
                          <td className="tb-col tb-col-end tb-col-sm">
                              <span className="small">$130.20</span>
                          </td>
                          <td className="tb-col tb-col-end tb-col-sm">
                              <span className="small">50</span>
                          </td>
                          <td className="tb-col tb-col-end tb-col-sm">
                              <Badge className="text-bg-warning-soft">Low Stock</Badge>
                          </td>
                          <td className="tb-col tb-col-end">
                              <span className="small">$14,945</span>
                          </td>
                      </tr>
                  </tbody>
              </Table>
          </Card>
        </Col>
        <Col xxl="6">
          <Card className="h-100">
              <Card.Body>
                  <div className="card-title-group">
                      <div className="card-title">
                          <h4 className="title">Sales Analytics</h4>
                      </div>
                      <div className="card-tools">
                        <Dropdown>
                            <Dropdown.Toggle size="sm" as={CustomDropdownToggle} className="btn btn-sm btn-icon btn-zoom me-n1">
                              <Icon name="more-v"></Icon>
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="dropdown-menu-sm" as={CustomDropdownMenu} align="end">
                              <Dropdown.Header className="py-2">
                                <h6 className="mb-0">Options</h6>
                              </Dropdown.Header>
                              <Dropdown.Divider className="mt-0" />
                              <Dropdown.Item>7 Days</Dropdown.Item>
                              <Dropdown.Item>15 Days</Dropdown.Item>
                              <Dropdown.Item>30 Days</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                      </div>
                  </div>
                  <div className="nk-chart-ecommerce-sales-analytics mt-3">
                    <ChartLine data={salesAnalyticsChart} />
                  </div>
                  <ChartLegend.Group className="justify-content-center gap gx-4 pt-3">
                    <div className="gap-col">
                      <ChartLegend symbol="warning">
                        Totals Sales
                      </ChartLegend>
                    </div>
                    <div className="gap-col">
                      <ChartLegend symbol="danger">
                        Total Orders
                      </ChartLegend>
                    </div>
                  </ChartLegend.Group>
              </Card.Body>
          </Card>
        </Col> */}

      </Row>
    </Layout>
  )
}

export default HomeEcommerce;
