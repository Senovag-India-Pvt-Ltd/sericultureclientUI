import { Row, Col, Card, Button, Badge } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";

import Icon from "../Icon/Icon";
import Layout from "../../layout/default";

function CardsLoopList({ ...props }) {
  return (
      <ul className="preview-icon-list">
        <Card>
          <Card.Body>
            <Row className="g-gs">{props.children}</Row>
          </Card.Body>
        </Card>
      </ul>
  );
}

function CardsLoop({
  id,
  reqby,
  description,
  mbno,
  address,
  reqon,
  servicetype,
  status,
  ...props
}) {
  //   const navigate = useNavigate();

  const click = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to close this request!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, close it!",
    }).then((result) => {
      if (result.value) {
        Swal.fire("Closed", "You successfully closed this request", "success");
      } else {
        Swal.fire("Cancelled", "Your request is still intact", "info");
      }
    });
  };

  return (
    <li className="preview-icon-item">
      <Col xxl="12">
        <Card border="primary">
          <Card.Header>{id}</Card.Header>
          <Card.Body>
            <Card.Title>{reqby}</Card.Title>
            <Card.Text>{description}</Card.Text>
            <Card.Text>{mbno}</Card.Text>
            <Card.Text>{address}</Card.Text>
            <Badge bg="dark">{status}</Badge>
            <div className="d-flex justify-content-around align-items-center mt-2">
              <Button size="sm" variant="primary" onClick={click}>
                Close
              </Button>
              <Button href="#" size="sm" variant="danger">
                Cancel
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </li>
  );
}

CardsLoop.List = CardsLoopList;

export default CardsLoop;

// return (
//   <li className="preview-icon-item">
//     <Row className="g-gs">
//       <Col xxl="10">
//         <Card className="h-100">
//           <Card.Body>
//             <div className="d-flex justify-content-between align-items-center">
//               <div>
//                 <div className="card-title">
//                   <h4 className="title mb-1">{reqby}</h4>
//                   {/* <p className="small">Best seller of the month</p> */}
//                 </div>
//                 <div className="my-3">
//                   <div className="amount h2 fw-bold text-primary">
//                     {description}
//                   </div>
//                   {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
//                 </div>
//                 <div className="d-flex justify-content-around align-items-center">
//                   <Button size="sm" variant="primary" onClick={click}>
//                     Close
//                   </Button>
//                   <Button href="#" size="sm" variant="danger">
//                     Cancel
//                   </Button>
//                 </div>
//               </div>
//               {/* <div className="d-none d-sm-block d-xl-none d-xxl-block me-md-5 me-xxl-0">
//                         <Image src="/images/award/a.png" alt=""/>
//                     </div> */}
//             </div>
//           </Card.Body>
//         </Card>
//       </Col>
//     </Row>
//   </li>
// );
