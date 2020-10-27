import React, {Component, useEffect, useState} from 'react';
import NavigationTopBar from '../navigation/NavigationTopBar'
import {Route, withRouter, Switch, Link} from "react-router-dom";
import { TextField,Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import '../App.css';
import {withAuthorisation} from "../components/AuthWrapper"
import { create_event, update_event } from '../utils/API'

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

function VotingEventForm({voteEvent, event_id}) {
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
		const newEvent = {event_name, year, vote_start, vote_end};
		const response = await create_event(newEvent);
		if(response.ok) {
			console.log("Created event");
			window.location.replace("/voting_events");
		} else {
			console.log("Didnt create event");
		}
	}

	const updateEvent = async () => {
		const updateEvent = {event_name, year, vote_start, vote_end};
		const response = await update_event(event_id, updateEvent);
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
      <Link to={"/voting_events/"}>
  			<Button variant="contained" color="secondary">
          Cancel
        </Button>
      </Link>
		</div>
		</form>
		)
}

export default withAuthorisation(VotingEventForm, "commissioner")
