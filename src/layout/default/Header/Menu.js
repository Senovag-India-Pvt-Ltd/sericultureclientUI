import React, { useState, useEffect } from "react";
import classNames from "classnames";

import slideUp from "../../../utilities/slideUp";
import slideDown from "../../../utilities/slideDown";
import getParents from "../../../utilities/getParents";
import { useTranslation } from "react-i18next";

import { useLayout } from "../LayoutProvider";

import { NavLink, Link } from "react-router-dom";
import { createPopper } from "@popperjs/core";

import { Icon, Media, MediaText, MediaGroup, Image } from "../../../components";

import { headerModulesData } from "../../../store/module/HeaderModuleData";
import api from "../../../../src/services/auth/api";

import {
  modulesData,
  crmModulesData,
  accountsModulesData,
} from "../../../store/module/ModuleData.js";
import axios from "axios";

function MenuItemTemplate({ text, icon }) {
  return (
    <>
      {icon && (
        <span className="nk-nav-icon">
          <Icon name={icon}></Icon>
        </span>
      )}
      {text && (
        <span className="nk-nav-text" style={{ fontWeight: "bold" }}>
          {text}
        </span>
      )}
    </>
  );
}

function MenuItemLink({
  text,
  icon,
  sub,
  to,
  blank,
  onClick,
  onMouseEnter,
  className,
  ...props
}) {
  const compClass = classNames({
    "nk-nav-link": true,
    "nk-nav-toggle": sub,
    [className]: className,
  });
  return (
    <>
      {!blank && !sub && (
        <NavLink className={compClass} to={to}>
          <MenuItemTemplate icon={icon} text={text} />
          {props.children}
        </NavLink>
      )}
      {blank && (
        <Link className={compClass} to={to} target="_blank">
          <MenuItemTemplate icon={icon} text={text} />
          {props.children}
        </Link>
      )}
      {sub && (
        <a
          className={compClass}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          href="#expand"
        >
          <MenuItemTemplate icon={icon} text={text} />
          {props.children}
        </a>
      )}
    </>
  );
}

function MenuItem({ sub, className, ...props }) {
  const compClass = classNames({
    "nk-nav-item": true,
    "has-sub": sub,
    [className]: className,
  });
  return <li className={compClass}>{props.children}</li>;
}

function MenuSub({ mega, size, megaSize, className, megaClassName, ...props }) {
  const compClass = classNames({
    "nk-nav-sub": true,
    [`nk-nav-sub-${size}`]: size,
    [className]: className,
  });
  const megaClass = classNames({
    "nk-nav-mega": true,
    [`nk-nav-mega-${megaSize}`]: megaSize,
    [megaClassName]: megaClassName,
  });
  return (
    <>
      {!mega && <ul className={compClass}>{props.children}</ul>}
      {mega && (
        <div className={compClass}>
          <div className={megaClass}>{props.children}</div>
        </div>
      )}
    </>
  );
}

function MenuList({ className, ...props }) {
  const compClass = classNames({
    "nk-nav": true,
    [className]: className,
  });
  return <ul className={compClass}>{props.children}</ul>;
}
const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const _header = {
  "Content-Type": "application/json",
  accept: "*/*",
  Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
};

function Menu() {
  const layout = useLayout();

  // set ModuleData to state
  const [moduleRows, setModuleRows] = useState([]);
  const [headerModuleRows, setHeaderModuleRows] = useState(headerModulesData);
  const [subMenu, setSubMenu] = useState({});

  const [data, setData] = useState([]);
  const [roleId, setRoleId] = useState(localStorage.getItem("roleId"));

  const getRoleMenuList = (_id) => {
    api
      .post(
        baseURL + `rp-role-association/get-by-role-id`,
        // { roleId: localStorage.getItem("roleId") },
        { roleId: _id }
      )
      .then((response) => {
        // saveSuccess();
        // alert("saved");
        const res = response.data.content.rpRoleAssociation;
        console.log("res", res);
        // const man =res.map((item)=>(
        //   item.value
        // ))
        if (res && res.length > 0) {
          const mapCodes = res.map((item) => item.mapCode).filter(Boolean);
          setData(mapCodes);
        } else {
          setData([]);
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

  useEffect(() => {
    getRoleMenuList(roleId);
  }, [roleId]);

  console.log(data);

  const [showMenu, setShowMenu] = useState({
    Registration: false,
    Registration_Farmer_Registration: false,
    Registration_Reeler_License: false,
    Registration_Renewal_of_Reeler_License: false,
    Registration_Transfer_of_Reeler_License: false,
    Registration_Trader_License: false,
    Registration_Nsso: false,

    Services: false,
    Services_Subsidy_Programmes: false,
    Services_Track_the_DFL_procurement: false,
    Services_Track_Mulberry_Status: false,
    Services_Supply_of_Disinfection: false,
    Services_Apply_Incentives: false,
    Services_Apply_Subsidy: false,
    Services_Providing_Chawki_Rearing_Incentives: false,
    Services_Providing_Incentives_To_Reelers: false,
    Services_Providing_Subsidy_To_Reelers: false,

    DBT: false,
    DBT_Subsidy_Verification: false,
    DBT_Subsidy_Sanction: false,
    DBT_Subsidy_Drawing: false,
    DBT_Subsidy_Counter_Signing: false,

    Market: false,
    Market_Register: false,
    Market_Bidding: false,
    Market_Auction: false,
    Market_Weighment: false,
    Market_Gatepass: false,
    Market_Reject: false,

    Market_Payment: false,
    Market_Payment_Ready_for_Payment: false,
    Market_Payment_Bulk_Send_To_Bank: false,
    Market_Payment_Bank_Statement: false,
    Market_Payment_IFSC_Update: false,

    Market_Permit: false,
    Market_Reject_Farmer_Auction: false,
    Market_Generate_Bidding_Slip: false,
    Market_Update_Lot_Weight: false,
    Market_Accept_Farmer_Auction: false,

    SeedDFL: false,
    SeedDFL_Kunigal: false,
    SeedDFL_Kunigal_mulberry_farm: false,
    SeedDFL_Kunigal_DFLs_from_the_P4_grainage: false,
    SeedDFL_Kunigal_Line_record_maintenance: false,
    SeedDFL_Kunigal_Screening_batch_record: false,
    SeedDFL_Kunigal_Cocoons_to_P4_Grainage: false,
    SeedDFL_Kunigal_DFLs_for_the_8_lines: false,

    SeedDFL_Grainages: false,
    SeedDFL_Grainages_Preservation_of_Cocoon: false,
    SeedDFL_Grainages_Preparation_of_Eggs: false,
    SeedDFL_Grainages_Eggs_At_Cold_Storage: false,
    SeedDFL_Cold_Storage_Schedule: false,
    SeedDFL_Grainages_Disposal_of_DFL: false,
    SeedDFL_Grainages_Testing_of_Moth: false,
    SeedDFL_Grainages_Maintenance_of_Pierced_Cocoons: false,
    SeedDFL_Grainages__Pierced_Cocoons: false,
    SeedDFL_Grainages_Egg_Layings_Sheets: false,
    SeedDFL_Grainages_Remittance: false,

    SeedDFL_Seed: false,
    SeedDFL_Seed_Preparation_of_Eggs: false,
    SeedDFL_Seed_Disposal_of_DFL: false,
    SeedDFL_Seed_Cold_Storage: false,

    GardenManagement: false,
    GardenManagement_Mulberry_Farm: false,
    GardenManagement_DFL_From_The_Grainage: false,
    GardenManagement_Rearing_of_DFL: false,
    GardenManagement_Cocoons_to_Grainage: false,
    GardenManagement_Sale_of_Nursery_to_Farmers: false,
    GardenManagement_Seed_Cutting_Bank: false,

    ChawkiManagement: false,
    ChawkiManagement_Chawki_Worms: false,

    TargetSetting: false,
    TargetSetting_Assigning_Yearly_Targets: false,

    Inspection: false,
    Inspection_Tracking_Status_of_Mulberry: false,
    Inspection_Supply_of_Disinfectants_to_Farmers: false,
    Inspection_Implementation_of_MGNREGA: false,

    Training: false,
    Training_Schedule: false,
    Training_Page: false,
    Training_Deputation_Tracker: false,

    Helpdesk: false,
    Helpdesk_Raise_a_Ticket: false,
    Helpdesk_Dashboard: false,
    Helpdesk_User_Dashboard: false,
    Helpdesk_My_Tickets: false,
    Helpdesk_FAQ: false,

    Admin: false,

    Admin_Master: false,

    Admin_Master_Registration: false,
    Admin_Master_Registration_Caste: false,
    Admin_Master_Registration_Roles: false,
    Admin_Master_Registration_Education: false,
    Admin_Master_Registration_Relationship: false,
    Admin_Master_Registration_State: false,
    Admin_Master_Registration_District: false,
    Admin_Master_Registration_Taluk: false,
    Admin_Master_Registration_Hobli: false,
    Admin_Master_Registration_Village: false,
    Admin_Master_Registration_Trader_Type: false,
    Admin_Master_Registration_Farmer_Type: false,
    Admin_Master_Registration_Working_Institution: false,
    Admin_Master_Registration_User: false,
    Admin_Master_Registration_Designation: false,

    Admin_Master_Land: false,

    Admin_Master_Land_Holding_Category: false,
    Admin_Master_Land_Irrigation_Source: false,
    Admin_Master_Land_Irrigation_Type: false,
    Admin_Master_Land_Ownership: false,
    Admin_Master_Land_Soil_Type: false,
    Admin_Master_Land_Rear_House_Roof_Type: false,
    Admin_Master_Land_Silk_Worm_Variety: false,
    Admin_Master_Land_Source_of_Mulberry: false,
    Admin_Master_Land_Mulberry_Variety: false,
    Admin_Master_Land_Subsidy_Details: false,
    Admin_Master_Land_Plantation_Type: false,
    Admin_Master_Land_Machine_Type: false,

    Admin_Master_Service: false,
    Admin_Master_Service_Program: false,
    Admin_Master_Service_Component: false,
    Admin_Master_Service_Head_of_Account: false,
    Admin_Master_Service_Reason_for_Lot_Cancellation: false,
    Admin_Master_Service_Reason_for_Bid_Rejection: false,

    Admin_Master_Training: false,
    Admin_Master_Training_Program: false,
    Admin_Master_Training_Course: false,
    Admin_Master_Training_Deputed_Institute: false,
    Admin_Master_Training_Group: false,
    Admin_Master_Training_Institution: false,
    Admin_Master_Training_Mode: false,
    Admin_Master_Training_Office: false,

    Admin_Master_HelpDesk: false,
    Admin_Master_HelpDesk_Module: false,
    Admin_Master_HelpDesk_Feature: false,
    Admin_Master_HelpDesk_Board_Category: false,
    Admin_Master_HelpDesk_Category: false,
    Admin_Master_HelpDesk_Sub_Category: false,
    Admin_Master_HelpDesk_Status: false,
    Admin_Master_HelpDesk_Severity: false,
    Admin_Master_HelpDesk_Faq: false,

    Admin_Master_Auction: false,
    Admin_Master_Auction_Bin: false,
    Admin_Master_Auction_Market: false,
    Admin_Master_Auction_Godown: false,
    Admin_Master_Auction_Activate_Reeler: false,
    Admin_Master_Auction_Crate: false,
    Admin_Master_Auction_Race: false,
    Admin_Master_Auction_Source: false,
    Admin_Master_Auction_Flex_Time: false,
    Admin_Master_Auction_Exception_Time: false,
    Admin_Master_Auction_Market_Type: false,
    Admin_Master_Auction_Reeler_Type: false,
    Admin_Master_Auction_External_Unit: false,
    Admin_Master_Auction_Empaneled_Vendor: false,
    Admin_Master_Auction_Reeler_Device_Mapping: false,
    Admin_Master_Auction_Race_Mapping: false,

    Admin_Master_General: false,
    Admin_Master_General_Pages: false,
    Admin_Master_General_Config_Role: false,

    Admin_Report: false,
    Admin_Report_Admin: false,
    Admin_Report_Transaction: false,
    Admin_Report_Dashboard: false,
    Admin_Report_DTR: false,
    Admin_Report_Unit: false,
    Admin_Report_Pending: false,
  });

  // Old show menu using mapcode

  // useEffect(() => {
  //   const updatedShowMenu = { ...showMenu };
  //   // console.log(data);
  //   data.forEach((key) => {
  //     // console.log(key);
  //     if (updatedShowMenu.hasOwnProperty(key)) {
  //       updatedShowMenu[key] = true;
  //     }
  //   });
  //   setShowMenu(updatedShowMenu);
  // }, [data]);

  useEffect(() => {
    const updatedShowMenu = { ...showMenu };
    if (data.includes("Registration")) {
      // Iterate over keys and set Registration properties to true
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("Registration_")) {
          updatedShowMenu[key] = true;
        }
      });
    }
    if (data.includes("Services")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("Services_")) {
          updatedShowMenu[key] = true;
        }
      });
    }
    if (data.includes("DBT")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("DBT_")) {
          updatedShowMenu[key] = true;
        }
      });
    }
    if (data.includes("Market")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("Market_")) {
          updatedShowMenu[key] = true;
        }
      });
    }
    if (data.includes("SeedDFL")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("SeedDFL_")) {
          updatedShowMenu[key] = true;
        }
      });
    }
    if (data.includes("GardenManagement")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("GardenManagement_")) {
          updatedShowMenu[key] = true;
        }
      });
    }
    if (data.includes("ChawkiManagement")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("ChawkiManagement_")) {
          updatedShowMenu[key] = true;
        }
      });
    }
    if (data.includes("TargetSetting")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("TargetSetting_")) {
          updatedShowMenu[key] = true;
        }
      });
    }
    if (data.includes("Inspection")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("Inspection_")) {
          updatedShowMenu[key] = true;
        }
      });
    }
    if (data.includes("Training")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("Training_")) {
          updatedShowMenu[key] = true;
        }
      });
    }
    if (data.includes("Helpdesk")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("Helpdesk_")) {
          updatedShowMenu[key] = true;
        }
      });
    }
    if (data.includes("Admin")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("Admin_")) {
          updatedShowMenu[key] = true;
        }
      });
    }
    //  else {
    data.forEach((key) => {
      // console.log(key);
      if (updatedShowMenu.hasOwnProperty(key)) {
        updatedShowMenu[key] = true;
      }
    });
    // }

    setShowMenu(updatedShowMenu);
  }, [data]);

  useEffect(() => {
    const hasRegistration = data.some((item) =>
      item.startsWith("Registration_")
    );
    if (hasRegistration) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        Registration: true,
      }));
    }

    const hasService = data.some((item) => item.startsWith("Services_"));
    if (hasService) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        Services: true,
      }));
    }

    const hasDbt = data.some((item) => item.startsWith("DBT_"));
    if (hasDbt) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        DBT: true,
      }));
    }

    const hasMarket = data.some((item) => item.startsWith("Market_"));
    if (hasMarket) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        Market: true,
      }));
    }

    const hasMarketPayment = data.some((item) =>
      item.startsWith("Market_Payment_")
    );
    if (hasMarketPayment) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        Market: true,
        Market_Payment: true,
      }));
    }

    const hasAdmin = data.some((item) => item.startsWith("Admin_"));
    if (hasAdmin) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        Admin: true,
      }));
    }

    const hasAdminMaster = data.some((item) =>
      item.startsWith("Admin_Master_")
    );
    if (hasAdminMaster) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        Admin: true,
        Admin_Master: true,
      }));
    }

    const hasAdminMasterRegistration = data.some((item) =>
      item.startsWith("Admin_Master_Registration_")
    );
    if (hasAdminMasterRegistration) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        Admin: true,
        Admin_Master: true,
        Admin_Master_Registration: true,
      }));
    }

    const hasAdminMasterLand = data.some((item) =>
      item.startsWith("Admin_Master_Land_")
    );
    if (hasAdminMasterLand) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        Admin: true,
        Admin_Master: true,
        Admin_Master_Land: true,
      }));
    }

    const hasAdminMasterService = data.some((item) =>
      item.startsWith("Admin_Master_Service_")
    );
    if (hasAdminMasterService) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        Admin: true,
        Admin_Master: true,
        Admin_Master_Service: true,
      }));
    }

    const hasAdminMasterAuction = data.some((item) =>
      item.startsWith("Admin_Master_Auction_")
    );
    if (hasAdminMasterAuction) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        Admin: true,
        Admin_Master: true,
        Admin_Master_Auction: true,
      }));
    }

    const hasAdminReport = data.some((item) =>
      item.startsWith("Admin_Report_")
    );
    if (hasAdminReport) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        Admin: true,
        Admin_Master: true,
        Admin_Master_Report: true,
      }));
    }
  }, [data]);

  // variables for Sidebar
  let menu = {
    classes: {
      main: "nk-nav",
      item: "nk-nav-item",
      link: "nk-nav-link",
      toggle: "nk-nav-toggle",
      sub: "nk-nav-sub",
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

  // dropdown extended
  let dropdownExtended = function (elm) {
    let nextelm = elm.nextElementSibling;
    let headerCollapse = layout.headerCollapse
      ? layout.headerCollapse
      : layout.breaks.lg;
    // eslint-disable-next-line
    if (window.innerWidth > eval(`layout.breaks.${headerCollapse}`)) {
      let placement =
        getParents(elm, `.${menu.classes.main}`, menu.classes.sub).length > 0
          ? "right-start"
          : "bottom-start";
      createPopper(elm, nextelm, {
        placement: placement,
        boundary: ".nk-wrap",
      });
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

  let menuHover = function (e) {
    e.preventDefault();
    let item = e.target.closest(`.${menu.classes.toggle}`);
    dropdownExtended(item);
    // dropdownToggle(item);
  };

  useEffect(() => {
    currentLink(`.${menu.classes.link}`);

    // Checking for Role
    if (localStorage.getItem("role") === "admin") {
      setModuleRows(modulesData);
    } else if (localStorage.getItem("role") === "crm") {
      setModuleRows(crmModulesData);
    } else if (localStorage.getItem("role") === "account") {
      setModuleRows(accountsModulesData);
    }

    // eslint-disable-next-line
  }, [null]);

  const { t } = useTranslation();

  return (
    <MenuList>
      {/* Hard Code Menu with mapcode Start */}

      <MenuItem sub>
        {showMenu.Registration ? (
          <MenuItemLink
            text="Registration"
            onClick={menuToggle}
            onMouseEnter={menuHover}
            sub
          />
        ) : null}

        <MenuSub>
          {showMenu.Registration_Farmer_Registration ? (
            <MenuItem>
              <MenuItemLink
                text="Farmer Registration"
                to="/stake-holder-registration"
              />
            </MenuItem>
          ) : null}
          {showMenu.Registration_Reeler_License ? (
            <MenuItem>
              <MenuItemLink
                text="Reeler License"
                to="/issue-new-reeler-license"
              />
            </MenuItem>
          ) : null}
          {showMenu.Registration_Renewal_of_Reeler_License ? (
            <MenuItem>
              <MenuItemLink
                text="Renewal of Reeler License"
                to="/renew-reeler-license"
              />
            </MenuItem>
          ) : null}
          {showMenu.Registration_Transfer_of_Reeler_License ? (
            <MenuItem>
              <MenuItemLink
                text="Transfer of Reeler License"
                to="/transfer-reeler-license"
              />
            </MenuItem>
          ) : null}

          {showMenu.Registration_Trader_License ? (
            <MenuItem>
              <MenuItemLink
                text="Trader License"
                to="/issue-new-trader-license"
              />
            </MenuItem>
          ) : null}
          {showMenu.Registration_Nsso ? (
            <MenuItem>
              <MenuItemLink
                text="RSP/CRC/NSSO Registration"
                to="/external-unit-registration"
              />
            </MenuItem>
          ) : null}
        </MenuSub>
      </MenuItem>

      <MenuItem sub>
        <MenuItemLink
          text={t("service")}
          onClick={menuToggle}
          onMouseEnter={menuHover}
          sub
        />
        <MenuSub>
          {showMenu.Services_Subsidy_Programmes ? (
            <MenuItem>
              <MenuItemLink text="Subsidy Programmes" to="/subsidy-programs" />
            </MenuItem>
          ) : null}
          {showMenu.Services_Track_the_DFL_procurement ? (
            <MenuItem>
              <MenuItemLink
                text="Track DFL Procurement"
                to="/track-dfl-procurement"
              />
            </MenuItem>
          ) : null}
          {showMenu.Services_Track_Mulberry_Status ? (
            <MenuItem>
              <MenuItemLink
                text="Track Mulberry Status"
                to="/track-mulberry-status"
              />
            </MenuItem>
          ) : null}
          {showMenu.Services_Supply_of_Disinfection ? (
            <MenuItem>
              <MenuItemLink
                text="Supply of Disinfection"
                to="/supply-disinfectants"
              />
            </MenuItem>
          ) : null}
          {showMenu.Services_Apply_Incentives ? (
            <MenuItem>
              <MenuItemLink
                text="Apply Incentives"
                to="/providing-incentives"
              />
            </MenuItem>
          ) : null}
          {showMenu.Services_Apply_Subsidy ? (
            <MenuItem>
              <MenuItemLink text="Apply Subsidy" to="/providing-subsidy" />
            </MenuItem>
          ) : null}
          {showMenu.Services_Providing_Chawki_Rearing_Incentives ? (
            <MenuItem>
              <MenuItemLink
                text="Providing Chawki Rearing incentives"
                to="/providing-chawki-incentives"
              />
            </MenuItem>
          ) : null}
          {showMenu.Services_Providing_Incentives_To_Reelers ? (
            <MenuItem>
              <MenuItemLink
                text="Apply incentives to Reelers"
                to="/providing-reeler-incentives"
              />
            </MenuItem>
          ) : null}
          {showMenu.Services_Providing_Subsidy_To_Reelers ? (
            <MenuItem>
              <MenuItemLink
                text="Apply subsidy to the Reelers"
                to="/providing-reeler-subsidy"
              />
            </MenuItem>
          ) : null}
        </MenuSub>
      </MenuItem>

      <MenuItem sub>
        <MenuItemLink
          text={t("dbt")}
          onClick={menuToggle}
          onMouseEnter={menuHover}
          sub
        />
        <MenuSub>
          {showMenu.DBT_Subsidy_Verification ? (
            <MenuItem>
              <MenuItemLink
                text="Subsidy Verification"
                to="/subsidy-approval-verification"
              />
            </MenuItem>
          ) : null}
          {showMenu.DBT_Subsidy_Sanction ? (
            <MenuItem>
              <MenuItemLink text="Subsidy Sanction" to="/subsidy-sanction" />
            </MenuItem>
          ) : null}
          {showMenu.DBT_Subsidy_Drawing ? (
            <MenuItem>
              <MenuItemLink text="Subsidy Drawing" to="/subsidy-drawing" />
            </MenuItem>
          ) : null}
          {showMenu.DBT_Subsidy_Counter_Signing ? (
            <MenuItem>
              <MenuItemLink
                text="Subsidy Counter Signing"
                to="/subsidy-counter-sign"
              />
            </MenuItem>
          ) : null}
        </MenuSub>
      </MenuItem>

      <MenuItem sub>
        <MenuItemLink
          text={t("market_and_auction")}
          onClick={menuToggle}
          onMouseEnter={menuHover}
          sub
        />
        <MenuSub>
          {/* {showMenu.Market_Register ? (
            <MenuItem>
              <MenuItemLink text="e-Register" to="#" />
            </MenuItem>
          ) : null} */}
          {showMenu.Market_Bidding ? (
            <MenuItem>
              <MenuItemLink text="e-Inward" to="/bidding-slip" />
            </MenuItem>
          ) : null}
          {showMenu.Market_Accept_Farmer_Auction ? (
            <MenuItem>
              <MenuItemLink text="e-Acceptance" to="/accept-former-auction" />
            </MenuItem>
          ) : null}
          {/* {showMenu.Market_Auction ? (
            <MenuItem>
              <MenuItemLink text="e-Auction" to="/reject-lot" />
            </MenuItem>
          ) : null} */}
          {showMenu.Market_Weighment ? (
            <MenuItem>
              <MenuItemLink text="e-Weighment" to="/weighment" />
            </MenuItem>
          ) : null}
          {showMenu.Market_Gatepass ? (
            <MenuItem>
              <MenuItemLink text="Gatepass" to="/gatepass" />
            </MenuItem>
          ) : null}
          <MenuItem>
            {showMenu.Market_Payment ? (
              <MenuItem sub>
                <MenuItemLink
                  text="e-Payment"
                  onClick={menuToggle}
                  onMouseEnter={menuHover}
                  sub
                />
                <MenuSub>
                  {showMenu.Market_Payment_Ready_for_Payment ? (
                    <MenuItem>
                      <MenuItemLink
                        text="Ready for Payment"
                        to="/ready-for-payment"
                      />
                    </MenuItem>
                  ) : null}
                  {showMenu.Market_Payment_Bulk_Send_To_Bank ? (
                    <MenuItem>
                      <MenuItemLink
                        text="Bulk Send to Bank"
                        to="/bulk-send-to-bank"
                      />
                    </MenuItem>
                  ) : null}
                  {showMenu.Market_Payment_Bank_Statement ? (
                    <MenuItem>
                      <MenuItemLink
                        text="Bank Statement"
                        to="/bank-statement"
                      />
                    </MenuItem>
                  ) : null}
                  {showMenu.Market_Payment_IFSC_Update ? (
                    <MenuItem>
                      <MenuItemLink text="IFSC Update" to="/ifsc-update" />
                    </MenuItem>
                  ) : null}
                </MenuSub>
              </MenuItem>
            ) : null}
          </MenuItem>
          {showMenu.Market_Reject ? (
            <MenuItem>
              <MenuItemLink text="Reject Lot" to="/reject-lot" />
            </MenuItem>
          ) : null}
          {showMenu.Market_Reject ? (
            <MenuItem>
              <MenuItemLink text="Show Lot Details" to="/display-all-lot" />
            </MenuItem>
          ) : null}
          {/* {showMenu.Market_Permit ? (
            <MenuItem>
              <MenuItemLink text="e-Permit" to="#" />
            </MenuItem>
          ) : null} */}
          {/* {showMenu.Market_Reject_Farmer_Auction ? (
            <MenuItem>
              <MenuItemLink
                text="Reject Farmer Auction"
                to="/reject-farmer-auction"
              />
            </MenuItem>
          ) : null} */}
          {/* {showMenu.Market_Generate_Bidding_Slip ? (
            <MenuItem>
              <MenuItemLink
                text="Generate Bidding Slip"
                to="/generate-bidding-slip"
              />
            </MenuItem>
          ) : null} */}
          {/* {showMenu.Market_Update_Lot_Weight ? (
            <MenuItem>
              <MenuItemLink text="Update Lot Weight" to="/update-lot-weight" />
            </MenuItem>
          ) : null} */}
        </MenuSub>
      </MenuItem>

      <MenuItem sub>
        <MenuItemLink
          text={t("seed_and_dfl")}
          onClick={menuToggle}
          onMouseEnter={menuHover}
          sub
        />
        <MenuSub>
          {showMenu.SeedDFL_Kunigal ? (
            <MenuItem sub>
              <MenuItemLink
                text="Basic seed farm Kunigal"
                onClick={menuToggle}
                onMouseEnter={menuHover}
                sub
              />
              <MenuSub>
                {showMenu.SeedDFL_Kunigal_mulberry_farm ? (
                  <MenuItem>
                    <MenuItemLink
                      text="Maintenance of mulberry farm"
                      to="/maintenance-mulberry-farm"
                    />
                  </MenuItem>
                ) : null}
                {showMenu.SeedDFL_Kunigal_DFLs_from_the_P4_grainage ? (
                  <MenuItem>
                    <MenuItemLink
                      text="Receipt of DFLs from P4 grainage"
                      to="/receipt-of-dfls"
                    />
                  </MenuItem>
                ) : null}
                {showMenu.SeedDFL_Kunigal_Line_record_maintenance ? (
                  <MenuItem>
                    <MenuItemLink
                      text="Line record maintenance"
                      to="/maintenance-line-record"
                    />
                  </MenuItem>
                ) : null}
                {showMenu.SeedDFL_Kunigal_Screening_batch_record ? (
                  <MenuItem>
                    <MenuItemLink
                      text="Screening batch record"
                      to="/maintenance-mulberry-farm"
                    />
                  </MenuItem>
                ) : null}
                {showMenu.SeedDFL_Kunigal_Cocoons_to_P4_Grainage ? (
                  <MenuItem>
                    <MenuItemLink
                      text="Dispatch of Cocoons to P4 Grainage"
                      to="/dispatch-cocoon"
                    />
                  </MenuItem>
                ) : null}
                {showMenu.SeedDFL_Kunigal_DFLs_for_the_8_lines ? (
                  <MenuItem>
                    <MenuItemLink
                      text="Rearing of DFLs for the 8 lines"
                      to="/rearing-dfls"
                    />
                  </MenuItem>
                ) : null}
              </MenuSub>
            </MenuItem>
          ) : null}

          {showMenu.SeedDFL_Grainages ? (
            <MenuItem sub>
              <MenuItemLink
                text="Grainages"
                onClick={menuToggle}
                onMouseEnter={menuHover}
                sub
              />
              <MenuSub>
                {showMenu.SeedDFL_Grainages_Preservation_of_Cocoon ? (
                  <MenuItem>
                    <MenuItemLink
                      text="Preservation of cocoon"
                      to="/preservation-cocoon"
                    />
                  </MenuItem>
                ) : null}
                {showMenu.SeedDFL_Grainages_Preparation_of_Eggs ? (
                  <MenuItem>
                    <MenuItemLink
                      text="Preparation of eggs"
                      to="/preparation-eggs"
                    />
                  </MenuItem>
                ) : null}
                {showMenu.SeedDFL_Grainages_Eggs_At_Cold_Storage ? (
                  <MenuItem>
                    <MenuItemLink
                      text="Eggs at cold storage"
                      to="/maintenance-eggs"
                    />
                  </MenuItem>
                ) : null}
                {showMenu.SeedDFL_Cold_Storage_Schedule ? (
                  <MenuItem>
                    <MenuItemLink
                      text="Cold Storage Schedule (BV)"
                      to="/cold-storage"
                    />
                  </MenuItem>
                ) : null}
                {showMenu.SeedDFL_Grainages_Disposal_of_DFL ? (
                  <MenuItem>
                    <MenuItemLink
                      text="Sale / Disposal of DFL"
                      to="/sale-dfl"
                    />
                  </MenuItem>
                ) : null}
                {showMenu.SeedDFL_Grainages_Testing_of_Moth ? (
                  <MenuItem>
                    <MenuItemLink
                      text="Testing of moth / pupa"
                      to="/testing-moth"
                    />
                  </MenuItem>
                ) : null}
                {showMenu.SeedDFL_Grainages_Maintenance_of_Pierced_Cocoons ? (
                  <MenuItem>
                    <MenuItemLink
                      text="Stock of Pierced Cocoons"
                      to="/pierced-Cocoons"
                    />
                  </MenuItem>
                ) : null}
                {showMenu.SeedDFL_Grainages__Pierced_Cocoons ? (
                  <MenuItem>
                    <MenuItemLink
                      text="Sale/Disposal of Pierced Cocoons"
                      to="/sale-Cocoons"
                    />
                  </MenuItem>
                ) : null}
                {showMenu.SeedDFL_Grainages_Egg_Layings_Sheets ? (
                  <MenuItem>
                    <MenuItemLink
                      text="Maintenance of egg layings sheets"
                      to="/maintenance-sheets"
                    />
                  </MenuItem>
                ) : null}
                {showMenu.SeedDFL_Grainages_Remittance ? (
                  <MenuItem>
                    <MenuItemLink
                      text="Remittance (Eggs / PC / Others)"
                      to="/remittance"
                    />
                  </MenuItem>
                ) : null}
              </MenuSub>
            </MenuItem>
          ) : null}

          {showMenu.SeedDFL_Seed ? (
            <MenuItem sub>
              <MenuItemLink
                text="Registered seed producer(RSP/NSSO)"
                onClick={menuToggle}
                onMouseEnter={menuHover}
                sub
              />
              <MenuSub>
                {showMenu.SeedDFL_Seed_Preparation_of_Eggs ? (
                  <MenuItem>
                    <MenuItemLink
                      text="Preparation of eggs"
                      to="/preparation-eggs"
                    />
                  </MenuItem>
                ) : null}
                {showMenu.SeedDFL_Seed_Disposal_of_DFL ? (
                  <MenuItem>
                    <MenuItemLink
                      text="Sale / Disposal of DFL"
                      to="/sale-dfl"
                    />
                  </MenuItem>
                ) : null}
                {showMenu.SeedDFL_Seed_Cold_Storage ? (
                  <MenuItem>
                    <MenuItemLink
                      text="Eggs at cold storage"
                      to="/maintenance-eggs"
                    />
                  </MenuItem>
                ) : null}
              </MenuSub>
            </MenuItem>
          ) : null}
        </MenuSub>
      </MenuItem>

      <MenuItem sub>
        <MenuItemLink
          text={t("garden_management")}
          onClick={menuToggle}
          onMouseEnter={menuHover}
          sub
        />
        <MenuSub>
          {showMenu.GardenManagement_Mulberry_Farm ? (
            <MenuItem>
              <MenuItemLink
                text="Maintenance of mulberry farm"
                to="/garden-mulberry-farm"
              />
            </MenuItem>
          ) : null}
          {showMenu.GardenManagement_DFL_From_The_Grainage ? (
            <MenuItem>
              <MenuItemLink
                text="Receipt of DFL’s from the Grainage"
                to="/garden-receipt-dfl"
              />
            </MenuItem>
          ) : null}
          {showMenu.GardenManagement_Rearing_of_DFL ? (
            <MenuItem>
              <MenuItemLink text="Rearing of DFL’s" to="/garden-rearing-dfl" />
            </MenuItem>
          ) : null}
          {showMenu.GardenManagement_Cocoons_to_Grainage ? (
            <MenuItem>
              <MenuItemLink
                text="Supply of Cocoons to Grainage"
                to="/supply-cocoon-grainage"
              />
            </MenuItem>
          ) : null}
          {showMenu.GardenManagement_Sale_of_Nursery_to_Farmers ? (
            <MenuItem>
              <MenuItemLink
                text="Sale of Nursery to Farmers"
                to="/sale-nursery-farmer"
              />
            </MenuItem>
          ) : null}
          {showMenu.GardenManagement_Seed_Cutting_Bank ? (
            <MenuItem>
              <MenuItemLink text="Seed cutting bank" to="/seed-cutting-bank" />
            </MenuItem>
          ) : null}
        </MenuSub>
      </MenuItem>

      <MenuItem sub>
        <MenuItemLink
          text={t("chawki_management")}
          onClick={menuToggle}
          onMouseEnter={menuHover}
          sub
        />
        <MenuSub>
          {showMenu.ChawkiManagement_Chawki_Worms ? (
            <MenuItem>
              <MenuItemLink
                text="Sale of Chawki Worms"
                to="/sale-chawki-worms"
              />
            </MenuItem>
          ) : null}
        </MenuSub>
      </MenuItem>

      <MenuItem sub>
        <MenuItemLink
          text={t("target_setting")}
          onClick={menuToggle}
          onMouseEnter={menuHover}
          sub
        />
        <MenuSub>
          {showMenu.TargetSetting_Assigning_Yearly_Targets ? (
            <MenuItem>
              <MenuItemLink
                text="Assigning Yearly Targets"
                to="/attribute-assigning"
              />
            </MenuItem>
          ) : null}
        </MenuSub>
      </MenuItem>

      <MenuItem sub>
        <MenuItemLink
          text={t("inspection")}
          onClick={menuToggle}
          onMouseEnter={menuHover}
          sub
        />
        <MenuSub>
          {showMenu.Inspection_Tracking_Status_of_Mulberry ? (
            <MenuItem>
              <MenuItemLink
                text="Tracking status of Mulberry"
                to="/track-current-status"
              />
            </MenuItem>
          ) : null}
          {showMenu.Inspection_Supply_of_Disinfectants_to_Farmers ? (
            <MenuItem>
              <MenuItemLink
                text="Supply of disinfectants to farmers"
                to="/inspect-supply-disinfectants"
              />
            </MenuItem>
          ) : null}
          {showMenu.Inspection_Implementation_of_MGNREGA ? (
            <MenuItem>
              <MenuItemLink
                text="Implementation of MGNREGA"
                to="/implementation-mgnrega"
              />
            </MenuItem>
          ) : null}
        </MenuSub>
      </MenuItem>

      <MenuItem sub>
        <MenuItemLink
          text={t("training")}
          onClick={menuToggle}
          onMouseEnter={menuHover}
          sub
        />
        <MenuSub>
          {showMenu.Training_Schedule ? (
            <MenuItem>
              <MenuItemLink text="Schedule Training" to="/training-schedule" />
            </MenuItem>
          ) : null}
          {showMenu.Training_Page ? (
            <MenuItem>
              <MenuItemLink text="Trainer Page" to="/trainer-page-list" />
            </MenuItem>
          ) : null}
          {showMenu.Training_Deputation_Tracker ? (
            <MenuItem>
              <MenuItemLink
                text="Training Deputation Tracker"
                to="/training-deputation-tracker"
              />
            </MenuItem>
          ) : null}
          {/* {showMenu.Training_Financial_Target ? (
            <MenuItem>
              <MenuItemLink text="Financial Target" to="#" />
            </MenuItem>
          ) : null} */}
        </MenuSub>
      </MenuItem>

      <MenuItem sub>
        <MenuItemLink
          text={t("helpdesk")}
          onClick={menuToggle}
          onMouseEnter={menuHover}
          sub
        />
        <MenuSub>
          {showMenu.Helpdesk_Raise_a_Ticket ? (
            <MenuItem>
              <MenuItemLink text="Raise a Ticket" to="/help-desk" />
            </MenuItem>
          ) : null}
          {showMenu.Helpdesk_Dashboard ? (
            <MenuItem>
              <MenuItemLink text="Dashboard" to="/helpdesk-dashboard" />
            </MenuItem>
          ) : null}
          {showMenu.Helpdesk_User_Dashboard ? (
            <MenuItem>
              <MenuItemLink text="User Dashboard" to="/user-dashboard" />
            </MenuItem>
          ) : null}
          {showMenu.Helpdesk_My_Tickets ? (
            <MenuItem>
              <MenuItemLink text="My Tickets" to="/my-tickets" />
            </MenuItem>
          ) : null}
          {showMenu.Helpdesk_FAQ ? (
            <MenuItem>
              <MenuItemLink text="FAQ" to="/help-desk-faq-view" />
            </MenuItem>
          ) : null}
        </MenuSub>
      </MenuItem>

      <MenuItem sub>
        <MenuItemLink
          text={t("admin")}
          onClick={menuToggle}
          onMouseEnter={menuHover}
          sub
        />
        <MenuSub>
          {showMenu.Admin_Master ? (
            <MenuItem sub>
              <MenuItemLink
                text="Master"
                onClick={menuToggle}
                onMouseEnter={menuHover}
                sub
              />
              <MenuSub>
                {showMenu.Admin_Master_Registration ? (
                  <MenuItem sub>
                    <MenuItemLink
                      text="Registration"
                      onClick={menuToggle}
                      onMouseEnter={menuHover}
                      sub
                    />
                    <MenuSub>
                      {showMenu.Admin_Master_Registration_Caste ? (
                        <MenuItem>
                          <MenuItemLink text="Caste" to="/caste" />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Registration_Roles ? (
                        <MenuItem>
                          <MenuItemLink text="Roles" to="/roles" />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Registration_Education ? (
                        <MenuItem>
                          <MenuItemLink text="Education" to="/education" />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Registration_Relationship ? (
                        <MenuItem>
                          <MenuItemLink
                            text="Relationship"
                            to="/relationship"
                          />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Registration_State ? (
                        <MenuItem>
                          <MenuItemLink text="State" to="/state" />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Registration_District ? (
                        <MenuItem>
                          <MenuItemLink text="District" to="/district" />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Registration_Taluk ? (
                        <MenuItem>
                          <MenuItemLink text="Taluk" to="/taluk" />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Registration_Hobli ? (
                        <MenuItem>
                          <MenuItemLink text="Hobli" to="/hobli" />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Registration_Village ? (
                        <MenuItem>
                          <MenuItemLink text="Village" to="/village" />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Registration_Trader_Type ? (
                        <MenuItem>
                          <MenuItemLink text="Trader Type" to="/trader-type" />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Registration_Farmer_Type ? (
                        <MenuItem>
                          <MenuItemLink text="Farmer Type" to="/farmer-type" />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Registration_Working_Institution ? (
                        <MenuItem>
                          <MenuItemLink
                            text="Working Institution"
                            to="/working-institution"
                          />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Registration_User ? (
                        <MenuItem>
                          <MenuItemLink text="User" to="/user" />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Registration_Designation ? (
                        <MenuItem>
                          <MenuItemLink text="Designation" to="/designation" />
                        </MenuItem>
                      ) : null}
                    </MenuSub>
                  </MenuItem>
                ) : null}

                {showMenu.Admin_Master_Land ? (
                  <MenuItem sub>
                    <MenuItemLink
                      text="Land"
                      onClick={menuToggle}
                      onMouseEnter={menuHover}
                      sub
                    />
                    <MenuSub>
                      {showMenu.Admin_Master_Land_Holding_Category ? (
                        <MenuItem>
                          <MenuItemLink
                            text="Land Holding Category"
                            to="/land-category"
                          />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Land_Irrigation_Source ? (
                        <MenuItem>
                          <MenuItemLink
                            text="Irrigation Source"
                            to="/irrigation-source"
                          />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Land_Irrigation_Type ? (
                        <MenuItem>
                          <MenuItemLink
                            text="Irrigation Type"
                            to="/irrigation-type"
                          />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Land_Ownership ? (
                        <MenuItem>
                          <MenuItemLink
                            text="Land Ownership"
                            to="/land-ownership"
                          />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Land_Soil_Type ? (
                        <MenuItem>
                          <MenuItemLink text="Soil Type" to="/soil-type" />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Land_Rear_House_Roof_Type ? (
                        <MenuItem>
                          <MenuItemLink
                            text="Rear House Roof Type"
                            to="/rear-house-roof-type"
                          />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Land_Silk_Worm_Variety ? (
                        <MenuItem>
                          <MenuItemLink
                            text="Silk Worm Variety"
                            to="/silk-worm-variety"
                          />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Land_Source_of_Mulberry ? (
                        <MenuItem>
                          <MenuItemLink
                            text="Source of Mulberry"
                            to="/source-of-mulberry"
                          />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Land_Mulberry_Variety ? (
                        <MenuItem>
                          <MenuItemLink
                            text="Mulberry Variety"
                            to="/mulberry-variety"
                          />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Land_Subsidy_Details ? (
                        <MenuItem>
                          <MenuItemLink
                            text="Subsidy Details"
                            to="/subsidy-details"
                          />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Land_Plantation_Type ? (
                        <MenuItem>
                          <MenuItemLink
                            text="Plantation Type"
                            to="/plantation-type"
                          />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Land_Machine_Type ? (
                        <MenuItem>
                          <MenuItemLink
                            text="Machine Type"
                            to="/machine-type"
                          />
                        </MenuItem>
                      ) : null}
                    </MenuSub>
                  </MenuItem>
                ) : null}

                {showMenu.Admin_Master_Service ? (
                  <MenuItem sub>
                    <MenuItemLink
                      text="Service"
                      onClick={menuToggle}
                      onMouseEnter={menuHover}
                      sub
                    />
                    <MenuSub>
                      {showMenu.Admin_Master_Service_Program ? (
                        <MenuItem>
                          <MenuItemLink text="Program" to="/sc-program" />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Service_Component ? (
                        <MenuItem>
                          <MenuItemLink text="Component" to="/sc-component" />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Service_Head_of_Account ? (
                        <MenuItem>
                          <MenuItemLink
                            text="Head of Account"
                            to="/sc-head-account"
                          />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Service_Reason_for_Lot_Cancellation ? (
                        <MenuItem>
                          <MenuItemLink
                            text="Reason for lot Cancellation"
                            to="/reason-lot-cancellation"
                          />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Service_Reason_for_Bid_Rejection ? (
                        <MenuItem>
                          <MenuItemLink
                            text="Reason for bid Rejection"
                            to="/reason-bid-rejection"
                          />
                        </MenuItem>
                      ) : null}
                    </MenuSub>
                  </MenuItem>
                ) : null}

                {showMenu.Admin_Master_Training ? (
                  <MenuItem sub>
                    <MenuItemLink
                      text="Training"
                      onClick={menuToggle}
                      onMouseEnter={menuHover}
                      sub
                    />
                    <MenuSub>
                      {showMenu.Admin_Master_Training_Program ? (
                        <MenuItem>
                          <MenuItemLink
                            text="Training Program"
                            to="/trainingProgram"
                          />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Training_Course ? (
                        <MenuItem>
                          <MenuItemLink
                            text="Training Course"
                            to="/trainingCourse"
                          />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Training_Deputed_Institute ? (
                        <MenuItem>
                          <MenuItemLink
                            text="Deputed Institute Training"
                            to="/deputed-institute"
                          />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Training_Group ? (
                        <MenuItem>
                          <MenuItemLink
                            text="Training Group"
                            to="/training-group"
                          />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Training_Institution ? (
                        <MenuItem>
                          <MenuItemLink
                            text="Training Institution"
                            to="/training-institution"
                          />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Training_Mode ? (
                        <MenuItem>
                          <MenuItemLink
                            text="Training Mode"
                            to="/training-mode"
                          />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Training_Office ? (
                        <MenuItem>
                          <MenuItemLink
                            text="Training Office"
                            to="/training-office"
                          />
                        </MenuItem>
                      ) : null}
                    </MenuSub>
                  </MenuItem>
                ) : null}

                {showMenu.Admin_Master_HelpDesk ? (
                  <MenuItem sub>
                    <MenuItemLink
                      text="HelpDesk"
                      onClick={menuToggle}
                      onMouseEnter={menuHover}
                      sub
                    />
                    <MenuSub>
                      {showMenu.Admin_Master_HelpDesk_Module ? (
                        <MenuItem>
                          <MenuItemLink text="Modules" to="/hd-module" />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_HelpDesk_Feature ? (
                        <MenuItem>
                          <MenuItemLink text="Feature" to="/hd-feature" />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_HelpDesk_Board_Category ? (
                        <MenuItem>
                          <MenuItemLink
                            text="Broad Category"
                            to="/hd-board-category"
                          />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_HelpDesk_Category ? (
                        <MenuItem>
                          <MenuItemLink text="Category" to="/hd-category" />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_HelpDesk_Sub_Category ? (
                        <MenuItem>
                          <MenuItemLink
                            text="Sub Category"
                            to="/hd-sub-category"
                          />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_HelpDesk_Status ? (
                        <MenuItem>
                          <MenuItemLink
                            text="Help Desk Status"
                            to="/hd-status"
                          />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_HelpDesk_Severity ? (
                        <MenuItem>
                          <MenuItemLink
                            text="Help Desk Severity"
                            to="/hd-severity"
                          />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_HelpDesk_Faq ? (
                        <MenuItem>
                          <MenuItemLink
                            text="Help Desk FAQ"
                            to="/hd-question"
                          />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_HelpDesk_Status ? (
                        <MenuItem>
                          <MenuItemLink
                            text="Help Desk Status"
                            to="/hd-status"
                          />
                        </MenuItem>
                      ) : null}
                    </MenuSub>
                  </MenuItem>
                ) : null}

                {showMenu.Admin_Master_Auction ? (
                  <MenuItem sub>
                    <MenuItemLink
                      text="Market & Auction"
                      onClick={menuToggle}
                      onMouseEnter={menuHover}
                      sub
                    />
                    <MenuSub>
                      {showMenu.Admin_Master_Auction_Bin ? (
                        <MenuItem>
                          <MenuItemLink text="Bin" to="/bin" />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Auction_Market ? (
                        <MenuItem>
                          <MenuItemLink text="Market" to="/market" />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Auction_Godown ? (
                        <MenuItem>
                          <MenuItemLink text="Godown" to="/godawn" />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Auction_Activate_Reeler ? (
                        <MenuItem>
                          <MenuItemLink
                            text="Activate Reeler"
                            to="/activate-reeler"
                          />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Auction_Race ? (
                        <MenuItem>
                          <MenuItemLink text="Race" to="/race" />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Auction_Source ? (
                        <MenuItem>
                          <MenuItemLink text="Source" to="/source" />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Auction_Crate ? (
                        <MenuItem>
                          <MenuItemLink text="Crate" to="/crate" />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Auction_Flex_Time ? (
                        <MenuItem>
                          <MenuItemLink text="Flex Time" to="/flex-time" />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Auction_Exception_Time ? (
                        <MenuItem>
                          <MenuItemLink
                            text="Exception Time"
                            to="/market-exception-time"
                          />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Auction_Market_Type ? (
                        <MenuItem>
                          <MenuItemLink text="Market Type" to="/market-type" />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Auction_Reeler_Type ? (
                        <MenuItem>
                          <MenuItemLink text="Reeler Type" to="/reeler-type" />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Auction_External_Unit ? (
                        <MenuItem>
                          <MenuItemLink
                            text="External Unit"
                            to="/external-unit-type"
                          />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Auction_Empaneled_Vendor ? (
                        <MenuItem>
                          <MenuItemLink
                            text="Empaneled Vendors"
                            to="/empanelled-vendor"
                          />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Auction_Reeler_Device_Mapping ? (
                        <MenuItem>
                          <MenuItemLink
                            text="Reeler Device Mapping"
                            to="/reeler-device-mapping"
                          />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_Auction_Race_Mapping ? (
                        <MenuItem>
                          <MenuItemLink
                            text="Race Mapping"
                            to="/race-mapping"
                          />
                        </MenuItem>
                      ) : null}
                      {/* {showMenu.Admin_Master_Auction_Accept_Bid ? (
                        <MenuItem>
                          <MenuItemLink text="Accept Bid" to="/accept-bid" />
                        </MenuItem>
                      ) : null} */}
                    </MenuSub>
                  </MenuItem>
                ) : null}

                {showMenu.Admin_Master_General ? (
                  <MenuItem sub>
                    <MenuItemLink
                      text="General"
                      onClick={menuToggle}
                      onMouseEnter={menuHover}
                      sub
                    />
                    <MenuSub>
                      {showMenu.Admin_Master_General_Pages ? (
                        <MenuItem>
                          <MenuItemLink text="Pages" to="/role-pages" />
                        </MenuItem>
                      ) : null}
                      {showMenu.Admin_Master_General_Config_Role ? (
                        <MenuItem>
                          <MenuItemLink text="Config Role" to="/role-config" />
                        </MenuItem>
                      ) : null}
                    </MenuSub>
                  </MenuItem>
                ) : null}
              </MenuSub>
            </MenuItem>
          ) : null}

          {showMenu.Admin_Report ? (
            <MenuItem sub>
              <MenuItemLink
                text="Report"
                onClick={menuToggle}
                onMouseEnter={menuHover}
                sub
              />
              <MenuSub>
                {showMenu.Admin_Report_Admin ? (
                  <MenuItem>
                    <MenuItemLink text="Admin Report" to="/report-admin" />
                  </MenuItem>
                ) : null}
                {showMenu.Admin_Report_Transaction ? (
                  <MenuItem>
                    <MenuItemLink
                      text="Reeler Transaction Report"
                      to="/reeler-transaction-report"
                    />
                  </MenuItem>
                ) : null}
                {showMenu.Admin_Report_Dashboard ? (
                  <MenuItem>
                    <MenuItemLink text="Dashboard" to="/bid-dashboard" />
                  </MenuItem>
                ) : null}
                {showMenu.Admin_Report_DTR ? (
                  <MenuItem>
                    <MenuItemLink text="DTR Online" to="/dtr-online" />
                  </MenuItem>
                ) : null}
                {showMenu.Admin_Report_Unit ? (
                  <MenuItem>
                    <MenuItemLink
                      text="Unit Counter Report"
                      to="/unit-counter-report"
                    />
                  </MenuItem>
                ) : null}
                {showMenu.Admin_Report_Pending ? (
                  <MenuItem>
                    <MenuItemLink text="Pending Report" to="/pending-reports" />
                  </MenuItem>
                ) : null}
              </MenuSub>
            </MenuItem>
          ) : null}
        </MenuSub>
      </MenuItem>

      {/* Hard Code Menu with mapcode End */}
    </MenuList>
  );
}

export default Menu;
