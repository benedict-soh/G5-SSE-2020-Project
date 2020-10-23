import React, {Component, useEffect, useState} from 'react';
import NavigationTopBar from '../navigation/NavigationTopBar'
import {Route, withRouter, Switch, Link} from "react-router-dom";
import { TextField,Button,MenuItem } from '@material-ui/core';
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

export default function PartyForm({party, party_id}) {
  const classes = useStyles();
  const [voting_events, setVotingEvents] = useState([]);
	const [party_name, setPartyName] = useState("");
	const [v_event_id, setEventID] = useState("");
	var CRUD = "Create";
	if(party){
		CRUD = "Update";
	}

	useEffect(()=>{
		if(party){
			setPartyName(party.party_name);
			setEventID(party.v_event_id);
		}
	},[party])

  useEffect(() => {
    fetch('/voting-events').then(response =>
      response.json().then(data => {
				setVotingEvents(data);
      })
    );
  }, [])

	const createParty = async () => {
		console.log("Create");
		const newParty = {party_name, v_event_id};
		const response = await fetch("/parties/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(newParty)
		});
		if(response.ok) {
			console.log("Created party");
			window.location.replace("/parties");
		} else {
			console.log("Didnt create party");
		}
	}

	const updateParty = async () => {
		console.log("Update");
		const updateParty = {party_name, v_event_id};
		const response = await fetch("/parties/"+party_id+"/update", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(updateParty)
		});
		if(response.status == "204") {
			console.log("Updated party");
			window.location.replace("/parties");
		} else {
			console.log("Didnt update party");
		}
	}

  var date;
  var day;
  var mon;
  var year;
  var vstart;
  var vend;
	return(
		<form className={classes.root} noValidate autoComplete="off">
		<h1>{CRUD} Party</h1>
		<div>
			<TextField
				required
				id="party-name"
				label="Party Name"
				value={party_name}
				onChange={(event) => setPartyName(event.target.value)}
				helperText="Name of the political party"
				variant="outlined"
			/>
      <TextField
        required
        id="v_event_id"
        select
        label="Voting Event"
        value={v_event_id}
        onChange={(event) => setEventID(event.target.value)}
        helperText="Associated voting event"
        variant="outlined"
      >
      return (
        {voting_events.map((row) => {
          date = new Date(row.vote_start);
          day = date.getDate();
          mon = date.getMonth() + 1;
          year = date.getFullYear();
          vstart = day + "/" + mon + "/" + year;
          date = new Date(row.vote_end);
          day = date.getDate();
          mon = date.getMonth() + 1;
          year = date.getFullYear();
          vend = day + "/" + mon + "/" + year;
          return (
            <MenuItem value={row.id}>{row.event_name} ({row.year}): {vstart} - {vend}</MenuItem>
          )
        })}
      )
      </TextField>
		</div>
		<div className={classes.root}>
			<Button variant="contained" color="primary" onClick={ e => {
				party ?
					updateParty()
				:
					createParty()}
			}>
        {CRUD} Party
      </Button>
      <Link to={"/parties/"}>
  			<Button variant="contained" color="secondary">
          Cancel
        </Button>
      </Link>
		</div>
		</form>
		)
}
