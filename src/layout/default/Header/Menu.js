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
      {blank && !sub && (
        <Link className={compClass} to={to} target="_blank">
          <MenuItemTemplate icon={icon} text={text} />
          {props.children}
        </Link>
      )}
      {sub && !blank && (
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
      {sub && blank && (
        <a
          className={compClass}
          href="#expand"
          onClick={(e) => {
            window.open(to, "_blank", "noreferrer");
            if (onClick) onClick(e);
          }}
          onMouseEnter={onMouseEnter}
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
  const { t } = useTranslation();

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
    Registration_Farmer_Without_FruitsId: false,
    Registration_Other_State_Farmer: false,

    Services: false,
    Services_Service_Application: false,
    Services_Service_Dashboard: false,
    Services_Service_Applications_For_Incentive_Bonus_Seed_Cocoon: false,
    Services_Dbt_Application: false,
    Services_Service_Download_Documents: false,
    Services_Service_Crop_Details_Seed_Market: false,
    Services_Service_Crop_Details_Commercial_Market: false,

    // Services_Track_Mulberry_Status: false,
    // Services_Supply_of_Disinfection: false,
    // Services_Apply_Incentives: false,
    // Services_Apply_Subsidy: false,
    // Services_Providing_Chawki_Rearing_Incentives: false,
    // Services_Providing_Incentives_To_Reelers: false,
    // Services_Providing_Subsidy_To_Reelers: false,

    DBT: false,
    DBT_Subsidy_Verification: false,
    DBT_Subsidy_Sanction: false,
    DBT_Subsidy_Drawing: false,
    DBT_Subsidy_Counter_Signing: false,
    DBT_Reject_List: false,
    DBT_DBT_Pushed_List: false,
    DBT_Success_List: false,
    DBT_Drawing_Officer_List: false,
    DBT_Drawing_Officer_List_For_K2_Push: false,
    DBT_Drawing_Officer_List_For_DBT_Push: false,
    DBT_Drawing_Officer_List_For_Vendor_DBT_Push: false,
    DBT_Drawing_Officer_List_For_Vendor_K2_Push: false,
    DBT_Rejection_List_For_DBT: false,
    DBT_Rejection_List_For_K2: false,
    DBT_Tsc_Officer_List: false,

    Market: false,
    Market_Bidding: false,
    Market_Accept_Farmer_Auction: false,
    Market_Weighment: false,
    Market_Gatepass: false,
    Market_Reject: false,
    Market_Show_Lot: false,
    Market_Reeler_Initial_Amount: false,

    Market_Payment: false,
    Market_Payment_Ready_for_Payment: false,
    Market_Payment_Bulk_Send_To_Bank: false,
    Market_Payment_Bank_Statement: false,

    Market_SeedMarket: false,
    Market_SeedMarket_Weighment: false,
    Market_SeedMarket_Delete_Lot:false,
    Market_SeedMarket_Lot_Distribution: false,

    Market_SeedMarket_Payment: false,
    Market_SeedMarket_Ready_For_Payment: false,
    Market_SeedMarket_Bulk_Send_To_Payment: false,
    Market_SeedMarket_Payment_Statement: false,

    Market_SeedCocoonMarket: false,
    Market_SeedCocoonMarket_Inward: false,
    Market_SeedCocoonMarket_Base_Price_Fixation: false,
    Market_SeedCocoonMarket_Lot_Wise_Price_Fixation: false,
    Market_SeedCocoonMarket_Pupa_Test_Cocoon_Assessment_Page: false,

    Market_SeedCocoonMarket_Payment: false,
    Market_SeedCocoonMarket_Ready_For_Payment: false,
    Market_SeedCocoonMarket_Bulk_Send_To_Payment: false,
    Market_SeedCocoonMarket_Payment_Statement: false,

    SeedDFL: false,
    SeedDFL_BSF: false,
    SeedDFL_BSF_Garden_Farm: false,
    SeedDFL_BSF_DFLs_from_P4_Grainage: false,
    SeedDFL_BSF_Line_Records_Each_race: false,
    SeedDFL_BSF_Screening_batch_record: false,
    SeedDFL_BSF_Cocoons_to_P4_Grainage: false,
    SeedDFL_BSF_Remittance: false,
    SeedDFL_BSF_DFLs_for_the_8_lines: false,
    SeedDFL_Grainage: false,
    SeedDFL_Grainage_Line_Records_Each_race: false,
    SeedDFL_Grainage_Seed_Cocoon_Processing: false,
    SeedDFL_Grainage_Preparation_Egg_DFLs: false,
    SeedDFL_Grainage_Eggs_Cold_storage: false,
    SeedDFL_Grainage_Cold_Storage_Schedule_BV: false,
    SeedDFL_Grainage_Sale_of_DFLs_Eggs: false,
    SeedDFL_Grainage_Testing_Of_Moth: false,
    SeedDFL_Grainage_Maintenance_Of_Pierced_Cocoons: false,
    SeedDFL_Grainage_Sale_Of_Pierced_Cocoons: false,
    SeedDFL_Grainage_Maintenance_Of_Egg_Laying_Sheets: false,
    SeedDFL_Grainage_Remittance: false,
    SeedDFL_External: false,
    SeedDFL_External_Preservation_Of_Seed_Cocoon_Rsp: false,
    SeedDFL_External_Preparation_Egg_DFLs: false,
    SeedDFL_External_Sale_of_DFLs_Eggs: false,
    SeedDFL_External_Eggs_Cold_storage: false,

    GardenManagement: false,
    GardenManagement_Mulberry_Garden: false,
    GardenManagement_DFL_From_The_Grainage: false,
    GardenManagement_Rearing_of_DFL: false,
    GardenManagement_Cocoons_to_Grainage: false,
    GardenManagement_Sale_of_Nursery_to_Farmers: false,
    GardenManagement_Seed_Cutting_Bank: false,
    GardenManagement_Distribution_Farmers: false,

    ChawkiManagement: false,
    ChawkiManagement_ChawkiManagement: false,

    TargetSetting: false,
    TargetSetting_Dashboard: false,

    TargetSetting_Allocate: false,
    TargetSetting_Allocate_District_Wise_Mulberry: false,
    TargetSetting_Allocate_TSC_Wise_Mulberry: false,
    TargetSetting_Allocate_Range_Wise_Mulberry: false,
    TargetSetting_Allocate_Range_Wise_Mulberry_Targets_Daily: false,
    TargetSetting_Allocate_District_Wise_Physical_Target: false,
    TargetSetting_Allocate_TSC_Wise_Physical_Target: false,
    TargetSetting_Allocate_Range_Wise_Physical_Target: false,
    TargetSetting_Allocate_Farm_Wise_Target: false,
    TargetSetting_Allocate_Grainage_Wise_Target: false,
    TargetSetting_Allocate_Training_Wise_Target: false,
    TargetSetting_Allocate_District_Wise_Scheme_Target: false,
    TargetSetting_Allocate_TSC_Wise_Scheme_Target: false,
    TargetSetting_Allocate_Reeling_Wise_Scheme_Target: false,
    TargetSetting_Allocate_User_Hierarchy_Mapping: false,
    TargetSetting_Allocate_Direct_And_All_Reportee_Details: false,


    TargetSetting_Achievement: false,
    TargetSetting_Achievement_FARM: false,
    TargetSetting_Achievement_GRAINAGE: false,
    TargetSetting_Achievement_Training: false,
    TargetSetting_Achievement_PRODUCTION: false,
    TargetSetting_Achievement_MULBERRY: false,


    Inspection: false,
    Inspection_Tracking_Status_of_Mulberry: false,
    Inspection_Supply_of_Disinfectants_to_Farmers: false,
    Inspection_Implementation_of_MGNREGA: false,
    Inspection_Download_Inspection_Mobile_App: false,

    Training: false,
    Training_Schedule: false,
    Training_Page: false,
    Training_Deputation_Tracker: false,

    Helpdesk: false,
    Helpdesk_Raise_a_Ticket: false,
    Helpdesk_Dashboard: false,
    Helpdesk_User_Dashboard: false,
    Helpdesk_Escalated_Dashboard: false,
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
    Admin_Master_Registration_Farmer_Bank_Reason: false,
    Admin_Master_Registration_District: false,
    Admin_Master_Registration_Taluk: false,
    Admin_Master_Registration_Hobli: false,
    Admin_Master_Registration_Village: false,
    Admin_Master_Registration_Trader_Type: false,
    Admin_Master_Registration_Farmer_Type: false,
    Admin_Master_Registration_Working_Institution: false,
    Admin_Master_Registration_User: false,
    Admin_Master_Registration_Designation: false,
    Admin_Master_Registration_No_Fruits_Farmer_Counter: false,

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
    Admin_Master_Service_Document: false,
    Admin_Master_Service_Department: false,
    Admin_Master_Service_Reject_Reason_WorkFlow: false,
    Admin_Master_Service_Reject_Reason: false,
    Admin_Master_Service_Silk_Exchange: false,
    Admin_Master_Service_Program: false,
    Admin_Master_Service_Scheme_Details: false,
    Admin_Master_Service_DbtStatusCheck: false,
    Admin_Master_Service_Sub_Scheme_Details: false,
    Admin_Master_Service_Component: false,
    Admin_Master_Service_Scheme_Quota: false,
    Admin_Master_Service_Map_Component_And_Head_Of_Account: false,
    Admin_Master_Service_Head_of_Account: false,
    Admin_Master_Service_Head_of_Account_Category: false,
    Admin_Master_Service_Unit_Cost: false,
    Admin_Master_Service_Vendor: false,
    Admin_Master_Service_Vendor_Contact: false,
    Admin_Master_Service_Vendor_Bank: false,
    Admin_Master_Service_Approving_Authority: false,
    Admin_Master_Service_Category: false,
    Admin_Master_Service_Approval_Stage: false,
    Admin_Master_Service_Spacing: false,
    Admin_Master_Service_Hectare: false,
    Admin_Master_Service_Configure_Pmkys_Amount: false,
    Admin_Master_Service_Configure_Bonus_Amount: false,
    Admin_Master_Service_Configure_RH_Amount: false,
    Admin_Master_Service_User_Hierarchy_Mapping: false,
    Admin_Master_Service_Program_Account_Mapping: false,
    Admin_Master_Service_Program_Approval_Mapping: false,
    Admin_Master_Service_Reason_for_Lot_Cancellation: false,
    Admin_Master_Service_Reason_for_Bid_Rejection: false,
    Admin_Master_Service_Financial_Year: false,
    Admin_Master_Service_Activity: false,

    Admin_Master_Service_Calculation: false,
    Admin_Master_Service_Calculation_SILK: false,
    Admin_Master_Service_Calculation_Icb: false,
    Admin_Master_Service_Calculation_Imcb: false,
    Admin_Master_Service_Calculation_Adopting: false,
    Admin_Master_Service_Calculation_reeling: false,
    Admin_Master_Service_Calculation_PMKSY: false,
    Admin_Master_Service_Calculation_Bonus: false,
    Admin_Master_Service_Calculation_RH_Amount: false,
    Admin_Master_Service_Calculation_Registered_Private_Chawki: false,
    

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

    Admin_Master_Garden: false,
    Admin_Master_Garden_Line: false,
    Admin_Master_Garden_Crop_Status: false,
    Admin_Master_Garden_Crop_Inspection_Type: false,
    Admin_Master_Garden_Reason: false,
    Admin_Master_Garden_Mount: false,
    Admin_Master_Garden_Disease_Status: false,

    Admin_Master_Garden_Grainage: false,
    Admin_Master_Garden_Disinfectant: false,
    Admin_Master_Garden_Generation_Number: false,
    Admin_Master_Garden_Farm: false,
    Admin_Master_Garden_Tsc: false,
    Admin_Master_Garden_Worm_Stage: false,

    Admin_Master_Auction: false,
    Admin_Master_Auction_Bin: false,
    Admin_Master_Auction_Market: false,
    Admin_Master_Auction_Godown: false,
    Admin_Master_Auction_Activate_Reeler: false,
    Admin_Master_Auction_Activate_Trader: false,
    Admin_Master_Auction_Crate: false,
    Admin_Master_Auction_Race: false,
    Admin_Master_Auction_Source: false,
    Admin_Master_Auction_Flex_Time: false,
    Admin_Master_Auction_Exception_Time: false,
    Admin_Master_Auction_Market_Type: false,
    Admin_Master_Auction_Reeler_Type: false,
    Admin_Master_Auction_Update_Bank_Details: false,
    Admin_Master_Auction_External_Unit: false,
    Admin_Master_Auction_Empaneled_Vendor: false,
    Admin_Master_Auction_Reeler_Device_Mapping: false,
    Admin_Master_Auction_Race_Mapping: false,
    Admin_Master_Auction_Division: false,

    Admin_Master_General: false,
    Admin_Master_General_Pages: false,
    Admin_Master_General_Config_Role: false,
    Admin_Master_General_Activate_External: false,

    Reports: false,

    Reports_Format_Reports: false,
    Reports_Format_Reports_Sanction_Order: false,
    Reports_Format_Reports_WorkOrder: false,
    Reports_Format_Reports_Selection_Letters: false,
    Reports_Format_Reports_Acknowledgement: false,

    Reports_Admin: false,
    Reports_Admin_User_Details_Report: false,

    Reports_Dashboard: false,

    Reports_Export_Report: false,

    Reports_Export_Report_Registration: false,
    Reports_Export_Report_Registration_Farmer_Registration_Report: false,
    Reports_Export_Report_Registration_Reeler_Registration_Report: false,
    Reports_Export_Report_Registration_Renewal_Of_Reeler_License_Report: false,
    Reports_Export_Report_Registration_Pending_Renewal_Of_Reeler_License_Report: false,
    Reports_Export_Report_Registration_Trader_License_Report: false,
    Reports_Export_Report_Registration_External_Unit_Registration_Report: false,
    Reports_Export_Report_Registration_Farmer_Without_Fruits_Report: false,
    Reports_Export_Report_Registration_Other_State_Farmer_Report: false,
    Reports_Export_Report_Registration_User_master_details_report: false,

    Reports_Export_Report_DBT_And_Service: false,
    Reports_Export_Report_DBT_And_Service_All_Application_Details: false,
    Reports_Export_Report_DBT_And_Service_DBT_Success_Application_Report: false,
    Reports_Export_Report_DBT_And_Service_DBT_Failure_Application_Report: false,
    Reports_Export_Report_DBT_And_Service_DBT_K2_Application_Report: false,
    Reports_Export_Report_DBT_And_Service_DBT_B_Application_Report: false,

    Reports_Export_Report_Commercial_Market: false,
    Reports_Export_Report_Commercial_Market_Admin: false,
    Reports_Export_Report_Commercial_Market_Transaction: false,
    Reports_Export_Report_Commercial_Market_Dashboard: false,
    Reports_Export_Report_Commercial_Market_Abstract: false,
    Reports_Export_Report_Commercial_Market_District_Abstract: false,
    Reports_Export_Report_Commercial_Market_DTR_Blank_Report: false,
    Reports_Export_Report_Commercial_Market_DTR: false,
    Reports_Export_Report_Commercial_Market_Unit: false,
    Reports_Export_Report_Commercial_Market_Reeler_MF: false,
    Reports_Export_Report_Commercial_Market_District_Wise_Monthly_Report: false,
    Reports_Export_Report_Commercial_Market_Pending: false,
    Reports_Export_Report_Commercial_Market_Bidding_Report: false,
    Reports_Export_Report_Commercial_Market_Bidding_Reeler_Report: false,
    Reports_Export_Report_Commercial_Market_Farmer_Transaction_Report: false,
    Reports_Export_Report_Commercial_Market_District_Wise_Farmer_Count: false,
    Reports_Export_Report_Commercial_Market_District_Wise_Reeler_Count: false,
    Reports_Export_Report_Commercial_Market_Direct_From_Fruits: false,
    Reports_Export_Report_Commercial_Market_Reeler_Transaction_Report: false,
    Reports_Export_Report_Commercial_Market_GeneratedTriplet: false,
    Reports_Export_Report_Commercial_Market_GeneratedFarmerCopy: false,
    Reports_Export_Report_Commercial_Market_ReelerPendingReport: false,
    Reports_Export_Report_Commercial_Market_Average_Report: false,
    Reports_Export_Report_Commercial_Market_Audio_Visual_Report: false,
    Reports_Export_Report_Commercial_Market_B_Report: false,
    Reports_Export_Report_Commercial_Market_Monthly_Report: false,
    Reports_Export_Report_Commercial_Market_Market_Report: false,
    Reports_Export_Report_Commercial_Market_District_Report: false,
    Reports_Export_Report_Commercial_Market_Average_Cocoon_Report: false,

    Reports_Export_Report_Seed_Market: false,
    Reports_Export_Report_Seed_Market_Invoice_Permit_Receipt: false,
     Reports_Export_Report_Seed_Market_External_Unit_Balance_Report: false,
    Reports_Export_Report_Seed_Market_Reeler_Balance_Report: false,
   

    Reports_Export_Report_Silk_Type_Market: false,
    Reports_Export_Report_Silk_Type_Market_Dashboard: false,
    Reports_Export_Report_Silk_Type_DTR_Report: false,
    Reports_Export_Report_Silk_Type_Market_Blank_DTR_Report: false,
    Reports_Export_Report_Silk_Type_Market_Form_Report_Abstract: false,
    Reports_Export_Report_Silk_Type_Market_Form_District_Abstract_Report: false,
    Reports_Export_Report_Silk_Type_Market_District_Wise_Monthly: false,
    Reports_Export_Report_Silk_Type_Market_Unit_Counter_Report: false,

    Reports_Export_Report_Seed_And_Dfl: false,
    Reports_Export_Report_Seed_And_Dfl_Farmer_Details: false,
    Reports_Export_Report_Seed_And_Dfl_Mulberry_Farm_Report: false,
    Reports_Export_Report_Seed_And_Dfl_Dispatched_Cocoon_Report: false,
    Reports_Export_Report_Seed_And_Dfl_Farm_Wise_Report: false,
    Reports_Export_Report_Seed_And_Dfl_TSC_Wise_Sold_DFL_Details: false,
    Reports_Export_Report_Seed_And_Dfl_Cold_Storage_Schedule_Report: false,
    Reports_Export_Report_Seed_And_Dfl_Maintenance_Of_Pierced_Cocoons_report: false,
    Reports_Export_Report_Seed_And_Dfl_Maintenance_Of_Line_Report_For_Grainage: false,
    Reports_Export_Report_Seed_And_Dfl_Remittance_Report: false,

    Reports_Export_Report_Seed_And_Dfl_Sale_and_disposal_dfls_rsso_report: false,
    Reports_Export_Report_Seed_And_Dfl_Rearing_of_dfls_assessment_report: false,
    Reports_Export_Report_Seed_And_Dfl_Maintenance_of_screening_batch_bed_wise_report: false,
    Reports_Export_Report_Seed_And_Dfl_Maintenance_of_screening_batch_assessment_wise_report: false,
    Reports_Export_Report_Seed_And_Dfl_added_dfls_report: false,

    Reports_Export_Report_Garden: false,
    Reports_Export_Report_Garden_Mulberry_Garden_Report: false,
    Reports_Export_Report_Garden_Supply_Of_Cocoons_Report: false,
    Reports_Export_Report_Garden_Maintenance_And_Sale_Of_Nursery_Report: false,
    Reports_Export_Report_Garden_Seed_Cutting_Report: false,
    Reports_Export_Report_Garden_Chawki_Distribution_Report: false,

    Reports_Export_Report_Chawki_Management: false,
    Reports_Export_Report_Chawki_Management_Report: false,

    // Mulberry Target Reports
    Reports_Export_Report_Target_Setting: false,
    Reports_Export_Report_Target_Setting_District_wise: false,
    Reports_Export_Report_Target_Setting_TSC_wise: false,
    Reports_Export_Report_Target_Setting_Range_wise: false,
    Reports_Export_Report_Target_Setting_Range_wise_Daily: false,
    Reports_Export_Report_Target_Setting_District_wise_Physical: false,
    Reports_Export_Report_Target_Setting_TSC_wise_Physical: false,
    Reports_Export_Report_Target_Setting_Range_wise_Physical: false,
    Reports_Export_Report_Target_Setting_Training_Target: false,
    Reports_Export_Report_Target_Setting_Grainage_Target: false,
    Reports_Export_Report_Target_Setting_Farm_Target: false,
    Reports_Export_Report_Target_Setting_District_wise_Scheme: false,
    Reports_Export_Report_Target_Setting_TSC_wise_Scheme: false,
    Reports_Export_Report_Target_Setting_Reeling_TSC_wise_Scheme: false,
    Reports_Export_Report_Target_Setting_Grainage_Achievement_Report: false,
    Reports_Export_Report_Target_Setting_Farm_Achievement_Report: false,
    Reports_Export_Report_Target_Setting_Mulberry_Achievement_Report: false,
    Reports_Export_Report_Target_Setting_Training_Achievement_Report: false,
    Reports_Export_Report_Target_Setting_Physical_Achievement_Report: false,


    Reports_Export_Report_Inspection: false,
    Reports_Export_Report_Inspection_Verified_DFLs_Report: false,
    Reports_Export_Report_Inspection_Crop_Inspection_Report: false,
    Reports_Export_Report_Inspection_Fitness_Report: false,
    Reports_Export_Report_Inspection_Farmer_Mulberry_Extension_Report: false,
    Reports_Export_Report_Inspection_Supply_Of_Disinfectants_Report: false,

    Reports_Export_Report_Training: false,
    Reports_Export_Report_Training_Trainer_Details_Report: false,
    Reports_Export_Report_Training_Trainee_Details_Report: false,
    Reports_Export_Report_Training_Training_Deputation_Tracker_Report: false,

    Reports_Export_Report_Helpdesk: false,
    Reports_Export_Report_Helpdesk_Details_Report: false,


    // Reports_Pendency_Report: false,

    // Reports_Cumulative_Report: false,

    // Reports_Sanction_Order: false,



    // Admin_Report_Admin: false,
    // Admin_Report_Transaction: false,
    // Admin_Report_Dashboard: false,
    // Admin_Report_Abstract: false,
    // Admin_Report_District_Abstract: false,
    // Admin_Report_DTR_Blank_Report: false,
    // Admin_Report_DTR: false,
    // Admin_Report_Unit: false,
    // Admin_Report_District_Wise_Monthly_Report: false,
    // Admin_Report_Pending: false,
    // Admin_Report_Bidding_Report: false,
    // Admin_Report_Bidding_Reeler_Report: false,
    // Admin_Report_Farmer_Transaction_Report: false,
    // Admin_Report_District_Wise_Farmer_Count: false,
    // Admin_Report_District_Wise_Reeler_Count: false,
    // Admin_Report_Farmer_Wise: false,
    // Admin_Report_Reeler_Wise: false,
    // Admin_Report_Direct_From_Fruits: false,
    // Admin_Report_Reeler_Transaction_Report: false,
    // Admin_Report_GeneratedTriplet: false,
    // Admin_Report_GeneratedFarmerCopy: false,
    // Admin_Report_ReelerPendingReport: false,
    // Admin_Report_Average_Report: false,
    // Admin_Report_Audio_Visual_Report: false,
    // Admin_Report_B_Report: false,
    // Admin_Report_Monthly_Report: false,
    // Admin_Report_Market_Report: false,
    // Admin_Report_District_Report: false,
    // Admin_Report_Average_Cocoon_Report: false,
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
    if (data.includes("SeedDFL_BSF")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("SeedDFL_BSF_")) {
          updatedShowMenu[key] = true;
        }
      });
    }
    if (data.includes("SeedDFL_Grainage")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("SeedDFL_Grainage_")) {
          updatedShowMenu[key] = true;
        }
      });
    }
    if (data.includes("SeedDFL_External")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("SeedDFL_External_")) {
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

     if (data.includes("TargetSetting_Allocate")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("TargetSetting_Allocate_")) {
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

    if (data.includes("Admin_Master")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("Admin_Master_")) {
          updatedShowMenu[key] = true;
        }
      });
    }

    if (data.includes("Admin_Master_Registration")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("Admin_Master_Registration_")) {
          updatedShowMenu[key] = true;
        }
      });
    }

    if (data.includes("Admin_Report_Commercial_Market")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("Admin_Report_Commercial_Market_")) {
          updatedShowMenu[key] = true;
        }
      });
    }

    if (data.includes("Admin_Report_Seed_Market")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("Admin_Report_Seed_Market_")) {
          updatedShowMenu[key] = true;
        }
      });
    }

    if (data.includes("Admin_Report_Silk_Type_Market")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("Admin_Report_Silk_Type_Market_")) {
          updatedShowMenu[key] = true;
        }
      });
    }

    if (data.includes("Admin_Master_Land")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("Admin_Master_Land_")) {
          updatedShowMenu[key] = true;
        }
      });
    }

    if (data.includes("Admin_Master_Service")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("Admin_Master_Service_")) {
          updatedShowMenu[key] = true;
        }
      });
    }

    if (data.includes("Admin_Master_Training")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("Admin_Master_Training_")) {
          updatedShowMenu[key] = true;
        }
      });
    }

    if (data.includes("Admin_Master_HelpDesk")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("Admin_Master_HelpDesk_")) {
          updatedShowMenu[key] = true;
        }
      });
    }

    if (data.includes("Admin_Master_Garden")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("Admin_Master_Garden_")) {
          updatedShowMenu[key] = true;
        }
      });
    }

    if (data.includes("Admin_Master_Auction")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("Admin_Master_Auction_")) {
          updatedShowMenu[key] = true;
        }
      });
    }

    if (data.includes("Admin_Master_General")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("Admin_Master_General_")) {
          updatedShowMenu[key] = true;
        }
      });
    }

    if (data.includes("Admin_Report")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("Admin_Report_")) {
          updatedShowMenu[key] = true;
        }
      });
    }
    if (data.includes("Reports")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("Reports_")) {
          updatedShowMenu[key] = true;
        }
      });
    }
    if (data.includes("Reports_Format_Reports")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("Reports_Format_Reports_")) {
          updatedShowMenu[key] = true;
        }
      });
    }
    if (data.includes("Reports_Admin")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("Reports_Admin_")) {
          updatedShowMenu[key] = true;
        }
      });
    }
    if (data.includes("Reports_Dashboard")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("Reports_Dashboard_")) {
          updatedShowMenu[key] = true;
        }
      });
    }
    if (data.includes("Reports_Export_Report")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("Reports_Export_Report_")) {
          updatedShowMenu[key] = true;
        }
      });
    }

    if (data.includes("Reports_Export_Report_Registration")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("Reports_Export_Report_Registration_")) {
          updatedShowMenu[key] = true;
        }
      });
    }

    
    if (data.includes("Reports_Export_Report_DBT_And_Service")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("Reports_Export_Report_DBT_And_Service_")) {
          updatedShowMenu[key] = true;
        }
      });
    }
    if (data.includes("Reports_Export_Report_Commercial_Market")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("Reports_Export_Report_Commercial_Market_")) {
          updatedShowMenu[key] = true;
        }
      });
    }
    if (data.includes("Reports_Export_Report_Seed_Market")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("Reports_Export_Report_Seed_Market_")) {
          updatedShowMenu[key] = true;
        }
      });
    }
    if (data.includes("Reports_Export_Report_Silk_Type_Market")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("Reports_Export_Report_Silk_Type_Market_")) {
          updatedShowMenu[key] = true;
        }
      });
    }
    if (data.includes("Reports_Export_Report_Seed_And_Dfl")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("Reports_Export_Report_Seed_And_Dfl_")) {
          updatedShowMenu[key] = true;
        }
      });
    }
    if (data.includes("Reports_Export_Report_Garden")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("Reports_Export_Report_Garden_")) {
          updatedShowMenu[key] = true;
        }
      });
    }
    if (data.includes("Reports_Export_Report_Chawki_Management")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("Reports_Export_Report_Chawki_Management_")) {
          updatedShowMenu[key] = true;
        }
      });
    }

    if (data.includes("Reports_Export_Report_Target_Setting")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("Reports_Export_Report_Target_Setting_")) {
          updatedShowMenu[key] = true;
        }
      });
    }

    if (data.includes("Reports_Export_Report_Inspection")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("Reports_Export_Report_Inspection_")) {
          updatedShowMenu[key] = true;
        }
      });
    }
    if (data.includes("Reports_Export_Report_Training")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("Reports_Export_Report_Training_")) {
          updatedShowMenu[key] = true;
        }
      });
    }

    if (data.includes("Reports_Export_Report_Helpdesk")) {
      Object.keys(updatedShowMenu).forEach((key) => {
        if (key.startsWith("Reports_Export_Report_Helpdesk_")) {
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

    const hasTraining = data.some((item) => item.startsWith("Training_"));
    if (hasTraining) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        Training: true,
      }));
    }

    const hasHelpdesk = data.some((item) => item.startsWith("Helpdesk_"));
    if (hasHelpdesk) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        Helpdesk: true,
      }));
    }

    const hasSeed = data.some((item) => item.startsWith("SeedDFL_"));
    if (hasSeed) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        SeedDFL: true,
      }));
    }

    const hasSeedBsf = data.some((item) => item.startsWith("SeedDFL_BSF_"));
    if (hasSeedBsf) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        SeedDFL: true,
        SeedDFL_BSF: true,
      }));
    }

    const hasSeedGrainage = data.some((item) =>
      item.startsWith("SeedDFL_Grainage_")
    );
    if (hasSeedGrainage) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        SeedDFL: true,
        SeedDFL_Grainage: true,
      }));
    }

    const hasSeedExternal = data.some((item) =>
      item.startsWith("SeedDFL_External_")
    );
    if (hasSeedExternal) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        SeedDFL: true,
        SeedDFL_External: true,
      }));
    }

    const hasGardenExternal = data.some((item) =>
      item.startsWith("GardenManagement_")
    );
    if (hasGardenExternal) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        GardenManagement: true,
      }));
    }

     const hasChawkiExternal = data.some((item) =>
      item.startsWith("ChawkiManagement_")
    );
    if (hasChawkiExternal) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        ChawkiManagement: true,
      }));
    }

    const hasTargetSetting = data.some((item) =>
      item.startsWith("TargetSetting_")
    );
    if (hasTargetSetting) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        TargetSetting: true,
      }));
    }

    const hasTargetSettingAllocate = data.some((item) =>
      item.startsWith("TargetSetting_Allocate_")
    );
    if (hasTargetSettingAllocate) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        TargetSetting: true,
        TargetSetting_Allocate: true,
      }));
    }

    const hasTargetSettingAchievement = data.some((item) =>
      item.startsWith("TargetSetting_Achievement_")
    );
    if (hasTargetSettingAchievement) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        TargetSetting: true,
        TargetSetting_Achievement: true,
      }));
    }


    const hasReport = data.some((item) => item.startsWith("Admin_Report_"));
    if (hasReport) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        Admin_Report: true,
        Admin: true,
      }));
    }

    const hasAdminReportCommercialMarket = data.some((item) =>
      item.startsWith("Admin_Report_Commercial_Market_")
    );
    if (hasAdminReportCommercialMarket) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        Admin: true,
        Admin_Report: true,
        Admin_Report_Commercial_Market: true,
      }));
    }

    const hasAdminReportSeedCocoonMarket = data.some((item) =>
      item.startsWith("Admin_Report_Seed_Cocoon_Market_")
    );
    if (hasAdminReportSeedCocoonMarket) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        Admin: true,
        Admin_Report: true,
        Admin_Report_Seed_Cocoon_Market: true,
      }));
    }

    const hasAdminReportSilkTypeMarket = data.some((item) =>
      item.startsWith("Admin_Report_Silk_Type_Market_")
    );
    if (hasAdminReportSilkTypeMarket) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        Admin: true,
        Admin_Report: true,
        Admin_Report_Silk_Type_Market: true,
      }));
    }

    const hasGarden = data.some((item) => item.startsWith("GardenManagement_"));
    if (hasGarden) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        GardenManagement: true,
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

    const hasAdminMasterGeneral = data.some((item) =>
      item.startsWith("Admin_Master_General_")
    );
    if (hasAdminMasterGeneral) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        Admin: true,
        Admin_Master: true,
        Admin_Master_General: true,
      }));
    }

    // const hasAdminReport = data.some((item) =>
    //   item.startsWith("Admin_Report_")
    // );
    // if (hasAdminReport) {
    //   setShowMenu((prevMenu) => ({
    //     ...prevMenu,
    //     Admin: true,
    //     Admin_Master: true,
    //     Admin_Master_Report: true,
    //   }));
    // }

    const hasReports = data.some((item) =>
      item.startsWith("Reports_")
    );
    if (hasReports) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        Reports: true,
      }));
    }

    const hasReportsFormatReports = data.some((item) =>
      item.startsWith("Reports_Format_Reports_")
    );
    if (hasReportsFormatReports) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        Reports: true,
        Reports_Format_Reports: true,
      }));
    }

    const hasReportsAdmin = data.some((item) =>
      item.startsWith("Reports_Admin_")
    );
    if (hasReportsAdmin) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        Reports: true,
        Reports_Admin: true,
      }));
    }

    const hasReportsDashboard = data.some((item) =>
      item.startsWith("Reports_Dashboard_")
    );
    if (hasReportsDashboard) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        Reports: true,
        Reports_Dashboard: true,
      }));
    }

    const hasReportsExportReport = data.some((item) =>
      item.startsWith("Reports_Export_Report_")
    );
    if (hasReportsExportReport) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        Reports: true,
        Reports_Export_Report: true,
      }));
    }

    const hasReportsExportReportRegistration = data.some((item) =>
      item.startsWith("Reports_Export_Report_Registration_")
    );
    if (hasReportsExportReportRegistration) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        Reports: true,
        Reports_Export_Report: true,
        Reports_Export_Report_Registration: true,
      }));
    }

    const hasReportsExportReportDBTAndService = data.some((item) =>
      item.startsWith("Reports_Export_Report_DBT_And_Service_")
    );
    if (hasReportsExportReportDBTAndService) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        Reports: true,
        Reports_Export_Report: true,
        Reports_Export_Report_DBT_And_Service: true,
      }));
    }

    const hasReportsExportReportCommercialMarket = data.some((item) =>
      item.startsWith("Reports_Export_Report_Commercial_Market_")
    );
    if (hasReportsExportReportCommercialMarket) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        Reports: true,
        Reports_Export_Report: true,
        Reports_Export_Report_Commercial_Market: true,
      }));
    }

    const hasReportsExportReportSeedMarket = data.some((item) =>
      item.startsWith("Reports_Export_Report_Seed_Market_")
    );
    if (hasReportsExportReportSeedMarket) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        Reports: true,
        Reports_Export_Report: true,
        Reports_Export_Report_Seed_Market: true,
      }));
    }

    const hasReportsExportReportSilkTypeMarket = data.some((item) =>
      item.startsWith("Reports_Export_Report_Silk_Type_Market_")
    );
    if (hasReportsExportReportSilkTypeMarket) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        Reports: true,
        Reports_Export_Report: true,
        Reports_Export_Report_Silk_Type_Market: true,
      }));
    }

    const hasReportsExportReportSeedAndDfl = data.some((item) =>
      item.startsWith("Reports_Export_Report_Seed_And_Dfl_")
    );
    if (hasReportsExportReportSeedAndDfl) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        Reports: true,
        Reports_Export_Report: true,
        Reports_Export_Report_Seed_And_Dfl: true,
      }));
    }

    const hasReportsExportReportGarden = data.some((item) =>
      item.startsWith("Reports_Export_Report_Garden_")
    );
    if (hasReportsExportReportGarden) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        Reports: true,
        Reports_Export_Report: true,
        Reports_Export_Report_Garden: true,
      }));
    }

    const hasReportsExportReportChawkiManagement = data.some((item) =>
      item.startsWith("Reports_Export_Report_Chawki_Management_")
    );
    if (hasReportsExportReportChawkiManagement) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        Reports: true,
        Reports_Export_Report: true,
        Reports_Export_Report_Chawki_Management: true,
      }));
    }

    const hasReportsExportReportTargetSetting = data.some((item) =>
      item.startsWith("Reports_Export_Report_Target_Setting_")
    );
    if (hasReportsExportReportTargetSetting) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        Reports: true,
        Reports_Export_Report: true,
        Reports_Export_Report_Target_Setting: true,
      }));
    }

    const hasReportsExportReportInspection = data.some((item) =>
      item.startsWith("Reports_Export_Report_Inspection_")
    );
    if (hasReportsExportReportInspection) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        Reports: true,
        Reports_Export_Report: true,
        Reports_Export_Report_Inspection: true,
      }));
    }

    const hasReportsExportReportTraining = data.some((item) =>
      item.startsWith("Reports_Export_Report_Training_")
    );
    if (hasReportsExportReportTraining) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        Reports: true,
        Reports_Export_Report: true,
        Reports_Export_Report_Training: true,
      }));
    }

    const hasReportsExportReportHelpdesk = data.some((item) =>
      item.startsWith("Reports_Export_Report_Helpdesk_")
    );
    if (hasReportsExportReportHelpdesk) {
      setShowMenu((prevMenu) => ({
        ...prevMenu,
        Reports: true,
        Reports_Export_Report: true,
        Reports_Export_Report_Helpdesk: true,
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
    if (window.innerWidth > layout.breaks[headerCollapse]) {
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

  return (
    <MenuList>
      {/* Hard Code Menu with mapcode Start */}
      {showMenu.Registration ? (
        <MenuItem sub>
          {showMenu.Registration ? (
            <MenuItemLink
              text={t("Registration")}
              onClick={menuToggle}
              onMouseEnter={menuHover}
              sub
            />
          ) : null}

          <MenuSub>
            {showMenu.Registration_Farmer_Registration ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Farmer Registration")}
                  to="/seriui/stake-holder-registration"
                />
              </MenuItem>
            ) : null}
            {showMenu.Registration_Reeler_License ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Reeler License")}
                  to="/seriui/issue-new-reeler-license"
                />
              </MenuItem>
            ) : null}
            {showMenu.Registration_Renewal_of_Reeler_License ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Renewal of Reeler License")}
                  to="/seriui/renew-reeler-license"
                />
              </MenuItem>
            ) : null}
            {showMenu.Registration_Transfer_of_Reeler_License ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Transfer of Reeler License")}
                  to="/seriui/transfer-reeler-license"
                />
              </MenuItem>
            ) : null}

            {showMenu.Registration_Trader_License ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Trader License")}
                  to="/seriui/issue-new-trader-license"
                />
              </MenuItem>
            ) : null}
            {showMenu.Registration_Nsso ? (
              <MenuItem>
                <MenuItemLink
                  text={t("RSP/CRC/NSSO Registration")}
                  to="/seriui/external-unit-registration"
                />
              </MenuItem>
            ) : null}
            {/* {showMenu.Registration_Farmer_Without_FruitsId ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Farmer Without FruitsId")}
                  to="/seriui/farmer-without-fruits"
                />
              </MenuItem>
            ) : null} */}
            {/* {showMenu.Registration_Other_State_Farmer ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Other State Farmer")}
                  to="/seriui/other-state-farmer"
                />
              </MenuItem>
            ) : null} */}
          </MenuSub>
        </MenuItem>
      ) : null}

      {showMenu.Services ? (
        <MenuItem sub>
          {showMenu.Services ? (
            <MenuItemLink
              text={t("service")}
              onClick={menuToggle}
              onMouseEnter={menuHover}
              sub
            />
          ) : null}
          <MenuSub>
            {showMenu.Services_Service_Application ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Service Application")}
                  to="/seriui/service-application"
                />
              </MenuItem>
            ) : null}
            {/* {showMenu.Services_Subsidy_Programmes ? (
              <MenuItem>
                <MenuItemLink
                  text="Subsidy Programmes"
                  to="/seriui/subsidy-programs"
                />
              </MenuItem>
            ) : null} */}
            {showMenu.Services_Service_Dashboard ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Service Dashboard")}
                  to="/seriui/application-dashboard"
                />
              </MenuItem>
            ) : null}

            {showMenu.Services_Service_Applications_For_Incentive_Bonus_Seed_Cocoon ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Applications For Incentive,Bonus,Seed Cocoon")}
                  to="/seriui/multiple-sanction-order-list"
                />
              </MenuItem>
            ) : null}

             {/* {showMenu.Services_Service_Download_Documents ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Download Documents")}
                  to="/seriui/generate-sanction-order"
                />
              </MenuItem>
            ) : null} */}

             {showMenu.Services_Service_Crop_Details_Commercial_Market ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Crop Details-Commercial Market")}
                  to="/seriui/crop-details-commercial-market"
                />
              </MenuItem>
            ) : null}

            {showMenu.Services_Service_Crop_Details_Seed_Market ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Crop Details-Seed Market")}
                  to="/seriui/crop-details-seed-market"
                />
              </MenuItem>
            ) : null}

            {/* {showMenu.Services_Dbt_Application ? (
              <MenuItem>
                <MenuItemLink
                  text={t("DBT Application")}
                  to="/seriui/dbt-application"
                />
              </MenuItem>
            ) : null} */}

            {/* {showMenu.Services_Track_the_DFL_procurement ? (
              <MenuItem>
                <MenuItemLink
                  text="Track DFL Procurement"
                  to="/seriui/track-dfl-procurement"
                />
              </MenuItem>
            ) : null}
            {showMenu.Services_Track_Mulberry_Status ? (
              <MenuItem>
                <MenuItemLink
                  text="Track Mulberry Status"
                  to="/seriui/track-mulberry-status"
                />
              </MenuItem>
            ) : null}
            {showMenu.Services_Supply_of_Disinfection ? (
              <MenuItem>
                <MenuItemLink
                  text="Supply of Disinfection"
                  to="/seriui/supply-disinfectants"
                />
              </MenuItem>
            ) : null}
            {showMenu.Services_Apply_Incentives ? (
              <MenuItem>
                <MenuItemLink
                  text="Apply Incentives"
                  to="/seriui/providing-incentives"
                />
              </MenuItem>
            ) : null}
            {showMenu.Services_Apply_Subsidy ? (
              <MenuItem>
                <MenuItemLink
                  text="Apply Subsidy"
                  to="/seriui/providing-subsidy"
                />
              </MenuItem>
            ) : null}
            {showMenu.Services_Providing_Chawki_Rearing_Incentives ? (
              <MenuItem>
                <MenuItemLink
                  text="Providing Chawki Rearing incentives"
                  to="/seriui/providing-chawki-incentives"
                />
              </MenuItem>
            ) : null}
            {showMenu.Services_Providing_Incentives_To_Reelers ? (
              <MenuItem>
                <MenuItemLink
                  text="Apply incentives to Reelers"
                  to="/seriui/providing-reeler-incentives"
                />
              </MenuItem>
            ) : null}
            {showMenu.Services_Providing_Subsidy_To_Reelers ? (
              <MenuItem>
                <MenuItemLink
                  text="Apply subsidy to the Reelers"
                  to="/seriui/providing-reeler-subsidy"
                />
              </MenuItem>
            ) : null} */}
          </MenuSub>
        </MenuItem>
      ) : null}

      {showMenu.DBT ? (
        <MenuItem sub>
          {showMenu.DBT ? (
            <MenuItemLink
              text={t("dbt")}
              onClick={menuToggle}
              onMouseEnter={menuHover}
              sub
            />
          ) : null}

          <MenuSub>
            {/* {showMenu.DBT_Subsidy_Verification ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Subsidy Verification")}
                  to="/seriui/subsidy-approval-verification"
                />
              </MenuItem>
            ) : null}
            {showMenu.DBT_Subsidy_Sanction ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Subsidy Sanction")}
                  to="/seriui/subsidy-sanction"
                />
              </MenuItem>
            ) : null}
            {showMenu.DBT_Subsidy_Drawing ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Subsidy Drawing")}
                  to="/seriui/subsidy-drawing"
                />
              </MenuItem>
            ) : null}
            {showMenu.DBT_Subsidy_Counter_Signing ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Subsidy Counter Signing")}
                  to="/seriui/subsidy-counter-sign"
                />
              </MenuItem>
            ) : null} */}
            {showMenu.DBT_Drawing_Officer_List_For_K2_Push ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Drawing Officer List – K2 Push")}
                  to="/seriui/drawing-officer-list-for-k2-push"
                />
              </MenuItem>
            ) : null}
            {showMenu.DBT_Drawing_Officer_List_For_DBT_Push ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Drawing Officer List – DBT Push")}
                  to="/seriui/drawing-officer-list-for-dbt-push"
                />
              </MenuItem>
            ) : null}
            {showMenu.DBT_Drawing_Officer_List_For_Vendor_DBT_Push ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Drawing Officer List – Vendor DBT Push")}
                  to="/seriui/drawing-officer-list-for-vendor-dbt-push"
                />
              </MenuItem>
            ) : null}
            {showMenu.DBT_Drawing_Officer_List_For_Vendor_K2_Push ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Drawing Officer List – Vendor K2 Push")}
                  to="/seriui/drawing-officer-list-for-vendor-k2-push"
                />
              </MenuItem>
            ) : null}
            {/* {showMenu.DBT_Reject_List ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Report Rejection List")}
                  to="/seriui/report-reject-list"
                />
              </MenuItem>
            ) : null} */}
            {showMenu.DBT_Rejection_List_For_DBT ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Rejection List-K2")}
                  to="/seriui/report-reject-list-k2"
                />
              </MenuItem>
            ) : null}
            {showMenu.DBT_Rejection_List_For_K2? (
              <MenuItem>
                <MenuItemLink
                  text={t("Rejection List-DBT")}
                  to="/seriui/report-reject-list-dbt"
                />
              </MenuItem>
            ) : null}
            {showMenu.DBT_Success_List ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Report Success List")}
                  to="/seriui/report-success-list"
                />
              </MenuItem>
            ) : null}
            {showMenu.DBT_DBT_Pushed_List ? (
              <MenuItem>
                <MenuItemLink
                  text={t("DBT Pushed List")}
                  to="/seriui/dbt-pushed-list"
                />
              </MenuItem>
            ) : null}
            {/* {showMenu.DBT_Drawing_Officer_List ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Drawing Officer List")}
                  to="/seriui/drawing-officer-list"
                />
              </MenuItem>
            ) : null} */}
            
            {/* {showMenu.DBT_Drawing_Officer_List ? (
              <MenuItem>
                <MenuItemLink
                  text={t("All Scheme Drawing Officer List")}
                  to="/seriui/all-scheme-drawing-officer-list"
                />
              </MenuItem>
            ) : null} */}
            {/* {showMenu.DBT_Tsc_Officer_List ? (
              <MenuItem>
                <MenuItemLink
                  text={t("TSC Officer List")}
                  to="/seriui/tsc-officer-list"
                />
              </MenuItem>
            ) : null} */}
            {/* {showMenu.DBT_Tsc_Officer_List ? (
              <MenuItem>
                <MenuItemLink
                  text={t("All Scheme TSC Officer List")}
                  to="/seriui/all-scheme-tsc-officer-list"
                />
              </MenuItem>
            ) : null} */}
          </MenuSub>
        </MenuItem>
      ) : null}

      {showMenu.Market ? (
        <MenuItem sub>
          {showMenu.Market ? (
            <MenuItemLink
              text={t("market_and_auction")}
              onClick={menuToggle}
              onMouseEnter={menuHover}
              sub
            />
          ) : null}
          <MenuSub>
            {/* {showMenu.Market_Register ? (
            <MenuItem>
              <MenuItemLink text="e-Register" to="#" />
            </MenuItem>
          ) : null} */}
            {/* {showMenu.Market_Bidding ? (
              <MenuItem>
                <MenuItemLink text="e-Inward" to="/seriui/bidding-slip" />
              </MenuItem>
            ) : null} */}
            {/* {showMenu.Market_Bidding ? (
              <MenuItem>
                <MenuItemLink
                  text="e-Inward (Silk Market)"
                  to="/seriui/silk-bidding-slip"
                />
              </MenuItem>
            ) : null} */}
            {/* {showMenu.Market_Accept_Farmer_Auction ? (
              <MenuItem>
                <MenuItemLink
                  text="e-Acceptance"
                  to="/seriui/accept-former-auction"
                />
              </MenuItem>
            ) : null} */}
            {/* {showMenu.Market_Auction ? (
            <MenuItem>
              <MenuItemLink text="e-Auction" to="/seriui/reject-lot" />
            </MenuItem>
          ) : null} */}
            {/* {showMenu.Market_Weighment ? (
              <MenuItem>
                <MenuItemLink text="e-Weighment" to="/seriui/weighment" />
              </MenuItem>
            ) : null} */}

            {/* {showMenu.Market_Weighment ? (
              <MenuItem>
                <MenuItemLink
                  text="e-Weighment (Silk Market)"
                  to="/seriui/weighment-for-silk-market"
                />
              </MenuItem>
            ) : null} */}
            {/* {showMenu.Market_Gatepass ? (
              <MenuItem>
                <MenuItemLink text="Gatepass" to="/seriui/gatepass" />
              </MenuItem>
            ) : null} */}
            {/* <MenuItem>
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
                          to="/seriui/ready-for-payment"
                        />
                      </MenuItem>
                    ) : null}
                    {showMenu.Market_Payment_Bulk_Send_To_Bank ? (
                      <MenuItem>
                        <MenuItemLink
                          text="Bulk Send to Bank"
                          to="/seriui/bulk-send-to-bank"
                        />
                      </MenuItem>
                    ) : null}
                    {showMenu.Market_Payment_Bank_Statement ? (
                      <MenuItem>
                        <MenuItemLink
                          text="Bank Statement"
                          to="/seriui/bank-statement"
                        />
                      </MenuItem>
                    ) : null}
                  </MenuSub>
                </MenuItem>
              ) : null}
            </MenuItem> */}
            {/* <MenuItem>
              {showMenu.Market_SeedMarket ? (
                <MenuItem sub>
                  <MenuItemLink
                    text="Seed Market"
                    onClick={menuToggle}
                    onMouseEnter={menuHover}
                    sub
                  />
                  <MenuSub>
                    {showMenu.Market_SeedMarket_Weighment ? (
                      <MenuItem>
                        <MenuItemLink
                          text="Weighment"
                          to="/seriui/weighment-for-seed-market"
                        />
                      </MenuItem>
                    ) : null}
                    {showMenu.Market_SeedMarket_Lot_Distribution ? (
                      <MenuItem>
                        <MenuItemLink
                          text="Lot Distribution "
                          to="/seriui/lot-groupage"
                        />
                      </MenuItem>
                    ) : null}
                  </MenuSub>
                </MenuItem>
              ) : null}
            </MenuItem> */}
            <MenuItem>
              {showMenu.Market_SeedMarket ? (
                <MenuItem sub>
                  <MenuItemLink
                    text={t("Commercial Market")}
                    onClick={menuToggle}
                    onMouseEnter={menuHover}
                    sub
                  />
                  <MenuSub>
                    {showMenu.Market_Bidding ? (
                      <MenuItem>
                        <MenuItemLink
                          text={t("e-Inward")}
                          to="/seriui/bidding-slip"
                        />
                      </MenuItem>
                    ) : null}
                    {showMenu.Market_Accept_Farmer_Auction ? (
                      <MenuItem>
                        <MenuItemLink
                          text={t("e-Acceptance")}
                          to="/seriui/accept-former-auction"
                        />
                      </MenuItem>
                    ) : null}
                    {showMenu.Market_Weighment ? (
                      <MenuItem>
                        <MenuItemLink
                          text={t("e-Weighment")}
                          to="/seriui/weighment"
                        />
                      </MenuItem>
                    ) : null}
                    {showMenu.Market_Gatepass ? (
                      <MenuItem>
                        <MenuItemLink text="Gatepass" to="/seriui/gatepass" />
                      </MenuItem>
                    ) : null}
                    {/* <MenuItem> */}
                    {showMenu.Market_Payment ? (
                      <MenuItem sub>
                        <MenuItemLink
                          text={t("e-Payment")}
                          onClick={menuToggle}
                          onMouseEnter={menuHover}
                          sub
                        />
                        <MenuSub>
                          {showMenu.Market_Payment_Ready_for_Payment ? (
                            <MenuItem>
                              <MenuItemLink
                                text={t("Ready for Payment")}
                                to="/seriui/ready-for-payment"
                              />
                            </MenuItem>
                          ) : null}
                          {showMenu.Market_Payment_Bulk_Send_To_Bank ? (
                            <MenuItem>
                              <MenuItemLink
                                text={t("Bulk Send to Bank")}
                                to="/seriui/bulk-send-to-bank"
                              />
                            </MenuItem>
                          ) : null}
                          {showMenu.Market_Payment_Bank_Statement ? (
                            <MenuItem>
                              <MenuItemLink
                                text={t("Bank Statement")}
                                to="/seriui/bank-statement"
                              />
                            </MenuItem>
                          ) : null}
                        </MenuSub>
                      </MenuItem>
                    ) : null}
                    {showMenu.Market_Reject ? (
                      <MenuItem>
                        <MenuItemLink
                          text={t("Reject Lot")}
                          to="/seriui/reject-lot"
                        />
                      </MenuItem>
                    ) : null}
                    {showMenu.Market_Show_Lot ? (
                      <MenuItem>
                        <MenuItemLink
                          text={t("Show Lot Details")}
                          to="/seriui/display-all-lot"
                        />
                      </MenuItem>
                    ) : null}
                    {/* </MenuItem> */}
                  </MenuSub>
                </MenuItem>
              ) : null}
            </MenuItem>
            <MenuItem>
              {showMenu.Market_SeedMarket ? (
                <MenuItem sub>
                  <MenuItemLink
                    text={t("Seed Market")}
                    onClick={menuToggle}
                    onMouseEnter={menuHover}
                    sub
                  />
                  <MenuSub>
                    {showMenu.Market_SeedCocoonMarket_Inward ? (
                      <MenuItem>
                        <MenuItemLink
                          text={t(
                            "Seed Market Invoice,Permit,Cash Receipt,Market Receipt"
                          )}
                          to="/seriui/invoice-permit-market-receipt"
                        />
                      </MenuItem>
                    ) : null}
                    {showMenu.Market_SeedCocoonMarket_Inward ? (
                      <MenuItem>
                        <MenuItemLink
                          text={t("e-Inward")}
                          to="/seriui/seed-cocoon-inward"
                        />
                      </MenuItem>
                    ) : null}
                    {/* {showMenu.Market_SeedCocoonMarket_Base_Price_Fixation ? (
                      <MenuItem>
                        <MenuItemLink
                          text={t("Base Price Fixation")}
                          to="/seriui/base-price-fixation"
                        />
                      </MenuItem>
                    ) : null} */}

                    {showMenu.Market_SeedCocoonMarket_Lot_Wise_Price_Fixation ? (
                      <MenuItem>
                        <MenuItemLink
                          text={t("Lot Wise Price Fixation")}
                          to="/seriui/lot-wise-base-price-fixation"
                        />
                      </MenuItem>
                    ) : null}

                    {showMenu.Market_SeedCocoonMarket_Pupa_Test_Cocoon_Assessment_Page ? (
                      <MenuItem>
                        <MenuItemLink
                          text={t("Pupa Test And Cocoon Assessment Page")}
                          to="/seriui/pupa-test-and-assessment-page"
                        />
                      </MenuItem>
                    ) : null}

                    {showMenu.Market_SeedMarket_Weighment ? (
                      <MenuItem>
                        <MenuItemLink
                          text={t("Weighment")}
                          to="/seriui/weighment-for-seed-market"
                        />
                      </MenuItem>
                    ) : null}

                      {showMenu.Market_SeedMarket_Delete_Lot ? (
                      <MenuItem>
                        <MenuItemLink
                          text={t("Delete Lot")}
                          to="/seriui/delete-lot"
                        />
                      </MenuItem>
                    ) : null}
                    {showMenu.Market_SeedMarket_Lot_Distribution ? (
                      <MenuItem>
                        <MenuItemLink
                          text={t("Lot Distribution")}
                          to="/seriui/lot-groupage"
                        />
                      </MenuItem>
                    ) : null}

                    {showMenu.Market_SeedMarket_Payment ? (
                      <MenuItem sub>
                        <MenuItemLink
                          text={t("e-Payment For Seed Market")}
                          onClick={menuToggle}
                          onMouseEnter={menuHover}
                          sub
                        />
                        <MenuSub>
                          {showMenu.Market_SeedMarket_Ready_For_Payment ? (
                            <MenuItem>
                              <MenuItemLink
                                text={t("Ready for Payment")}
                                to="/seriui/ready-for-payment-for-seed-market"
                              />
                            </MenuItem>
                          ) : null}
                          {showMenu.Market_SeedMarket_Bulk_Send_To_Payment ? (
                            <MenuItem>
                              <MenuItemLink
                                text={t("Bulk Send to Payment")}
                                to="/seriui/bulk-send-to-payment-for-seed-market"
                              />
                            </MenuItem>
                          ) : null}
                          {showMenu.Market_SeedMarket_Payment_Statement ? (
                            <MenuItem>
                              <MenuItemLink
                                text={t("Payment Statement")}
                                to="/seriui/payment-statement-for-seed-market"
                              />
                            </MenuItem>
                          ) : null}
                        </MenuSub>
                      </MenuItem>
                    ) : null}
                  </MenuSub>
                </MenuItem>
              ) : null}
            </MenuItem>
            <MenuItem>
              {showMenu.Market_SeedMarket ? (
                <MenuItem sub>
                  <MenuItemLink
                    text={t("Silk Exchange")}
                    onClick={menuToggle}
                    onMouseEnter={menuHover}
                    sub
                  />
                  <MenuSub>
                    {showMenu.Market_Bidding ? (
                      <MenuItem>
                        <MenuItemLink
                          text={t("e-Inward (Silk Exchange)")}
                          to="/seriui/silk-bidding-slip"
                        />
                      </MenuItem>
                    ) : null}
                    {showMenu.Market_Weighment ? (
                      <MenuItem>
                        <MenuItemLink
                          text={t("e-Weighment (Silk Exchange)")}
                          to="/seriui/weighment-for-silk-market"
                        />
                      </MenuItem>
                    ) : null}
                  </MenuSub>
                </MenuItem>
              ) : null}
            </MenuItem>

            {/* <MenuItem>
              {showMenu.Market_SeedMarket_Payment ? (
                <MenuItem sub>
                  <MenuItemLink
                    text="e-Payment For Seed Market"
                    onClick={menuToggle}
                    onMouseEnter={menuHover}
                    sub
                  />
                  <MenuSub>
                    {showMenu.Market_SeedMarket_Ready_For_Payment ? (
                      <MenuItem>
                        <MenuItemLink
                          text="Ready for Payment"
                          to="/seriui/ready-for-payment-for-seed-market"
                        />
                      </MenuItem>
                    ) : null}
                    {showMenu.Market_SeedMarket_Bulk_Send_To_Payment ? (
                      <MenuItem>
                        <MenuItemLink
                          text="Bulk Send to Payment"
                          to="/seriui/bulk-send-to-payment-for-seed-market"
                        />
                      </MenuItem>
                    ) : null}
                    {showMenu.Market_SeedMarket_Payment_Statement ? (
                      <MenuItem>
                        <MenuItemLink
                          text="Payment Statement"
                          to="/seriui/payment-statement-for-seed-market"
                        />
                      </MenuItem>
                    ) : null}
                  </MenuSub>
                </MenuItem>
              ) : null}
            </MenuItem> */}

            {/* {showMenu.Market_Reject ? (
              <MenuItem>
                <MenuItemLink text="Reject Lot" to="/seriui/reject-lot" />
              </MenuItem>
            ) : null}
            {showMenu.Market_Show_Lot ? (
              <MenuItem>
                <MenuItemLink
                  text="Show Lot Details"
                  to="/seriui/display-all-lot"
                />
              </MenuItem>
            ) : null} */}
            {/* {showMenu.Market_Reeler_Initial_Amount ? (
              <MenuItem>
                <MenuItemLink
                  text="Reeler Initial Amount"
                  to="/seriui/reeler-initial-amount"
                />
              </MenuItem>
            ) : null} */}
            {/* {showMenu.Market_Permit ? (
            <MenuItem>
              <MenuItemLink text="e-Permit" to="#" />
            </MenuItem>
          ) : null} */}
            {/* {showMenu.Market_Reject_Farmer_Auction ? (
            <MenuItem>
              <MenuItemLink
                text="Reject Farmer Auction"
                to="/seriui/reject-farmer-auction"
              />
            </MenuItem>
          ) : null} */}
            {/* {showMenu.Market_Generate_Bidding_Slip ? (
            <MenuItem>
              <MenuItemLink
                text="Generate Bidding Slip"
                to="/seriui/generate-bidding-slip"
              />
            </MenuItem>
          ) : null} */}
            {/* {showMenu.Market_Update_Lot_Weight ? (
            <MenuItem>
              <MenuItemLink text="Update Lot Weight" to="/seriui/update-lot-weight" />
            </MenuItem>
          ) : null} */}
          </MenuSub>
        </MenuItem>
      ) : null}

      {showMenu.SeedDFL ? (
        <MenuItem sub>
          {showMenu.SeedDFL ? (
            <MenuItemLink
              text={t("seed_and_dfl")}
              onClick={menuToggle}
              onMouseEnter={menuHover}
              sub
            />
          ) : null}
          <MenuSub>
            {showMenu.SeedDFL_BSF ? (
              <MenuItem sub>
                <MenuItemLink
                  text={t("BSF Kunigal")}
                  onClick={menuToggle}
                  onMouseEnter={menuHover}
                  sub
                />
                <MenuSub>
                  {showMenu.SeedDFL_BSF_Garden_Farm ? (
                    <MenuItem>
                      <MenuItemLink
                        text={t("Maintenance of mulberry Garden in the Farms")}
                        to="/seriui/Maintenance-of-mulberry-Garden-in-the-Farms"
                      />
                    </MenuItem>
                  ) : null}

                  {showMenu.SeedDFL_BSF_DFLs_from_P4_Grainage ? (
                    <MenuItem>
                      <MenuItemLink
                        text={t("Receipt of DFLs from the P4 grainage")}
                        to="/seriui/Receipt-of-DFLs-from-the-P4-grainage"
                      />
                    </MenuItem>
                  ) : null}

                  {showMenu.SeedDFL_BSF_Line_Records_Each_race ? (
                    <MenuItem>
                      <MenuItemLink
                        text={t("Maintenance of Line Records for Each Race")}
                        to="/seriui/Maintenance-of-Line-Records-for-Each-Race"
                      />
                    </MenuItem>
                  ) : null}

                  {showMenu.SeedDFL_BSF_Screening_batch_record ? (
                    <MenuItem>
                      <MenuItemLink
                        text={t("Maintenance of Screening Batch Records")}
                        to="/seriui/Maintenance-of-Screening-Batch-Records"
                      />
                    </MenuItem>
                  ) : null}

                  {showMenu.SeedDFL_BSF_DFLs_for_the_8_lines ? (
                    <MenuItem>
                      <MenuItemLink
                        text={t("Rearing of DFLs for the 8 Lines")}
                        to="/seriui/Rearing-of-DFLs-for-the-8-Lines"
                      />
                    </MenuItem>
                  ) : null}

                  {showMenu.SeedDFL_BSF_Remittance ? (
                    <MenuItem>
                      <MenuItemLink
                        text={t("Remittance (Eggs / PC / Others)")}
                        to="/seriui/remittance-for-farm"
                      />
                    </MenuItem>
                  ) : null}

                  {showMenu.SeedDFL_BSF_Cocoons_to_P4_Grainage ? (
                    <MenuItem>
                      <MenuItemLink
                        text={t("Dispatch of Cocoons to P4 Grainage")}
                        to="/seriui/Dispatch-of-Cocoons-to-P4-Grainage"
                      />
                    </MenuItem>
                  ) : null}
                </MenuSub>
              </MenuItem>
            ) : null}

            {showMenu.SeedDFL_Grainage ? (
              <MenuItem sub>
                <MenuItemLink
                  text={t("Grainage")}
                  onClick={menuToggle}
                  onMouseEnter={menuHover}
                  sub
                />
                <MenuSub>
                  {showMenu.SeedDFL_Grainage_Line_Records_Each_race ? (
                    <MenuItem>
                      <MenuItemLink
                        text={t("Maintenance of Line Records for Each Race")}
                        to="/seriui/Maintenance-of-Line-Records-for-Each-Race-For-Grainage"
                      />
                    </MenuItem>
                  ) : null}
                  {showMenu.SeedDFL_Grainage_Seed_Cocoon_Processing ? (
                    <MenuItem>
                      <MenuItemLink
                        text={t("Preservation of seed cocoon for processing")}
                        to="/seriui/Preservation-of-seed-cocoon-for-processing"
                      />
                    </MenuItem>
                  ) : null}

                  {showMenu.SeedDFL_Grainage_Preparation_Egg_DFLs ? (
                    <MenuItem>
                      <MenuItemLink
                        text={t("Preparation of eggs DFLs")}
                        to="/seriui/Preparation-of-eggs-DFLs"
                      />
                    </MenuItem>
                  ) : null}

                  {showMenu.SeedDFL_Grainage_Eggs_Cold_storage ? (
                    <MenuItem>
                      <MenuItemLink
                        text={t("Maintenance of eggs at cold storage")}
                        to="/seriui/maintenance-of-eggs-at-cold-storage"
                      />
                    </MenuItem>
                  ) : null}

                  {showMenu.SeedDFL_Grainage_Cold_Storage_Schedule_BV ? (
                    <MenuItem>
                      <MenuItemLink
                        text={t("Cold Storage Schedule BV")}
                        to="/seriui/Cold-Storage-Schedule-BV"
                      />
                    </MenuItem>
                  ) : null}

                  {showMenu.SeedDFL_Grainage_Sale_of_DFLs_Eggs ? (
                    <MenuItem>
                      <MenuItemLink
                        text={t("Sale/Disposal of DFLs (eggs)")}
                        to="/seriui/Sale-Disposal-of-DFLs-eggs"
                      />
                    </MenuItem>
                  ) : null}

                  {showMenu.SeedDFL_Grainage_Testing_Of_Moth ? (
                    <MenuItem>
                      <MenuItemLink
                        text={t("Testing Of Moth/Pupa")}
                        to="/seriui/testing-of-moth"
                      />
                    </MenuItem>
                  ) : null}
                  {showMenu.SeedDFL_Grainage_Maintenance_Of_Pierced_Cocoons ? (
                    <MenuItem>
                      <MenuItemLink
                        text={t("Maintenance Of Pierced Cocoons")}
                        to="/seriui/maintenance-of-pierced-cocoons"
                      />
                    </MenuItem>
                  ) : null}

                  {showMenu.SeedDFL_Grainage_Sale_Of_Pierced_Cocoons ? (
                    <MenuItem>
                      <MenuItemLink
                        text={t("Sale/Disposal of Pierced Cocoons")}
                        to="/seriui/sale-disposal-of-pierced-cocoons"
                      />
                    </MenuItem>
                  ) : null}

                  {showMenu.SeedDFL_Grainage_Maintenance_Of_Egg_Laying_Sheets ? (
                    <MenuItem>
                      <MenuItemLink
                        text={t("Maintenance Of Egg Laying Sheets")}
                        to="/seriui/maintenance-of-egg-laying-sheets"
                      />
                    </MenuItem>
                  ) : null}

                  {showMenu.SeedDFL_Grainage_Remittance ? (
                    <MenuItem>
                      <MenuItemLink
                        text={t("Remittance (Eggs / PC / Others)")}
                        to="/seriui/remittance"
                      />
                    </MenuItem>
                  ) : null}
                </MenuSub>
              </MenuItem>
            ) : null}

            {showMenu.SeedDFL_External ? (
              <MenuItem sub>
                <MenuItemLink
                  text={t("External Users")}
                  onClick={menuToggle}
                  onMouseEnter={menuHover}
                  sub
                />
                <MenuSub>
                  {showMenu.SeedDFL_External_Preservation_Of_Seed_Cocoon_Rsp ? (
                    <MenuItem>
                      <MenuItemLink
                        text={t("Preservation Of Seed Cocoon For RSP/NSSO")}
                        to="/seriui/Preservation-of-seed-cocoon-for-processing-for-nsso"
                      />
                    </MenuItem>
                  ) : null}

                  {showMenu.SeedDFL_External_Preparation_Egg_DFLs ? (
                    <MenuItem>
                      <MenuItemLink
                        text={t("Preparation of eggs (DFLs) RSP/NSSO")}
                        to="/seriui/registered-seed-producer-nsso-grainages"
                      />
                    </MenuItem>
                  ) : null}

                  {showMenu.SeedDFL_External_Sale_of_DFLs_Eggs ? (
                    <MenuItem>
                      <MenuItemLink
                        text={t("Sale / Dis posal of DFL’s (eggs) RSP/NSSO")}
                        to="/seriui/sale-and-disposal-of-eggs-nsso"
                      />
                    </MenuItem>
                  ) : null}

                  {showMenu.SeedDFL_External_Eggs_Cold_storage ? (
                    <MenuItem>
                      <MenuItemLink
                        text={t("Maintenance of eggs at cold storage RSP/NSSO")}
                        to="/seriui/Maintenance-of-eggs-at-cold"
                      />
                    </MenuItem>
                  ) : null}
                </MenuSub>
              </MenuItem>
            ) : null}

            {/* {showMenu.SeedDFL_Grainages ? (
            <MenuItem sub>
              <MenuItemLink
                text="Grainages"
                onClick={menuToggle}
                onMouseEnter={menuHover}
                sub
              />
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
              <MenuSub></MenuSub>
            </MenuItem>
          ) : null} */}
          </MenuSub>
        </MenuItem>
      ) : null}

      {showMenu.GardenManagement ? (
        <MenuItem sub>
          {showMenu.GardenManagement ? (
            <MenuItemLink
              text={t("garden_management")}
              onClick={menuToggle}
              onMouseEnter={menuHover}
              sub
            />
          ) : null}
          <MenuSub>
            {showMenu.GardenManagement_Mulberry_Garden ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Maintenance Of Mulberry Garden")}
                  to="/seriui/maintenance-of-mulberry-garden"
                />
              </MenuItem>
            ) : null}

            {showMenu.GardenManagement_DFL_From_The_Grainage ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Receipt of DFLs from the grainage")}
                  to="/seriui/receipt-of-dfls"
                />
              </MenuItem>
            ) : null}

            {showMenu.GardenManagement_Rearing_of_DFL ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Rearing of DFLs")}
                  to="/seriui/rearing-of-dfls"
                />
              </MenuItem>
            ) : null}

            {showMenu.GardenManagement_Cocoons_to_Grainage ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Supply of Cocoons to Grainagee")}
                  to="/seriui/Supply-of-Cocoons-to-Grainagee"
                />
              </MenuItem>
            ) : null}

            {showMenu.GardenManagement_Sale_of_Nursery_to_Farmers ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Maintenance and Sale of Nursery to Farmers")}
                  to="/seriui/Maintenance-and-Sale-of-Nursery-to-Farmers"
                />
              </MenuItem>
            ) : null}

            {showMenu.GardenManagement_Seed_Cutting_Bank ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Seed Cutting Bank")}
                  to="/seriui/seed-cutting-bank"
                />
              </MenuItem>
            ) : null}

            {showMenu.GardenManagement_Distribution_Farmers ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Chawki distribution to Farmers")}
                  to="/seriui/chawki-distribution"
                />
              </MenuItem>
            ) : null}
          </MenuSub>
        </MenuItem>
      ) : null}

      {showMenu.ChawkiManagement ? (
        <MenuItem sub>
          {showMenu.ChawkiManagement ? (
            <MenuItemLink
              text={t("chawki_management")}
              onClick={menuToggle}
              onMouseEnter={menuHover}
              sub
            />
          ) : null}
          <MenuSub>
            {showMenu.ChawkiManagement_ChawkiManagement ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Sale Of Chawki Worms")}
                  to="/seriui/chawki-management"
                />
              </MenuItem>
            ) : null}
          </MenuSub>
        </MenuItem>
      ) : null}

      {showMenu.TargetSetting ? (
        <MenuItem sub>
          {showMenu.TargetSetting ? (
            <MenuItemLink
              text={t("target_setting")}
              onClick={menuToggle}
              onMouseEnter={menuHover}
              sub
            />
          ) : null}
          <MenuSub>

            {showMenu.TargetSetting_Allocate ? (
              <MenuItem sub>
                <MenuItemLink
                  text={t("Target Setting")}
                  onClick={menuToggle}
                  onMouseEnter={menuHover}
                  sub
                />
                <MenuSub>
                  {showMenu.TargetSetting_Allocate_District_Wise_Mulberry ? (
                    <MenuItem>
                      <MenuItemLink
                        text={t(
                          "District Wise Area Under Mulberry Monthly Target"
                        )}
                        to="/seriui/districtwise-montly-mulberry-new"
                      />
                    </MenuItem>
                  ) : null}
                  {/* {showMenu.TargetSetting_Allocate_Budget_Hoa ? (
                    <MenuItem>
                      <MenuItemLink
                        text="Budget to HOA"
                        to="/seriui/budget-hoa"
                      />
                    </MenuItem>
                  ) : null} */}
                  {/* {showMenu.TargetSetting_Allocate_Budget_District ? (
                    <MenuItem>
                      <MenuItemLink
                        text="Budget to District"
                        to="/seriui/budget-district"
                      />
                    </MenuItem>
                  ) : null} */}
                  {showMenu.TargetSetting_Allocate_TSC_Wise_Mulberry ? (
                    <MenuItem>
                      <MenuItemLink
                        text={t("TSC Wise Area Under Mulberry Monthly Target")}
                        to="/seriui/tsc-mulberry-targets-new"
                      />
                    </MenuItem>
                  ) : null}
                  {showMenu.TargetSetting_Allocate_Range_Wise_Mulberry ? (
                    <MenuItem>
                      <MenuItemLink
                        text={t("Range Area Under Mulberry Monthly Target")}
                        to="/seriui/si-sd-mulberry-target-new"
                      />
                    </MenuItem>
                  ) : null}
                  {showMenu.TargetSetting_Allocate_Range_Wise_Mulberry_Targets_Daily ? (
                    <MenuItem>
                      <MenuItemLink
                        text={t("Range Area Under Mulberry Daily Target")}
                        to="/seriui/si-sd-mulberry-day-target-new"
                      />
                    </MenuItem>
                  ) : null}
                  {showMenu.TargetSetting_Allocate_District_Wise_Physical_Target ? (
                    <MenuItem>
                      <MenuItemLink
                        text={t("District Wise Physical Target Setting")}
                        to="/seriui/districtwise-product-physical-target-setting"
                      />
                    </MenuItem>
                  ) : null}
                  {showMenu.TargetSetting_Allocate_TSC_Wise_Physical_Target ? (
                    <MenuItem>
                      <MenuItemLink
                        text={t("TSC Wise Physical Target Setting")}
                        to="/seriui/tscwise-product-physical-target-setting"
                      />
                    </MenuItem>
                  ) : null}
                  {showMenu.TargetSetting_Allocate_Range_Wise_Physical_Target ? (
                    <MenuItem>
                      <MenuItemLink
                        text={t("Range Wise Physical Target Setting")}
                        to="/seriui/si-sd-wise-product-physical-target-setting"
                      />
                    </MenuItem>
                  ) : null}

                  {showMenu.TargetSetting_Allocate_Farm_Wise_Target ? (
                    <MenuItem>
                      <MenuItemLink
                        text={t("Farm Wise Target Setting")}
                        to="/seriui/farm-wise-target-setting"
                      />
                    </MenuItem>
                  ) : null}
                  {showMenu.TargetSetting_Allocate_Grainage_Wise_Target ? (
                    <MenuItem>
                      <MenuItemLink
                        text={t("Grainage Wise Target Setting")}
                        to="/seriui/grainage-wise-target-setting"
                      />
                    </MenuItem>
                  ) : null}
                  {showMenu.TargetSetting_Allocate_Training_Wise_Target ? (
                    <MenuItem>
                      <MenuItemLink
                        text={t(
                          "Sericulture Training Institute Wise Target Setting"
                        )}
                        to="/seriui/training-wise-target-setting"
                      />
                    </MenuItem>
                  ) : null}
                  {showMenu.TargetSetting_Allocate_District_Wise_Scheme_Target ? (
                    <MenuItem>
                      <MenuItemLink
                        text={t("District Wise Scheme Target Setting")}
                        to="/seriui/district-wise-scheme-target-setting"
                      />
                    </MenuItem>
                  ) : null}
                  {showMenu.TargetSetting_Allocate_TSC_Wise_Scheme_Target ? (
                    <MenuItem>
                      <MenuItemLink
                        text={t("TSC Wise Scheme Target Setting")}
                        to="/seriui/tsc-wise-scheme-target-setting"
                      />
                    </MenuItem>
                  ) : null}
                  {/* {showMenu.TargetSetting_Allocate_Budget_Institution ? (
                    <MenuItem>
                      <MenuItemLink
                        text={t("SI SD Wise Daily Scheme Target Setting")}
                        to="/seriui/si-sd-wise-day-scheme-target-setting"
                      />
                    </MenuItem>
                  ) : null} */}
                  {showMenu.TargetSetting_Allocate_Reeling_Wise_Scheme_Target ? (
                    <MenuItem>
                      <MenuItemLink
                        text={t("Reeling TSC Wise Scheme Target Setting")}
                        to="/seriui/reeling-tsc-wise-scheme-target-setting"
                      />
                    </MenuItem>
                  ) : null}

                  {showMenu.TargetSetting_Allocate_User_Hierarchy_Mapping ? (
                    <MenuItem>
                      <MenuItemLink
                        text={t("User Hierarchy Mapping")}
                        to="/seriui/user-and-manager-hierarchy-mapping"
                      />
                    </MenuItem>
                  ) : null}

                  {showMenu.TargetSetting_Allocate_Direct_And_All_Reportee_Details ? (
                    <MenuItem>
                      <MenuItemLink
                        text={t("Direct And All Reportee Details")}
                        to="/seriui/user-and-manager-hierarchy-mapping-list"
                      />

                    </MenuItem>
                  ) : null}
      </MenuSub>
      </MenuItem>
      ) : null}

      {showMenu.TargetSetting_Achievement ? (
        <MenuItem sub>
          <MenuItemLink
            text={t("Target Setting Achievement")}
            onClick={menuToggle}
            onMouseEnter={menuHover}
            sub
          />
          <MenuSub>


            {showMenu.TargetSetting_Achievement_MULBERRY ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Mulberry Achievement")}
                  to="/seriui/mulberry-achievement"
                />
              </MenuItem>
            ) : null}

             {showMenu.TargetSetting_Achievement_PRODUCTION ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Physical Achievement")}
                  to="/seriui/physical-achievement"
                />
              </MenuItem>
            ) : null}

            {showMenu.TargetSetting_Achievement_Training ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Training Achievement")}
                  to="/seriui/training-achievement"
                />
              </MenuItem>
            ) : null}



            {showMenu.TargetSetting_Achievement_GRAINAGE ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Grainage Achievement")}
                  to="/seriui/grainage-achievement"
                />
              </MenuItem>
            ) : null}

            {showMenu.TargetSetting_Achievement_FARM ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Farm Achievement")}
                  to="/seriui/farm-achievement"
                />
              </MenuItem>
            ) : null}


          </MenuSub>
        </MenuItem>
      ) : null}

      {/* 🔹 Target Setting Dashboard */}
      {showMenu.TargetSetting ? (
        <MenuItem>
          <MenuItemLink
            text={t("Target Setting Dahboard")}
            to="/seriui/target-setting-dashboard"
          />
        </MenuItem>
      ) : null}

    </MenuSub>
  </MenuItem>
) : null}

      {showMenu.Inspection ? (
        <MenuItem sub>
          {showMenu.Inspection ? (
            <MenuItemLink
              text={t("inspection")}
              onClick={menuToggle}
              onMouseEnter={menuHover}
              sub
            />
          ) : null}
          <MenuSub>
            {showMenu.Inspection_Tracking_Status_of_Mulberry ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Inspection Config")}
                  to="/seriui/inspection-config"
                />
              </MenuItem>
            ) : null}
            {showMenu.Inspection_Supply_of_Disinfectants_to_Farmers ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Supply of disinfectants to farmers")}
                  to="/seriui/supply-of-disinfectants"
                />
              </MenuItem>
            ) : null}
            {showMenu.Inspection_Implementation_of_MGNREGA ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Implementation of MGNREGA")}
                  to="/seriui/mgnerga-scheme"
                />
              </MenuItem>
            ) : null}
            {showMenu.Inspection_Download_Inspection_Mobile_App ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Download Inspection Mobile App")}
                  to="http://e-reshme.karnataka.gov.in/seriui/sericulture.apk"
                />
              </MenuItem>
            ) : null}
            {/* {showMenu.Inspection_Tracking_Status_of_Mulberry ? (
              <MenuItem>
                <MenuItemLink
                  text="Tracking status of Mulberry"
                  to="/seriui/track-current-status"
                />
              </MenuItem>
            ) : null}
            {showMenu.Inspection_Supply_of_Disinfectants_to_Farmers ? (
              <MenuItem>
                <MenuItemLink
                  text="Supply of disinfectants to farmers"
                  to="/seriui/inspect-supply-disinfectants"
                />
              </MenuItem>
            ) : null}
            {showMenu.Inspection_Implementation_of_MGNREGA ? (
              <MenuItem>
                <MenuItemLink
                  text="Implementation of MGNREGA"
                  to="/seriui/implementation-mgnrega"
                />
              </MenuItem>
            ) : null} */}
          </MenuSub>
        </MenuItem>
      ) : null}

      {showMenu.Training ? (
        <MenuItem sub>
          {showMenu.Training ? (
            <MenuItemLink
              text={t("training")}
              onClick={menuToggle}
              onMouseEnter={menuHover}
              sub
            />
          ) : null}
          <MenuSub>
            {showMenu.Training_Schedule ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Schedule Training")}
                  to="/seriui/training-schedule"
                />
              </MenuItem>
            ) : null}
            {showMenu.Training_Page ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Trainer Page")}
                  to="/seriui/trainer-page-list"
                />
              </MenuItem>
            ) : null}
            {showMenu.Training_Deputation_Tracker ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Training Deputation Tracker")}
                  to="/seriui/training-deputation-tracker"
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
      ) : null}

      {showMenu.Helpdesk ? (
        <MenuItem sub>
          {showMenu.Helpdesk ? (
            <MenuItemLink
              text={t("helpdesk")}
              onClick={menuToggle}
              onMouseEnter={menuHover}
              sub
            />
          ) : null}
          <MenuSub>
            {showMenu.Helpdesk_Raise_a_Ticket ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Raise a Ticket")}
                  to="/seriui/help-desk"
                />
              </MenuItem>
            ) : null}
            {showMenu.Helpdesk_Dashboard ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Helpdesk Dashboard")}
                  to="/seriui/helpdesk-dashboard"
                />
              </MenuItem>
            ) : null}
            {showMenu.Helpdesk_User_Dashboard ? (
              <MenuItem>
                <MenuItemLink
                  text={t("User Dashboard")}
                  to="/seriui/user-dashboard"
                />
              </MenuItem>
            ) : null}
            {showMenu.Helpdesk_Escalated_Dashboard ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Escalate Dashboard")}
                  to="/seriui/escalate-dashboard"
                />
              </MenuItem>
            ) : null}
            {/* {showMenu.Helpdesk_My_Tickets ? (
            <MenuItem>
              <MenuItemLink text="My Tickets" to="/seriui/my-tickets" />
            </MenuItem>
          ) : null} */}
            {showMenu.Helpdesk_FAQ ? (
              <MenuItem>
                <MenuItemLink
                  text={t("User Manual Videos")}
                  // to="/seriui/help-desk-faq-view"
                  to="https://drive.google.com/drive/folders/1V3JAJa_AbwV3072-6sHdgebgHCptU5sj?usp=sharing"
                />
              </MenuItem>
            ) : null}
          </MenuSub>
        </MenuItem>
      ) : null}

      {showMenu.Admin ? (
        <MenuItem sub>
          {showMenu.Admin ? (
            <MenuItemLink
              text={t("admin")}
              onClick={menuToggle}
              onMouseEnter={menuHover}
              sub
            />
          ) : null}
          <MenuSub>
            {showMenu.Admin_Master ? (
              <MenuItem sub>
                <MenuItemLink
                  text={t("Master")}
                  onClick={menuToggle}
                  onMouseEnter={menuHover}
                  sub
                />
                <MenuSub>
                  {showMenu.Admin_Master_Registration ? (
                    <MenuItem sub>
                      <MenuItemLink
                        text={t("Registration")}
                        onClick={menuToggle}
                        onMouseEnter={menuHover}
                        sub
                      />
                      <MenuSub>
                        {showMenu.Admin_Master_Registration_Caste ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Caste")}
                              to="/seriui/caste"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Registration_Roles ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Roles")}
                              to="/seriui/roles"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Registration_Education ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Education")}
                              to="/seriui/education"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Registration_Relationship ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Relationship")}
                              to="/seriui/relationship"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Registration_State ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("State")}
                              to="/seriui/state"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Registration_Farmer_Bank_Reason ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Farmer Bank Reason")}
                              to="/seriui/farmerBankAccountReason"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Registration_District ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("District")}
                              to="/seriui/district"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Registration_Taluk ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Taluk")}
                              to="/seriui/taluk"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Registration_Hobli ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Hobli")}
                              to="/seriui/hobli"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Registration_Village ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Village")}
                              to="/seriui/village"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Registration_Trader_Type ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Trader Type")}
                              to="/seriui/trader-type"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Registration_Farmer_Type ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Farmer Type")}
                              to="/seriui/farmer-type"
                            />
                          </MenuItem>
                        ) : null}

                        {showMenu.Admin_Master_Registration_Working_Institution ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Working Institution")}
                              to="/seriui/working-institution"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Registration_User ? (
                          <MenuItem>
                            <MenuItemLink text={t("User")} to="/seriui/user" />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Registration_Designation ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Designation")}
                              to="/seriui/designation"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Registration_No_Fruits_Farmer_Counter ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Non Fruits ID Farmer Counter")}
                              to="/seriui/config-farmer-count"
                            />
                          </MenuItem>
                        ) : null}
                      </MenuSub>
                    </MenuItem>
                  ) : null}

                  {showMenu.Admin_Master_Land ? (
                    <MenuItem sub>
                      <MenuItemLink
                        text={t("Land")}
                        onClick={menuToggle}
                        onMouseEnter={menuHover}
                        sub
                      />
                      <MenuSub>
                        {showMenu.Admin_Master_Land_Holding_Category ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Land Holding Category")}
                              to="/seriui/land-category"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Land_Irrigation_Source ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Irrigation Source")}
                              to="/seriui/irrigation-source"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Land_Irrigation_Type ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Irrigation Type")}
                              to="/seriui/irrigation-type"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Land_Ownership ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Land Ownership")}
                              to="/seriui/land-ownership"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Land_Soil_Type ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Soil Type")}
                              to="/seriui/soil-type"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Land_Rear_House_Roof_Type ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Rear House Roof Type")}
                              to="/seriui/rear-house-roof-type"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Land_Silk_Worm_Variety ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Silk Worm Variety")}
                              to="/seriui/silk-worm-variety"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Land_Source_of_Mulberry ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Source of Mulberry")}
                              to="/seriui/source-of-mulberry"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Land_Mulberry_Variety ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Mulberry Variety")}
                              to="/seriui/mulberry-variety"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Land_Subsidy_Details ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Rearing Equipment Details")}
                              to="/seriui/subsidy-details"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Land_Plantation_Type ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Plantation Type")}
                              to="/seriui/plantation-type"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Land_Machine_Type ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Machine Type")}
                              to="/seriui/machine-type"
                            />
                          </MenuItem>
                        ) : null}
                      </MenuSub>
                    </MenuItem>
                  ) : null}

                  {showMenu.Admin_Master_Service ? (
                    <MenuItem sub>
                      <MenuItemLink
                        text={t("Service")}
                        onClick={menuToggle}
                        onMouseEnter={menuHover}
                        sub
                      />
                      <MenuSub>
                        {/* {showMenu.Admin_Master_Service_Program ? (
                          <MenuItem>
                            <MenuItemLink
                              text="Program"
                              to="/seriui/sc-program"
                            />
                          </MenuItem>
                        ) : null} */}
                        {showMenu.Admin_Master_Service_Scheme_Details ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Scheme Details")}
                              to="/seriui/sc-scheme-details"
                            />
                          </MenuItem>
                        ) : null}

                        {showMenu.Admin_Master_Service_Calculation ? (
  <MenuItem sub>
    <MenuItemLink
      text={t("Calculation")}
      onClick={menuToggle}
      onMouseEnter={menuHover}
      sub
    />
    <MenuSub>

      {showMenu.Admin_Master_Service_Calculation_SILK ? (
        <MenuItem>
          <MenuItemLink
            text={t("Configure Silk Incentive")}
            to="/seriui/configure-silk-incentive"
          />
        </MenuItem>
      ) : null}

      {showMenu.Admin_Master_Service_Calculation_Icb ? (
        <MenuItem>
          <MenuItemLink
            text={t("Configure Icb")}
            to="/seriui/configureIcb"
          />
        </MenuItem>
      ) : null}

      {showMenu.Admin_Master_Service_Calculation_Imcb ? (
        <MenuItem>
          <MenuItemLink
            text={t("Configure Imcb/MERM")}
            to="/seriui/configureImcb"
          />
        </MenuItem>
      ) : null}

      {showMenu.Admin_Master_Service_Calculation_Adopting ? (
        <MenuItem>
          <MenuItemLink
            text={t("Configure Adopting Boiler")}
            to="/seriui/configure-adopting-boiler"
          />
        </MenuItem>
      ) : null}

      {showMenu.Admin_Master_Service_Calculation_reeling ? (
        <MenuItem>
          <MenuItemLink
            text={t("Configure Reeling Shed/Adopting Silent Generator/Adopting Solar power Generator/Adopting Solar Water Heater")}
            to="/seriui/configure-reeling-shed"
          />
        </MenuItem>
      ) : null}

      {showMenu.Admin_Master_Service_Calculation_PMKSY ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Configure Amount")}
                              to="/seriui/configure-pmkys-amount"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Service_Calculation_Bonus ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Configure Bonus Amount")}
                              to="/seriui/configure-bivoltine-amount"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Service_Calculation_RH_Amount ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Configure RH Amount")}
                              to="/seriui/configure-rh-amount"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Service_Calculation_Registered_Private_Chawki ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Configure Registered Private Bivoltine Chawki Rearing Center Subsidy")}
                              to="/seriui/registered-private-chawki"
                            />
                          </MenuItem>
                        ) : null}

                        </MenuSub>
                      </MenuItem>
                    ) : null}

                        {showMenu.Admin_Master_Service_DbtStatusCheck ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Dbt Status Check")}
                              to="/seriui/dbtStatusCheck"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Service_Document ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Document")}
                              to="/seriui/document"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Service_Scheme_Quota ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Scheme Quota")}
                              to="/seriui/scheme-quota"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Service_Sub_Scheme_Details ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Component Type")}
                              to="/seriui/sc-sub-scheme-details"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Service_Component ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Component")}
                              to="/seriui/sc-component"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Service_Category ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Sub Component")}
                              to="/seriui/sc-category"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Service_Head_of_Account ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Head of Account")}
                              to="/seriui/sc-head-account"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Service_Reject_Reason? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Reject Reason")}
                              to="/seriui/reject-reason"
                            />
                          </MenuItem>
                        ) : null}

                        {showMenu.Admin_Master_Service_Silk_Exchange? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Silk Exchange")}
                              to="/seriui/silk-exchange"
                            />
                          </MenuItem>
                        ) : null}

                        {showMenu.Admin_Master_Service_Map_Component_And_Head_Of_Account ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Map Component And Head Of Account")}
                              to="/seriui/map-component"
                            />
                          </MenuItem>
                        ) : null}

                        {/* {showMenu.Admin_Master_Service_Head_of_Account_Category ? (
                          <MenuItem>
                            <MenuItemLink
                              text="Head of Account Category"
                              to="/seriui/sc-head-account-category"
                            />
                          </MenuItem>
                        ) : null} */}
                        {showMenu.Admin_Master_Service_Unit_Cost ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Unit Cost")}
                              to="/seriui/sc-unit-cost"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Service_Vendor ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Vendor")}
                              to="/seriui/sc-vendor"
                            />
                          </MenuItem>
                        ) : null}
                        {/* {showMenu.Admin_Master_Service_Vendor_Contact ? (
                          <MenuItem>
                            <MenuItemLink
                              text="Vendor Contact"
                              to="/seriui/sc-vendor-contact"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Service_Vendor_Bank ? (
                          <MenuItem>
                            <MenuItemLink
                              text="Vendor Bank"
                              to="/seriui/sc-vendor-bank"
                            />
                          </MenuItem>
                        ) : null} */}
                        {showMenu.Admin_Master_Service_Approving_Authority ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Approving Authority")}
                              to="/seriui/sc-approving-authority"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Service_Approval_Stage ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Approval Stage")}
                              to="/seriui/sc-approval-stage"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Service_Spacing ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Spacing")}
                              to="/seriui/spacing"
                            />
                          </MenuItem>
                        ) : null}

                        {showMenu.Admin_Master_Service_Hectare ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Hectare")}
                              to="/seriui/hectare"
                            />
                          </MenuItem>
                        ) : null}
                        
                        {showMenu.Admin_Master_Service_Spacing ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Target")}
                              to="/seriui/mulberry-target-type"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Service_User_Hierarchy_Mapping ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("User Hierarchy Mapping")}
                              to="/seriui/user-hierarchy-mapping"
                            />
                          </MenuItem>
                        ) : null}
                        {/* {showMenu.Admin_Master_Service_Program_Account_Mapping ? (
                          <MenuItem>
                            <MenuItemLink
                              text="Program Account mapping"
                              to="/seriui/sc-program-account-mapping"
                            />
                          </MenuItem>
                        ) : null} */}
                        {showMenu.Admin_Master_Service_Program_Approval_Mapping ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Approval Stage mapping")}
                              to="/seriui/sc-program-approval-mapping"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Service_Reject_Reason_WorkFlow ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Reject Reason For Work Flow")}
                              to="/seriui/reject-reason-workflow"
                            />
                          </MenuItem>
                        ) : null}
                        
                        {/* {showMenu.Admin_Master_Service_Reason_for_Bid_Rejection ? (
                          <MenuItem>
                            <MenuItemLink
                              text="Reason for bid Rejection"
                              to="/seriui/reason-bid-rejection"
                            />
                          </MenuItem>
                        ) : null} */}

                        {showMenu.Admin_Master_Service_Activity ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Activity")}
                              to="/seriui/activity"
                            />
                          </MenuItem>
                        ) : null}
                      </MenuSub>
                    </MenuItem>
                  ) : null}

                  {showMenu.Admin_Master_Training ? (
                    <MenuItem sub>
                      <MenuItemLink
                        text={t("Training")}
                        onClick={menuToggle}
                        onMouseEnter={menuHover}
                        sub
                      />
                      <MenuSub>
                        {showMenu.Admin_Master_Training_Program ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Training Program")}
                              to="/seriui/trainingProgram"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Training_Course ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Training Course")}
                              to="/seriui/trainingCourse"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Training_Deputed_Institute ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Deputed Institute Training")}
                              to="/seriui/deputed-institute"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Training_Group ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Training Group")}
                              to="/seriui/training-group"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Training_Institution ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Training Institution")}
                              to="/seriui/training-institution"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Training_Mode ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Training Mode")}
                              to="/seriui/training-mode"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Training_Office ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Training Office")}
                              to="/seriui/training-office"
                            />
                          </MenuItem>
                        ) : null}
                      </MenuSub>
                    </MenuItem>
                  ) : null}

                  {showMenu.Admin_Master_HelpDesk ? (
                    <MenuItem sub>
                      <MenuItemLink
                        text={t("HelpDesk")}
                        onClick={menuToggle}
                        onMouseEnter={menuHover}
                        sub
                      />
                      <MenuSub>
                        {showMenu.Admin_Master_HelpDesk_Module ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Modules")}
                              to="/seriui/hd-module"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_HelpDesk_Feature ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Feature")}
                              to="/seriui/hd-feature"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_HelpDesk_Board_Category ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Board Category")}
                              to="/seriui/hd-board-category"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_HelpDesk_Category ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Category")}
                              to="/seriui/hd-category"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_HelpDesk_Sub_Category ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Sub Category")}
                              to="/seriui/hd-sub-category"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_HelpDesk_Status ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Help Desk Status")}
                              to="/seriui/hd-status"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_HelpDesk_Severity ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Help Desk Severity")}
                              to="/seriui/hd-severity"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_HelpDesk_Faq ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Help Desk FAQ")}
                              to="/seriui/hd-question"
                            />
                          </MenuItem>
                        ) : null}
                      </MenuSub>
                    </MenuItem>
                  ) : null}

                  {showMenu.Admin_Master_Garden ? (
                    <MenuItem sub>
                      <MenuItemLink
                        text={t("Garden Management")}
                        onClick={menuToggle}
                        onMouseEnter={menuHover}
                        sub
                      />
                      <MenuSub>
                        {showMenu.Admin_Master_Garden_Line ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Line Name")}
                              to="/seriui/lineName"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Garden_Crop_Status ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Crop Status")}
                              to="/seriui/cropStatus"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Garden_Crop_Inspection_Type ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Crop Inspection Type")}
                              to="/seriui/cropInspectionType"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Garden_Reason ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Reason")}
                              to="/seriui/reason"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Garden_Mount ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Mount")}
                              to="/seriui/mount"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Garden_Disease_Status ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Disease Status")}
                              to="/seriui/disease-status"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Garden_Grainage ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Grainage")}
                              to="/seriui/grainage"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Garden_Disinfectant ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Disinfectant Usage Details")}
                              to="/seriui/disinfectant"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Garden_Generation_Number ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Generation Number")}
                              to="/seriui/generation-number"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Garden_Farm ? (
                          <MenuItem>
                            <MenuItemLink text={t("Farm")} to="/seriui/farm" />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Garden_Tsc ? (
                          <MenuItem>
                            <MenuItemLink text={t("Tsc")} to="/seriui/tsc" />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Garden_Worm_Stage ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Worm Stage")}
                              to="/seriui/worm-stage"
                            />
                          </MenuItem>
                        ) : null}
                      </MenuSub>
                    </MenuItem>
                  ) : null}

                  {showMenu.Admin_Master_Auction ? (
                    <MenuItem sub>
                      <MenuItemLink
                        text={t("Market & Auction")}
                        onClick={menuToggle}
                        onMouseEnter={menuHover}
                        sub
                      />
                      <MenuSub>
                        {showMenu.Admin_Master_Auction_Bin ? (
                          <MenuItem>
                            <MenuItemLink text={t("Bin")} to="/seriui/bin" />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Auction_Market ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Market")}
                              to="/seriui/market"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Auction_Godown ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Godown")}
                              to="/seriui/godawn"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Auction_Activate_Reeler ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Activate Reeler")}
                              to="/seriui/activate-reeler"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Auction_Activate_Trader ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Activate Trader")}
                              to="/seriui/activate-trader"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Auction_Race ? (
                          <MenuItem>
                            <MenuItemLink text={t("Race")} to="/seriui/race" />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Auction_Source ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Source")}
                              to="/seriui/source"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Auction_Crate ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Crate")}
                              to="/seriui/crate"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Auction_Flex_Time ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Flex Time")}
                              to="/seriui/flex-time"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Auction_Exception_Time ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Exception Time")}
                              to="/seriui/market-exception-time"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Auction_Market_Type ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Market Type")}
                              to="/seriui/market-type"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Auction_Reeler_Type ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Reeler Type")}
                              to="/seriui/reeler-type"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Auction_Update_Bank_Details ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Update Bank Details")}
                              to="/seriui/update-bank-details"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Auction_External_Unit ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("External Unit")}
                              to="/seriui/external-unit-type"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Auction_Empaneled_Vendor ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Empaneled Vendors")}
                              to="/seriui/empanelled-vendor"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Auction_Reeler_Device_Mapping ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Reeler Device Mapping")}
                              to="/seriui/reeler-device-mapping"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Auction_Race_Mapping ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Race Mapping")}
                              to="/seriui/race-mapping"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Auction_Division ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Division")}
                              to="/seriui/division"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Service_Reason_for_Lot_Cancellation ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Reason for lot Cancellation")}
                              to="/seriui/reason-lot-cancellation"
                            />
                          </MenuItem>
                        ) : null}
                        {/* {showMenu.Admin_Master_Auction_Accept_Bid ? (
                        <MenuItem>
                          <MenuItemLink text="Accept Bid" to="/seriui/accept-bid" />
                        </MenuItem>
                      ) : null} */}
                      </MenuSub>
                    </MenuItem>
                  ) : null}

                  {showMenu.Admin_Master_General ? (
                    <MenuItem sub>
                      <MenuItemLink
                        text={t("General")}
                        onClick={menuToggle}
                        onMouseEnter={menuHover}
                        sub
                      />
                      <MenuSub>
                        {showMenu.Admin_Master_General_Pages ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Pages")}
                              to="/seriui/role-pages"
                            />
                          </MenuItem>
                        ) : null}

                        {showMenu.Admin_Master_General_Config_Role ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Config Role")}
                              to="/seriui/role-config"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_General_Activate_External ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Activate External Unit user")}
                              to="/seriui/activate-external-unit"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Service_Department ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Department")}
                              to="/seriui/department"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Admin_Master_Service_Financial_Year ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Financial Year")}
                              to="/seriui/financial-year"
                            />
                          </MenuItem>
                        ) : null}
                      </MenuSub>
                    </MenuItem>
                  ) : null}
                </MenuSub>
              </MenuItem>
            ) : null}
          </MenuSub>
        </MenuItem>
      ) : null}

      {showMenu.Reports ? (
        <MenuItem sub>
          {showMenu.Reports ? (
            <MenuItemLink
              text={t("Report")}
              onClick={menuToggle}
              onMouseEnter={menuHover}
              sub
            />
          ) : null}
          <MenuSub>
            
            
            {/* {showMenu.Reports_Dashboard ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Dashboard")}
                  to="https://app.powerbi.com/view?r=eyJrIjoiM2E5OGNjYWMtYTc5MC00NDZiLWJhZTUtNDI5ZmJmMjA3M2ZjIiwidCI6ImNiYTJlNTNiLWZiNTktNDI4Ni1hMjk1LTBmYzFiYTNlMTQzOSJ9"
                  blank={true}
                />
              </MenuItem>
            ) : null} */}

            {showMenu.Reports_Export_Report ? (
              <MenuItem sub>
                <MenuItemLink
                  text={t("Export Report")}
                  onClick={menuToggle}
                  onMouseEnter={menuHover}
                  sub
                />
                <MenuSub>
                  {/* {showMenu.Admin_Report_Admin ? (
                    <MenuItem>
                      <MenuItemLink
                        text="Admin Report"
                        to="/seriui/report-admin"
                      />
                    </MenuItem>
                  ) : null} */}
                  {/* {showMenu.Admin_Report_Transaction ? (
                  <MenuItem>
                    <MenuItemLink
                      text="Reeler Transaction Report"
                      to="/seriui/reeler-transaction-report"
                    />
                  </MenuItem>
                ) : null} */}
                  {showMenu.Reports_Export_Report_Registration ? (
                    <MenuItem sub>
                      <MenuItemLink
                        text={t("Registration")}
                        onClick={menuToggle}
                        onMouseEnter={menuHover}
                        sub
                      />
                      <MenuSub>
                        {showMenu.Reports_Export_Report_Registration_Farmer_Registration_Report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Farmer Wise Report")}
                              to="/seriui/farmer-wise-report"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Reports_Export_Report_Registration_Reeler_Registration_Report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Reeler Wise Report")}
                              to="/seriui/reeler-wise-report"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Reports_Export_Report_Registration_Renewal_Of_Reeler_License_Report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Renewal of Reeler License Report")}
                              to="/seriui/renewal-wise-report-list"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Reports_Export_Report_Registration_Pending_Renewal_Of_Reeler_License_Report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t(" Pending to renew License Report ")}
                              to="/seriui/pending-reeler-license"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Reports_Export_Report_Registration_Trader_License_Report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Trader License Report ")}
                              to="/seriui/trader-license-list-report"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Reports_Export_Report_Registration_External_Unit_Registration_Report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("RSP/ CRC/ NSSO Registration Report")}
                              to="/seriui/external-registration-list-report"
                            />
                          </MenuItem>
                        ) : null}
                        {/* {showMenu.Reports_Export_Report_Registration_Farmer_Without_Fruits_Report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Farmer Without Fruits Report")}
                              to="/seriui/farmer-without-fruits-report"
                            />
                          </MenuItem>
                        ) : null} */}
                        {/* {showMenu.Reports_Export_Report_Registration_Other_State_Farmer_Report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Other State Farmer Report")}
                              to="/seriui/other-state-farmer-report"
                            />
                          </MenuItem>
                        ) : null} */}
                      </MenuSub>
                    </MenuItem>
                  ) : null}

                  {showMenu.Reports_Export_Report_DBT_And_Service ? (
                    <MenuItem sub>
                      <MenuItemLink
                        text={t("DBT And Service")}
                        onClick={menuToggle}
                        onMouseEnter={menuHover}
                        sub
                      />
                      <MenuSub>
                        {showMenu.Reports_Export_Report_DBT_And_Service_All_Application_Details ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("All Application Details")}
                              to="/seriui/all-application"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Reports_Export_Report_DBT_And_Service_DBT_Success_Application_Report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("DBT Success Application Report")}
                              to="/seriui/dbt-success-report"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Reports_Export_Report_DBT_And_Service_DBT_Failure_Application_Report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("DBT Failure Application Report")}
                              to="/seriui/dbt-failure-report"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Reports_Export_Report_DBT_And_Service_DBT_K2_Application_Report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("DBT K2 Application Report")}
                              to="/seriui/dbt-k2-report"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Reports_Export_Report_DBT_And_Service_DBT_B_Application_Report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("DBT B Application Report")}
                              to="/seriui/dbt-b-report"
                            />
                          </MenuItem>
                        ) : null}
                      </MenuSub>
                    </MenuItem>
                  ) : null}

                  {showMenu.Reports_Export_Report_Silk_Type_Market ? (
                    <MenuItem sub>
                      <MenuItemLink
                        text={t("Silk Exchange Market")}
                        onClick={menuToggle}
                        onMouseEnter={menuHover}
                        sub
                      />
                      <MenuSub>
                        {showMenu.Reports_Export_Report_Silk_Type_Market_Dashboard ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Dashboard Report")}
                              to="/seriui/dashboard-report-silk-type"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Reports_Export_Report_Silk_Type_DTR_Report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Dtr Report")}
                              to="/seriui/dtr-online-silk-type"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Reports_Export_Report_Silk_Type_Market_Blank_DTR_Report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Real Time Dtr Report")}
                              to="/seriui/blank-dtr-online-silk-type"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Reports_Export_Report_Silk_Type_Market_Unit_Counter_Report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Unit Counter Report")}
                              to="/seriui/unit-counter-report-silk-type"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Reports_Export_Report_Silk_Type_Market_Form_Report_Abstract ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Abstract Report")}
                              to="/seriui/abstract-report-silk-type"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Reports_Export_Report_Silk_Type_Market_Form_District_Abstract_Report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("District Wise Abstract Report")}
                              to="/seriui/form-13-report-by-dist-silk-type"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Reports_Export_Report_Silk_Type_Market_District_Wise_Monthly ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("District Wise Monthly Report")}
                              to="/seriui/district-monthly-report-silk-type"
                            />
                          </MenuItem>
                        ) : null}
                      </MenuSub>
                    </MenuItem>
                  ) : null}

                  {showMenu.Reports_Export_Report_Seed_And_Dfl ? (
                    <MenuItem sub>
                      <MenuItemLink
                        text={t("Seed and DFL")}
                        onClick={menuToggle}
                        onMouseEnter={menuHover}
                        sub
                      />
                      <MenuSub>
                        {showMenu.Reports_Export_Report_Seed_And_Dfl_Farmer_Details ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Farmer Details By TSC")}
                              to="/seriui/farmer-details-list-from-seed-and-dfl"
                            />
                          </MenuItem>
                        ) : null}

                        {showMenu.Reports_Export_Report_Seed_And_Dfl_Mulberry_Farm_Report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Mulberry Farm Report")}
                              to="/seriui/maintenance-of-mulberry-farm-report"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Reports_Export_Report_Seed_And_Dfl_Dispatched_Cocoon_Report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t(
                                "Dispatch Of Cocoons To P4 Grainage Report"
                              )}
                              to="/seriui/dispatch-of-cocoons-to-grainage-report"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Reports_Export_Report_Seed_And_Dfl_Farm_Wise_Report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Farm Wise Report")}
                              to="/seriui/rearing-of-dfls-for-the-8lines-report"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Reports_Export_Report_Seed_And_Dfl_TSC_Wise_Sold_DFL_Details ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("TSC Wise Sold DFLs Report")}
                              to="/seriui/tsc-wise-sold-dfl-details-report"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Reports_Export_Report_Seed_And_Dfl_Cold_Storage_Schedule_Report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Cold Storage Schedule Report")}
                              to="/seriui/cold-storage-schedule-report"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Reports_Export_Report_Seed_And_Dfl_Maintenance_Of_Pierced_Cocoons_report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Maintenance Of Pierced Cocoons Report")}
                              to="/seriui/maintenance-of-pierced-cocoons-report"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Reports_Export_Report_Seed_And_Dfl_Maintenance_Of_Line_Report_For_Grainage ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t(
                                "Maintenance Of Line Report For Grainage"
                              )}
                              to="/seriui/maintenance-of-line-report-for-grainage"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Reports_Export_Report_Seed_And_Dfl_Remittance_Report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Remittance Report")}
                              to="/seriui/remittance-report"
                            />
                          </MenuItem>
                        ) : null}

                        {showMenu.Reports_Export_Report_Seed_And_Dfl_Sale_and_disposal_dfls_rsso_report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t(
                                "Sale and Disposal of DFLs(RSSO/NSSO) Details Report"
                              )}
                              to="/seriui/sold-dfls-report-for-rsso"
                            />
                          </MenuItem>
                        ) : null}

                        {showMenu.Reports_Export_Report_Seed_And_Dfl_Rearing_of_dfls_assessment_report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Rearing Of DFLs Assessment Report")}
                              to="/seriui/rearing-of-dfls-for-the-8lines-assessment-report"
                            />
                          </MenuItem>
                        ) : null}

                        {showMenu.Reports_Export_Report_Seed_And_Dfl_Maintenance_of_screening_batch_bed_wise_report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t(
                                "Maintenance Of Screening Batch Bed Wise Report"
                              )}
                              to="/seriui/maintenance-of-screening-bath-bed-wise-details-report"
                            />
                          </MenuItem>
                        ) : null}

                        {showMenu.Reports_Export_Report_Seed_And_Dfl_Maintenance_of_screening_batch_assessment_wise_report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t(
                                "Maintenance Of Screening Batch Assessment Wise Report"
                              )}
                              to="/seriui/maintenance-of-screening-batch-assessment-details-report"
                            />
                          </MenuItem>
                        ) : null}

                        {showMenu.Reports_Export_Report_Seed_And_Dfl_added_dfls_report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Added DFLs Report")}
                              to="/seriui/added-dfls-report"
                            />
                          </MenuItem>
                        ) : null}
                      </MenuSub>
                    </MenuItem>
                  ) : null}

                  {showMenu.Reports_Export_Report_Garden ? (
                    <MenuItem sub>
                      <MenuItemLink
                        text={t("Garden Management")}
                        onClick={menuToggle}
                        onMouseEnter={menuHover}
                        sub
                      />
                      <MenuSub>
                        {showMenu.Reports_Export_Report_Garden_Mulberry_Garden_Report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Mulberry Garden Report")}
                              to="/seriui/maintenance-of-mulberry-garden-report"
                            />
                          </MenuItem>
                        ) : null}

                        {showMenu.Reports_Export_Report_Garden_Supply_Of_Cocoons_Report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Rearing And Supply Of Cocoons Report")}
                              to="/seriui/supply-of-cocoons-report"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Reports_Export_Report_Garden_Maintenance_And_Sale_Of_Nursery_Report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Maintenance And Sale Of Nursery Report")}
                              to="/seriui/maintenance-and-sale-of-nursery-report"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Reports_Export_Report_Garden_Seed_Cutting_Report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Seed Cutting Bank Report")}
                              to="/seriui/seed-cutting-bank-report"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Reports_Export_Report_Garden_Chawki_Distribution_Report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Chawki Distribution Report")}
                              to="/seriui/chawki-distribution-report"
                            />
                          </MenuItem>
                        ) : null}
                      </MenuSub>
                    </MenuItem>
                  ) : null}

                  {showMenu.Reports_Export_Report_Chawki_Management ? (
                    <MenuItem sub>
                      <MenuItemLink
                        text={t("Chawki Management")}
                        onClick={menuToggle}
                        onMouseEnter={menuHover}
                        sub
                      />
                      <MenuSub>
                        {showMenu.Reports_Export_Report_Chawki_Management_Report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Chawki Management Report")}
                              to="/seriui/chawki-management-report"
                            />
                          </MenuItem>
                        ) : null}
                      </MenuSub>
                    </MenuItem>
                  ) : null}

                  {showMenu.Reports_Export_Report_Target_Setting ? (
                    <MenuItem sub>
                      <MenuItemLink
                        text={t("Target Setting Reports")}
                        onClick={menuToggle}
                        onMouseEnter={menuHover}
                        sub
                      />
                      <MenuSub>
                        {showMenu.Reports_Export_Report_Target_Setting_District_wise ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("District Wise Monthly Target")}
                              to="/seriui/district-wise-mulberry-target-report"
                            />
                          </MenuItem>
                        ) : null}

                        {showMenu.Reports_Export_Report_Target_Setting_TSC_wise ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("TSC Wise Monthly Target")}
                              to="/seriui/tsc-wise-mulberry-target-report"
                            />
                          </MenuItem>
                        ) : null}

                        {showMenu.Reports_Export_Report_Target_Setting_Range_wise ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Range Wise Monthly Target")}
                              to="/seriui/range-wise-mulberry-target-report"
                            />
                          </MenuItem>
                        ) : null}

                        {showMenu.Reports_Export_Report_Target_Setting_Range_wise_Daily ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Range Wise Daily Target")}
                              to="/seriui/range-wise-mulberry-daily-target-report"
                            />
                          </MenuItem>
                        ) : null}

                        {showMenu.Reports_Export_Report_Target_Setting_District_wise_Physical ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("District Wise Physical Target")}
                              to="/seriui/district-wise-physical-target-report"
                            />
                          </MenuItem>
                        ) : null}

                        {showMenu.Reports_Export_Report_Target_Setting_TSC_wise_Physical ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("TSC Wise Physical Target")}
                              to="/seriui/tsc-wise-physical-target-report"
                            />
                          </MenuItem>
                        ) : null}

                        {showMenu.Reports_Export_Report_Target_Setting_Range_wise_Physical ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Range Wise Physical Target")}
                              to="/seriui/range-wise-physical-target-report"
                            />
                          </MenuItem>
                        ) : null}

                        {showMenu.Reports_Export_Report_Target_Setting_Training_Target ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Training Target")}
                              to="/seriui/training-target-details-report"
                            />
                          </MenuItem>
                        ) : null}

                        {showMenu.Reports_Export_Report_Target_Setting_Grainage_Target ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Grainage Target")}
                              to="/seriui/graininge-target-details-report"
                            />
                          </MenuItem>
                        ) : null}

                        {showMenu.Reports_Export_Report_Target_Setting_Farm_Target ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Farm Target")}
                              to="/seriui/farm-target-details-report"
                            />
                          </MenuItem>
                        ) : null}

                        {showMenu.Reports_Export_Report_Target_Setting_District_wise_Scheme ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("District Wise Scheme Targets")}
                              to="/seriui/district-wise-scheme-targets-report"
                            />
                          </MenuItem>
                        ) : null}

                        {showMenu.Reports_Export_Report_Target_Setting_TSC_wise_Scheme ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("TSC Wise Scheme Targets")}
                              to="/seriui/tsc-wise-scheme-targets-report"
                            />
                          </MenuItem>
                        ) : null}

                        {showMenu.Reports_Export_Report_Target_Setting_Reeling_TSC_wise_Scheme ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Reeling TSC Wise Scheme Targets")}
                              to="/seriui/reeling-tsc-wise-scheme-targets-report"
                            />
                          </MenuItem>
                        ) : null}

                        {showMenu.Reports_Export_Report_Target_Setting_Grainage_Achievement_Report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Grainage Achievement Report")}
                              to="/seriui/grainage-achievement-report"
                            />
                          </MenuItem>
                        ) : null}

                        {showMenu.Reports_Export_Report_Target_Setting_Farm_Achievement_Report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Farm Achievement Report")}
                              to="/seriui/farm-achievement-report"
                            />
                          </MenuItem>
                        ) : null}

                        {showMenu.Reports_Export_Report_Target_Setting_Mulberry_Achievement_Report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Mulberry Achievement Report")}
                              to="/seriui/mulberry-achievement-report"
                            />
                          </MenuItem>
                        ) : null}

                        {showMenu.Reports_Export_Report_Target_Setting_Training_Achievement_Report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Training Achievement Report")}
                              to="/seriui/training-achievement-report"
                            />
                          </MenuItem>
                        ) : null}

                        {showMenu.Reports_Export_Report_Target_Setting_Physical_Achievement_Report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Physical Achievement Report")}
                              to="/seriui/production-achievement-report"
                            />
                          </MenuItem>
                        ) : null}
                      </MenuSub>
                    </MenuItem>
                  ) : null}

                  {showMenu.Reports_Export_Report_Inspection ? (
                    <MenuItem sub>
                      <MenuItemLink
                        text={t("Inspection")}
                        onClick={menuToggle}
                        onMouseEnter={menuHover}
                        sub
                      />
                      <MenuSub>
                        {showMenu.Reports_Export_Report_Inspection_Verified_DFLs_Report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Verified DFLs Report")}
                              to="/seriui/verified-dfls-report"
                            />
                          </MenuItem>
                        ) : null}

                        {showMenu.Reports_Export_Report_Inspection_Crop_Inspection_Report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Crop Inspection Details Report")}
                              to="/seriui/crop-inspection-report"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Reports_Export_Report_Inspection_Fitness_Report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Fitness Details Report")}
                              to="/seriui/fitness-report"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Reports_Export_Report_Inspection_Farmer_Mulberry_Extension_Report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Mulberry Expansion Report")}
                              to="/seriui/farmer-mulberry-extension-report"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Reports_Export_Report_Inspection_Supply_Of_Disinfectants_Report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Supply Of Disinfectants Report")}
                              to="/seriui/supply-of-disinfectants-to-farmers-report"
                            />
                          </MenuItem>
                        ) : null}
                      </MenuSub>
                    </MenuItem>
                  ) : null}

                  {showMenu.Reports_Export_Report_Training ? (
                    <MenuItem sub>
                      <MenuItemLink
                        text={t("Training")}
                        onClick={menuToggle}
                        onMouseEnter={menuHover}
                        sub
                      />
                      <MenuSub>
                        {showMenu.Reports_Export_Report_Training_Trainer_Details_Report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Trainer Details Report")}
                              to="/seriui/trainer-details-report"
                            />
                          </MenuItem>
                        ) : null}

                        {showMenu.Reports_Export_Report_Training_Trainee_Details_Report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Trainee Details Report")}
                              to="/seriui/trainee-details-report"
                            />
                          </MenuItem>
                        ) : null}
                        {showMenu.Reports_Export_Report_Training_Training_Deputation_Tracker_Report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Training Deputation Tracket Report")}
                              to="/seriui/training-deputation-tracker-details"
                            />
                          </MenuItem>
                        ) : null}
                      </MenuSub>
                    </MenuItem>
                  ) : null}

                  {showMenu.Reports_Export_Report_Helpdesk ? (
                    <MenuItem sub>
                      <MenuItemLink
                        text={t("Help Desk")}
                        onClick={menuToggle}
                        onMouseEnter={menuHover}
                        sub
                      />
                      <MenuSub>
                        {showMenu.Reports_Export_Report_Helpdesk_Details_Report ? (
                          <MenuItem>
                            <MenuItemLink
                              text={t("Ticket Details Report")}
                              to="/seriui/help-desk-report"
                            />
                          </MenuItem>
                        ) : null}
                      </MenuSub>
                    </MenuItem>
                  ) : null}
                 
                </MenuSub>
              </MenuItem>
            ) : null}

            {showMenu.Reports_Dashboard ? (
              <MenuItem>
                <MenuItemLink
                  text={t("Dashboards")}
                  to="https://app.powerbi.com/view?r=eyJrIjoiYTJjNGEzYjktMzFkZS00NjBjLTg4NjUtMTViZTVjNDMzZjEyIiwidCI6Ijk1NWYzZWI3LTE5ZGMtNGJiOC05NjZkLTViZjkzMzVjYjM5ZCJ9&pageName=7a11927e5e64dcc23c23"
                  blank={true}
                />
              </MenuItem>
            ) : null}

             {showMenu.Reports_Format_Reports ? (
                <MenuItem sub>
                  <MenuItemLink
                    text={t("Format Reports")}
                    to="https://e-reshme.karnataka.gov.in/ssrsreport/ssrsreport/BVM5_Format.aspx"
                    blank={true}
                    onClick={menuToggle}
                    onMouseEnter={menuHover}
                    sub
                  />
                  <MenuSub>
                    {showMenu.Reports_Export_Report_Seed_Market ? (
                      <MenuItem sub>
                        <MenuItemLink
                          text={t("Seed Market")}
                          onClick={menuToggle}
                          onMouseEnter={menuHover}
                          sub
                        />
                        <MenuSub>
                          {showMenu.Reports_Export_Report_Seed_Market_Invoice_Permit_Receipt ? (
                            <MenuItem>
                              <MenuItemLink
                                text={t("Invoice")}
                                to="/seriui/seed-market-invoice-report"
                              />
                            </MenuItem>
                          ) : null}
                          {showMenu.Reports_Export_Report_Seed_Market_Invoice_Permit_Receipt ? (
                            <MenuItem>
                              <MenuItemLink
                                text={t("Permit")}
                                to="/seriui/seed-market-permit-report"
                              />
                            </MenuItem>
                          ) : null}
                          {showMenu.Reports_Export_Report_Seed_Market_Invoice_Permit_Receipt ? (
                            <MenuItem>
                              <MenuItemLink
                                text={t("Cash Receipt")}
                                to="/seriui/seed-market-cash-receipt-report"
                              />
                            </MenuItem>
                          ) : null}
                          {showMenu.Reports_Export_Report_Seed_Market_Invoice_Permit_Receipt ? (
                            <MenuItem>
                              <MenuItemLink
                                text={t("Market Receipt")}
                                to="/seriui/seed-market-market-receipt-report"
                              />
                            </MenuItem>
                          ) : null}
                          {showMenu.Reports_Export_Report_Seed_Market_Invoice_Permit_Receipt ? (
                            <MenuItem>
                              <MenuItemLink
                                text={t("DTR Report")}
                                to="/seriui/seed-dtr-report"
                              />
                            </MenuItem>
                          ) : null}

                          {showMenu.Reports_Export_Report_Seed_Market_External_Unit_Balance_Report ? (
                            <MenuItem>
                              <MenuItemLink
                                text={t("External Unit Balance Report")}
                                to="/seriui/external-unit-balance"
                              />
                            </MenuItem>
                          ) : null}
                           {showMenu.Reports_Export_Report_Seed_Market_Reeler_Balance_Report ? (
                            <MenuItem>
                              <MenuItemLink
                                text={t("Reeler Balance Report")}
                                to="/seriui/reeler-balance"
                              />
                            </MenuItem>
                          ) : null}
                        </MenuSub>
                      </MenuItem>
                    ) : null}

                    {showMenu.Reports_Export_Report_Commercial_Market ? (
                      <MenuItem sub>
                        <MenuItemLink
                          text={t("Commercial Market")}
                          onClick={menuToggle}
                          onMouseEnter={menuHover}
                          sub
                        />
                        <MenuSub>
                          {showMenu.Reports_Export_Report_Commercial_Market_Dashboard ? (
                            <MenuItem>
                              <MenuItemLink
                                text={t("Dashboard")}
                                to="/seriui/dashboard-report"
                              />
                            </MenuItem>
                          ) : null}
                          {showMenu.Reports_Export_Report_Commercial_Market_Dashboard ? (
                            <MenuItem>
                              <MenuItemLink
                                text={t("All Market Dashboard")}
                                to="/seriui/dashboard-report-all-market"
                              />
                            </MenuItem>
                          ) : null}
                          {showMenu.Reports_Export_Report_Commercial_Market_Abstract ? (
                            <MenuItem>
                              <MenuItemLink
                                text={t("Abstract Report")}
                                to="/seriui/abstract-report"
                              />
                            </MenuItem>
                          ) : null}
                          {showMenu.Reports_Export_Report_Commercial_Market_District_Abstract ? (
                            <MenuItem>
                              <MenuItemLink
                                text={t("District Wise Abstract Report")}
                                to="/seriui/form-13-report-by-dist"
                              />
                            </MenuItem>
                          ) : null}
                          {showMenu.Reports_Export_Report_Commercial_Market_DTR_Blank_Report ? (
                            <MenuItem>
                              <MenuItemLink
                                text={t("Real Time DTR Report")}
                                to="/seriui/blank-dtr-online"
                              />
                            </MenuItem>
                          ) : null}
                          {showMenu.Reports_Export_Report_Commercial_Market_DTR ? (
                            <MenuItem>
                              <MenuItemLink
                                text={t("DTR Online")}
                                to="/seriui/dtr-online"
                              />
                            </MenuItem>
                          ) : null}
                          {showMenu.Reports_Export_Report_Commercial_Market_GeneratedTriplet ? (
                            <MenuItem>
                              <MenuItemLink
                                text={t("Generated Triplet")}
                                to="/seriui/print-bid-slip"
                              />
                            </MenuItem>
                          ) : null}
                          {showMenu.Reports_Export_Report_Commercial_Market_GeneratedFarmerCopy ? (
                            <MenuItem>
                              <MenuItemLink
                                text={t("Generated Bidding Slip")}
                                to="/seriui/print-farmer-copy"
                              />
                            </MenuItem>
                          ) : null}
                          {showMenu.Reports_Export_Report_Silk_Type_DTR_Report ? (
                            <MenuItem>
                              <MenuItemLink
                                text={t("Reeler Current Balance Report")}
                                to="/seriui/reeler-current-balance"
                              />
                            </MenuItem>
                          ) : null}
                          {showMenu.Reports_Export_Report_Silk_Type_DTR_Report ? (
                            <MenuItem>
                              <MenuItemLink
                                text={t("Reeler Credit Report")}
                                to="/seriui/reeler-credit-transaction"
                              />
                            </MenuItem>
                          ) : null}
                          {showMenu.Reports_Export_Report_Commercial_Market_Unit ? (
                            <MenuItem>
                              <MenuItemLink
                                text={t("Unit Counter Report")}
                                to="/seriui/unit-counter-report"
                              />
                            </MenuItem>
                          ) : null}
                          {showMenu.Reports_Export_Report_Commercial_Market_Reeler_MF ? (
                            <MenuItem>
                              <MenuItemLink
                                text={t("Reeler MF Report")}
                                to="/seriui/reeler-mf-report"
                              />
                            </MenuItem>
                          ) : null}
                          {showMenu.Reports_Export_Report_Commercial_Market_District_Wise_Monthly_Report ? (
                            <MenuItem>
                              <MenuItemLink
                                text={t("District Wise Monthly Report")}
                                to="/seriui/district-monthly-report"
                              />
                            </MenuItem>
                          ) : null}
                          {showMenu.Reports_Export_Report_Commercial_Market_Pending ? (
                            <MenuItem>
                              <MenuItemLink
                                text={t("Pending Report")}
                                to="/seriui/pending-reports"
                              />
                            </MenuItem>
                          ) : null}
                          {showMenu.Reports_Export_Report_Commercial_Market_Bidding_Report ? (
                            <MenuItem>
                              <MenuItemLink
                                text={t("Lot Wise Bidding Report")}
                                to="/seriui/bidding-report"
                              />
                            </MenuItem>
                          ) : null}
                          {showMenu.Reports_Export_Report_Commercial_Market_Bidding_Reeler_Report ? (
                            <MenuItem>
                              <MenuItemLink
                                text={t("Reeler Bidding Report")}
                                to="/seriui/bidding-report-reeler"
                              />
                            </MenuItem>
                          ) : null}
                          {showMenu.Reports_Export_Report_Commercial_Market_Farmer_Transaction_Report ? (
                            <MenuItem>
                              <MenuItemLink
                                text={t("Farmer Transaction Report")}
                                to="/seriui/farmer-transaction-report"
                              />
                            </MenuItem>
                          ) : null}
                          {showMenu.Reports_Export_Report_Commercial_Market_District_Wise_Farmer_Count ? (
                            <MenuItem>
                              <MenuItemLink
                                text={t("District Wise Farmer Count")}
                                to="/seriui/district-wise-farmer-count-list"
                              />
                            </MenuItem>
                          ) : null}
                          {showMenu.Reports_Export_Report_Commercial_Market_District_Wise_Reeler_Count ? (
                            <MenuItem>
                              <MenuItemLink
                                text={t("District Wise Reeler Count")}
                                to="/seriui/district-wise-reeler-count-list"
                              />
                            </MenuItem>
                          ) : null}
                          {showMenu.Reports_Export_Report_Commercial_Market_Direct_From_Fruits ? (
                            <MenuItem>
                              <MenuItemLink
                                text={t("Farmer Details Direct From Fruits")}
                                to="/seriui/direct-fruits-details"
                              />
                            </MenuItem>
                          ) : null}
                          {showMenu.Reports_Export_Report_Commercial_Market_Reeler_Transaction_Report ? (
                            <MenuItem>
                              <MenuItemLink
                                text={t("Reeler Transaction Report")}
                                to="/seriui/reeler-transaction-reports"
                              />
                            </MenuItem>
                          ) : null}
                          {showMenu.Reports_Export_Report_Commercial_Market_ReelerPendingReport ? (
                            <MenuItem>
                              <MenuItemLink
                                text={t("Reeler Pending Report")}
                                to="/seriui/reeler-pending-report"
                              />
                            </MenuItem>
                          ) : null}
                          {showMenu.Reports_Export_Report_Commercial_Market_Average_Report ? (
                            <MenuItem>
                              <MenuItemLink
                                text={t("Average Report")}
                                to="/seriui/average-report"
                              />
                            </MenuItem>
                          ) : null}
                          {showMenu.Reports_Export_Report_Commercial_Market_Audio_Visual_Report ? (
                            <MenuItem>
                              <MenuItemLink
                                text={t("Audio Visual Report")}
                                to="/seriui/audio-visual-report"
                              />
                            </MenuItem>
                          ) : null}
                          {showMenu.Reports_Export_Report_Commercial_Market_B_Report ? (
                            <MenuItem>
                              <MenuItemLink
                                text={t("27 B Report")}
                                to="/seriui/27-b-report"
                              />
                            </MenuItem>
                          ) : null}
                          {showMenu.Reports_Export_Report_Commercial_Market_Monthly_Report ? (
                            <MenuItem>
                              <MenuItemLink
                                text={t("Monthly Report")}
                                to="/seriui/monthly-report"
                              />
                            </MenuItem>
                          ) : null}
                          {showMenu.Reports_Export_Report_Commercial_Market_Market_Report ? (
                            <MenuItem>
                              <MenuItemLink
                                text={t("Market Report")}
                                to="/seriui/market-report"
                              />
                            </MenuItem>
                          ) : null}
                          {showMenu.Reports_Export_Report_Commercial_Market_District_Report ? (
                            <MenuItem>
                              <MenuItemLink
                                text={t("District Report")}
                                to="/seriui/district-report"
                              />
                            </MenuItem>
                          ) : null}
                          {showMenu.Reports_Export_Report_Commercial_Market_Average_Cocoon_Report ? (
                            <MenuItem>
                              <MenuItemLink
                                text={t("Average Cocoon Report")}
                                to="/seriui/average-cocoon-report"
                              />
                            </MenuItem>
                          ) : null}
                        </MenuSub>
                      </MenuItem>
                    ) : null}

                    {showMenu.Reports_Format_Reports_Acknowledgement ? (
                      <MenuItem>
                        <MenuItemLink
                          text={t("Acknowledgement")}
                          to="/seriui/generate-acknowledgement"
                        />
                      </MenuItem>
                    ) : null}

                    {showMenu.Reports_Format_Reports_WorkOrder ? (
                      <MenuItem>
                        <MenuItemLink
                          text={t("Work Order")}
                          to="/seriui/generate-work-order"
                        />
                      </MenuItem>
                    ) : null}

                    {showMenu.Reports_Format_Reports_Selection_Letters ? (
                      <MenuItem>
                        <MenuItemLink
                          text={t("Selection Letters")}
                          to="/seriui/generate-selection-letter"
                        />
                      </MenuItem>
                    ) : null}

                    {showMenu.Reports_Format_Reports_Sanction_Order ? (
                      <MenuItem>
                        <MenuItemLink
                          text={t("Sanction Order")}
                          to="/seriui/generate-sanction-order"
                        />
                      </MenuItem>
                    ) : null}

                 </MenuSub>
                </MenuItem>
              ) : null}

              {showMenu.Reports_Admin ? (
                <MenuItem sub>
                  <MenuItemLink
                    text={t("Admin")}
                    onClick={menuToggle}
                    onMouseEnter={menuHover}
                    sub
                  />
                  <MenuSub>
                    {showMenu.Reports_Admin_User_Details_Report ? (
                      <MenuItem>
                        <MenuItemLink
                          text={t("User Details Report")}
                          to="/seriui/user-master-details-report"
                        />
                      </MenuItem>
                    ) : null}
                  </MenuSub>
                </MenuItem>
              ) : null}

              {/* {showMenu.Reports_Sanction_Order ? (
                <MenuItem>
                  <MenuItemLink
                    text={t("Sanction Orders")}
                    to="/seriui/generate-sanction-order"
                    blank={true}
                  />
                </MenuItem>
              ) : null}

            

              {showMenu.Reports_Pendency_Report ? (
                <MenuItem>
                  <MenuItemLink
                    text={t("Pendency Reports")}
                    to="/seriui/pendency-dashboard"
                    blank={true}
                  />
                </MenuItem>
              ) : null}

              {showMenu.Reports_Cumulative_Report ? (
                <MenuItem>
                  <MenuItemLink
                    text={t("Cumulative Reports")}
                    to="/seriui/cumulative-report"
                    blank={true}
                  />
                </MenuItem>
              ) : null} */}

              

              
          </MenuSub>
        </MenuItem>
      ) : null}

      {/* Hard Code Menu with mapcode End */}
    </MenuList>
  );
}

export default Menu;
