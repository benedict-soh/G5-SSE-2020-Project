import React, {Component, useState, useEffect} from 'react';
import NavigationTopBar from '../navigation/NavigationTopBar'
import {Route, withRouter, Switch, useParams} from "react-router-dom";
import '../App.css';
import CandidateForm from "./candidateForm"
import {withAuthorisation} from "../components/AuthWrapper"

function CandidateCreate(props) {
  const id = props.match.params.id;
  const [voting_event, setVotingEvent] = useState('');

  useEffect(() => {
    if(id) {
      fetch('/voting-events/'+id).then(response =>
        response.json().then(data => {
          console.log(data);
          setVotingEvent(data);
        })
      );
    }
  }, [])

  return (
    <CandidateForm voting_event={voting_event} />
  )
}

export default withAuthorisation(CandidateCreate, "commissioner")
