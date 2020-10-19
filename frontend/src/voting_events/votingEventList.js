import React, {Component, useEffect, useState} from 'react';
import NavigationTopBar from '../navigation/NavigationTopBar'
import {Route, withRouter, Switch} from "react-router-dom";
import { VotingEvent } from "../components/voting_events";
import '../App.css';

const VotingEventList = () =>{
	const [voting_events, setVotingEvents] = useState([]);

  useEffect(() => {
    fetch('/voting-events').then(response =>
      response.json().then(data => {
        // setEvents(data.events);
				setVotingEvents(data);
				console.log(data);
      })
    );
  }, [])

	return(
			<div>
			<h2>Voting Event Read Page</h2>
      <VotingEvent voting_events={voting_events} />
      </div>
		);
}

export default VotingEventList;
