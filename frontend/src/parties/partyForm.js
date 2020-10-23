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

export default function PartyForm({voting_event, party, party_id}) {
  const classes = useStyles();
  const [id, setID] = useState("");
  const [voting_events, setVotingEvents] = useState([]);
	const [party_name, setPartyName] = useState("");
  const [v_event_id, setEventID] = useState("");
  const [event_name, setEventName] = useState("");
  const [event_year, setEventYear] = useState("");
  const [vote_start, setVoteStart] = useState("");
  const [vote_end, setVoteEnd] = useState("");
	var CRUD = "Create";
	if(party){
		CRUD = "Update";
	}

	useEffect(()=>{
		if(party){
      console.log(party);
			setPartyName(party.party_name);
      fetch('/voting-events/'+party.v_event_id).then(response =>
        response.json().then(data => {
  				setEventName(data.event_name);
          setEventYear(data.year);
          setVoteStart(data.vote_start);
          setVoteEnd(data.vote_end);
          setID(party.v_event_id);
    			setEventID(party.v_event_id);
        })
      );
		}
	},[party])

  useEffect(() => {
    if(voting_event){
      setID(voting_event.id);
      setEventID(voting_event.id);
      setEventName(voting_event.event_name);
      setEventYear(voting_event.year);
      setVoteStart(voting_event.vote_start);
      setVoteEnd(voting_event.vote_end);
    }
  }, [voting_event])

	const createParty = async () => {
		console.log("Create");
		const newParty = {party_name, v_event_id: id};
		const response = await fetch("/parties/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(newParty)
		});
		if(response.ok) {
			console.log("Created party");
			window.location.replace("/voting_events/"+id+"/parties");
		} else {
			console.log("Didnt create party");
		}
	}

	const updateParty = async () => {
		console.log("Update");
		const updateParty = {party_name, v_event_id: id};
		const response = await fetch("/parties/"+party_id+"/update", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(updateParty)
		});
		if(response.status == "204") {
			console.log("Updated party");
			window.location.replace("/voting_events/"+id+"/parties");
		} else {
			console.log("Didnt update party");
		}
	}

  var date;
  var day;
  var mon;
  var year;
  var vstart;
  var vend;
  date = new Date(vote_start);
  day = date.getDate();
  mon = date.getMonth() + 1;
  year = date.getFullYear();
  vstart = day + "/" + mon + "/" + year;
  date = new Date(vote_end);
  day = date.getDate();
  mon = date.getMonth() + 1;
  year = date.getFullYear();
  vend = day + "/" + mon + "/" + year;
	return(
		<form className={classes.root} noValidate autoComplete="off">
		<h1>{CRUD} Party</h1>
		<div>
			<TextField
				required
				id="party-name"
				label="Party Name"
				value={party_name}
				onChange={(event) => setPartyName(event.target.value)}
				helperText="Name of the political party"
				variant="outlined"
			/>
      <TextField
        required
        id="v_event_id"
        select
        label="Voting Event"
        value={id}
        onChange={(event) => setEventID(event.target.value)}
        helperText="Associated voting event"
        variant="outlined"
        inputProps={{ readOnly: true }}
      >
      <MenuItem value={id}>{event_name} ({event_year}): {vstart} - {vend}</MenuItem>
      </TextField>
		</div>
		<div className={classes.root}>
			<Button variant="contained" color="primary" onClick={ e => {
				party ?
					updateParty()
				:
					createParty()}
			}>
        {CRUD} Party
      </Button>
      <Link to={"/voting_events/"+id+"/parties/"}>
  			<Button variant="contained" color="secondary">
          Cancel
        </Button>
      </Link>
		</div>
		</form>
		)
}
