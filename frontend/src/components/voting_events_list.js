import React from 'react';
import {Link} from "react-router-dom";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { FormControl } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';


const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 20,
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

export default function VotingEventRows(voting_events) {
  const classes = useStyles();
  var date;
  var day;
  var mon;
  var year;
  var vstart;
  var vend;
  return (
    <TableBody>
    {voting_events.map(voting_event => {
      date = new Date(voting_event.vote_start);
      day = date.getDate();
      mon = date.getMonth() + 1;
      year = date.getFullYear();
      vstart = day + "/" + mon + "/" + year;
      date = new Date(voting_event.vote_end);
      day = date.getDate();
      mon = date.getMonth() + 1;
      year = date.getFullYear();
      vend = day + "/" + mon + "/" + year;
      return (
        <div><p>{voting_event.event_name} ({voting_event.year}): {vstart} - {vend}</p>
        <Link to={"/voting_events/update/"+voting_event.id}><button>Edit</button></Link>
        <button type="button"
        onClick={async() => {
          const response = await fetch("/voting-events/"+voting_event.id+"/delete", {
            method: "DELETE"
          });
          if(response.ok) {
            console.log("Deleted event");
            window.location.replace("/voting_events");
          } else {
            console.log("Didnt delete event");
          }
        }}>Delete</button></div>
      );
    })}
    </TableBody>
  )
};

// <div>
// {voting_events.map(voting_event => {
//   date = new Date(voting_event.vote_start);
//   day = date.getDate();
//   mon = date.getMonth() + 1;
//   year = date.getFullYear();
//   vstart = day + "/" + mon + "/" + year;
//   date = new Date(voting_event.vote_end);
//   day = date.getDate();
//   mon = date.getMonth() + 1;
//   year = date.getFullYear();
//   vend = day + "/" + mon + "/" + year;
//   return (
//     <div><p>{voting_event.event_name} ({voting_event.year}): {vstart} - {vend}</p>
//     <Link to={"/voting_events/update/"+voting_event.id}><button>Edit</button></Link>
//     <button type="button"
//     onClick={async() => {
//       const response = await fetch("/voting-events/"+voting_event.id+"/delete", {
//         method: "DELETE"
//       });
//       if(response.ok) {
//         console.log("Deleted event");
//         window.location.replace("/voting_events");
//       } else {
//         console.log("Didnt delete event");
//       }
//     }}>Delete</button></div>
//   );
// })}
// </div>
