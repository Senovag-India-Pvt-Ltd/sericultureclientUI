import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import BankDetailsData from "../../../store/masters/accounts/BankDetailsData";

function BankDetailsViewPage() {
  const { id } = useParams();
  const [data] = useState(BankDetailsData);
  const [bankDetails, setBankDetails] = useState(data[0]);

  // grabs the id form the url and loads the corresponding data
  useEffect(() => {
    let findUser = data.find((item) => item.id === id);
    setBankDetails(findUser);
  }, [id, data]);

  return (
    <Layout title="Bank Details View" content="container">
      <Block className="mt-4">
        <Card>
          <Card.Body>
            <div className="bio-block">
              <h4 className="bio-block-title">Bank Details</h4>
              <ul className="list-group list-group-borderless small">
                <li className="list-group-item">
                  <span className="title fw-medium w-40 d-inline-block">
                    Bank Name:
                  </span>
                  <span className="text">{bankDetails.name}</span>
                </li>
                <li className="list-group-item">
                  <span className="title fw-medium w-40 d-inline-block">
                    Account Name:
                  </span>
                  <span className="text">{bankDetails.accName}</span>
                </li>
                <li className="list-group-item">
                  <span className="title fw-medium w-40 d-inline-block">
                    Account Number:
                  </span>
                  <span className="text">{bankDetails.accNumber}</span>
                </li>
                <li className="list-group-item">
                  <span className="title fw-medium w-40 d-inline-block">
                    Bank Address
                  </span>
                  <span className="text">{bankDetails.address}</span>
                </li>
                <li className="list-group-item">
                  <span className="title fw-medium w-40 d-inline-block">
                    Branch
                  </span>
                  <span className="text">{bankDetails.branch}</span>
                </li>
                <li className="list-group-item">
                  <span className="title fw-medium w-40 d-inline-block">
                    IFSC
                  </span>
                  <span className="text">{bankDetails.ifsc}</span>
                </li>
                <li className="list-group-item">
                  <span className="title fw-medium w-40 d-inline-block">
                    State
                  </span>
                  <span className="text">{bankDetails.state}</span>
                </li>
                <li className="list-group-item">
                  <span className="title fw-medium w-40 d-inline-block">
                    Country
                  </span>
                  <span className="text">{bankDetails.country}</span>
                </li>
              </ul>
            </div>
          </Card.Body>
        </Card>
      </Block>
    </Layout>
  );
}

export default BankDetailsViewPage;
