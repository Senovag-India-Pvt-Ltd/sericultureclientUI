import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import UserGroupData from "../../../store/masters/userGroup/UserGroupData";

function UserGroupViewPage() {
  const { id } = useParams();
  const [data] = useState(UserGroupData);
  const [userGroup, setUserGroup] = useState(data[0]);

  // grabs the id form the url and loads the corresponding data
  useEffect(() => {
    let findUser = data.find((item) => item.id === id);
    setUserGroup(findUser);
  }, [id, data]);

  return (
    <Layout title="User Group View" content="container">
      <Block className="mt-4">
        <Card>
          <Card.Body>
            <div className="bio-block">
              <h4 className="bio-block-title">User Group</h4>
              <ul className="list-group list-group-borderless small">
                <li className="list-group-item">
                  <span className="title fw-medium w-40 d-inline-block">
                    Group Name:
                  </span>
                  <span className="text">{userGroup.name}</span>
                </li>
                <li className="list-group-item">
                  <span className="title fw-medium w-40 d-inline-block">
                    Description :
                  </span>
                  <span className="text">{userGroup.description}</span>
                </li>
                <li className="list-group-item">
                  <span className="title fw-medium w-40 d-inline-block">
                    Status:
                  </span>
                  <span className="text">{userGroup.status}</span>
                </li>
              </ul>
            </div>
          </Card.Body>
        </Card>
      </Block>
    </Layout>
  );
}

export default UserGroupViewPage;
