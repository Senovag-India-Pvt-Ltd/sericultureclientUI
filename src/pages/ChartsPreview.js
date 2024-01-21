import { Card, Row, Col } from 'react-bootstrap';

import Layout from '../layout/default';
import Block from '../components/Block/Block';
import CodePreview from '../components/CodePreview/CodePreview';
import { ChartLine, ChartBar, ChartPie, ChartDoughnut, ChartPolar } from '../components/Chart/Charts';
import { Colors } from '../utilities/index';
import hexRGB from '../utilities/hexRGB';

// line chart data
let lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    legend: true,
    datasets: [
        {
            label : "Total Received",
            tension: 0.4,
            borderWidth: 2,
            borderColor: Colors.primary,
            pointBorderColor: Colors.primary,
            pointBackgroundColor: Colors.white,
            pointHoverBackgroundColor: Colors.primary,
            pointBorderWidth: 2,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 2,
            pointRadius: 4,
            pointHitRadius: 4,
            fill: true,
            backgroundColor: "transparent",
            data: [75, 90, 110, 80, 125, 55, 95]
        },
        {
            label : "Total Send",
            tension: 0.4,
            borderWidth: 2,
            borderColor: Colors.yellow,
            pointBorderColor: Colors.yellow,
            pointBackgroundColor: Colors.white,
            pointHoverBackgroundColor: Colors.yellow,
            pointBorderWidth: 2,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 2,
            pointRadius: 4,
            pointHitRadius: 4,
            fill: true,
            backgroundColor: "transparent",
            data: [80, 60, 80, 54, 105, 120, 82]
        }
    ]
};

// bar chart data
let barChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    legend: true,
    barThickness: 16,
    datasets: [
        {
            label: "Bar data",
            borderColor: hexRGB(Colors.primary, 0.6),
            backgroundColor: hexRGB(Colors.primary,.2),
            hoverBackgroundColor: hexRGB(Colors.primary,.6),
            borderWidth: 1,
            data: [60, 49, 72, 90, 100, 60, 70, 90, 50, 80, 90, 60]
        }
    ]
};

let lineChartFilled = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    legend: true,
    datasets: [
        {
            tension: .4,
            label: "Total Received",
            borderWidth: 2,
            borderColor: Colors.primary,
            backgroundColor: hexRGB(Colors.primary, .2),
            pointBorderColor: Colors.primary,
            pointBackgroundColor: Colors.white,
            pointHoverBackgroundColor: Colors.primary,
            pointBorderWidth: 2,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 2,
            pointRadius: 4,
            pointHitRadius: 4,
            fill: true,
            data: [110, 80, 125, 65, 95, 75, 90, 110, 80, 125, 70, 95]
        }
    ]
};

let lineChartStraight = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    legend: true,
    datasets: [
        {
            tension: 0,
            label: "Total Received",
            borderWidth: 2,
            borderColor: Colors.primary,
            backgroundColor: hexRGB(Colors.primary, .2),
            pointBorderColor: Colors.primary,
            pointBackgroundColor: Colors.white,
            pointHoverBackgroundColor: Colors.primary,
            pointBorderWidth: 2,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 2,
            pointRadius: 4,
            pointHitRadius: 4,
            fill: true,
            data: [110, 80, 125, 65, 95, 75, 90, 110, 80, 125, 70, 95]
        }
    ]
};

// bar chart multiple
let barChartMultiple = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    legend: true,
    barThickness: 10,
    datasets: [
      {
        borderColor: Colors.primary,
        backgroundColor: Colors.primary,
        label: "Income",
        data: [110, 80, 125, 55, 95, 75, 90, 110, 80, 125, 55, 95]
      },
      {
        borderColor: Colors.yellow,
        backgroundColor: Colors.yellow,
        label: "Expense",
        data: [75, 90, 110, 80, 125, 55, 95, 75, 90, 110, 80, 125]
      }
    ]
};
// bar chart stacked
let barChartStacked = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    legend: true,
    stacked: true,
    barThickness: 10,
    datasets: [
      {
        borderColor: Colors.primary,
        backgroundColor: Colors.primary,
        label: "Income",
        data: [110, 80, 125, 55, 95, 75, 90, 110, 80, 125, 55, 95]
      },
      {
        borderColor: Colors.yellow,
        backgroundColor: Colors.yellow,
        label: "Expense",
        data: [75, 90, 110, 80, 125, 55, 95, 75, 90, 110, 80, 125]
      }
    ]
};
// pie chart data
let pieChartData = {
    labels: ["Send", "Receive", "Withdraw"],
    datasets: [{
        backgroundColor: [Colors.orange, Colors.blue, Colors.green],
        data: [110, 80, 125]
    }],
};
// doughnut Chart
let doughnutChartData = {
    labels : ["Send", "Receive", "Withdraw"],
    datasets : [{
        backgroundColor: [Colors.orange, Colors.blue, Colors.green],
        data: [110, 80, 125]
    }],
};

// polar chart
let polarChartData = {
    labels : ["Send", "Receive", "Withdraw"],
    datasets : [{
        backgroundColor: [Colors.orange, Colors.blue, Colors.green],
        data: [110, 80, 125]
    }],
};

function ChartPage() {
  return (
    <Layout title="Chart Js" content="container">
        <Block.Head page className="wide-md">
        <Block.HeadContent>
            <Block.Title>Chart Js</Block.Title>
            <Block.Text className="lead">The Charts in this section has used <a href="https://react-chartjs-2.js.org/" target="_blank" rel="noreferrer">react-chartjs-2</a> plugin. for more info. <a href="https://react-chartjs-2.js.org/" target="_blank" rel="noreferrer">see the official site</a>.
            </Block.Text>
            <Block.Text>Remember: You have to install both <a href="https://www.chartjs.org/" target="_blank" rel="noreferrer">chart.js</a> and <code>react-chartjs-2</code> Then, import and use individual components form <code>chart</code>
            </Block.Text>
        </Block.HeadContent>
      </Block.Head>

      <Block>
        <Block.Head className="wide-md">
          <Block.HeadContent>
            <Block.Text>
                <strong className="text-black">Note:</strong> When you copy the code example and if you paste your copied code to any other component. these will not work because you just copied the component's name from code example. to use you have to <code>import</code> these component.
            </Block.Text>
            <Block.Text>How to import component and use see the <a href="#docs">docs</a></Block.Text>
            <Block.Title tag="h3">Line & Bar Chart</Block.Title>
          </Block.HeadContent>
        </Block.Head>
        <Row className="g-gs">
            <Col lg="6">
                <Card>
                    <Card.Body>
                        <div className="nk-chart-overview">
                            <ChartLine data={lineChartData} />
                        </div>
                    </Card.Body>
                    <CodePreview>
                        {`import { ChartLine } from '../components/Chart/Charts';
import { Colors } from '../utilities/index';
// line chart data
const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    legend: true,
    datasets: [
        {
            label : "Total Received",
            tension: 0.4,
            borderWidth: 2,
            borderColor: Colors.primary,
            pointBorderColor: Colors.primary,
            pointBackgroundColor: Colors.white,
            pointHoverBackgroundColor: Colors.primary,
            pointBorderWidth: 2,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 2,
            pointRadius: 4,
            pointHitRadius: 4,
            fill: true,
            data: [75, 90, 110, 80, 125, 55, 95]
        },
        {
            label : "Total Send",
            tension: 0.4,
            borderWidth: 2,
            borderColor: Colors.yellow,
            pointBorderColor: Colors.yellow,
            pointBackgroundColor: Colors.white,
            pointHoverBackgroundColor: Colors.yellow,
            pointBorderWidth: 2,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 2,
            pointRadius: 4,
            pointHitRadius: 4,
            fill: true,
            data: [80, 60, 80, 54, 105, 120, 82]
        }
    ]
};

function LineChartExample() {
    return (
        <ChartLine data={lineChartData} />
    );
}
  
export default LineChartExample;
`}
                    </CodePreview>
                </Card>
            </Col>
            <Col lg="6">
                <Card>
                    <Card.Body>
                        <div className="nk-chart-overview">
                            <ChartBar data={barChartData} />
                        </div>
                    </Card.Body>
                    <CodePreview>
                        {`import { ChartBar } from '../components/Chart/Charts';
import { Colors } from '../utilities/index';
// bar chart data
const barChartData = {
    labels : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    legend: true,
    datasets: [
        {
            label: "Bar data",
            borderColor: Colors.primary,
            backgroundColor: hexRGB(Colors.primary,.2),
            hoverBackgroundColor: hexRGB(Colors.primary,.4),
            borderWidth: 1,
            data: [60, 49, 72, 90, 100, 60, 70, 90, 50, 80, 90, 60]
        }
    ]
}

function ChartBarExample() {
    return (
        <ChartBar data={barChartData} />
    );
}
  
export default ChartBarExample;
`}
                    </CodePreview>
                </Card>
            </Col>
        </Row>
      </Block>

      <Block>
        <Block.Head className="wide-md">
          <Block.HeadContent>
            <Block.Title tag="h3">Filled Line Chart</Block.Title>
          </Block.HeadContent>
        </Block.Head>
        <Row className="g-gs">
            <Col lg="6">
                <Card>
                    <Card.Body>
                        <h6>Rounded Chart</h6>
                        <div className="nk-chart-overview">
                            <ChartLine data={lineChartFilled} />
                        </div>
                    </Card.Body>
                    <CodePreview>
                        {`import { ChartLine } from '../components/Chart/Charts';
import { Colors } from '../utilities/index';
// line chart data
let lineChartFilled = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    legend: true,
    datasets: [
        {
            tension: .4,
            label: "Total Received",
            borderWidth: 2,
            borderColor: Colors.primary,
            backgroundColor: hexRGB(Colors.primary, .2),
            pointBorderColor: Colors.primary,
            pointBackgroundColor: Colors.white,
            pointHoverBackgroundColor: Colors.primary,
            pointBorderWidth: 2,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 2,
            pointRadius: 4,
            pointHitRadius: 4,
            fill: true,
            data: [110, 80, 125, 65, 95, 75, 90, 110, 80, 125, 70, 95]
        }
    ]
};

function LineChartExample() {
    return (
        <ChartLine data={lineChartFilled} />
    );
}
  
export default LineChartExample;
`}
                    </CodePreview>
                </Card>
            </Col>
            <Col lg="6">
                <Card>
                    <Card.Body>
                        <h6>Straight Chart</h6>
                        <div className="nk-chart-overview">
                            <ChartLine data={lineChartStraight} />
                        </div>
                    </Card.Body>
                    <CodePreview>
                        {`import { ChartBar } from '../components/Chart/Charts';
import { Colors } from '../utilities/index';
// line chart data
let lineChartStraight = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    legend: true,
    datasets: [
        {
            tension: 0,
            label: "Total Received",
            borderWidth: 2,
            borderColor: Colors.primary,
            backgroundColor: hexRGB(Colors.primary, .2),
            pointBorderColor: Colors.primary,
            pointBackgroundColor: Colors.white,
            pointHoverBackgroundColor: Colors.primary,
            pointBorderWidth: 2,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 2,
            pointRadius: 4,
            pointHitRadius: 4,
            fill: true,
            data: [110, 80, 125, 65, 95, 75, 90, 110, 80, 125, 70, 95]
        }
    ]
};

function ChartLineExample() {
    return (
        <ChartBar data={barChartData} />
    );
}
  
export default ChartLineExample;
`}
                    </CodePreview>
                </Card>
            </Col>
        </Row>
      </Block>

      <Block>
        <Block.Head className="wide-md">
          <Block.HeadContent>
            <Block.Title tag="h3">Bar Chart - Multiple</Block.Title>
          </Block.HeadContent>
        </Block.Head>
        <Row className="g-gs">
            <Col lg="6">
                <Card>
                    <Card.Body>
                        <h6>Multiple Bar</h6>
                        <div className="nk-chart-overview">
                            <ChartBar data={barChartMultiple} />
                        </div>
                    </Card.Body>
                    <CodePreview>
                        {`import { ChartBar } from '../components/Chart/Charts';
import { Colors } from '../utilities/index';

// bar chart multiple
let barChartMultiple = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    legend: true,
    datasets: [
      {
        borderColor: Colors.primary,
        backgroundColor: Colors.primary,
        label: "Income",
        data: [110, 80, 125, 55, 95, 75, 90, 110, 80, 125, 55, 95]
      },
      {
        borderColor: Colors.yellow,
        backgroundColor: Colors.yellow,
        label: "Expense",
        data: [75, 90, 110, 80, 125, 55, 95, 75, 90, 110, 80, 125]
      }
    ]
};

function ChartBarExample() {
    return (
        <ChartBar data={barChartMultiple} />
    );
}
  
export default ChartBarExample;
`}
                    </CodePreview>
                </Card>
            </Col>
            <Col lg="6">
                <Card>
                    <Card.Body>
                        <h6>Stacked Bar</h6>
                        <div className="nk-chart-overview">
                            <ChartBar data={barChartStacked} />
                        </div>
                    </Card.Body>
                    <CodePreview>
                        {`import { ChartBar } from '../components/Chart/Charts';
import { Colors } from '../utilities/index';

let barChartStacked = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    legend: true,
    stacked: true,
    datasets: [
      {
        borderColor: Colors.primary,
        backgroundColor: Colors.primary,
        label: "Income",
        data: [110, 80, 125, 55, 95, 75, 90, 110, 80, 125, 55, 95]
      },
      {
        borderColor: Colors.yellow,
        backgroundColor: Colors.yellow,
        label: "Expense",
        data: [75, 90, 110, 80, 125, 55, 95, 75, 90, 110, 80, 125]
      }
    ]
};
  
function ChartBarExample() {
    return (
        <ChartBar data={barChartMultiple} />
    );
}
  
export default ChartBarExample;
`}
                    </CodePreview>
                </Card>
            </Col>
        </Row>
      </Block>

      <Block>
        <Block.Head className="wide-md">
          <Block.HeadContent>
            <Block.Title tag="h3">Pie, Donught & Polar Charts</Block.Title>
          </Block.HeadContent>
        </Block.Head>
        <Row className="g-gs">
            <Col md="4">
                <Card>
                    <Card.Body>
                        <h6 className="text-center mb-4">Pie Chart</h6>
                        <div className="nk-chart-overview">
                            <ChartPie data={pieChartData} />
                        </div>
                    </Card.Body>
                    <CodePreview>
                        {`import { ChartPie } from '../components/Chart/Charts';
import { Colors } from '../utilities/index';

// pie chart data
let pieChartData = {
    labels: ["Send", "Receive", "Withdraw"],
    datasets: [{
        backgroundColor: [Colors.orange, Colors.blue, Colors.green],
        data: [110, 80, 125]
    }],
};

function ChartPieExample() {
    return (
        <ChartPie data={pieChartData} />
    );
}
  
export default ChartPieExample;
`}
                    </CodePreview>
                </Card>
            </Col>
            <Col md="4">
                <Card>
                    <Card.Body>
                        <h6 className="text-center mb-4">Doughnut Chart</h6>
                        <div className="nk-chart-overview">
                            <ChartDoughnut data={doughnutChartData} />
                        </div>
                    </Card.Body>
                    <CodePreview>
                        {`import { ChartDoughnut } from '../components/Chart/Charts';
import { Colors } from '../utilities/index';

// doughnut chart data
let doughnutChartData = {
    labels : ["Send", "Receive", "Withdraw"],
    datasets : [{
        backgroundColor: [Colors.orange, Colors.blue, Colors.green],
        data: [110, 80, 125]
    }],
};

function ChartDoughnutExample() {
    return (
        <ChartDoughnut data={doughnutChartData} />
    );
}
  
export default ChartDoughnutExample;
`}
                    </CodePreview>
                </Card>
            </Col>

            <Col md="4">
                <Card>
                    <Card.Body>
                        <h6 className="text-center mb-4">Polar Chart</h6>
                        <div className="nk-chart-overview">
                            <ChartPolar data={polarChartData} />
                        </div>
                    </Card.Body>
                    <CodePreview>
                        {`import { ChartPolar } from '../components/Chart/Charts';
import { Colors } from '../utilities/index';

// polar chart
let polarChartData = {
    labels : ["Send", "Receive", "Withdraw"],
    datasets : [{
        backgroundColor: [Colors.orange, Colors.blue, Colors.green],
        data: [110, 80, 125]
    }],
};

function ChartPolarExample() {
    return (
        <ChartPolar data={polarChartData} />
    );
}
  
export default ChartPolarExample;
`}
                    </CodePreview>
                </Card>
            </Col>
           
        </Row>
      </Block>

    </Layout>
  )
}

export default ChartPage;