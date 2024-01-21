import { Dropdown } from "react-bootstrap";
import { Icon, CustomDropdownToggle, CustomDropdownMenu, LinkList, LinkListItem } from "../../components";


// case table column
export const escalateCaseColumns = [
    {
        name: "Transaction No",
        selector: (row) => row.transnum,
        cell: (row) => (
            <span>{row.transnum}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Case Name",
        selector: (row) => row.name,
        cell: (row) => (
            <span>{row.name}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Escalated From",
        selector: (row) => row.escalatedfrom,
        cell: (row) => (
            <span>{row.escalatedfrom}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Escalated To",
        selector: (row) => row.escalatedto,
        cell: (row) => (
            <span>{row.escalatedto}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Escalated On",
        selector: (row) => row.escalatedon,
        cell: (row) => (
            <span>{row.escalatedon}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Escalated By",
        selector: (row) => row.escalatedby,
        cell: (row) => (
            <span>{row.escalatedby}</span>
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
                                <LinkListItem to={`/crm/add-case-task`}>
                                    <Icon name="task"></Icon><span>Add Case Task</span>
                                </LinkListItem>
                                <LinkListItem to={`/crm/case-view/${row.id}`}>
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

// cases data
const escalateCases = [
    {
        id: 'uid01',
        transnum: 'DS5475',
        name: 'Case 1',
        escalatedfrom: 'Toph',
        escalatedto: 'Katara',
        escalatedon: '11/11/2019',
        escalatedby: 'Aang',
    },
    {
        id: 'uid02',
        transnum: 'DS5476',
        name: 'Case 2',
        escalatedfrom: 'Sokka',
        escalatedto: 'Katara',
        escalatedon: '22/11/2019',
        escalatedby: 'Aang',
    },
    {
        id: 'uid03',
        transnum: 'DS5477',
        name: 'Case 3',
        escalatedfrom: 'Azula',
        escalatedto: 'Zuko',
        escalatedon: '20/11/2019',
        escalatedby: 'Aang',
    },
];

export default escalateCases;
