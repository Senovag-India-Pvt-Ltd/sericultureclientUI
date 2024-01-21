import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import {
  Icon,
} from "../../../components";
// import DataTable from '../../components/DataTable/DataTable';
// import CaseTaskData, { caseTaskColumns } from '../../store/crm/CaseTaskData';
import ServiceTypeData from "../../../store/masters/serviceType/ServiceTypeData";

function ServiceTypeView() {
  const { id } = useParams();
  const [data] = useState(ServiceTypeData);
  const [serviceType, setServiceType] = useState(data[0]);

  // grabs the id form the url and loads the corresponding data

  useEffect(() => {
    let findUser = data.find((item) => item.id === id);
    setServiceType(findUser);
  }, [id, data]);

  return (
    <Layout title="Service Type View" content="container">
      <Block.HeadBetween className={"block-head"}>
        <div className="gap-col">
          <ul className="d-flex gap g-2">
            <li className="d-none d-md-block">
              <Link
                to={`/masters/service-type-list`}
                className="btn btn-soft btn-primary"
              >
                <Icon name="task"></Icon>
                <span>Service Type List</span>
              </Link>
            </li>
          </ul>
        </div>
      </Block.HeadBetween>
      <Block className="mt-4">
        <Card>
          <Card.Body>
            <div className="bio-block">
              <h4 className="bio-block-title">Service Type Details</h4>
              <ul className="list-group list-group-borderless small">
                <li className="list-group-item">
                  <span className="title fw-medium w-40 d-inline-block">
                    Service Type Name:
                  </span>
                  <span className="text">{serviceType.name}</span>
                </li>
                <li className="list-group-item">
                  <span className="title fw-medium w-40 d-inline-block">
                    Description:
                  </span>
                  <span className="text">{serviceType.description}</span>
                </li>
              </ul>
            </div>
          </Card.Body>
        </Card>
      </Block>
      {/* <Block>
                <Card>
                    <DataTable tableClassName="data-table-head-light table-responsive" data={CaseTaskData} columns={caseTaskColumns} />
                </Card>
            </Block> */}
    </Layout>
  );
}

export default ServiceTypeView;
