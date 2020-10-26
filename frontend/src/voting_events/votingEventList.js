import React, {Component, useEffect, useState} from 'react';
import NavigationTopBar from '../navigation/NavigationTopBar'
import {Route, withRouter, Switch, Link} from "react-router-dom";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import VotingEventRows from '../components/voting_events_rows'
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import '../App.css';
import {withAuthorisation} from "../components/AuthWrapper"

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

function VotingEventList() {
	const [voting_events, setVotingEvents] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    fetch('/voting-events').then(response =>
      response.json().then(data => {
				setVotingEvents(data);
      })
    );
  }, [])

	return(
			<div style={{ height: 300, width: '100%' }}>
        <h1>Voting Events</h1>
        <Link to={"/voting_events/create/"}>
          <Button variant="contained" color="primary">
            Create New Event
          </Button>
        </Link>
        <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Event Name</StyledTableCell>
              <StyledTableCell align="right">Year</StyledTableCell>
              <StyledTableCell align="right">Vote Start Date</StyledTableCell>
              <StyledTableCell align="right">Vote End Date</StyledTableCell>
              <StyledTableCell align="right">View Event</StyledTableCell>
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

export default withAuthorisation(VotingEventList, "commissioner")
