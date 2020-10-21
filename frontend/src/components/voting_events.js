import React from 'react';
import {Link} from "react-router-dom";
import { FormControl } from '@material-ui/core';

export const VotingEvent = ({ voting_events }) => {
  var date;
  var day;
  var mon;
  var year;
  var vstart;
  var vend;
  return (
    <div>
    {voting_events.map(voting_event => {
      date = new Date(voting_event.vote_start);
      day = date.getDate();
      mon = date.getMonth() + 1;
      year = date.getFullYear();
      vstart = day + "/" + mon + "/" + year;
      date = new Date(voting_event.vote_end);
      day = date.getDate();
      mon = date.getMonth() + 1;
      year = date.getFullYear();
      vend = day + "/" + mon + "/" + year;
      return (
        <div><p>{voting_event.event_name} ({voting_event.year}): {vstart} - {vend}</p>
        <Link to={"/voting_events/update/"+voting_event.id}><button>Edit</button></Link>
        <button type="button"
        onClick={async() => {
          const response = await fetch("/voting-events/"+voting_event.id+"/delete", {
      			method: "DELETE"
      		});
      		if(response.ok) {
      			console.log("Deleted event");
      			window.location.replace("/voting_events");
      		} else {
      			console.log("Didnt delete event");
      		}
        }}>Delete</button></div>
      );
    })}
    </div>
  )
};
