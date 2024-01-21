import React, { useState, useEffect } from "react";
import {  useParams } from "react-router-dom";
import { Card } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import UnitOfMeasurementData from "../../../store/masters/unitOfMeasurement/UnitOfMeasurementData";


function UnitOfMeasurementViewPage() {
  const { id } = useParams();
  const [data] = useState(UnitOfMeasurementData);
  const [unitOfMeasurement, setUnitOfMeasurement] = useState(data[0]);

  // grabs the id form the url and loads the corresponding data
  useEffect(() => {
    let findUser = data.find((item) => item.id === id);
    setUnitOfMeasurement(findUser);
  }, [id, data]);

  return (
    <Layout title="Unit of Measurement View" content="container">
      <Block className="mt-4">
        <Card>
          <Card.Body>
            <div className="bio-block">
              <h4 className="bio-block-title">Unit of Measurement</h4>
              <ul className="list-group list-group-borderless small">
                <li className="list-group-item">
                  <span className="title fw-medium w-40 d-inline-block">
                    Unit Name:
                  </span>
                  <span className="text">{unitOfMeasurement.name}</span>
                </li>
                <li className="list-group-item">
                  <span className="title fw-medium w-40 d-inline-block">
                    Description :
                  </span>
                  <span className="text">{unitOfMeasurement.description}</span>
                </li>
              </ul>
            </div>
          </Card.Body>
        </Card>
      </Block>
    </Layout>
  );
}

export default UnitOfMeasurementViewPage;
