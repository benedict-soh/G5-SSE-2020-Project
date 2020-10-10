import React, {Component, useEffect, useState} from 'react';
import NavigationTopBar from '../navigation/NavigationTopBar'
import {Route, withRouter, Switch} from "react-router-dom";
import { Events } from "../components/Events";
import '../App.css';

const EventList = () =>{
	const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('/voting-events').then(response =>
      response.json().then(data => {
        setEvents(data);
      })
    );
  }, [])

  console.log(events);

	return(
			<div>
      <Events events={events} />
      </div>
		);
}

export default EventList;
