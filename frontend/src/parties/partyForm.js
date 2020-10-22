import React, {Component, useEffect, useState} from 'react';
import NavigationTopBar from '../navigation/NavigationTopBar'
import {Route, withRouter, Switch} from "react-router-dom";
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

export default function PartyForm({party, party_id}) {
	const classes = useStyles();
	const [party_name, setEventName] = useState("");
	const [v_event_id, setEventID] = useState("");
	var CRUD = "Create";
	if(party){
		CRUD = "Update";
	}

	useEffect(()=>{
		if(party){
			setPartyName(party.party_name);
			setEventID(party.v_event_id);
		}
	},[voteEvent])

	const createParty = async () => {
		console.log("Create");
		const newParty = {party_name, v_event_id};
		const response = await fetch("/parties/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(newParty)
		});
		if(response.ok) {
			console.log("Created party");
			window.location.replace("/parties");
		} else {
			console.log("Didnt create party");
		}
	}

	const updateEvent = async () => {
		console.log("Update");
		const updateParty = {party_name, v_event_id};
		const response = await fetch("/parties/"+party_id+"/update", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(updateParty)
		});
		if(response.status == "204") {
			console.log("Updated party");
			window.location.replace("/parties");
		} else {
			console.log("Didnt update party");
		}
	}

	return(
		<form className={classes.root} noValidate autoComplete="off">
		<h1>{CRUD} Party</h1>
		<div>
			<TextField
				required
				id="event-name"
				label="Event Name"
				value={event_name}
				onChange={(event) => setEventName(event.target.value)}
				helperText="Name of the voting event"
				variant="outlined"
			/>
			<TextField
				required
				id="year"
				label="Event Year"
				value={year}
				onChange={(event) => setEventYear(event.target.value)}
				type="number"
				helperText="Year of the voting event"
				variant="outlined"
			/>
		</div>
		<div className={classes.root}>
			<Button variant="contained" color="primary" onClick={ e => {
				party ?
					updateParty()
				:
					createParty()}
			}>
        {CRUD} Event
      </Button>
			<Button variant="contained" color="secondary">
        Cancel
      </Button>
		</div>
		</form>
		)
}


// <form>
// 			<h2>Voting Event {CRUD} Page</h2>
// 			<label for="event_name">Event name:</label>
// 			<input
// 				id="event_name"
// 				type="text"
// 				value={event_name}
// 				onChange={(event) => setEventName(event.target.value)}
// 				placeholder="Event Name"
// 				required />
// 			<label for="year">Event Year:</label>
// 			<input
// 				id="year"
// 				type="number"
// 				value={year}
// 				onChange={(event) => setEventYear(event.target.value)}
// 				placeholder="2020"
// 				required />
// 			<label for="vote_start">Vote Start Date:</label>
// 			<input
// 				id="vote_start"
// 				type="date"
// 				value={vote_start}
// 				onChange={(event) => setVoteStart(event.target.value)}
// 				required />
// 			<label for="vote_end">Vote End Date:</label>
// 			<input
// 				id="vote_end"
// 				type="date"
// 				value={vote_end}
// 				onChange={(event) => setVoteEnd(event.target.value)}
// 				required />
// 			<button type="button" onClick={ e => {
// 				voteEvent ?
// 					updateEvent()
// 				:
// 					createEvent()}
// 			}>
// 			Submit Event</button>
// </form>
