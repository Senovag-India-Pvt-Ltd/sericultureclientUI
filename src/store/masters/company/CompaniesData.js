import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";

import { MediaGroup, Media, MediaText, Image, Icon, CustomDropdownToggle, CustomDropdownMenu, LinkList, LinkListItem } from "../../../components";
import { toInitials } from "../../../utilities";

// company table column
export const companyColumns = [
    {
        name: "Company",
        grow: 2,
        selector: (row) => row.name,
        cell: (row) => (
            <MediaGroup>
                <Media size="md" shape="circle" variant={row.theme && row.theme}>
                { row.avatar ? 
                    <Image src={row.avatar} staticImage/> :
                    <span className="smaller fw-medium">{toInitials(row.name)}</span>
                }
                </Media>
                <MediaText>
                    <Link to={`/masters/company-view/${row.id}`} className="title">{row.name}</Link>
                    {/* <span className="small text">{row.email}</span> */}
                </MediaText>
            </MediaGroup>
        ),
        sortable: true,
    },
    {
        name: "Description",
        selector: (row) => row.description,
        cell: (row) => (
            <span>{row.description}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "action",
        cell: (row) => (
            <div className="text-end w-100">
                <Dropdown>
                    <Dropdown.Toggle size="sm" as={CustomDropdownToggle} className="btn btn-sm btn-icon btn-zoom me-n1">
                        <Icon name="more-v"></Icon>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="dropdown-menu-sm" as={CustomDropdownMenu} align="end">
                        <div className="dropdown-content py-1">
                            <LinkList className="link-list-hover-bg-primary link-list-md">
                                <LinkListItem to={`/user-manage/user-edit/${row.id}`}>
                                    <Icon name="edit"></Icon><span>Edit</span>
                                </LinkListItem>
                                <LinkListItem to={`/user-manage/user-edit/${row.id}`}>
                                    <Icon name="trash"></Icon><span>Delete</span>
                                </LinkListItem>
                                <LinkListItem to={`/user-manage/user-profile/${row.id}`}>
                                    <Icon name="eye"></Icon><span>View Details</span>
                                </LinkListItem>
                            </LinkList>
                        </div>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        ),
        sortable: false,
        hide: "md",
    },
    
];

// company data
const companies = [
    {
        id:'uid01',
        name: 'M2 Groups',
        code:'115635',
        gstn:'GDYJH456HJ2d2s52',
        pan:'GDYRE456LJ',
        taan:'',
        bankName:'SBI',
        accName:'M2 Groups',
        accNo:586554645646646,
        branch:'Thirthahalli',
        ifsc:'SBIN0040142',
        bnkAddress:'Opp to taluk office',
        cmpAddress1:'Near Bettamakki Ground',
        cmpAddress2:'',
        cmpCity:'Thirthahalli',
        cmpState:'Karnataka',
        cmpCounty:'India',
        billAddress1:'Near Bettamakki Ground',
        billAddress2:'',
        billCity:'Thirthahalli',
        billState:'Karnataka',
        billCounty:'India',
        delAddress1:'Near Soppugudde',
        delAddress2:'',
        delCity:'Thirthahalli',
        delState:'Karnataka',
        delCounty:'India',
        description:'M2 Group Ltd was an Australian retailer and wholesaler of telecommunications services as well as power, gas and insurance products'
    },
    {
        id:'uid02',
        name: 'Sun Steel Manufacturer',
        code:'225635',
        gstn:'GDYRE456HJ2d2s52',
        pan:'GDYRE456HJ',
        taan:'',
        bankName:'Canara',
        accName:'Sun Steel',
        accNo:586554645646646,
        branch:'Thirthahalli',
        ifsc:'CNRB0000571',
        bnkAddress:'Gandhi Chowk',
        cmpAddress1:'Near Bettamakki Ground',
        cmpAddress2:'',
        cmpCity:'Thirthahalli',
        cmpState:'Karnataka',
        cmpCounty:'India',
        billAddress1:'Near Bettamakki Ground',
        billAddress2:'',
        billCity:'Thirthahalli',
        billState:'Karnataka',
        billCounty:'India',
        delAddress1:'Near Bettamakki Ground',
        delAddress2:'',
        delCity:'Thirthahalli',
        delState:'Karnataka',
        delCounty:'India',
        description:'Sunsteel Industries Limited offers the most cost-effective, high-quality engineering and design services around. With our consulting, designing, prototyping'

        
    },
    {
        id:'uid03',
        name: 'Moon Steel Manufacturer',
        code:'335635',
        gstn:'GDYRE456HJ2d2s52',
        pan:'GDYRE456HJ',
        taan:'',
        bankName:'Axis',
        accName:'Moon Steel',
        accNo:586554645646646,
        branch:'Thirthahalli',
        ifsc:'UTIB0004057',
        bnkAddress:'Near Junior College Road',
        cmpAddress1:'Near Sibinkere',
        cmpAddress2:'',
        cmpCity:'Thirthahalli',
        cmpState:'Karnataka',
        cmpCounty:'India',
        billAddress1:'Near Bettamakki Ground',
        billAddress2:'',
        billCity:'Thirthahalli',
        billState:'Karnataka',
        billCounty:'India',
        delAddress1:'Near Bettamakki Ground',
        delAddress2:'',
        delCity:'Thirthahalli',
        delState:'Karnataka',
        delCounty:'India',
        description:'Established in year 2009, Moon Steel is the leading Manufacturer, Trader and Service Provider of CNC Cutting Services, Mild Steel Sheets, Mild Steel Flanges '
    },
];

export default companies;
