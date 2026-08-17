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

import { FaRegSquare, FaCheckSquare, FaMinusSquare } from "react-icons/fa";
import { IoMdArrowDropright } from "react-icons/io";
import TreeView, { flattenTree } from "react-accessible-treeview";
import cx from "classnames";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function RoleConfig() {
  const { t } = useTranslation();
  const [data, setData] = useState({
    roleId: "",
    rpRolePermissionId: 4,
    values: [],
  });

  const [validated, setValidated] = useState(false);

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

  // Deterministic checkbox-tree toggle logic, independent of the library's
  // own internal propagateSelect reducer (which was leaving some nested
  // items permanently checked and un-uncheckable — the underlying id was
  // never actually present in data.values, only implied by a checked
  // ancestor, so removing "just this id" on click was a no-op).
  //
  // childrenOf / parentOf: adjacency built once per render from arr.
  const childrenOf = {};
  const parentOf = {};
  arr.forEach((item) => {
    parentOf[item.rpPagePermissionId] = item.parent || null;
    if (item.parent) {
      if (!childrenOf[item.parent]) childrenOf[item.parent] = [];
      childrenOf[item.parent].push(item.rpPagePermissionId);
    }
  });

  const getDescendantIds = (id) => {
    const result = [];
    const stack = [...(childrenOf[id] || [])];
    while (stack.length) {
      const next = stack.pop();
      result.push(next);
      if (childrenOf[next]) stack.push(...childrenOf[next]);
    }
    return result;
  };

  const getAncestorIds = (id) => {
    const result = [];
    let current = parentOf[id];
    while (current) {
      result.push(current);
      current = parentOf[current];
    }
    return result;
  };

  // A node counts as selected if its own id is in the list, OR any ancestor's
  // id is (matches how the tree visually renders propagated selection) —
  // needed so older saved data that only recorded a parent id still expands
  // correctly the first time a node under it is toggled.
  const isEffectivelySelected = (id, valuesSet) =>
    valuesSet.has(id) || getAncestorIds(id).some((a) => valuesSet.has(a));

  const toggleNodeSelection = (clickedId) => {
    const currentSet = new Set(data.values);
    const wasSelected = isEffectivelySelected(clickedId, currentSet);

    // Materialize every currently-effective selection (including ones only
    // implied by an ancestor) into an explicit set, so storage never again
    // depends on ancestor-implies-descendant semantics.
    const allIds = arr.map((item) => item.rpPagePermissionId);
    const materialized = new Set(
      allIds.filter((id) => isEffectivelySelected(id, currentSet))
    );

    const affected = [clickedId, ...getDescendantIds(clickedId)];
    if (wasSelected) {
      affected.forEach((id) => materialized.delete(id));
    } else {
      affected.forEach((id) => materialized.add(id));
    }

    setData((prevData) => ({
      ...prevData,
      values: Array.from(materialized),
    }));
  };

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
        return <FaRegSquare {...rest} />;
      case "some":
        return <FaMinusSquare {...rest} />;
      default:
        return null;
    }
  };

  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const postData = (e) => {
    if (!data.roleId || data.roleId === "0") {
      setValidated(true);
      Swal.fire({
        icon: "warning",
        title: t("Role is required"),
        text: t("Please select a Role before submitting."),
      });
      return;
    }
    setValidated(false);
    api
      .post(baseURL + `rp-role-association/save-multiple`, data)
      .then((response) => {
        // saveSuccess();
        Swal.fire({
          icon: "success",
          title: t("Saved successfully"),
        });
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
    setValidated(false);
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
          // A saved value can reference an rpPagePermissionId that was later
          // deleted/deactivated. Passing such a stale id to TreeView's
          // selectedIds crashes it with "Node with id=X doesn't exist in
          // the tree.", so drop any id no longer present in the current tree.
          const validIds = new Set(arr.map((item) => item.rpPagePermissionId));
          setData((prev) => ({
            ...prev,
            values: res
              .map((item) => item.value)
              .filter((id) => validIds.has(id)),
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
      title: t("Saved successfully"),
      // text: "You clicked the button!",
    }).then(() => navigate("/seriui/relationship-list"));
  };

  const saveError = () => {
    Swal.fire({
      icon: "error",
      title: t("Save attempt was not successful"),
      text: t("Something went wrong!"),
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
      <style>{roleConfigStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("Role Config")}</Block.Title>
              {/* <nav>
                <ol className="breadcrumb breadcrumb-arrow mb-0">
                  <li className="breadcrumb-item">
                    <Link to="/seriui/">Home</Link>
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
                    to="/seriui/relationship-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/relationship-list"
                    className="btn btn-primary d-none d-md-inline-flex sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
              </ul>
            </Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        <Form>
          <Row className="g-3 ">
            <Card>
              <Card.Body>
                {/* <h3>Farmers Details</h3> */}
                <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group ">
                      <Form.Label>
                        {t("Role")}<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="roleId"
                          value={data.roleId}
                          onChange={handleInputs}
                          required
                          isInvalid={
                            validated &&
                            (!data.roleId || data.roleId === "0")
                          }
                        >
                          <option value="0">{t("Select Roles")}</option>
                          {rolesListData.map((list) => (
                            <option key={list.roleId} value={list.roleId}>
                              {list.roleName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {t("Role is required")}
                        </Form.Control.Feedback>
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
                          nodeRenderer={({
                            element,
                            isBranch,
                            isExpanded,
                            getNodeProps,
                            level,
                            handleExpand,
                          }) => {
                            // Checked/half-checked state is computed entirely
                            // from data.values ourselves (isEffectivelySelected
                            // / getDescendantIds), NOT from the library's own
                            // isSelected/isHalfSelected. The library's
                            // propagateSelect prop, when enabled, re-adds every
                            // descendant of a still-selected ancestor back into
                            // its internal state on every prop change — which
                            // silently undid our own toggleNodeSelection removal
                            // one render later, making nested items impossible
                            // to uncheck. propagateSelect/propagateSelectUpwards/
                            // togglableSelect are intentionally omitted above so
                            // the library only mirrors data.values verbatim.
                            const onCheckboxSelect = (e) => {
                              toggleNodeSelection(element.id);
                              e.stopPropagation();
                            };

                            const selectedSet = new Set(data.values);
                            const selfSelected = isEffectivelySelected(
                              element.id,
                              selectedSet
                            );
                            const descendantIds = getDescendantIds(element.id);
                            const selectedDescendantCount = descendantIds.filter(
                              (id) => isEffectivelySelected(id, selectedSet)
                            ).length;

                            let variant = "none";
                            if (isBranch) {
                              if (
                                selfSelected &&
                                selectedDescendantCount === descendantIds.length
                              ) {
                                variant = "all";
                              } else if (
                                selfSelected ||
                                selectedDescendantCount > 0
                              ) {
                                variant = "some";
                              }
                            } else {
                              variant = selfSelected ? "all" : "none";
                            }

                            return (
                              <div
                                {...getNodeProps({ onClick: handleExpand })}
                                style={{ marginLeft: 40 * (level - 1) }}
                              >
                                {isBranch && <ArrowIcon isOpen={isExpanded} />}
                                <CheckBoxIcon
                                  className="checkbox-icon"
                                  onClick={onCheckboxSelect}
                                  variant={variant}
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
                    {t("Submit")}
                  </Button>
                </li>
                <li>
                  <Link
                    to="/seriui/relationship-list"
                    className="btn btn-secondary border-0"
                  >
                    {t("Cancel")}
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

const roleConfigStyles = `
  .sh-page-header {
    padding: 20px 24px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border-radius: 12px;
    border: none;
    box-shadow: 0 6px 18px rgba(30, 103, 168, 0.22);
    margin-bottom: 22px;
  }
  .sh-page-title {
    margin-bottom: 4px;
    color: #ffffff !important;
    font-weight: 700;
    letter-spacing: 0.2px;
  }
  .sh-cta-btn {
    background: #ffffff;
    color: #1e67a8 !important;
    border: none;
    box-shadow: 0 4px 12px rgba(12, 40, 68, 0.25);
    font-weight: 700;
    padding: 8px 18px;
    border-radius: 8px;
    transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
  }
  .sh-cta-btn:hover {
    background: #eef6ff;
    color: #1e67a8 !important;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(12, 40, 68, 0.32);
  }
  .sh-form-wrap {
    background: #eef2f8;
    border-radius: 14px;
    padding: 18px;
  }
  .sh-form-wrap .card {
    border: none;
    border-radius: 12px !important;
    box-shadow: 0 4px 14px rgba(30, 103, 168, 0.1);
    overflow: hidden;
  }
  .sh-form-wrap .card-header {
    border-bottom: none !important;
  }
  .sh-section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 700 !important;
    font-size: 1rem !important;
    letter-spacing: 0.3px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border-left: none !important;
    color: #ffffff !important;
    padding: 14px 20px !important;
  }
  .sh-section-header svg,
  .sh-section-header .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.22);
    color: #ffffff;
    font-size: 15px;
  }
  .sh-form-wrap .form-label {
    font-weight: 600;
    color: #2b3a55;
    font-size: 13.5px;
  }
  .sh-form-wrap .form-control,
  .sh-form-wrap .form-select {
    border-radius: 8px;
    border: 1px solid #dbe4f0;
    padding: 9px 12px;
    font-size: 13.5px;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-form-wrap .form-control:focus,
  .sh-form-wrap .form-select:focus {
    border-color: #3b8dd6;
    box-shadow: 0 0 0 0.2rem rgba(59, 141, 214, 0.15);
  }
  .sh-save-btn {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border: none !important;
    font-weight: 600;
    padding: 8px 22px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    box-shadow: 0 4px 12px rgba(30, 103, 168, 0.25);
  }
  .sh-cancel-btn {
    background: #ffffff !important;
    color: #c43257 !important;
    border: 1px solid #e3496a !important;
    font-weight: 600;
    padding: 8px 22px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: all 0.15s ease;
  }
  .sh-cancel-btn:hover {
    background: linear-gradient(135deg, #e3496a 0%, #c43257 100%) !important;
    color: #ffffff !important;
    border-color: transparent !important;
  }
`;

export default RoleConfig;
