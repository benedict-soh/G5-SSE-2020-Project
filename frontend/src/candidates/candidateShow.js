import React, {Component, useEffect, useState} from 'react';
import NavigationTopBar from '../navigation/NavigationTopBar'
import {Route, withRouter, Switch, Link} from "react-router-dom";
import { TextField,Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import '../App.css';
import {withAuthorisation} from "../components/AuthWrapper"
import { get_candidate_all } from "../utils/API";

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

function CandidateShow(props) {
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
      async function fetchData() {
        const response = await get_candidate_all(id);
        setCandidateName(response.candidate.candidate_name);
        setExclude(excludeArr[response.candidate.exclude]);
        setCandidateOrder(response.candidate.candidate_order);

        var date = new Date(response.votingEvent.vote_start);
        var day = ('0' + date.getDate()).slice(-2);
        var mon = ('0' + (date.getMonth() + 1)).slice(-2);
        var year = date.getFullYear();
        var vstart = day + "/" + mon + "/" + year;
        date = new Date(response.votingEvent.vote_end);
        day = ('0' + date.getDate()).slice(-2);
        mon = ('0' + (date.getMonth() + 1)).slice(-2);
        year = date.getFullYear();
        var vend = day + "/" + mon + "/" + year;
        setEventID(response.votingEvent.id);
        setEventName(response.votingEvent.event_name);
        setEventYear(response.votingEvent.year);
        setVoteStart(vstart);
        setVoteEnd(vend);

        setPartyName(response.party.party_name);
      }

      fetchData();
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
          window.location.replace("/voting_events/"+v_event_id+"/candidates");
        } else {
          console.log("Didnt delete candidate");
        }
      }}>
        Delete
    </Button>
    <Link to={`/voting_events/${v_event_id}/candidates`}>
      <Button variant="contained">
        Back to Candidates
      </Button>
    </Link>
		</div>
		)
}

export default withAuthorisation(CandidateShow, "commissioner")
