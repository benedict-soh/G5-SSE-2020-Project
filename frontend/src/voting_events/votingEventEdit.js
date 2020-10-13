import React, {Component, useState, useEffect} from 'react';
import NavigationTopBar from '../navigation/NavigationTopBar'
import {Route, withRouter, Switch, useParams} from "react-router-dom";
import '../App.css';
import VotingEventForm from "./votingEventForm"

export default function VotingEventEdit(props) {
  const id = props.match.params.id;
  const [voteEvent, setVoteEvent] = useState('');

  useEffect(() => {
    if(id) {
      fetch('/voting-events/'+id).then(response =>
        response.json().then(data => {
          // setEvents(data.events);
          setVoteEvent(data);
          console.log(id);
          console.log(data);
        })
      );
    }
  }, [])

  return (
    <VotingEventForm voteEvent={voteEvent} event_id={id} />
  )
}
