import React, {Component, useEffect} from 'react';
import NavigationTopBar from '../navigation/NavigationTopBar'
import {Route, withRouter, Switch} from "react-router-dom";
import '../App.css';

const TestIndex = () =>{
	useEffect(() => {
		fetch("/voting-events/").then(response =>
			response.json().then(data => {
				console.log(data);
			})
		)
	}, [])

	return(
			<form>
						<h2>Voting Event Page</h2>
						<label for="event_name">Event name:</label>
						<input id="event_name" type="text" />
						<label for="year">Event name:</label>
						<input id="year" type="number" />
						<label for="vote_start">Vote start date:</label>
						<input id="vote_start" type="date" />
						<label for="vote_end">Vote end date:</label>
						<input id="vote_end" type="date" />
						<input type="submit" value="Submit Voting Event" />
			</form>
		)
}

export default TestIndex;
