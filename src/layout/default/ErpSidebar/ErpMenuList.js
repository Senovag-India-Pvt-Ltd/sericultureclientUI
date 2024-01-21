import React, { useEffect, useState } from "react";
import classNames from "classnames";

// import getParents from '../../../utilities/getParents';
import slideUp from "../../../utilities/slideUp";
import slideDown from "../../../utilities/slideDown";
import getParents from "../../../utilities/getParents";

import { NavLink, Link } from "react-router-dom";
import { settingsMenuData } from "../../../store/menus/menuData";
import { Block } from "../../../components";
// import {modulesData, crmModulesData, accountsModulesData} from '../../store/module/ModuleData.js';

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

function MenuItemLink({ text, icon, sub, to, blank, onClick, className }) {
  const compClass = classNames({
    "nk-menu-link": true,
    [className]: className,
  });
  return (
    <>
      {!blank && !sub && (
        <NavLink className={compClass} to={to}>
          <MenuItemTemplate icon={icon} text={text} />
        </NavLink>
      )}
      {blank && (
        <Link className={compClass} to={to} target="_blank">
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

function MenuList({ className, ...props }) {
  const compClass = classNames({
    "nk-menu": true,
    [className]: className,
  });
  return <ul className={compClass}>{props.children}</ul>;
}

function MenuSub({ mega, className, ...props }) {
  const compClass = classNames({
    "nk-menu-sub": true,
    [className]: className,
  });
  return <ul className={compClass}>{props.children}</ul>;
}

// function MenuList({className, ...props }) {
//     const compClass = classNames({
//         'nk-menu': true,
//         [className]: className
//     });
//     return (
//         <ul className={compClass}>
//             {props.children}
//         </ul>
//     )
// }

function ErpMenuList() {
  // set ModuleData to state
  const [menuRows, setMenuRows] = useState([]);

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

    //set sidemenu
    if (localStorage.getItem("sidemenu") === "settings") {
      setMenuRows(settingsMenuData);
    }
  }, [null]);

  return (
    <>
      <Block>
        {TestDiv()}

        {/* menuRows.map(function (menuRow) {
                    console.log(menuRow.menuList)
                } */}
      </Block>

      {/* <Block>
            {
                menuRows.map(function (menuRow) {
                    // console.log(menuRow.menuList.length)
                    return ( 
                        <>
                            <MenuItemLink icon="home" text="Home" to="/home"/>
                            <MenuHeading text={menuRow.menuHeading} key={menuRow.id}/> 
                            <MenuItem sub>
                            {
                                
                                menuRow.menuList.map(function (menuListRow) {
                                    
                                    if(menuListRow.subMenu.length > 0 ) {
                                        console.log(menuListRow.subMenu.length)
                                        
                                        
                                            return(
                                                <>
                                                    <MenuItemLink icon="home" text="Home" to="/home"/>
                                                    <MenuItemLink icon="users" text="User Management11" onClick={menuToggle} sub/>
                                                    <MenuSub>
                                                        <MenuItem>
                                                            <MenuItemLink text="Users List" to="/user-manage/user-list"/>
                                                        </MenuItem>
                                                        <MenuItem>
                                                            <MenuItemLink text="Users Cards" to="/user-manage/user-cards"/>
                                                        </MenuItem>
                                                        <MenuItem>
                                                            <MenuItemLink text="User Profile" to="/user-manage/user-profile/uid01"/>
                                                        </MenuItem>
                                                        <MenuItem>
                                                            <MenuItemLink text="User Edit" to="/user-manage/user-edit/uid01"/>
                                                        </MenuItem>
                                                    </MenuSub>
                                                    </>
                                                
                                            ) 
                                        
                                        
                                    } else {
                                        
                                        
                                    }
                                    
                                    
                                })
                                
                            }
                            </MenuItem>
                        </>
                    )
                    
                }) 
            }
        </Block> */}

      {/* <MenuItem sub>
                <MenuItemLink icon="home" text="Home" to="/home" />
                <MenuItemLink icon="dashboard" text="Dashboard" onClick={menuToggle} sub />
                <MenuSub>
                    <MenuItem>
                        <MenuItemLink text="Default" to="/home" />
                    </MenuItem>
                    <MenuItem>
                        <MenuItemLink text="CRM" to="/home-ecommerce" />
                    </MenuItem>
                    <MenuItem>
                        <MenuItemLink text="Projects" to="/home-project" />
                    </MenuItem>
                    <MenuItem>
                        <MenuItemLink text="Sales" to="/home-project" />
                    </MenuItem>
                    <MenuItem>
                        <MenuItemLink text="Accounts" to="/home-marketing" />
                    </MenuItem>
                    <MenuItem>
                        <MenuItemLink text="Production" to="/home-nft" />
                    </MenuItem>
                </MenuSub>
            </MenuItem>
            <MenuHeading text="CONTROL PANEL" />

            <MenuItem sub>
                <MenuItemLink icon="users" text="User Management" onClick={menuToggle} sub />
                <MenuSub>
                    <MenuItem>
                        <MenuItemLink text="Users List" to="/user-manage/user-list" />
                    </MenuItem>
                    <MenuItem>
                        <MenuItemLink text="Users Cards" to="/user-manage/user-cards" />
                    </MenuItem>
                    <MenuItem>
                        <MenuItemLink text="User Profile" to="/user-manage/user-profile/uid01" />
                    </MenuItem>
                    <MenuItem>
                        <MenuItemLink text="User Edit" to="/user-manage/user-edit/uid01" />
                    </MenuItem>
                </MenuSub>
            </MenuItem>
            <MenuItem sub>
                <MenuItemLink icon="bag" text="Category" onClick={menuToggle} sub />
                <MenuSub>
                    <MenuItem>
                        <MenuItemLink text="Categories" to="/ecommerce/categories" />
                    </MenuItem>
                    <MenuItem>
                        <MenuItemLink text="Add Category" to="/ecommerce/add-category" />
                    </MenuItem>
                </MenuSub>
            </MenuItem>
            <MenuItem sub>
                <MenuItemLink icon="bag" text="Product" onClick={menuToggle} sub />
                <MenuSub>
                    <MenuItem>
                        <MenuItemLink text="Products" to="/ecommerce/products" />
                    </MenuItem>
                    <MenuItem>
                        <MenuItemLink text="Add Product" to="/ecommerce/add-product" />
                    </MenuItem>
                </MenuSub>
            </MenuItem>
            <MenuItem sub>
                <MenuItemLink icon="bag" text="Production" onClick={menuToggle} sub />
                <MenuSub>
                    <MenuItem>
                        <MenuItemLink text="Manufacturing order" to="/production/manufacturing-order" />
                    </MenuItem>
                </MenuSub>
            </MenuItem>

            <MenuHeading text="CRM" />
            <MenuItem sub>
                <MenuItemLink icon="report" text="Case" onClick={menuToggle} sub />
                <MenuSub>
                    <MenuItem>
                        <MenuItemLink text="Case" to="/crm/case" />
                    </MenuItem>
                    <MenuItem>
                        <MenuItemLink text="Case Task" to="/crm/case-task" />
                    </MenuItem>
                    <MenuItem>
                        <MenuItemLink text="Escalate Case" to="/crm/escalate-case" />
                    </MenuItem>
                </MenuSub>
                <MenuItemLink icon="task" text="Task" onClick={menuToggle} sub />
                <MenuSub>
                    <MenuItem>
                        <MenuItemLink text="Task" to="/crm/task" />
                    </MenuItem>
                    <MenuItem>
                        <MenuItemLink text="Escalate Task" to="/crm/escalate-task" />
                    </MenuItem>
                </MenuSub>

                <MenuItemLink icon="user" text="Lead" to="/crm/lead" />

            </MenuItem>

            <MenuHeading text="Production" />
            <MenuItem sub>
                <MenuItemLink icon="package-fill" text="Produciton" onClick={menuToggle} sub />
                <MenuSub>
                    <MenuItem>
                        <MenuItemLink text="Bill of Material" to="/production/bill-of-material" />
                    </MenuItem>
                    <MenuItem>
                        <MenuItemLink text="Manufacturing Order" to="/production/manufacturing-order" />
                    </MenuItem>
                </MenuSub>
            </MenuItem>

            <MenuHeading text="Master" />
            <MenuItem sub>
                <MenuItemLink icon="reports" text="Master" onClick={menuToggle} sub />
                <MenuSub>
                    <MenuItem>
                        <MenuItemLink text="User Group" to="/masters/user-group" />
                    </MenuItem>
                    <MenuItem>
                        <MenuItemLink text="Company" to="/masters/company-list" />
                    </MenuItem>
                    <MenuItem>
                        <MenuItemLink text="Billing Address" to="/masters/billing-address" />
                    </MenuItem>
                    <MenuItem>
                        <MenuItemLink text="Bank Details" to="/masters/bank-details" />
                    </MenuItem>
                    <MenuItem>
                        <MenuItemLink text="Payment Terms" to="/masters/payment-terms" />
                    </MenuItem>
                    <MenuItem>
                        <MenuItemLink text="Terms And Conditions" to="/masters/terms-and-conditions" />
                    </MenuItem>
                    <MenuItem>
                        <MenuItemLink text="Unit of Measurement" to="/masters/unit-of-measurements" />
                    </MenuItem>
                    <MenuItem sub>
                        <MenuItemLink text="Inventory" onClick={menuToggle} sub />
                        <MenuSub>
                            < MenuItem >
                                <MenuItemLink text="Store" to="/masters/stores" />
                            </MenuItem >
                            <MenuItem>
                                <MenuItemLink text="Item" to="/masters/item" />
                            </MenuItem>
                        </MenuSub>
                    </MenuItem>

                </MenuSub>
            </MenuItem> */}
    </>
  );
}

function TestDiv() {
  if (localStorage.getItem("sidemenu") === "my-dashboard") {
    return (
      <MenuList>
        {/* <MenuHeading className="text-center" text="Modules" /> */}
        <MenuItem sub>
          {/* <MenuItemLink icon="home" text="Home" to="/home" /> */}

          {/* <MenuItemLink icon="home" text="Home" to="/home" /> */}
          <MenuItemLink
            icon="home"
            text="Stake Holder Registration"
            onClick={menuToggle}
            sub
          />
          <MenuSub>
            <MenuItem>
              <MenuItemLink
                text="Farmer Registration"
                to="/stake-holder-registration"
              />
            </MenuItem>
            <MenuItem>
              <MenuItemLink
                text="Reeler License"
                to="/issue-new-reeler-license"
              />
            </MenuItem>
            <MenuItem>
              <MenuItemLink
                text="Renewal of Reeler License"
                to="/renew-reeler-license"
              />
            </MenuItem>
            <MenuItem>
              <MenuItemLink
                text="Transfer of Reeler License"
                to="/transfer-reeler-license"
              />
            </MenuItem>
            <MenuItem>
              <MenuItemLink
                text="Trader License"
                to="/issue-new-trader-license"
              />
            </MenuItem>
            <MenuItem>
              <MenuItemLink
                text="RSP/CRC/NSSO Registration"
                to="/external-unit-registration"
              />
            </MenuItem>
          </MenuSub>
        </MenuItem>

        <MenuItem sub>
          <MenuItemLink icon="hot" text="Services" onClick={menuToggle} sub />
          <MenuSub>
            <MenuItem>
              <MenuItemLink text="Subsidy Programmes" to="/subsidy-programs" />
            </MenuItem>
            <MenuItem>
              <MenuItemLink
                text="Track DFL Procurement"
                to="/track-dfl-procurement"
              />
            </MenuItem>
            <MenuItem>
              <MenuItemLink
                text="Track Mulberry Status"
                to="/track-mulberry-status"
              />
            </MenuItem>
            <MenuItem>
              <MenuItemLink
                text="Supply Of Disinfectants"
                to="/supply-disinfectants"
              />
            </MenuItem>
            <MenuItem>
              <MenuItemLink
                text="Apply Incentives"
                to="/providing-incentives"
              />
            </MenuItem>
            <MenuItem>
              <MenuItemLink text="Apply Subsidy" to="/providing-subsidy" />
            </MenuItem>
            <MenuItem>
              <MenuItemLink
                text="Providing Chawki Rearing incentives"
                to="/providing-chawki-incentives"
              />
            </MenuItem>
            <MenuItem>
              <MenuItemLink
                text="Preparation of DC Bills"
                to="/preparation-dc-bills"
              />
            </MenuItem>
            <MenuItem>
              <MenuItemLink
                text="Apply incentives to Reelers"
                to="/providing-reeler-incentives"
              />
            </MenuItem>
            <MenuItem>
              <MenuItemLink
                text="Apply subsidy to the Reelers"
                to="/providing-reeler-subsidy"
              />
            </MenuItem>
          </MenuSub>
        </MenuItem>

        <MenuItem sub>
          <MenuItemLink
            icon="puzzle"
            text="Direct Benefit Tranfer"
            onClick={menuToggle}
            sub
          />
          <MenuSub>
            <MenuItem>
              <MenuItemLink
                text="Subsidy Verification"
                to="/subsidy-approval-verification"
              />
            </MenuItem>
            <MenuItem>
              <MenuItemLink
                text="Subsidy Sanction"
                to="/subsidy-sanction"
              />
            </MenuItem>
            <MenuItem>
              <MenuItemLink
                text="Subsidy Drawing"
                to="/subsidy-drawing"
              />
            </MenuItem>
            <MenuItem>
              <MenuItemLink
                text="Subsidy Counter Signing"
                to="/subsidy-counter-sign"
              />
            </MenuItem>
          </MenuSub>
        </MenuItem>

        <MenuItemLink
          icon="chevron-down-circle"
          text="Market & Auction"
          to="/home-project"
        />

        <MenuItem sub>
          <MenuItemLink
            icon="check-c"
            text="Seed and DFL"
            onClick={menuToggle}
            sub
          />
          <MenuSub>
            <MenuItem>
              <MenuItemLink
                text="Maintenance of mulberry farm"
                to="/maintenance-mulberry-farm"
              />
            </MenuItem>
            <MenuItem>
              <MenuItemLink
                text="Receipt of DFLs from the grainage"
                to="/receipt-of-dfls"
              />
            </MenuItem>
            <MenuItem>
              <MenuItemLink
                text="Maintenance of Line records "
                to="/maintenance-line-record"
              />
            </MenuItem>
            <MenuItem>
              <MenuItemLink
                text="Maintenance of batch records "
                to="/maintenance-batch-record"
              />
            </MenuItem>
            <MenuItem>
              <MenuItemLink
                text="Dispatch of Cocoons to P4 Grainage "
                to="/dispatch-cocoon"
              />
            </MenuItem>
            <MenuItem>
              <MenuItemLink
                text="Rearing of DFLs for the 8 lines "
                to="/rearing-dfls"
              />
            </MenuItem>
            <MenuItem>
              <MenuItemLink
                text="Preservation of cocoon"
                to="/preservation-cocoon"
              />
            </MenuItem>
            <MenuItem>
              <MenuItemLink text="Preparation of eggs" to="/preparation-eggs" />
            </MenuItem>
            <MenuItem>
              <MenuItemLink text="Maintenance of eggs" to="/maintenance-eggs" />
            </MenuItem>
            <MenuItem>
              <MenuItemLink text="Cold Storage Schedule " to="/cold-storage" />
            </MenuItem>
            <MenuItem>
              <MenuItemLink text="Sale / Disposal of DFL’s" to="/sale-dfl" />
            </MenuItem>
            <MenuItem>
              <MenuItemLink text="Testing of moth / pupa" to="/testing-moth" />
            </MenuItem>
            <MenuItem>
              <MenuItemLink
                text="Maintenance of Pierced Cocoons"
                to="/pierced-Cocoons"
              />
            </MenuItem>
            <MenuItem>
              <MenuItemLink
                text="Sale/Disposal of Pierced Cocoons"
                to="/sale-Cocoons"
              />
            </MenuItem>
            <MenuItem>
              <MenuItemLink
                text="Maintenance of egg layings sheets"
                to="/maintenance-sheets"
              />
            </MenuItem>
            <MenuItem>
              <MenuItemLink
                text="Remittance (Eggs / PC / Others)"
                to="/remittance"
              />
            </MenuItem>
          </MenuSub>
        </MenuItem>

        <MenuItem sub>
          <MenuItemLink
            icon="move"
            text="Garden Management"
            onClick={menuToggle}
            sub
          />
          <MenuSub>
            <MenuItem>
              <MenuItemLink
                text="Maintenance of mulberry farm"
                to="/garden-mulberry-farm"
              />
            </MenuItem>
            <MenuItem>
              <MenuItemLink
                text="Receipt of DFL’s from the Grainage"
                to="/garden-receipt-dfl"
              />
            </MenuItem>
            <MenuItem>
              <MenuItemLink text="Rearing of DFL’s" to="/garden-rearing-dfl" />
            </MenuItem>
            <MenuItem>
              <MenuItemLink
                text="Supply of Cocoons to Grainage"
                to="/supply-cocoon-grainage"
              />
            </MenuItem>
            <MenuItem>
              <MenuItemLink
                text="Sale of Nursery to Farmers"
                to="/sale-nursery-farmer"
              />
            </MenuItem>
            <MenuItem>
              <MenuItemLink text="Seed cutting bank" to="/seed-cutting-bank" />
            </MenuItem>
          </MenuSub>
        </MenuItem>

        <MenuItem sub>
          <MenuItemLink
            icon="shield-check"
            text="Chawki Management"
            onClick={menuToggle}
            sub
          />
          <MenuSub>
            <MenuItem>
              <MenuItemLink
                text="Sale of Chawki worms to Farmers"
                to="/sale-chawki-worms"
              />
            </MenuItem>
          </MenuSub>
        </MenuItem>

        <MenuItem sub>
          <MenuItemLink
            icon="globe"
            text="Target Setting"
            onClick={menuToggle}
            sub
          />
          <MenuSub>
            <MenuItem>
              <MenuItemLink
                text="Assigning Yearly Targets"
                to="/attribute-assigning"
              />
            </MenuItem>
          </MenuSub>
        </MenuItem>

        <MenuItem sub>
          <MenuItemLink
            icon="note-add-c"
            text="Inspection"
            onClick={menuToggle}
            sub
          />
          <MenuSub>
            <MenuItem>
              <MenuItemLink
                text="Tracking status of Mulberry"
                to="/track-current-status"
              />
            </MenuItem>
            <MenuItem>
              <MenuItemLink
                text="Supply of disinfectants to farmers"
                to="/inspect-supply-disinfectants"
              />
            </MenuItem>
            <MenuItem>
              <MenuItemLink
                text="Implementation of MGNREGA"
                to="/implementation-mgnrega"
              />
            </MenuItem>
          </MenuSub>
        </MenuItem>

        <MenuItem sub>
          <MenuItemLink icon="map" text="Training" onClick={menuToggle} sub />
          <MenuSub>
            <MenuItem>
              <MenuItemLink
                text="Cocoon Handicraft Training"
                to="/attribute-undertaking-training"
              />
            </MenuItem>
            <MenuItem>
              <MenuItemLink
                text="Workshops or Department training "
                to="/attribute-foundation-courses"
              />
            </MenuItem>
            <MenuItem>
              <MenuItemLink text="Physical Target" to="/" />
            </MenuItem>
            <MenuItem>
              <MenuItemLink text="Financial Target" to="/" />
            </MenuItem>
          </MenuSub>
        </MenuItem>

        <MenuItemLink
          icon="user-circle"
          text="Admin and Reports"
          to="/technician-dashboard"
        />

        <MenuItem sub>
          <MenuItemLink
            icon="headphone"
            text="Helpdesk"
            onClick={menuToggle}
            sub
          />
          <MenuSub>
            <MenuItem>
              <MenuItemLink text="Raise a Ticket" to="/raise-ticket" />
            </MenuItem>
            <MenuItem>
              <MenuItemLink text="Dashboard" to="/helpdesk-dashboard" />
            </MenuItem>
            <MenuItem>
              <MenuItemLink text="My Tickets" to="/my-tickets" />
            </MenuItem>
          </MenuSub>
        </MenuItem>

        <MenuItem sub>
          <MenuItemLink icon="globe" text="Master" onClick={menuToggle} sub />
          <MenuSub>
            <MenuItem>
              <MenuItemLink
                text="Create head of Account"
                to="/head-of-account"
              />
            </MenuItem>
            <MenuItem>
              <MenuItemLink text="Caste" to="/caste" />
            </MenuItem>
            <MenuItem>
              <MenuItemLink text="Roles" to="/roles" />
            </MenuItem>
            <MenuItem>
              <MenuItemLink text="Configure Subsidy" to="/configure-subsidy" />
            </MenuItem>
            <MenuItem>
              <MenuItemLink text="Scheme" to="/scheme" />
            </MenuItem>
            <MenuItem>
              <MenuItemLink text="Sub Scheme" to="/sub-scheme" />
            </MenuItem>
          </MenuSub>
        </MenuItem>

        <MenuItemLink icon="signout" text="Log Out" to="/" className="mt-5" />
      </MenuList>
    );
  }

  if (localStorage.getItem("sidemenu") === "crm") {
    return (
      <>
        <MenuItemLink icon="home" text="Home" to="/home" />
        <MenuHeading text="CRM" />
        <MenuItem sub>
          <MenuItemLink icon="report" text="Case" onClick={menuToggle} sub />
          <MenuSub>
            <MenuItem>
              <MenuItemLink text="Case" to="/crm/case" />
            </MenuItem>
            <MenuItem>
              <MenuItemLink text="Case Task" to="/crm/case-task" />
            </MenuItem>
            <MenuItem>
              <MenuItemLink text="Escalate Case" to="/crm/escalate-case" />
            </MenuItem>
          </MenuSub>
          <MenuItemLink icon="task" text="Task" onClick={menuToggle} sub />
          <MenuSub>
            <MenuItem>
              <MenuItemLink text="Task" to="/crm/task" />
            </MenuItem>
            <MenuItem>
              <MenuItemLink text="Escalate Task" to="/crm/escalate-task" />
            </MenuItem>
          </MenuSub>

          <MenuItemLink icon="user" text="Lead" to="/crm/lead" />
        </MenuItem>
      </>
    );
  }

  if (localStorage.getItem("sidemenu") === "procurement") {
    return (
      <>
        <MenuItem sub>
          <MenuItemLink icon="home" text="Home" to="/home" />
          <MenuHeading text="Procurement" />
        </MenuItem>
      </>
    );
  }

  if (localStorage.getItem("sidemenu") === "sales") {
    return (
      <>
        <MenuItem sub>
          <MenuItemLink icon="home" text="Home" to="/home" />
          <MenuHeading text="Sales" />
        </MenuItem>
      </>
    );
  }

  if (localStorage.getItem("sidemenu") === "inventory") {
    return (
      <>
        <MenuItem sub>
          <MenuItemLink icon="home" text="Home" to="/home" />
          <MenuItemLink
            icon="building"
            text="Master"
            onClick={menuToggle}
            sub
          />
          <MenuSub>
            <MenuItem>
              <MenuItemLink text="UoM" to="/masters/unit-of-measurements" />
            </MenuItem>
          </MenuSub>
          <MenuHeading text="Inventory" />
          <MenuItemLink
            icon="building"
            text="Inventory"
            onClick={menuToggle}
            sub
          />
          <MenuSub>
            {/* <MenuItem>
                            <MenuItemLink text="UoM" to="/masters/unit-of-measurements" />
                        </MenuItem> */}
            <MenuItem>
              <MenuItemLink text="Item" to="/masters/item" />
            </MenuItem>
            <MenuItem>
              <MenuItemLink text="Product" to="/ecommerce/products" />
            </MenuItem>
            <MenuItem>
              <MenuItemLink text="Categories" to="/ecommerce/categories" />
            </MenuItem>
            <MenuItem>
              <MenuItemLink
                text="Inventory History"
                to="/masters/inventory-history"
              />
            </MenuItem>
            <MenuItem>
              <MenuItemLink
                text="Stock Transfer"
                to="/masters/stock-transfer"
              />
            </MenuItem>
          </MenuSub>
        </MenuItem>
      </>
    );
  }

  if (localStorage.getItem("sidemenu") === "accounts") {
    return (
      <>
        <MenuItemLink icon="home" text="Home" to="/home" />
        <MenuHeading text="Accounts" />
        <MenuItem sub>
          <MenuItemLink icon="user" text="Accounts" onClick={menuToggle} sub />
          <MenuSub>
            <MenuItem>
              <MenuItemLink text="Bank Details" to="/masters/bank-details" />
            </MenuItem>
            <MenuItem>
              <MenuItemLink text="Payment Terms" to="/masters/payment-terms" />
            </MenuItem>
            <MenuItem>
              <MenuItemLink
                text="Terms and Conditions"
                to="/masters/terms-and-conditions"
              />
            </MenuItem>
          </MenuSub>
        </MenuItem>
      </>
    );
  }

  if (localStorage.getItem("sidemenu") === "production") {
    return (
      <>
        <MenuItemLink icon="home" text="Home" to="/home" />
        <MenuHeading text="Production" />
        <MenuItem sub>
          <MenuItemLink
            icon="package-fill"
            text="Production"
            onClick={menuToggle}
            sub
          />
          <MenuSub>
            <MenuItem>
              <MenuItemLink text="Store" to="/masters/stores" />
            </MenuItem>
            <MenuItem>
              <MenuItemLink
                text="Bill of Material"
                to="/production/bill-of-material"
              />
            </MenuItem>
            <MenuItem>
              <MenuItemLink
                text="Manufacturing Order"
                to="/production/manufacturing-order"
              />
            </MenuItem>
          </MenuSub>
        </MenuItem>
      </>
    );
  }

  if (localStorage.getItem("sidemenu") === "hr") {
    return (
      <>
        <MenuItem sub>
          <MenuItemLink icon="home" text="Home" to="/home" />
          <MenuHeading text="HR" />
          <MenuItem sub>
            <MenuItemLink
              icon="users"
              text="User Management"
              onClick={menuToggle}
              sub
            />
            <MenuSub>
              <MenuItem>
                <MenuItemLink text="Users List" to="/user-manage/user-list" />
              </MenuItem>
              <MenuItem>
                <MenuItemLink text="Users Cards" to="/user-manage/user-cards" />
              </MenuItem>
              <MenuItem>
                <MenuItemLink text="User Group" to="/masters/user-group" />
              </MenuItem>
              <MenuItem>
                <MenuItemLink
                  text="User Edit"
                  to="/user-manage/user-edit/uid01"
                />
              </MenuItem>
            </MenuSub>
          </MenuItem>
        </MenuItem>
      </>
    );
  }

  if (localStorage.getItem("sidemenu") === "supply") {
    return (
      <>
        <MenuItem sub>
          <MenuItemLink icon="home" text="Home" to="/home" />
          <MenuHeading text="Supply" />
        </MenuItem>
      </>
    );
  }

  if (localStorage.getItem("sidemenu") === "settings") {
    return (
      <>
        <MenuItem sub>
          <MenuItemLink icon="home" text="Home" to="/home" />
          <MenuHeading text="Settings" />
        </MenuItem>
      </>
    );
  }

  if (localStorage.getItem("sidemenu") === "reports") {
    return (
      <>
        <MenuItem sub>
          <MenuItemLink icon="home" text="Home" to="/home" />
          <MenuHeading text="Reports" />
        </MenuItem>
      </>
    );
  }

  if (localStorage.getItem("sidemenu") === "admin") {
    return (
      <MenuList>
        <MenuItem sub>
          <MenuItem>
            <MenuItemLink icon="home" text="Home" to="/home" />
          </MenuItem>
          <MenuHeading text="Admin" />
          <MenuItem sub>
            <MenuItemLink
              icon="users"
              text="User Management"
              onClick={menuToggle}
              sub
            />
            <MenuSub>
              <MenuItem>
                <MenuItemLink text="Users List" to="/user-manage/user-list" />
              </MenuItem>
              <MenuItem>
                <MenuItemLink text="Users Cards" to="/user-manage/user-cards" />
              </MenuItem>
              <MenuItem>
                <MenuItemLink text="User Group" to="/masters/user-group" />
              </MenuItem>
              <MenuItem>
                <MenuItemLink
                  text="User Edit"
                  to="/user-manage/user-edit/uid01"
                />
              </MenuItem>
            </MenuSub>
          </MenuItem>
          <MenuItem>
            <MenuItemLink icon="ticket" text="Request" to="/request" />
          </MenuItem>
          <MenuItem>
            <MenuItemLink
              icon="shield-check"
              text="Service Type"
              to="/masters/service-type"
            />
          </MenuItem>
        </MenuItem>
      </MenuList>
    );
  }
}

export default ErpMenuList;
