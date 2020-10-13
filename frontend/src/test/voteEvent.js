import React, {Component, useEffect, useState} from 'react';
import NavigationTopBar from '../navigation/NavigationTopBar'
import {Route, withRouter, Switch} from "react-router-dom";
import { Events } from "../components/Events";
import '../App.css';

const EventList = () =>{
	const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('/voting_events').then(response =>
      response.json().then(data => {
        // setEvents(data.events);
				setEvents(data);
      })
    );
  }, [])

	return(
			<div>
			<h2>Voting Event Read Page</h2>
      <Events events={events} />
      </div>
		);
}

export default EventList;
