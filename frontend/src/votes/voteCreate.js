import React, {Component, useState, useEffect} from 'react';
import NavigationTopBar from '../navigation/NavigationTopBar'
import {Route, withRouter, Switch, useParams} from "react-router-dom";
import '../App.css';
import VoteForm from "./voteForm"

export default function VoteCreate(props) {
  const id = props.match.params.id;
  const [voting_event, setVotingEvent] = useState('');

  useEffect(() => {
    if(id) {
      fetch('/voting-events/'+id).then(response =>
        response.json().then(data => {
          setVotingEvent(data);
        })
      );
    }
  }, [])

  return (
    <VoteForm voting_event={voting_event} />
  )
}
