import React, {Component, useEffect, useState} from 'react';
import NavigationTopBar from '../navigation/NavigationTopBar'
import {Route, withRouter, Switch} from "react-router-dom";
import { VotingEvent } from "../components/voting_events";
import { DataGrid, RowsProp, ColDef } from '@material-ui/data-grid';
import '../App.css';


const rows: RowsProp = [
  { id: 1, event_name: 'Hello', year: 'World', vote_start: 'World', vote_end: 'World' },
];

const columns: ColDef[] = [
  { field: 'event_name', headerName: 'Event Name', width: 150 },
  { field: 'year', headerName: 'Event Year', width: 150 },
	{ field: 'vote_start', headerName: 'Vote Start', width: 150 },
	{ field: 'vote_end', headerName: 'Vote End', width: 150 },
];

export default function VotingEventList() {
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
			<div style={{ height: 300, width: '100%' }}>
			<DataGrid rows={rows} columns={columns} />
      </div>
		);
}

// <h2>Voting Event Read Page</h2>
// <VotingEvent voting_events={voting_events} />
