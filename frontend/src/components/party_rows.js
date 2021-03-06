import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { get_events, delete_party } from '../utils/API'

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

export default function PartyRows({parties }){
  const [voting_events, setVotingEvents] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await get_events();
      var eventArr = {};
      for(var i=0;i<data.length;i++){
        eventArr[data[i].id] = data[i].event_name + ' (' + data[i].year + ')';
      }
      setVotingEvents(eventArr);
    }

    fetchData();
  }, [])

  return (
    <TableBody>
    {parties.map((row) => {
      return (
      <StyledTableRow key={row.party_name}>
        <StyledTableCell component="th" scope="row">
          {row.party_name}
        </StyledTableCell>
        <StyledTableCell align="center">{voting_events[row.v_event_id]}</StyledTableCell>
        <StyledTableCell align="right">
          <Link to={"/parties/"+row.id}>
            <Button variant="contained">
              View
            </Button>
          </Link>
        </StyledTableCell>
        <StyledTableCell align="right">
          <Link to={"/parties/update/"+row.id}>
            <Button variant="contained" color="primary">
              Edit
            </Button>
          </Link>
        </StyledTableCell>
        <StyledTableCell align="right">
          <Button variant="contained"
            color="secondary"
            onClick={async() => {
              const response = await delete_party(row.id);
          		if(response.ok) {
          			console.log("Deleted party");
          			window.location.replace("/voting_events/"+row.v_event_id+"/parties");
          		} else {
          			console.log("Didnt delete party");
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
