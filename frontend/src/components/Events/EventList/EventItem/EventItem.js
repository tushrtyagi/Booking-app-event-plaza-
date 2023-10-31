// import React from 'react';

// import './EventItem.css';

// const EventItem = props => {


//   return (
//   <li key={props.eventId} className="events__list-item">
//     <div>
//       <h1>{props.title}</h1>
//       <h2>
//       Rs.{props.price} - {new Date(parseInt(props.date)).toLocaleDateString()}
//       </h2>
//     </div>
//     <div>
//       {props.userId === props.creatorId ? (
//         <p>Your the owner of this event.</p>
//       ) : (
//         <button className="btn" onClick={() => props.onDetail(props.eventId)}>
//           View Details
//         </button>
//       )}
//     </div>
//   </li>
//   );
// }


// export default EventItem;
import React from 'react';
import './EventItem.css';

const EventItem = props => (
  <li key={props.eventId} className="events__list-item">
    <div>
      <h1>{props.title}</h1>
      <h2>
        Rs.{props.price} -{' '}
        {new Date(parseInt(props.date)).toLocaleDateString()}
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
