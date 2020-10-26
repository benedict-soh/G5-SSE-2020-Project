import React, {Component, useState, useEffect} from 'react';
import NavigationTopBar from '../navigation/NavigationTopBar'
import {Route, withRouter, Switch, useParams} from "react-router-dom";
import '../App.css';
import VotingEventForm from "./votingEventForm"
import {withAuthorisation} from "../components/AuthWrapper"

function VotingEventEdit(props) {
  const id = props.match.params.id;
  const [voteEvent, setVoteEvent] = useState('');

  useEffect(() => {
    if(id) {
      fetch('/voting-events/'+id).then(response =>
        response.json().then(data => {
          // Format the data
          var date = new Date(data.vote_start);
          var day = ('0' + date.getDate()).slice(-2);
          var mon = ('0' + (date.getMonth() + 1)).slice(-2);
          var year = date.getFullYear();
          var vstart = year + "-" + mon + "-" + day;
          date = new Date(data.vote_end);
          day = ('0' + date.getDate()).slice(-2);
          mon = ('0' + (date.getMonth() + 1)).slice(-2);
          year = date.getFullYear();
          var vend = year + "-" + mon + "-" + day;
          data.vote_start = vstart;
          data.vote_end = vend;
          setVoteEvent(data);
        })
      );
    }
  }, [])

  return (
    <VotingEventForm voteEvent={voteEvent} event_id={id} />
  )
}

export default withAuthorisation(VotingEventEdit, "commissioner")
