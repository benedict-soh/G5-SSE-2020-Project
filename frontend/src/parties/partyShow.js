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

const excludeArr = {0: "Included", 1: "Excluded"};

export default function PartyShow(props) {
  const id = props.match.params.id;
	const classes = useStyles();
  const [candidates, setCandidates] = useState([]);
  const [party_name, setPartyName] = useState("");
	const [v_event_id, setEventID] = useState("");
  const [event_name, setEventName] = useState("");
	const [year, setEventYear] = useState("");
	const [vote_start, setVoteStart] = useState("");
	const [vote_end, setVoteEnd] = useState("");

  useEffect(() => {
    if(id) {
      fetch('/parties/'+id).then(responseParty =>
        responseParty.json().then(dataParty => {
          setPartyName(dataParty.party_name);
          setEventID(dataParty.v_event_id);
          return fetch('/voting-events/'+dataParty.v_event_id);
        }).then(function(response) {
          return response.json();
        }).then(function(data) {
          console.log(data);
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
        })
      );
    }
  }, [])

  useEffect(() => {
    if(id) {
      fetch('/candidates?party_id='+id).then(response =>
        response.json().then(data => {
          setCandidates(data);
          console.log(data);
        })
      );
    }
  }, [])

	return(
		<div>
    <h1>ID: {id}</h1>
		<h1>{party_name}</h1>
    <h3><u>Associated Voting Event Information</u></h3>
    <h3>Event Name: {event_name}</h3>
    <h3>Year: {year}</h3>
    <h3>Vote Start Date: {vote_start}</h3>
    <h3>Vote Start End: {vote_end}</h3>
    <h3><u>Associated Candidates</u></h3>
    {candidates.map((row) => {
      return (
        <h3>[{excludeArr[row.exclude]}] {row.candidate_name} (Ballot Order: {row.candidate_order})</h3>
      )
    })}
    <Link to={"/parties/update/"+id}>
      <Button variant="contained" color="primary">
        Edit
      </Button>
    </Link>
    <Button variant="contained"
      color="secondary"
      onClick={async() => {
        const response = await fetch("/parties/"+id+"/delete", {
          method: "DELETE"
        });
        if(response.ok) {
          console.log("Deleted party");
          window.location.replace("/parties");
        } else {
          console.log("Didnt delete party");
        }
      }}>
        Delete
    </Button>
    <Link to={"/parties/"}>
      <Button variant="contained">
        Back to Parties
      </Button>
    </Link>
		</div>
		)
}
