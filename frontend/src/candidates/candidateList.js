import React, {Component, useEffect, useState} from 'react';
import NavigationTopBar from '../navigation/NavigationTopBar'
import {Route, withRouter, Switch, Link} from "react-router-dom";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import CandidateRows from '../components/candidate_rows'
import Button from '@material-ui/core/Button';
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

export default function CandidateList(props) {
  const id = props.match.params.id;
	const [candidates, setCandidates] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    fetch('/candidates?v_event_id='+id).then(response =>
      response.json().then(data => {
				setCandidates(data);
      })
    );
  }, [])

	return(
			<div style={{ height: 300, width: '100%' }}>
        <h1>Candidates</h1>
        <Link to={"/voting_events/"+id}>
          <Button variant="contained">
            Back to Event
          </Button>
        </Link>
        <Link to={"/candidates/create/"+id}>
          <Button variant="contained" color="primary">
            Create New Candidate
          </Button>
        </Link>
        <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Candidate Name</StyledTableCell>
              <StyledTableCell>Candidate Party</StyledTableCell>
              <StyledTableCell align="center">Voting Event</StyledTableCell>
              <StyledTableCell align="right">Excluded</StyledTableCell>
              <StyledTableCell align="right">View Candidate</StyledTableCell>
              <StyledTableCell align="right">Edit Candidate</StyledTableCell>
              <StyledTableCell align="right">Delete Candidate</StyledTableCell>
            </TableRow>
          </TableHead>
          <CandidateRows candidates={candidates} />
        </Table>
      </TableContainer>
    </div>
		);
}
