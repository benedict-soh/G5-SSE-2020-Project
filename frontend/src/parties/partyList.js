import React, {Component, useEffect, useState} from 'react';
import NavigationTopBar from '../navigation/NavigationTopBar'
import {Route, withRouter, Switch} from "react-router-dom";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import VotingEventRows from '../components/voting_events_rows'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import '../App.css';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 20,
  },
}))(TableCell);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

export default function VotingEventList() {
	const [voting_events, setVotingEvents] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    fetch('/voting-events').then(response =>
      response.json().then(data => {
        // for(var i=0;i<data.length;i++) {
        //   rows.push({data[i].id, data[i].event_name, data[i].vote_start, data[i].vote_end});
        // }


        // setEvents(data.events);
				setVotingEvents(data);
        console.log("Test");
				console.log(data);
      })
    );
  }, [])

	return(
			<div style={{ height: 300, width: '100%' }}>
        <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Event Name</StyledTableCell>
              <StyledTableCell align="right">Year</StyledTableCell>
              <StyledTableCell align="right">Vote Start Date</StyledTableCell>
              <StyledTableCell align="right">Vote End Date</StyledTableCell>
              <StyledTableCell align="right">Edit Event</StyledTableCell>
              <StyledTableCell align="right">Delete Event</StyledTableCell>
            </TableRow>
          </TableHead>
          <VotingEventRows voting_events={voting_events} />
        </Table>
      </TableContainer>
    </div>
		);
}

// <h2>Voting Event Read Page</h2>
// <VotingEvent voting_events={voting_events} />
