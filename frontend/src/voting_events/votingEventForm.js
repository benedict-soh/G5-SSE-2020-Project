import React, {Component, useEffect, useState} from 'react';
import NavigationTopBar from '../navigation/NavigationTopBar'
import {Route, withRouter, Switch} from "react-router-dom";
import '../App.css';

const VotingEventForm = ({voteEvent, event_id}) =>{
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
			<form>
						<h2>Voting Event {CRUD} Page</h2>
						<label for="event_name">Event name:</label>
						<input
							id="event_name"
							type="text"
							value={event_name}
							onChange={(event) => setEventName(event.target.value)}
							placeholder="Event Name"
							required />
						<label for="year">Event Year:</label>
						<input
							id="year"
							type="number"
							value={year}
							onChange={(event) => setEventYear(event.target.value)}
							placeholder="2020"
							required />
						<label for="vote_start">Vote Start Date:</label>
						<input
							id="vote_start"
							type="date"
							value={vote_start}
							onChange={(event) => setVoteStart(event.target.value)}
							required />
						<label for="vote_end">Vote End Date:</label>
						<input
							id="vote_end"
							type="date"
							value={vote_end}
							onChange={(event) => setVoteEnd(event.target.value)}
							required />
						<button type="button" onClick={ e => {
							voteEvent ?
								updateEvent()
							:
								createEvent()}
						}>
						Submit Event</button>
			</form>
		)
}

export default VotingEventForm;
