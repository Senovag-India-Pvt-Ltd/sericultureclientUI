import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import TermsAndConditionData from "../../../store/masters/common/TermsAndConditionData";

function TermsAndConditionsViewPage() {
  const { id } = useParams();
  const [data] = useState(TermsAndConditionData);
  const [termsAndConditions, setTermsAndConditions] = useState(data[0]);

  // grabs the id form the url and loads the corresponding data
  useEffect(() => {
    let findUser = data.find((item) => item.id === id);
    setTermsAndConditions(findUser);
  }, [id, data]);

  return (
    <Layout title="Terms and Conditions View" content="container">
      <Block className="mt-4">
        <Card>
          <Card.Body>
            <div className="bio-block">
              <h4 className="bio-block-title">Term and Condition</h4>
              <ul className="list-group list-group-borderless small">
                <li className="list-group-item">
                  <span className="title fw-medium w-40 d-inline-block">
                    Term and Condition Name:
                  </span>
                  <span className="text">{termsAndConditions.name}</span>
                </li>
                <li className="list-group-item">
                  <span className="title fw-medium w-40 d-inline-block">
                    Description :
                  </span>
                  <span className="text">{termsAndConditions.description}</span>
                </li>
              </ul>
            </div>
          </Card.Body>
        </Card>
      </Block>
    </Layout>
  );
}

export default TermsAndConditionsViewPage;
