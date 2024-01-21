import { useState } from "react";
import { Dropdown, Button, Form } from 'react-bootstrap';
import SimpleBar from 'simplebar-react';
import classNames from "classnames";

import Layout from '../../../layout/default';
import {
    CustomDropdownMenu, 
    CustomDropdownToggle, 
    Icon, 
    Image, 
    MediaGroup, 
    Media, 
    MediaText,
    Inbox,
    Asterisk,
    Reply,
    Tags,
    QuillMinimal
} from "../../../components";

import { toInitials, Break } from "../../../utilities";

function InboxPage() {
    const [selectedIndex] = useState(0);
    const [showInbox, setShowInbox] = useState(false);
    const [sidebar, setSidebar] = useState(false);
    
    // inbox menu data
    const inboxMenuData = [
        {
            id: 'uid01',
            title: 'Inbox',
            icon: 'inbox',
            status: 3
        },
        {
            id: 'uid02',
            title: 'Starred',
            icon: 'star'
        },
        {
            id: 'uid03',
            title: 'Snoozed',
            icon: 'clock'
        },
        {
            id: 'uid04',
            title: 'Sent',
            icon: 'send-alt'
        },
        {
            id: 'uid05',
            title: 'Drafts',
            icon: 'file-check',
            status: 1
        },
        {
            id: 'uid06',
            title: 'Spam',
            icon: 'caution',
            status: 6
        },
        {
            id: 'uid07',
            title: 'Trash',
            icon: 'trash'
        }
    ];

    // inbox data
    const inboxData = [
        {
            id: 'uid01',
            name: 'Leslie Alexander',
            email: 'leslie@gmail.com',
            avatar: '/images/avatar/a.jpg',
            title: 'Hiya',
            description: 'Nostrud irure ex duis ea quis id quis ad et. Sunt qui esse pariatur duis deserunt mollit dolore cillum minim tempor enim.',
            status: 'Promotions',
            time: '12:41 PM'
        },
        {
            id: 'uid02',
            name: 'Theresa Webb',
            email: 'theresa@gmail.com',
            avatar: '/images/avatar/b.jpg',
            title: 'Build prototypes without code',
            description: 'Sunt qui esse pariatur duis deserunt mollit dolore cillum minim tempor enim.',
            status: 'Updates',
            time: '12:10 PM'
        },
        {
            id: 'uid03',
            name: 'Albert Flores',
            email: 'albert@gmail.com',
            avatar: '/images/avatar/c.jpg',
            title: 'Web Support Dennis',
            description: 'Duis ea quis id quis ad et. Sunt qui esse pariatur duis deserunt mollit dolore cillum minim tempor enim.',
            time: '12:01 PM'
        },
        {
            id: 'uid04',
            name: 'Mirko Fisuk',
            email: 'mirko@gmail.com',
            title: "Don't make this bad",
            description: 'Elit aute irure tempor incididunt sint deserunt ut voluptate aute id deserunt nisi.',
            time: '11:41 PM',
            theme: 'info',
        },
        {
            id: 'uid05',
            name: 'Ralph Edwards',
            email: 'ralph@gmail.com',
            avatar: '/images/avatar/d.jpg',
            title: 'Welcome to startmail',
            description: 'Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
            status: 'Socials',
            time: '11:15 PM'
        },
        {
            id: 'uid06',
            name: 'Annette Black',
            email: 'annette@gmail.com',
            avatar: '/images/avatar/e.jpg',
            title: 'Your account with us',
            description: 'Pariatur duis deserunt mollit dolore cillum minim tempor enim.',
            status: 'New',
            time: '11:10 PM'
        },
        {
            id: 'uid07',
            name: 'Olga Semklo',
            email: 'olga.s@cool.design',
            avatar: '/images/avatar/f.jpg',
            title: 'Some notes',
            description: 'Elit aute irure tempor cupidatat incididunt sint deserunt ut voluptate aute id deserunt nisi.',
            time: '11:02 PM'
        },
        {
            id: 'uid08',
            name: 'Travus Bruntjen',
            email: 'travus@gmail.com',
            theme: 'danger',
            title: 'Explore jobs similar to your job alert',
            description: 'Qui esse pariatur duis deserunt mollit dolore cillum minim tempor enim.',
            time: '10:55 PM'
        },
        {
            id: 'uid09',
            name: 'Saunder Offner',
            email: 'saunder@gmail.com',
            avatar: '/images/avatar/g.jpg',
            title: 'Share their thoughts on LinkedIn',
            description: 'Duis deserunt mollit dolore cillum minim tempor enim.',
            time: '10:41 PM'
        },
        {
            id: 'uid10',
            name: 'Vladamir Koschek',
            email: 'vladamir@gmail.com',
            avatar: '/images/avatar/h.jpg',
            title: 'Daily proofing digest email 10th September 2022',
            description: 'Nostrud irure ex duis ea quis id quis ad et. Sunt qui esse pariatur duis deserunt mollit dolore cillum minim tempor enim.',
            time: '10:34 PM'
        },
        {
            id: 'uid11',
            name: 'Stephen MacGilfoyle',
            email: 'stephen@gmail.com',
            avatar: '/images/avatar/i.jpg',
            title: 'New sign in to your Nioboad account',
            description: 'Nostrud irure ex duis ea quis id quis ad et. Sunt qui esse pariatur duis deserunt mollit dolore cillum minim tempor enim.',
            status: 'Important',
            time: '10:23 PM'
        },
        {
            id: 'uid12',
            name: 'Jane Montgomery',
            email: 'jane@gmail.com',
            avatar: '/images/avatar/j.jpg',
            title: 'The most awaited product sale of the year is finally here!',
            description: 'Pariatur duis deserunt mollit dolore cillum minim tempor enim.',
            time: '10:01 PM'
        },
        {
            id: 'uid13',
            name: 'Timothy Smith',
            email: 'timothysmith@gmail.com',
            avatar: '/images/avatar/k.jpg',
            title: 'Build prototypes without code',
            description: 'Nostrud irure ex duis ea quis id quis ad et. Sunt qui esse pariatur duis deserunt mollit dolore cillum minim tempor enim.',
            status: 'Project',
            time: '9:41 PM'
        },
        {
            id: 'uid14',
            name: 'Raymond Atkins',
            email: 'raymond@gmail.com',
            avatar: '/images/avatar/l.jpg',
            title: 'Build prototypes without code',
            description: 'Nostrud irure ex duis ea quis id quis ad et. Sunt qui esse pariatur duis deserunt mollit dolore cillum minim tempor enim.',
            time: '9:24 PM'
        },
        {
            id: 'uid15',
            name: 'Joshua Mcnair',
            email: 'joshua@gmail.com',
            avatar: '/images/avatar/m.jpg',
            title: 'Be a design visionary',
            description: 'Sunt qui esse pariatur duis deserunt mollit dolore cillum minim tempor enim.',
            status: 'Socials',
            time: '9:03 PM'
        }
    ];

    // slicing user from 0 to 4
    const contactUserData = [...inboxData].slice(0, 4);

    // toggle inbox view class
    const inboxViewClasses = classNames({
        'nk-ibx-view': true,
        'show-ibx': showInbox
    });

    // toggle inbox view class
    const inboxAsideClasses = classNames({
        'nk-ibx-aside': true,
        'show-aside': sidebar,
        'toggle-collapsed': window.innerWidth < Break.xxl
    });

    // inbox view handle
    const handleInboxToggle = () => {
        setShowInbox(!showInbox);
    }

    // inbox view handle hide
    const handleInboxHide = () => {
        setShowInbox(false);
    }

    // inbox view handle hide
    const handleAsideToggle = () => {
        setSidebar(!sidebar);
    }

    return (
        <Layout content="stretch" title="Mailbox | Inbox">
            <div className="nk-ibx" data-ibx-collapse="xl" id="ibxWrap">
                {window.innerWidth < Break.xxl && sidebar && (
                    <div onClick={handleAsideToggle} className="nk-overlay"></div>
                )}
                <SimpleBar className={inboxAsideClasses} id="ibxAside" data-overlay>
                    <div className="nk-ibx-aside-header">
                        <Button variant="primary"><span>Compose</span></Button>
                    </div>
                    <Inbox.Menu>
                        {inboxMenuData.map((item, index) =>
                            <Inbox.Menu.Item key={item.id} className={selectedIndex === index ? "active" : null}>
                                <Icon name={item.icon}></Icon>
                                <span>{item.title}</span>
                                {item.status && <span className="nk-ibx-menu-badge">{item.status}</span>}
                            </Inbox.Menu.Item>
                        )}
                    </Inbox.Menu>
                    <div className="nk-aside-heading mt-auto">
                        <div className="gap-col">
                            <h6 className="overline-title">Contact</h6>
                        </div>
                        <div className="gap-col">
                            <Dropdown>
                                <Dropdown.Toggle size="sm" as={CustomDropdownToggle} className="btn btn-sm btn-zoom btn-icon me-n1">
                                    <Icon name="more-h"></Icon>
                                </Dropdown.Toggle>
                                <Dropdown.Menu as={CustomDropdownMenu} align="end">
                                    <div className="dropdown-content py-1">
                                        <ul className="link-list is-compact">
                                            <li>
                                                <a href="/#">
                                                    <em cIconsname="plus"></em>
                                                    <span>Add Contact</span>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="/#">
                                                    <em cIconsname="users"></em>
                                                    <span>All Contact</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                    <ul className="nk-ibx-contacts">
                        {contactUserData.map((item) => 
                            <li key={item.id}>
                                <a href="/#">
                                    <MediaGroup>
                                        <Media size="md" shape="circle" middle variant={item.theme && item.theme}>
                                            { item.avatar ? 
                                                <Image src={item.avatar} /> :
                                                <span>{toInitials(item.name)}</span>
                                            }
                                        </Media>
                                        <MediaText>
                                            <span className="title">{item.name}</span>
                                            <span className="text smaller">{item.email}</span>
                                        </MediaText>
                                    </MediaGroup>
                                </a>
                            </li>
                        )}
                    </ul>
                </SimpleBar>
                <div className="nk-ibx-body">
                    <div className="nk-ibx-head">
                        <Inbox.Tools>
                            <Inbox.Tools.Item>
                                <Media size="md" middle>
                                    <Form.Check className="form-check" id="check-all" />
                                </Media>
                            </Inbox.Tools.Item>
                            <Inbox.Tools.Item>
                                <button className="btn btn-md btn-zoom btn-icon">
                                    <Icon name="trash"></Icon>
                                </button>
                            </Inbox.Tools.Item>
                            <Inbox.Tools.Item>
                                <button className="btn btn-md btn-zoom btn-icon">
                                    <Icon name="redo"></Icon>
                                </button>
                            </Inbox.Tools.Item>
                            <Inbox.Tools.Item>
                                <button className="btn btn-md btn-zoom btn-icon">
                                    <Icon name="label"></Icon>
                                </button>
                            </Inbox.Tools.Item>
                            <Inbox.Tools.Item>
                                <Dropdown>
                                    <Dropdown.Toggle size="sm" as={CustomDropdownToggle} className="btn btn-md btn-zoom btn-icon">
                                        <Icon name="more-v"></Icon>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu as={CustomDropdownMenu} align="end">
                                        <div className="dropdown-content py-1">
                                            <ul className="link-list">
                                                <li><a href="/#"><Icon name="forward-arrow"></Icon><span>Move To</span></a></li>
                                                <li><a href="/#"><Icon name="archive"></Icon><span>Archive</span></a></li>
                                                <li><a href="/#"><Icon name="trash"></Icon><span>Delete</span></a></li>
                                            </ul>
                                        </div>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Inbox.Tools.Item>
                        </Inbox.Tools>
                        <div className="ms-auto d-flex align-items-center">
                            <Inbox.Search />
                            <Inbox.Navigation>
                                <Inbox.Navigation.Info />
                                <ul className="nk-ibx-head-nav">
                                    <li>
                                        <button className="btn btn-md btn-zoom btn-icon">
                                            <Icon name="chevron-left"></Icon>
                                        </button>
                                    </li>
                                    <li>
                                        <button className="btn btn-md btn-zoom btn-icon">
                                            <Icon name="chevron-right"></Icon>
                                        </button>
                                    </li>
                                    <li>
                                        <Dropdown className="d-md-none">
                                            <Dropdown.Toggle size="sm" as={CustomDropdownToggle} className="btn btn-md btn-zoom btn-icon">
                                                <Icon name="search"></Icon>
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu className="dropdown-menu-md" as={CustomDropdownMenu} align="end">
                                                <div className="px-4 py-1">
                                                    <Form.Group className="form-group">
                                                        <div className="form-control-wrap">
                                                            <Form.Control className="form-control-plaintext" type="text" placeholder="Search Email" />
                                                        </div>
                                                    </Form.Group>
                                                </div>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </li>
                                    <li className="nk-ibx-toggle">
                                        <Inbox.Toggle onClick={handleAsideToggle}/>
                                    </li>
                                </ul>
                            </Inbox.Navigation>
                        </div>
                    </div>
                    <Inbox>
                        {inboxData.map((item) => 
                             <Inbox.Item key={item.id} onClick={handleInboxToggle}>
                                <Inbox.Item.Elem className="nk-ibx-item-check">
                                    <Form.Check className="form-check" id={`ibx-${item.id}`} />
                                </Inbox.Item.Elem>
                                <Inbox.Item.Elem className="nk-ibx-item-star">
                                    <Asterisk />
                                </Inbox.Item.Elem>
                                <Inbox.Item.Elem className="nk-ibx-item-user">
                                    <MediaGroup>
                                        <Media size="md" shape="circle" middle variant={item.theme && item.theme}>
                                            { item.avatar ? 
                                                <Image src={item.avatar} /> :
                                                <span>{toInitials(item.name)}</span>
                                            }
                                        </Media>
                                        <MediaText>
                                            <span className="title">{item.name}</span>
                                            <span className="text smaller">{item.email}</span>
                                        </MediaText>
                                    </MediaGroup>
                                </Inbox.Item.Elem>
                                <Inbox.Item.Elem className="nk-ibx-item-content">
                                    <div className="d-flex flex-column">
                                        <div className="nk-ibx-item-title">
                                            <div className="nk-ibx-item-subject">{item.title}</div>
                                            <ul className="nk-ibx-item-tags">
                                                <li>
                                                    <span className={`badge text-bg-${
                                                        item.status === 'Promotions' ? 'info-soft' :
                                                        item.status === 'Updates' ? 'warning-soft' :
                                                        item.status === 'Socials' ? 'success-soft' :
                                                        item.status === 'New' ? 'danger-soft' :
                                                        item.status === 'Important' ? 'primary-soft' :
                                                        item.status === 'Project' ? 'pink-soft' :
                                                        'secondary-soft'
                                                    }`}
                                                >
                                                    {item.status}</span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="nk-ibx-item-message">{item.description}</div>
                                    </div>
                                </Inbox.Item.Elem>
                                <Inbox.Item.Elem className="nk-ibx-item-meta">
                                    <div className="time">{item.time}</div>
                                </Inbox.Item.Elem>
                            </Inbox.Item>
                        )}
                    </Inbox>
                    <div className={inboxViewClasses} id="ibxView">
                        <div className="nk-ibx-head">
                            <Inbox.Tools>
                                <Inbox.Tools.Item>
                                    <button onClick={handleInboxHide} className="btn btn-md btn-zoom btn-icon toggle-ibx-view">
                                        <Icon name="arrow-left"></Icon>
                                    </button>
                                </Inbox.Tools.Item>
                                <Inbox.Tools.Item>
                                    <button className="btn btn-md btn-zoom btn-icon">
                                        <Icon name="trash"></Icon>
                                    </button>
                                </Inbox.Tools.Item>
                                <Inbox.Tools.Item>
                                    <button className="btn btn-md btn-zoom btn-icon">
                                        <Icon name="redo"></Icon>
                                    </button>
                                </Inbox.Tools.Item>
                                <Inbox.Tools.Item>
                                    <button className="btn btn-md btn-zoom btn-icon">
                                        <Icon name="label"></Icon>
                                    </button>
                                </Inbox.Tools.Item>
                                <Inbox.Tools.Item>
                                    <Dropdown>
                                        <Dropdown.Toggle size="sm" as={CustomDropdownToggle} className="btn btn-md btn-zoom btn-icon">
                                            <Icon name="more-v"></Icon>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu as={CustomDropdownMenu} align="end">
                                            <div className="dropdown-content py-1">
                                                <ul className="link-list">
                                                    <li><a href="/#"><Icon name="forward-arrow"></Icon><span>Move To</span></a></li>
                                                    <li><a href="/#"><Icon name="archive"></Icon><span>Archive</span></a></li>
                                                    <li><a href="/#"><Icon name="trash"></Icon><span>Delete</span></a></li>
                                                </ul>
                                            </div>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Inbox.Tools.Item>
                            </Inbox.Tools>
                            <div className="ms-auto d-flex align-items-center">
                                <Inbox.Search />
                                <Inbox.Navigation>
                                    <Inbox.Navigation.Info />
                                    <ul className="nk-ibx-head-nav">
                                        <li>
                                            <button className="btn btn-md btn-zoom btn-icon">
                                                <Icon name="chevron-left"></Icon>
                                            </button>
                                        </li>
                                        <li>
                                            <button className="btn btn-md btn-zoom btn-icon">
                                                <Icon name="chevron-right"></Icon>
                                            </button>
                                        </li>
                                        <li>
                                            <Dropdown className="d-md-none">
                                                <Dropdown.Toggle size="sm" as={CustomDropdownToggle} className="btn btn-md btn-zoom btn-icon">
                                                    <Icon name="search"></Icon>
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu className="dropdown-menu-md" as={CustomDropdownMenu} align="end">
                                                    <div className="px-4 py-1">
                                                        <Form.Group className="form-group">
                                                            <div className="form-control-wrap">
                                                                <Form.Control className="form-control-plaintext" type="text" placeholder="Search Email" />
                                                            </div>
                                                        </Form.Group>
                                                    </div>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </li>
                                        <li className="nk-ibx-toggle">
                                            <Inbox.Toggle onClick={handleAsideToggle}/>
                                        </li>
                                    </ul>
                                </Inbox.Navigation>
                            </div>
                        </div>
                        <SimpleBar className="nk-ibx-reply nk-reply">
                            <Reply.Head />
                            <div className="nk-ibx-reply-group">
                                <Reply>
                                    <Reply.Header>
                                        <MediaGroup className="nk-reply-desc">
                                            <Media size="md" shape="circle" middle>
                                                <Image src="/images/avatar/a.jpg" alt="" />
                                            </Media>
                                            <MediaText className="nk-reply-info">
                                                <div className="nk-reply-author lead-text">Leslie Alexander <span className="date d-sm-none">14 Jan, 2020</span></div>
                                                <Dropdown className="nk-reply-msg-info">
                                                    <Dropdown.Toggle as={CustomDropdownToggle} className="dropdown-toggle sub-text dropdown-indicator align-items-center">
                                                        to Mildred
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu className="dropdown-menu-md" as={CustomDropdownMenu} align="end">
                                                        <ul className="nk-reply-msg-meta">
                                                            <li><span className="label">from:</span> <span className="info"><a href="/#">info@softnio.com</a></span></li>
                                                            <li><span className="label">to:</span> <span className="info"><a href="/#">team@softnio.com</a></span></li>
                                                            <li><span className="label">bcc:</span> <span className="info"><a href="/#">team@softnio.com</a></span></li>
                                                            <li><span className="label">mailed-by:</span> <span className="info"><a href="/#">softnio.com</a></span></li>
                                                        </ul>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                                <div className="nk-reply-msg-excerpt">
                                                    I am facing problem as i can not select currency on buy order page. Can you guys let me know what i am doing doing wrong? Please check attached files.
                                                </div>
                                            </MediaText>
                                        </MediaGroup>
                                    </Reply.Header>
                                    <Reply.Body>
                                        <p>Hello team,</p>
                                        <p>I am facing problem as i can not select currency on buy order page. Can you guys let me know what i am doing doing wrong? Please check attached files.</p>
                                        <p>Thank you <br /> Leslie</p>
                                    </Reply.Body>
                                </Reply>
                                <Reply>
                                    <Reply.Header>
                                        <MediaGroup className="nk-reply-desc">
                                            <Media size="md" shape="circle" middle variant="info">
                                                <span className="smaller">RE</span>
                                            </Media>
                                            <MediaText className="nk-reply-info">
                                                <div className="nk-reply-author lead-text">Ralph Edwards <span className="date d-sm-none">14 Jan, 2020</span></div>
                                                <Dropdown className="nk-reply-msg-info">
                                                    <Dropdown.Toggle as={CustomDropdownToggle} className="dropdown-toggle sub-text dropdown-indicator align-items-center">
                                                        to Mildred
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu className="dropdown-menu-md" as={CustomDropdownMenu} align="end">
                                                        <ul className="nk-reply-msg-meta">
                                                            <li><span className="label">from:</span> <span className="info"><a href="/#">info@softnio.com</a></span></li>
                                                            <li><span className="label">to:</span> <span className="info"><a href="/#">team@softnio.com</a></span></li>
                                                            <li><span className="label">bcc:</span> <span className="info"><a href="/#">team@softnio.com</a></span></li>
                                                            <li><span className="label">mailed-by:</span> <span className="info"><a href="/#">softnio.com</a></span></li>
                                                        </ul>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                                <div className="nk-reply-msg-excerpt">
                                                    I am facing problem as i can not select currency on buy order page. Can you guys let me know what i am doing doing wrong? Please check attached files.
                                                </div>
                                            </MediaText>
                                        </MediaGroup>
                                    </Reply.Header>
                                    <Reply.Body>
                                        <p>Hello,</p>
                                        <p>Can you guys let me know what i am doing doing wrong? Please check attached files.</p>
                                        <p>Thank you <br /> Ralph Edwards</p>
                                    </Reply.Body>
                                </Reply>
                            </div>
                            <div className="nk-ibx-reply-form nk-reply-form">
                                <div className="nk-reply-form-header">
                                    <div className="nk-reply-form-title d-sm-none">Reply</div>
                                    <div className="form-group form-inline align-items-center flex-nowrap w-100">
                                        <label className="label me-3">To</label>
                                        <div className="form-control-wrap w-100">
                                            <Tags className="form-control-plaintext" removeItemButton defaultValue="info@softnio.com" type="text" placeholder=""/>
                                        </div>
                                    </div>
                                </div>
                                <div className="nk-reply-form-editor">
                                    <QuillMinimal />
                                </div>
                                <div className="nk-reply-form-tools">
                                    <ul className="nk-reply-form-actions g-1">
                                        <li className="me-2">
                                            <Button className="rounded-pill" variant="primary" type="submit">Send</Button>
                                        </li>
                                        <li>
                                            <Dropdown>
                                                <Dropdown.Toggle as={CustomDropdownToggle} className="btn btn-icon btn-sm">
                                                    <Icon name="hash"></Icon>
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu as={CustomDropdownMenu}>
                                                    <div className="dropdown-content py-1">
                                                        <ul className="link-list is-compact">
                                                            <li><a href="/#"><span>Thank you message</span></a></li>
                                                            <li><a href="/#"><span>Your issues solved</span></a></li>
                                                            <li><a href="/#"><span>Thank you message</span></a></li>
                                                        </ul>
                                                    </div>
                                                    <div className="dropdown-content py-1 border-top border-light">
                                                        <ul className="link-list is-compact">
                                                            <li><a href="/#"><Icon name="file-plus"></Icon><span>Save as Template</span></a></li>
                                                            <li><a href="/#"><Icon name="notes-alt"></Icon><span>Manage Template</span></a></li>
                                                        </ul>
                                                    </div>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </li>
                                        <li>
                                            <a className="btn btn-icon btn-sm" href="/#" title="Upload Attachment">
                                                <Icon name="clip-v"></Icon>
                                            </a>
                                        </li>
                                        <li>
                                            <a className="btn btn-icon btn-sm" href="/#" title="Upload Images">
                                                <Icon name="img"></Icon>
                                            </a>
                                        </li>
                                    </ul>
                                    <ul className="nk-reply-form-actions g-1">
                                        <li>
                                            <a href="/#" className="btn-zoom btn btn-icon me-n2">
                                                <Icon name="trash"></Icon>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </SimpleBar>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default InboxPage;