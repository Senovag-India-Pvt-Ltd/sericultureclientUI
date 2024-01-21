import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import PaymentTermsData from "../../../store/masters/accounts/PaymentTermsData";

function PaymentTermsViewPage() {
  const { id } = useParams();
  const [data] = useState(PaymentTermsData);
  const [paymentTerms, setPaymentTems] = useState(data[0]);

  // grabs the id form the url and loads the corresponding data
  useEffect(() => {
    let findUser = data.find((item) => item.id === id);
    setPaymentTems(findUser);
  }, [id, data]);

  return (
    <Layout title="Payment Terms View" content="container">
      <Block className="mt-4">
        <Card>
          <Card.Body>
            <div className="bio-block">
              <h4 className="bio-block-title">Payment Terms</h4>
              <ul className="list-group list-group-borderless small">
                <li className="list-group-item">
                  <span className="title fw-medium w-40 d-inline-block">
                    Payment Term Name:
                  </span>
                  <span className="text">{paymentTerms.name}</span>
                </li>
                <li className="list-group-item">
                  <span className="title fw-medium w-40 d-inline-block">
                    Description :
                  </span>
                  <span className="text">{paymentTerms.description}</span>
                </li>
                <li className="list-group-item">
                  <span className="title fw-medium w-40 d-inline-block">
                    Days:
                  </span>
                  <span className="text">{paymentTerms.days}</span>
                </li>
              </ul>
            </div>
          </Card.Body>
        </Card>
      </Block>
    </Layout>
  );
}

export default PaymentTermsViewPage;
