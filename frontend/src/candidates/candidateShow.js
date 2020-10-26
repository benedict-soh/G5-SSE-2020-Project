import React, {Component, useEffect, useState} from 'react';
import NavigationTopBar from '../navigation/NavigationTopBar'
import {Route, withRouter, Switch, Link} from "react-router-dom";
import { TextField,Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import '../App.css';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
		'& > *': {
      margin: theme.spacing(1),
    },
  },
}));

const excludeArr = {0: "Included", 1: "Excluded"};

export default function CandidateShow(props) {
  const id = props.match.params.id;
	const classes = useStyles();
  const [candidate_name, setCandidateName] = useState("");
  const [exclude, setExclude] = useState("");
  const [candidate_order, setCandidateOrder] = useState("");
  const [party_name, setPartyName] = useState("");
	const [v_event_id, setEventID] = useState("");
  const [event_name, setEventName] = useState("");
	const [year, setEventYear] = useState("");
	const [vote_start, setVoteStart] = useState("");
	const [vote_end, setVoteEnd] = useState("");

  useEffect(() => {
    if(id) {
      var party_id;
      fetch('/candidates/'+id).then(response =>
        response.json().then(data => {
          setCandidateName(data.candidate_name);
          setExclude(excludeArr[data.exclude]);
          setCandidateOrder(data.candidate_order);
          if(data.candidate_order == null) setCandidateOrder("N/A");
          party_id = data.party_id;
          return fetch('/voting-events/'+data.v_event_id);
        }).then(function(response) {
          return response.json();
        }).then(function(data) {
          var date = new Date(data.vote_start);
          var day = ('0' + date.getDate()).slice(-2);
          var mon = ('0' + (date.getMonth() + 1)).slice(-2);
          var year = date.getFullYear();
          var vstart = day + "/" + mon + "/" + year;
          date = new Date(data.vote_end);
          day = ('0' + date.getDate()).slice(-2);
          mon = ('0' + (date.getMonth() + 1)).slice(-2);
          year = date.getFullYear();
          var vend = day + "/" + mon + "/" + year;
          setEventID(data.id);
          setEventName(data.event_name);
          setEventYear(data.year);
          setVoteStart(vstart);
          setVoteEnd(vend);
          return fetch('/parties/'+party_id);
        }).then(function(response) {
          return response.json();
        }).then(function(data) {
          setPartyName(data.party_name);
        })
      );
    }
  }, [])

	return(
		<div className={classes.root}>
    <h1>ID: {id}</h1>
		<h1>{candidate_name}</h1>
    <h2>{exclude}</h2>
    <h3><u>Associated Party Information</u></h3>
    <h3>Party Name: {party_name}</h3>
    <h3>Candidate Order: {candidate_order}</h3>
    <h3><u>Associated Voting Event Information</u></h3>
    <h3>Event Name: {event_name}</h3>
    <h3>Year: {year}</h3>
    <h3>Vote Start Date: {vote_start}</h3>
    <h3>Vote Start End: {vote_end}</h3>
    <Link to={"/candidates/update/"+id}>
      <Button variant="contained" color="primary">
        Edit
      </Button>
    </Link>
    <Button variant="contained"
      color="secondary"
      onClick={async() => {
        const response = await fetch("/candidates/"+id+"/delete", {
          method: "DELETE"
        });
        if(response.ok) {
          console.log("Deleted candidate");
          window.location.replace("/candidates");
        } else {
          console.log("Didnt delete candidate");
        }
      }}>
        Delete
    </Button>
    <Link to={"/voting_events/"+v_event_id+"/candidates/"}>
      <Button variant="contained">
        Back to Candidates
      </Button>
    </Link>
		</div>
		)
}
