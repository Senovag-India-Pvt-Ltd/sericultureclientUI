import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import BillingAddressData from "../../../store/masters/address/BillingAddressData";

function BillingAddressViewPage() {
  const { id } = useParams();
  const [data] = useState(BillingAddressData);
  const [billingAddress, setBillingAddress] = useState(data[0]);

  // grabs the id form the url and loads the corresponding data
  useEffect(() => {
    let findUser = data.find((item) => item.id === id);
    setBillingAddress(findUser);
  }, [id, data]);

  return (
    <Layout title="Billing Address View" content="container">
      <Block className="mt-4">
        <Card>
          <Card.Body>
            <div className="bio-block">
              <h4 className="bio-block-title">Bank Details</h4>
              <ul className="list-group list-group-borderless small">
                <li className="list-group-item">
                  <span className="title fw-medium w-40 d-inline-block">
                    Address1:
                  </span>
                  <span className="text">{billingAddress.address1}</span>
                </li>
                <li className="list-group-item">
                  <span className="title fw-medium w-40 d-inline-block">
                    Address2:
                  </span>
                  <span className="text">{billingAddress.address2}</span>
                </li>
                <li className="list-group-item">
                  <span className="title fw-medium w-40 d-inline-block">
                    PIN:
                  </span>
                  <span className="text">{billingAddress.pin}</span>
                </li>
                <li className="list-group-item">
                  <span className="title fw-medium w-40 d-inline-block">
                    City
                  </span>
                  <span className="text">{billingAddress.city}</span>
                </li>
                <li className="list-group-item">
                  <span className="title fw-medium w-40 d-inline-block">
                    State
                  </span>
                  <span className="text">{billingAddress.state}</span>
                </li>
                <li className="list-group-item">
                  <span className="title fw-medium w-40 d-inline-block">
                    Country
                  </span>
                  <span className="text">{billingAddress.country}</span>
                </li>
              </ul>
            </div>
          </Card.Body>
        </Card>
      </Block>
    </Layout>
  );
}

export default BillingAddressViewPage;
