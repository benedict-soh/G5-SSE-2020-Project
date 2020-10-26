import React, {useEffect} from 'react';
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

export default function VotingEventRows({voting_events,voter}){

  var date;
  var day;
  var mon;
  var year;
  var vstart;
  var vend;
  return (
    <TableBody>
    {voting_events.map((row) => {
      date = new Date(row.vote_start);
      day = date.getDate();
      mon = date.getMonth() + 1;
      year = date.getFullYear();
      vstart = day + "/" + mon + "/" + year;
      date = new Date(row.vote_end);
      day = date.getDate();
      mon = date.getMonth() + 1;
      year = date.getFullYear();
      vend = day + "/" + mon + "/" + year;
      if(voter=="yes")
      return (
      <StyledTableRow key={row.event_name}>
        <StyledTableCell component="th" scope="row">
          {row.event_name}
        </StyledTableCell>
        <StyledTableCell align="right">{row.year}</StyledTableCell>
        <StyledTableCell align="right">{vstart}</StyledTableCell>
        <StyledTableCell align="right">{vend}</StyledTableCell>
        <StyledTableCell align="right">
          <Link to={"/vote/"+row.id}>
            <Button variant="contained">
              View
            </Button>
          </Link>
        </StyledTableCell>
      </StyledTableRow>
      )
      else
      return (
      <StyledTableRow key={row.event_name}>
        <StyledTableCell component="th" scope="row">
          {row.event_name}
        </StyledTableCell>
        <StyledTableCell align="right">{row.year}</StyledTableCell>
        <StyledTableCell align="right">{vstart}</StyledTableCell>
        <StyledTableCell align="right">{vend}</StyledTableCell>
        <StyledTableCell align="right">
          <Link to={"/voting_events/"+row.id}>
            <Button variant="contained">
              View
            </Button>
          </Link>
        </StyledTableCell>
        <StyledTableCell align="right">
          <Link to={"/voting_events/update/"+row.id}>
            <Button variant="contained" color="primary">
              Edit
            </Button>
          </Link>
        </StyledTableCell>
        <StyledTableCell align="right">
          <Button variant="contained"
            color="secondary"
            onClick={async() => {
              const response = await fetch("/voting-events/"+row.id+"/delete", {
          			method: "DELETE"
          		});
          		if(response.ok) {
          			console.log("Deleted event");
          			window.location.replace("/voting_events");
          		} else {
          			console.log("Didnt delete event");
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
