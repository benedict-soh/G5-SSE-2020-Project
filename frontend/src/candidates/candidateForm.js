import React, {Component, useEffect, useState} from 'react';
import NavigationTopBar from '../navigation/NavigationTopBar'
import {Route, withRouter, Switch, Link} from "react-router-dom";
import { TextField,Button,MenuItem } from '@material-ui/core';
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

export default function CandidateForm({candidate, candidate_id}) {
  const classes = useStyles();
  const [voting_events, setVotingEvents] = useState([]);
  const [parties, setParties] = useState([]);
  const [candidate_name, setCandidateName] = useState("");
  const [party_id, setPartyID] = useState("");
  const [exclude, setExclude] = useState("");
  const [candidate_order, setCandidateOrder] = useState("");
	const [v_event_id, setEventID] = useState("");
	var CRUD = "Create";
	if(candidate){
		CRUD = "Update";
	}

	useEffect(()=>{
		if(candidate){
			setCandidateName(candidate.candidate_name);
			setEventID(candidate.v_event_id);
      if(candidate.party_id != null) setPartyID(candidate.party_id);
      else setPartyID(-1);
      setExclude(candidate.exclude);
      setCandidateOrder(candidate.candidate_order);
		}
	},[candidate])

  useEffect(() => {
    fetch('/voting-events').then(response =>
      response.json().then(data => {
				setVotingEvents(data);
      })
    );
  }, [])

  useEffect(() => {
    fetch('/parties').then(response =>
      response.json().then(data => {
				setParties(data);
      })
    );
  }, [])

	const createCandidate = async () => {
		console.log("Create");
		const newCandidate = {candidate_name, v_event_id, party_id, exclude, candidate_order};
    newCandidate.candidate_order = parseInt(newCandidate.candidate_order);
    if(party_id == -1) updateCandidate.party_id = null;
		const response = await fetch("/candidates/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(newCandidate)
		});
		if(response.ok) {
			console.log("Created party");
			window.location.replace("/candidates");
		} else {
			console.log("Didnt create party");
		}
	}

	const updateCandidate = async () => {
		console.log("Update");
		const updateCandidate = {candidate_name, v_event_id, party_id, exclude, candidate_order};
    updateCandidate.candidate_order = parseInt(updateCandidate.candidate_order);
    if(party_id == -1) updateCandidate.party_id = null;
		const response = await fetch("/candidates/"+candidate_id+"/update", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(updateCandidate)
		});
		if(response.status == "204") {
			console.log("Updated candidate");
			window.location.replace("/candidates");
		} else {
			console.log("Didnt update candidate");
		}
	}

  var date;
  var day;
  var mon;
  var year;
  var vstart;
  var vend;
	return(
		<form className={classes.root} noValidate autoComplete="off">
		<h1>{CRUD} Candidate</h1>
		<div>
			<TextField
				required
				id="candidate-name"
				label="Candidate Name"
				value={candidate_name}
				onChange={(event) => setCandidateName(event.target.value)}
				helperText="Name of the candidate"
				variant="outlined"
			/>
      <TextField
        required
        id="v_event_id"
        select
        label="Voting Event"
        value={v_event_id}
        onChange={(event) => setEventID(event.target.value)}
        helperText="Associated voting event"
        variant="outlined"
      >
      return (
        {voting_events.map((row) => {
          date = new Date(row.vote_start);
          day = date.getDate();
          mon = date.getMonth() + 1;
          year = date.getFullYear();
          vstart = day + "/" + mon + "/" + year;
          date = new Date(row.vote_end);
          day = date.getDate();
          mon = date.getMonth() + 1;
          year = date.getFullYear();
          vend = day + "/" + mon + "/" + year;
          return (
            <MenuItem value={row.id}>{row.event_name} ({row.year}): {vstart} - {vend}</MenuItem>
          )
        })}
      )
      </TextField>
      <TextField
        required
        id="party_id"
        select
        label="Associated Party"
        value={party_id}
        onChange={(event) => setPartyID(event.target.value)}
        helperText="Associated party of the candidate"
        variant="outlined"
      >
        <MenuItem value="-1">No Party</MenuItem>
      return (
        {parties.map((row) => {
          return (
            <MenuItem value={row.id}>{row.party_name}</MenuItem>
          )
        })}
      )
      </TextField>
		</div>
    <div>
      <TextField
        required
        id="exclude"
        select
        label="Exclude Candidate"
        value={exclude}
        onChange={(event) => setExclude(event.target.value)}
        helperText="Determines whether candidate shows on the ballot"
        variant="outlined"
      >
        <MenuItem value='1'>Exclude Candidate</MenuItem>
        <MenuItem value='0'>Include Candidate</MenuItem>
      </TextField>
      <TextField
				required
				id="candidate_order"
				label="Candidate Order"
				value={candidate_order}
				onChange={(event) => setCandidateOrder(event.target.value)}
				type="number"
				helperText="Order on the ballot if candidate belongs to party"
				variant="outlined"
			/>
    </div>
		<div className={classes.root}>
			<Button variant="contained" color="primary" onClick={ e => {
				candidate ?
					updateCandidate()
				:
					createCandidate()}
			}>
        {CRUD} Candidate
      </Button>
      <Link to={"/candidates/"}>
  			<Button variant="contained" color="secondary">
          Cancel
        </Button>
      </Link>
		</div>
		</form>
		)
}
