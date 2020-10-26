import React, {Component, useState, useEffect} from 'react';
import NavigationTopBar from '../navigation/NavigationTopBar'
import {Route, withRouter, Switch, useParams} from "react-router-dom";
import '../App.css';
import PartyForm from "./partyForm"

export default function PartyEdit(props) {
  const id = props.match.params.id;
  const [party, setParty] = useState('');

  useEffect(() => {
    if(id) {
      fetch('/parties/'+id).then(response =>
        response.json().then(data => {
          console.log(data);
          console.log("set party");
          setParty(data);
        })
      );
    }
  }, [])

  return (
    <PartyForm party={party} party_id={id} />
  )
}
