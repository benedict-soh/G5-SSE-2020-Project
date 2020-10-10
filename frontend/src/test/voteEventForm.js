import React, {Component, useState} from 'react';
import NavigationTopBar from '../navigation/NavigationTopBar'
import {Route, withRouter, Switch} from "react-router-dom";
import '../App.css';

const EventForm = () =>{
	const [eventName, setEventName] = useState("");
	const [eventYear, setEventYear] = useState("");
	const [voteStart, setVoteStart] = useState("");
	const [voteEnd, setVoteEnd] = useState("");

	return(
			<form>
						<h2>Voting Event Page</h2>
						<label for="event_name">Event name:</label>
						<input
							id="event_name"
							type="text"
							value={eventName}
							onChange={(event) => setEventName(event.target.value)}
							placeholder="Event Name"
							required />
						<label for="year">Event Year:</label>
						<input
							id="year"
							type="number"
							value={eventYear}
							onChange={(event) => setEventYear(event.target.value)}
							placeholder="2020"
							required />
						<label for="vote_start">Vote Start Date:</label>
						<input
							id="vote_start"
							type="date"
							value={voteStart}
							onChange={(event) => setVoteStart(event.target.value)}
							required />
						<label for="vote_end">Vote End Date:</label>
						<input
							id="vote_end"
							type="date"
							value={voteEnd}
							onChange={(event) => setVoteEnd(event.target.value)}
							required />
						<input type="submit" value="Submit Voting Event" />
			</form>
		)
}

export default EventForm;
