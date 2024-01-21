import { useEffect, useState } from "react";
import { Dropdown, Form, Button, Badge } from 'react-bootstrap';
import classNames from "classnames";
import SimpleBar from 'simplebar-react';

import Layout from '../../../layout/default';
import { ChatList, CustomDropdownMenu, CustomDropdownToggle, Icon, Image, MediaGroup, Media, MediaText, Message, ChatMedia  } from '../../../components';

import { Break } from "../../../utilities";

function ChatsPage() {
    const [sidebar, setSidebar] = useState(false);
    const [mobileView, setMobileView] = useState(false);
    const [active, setActive] = useState('');

    // toggle chat profiel class
    const chatProfileClasses = classNames({
        'nk-chat-profile': true,
        'show-profile': sidebar,
        'toggle-collapsed': window.innerWidth < Break.xxl
    });

    // toggle chat parent class
    const parentClasses = classNames({
        'nk-chat': true,
        'profile-shown': sidebar && window.innerWidth > Break.xxl
    });

    // toggle chat body class
    const chatBodyClasses = classNames({
        'nk-chat-body': true,
        'show-chat': mobileView
    });

    const windowResize = () => {
        if (window.innerWidth > Break.xxl) {
          setSidebar(true);
        } else {
          setSidebar(false);
        }
    };

    // chat profile handle
    const handleChatToggle = () => {
        setSidebar(!sidebar);
    }

    // handle chat list toggle
    const handleChatListToggle = (ev) => {
        setActive(ev);

        if (window.innerWidth < Break.md) {
            setMobileView(true);
        }
    }

    // hide showing chat
    const handleChatListHide = () => {
        setMobileView(false);
    }

    useEffect(() => {
        window.addEventListener("resize", windowResize);

        windowResize();

        return () => {
          window.removeEventListener("resize", windowResize);
        };

    }, []);


    const chatUserListData = [
        {
            id: 'uid01',
            avatar: '/images/avatar/a.jpg',
            name: 'Jessica Drew',
            description: 'Ok, see you later',
            time: '18:30',
            status: 2
        },
        {
            id: 'uid02',
            avatar: '/images/avatar/b.jpg',
            name: 'David Moore',
            description: "You: i don't remember anything 😄",
            time: '18:16'
        },
        {
            id: 'uid03',
            avatar: '/images/avatar/c.jpg',
            name: 'Greg James',
            description: 'I got a job at SpaceX 🎉 🚀',
            time: '18:02',
        },
        {
            id: 'uid04',
            avatar: '/images/avatar/d.jpg',
            name: 'Emily Dorson',
            description: 'Table for four, 5PM. Be there.',
            time: '17:42',
        }
    ];

    const mediaData = [
        {
            id: 1,
            src: '/images/avatar/a.jpg'
        },
        {
            id: 2,
            src: '/images/avatar/b.jpg'
        },
        {
            id: 3,
            src: '/images/avatar/c.jpg'
        },
        {
            id: 4,
            src: '/images/avatar/d.jpg'
        },
        {
            id: 5,
            src: '/images/avatar/e.jpg'
        },
        {
            id: 6,
            src: '/images/avatar/f.jpg'
        },
        {
            id: 7,
            src: '/images/avatar/g.jpg'
        },
        {
            id: 8,
            src: '/images/avatar/h.jpg',
            icon: 'play-fill'
        }
    ];

    return (
        <Layout content="stretch" title="Message | Chats">
            <div className={parentClasses} id="chatWrap">
                <div className="nk-chat-aside">
                    <div className="nk-aside-heading pt-4">
                        <div className="gap-col">
                            <h2 className="title">Chats</h2>
                        </div>
                        <div className="gap-col">
                            <Dropdown>
                                <Dropdown.Toggle size="sm" as={CustomDropdownToggle} className="btn btn-sm btn-icon btn-zoom me-n1">
                                    <Icon name="more-h"></Icon>
                                </Dropdown.Toggle>
                                <Dropdown.Menu as={CustomDropdownMenu} align="end">
                                    <div className="dropdown-content py-1">
                                        <ul className="link-list is-compact">
                                            <li>
                                                <a href="#new-chat">
                                                    <em className="icon ni ni-plus"></em>
                                                    <span>New Chat</span>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#new-contact">
                                                    <em className="icon ni ni-user"></em>
                                                    <span>New Contact</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                    <SimpleBar className="nk-chat-aside-scroll">
                        <div className="nk-aside-content py-2">
                            <Form.Group className="form-group">
                                <div className="form-control-wrap">
                                    <div className="form-control-icon end">
                                        <Icon name="search"></Icon>
                                    </div>
                                    <Form.Control type="text" className="rounded-pill" id="searchChat" placeholder="Search" />
                                </div>
                            </Form.Group>
                        </div>
                        <ChatList>
                            {chatUserListData.map((item, index) => {
                                return(
                                    <ChatList.Item 
                                        key={item.id} 
                                        onClick={() => handleChatListToggle(index)}
                                        className={active === index ? 'active' : ''}
                                    >
                                        <MediaGroup>
                                            <Media shape="circle" middle>
                                                <Image src={item.avatar} alt={item.name} />
                                            </Media>
                                            <MediaText>
                                                <span className="title">
                                                    <span>{item.name}</span> 
                                                    <span className="date">{item.time}</span>
                                                </span>
                                                <span className="text smaller">
                                                    <span>{item.description}</span> 
                                                    {item.status && <Badge bg="success" pill>{item.status}</Badge>}
                                                </span>
                                            </MediaText>
                                        </MediaGroup>
                                    </ChatList.Item> 
                                )
                            })}
                        </ChatList>
                    </SimpleBar>
                </div>

                <div className={chatBodyClasses} id="chatBody">
                    <div className="nk-chat-head">
                        <ul className="nk-chat-head-tools me-1 ms-n1 d-md-none">
                            <li>
                                <Button size="sm" variant="zoom" className="btn-icon toggle-close-chat" onClick={handleChatListHide}>
                                    <Icon name="arrow-left"></Icon>
                                </Button>
                            </li>
                        </ul>
                        <MediaGroup>
                            <Media shape="circle" middle>
                                <Image src="/images/avatar/c.jpg" alt="" />
                            </Media>
                            <MediaText>
                                <span className="title"><span>David Moore</span></span>
                                <span className="text smaller"><span>Active</span></span>
                            </MediaText>
                        </MediaGroup>
                        <ul className="nk-chat-head-tools gap gx-md-2 me-n2">
                            <li>
                                <Button size="md" variant="zoom" className="btn-icon">
                                    <Icon name="call"></Icon>
                                </Button>
                            </li>
                            <li>
                                <Button size="md" variant="zoom" className="btn-icon">
                                    <Icon name="video"></Icon>
                                </Button>
                            </li>
                            <li>
                                <Button size="md" variant="zoom" className={`btn-icon toggle-chat-profile ${sidebar ? 'active' : 'inActive'}`} onClick={handleChatToggle}>
                                    <Icon name="info-fill"></Icon>
                                </Button>
                            </li>
                        </ul>
                    </div>
                    <SimpleBar className="nk-chat-panel">
                        <div className="nk-message-wrap">
                            <Message avatar="/images/avatar/a.jpg" isYou>
                                <ul className="nk-message-bubbles">
                                    <li>
                                        <div className="nk-message-bubble has-media">
                                            <ul className="nk-message-media">
                                                <li>
                                                    <Image src="/images/avatar/a.jpg" alt="" />
                                                </li>
                                                <li>
                                                    <Image src="/images/avatar/c.jpg" alt="" />
                                                </li>
                                            </ul>
                                            <ul className="nk-message-meta">
                                                <li>15:42</li>
                                                <li>Unread</li>
                                            </ul>
                                        </div>
                                        <Message.Actions />
                                    </li>
                                </ul>
                            </Message>
                            <Message isMe>
                                <ul className="nk-message-bubbles">
                                    <li>
                                        <div className="nk-message-bubble">
                                            <div className="nk-message-text"> Hi, yes, David have found it, ask our concierge 👀 </div>
                                            <ul className="nk-message-meta">
                                                <li>15:42</li>
                                                <li>Seen</li>
                                            </ul>
                                        </div>
                                        <Message.Actions />
                                    </li>
                                </ul>
                            </Message>
                            <Message avatar="/images/avatar/a.jpg" isYou>
                                <ul className="nk-message-bubbles">
                                    <li>
                                        <div className="nk-message-bubble">
                                            <div className="nk-message-text">Hello! Have you seen my backpack anywhere in office?</div>
                                            <ul className="nk-message-meta">
                                                <li>15:42</li>
                                            </ul>
                                        </div>
                                        <Message.Actions />
                                    </li>
                                </ul>
                            </Message>
                            <Message isMe>
                                <ul className="nk-message-bubbles">
                                    <li>
                                        <div className="nk-message-bubble">
                                            <div className="nk-message-text">While you win in love, you continue to win in other things.</div>
                                            <ul className="nk-message-meta">
                                                <li>15:42</li>
                                            </ul>
                                        </div>
                                        <Message.Actions />
                                    </li>
                                </ul>
                            </Message>
                            <Message avatar="/images/avatar/a.jpg" isYou>
                                <ul className="nk-message-bubbles">
                                    <li>
                                        <div className="nk-message-bubble">
                                            <div className="nk-message-text">Didn't I tell you not to put your phone on charge just because it's the weekend?</div>
                                            <ul className="nk-message-meta">
                                                <li>12:42</li>
                                            </ul>
                                        </div>
                                        <Message.Actions />
                                    </li>
                                    <li>
                                        <div className="nk-message-bubble">
                                            <div className="nk-message-text">next time you'll be awake at this hour why not now</div>
                                            <ul className="nk-message-meta">
                                                <li>12:48</li>
                                            </ul>
                                        </div>
                                        <Message.Actions />
                                    </li>
                                </ul>
                            </Message>
                        </div>
                    </SimpleBar>
                    <div className="nk-chat-form">
                        <div className="nk-chat-input">
                            <ul className="nk-chat-input-btns">
                                <li>
                                    <Button size="sm" variant="zoom" className="btn-icon text-light">
                                        <Icon name="mic"></Icon>
                                    </Button>
                                </li>
                                <li>
                                    <Button size="sm" variant="zoom" className="btn-icon text-light">
                                        <Icon name="clip"></Icon>
                                    </Button>
                                </li>
                            </ul>
                            <div className="nk-chat-input-field">
                                <div className="form-control-wrap">
                                    <Form.Control size="md" type="text" placeholder="Start a new message" className="form-control-plaintext" />
                                </div>
                            </div>
                            <div className="nk-chat-input-send">
                                <Button size="sm" variant="zoom" className="btn-icon text-light">
                                    <Icon name="send"></Icon>
                                </Button>
                            </div>
                        </div>
                    </div>
                    {window.innerWidth < Break.xxl && sidebar && (
                        <div onClick={handleChatToggle} className="nk-overlay"></div>
                    )}
                    <SimpleBar className={chatProfileClasses} data-overlay>
                        <div className="nk-aside-content py-4 border-bottom border-light position-relative">
                            <MediaGroup column className="text-center py-2">
                                <Media size="big" shape="circle" middle>
                                    <Image src="/images/avatar/c.jpg" alt="" />
                                </Media>
                                <MediaText>
                                    <h3 className="mb-1">David Moore</h3>
                                    <span className="text smaller"><span>Product Designer @uikings</span></span>
                                </MediaText>
                            </MediaGroup>
                            <Dropdown className="position-absolute top-0 end-0 p-4">
                                <Dropdown.Toggle size="sm" as={CustomDropdownToggle} className="btn btn-sm btn-zoom btn-icon">
                                    <Icon name="more-h"></Icon>
                                </Dropdown.Toggle>
                                <Dropdown.Menu as={CustomDropdownMenu} align="end">
                                    <div className="dropdown-content py-1">
                                        <ul className="link-list is-compact">
                                            <li>
                                                <a href="/#"><Icon name="bell-off"></Icon><span>Mute</span></a>
                                            </li>
                                            <li>
                                                <a href="/#"><Icon name="user-cross"></Icon><span>Block</span></a>
                                            </li>
                                            <li>
                                                <a href="/#"><Icon name="alert"></Icon><span>Report</span></a>
                                            </li>
                                        </ul>
                                    </div>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="nk-aside-content py-4">
                            <div className="gap gy-3">
                                <div className="gap-col">
                                    <h5 className="title">Options</h5>
                                    <ul className="link-list link-list-base-light is-compact">
                                        <li>
                                            <a href="/#">
                                                <Icon name="edit"></Icon>
                                                <span>Edit Nickname</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="/#">
                                                <Icon name="search"></Icon>
                                                <span>Search In Conversation</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="/#">
                                                <Icon name="color-palette"></Icon>
                                                <span>Change Color</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="/#">
                                                <Icon name="bell-off"></Icon>
                                                <span>Mute Notifications</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="gap-col">
                                    <h5 className="title">Files</h5>
                                    <ul className="link-list link-list-base-light is-compact">
                                        <li>
                                            <a href="/#">
                                                <Icon name="folder-list"></Icon>
                                                <span>Data_Component.zip</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="/#">
                                                <Icon name="file-pdf"></Icon>
                                                <span>Checkout_responsive.pdf</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="/#">
                                                <Icon name="img"></Icon>
                                                <span>Commercial.jpeg</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="gap-col">
                                    <h5 className="title mb-3">Media</h5>
                                    <ChatMedia className="gap g-2 list4col">
                                        {mediaData.map((item) =>
                                            <ChatMedia.Item key={item.id} src={item.src} icon={item.icon} />
                                        )}
                                    </ChatMedia>
                                </div>
                            </div>
                        </div>
                    </SimpleBar>
                </div>
            </div>
        </Layout>
    )
}

export default ChatsPage;
