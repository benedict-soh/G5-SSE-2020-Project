import React, {Component, useEffect, useState} from 'react';
import NavigationTopBar from '../navigation/NavigationTopBar'
import {Route, withRouter, Switch, Link} from "react-router-dom";
import { TextField,Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import '../App.css';
import {withAuthorisation} from "../components/AuthWrapper"
import { get_event, delete_event, get_event_tally } from '../utils/API'

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

function VotingEventShow(props) {
  const id = props.match.params.id;
	const classes = useStyles();
  const [candidates, setCandidates] = useState([]);
  const [tally, setTally] = useState([]);
  const [partyTally, setPartyTally] = useState([]);
  const [candidateTally, setCandidateTally] = useState([]);
  const [parties, setParties] = useState([]);
  const [partiesDict, setPartiesDict] = useState([]);
	const [event_name, setEventName] = useState("");
	const [year, setEventYear] = useState("");
	const [vote_start, setVoteStart] = useState("");
	const [vote_end, setVoteEnd] = useState("");

  useEffect(() => {
    if(id) {
      async function fetchData() {
        var data = await get_event(id);
        var date = new Date(data.vote_start);
        var day = ('0' + date.getDate()).slice(-2);
        var mon = ('0' + (date.getMonth() + 1)).slice(-2);
        var year = date.getFullYear();
        var vstart = year + "-" + mon + "-" + day;
        date = new Date(data.vote_end);
        day = ('0' + date.getDate()).slice(-2);
        mon = ('0' + (date.getMonth() + 1)).slice(-2);
        year = date.getFullYear();
        var vend = year + "-" + mon + "-" + day;
        data.vote_start = vstart;
        data.vote_end = vend;
        setEventName(data.event_name);
        setEventYear(data.year);
        setVoteStart(vstart);
        setVoteEnd(vend);
      }

      fetchData();
    }
  }, [])

  useEffect(() => {
    if(id) {
      async function fetchData() {
        var data = await get_event_tally(id);
        var partyArr = {};
        partyArr[null] = "No Party";
        for(var i=0;i<data.parties.length;i++){
          partyArr[data.parties[i].id] = data.parties[i].party_name;
        }
        setPartiesDict(partyArr);
        setTally(data.tally);
        var parTally = {};
        var canTally = {};
        for(var i=0;i<data.tally.above.length;i++){
          parTally[data.tally.above[i].party_id] = data.tally.above[i].votes;
        }
        for(var i=0;i<data.tally.below.length;i++){
          canTally[data.tally.below[i].candidate_id] = data.tally.below[i].votes;
        }
        setPartyTally(parTally);
        setCandidateTally(canTally);
        setParties(data.parties);
        setCandidates(data.candidates);
      }

      fetchData();
    }
  }, [])

	return(
		<div className={classes.root}>
    <h1>ID: {id}</h1>
		<h1>{event_name}</h1>
    <h2>Year: {year}</h2>
    <h3>Vote Start Date: {vote_start}</h3>
    <h3>Vote Start End: {vote_end}</h3>
    <h3>Total Votes (Above/Below): {tally.total} ({tally.total_above}/{tally.total_below})</h3>
    <h3><u>Associated Parties</u></h3>
    {parties.map((row) => {
      return (
        <div>
        <h3>{row.party_name}</h3>
        <ul>
        {partyTally[row.id].map((voteRow) => {
          var pref = Object.entries(voteRow)[0][0];
          var votes = Object.entries(voteRow)[0][1];
          return (
            <li>Preference {pref} - {votes} Votes</li>
          )
        })}
        </ul>
        </div>
      )
    })}
    <h3><u>Associated Candidates</u></h3>
    {candidates.map((row) => {
      var ballOrder = row.candidate_order;
      if(row.candidate_order == null) ballOrder = "N/A";
      return (
        <div>
        <h3>[{excludeArr[row.exclude]}] {partiesDict[row.party_id]} - {row.candidate_name} (Ballot Order: {ballOrder})</h3>
        <ul>
        {candidateTally[row.id].map((voteRow) => {
          var pref = Object.entries(voteRow)[0][0];
          var votes = Object.entries(voteRow)[0][1];
          return (
            <li>Preference {pref} - {votes} Votes</li>
          )
        })}
        </ul>
        </div>
      )
    })}
    <div>
    <Link to={"/parties/create/"+id}>
      <Button variant="outlined" color="primary">
        Create Party for Event
      </Button>
    </Link>
    <Link to={"/voting_events/"+id+"/parties/"}>
      <Button variant="outlined" color="secondary">
        View All Parties for Event
      </Button>
    </Link>
    </div>
    <div>
    <Link to={"/candidates/create/"+id}>
      <Button variant="outlined" color="primary">
        Create Candidate for Event
      </Button>
    </Link>
    <Link to={"/voting_events/"+id+"/candidates/"}>
      <Button variant="outlined" color="secondary">
        View All Candidates for Event
      </Button>
    </Link>
    </div>
    <div>
    <Link to={"/voting_events/update/"+id}>
      <Button variant="contained" color="primary">
        Edit
      </Button>
    </Link>
    <Button variant="contained"
      color="secondary"
      onClick={async() => {
        const response =  await delete_event(id);
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
		</div>
		)
}

export default withAuthorisation(VotingEventShow, "commissioner")
