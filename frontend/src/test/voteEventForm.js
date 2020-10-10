import React, {Component, useState} from 'react';
import NavigationTopBar from '../navigation/NavigationTopBar'
import {Route, withRouter, Switch} from "react-router-dom";
import '../App.css';

const EventForm = () =>{
	const [event_name, setEventName] = useState("");
	const [year, setEventYear] = useState("");
	const [vote_start, setVoteStart] = useState("");
	const [vote_end, setVoteEnd] = useState("");

	return(
			<form>
						<h2>Voting Event Page</h2>
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
						<button type="submit" onClick={async () => {
							const newEvent = {event_name, year, vote_start, vote_end};
							newEvent.vote_start = ('20-11-15');
							newEvent.vote_end = ('20-11-16');
							console.log(newEvent);
							console.log(JSON.stringify(newEvent));
							const response = await fetch("/voting-events/create", {
								method: "POST",
	              headers: {
	                "Content-Type": "application/json"
	              },
	              body: JSON.stringify(newEvent)
	            });
							console.log(response);

							console.log(newEvent);
							if(response.ok) {
								console.log("Created event");
							} else {
								console.log("Didnt create event");
							}
						}}>
						Submit Event</button>
			</form>
		)
}

export default EventForm;
