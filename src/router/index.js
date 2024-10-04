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
import ServiceApplication from "../pages/services-module/application/serviceApplication";
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
import ChawkiManagementList from "../pages/chawki-management/ChawkiManagementList";
import ChawkiManagementView from "../pages/chawki-management/ChawkiManagementView";
import RaiseTicketView from "../pages/helpdesk/RaiseTicketViewPage";
import UserTicketView from "../pages/helpdesk/UserTicketViewPage";
import ChawkidistributiontoFarmersList from "../pages/garden-management/ChawkidistributiontoFarmersList";
import ChawkidistributiontoFarmersView from "../pages/garden-management/ChawkidistributiontoFarmersView";
import MaintenanceOfMulberryGardenUpdate from "../pages/garden-management/MaintenanceOfMulberryGardenUpdate";
import MaintenanceOfMulberryGardenAlert from "../pages/garden-management/MaintenanceOfMulberryGardenAlert";
import SupplyOfCocoonsToGrainageList from "../pages/garden-management/SupplyOfCocoonsToGrainageList";
import SupplyOfCocoonsToGrainageView from "../pages/garden-management/SupplyOfCocoonsToGrainageView";
import MaintenanceAndSaleOfNurseryToFarmersView from "../pages/garden-management/MaintenanceAndSaleOfNurseryToFarmersView";
import MaintenanceandSaleofNurserytoFarmersList from "../pages/garden-management/MaintenanceAndSaleOfNurseryToFarmersList";
import LineName from "../pages/masters/line-name/LineName";
import LineNameList from "../pages/masters/line-name/lineNameList";
import LineNameView from "../pages/masters/line-name/LineNameView";
import LineNameEdit from "../pages/masters/line-name/LineNameEdit";
import Disinfectant from "../pages/masters/disinfectant/Disinfectant";
import DisinfectantList from "../pages/masters/disinfectant/DisinfectantList";
import DisinfectantView from "../pages/masters/disinfectant/DisinfectantView";
import DisinfectantEdit from "../pages/masters/disinfectant/DisinfectantEdit";
import Grainage from "../pages/masters/grainage/Grainage";
import GrainageList from "../pages/masters/grainage/GrainageList";
import GrainageView from "../pages/masters/grainage/GrainageView";
import GrainageEdit from "../pages/masters/grainage/GrainageEdit";
import GenerationNumber from "../pages/masters/generation-number/GenerationNumber";
import GenerationNumberList from "../pages/masters/generation-number/GenerationNumberList";
import GenerationNumberView from "../pages/masters/generation-number/GenerationNumberView";
import GenerationNumberEdit from "../pages/masters/generation-number/GenerationNumberEdit";
import Farm from "../pages/masters/farm/Farm";
import FarmList from "../pages/masters/farm/FarmList";
import FarmView from "../pages/masters/farm/FarmView";
import FarmEdit from "../pages/masters/farm/FarmEdit";
import TraineeAttendancePage from "../pages/training-schedule/TraineeAttendancePage";

import OtherStateFarmer from "../pages/stake-holder/OtherStateFarmer";
import ActivateExternalUnit from "../pages/stake-holder/external-units/ActivateExternalUnit";
import FarmerWithoutFruits from "../pages/stake-holder/FarmerWithoutFruits";
import ConfigFarmerAllow from "../pages/masters/config-farmer-allow/ConfigFarmerAllow";
import OtherStateFarmerList from "../pages/stake-holder/OtherStateFarmerList";
import FarmerWithoutFruitsList from "../pages/stake-holder/FarmerWithoutFruitsList";
import HomePage from "../pages/stake-holder/HomePage";
import Tsc from "../pages/masters/tsc/TscMaster";
import TscList from "../pages/masters/tsc/TscMasterList";
import TscEdit from "../pages/masters/tsc/TscMasterEdit";
import TscView from "../pages/masters/tsc/TscView";
import ScCategory from "../pages/masters/sc-category/ScCategory";
import ScCategoryList from "../pages/masters/sc-category/ScCategoryList";
import ScCategoryView from "../pages/masters/sc-category/ScCategoryView";
import ScCategoryEdit from "../pages/masters/sc-category/ScCategoryEdit";
import DashboardReport from "../pages/reports-admin/market-auction/DashboardReport";
import ScProgramAccountMapping from "../pages/masters/sc-program-account-mapping/ScProgramAccountMapping";
import ScProgramAccountMappingList from "../pages/masters/sc-program-account-mapping/ScProgramAccountMappingList";
import ScProgramAccountMappingEdit from "../pages/masters/sc-program-account-mapping/ScProgramAccountMappingEdit";
import ScProgramAccountMappingView from "../pages/masters/sc-program-account-mapping/ScProgramAccountMappingView";
import ScApprovalStage from "../pages/masters/sc-approval-stage/ScApprovalStage";
import ScApprovalStageList from "../pages/masters/sc-approval-stage/ScApprovalStageList";
import ScApprovalStageView from "../pages/masters/sc-approval-stage/ScApprovalStageView";
import EditScApprovalStage from "../pages/masters/sc-approval-stage/EditScApprovalStage";
import ScProgramApprovalMapping from "../pages/masters/sc-program-approval-mapping/ScProgramApprovalMapping";
import ScProgramApprovalMappingList from "../pages/masters/sc-program-approval-mapping/ScProgramApprovalMappingList";
import ScProgramApprovalMappingView from "../pages/masters/sc-program-approval-mapping/ScProgramApprovalMappingView";
import ScProgramApprovalMappingEdit from "../pages/masters/sc-program-approval-mapping/EditScApprovalMapping";
import ReelerPendingReport from "../pages/reports-admin/market-auction/ReelerPendingReport";
import ReelerInitialAmount from "../pages/market-and-auction/ReelerInitialAmount";
import Bank from "../pages/masters/bank/Bank";
import BankList from "../pages/masters/bank/BankList";
import BankView from "../pages/masters/bank/BankView";
import BankEdit from "../pages/masters/bank/BankEdit";
import PrintFarmerCopy from "../pages/market-and-auction/PrintFarmerCopy";
import MaintenanceofMulberryfarmList from "../pages/seed-and-dfl-managment/MaintenanceofMulberryfarmList";
import ReceiptofDFLsfromtheP4grainageList from "../pages/seed-and-dfl-managment/ReceiptofDFLsfromtheP4grainageList";
import MaintenanceofLineRecordsforEachRaceList from "../pages/seed-and-dfl-managment/MaintenanceofLineRecordsforEachRaceList";
import MaintenanceofScreeningBatchRecordsList from "../pages/seed-and-dfl-managment/MaintenanceofScreeningBatchRecordsList";
import DispatchofCocoonstoP4GrainageList from "../pages/seed-and-dfl-managment/DispatchofCocoonstoP4GrainageList";
import RearingofDFLsforthe8LinesList from "../pages/seed-and-dfl-managment/RearingofDFLsforthe8LinesList";
import PreservationofseedcocoonforprocessingList from "../pages/seed-and-dfl-managment/PreservationofseedcocoonforprocessingList";
import PreparationofeggsDFLsList from "../pages/seed-and-dfl-managment/PreparationofeggsDFLsList";
import MaintenanceofeggsatcoldstorageList from "../pages/seed-and-dfl-managment/MaintenanceofeggsatcoldstorageList";
import ColdStorageScheduleBVList from "../pages/seed-and-dfl-managment/ColdStorageScheduleBVList";
import SaleDisposalofDFLseggs from "../pages/seed-and-dfl-managment/SaleDisposalofDFLseggs";
import SaleDisposalofDFLseggsList from "../pages/seed-and-dfl-managment/SaleDisposalofDFLseggsList";
import TestingOfMoth from "../pages/seed-and-dfl-managment/TestingOfMoth";
import TestingOfMothList from "../pages/seed-and-dfl-managment/TestingOfMothList";
import EditTestingOfMoth from "../pages/seed-and-dfl-managment/EditTestingOfMoth";
import TestingOfMothView from "../pages/seed-and-dfl-managment/TestingOfMothView";
import EscalationDashboard from "../pages/helpdesk/EscalationDashboard";
import EscalationView from "../pages/helpdesk/EscalationView";
import SaleDisposalOfPiercedCocoons from "../pages/seed-and-dfl-managment/SaleDisposalOfPiercedCocoons";
import SaleDisposalOfPiercedCocoonsList from "../pages/seed-and-dfl-managment/SaleDisposalOfPiercedCocoonsList";
import SaleDisposalOfPiercedCocoonsView from "../pages/seed-and-dfl-managment/SaleDisposalOfPiercedCocoonsView";
import SaleDisposalOfPiercedCocoonsEdit from "../pages/seed-and-dfl-managment/SaleDisposalOfPiercedCocoonsEdit";
import MaintenanceOfPiercedCocoons from "../pages/seed-and-dfl-managment/MaintenanceOfPiercedCocoons";
import MaintenanceOfPiercedCocoonsList from "../pages/seed-and-dfl-managment/MaintenanceOfPiercedCocoonsList";
import EditMaintenanceOfPiercedCocoons from "../pages/seed-and-dfl-managment/EditMaintenanceOfPiercedCocoons";
import MaintenanceOfPiercedCocoonsView from "../pages/seed-and-dfl-managment/MaintenanceOfPiercedCocoonsView";
import MaintenanceOfEggLayingSheetsView from "../pages/seed-and-dfl-managment/MaintenanceOfEggLayingSheetsView";
import EditMaintenanceOfEggLayingSheets from "../pages/seed-and-dfl-managment/EditMaintenanceOfEggLayingSheets";
import MaintenanceOfEggLayingSheetsList from "../pages/seed-and-dfl-managment/MaintenanceOfEggLayingSheetsList";
import MaintenanceOfEggLayingSheets from "../pages/seed-and-dfl-managment/MaintenanceOfEggLayingSheets";
import Remittance from "../pages/seed-and-dfl-managment/Remittance";
import RemittanceList from "../pages/seed-and-dfl-managment/RemittanceList";
import RemittanceEdit from "../pages/seed-and-dfl-managment/RemittanceEdit";
import RemittanceView from "../pages/seed-and-dfl-managment/RemittanceView";
import MaintenanceOfEggsAtColdStorageEdit from "../pages/seed-and-dfl-managment/MaintenanceOfEggsAtColdStorageEdit";
import MaintenanceOfEggsAtColdStorageView from "../pages/seed-and-dfl-managment/MaintenanceOfEggAtColdStorageView";
import MaintenanceOfEggsAtCold from "../pages/seed-and-dfl-managment/MaintenanceOfEggsAtCold";
import MaintenanceOfEggsAtColdList from "../pages/seed-and-dfl-managment/MaintenanceOfEggsAtColdList";
import MaintenanceOfEggsAtColdEdit from "../pages/seed-and-dfl-managment/MaintenanceOfEggsAtColdEdit";
import MaintenanceOfEggsAtColdView from "../pages/seed-and-dfl-managment/MaintenanceOfEggsAtColdView";
import RegisteredSeedProducerNssoGrainages from "../pages/seed-and-dfl-managment/RegisteredSeedProducerNssoGrainages";
import RegisteredSeedProducerNssoGrainagesList from "../pages/seed-and-dfl-managment/RegisteredSeedProducerNssoGrainagesList";
import RegisteredSeedProducerNssoGrainagesEdit from "../pages/seed-and-dfl-managment/RegisteredSeedProducerNssoGrainagesEdit";
import RegisteredSeedProducerNssoGrainagesView from "../pages/seed-and-dfl-managment/RegisteredSeedProducerNssoGrainagesView";
import SaleAndDisposalOfEggsNSSO from "../pages/seed-and-dfl-managment/SaleAndDisposalOfEggsNSSO";
import SaleAndDisposalOfEggsNSSOList from "../pages/seed-and-dfl-managment/SaleAndDisposalOfEggsNSSOList";
import SaleAndDisposalOfEggsNSSOView from "../pages/seed-and-dfl-managment/SaleAndDisposalOfEggsNSSOView";
import SaleAndDisposalOfEggsNSSOEdit from "../pages/seed-and-dfl-managment/SaleAndDisposalOfEggsNSSOEdit";
import WormStage from "../pages/masters/worm-stage/WormStage";
import WormStageList from "../pages/masters/worm-stage/WormStageList";
import WormStageView from "../pages/masters/worm-stage/WormStageView";
import WormStageEdit from "../pages/masters/worm-stage/WormStageEdit";
import MaintenanceofMulberryfarmView from "../pages/seed-and-dfl-managment/MaintenanceofMulberryfarmView";
import MaintenanceofMulberryfarmUpdate from "../pages/seed-and-dfl-managment/MaintenanceofMulberryfarmUpdate";
import MaintenanceofMulberryfarmEdit from "../pages/seed-and-dfl-managment/MaintenanceofMulberryfarmEdit";
import MaintenanceofMulberryfarmAlert from "../pages/seed-and-dfl-managment/MaintenanceofMulberryfarmAlert";
import SaleDisposalofDFLseggsView from "../pages/seed-and-dfl-managment/SaleDisposalofDFLseggsView";
import SaleDisposalofDFLseggsEdit from "../pages/seed-and-dfl-managment/SaleDisposalofDFLseggsEdit";
import DispatchofCocoonstoP4GrainageEdit from "../pages/seed-and-dfl-managment/DispatchOfCocoonsToP4GrainageEdit";
import DispatchofCocoonstoP4GrainageView from "../pages/seed-and-dfl-managment/DispatchOfCocoonsToP4GrainageView";
import RearingOfDFLsForThe8LinesEdit from "../pages/seed-and-dfl-managment/RearingOfDFLsForThe8LinesEdit";
import RearingOfDFLsForThe8LinesView from "../pages/seed-and-dfl-managment/RearingOfDFLsForThe8LinesView";
import MaintenanceOfLineRecordForEachRaceView from "../pages/seed-and-dfl-managment/MaintenanceOfLineRecordForEachRaceView";
import MaintenanceOfLineRecordsForEachRaceEdit from "../pages/seed-and-dfl-managment/MaintenanceOfLineRecordsForEachRaceEdit";
import ReceiptOfDFLsFromTheP4GrainageEdit from "../pages/seed-and-dfl-managment/ReceiptOfDFLsFromTheP4GrainageEdit";
import MaintenanceofScreeningBatchRecordsEdit from "../pages/seed-and-dfl-managment/MaintenanceofScreeningBatchRecordsEdit";
import MaintenanceofScreeningBatchRecordsView from "../pages/seed-and-dfl-managment/MaintenanceofScreeningBatchRecordsView";
import PreparationofeggsDFLsEdit from "../pages/seed-and-dfl-managment/PreparationofeggsDFLsEdit";
import PreparationofeggsDFLsView from "../pages/seed-and-dfl-managment/PreparationofeggsDFLsView";
import ColdStorageScheduleBVEdit from "../pages/seed-and-dfl-managment/ColdStorageScheduleBVEdit";
import ColdStorageScheduleBVView from "../pages/seed-and-dfl-managment/ColdStorageScheduleBVView";
import PreservationOfSeedCocoonForProcessingEdit from "../pages/seed-and-dfl-managment/PreservationOfSeedCocoonForProcessingEdit";
import PreservationOfSeedCocoonForProcessingView from "../pages/seed-and-dfl-managment/PreservationOfSeedCocoonForProcessingView";

import ScHeadAccountCategory from "../pages/masters/sc-head-account-category/ScHeadAccountCategory";
import ScHeadAccountCategoryList from "../pages/masters/sc-head-account-category/ScHeadAccountCategoryList";
import ScHeadAccountCategoryView from "../pages/masters/sc-head-account-category/ScHeadAccountCategoryView";
import ScHeadAccountCategoryEdit from "../pages/masters/sc-head-account-category/EditScHeadAccountCategory";
import ScApprovingAuthority from "../pages/masters/sc-approving-authority/ScApproving";
import ScApprovingAuthorityList from "../pages/masters/sc-approving-authority/ScApprovingList";
import ScApprovingAuthorityView from "../pages/masters/sc-approving-authority/ScApprovingView";
import ScApprovingAuthorityEdit from "../pages/masters/sc-approving-authority/EditScApproving";
import ScVendorContact from "../pages/masters/sc-vendor-contact/ScVendorContact";
import ScVendorContactList from "../pages/masters/sc-vendor-contact/ScVendorContactList";
import ScVendorContactView from "../pages/masters/sc-vendor-contact/ScVendorContactView";
import ScVendorContactEdit from "../pages/masters/sc-vendor-contact/EditScVendorContact";
import ScVendorBank from "../pages/masters/sc-vendor-bank/ScVendorBank";
import ScVendorBankList from "../pages/masters/sc-vendor-bank/ScVendorBankList";
import ScVendorBankView from "../pages/masters/sc-vendor-bank/ScVendorBankView";
import ScVendorBankEdit from "../pages/masters/sc-vendor-bank/EditScVendorBank";
import ScVendor from "../pages/masters/sc-vendor/ScVendor";
import ScVendorList from "../pages/masters/sc-vendor/ScVendorList";
import ScVendorView from "../pages/masters/sc-vendor/ScVendorView";
import ScVendorEdit from "../pages/masters/sc-vendor/EditScVendor";
import ScUunitCost from "../pages/masters/sc-unit-cost/ScUnitCost";
import ScUnitCostView from "../pages/masters/sc-unit-cost/ScUnitCostView";
import ScUnitCostEdit from "../pages/masters/sc-unit-cost/EditScUnitCost";
import ScUnitCost from "../pages/masters/sc-unit-cost/ScUnitCost";
import ScUnitCostList from "../pages/masters/sc-unit-cost/ScUnitCostList";
import DivisionMaster from "../pages/masters/division-master/DivisionMaster";
import DivisionMasterList from "../pages/masters/division-master/DivisionMasterList";
import DivisionMasterView from "../pages/masters/division-master/DivisionMasterView";
import DivisionMasterEdit from "../pages/masters/division-master/DivisionMasterEdit";
import ScSchemeDetails from "../pages/masters/sc-scheme-details/ScSchemeDetails";
import ScSchemeDetailsList from "../pages/masters/sc-scheme-details/ScSchemeDetailsList";
import ScSchemeDetailsView from "../pages/masters/sc-scheme-details/ScSchemeDetailsView";
import ScSchemeDetailsEdit from "../pages/masters/sc-scheme-details/ScSchemeDetailsEdit";
import ScSubSchemeDetails from "../pages/masters/sc-sub-scheme-details/ScSubSchemeDetails";
import ScSubSchemeDetailsList from "../pages/masters/sc-sub-scheme-details/ScSubSchemeDetailsList";
import ScSubSchemeDetailsView from "../pages/masters/sc-sub-scheme-details/ScSubSchemeDetailsView";
import ScSubSchemeDetailsEdit from "../pages/masters/sc-sub-scheme-details/ScSubSchemeDetailsEdit";
import FinancialYear from "../pages/masters/financial-year/FinancialYear";
import FinancialYearEdit from "../pages/masters/financial-year/FinancialYearEdit";
import FinancialYearList from "../pages/masters/financial-year/FinancialYearList";
import FinancialYearView from "../pages/masters/financial-year/FinancialYearView";
import FarmType from "../pages/masters/farm-type/FarmType";
import FarmTypeList from "../pages/masters/farm-type/FarmTypeList";
import FarmTypeView from "../pages/masters/farm-type/FarmTypeView";
import FarmTypeEdit from "../pages/masters/farm-type/FarmTypeEdit";
import GrainageType from "../pages/masters/grainage-type/GrainageType";
import GrainageTypeList from "../pages/masters/grainage-type/GrainageTypeList";
import GrainageTypeView from "../pages/masters/grainage-type/GrainageTypeView";
import GrainageTypeEdit from "../pages/masters/grainage-type/GrainageTypeEdit";
import Activity from "../pages/masters/activity/Activity";
import ActivityList from "../pages/masters/activity/ActivityList";
import ActivityView from "../pages/masters/activity/ActivityView";
import ActivityEdit from "../pages/masters/activity/ActivityEdit";
import Budget from "../pages/target-settings/budget/Budget";
import BudgetHoa from "../pages/target-settings/budget-hoa/Budget-Hoa";
import BudgetDistrict from "../pages/target-settings/budget-district/Budget-District";
import BudgetTaluk from "../pages/target-settings/budget-taluk/Budget-Taluk";
import BudgetTsc from "../pages/target-settings/budget-tsc/Budget-Tsc";
import BudgetEdit from "../pages/target-settings/budget/BudgetEdit";
import BudgetList from "../pages/target-settings/budget/BudgetList";
import BudgetHoaEdit from "../pages/target-settings/budget-hoa/Budget-HoaEdit";
import BudgetHoaList from "../pages/target-settings/budget-hoa/Budget-HoaList";
import BudgetView from "../pages/target-settings/budget/BudgetView";
import BudgetHoaView from "../pages/target-settings/budget-hoa/Budget-HoaView";
import BudgetDistrictList from "../pages/target-settings/budget-district/BudgetDistrictList";
import BudgetDistrictView from "../pages/target-settings/budget-district/Budget-DistrictView";
import BudgetDistrictEdit from "../pages/target-settings/budget-district/Budget-DistrictEdit";
import FinancialTargetSettings from "../pages/target-settings/financialtargetsetting/FinancialTargetSetting";
import PhysicalTargetSettingsTsc from "../pages/target-settings/physicaltargetsettingtsc/PhysicalTargetSettingTsc";
import BudgetTalukView from "../pages/target-settings/budget-taluk/Budget-TalukView";
import BudgetTalukEdit from "../pages/target-settings/budget-taluk/Budget-TalukEdit";
import BudgetTalukList from "../pages/target-settings/budget-taluk/Budget-TalukList";
import BudgetTscEdit from "../pages/target-settings/budget-tsc/Budget-TscEdit";
import BudgetTscView from "../pages/target-settings/budget-tsc/Budget-TscView";
import BudgetTscList from "../pages/target-settings/budget-tsc/Budget-TscList";
import FinancialTargetSettingList from "../pages/target-settings/financialtargetsetting/FinancialTargetSettingList";
import FinancialTargetSettingEdit from "../pages/target-settings/financialtargetsetting/FinancialTargetSettingEdit";
import FinancialTargetSettingView from "../pages/target-settings/financialtargetsetting/FinancialTargetSettingView";
import PhysicalTargetSettingsTscView from "../pages/target-settings/physicaltargetsettingtsc/PhysicalTargetSettingsTscView";
import PhysicalTargetSettingsTscList from "../pages/target-settings/physicaltargetsettingtsc/PhysicalTargetSettingsTscList";
import PhysicalTargetSettingsTscEdit from "../pages/target-settings/physicaltargetsettingtsc/PhysicalTargetSettingsTscEdit";
import PhysicalTargetSettingsDistrict from "../pages/target-settings/physicaltargetsettingdistrict/PhysicalTargetSettingsDistrict";
import PhysicalTargetSettingsDistrictEdit from "../pages/target-settings/physicaltargetsettingdistrict/PhysicalTargetSettingsDistrictEdit";
import PhysicalTargetSettingsDistrictList from "../pages/target-settings/physicaltargetsettingdistrict/PhysicalTargetSettingsDistrictList";
import PhysicaltargetSettingsDistrictView from "../pages/target-settings/physicaltargetsettingdistrict/PhysicaltargetSettingsDistrictView";
import ReleaseBudgetDistrict from "../pages/target-settings/release-budget-district/ReleaseBudgetDistrict";
import ReleaseBudgetDistrictView from "../pages/target-settings/release-budget-district/ReleaseBudgetDistrictView";
import ReleaseBudgetDistrictList from "../pages/target-settings/release-budget-district/ReleaseBudgetDistrictList";
import ReleaseBudgetDistrictEdit from "../pages/target-settings/release-budget-district/ReleaseBudgetDistrictEdit";
import ReleaseBudgetTaluk from "../pages/target-settings/release-budget-taluk/ReleaseBudgetTaluk";
import ReleaseBudgetTalukList from "../pages/target-settings/release-budget-taluk/ReleaseBudgetTalukList";
import ReleaseBudgetTalukEdit from "../pages/target-settings/release-budget-taluk/ReleaseBudgetTalukEdit";
import ReleaseBudgetTalukView from "../pages/target-settings/release-budget-taluk/ReleaseBudgetTalukView";
import ReleaseBudgetInstitution from "../pages/target-settings/release-budget-institution/ReleaseBudgetInstitution";
import ReleaseBudgetInstitutionList from "../pages/target-settings/release-budget-institution/ReleaseBudgetInstitutionList";
import ReleaseBudgetInstitutionEdit from "../pages/target-settings/release-budget-institution/ReleaseBudgetInstitutionEdit";
import ReleaseBudgetInstitutionView from "../pages/target-settings/release-budget-institution/ReleaseBudgetInstitutionView";
import PhysicalTargetSettingsTalukList from "../pages/target-settings/physicaltargetsettingstaluk/PhysicalTargetSettingsTalukList";
import PhysicalTargetSettingsTalukEdit from "../pages/target-settings/physicaltargetsettingstaluk/PhysicalTargetSettingsTalukEdit";
import PhysicalTargetSettingsTalukView from "../pages/target-settings/physicaltargetsettingstaluk/PhysicalTargetSettingsTalukView";
import PhysicalTargetSettingsTaluk from "../pages/target-settings/physicaltargetsettingstaluk/PhysicalTargetSettingsTaluk";
import FinancialTargetSettingsDistrictEdit from "../pages/target-settings/financialtargetsettingsdistrict/FinancialTargetSettingsDistrictEdit";
import FinancialTargetSettingsDistrictView from "../pages/target-settings/financialtargetsettingsdistrict/FinancialTargetSettingsDistrictView";
import FinancialTargetSettingsDistrictList from "../pages/target-settings/financialtargetsettingsdistrict/FinancialTargetSettingsList";
import FinancialTargetSettingsDistrict from "../pages/target-settings/financialtargetsettingsdistrict/FinancialTargetSettingsDistrict";
import FinancialTargetSettingsTalukEdit from "../pages/target-settings/financialtargetsettingstaluk/FinancialTargetSettingsTalukEdit";
import FinancialTargetSettingsTalukList from "../pages/target-settings/financialtargetsettingstaluk/FinancialTargetSettingsTalukList";
import FinancialTargetSettingsTaluk from "../pages/target-settings/financialtargetsettingstaluk/FinancialTargetSettingsTaluk";
import FinancialTargetSettingsTalukView from "../pages/target-settings/financialtargetsettingstaluk/FinancialTargetSettingsTalukView";
import FinancialTargetSettingsInstitutionList from "../pages/target-settings/financialtargetsettingsinstitution/FinancialTargetSettingsInstitutionList";
import FinancialTargetSettingsInstitution from "../pages/target-settings/financialtargetsettingsinstitution/FinancialTargetSettingsInstitution";
import FinancialTargetSettingsInstitutionEdit from "../pages/target-settings/financialtargetsettingsinstitution/FinancialTargetSettingsInstitutionEdit";
import FinancialTargetSettingsInstitutionView from "../pages/target-settings/financialtargetsettingsinstitution/FinancialTargetSettingsInstitutionView";
import BudgetExtensionList from "../pages/target-settings/budget-extension/BudgetExtensionList";
import BudgetExtensionEdit from "../pages/target-settings/budget-extension/BudgetExtensionEdit";
import BudgetExtensionView from "../pages/target-settings/budget-extension/BudgetExtensionView";
import BudgetExtension from "../pages/target-settings/budget-extension/BudgetExtension";
import BudgetDashboard from "../pages/target-settings/budget-dashboard/BudgetDashboard";
import InspectionConfig from "../pages/masters/inspection/InspectionConfig";
import RequestInspectionMapping from "../pages/Inspection/request-inspection-mapping/RequestInspectionMapping";
import RequestInspectionMappingEdit from "../pages/Inspection/request-inspection-mapping/RequestInspectionMappingEdit";
import RequestInspectionMappingList from "../pages/Inspection/request-inspection-mapping/RequestInspectionMappingList";
import RequestInspectionMappingView from "../pages/Inspection/request-inspection-mapping/RequestInspectionMappingView";
import BudgetTalukExtension from "../pages/target-settings/budgetextension-taluk/BudgetTalukExtension";
import BudgetTalukExtensionList from "../pages/target-settings/budgetextension-taluk/BudgetTalukExtensionList";
import BudgetTalukExtensionEdit from "../pages/target-settings/budgetextension-taluk/BudgetTalukExtensionEdit";
import BudgetTalukExtensionView from "../pages/target-settings/budgetextension-taluk/BudgetTalukExtensionView";
import BudgetInstitutionExtension from "../pages/target-settings/budgetextension-institution/BudgetInstitutionExtension";
import BudgetInstitutionExtensionList from "../pages/target-settings/budgetextension-institution/BudgetInstitutionExtensionList";
import BudgetInstitutionExtensionEdit from "../pages/target-settings/budgetextension-institution/BudgetInstitutionExtensionEdit";
import BudgetInstitutionExtensionView from "../pages/target-settings/budgetextension-institution/BudgetInstitutionExtensionView";
import BudgetHoaExtension from "../pages/target-settings/budgetextension-hoa/BudgetHoaExtension";
import BudgetHoaExtensionList from "../pages/target-settings/budgetextension-hoa/BudgetHoaExtensionList";
import BudgetHoaExtensionEdit from "../pages/target-settings/budgetextension-hoa/BudgetHoaExtensionEdit";
import BudgetHoaExtensionView from "../pages/target-settings/budgetextension-hoa/BudgetHoaExtensionView";
import BudgetDistrictExtensionView from "../pages/target-settings/budgetextension-district/BudgetDistrictExtensionView";
import BudgetDistrictExtensionEdit from "../pages/target-settings/budgetextension-district/BudgetDistrictExtensionEdit";
import BudgetDistrictExtensionList from "../pages/target-settings/budgetextension-district/BudgetDistrictExtensionList";
import BudgetDistrictExtension from "../pages/target-settings/budgetextension-district/BudgetDistrictExtension";

import ApplicationSelection from "../pages/services-module/application/ApplicationSelection";
// import ApplicationDashboard from "../pages/services-module/application/ApplicationDashboard";
// import DashboardList from "../pages/services-module/application/DashboardList";
// import DrawingOfficerList from "../pages/services-module/application/DrawingOfficerList";
// import DbtApplication from "../pages/services-module/application/DbtApplication";
import SchemeQuotaList from "../pages/masters/scheme-quota/SchemeQuotaList";
import SchemeQuota from "../pages/masters/scheme-quota/SchemeQuota";
import SchemeQuotaView from "../pages/masters/scheme-quota/SchemeQuotaView";
import SchemeQuotaEdit from "../pages/masters/scheme-quota/SchemeQuotaEdit";
import MapComponent from "../pages/masters/map-component-hoa/MapComponentAndHoa";
import Department from "../pages/masters/department/Department";
import DepartmentList from "../pages/masters/department/DepartmentList";
import DepartmentEdit from "../pages/masters/department/EditDepartment";
import DepartmentView from "../pages/masters/department/DepartmentView";
import ApplicationDashboard from "../pages/services-module/application/ApplicationDashboard";
import DashboardList from "../pages/direct-benefit-transfer/DashboardList";
import DrawingOfficerList from "../pages/direct-benefit-transfer/DrawingOfficerList";
import DbtApplication from "../pages/services-module/application/DbtApplication";
import MapComponentAndHoaList from "../pages/masters/map-component-hoa/MapComponentAndHoaList";
import UserHierarchyMapping from "../pages/masters/user-hierarchy-mapping/UserHierarchyMapping";
import RejectReasonWorkFlowMaster from "../pages/masters/reject-reason-workflow/RejectReasonWorkFlow";
import RejectReasonWorkFlowList from "../pages/masters/reject-reason-workflow/RejectReasonWorkFlowList";
import RejectReasonWorkFlowView from "../pages/masters/reject-reason-workflow/RejectReasonWorkFlowView";
import RejectReasonWorkFlowEdit from "../pages/masters/reject-reason-workflow/RejectReasonWorkFlowEdit";
import ApplicationFormList from "../pages/direct-benefit-transfer/ApplicationFormList";
import ReportSuccessList from "../pages/direct-benefit-transfer/ReportSuccessList";
import ReportRejectList from "../pages/direct-benefit-transfer/ReportRejectList";
import ApplicationFormEdit from "../pages/services-module/application/ApplicationFormEdit";
import TscOfficerList from "../pages/direct-benefit-transfer/TscOfficerList";
import ServiceApplicationEdit from "../pages/services-module/application/ServiceApplicationEdit";
import DrawingOfficerSchemeList from "../pages/direct-benefit-transfer/DrawingOfficerSchemeList";
import TscOfficerSchemeList from "../pages/direct-benefit-transfer/TscOfficerSchemeList";
import WeighmentForSeedMarket from "../pages/market-and-auction/WeighmentForSeedMarket";
import LotGroupage from "../pages/market-and-auction/LotGroupage";
import LotGroupageEdit from "../pages/market-and-auction/LotGroupageEdit";
import AllApplicationList from "../pages/direct-benefit-transfer/AllApplicationList";
import FinancialTargetSettingsDistrictUserList from "../pages/target-settings/financialtargetsettingsdistrict/FinancialTargetSettingsDistrictUserList";
import DistrictWiseFarmerCountList from "../pages/direct-benefit-transfer/DistrictWiseFarmerCountList";
import ReadyForPaymentForSeedMarket from "../pages/market-and-auction/ReadyForPaymentForSeedMarket";
import FarmerRegistrationList from "../pages/stake-holder/FarmerRegistrationList";
import DirectFruitsDetails from "../pages/stake-holder/DirectFruitsDetails";
import OtherStateFarmerEdit from "../pages/stake-holder/OtherStateFarmerEdit";
import PaymentStatementForSeedMarket from "../pages/market-and-auction/PaymentStatementForSeedMarket";
import BulkSendToPaymentForSeedMarket from "../pages/market-and-auction/BulkSendToPaymentForSeedMarket";
import AverageReport from "../pages/reports-admin/AverageReport";
import AudioVisualReport from "../pages/reports-admin/AudioVisualReport";
import BReport from "../pages/reports-admin/BReport";
import MonthlyReport from "../pages/reports-admin/MonthlyReport";
import MarketReport from "../pages/reports-admin/MarketReport";
import DistrictReport from "../pages/reports-admin/DistrictReport";
import AverageCocoonReport from "../pages/reports-admin/AverageCocoonReport";
import AbstractReport from "../pages/reports-admin/AbstractReport";
import BlankDtrReport from "../pages/reports-admin/market-auction/BlankDtrReport";
import FormReportByDist from "../pages/reports-admin/market-auction/FormReportByDist";
import FarmerWithoutFruitsEdit from "../pages/stake-holder/FarmerWithoutFruitsEdit";
import DistrictAndTalukWiseMonthlyReport from "../pages/reports-admin/DistrictAndTalukWiseMonthlyReport";
import DistrictWiseReelerCountList from "../pages/reports-admin/DistrictWiseReelerCountList";
import ReelerCountList from "../pages/reports-admin/ReelerCountList";
import PullBack from "../pages/direct-benefit-transfer/PullBack";
import DbtPushedList from "../pages/direct-benefit-transfer/DbtPushedList";
import Query from "../pages/stake-holder/external-units/Query";
import InspectionType from "../pages/masters/inspection-type/InspectionType";
import InspectionTypeList from "../pages/masters/inspection-type/InspectionTypeList";
import InspectionTypeView from "../pages/masters/inspection-type/InspectionTypeView";
import InspectionTypeEdit from "../pages/masters/inspection-type/InspectionTypeEdit";
import DashboardReportList from "../pages/services-module/application-component/DashboardReportList";
import WithoutFruitsIdStakeHolderEdit from "../pages/stake-holder/WithoutFruitsIdStakeHolderEdit";
import Spacing from "../pages/masters/spacing/Spacing";
import SpacingEdit from "../pages/masters/spacing/SpacingEdit";
import SpacingList from "../pages/masters/spacing/SpacingList";
import Hectare from "../pages/masters/hectare/Hectares";
import HectareEdit from "../pages/masters/hectare/HectareEdit";
import HectareList from "../pages/masters/hectare/HectareList";
import Hectares from "../pages/masters/hectare/Hectares";
import CropStatus from "../pages/masters/crop-status/CropStatus";
import CropStatusView from "../pages/masters/crop-status/CropStatusView";
import CropStatusEdit from "../pages/masters/crop-status/CropStatusEdit";
import CropStatusList from "../pages/masters/crop-status/CropStatusList";
import CropInspectionType from "../pages/masters/crop-inspection-type/CropInspectionType";
import CropInspectionTypeList from "../pages/masters/crop-inspection-type/CropInspectionTypeList";
import CropInspectionTypeView from "../pages/masters/crop-inspection-type/CropInspectionTypeView";
import CropInspectionTypeEdit from "../pages/masters/crop-inspection-type/CropInspectionTypeEdit";
import ReasonList from "../pages/masters/reason/ReasonList";
import Reason from "../pages/masters/reason/Reason";
import ReasonView from "../pages/masters/reason/ReasonView";
import ReasonEdit from "../pages/masters/reason/ReasonEdit";
import MountList from "../pages/masters/mount/MountList";
import MountView from "../pages/masters/mount/MountView";
import MountEdit from "../pages/masters/mount/MountEdit";
import Mount from "../pages/masters/mount/Mount";
import DiseaseStatus from "../pages/masters/disease-status/DiseaseStatus";
import DiseaseStatusView from "../pages/masters/disease-status/DiseaseStatusView";
import DiseaseStatusEdit from "../pages/masters/disease-status/DiseaseStatusEdit";
import DiseaseStatusList from "../pages/masters/disease-status/DiseaseStatusList";
import SeedCocoonInward from "../pages/seed-cocoon-martket/SeedCocoonInward";
import BasePriceFixation from "../pages/seed-cocoon-martket/BasePriceFixation";
import PupaTestAndCocoonAssessment from "../pages/seed-cocoon-martket/PupaTestAndCocoonAssessment";
import PupaAndCocoonAssessmentPage from "../pages/seed-cocoon-martket/PupaAndCocconAssessmentPage";
import FinalWeighment from "../pages/seed-cocoon-martket/FinalWeighment";
// Admin and Reports

function Router() {
  const token = localStorage.getItem("jwtToken");
  const isAuthenticated = token !== null && token !== "";
  const navigate = useNavigate();

  useEffect(() => {
    const pathname = window.location.pathname;
    const displayAllLotPathPattern = /^\/seriui\/display-all-lot\/\d+$/;
    console.log(pathname);
    console.log(displayAllLotPathPattern.test(pathname));
    if (!isAuthenticated && !displayAllLotPathPattern.test(pathname)) {
      navigate("/seriui");
    }
  }, [isAuthenticated, navigate]);

  return (
    <ScrollToTop>
      <Routes>
        {/* <Route path="/blank" element={<Blank />} /> */}
        <Route path="/seriui" element={<AuthLogin />} />
        <Route path="/seriui/home" element={<Home />} />
        {/* Display All Lot */}
        <Route
          path="/seriui/display-all-lot/:marketId"
          element={<DisplayAllLot />}
        />

        {/* Conditional rendering for protected route */}
        {isAuthenticated && (
          <Route path="seriui">
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

            <Route path="not-found" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />

            {/* Sericulture */}
            <Route path="homepage" element={<HomePage />} />
            <Route
              path="stake-holder-registration"
              element={<StakeHolderRegister />}
            />
            <Route path="other-state-farmer" element={<OtherStateFarmer />} />
            <Route
              path="other-state-farmer-edit/:id"
              element={<OtherStateFarmerEdit />}
            />
            <Route
              path="other-state-farmer-list"
              element={<OtherStateFarmerList />}
            />
            <Route
              path="farmer-without-fruits"
              element={<FarmerWithoutFruits />}
            />
            <Route
              path="farmer-without-fruits-edit/:id"
              element={<FarmerWithoutFruitsEdit />}
            />
            <Route
              path="farmer-without-fruits-list"
              element={<FarmerWithoutFruitsList />}
            />
            <Route path="stake-holder-list" element={<StakeHolderList />} />
            <Route
              path="stake-holder-view/:id"
              element={<StakeHolderViewPage />}
            />
            <Route path="stake-holder-edit/:id" element={<StakeHolderEdit />} />
            <Route path="without-fruits-id-stake-holder-edit/:id" element={<WithoutFruitsIdStakeHolderEdit />} />
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
              path="activate-external-unit"
              element={<ActivateExternalUnit />}
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
            <Route
              path="trainee-attendance-page/:id"
              element={<TraineeAttendancePage />}
            />
            <Route path="trainer-page" element={<TrainerPage />} />
            <Route path="trainer-page-edit/:id" element={<TrainerPageEdit />} />
            <Route path="trainer-page-list" element={<TrainerPageList />} />
            <Route path="trainer-page-view/:id" element={<TrainerPageView />} />

            <Route path="query-test" element={<Query/>} />

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
            <Route
              path="farmer-wise-report"
              element={<FarmerRegistrationList />}
            />
            <Route
              path="reeler-wise-report"
              element={<ReelerCountList />}
            />
            <Route
              path="direct-fruits-details"
              element={<DirectFruitsDetails />}
            />

            {/* Services */}
            <Route
              path="service-application"
              element={<ServiceApplication />}
            />
            <Route
              path="service-application-edit/:id"
              element={<ServiceApplicationEdit />}
            />
            <Route
              path="application-selection"
              element={<ApplicationSelection />}
            />
            <Route
              path="application-dashboard"
              element={<ApplicationDashboard />}
            />
            <Route path="dbt-application" element={<DbtApplication />} />
            <Route path="dashboard-report-list/:id" element={<DashboardReportList />} />
            <Route path="pull-back" element={<PullBack />} />
            <Route
              path="all-application-list"
              element={<AllApplicationList />}
            />
            <Route path="report-success-list" element={<ReportSuccessList />} />
            <Route path="report-reject-list" element={<ReportRejectList />} />
            <Route path="dbt-application" element={<DbtApplication />} />
            <Route path="report-success-list" element={<ReportSuccessList />} />
            <Route path="report-reject-list" element={<ReportRejectList />} />
            <Route path="dbt-pushed-list" element={<DbtPushedList />} />

            <Route
              path="district-wise-farmer-count-list"
              element={<DistrictWiseFarmerCountList />}
            />
             <Route
              path="district-wise-reeler-count-list"
              element={<DistrictWiseReelerCountList />}
            />
            <Route
              path="application-form-list"
              element={<ApplicationFormList />}
            />
            <Route
              path="application-form-edit/:id"
              element={<ApplicationFormEdit />}
            />
            <Route
              path="drawing-officer-list"
              element={<DrawingOfficerList />}
            />
            <Route path="tsc-officer-list" element={<TscOfficerList />} />
            <Route
              path="application-dashboard-list/:id"
              element={<DashboardList />}
            />
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
              path="Maintenance-of-mulberry-Garden-in-the-Farms-list"
              element={<MaintenanceofMulberryfarmList />}
            />
            <Route
              path="Maintenance-of-mulberry-Garden-in-the-Farms-view/:id"
              element={<MaintenanceofMulberryfarmView />}
            />
            <Route
              path="Maintenance-of-mulberry-Garden-in-the-Farms-update/:id"
              element={<MaintenanceofMulberryfarmUpdate />}
            />
            <Route
              path="Maintenance-of-mulberry-Garden-in-the-Farms-edit/:id"
              element={<MaintenanceofMulberryfarmEdit />}
            />
            <Route
              path="Maintenance-of-mulberry-Garden-in-the-Farms-alert"
              element={<MaintenanceofMulberryfarmAlert />}
            />
            <Route
              path="Receipt-of-DFLs-from-the-P4-grainage"
              element={<ReceiptofDFLsfromtheP4grainage />}
            />
            <Route
              path="Receipt-of-DFLs-from-the-P4-grainage-edit/:id"
              element={<ReceiptOfDFLsFromTheP4GrainageEdit />}
            />
            <Route
              path="Receipt-of-DFLs-from-the-P4-grainage-list"
              element={<ReceiptofDFLsfromtheP4grainageList />}
            />
            <Route
              path="Maintenance-of-Line-Records-for-Each-Race"
              element={<MaintenanceofLineRecordsforEachRace />}
            />

            <Route
              path="Maintenance-of-Line-Records-for-Each-Race-List"
              element={<MaintenanceofLineRecordsforEachRaceList />}
            />

            <Route
              path="Maintenance-of-Line-Records-for-Each-Race-edit/:id"
              element={<MaintenanceOfLineRecordsForEachRaceEdit />}
            />
            <Route
              path="Maintenance-of-Line-Records-for-Each-Race-view/:id"
              element={<MaintenanceOfLineRecordForEachRaceView />}
            />

            <Route
              path="Maintenance-of-Screening-Batch-Records"
              element={<MaintenanceofScreeningBatchRecords />}
            />

            <Route
              path="Maintenance-of-Screening-Batch-Records-List"
              element={<MaintenanceofScreeningBatchRecordsList />}
            />

            <Route
              path="maintenance-of-Screening-Batch-Records-edit/:id"
              element={<MaintenanceofScreeningBatchRecordsEdit />}
            />

            <Route
              path="maintenance-of-Screening-Batch-Records-view/:id"
              element={<MaintenanceofScreeningBatchRecordsView />}
            />

            <Route
              path="Dispatch-of-Cocoons-to-P4-Grainage"
              element={<DispatchofCocoonstoP4Grainage />}
            />

            <Route
              path="Dispatch-of-Cocoons-to-P4-Grainage-List"
              element={<DispatchofCocoonstoP4GrainageList />}
            />

            <Route
              path="Dispatch-of-Cocoons-to-P4-Grainage-edit/:id"
              element={<DispatchofCocoonstoP4GrainageEdit />}
            />
            <Route
              path="Dispatch-of-Cocoons-to-P4-Grainage-view/:id"
              element={<DispatchofCocoonstoP4GrainageView />}
            />

            <Route
              path="Rearing-of-DFLs-for-the-8-Lines"
              element={<RearingofDFLsforthe8Lines />}
            />

            <Route
              path="Rearing-of-DFLs-for-the-8-Lines-List"
              element={<RearingofDFLsforthe8LinesList />}
            />

            <Route
              path="Rearing-of-DFLs-for-the-8-Lines-edit/:id"
              element={<RearingOfDFLsForThe8LinesEdit />}
            />
            <Route
              path="Rearing-of-DFLs-for-the-8-Lines-view/:id"
              element={<RearingOfDFLsForThe8LinesView />}
            />

            <Route
              path="Preservation-of-seed-cocoon-for-processing"
              element={<Preservationofseedcocoonforprocessing />}
            />

            <Route
              path="preservation-of-seed-cocoon-list"
              element={<PreservationofseedcocoonforprocessingList />}
            />

            <Route
              path="preservation-of-seed-cocoon-edit/:id"
              element={<PreservationOfSeedCocoonForProcessingEdit />}
            />
            <Route
              path="preservation-of-seed-cocoon-view/:id"
              element={<PreservationOfSeedCocoonForProcessingView />}
            />

            <Route
              path="Preparation-of-eggs-DFLs"
              element={<PreparationofeggsDFLs />}
            />

            <Route
              path="Preparation-of-eggs-DFLs-List"
              element={<PreparationofeggsDFLsList />}
            />

            <Route
              path="Preparation-of-eggs-DFLs-edit/:id"
              element={<PreparationofeggsDFLsEdit />}
            />

            <Route
              path="Preparation-of-eggs-DFLs-view/:id"
              element={<PreparationofeggsDFLsView />}
            />

            <Route
              path="maintenance-of-eggs-at-cold-storage"
              element={<Maintenanceofeggsatcoldstorage />}
            />

            <Route
              path="maintenance-of-eggs-at-cold-storage-list"
              element={<MaintenanceofeggsatcoldstorageList />}
            />

            <Route
              path="maintenance-of-eggs-at-cold-storage-edit/:id"
              element={<MaintenanceOfEggsAtColdStorageEdit />}
            />
            <Route
              path="maintenance-of-eggs-at-cold-storage-view/:id"
              element={<MaintenanceOfEggsAtColdStorageView />}
            />

            <Route
              path="Maintenance-of-eggs-at-cold"
              element={<MaintenanceOfEggsAtCold />}
            />

            <Route
              path="maintenance-of-eggs-at-cold-list"
              element={<MaintenanceOfEggsAtColdList />}
            />

            <Route
              path="maintenance-of-eggs-at-cold-edit/:id"
              element={<MaintenanceOfEggsAtColdEdit />}
            />
            <Route
              path="maintenance-of-eggs-at-cold-view/:id"
              element={<MaintenanceOfEggsAtColdView />}
            />

            <Route
              path="Cold-Storage-Schedule-BV"
              element={<ColdStorageScheduleBV />}
            />

            <Route
              path="Cold-Storage-Schedule-BV-List"
              element={<ColdStorageScheduleBVList />}
            />
            <Route
              path="Cold-Storage-Schedule-BV-edit/:id"
              element={<ColdStorageScheduleBVEdit />}
            />
            <Route
              path="Cold-Storage-Schedule-BV-view/:id"
              element={<ColdStorageScheduleBVView />}
            />

            <Route path="remittance" element={<Remittance />} />
            <Route path="remittance-list" element={<RemittanceList />} />

            <Route path="remittance-edit/:id" element={<RemittanceEdit />} />
            <Route path="remittance-view/:id" element={<RemittanceView />} />

            <Route path="testing-of-moth" element={<TestingOfMoth />} />
            <Route
              path="testing-of-moth-list"
              element={<TestingOfMothList />}
            />

            <Route
              path="testing-of-moth-edit/:id"
              element={<EditTestingOfMoth />}
            />
            <Route
              path="testing-of-moth-view/:id"
              element={<TestingOfMothView />}
            />
            <Route
              path="maintenance-of-pierced-cocoons"
              element={<MaintenanceOfPiercedCocoons />}
            />
            <Route
              path="maintenance-of-pierced-cocoons-list"
              element={<MaintenanceOfPiercedCocoonsList />}
            />

            <Route
              path="maintenance-of-pierced-cocoons-edit/:id"
              element={<EditMaintenanceOfPiercedCocoons />}
            />
            <Route
              path="maintenance-of-pierced-cocoons-view/:id"
              element={<MaintenanceOfPiercedCocoonsView />}
            />
            <Route
              path="maintenance-of-egg-laying-sheets"
              element={<MaintenanceOfEggLayingSheets />}
            />
            <Route
              path="maintenance-of-egg-laying-sheets-list"
              element={<MaintenanceOfEggLayingSheetsList />}
            />

            <Route
              path="maintenance-of-egg-laying-sheets-edit/:id"
              element={<EditMaintenanceOfEggLayingSheets />}
            />
            <Route
              path="maintenance-of-egg-laying-sheets-view/:id"
              element={<MaintenanceOfEggLayingSheetsView />}
            />

            <Route
              path="sale-disposal-of-pierced-cocoons"
              element={<SaleDisposalOfPiercedCocoons />}
            />

            <Route
              path="sale-disposal-of-pierced-cocoons-edit/:id"
              element={<SaleDisposalOfPiercedCocoonsEdit />}
            />

            <Route
              path="sale-disposal-of-pierced-cocoons-list"
              element={<SaleDisposalOfPiercedCocoonsList />}
            />

            <Route
              path="sale-disposal-of-pierced-cocoons-view/:id"
              element={<SaleDisposalOfPiercedCocoonsView />}
            />

            <Route
              path="Sale-Disposal-of-DFLs-eggs"
              element={<SaleDisposalofDFLseggs />}
            />

            <Route
              path="Sale-Disposal-of-DFLs-eggs-list"
              element={<SaleDisposalofDFLseggsList />}
            />

            <Route
              path="Sale-Disposal-of-DFLs-eggs-view/:id"
              element={<SaleDisposalofDFLseggsView />}
            />

            <Route
              path="Sale-Disposal-of-DFLs-eggs-edit/:id"
              element={<SaleDisposalofDFLseggsEdit />}
            />

            <Route
              path="registered-seed-producer-nsso-grainages"
              element={<RegisteredSeedProducerNssoGrainages />}
            />

            <Route
              path="registered-seed-producer-nsso-grainages-list"
              element={<RegisteredSeedProducerNssoGrainagesList />}
            />

            <Route
              path="registered-seed-producer-nsso-grainages-edit/:id"
              element={<RegisteredSeedProducerNssoGrainagesEdit />}
            />

            <Route
              path="registered-seed-producer-nsso-grainages-view/:id"
              element={<RegisteredSeedProducerNssoGrainagesView />}
            />

            <Route
              path="sale-and-disposal-of-eggs-nsso"
              element={<SaleAndDisposalOfEggsNSSO />}
            />

            <Route
              path="sale-and-disposal-of-eggs-nsso-list"
              element={<SaleAndDisposalOfEggsNSSOList />}
            />

            <Route
              path="sale-and-disposal-of-eggs-nsso-view/:id"
              element={<SaleAndDisposalOfEggsNSSOView />}
            />

            <Route
              path="sale-and-disposal-of-eggs-nsso-edit/:id"
              element={<SaleAndDisposalOfEggsNSSOEdit />}
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
              path="chawki-management-list"
              element={<ChawkiManagementList />}
            />

            <Route
              path="chawki-management-edit/:id"
              element={<ChawkiManagementEdit />}
            />
            <Route
              path="chawki-management-view/:id"
              element={<ChawkiManagementView />}
            />

            {/* Inspection */}
            <Route path="inspection-config" element={<InspectionConfig />} />

            <Route
              path="requestinspectionmapping"
              element={<RequestInspectionMapping />}
            />
            <Route
              path="requestinspectionmapping-edit/:id"
              element={<RequestInspectionMappingEdit />}
            />
            <Route
              path="requestinspectionmapping-list"
              element={<RequestInspectionMappingList />}
            />
            <Route
              path="requestinspectionmapping-view/:id"
              element={<RequestInspectionMappingView />}
            />
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
            <Route
              path="escalate-dashboard"
              element={<EscalationDashboard />}
            />
            <Route path="escalate-view/:id" element={<EscalationView />} />
            <Route path="help-desk-faq-view" element={<HelpDeskFaqView />} />
            <Route path="raise-ticket-view/:id" element={<RaiseTicketView />} />
            <Route path="user-ticket-view/:id" element={<UserTicketView />} />

            {/* Garden Management */}

            <Route path="seed-cutting-bank" element={<SeedCuttingBank />} />
            <Route
              path="seed-cutting-bank-list"
              element={<SeedCuttingBankList />}
            />
            <Route
              path="seed-cutting-bank-view/:id"
              element={<SeedCuttingBankView />}
            />
            <Route
              path="seed-cutting-bank-edit/:id"
              element={<SeedCuttingBankEdit />}
            />
            <Route
              path="maintenance-of-mulberry-garden"
              element={<MaintenanceofmulberryGarden />}
            />
            <Route
              path="maintenance-of-mulberry-garden-list"
              element={<MaintenanceOfMulberryGardenList />}
            />
            <Route
              path="maintenance-of-mulberry-garden-view/:id"
              element={<MaintenanceOfMulberryGardenView />}
            />
            <Route
              path="maintenance-of-mulberry-garden-edit/:id"
              element={<MaintenanceOfMulberryGardenEdit />}
            />
            <Route
              path="maintenance-of-mulberry-garden-update/:id"
              element={<MaintenanceOfMulberryGardenUpdate />}
            />
            <Route
              path="maintenance-of-mulberry-garden-alert/:id"
              element={<MaintenanceOfMulberryGardenAlert />}
            />

            <Route
              path="receipt-of-dfls"
              element={<ReceiptofDFLsfromthegrainage />}
            />
            <Route
              path="receipt-of-dfls-list"
              element={<ReceiptOfDFLsList />}
            />
            <Route
              path="receipt-of-dfls-view/:id"
              element={<ReceiptOfDFLsView />}
            />
            <Route
              path="receipt-of-dfls-edit/:id"
              element={<ReceiptOfDFLsEdit />}
            />

            <Route path="rearing-of-dfls" element={<RearingofDFLs />} />
            <Route
              path="rearing-of-dfls-list"
              element={<RearingOfDFLsList />}
            />
            <Route
              path="rearing-of-dfls-view/:id"
              element={<RearingOfDFLsView />}
            />
            <Route
              path="rearing-of-dfls-edit/:id"
              element={<RearingOfDFLsEdit />}
            />
            <Route
              path="Supply-of-Cocoons-to-Grainagee"
              element={<SupplyofCocoonstoGrainage />}
            />
            <Route
              path="supply-of-cocoons-to-grainage-list"
              element={<SupplyOfCocoonsToGrainageList />}
            />
            <Route
              path="supply-of-cocoons-to-grainage-edit/:id"
              element={<SupplyofCocoonstoGrainageEdit />}
            />
            <Route
              path="supply-of-cocoons-to-grainage-view/:id"
              element={<SupplyOfCocoonsToGrainageView />}
            />
            <Route
              path="Maintenance-and-Sale-of-Nursery-to-Farmers"
              element={<MaintenanceandSaleofNurserytoFarmers />}
            />
            <Route
              path="maintenance-and-sale-of-nursery-edit/:id"
              element={<MaintenanceandSaleofNurserytoFarmersEdit />}
            />
            <Route
              path="maintenance-and-sale-of-nursery-view/:id"
              element={<MaintenanceAndSaleOfNurseryToFarmersView />}
            />

            <Route
              path="maintenance-and-sale-of-nursery-list"
              element={<MaintenanceandSaleofNurserytoFarmersList />}
            />

            <Route
              path="chawki-distribution"
              element={<ChawkidistributiontoFarmers />}
            />
            <Route
              path="chawki-distribution-list"
              element={<ChawkidistributiontoFarmersList />}
            />

            <Route
              path="chawki-distribution-edit/:id"
              element={<ChawkidistributiontoFarmersEdit />}
            />
            <Route
              path="chawki-distribution-view/:id"
              element={<ChawkidistributiontoFarmersView />}
            />

            <Route
              path="ChawkidistributiontoFarmers-edit/:id"
              element={<ChawkidistributiontoFarmersEdit />}
            />

            {/* Master */}
            <Route path="financial-year" element={<FinancialYear />} />
            <Route
              path="financial-year-edit/:id"
              element={<FinancialYearEdit />}
            />
            <Route path="financial-year-list" element={<FinancialYearList />} />

            <Route
              path="financial-year-view/:id"
              element={<FinancialYearView />}
            />

            <Route path="spacing" element={<Spacing />} />
            <Route
              path="spacing-edit/:id"
              element={<SpacingEdit />}P
            />
            <Route path="spacing-list" element={<SpacingList />} />

            <Route path="hectare" element={<Hectares />} />
            <Route
              path="hectare-edit/:id"
              element={< HectareEdit/>}
            />
            <Route path="hectare-list" element={<HectareList />} />

            <Route path="head-of-account" element={<HeadOfAccount />} />
            <Route path="caste" element={<Caste />} />
            <Route path="caste-list" element={<CasteList />} />
            <Route path="caste-view/:id" element={<CasteView />} />
            <Route path="caste-edit/:id" element={<CasteEdit />} />
            <Route path="inspection-type" element={<InspectionType />} />
            <Route path="inspection-type-list" element={<InspectionTypeList />} />
            <Route path="inspection-type-view/:id" element={<InspectionTypeView/>} />
            <Route path="inspection-type-edit/:id" element={<InspectionTypeEdit />} />
            <Route path="department" element={<Department />} />
            <Route path="department-list" element={<DepartmentList />} />
            <Route path="department-view/:id" element={<DepartmentView />} />
            <Route path="department-edit/:id" element={<DepartmentEdit />} />
            <Route path="activity" element={<Activity />} />
            <Route path="Activity-list" element={<ActivityList />} />
            <Route path="activity-view/:id" element={<ActivityView />} />
            <Route path="activity-edit/:id" element={<ActivityEdit />} />
            <Route path="budget-dashboard" element={<BudgetDashboard />} />

            <Route path="budget" element={<Budget />} />
            <Route path="budget-list" element={<BudgetList />} />
            <Route path="budget-edit/:id/:types" element={<BudgetEdit />} />
            <Route path="budget-view/:id/:types" element={<BudgetView />} />

            <Route path="budgetextension" element={<BudgetExtension />} />
            <Route
              path="budgetextension-list"
              element={<BudgetExtensionList />}
            />
            <Route
              path="budgetextension-edit/:id/:types"
              element={<BudgetExtensionEdit />}
            />
            <Route
              path="budgetextension-view/:id/:types"
              element={<BudgetExtensionView />}
            />

            <Route path="budgethoaextension" element={<BudgetHoaExtension />} />
            <Route
              path="budgethoaextension-list"
              element={<BudgetHoaExtensionList />}
            />
            <Route
              path="budgethoaextension-edit/:id/:types"
              element={<BudgetHoaExtensionEdit />}
            />
            <Route
              path="budgethoaextension-view/:id/:types"
              element={<BudgetHoaExtensionView />}
            />

            <Route path="budget-hoa" element={<BudgetHoa />} />
            <Route path="budget-hoa-list" element={<BudgetHoaList />} />
            <Route
              path="budget-hoa-edit/:id/:types"
              element={<BudgetHoaEdit />}
            />
            <Route
              path="budget-hoa-view/:id/:types"
              element={<BudgetHoaView />}
            />

            <Route path="budget-district" element={<BudgetDistrict />} />
            <Route
              path="budget-district-view/:id/:types"
              element={<BudgetDistrictView />}
            />
            <Route
              path="budget-district-edit/:id/:types"
              element={<BudgetDistrictEdit />}
            />
            <Route
              path="budget-district-list"
              element={<BudgetDistrictList />}
            />

            <Route
              path="budgetdistrictextension"
              element={<BudgetDistrictExtension />}
            />
            <Route
              path="budgetdistrictextension-view/:id/:types"
              element={<BudgetDistrictExtensionView />}
            />
            <Route
              path="budgetdistrictextension-edit/:id/:types"
              element={<BudgetDistrictExtensionEdit />}
            />
            <Route
              path="budgetdistrictextension-list"
              element={<BudgetDistrictExtensionList />}
            />
            <Route path="budget-taluk" element={<BudgetTaluk />} />
            <Route path="budget-taluk-list" element={<BudgetTalukList />} />
            <Route
              path="budget-taluk-edit/:id/:types"
              element={<BudgetTalukEdit />}
            />
            <Route
              path="budget-taluk-view/:id/:types"
              element={<BudgetTalukView />}
            />

            <Route
              path="budgettalukextension"
              element={<BudgetTalukExtension />}
            />
            <Route
              path="budgettalukextension-list"
              element={<BudgetTalukExtensionList />}
            />
            <Route
              path="budgettalukextension-edit/:id/:types"
              element={<BudgetTalukExtensionEdit />}
            />
            <Route
              path="budgettalukextension-view/:id/:types"
              element={<BudgetTalukExtensionView />}
            />

            <Route path="budget-tsc" element={<BudgetTsc />} />
            <Route path="budget-tsc-list" element={<BudgetTscList />} />
            <Route
              path="budget-tsc-edit/:id/:types"
              element={<BudgetTscEdit />}
            />
            <Route
              path="budget-tsc-view/:id/:types"
              element={<BudgetTscView />}
            />

            <Route
              path="budgetinstitutionextension"
              element={<BudgetInstitutionExtension />}
            />
            <Route
              path="budgetinstitutionextension-list"
              element={<BudgetInstitutionExtensionList />}
            />
            <Route
              path="budgetinstitutionextension-edit/:id/:types"
              element={<BudgetInstitutionExtensionEdit />}
            />
            <Route
              path="budgetinstitutionextension-view/:id/:types"
              element={<BudgetInstitutionExtensionView />}
            />

            <Route
              path="financialtargetsettings"
              element={<FinancialTargetSettings />}
            />

            <Route
              path="financialtargetsettings-list"
              element={<FinancialTargetSettingList />}
            />
            <Route
              path="financialtargetsettings-edit/:id"
              element={<FinancialTargetSettingEdit />}
            />
            <Route
              path="financialtargetsettings-view/:id"
              element={<FinancialTargetSettingView />}
            />

            <Route
              path="financialtargetsettingsdistrict"
              element={<FinancialTargetSettingsDistrict />}
            />

            <Route
              path="financialtargetsettingsdistrict-list"
              element={<FinancialTargetSettingsDistrictList />}
            />
            <Route
              path="financialtargetsettingsdistrict-edit/:id"
              element={<FinancialTargetSettingsDistrictEdit />}
            />
            <Route
              path="financialtargetsettingsdistrict-view/:id"
              element={<FinancialTargetSettingsDistrictView />}
            />

            <Route
              path="financialtargetsettingstaluk"
              element={<FinancialTargetSettingsTaluk />}
            />

            <Route
              path="financialtargetsettingstaluk-list"
              element={<FinancialTargetSettingsTalukList />}
            />
            <Route
              path="financialtargetsettingstaluk-edit/:id"
              element={<FinancialTargetSettingsTalukEdit />}
            />
            <Route
              path="financialtargetsettingstaluk-view/:id"
              element={<FinancialTargetSettingsTalukView />}
            />

            <Route
              path="financialtargetsettingsinstitution"
              element={<FinancialTargetSettingsInstitution />}
            />

            <Route
              path="financialtargetsettingsinstitution-list"
              element={<FinancialTargetSettingsInstitutionList />}
            />
            <Route
              path="financialtargetsettingsinstitution-edit/:id"
              element={<FinancialTargetSettingsInstitutionEdit />}
            />
            <Route
              path="financialtargetsettingsinstitution-view/:id"
              element={<FinancialTargetSettingsInstitutionView />}
            />

            <Route
              path="physicaltargetsettingsdistrict"
              element={<PhysicalTargetSettingsDistrict />}
            />

            <Route
              path="physicaltargetsettingsdistrict"
              element={<PhysicalTargetSettingsDistrict />}
            />
            <Route
              path="physicaltargetsettingsdistrict-list"
              element={<PhysicalTargetSettingsDistrictList />}
            />
            <Route
              path="physicaltargetsettingsdistrict-edit/:id"
              element={<PhysicalTargetSettingsDistrictEdit />}
            />
            <Route
              path="physicaltargetsettingsdistrict-view/:id"
              element={<PhysicaltargetSettingsDistrictView />}
            />

            <Route
              path="physicaltargetsettingstaluk"
              element={<PhysicalTargetSettingsTaluk />}
            />

            <Route
              path="physicaltargetsettingstaluk-list"
              element={<PhysicalTargetSettingsTalukList />}
            />
            <Route
              path="physicaltargetsettingstaluk-edit/:id"
              element={<PhysicalTargetSettingsTalukEdit />}
            />
            <Route
              path="physicaltargetsettingstaluk-view/:id"
              element={<PhysicalTargetSettingsTalukView />}
            />

            <Route
              path="physicaltargetsettingstsc"
              element={<PhysicalTargetSettingsTsc />}
            />

            <Route
              path="physicaltargetsettingstsc-list"
              element={<PhysicalTargetSettingsTscList />}
            />
            <Route
              path="physicaltargetsettingstsc-edit/:id"
              element={<PhysicalTargetSettingsTscEdit />}
            />
            <Route
              path="physicaltargetsettingstsc-view/:id"
              element={<PhysicalTargetSettingsTscView />}
            />

            <Route
              path="releasebudgetdistrict"
              element={<ReleaseBudgetDistrict />}
            />

            <Route
              path="releasebudgetdistrict-list"
              element={<ReleaseBudgetDistrictList />}
            />
            <Route
              path="releasebudgetdistrict-edit/:id"
              element={<ReleaseBudgetDistrictEdit />}
            />
            <Route
              path="releasebudgetdistrict-view/:id"
              element={<ReleaseBudgetDistrictView />}
            />

            <Route path="releasebudgettaluk" element={<ReleaseBudgetTaluk />} />

            <Route
              path="releasebudgettaluk-list"
              element={<ReleaseBudgetTalukList />}
            />
            <Route
              path="releasebudgettaluk-edit/:id"
              element={<ReleaseBudgetTalukEdit />}
            />
            <Route
              path="releasebudgettaluk-view/:id"
              element={<ReleaseBudgetTalukView />}
            />

            <Route
              path="releasebudgetinstitution"
              element={<ReleaseBudgetInstitution />}
            />

            <Route
              path="releasebudgetinstitution-list"
              element={<ReleaseBudgetInstitutionList />}
            />
            <Route
              path="releasebudgetinstitution-edit/:id"
              element={<ReleaseBudgetInstitutionEdit />}
            />
            <Route
              path="releasebudgetinstitution-view/:id"
              element={<ReleaseBudgetInstitutionView />}
            />

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

   <Route path="cropStatus" element={<CropStatus />} />
            <Route path="crop-status-list" element={<CropStatusList />} />
            <Route path="crop-status-view/:id" element={<CropStatusView/>} />
            <Route path="crop-status-edit/:id" element={<CropStatusEdit />} />

            <Route path="cropInspectionType" element={<CropInspectionType />} />
            <Route path="crop-inspection-type-list" element={<CropInspectionTypeList />} />
            <Route path="crop-inspection-type-view/:id" element={<CropInspectionTypeView/>} />
            <Route path="crop-inspection-type-edit/:id" element={<CropInspectionTypeEdit />} />


            <Route path="reason" element={<Reason/>} />
            <Route path="reason-list" element={<ReasonList/>} />
            <Route path="reason-view/:id" element={<ReasonView/>} />
            <Route path="reason-edit/:id" element={<ReasonEdit />} />

            <Route path="mount" element={<Mount/>} />
            <Route path="mount-list" element={<MountList />} />
            <Route path="mount-view/:id" element={<MountView/>} />
            <Route path="mount-edit/:id" element={<MountEdit />} />

            <Route path="disease-status" element={<DiseaseStatus/>} />
            <Route path="disease-status-list" element={<DiseaseStatusList />} />
            <Route path="disease-status-view/:id" element={<DiseaseStatusView/>} />
            <Route path="disease-status-edit/:id" element={<DiseaseStatusEdit />} />

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
            <Route path="scheme-quota" element={<SchemeQuota />} />
            <Route path="scheme-quota-list" element={<SchemeQuotaList />} />
            <Route path="scheme-quota-view/:id" element={<SchemeQuotaView />} />
            <Route path="scheme-quota-edit/:id" element={<SchemeQuotaEdit />} />
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
            <Route path="worm-stage" element={<WormStage />} />
            <Route path="worm-stage-list" element={<WormStageList />} />
            <Route path="worm-stage-view/:id" element={<WormStageView />} />
            <Route path="worm-stage-edit/:id" element={<WormStageEdit />} />
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

            <Route
              path="sc-head-account-category"
              element={<ScHeadAccountCategory />}
            />
            <Route
              path="sc-head-account-category-list"
              element={<ScHeadAccountCategoryList />}
            />
            <Route
              path="sc-head-account-category-view/:id"
              element={<ScHeadAccountCategoryView />}
            />
            <Route
              path="sc-head-account-category-edit/:id"
              element={<ScHeadAccountCategoryEdit />}
            />

            <Route
              path="sc-approving-authority"
              element={<ScApprovingAuthority />}
            />
            <Route
              path="sc-approving-authority-list"
              element={<ScApprovingAuthorityList />}
            />
            <Route
              path="sc-approving-authority-view/:id"
              element={<ScApprovingAuthorityView />}
            />
            <Route
              path="sc-approving-authority-edit/:id"
              element={<ScApprovingAuthorityEdit />}
            />

            <Route path="sc-vendor-bank" element={<ScVendorBank />} />
            <Route path="sc-vendor-bank-list" element={<ScVendorBankList />} />
            <Route
              path="sc-vendor-bank-view/:id"
              element={<ScVendorBankView />}
            />
            <Route
              path="sc-vendor-bank-edit/:id"
              element={<ScVendorBankEdit />}
            />

            <Route path="sc-vendor-contact" element={<ScVendorContact />} />
            <Route
              path="sc-vendor-contact-list"
              element={<ScVendorContactList />}
            />
            <Route
              path="sc-vendor-contact-view/:id"
              element={<ScVendorContactView />}
            />
            <Route
              path="sc-vendor-contact-edit/:id"
              element={<ScVendorContactEdit />}
            />

            <Route path="sc-scheme-details" element={<ScSchemeDetails />} />
            <Route
              path="sc-scheme-details-list"
              element={<ScSchemeDetailsList />}
            />
            <Route
              path="sc-scheme-details-view/:id"
              element={<ScSchemeDetailsView />}
            />
            <Route
              path="sc-scheme-details-edit/:id"
              element={<ScSchemeDetailsEdit />}
            />

            <Route path="division" element={<DivisionMaster />} />
            <Route path="division-list" element={<DivisionMasterList />} />
            <Route path="division-view/:id" element={<DivisionMasterView />} />
            <Route path="division-edit/:id" element={<DivisionMasterEdit />} />
            <Route
              path="reject-reason-workflow"
              element={<RejectReasonWorkFlowMaster />}
            />
            <Route
              path="reject-reason-workflow-list"
              element={<RejectReasonWorkFlowList />}
            />
            <Route
              path="reject-reason-workflow-view/:id"
              element={<RejectReasonWorkFlowView />}
            />
            <Route
              path="reject-reason-workflow-edit/:id"
              element={<RejectReasonWorkFlowEdit />}
            />
            <Route
              path="user-hierarchy-mapping"
              element={<UserHierarchyMapping />}
            />
            <Route
              path="sc-sub-scheme-details"
              element={<ScSubSchemeDetails />}
            />
            <Route
              path="sc-sub-scheme-details-list"
              element={<ScSubSchemeDetailsList />}
            />
            <Route
              path="sc-sub-scheme-details-view/:id"
              element={<ScSubSchemeDetailsView />}
            />
            <Route
              path="sc-sub-scheme-details-edit/:id"
              element={<ScSubSchemeDetailsEdit />}
            />

            <Route
              path="sc-sub-scheme-details"
              element={<ScSubSchemeDetails />}
            />
            <Route
              path="sc-sub-scheme-details-list"
              element={<ScSubSchemeDetailsList />}
            />
            <Route
              path="sc-sub-scheme-details-view/:id"
              element={<ScSubSchemeDetailsView />}
            />
            <Route
              path="sc-sub-scheme-details-edit/:id"
              element={<ScSubSchemeDetailsEdit />}
            />

            <Route path="farm-type" element={<FarmType />} />
            <Route path="farm-type-list" element={<FarmTypeList />} />
            <Route path="farm-type-view/:id" element={<FarmTypeView />} />
            <Route path="farm-type-edit/:id" element={<FarmTypeEdit />} />

            <Route path="grainage-type" element={<GrainageType />} />
            <Route path="grainage-type-list" element={<GrainageTypeList />} />
            <Route
              path="grainage-type-view/:id"
              element={<GrainageTypeView />}
            />
            <Route
              path="grainage-type-edit/:id"
              element={<GrainageTypeEdit />}
            />

            <Route path="sc-vendor" element={<ScVendor />} />
            <Route path="sc-vendor-list" element={<ScVendorList />} />
            <Route path="sc-vendor-view/:id" element={<ScVendorView />} />
            <Route path="sc-vendor-edit/:id" element={<ScVendorEdit />} />

            <Route path="sc-unit-cost" element={<ScUnitCost />} />
            <Route path="sc-unit-cost-list" element={<ScUnitCostList />} />
            <Route path="sc-unit-cost-view/:id" element={<ScUnitCostView />} />
            <Route path="sc-unit-cost-edit/:id" element={<ScUnitCostEdit />} />
            <Route path="bin" element={<Bin />} />
            <Route path="bin-list" element={<BinList />} />
            <Route path="bin-view/:id" element={<BinView />} />
            <Route path="external-unit-type" element={<ExternalUnitType />} />
            <Route path="lineName" element={<LineName />} />
            <Route path="lineName-list" element={<LineNameList />} />
            <Route path="lineName-view/:id" element={<LineNameView />} />
            <Route path="lineName-edit/:id" element={<LineNameEdit />} />
            <Route path="disinfectant" element={<Disinfectant />} />
            <Route path="disinfectant-list" element={<DisinfectantList />} />
            <Route
              path="disinfectant-view/:id"
              element={<DisinfectantView />}
            />
            <Route
              path="disinfectant-edit/:id"
              element={<DisinfectantEdit />}
            />
            <Route path="grainage" element={<Grainage />} />
            <Route path="grainage-list" element={<GrainageList />} />
            <Route path="grainage-view/:id" element={<GrainageView />} />
            <Route path="grainage-edit/:id" element={<GrainageEdit />} />
            <Route path="generation-number" element={<GenerationNumber />} />
            <Route
              path="generation-number-list"
              element={<GenerationNumberList />}
            />
            <Route
              path="generation-number-view/:id"
              element={<GenerationNumberView />}
            />
            <Route
              path="generation-number-edit/:id"
              element={<GenerationNumberEdit />}
            />
            <Route path="farm" element={<Farm />} />
            <Route path="farm-list" element={<FarmList />} />
            <Route path="farm-view/:id" element={<FarmView />} />
            <Route path="farm-edit/:id" element={<FarmEdit />} />
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
            <Route path="bank" element={<Bank />} />
            <Route path="bank-list" element={<BankList />} />
            <Route path="bank-view/:id" element={<BankView />} />
            <Route path="bank-edit/:id" element={<BankEdit />} />
            <Route path="sc-program" element={<ScProgram />} />
            <Route path="sc-program-list" element={<ScProgramList />} />
            <Route path="sc-program-view/:id" element={<ScProgramView />} />
            <Route path="sc-program-edit/:id" element={<ScProgramEdit />} />
            <Route path="sc-approval-stage" element={<ScApprovalStage />} />
            <Route
              path="sc-approval-stage-list"
              element={<ScApprovalStageList />}
            />
            <Route
              path="sc-approval-stage-view/:id"
              element={<ScApprovalStageView />}
            />
            <Route
              path="sc-approval-stage-edit/:id"
              element={<EditScApprovalStage />}
            />
            <Route path="tsc" element={<Tsc />} />
            <Route path="tsc-list" element={<TscList />} />
            <Route path="tsc-view/:id" element={<TscView />} />
            <Route path="tsc-edit/:id" element={<TscEdit />} />
            <Route
              path="sc-program-approval-mapping"
              element={<ScProgramApprovalMapping />}
            />
            <Route
              path="sc-program-approval-mapping-list"
              element={<ScProgramApprovalMappingList />}
            />
            <Route
              path="sc-program-approval-mapping-view/:id"
              element={<ScProgramApprovalMappingView />}
            />
            <Route
              path="sc-program-approval-mapping-edit/:id"
              element={<ScProgramApprovalMappingEdit />}
            />
            <Route
              path="sc-program-account-mapping"
              element={<ScProgramAccountMapping />}
            />
            <Route
              path="sc-program-account-mapping-list"
              element={<ScProgramAccountMappingList />}
            />
            <Route
              path="sc-program-account-mapping-view/:id"
              element={<ScProgramAccountMappingView />}
            />
            <Route
              path="sc-program-account-mapping-edit/:id"
              element={<ScProgramAccountMappingEdit />}
            />
            <Route path="sc-category" element={<ScCategory />} />
            <Route path="sc-category-list" element={<ScCategoryList />} />
            <Route path="sc-category-view/:id" element={<ScCategoryView />} />
            <Route path="sc-category-edit/:id" element={<ScCategoryEdit />} />
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
            <Route path="config-farmer-count" element={<ConfigFarmerAllow />} />
            <Route path="map-component" element={<MapComponent />} />
            <Route
              path="map-component-list"
              element={<MapComponentAndHoaList />}
            />
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
            <Route
              path="ready-for-payment-for-seed-market"
              element={<ReadyForPaymentForSeedMarket />}
            />
            <Route path="bank-statement" element={<BankStatement />} />
            <Route
              path="payment-statement-for-seed-market"
              element={<PaymentStatementForSeedMarket />}
            />
            <Route path="bulk-send-to-bank" element={<BulkSendToBank />} />
            <Route
              path="bulk-send-to-payment-for-seed-market"
              element={<BulkSendToPaymentForSeedMarket />}
            />
            <Route path="ifsc-update" element={<IfscUpdate />} />
            <Route
              path="reeler-initial-amount"
              element={<ReelerInitialAmount />}
            />
            <Route
              path="reject-farmer-auction"
              element={<RejectFarmerAuction />}
            />
            <Route
              path="generate-bidding-slip"
              element={<GenerateBiddingSlip />}
            />
            <Route path="print-farmer-copy" element={<PrintFarmerCopy />} />
            <Route path="weighment" element={<Weighment />} />
            <Route
              path="weighment-for-seed-market"
              element={<WeighmentForSeedMarket />}
            />
            <Route path="lot-groupage" element={<LotGroupage />} />
            <Route path="lot-groupage-edit/:id" element={<LotGroupageEdit />} />

            <Route path="update-lot-weight" element={<UpdateLotWeight />} />
            <Route
              path="accept-former-auction"
              element={<AcceptFarmerAuction />}
            />
            <Route path="gatepass" element={<Gatepass />} />

            {/* Admin and Reports */}
            <Route path="report-admin" element={<ReportsAdmin />} />
            <Route path="district-monthly-report" element={<DistrictAndTalukWiseMonthlyReport />} />
            <Route path="average-report" element={<AverageReport />} />
            <Route path="audio-visual-report" element={<AudioVisualReport />} />
            <Route path="27-b-report" element={<BReport />} />
            <Route path="monthly-report" element={<MonthlyReport />} />
            <Route path="market-report" element={<MarketReport />} />
            <Route path="district-report" element={<DistrictReport />} />
            <Route path="abstract-report" element={<AbstractReport />} />
            <Route
              path="average-cocoon-report"
              element={<AverageCocoonReport />}
            />
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
            <Route
              path="reeler-pending-report"
              element={<ReelerPendingReport />}
            />

            <Route path="bidding-report" element={<BiddingReport />} />
            <Route
              path="bidding-report-reeler"
              element={<BiddingReportReeler />}
            />
            <Route path="dtr-online" element={<DtrOnlineReport />} />
            <Route path="blank-dtr-online" element={<BlankDtrReport />} />
            <Route
              path="form-13-report-by-dist"
              element={<FormReportByDist />}
            />
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
            <Route path="dashboard-report" element={<DashboardReport />} />

            {/* Display All Lot */}
            {/* <Route path="display-all-lot/:marketId" element={<DisplayAllLot />} /> */}


            {/* Seed Cocoon Market */}
            <Route
              path="seed-cocoon-inward"
              element={<SeedCocoonInward />}
            />

            <Route
              path="base-price-fixation"
              element={<BasePriceFixation />}
            />

            <Route
              path="pupa-test-and-assessment"
              element={<PupaTestAndCocoonAssessment />}
            />

            <Route
              path="pupa-test-and-assessment-page"
              element={<PupaAndCocoonAssessmentPage />}
            />
            <Route
              path="final-weighment-page"
              element={<FinalWeighment />}
            />


            {/* Market Exception Time */}
            <Route
              path="market-exception-time"
              element={<MarketExceptionTime />}
            />

            <Route path="test1" element={<Test1 />} />
          </Route>
        )}
      </Routes>
    </ScrollToTop>
  );
}

export default Router;
