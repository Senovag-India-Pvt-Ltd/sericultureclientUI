import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
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

function RolePages() {
  const folder = {
    name: "",
    children: [
      {
        name: "Registration",
        id: 5,
        children: [
          { name: "Farmer Registration", id: 3 },
          { name: "Reeler License", id: 4 },
          { name: "Renewal of Reeler License", id: 6 },
          { name: "Transfer of Reeler License", id: 1 },
          { name: "TraderLicense", id: 10 },
          { name: "TraderLicense", id: 9 },
        ],
      },
      {
        name: "Seed & DFL",
        id: 2,
        children: [
          {
            name: "Basic Seeds From Kunigal",
            id: 11,
            children: [
              { name: "Maintenance of Bulberry Farm", id: 7 },
              { name: "Receipt of DFLs from P4 Grainages", id: 12 },
              { name: "Line Record Maintenance", id: 14 },
              { name: "Screening Batch Record", id: 13 },
              { name: "Dispatch of Cocoons to P4 Grainage", id: 15 },
              { name: "Rearing of DFLs for the 8 lines", id: 16 },
            ],
          },
          // {
          //   name: "Grainages",
          //   children: [
          //     { name: "Preservation of Cocoon" },
          //     { name: "Preparation of Eggs" },
          //     { name: "Eggs at Cold Storage" },
          //     { name: "Cold Storage Schedule (BV)" },
          //   ],
          // },
          // {
          //   name: "Registered Seed Producer",
          //   children: [
          //     { name: "Preparation of Eggs" },
          //     { name: "Sale / Disposal of DFL" },
          //     { name: "Eggs at Cold Storage" },
          //   ],
          // },
        ],
      },
    ],
  };

  // const treeData = {
  //   name: "",
  //   id: 100,
  //   children: [
  //     { name: "ddsdsd", children: [1, 4, 9, 10, 11], id: 0, parent: null },
  //     { name: "src", children: [2, 3], id: 1, parent: 0 },
  //     { name: "index.js", id: 2, parent: 1 },
  //     { name: "styles.css", id: 3, parent: 1 },
  //     { name: "node_modules", children: [5, 7], id: 4, parent: 0 },
  //     { name: "react-accessible-treeview", children: [6], id: 5, parent: 4 },
  //     { name: "bundle.js", id: 6, parent: 5 },
  //     { name: "react", children: [8], id: 7, parent: 4 },
  //     { name: "bundle.js", id: 8, parent: 7 },
  //     { name: ".npmignore", id: 9, parent: 0 },
  //     { name: "package.json", id: 10, parent: 0 },
  //     { name: "webpack.config.js", id: 11, parent: 0 },
  //   ],
  // };

  const [arr, setArr] = useState([]);

  const [selectedNodeId, setSelectedNodeId] = useState({
    root: 1,
    parent: "",
    parentName: "",
    pageName: "",
    route: "",
    mapCode: "",
    isPage: false,
    rpPagePermissionId: "",
  });

  console.log(selectedNodeId);

  const clear = () => {
    setSelectedNodeId({
      root: 1,
      parent: "",
      parentName: "",
      pageName: "",
      route: "",
      mapCode: "",
      isPage: false,
      rpPagePermissionId: "",
    });
    setEditId("");
  };

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
  //   var arr = [
  //     {
  //       id: 1,
  //       root: 1,
  //       parentid: 0,
  //       pageName: "seedAndDLF",
  //       route: "/home/Chwaki",
  //       isPage: false,
  //     },
  //     {
  //       id: 2,
  //       root: 1,
  //       parentid: 0,
  //       pageName: "seedAndDLF 2",
  //       route: "/home/Chwaki-2",
  //       isPage: false,
  //     },
  //     {
  //       id: 3,
  //       root: 1,
  //       parentid: 0,
  //       pageName: "seedAndDLF-3",
  //       route: "/home/Chwaki-4",
  //       isPage: false,
  //     },
  //     {
  //       id: 5,
  //       root: 1,
  //       parentid: 1,
  //       pageName: "basicseedfromkunigal",
  //       route: "/home/Chwaki/seed",
  //       isPage: false,
  //     },
  //     {
  //       id: 6,
  //       root: 1,
  //       parentid: 5,
  //       pageName: "maintence of mulbury farm",
  //       route: "/maintenance-mulberry-farm",
  //       isPage: false,
  //     },
  //     {
  //       id: 7,
  //       root: 1,
  //       parentid: 5,
  //       pageName: "Register",
  //       route: "/registration/farmer",
  //       isPage: false,
  //     },
  //     {
  //       id: 8,
  //       root: 1,
  //       parentid: 5,
  //       pageName: "Farmer Registration",
  //       route: "stake-holder-registration",
  //       isPage: false,
  //     },
  //   ];

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
  function unflatten(arr) {
    var tree = [],
      mappedArr = {},
      arrElem,
      mappedElem;

    // First map the nodes of the array to an object -> create a hash table.
    for (var i = 0, len = arr.length; i < len; i++) {
      arrElem = arr[i];
      //   console.log(mappedArr);
      mappedArr[arrElem.rpPagePermissionId] = arrElem;
      mappedArr[arrElem.rpPagePermissionId]["children"] = [];
      // console.log(mappedArr.hasOwnProperty(arrElem.rpPagePermissionId));
    }

    // console.log("mapper",mappedArr);

    for (var id in mappedArr) {
      if (mappedArr.hasOwnProperty(id)) {
        mappedElem = mappedArr[id];
        // If the element is not at the root level, add it to its parent array of children.
        if (mappedElem.parent) {
          const changedData1 = {
            id: mappedElem.rpPagePermissionId,
            name: mappedElem.pageName,
            children: mappedElem.children,
          };

          // mappedArr[mappedElem["parentid"]]["children"].push(mappedElem);
          mappedArr[mappedElem["parent"]]["children"].push(changedData1);
        }
        // If the element is at the root level, add it to first level elements array.
        else {
          // Catch mapped element
          // debugger;
          // console.log(mappedElem);
          const changedData = {
            id: mappedElem.rpPagePermissionId,
            name: mappedElem.pageName,
            children: mappedElem.children,
          };
          //   console.log(changedData);
          // console.log(mappedElem);
          tree.push(changedData);
          // tree.push(mappedElem);
        }
      }
    }
    return tree;
  }

  var tree = unflatten(arr);
  // console.log(tree);
  // document.body.innerHTML = "<pre>" + JSON.stringify(tree, null, " ");

  let folders = {
    name: "",
    children: tree,
  };

  //   console.log(folders);

  const ourTree = flattenTree(folders);
  // console.log(ourTree);

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

  //   remove selected
  const [select, setSelect] = useState(false);
  const [removeId, setRemoveId] = useState("");
  const remove = (id) => {
    // if (select) {
    const response = api
      .delete(baseURL + `rp-page-permission/delete/${id}`)
      .then((response) => {
        // getVbDetailsList();
        console.log(response.data.content);
        getList();
      })
      .catch((err) => {
        // getVbDetailsList();
        // console.log(err);
      });
    // }
  };
  console.log(removeId);
  const [editId, setEditId] = useState("");

  const getbyId = (id) => {
    const response = api
      .get(baseURL + `rp-page-permission/get/${id}`)
      .then((response) => {
        // getVbDetailsList();
        console.log(response);
        const res = response.data.content;
        // // if(res.parent)
        let resMapCode = res.mapCode;
        if (!res.mapCode) {
          resMapCode = "";
        }
        setSelectedNodeId((prev) => ({
          ...prev,
          parent: res.parent,
          pageName: res.pageName,
          route: res.route,
          mapCode: resMapCode,
          rpPagePermissionId: res.rpPagePermissionId,
        }));

        setEditId(res.rpPagePermissionId);
      })
      .catch((err) => {
        // getVbDetailsList();
        // console.log(err);
      });
  };

  useEffect(() => {
    // console.log("hello"+ select);
    if (select) {
      getbyId(removeId);
      // setSelect(false);
    }
  }, [removeId, select]);

  // console.log(selectedNodeId);
  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setSelectedNodeId({ ...selectedNodeId, [name]: value });
  };
  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const postData = (e) => {
    api
      .post(baseURL + `rp-page-permission/add`, selectedNodeId)
      .then((response) => {
        // saveSuccess();
        setSelectedNodeId({
          root: 1,
          parent: "",
          parentName: "",
          pageName: "",
          route: "",
          isPage: false,
          mapCode: "",
        });
        getList();
      })
      .catch((err) => {
        saveError();
      });
  };

  const postEdit = (e) => {
    api
      .post(baseURL + `rp-page-permission/edit`, selectedNodeId)
      .then((response) => {
        // saveSuccess();
        setSelectedNodeId({
          root: 1,
          parent: "",
          parentName: "",
          pageName: "",
          route: "",
          isPage: false,
          mapCode: "",
        });
        getList();
      })
      .catch((err) => {
        saveError();
      });
  };

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    }).then(() => navigate("#"));
  };

  const saveError = () => {
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      text: "Something went wrong!",
    });
  };

  return (
    <Layout title="Add Page">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{editId ? "Edit" : "Add"} Page</Block.Title>
            {/* <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="#">Renew License to Reeler List</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Add Page
                </li>
              </ol>
            </nav> */}
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                {/* <Link
                  to="#"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link> */}
              </li>
              <li>
                {/* <Link
                  to="/seriui/relationship-list"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link> */}
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
                <Row className="g-gs">
                  <Card.Body>
                    <Row className="g-gs">
                      <Col lg="6">
                        <Form.Group className="form-group mt-3">
                          <Form.Label htmlFor="parent">Parent</Form.Label>
                          <div className="d-flex">
                            <div className="form-control-wrap">
                              <Form.Control
                                id="parent"
                                name="parent"
                                value={selectedNodeId.parent}
                                // onChange={handleVbInputs}
                                type="text"
                                readOnly
                              />
                            </div>
                            <div className="ms-2">
                              <Button
                                type="button"
                                variant="primary"
                                onClick={handleShowModal}
                              >
                                add
                              </Button>
                            </div>
                          </div>
                        </Form.Group>
                        {/* <Form.Group className="form-group ">
                          <Form.Label>Parent</Form.Label>
                          <div className="d-flex">
                            <div className="form-control-wrap">
                              <Form.Select
                                name="role"
                                //   value={data.stateId}
                                //   onChange={handleInputs}
                              >
                                <option value="0">Select Parent</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                              </Form.Select>
                            </div>
                            <div className="ms-2">
                              <Button
                                type="button"
                                variant="primary"
                                onClick={handleShowModal}
                              >
                                add
                              </Button>
                            </div>
                          </div>
                        </Form.Group> */}

                        <Form.Group className="form-group mt-3">
                          <Form.Label htmlFor="pageName">Page Name</Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="pageName"
                              name="pageName"
                              value={selectedNodeId.pageName}
                              onChange={handleInputs}
                              type="text"
                              placeholder="Enter Page Name"
                            />
                          </div>
                        </Form.Group>
                        <Form.Group className="form-group mt-3">
                          <Form.Label htmlFor="route">Route</Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="route"
                              name="route"
                              value={selectedNodeId.route}
                              onChange={handleInputs}
                              type="text"
                              placeholder="Enter Route"
                            />
                          </div>
                        </Form.Group>
                        <Form.Group className="form-group mt-3">
                          <Form.Label htmlFor="mapCode">Map Code</Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="mapCode"
                              name="mapCode"
                              value={selectedNodeId.mapCode}
                              onChange={handleInputs}
                              type="text"
                              placeholder="Enter Map Code(Unique)"
                            />
                          </div>
                        </Form.Group>
                      </Col>
                      <Col className="d-flex flex-column justify-content-center ms-5">
                        <div>
                          <div className="checkbox">
                            <TreeView
                              data={ourTree}
                              aria-label="Checkbox tree"
                              multiSelect={false}
                              propagateSelect
                              propagateSelectUpwards
                              togglableSelect
                              nodeRenderer={({
                                element,
                                isBranch,
                                isExpanded,
                                isSelected,
                                isHalfSelected,
                                getNodeProps,
                                level,
                                handleSelect,
                                handleExpand,
                              }) => {
                                if (isSelected) {
                                  // console.log(isSelected);
                                  setRemoveId(element.id);
                                  setSelect(isSelected);
                                }

                                return (
                                  <div
                                    {...getNodeProps({ onClick: handleExpand })}
                                    style={{ marginLeft: 40 * (level - 1) }}
                                  >
                                    {isBranch && (
                                      <ArrowIcon isOpen={isExpanded} />
                                    )}
                                    <CheckBoxIcon
                                      className="checkbox-icon"
                                      onClick={(e) => {
                                        handleSelect(e);
                                        // console.log(e);
                                        e.stopPropagation();
                                      }}
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
                        {arr.length ? (
                          <div className="mt-4">
                            <Button
                              type="button"
                              variant="danger"
                              onClick={() => {
                                remove(removeId);
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        ) : (
                          ""
                        )}

                        {/* <div>
                          <div className="checkbox">
                            <TreeView
                              data={tree}
                              aria-label="Checkbox tree"
                              multiSelect={false}
                              propagateSelect
                              propagateSelectUpwards
                              togglableSelect
                              nodeRenderer={({
                                element,
                                isBranch,
                                isExpanded,
                                isSelected,
                                isHalfSelected,
                                getNodeProps,
                                level,
                                handleSelect,
                                handleExpand,
                              }) => {
                                const onCheckboxSelect = (e) => {
                                  // Pass the ID or any specific identifier when a checkbox is selected
                                  debugger;
                                  handleSelect(element.id);
                                  setSelectedNodeId(element.id); // Assuming 'id' is the property name for the identifier
                                  e.stopPropagation();
                                };

                                return (
                                  <div
                                    {...getNodeProps({ onClick: handleExpand })}
                                    style={{ marginLeft: 40 * (level - 1) }}
                                  >
                                    {isBranch && (
                                      <ArrowIcon isOpen={isExpanded} />
                                    )}
                                    <CheckBoxIcon
                                      className="checkbox-icon"
                                      onClick={onCheckboxSelect}
                                      variant={
                                        isHalfSelected
                                          ? "some"
                                          : isSelected
                                          ? "all"
                                          : "none"
                                      }
                                    />
                                    <span className="name">
                                      {element.name} + {element.id}
                                    </span>
                                  </div>
                                );
                              }}
                            />
                          </div>
                        </div> */}
                      </Col>
                    </Row>
                  </Card.Body>
                </Row>
              </Card.Body>
            </Card>

            <Modal show={showModal} onHide={handleCloseModal} size="xl">
              <Modal.Header closeButton>
                <Modal.Title>Add Parent</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form action="#">
                  <Row className="g-5 px-5">
                    <Col lg="6">
                      {/* <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="pageName">
                          Page Name
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="pageName"
                            name="pageName"
                            value={selectedNodeId}
                            // onChange={handleVbInputs}
                            type="text"
                          />
                        </div>
                      </Form.Group> */}
                      <div>
                        <div className="checkbox">
                          <TreeView
                            data={ourTree}
                            aria-label="Checkbox tree"
                            multiSelect={false}
                            propagateSelect
                            propagateSelectUpwards
                            togglableSelect
                            nodeRenderer={({
                              element,
                              isBranch,
                              isExpanded,
                              isSelected,
                              isHalfSelected,
                              getNodeProps,
                              level,
                              handleSelect,
                              handleExpand,
                            }) => {
                              const onCheckboxSelect = (e) => {
                                // Pass the ID or any specific identifier when a checkbox is selected
                                //   debugger;
                                handleSelect(element.id);
                                setSelectedNodeId((prev) => ({
                                  ...prev,
                                  parent: element.id,
                                  parentName: element.name,
                                })); // Assuming 'id' is the property name for the identifier
                                e.stopPropagation();
                              };

                              return (
                                <div
                                  {...getNodeProps({ onClick: handleExpand })}
                                  style={{ marginLeft: 40 * (level - 1) }}
                                >
                                  {isBranch && (
                                    <ArrowIcon isOpen={isExpanded} />
                                  )}
                                  <CheckBoxIcon
                                    className="checkbox-icon"
                                    onClick={onCheckboxSelect}
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
                      {/* <div>
                        <div className="checkbox">
                          <TreeView
                            data={tree}
                            aria-label="Checkbox tree"
                            multiSelect
                            propagateSelect
                            propagateSelectUpwards
                            togglableSelect
                            nodeRenderer={({
                              element,
                              isBranch,
                              isExpanded,
                              isSelected,
                              isHalfSelected,
                              getNodeProps,
                              level,
                              handleSelect,
                              handleExpand,
                            }) => {
                              return (
                                <div
                                  {...getNodeProps({ onClick: handleExpand })}
                                  style={{ marginLeft: 40 * (level - 1) }}
                                >
                                  {isBranch && (
                                    <ArrowIcon isOpen={isExpanded} />
                                  )}
                                  <CheckBoxIcon
                                    className="checkbox-icon"
                                    onClick={(e) => {
                                      handleSelect(e);
                                      e.stopPropagation();
                                    }}
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
                      </div> */}
                    </Col>

                    <Col lg="12">
                      <div className="d-flex justify-content-center gap g-2">
                        <div className="gap-col">
                          <Button variant="success" onClick={handleCloseModal}>
                            Add
                          </Button>
                        </div>

                        <div className="gap-col">
                          <Button
                            variant="secondary"
                            onClick={handleCloseModal}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </Modal.Body>
            </Modal>

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  {editId && select ? (
                    <Button type="button" variant="primary" onClick={postEdit}>
                      Update
                    </Button>
                  ) : (
                    <Button type="button" variant="primary" onClick={postData}>
                      Submit
                    </Button>
                  )}
                </li>
                <li>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => clear()}
                  >
                    Cancel
                  </Button>
                </li>
              </ul>
            </div>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default RolePages;
