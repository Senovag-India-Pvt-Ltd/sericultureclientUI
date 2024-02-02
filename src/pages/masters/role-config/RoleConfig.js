import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2/src/sweetalert2.js";
import { Icon } from "../../../components";
import React from "react";
import { useState, useEffect } from "react";
// import axios from "axios";
import api from "../../../../src/services/auth/api";

import { FaSquare, FaCheckSquare, FaMinusSquare } from "react-icons/fa";
import { IoMdArrowDropright } from "react-icons/io";
import TreeView, { flattenTree } from "react-accessible-treeview";
import cx from "classnames";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function RoleConfig() {
  const [data, setData] = useState({
    roleId: "",
    rpRolePermissionId: 4,
    values: [],
  });

  //   to clear selected ids
  //   const [selectedIds, setSelectedIds] = useState([6,8]);
  // console.log(data.values);
  const [arr, setArr] = useState([]);

  // var arr = [
  //   {
  //     id: 1,
  //     root: 1,
  //     parentid: 0,
  //     name: "seedAndDLF",
  //     route: "/home/Chwaki",
  //     isPage: false,
  //   },
  //   {
  //     id: 2,
  //     root: 1,
  //     parentid: 0,
  //     name: "seedAndDLF 2",
  //     route: "/home/Chwaki-2",
  //     isPage: false,
  //   },
  //   {
  //     id: 3,
  //     root: 1,
  //     parentid: 0,
  //     name: "seedAndDLF-3",
  //     route: "/home/Chwaki-4",
  //     isPage: false,
  //   },
  //   {
  //     id: 5,
  //     root: 1,
  //     parentid: 1,
  //     name: "basicseedfromkunigal",
  //     route: "/home/Chwaki/seed",
  //     isPage: false,
  //   },
  //   {
  //     id: 6,
  //     root: 1,
  //     parentid: 5,
  //     name: "maintence of mulbury farm",
  //     route: "/maintenance-mulberry-farm",
  //     isPage: false,
  //   },
  //   {
  //     id: 7,
  //     root: 1,
  //     parentid: 5,
  //     name: "Register",
  //     route: "/registration/farmer",
  //     isPage: false,
  //   },
  //   {
  //     id: 8,
  //     root: 1,
  //     parentid: 5,
  //     name: "Farmer Registration",
  //     route: "stake-holder-registration",
  //     isPage: false,
  //   },
  // ];

  // var arr = [
  //     {'id':1 ,'parentid' : 0},
  //     {'id':4 ,'parentid' : 2},
  //     {'id':3 ,'parentid' : 1},
  //     {'id':5 ,'parentid' : 0},
  //     {'id':6 ,'parentid' : 0},
  //     {'id':2 ,'parentid' : 1},
  //     {'id':7 ,'parentid' : 4},
  //     {'id':8 ,'parentid' : 1}
  //   ];

  const getList = () => {
    const response = api
      .get(baseURL + `rp-page-permission/get-all`)
      .then((response) => {
        setArr(response.data.content.rpPagePermission);
      })
      .catch((err) => {
        // setArr([]);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  // console.log(arr);

  function unflatten(arr) {
    let tree = [],
      mappedArr = {},
      arrElem,
      mappedElem;

    // First map the nodes of the array to an object -> create a hash table.
    for (let i = 0, len = arr.length; i < len; i++) {
      arrElem = arr[i];
      mappedArr[arrElem.rpPagePermissionId] = arrElem;
      mappedArr[arrElem.rpPagePermissionId]["children"] = [];
    }

    for (let id in mappedArr) {
      if (mappedArr.hasOwnProperty(id)) {
        mappedElem = mappedArr[id];
        // If the element is not at the root level, add it to its parent array of children.
        if (mappedElem.parent) {
          const changedData1 = {
            id: mappedElem.rpPagePermissionId,
            name: mappedElem.pageName,
            children: mappedElem.children,
          };
          // debugger
          mappedArr[mappedElem["parent"]]["children"].push(changedData1);
        }
        // If the element is at the root level, add it to first level elements array.
        else {
          // Catch mapped element
          const changedData = {
            id: mappedElem.rpPagePermissionId,
            name: mappedElem.pageName,
            children: mappedElem.children,
          };

          tree.push(changedData);
        }
      }
    }
    return tree;
  }

  let tree = unflatten(arr);
  let folders = {
    name: "",
    children: tree,
  };

  const ourTree = flattenTree(folders);

  const ArrowIcon = ({ isOpen, className }) => {
    const baseClass = "arrow";
    const classes = cx(
      baseClass,
      { [`${baseClass}--closed`]: !isOpen },
      { [`${baseClass}--open`]: isOpen },
      className
    );
    return <IoMdArrowDropright className={classes} />;
  };

  const CheckBoxIcon = ({ variant, ...rest }) => {
    switch (variant) {
      case "all":
        return <FaCheckSquare {...rest} />;
      case "none":
        return <FaSquare {...rest} />;
      case "some":
        return <FaMinusSquare {...rest} />;
      default:
        return null;
    }
  };

  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const postData = (e) => {
    api
      .post(baseURL + `rp-role-association/save-multiple`, data)
      .then((response) => {
        // saveSuccess();
        Swal.fire({
          icon: "success",
          title: "Saved successfully",
        })
        // alert("saved");
        setData({
          roleId: "",
          rpRolePermissionId: 4,
          values: [],
        });
        // setSelectedIds([]);
      })
      .catch((err) => {
        saveError();
      });
  };

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
    api
      .post(
        baseURL +
          `rp-role-association/get-by-role-id-and-rp-page-permission-id`,
        { roleId: value, rpRolePermissionId: 4 },
        {
          headers: _header,
        }
      )
      .then((response) => {
        // saveSuccess();
        // alert("saved");
        const res = response.data.content.rpRoleAssociation;
        // console.log(res);
        // const man =res.map((item)=>(
        //   item.value
        // ))
        if (res) {
          setData((prev) => ({
            ...prev,
            values: res.map((item) => item.value),
          }));
        } else {
          setData((prev) => ({ ...prev, values: [] }));
        }

        // console.log(man);
        // setData()
        // setData({
        //   roleId: "",
        //   rpRolePermissionId: 4,
        //   values: [],
        // });
        // setSelectedIds([]);
      })
      .catch((err) => {});
  };

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    }).then(() => navigate("/relationship-list"));
  };

  const saveError = () => {
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      text: "Something went wrong!",
    });
  };

  // to get Roles
  const [rolesListData, setRolesListData] = useState([]);

  const getRolesList = () => {
    const response = api
      .get(baseURL + `role/get-all`)
      .then((response) => {
        setRolesListData(response.data.content.role);
      })
      .catch((err) => {
        setRolesListData([]);
      });
  };

  useEffect(() => {
    getRolesList();
  }, []);

  // console.log(ourTree);
  return (
    <Layout title="Role Config">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Role Config</Block.Title>
            {/* <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="#">Renew License to Reeler List</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Role Config
                </li>
              </ol>
            </nav> */}
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/relationship-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/relationship-list"
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
        <Form>
          <Row className="g-3 ">
            <Card>
              <Card.Body>
                {/* <h3>Farmers Details</h3> */}
                <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group ">
                      <Form.Label>Role</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="roleId"
                          value={data.roleId}
                          onChange={handleInputs}
                        >
                          <option value="0">Select Roles</option>
                          {rolesListData.map((list) => (
                            <option key={list.roleId} value={list.roleId}>
                              {list.roleName}
                            </option>
                          ))}
                        </Form.Select>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="g-gs mt-1">
                  <Col lg="6">
                    <div>
                      <div className="checkbox">
                        <TreeView
                          data={ourTree}
                          aria-label="Checkbox tree"
                          multiSelect
                          selectedIds={data.values}
                          defaultExpandedIds={[1]}
                          propagateSelect
                          propagateSelectUpwards
                          togglableSelect
                          nodeRenderer={({
                            element,
                            isBranch,
                            isExpanded,
                            isSelected,
                            isHalfSelected,
                            isDisabled,
                            getNodeProps,
                            level,
                            handleSelect,
                            handleExpand,
                          }) => {
                            // console.log(isExpanded);
                            // console.log("parent",element.parent);
                            // console.log("isSelected",isSelected);
                            // console.log("isHalfSelected",isHalfSelected)

                            // console.log("isBranch",isBranch);
                            const onCheckboxSelect = (e, selectedId) => {
                              handleSelect(e);
                              e.stopPropagation();
                              console.log(element.parent);

                              //   const isSelected =
                              //     data.values.includes(selectedId);
                              let updatedValues;
                              // console.log(isSelected);

                              if (isSelected) {
                                updatedValues = data.values.filter(
                                  (id) => id !== selectedId
                                );
                                // updatedValues = [...data.values, selectedId];
                                console.log("hello", updatedValues);
                              }
                              // else if(element.parent){
                              //   updatedValues = [...data.values, selectedId,element.parent];
                              // }
                              else {
                                updatedValues = [...data.values, selectedId];
                              }
                              setData((prevData) => ({
                                ...prevData,
                                values: updatedValues,
                              }));
                            };
                            // console.log(data);
                            return (
                              <div
                                {...getNodeProps({ onClick: handleExpand })}
                                style={{ marginLeft: 40 * (level - 1) }}
                              >
                                {isBranch && <ArrowIcon isOpen={isExpanded} />}
                                <CheckBoxIcon
                                  className="checkbox-icon"
                                  onClick={(e) =>
                                    onCheckboxSelect(e, element.id)
                                  }
                                  variant={
                                    isHalfSelected
                                      ? "some"
                                      : isSelected
                                      ? "all"
                                      : "none"
                                  }
                                />
                                <span className="name">{element.name}</span>
                              </div>
                            );
                          }}
                        />
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  <Button type="button" variant="primary" onClick={postData}>
                    Submit
                  </Button>
                </li>
                <li>
                  <Link
                    to="/relationship-list"
                    className="btn btn-secondary border-0"
                  >
                    Cancel
                  </Link>
                </li>
              </ul>
            </div>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default RoleConfig;
