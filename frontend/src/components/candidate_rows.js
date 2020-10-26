import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';


const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 16,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

const excludeArr = {0: "Included", 1: "Excluded"};

export default function CandidateRows({candidates }){
  const [voting_events, setVotingEvents] = useState([]);
  const [parties, setParties] = useState([]);

  useEffect(() => {
    fetch('/voting-events').then(response =>
      response.json().then(data => {
        var eventArr = {};
        for(var i=0;i<data.length;i++){
          eventArr[data[i].id] = data[i].event_name + ' (' + data[i].year + ')';
        }
				setVotingEvents(eventArr);
      })
    );
  }, [])

  useEffect(() => {
    fetch('/parties').then(response =>
      response.json().then(data => {
        var partyArr = {};
        partyArr[null] = "No Party";
        for(var i=0;i<data.length;i++){
          partyArr[data[i].id] = data[i].party_name;
        }
				setParties(partyArr);
      })
    );
  }, [])

  return (
    <TableBody>
    {candidates.map((row) => {
      return (
      <StyledTableRow key={row.candidate_name}>
        <StyledTableCell component="th" scope="row">
          {row.candidate_name}
        </StyledTableCell>
        <StyledTableCell>{parties[row.party_id]}</StyledTableCell>
        <StyledTableCell align="center">{voting_events[row.v_event_id]}</StyledTableCell>
        <StyledTableCell align="right">{excludeArr[row.exclude]}</StyledTableCell>
        <StyledTableCell align="right">
          <Link to={"/candidates/"+row.id}>
            <Button variant="contained">
              View
            </Button>
          </Link>
        </StyledTableCell>
        <StyledTableCell align="right">
          <Link to={"/candidates/update/"+row.id}>
            <Button variant="contained" color="primary">
              Edit
            </Button>
          </Link>
        </StyledTableCell>
        <StyledTableCell align="right">
          <Button variant="contained"
            color="secondary"
            onClick={async() => {
              const response = await fetch("/candidates/"+row.id+"/delete", {
          			method: "DELETE"
          		});
          		if(response.ok) {
          			console.log("Deleted candidate");
          			window.location.replace("/candidates");
          		} else {
          			console.log("Didnt delete candidate");
          		}
            }}>
              Delete
          </Button>
        </StyledTableCell>
      </StyledTableRow>
      )
    })}
    </TableBody>
  )
};
