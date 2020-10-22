import React, {Component, useEffect, useState} from 'react';
import NavigationTopBar from '../navigation/NavigationTopBar'
import {Route, withRouter, Switch, Link} from "react-router-dom";
import { TextField,Button } from '@material-ui/core';
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

export default function VotingEventShow(props) {
  const id = props.match.params.id;
	const classes = useStyles();
	const [event_name, setEventName] = useState("");
	const [year, setEventYear] = useState("");
	const [vote_start, setVoteStart] = useState("");
	const [vote_end, setVoteEnd] = useState("");

  useEffect(() => {
    if(id) {
      fetch('/voting-events/'+id).then(response =>
        response.json().then(data => {
          // setEvents(data.events);

          // Format the data
          var date = new Date(data.vote_start);
          var day = ('0' + date.getDate()).slice(-2);
          var mon = ('0' + (date.getMonth() + 1)).slice(-2);
          var year = date.getFullYear();
          var vstart = day + "/" + mon + "/" + year;
          date = new Date(data.vote_end);
          day = ('0' + date.getDate()).slice(-2);
          mon = ('0' + (date.getMonth() + 1)).slice(-2);
          year = date.getFullYear();
          var vend = day + "/" + mon + "/" + year;
          setEventName(data.event_name);
          setEventYear(data.year);
          setVoteStart(vstart);
          setVoteEnd(vend);
          console.log(data);
        })
      );
    }
  }, [])

	return(
		<div>
    <h1>ID: {id}</h1>
		<h1>{event_name}</h1>
    <h2>Year: {year}</h2>
    <h3>Vote Start Date: {vote_start}</h3>
    <h3>Vote Start End: {vote_end}</h3>
    <Link to={"/voting_events/update/"+id}>
      <Button variant="contained" color="primary">
        Edit
      </Button>
    </Link>
    <Button variant="contained"
      color="secondary"
      onClick={async() => {
        const response = await fetch("/voting-events/"+id+"/delete", {
          method: "DELETE"
        });
        if(response.ok) {
          console.log("Deleted event");
          window.location.replace("/voting_events");
        } else {
          console.log("Didnt delete event");
        }
      }}>
        Delete
    </Button>
    <Link to={"/voting_events/"}>
      <Button variant="contained">
        Back to Voting Events
      </Button>
    </Link>
		</div>
		)
}
