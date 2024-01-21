import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card } from "react-bootstrap";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import {
  Icon,
} from "../../components";
import MyTicketsData from "../../store/helpdesk/MyTicketsData";

function ViewMyTicket() {
  const { id } = useParams();
  const [data] = useState(MyTicketsData);
  const [ticket, setTicket] = useState(data[0]);

  // grabs the id form the url and loads the corresponding data
  useEffect(() => {
    let findUser = data.find((item) => item.id === id);
    setTicket(findUser);
  }, [id, data]);

  return (
    <Layout title="View My Ticket" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">View My Ticket</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                {/* <li className="breadcrumb-item">
                  <Link to="/stake-holder-list">Farmer registration List</Link>
                </li> */}
                <li className="breadcrumb-item active" aria-current="page">
                  View My Ticket
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/my-tickets"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/my-tickets"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-4">
        <Card>
          <Card.Body>
            <div className="bio-block">
              <h4 className="bio-block-title">Ticket</h4>
              <ul className="list-group list-group-borderless small">
                <li className="list-group-item">
                  <span className="title fw-medium w-40 d-inline-block">
                    {" "}
                    Ticket:
                  </span>
                  <span className="text">{ticket.name}</span>
                </li>
                <li className="list-group-item">
                  <span className="title fw-medium w-40 d-inline-block">
                    {" "}
                    Ticket Type:{" "}
                  </span>
                  <span className="text">{ticket.type}</span>
                </li>
                <li className="list-group-item">
                  <span className="title fw-medium w-40 d-inline-block">
                    {" "}
                    Created Date:
                  </span>
                  <span className="text">{ticket.createdate}</span>
                </li>
                <li className="list-group-item">
                  <span className="title fw-medium w-40 d-inline-block">
                    Status:
                  </span>
                  <span className="text">{ticket.status}</span>
                </li>
                <li className="list-group-item">
                  <span className="title fw-medium w-40 d-inline-block">
                    Created By:
                  </span>
                  <span className="text">{ticket.createdby}</span>
                </li>
                <li className="list-group-item">
                  <span className="title fw-medium w-40 d-inline-block">
                    Module Name:
                  </span>
                  <span className="text">{ticket.mname}</span>
                </li>
                <li className="list-group-item">
                  <span className="title fw-medium w-40 d-inline-block">
                    Functionality:
                  </span>
                  <span className="text">{ticket.functionality}</span>
                </li>
                <li className="list-group-item">
                  <span className="title fw-medium w-40 d-inline-block">
                    Description Summary:
                  </span>
                  <span className="text">{ticket.summary}</span>
                </li>
                <li className="list-group-item">
                  <span className="title fw-medium w-40 d-inline-block">
                    Severity:
                  </span>
                  <span className="text">{ticket.severity}</span>
                </li>
                <li className="list-group-item">
                  <span className="title fw-medium w-40 d-inline-block">
                    Escalate /Deescalate:
                  </span>
                  <span className="text">{ticket.escalate}</span>
                </li>
                <li className="list-group-item">
                  <span className="title fw-medium w-40 d-inline-block">
                    Ticket Response:
                  </span>
                  <span className="text">{ticket.response}</span>
                </li>
              </ul>
            </div>
          </Card.Body>
        </Card>
      </Block>
    </Layout>
  );
}

export default ViewMyTicket;
