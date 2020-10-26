import React, {Component, useState, useEffect} from 'react';
import NavigationTopBar from '../navigation/NavigationTopBar'
import {Route, withRouter, Switch, useParams} from "react-router-dom";
import '../App.css';
import PartyForm from "./partyForm"
import {withAuthorisation} from "../components/AuthWrapper"

function PartyCreate(props) {
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
    <PartyForm voting_event={voting_event} />
  )
}

export default withAuthorisation(PartyCreate, "commissioner")
