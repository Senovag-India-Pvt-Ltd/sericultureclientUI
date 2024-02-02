import React, {useState} from 'react'

import {Popover,OverlayTrigger, Modal, Row, Col,Button} from 'react-bootstrap'

import { monthList } from '../../utilities'
import toTwelve from '../../utilities/toTwelve'

import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import bootstrapPlugin from '@fullcalendar/bootstrap'
import listPlugin from '@fullcalendar/list'

function renderEventContent(eventInfo) {
  const timeText = eventInfo.timeText, 
        title = eventInfo.event._def.title, 
        description = eventInfo.event._def.extendedProps.description, 
        view = eventInfo.view.type,
        popover = (
          <Popover className='event-popover'>
            <Popover.Header as="h3">{title}</Popover.Header>
            <Popover.Body>{description}</Popover.Body>
          </Popover>
        )
  return (
    <>
      {timeText && (view === 'dayGridMonth') && <div className="fc-daygrid-event-dot"></div>}
      {timeText && <div className="fc-event-time">{timeText}</div>}
      <div className="fc-event-title">{title}</div>
      <OverlayTrigger trigger={['hover','focus']} placement="top" overlay={popover}>
        <div className='fc-event-popover' style={{position:'absolute', inset: '0'}}></div>
      </OverlayTrigger>
      
    </>
  )
}

function Calendar({eventData, addEventForm}) {
  // eslint-disable-next-line 
    const selectEvent = []
    const [events, setEvents] = useState(eventData);
    const [selectedEvent, setSelectedEvent] = useState(selectEvent);
    const [previewModal, setPreviewModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [formModal, setFormModal] = useState(false);

    function closePreviewModal(){
      setPreviewModal(false);
    }

    function openDeleteModal(){
      setPreviewModal(false);
      setDeleteModal(true);
    }

    function closeDeleteModal(){
      setDeleteModal(false);
    }

    function openFormModal(){
      setFormModal(true);
    }

    function closeFormModal(){
      setFormModal(false);
    }

    const globalFcStyle = `
        .fc-list-event-title {
          position:relative;
        }
    `;
    
    function handleEventClick(eventInfo){
      let title = eventInfo.event._def.title;
      let description = eventInfo.event._def.extendedProps.description;
      let start = eventInfo.event._instance.range.start;
      let startDate = start.getFullYear() + '-' + String(start.getMonth() + 1).padStart(2, '0') + '-' + String(start.getDate()).padStart(2, '0');
      let startDateEng = String(start.getDate()).padStart(2, '0') + ' ' + monthList[start.getMonth()] + ' ' + start.getFullYear();
      let startTime = start.toUTCString().split(' '); startTime = startTime[startTime.length-2]; startTime = (startTime === '00:00:00') ? '' : startTime;
      let end = eventInfo.event._instance.range.end;
      let endDate = end.getFullYear() + '-' + String(end.getMonth() + 1).padStart(2, '0') + '-' + String(end.getDate()).padStart(2, '0');
      let endDateEng = String(end.getDate()).padStart(2, '0') + ' ' + monthList[end.getMonth()] + ' ' + end.getFullYear();
      let endTime = end.toUTCString().split(' '); endTime = endTime[endTime.length-2]; endTime = (endTime === '00:00:00') ? '' : endTime;
      // let className = eventInfo.event._def.ui.classNames[0].slice(3);
      let eventId = eventInfo.event._def.publicId;


      const currentEvent = {...selectedEvent, 
        id:eventId,
        title:title, 
        description:description, 
        startTime: startTime,
        startDate: startDate,
        startDateEng: startDateEng,
        endTime: endTime,
        endDate: endDate,
        endDateEng: endDateEng,
      }
      setSelectedEvent(currentEvent);
      setPreviewModal(true)
    }

    function handleDeleteEvent(){
      const updatedEvents = events.filter((item) => item.id !== selectedEvent.id)
      setEvents(updatedEvents);
      setDeleteModal(false);
    }

    return (
      <>
        <style>{globalFcStyle}</style>
        <FullCalendar
            events= {events}
            plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin, bootstrapPlugin, listPlugin ]}
            initialView="dayGridMonth"
            timeZone= 'UTC'
            themeSystem= 'bootstrap'

            headerToolbar= {{
                left: 'title prev,next',
                center: null,
                right: 'today dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            }}
            height= {800}
            contentHeight= {780}
            aspectRatio= {3}
            editable= {true}
            droppable= {true}
            views= {{
                dayGridMonth: {
                    dayMaxEventRows: 2,
                }
            }}
            eventContent={renderEventContent}
            eventClick={handleEventClick}
        />
        <Modal show={previewModal} onHide={closePreviewModal}>
            <Modal.Header closeButton>
              <Modal.Title className="event-title" as="h4">{selectedEvent.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                <Row className="g-3">
                    <Col xs="6">
                        <h6 className="overline-title">Start Time</h6>
                        <p className="event-start small">{selectedEvent.startDateEng} {(selectedEvent.startTime && ` - ${toTwelve(selectedEvent.startTime)}`)}</p>
                    </Col>
                    <Col xs="6">
                        <h6 className="overline-title">End Time</h6>
                        <p className="event-end small">{selectedEvent.endDateEng} {(selectedEvent.endTime && ` - ${toTwelve(selectedEvent.endTime)}`)}</p>
                    </Col>
                    <Col xs="12">
                        <h6 className="overline-title">Event Details</h6>
                        <p className="event-description small">{selectedEvent.description}</p>
                    </Col>
                </Row>
              </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={openDeleteModal}>Delete</Button>
                <Button variant="primary">Edit Event</Button>
            </Modal.Footer>
        </Modal>

        <Modal show={deleteModal} onHide={closeDeleteModal}>
              <div className="modal-content">
                  <div className="modal-body p-5 text-center">
                      <div className="media media-rounded media-xxl media-middle mx-auto text-bg-danger mb-4"><em className="icon ni ni-cross"></em></div>
                      <h3>Are You Sure ?</h3>
                      <p className="small">This event data will be removed permanently.</p>
                      <ul className="d-flex gap g-3 justify-content-center pt-1">
                          <li><Button variant="success" onClick={handleDeleteEvent}>Yes Delete it!</Button></li>
                          <li><Button variant="danger" className="btn-soft" onClick={closeDeleteModal}>Cancel</Button></li>
                      </ul>
                  </div>
                  <button type="button" className="btn-close position-absolute top-0 end-0 p-3" onClick={closeDeleteModal} aria-label="Close"></button>
              </div>
        </Modal>

        <Modal show={formModal} onHide={closeFormModal}>
            <Modal.Header closeButton>
              <Modal.Title className="event-title" as="h4"></Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>

              </div>
            </Modal.Body>
            <Modal.Footer>
            </Modal.Footer>
        </Modal>

      </>
    )
}

export default Calendar