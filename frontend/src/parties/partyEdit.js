import React, {Component, useState, useEffect} from 'react';
import NavigationTopBar from '../navigation/NavigationTopBar'
import {Route, withRouter, Switch, useParams} from "react-router-dom";
import '../App.css';
import PartyForm from "./partyForm"
import {withAuthorisation} from "../components/AuthWrapper"
import { get_party } from '../utils/API'

function PartyEdit(props) {
  const id = props.match.params.id;
  const [party, setParty] = useState('');

  useEffect(() => {
    if(id) {
      async function fetchData() {
        const response = await get_party(id);
        setParty(response);
      }

      fetchData();
    }
  }, [])

  return (
    <PartyForm party={party} party_id={id} />
  )
}

export default withAuthorisation(PartyEdit, "commissioner")
