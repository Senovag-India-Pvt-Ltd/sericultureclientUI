import { Dropdown } from "react-bootstrap";
import { Icon, CustomDropdownToggle, CustomDropdownMenu, LinkList, LinkListItem } from "../../components";


// task table column
export const SubsidyApprovalVerificationColumns = [
    {
        name: "Farmer ID",
        selector: (row) => row.fid,
        cell: (row) => (
            <span>{row.fid}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Financial Year",
        selector: (row) => row.financial,
        cell: (row) => (
            <span>{row.financial}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Farmer Name",
        selector: (row) => row.fname,
        cell: (row) => (
            <span>{row.fname}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Mobile",
        selector: (row) => row.mobile,
        cell: (row) => (
            <span>{row.mobile}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Category",
        selector: (row) => row.category,
        cell: (row) => (
            <span>{row.category}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Status",
        selector: (row) => row.status,
        cell: (row) => (
            <span style={{color:`${row.color}`,fontWeight:'bold'}}>{row.status}</span>
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
                                {/* <LinkListItem to={`/user-manage/user-edit/${row.id}`}> */}
                                <LinkListItem to={`/stake-holder-view/${row.id}`}>
                                    <Icon name="eye"></Icon><span>View</span>
                                </LinkListItem>
                                <LinkListItem to={`/stake-holder-registration`}>
                                    <Icon name="edit"></Icon><span>Modify</span>
                                </LinkListItem>
                                <LinkListItem to={`/user-manage/user-edit/${row.id}`}>
                                    <Icon name="property"></Icon><span>Approve/Reject</span>
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

// tasks data
const SubsidyApprovalVerificationDatas = [
    {
        fid: 'fid01',
        financial: '20/10/2023',
        fname: 'Basappa',
        mobile:'8098787890',
        category:'106(General)',
        status:'Pending',
        color:'orange'
    },
    {
        fid: 'fid02',
        financial: '20/10/2023',
        fname: 'Basappa',
        mobile:'8098787891',
        category:'422(SC)',
        status:'Approved',
        color:'green'
    },
    {
        fid: 'fid03',
        financial: '20/10/2023',
        fname: 'Basappa',
        mobile:'8098787892',
        category:'423(ST)',
        status:'Rejected',
        color:'red'
    },
];

export default SubsidyApprovalVerificationDatas;
