import React, { useEffect } from "react";
import classNames from "classnames";

// import getParents from '../../../utilities/getParents';
import slideUp from "../../../utilities/slideUp";
import slideDown from "../../../utilities/slideDown";
import getParents from "../../../utilities/getParents";

import { NavLink, Link } from "react-router-dom";

function MenuHeading({ className, text, ...props }) {
  const compClass = classNames({
    "nk-menu-heading": true,
    [className]: className,
  });
  return (
    <li className={compClass}>
      <h6 className="overline-title">{text || props.children}</h6>
    </li>
  );
}

function MenuItemTemplate({ text, icon }) {
  return (
    <>
      {icon && (
        <span className="nk-menu-icon">
          <em className={`icon ni ni-${icon}`}></em>
        </span>
      )}
      {text && <span className="nk-menu-text">{text}</span>}
    </>
  );
}

function MenuItemLink({ text, icon, sub, to, blank, onClick }) {
  return (
    <>
      {!blank && !sub && (
        <NavLink className="nk-menu-link" to={to}>
          <MenuItemTemplate icon={icon} text={text} />
        </NavLink>
      )}
      {blank && (
        <Link className="nk-menu-link" to={to} target="_blank">
          <MenuItemTemplate icon={icon} text={text} />
        </Link>
      )}
      {sub && (
        <a
          className="nk-menu-link nk-menu-toggle"
          onClick={onClick}
          href="#expand"
        >
          <MenuItemTemplate icon={icon} text={text} />
        </a>
      )}
    </>
  );
}

function MenuItem({ sub, className, ...props }) {
  const compClass = classNames({
    "nk-menu-item": true,
    "has-sub": sub,
    [className]: className,
  });
  return <li className={compClass}>{props.children}</li>;
}

function MenuSub({ mega, className, ...props }) {
  const compClass = classNames({
    "nk-menu-sub": true,
    [className]: className,
  });
  return <ul className={compClass}>{props.children}</ul>;
}

function MenuList({ className, ...props }) {
  const compClass = classNames({
    "nk-menu": true,
    [className]: className,
  });
  return <ul className={compClass}>{props.children}</ul>;
}

function Menu() {
  // variables for Sidebar
  let menu = {
    classes: {
      main: "nk-menu",
      item: "nk-menu-item",
      link: "nk-menu-link",
      toggle: "nk-menu-toggle",
      sub: "nk-menu-sub",
      subparent: "has-sub",
      active: "active",
      current: "current-page",
    },
  };

  let currentLink = function (selector) {
    let elm = document.querySelectorAll(selector);
    elm.forEach(function (item) {
      var activeRouterLink = item.classList.contains("active");
      if (activeRouterLink) {
        let parents = getParents(
          item,
          `.${menu.classes.main}`,
          menu.classes.item
        );
        parents.forEach((parentElemets) => {
          parentElemets.classList.add(
            menu.classes.active,
            menu.classes.current
          );
          let subItem = parentElemets.querySelector(`.${menu.classes.sub}`);
          subItem !== null && (subItem.style.display = "block");
        });
      } else {
        item.parentElement.classList.remove(
          menu.classes.active,
          menu.classes.current
        );
      }
    });
  };

  // dropdown toggle
  let dropdownToggle = function (elm) {
    let parent = elm.parentElement;
    let nextelm = elm.nextElementSibling;
    let speed =
      nextelm.children.length > 5 ? 400 + nextelm.children.length * 10 : 400;
    if (!parent.classList.contains(menu.classes.active)) {
      parent.classList.add(menu.classes.active);
      slideDown(nextelm, speed);
    } else {
      parent.classList.remove(menu.classes.active);
      slideUp(nextelm, speed);
    }
  };

  // dropdown close siblings
  let closeSiblings = function (elm) {
    let parent = elm.parentElement;
    let siblings = parent.parentElement.children;
    Array.from(siblings).forEach((item) => {
      if (item !== parent) {
        item.classList.remove(menu.classes.active);
        if (item.classList.contains(menu.classes.subparent)) {
          let subitem = item.querySelectorAll(`.${menu.classes.sub}`);
          subitem.forEach((child) => {
            child.parentElement.classList.remove(menu.classes.active);
            slideUp(child, 400);
          });
        }
      }
    });
  };

  let menuToggle = function (e) {
    e.preventDefault();
    let item = e.target.closest(`.${menu.classes.toggle}`);
    dropdownToggle(item);
    closeSiblings(item);
  };

  useEffect(() => {
    currentLink(`.${menu.classes.link}`);
    // eslint-disable-next-line
  }, [null]);

  return (
    <MenuList>
      <MenuItem sub>
        <MenuItemLink icon="home" text="Home" to="/seriui/home" />
        <MenuItemLink
          icon="dashboard"
          text="Dashboard"
          onClick={menuToggle}
          sub
        />
        <MenuSub>
          <MenuItem>
            <MenuItemLink text="Default" to="/seriui/home" />
          </MenuItem>
          <MenuItem>
            <MenuItemLink text="CRM" to="/seriui/home-ecommerce" />
          </MenuItem>
          <MenuItem>
            <MenuItemLink text="Projects" to="/seriui/home-project" />
          </MenuItem>
          <MenuItem>
            <MenuItemLink text="Sales" to="/seriui/home-project" />
          </MenuItem>
          <MenuItem>
            <MenuItemLink text="Accounts" to="/seriui/home-marketing" />
          </MenuItem>
          <MenuItem>
            <MenuItemLink text="Production" to="/seriui/home-nft" />
          </MenuItem>
        </MenuSub>
      </MenuItem>
      <MenuHeading text="CONTROL PANEL" />
      {/* <MenuItem>
            <MenuItemLink icon="chat-circle" text="Chat" to="/seriui/apps/chats"/>
        </MenuItem>
        <MenuItem>
            <MenuItemLink icon="inbox" text="Inbox" to="/seriui/apps/inbox"/>
        </MenuItem>
        <MenuItem>
            <MenuItemLink icon="calendar-booking" text="Calendar" to="/seriui/apps/calendar"/>
        </MenuItem>
        <MenuItem sub>
            <MenuItemLink icon="grid-alt" text="Kanban board" onClick={menuToggle} sub/>
            <MenuSub>
                <MenuItem>
                    <MenuItemLink text="Basic" to="/seriui/apps/kanban/basic"/>
                </MenuItem>
                <MenuItem>
                    <MenuItemLink text="Custom Board" to="/seriui/apps/kanban/custom"/>
                </MenuItem>
            </MenuSub>
        </MenuItem> */}
      <MenuItem sub>
        <MenuItemLink
          icon="users"
          text="User Management"
          onClick={menuToggle}
          sub
        />
        <MenuSub>
          <MenuItem>
            <MenuItemLink
              text="Users List"
              to="/seriui/user-manage/user-list"
            />
          </MenuItem>
          <MenuItem>
            <MenuItemLink
              text="Users Cards"
              to="/seriui/user-manage/user-cards"
            />
          </MenuItem>
          <MenuItem>
            <MenuItemLink
              text="User Profile"
              to="/seriui/user-manage/user-profile/uid01"
            />
          </MenuItem>
          <MenuItem>
            <MenuItemLink
              text="User Edit"
              to="/seriui/user-manage/user-edit/uid01"
            />
          </MenuItem>
        </MenuSub>
      </MenuItem>
      <MenuItem sub>
        <MenuItemLink icon="bag" text="Category" onClick={menuToggle} sub />
        <MenuSub>
          <MenuItem>
            <MenuItemLink text="Categories" to="/seriui/ecommerce/categories" />
          </MenuItem>
          <MenuItem>
            <MenuItemLink
              text="Add Category"
              to="/seriui/ecommerce/add-category"
            />
          </MenuItem>
        </MenuSub>
      </MenuItem>
      <MenuItem sub>
        <MenuItemLink icon="bag" text="Product" onClick={menuToggle} sub />
        <MenuSub>
          <MenuItem>
            <MenuItemLink text="Products" to="/seriui/ecommerce/products" />
          </MenuItem>
          <MenuItem>
            <MenuItemLink
              text="Add Product"
              to="/seriui/ecommerce/add-product"
            />
          </MenuItem>
        </MenuSub>
      </MenuItem>
      <MenuItem sub>
        <MenuItemLink icon="bag" text="Production" onClick={menuToggle} sub />
        <MenuSub>
          <MenuItem>
            <MenuItemLink
              text="Manufacturing order"
              to="/seriui/production/manufacturing-order"
            />
          </MenuItem>
        </MenuSub>
      </MenuItem>
      {/* <MenuHeading text="Components" />
        <MenuItem sub>
            <MenuItemLink icon="layers" text="Ui Elements" onClick={menuToggle} sub/>
            <MenuSub>
                <MenuItem>
                    <MenuItemLink text="Accordion" to="/seriui/ui-elements/accordion"/>
                </MenuItem>
                <MenuItem>
                    <MenuItemLink text="Alerts" to="/seriui/ui-elements/alert"/>
                </MenuItem>
                <MenuItem>
                    <MenuItemLink text="Badge" to="/seriui/ui-elements/badge"/>
                </MenuItem>
                <MenuItem>
                    <MenuItemLink text="Breadcrumb" to="/seriui/ui-elements/breadcrumb"/>
                </MenuItem>
                <MenuItem>
                    <MenuItemLink text="Buttons" to="/seriui/ui-elements/buttons"/>
                </MenuItem>
                <MenuItem>
                    <MenuItemLink text="Button group" to="/seriui/ui-elements/button-group"/>
                </MenuItem>
                <MenuItem>
                    <MenuItemLink text="Cards" to="/seriui/ui-elements/cards"/>
                </MenuItem>
                <MenuItem>
                    <MenuItemLink text="Carousel" to="/seriui/ui-elements/carousel"/>
                </MenuItem>
                <MenuItem>
                    <MenuItemLink text="Close button" to="/seriui/ui-elements/close-button"/>
                </MenuItem>
                <MenuItem>
                    <MenuItemLink text="Collapse" to="/seriui/ui-elements/collapse"/>
                </MenuItem>
                <MenuItem>
                    <MenuItemLink text="Dropdowns" to="/seriui/ui-elements/dropdowns"/>
                </MenuItem>
                <MenuItem>
                    <MenuItemLink text="List group" to="/seriui/ui-elements/list-group"/>
                </MenuItem>
                <MenuItem>
                    <MenuItemLink text="Modal" to="/seriui/ui-elements/modal"/>
                </MenuItem>
                <MenuItem>
                    <MenuItemLink text="Tabs" to="/seriui/ui-elements/tabs"/>
                </MenuItem>
                <MenuItem>
                    <MenuItemLink text="Offcanvas" to="/seriui/ui-elements/offcanvas"/>
                </MenuItem>
                <MenuItem>
                    <MenuItemLink text="Pagination" to="/seriui/ui-elements/pagination"/>
                </MenuItem>
                <MenuItem>
                    <MenuItemLink text="Placeholders" to="/seriui/ui-elements/placeholders"/>
                </MenuItem>
                <MenuItem>
                    <MenuItemLink text="Popovers" to="/seriui/ui-elements/popovers"/>
                </MenuItem>
                <MenuItem>
                    <MenuItemLink text="Progress" to="/seriui/ui-elements/progress"/>
                </MenuItem>
                <MenuItem>
                    <MenuItemLink text="Spinners" to="/seriui/ui-elements/spinners"/>
                </MenuItem>
                <MenuItem>
                    <MenuItemLink text="Toasts" to="/seriui/ui-elements/toasts"/>
                </MenuItem>
                <MenuItem>
                    <MenuItemLink text="Tooltips" to="/seriui/ui-elements/tooltips"/>
                </MenuItem>
                <MenuItem sub>
                    <MenuItemLink text="Utilities" onClick={menuToggle} sub/>
                    <MenuSub>
                        <MenuItem>
                            <MenuItemLink text="Miscellaneous" to="/seriui/utilities/misc"/>
                        </MenuItem>
                        <MenuItem>
                            <MenuItemLink text="Typography" to="/seriui/utilities/typography"/>
                        </MenuItem>
                        <MenuItem>
                            <MenuItemLink text="Images" to="/seriui/utilities/images"/>
                        </MenuItem>
                        <MenuItem>
                            <MenuItemLink text="Tables" to="/seriui/utilities/tables"/>
                        </MenuItem>
                        <MenuItem>
                            <MenuItemLink text="Background" to="/seriui/utilities/background"/>
                        </MenuItem>
                        <MenuItem>
                            <MenuItemLink text="Borders" to="/seriui/utilities/borders"/>
                        </MenuItem>
                        <MenuItem>
                            <MenuItemLink text="Colors" to="/seriui/utilities/colors"/>
                        </MenuItem>
                        <MenuItem>
                            <MenuItemLink text="Flex" to="/seriui/utilities/flex"/>
                        </MenuItem>
                        <MenuItem>
                            <MenuItemLink text="Sizing" to="/seriui/utilities/sizing"/>
                        </MenuItem>
                        <MenuItem>
                            <MenuItemLink text="Spacing" to="/seriui/utilities/spacing"/>
                        </MenuItem>
                    </MenuSub>
                </MenuItem>
                <MenuItem sub>
                    <MenuItemLink text="Layout" onClick={menuToggle} sub/>
                    <MenuSub>
                        <MenuItem>
                            <MenuItemLink text="Breakpoints" to="/seriui/layout/breakpoints"/>
                        </MenuItem>
                        <MenuItem>
                            <MenuItemLink text="Containers" to="/seriui/layout/containers"/>
                        </MenuItem>
                        <MenuItem>
                            <MenuItemLink text="Gutters" to="/seriui/layout/gutters"/>
                        </MenuItem>
                    </MenuSub>
                </MenuItem>
            </MenuSub>
        </MenuItem>
        <MenuItem sub>
            <MenuItemLink icon="package" text="Forms" onClick={menuToggle} sub/>
            <MenuSub>
                <MenuItem>
                    <MenuItemLink text="Form Controls" to="/seriui/forms/form-control"/>
                </MenuItem>
                <MenuItem>
                    <MenuItemLink text="Form Select" to="/seriui/forms/form-select"/>
                </MenuItem>
                <MenuItem>
                    <MenuItemLink text="Date & Time picker" to="/seriui/forms/date-time"/>
                </MenuItem>
                <MenuItem>
                    <MenuItemLink text="Form Upload" to="/seriui/forms/form-upload"/>
                </MenuItem>
                <MenuItem>
                    <MenuItemLink text="Input Group" to="/seriui/forms/input-group"/>
                </MenuItem>
                <MenuItem>
                    <MenuItemLink text="Floating Labels" to="/seriui/forms/floating-labels"/>
                </MenuItem>
                <MenuItem>
                    <MenuItemLink text="Checks and radios" to="/seriui/forms/checks-radios"/>
                </MenuItem>
                <MenuItem>
                    <MenuItemLink text="Form Range" to="/seriui/forms/form-range"/>
                </MenuItem>
                <MenuItem>
                    <MenuItemLink text="Form Validation" to="/seriui/forms/form-validation"/>
                </MenuItem>
                <MenuItem>
                    <MenuItemLink text="Form Layout" to="/seriui/forms/form-layout"/>
                </MenuItem>
                <MenuItem sub>
                    <MenuItemLink text="Rich Editors" onClick={menuToggle} sub/>
                    <MenuSub>
                        <MenuItem>
                            <MenuItemLink text="Quill" to="/seriui/editors/quill"/>
                        </MenuItem>
                        <MenuItem>
                            <MenuItemLink text="Tinymce" to="/seriui/editors/tinymce"/>
                        </MenuItem>
                    </MenuSub>
                </MenuItem>
            </MenuSub>
        </MenuItem>
        <MenuItem>
            <MenuItemLink icon="dot-box" text="Icons" to="/seriui/icons"/>
        </MenuItem>
        <MenuItem>
            <MenuItemLink icon="table-view" text="Data tables" to="/seriui/data-table"/>
        </MenuItem>
        <MenuItem>
            <MenuItemLink icon="pie" text="Charts" to="/seriui/charts"/>
        </MenuItem>
        <MenuItem>
            <MenuItemLink icon="alert-c" text="Sweetalert" to="/seriui/sweetalert"/>
        </MenuItem>
        <MenuHeading text="misc pages" />
        <MenuItem sub>
            <MenuItemLink icon="signin" text="Auth Pages" onClick={menuToggle} sub/>
            <MenuSub>
                <MenuItem>
                    <MenuItemLink text="Auth Register" to="/seriui/auths/auth-register"/>
                    <MenuItemLink text="Auth Login" to="/seriui/auths/auth-login"/>
                    <MenuItemLink text="Forgot Password" to="/seriui/auths/auth-reset"/>
                </MenuItem>
            </MenuSub>
        </MenuItem>
        <MenuItem>
            <MenuItemLink icon="files" text="Page 404" to="/seriui/not-found"/>
        </MenuItem> */}
    </MenuList>
  );
}

export default Menu;
