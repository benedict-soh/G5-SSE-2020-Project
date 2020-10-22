import React from 'react';
import {Link} from "react-router-dom";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Button,Select,MenuItem } from '@material-ui/core';

export default function VotingEventRows({voting_events }){
  var date;
  var day;
  var mon;
  var year;
  var vstart;
  var vend;
  return (
    <Select>
      labelId="v_event_id-label"
      id="v_event_id"
      value={age}
      onChange={(event) => setEventID(event.target.value)}
    >
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
      return (
        <MenuItem value={row.id}>{row.event_name} ({row.year})</MenuItem>
      )
    })}
    </Select>
  )
};
