import React, { useEffect } from "react";
import { Routes, Route, useRoutes, useNavigate } from "react-router-dom";

import { ScrollToTop } from "../components";
// import PrivateRoute from "../services/auth/privateRoute";

//Pages
import Blank from "../pages/Blank";
// import Home from '../pages/Home';
import Home from "../pages/home/Modules";
import HomeEcommerce from "../pages/HomeEcommerce";
import HomeProject from "../pages/HomeProject";
import HomeMarketing from "../pages/HomeMarketing";
import HomeNFT from "../pages/HomeNFT";
import Admin from "../pages/dashboard/Admin";
import MyDashboard from "../pages/dashboard/MyDashboard";
import HrDashboard from "../pages/dashboard/HrDashboard";
import InventoryDashboard from "../pages/dashboard/InventoryDashboard";
import ProcurementDashboard from "../pages/dashboard/ProcurementDashboard";
import ReportsDashboard from "../pages/dashboard/ReportsDashboard";
import SettingsDashboard from "../pages/dashboard/SettingsDashboard";
import SupplyDashboard from "../pages/dashboard/SupplyDashboard";
import RequestDashboard from "../pages/dashboard/RequestDashboard";
import TechnicianDashboard from "../pages/dashboard/TechnicianDashboard";
import RequestList from "../pages/request/RequestList";
import AddRequest from "../pages/request/AddRequest";
import RequestView from "../pages/request/RequestView";
import AssignRequestToTech from "../pages/request/AssignRequestToTech";
import TechnicianRequestList from "../pages/technician/TechnicianRequestList";

// apps
import AppCalendar from "../pages/AppCalendar";
import KanbanBasic from "../pages/kanban/KanbanBasic";
import KanbanCustom from "../pages/kanban/KanbanCustom";
import Chats from "../pages/apps/chat/Chats";
import Inbox from "../pages/apps/mailbox/Inbox";

// user manage
import UserList from "../pages/user-manage/UserList";
import UserCards from "../pages/user-manage/UserCards";
import UserProfile from "../pages/user-manage/UserProfile";
import UserEdit from "../pages/user-manage/UserEdit";

// admin
import Profile from "../pages/admin/Profile";
import ProfileSettings from "../pages/admin/ProfileSettings";

// auths pages
import AuthRegister from "../pages/auths/AuthRegister";
import AuthLogin from "../pages/auths/AuthLogin";
import AuthReset from "../pages/auths/AuthReset";

import NotFound from "../pages/error/NotFound";
import IconsPreview from "../pages/IconsPreview";

// production
import ManufacturingOrderList from "../pages/production/ManufacturingOrderList";
import AddManufacturingOrder from "../pages/production/AddManufacturingOrder";
import BomList from "../pages/production/BomList";
import AddBomPage from "../pages/production/AddBomList";

// masters
import UserGroupListPage from "../pages/masters/userGroup/UserGroupList";
import CompanyListPage from "../pages/masters/company/CompanyList";
import BillingAddressListPage from "../pages/masters/address/BillingAddressList";
import BankDetailsListPage from "../pages/masters/accounts/BankDetailsList";
import PaymentTermsListPage from "../pages/masters/accounts/PaymentTermsList";
import TermsAndConditionsListPage from "../pages/masters/common/TermsAndConditionsList";
import StoreListPage from "../pages/masters/inventory/StoreList";
import UnitOfMeasurementListPage from "../pages/masters/unitOfMeasurement/UnitOfMeasurementList";
import AddCompanyPage from "../pages/masters/company/AddCompanyList";
import TestListPage from "../pages/test/Test";
import PostListPage from "../pages/test/Post";
import TestDataTablePage from "../pages/test/TestDataTable";
import CompanyViewPage from "../pages/masters/company/CompanyView";
import BankDetailsViewPage from "../pages/masters/accounts/BankDetailsView";
import PaymentTermsViewPage from "../pages/masters/accounts/PaymentTermsView";
import BillingAddressViewPage from "../pages/masters/address/BillingAddressView";
import TermsAndConditionsViewPage from "../pages/masters/common/TermsAndConditionsView";
import StoreViewPage from "../pages/masters/inventory/StoreView";
import UnitOfMeasurementViewPage from "../pages/masters/unitOfMeasurement/UnitOfMeasurementView";
import UserGroupViewPage from "../pages/masters/userGroup/UserGroupView";
import ItemListPage from "../pages/masters/inventory/ItemList";
import AddItemPage from "../pages/masters/inventory/AddItemList";
import ItemViewPage from "../pages/masters/inventory/ItemView";
import ServiceTypeList from "../pages/masters/serviceType/ServiceTypeList";
import ServiceTypeView from "../pages/masters/serviceType/ServiceTypeView";

// Sericulture
// Stake Holder Module
import StakeHolderRegister from "../pages/stake-holder/StakeHolderRegister";
import StakeHolderList from "../pages/stake-holder/StakeHolderList";
import StakeHolderViewPage from "../pages/stake-holder/StakeHolderView";
import NewReelerLicense from "../pages/stake-holder/reeler-license/NewReelerLicense";
import ReelerLicenseList from "../pages/stake-holder/reeler-license/ReelerLicenseList";
import ReelerLicenseView from "../pages/stake-holder/reeler-license/ReelerLicenseView";
import RenewReelerLicense from "../pages/stake-holder/reeler-license/RenewReelerLicense";
import TransferReelerLicense from "../pages/stake-holder/reeler-license/TransferReelerLicense";
import NewTraderLicense from "../pages/stake-holder/trader-license/NewTraderLicense";
import NewTraderLicenseList from "../pages/stake-holder/trader-license/NewTraderLicenseList";
import NewTraderLicenseView from "../pages/stake-holder/trader-license/NewTraderLicenseView";
import NewTraderLicenseEdit from "../pages/stake-holder/trader-license/NewTraderLicenseEdit";
import ExternalUnitRegister from "../pages/stake-holder/external-units/ExternalUnitRegister";
import ExternalUnitRegisterList from "../pages/stake-holder/external-units/ExternalUnitRegisterList";
import ExternalUnitRegisterView from "../pages/stake-holder/external-units/ExternalUnitRegisterView";
import ExternalUnitRegisterEdit from "../pages/stake-holder/external-units/ExternalUnitRegisterEdit";
// Services Module
import TrackDflProcurement from "../pages/services-module/TrackDflProcurement";
import TrackingMulberryStatus from "../pages/services-module/TrackingMulberryStatus";
import SupplyOfDisinfectants from "../pages/services-module/SupplyOfDisinfectants";
import ProvidingIncentives from "../pages/services-module/ProvidingIncentives";
import ProvidingSubsidy from "../pages/services-module/ProvidingSubsidy";
import PreparationDcBills from "../pages/services-module/PreparationDcBills";
import ProvidingChowkiIncentives from "../pages/services-module/ProvidingChowkiIncentives";
import ProvidingReelersIncentives from "../pages/services-module/ProvidingReelersIncentives";
import ProvidingReelersSubsidy from "../pages/services-module/ProvidingReelersSubsidy";
import SubsidyPrograms from "../pages/services-module/SubsidyPrograms";

// Seed and DFL Module

import MaintenanceofMulberryfarm from "../pages/seed-and-dfl-managment/MaintenanceofMulberryfarm";
import ReceiptofDFLsfromtheP4grainage from "../pages/seed-and-dfl-managment/ReceiptofDFLsfromtheP4grainage";
import MaintenanceofLineRecordsforEachRace from "../pages/seed-and-dfl-managment/MaintenanceofLineRecordsforEachRace";
import MaintenanceofScreeningBatchRecords from "../pages/seed-and-dfl-managment/MaintenanceofScreeningBatchRecords";
import DispatchofCocoonstoP4Grainage from "../pages/seed-and-dfl-managment/DispatchofCocoonstoP4Grainage";
import RearingofDFLsforthe8Lines from "../pages/seed-and-dfl-managment/RearingofDFLsforthe8Lines";
import Preservationofseedcocoonforprocessing from "../pages/seed-and-dfl-managment/Preservationofseedcocoonforprocessing";
import PreparationofeggsDFLs from "../pages/seed-and-dfl-managment/PreparationofeggsDFLs";
import Maintenanceofeggsatcoldstorage from "../pages/seed-and-dfl-managment/Maintenanceofeggsatcoldstorage";

import ColdStorageScheduleBV from "../pages/seed-and-dfl-managment/ColdStorageScheduleBV";

// Seed and DFL Module
// import MaintenanceMulberryFarm from "../pages/seed-and-dfl-managment/MaintenanceMulberryFarm";
// import MaintenanceMulberryFarmList from "../pages/seed-and-dfl-managment/MaintenanceMulberryFarmList";
// import MaintenanceMulberryFarmView from "../pages/seed-and-dfl-managment/MaintenanceMulberryView";
// import ReceiptsofDfls from "../pages/seed-and-dfl-managment/ReceiptsofDfls";
// import MaintenanceLineRecord from "../pages/seed-and-dfl-managment/MaintenanceLineRecord";
// import MaintenanceBatchRecord from "../pages/seed-and-dfl-managment/MaintenanceBatchRecord";
// import DispatchOfCocoons from "../pages/seed-and-dfl-managment/DispatchOfCocoons";
// import RearingofDfls from "../pages/seed-and-dfl-managment/RearingofDfls";
// import PreservationSeedCocoons from "../pages/seed-and-dfl-managment/PreservationSeedCocoons";
// import PreparationofEggs from "../pages/seed-and-dfl-managment/PreparationofEggs";
// import MaintenanceOfEggs from "../pages/seed-and-dfl-managment/MaintenanceOfEggs";
// import ColdStorageSchedule from "../pages/seed-and-dfl-managment/ColdStorageSchedule";
// import SaleDisposalDfl from "../pages/seed-and-dfl-managment/SaleDisposalDfl";
// import TestingOfMoth from "../pages/seed-and-dfl-managment/TestingOfMoth";
// import MaintenancePiercedCocoons from "../pages/seed-and-dfl-managment/MaintenancePiercedCocoons";
// import SaleOfPiercedCocoons from "../pages/seed-and-dfl-managment/SaleOfPiercedCocoons";
// import MaintenanceEggSheets from "../pages/seed-and-dfl-managment/MaintenanceEggSheets";
// import Remittance from "../pages/seed-and-dfl-managment/Remittance";

// Chawki Management
import SaleChawkiWorms from "../pages/chawki-management/SaleChawkiWorms";
import SaleChawkiWormsList from "../pages/chawki-management/SaleChawkiWormsList";
import SaleChawkiWormsView from "../pages/chawki-management/SaleChawkiWormsView";
import ChawkiManagement from "../pages/chawki-management/ChawkiManagement";
import ChawkiManagementEdit from "../pages/chawki-management/ChawkiManagementEdit";

// Inspection
import TrackingCurrentStatus from "../pages/Inspection/TrackingCurrentStatus";
import SupplyOfDisinfectantsInspection from "../pages/Inspection/SupplyOfDisinfectantsInspection";
import ImplementationOfMgnrega from "../pages/Inspection/ImplementationOfMgnrega";

// Target Setting
import AttributesAssigning from "../pages/target-setting/AttributesAssigning";

// Training
import AttributeUndertakingTraining from "../pages/training/AttributeUndertakingTraining";
import AttributeFoundationCourses from "../pages/training/AttributeFoundationCourses";

// Helpdesk
import RaiseTicket from "../pages/helpdesk/RaiseTicket";
import HelpdeskDashboard from "../pages/helpdesk/HelpdeskDashboard";
import MyTickets from "../pages/helpdesk/MyTickets";
import ViewMyTicket from "../pages/helpdesk/ViewMyTicket";

// Garden Management
import SeedCuttingBank from "../pages/garden-management/SeedCuttingBank";
import MaintenanceofmulberryGarden from "../pages/garden-management/MaintenanceofmulberryGarden";
import ReceiptofDFLsfromthegrainage from "../pages/garden-management/ReceiptofDFLsfromthegrainage";
import RearingofDFLs from "../pages/garden-management/RearingofDFLs";
import SupplyofCocoonstoGrainage from "../pages/garden-management/SupplyofCocoonstoGrainage";
import MaintenanceandSaleofNurserytoFarmers from "../pages/garden-management/MaintenanceandSaleofNurserytoFarmers";
import ChawkidistributiontoFarmers from "../pages/garden-management/ChawkidistributiontoFarmers";
import SupplyofCocoonstoGrainageEdit from "../pages/garden-management/SupplyofCocoonstoGrainageEdit";
import MaintenanceandSaleofNurserytoFarmersEdit from "../pages/garden-management/MaintenanceandSaleofNurserytoFarmersEdit";
import ChawkidistributiontoFarmersEdit from "../pages/garden-management/ChawkidistributiontoFarmersEdit";


// Direct Benefit Transfer
import SubsidyApprovalVerification from "../pages/direct-benefit-transfer/SubsidyApprovalVerification";
import SubsidySanction from "../pages/direct-benefit-transfer/SubsidySanction";
import SubsidyDrawing from "../pages/direct-benefit-transfer/SubsidyDrawing";
import SubsidyCounterSigning from "../pages/direct-benefit-transfer/SubsidyCounterSigning";

// Market and Auction
import BiddingSlip from "../pages/market-and-auction/BiddingSlip";
import RejectLot from "../pages/market-and-auction/RejectLot";
import RejectBid from "../pages/market-and-auction/RejectBid";
import Payment from "../pages/market-and-auction/Payment";
import RejectFarmerAuction from "../pages/market-and-auction/RejectFarmerAuction";
import UpdateLotWeight from "../pages/market-and-auction/UpdateLotWeight";
import AcceptFarmerAuction from "../pages/market-and-auction/AcceptFarmerAuction";

// Admin and Reports
import ReportsAdmin from "../pages/reports-admin/ReportsAdmin";

//  Master
import HeadOfAccount from "../pages/masters/head-of-account/HeadOfAccount";
import Caste from "../pages/masters/caste/Caste";
import Roles from "../pages/masters/roles/Roles";
import ConfigureSubsidy from "../pages/masters/configure-subsidy/ConfigureSubsidy";
import SubsidyAcknowledgement from "../pages/services-module/SubsidyAcknowledgement";
import Scheme from "../pages/masters/scheme/Scheme";
import SubScheme from "../pages/masters/sub-scheme/SubScheme";
import Education from "../pages/masters/education/Education";
import Relationship from "../pages/masters/relationship/Relationship";
import State from "../pages/masters/state/State";
import District from "../pages/masters/district/District";
import Taluk from "../pages/masters/taluk/Taluk";
import Hobli from "../pages/masters/hobli/Hobli";
import Village from "../pages/masters/village/Village";
import LandCategory from "../pages/masters/land-category/LandCategory";
import IrrigationSource from "../pages/masters/irrigation-source/IrrigationSource";
import LandOwnership from "../pages/masters/land-ownership/LandOwnership";
import SoilType from "../pages/masters/soil-type/SoilType";
import RearHouseRoofType from "../pages/masters/rear-house-roof-type/RearHouseRoofType";
import SilkWormVariety from "../pages/masters/silk-worm-variety/SilkWormVariety";
import SourceOfMulberry from "../pages/masters/source-of-mulberry/SourceOfMulberry";
import MulberryVariety from "../pages/masters/mulberry-variety/MulberryVariety";
import SubsidyDetails from "../pages/masters/subsidy-details/SubsidyDetails";
import PlantationType from "../pages/masters/plantation-type/PlantationType";
import MachineType from "../pages/masters/machine-type/MachineType";
import CasteList from "../pages/masters/caste/CasteList";
import CasteView from "../pages/masters/caste/CasteView";
import EducationList from "../pages/masters/education/EducationList";
import EducationView from "../pages/masters/education/EducationView";
import RelationshipList from "../pages/masters/relationship/RelationshipList";
import RelationshipView from "../pages/masters/relationship/RelationshipView";
import StateList from "../pages/masters/state/StateList";
import StateView from "../pages/masters/state/StateView";
import DistrictList from "../pages/masters/district/DistrictList";
import DistrictView from "../pages/masters/district/DistrictView";
import TalukList from "../pages/masters/taluk/TalukList";
import TalukView from "../pages/masters/taluk/TalukView";
import HobliList from "../pages/masters/hobli/HobliList";
import HobliView from "../pages/masters/hobli/HobliView";
import VillageList from "../pages/masters/village/VillageList";
import VillageView from "../pages/masters/village/VillageView";
import LandCategoryList from "../pages/masters/land-category/LandCategoryList";
import LandCategoryView from "../pages/masters/land-category/LandCategoryView";
import IrrigationSourceList from "../pages/masters/irrigation-source/IrrigationSourceList";
import IrrigationSourceView from "../pages/masters/irrigation-source/IrrigationSourceView";
import LandOwnershipList from "../pages/masters/land-ownership/LandOwnershipList";
import LandOwnershipView from "../pages/masters/land-ownership/LandOwnershipView";
import SoilTypeList from "../pages/masters/soil-type/SoilTypeList";
import SoilTypeView from "../pages/masters/soil-type/SoilTypeView";
import RearHouseRoofTypeList from "../pages/masters/rear-house-roof-type/RearHouseRoofTypeList";
import RearHouseRoofTypeView from "../pages/masters/rear-house-roof-type/RearHouseRoofTypeView";
import SilkWormVarietyList from "../pages/masters/silk-worm-variety/SilkWormVarietyList";
import SilkWormVarietyView from "../pages/masters/silk-worm-variety/SilkWormVarietyView";
import SourceOfMulberryList from "../pages/masters/source-of-mulberry/SourceOfMulberryList";
import SourceOfMulberryView from "../pages/masters/source-of-mulberry/SourceOfMulberryView";
import MulberryVarietyList from "../pages/masters/mulberry-variety/MulberryVarietyList";
import MulberryVarietyView from "../pages/masters/mulberry-variety/MulberryVarietyView";
import SubsidyDetailsList from "../pages/masters/subsidy-details/SubsidyDetailsList";
import SubsidyDetailsView from "../pages/masters/subsidy-details/SubsidyDetailsView";
import PlantationTypeList from "../pages/masters/plantation-type/PlantationTypeList";
import PlantationTypeView from "../pages/masters/plantation-type/PlantationtypeView";
import MachineTypeList from "../pages/masters/machine-type/MachineTypeList";
import MachineTypeView from "../pages/masters/machine-type/MachineTypeView";
import ReasonLotCancellation from "../pages/masters/reason-lot-cancellation/ReasonLotCancellation";
import ReasonLotCancellationList from "../pages/masters/reason-lot-cancellation/ReasonLotCancellationList";
import ReasonLotCancellationView from "../pages/masters/reason-lot-cancellation/ReasonLotCancellationView";
import ReasonBidRejection from "../pages/masters/reason-bid-rejection/ReasonBidRejection";
import ReasonBidRejectionList from "../pages/masters/reason-bid-rejection/ReasonBidRejectionList";
import ReasonBidRejectionView from "../pages/masters/reason-bid-rejection/ReasonBidRejectionView";
import Market from "../pages/masters/market/Market";
import MarketList from "../pages/masters/market/MarketList";
import MarketView from "../pages/masters/market/MarketView";
import AlertsDashboard from "../pages/dashboard/AlertsDashboard";
import Godawn from "../pages/masters/godawn/Godawn";
import GodawnList from "../pages/masters/godawn/GodawnList";
import GodawnView from "../pages/masters/godawn/GodawnView";
import Bin from "../pages/masters/bin/Bin";
import BinList from "../pages/masters/bin/BinList";
import BinView from "../pages/masters/bin/BinView";
import StateEdit from "../pages/masters/state/StateEdit";
import EducationEdit from "../pages/masters/education/EducationEdit";
import RelationshipEdit from "../pages/masters/relationship/RelationshipEdit";
import LandCategoryEdit from "../pages/masters/land-category/LandCategoryEdit";
import LandOwnershipEdit from "../pages/masters/land-ownership/LandOwnershipEdit";
import IrrigationSourceEdit from "../pages/masters/irrigation-source/IrrigationSourceEdit";
import SoilTypeEdit from "../pages/masters/soil-type/SoilTypeEdit";
import SubsidyDetailsEdit from "../pages/masters/subsidy-details/SubsidyDetailsEdit";
import RolesList from "../pages/masters/roles/RolesList";
import RolesView from "../pages/masters/roles/RolesView";
import RolesEdit from "../pages/masters/roles/RolesEdit";
import RearHouseRoofTypeEdit from "../pages/masters/rear-house-roof-type/RearHouseRoofTypeEdit";
import SilkWormVarietyEdit from "../pages/masters/silk-worm-variety/SilkWormVarietyEdit";
import SourceOfMulberryEdit from "../pages/masters/source-of-mulberry/SourceOfMulberryEdit";
import MulberryVarietyEdit from "../pages/masters/mulberry-variety/MulberryVarietyEdit";
import PlantationTypeEdit from "../pages/masters/plantation-type/PlantationTypeEdit";
import CasteEdit from "../pages/masters/caste/CasteEdit";

import MachineTypeEdit from "../pages/masters/machine-type/MachineTypeEdit";
import ReasonLotCancellationEdit from "../pages/masters/reason-lot-cancellation/ReasonLotCancellationEdit";
import ReasonBidRejectionEdit from "../pages/masters/reason-bid-rejection/ReasonBidRejectionEdit";
import DistrictEdit from "../pages/masters/district/DistrictEdit";
import TalukEdit from "../pages/masters/taluk/TalukEdit";
import HobliEdit from "../pages/masters/hobli/HobliEdit";
import VillageEdit from "../pages/masters/village/VillageEdit";
import GodawnEdit from "../pages/masters/godawn/GodawnEdit";
import ExternalUnitType from "../pages/masters/external-unit-type/ExternalUnitType";
import TraderType from "../pages/masters/trader-type/TraderType";
import TraderTypeList from "../pages/masters/trader-type/TraderTypeList";
import TraderTypeView from "../pages/masters/trader-type/TraderTypeView";
import TraderTypeEdit from "../pages/masters/trader-type/TraderTypeEdit";
import ExternalUnitTypeList from "../pages/masters/external-unit-type/ExternalUnitTypeList";
import ExternalUnitTypeView from "../pages/masters/external-unit-type/ExternalUnitTypeView";
import ExternalUnitTypeEdit from "../pages/masters/external-unit-type/ExternalUnitTypeEdit";
import MarketEdit from "../pages/masters/market/MarketEdit";
import Race from "../pages/masters/race/Race";
import RaceList from "../pages/masters/race/RaceList";
import RaceView from "../pages/masters/race/RaceView";
import RaceEdit from "../pages/masters/race/RaceEdit";
import Source from "../pages/masters/source/Source";
import SourceList from "../pages/masters/source/SourceList";
import SourceView from "../pages/masters/source/SourceView";
import SourceEdit from "../pages/masters/source/SourceEdit";
import ScProgram from "../pages/masters/sc-program/ScProgram";
import ScProgramList from "../pages/masters/sc-program/ScProgramList";
import ScProgramView from "../pages/masters/sc-program/ScProgramView";
import ScProgramEdit from "../pages/masters/sc-program/ScProgramEdit";
import ScComponent from "../pages/masters/sc-component/ScComponent";
import ScComponentList from "../pages/masters/sc-component/ScComponentList";
import ScComponentView from "../pages/masters/sc-component/ScComponentView";
import ScComponentEdit from "../pages/masters/sc-component/ScComponentEdit";
import ScHeadAccount from "../pages/masters/sc-head-account/ScHeadAccount";
import ScHeadAccountList from "../pages/masters/sc-head-account/ScHeadAccountList";
import ScHeadAccountView from "../pages/masters/sc-head-account/ScHeadAccountView";
import ScHeadAccountEdit from "../pages/masters/sc-head-account/ScHeadAccountEdit";
import EmpenelledVendor from "../pages/masters/empanelled-vendor/EmpanelledVendor";
import EmpanelledVendor from "../pages/masters/empanelled-vendor/EmpanelledVendor";
import EmpanelledVendorList from "../pages/masters/empanelled-vendor/EmpanelledVendorList";
import EmpanelledVendorView from "../pages/masters/empanelled-vendor/EmpanelledVendorView";
import EmpanelledVendorEdit from "../pages/masters/empanelled-vendor/EmpanelledVendorEdit";
import GenerateBiddingSlip from "../pages/market-and-auction/GenerateBiddingSlip";
import Weighment from "../pages/market-and-auction/Weighment";
import ReadyForPayment from "../pages/market-and-auction/ReadyForPayment";
import BankStatement from "../pages/market-and-auction/BankStatement";
import BulkSendToBank from "../pages/market-and-auction/BulkSendToBank";
import IfscUpdate from "../pages/market-and-auction/IfscUpdate";
import ReelerDeviceMapping from "../pages/masters/reeler-device-mapping/ReelerDeviceMapping";
import AcceptBid from "../pages/masters/accept-bid/AcceptBid";
import ReelerTransactionReport from "../pages/reeler-transaction-report/ReelerTransactionReport";
import BidDashboard from "../pages/bid-dashboard/BidDashboard";
import ReelerLicenceEdit from "../pages/stake-holder/reeler-license/ReelerLicenceEdit";
import StakeHolderEdit from "../pages/stake-holder/StakeHolderEdit";
import IrrigationType from "../pages/masters/irrigation-type/IrrigationType";
import IrrigationTypeList from "../pages/masters/irrigation-type/IrrigationTypeList";
import IrrigationTypeView from "../pages/masters/irrigation-type/IrrigationTypeView";
import IrrigationTypeEdit from "../pages/masters/irrigation-type/IrrigationTypeEdit";
import RoleConfig from "../pages/masters/role-config/RoleConfig";
import RolePages from "../pages/masters/role-pages/RolePages";
import User from "../pages/masters/user/User";
import UserView from "../pages/masters/user/UsersView";
import UsersList from "../pages/masters/user/UsersList";
import UsersView from "../pages/masters/user/UsersView";
import UsersEdit from "../pages/masters/user/UsersEdit";
import Designation from "../pages/masters/designation/Designation";
import DesignationList from "../pages/masters/designation/DesignationList";
import DesignationView from "../pages/masters/designation/DesignationView";
import DesignationEdit from "../pages/masters/designation/DesignationEdit";
import FarmerType from "../pages/masters/farmer-type/FarmerType";
import FarmerTypeList from "../pages/masters/farmer-type/FarmerTypeList";
import FarmerTypeView from "../pages/masters/farmer-type/FarmerTypeView";
import FarmerTypeEdit from "../pages/masters/farmer-type/FarmerTypeEdit";
import Document from "../pages/masters/document/Document";
import DocumentList from "../pages/masters/document/DocumentList";
import DocumentsEdit from "../pages/masters/document/DocumentEdit";
import DocumentsView from "../pages/masters/document/DocumentView";
import MarketType from "../pages/masters/market-type/MarketType";
import MarketTypeList from "../pages/masters/market-type/MarketTypeList";
import MarketTypeView from "../pages/masters/market-type/MarketTypeView";
import MarketTypeEdit from "../pages/masters/market-type/MarketTypeEdit";
import { Test1 } from "../pages/test/Test1";
import Crate from "../pages/masters/crate/Crate";
import CrateList from "../pages/masters/crate/CrateList";
import CrateView from "../pages/masters/crate/CrateView";
import CrateEdit from "../pages/masters/crate/CrateEdit";
import UpdateBin from "../pages/masters/bin/UpdateBin";
import ReelerActivate from "../pages/stake-holder/reeler-license/ReelerActivate";
import FlexTime from "../pages/masters/flex/FlexTime";
import PrintBidSlip from "../pages/market-and-auction/PrintBidSlip";
import ChangePassword from "../pages/masters/change-password/ChangePassword";
import WorkingInstitution from "../pages/masters/working-institution/WorkingInstitution";
import WorkingInstitutionEdit from "../pages/masters/working-institution/WorkingInstitutionEdit";
import WorkingInstitutionView from "../pages/masters/working-institution/WorkingInstitutionView";
import WorkingInstitutionList from "../pages/masters/working-institution/WorkingInstitutionList";
import TrainingProgram from "../pages/masters/training-program/TrainingProgram";
import TrainingProgramList from "../pages/masters/training-program/TrainingProgramList";
import TrainingProgramEdit from "../pages/masters/training-program/TrainingProgramEdit";
import TrainingProgramView from "../pages/masters/training-program/TrainingProgramView";
import TrainingCourse from "../pages/masters/training-course/TrainingCourse";
import TrainingCourseList from "../pages/masters/training-course/TrainingCourseList";
import TrainingCourseEdit from "../pages/masters/training-course/TrainingCourseEdit";
import TrainingCourseView from "../pages/masters/training-course/TrainingCourseView";
import ReelerType from "../pages/masters/reeler-type/ReelerType";
import ReelerTypeList from "../pages/masters/reeler-type/ReelerTypeList";
import ReelerTypeView from "../pages/masters/reeler-type/ReelerTypeView";
import ReelerTypeEdit from "../pages/masters/reeler-type/ReelerTypeEdit";
import RaceMapping from "../pages/masters/race-mapping/RaceMapping";
import RaceMappingList from "../pages/masters/race-mapping/RaceMappingList";
import RaceMappingEdit from "../pages/masters/race-mapping/RaceMappingEdit ";
import RaceMappingView from "../pages/masters/race-mapping/RaceMappingView";
import PendingReport from "../pages/reports-admin/market-auction/PendingReport";
import UnitCounterReport from "../pages/reports-admin/market-auction/UnitCounterReport";
import FarmerTransactionReport from "../pages/reports-admin/market-auction/FarmerTransactionReport";
import ReelerTransactionReports from "../pages/reports-admin/market-auction/ReelerTransactionReports";
import BiddingReport from "../pages/reports-admin/market-auction/BiddingReport";
import BiddingReportReeler from "../pages/reports-admin/market-auction/BiddingReportReeler";
import DtrOnlineReport from "../pages/reports-admin/market-auction/DtrOnlineReport";
import DtrAll from "../pages/reports-admin/market-auction/DtrAll";
import Form13Dtr from "../pages/reports-admin/market-auction/Form13Dtr";
import Form13DtrBv from "../pages/reports-admin/market-auction/Form13DtrBv";
import Form13DtrAbstract from "../pages/reports-admin/market-auction/Form13DtrAbstract";
import UnitMf from "../pages/reports-admin/market-auction/UnitMf";
import ReelerMfReport from "../pages/reports-admin/market-auction/ReelerMfReport";
import ReelerAbstract from "../pages/reports-admin/market-auction/ReelerAbstract";
import ReelerPurchase from "../pages/reports-admin/market-auction/ReelerPurchase";
import DistrictWiseAbstractReport from "../pages/reports-admin/market-auction/DistrictWiseAbstractReport";
import DisplayAllLot from "../pages/market-and-auction/DisplayAllLot";
import TrainingSchedule from "../pages/training-schedule/TrainingSchedule";
import TrainingScheduleList from "../pages/training-schedule/TrainingScheduleList";
import TrainingScheduleView from "../pages/training-schedule/TrainingScheduleView";
import TrainingScheduleEdit from "../pages/training-schedule/TrainingScheduleEdit";
import TrainingGroup from "../pages/masters/training-group/TrainingGroup";
import TrainingGroupList from "../pages/masters/training-group/TrainingGroupList";
import TrainingGroupEdit from "../pages/masters/training-group/TrainingGroupEdit";
import TrainingGroupView from "../pages/masters/training-group/TrainingGroupView";
import TrainingInstitution from "../pages/masters/training-institution/TrainingInstitution";
import TrainingInstitutionList from "../pages/masters/training-institution/TrainingInstitutionList";
import TrainingInstitutionEdit from "../pages/masters/training-institution/TrainingInstitutionEdit";
import TrainingInstitutionView from "../pages/masters/training-institution/TrainingInstitutionView";
import TrainingMode from "../pages/masters/training-mode/TrainingMode";
import TrainingModeList from "../pages/masters/training-mode/TrainingModeList";
import TrainingModeEdit from "../pages/masters/training-mode/TrainingModeEdit";
import TrainingModeView from "../pages/masters/training-mode/TrainingModeView";
import TrainerPage from "../pages/trainer-page/TrainerPage";
import TrainingDeputationTracker from "../pages/training-deputation-tracker/TrainingDeputationTracker";
import TrainingDeputationTrackerEdit from "../pages/training-deputation-tracker/TrainingDeputationTrackerEdit";
import TrainingDeputationTrackerList from "../pages/training-deputation-tracker/TrainingDeputationTrackerList";
import TrainingDeputationTrackerView from "../pages/training-deputation-tracker/TrainingDeputationTrackerView";
import TrainerPageEdit from "../pages/trainer-page/TrainerPageEdit";
import TrainerPageList from "../pages/trainer-page/TrainerPageList";
import TrainerPageView from "../pages/trainer-page/TrainerPageView";
import TrainingOffice from "../pages/masters/training-office/TrainingOffice";
import TrainingOfficeList from "../pages/masters/training-office/TrainingOfficeList";
import TrainingOfficeEdit from "../pages/masters/training-office/TrainingOfficeEdit";
import TrainingOfficeView from "../pages/masters/training-office/TrainingOfficeView";
import TrainingDeputedInstitute from "../pages/masters/training-deputed-institute/TrainingDeputedInstitute";
import TrainingDeputedInstituteList from "../pages/masters/training-deputed-institute/TrainingDeputedInstituteList";
import TrainingDeputedInstituteEdit from "../pages/masters/training-deputed-institute/TrainingDeputedInstituteEdit";
import TrainingDeputedInstituteView from "../pages/masters/training-deputed-institute/TrainingDeputedInstituteView";
import Gatepass from "../pages/market-and-auction/Gatepass";
import HelpDesk from "../pages/helpdesk/HelpDesk";
import HelpDeskModule from "../pages/masters/helpdesk-module/HelpDeskModule";
import HelpDeskModuleEdit from "../pages/masters/helpdesk-module/HelpDeskModuleEdit";
import HelpDeskModuleList from "../pages/masters/helpdesk-module/HelpDeskModuleList";
import HelpDeskModuleView from "../pages/masters/helpdesk-module/HelpDeskModuleView";
import HelpDeskFeature from "../pages/masters/help-desk-feature/HelpDeskFeature";
import HelpDeskFeatureList from "../pages/masters/help-desk-feature/HelpDeskFeatureList";
import HelpDeskFeatureEdit from "../pages/masters/help-desk-feature/HelpDeskFeatureEdit";
import HelpDeskFeatureView from "../pages/masters/help-desk-feature/HelpDeskFeatureView";
import HelpDeskBoardCategory from "../pages/masters/help-desk-board-category/HelpDeskBoardCategory";
import HelpDeskBoardCategoryEdit from "../pages/masters/help-desk-board-category/HelpDeskBoardCategoryEdit";
import HelpDeskBoardCategoryList from "../pages/masters/help-desk-board-category/HelpDeskBoardCategoryList";
import HelpDeskBoardCategoryView from "../pages/masters/help-desk-board-category/HelpDeskBoardCategoryView";
import HelpDeskCategory from "../pages/masters/help-desk-category/HelpDeskCategory";
import HelpDeskSubCategoryList from "../pages/masters/help-desk-sub-category/HelpDeskSubCategoryList";
import HelpDeskCategoryView from "../pages/masters/help-desk-category/HelpDeskCategoryView";
import HelpDeskCategoryList from "../pages/masters/help-desk-category/HelpDeskCategoryList";
import HelpDeskCategoryEdit from "../pages/masters/help-desk-category/HelpDeskCategoryEdit";
import HelpDeskSubCategory from "../pages/masters/help-desk-sub-category/HelpDeskSubCategory";
import HelpDeskSubCategoryEdit from "../pages/masters/help-desk-sub-category/HelpDeskSubCategoryEdit";
import HelpDeskSubCategoryView from "../pages/masters/help-desk-sub-category/HelpDeskSubCategoryView";
import MarketExceptionTime from "../pages/masters/market-exception-time/MarketExceptionTime";
import HelpDeskStatus from "../pages/masters/help-desk-status/HelpDeskStatus";
import HelpDeskStatusEdit from "../pages/masters/help-desk-status/HelpDeskStatusEdit";
import HelpDeskStatusView from "../pages/masters/help-desk-status/HelpDeskView";
import HelpDeskStatusList from "../pages/masters/help-desk-status/HelpDeskStatusList";
import HelpDeskSeverity from "../pages/masters/help-desk-severity/HelpDeskSeverity";
import HelpDeskSeverityList from "../pages/masters/help-desk-severity/HelpDeskSeverityList";
import HelpDeskSeverityView from "../pages/masters/help-desk-severity/HelpDeskSeverityView";
import HelpDeskSeverityEdit from "../pages/masters/help-desk-severity/HelpDeskSeverityEdit";
import HelpDeskFaq from "../pages/masters/help-desk-faq/HelpDeskFaq";
import HelpDeskFaqView from "../pages/helpdesk/HelpDeskFaqView";
import HelpDeskFaqEdit from "../pages/masters/help-desk-faq/HelpDeskFaqEdit";
import HelpDeskFaqList from "../pages/masters/help-desk-faq/HelpDeskFaqList";
import UserDashboard from "../pages/helpdesk/UserDashboard";
import MaintenanceOfMulberryGardenList from "../pages/garden-management/MaintenanceOfMulberryGardenList";
import MaintenanceOfMulberryGardenView from "../pages/garden-management/MaintenanceOfMulberryGardenView";
import MaintenanceOfMulberryGardenEdit from "../pages/garden-management/MaintenanceOfMulberryGardenEdit";
import RearingOfDFLsList from "../pages/garden-management/RearingOfDFLsList";
import RearingOfDFLsView from "../pages/garden-management/RearingOfDFLsView";
import RearingOfDFLsEdit from "../pages/garden-management/RearingOfDFLsEdit";
import ReceiptOfDFLsList from "../pages/garden-management/ReceiptOfDFLsList";
import ReceiptOfDFLsView from "../pages/garden-management/ReceiptOfDFLsView";
import ReceiptOfDFLsEdit from "../pages/garden-management/ReceiptOfDFLsEdit";
import SeedCuttingBankList from "../pages/garden-management/SeedCuttingBankList";
import SeedCuttingBankView from "../pages/garden-management/SeedCuttingBankView";
import SeedCuttingBankEdit from "../pages/garden-management/SeedCuttingBankEdit";

// Admin and Reports

function Router() {
  const token = localStorage.getItem("jwtToken");
  const isAuthenticated = token !== null && token !== "";
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <ScrollToTop>
      <Routes>
        <Route path="/blank" element={<Blank />} />
        <Route path="/" element={<AuthLogin />} />
        <Route path="/home" element={<Home />} />

        {/* Conditional rendering for protected route */}
        {isAuthenticated && (
          <>
            <Route path="home-ecommerce" element={<HomeEcommerce />} />
            <Route path="home-project" element={<HomeProject />} />
            <Route path="home-marketing" element={<HomeMarketing />} />
            <Route path="home-nft" element={<HomeNFT />} />
            <Route path="admin" element={<Admin />} />
            <Route path="my-dashboard" element={<MyDashboard />} />
            <Route path="hr-dashboard" element={<HrDashboard />} />
            <Route
              path="inventory-dashboard"
              element={<InventoryDashboard />}
            />
            <Route
              path="procurement-dashboard"
              element={<ProcurementDashboard />}
            />
            <Route path="report-dashboard" element={<ReportsDashboard />} />
            <Route path="setting-dashboard" element={<SettingsDashboard />} />
            <Route path="supply-dashboard" element={<SupplyDashboard />} />
            <Route path="request-dashboard" element={<RequestDashboard />} />
            <Route
              path="technician-dashboard"
              element={<TechnicianDashboard />}
            />
            <Route path="request" element={<RequestList />} />
            <Route path="add-request" element={<AddRequest />} />
            <Route path="request-view/:id" element={<RequestView />} />
            <Route
              path="assign-request-tech"
              element={<AssignRequestToTech />}
            />
            <Route
              path="technician-request-list"
              element={<TechnicianRequestList />}
            />

            <Route path="apps">
              <Route path="calendar" element={<AppCalendar />} />
              <Route path="kanban/basic" element={<KanbanBasic />} />
              <Route path="kanban/custom" element={<KanbanCustom />} />
              <Route path="chats" element={<Chats />} />
              <Route path="inbox" element={<Inbox />} />
            </Route>

            <Route path="user-manage">
              <Route path="user-list" element={<UserList />} />
              <Route path="user-cards" element={<UserCards />} />
              <Route path="user-profile/:id" element={<UserProfile />} />
              <Route path="user-edit/:id" element={<UserEdit />} />
            </Route>

            <Route path="production">
              <Route
                path="manufacturing-order"
                element={<ManufacturingOrderList />}
              />
              <Route
                path="add-manufacturing-order"
                element={<AddManufacturingOrder />}
              />
              <Route path="bill-of-material" element={<BomList />} />
              <Route path="add-bill-of-material" element={<AddBomPage />} />
            </Route>

            <Route path="admin">
              <Route path="profile" element={<Profile />} />
              <Route path="profile-settings" element={<ProfileSettings />} />
            </Route>

            <Route path="masters">
              <Route path="user-group" element={<UserGroupListPage />} />
              <Route
                path="user-group-view/:id"
                element={<UserGroupViewPage />}
              />
              <Route path="company-list" element={<CompanyListPage />} />
              <Route path="company-view/:id" element={<CompanyViewPage />} />
              <Route path="add-company" element={<AddCompanyPage />} />
              <Route
                path="billing-address"
                element={<BillingAddressListPage />}
              />
              <Route path="service-type" element={<ServiceTypeList />} />
              <Route
                path="service-type-view/:id"
                element={<ServiceTypeView />}
              />
              <Route
                path="billing-address-view/:id"
                element={<BillingAddressViewPage />}
              />
              <Route path="bank-details" element={<BankDetailsListPage />} />
              <Route
                path="bank-details-view/:id"
                element={<BankDetailsViewPage />}
              />
              <Route path="payment-terms" element={<PaymentTermsListPage />} />
              <Route
                path="payment-terms-view/:id"
                element={<PaymentTermsViewPage />}
              />
              <Route
                path="terms-and-conditions"
                element={<TermsAndConditionsListPage />}
              />
              <Route
                path="terms-and-conditions-view/:id"
                element={<TermsAndConditionsViewPage />}
              />
              <Route path="stores" element={<StoreListPage />} />
              <Route path="stores-view/:id" element={<StoreViewPage />} />
              <Route
                path="unit-of-measurements"
                element={<UnitOfMeasurementListPage />}
              />
              <Route
                path="unit-of-measurements-view/:id"
                element={<UnitOfMeasurementViewPage />}
              />
              <Route path="item" element={<ItemListPage />} />
              <Route path="item-view/:id" element={<ItemViewPage />} />
              <Route path="add-item" element={<AddItemPage />} />

              <Route path="test-todo" element={<TestListPage />} />
              <Route path="test-post" element={<PostListPage />} />
              <Route path="test-data-table" element={<TestDataTablePage />} />
            </Route>

            <Route path="auths">
              <Route path="auth-register" element={<AuthRegister />} />
              <Route path="auth-login" element={<AuthLogin />} />
              <Route path="auth-reset" element={<AuthReset />} />
            </Route>

            <Route path="icons" element={<IconsPreview />} />
            <Route path="not-found" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />

            {/* Sericulture */}
            <Route
              path="stake-holder-registration"
              element={<StakeHolderRegister />}
            />
            <Route path="stake-holder-list" element={<StakeHolderList />} />
            <Route
              path="stake-holder-view/:id"
              element={<StakeHolderViewPage />}
            />
            <Route path="stake-holder-edit/:id" element={<StakeHolderEdit />} />
            <Route
              path="issue-new-reeler-license"
              element={<NewReelerLicense />}
            />
            <Route path="reeler-license-list" element={<ReelerLicenseList />} />
            <Route
              path="reeler-license-view/:id"
              element={<ReelerLicenseView />}
            />
            <Route
              path="reeler-license-edit/:id"
              element={<ReelerLicenceEdit />}
            />
            <Route
              path="renew-reeler-license"
              element={<RenewReelerLicense />}
            />
            <Route
              path="transfer-reeler-license"
              element={<TransferReelerLicense />}
            />
            <Route
              path="issue-new-trader-license"
              element={<NewTraderLicense />}
            />
            <Route
              path="issue-new-trader-license-list"
              element={<NewTraderLicenseList />}
            />
            <Route
              path="issue-new-trader-license-view/:id"
              element={<NewTraderLicenseView />}
            />
            <Route
              path="issue-new-trader-license-edit/:id"
              element={<NewTraderLicenseEdit />}
            />
            <Route
              path="external-unit-registration"
              element={<ExternalUnitRegister />}
            />
            <Route
              path="external-unit-registration-list"
              element={<ExternalUnitRegisterList />}
            />
            <Route
              path="external-unit-registration-view/:id"
              element={<ExternalUnitRegisterView />}
            />
            <Route
              path="external-unit-registration-edit/:id"
              element={<ExternalUnitRegisterEdit />}
            />

            <Route path="training-schedule" element={<TrainingSchedule />} />
            <Route
              path="training-schedule-list"
              element={<TrainingScheduleList />}
            />
            <Route
              path="training-schedule-view/:id"
              element={<TrainingScheduleView />}
            />
            <Route
              path="training-schedule-edit/:id"
              element={<TrainingScheduleEdit />}
            />
            <Route path="trainer-page" element={<TrainerPage />} />
            <Route path="trainer-page-edit/:id" element={<TrainerPageEdit />} />
            <Route path="trainer-page-list" element={<TrainerPageList />} />
            <Route path="trainer-page-view/:id" element={<TrainerPageView />} />

            <Route
              path="training-deputation-tracker"
              element={<TrainingDeputationTracker />}
            />
            <Route
              path="training-deputation-tracker-list"
              element={<TrainingDeputationTrackerList />}
            />
            <Route
              path="training-deputation-tracker-view/:id"
              element={<TrainingDeputationTrackerView />}
            />
            <Route
              path="training-deputation-tracker-edit/:id"
              element={<TrainingDeputationTrackerEdit />}
            />

            {/* Services */}
            <Route
              path="track-dfl-procurement"
              element={<TrackDflProcurement />}
            />
            <Route
              path="track-mulberry-status"
              element={<TrackingMulberryStatus />}
            />
            <Route
              path="supply-disinfectants"
              element={<SupplyOfDisinfectants />}
            />
            <Route
              path="providing-incentives"
              element={<ProvidingIncentives />}
            />
            <Route path="providing-subsidy" element={<ProvidingSubsidy />} />
            <Route
              path="preparation-dc-bills"
              element={<PreparationDcBills />}
            />
            <Route
              path="providing-chawki-incentives"
              element={<ProvidingChowkiIncentives />}
            />
            <Route
              path="providing-reeler-incentives"
              element={<ProvidingReelersIncentives />}
            />
            <Route
              path="providing-reeler-subsidy"
              element={<ProvidingReelersSubsidy />}
            />
            <Route path="subsidy-programs" element={<SubsidyPrograms />} />
            <Route
              path="subsidy-acknowledge"
              element={<SubsidyAcknowledgement />}
            />

            {/* Seed & DFL Management */}

            <Route
              path="Maintenance-of-mulberry-Garden-in-the-Farms"
              element={<MaintenanceofMulberryfarm />}
            />
            <Route
              path="Receipt-of-DFLs-from-the-P4-grainage"
              element={<ReceiptofDFLsfromtheP4grainage />}
            />
            <Route
              path="Maintenance-of-Line-Records-for-Each-Race"
              element={<MaintenanceofLineRecordsforEachRace />}
            />

            <Route
              path="Maintenance-of-Screening-Batch-Records"
              element={<MaintenanceofScreeningBatchRecords />}
            />

            <Route
              path="Dispatch-of-Cocoons-to-P4-Grainage"
              element={<DispatchofCocoonstoP4Grainage />}
            />

            <Route
              path="Rearing-of-DFLs-for-the-8-Lines"
              element={<RearingofDFLsforthe8Lines />}
            />

            <Route
              path="Preservation-of-seed-cocoon-for-processing"
              element={<Preservationofseedcocoonforprocessing />}
            />

            <Route
              path="Preparation-of-eggs-DFLs"
              element={<PreparationofeggsDFLs />}
            />

            <Route
              path="Maintenance-of-eggs-at-cold-storage"
              element={<Maintenanceofeggsatcoldstorage />}
            />

            <Route
              path="Cold-Storage-Schedule-BV"
              element={<ColdStorageScheduleBV />}
            />

            {/* Seed & DFL Management */}
            {/*<Route
          path="maintenance-mulberry-farm"
          element={<MaintenanceMulberryFarm />}
        />
        <Route
          path="maintenance-mulberry-farm-list"
          element={<MaintenanceMulberryFarmList />}
        />
        <Route
          path="maintenance-mulberry-farm-view/:id"
          element={<MaintenanceMulberryFarmView />}
        />
        <Route path="receipt-of-dfls" element={<ReceiptsofDfls />} />
        <Route
          path="maintenance-line-record"
          element={<MaintenanceLineRecord />}
        />
        <Route
          path="maintenance-batch-record"
          element={<MaintenanceBatchRecord />}
        />
        <Route path="dispatch-cocoon" element={<DispatchOfCocoons />} />
        <Route path="rearing-dfls" element={<RearingofDfls />} />
        <Route
          path="preservation-cocoon"
          element={<PreservationSeedCocoons />}
        />
        <Route path="preparation-eggs" element={<PreparationofEggs />} />
        <Route path="maintenance-eggs" element={<MaintenanceOfEggs />} />
        <Route path="cold-storage" element={<ColdStorageSchedule />} />
        <Route path="sale-dfl" element={<SaleDisposalDfl />} />
        <Route path="testing-moth" element={<TestingOfMoth />} />
        <Route path="pierced-Cocoons" element={<MaintenancePiercedCocoons />} />
        <Route path="sale-Cocoons" element={<SaleOfPiercedCocoons />} />
        <Route path="maintenance-sheets" element={<MaintenanceEggSheets />} />
        <Route path="remittance" element={<Remittance />} />*/}

            {/* Chawki Management */}
            <Route path="sale-chawki-worms" element={<SaleChawkiWorms />} />
            <Route
              path="sale-chawki-worms-list"
              element={<SaleChawkiWormsList />}
            />
            <Route
              path="sale-chawki-worms-view/:id"
              element={<SaleChawkiWormsView />}
            />
            <Route path="chawki-management" element={<ChawkiManagement />} />

            <Route
              path="chawki-management-edit/:id"
              element={<ChawkiManagementEdit />}
            />

            {/* Inspection */}
            <Route
              path="track-current-status"
              element={<TrackingCurrentStatus />}
            />
            <Route
              path="inspect-supply-disinfectants"
              element={<SupplyOfDisinfectantsInspection />}
            />
            <Route
              path="implementation-mgnrega"
              element={<ImplementationOfMgnrega />}
            />

            {/* Target Setting */}
            <Route
              path="attribute-assigning"
              element={<AttributesAssigning />}
            />

            {/* Training */}
            <Route
              path="attribute-undertaking-training"
              element={<AttributeUndertakingTraining />}
            />
            <Route
              path="attribute-foundation-courses"
              element={<AttributeFoundationCourses />}
            />

            {/* Helpdesk */}
            <Route path="raise-ticket" element={<RaiseTicket />} />
            <Route path="helpdesk-dashboard" element={<HelpdeskDashboard />} />
            <Route path="user-dashboard" element={<UserDashboard />} />
            <Route path="my-tickets" element={<MyTickets />} />
            <Route path="my-tickets/:id" element={<ViewMyTicket />} />
            <Route path="help-desk" element={<HelpDesk />} />
            <Route path="help-desk-faq-view" element={<HelpDeskFaqView />} />

            {/* Garden Management */}

            <Route path="seed-cutting-bank" element={<SeedCuttingBank />} />
            <Route path="seed-cutting-bank-list" element={<SeedCuttingBankList />} />
            <Route path="seed-cutting-bank-view/:id" element={<SeedCuttingBankView />} />
            <Route path="seed-cutting-bank-edit/:id" element={<SeedCuttingBankEdit />} />
            <Route
              path="maintenance-of-mulberry-garden"
              element={<MaintenanceofmulberryGarden />}
            />
            <Route path="maintenance-of-mulberry-garden-list" element={<MaintenanceOfMulberryGardenList />} />
            <Route path="maintenance-of-mulberry-garden-view/:id" element={<MaintenanceOfMulberryGardenView />} />
            <Route path="maintenance-of-mulberry-garden-edit/:id" element={<MaintenanceOfMulberryGardenEdit />} />
            <Route
              path="receipt-of-dfls"
              element={<ReceiptofDFLsfromthegrainage />}
            />
            <Route path="receipt-of-dfls-list" element={<ReceiptOfDFLsList />} />
            <Route path="receipt-of-dfls-view/:id" element={<ReceiptOfDFLsView />} />
            <Route path="receipt-of-dfls-edit/:id" element={<ReceiptOfDFLsEdit />} />

            <Route path="rearing-of-dfls" element={<RearingofDFLs />} />
            <Route path="rearing-of-dfls-list" element={<RearingOfDFLsList />} />
            <Route path="rearing-of-dfls-view/:id" element={<RearingOfDFLsView />} />
            <Route path="rearing-of-dfls-edit/:id" element={<RearingOfDFLsEdit />} />
            <Route
              path="Supply-of-Cocoons-to-Grainagee"
              element={<SupplyofCocoonstoGrainage />}
            />
            <Route
              path="Maintenance-and-Sale-of-Nursery-to-Farmers"
              element={<MaintenanceandSaleofNurserytoFarmers />}
            />
            <Route
              path="Chawki-distribution-to-Farmers"
              element={<ChawkidistributiontoFarmers />}
            />

              <Route
          path="SupplyofCocoonstoGrainage-edit/:id"
          element={<SupplyofCocoonstoGrainageEdit />}
        /> 

          <Route
          path="MaintenanceandSaleofNurserytoFarmers-edit/:id"
          element={<MaintenanceandSaleofNurserytoFarmersEdit />}
        /> 

         <Route
          path="ChawkidistributiontoFarmers-edit/:id"
          element={<ChawkidistributiontoFarmersEdit />}
        /> 

            {/* Master */}
            <Route path="head-of-account" element={<HeadOfAccount />} />
            <Route path="caste" element={<Caste />} />
            <Route path="caste-list" element={<CasteList />} />
            <Route path="caste-view/:id" element={<CasteView />} />
            <Route path="caste-edit/:id" element={<CasteEdit />} />
            {/*<Route path="ChawkiManagementEdit/:id" element={<ChawkiManagementEdit />} />*/}
            <Route path="roles" element={<Roles />} />
            <Route path="roles-list" element={<RolesList />} />
            <Route path="roles-view/:id" element={<RolesView />} />
            <Route path="roles-edit/:id" element={<RolesEdit />} />
            <Route path="configure-subsidy" element={<ConfigureSubsidy />} />
            <Route path="scheme" element={<Scheme />} />
            <Route path="sub-scheme" element={<SubScheme />} />
            <Route path="education" element={<Education />} />
            <Route path="education-list" element={<EducationList />} />
            <Route path="education-view/:id" element={<EducationView />} />
            <Route path="education-edit/:id" element={<EducationEdit />} />
            <Route path="relationship" element={<Relationship />} />
            <Route path="relationship-list" element={<RelationshipList />} />
            <Route
              path="relationship-view/:id"
              element={<RelationshipView />}
            />
            <Route
              path="relationship-edit/:id"
              element={<RelationshipEdit />}
            />
            <Route path="state" element={<State />} />
            <Route path="state-list" element={<StateList />} />
            <Route path="state-view/:id" element={<StateView />} />
            <Route path="state-edit/:id" element={<StateEdit />} />
            <Route path="district" element={<District />} />
            <Route path="district-list" element={<DistrictList />} />
            <Route path="district-view/:id" element={<DistrictView />} />
            <Route path="district-edit/:id" element={<DistrictEdit />} />
            <Route path="taluk" element={<Taluk />} />
            <Route path="taluk-list" element={<TalukList />} />
            <Route path="taluk-view/:id" element={<TalukView />} />
            <Route path="taluk-edit/:id" element={<TalukEdit />} />
            <Route path="hobli" element={<Hobli />} />
            <Route path="hobli-list" element={<HobliList />} />
            <Route path="hobli-view/:id" element={<HobliView />} />
            <Route path="hobli-edit/:id" element={<HobliEdit />} />
            <Route path="village" element={<Village />} />
            <Route path="village-list" element={<VillageList />} />
            <Route path="village-view/:id" element={<VillageView />} />
            <Route path="village-edit/:id" element={<VillageEdit />} />
            <Route path="land-category" element={<LandCategory />} />
            <Route path="land-category-list" element={<LandCategoryList />} />
            <Route
              path="land-category-view/:id"
              element={<LandCategoryView />}
            />
            <Route
              path="land-category-edit/:id"
              element={<LandCategoryEdit />}
            />
            <Route path="irrigation-source" element={<IrrigationSource />} />
            <Route
              path="irrigation-source-list"
              element={<IrrigationSourceList />}
            />
            <Route
              path="irrigation-source-view/:id"
              element={<IrrigationSourceView />}
            />
            <Route
              path="irrigation-source-edit/:id"
              element={<IrrigationSourceEdit />}
            />
            <Route path="irrigation-type" element={<IrrigationType />} />
            <Route
              path="irrigation-type-list"
              element={<IrrigationTypeList />}
            />
            <Route
              path="irrigation-type-view/:id"
              element={<IrrigationTypeView />}
            />
            <Route
              path="irrigation-type-edit/:id"
              element={<IrrigationTypeEdit />}
            />
            <Route path="land-ownership" element={<LandOwnership />} />
            <Route path="land-ownership-list" element={<LandOwnershipList />} />
            <Route
              path="land-ownership-view/:id"
              element={<LandOwnershipView />}
            />
            <Route
              path="land-ownership-edit/:id"
              element={<LandOwnershipEdit />}
            />
            <Route path="soil-type" element={<SoilType />} />
            <Route path="soil-type-list" element={<SoilTypeList />} />
            <Route path="soil-type-view/:id" element={<SoilTypeView />} />
            <Route path="soil-type-edit/:id" element={<SoilTypeEdit />} />
            <Route
              path="rear-house-roof-type"
              element={<RearHouseRoofType />}
            />
            <Route
              path="rear-house-roof-type-list"
              element={<RearHouseRoofTypeList />}
            />
            <Route
              path="rear-house-roof-type-view/:id"
              element={<RearHouseRoofTypeView />}
            />
            <Route
              path="rear-house-roof-type-edit/:id"
              element={<RearHouseRoofTypeEdit />}
            />
            <Route path="silk-worm-variety" element={<SilkWormVariety />} />
            <Route
              path="silk-worm-variety-list"
              element={<SilkWormVarietyList />}
            />
            <Route
              path="silk-worm-variety-view/:id"
              element={<SilkWormVarietyView />}
            />
            <Route
              path="silk-worm-variety-edit/:id"
              element={<SilkWormVarietyEdit />}
            />
            <Route path="source-of-mulberry" element={<SourceOfMulberry />} />
            <Route
              path="source-of-mulberry-list"
              element={<SourceOfMulberryList />}
            />
            <Route
              path="source-of-mulberry-view/:id"
              element={<SourceOfMulberryView />}
            />
            <Route
              path="source-of-mulberry-edit/:id"
              element={<SourceOfMulberryEdit />}
            />
            <Route path="mulberry-variety" element={<MulberryVariety />} />
            <Route
              path="mulberry-variety-list"
              element={<MulberryVarietyList />}
            />
            <Route
              path="mulberry-variety-view/:id"
              element={<MulberryVarietyView />}
            />
            <Route
              path="mulberry-variety-edit/:id"
              element={<MulberryVarietyEdit />}
            />
            <Route path="subsidy-details" element={<SubsidyDetails />} />
            <Route
              path="subsidy-details-list"
              element={<SubsidyDetailsList />}
            />
            <Route
              path="subsidy-details-view/:id"
              element={<SubsidyDetailsView />}
            />
            <Route
              path="subsidy-details-edit/:id"
              element={<SubsidyDetailsEdit />}
            />
            <Route path="plantation-type" element={<PlantationType />} />
            <Route
              path="plantation-type-list"
              element={<PlantationTypeList />}
            />
            <Route
              path="plantation-type-view/:id"
              element={<PlantationTypeView />}
            />
            <Route
              path="plantation-type-edit/:id"
              element={<PlantationTypeEdit />}
            />
            <Route path="machine-type" element={<MachineType />} />
            <Route path="machine-type-list" element={<MachineTypeList />} />
            <Route path="machine-type-view/:id" element={<MachineTypeView />} />
            <Route path="machine-type-edit/:id" element={<MachineTypeEdit />} />
            <Route
              path="reason-lot-cancellation"
              element={<ReasonLotCancellation />}
            />
            <Route
              path="reason-lot-cancellation-list"
              element={<ReasonLotCancellationList />}
            />
            <Route
              path="reason-lot-cancellation-view/:id"
              element={<ReasonLotCancellationView />}
            />
            <Route
              path="reason-lot-cancellation-edit/:id"
              element={<ReasonLotCancellationEdit />}
            />
            <Route
              path="reason-bid-rejection"
              element={<ReasonBidRejection />}
            />
            <Route
              path="reason-bid-rejection-list"
              element={<ReasonBidRejectionList />}
            />
            <Route
              path="reason-bid-rejection-view/:id"
              element={<ReasonBidRejectionView />}
            />
            <Route
              path="reason-bid-rejection-edit/:id"
              element={<ReasonBidRejectionEdit />}
            />
            <Route path="market" element={<Market />} />
            <Route path="market-list" element={<MarketList />} />
            <Route path="market-view/:id" element={<MarketView />} />
            <Route path="market-edit/:id" element={<MarketEdit />} />
            <Route path="godawn" element={<Godawn />} />
            <Route path="godawn-list" element={<GodawnList />} />
            <Route path="godawn-view/:id" element={<GodawnView />} />
            <Route path="godawn-edit/:id" element={<GodawnEdit />} />
            <Route path="bin" element={<Bin />} />
            <Route path="bin-list" element={<BinList />} />
            <Route path="bin-view/:id" element={<BinView />} />
            <Route path="external-unit-type" element={<ExternalUnitType />} />
            <Route
              path="external-unit-type-list"
              element={<ExternalUnitTypeList />}
            />
            <Route
              path="external-unit-type-view/:id"
              element={<ExternalUnitTypeView />}
            />
            <Route
              path="external-unit-type-edit/:id"
              element={<ExternalUnitTypeEdit />}
            />
            <Route path="trader-type" element={<TraderType />} />
            <Route path="trader-type-list" element={<TraderTypeList />} />
            <Route path="trader-type-view/:id" element={<TraderTypeView />} />
            <Route path="trader-type-edit/:id" element={<TraderTypeEdit />} />
            <Route path="race" element={<Race />} />
            <Route path="race-list" element={<RaceList />} />
            <Route path="race-view/:id" element={<RaceView />} />
            <Route path="race-edit/:id" element={<RaceEdit />} />
            <Route path="source" element={<Source />} />
            <Route path="source-list" element={<SourceList />} />
            <Route path="source-view/:id" element={<SourceView />} />
            <Route path="source-edit/:id" element={<SourceEdit />} />
            <Route path="sc-program" element={<ScProgram />} />
            <Route path="sc-program-list" element={<ScProgramList />} />
            <Route path="sc-program-view/:id" element={<ScProgramView />} />
            <Route path="sc-program-edit/:id" element={<ScProgramEdit />} />
            <Route path="sc-component" element={<ScComponent />} />
            <Route path="sc-component-list" element={<ScComponentList />} />
            <Route path="sc-component-view/:id" element={<ScComponentView />} />
            <Route path="sc-component-edit/:id" element={<ScComponentEdit />} />
            <Route path="sc-head-account" element={<ScHeadAccount />} />
            <Route
              path="sc-head-account-list"
              element={<ScHeadAccountList />}
            />
            <Route
              path="sc-head-account-view/:id"
              element={<ScHeadAccountView />}
            />
            <Route
              path="sc-head-account-edit/:id"
              element={<ScHeadAccountEdit />}
            />
            <Route path="empanelled-vendor" element={<EmpanelledVendor />} />
            <Route
              path="empanelled-vendor-list"
              element={<EmpanelledVendorList />}
            />
            <Route
              path="empanelled-vendor-view/:id"
              element={<EmpanelledVendorView />}
            />
            <Route
              path="empanelled-vendor-edit/:id"
              element={<EmpanelledVendorEdit />}
            />
            <Route
              path="reeler-device-mapping"
              element={<ReelerDeviceMapping />}
            />
            <Route path="accept-bid" element={<AcceptBid />} />
            <Route path="user" element={<User />} />
            <Route path="users-list" element={<UsersList />} />
            <Route path="users-view/:id" element={<UsersView />} />
            <Route path="users-edit/:id" element={<UsersEdit />} />
            <Route path="designation" element={<Designation />} />
            <Route path="designation-list" element={<DesignationList />} />
            <Route path="designation-view/:id" element={<DesignationView />} />
            <Route path="designation-edit/:id" element={<DesignationEdit />} />
            <Route path="farmer-type" element={<FarmerType />} />
            <Route path="farmer-type-list" element={<FarmerTypeList />} />
            <Route path="farmer-type-view/:id" element={<FarmerTypeView />} />
            <Route path="farmer-type-edit/:id" element={<FarmerTypeEdit />} />
            <Route path="document" element={<Document />} />
            <Route path="documents-list" element={<DocumentList />} />
            <Route path="documents-edit/:id" element={<DocumentsEdit />} />
            <Route path="documents-view/:id" element={<DocumentsView />} />
            <Route path="market-type" element={<MarketType />} />
            <Route path="market-type-list" element={<MarketTypeList />} />
            <Route path="market-type-view/:id" element={<MarketTypeView />} />
            <Route path="market-type-edit/:id" element={<MarketTypeEdit />} />
            <Route path="crate" element={<Crate />} />
            <Route path="crate-list" element={<CrateList />} />
            <Route path="crate-view/:id" element={<CrateView />} />
            <Route path="crate-edit/:id" element={<CrateEdit />} />
            <Route path="updateBinStatus" element={<UpdateBin />} />
            <Route
              path="working-institution"
              element={<WorkingInstitution />}
            />
            <Route
              path="workingInstitutions-list"
              element={<WorkingInstitutionList />}
            />
            <Route
              path="workingInstitutions-edit/:id"
              element={<WorkingInstitutionEdit />}
            />
            <Route
              path="workingInstitutions-view/:id"
              element={<WorkingInstitutionView />}
            />
            <Route path="trainingProgram" element={<TrainingProgram />} />
            <Route
              path="trainingPrograms-list"
              element={<TrainingProgramList />}
            />
            <Route
              path="trainingPrograms-edit/:id"
              element={<TrainingProgramEdit />}
            />
            <Route
              path="trainingPrograms-view/:id"
              element={<TrainingProgramView />}
            />
            <Route path="trainingCourse" element={<TrainingCourse />} />
            <Route
              path="trainingCourses-list"
              element={<TrainingCourseList />}
            />
            <Route
              path="trainingCourses-edit/:id"
              element={<TrainingCourseEdit />}
            />
            <Route
              path="trainingCourses-view/:id"
              element={<TrainingCourseView />}
            />
            <Route path="reeler-type" element={<ReelerType />} />
            <Route path="reeler-type-list" element={<ReelerTypeList />} />
            <Route path="reeler-type-edit/:id" element={<ReelerTypeEdit />} />
            <Route path="reeler-type-view/:id" element={<ReelerTypeView />} />
            <Route path="race-mapping" element={<RaceMapping />} />
            <Route path="race-mapping-list" element={<RaceMappingList />} />
            <Route path="race-mapping-edit/:id" element={<RaceMappingEdit />} />
            <Route path="race-mapping-view/:id" element={<RaceMappingView />} />
            <Route path="training-group" element={<TrainingGroup />} />
            <Route path="training-group-list" element={<TrainingGroupList />} />
            <Route
              path="training-group-edit/:id"
              element={<TrainingGroupEdit />}
            />
            <Route
              path="training-group-view/:id"
              element={<TrainingGroupView />}
            />
            <Route
              path="training-institution"
              element={<TrainingInstitution />}
            />
            <Route
              path="training-institution-list"
              element={<TrainingInstitutionList />}
            />
            <Route
              path="training-institution-edit/:id"
              element={<TrainingInstitutionEdit />}
            />
            <Route
              path="training-institution-view/:id"
              element={<TrainingInstitutionView />}
            />
            <Route path="training-mode" element={<TrainingMode />} />
            <Route path="training-mode-list" element={<TrainingModeList />} />
            <Route
              path="training-mode-edit/:id"
              element={<TrainingModeEdit />}
            />
            <Route
              path="training-mode-view/:id"
              element={<TrainingModeView />}
            />
            <Route path="training-office" element={<TrainingOffice />} />
            <Route
              path="training-office-list"
              element={<TrainingOfficeList />}
            />
            <Route
              path="training-office-edit/:id"
              element={<TrainingOfficeEdit />}
            />
            <Route
              path="training-office-view/:id"
              element={<TrainingOfficeView />}
            />
            <Route
              path="deputed-institute"
              element={<TrainingDeputedInstitute />}
            />
            <Route
              path="deputed-institute-list"
              element={<TrainingDeputedInstituteList />}
            />
            <Route
              path="deputed-institute-edit/:id"
              element={<TrainingDeputedInstituteEdit />}
            />
            <Route
              path="deputed-institute-view/:id"
              element={<TrainingDeputedInstituteView />}
            />
            <Route path="hd-module" element={<HelpDeskModule />} />
            <Route path="hd-module-list" element={<HelpDeskModuleList />} />
            <Route path="hd-module-edit/:id" element={<HelpDeskModuleEdit />} />
            <Route path="hd-module-view/:id" element={<HelpDeskModuleView />} />
            <Route path="hd-feature" element={<HelpDeskFeature />} />
            <Route path="hd-feature-list" element={<HelpDeskFeatureList />} />
            <Route
              path="hd-feature-edit/:id"
              element={<HelpDeskFeatureEdit />}
            />
            <Route
              path="hd-feature-view/:id"
              element={<HelpDeskFeatureView />}
            />
            <Route
              path="hd-board-category"
              element={<HelpDeskBoardCategory />}
            />
            <Route
              path="hd-board-category-list"
              element={<HelpDeskBoardCategoryList />}
            />
            <Route
              path="hd-board-category-edit/:id"
              element={<HelpDeskBoardCategoryEdit />}
            />
            <Route
              path="hd-board-category-view/:id"
              element={<HelpDeskBoardCategoryView />}
            />
            <Route path="hd-category" element={<HelpDeskCategory />} />
            <Route path="hd-category-list" element={<HelpDeskCategoryList />} />
            <Route
              path="hd-category-edit/:id"
              element={<HelpDeskCategoryEdit />}
            />
            <Route
              path="hd-category-view/:id"
              element={<HelpDeskCategoryView />}
            />
            <Route path="hd-sub-category" element={<HelpDeskSubCategory />} />
            <Route
              path="hd-sub-category-list"
              element={<HelpDeskSubCategoryList />}
            />
            <Route
              path="hd-sub-category-edit/:id"
              element={<HelpDeskSubCategoryEdit />}
            />
            <Route
              path="hd-sub-category-view/:id"
              element={<HelpDeskSubCategoryView />}
            />
            <Route path="hd-status" element={<HelpDeskStatus />} />
            <Route path="hd-status-list" element={<HelpDeskStatusList />} />
            <Route path="hd-status-edit/:id" element={<HelpDeskStatusEdit />} />
            <Route path="hd-status-view/:id" element={<HelpDeskStatusView />} />
            <Route path="hd-severity" element={<HelpDeskSeverity />} />
            <Route path="hd-severity-list" element={<HelpDeskSeverityList />} />
            <Route
              path="hd-severity-edit/:id"
              element={<HelpDeskSeverityEdit />}
            />
            <Route
              path="hd-severity-view/:id"
              element={<HelpDeskSeverityView />}
            />
            <Route path="hd-question" element={<HelpDeskFaq />} />
            <Route path="hd-question-edit/:id" element={<HelpDeskFaqEdit />} />
            <Route path="hd-question-list" element={<HelpDeskFaqList />} />

            {/* Direct Benefit Transfer */}
            <Route
              path="subsidy-approval-verification"
              element={<SubsidyApprovalVerification />}
            />
            <Route path="subsidy-sanction" element={<SubsidySanction />} />
            <Route path="subsidy-drawing" element={<SubsidyDrawing />} />
            <Route
              path="subsidy-counter-sign"
              element={<SubsidyCounterSigning />}
            />

            {/* Market and Auction */}
            <Route path="bidding-slip" element={<BiddingSlip />} />
            <Route path="reject-lot" element={<RejectLot />} />
            <Route path="reject-bid" element={<RejectBid />} />
            <Route path="payment" element={<Payment />} />
            <Route path="ready-for-payment" element={<ReadyForPayment />} />
            <Route path="bank-statement" element={<BankStatement />} />
            <Route path="bulk-send-to-bank" element={<BulkSendToBank />} />
            <Route path="ifsc-update" element={<IfscUpdate />} />
            <Route
              path="reject-farmer-auction"
              element={<RejectFarmerAuction />}
            />
            <Route
              path="generate-bidding-slip"
              element={<GenerateBiddingSlip />}
            />
            <Route path="weighment" element={<Weighment />} />
            <Route path="update-lot-weight" element={<UpdateLotWeight />} />
            <Route
              path="accept-former-auction"
              element={<AcceptFarmerAuction />}
            />
            <Route path="gatepass" element={<Gatepass />} />

            {/* Admin and Reports */}
            <Route path="report-admin" element={<ReportsAdmin />} />
            <Route
              path="reeler-transaction-report"
              element={<ReelerTransactionReport />}
            />
            <Route path="bid-dashboard" element={<BidDashboard />} />

            {/* Dashboard */}
            <Route path="alerts-dashboard" element={<AlertsDashboard />} />

            {/* Role Config */}
            <Route path="role-config" element={<RoleConfig />} />

            {/* Role Pages */}
            <Route path="role-pages" element={<RolePages />} />
            <Route path="activate-reeler" element={<ReelerActivate />} />

            {/* Flex Time  */}
            <Route path="flex-time" element={<FlexTime />} />

            {/* Print Bidding Slip */}
            <Route path="print-bid-slip" element={<PrintBidSlip />} />

            {/* Change Password */}
            <Route path="change-password" element={<ChangePassword />} />

            {/* Reports */}
            <Route path="pending-reports" element={<PendingReport />} />
            <Route path="unit-counter-report" element={<UnitCounterReport />} />
            <Route
              path="farmer-transaction-report"
              element={<FarmerTransactionReport />}
            />
            <Route
              path="reeler-transaction-reports"
              element={<ReelerTransactionReports />}
            />
            <Route path="bidding-report" element={<BiddingReport />} />
            <Route
              path="bidding-report-reeler"
              element={<BiddingReportReeler />}
            />
            <Route path="dtr-online" element={<DtrOnlineReport />} />
            <Route path="dtr-all" element={<DtrAll />} />
            <Route path="form-13-dtr" element={<Form13Dtr />} />
            <Route path="form-13-dtr-bv" element={<Form13DtrBv />} />
            <Route path="form-13-dtr-ab" element={<Form13DtrAbstract />} />
            <Route path="reeler-mf" element={<ReelerMfReport />} />
            <Route path="unit-mf" element={<UnitMf />} />
            <Route path="reeler-abstract" element={<ReelerAbstract />} />
            <Route path="reeler-purchase" element={<ReelerPurchase />} />
            {/* <Route path="reeler-purchase" element={<ReelerPurchase />} /> */}
            <Route
              path="district-wise-abstract"
              element={<DistrictWiseAbstractReport />}
            />

            {/* Display All Lot */}
            <Route path="display-all-lot" element={<DisplayAllLot />} />

            {/* Market Exception Time */}
            <Route
              path="market-exception-time"
              element={<MarketExceptionTime />}
            />

            <Route path="test1" element={<Test1 />} />
          </>
        )}
      </Routes>
    </ScrollToTop>
  );
}

export default Router;
