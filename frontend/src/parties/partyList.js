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
import {withAuthorisation} from "../components/AuthWrapper"
import { get_parties } from '../utils/API'

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

function PartyList(props) {
  const id = props.match.params.id;
	const [parties, setParties] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    async function fetchData() {
      const data = await get_parties(id);
      var partyArr = {};
      partyArr[null] = "No Party";
      for(var i=0;i<data.length;i++){
        partyArr[data[i].id] = data[i].party_name;
      }
      setParties(data);
    }

    fetchData();
  }, [])

	return(
			<div style={{ height: 300, width: '100%' }}>
        <h1>Parties</h1>
        <Link to={"/voting_events/"+id}>
          <Button variant="contained">
            Back to Event
          </Button>
        </Link>
        <Link to={"/parties/create/"+id}>
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

export default withAuthorisation(PartyList, "commissioner")
