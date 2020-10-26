import React, {Component, useEffect, useState} from 'react';
import NavigationTopBar from '../navigation/NavigationTopBar'
import {Route, withRouter, Switch, Link} from "react-router-dom";
import { TextField,Button,MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';

import '../App.css';

const useStyles = makeStyles((theme) => ({
  // root: {
  //   '& .MuiTextField-root': {
  //     margin: theme.spacing(1),
  //     width: '25ch',
  //   },
	// 	'& > *': {
  //     margin: theme.spacing(1),
  //   },
  // },
  root: {
    flexGrow: 1,
  	'& > *': {
      margin: theme.spacing(1),
    },
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
}));

function orderCompare( a, b ) {
  if ( a.candidate_order < b.candidate_order ){
    return -1;
  }
  if ( a.candidate_order > b.candidate_order ){
    return 1;
  }
  return 0;
}


export default function PartyForm({voting_event, party, party_id}) {
  const classes = useStyles();
  const [id, setID] = useState("");
  const [above, setAbove] = useState([]);
  const [below, setBelow] = useState([]);
  const [voting_events, setVotingEvents] = useState([]);
  const [parties, setParties] = useState([]);
  const [partiesDict, setPartiesDict] = useState([]);
  const [total_parties, setTotalParties] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [total_candidates, setTotalCandidates] = useState("");
	const [party_name, setPartyName] = useState("");
  const [v_event_id, setEventID] = useState("");
  const [event_name, setEventName] = useState("");
  const [event_year, setEventYear] = useState("");
  const [vote_start, setVoteStart] = useState("");
  const [vote_end, setVoteEnd] = useState("");

  // very inefficient way of handling these
  function handleAboveChange(e) {
    var partyId = parseInt((e.target.id).split("party-")[1]);
    var aboveNew = above;
    aboveNew[partyId] = parseInt(e.target.value);
    // console.log(aboveNew);
    setAbove(aboveNew);
  }

  function handleBelowChange(e) {
    var candidateId = parseInt((e.target.id).split("candidate-")[1]);
    var belowNew = below;
    belowNew[candidateId] = parseInt(e.target.value);
    // console.log(belowNew);
    setBelow(belowNew);
  }

  useEffect(() => {
    if(voting_event){
      setID(voting_event.id);
      setEventID(voting_event.id);
      setEventName(voting_event.event_name);
      setEventYear(voting_event.year);
      setVoteStart(voting_event.vote_start);
      setVoteEnd(voting_event.vote_end);
      var candidatesArr = {};
      candidatesArr[null] = [];
      fetch('/parties?v_event_id='+voting_event.id).then(response =>
        response.json().then(data => {
          setParties(data);
          setTotalParties(data.length);
          // Create a parties dictionary for reference later
          var partyArr = {};
          var aboveSetup = {};
          partyArr[null] = "No Party";
          for(var i=0;i<data.length;i++){
            partyArr[data[i].id] = data[i].party_name;
            candidatesArr[data[i].id] = [];
            aboveSetup[data[i].id] = -1;
            // aboveSetup.push({"party_id": data[i].id, "number": -1});
          }
          // console.log(JSON.stringify(aboveSetup));
          setAbove(aboveSetup);
          setPartiesDict(partyArr);
          return fetch('/candidates?v_event_id='+voting_event.id);
        }).then(function(response) {
          return response.json();
        }).then(function(data) {
          var belowSetup = {};
          var totalCand = 0;
          for(var i=0;i<data.length;i++){
            // console.log(data[i].party_id);
            // Map candidates to an array for sorting later
            if(!data[i].exclude) {
              candidatesArr[data[i].party_id].push(data[i]);
              if(data[i].party_id != null) candidatesArr[data[i].party_id].sort(orderCompare);
              belowSetup[data[i].id] = -1;
              // belowSetup.push({"candidate_id": data[i].id, "number": -1});
            }
          }
          // console.log(JSON.stringify(belowSetup));
          setBelow(belowSetup);
          setTotalCandidates(totalCand);
          setCandidates(candidatesArr);
        })
      );
    }
  }, [voting_event])

	const createVote = async () => {
		console.log("Create");
    var submitAbove = [];
    var submitBelow = [];
    // Process array to put into submit above and below
    for(var i=0;i<parties.length;i++) {
      if(above[parties[i].id] != -1) {
        submitAbove.push({"party_id": parties[i].id, "number": above[parties[i].id]});
      }
      if(candidates[parties[i].id]) {
        console.log(parties[i].id);
        for(var j=0;j<candidates[parties[i].id].length;j++){
          if(below[candidates[parties[i].id][j].id] != -1) {
            submitBelow.push({"candidate_id": candidates[parties[i].id][j].id, "number": below[candidates[parties[i].id][j].id]});
          }
        }
      }
    }
    // Handle null party case
    if(candidates[null]) {
      for(var j=0;j<candidates[null];j++){
        if(below[candidates[null][j].id] != -1) {
          submitBelow.push({"candidate_id": candidates[null][j].id, "number": below[candidates[null][j].id]});
        }
      }
    }
    const newVote = {v_event_id: id, vote_data: {above: submitAbove, below: submitBelow}};
    console.log(JSON.stringify(newVote));
		const response = await fetch("/votes/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(newVote)
		});
		if(response.ok) {
			console.log("Created vote");
			window.location.replace("/vote/");
		} else {
			console.log("Didnt create vote");
		}
	}

  var date;
  var day;
  var mon;
  var year;
  var vstart;
  var vend;
  date = new Date(vote_start);
  day = date.getDate();
  mon = date.getMonth() + 1;
  year = date.getFullYear();
  vstart = day + "/" + mon + "/" + year;
  date = new Date(vote_end);
  day = date.getDate();
  mon = date.getMonth() + 1;
  year = date.getFullYear();
  vend = day + "/" + mon + "/" + year;
	return(
		<form noValidate autoComplete="off">
		<h1>Vote in {event_name} ({vstart} - {vend})</h1>
    <hr/>
    <Grid container className={classes.root} spacing={3}>
        <Grid item xs={2}>
          <h3>You may<br/>
          vote in one of<br/>
          two ways<br/>
          <b>Either</b><br/>
          Above the line</h3>
          <p>By numbering at least <b>6</b><br/>
          of these boxes in the order<br/>
          of your choice (with number<br/>
          1 as your first choice)</p>
        </Grid>
        {parties.map((row) => {
          return (
            <Grid item xs spacing={3}>
              <TextField id={"party-"+row.id} label={row.party_name} type="number" inputProps={{ min: 1 }} variant="filled" onChange={handleAboveChange}/>
            </Grid>
          )
        })}
        <Grid item xs spacing={3}>
        </Grid>
    </Grid>
    <hr/>
    <Grid container className={classes.root} spacing={3}>
        <Grid item xs={2}>
          <h3><b>Or</b><br/>
          Below the line</h3>
          <p>By numbering at least <b>12</b><br/>
          of these boxes in the order<br/>
          of your choise (with number<br/>
          1 as your first choice).</p>
        </Grid>
        {parties.map((party) => {
          if(candidates[party.id]) {
            return (
              <Grid item xs spacing={3}>
              <h4>{partiesDict[party.id]}</h4>
                {candidates[party.id].map((row) => {
                  // console.log(row);
                  return (
                      <TextField id={"candidate-"+row.id} label={row.candidate_name} type="number" inputProps={{ min: 1 }} variant="filled" onChange={handleBelowChange}/>
                  )
                })}
              </Grid>
          )
          } else {
            return (
              <Grid item xs spacing={3}>
              </Grid>
            )
          }
        })}
        {candidates[null] &&
          <Grid item xs spacing={3}>
          <h4>No Party</h4>
          {candidates[null].map((row) => {
            // console.log(row);
            return (
              <TextField id={"candidate-"+row.id} label={row.candidate_name} type="number" inputProps={{ min: 1}} variant="filled" onChange={handleBelowChange}/>
            )
          })}
          </Grid>
        }
    </Grid>
    <hr/>
    <div className={classes.root}>
      <Button variant="contained" color="primary" onClick={ e => {createVote()}}>
        Submit Vote
      </Button>
      <Link to={"/vote/"}>
        <Button variant="contained" color="secondary">
          Cancel
        </Button>
      </Link>
    </div>
		</form>
		)
}
