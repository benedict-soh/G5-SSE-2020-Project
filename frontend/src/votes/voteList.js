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
import { get_events_open, get_events } from '../utils/API'

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

function VoteList(props) {
  const [voting_events, setVotingEvents] = useState([]);
  const [allowed_events, setAllowedEvents] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    async function fetchData() {
      const response = await get_events();
      setVotingEvents(response);
    }

    fetchData();
  }, [])

  useEffect(() => {
    async function fetchData() {
      const response = await get_events_open();
      setAllowedEvents(response.v_event_id_list);
    }

    fetchData();
  }, [])

	return(
			<div style={{ height: 300, width: '100%' }}>
        <h1>Voting Events</h1>
        <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Event Name</StyledTableCell>
              <StyledTableCell align="right">Year</StyledTableCell>
              <StyledTableCell align="right">Vote Start Date</StyledTableCell>
              <StyledTableCell align="right">Vote End Date</StyledTableCell>
              <StyledTableCell align="right">Vote</StyledTableCell>
            </TableRow>
          </TableHead>
          <VotingEventRows voting_events={voting_events} allowed_events={allowed_events} voter="yes" />
        </Table>
      </TableContainer>
    </div>
		);
}

export default withAuthorisation(VoteList, "voter")
