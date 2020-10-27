import React, {Component, useEffect, useState} from 'react';
import {Route, withRouter, Switch, Link} from "react-router-dom";
import { TextField,Button,MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { create_candidate, update_candidate, get_parties, get_event } from '../utils/API'

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

export default function CandidateForm({voting_event, candidate, candidate_id}) {
  const classes = useStyles();
  const [id, setID] = useState("");
  const [voting_events, setVotingEvents] = useState([]);
  const [parties, setParties] = useState([]);
  const [candidate_name, setCandidateName] = useState("");
  const [party_id, setPartyID] = useState("");
  const [exclude, setExclude] = useState("");
  const [candidate_order, setCandidateOrder] = useState("");
	const [v_event_id, setEventID] = useState("");
  const [event_name, setEventName] = useState("");
  const [event_year, setEventYear] = useState("");
  const [vote_start, setVoteStart] = useState("");
  const [vote_end, setVoteEnd] = useState("");
	var CRUD = "Create";
	if(candidate){
		CRUD = "Update";
	}

	useEffect(()=>{
		if(candidate){
      async function fetchData() {
        const partyResponse = await get_parties(candidate.v_event_id);
        setParties(partyResponse);
        setCandidateName(candidate.candidate_name);
        setID(candidate.v_event_id);
        setEventID(candidate.v_event_id);
        if(candidate.party_id != null) setPartyID(candidate.party_id);
        else setPartyID(-1);
        setExclude(candidate.exclude);
        setCandidateOrder(candidate.candidate_order);
        const eventResponse = await get_event(candidate.v_event_id);
        setEventName(eventResponse.event_name);
        setEventYear(eventResponse.year);
        setVoteStart(eventResponse.vote_start);
        setVoteEnd(eventResponse.vote_end);
      }

      fetchData();
		}
	},[candidate])

  useEffect(() => {
    if(voting_event){
      setID(voting_event.id);
      setEventID(voting_event.id);
      setEventName(voting_event.event_name);
      setEventYear(voting_event.year);
      setVoteStart(voting_event.vote_start);
      setVoteEnd(voting_event.vote_end);

      async function fetchData() {
        const response = await get_parties(voting_event.id);
        setParties(response);
      }

      fetchData();
    }
  }, [voting_event])

	const createCandidate = async () => {
    var useExclude = exclude;
    if(exclude == "") useExclude = 0;
		const newCandidate = {candidate_name, v_event_id: id, party_id, exclude: useExclude, candidate_order: parseInt(candidate_order)};
    if(party_id == -1) delete newCandidate['party_id'];
    const response = await create_candidate(newCandidate);
		if(response.ok) {
			console.log("Created candidate");
			window.location.replace("/voting_events/"+id+"/candidates");
		} else {
			console.log("Didnt create candidate");
		}
	}

	const updateCandidate = async () => {
    var useExclude = exclude;
    if(exclude == "") useExclude = 0;
		const updateCandidate = {candidate_name, v_event_id: id, party_id, exclude: useExclude, candidate_order: parseInt(candidate_order)};
    if(party_id == -1) delete updateCandidate['party_id'];
    const response = await update_candidate(candidate_id, updateCandidate);
		if(response.status == "204") {
			console.log("Updated candidate");
			window.location.replace("/voting_events/"+id+"/candidates");
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
		<form className={classes.root} autoComplete="off">
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
        value={id}
        onChange={(event) => setID(event.target.value)}
        helperText="Associated voting event"
        variant="outlined"
        inputProps={{ readOnly: true }}
      >
      <MenuItem value={id}>{event_name} ({event_year}): {vstart} - {vend}</MenuItem>
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
        helperText="Determines whether candidate shows on the ballot, included by default"
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
      <Link to={"/voting_events/"+id+"/candidates/"}>
  			<Button variant="contained" color="secondary">
          Cancel
        </Button>
      </Link>
		</div>
		</form>
		)
}
