
import React from 'react';
import './EventItem.css';

const EventItem = props => (
  <li key={props.eventId} className="events__list-item">
    <div>
      <h1>{props.title} {`(${new Date(parseInt(props.date)).toLocaleDateString()})`}</h1>
      <h2>
        Rs.{props.price} 
       
      </h2>
    </div>
    <div>
      {props.isOwner ? (
        <p>You're the owner of this event.</p>) /* <p>Event created by: {props.creatorId}</p> */
       : <button className="btn" onClick={() => props.onDetail(props.eventId)}>
        View Details
      </button>
      }
     
    
    </div>
  </li>
);

export default EventItem;
