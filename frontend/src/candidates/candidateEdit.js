import React, {Component, useState, useEffect} from 'react';
import NavigationTopBar from '../navigation/NavigationTopBar'
import {Route, withRouter, Switch, useParams} from "react-router-dom";
import '../App.css';
import CandidateForm from "./candidateForm"
import {withAuthorisation} from "../components/AuthWrapper"
import { get_candidate } from '../utils/API'

function CandidateEdit(props) {
  const id = props.match.params.id;
  const [candidate, setCandidate] = useState('');

  useEffect(() => {
    if(id) {
      async function fetchData() {
        const response = await get_candidate(id);
        setCandidate(response);
      }

      fetchData();
    }
  }, [])

  return (
    <CandidateForm candidate={candidate} candidate_id={id} />
  )
}

export default withAuthorisation(CandidateEdit, "commissioner")
