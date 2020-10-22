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

export default function VotingEventForm({voteEvent, event_id}) {
	const classes = useStyles();
	const [event_name, setEventName] = useState("");
	const [year, setEventYear] = useState("");
	const [vote_start, setVoteStart] = useState("");
	const [vote_end, setVoteEnd] = useState("");
	var CRUD = "Create";
	if(voteEvent){
		CRUD = "Update";
	}

	useEffect(()=>{
		if(voteEvent){
			setEventName(voteEvent.event_name);
			setEventYear(voteEvent.year);
			setVoteStart(voteEvent.vote_start);
			setVoteEnd(voteEvent.vote_end);
		}
	},[voteEvent])

	const createEvent = async () => {
		console.log("Create");
		const newEvent = {event_name, year, vote_start, vote_end};
		const response = await fetch("/voting-events/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(newEvent)
		});
		if(response.ok) {
			console.log("Created event");
			window.location.replace("/voting_events");
		} else {
			console.log("Didnt create event");
		}
	}

	const updateEvent = async () => {
		console.log("Update");
		const updateEvent = {event_name, year, vote_start, vote_end};
		const response = await fetch("/voting-events/"+event_id+"/update", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(updateEvent)
		});
		if(response.status == "204") {
			console.log("Updated event");
			window.location.replace("/voting_events");
		} else {
			console.log("Didnt update event");
		}
	}

	return(
		<form className={classes.root} noValidate autoComplete="off">
		<h1>{CRUD} Voting Event</h1>
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
		<div>
			<TextField
				required
				id="vote_start"
				label="Vote Start Date"
				value={vote_start}
				onChange={(event) => setVoteStart(event.target.value)}
				type="date"
				helperText="Start date of the voting event"
				variant="outlined"
				InputLabelProps={{
					shrink: true,
				}}
			/>
			<TextField
				required
				id="vote_end"
				label="Vote End Date"
				value={vote_end}
				onChange={(event) => setVoteEnd(event.target.value)}
				type="date"
				helperText="End date of the voting event"
				variant="outlined"
				InputLabelProps={{
					shrink: true,
				}}
			/>
		</div>
		<div className={classes.root}>
			<Button variant="contained" color="primary" onClick={ e => {
				voteEvent ?
					updateEvent()
				:
					createEvent()}
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
