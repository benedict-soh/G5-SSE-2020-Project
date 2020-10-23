import React, {Component, useEffect, useState} from 'react';
import NavigationTopBar from '../navigation/NavigationTopBar'
import {Route, withRouter, Switch, Link} from "react-router-dom";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import PartyRows from '../components/party_rows'
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

export default function PartyList() {
	const [parties, setParties] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    fetch('/parties').then(response =>
      response.json().then(data => {
				setParties(data);
      })
    );
  }, [])

	return(
			<div style={{ height: 300, width: '100%' }}>
        <Link to={"/parties/create/"}>
          <Button variant="contained" color="primary">
            Create New Party
          </Button>
        </Link>
        <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Party Name</StyledTableCell>
              <StyledTableCell align="center">Voting Event</StyledTableCell>
              <StyledTableCell align="right">View Party</StyledTableCell>
              <StyledTableCell align="right">Edit Party</StyledTableCell>
              <StyledTableCell align="right">Delete Party</StyledTableCell>
            </TableRow>
          </TableHead>
          <PartyRows parties={parties} />
        </Table>
      </TableContainer>
    </div>
		);
}